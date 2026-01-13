/**
 * minidom.js - Minimal DOM Implementation for Headless SVG Generation
 *
 * MOTIVATION:
 * This module provides only the subset of
 * DOM APIs needed for D3.js-based SVG generation via PBISPC and PBIFUN
 * Power BI visual libraries in a headless QuickJSR context.
 *
 * SCOPE:
 * This implementation supports:
 * - Creating and manipulating SVG elements with proper namespacing
 * - D3.js selection and manipulation operations
 * - Serializing DOM trees to innerHTML for SVG output
 * - Basic CSS style management via the style property
 * - Complex CSS selectors (descendant selectors like ".tick text")
 *
 * WHAT'S NOT INCLUDED:
 * - HTML parsing (not needed - we only create elements programmatically)
 * - Event handling (stub implementations only - no interactivity in headless mode)
 * - Full CSS parser/CSSOM
 * - MutationObserver, IntersectionObserver, etc.
 * - Layout/rendering (getBoundingClientRect returns zeros)
 *
 * REQUIRED DOM APIS BY COMPONENT:
 *
 * 1. DOCUMENT CREATION (headlessUtils.js):
 *    - minidom.dummyDOM() → returns {document, window}
 *    - document.body → container element
 *    - document.createElement() / createElementNS() → element creation
 *
 * 2. D3.JS SELECTION & MANIPULATION:
 *    - Element.querySelector() / querySelectorAll() → finding elements
 *    - Element.matches() → selector matching (including ".tick text")
 *    - Element.appendChild() / removeChild() / insertBefore() → tree manipulation
 *    - Element.setAttribute() / setAttributeNS() → setting attributes
 *    - Element.getAttribute() → reading attributes
 *    - Element.classList → class manipulation (add/remove/contains)
 *    - Element.textContent → setting text content
 *    - Element.style.setProperty() → setting inline styles
 *
 * 3. SVG SERIALIZATION (visual.svg.node().innerHTML):
 *    - Element.innerHTML → serializes DOM tree to SVG string
 *    - Preserves attribute insertion order
 *    - Merges style object into inline style="" attribute
 *    - Properly escapes attribute values
 *    - Self-closing tags for empty elements (<tag />)
 *
 * 4. PBISPC/PBIFUN VISUAL REQUIREMENTS:
 *    - Element.ownerDocument → back-reference for D3 operations
 *    - Element.ownerSVGElement → finding parent <svg> element
 *    - Element.namespaceURI → proper SVG namespace handling
 *    - Element.compareDocumentPosition() → for D3 sorting operations
 *    - Element.cloneNode() → duplicating elements
 *    - Element.getBoundingClientRect() → stub (returns zeros, not used in headless)
 *    - Element.addEventListener() → stub (no events in headless mode)
 *
 * 5. TREE NAVIGATION:
 *    - Element.parentNode / childNodes / children
 *    - Element.nextSibling / previousSibling
 *    - Element.firstChild / lastChild / firstElementChild
 *
 * CRITICAL IMPLEMENTATION DETAILS:
 *
 * - Attribute Order: Preserves insertion order via _attributeOrder array
 *   (D3 sets attributes in specific sequences that must be maintained)
 *
 * - Style Handling: style.setProperty() stores in _styles object, then
 *   innerHTML serializes to inline style="" attribute (always first)
 *
 * - Descendant Selectors: ".tick text" splits on space and walks up DOM
 *   tree to verify ancestor relationships (needed for D3's .selectAll())
 *
 * - Text Nodes: Separate TextNode class for textContent support
 *
 * - Bidirectional Pointers: Parent/child relationships maintained in both
 *   directions for efficient tree traversal
 */

var minidom = (function() {
  'use strict';

  // Namespace constants
  var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  var XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

  // Helper function to escape attribute values
  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // ClassList implementation
  function ClassList(element) {
    this._element = element;
  }

  ClassList.prototype.add = function(className) {
    var classes = this._element._className ? this._element._className.split(' ') : [];
    if (classes.indexOf(className) === -1) {
      classes.push(className);
      this._element._className = classes.join(' ');
      this._element.setAttribute('class', this._element._className);
    }
  };

  ClassList.prototype.remove = function(className) {
    var classes = this._element._className ? this._element._className.split(' ') : [];
    var index = classes.indexOf(className);
    if (index !== -1) {
      classes.splice(index, 1);
      this._element._className = classes.join(' ');
      if (this._element._className) {
        this._element.setAttribute('class', this._element._className);
      } else {
        this._element.removeAttribute('class');
      }
    }
  };

  ClassList.prototype.contains = function(className) {
    var classes = this._element._className ? this._element._className.split(' ') : [];
    return classes.indexOf(className) !== -1;
  };

  // CSSStyleDeclaration implementation
  function CSSStyleDeclaration() {
    this._styles = {};
  }

  CSSStyleDeclaration.prototype.setProperty = function(name, value, priority) {
    this._styles[name] = value;
  };

  CSSStyleDeclaration.prototype.getPropertyValue = function(name) {
    return this._styles[name] || '';
  };

  CSSStyleDeclaration.prototype.removeProperty = function(name) {
    delete this._styles[name];
  };

  // Element implementation
  function Element(tagName, namespaceURI, ownerDocument) {
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
    this._attributes = {};
    this._attributeOrder = []; // Track insertion order
    this._className = '';
    this._classList = null;
    this.style = new CSSStyleDeclaration();
  }

  // classList property
  Object.defineProperty(Element.prototype, 'classList', {
    get: function() {
      if (!this._classList) {
        this._classList = new ClassList(this);
      }
      return this._classList;
    }
  });

  // className property
  Object.defineProperty(Element.prototype, 'className', {
    get: function() {
      return this._className;
    },
    set: function(value) {
      this._className = value;
      this.setAttribute('class', value);
    }
  });

  // children property (element children only)
  Object.defineProperty(Element.prototype, 'children', {
    get: function() {
      return this.childNodes.filter(function(node) {
        return node.nodeType === 1;
      });
    }
  });

  // firstElementChild property
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

  // innerHTML property - critical for SVG serialization
  Object.defineProperty(Element.prototype, 'innerHTML', {
    get: function() {
      var html = '';
      for (var i = 0; i < this.childNodes.length; i++) {
        var child = this.childNodes[i];
        if (child.nodeType === 3) {
          // Text node
          html += child.nodeValue;
        } else if (child.nodeType === 1) {
          // Element node
          html += '<' + child.tagName;

          // Build style attribute from style object if it has properties
          var styleStr = '';
          var styleKeys = Object.keys(child.style._styles);
          if (styleKeys.length > 0) {
            var styleParts = [];
            for (var k = 0; k < styleKeys.length; k++) {
              styleParts.push(styleKeys[k] + ':' + child.style._styles[styleKeys[k]]);
            }
            styleStr = styleParts.join(';');
          }

          // Output style attribute first if it exists (linkedom behavior)
          if (styleStr) {
            html += ' style="' + escapeAttr(styleStr) + '"';
          }

          // Then output other attributes in insertion order (linkedom preserves setAttribute order)
          for (var j = 0; j < child._attributeOrder.length; j++) {
            var attrName = child._attributeOrder[j];
            if (attrName in child._attributes && attrName !== 'style') {
              html += ' ' + attrName + '="' + escapeAttr(child._attributes[attrName]) + '"';
            }
          }

          // Check if element has children
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
      // Clear existing children
      this.childNodes = [];
      this.firstChild = null;
      this.lastChild = null;
      // In a full implementation, would parse the HTML, but not needed for our use case
    }
  });

  // textContent property - get/set text content
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
      // Clear existing children
      this.childNodes = [];
      this.firstChild = null;
      this.lastChild = null;
      // Add a text node
      if (value !== null && value !== undefined && value !== '') {
        var textNode = new TextNode(String(value), this.ownerDocument);
        this.appendChild(textNode);
      }
    }
  });

  // ownerSVGElement property (for SVG elements)
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

  // Child manipulation methods
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

    var index = this.childNodes.indexOf(refNode);
    if (index === -1) {
      throw new Error('Reference node not found');
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
    this.childNodes.splice(index, 0, newNode);

    return newNode;
  };

  // Attribute methods
  Element.prototype.setAttribute = function(name, value) {
    if (!(name in this._attributes)) {
      this._attributeOrder.push(name);
    }
    this._attributes[name] = String(value);
    if (name === 'class') {
      this._className = String(value);
    }
  };

  Element.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value) {
    // For our purposes, treat namespaced attributes the same as regular attributes
    if (!(qualifiedName in this._attributes)) {
      this._attributeOrder.push(qualifiedName);
    }
    this._attributes[qualifiedName] = String(value);
  };

  Element.prototype.getAttribute = function(name) {
    return this._attributes[name] || null;
  };

  Element.prototype.removeAttribute = function(name) {
    delete this._attributes[name];
    if (name === 'class') {
      this._className = '';
    }
  };

  Element.prototype.hasAttribute = function(name) {
    return name in this._attributes;
  };

  // Query methods (minimal implementation)
  Element.prototype.querySelector = function(selector) {
    var matches = this.querySelectorAll(selector);
    return matches.length > 0 ? matches[0] : null;
  };

  Element.prototype.querySelectorAll = function(selector) {
    var results = [];

    function traverse(node) {
      if (node.nodeType === 1 && node.matches(selector)) {
        results.push(node);
      }
      for (var i = 0; i < node.childNodes.length; i++) {
        traverse(node.childNodes[i]);
      }
    }

    for (var i = 0; i < this.childNodes.length; i++) {
      traverse(this.childNodes[i]);
    }

    return results;
  };

  Element.prototype.matches = function(selector) {
    // Handle descendant selectors (e.g., ".tick text")
    if (selector.indexOf(' ') !== -1) {
      var parts = selector.split(' ');
      var lastPart = parts[parts.length - 1];

      // Check if this element matches the last part
      if (!this._matchesSimple(lastPart)) {
        return false;
      }

      // Check if any ancestor matches the previous parts
      var node = this.parentNode;
      for (var i = parts.length - 2; i >= 0; i--) {
        var found = false;
        while (node && node.nodeType === 1) {
          if (node._matchesSimple(parts[i])) {
            found = true;
            node = node.parentNode;
            break;
          }
          node = node.parentNode;
        }
        if (!found) {
          return false;
        }
      }
      return true;
    }

    return this._matchesSimple(selector);
  };

  Element.prototype._matchesSimple = function(selector) {
    // Simple selector matching for classes, tags, and IDs
    if (selector.charAt(0) === '.') {
      // Class selector
      var className = selector.substring(1);
      return this.classList.contains(className);
    } else if (selector.charAt(0) === '#') {
      // ID selector
      var id = selector.substring(1);
      return this.getAttribute('id') === id;
    } else {
      // Tag selector
      return this.tagName === selector;
    }
  };

  // Clone method
  Element.prototype.cloneNode = function(deep) {
    var clone = new Element(this.tagName, this.namespaceURI, this.ownerDocument);

    // Clone attributes and their order
    for (var i = 0; i < this._attributeOrder.length; i++) {
      var attr = this._attributeOrder[i];
      clone._attributeOrder.push(attr);
      clone._attributes[attr] = this._attributes[attr];
    }
    clone._className = this._className;

    // Clone style
    for (var styleKey in this.style._styles) {
      clone.style._styles[styleKey] = this.style._styles[styleKey];
    }

    // Deep clone children if requested
    if (deep) {
      for (var i = 0; i < this.childNodes.length; i++) {
        clone.appendChild(this.childNodes[i].cloneNode(true));
      }
    }

    return clone;
  };

  // Position comparison (simplified for D3)
  Element.prototype.compareDocumentPosition = function(other) {
    if (this === other) {
      return 0;
    }

    // Check if other is contained by this
    var node = other.parentNode;
    while (node) {
      if (node === this) {
        return 20; // DOCUMENT_POSITION_CONTAINED_BY | DOCUMENT_POSITION_FOLLOWING
      }
      node = node.parentNode;
    }

    // Check if this is contained by other
    node = this.parentNode;
    while (node) {
      if (node === other) {
        return 10; // DOCUMENT_POSITION_CONTAINS | DOCUMENT_POSITION_PRECEDING
      }
      node = node.parentNode;
    }

    // Simple following/preceding for siblings
    if (this.parentNode === other.parentNode) {
      var children = this.parentNode.childNodes;
      var thisIndex = children.indexOf(this);
      var otherIndex = children.indexOf(other);
      return thisIndex < otherIndex ? 4 : 2; // FOLLOWING or PRECEDING
    }

    return 0;
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

  // Event listener methods (stub implementations - not functional but prevent errors)
  Element.prototype.addEventListener = function(type, listener, options) {
    // Stub - no actual event handling needed for headless SVG generation
  };

  Element.prototype.removeEventListener = function(type, listener, options) {
    // Stub - no actual event handling needed for headless SVG generation
  };

  Element.prototype.dispatchEvent = function(event) {
    // Stub - no actual event handling needed for headless SVG generation
    return true;
  };

  // getBoundingClientRect - stub for headless rendering
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

  // Text node implementation
  function TextNode(text, ownerDocument) {
    this.nodeType = 3; // TEXT_NODE
    this.nodeName = '#text';
    this.nodeValue = text;
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
    this.nextSibling = null;
    this.previousSibling = null;
    this.childNodes = []; // Text nodes have no children but D3 expects this property
  }

  TextNode.prototype.cloneNode = function() {
    return new TextNode(this.nodeValue, this.ownerDocument);
  };

  // Document implementation
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

  // Inherit from Element
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

  // Window implementation
  function Window(document) {
    this.document = document;
    document._window = this;
    this.defaultView = this;
  }

  // parseHTML function - main entry point
  function dummyDOM() {
    var document = new Document();
    var window = new Window(document);
    return { document: document, window: window };
  }

  // Export the API
  return {
    dummyDOM: dummyDOM
  };
})();
