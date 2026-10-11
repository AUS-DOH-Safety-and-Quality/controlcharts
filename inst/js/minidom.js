// Minimal SVG DOM for QuickJSR; no HTML parsing, CSS cascade, or layout.
var minidom = (function() {
  'use strict';

  var XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
  let nextNodeId = 0;

  function escapeText(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeAttr(value) {
    return escapeText(value).replace(/"/g, '&quot;');
  }

  function classNames(element) {
    const value = (element.getAttribute('class') || '').trim();
    return value ? value.split(/\s+/) : [];
  }

  function ClassList(element) {
    this._element = element;
  }

  ClassList.prototype.add = function(className) {
    var classes = classNames(this._element);
    if (classes.indexOf(className) === -1) {
      classes.push(className);
      this._element.setAttribute('class', classes.join(' '));
    }
  };

  ClassList.prototype.remove = function(className) {
    var classes = classNames(this._element);
    var index = classes.indexOf(className);
    if (index !== -1) {
      classes.splice(index, 1);
      this._element.setAttribute('class', classes.join(' '));
    }
  };

  ClassList.prototype.contains = function(className) {
    var classes = classNames(this._element);
    return classes.indexOf(className) !== -1;
  };

  function CSSStyleDeclaration(element) {
    this._element = element;
    this._styles = Object.create(null);
  }

  CSSStyleDeclaration.prototype.setProperty = function(name, value, priority) {
    if (value === null || value === undefined || value === '') {
      this.removeProperty(name);
      return;
    }
    priority = String(priority || '').toLowerCase();
    if (priority !== '' && priority !== 'important') {
      return;
    }
    this._styles[name] = {value: String(value), priority: priority};
    this._sync();
  };

  CSSStyleDeclaration.prototype.getPropertyValue = function(name) {
    return this._styles[name]?.value ?? '';
  };

  CSSStyleDeclaration.prototype.getPropertyPriority = function(name) {
    return this._styles[name]?.priority ?? '';
  };

  CSSStyleDeclaration.prototype.removeProperty = function(name) {
    const value = this.getPropertyValue(name);
    delete this._styles[name];
    if (value !== '') {
      this._sync();
    }
    return value;
  };

  CSSStyleDeclaration.prototype._sync = function() {
    this._element._attributes.style = {namespaceURI: null, localName: 'style', value: this};
  };

  CSSStyleDeclaration.prototype.toString = function() {
    return this.cssText;
  };

  CSSStyleDeclaration.prototype._parse = function(text) {
    this._styles = Object.create(null);
    let declaration = '';
    let quote = '';
    let depth = 0;
    for (let i = 0; i <= text.length; i++) {
      const char = text[i];
      if (char === '\\') {
        declaration += char + (text[++i] || '');
        continue;
      }
      if (quote) {
        declaration += char;
        if (char === quote) {
          quote = '';
        }
        continue;
      }
      if (char === '/' && text[i + 1] === '*') {
        const end = text.indexOf('*/', i + 2);
        if (end === -1) {
          break;
        }
        i = end + 1;
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
      } else if (char === '(' || char === '[') {
        depth++;
      } else if (char === ')' || char === ']') {
        depth--;
      }
      if (i === text.length || (char === ';' && depth === 0)) {
        const colon = declaration.indexOf(':');
        if (colon !== -1) {
          let name = declaration.slice(0, colon).trim();
          if (!name.startsWith('--')) {
            name = name.toLowerCase();
          }
          const value = declaration.slice(colon + 1).trim();
          const priority = value.search(/\s*!important\s*$/i);
          if (name && value && (priority !== -1 || this.getPropertyPriority(name) !== 'important')) {
            this._styles[name] = {
              value: priority === -1 ? value : value.slice(0, priority),
              priority: priority === -1 ? '' : 'important'
            };
          }
        }
        declaration = '';
      } else {
        declaration += char;
      }
    }
  };

  Object.defineProperty(CSSStyleDeclaration.prototype, 'cssText', {
    get: function() {
      const names = Object.keys(this._styles);
      let text = '';
      for (let i = 0; i < names.length; i++) {
        const style = this._styles[names[i]];
        if (i > 0) {
          text += ';';
        }
        text += names[i] + ':' + style.value;
        if (style.priority) {
          text += ' !important';
        }
      }
      return text;
    },
    set: function(value) {
      this._parse(String(value));
      this._sync();
    }
  });

  function Element(tagName, namespaceURI, ownerDocument) {
    this._id = nextNodeId++;
    this.nodeType = 1; // ELEMENT_NODE
    this.tagName = tagName;
    this.nodeName = tagName;
    this.namespaceURI = namespaceURI || null;
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
    this.childNodes = [];
    this.nextSibling = null;
    this.previousSibling = null;
    this.firstChild = null;
    this.lastChild = null;
    this._attributes = Object.create(null);
    this._classList = null;
    this.style = new CSSStyleDeclaration(this);
  }

  Object.defineProperty(Element.prototype, 'classList', {
    get: function() {
      if (!this._classList) {
        this._classList = new ClassList(this);
      }
      return this._classList;
    }
  });

  Object.defineProperty(Element.prototype, 'className', {
    get: function() {
      return this.getAttribute('class') || '';
    },
    set: function(value) {
      this.setAttribute('class', value);
    }
  });

  Object.defineProperty(Element.prototype, 'children', {
    get: function() {
      const children = [];
      for (let i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i].nodeType === 1) {
          children.push(this.childNodes[i]);
        }
      }
      return children;
    }
  });

  Object.defineProperty(Element.prototype, 'firstElementChild', {
    get: function() {
      for (var i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i].nodeType === 1) {
          return this.childNodes[i];
        }
      }
      return null;
    }
  });

  Object.defineProperty(Element.prototype, 'innerHTML', {
    get: function() {
      var html = '';
      for (var i = 0; i < this.childNodes.length; i++) {
        var child = this.childNodes[i];
        if (child.nodeType === 3) {
          html += escapeText(child.nodeValue);
        } else if (child.nodeType === 1) {
          html += '<' + child.tagName;

          const names = Object.keys(child._attributes);
          const namespaces = Object.create(null);
          for (let j = 0; j < names.length; j++) {
            let name = names[j];
            const attribute = child._attributes[name];
            if (attribute.namespaceURI && attribute.namespaceURI !== 'http://www.w3.org/2000/xmlns/') {
              const colon = name.indexOf(':');
              let prefix = name.slice(0, colon);
              if (colon === -1) {
                prefix = 'ns' + j;
                if (attribute.namespaceURI === 'http://www.w3.org/1999/xlink') {
                  prefix = 'xlink';
                } else if (attribute.namespaceURI === 'http://www.w3.org/XML/1998/namespace') {
                  prefix = 'xml';
                }
              }
              name = prefix + ':' + attribute.localName;
              if (!namespaces[prefix] && !child.hasAttribute('xmlns:' + prefix)) {
                html += ' xmlns:' + prefix + '="' + escapeAttr(attribute.namespaceURI) + '"';
                namespaces[prefix] = true;
              }
            }
            html += ' ' + name + '="' + escapeAttr(attribute.value) + '"';
          }

          if (child.childNodes.length === 0) {
            html += ' />';
          } else {
            html += '>' + child.innerHTML + '</' + child.tagName + '>';
          }
        }
      }
      return html;
    },
    set: function(value) {
      if (value !== '' && value !== null) {
        throw new Error('HTML parsing is not supported');
      }
      clearChildren(this);
    }
  });

  Object.defineProperty(Element.prototype, 'textContent', {
    get: function() {
      var text = '';
      for (var i = 0; i < this.childNodes.length; i++) {
        var child = this.childNodes[i];
        if (child.nodeType === 3) {
          text += child.nodeValue;
        } else if (child.nodeType === 1) {
          text += child.textContent;
        }
      }
      return text;
    },
    set: function(value) {
      clearChildren(this);
      if (value !== null && value !== undefined && value !== '') {
        var textNode = new TextNode(String(value), this.ownerDocument);
        this.appendChild(textNode);
      }
    }
  });

  Object.defineProperty(Element.prototype, 'ownerSVGElement', {
    get: function() {
      var node = this.parentNode;
      while (node) {
        if (node.tagName === 'svg') {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    }
  });

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

  Element.prototype.appendChild = function(child) {
    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }

    child.parentNode = this;
    child.nextSibling = null;
    child.previousSibling = this.lastChild;

    if (this.lastChild) {
      this.lastChild.nextSibling = child;
    }

    this.lastChild = child;

    if (!this.firstChild) {
      this.firstChild = child;
    }

    this.childNodes.push(child);
    return child;
  };

  Element.prototype.removeChild = function(child) {
    var index = this.childNodes.indexOf(child);
    if (index === -1) {
      throw new Error('Node not found');
    }

    this.childNodes.splice(index, 1);

    if (child.previousSibling) {
      child.previousSibling.nextSibling = child.nextSibling;
    } else {
      this.firstChild = child.nextSibling;
    }

    if (child.nextSibling) {
      child.nextSibling.previousSibling = child.previousSibling;
    } else {
      this.lastChild = child.previousSibling;
    }

    child.parentNode = null;
    child.nextSibling = null;
    child.previousSibling = null;

    return child;
  };

  Element.prototype.insertBefore = function(newNode, refNode) {
    if (!refNode) {
      return this.appendChild(newNode);
    }

    if (refNode.parentNode !== this) {
      throw new Error('Reference node not found');
    }
    if (newNode === refNode) {
      return newNode;
    }

    if (newNode.parentNode) {
      newNode.parentNode.removeChild(newNode);
    }

    newNode.parentNode = this;
    newNode.nextSibling = refNode;
    newNode.previousSibling = refNode.previousSibling;

    if (refNode.previousSibling) {
      refNode.previousSibling.nextSibling = newNode;
    } else {
      this.firstChild = newNode;
    }

    refNode.previousSibling = newNode;
    this.childNodes.splice(this.childNodes.indexOf(refNode), 0, newNode);

    return newNode;
  };

  Element.prototype.setAttribute = function(name, value) {
    const attribute = this._attributes[name];
    if (attribute) {
      attribute.value = String(value);
    } else {
      this._attributes[name] = {namespaceURI: null, localName: name, value: String(value)};
    }
    if (name === 'style') {
      this.style._parse(String(value));
    }
  };

  Element.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value) {
    const localName = qualifiedName.slice(qualifiedName.indexOf(':') + 1);
    const name = this._attributeNameNS(namespaceURI, localName) || qualifiedName;
    this.setAttribute(name, value);
    this._attributes[name].namespaceURI = namespaceURI || null;
    this._attributes[name].localName = localName;
  };

  Element.prototype._attributeNameNS = function(namespaceURI, localName) {
    const names = Object.keys(this._attributes);
    for (let i = 0; i < names.length; i++) {
      const attribute = this._attributes[names[i]];
      if (attribute.namespaceURI === (namespaceURI || null) && attribute.localName === localName) {
        return names[i];
      }
    }
    return null;
  };

  Element.prototype.getAttributeNS = function(namespaceURI, localName) {
    const name = this._attributeNameNS(namespaceURI, localName);
    return name === null ? null : this.getAttribute(name);
  };

  Element.prototype.removeAttributeNS = function(namespaceURI, localName) {
    const name = this._attributeNameNS(namespaceURI, localName);
    if (name !== null) {
      this.removeAttribute(name);
    }
  };

  Element.prototype.getAttribute = function(name) {
    const attribute = this._attributes[name];
    return attribute ? String(attribute.value) : null;
  };

  Element.prototype.removeAttribute = function(name) {
    delete this._attributes[name];
    if (name === 'style') {
      this.style._styles = Object.create(null);
    }
  };

  Element.prototype.hasAttribute = function(name) {
    return name in this._attributes;
  };

  Element.prototype.querySelector = function(selector) {
    var matches = query(this, selector, true);
    return matches.length > 0 ? matches[0] : null;
  };

  Element.prototype.querySelectorAll = function(selector) {
    return query(this, selector, false);
  };

  function query(element, selector, firstOnly) {
    var results = [];
    const selectors = parseSelector(selector);

    function traverse(node) {
      if (node.nodeType === 1 && matches(node, selectors)) {
        results.push(node);
        if (firstOnly) {
          return true;
        }
      }
      for (var i = 0; i < node.childNodes.length; i++) {
        if (traverse(node.childNodes[i])) {
          return true;
        }
      }
    }

    for (var i = 0; i < element.childNodes.length; i++) {
      if (traverse(element.childNodes[i])) {
        break;
      }
    }

    return results;
  }

  Element.prototype.matches = function(selector) {
    return matches(this, parseSelector(selector));
  };

  function parseSelector(selector) {
    const groups = selector.trim().split(/\s*,\s*/);
    const selectors = [];
    for (let i = 0; i < groups.length; i++) {
      const parts = groups[i].split(/\s+/);
      for (let j = 0; j < parts.length; j++) {
        parts[j] = parts[j].split(/(?=[.#])/);
      }
      selectors.push(parts);
    }
    return selectors;
  }

  function matches(element, selectors) {
    for (let i = 0; i < selectors.length; i++) {
      const parts = selectors[i];
      if (!matchesSimple(element, parts[parts.length - 1])) {
        continue;
      }
      let node = element.parentNode;
      let j = parts.length - 2;
      while (j >= 0 && node && node.nodeType === 1) {
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

  function matchesSimple(element, parts) {
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.charAt(0) === '.') {
        if (!element.classList.contains(part.slice(1))) {
          return false;
        }
      } else if (part.charAt(0) === '#') {
        if (element.getAttribute('id') !== part.slice(1)) {
          return false;
        }
      } else if (part !== '*' && element.tagName !== part) {
        return false;
      }
    }
    return true;
  }

  Element.prototype.cloneNode = function(deep) {
    var clone = new Element(this.tagName, this.namespaceURI, this.ownerDocument);

    const names = Object.keys(this._attributes);
    for (let i = 0; i < names.length; i++) {
      const attribute = this._attributes[names[i]];
      clone.setAttributeNS(attribute.namespaceURI, names[i], attribute.value);
    }

    if (deep) {
      for (var i = 0; i < this.childNodes.length; i++) {
        clone.appendChild(this.childNodes[i].cloneNode(true));
      }
    }

    return clone;
  };

  Element.prototype.compareDocumentPosition = function(other) {
    if (this === other) {
      return 0;
    }

    if (this.parentNode && this.parentNode === other.parentNode) {
      var children = this.parentNode.childNodes;
      var thisIndex = children.indexOf(this);
      var otherIndex = children.indexOf(other);
      return thisIndex < otherIndex ? 4 : 2; // FOLLOWING or PRECEDING
    }

    const ancestors = [];
    const otherAncestors = [];
    let node = this;
    let otherNode = other;
    while (node || otherNode) {
      if (node) {
        ancestors.push(node);
        node = node.parentNode;
      }
      if (otherNode) {
        otherAncestors.push(otherNode);
        otherNode = otherNode.parentNode;
      }
    }
    let i = ancestors.length - 1;
    let j = otherAncestors.length - 1;
    if (ancestors[i] !== otherAncestors[j]) {
      return 33 | (this._id < other._id ? 4 : 2); // DISCONNECTED | IMPLEMENTATION_SPECIFIC
    }
    while (i >= 0 && j >= 0 && ancestors[i] === otherAncestors[j]) {
      i--;
      j--;
    }
    if (i < 0) {
      return 20; // CONTAINED_BY | FOLLOWING
    }
    if (j < 0) {
      return 10; // CONTAINS | PRECEDING
    }
    const siblings = ancestors[i + 1].childNodes;
    return siblings.indexOf(ancestors[i]) < siblings.indexOf(otherAncestors[j]) ? 4 : 2;
  };

  Element.prototype.contains = function(other) {
    var node = other;
    while (node) {
      if (node === this) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

  Element.prototype.addEventListener = function(type, listener, options) {
  };

  Element.prototype.removeEventListener = function(type, listener, options) {
  };

  Element.prototype.dispatchEvent = function(event) {
    return true;
  };

  Element.prototype.getBoundingClientRect = function() {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  };

  function TextNode(text, ownerDocument) {
    this._id = nextNodeId++;
    this.nodeType = 3; // TEXT_NODE
    this.nodeName = '#text';
    this.nodeValue = String(text);
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
    this.nextSibling = null;
    this.previousSibling = null;
    this.childNodes = []; // Text nodes have no children but D3 expects this property
  }

  TextNode.prototype.cloneNode = function() {
    return new TextNode(this.nodeValue, this.ownerDocument);
  };

  function Document() {
    Element.call(this, '#document', null, null);
    this.nodeType = 9; // DOCUMENT_NODE
    this.ownerDocument = this;
    this.documentElement = this.createElement('html');
    this.documentElement.namespaceURI = XHTML_NAMESPACE;
    this.appendChild(this.documentElement);

    var head = this.createElement('head');
    var body = this.createElement('body');
    this.documentElement.appendChild(head);
    this.documentElement.appendChild(body);
    this.head = head;
    this.body = body;

    this._window = null;
  }

  Document.prototype = Object.create(Element.prototype);
  Document.prototype.constructor = Document;

  Document.prototype.createElement = function(tagName) {
    return new Element(tagName, XHTML_NAMESPACE, this);
  };

  Document.prototype.createElementNS = function(namespaceURI, qualifiedName) {
    return new Element(qualifiedName, namespaceURI, this);
  };

  Document.prototype.createTextNode = function(text) {
    return new TextNode(text, this);
  };

  Object.defineProperty(Document.prototype, 'defaultView', {
    get: function() {
      return this._window;
    }
  });

  function Window(document) {
    this.document = document;
    document._window = this;
    this.defaultView = this;
  }

  function dummyDOM() {
    var document = new Document();
    var window = new Window(document);
    return { document: document, window: window };
  }

  return {
    dummyDOM: dummyDOM
  };
})();
