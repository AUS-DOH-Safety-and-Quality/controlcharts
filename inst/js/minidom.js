var minidom = (function (exports) {
    'use strict';

    const XHTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
    const XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
    const XLINK_NAMESPACE = "http://www.w3.org/1999/xlink";
    const XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
    const DISCONNECTED = 1;
    const PRECEDING = 2;
    const FOLLOWING = 4;
    const CONTAINS = 8;
    const CONTAINED_BY = 16;
    const IMPLEMENTATION_SPECIFIC = 32;
    let nextNodeId = 0;
    function escapeText(value) {
        return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function escapeAttr(value) {
        return escapeText(String(value)).replace(/"/g, "&quot;");
    }
    function classNames(element) {
        const value = (element.getAttribute("class") ?? "").trim();
        return value ? value.split(/\s+/) : [];
    }
    class ClassList {
        constructor(element) {
            this.element = element;
        }
        add(className) {
            const classes = classNames(this.element);
            if (classes.indexOf(className) === -1) {
                classes.push(className);
                this.element.setAttribute("class", classes.join(" "));
            }
        }
        remove(className) {
            const classes = classNames(this.element);
            const index = classes.indexOf(className);
            if (index !== -1) {
                classes.splice(index, 1);
                this.element.setAttribute("class", classes.join(" "));
            }
        }
        contains(className) {
            return classNames(this.element).indexOf(className) !== -1;
        }
    }
    class MiniStyle {
        constructor(element) {
            this.styles = new Map();
            this.element = element;
        }
        setProperty(name, value, priority) {
            if (value === null || value === undefined || value === "") {
                this.removeProperty(name);
                return;
            }
            const level = (priority ?? "").toLowerCase();
            if (level !== "" && level !== "important") {
                return;
            }
            this.styles.set(name, { value: String(value), priority: level });
            this.sync();
        }
        getPropertyValue(name) {
            return this.styles.get(name)?.value ?? "";
        }
        getPropertyPriority(name) {
            return this.styles.get(name)?.priority ?? "";
        }
        removeProperty(name) {
            const value = this.getPropertyValue(name);
            this.styles.delete(name);
            if (value !== "") {
                this.sync();
            }
            return value;
        }
        clear() {
            this.styles.clear();
        }
        sync() {
            this.element.attributeMap.set("style", { namespaceURI: null, localName: "style", value: this });
        }
        toString() {
            return this.cssText;
        }
        parse(text) {
            this.styles.clear();
            let declaration = "";
            let quote = "";
            let depth = 0;
            for (let i = 0; i <= text.length; i++) {
                const char = text.charAt(i);
                if (char === "\\") {
                    i++;
                    declaration += char + text.charAt(i);
                    continue;
                }
                if (quote) {
                    declaration += char;
                    if (char === quote) {
                        quote = "";
                    }
                    continue;
                }
                if (char === "/" && text.charAt(i + 1) === "*") {
                    const end = text.indexOf("*/", i + 2);
                    if (end === -1) {
                        break;
                    }
                    i = end + 1;
                    continue;
                }
                if (char === "\"" || char === "'") {
                    quote = char;
                }
                else if (char === "(" || char === "[") {
                    depth++;
                }
                else if (char === ")" || char === "]") {
                    depth--;
                }
                if (i === text.length || (char === ";" && depth === 0)) {
                    const colon = declaration.indexOf(":");
                    if (colon !== -1) {
                        let name = declaration.slice(0, colon).trim();
                        if (!name.startsWith("--")) {
                            name = name.toLowerCase();
                        }
                        const value = declaration.slice(colon + 1).trim();
                        const priority = value.search(/\s*!important\s*$/i);
                        if (name && value && (priority !== -1 || this.getPropertyPriority(name) !== "important")) {
                            this.styles.set(name, {
                                value: priority === -1 ? value : value.slice(0, priority),
                                priority: priority === -1 ? "" : "important"
                            });
                        }
                    }
                    declaration = "";
                }
                else {
                    declaration += char;
                }
            }
        }
        get cssText() {
            const styles = Array.from(this.styles);
            let text = "";
            for (let i = 0; i < styles.length; i++) {
                const style = styles[i][1];
                if (i > 0) {
                    text += ";";
                }
                text += styles[i][0] + ":" + style.value;
                if (style.priority) {
                    text += " !important";
                }
            }
            return text;
        }
        set cssText(value) {
            this.parse(String(value));
            this.sync();
        }
    }
    function clearChildren(element) {
        for (let i = 0; i < element.childNodes.length; i++) {
            const child = element.childNodes[i];
            child.parentNode = null;
            child.nextSibling = null;
            child.previousSibling = null;
        }
        element.childNodes.length = 0;
        element.firstChild = null;
        element.lastChild = null;
    }
    function parseSelector(selector) {
        const groups = selector.trim().split(/\s*,\s*/);
        const selectors = new Array(groups.length);
        for (let i = 0; i < groups.length; i++) {
            const parts = groups[i].split(/\s+/);
            const compounds = new Array(parts.length);
            for (let j = 0; j < parts.length; j++) {
                compounds[j] = parts[j].split(/(?=[.#])/);
            }
            selectors[i] = compounds;
        }
        return selectors;
    }
    function matchesSimple(element, parts) {
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (part.charAt(0) === ".") {
                if (!element.classList.contains(part.slice(1))) {
                    return false;
                }
            }
            else if (part.charAt(0) === "#") {
                if (element.getAttribute("id") !== part.slice(1)) {
                    return false;
                }
            }
            else if (part !== "*" && element.tagName !== part) {
                return false;
            }
        }
        return true;
    }
    function matches(element, selectors) {
        for (let i = 0; i < selectors.length; i++) {
            const parts = selectors[i];
            if (!matchesSimple(element, parts[parts.length - 1])) {
                continue;
            }
            let node = element.parentNode;
            let j = parts.length - 2;
            while (j >= 0 && node !== null && node.nodeType === 1) {
                if (matchesSimple(node, parts[j])) {
                    j--;
                }
                node = node.parentNode;
            }
            if (j < 0) {
                return true;
            }
        }
        return false;
    }
    function query(element, selector, firstOnly) {
        const results = [];
        const selectors = parseSelector(selector);
        function traverse(node) {
            if (node.nodeType === 1 && matches(node, selectors)) {
                results.push(node);
                if (firstOnly) {
                    return true;
                }
            }
            for (let i = 0; i < node.childNodes.length; i++) {
                if (traverse(node.childNodes[i])) {
                    return true;
                }
            }
            return false;
        }
        for (let i = 0; i < element.childNodes.length; i++) {
            if (traverse(element.childNodes[i])) {
                break;
            }
        }
        return results;
    }
    class MiniElement {
        constructor(tagName, namespaceURI, ownerDocument) {
            this.serial = nextNodeId++;
            this.nodeType = 1;
            this.parentNode = null;
            this.childNodes = [];
            this.nextSibling = null;
            this.previousSibling = null;
            this.firstChild = null;
            this.lastChild = null;
            this.attributeMap = new Map();
            this.classes = null;
            this.tagName = tagName;
            this.nodeName = tagName;
            this.namespaceURI = namespaceURI;
            this.ownerDocument = ownerDocument;
            this.style = new MiniStyle(this);
        }
        get classList() {
            this.classes ?? (this.classes = new ClassList(this));
            return this.classes;
        }
        get className() {
            return this.getAttribute("class") ?? "";
        }
        set className(value) {
            this.setAttribute("class", value);
        }
        get parentElement() {
            return this.parentNode !== null && this.parentNode.nodeType === 1 ? this.parentNode : null;
        }
        get children() {
            const children = [];
            for (let i = 0; i < this.childNodes.length; i++) {
                const child = this.childNodes[i];
                if (child.nodeType === 1) {
                    children.push(child);
                }
            }
            return children;
        }
        get firstElementChild() {
            for (let i = 0; i < this.childNodes.length; i++) {
                const child = this.childNodes[i];
                if (child.nodeType === 1) {
                    return child;
                }
            }
            return null;
        }
        get innerHTML() {
            let html = "";
            for (let i = 0; i < this.childNodes.length; i++) {
                const child = this.childNodes[i];
                if (child.nodeType === 3) {
                    html += escapeText(child.nodeValue);
                }
                else if (child.nodeType === 1) {
                    html += "<" + child.tagName;
                    const attributes = Array.from(child.attributeMap);
                    const declared = new Set();
                    for (let j = 0; j < attributes.length; j++) {
                        let name = attributes[j][0];
                        const attribute = attributes[j][1];
                        if (attribute.namespaceURI !== null && attribute.namespaceURI !== XMLNS_NAMESPACE) {
                            const colon = name.indexOf(":");
                            let prefix = name.slice(0, colon);
                            if (colon === -1) {
                                prefix = `ns${j}`;
                                if (attribute.namespaceURI === XLINK_NAMESPACE) {
                                    prefix = "xlink";
                                }
                                else if (attribute.namespaceURI === XML_NAMESPACE) {
                                    prefix = "xml";
                                }
                            }
                            name = prefix + ":" + attribute.localName;
                            if (!declared.has(prefix) && !child.hasAttribute("xmlns:" + prefix)) {
                                html += " xmlns:" + prefix + "=\"" + escapeAttr(attribute.namespaceURI) + "\"";
                                declared.add(prefix);
                            }
                        }
                        html += " " + name + "=\"" + escapeAttr(attribute.value) + "\"";
                    }
                    if (child.childNodes.length === 0) {
                        html += " />";
                    }
                    else {
                        html += ">" + child.innerHTML + "</" + child.tagName + ">";
                    }
                }
            }
            return html;
        }
        set innerHTML(value) {
            if (value !== "" && value !== null) {
                throw new Error("HTML parsing is not supported");
            }
            clearChildren(this);
        }
        get textContent() {
            let text = "";
            for (let i = 0; i < this.childNodes.length; i++) {
                const child = this.childNodes[i];
                if (child.nodeType === 3) {
                    text += child.nodeValue;
                }
                else if (child.nodeType === 1) {
                    text += child.textContent;
                }
            }
            return text;
        }
        set textContent(value) {
            clearChildren(this);
            if (value !== null && value !== undefined && value !== "") {
                this.appendChild(new MiniText(String(value), this.ownerDocument));
            }
        }
        get ownerSVGElement() {
            let node = this.parentNode;
            while (node !== null) {
                if (node.tagName === "svg") {
                    return node;
                }
                node = node.parentNode;
            }
            return null;
        }
        appendChild(child) {
            child.parentNode?.removeChild(child);
            child.parentNode = this;
            child.nextSibling = null;
            child.previousSibling = this.lastChild;
            if (this.lastChild !== null) {
                this.lastChild.nextSibling = child;
            }
            this.lastChild = child;
            this.firstChild ?? (this.firstChild = child);
            this.childNodes.push(child);
            return child;
        }
        replaceChildren(...nodes) {
            clearChildren(this);
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                this.appendChild(typeof node === "string" ? new MiniText(node, this.ownerDocument) : node);
            }
        }
        removeChild(child) {
            const index = this.childNodes.indexOf(child);
            if (index === -1) {
                throw new Error("Node not found");
            }
            this.childNodes.splice(index, 1);
            if (child.previousSibling !== null) {
                child.previousSibling.nextSibling = child.nextSibling;
            }
            else {
                this.firstChild = child.nextSibling;
            }
            if (child.nextSibling !== null) {
                child.nextSibling.previousSibling = child.previousSibling;
            }
            else {
                this.lastChild = child.previousSibling;
            }
            child.parentNode = null;
            child.nextSibling = null;
            child.previousSibling = null;
            return child;
        }
        insertBefore(newNode, refNode) {
            if (refNode === null || refNode === undefined) {
                return this.appendChild(newNode);
            }
            if (refNode.parentNode !== this) {
                throw new Error("Reference node not found");
            }
            if (newNode === refNode) {
                return newNode;
            }
            newNode.parentNode?.removeChild(newNode);
            newNode.parentNode = this;
            newNode.nextSibling = refNode;
            newNode.previousSibling = refNode.previousSibling;
            if (refNode.previousSibling !== null) {
                refNode.previousSibling.nextSibling = newNode;
            }
            else {
                this.firstChild = newNode;
            }
            refNode.previousSibling = newNode;
            this.childNodes.splice(this.childNodes.indexOf(refNode), 0, newNode);
            return newNode;
        }
        setAttribute(name, value) {
            this.writeAttribute(name, String(value));
        }
        setAttributeNS(namespaceURI, qualifiedName, value) {
            const localName = qualifiedName.slice(qualifiedName.indexOf(":") + 1);
            const attribute = this.writeAttribute(this.attributeNameNS(namespaceURI, localName) ?? qualifiedName, String(value));
            attribute.namespaceURI = namespaceURI || null;
            attribute.localName = localName;
        }
        getAttributeNS(namespaceURI, localName) {
            const name = this.attributeNameNS(namespaceURI, localName);
            return name === null ? null : this.getAttribute(name);
        }
        removeAttributeNS(namespaceURI, localName) {
            const name = this.attributeNameNS(namespaceURI, localName);
            if (name !== null) {
                this.removeAttribute(name);
            }
        }
        getAttribute(name) {
            const attribute = this.attributeMap.get(name);
            return attribute === undefined ? null : String(attribute.value);
        }
        removeAttribute(name) {
            this.attributeMap.delete(name);
            if (name === "style") {
                this.style.clear();
            }
        }
        hasAttribute(name) {
            return this.attributeMap.has(name);
        }
        querySelector(selector) {
            const found = query(this, selector, true);
            return found.length > 0 ? found[0] : null;
        }
        querySelectorAll(selector) {
            return query(this, selector, false);
        }
        matches(selector) {
            return matches(this, parseSelector(selector));
        }
        cloneNode(deep) {
            const clone = new MiniElement(this.tagName, this.namespaceURI, this.ownerDocument);
            const attributes = Array.from(this.attributeMap);
            for (let i = 0; i < attributes.length; i++) {
                clone.setAttributeNS(attributes[i][1].namespaceURI, attributes[i][0], attributes[i][1].value);
            }
            if (deep === true) {
                for (let i = 0; i < this.childNodes.length; i++) {
                    clone.appendChild(this.childNodes[i].cloneNode(true));
                }
            }
            return clone;
        }
        compareDocumentPosition(other) {
            if (this === other) {
                return 0;
            }
            if (this.parentNode !== null && this.parentNode === other.parentNode) {
                const siblings = this.parentNode.childNodes;
                return siblings.indexOf(this) < siblings.indexOf(other) ? FOLLOWING : PRECEDING;
            }
            const ancestors = [this];
            const otherAncestors = [other];
            let node = this.parentNode;
            let otherNode = other.parentNode;
            while (node !== null || otherNode !== null) {
                if (node !== null) {
                    ancestors.push(node);
                    node = node.parentNode;
                }
                if (otherNode !== null) {
                    otherAncestors.push(otherNode);
                    otherNode = otherNode.parentNode;
                }
            }
            let i = ancestors.length - 1;
            let j = otherAncestors.length - 1;
            if (ancestors[i] !== otherAncestors[j]) {
                return DISCONNECTED | IMPLEMENTATION_SPECIFIC | (this.serial < other.serial ? FOLLOWING : PRECEDING);
            }
            while (i >= 0 && j >= 0 && ancestors[i] === otherAncestors[j]) {
                i--;
                j--;
            }
            if (i < 0) {
                return CONTAINED_BY | FOLLOWING;
            }
            if (j < 0) {
                return CONTAINS | PRECEDING;
            }
            const siblings = ancestors[i + 1].childNodes;
            return siblings.indexOf(ancestors[i]) < siblings.indexOf(otherAncestors[j]) ? FOLLOWING : PRECEDING;
        }
        contains(other) {
            let node = other;
            while (node !== null) {
                if (node === this) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }
        addEventListener() {
            return;
        }
        removeEventListener() {
            return;
        }
        dispatchEvent() {
            return true;
        }
        getBoundingClientRect() {
            return { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 };
        }
        writeAttribute(name, value) {
            let attribute = this.attributeMap.get(name);
            if (attribute === undefined) {
                attribute = { namespaceURI: null, localName: name, value };
                this.attributeMap.set(name, attribute);
            }
            else {
                attribute.value = value;
            }
            if (name === "style") {
                this.style.parse(value);
            }
            return attribute;
        }
        attributeNameNS(namespaceURI, localName) {
            const attributes = Array.from(this.attributeMap);
            for (let i = 0; i < attributes.length; i++) {
                const attribute = attributes[i][1];
                if (attribute.namespaceURI === (namespaceURI || null) && attribute.localName === localName) {
                    return attributes[i][0];
                }
            }
            return null;
        }
    }
    class MiniText {
        constructor(text, ownerDocument) {
            this.serial = nextNodeId++;
            this.nodeType = 3;
            this.nodeName = "#text";
            this.parentNode = null;
            this.nextSibling = null;
            this.previousSibling = null;
            this.childNodes = [];
            this.nodeValue = text;
            this.ownerDocument = ownerDocument;
        }
        cloneNode() {
            return new MiniText(this.nodeValue, this.ownerDocument);
        }
    }
    class MiniDocument extends MiniElement {
        constructor() {
            super("#document", null, null);
            this.nodeType = 9;
            this.view = null;
            this.ownerDocument = this;
            this.documentElement = this.createElement("html");
            this.appendChild(this.documentElement);
            this.head = this.createElement("head");
            this.body = this.createElement("body");
            this.documentElement.appendChild(this.head);
            this.documentElement.appendChild(this.body);
        }
        get defaultView() {
            return this.view;
        }
        createElement(tagName) {
            return new MiniElement(tagName, XHTML_NAMESPACE, this);
        }
        createElementNS(namespaceURI, qualifiedName) {
            return new MiniElement(qualifiedName, namespaceURI, this);
        }
        createTextNode(text) {
            return new MiniText(String(text), this);
        }
    }
    class MiniWindow {
        constructor(document) {
            this.defaultView = this;
            this.document = document;
            document.view = this;
        }
    }
    function dummyDOM() {
        const document = new MiniDocument();
        return { document, window: new MiniWindow(document) };
    }

    exports.dummyDOM = dummyDOM;

    return exports;

})({});
