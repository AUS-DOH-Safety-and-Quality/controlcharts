var spc = (function (exports) {
  'use strict';

  var xhtml = "http://www.w3.org/1999/xhtml";

  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  function namespace(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
  }

  function creatorInherit(name) {
    return function() {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml
          ? document.createElement(name)
          : document.createElementNS(uri, name);
    };
  }

  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }

  function creator(name) {
    var fullname = namespace(name);
    return (fullname.local
        ? creatorFixed
        : creatorInherit)(fullname);
  }

  function none() {}

  function selector(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }

  function selection_select(select) {
    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  // Given something array like (or null), returns something that is strictly an
  // array. This is used to ensure that array-like objects passed to d3.selectAll
  // or selection.selectAll are converted into proper arrays when creating a
  // selection; we don’t ever want to create a selection backed by a live
  // HTMLCollection or NodeList. However, note that selection.selectAll will use a
  // static NodeList as a group, since it safely derived from querySelectorAll.
  function array$1(x) {
    return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
  }

  function empty() {
    return [];
  }

  function selectorAll(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }

  function arrayAll(select) {
    return function() {
      return array$1(select.apply(this, arguments));
    };
  }

  function selection_selectAll(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }

    return new Selection(subgroups, parents);
  }

  function matcher(selector) {
    return function() {
      return this.matches(selector);
    };
  }

  function childMatcher(selector) {
    return function(node) {
      return node.matches(selector);
    };
  }

  var find = Array.prototype.find;

  function childFind(match) {
    return function() {
      return find.call(this.children, match);
    };
  }

  function childFirst() {
    return this.firstElementChild;
  }

  function selection_selectChild(match) {
    return this.select(match == null ? childFirst
        : childFind(typeof match === "function" ? match : childMatcher(match)));
  }

  var filter = Array.prototype.filter;

  function children() {
    return Array.from(this.children);
  }

  function childrenFilter(match) {
    return function() {
      return filter.call(this.children, match);
    };
  }

  function selection_selectChildren(match) {
    return this.selectAll(match == null ? children
        : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
  }

  function selection_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function sparse(update) {
    return new Array(update.length);
  }

  function selection_enter() {
    return new Selection(this._enter || this._groups.map(sparse), this._parents);
  }

  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }

  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
    querySelector: function(selector) { return this._parent.querySelector(selector); },
    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
  };

  function constant$3(x) {
    return function() {
      return x;
    };
  }

  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;

    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }

  function bindKey(parent, group, enter, update, exit, data, key) {
    var i,
        node,
        nodeByKeyValue = new Map,
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;

    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
        if (nodeByKeyValue.has(keyValue)) {
          exit[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }

    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) {
      keyValue = key.call(parent, data[i], i, data) + "";
      if (node = nodeByKeyValue.get(keyValue)) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue.delete(keyValue);
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
        exit[i] = node;
      }
    }
  }

  function datum(node) {
    return node.__data__;
  }

  function selection_data(value, key) {
    if (!arguments.length) return Array.from(this, datum);

    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;

    if (typeof value !== "function") value = constant$3(value);

    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);

      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
          previous._next = next || null;
        }
      }
    }

    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }

  // Given some data, this returns an array-like view of it: an object that
  // exposes a length property and allows numeric indexing. Note that unlike
  // selectAll, this isn’t worried about “live” collections because the resulting
  // array will only be used briefly while data is being bound. (It is possible to
  // cause the data to change while iterating by using a key function, but please
  // don’t; we’d rather avoid a gratuitous copy.)
  function arraylike(data) {
    return typeof data === "object" && "length" in data
      ? data // Array, TypedArray, NodeList, array-like
      : Array.from(data); // Map, Set, iterable, string, or anything else
  }

  function selection_exit() {
    return new Selection(this._exit || this._groups.map(sparse), this._parents);
  }

  function selection_join(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    if (typeof onenter === "function") {
      enter = onenter(enter);
      if (enter) enter = enter.selection();
    } else {
      enter = enter.append(onenter + "");
    }
    if (onupdate != null) {
      update = onupdate(update);
      if (update) update = update.selection();
    }
    if (onexit == null) exit.remove(); else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
  }

  function selection_merge(context) {
    var selection = context.selection ? context.selection() : context;

    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Selection(merges, this._parents);
  }

  function selection_order() {

    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }

    return this;
  }

  function selection_sort(compare) {
    if (!compare) compare = ascending$1;

    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }

    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }

    return new Selection(sortgroups, this._parents).order();
  }

  function ascending$1(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  function selection_nodes() {
    return Array.from(this);
  }

  function selection_node() {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }

    return null;
  }

  function selection_size() {
    let size = 0;
    for (const node of this) ++size; // eslint-disable-line no-unused-vars
    return size;
  }

  function selection_empty() {
    return !this.node();
  }

  function selection_each(callback) {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }

    return this;
  }

  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }

  function attrConstantNS(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }

  function attrFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }

  function attrFunctionNS(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }

  function selection_attr(name, value) {
    var fullname = namespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local
          ? node.getAttributeNS(fullname.space, fullname.local)
          : node.getAttribute(fullname);
    }

    return this.each((value == null
        ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)
        : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
  }

  function defaultView(node) {
    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView; // node is a Document
  }

  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }

  function styleFunction(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }

  function selection_style(name, value, priority) {
    return arguments.length > 1
        ? this.each((value == null
              ? styleRemove : typeof value === "function"
              ? styleFunction
              : styleConstant)(name, value, priority == null ? "" : priority))
        : styleValue(this.node(), name);
  }

  function styleValue(node, name) {
    return node.style.getPropertyValue(name)
        || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
  }

  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }

  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }

  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }

  function selection_property(name, value) {
    return arguments.length > 1
        ? this.each((value == null
            ? propertyRemove : typeof value === "function"
            ? propertyFunction
            : propertyConstant)(name, value))
        : this.node()[name];
  }

  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }

  function classList(node) {
    return node.classList || new ClassList(node);
  }

  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }

  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };

  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }

  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }

  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }

  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }

  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }

  function selection_classed(name, value) {
    var names = classArray(name + "");

    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }

    return this.each((typeof value === "function"
        ? classedFunction : value
        ? classedTrue
        : classedFalse)(names, value));
  }

  function textRemove() {
    this.textContent = "";
  }

  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }

  function selection_text(value) {
    return arguments.length
        ? this.each(value == null
            ? textRemove : (typeof value === "function"
            ? textFunction
            : textConstant)(value))
        : this.node().textContent;
  }

  function htmlRemove() {
    this.innerHTML = "";
  }

  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }

  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }

  function selection_html(value) {
    return arguments.length
        ? this.each(value == null
            ? htmlRemove : (typeof value === "function"
            ? htmlFunction
            : htmlConstant)(value))
        : this.node().innerHTML;
  }

  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }

  function selection_raise() {
    return this.each(raise);
  }

  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }

  function selection_lower() {
    return this.each(lower);
  }

  function selection_append(name) {
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function() {
      return this.appendChild(create.apply(this, arguments));
    });
  }

  function constantNull() {
    return null;
  }

  function selection_insert(name, before) {
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }

  function selection_remove() {
    return this.each(remove);
  }

  function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_clone(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }

  function selection_datum(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  }

  function contextListener(listener) {
    return function(event) {
      listener.call(this, event, this.__data__);
    };
  }

  function parseTypenames$1(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return {type: t, name: name};
    });
  }

  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }

  function onAdd(typename, value, options) {
    return function() {
      var on = this.__on, o, listener = contextListener(value);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, options);
      o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }

  function selection_on(typename, value, options) {
    var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }

    on = value ? onAdd : onRemove;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
    return this;
  }

  function dispatchEvent(node, type, params) {
    var window = defaultView(node),
        event = window.CustomEvent;

    if (typeof event === "function") {
      event = new event(type, params);
    } else {
      event = window.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    }

    node.dispatchEvent(event);
  }

  function dispatchConstant(type, params) {
    return function() {
      return dispatchEvent(this, type, params);
    };
  }

  function dispatchFunction(type, params) {
    return function() {
      return dispatchEvent(this, type, params.apply(this, arguments));
    };
  }

  function selection_dispatch(type, params) {
    return this.each((typeof params === "function"
        ? dispatchFunction
        : dispatchConstant)(type, params));
  }

  function* selection_iterator() {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) yield node;
      }
    }
  }

  var root = [null];

  function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }

  function selection_selection() {
    return this;
  }

  Selection.prototype = {
    constructor: Selection,
    select: selection_select,
    selectAll: selection_selectAll,
    selectChild: selection_selectChild,
    selectChildren: selection_selectChildren,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    join: selection_join,
    merge: selection_merge,
    selection: selection_selection,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    clone: selection_clone,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch,
    [Symbol.iterator]: selection_iterator
  };

  function select(selector) {
    return typeof selector === "string"
        ? new Selection([[document.querySelector(selector)]], [document.documentElement])
        : new Selection([[selector]], root);
  }

  function sourceEvent(event) {
    let sourceEvent;
    while (sourceEvent = event.sourceEvent) event = sourceEvent;
    return event;
  }

  function pointer(event, node) {
    event = sourceEvent(event);
    if (node === undefined) node = event.currentTarget;
    if (node) {
      var svg = node.ownerSVGElement || node;
      if (svg.createSVGPoint) {
        var point = svg.createSVGPoint();
        point.x = event.clientX, point.y = event.clientY;
        point = point.matrixTransform(node.getScreenCTM().inverse());
        return [point.x, point.y];
      }
      if (node.getBoundingClientRect) {
        var rect = node.getBoundingClientRect();
        return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
      }
    }
    return [event.pageX, event.pageY];
  }

  function selectAll(selector) {
    return typeof selector === "string"
        ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
        : new Selection([array$1(selector)], root);
  }

  function constant$2(x) {
    return function constant() {
      return x;
    };
  }

  const cos = Math.cos;
  const min$1 = Math.min;
  const sin = Math.sin;
  const sqrt = Math.sqrt;
  const pi$1 = Math.PI;
  const tau$1 = 2 * pi$1;

  const pi = Math.PI,
      tau = 2 * pi,
      epsilon$1 = 1e-6,
      tauEpsilon = tau - epsilon$1;

  function append(strings) {
    this._ += strings[0];
    for (let i = 1, n = strings.length; i < n; ++i) {
      this._ += arguments[i] + strings[i];
    }
  }

  function appendRound(digits) {
    let d = Math.floor(digits);
    if (!(d >= 0)) throw new Error(`invalid digits: ${digits}`);
    if (d > 15) return append;
    const k = 10 ** d;
    return function(strings) {
      this._ += strings[0];
      for (let i = 1, n = strings.length; i < n; ++i) {
        this._ += Math.round(arguments[i] * k) / k + strings[i];
      }
    };
  }

  class Path {
    constructor(digits) {
      this._x0 = this._y0 = // start of current subpath
      this._x1 = this._y1 = null; // end of current subpath
      this._ = "";
      this._append = digits == null ? append : appendRound(digits);
    }
    moveTo(x, y) {
      this._append`M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}`;
    }
    closePath() {
      if (this._x1 !== null) {
        this._x1 = this._x0, this._y1 = this._y0;
        this._append`Z`;
      }
    }
    lineTo(x, y) {
      this._append`L${this._x1 = +x},${this._y1 = +y}`;
    }
    quadraticCurveTo(x1, y1, x, y) {
      this._append`Q${+x1},${+y1},${this._x1 = +x},${this._y1 = +y}`;
    }
    bezierCurveTo(x1, y1, x2, y2, x, y) {
      this._append`C${+x1},${+y1},${+x2},${+y2},${this._x1 = +x},${this._y1 = +y}`;
    }
    arcTo(x1, y1, x2, y2, r) {
      x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;

      // Is the radius negative? Error.
      if (r < 0) throw new Error(`negative radius: ${r}`);

      let x0 = this._x1,
          y0 = this._y1,
          x21 = x2 - x1,
          y21 = y2 - y1,
          x01 = x0 - x1,
          y01 = y0 - y1,
          l01_2 = x01 * x01 + y01 * y01;

      // Is this path empty? Move to (x1,y1).
      if (this._x1 === null) {
        this._append`M${this._x1 = x1},${this._y1 = y1}`;
      }

      // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
      else if (!(l01_2 > epsilon$1));

      // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
      // Equivalently, is (x1,y1) coincident with (x2,y2)?
      // Or, is the radius zero? Line to (x1,y1).
      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon$1) || !r) {
        this._append`L${this._x1 = x1},${this._y1 = y1}`;
      }

      // Otherwise, draw an arc!
      else {
        let x20 = x2 - x0,
            y20 = y2 - y0,
            l21_2 = x21 * x21 + y21 * y21,
            l20_2 = x20 * x20 + y20 * y20,
            l21 = Math.sqrt(l21_2),
            l01 = Math.sqrt(l01_2),
            l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
            t01 = l / l01,
            t21 = l / l21;

        // If the start tangent is not coincident with (x0,y0), line to.
        if (Math.abs(t01 - 1) > epsilon$1) {
          this._append`L${x1 + t01 * x01},${y1 + t01 * y01}`;
        }

        this._append`A${r},${r},0,0,${+(y01 * x20 > x01 * y20)},${this._x1 = x1 + t21 * x21},${this._y1 = y1 + t21 * y21}`;
      }
    }
    arc(x, y, r, a0, a1, ccw) {
      x = +x, y = +y, r = +r, ccw = !!ccw;

      // Is the radius negative? Error.
      if (r < 0) throw new Error(`negative radius: ${r}`);

      let dx = r * Math.cos(a0),
          dy = r * Math.sin(a0),
          x0 = x + dx,
          y0 = y + dy,
          cw = 1 ^ ccw,
          da = ccw ? a0 - a1 : a1 - a0;

      // Is this path empty? Move to (x0,y0).
      if (this._x1 === null) {
        this._append`M${x0},${y0}`;
      }

      // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
      else if (Math.abs(this._x1 - x0) > epsilon$1 || Math.abs(this._y1 - y0) > epsilon$1) {
        this._append`L${x0},${y0}`;
      }

      // Is this arc empty? We’re done.
      if (!r) return;

      // Does the angle go the wrong way? Flip the direction.
      if (da < 0) da = da % tau + tau;

      // Is this a complete circle? Draw two arcs to complete the circle.
      if (da > tauEpsilon) {
        this._append`A${r},${r},0,1,${cw},${x - dx},${y - dy}A${r},${r},0,1,${cw},${this._x1 = x0},${this._y1 = y0}`;
      }

      // Is this arc non-empty? Draw an arc!
      else if (da > epsilon$1) {
        this._append`A${r},${r},0,${+(da >= pi)},${cw},${this._x1 = x + r * Math.cos(a1)},${this._y1 = y + r * Math.sin(a1)}`;
      }
    }
    rect(x, y, w, h) {
      this._append`M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}h${w = +w}v${+h}h${-w}Z`;
    }
    toString() {
      return this._;
    }
  }

  function withPath(shape) {
    let digits = 3;

    shape.digits = function(_) {
      if (!arguments.length) return digits;
      if (_ == null) {
        digits = null;
      } else {
        const d = Math.floor(_);
        if (!(d >= 0)) throw new RangeError(`invalid digits: ${_}`);
        digits = d;
      }
      return shape;
    };

    return () => new Path(digits);
  }

  function array(x) {
    return typeof x === "object" && "length" in x
      ? x // Array, TypedArray, NodeList, array-like
      : Array.from(x); // Map, Set, iterable, string, or anything else
  }

  function Linear(context) {
    this._context = context;
  }

  Linear.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; // falls through
        default: this._context.lineTo(x, y); break;
      }
    }
  };

  function curveLinear(context) {
    return new Linear(context);
  }

  function x(p) {
    return p[0];
  }

  function y(p) {
    return p[1];
  }

  function line(x$1, y$1) {
    var defined = constant$2(true),
        context = null,
        curve = curveLinear,
        output = null,
        path = withPath(line);

    x$1 = typeof x$1 === "function" ? x$1 : (x$1 === undefined) ? x : constant$2(x$1);
    y$1 = typeof y$1 === "function" ? y$1 : (y$1 === undefined) ? y : constant$2(y$1);

    function line(data) {
      var i,
          n = (data = array(data)).length,
          d,
          defined0 = false,
          buffer;

      if (context == null) output = curve(buffer = path());

      for (i = 0; i <= n; ++i) {
        if (!(i < n && defined(d = data[i], i, data)) === defined0) {
          if (defined0 = !defined0) output.lineStart();
          else output.lineEnd();
        }
        if (defined0) output.point(+x$1(d, i, data), +y$1(d, i, data));
      }

      if (buffer) return output = null, buffer + "" || null;
    }

    line.x = function(_) {
      return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant$2(+_), line) : x$1;
    };

    line.y = function(_) {
      return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant$2(+_), line) : y$1;
    };

    line.defined = function(_) {
      return arguments.length ? (defined = typeof _ === "function" ? _ : constant$2(!!_), line) : defined;
    };

    line.curve = function(_) {
      return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
    };

    line.context = function(_) {
      return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
    };

    return line;
  }

  const sqrt3$1 = sqrt(3);

  var asterisk = {
    draw(context, size) {
      const r = sqrt(size + min$1(size / 28, 0.75)) * 0.59436;
      const t = r / 2;
      const u = t * sqrt3$1;
      context.moveTo(0, r);
      context.lineTo(0, -r);
      context.moveTo(-u, -t);
      context.lineTo(u, t);
      context.moveTo(-u, t);
      context.lineTo(u, -t);
    }
  };

  var circle = {
    draw(context, size) {
      const r = sqrt(size / pi$1);
      context.moveTo(r, 0);
      context.arc(0, 0, r, 0, tau$1);
    }
  };

  var cross = {
    draw(context, size) {
      const r = sqrt(size / 5) / 2;
      context.moveTo(-3 * r, -r);
      context.lineTo(-r, -r);
      context.lineTo(-r, -3 * r);
      context.lineTo(r, -3 * r);
      context.lineTo(r, -r);
      context.lineTo(3 * r, -r);
      context.lineTo(3 * r, r);
      context.lineTo(r, r);
      context.lineTo(r, 3 * r);
      context.lineTo(-r, 3 * r);
      context.lineTo(-r, r);
      context.lineTo(-3 * r, r);
      context.closePath();
    }
  };

  const tan30 = sqrt(1 / 3);
  const tan30_2 = tan30 * 2;

  var diamond = {
    draw(context, size) {
      const y = sqrt(size / tan30_2);
      const x = y * tan30;
      context.moveTo(0, -y);
      context.lineTo(x, 0);
      context.lineTo(0, y);
      context.lineTo(-x, 0);
      context.closePath();
    }
  };

  var square = {
    draw(context, size) {
      const w = sqrt(size);
      const x = -w / 2;
      context.rect(x, x, w, w);
    }
  };

  const ka = 0.89081309152928522810;
  const kr = sin(pi$1 / 10) / sin(7 * pi$1 / 10);
  const kx = sin(tau$1 / 10) * kr;
  const ky = -cos(tau$1 / 10) * kr;

  var star = {
    draw(context, size) {
      const r = sqrt(size * ka);
      const x = kx * r;
      const y = ky * r;
      context.moveTo(0, -r);
      context.lineTo(x, y);
      for (let i = 1; i < 5; ++i) {
        const a = tau$1 * i / 5;
        const c = cos(a);
        const s = sin(a);
        context.lineTo(s * r, -c * r);
        context.lineTo(c * x - s * y, s * x + c * y);
      }
      context.closePath();
    }
  };

  const sqrt3 = sqrt(3);

  var triangle = {
    draw(context, size) {
      const y = -sqrt(size / (sqrt3 * 3));
      context.moveTo(0, y * 2);
      context.lineTo(-sqrt3 * y, -y);
      context.lineTo(sqrt3 * y, -y);
      context.closePath();
    }
  };

  const c = -0.5;
  const s = sqrt(3) / 2;
  const k = 1 / sqrt(12);
  const a = (k / 2 + 1) * 3;

  var wye = {
    draw(context, size) {
      const r = sqrt(size / a);
      const x0 = r / 2, y0 = r * k;
      const x1 = x0, y1 = r * k + r;
      const x2 = -x1, y2 = y1;
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
      context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
      context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
      context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
      context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
      context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
      context.closePath();
    }
  };

  function Symbol$1(type, size) {
    let context = null,
        path = withPath(symbol);

    type = typeof type === "function" ? type : constant$2(type || circle);
    size = typeof size === "function" ? size : constant$2(size === undefined ? 64 : +size);

    function symbol() {
      let buffer;
      if (!context) context = buffer = path();
      type.apply(this, arguments).draw(context, +size.apply(this, arguments));
      if (buffer) return context = null, buffer + "" || null;
    }

    symbol.type = function(_) {
      return arguments.length ? (type = typeof _ === "function" ? _ : constant$2(_), symbol) : type;
    };

    symbol.size = function(_) {
      return arguments.length ? (size = typeof _ === "function" ? _ : constant$2(+_), symbol) : size;
    };

    symbol.context = function(_) {
      return arguments.length ? (context = _ == null ? null : _, symbol) : context;
    };

    return symbol;
  }

  function identity$2(x) {
    return x;
  }

  var top = 1,
      right = 2,
      bottom = 3,
      left = 4,
      epsilon = 1e-6;

  function translateX(x) {
    return "translate(" + x + ",0)";
  }

  function translateY(y) {
    return "translate(0," + y + ")";
  }

  function number$2(scale) {
    return d => +scale(d);
  }

  function center(scale, offset) {
    offset = Math.max(0, scale.bandwidth() - offset * 2) / 2;
    if (scale.round()) offset = Math.round(offset);
    return d => +scale(d) + offset;
  }

  function entering() {
    return !this.__axis;
  }

  function axis(orient, scale) {
    var tickArguments = [],
        tickValues = null,
        tickFormat = null,
        tickSizeInner = 6,
        tickSizeOuter = 6,
        tickPadding = 3,
        offset = typeof window !== "undefined" && window.devicePixelRatio > 1 ? 0 : 0.5,
        k = orient === top || orient === left ? -1 : 1,
        x = orient === left || orient === right ? "x" : "y",
        transform = orient === top || orient === bottom ? translateX : translateY;

    function axis(context) {
      var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
          format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$2) : tickFormat,
          spacing = Math.max(tickSizeInner, 0) + tickPadding,
          range = scale.range(),
          range0 = +range[0] + offset,
          range1 = +range[range.length - 1] + offset,
          position = (scale.bandwidth ? center : number$2)(scale.copy(), offset),
          selection = context.selection ? context.selection() : context,
          path = selection.selectAll(".domain").data([null]),
          tick = selection.selectAll(".tick").data(values, scale).order(),
          tickExit = tick.exit(),
          tickEnter = tick.enter().append("g").attr("class", "tick"),
          line = tick.select("line"),
          text = tick.select("text");

      path = path.merge(path.enter().insert("path", ".tick")
          .attr("class", "domain")
          .attr("stroke", "currentColor"));

      tick = tick.merge(tickEnter);

      line = line.merge(tickEnter.append("line")
          .attr("stroke", "currentColor")
          .attr(x + "2", k * tickSizeInner));

      text = text.merge(tickEnter.append("text")
          .attr("fill", "currentColor")
          .attr(x, k * spacing)
          .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

      if (context !== selection) {
        path = path.transition(context);
        tick = tick.transition(context);
        line = line.transition(context);
        text = text.transition(context);

        tickExit = tickExit.transition(context)
            .attr("opacity", epsilon)
            .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d + offset) : this.getAttribute("transform"); });

        tickEnter
            .attr("opacity", epsilon)
            .attr("transform", function(d) { var p = this.parentNode.__axis; return transform((p && isFinite(p = p(d)) ? p : position(d)) + offset); });
      }

      tickExit.remove();

      path
          .attr("d", orient === left || orient === right
              ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H" + offset + "V" + range1 + "H" + k * tickSizeOuter : "M" + offset + "," + range0 + "V" + range1)
              : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V" + offset + "H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + "," + offset + "H" + range1));

      tick
          .attr("opacity", 1)
          .attr("transform", function(d) { return transform(position(d) + offset); });

      line
          .attr(x + "2", k * tickSizeInner);

      text
          .attr(x, k * spacing)
          .text(format);

      selection.filter(entering)
          .attr("fill", "none")
          .attr("font-size", 10)
          .attr("font-family", "sans-serif")
          .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

      selection
          .each(function() { this.__axis = position; });
    }

    axis.scale = function(_) {
      return arguments.length ? (scale = _, axis) : scale;
    };

    axis.ticks = function() {
      return tickArguments = Array.from(arguments), axis;
    };

    axis.tickArguments = function(_) {
      return arguments.length ? (tickArguments = _ == null ? [] : Array.from(_), axis) : tickArguments.slice();
    };

    axis.tickValues = function(_) {
      return arguments.length ? (tickValues = _ == null ? null : Array.from(_), axis) : tickValues && tickValues.slice();
    };

    axis.tickFormat = function(_) {
      return arguments.length ? (tickFormat = _, axis) : tickFormat;
    };

    axis.tickSize = function(_) {
      return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
    };

    axis.tickSizeInner = function(_) {
      return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
    };

    axis.tickSizeOuter = function(_) {
      return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
    };

    axis.tickPadding = function(_) {
      return arguments.length ? (tickPadding = +_, axis) : tickPadding;
    };

    axis.offset = function(_) {
      return arguments.length ? (offset = +_, axis) : offset;
    };

    return axis;
  }

  function axisBottom(scale) {
    return axis(bottom, scale);
  }

  function axisLeft(scale) {
    return axis(left, scale);
  }

  function ascending(a, b) {
    return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function descending(a, b) {
    return a == null || b == null ? NaN
      : b < a ? -1
      : b > a ? 1
      : b >= a ? 0
      : NaN;
  }

  function bisector(f) {
    let compare1, compare2, delta;

    // If an accessor is specified, promote it to a comparator. In this case we
    // can test whether the search value is (self-) comparable. We can’t do this
    // for a comparator (except for specific, known comparators) because we can’t
    // tell if the comparator is symmetric, and an asymmetric comparator can’t be
    // used to test whether a single value is comparable.
    if (f.length !== 2) {
      compare1 = ascending;
      compare2 = (d, x) => ascending(f(d), x);
      delta = (d, x) => f(d) - x;
    } else {
      compare1 = f === ascending || f === descending ? f : zero$1;
      compare2 = f;
      delta = f;
    }

    function left(a, x, lo = 0, hi = a.length) {
      if (lo < hi) {
        if (compare1(x, x) !== 0) return hi;
        do {
          const mid = (lo + hi) >>> 1;
          if (compare2(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        } while (lo < hi);
      }
      return lo;
    }

    function right(a, x, lo = 0, hi = a.length) {
      if (lo < hi) {
        if (compare1(x, x) !== 0) return hi;
        do {
          const mid = (lo + hi) >>> 1;
          if (compare2(a[mid], x) <= 0) lo = mid + 1;
          else hi = mid;
        } while (lo < hi);
      }
      return lo;
    }

    function center(a, x, lo = 0, hi = a.length) {
      const i = left(a, x, lo, hi - 1);
      return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
    }

    return {left, center, right};
  }

  function zero$1() {
    return 0;
  }

  function number$1(x) {
    return x === null ? NaN : +x;
  }

  const ascendingBisect = bisector(ascending);
  const bisectRight = ascendingBisect.right;
  bisector(number$1).center;

  const e10 = Math.sqrt(50),
      e5 = Math.sqrt(10),
      e2 = Math.sqrt(2);

  function tickSpec(start, stop, count) {
    const step = (stop - start) / Math.max(0, count),
        power = Math.floor(Math.log10(step)),
        error = step / Math.pow(10, power),
        factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
    let i1, i2, inc;
    if (power < 0) {
      inc = Math.pow(10, -power) / factor;
      i1 = Math.round(start * inc);
      i2 = Math.round(stop * inc);
      if (i1 / inc < start) ++i1;
      if (i2 / inc > stop) --i2;
      inc = -inc;
    } else {
      inc = Math.pow(10, power) * factor;
      i1 = Math.round(start / inc);
      i2 = Math.round(stop / inc);
      if (i1 * inc < start) ++i1;
      if (i2 * inc > stop) --i2;
    }
    if (i2 < i1 && 0.5 <= count && count < 2) return tickSpec(start, stop, count * 2);
    return [i1, i2, inc];
  }

  function ticks(start, stop, count) {
    stop = +stop, start = +start, count = +count;
    if (!(count > 0)) return [];
    if (start === stop) return [start];
    const reverse = stop < start, [i1, i2, inc] = reverse ? tickSpec(stop, start, count) : tickSpec(start, stop, count);
    if (!(i2 >= i1)) return [];
    const n = i2 - i1 + 1, ticks = new Array(n);
    if (reverse) {
      if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) / -inc;
      else for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) * inc;
    } else {
      if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) / -inc;
      else for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) * inc;
    }
    return ticks;
  }

  function tickIncrement(start, stop, count) {
    stop = +stop, start = +start, count = +count;
    return tickSpec(start, stop, count)[2];
  }

  function tickStep(start, stop, count) {
    stop = +stop, start = +start, count = +count;
    const reverse = stop < start, inc = reverse ? tickIncrement(stop, start, count) : tickIncrement(start, stop, count);
    return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
  }

  function initRange(domain, range) {
    switch (arguments.length) {
      case 0: break;
      case 1: this.range(domain); break;
      default: this.range(range).domain(domain); break;
    }
    return this;
  }

  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color() {}

  var darker = 0.7;
  var brighter = 1 / darker;

  var reI = "\\s*([+-]?\\d+)\\s*",
      reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
      reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
      reHex = /^#([0-9a-f]{3,8})$/,
      reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
      reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
      reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
      reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
      reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
      reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    copy(channels) {
      return Object.assign(new this.constructor, this, channels);
    },
    displayable() {
      return this.rgb().displayable();
    },
    hex: color_formatHex, // Deprecated! Use color.formatHex.
    formatHex: color_formatHex,
    formatHex8: color_formatHex8,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
  });

  function color_formatHex() {
    return this.rgb().formatHex();
  }

  function color_formatHex8() {
    return this.rgb().formatHex8();
  }

  function color_formatHsl() {
    return hslConvert(this).formatHsl();
  }

  function color_formatRgb() {
    return this.rgb().formatRgb();
  }

  function color(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
        : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
        : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
        : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
        : null) // invalid hex
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function rgb$1(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, rgb$1, extend(Color, {
    brighter(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb() {
      return this;
    },
    clamp() {
      return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
    },
    displayable() {
      return (-0.5 <= this.r && this.r < 255.5)
          && (-0.5 <= this.g && this.g < 255.5)
          && (-0.5 <= this.b && this.b < 255.5)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: rgb_formatHex, // Deprecated! Use color.formatHex.
    formatHex: rgb_formatHex,
    formatHex8: rgb_formatHex8,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
  }));

  function rgb_formatHex() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
  }

  function rgb_formatHex8() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
  }

  function rgb_formatRgb() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
  }

  function clampa(opacity) {
    return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
  }

  function clampi(value) {
    return Math.max(0, Math.min(255, Math.round(value) || 0));
  }

  function hex(value) {
    value = clampi(value);
    return (value < 16 ? "0" : "") + value.toString(16);
  }

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, hsl, extend(Color, {
    brighter(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    clamp() {
      return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
    },
    displayable() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    formatHsl() {
      const a = clampa(this.opacity);
      return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
    }
  }));

  function clamph(value) {
    value = (value || 0) % 360;
    return value < 0 ? value + 360 : value;
  }

  function clampt(value) {
    return Math.max(0, Math.min(1, value || 0));
  }

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var constant$1 = x => () => x;

  function linear$1(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function gamma$1(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear$1(a, d) : constant$1(isNaN(a) ? b : a);
  }

  var rgb = (function rgbGamma(y) {
    var color = gamma$1(y);

    function rgb(start, end) {
      var r = color((start = rgb$1(start)).r, (end = rgb$1(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb.gamma = rgbGamma;

    return rgb;
  })(1);

  function numberArray(a, b) {
    if (!b) b = [];
    var n = a ? Math.min(b.length, a.length) : 0,
        c = b.slice(),
        i;
    return function(t) {
      for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
      return c;
    };
  }

  function isNumberArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
  }

  function genericArray(a, b) {
    var nb = b ? b.length : 0,
        na = a ? Math.min(nb, a.length) : 0,
        x = new Array(na),
        c = new Array(nb),
        i;

    for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
    for (; i < nb; ++i) c[i] = b[i];

    return function(t) {
      for (i = 0; i < na; ++i) c[i] = x[i](t);
      return c;
    };
  }

  function date(a, b) {
    var d = new Date;
    return a = +a, b = +b, function(t) {
      return d.setTime(a * (1 - t) + b * t), d;
    };
  }

  function interpolateNumber(a, b) {
    return a = +a, b = +b, function(t) {
      return a * (1 - t) + b * t;
    };
  }

  function object(a, b) {
    var i = {},
        c = {},
        k;

    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};

    for (k in b) {
      if (k in a) {
        i[k] = interpolate(a[k], b[k]);
      } else {
        c[k] = b[k];
      }
    }

    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
      reB = new RegExp(reA.source, "g");

  function zero(b) {
    return function() {
      return b;
    };
  }

  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function string(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: interpolateNumber(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  function interpolate(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant$1(b)
        : (t === "number" ? interpolateNumber
        : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
        : b instanceof color ? rgb
        : b instanceof Date ? date
        : isNumberArray(b) ? numberArray
        : Array.isArray(b) ? genericArray
        : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
        : interpolateNumber)(a, b);
  }

  function interpolateRound(a, b) {
    return a = +a, b = +b, function(t) {
      return Math.round(a * (1 - t) + b * t);
    };
  }

  function constants(x) {
    return function() {
      return x;
    };
  }

  function number(x) {
    return +x;
  }

  var unit = [0, 1];

  function identity$1(x) {
    return x;
  }

  function normalize(a, b) {
    return (b -= (a = +a))
        ? function(x) { return (x - a) / b; }
        : constants(isNaN(b) ? NaN : 0.5);
  }

  function clamper(a, b) {
    var t;
    if (a > b) t = a, a = b, b = t;
    return function(x) { return Math.max(a, Math.min(b, x)); };
  }

  // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
  // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
  function bimap(domain, range, interpolate) {
    var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
    if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
    else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
    return function(x) { return r0(d0(x)); };
  }

  function polymap(domain, range, interpolate) {
    var j = Math.min(domain.length, range.length) - 1,
        d = new Array(j),
        r = new Array(j),
        i = -1;

    // Reverse descending domains.
    if (domain[j] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }

    while (++i < j) {
      d[i] = normalize(domain[i], domain[i + 1]);
      r[i] = interpolate(range[i], range[i + 1]);
    }

    return function(x) {
      var i = bisectRight(domain, x, 1, j) - 1;
      return r[i](d[i](x));
    };
  }

  function copy(source, target) {
    return target
        .domain(source.domain())
        .range(source.range())
        .interpolate(source.interpolate())
        .clamp(source.clamp())
        .unknown(source.unknown());
  }

  function transformer() {
    var domain = unit,
        range = unit,
        interpolate$1 = interpolate,
        transform,
        untransform,
        unknown,
        clamp = identity$1,
        piecewise,
        output,
        input;

    function rescale() {
      var n = Math.min(domain.length, range.length);
      if (clamp !== identity$1) clamp = clamper(domain[0], domain[n - 1]);
      piecewise = n > 2 ? polymap : bimap;
      output = input = null;
      return scale;
    }

    function scale(x) {
      return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
    }

    scale.invert = function(y) {
      return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
    };

    scale.domain = function(_) {
      return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
    };

    scale.range = function(_) {
      return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
    };

    scale.rangeRound = function(_) {
      return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
    };

    scale.clamp = function(_) {
      return arguments.length ? (clamp = _ ? true : identity$1, rescale()) : clamp !== identity$1;
    };

    scale.interpolate = function(_) {
      return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
    };

    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };

    return function(t, u) {
      transform = t, untransform = u;
      return rescale();
    };
  }

  function continuous() {
    return transformer()(identity$1, identity$1);
  }

  function formatDecimal(x) {
    return Math.abs(x = Math.round(x)) >= 1e21
        ? x.toLocaleString("en").replace(/,/g, "")
        : x.toString(10);
  }

  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimalParts(1.23) returns ["123", 0].
  function formatDecimalParts(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i, coefficient = x.slice(0, i);

    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  }

  function exponent(x) {
    return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
  }

  function formatGroup(grouping, thousands) {
    return function(value, width) {
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;

      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }

      return t.reverse().join(thousands);
    };
  }

  function formatNumerals(numerals) {
    return function(value) {
      return value.replace(/[0-9]/g, function(i) {
        return numerals[+i];
      });
    };
  }

  // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
  var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

  function formatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
    var match;
    return new FormatSpecifier({
      fill: match[1],
      align: match[2],
      sign: match[3],
      symbol: match[4],
      zero: match[5],
      width: match[6],
      comma: match[7],
      precision: match[8] && match[8].slice(1),
      trim: match[9],
      type: match[10]
    });
  }

  formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

  function FormatSpecifier(specifier) {
    this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
    this.align = specifier.align === undefined ? ">" : specifier.align + "";
    this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
    this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
    this.zero = !!specifier.zero;
    this.width = specifier.width === undefined ? undefined : +specifier.width;
    this.comma = !!specifier.comma;
    this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
    this.trim = !!specifier.trim;
    this.type = specifier.type === undefined ? "" : specifier.type + "";
  }

  FormatSpecifier.prototype.toString = function() {
    return this.fill
        + this.align
        + this.sign
        + this.symbol
        + (this.zero ? "0" : "")
        + (this.width === undefined ? "" : Math.max(1, this.width | 0))
        + (this.comma ? "," : "")
        + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
        + (this.trim ? "~" : "")
        + this.type;
  };

  // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
  function formatTrim(s) {
    out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (s[i]) {
        case ".": i0 = i1 = i; break;
        case "0": if (i0 === 0) i0 = i; i1 = i; break;
        default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
      }
    }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
  }

  var prefixExponent;

  function formatPrefixAuto(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient
        : i > n ? coefficient + new Array(i - n + 1).join("0")
        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
        : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
  }

  function formatRounded(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  var formatTypes = {
    "%": (x, p) => (x * 100).toFixed(p),
    "b": (x) => Math.round(x).toString(2),
    "c": (x) => x + "",
    "d": formatDecimal,
    "e": (x, p) => x.toExponential(p),
    "f": (x, p) => x.toFixed(p),
    "g": (x, p) => x.toPrecision(p),
    "o": (x) => Math.round(x).toString(8),
    "p": (x, p) => formatRounded(x * 100, p),
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": (x) => Math.round(x).toString(16).toUpperCase(),
    "x": (x) => Math.round(x).toString(16)
  };

  function identity(x) {
    return x;
  }

  var map = Array.prototype.map,
      prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

  function formatLocale(locale) {
    var group = locale.grouping === undefined || locale.thousands === undefined ? identity : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
        currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
        currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
        decimal = locale.decimal === undefined ? "." : locale.decimal + "",
        numerals = locale.numerals === undefined ? identity : formatNumerals(map.call(locale.numerals, String)),
        percent = locale.percent === undefined ? "%" : locale.percent + "",
        minus = locale.minus === undefined ? "−" : locale.minus + "",
        nan = locale.nan === undefined ? "NaN" : locale.nan + "";

    function newFormat(specifier) {
      specifier = formatSpecifier(specifier);

      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          trim = specifier.trim,
          type = specifier.type;

      // The "n" type is an alias for ",g".
      if (type === "n") comma = true, type = "g";

      // The "" type, and any invalid type, is an alias for ".12~g".
      else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

      // If zero fill is specified, padding goes after sign and before digits.
      if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = /[defgprs%]/.test(type);

      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision === undefined ? 6
          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
          : Math.max(0, Math.min(20, precision));

      function format(value) {
        var valuePrefix = prefix,
            valueSuffix = suffix,
            i, n, c;

        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;

          // Determine the sign. -0 is not less than 0, but 1 / -0 is!
          var valueNegative = value < 0 || 1 / value < 0;

          // Perform the initial formatting.
          value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

          // Trim insignificant zeros.
          if (trim) value = formatTrim(value);

          // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
          if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) {
            i = -1, n = value.length;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }

        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);

        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";

        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

        // Reconstruct the final output based on the desired alignment.
        switch (align) {
          case "<": value = valuePrefix + value + valueSuffix + padding; break;
          case "=": value = valuePrefix + padding + value + valueSuffix; break;
          case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
          default: value = padding + valuePrefix + value + valueSuffix; break;
        }

        return numerals(value);
      }

      format.toString = function() {
        return specifier + "";
      };

      return format;
    }

    function formatPrefix(specifier, value) {
      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function(value) {
        return f(k * value) + prefix;
      };
    }

    return {
      format: newFormat,
      formatPrefix: formatPrefix
    };
  }

  var locale;
  var format;
  var formatPrefix;

  defaultLocale({
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });

  function defaultLocale(definition) {
    locale = formatLocale(definition);
    format = locale.format;
    formatPrefix = locale.formatPrefix;
    return locale;
  }

  function precisionFixed(step) {
    return Math.max(0, -exponent(Math.abs(step)));
  }

  function precisionPrefix(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
  }

  function precisionRound(step, max) {
    step = Math.abs(step), max = Math.abs(max) - step;
    return Math.max(0, exponent(max) - exponent(step)) + 1;
  }

  function tickFormat(start, stop, count, specifier) {
    var step = tickStep(start, stop, count),
        precision;
    specifier = formatSpecifier(specifier == null ? ",f" : specifier);
    switch (specifier.type) {
      case "s": {
        var value = Math.max(Math.abs(start), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
        return formatPrefix(specifier, value);
      }
      case "":
      case "e":
      case "g":
      case "p":
      case "r": {
        if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
        break;
      }
      case "f":
      case "%": {
        if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      }
    }
    return format(specifier);
  }

  function linearish(scale) {
    var domain = scale.domain;

    scale.ticks = function(count) {
      var d = domain();
      return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
    };

    scale.tickFormat = function(count, specifier) {
      var d = domain();
      return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
    };

    scale.nice = function(count) {
      if (count == null) count = 10;

      var d = domain();
      var i0 = 0;
      var i1 = d.length - 1;
      var start = d[i0];
      var stop = d[i1];
      var prestep;
      var step;
      var maxIter = 10;

      if (stop < start) {
        step = start, start = stop, stop = step;
        step = i0, i0 = i1, i1 = step;
      }
      
      while (maxIter-- > 0) {
        step = tickIncrement(start, stop, count);
        if (step === prestep) {
          d[i0] = start;
          d[i1] = stop;
          return domain(d);
        } else if (step > 0) {
          start = Math.floor(start / step) * step;
          stop = Math.ceil(stop / step) * step;
        } else if (step < 0) {
          start = Math.ceil(start * step) / step;
          stop = Math.floor(stop * step) / step;
        } else {
          break;
        }
        prestep = step;
      }

      return scale;
    };

    return scale;
  }

  function linear() {
    var scale = continuous();

    scale.copy = function() {
      return copy(scale, linear());
    };

    initRange.apply(scale, arguments);

    return linearish(scale);
  }

  var noop = {value: () => {}};

  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }

  function Dispatch(_) {
    this._ = _;
  }

  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }

  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
        return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
      }

      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };

  function get(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }

  // These are typically used in conjunction with noevent to ensure that we can
  // preventDefault on the event.
  const nonpassive = {passive: false};
  const nonpassivecapture = {capture: true, passive: false};

  function nopropagation(event) {
    event.stopImmediatePropagation();
  }

  function noevent(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function nodrag(view) {
    var root = view.document.documentElement,
        selection = select(view).on("dragstart.drag", noevent, nonpassivecapture);
    if ("onselectstart" in root) {
      selection.on("selectstart.drag", noevent, nonpassivecapture);
    } else {
      root.__noselect = root.style.MozUserSelect;
      root.style.MozUserSelect = "none";
    }
  }

  function yesdrag(view, noclick) {
    var root = view.document.documentElement,
        selection = select(view).on("dragstart.drag", null);
    if (noclick) {
      selection.on("click.drag", noevent, nonpassivecapture);
      setTimeout(function() { selection.on("click.drag", null); }, 0);
    }
    if ("onselectstart" in root) {
      selection.on("selectstart.drag", null);
    } else {
      root.style.MozUserSelect = root.__noselect;
      delete root.__noselect;
    }
  }

  var constant = x => () => x;

  function DragEvent(type, {
    sourceEvent,
    subject,
    target,
    identifier,
    active,
    x, y, dx, dy,
    dispatch
  }) {
    Object.defineProperties(this, {
      type: {value: type, enumerable: true, configurable: true},
      sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
      subject: {value: subject, enumerable: true, configurable: true},
      target: {value: target, enumerable: true, configurable: true},
      identifier: {value: identifier, enumerable: true, configurable: true},
      active: {value: active, enumerable: true, configurable: true},
      x: {value: x, enumerable: true, configurable: true},
      y: {value: y, enumerable: true, configurable: true},
      dx: {value: dx, enumerable: true, configurable: true},
      dy: {value: dy, enumerable: true, configurable: true},
      _: {value: dispatch}
    });
  }

  DragEvent.prototype.on = function() {
    var value = this._.on.apply(this._, arguments);
    return value === this._ ? this : value;
  };

  // Ignore right-click, since that should open the context menu.
  function defaultFilter(event) {
    return !event.ctrlKey && !event.button;
  }

  function defaultContainer() {
    return this.parentNode;
  }

  function defaultSubject(event, d) {
    return d == null ? {x: event.x, y: event.y} : d;
  }

  function defaultTouchable() {
    return navigator.maxTouchPoints || ("ontouchstart" in this);
  }

  function drag() {
    var filter = defaultFilter,
        container = defaultContainer,
        subject = defaultSubject,
        touchable = defaultTouchable,
        gestures = {},
        listeners = dispatch("start", "drag", "end"),
        active = 0,
        mousedownx,
        mousedowny,
        mousemoving,
        touchending,
        clickDistance2 = 0;

    function drag(selection) {
      selection
          .on("mousedown.drag", mousedowned)
        .filter(touchable)
          .on("touchstart.drag", touchstarted)
          .on("touchmove.drag", touchmoved, nonpassive)
          .on("touchend.drag touchcancel.drag", touchended)
          .style("touch-action", "none")
          .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }

    function mousedowned(event, d) {
      if (touchending || !filter.call(this, event, d)) return;
      var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
      if (!gesture) return;
      select(event.view)
        .on("mousemove.drag", mousemoved, nonpassivecapture)
        .on("mouseup.drag", mouseupped, nonpassivecapture);
      nodrag(event.view);
      nopropagation(event);
      mousemoving = false;
      mousedownx = event.clientX;
      mousedowny = event.clientY;
      gesture("start", event);
    }

    function mousemoved(event) {
      noevent(event);
      if (!mousemoving) {
        var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
        mousemoving = dx * dx + dy * dy > clickDistance2;
      }
      gestures.mouse("drag", event);
    }

    function mouseupped(event) {
      select(event.view).on("mousemove.drag mouseup.drag", null);
      yesdrag(event.view, mousemoving);
      noevent(event);
      gestures.mouse("end", event);
    }

    function touchstarted(event, d) {
      if (!filter.call(this, event, d)) return;
      var touches = event.changedTouches,
          c = container.call(this, event, d),
          n = touches.length, i, gesture;

      for (i = 0; i < n; ++i) {
        if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
          nopropagation(event);
          gesture("start", event, touches[i]);
        }
      }
    }

    function touchmoved(event) {
      var touches = event.changedTouches,
          n = touches.length, i, gesture;

      for (i = 0; i < n; ++i) {
        if (gesture = gestures[touches[i].identifier]) {
          noevent(event);
          gesture("drag", event, touches[i]);
        }
      }
    }

    function touchended(event) {
      var touches = event.changedTouches,
          n = touches.length, i, gesture;

      if (touchending) clearTimeout(touchending);
      touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
      for (i = 0; i < n; ++i) {
        if (gesture = gestures[touches[i].identifier]) {
          nopropagation(event);
          gesture("end", event, touches[i]);
        }
      }
    }

    function beforestart(that, container, event, d, identifier, touch) {
      var dispatch = listeners.copy(),
          p = pointer(touch || event, container), dx, dy,
          s;

      if ((s = subject.call(that, new DragEvent("beforestart", {
          sourceEvent: event,
          target: drag,
          identifier,
          active,
          x: p[0],
          y: p[1],
          dx: 0,
          dy: 0,
          dispatch
        }), d)) == null) return;

      dx = s.x - p[0] || 0;
      dy = s.y - p[1] || 0;

      return function gesture(type, event, touch) {
        var p0 = p, n;
        switch (type) {
          case "start": gestures[identifier] = gesture, n = active++; break;
          case "end": delete gestures[identifier], --active; // falls through
          case "drag": p = pointer(touch || event, container), n = active; break;
        }
        dispatch.call(
          type,
          that,
          new DragEvent(type, {
            sourceEvent: event,
            subject: s,
            target: drag,
            identifier,
            active: n,
            x: p[0] + dx,
            y: p[1] + dy,
            dx: p[0] - p0[0],
            dy: p[1] - p0[1],
            dispatch
          }),
          d
        );
      };
    }

    drag.filter = function(_) {
      return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), drag) : filter;
    };

    drag.container = function(_) {
      return arguments.length ? (container = typeof _ === "function" ? _ : constant(_), drag) : container;
    };

    drag.subject = function(_) {
      return arguments.length ? (subject = typeof _ === "function" ? _ : constant(_), drag) : subject;
    };

    drag.touchable = function(_) {
      return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), drag) : touchable;
    };

    drag.on = function() {
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? drag : value;
    };

    drag.clickDistance = function(_) {
      return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
    };

    return drag;
  }

  var d3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    axisBottom: axisBottom,
    axisLeft: axisLeft,
    drag: drag,
    line: line,
    scaleLinear: linear,
    select: select,
    selectAll: selectAll,
    symbol: Symbol$1,
    symbolAsterisk: asterisk,
    symbolCircle: circle,
    symbolCross: cross,
    symbolDiamond: diamond,
    symbolSquare: square,
    symbolStar: star,
    symbolTriangle: triangle,
    symbolWye: wye
  });

  const FONT_LIST = [
      "'Arial', sans-serif",
      "Arial",
      "'Arial Black'",
      "'Arial Unicode MS'",
      "Calibri",
      "Cambria",
      "'Cambria Math'",
      "Candara",
      "'Comic Sans MS'",
      "Consolas",
      "Constantia",
      "Corbel",
      "'Courier New'",
      "wf_standard-font, helvetica, arial, sans-serif",
      "wf_standard-font_light, helvetica, arial, sans-serif",
      "Georgia",
      "'Lucida Sans Unicode'",
      "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif",
      "'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif",
      "'Segoe UI Semibold', wf_segoe-ui_semibold, helvetica, arial, sans-serif",
      "'Segoe UI Bold', wf_segoe-ui_bold, helvetica, arial, sans-serif",
      "Symbol",
      "Tahoma",
      "'Times New Roman'",
      "'Trebuchet MS'",
      "Verdana",
      "Wingdings"
  ];
  const LINE_TYPE_ITEMS = [
      { displayName: "Solid", value: "10 0" },
      { displayName: "Dashed", value: "10 10" },
      { displayName: "Dotted", value: "2 5" }
  ];
  const LINE_TYPE_VALID = ["10 0", "10 10", "2 5"];
  const POSITION_ITEMS_BASIC = [
      { displayName: "Above", value: "above" },
      { displayName: "Below", value: "below" },
      { displayName: "Beside", value: "beside" }
  ];
  const POSITION_ITEMS_EXTENDED = [
      { displayName: "Outside", value: "outside" },
      { displayName: "Inside", value: "inside" },
      ...POSITION_ITEMS_BASIC
  ];
  const BORDER_STYLE_ITEMS = [
      { displayName: "Solid", value: "solid" },
      { displayName: "Dashed", value: "dashed" },
      { displayName: "Dotted", value: "dotted" },
      { displayName: "Double", value: "double" },
      { displayName: "Groove", value: "groove" },
      { displayName: "Ridge", value: "ridge" },
      { displayName: "Inset", value: "inset" },
      { displayName: "Outset", value: "outset" }
  ];
  const BORDER_STYLE_VALID = ["solid", "dotted", "dashed", "double", "groove", "ridge", "inset", "outset", "none"];
  const lineWidth = (displayName, defaultValue) => ({
      displayName,
      type: "NumUpDown",
      default: defaultValue,
      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
  });
  const lineType = (displayName, defaultValue) => ({
      displayName,
      type: "Dropdown",
      default: defaultValue,
      valid: LINE_TYPE_VALID,
      items: LINE_TYPE_ITEMS
  });
  const opacity = (displayName, defaultValue) => ({
      displayName,
      type: "NumUpDown",
      default: defaultValue,
      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
  });
  const fontPicker = (displayName, defaultValue) => ({
      displayName,
      type: "FontPicker",
      default: defaultValue,
      valid: FONT_LIST
  });
  const fontSize = (displayName, defaultValue) => ({
      displayName,
      type: "NumUpDown",
      default: defaultValue,
      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
  });
  const createPlotLabelSettings = (prefix, useExtendedPositions = false) => {
      const positionItems = useExtendedPositions ? POSITION_ITEMS_EXTENDED : POSITION_ITEMS_BASIC;
      const positionValid = positionItems.map(i => i.value);
      return {
          [`plot_label_show_${prefix}`]: {
              displayName: "Show Value on Plot",
              type: "ToggleSwitch",
              default: false
          },
          [`plot_label_show_all_${prefix}`]: {
              displayName: "Show Value at all Re-Baselines",
              type: "ToggleSwitch",
              default: false
          },
          [`plot_label_show_n_${prefix}`]: {
              displayName: "Show Value at Last N Re-Baselines",
              type: "NumUpDown",
              default: 1,
              options: { minValue: { value: 1 } }
          },
          [`plot_label_position_${prefix}`]: {
              displayName: "Position of Value on Line(s)",
              type: "Dropdown",
              default: "beside",
              valid: positionValid,
              items: positionItems
          },
          [`plot_label_vpad_${prefix}`]: {
              displayName: "Value Vertical Padding",
              type: "NumUpDown",
              default: 0
          },
          [`plot_label_hpad_${prefix}`]: {
              displayName: "Value Horizontal Padding",
              type: "NumUpDown",
              default: 10
          },
          [`plot_label_font_${prefix}`]: fontPicker("Value Font", "'Arial', sans-serif"),
          [`plot_label_size_${prefix}`]: fontSize("Value Font Size", 10),
          [`plot_label_colour_${prefix}`]: {
              displayName: "Value Colour",
              type: "ColorPicker",
              default: "#000000"
          },
          [`plot_label_prefix_${prefix}`]: {
              displayName: "Value Prefix",
              type: "TextInput",
              default: ""
          }
      };
  };
  const createOutlierColours = (prefix, defaultColours) => {
      const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
      return {
          [`${prefix}_colour_improvement`]: {
              displayName: `Imp. ${capitalize(prefix)} Colour`,
              type: "ColorPicker",
              default: defaultColours.improvement
          },
          [`${prefix}_colour_deterioration`]: {
              displayName: `Det. ${capitalize(prefix)} Colour`,
              type: "ColorPicker",
              default: defaultColours.deterioration
          },
          [`${prefix}_colour_neutral_low`]: {
              displayName: `Neutral (Low) ${capitalize(prefix)} Colour`,
              type: "ColorPicker",
              default: defaultColours.neutral_low
          },
          [`${prefix}_colour_neutral_high`]: {
              displayName: `Neutral (High) ${capitalize(prefix)} Colour`,
              type: "ColorPicker",
              default: defaultColours.neutral_high
          }
      };
  };
  const createLimitLineSettings = (name, displayName, defaults, hasUpperLower = true) => {
      const settings = {
          [`show_${name}`]: {
              displayName: `Show ${displayName} Lines`,
              type: "ToggleSwitch",
              default: defaults.show
          },
          [`width_${name}`]: lineWidth("Line Width", defaults.width),
          [`type_${name}`]: lineType("Line Type", defaults.type),
          [`colour_${name}`]: {
              displayName: "Line Colour",
              type: "ColorPicker",
              default: defaults.colour
          },
          [`opacity_${name}`]: opacity("Default Opacity", defaults.opacity),
          [`opacity_unselected_${name}`]: opacity("Opacity if Any Selected", defaults.opacity_unselected),
          [`join_rebaselines_${name}`]: {
              displayName: "Connect Rebaselined Limits",
              type: "ToggleSwitch",
              default: false
          },
          [`ttip_show_${name}`]: {
              displayName: "Show value in tooltip",
              type: "ToggleSwitch",
              default: true
          },
          [`ttip_label_${name}`]: {
              displayName: "Tooltip Label",
              type: "TextInput",
              default: `${displayName} Limit`
          }
      };
      if (hasUpperLower) {
          settings[`ttip_label_${name}_prefix_lower`] = {
              displayName: "Tooltip Label - Lower Prefix",
              type: "TextInput",
              default: "Lower "
          };
          settings[`ttip_label_${name}_prefix_upper`] = {
              displayName: "Tooltip Label - Upper Prefix",
              type: "TextInput",
              default: "Upper "
          };
      }
      return Object.assign(Object.assign({}, settings), createPlotLabelSettings(name, hasUpperLower));
  };
  const createSingleLineSettings = (name, displayName, defaults, includeTooltip = false) => {
      const settings = {
          [`show_${name}`]: {
              displayName: `Show ${displayName}`,
              type: "ToggleSwitch",
              default: defaults.show
          },
          [`width_${name}`]: lineWidth(`${displayName === "Main Line" ? "Main Line Width" : "Line Width"}`, defaults.width),
          [`type_${name}`]: lineType(`${displayName === "Main Line" ? "Main Line Type" : "Line Type"}`, defaults.type),
          [`colour_${name}`]: {
              displayName: `${displayName === "Main Line" ? "Main Line Colour" : "Line Colour"}`,
              type: "ColorPicker",
              default: defaults.colour
          },
          [`opacity_${name}`]: opacity("Default Opacity", defaults.opacity),
          [`opacity_unselected_${name}`]: opacity(`Opacity if Any Selected`, defaults.opacity_unselected),
          [`join_rebaselines_${name}`]: {
              displayName: "Connect Rebaselined Limits",
              type: "ToggleSwitch",
              default: false
          }
      };
      if (includeTooltip) {
          settings[`ttip_show_${name}`] = {
              displayName: "Show value in tooltip",
              type: "ToggleSwitch",
              default: true
          };
          settings[`ttip_label_${name}`] = {
              displayName: "Tooltip Label",
              type: "TextInput",
              default: defaults.tooltip_label || displayName
          };
      }
      return Object.assign(Object.assign({}, settings), createPlotLabelSettings(name, false));
  };

  const defaultColours = {
      improvement: "#00B0F0",
      deterioration: "#E46C0A",
      neutral_low: "#490092",
      neutral_high: "#490092",
      common_cause: "#A6A6A6",
      limits: "#6495ED",
      standard: "#000000"
  };
  const textOptions = {
      font: {
          default: "'Arial', sans-serif"},
      size: {
          default: 10},
      weight: {
          default: "normal",
          valid: ["normal", "bold", "bolder", "lighter"]
      },
      text_transform: {
          default: "uppercase",
          valid: ["uppercase", "lowercase", "capitalize", "none"]
      },
      text_overflow: {
          default: "ellipsis",
          valid: ["ellipsis", "clip", "none"]
      },
      text_align: {
          default: "center",
          valid: ["center", "left", "right"]
      }
  };
  const borderOptions = {
      width: {
          default: 1,
          options: { minValue: { value: 0 } }
      },
      style: {
          default: "solid",
          valid: BORDER_STYLE_VALID
      },
      colour: {
          default: "#000000"
      }
  };
  const settingsModel = {
      canvas: {
          description: "Canvas Settings",
          displayName: "Canvas Settings",
          settingsGroups: {
              "all": {
                  show_errors: {
                      displayName: "Show Errors on Canvas",
                      type: "ToggleSwitch",
                      default: true
                  },
                  lower_padding: {
                      displayName: "Padding Below Plot (pixels):",
                      type: "NumUpDown",
                      default: 10
                  },
                  upper_padding: {
                      displayName: "Padding Above Plot (pixels):",
                      type: "NumUpDown",
                      default: 10
                  },
                  left_padding: {
                      displayName: "Padding Left of Plot (pixels):",
                      type: "NumUpDown",
                      default: 10
                  },
                  right_padding: {
                      displayName: "Padding Right of Plot (pixels):",
                      type: "NumUpDown",
                      default: 10
                  }
              }
          }
      },
      spc: {
          description: "SPC Settings",
          displayName: "Data Settings",
          settingsGroups: {
              "all": {
                  chart_type: {
                      displayName: "Chart Type",
                      type: "Dropdown",
                      default: "i",
                      valid: ["run", "i", "i_m", "i_mm", "mr", "p", "pp", "u", "up", "c", "xbar", "s", "g", "t"],
                      items: [
                          { displayName: "run - Run Chart", value: "run" },
                          { displayName: "i - Individual Measurements", value: "i" },
                          { displayName: "i_m - Individual Measurements: Median centerline", value: "i_m" },
                          { displayName: "i_mm - Individual Measurements: Median centerline, Median MR Limits", value: "i_mm" },
                          { displayName: "mr - Moving Range of Individual Measurements", value: "mr" },
                          { displayName: "p - Proportions", value: "p" },
                          { displayName: "p prime - Proportions: Large-Sample Corrected", value: "pp" },
                          { displayName: "u - Rates", value: "u" },
                          { displayName: "u prime - Rates: Large-Sample Correction", value: "up" },
                          { displayName: "c - Counts", value: "c" },
                          { displayName: "xbar - Sample Means", value: "xbar" },
                          { displayName: "s - Sample SDs", value: "s" },
                          { displayName: "g - Number of Non-Events Between Events", value: "g" },
                          { displayName: "t - Time Between Events", value: "t" }
                      ]
                  },
                  outliers_in_limits: {
                      displayName: "Keep Outliers in Limit Calcs.",
                      type: "ToggleSwitch",
                      default: false
                  },
                  multiplier: {
                      displayName: "Multiplier",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 } }
                  },
                  sig_figs: {
                      displayName: "Decimals to Report:",
                      type: "NumUpDown",
                      default: 2,
                      options: { minValue: { value: 0 }, maxValue: { value: 20 } }
                  },
                  perc_labels: {
                      displayName: "Report as percentage",
                      type: "Dropdown",
                      default: "Automatic",
                      valid: ["Automatic", "Yes", "No"],
                      items: [
                          { displayName: "Automatic", value: "Automatic" },
                          { displayName: "Yes", value: "Yes" },
                          { displayName: "No", value: "No" }
                      ]
                  },
                  split_on_click: {
                      displayName: "Split Limits on Click",
                      type: "ToggleSwitch",
                      default: false
                  },
                  num_points_subset: {
                      displayName: "Subset Number of Points for Limit Calculations",
                      type: "NumUpDown",
                      default: null
                  },
                  subset_points_from: {
                      displayName: "Subset Points From",
                      type: "Dropdown",
                      default: "Start",
                      valid: ["Start", "End"],
                      items: [
                          { displayName: "Start", value: "Start" },
                          { displayName: "End", value: "End" }
                      ]
                  },
                  ttip_show_date: {
                      displayName: "Show Date in Tooltip",
                      type: "ToggleSwitch",
                      default: true
                  },
                  ttip_label_date: {
                      displayName: "Date Tooltip Label",
                      type: "TextInput",
                      default: "Automatic"
                  },
                  ttip_show_numerator: {
                      displayName: "Show Numerator in Tooltip",
                      type: "ToggleSwitch",
                      default: true
                  },
                  ttip_label_numerator: {
                      displayName: "Numerator Tooltip Label",
                      type: "TextInput",
                      default: "Numerator"
                  },
                  ttip_show_denominator: {
                      displayName: "Show Denominator in Tooltip",
                      type: "ToggleSwitch",
                      default: true
                  },
                  ttip_label_denominator: {
                      displayName: "Denominator Tooltip Label",
                      type: "TextInput",
                      default: "Denominator"
                  },
                  ttip_show_value: {
                      displayName: "Show Value in Tooltip",
                      type: "ToggleSwitch",
                      default: true
                  },
                  ttip_label_value: {
                      displayName: "Value Tooltip Label",
                      type: "TextInput",
                      default: "Automatic"
                  },
                  ll_truncate: {
                      displayName: "Truncate Lower Limits at:",
                      type: "NumUpDown",
                      default: null
                  },
                  ul_truncate: {
                      displayName: "Truncate Upper Limits at:",
                      type: "NumUpDown",
                      default: null
                  }
              }
          }
      },
      outliers: {
          description: "Outlier Settings",
          displayName: "Outlier Settings",
          settingsGroups: {
              "General": {
                  process_flag_type: {
                      displayName: "Type of Change to Flag",
                      type: "Dropdown",
                      default: "both",
                      valid: ["both", "improvement", "deterioration"],
                      items: [
                          { displayName: "Both", value: "both" },
                          { displayName: "Improvement (Imp.)", value: "improvement" },
                          { displayName: "Deterioration (Det.)", value: "deterioration" }
                      ]
                  },
                  improvement_direction: {
                      displayName: "Improvement Direction",
                      type: "Dropdown",
                      default: "increase",
                      valid: ["increase", "neutral", "decrease"],
                      items: [
                          { displayName: "Increase", value: "increase" },
                          { displayName: "Neutral", value: "neutral" },
                          { displayName: "Decrease", value: "decrease" }
                      ]
                  }
              },
              "Astronomical Points": Object.assign({ astronomical: {
                      displayName: "Highlight Astronomical Points",
                      type: "ToggleSwitch",
                      default: false
                  }, astronomical_limit: {
                      displayName: "Limit for Astronomical Points",
                      type: "Dropdown",
                      default: "3 Sigma",
                      valid: ["1 Sigma", "2 Sigma", "3 Sigma", "Specification"],
                      items: [
                          { displayName: "1 Sigma", value: "1 Sigma" },
                          { displayName: "2 Sigma", value: "2 Sigma" },
                          { displayName: "3 Sigma", value: "3 Sigma" },
                          { displayName: "Specification", value: "Specification" }
                      ]
                  } }, createOutlierColours("ast", defaultColours)),
              "Shifts": Object.assign({ shift: {
                      displayName: "Highlight Shifts",
                      type: "ToggleSwitch",
                      default: false
                  }, shift_n: {
                      displayName: "Shift Points",
                      type: "NumUpDown",
                      default: 7,
                      options: { minValue: { value: 1 } }
                  } }, createOutlierColours("shift", defaultColours)),
              "Trends": Object.assign({ trend: {
                      displayName: "Highlight Trends",
                      type: "ToggleSwitch",
                      default: false
                  }, trend_n: {
                      displayName: "Trend Points",
                      type: "NumUpDown",
                      default: 5,
                      options: { minValue: { value: 1 } }
                  } }, createOutlierColours("trend", defaultColours)),
              "Two-In-Three": Object.assign({ two_in_three: {
                      displayName: "Highlight Two-in-Three",
                      type: "ToggleSwitch",
                      default: false
                  }, two_in_three_highlight_series: {
                      displayName: "Highlight all in Pattern",
                      type: "ToggleSwitch",
                      default: false
                  }, two_in_three_limit: {
                      displayName: "Warning Limit for Two-in-Three",
                      type: "Dropdown",
                      default: "2 Sigma",
                      valid: ["1 Sigma", "2 Sigma", "3 Sigma", "Specification"],
                      items: [
                          { displayName: "1 Sigma", value: "1 Sigma" },
                          { displayName: "2 Sigma", value: "2 Sigma" },
                          { displayName: "3 Sigma", value: "3 Sigma" },
                          { displayName: "Specification", value: "Specification" }
                      ]
                  } }, createOutlierColours("twointhree", defaultColours))
          }
      },
      nhs_icons: {
          description: "NHS Icons Settings",
          displayName: "NHS Icons Settings",
          settingsGroups: {
              "all": {
                  show_variation_icons: {
                      displayName: "Show Variation Icons",
                      type: "ToggleSwitch",
                      default: false
                  },
                  flag_last_point: {
                      displayName: "Flag Only Last Point",
                      type: "ToggleSwitch",
                      default: true
                  },
                  variation_icons_locations: {
                      displayName: "Variation Icon Locations",
                      type: "Dropdown",
                      default: "Top Right",
                      valid: ["Top Right", "Bottom Right", "Top Left", "Bottom Left"],
                      items: [
                          { displayName: "Top Right", value: "Top Right" },
                          { displayName: "Bottom Right", value: "Bottom Right" },
                          { displayName: "Top Left", value: "Top Left" },
                          { displayName: "Bottom Left", value: "Bottom Left" }
                      ]
                  },
                  variation_icons_scaling: {
                      displayName: "Scale Variation Icon Size",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 } }
                  },
                  show_assurance_icons: {
                      displayName: "Show Assurance Icons",
                      type: "ToggleSwitch",
                      default: false
                  },
                  assurance_icons_locations: {
                      displayName: "Assurance Icon Locations",
                      type: "Dropdown",
                      default: "Top Right",
                      valid: ["Top Right", "Bottom Right", "Top Left", "Bottom Left"],
                      items: [
                          { displayName: "Top Right", value: "Top Right" },
                          { displayName: "Bottom Right", value: "Bottom Right" },
                          { displayName: "Top Left", value: "Top Left" },
                          { displayName: "Bottom Left", value: "Bottom Left" }
                      ]
                  },
                  assurance_icons_scaling: {
                      displayName: "Scale Assurance Icon Size",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 } }
                  }
              }
          }
      },
      scatter: {
          description: "Scatter Settings",
          displayName: "Scatter Settings",
          settingsGroups: {
              "all": {
                  show_dots: {
                      displayName: "Show Scatter",
                      type: "ToggleSwitch",
                      default: true
                  },
                  shape: {
                      displayName: "Shape",
                      type: "Dropdown",
                      default: "Circle",
                      valid: ["Circle", "Cross", "Diamond", "Square", "Star", "Triangle", "Wye"],
                      items: [
                          { displayName: "Circle", value: "Circle" },
                          { displayName: "Cross", value: "Cross" },
                          { displayName: "Diamond", value: "Diamond" },
                          { displayName: "Square", value: "Square" },
                          { displayName: "Star", value: "Star" },
                          { displayName: "Triangle", value: "Triangle" },
                          { displayName: "Wye", value: "Wye" }
                      ]
                  },
                  size: {
                      displayName: "Size",
                      type: "NumUpDown",
                      default: 2.5,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  colour: {
                      displayName: "Colour",
                      type: "ColorPicker",
                      default: defaultColours.common_cause
                  },
                  colour_outline: {
                      displayName: "Outline Colour",
                      type: "ColorPicker",
                      default: defaultColours.common_cause
                  },
                  width_outline: {
                      displayName: "Outline Width",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  opacity: {
                      displayName: "Default Opacity",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_selected: {
                      displayName: "Opacity if Selected",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected: {
                      displayName: "Opacity if Unselected",
                      type: "NumUpDown",
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  }
              }
          }
      },
      lines: {
          description: "Line Settings",
          displayName: "Line Settings",
          settingsGroups: {
              "Main": createSingleLineSettings("main", "Main Line", {
                  show: true,
                  width: 1,
                  type: "10 0",
                  colour: defaultColours.common_cause,
                  opacity: 1,
                  opacity_unselected: 0.2
              }, false),
              "Target": createSingleLineSettings("target", "Target", {
                  show: true,
                  width: 1.5,
                  type: "10 0",
                  colour: defaultColours.standard,
                  opacity: 1,
                  opacity_unselected: 0.2,
                  tooltip_label: "Centerline"
              }, true),
              "Alt. Target": Object.assign({ show_alt_target: {
                      displayName: "Show Alt. Target Line",
                      type: "ToggleSwitch",
                      default: false
                  }, alt_target: {
                      displayName: "Additional Target Value:",
                      type: "NumUpDown",
                      default: null
                  }, multiplier_alt_target: {
                      displayName: "Apply Multiplier to Alt. Target",
                      type: "ToggleSwitch",
                      default: false
                  } }, createSingleLineSettings("alt_target", "Alt. Target", {
                  show: false,
                  width: 1.5,
                  type: "10 0",
                  colour: defaultColours.standard,
                  opacity: 1,
                  opacity_unselected: 0.2,
                  tooltip_label: "Alt. Target"
              }, true)),
              "68% Limits": createLimitLineSettings("68", "68%", {
                  show: false,
                  width: 2,
                  type: "2 5",
                  colour: defaultColours.limits,
                  opacity: 1,
                  opacity_unselected: 0.2
              }, true),
              "95% Limits": createLimitLineSettings("95", "95%", {
                  show: true,
                  width: 2,
                  type: "2 5",
                  colour: defaultColours.limits,
                  opacity: 1,
                  opacity_unselected: 0.2
              }, true),
              "99% Limits": createLimitLineSettings("99", "99%", {
                  show: true,
                  width: 2,
                  type: "10 10",
                  colour: defaultColours.limits,
                  opacity: 1,
                  opacity_unselected: 0.2
              }, true),
              "Specification Limits": Object.assign({ show_specification: {
                      displayName: "Show Specification Lines",
                      type: "ToggleSwitch",
                      default: false
                  }, specification_upper: {
                      displayName: "Upper Specification Limit:",
                      type: "NumUpDown",
                      default: null
                  }, specification_lower: {
                      displayName: "Lower Specification Limit:",
                      type: "NumUpDown",
                      default: null
                  }, multiplier_specification: {
                      displayName: "Apply Multiplier to Specification Limits",
                      type: "ToggleSwitch",
                      default: false
                  } }, createLimitLineSettings("specification", "specification", {
                  show: false,
                  width: 2,
                  type: "10 10",
                  colour: defaultColours.limits,
                  opacity: 1,
                  opacity_unselected: 0.2
              }, true)),
              "Trend": createSingleLineSettings("trend", "Trend", {
                  show: false,
                  width: 1.5,
                  type: "10 0",
                  colour: defaultColours.common_cause,
                  opacity: 1,
                  opacity_unselected: 0.2,
                  tooltip_label: "Centerline"
              }, true)
          }
      },
      x_axis: {
          description: "X Axis Settings",
          displayName: "X Axis Settings",
          settingsGroups: {
              "Axis": {
                  xlimit_show: {
                      displayName: "Show X Axis",
                      type: "ToggleSwitch",
                      default: true
                  },
                  xlimit_colour: {
                      displayName: "Axis Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  xlimit_l: {
                      displayName: "Lower Limit",
                      type: "NumUpDown",
                      default: null
                  },
                  xlimit_u: {
                      displayName: "Upper Limit",
                      type: "NumUpDown",
                      default: null
                  }
              },
              "Ticks": {
                  xlimit_ticks: {
                      displayName: "Draw Ticks",
                      type: "ToggleSwitch",
                      default: true
                  },
                  xlimit_tick_count: {
                      displayName: "Maximum Ticks",
                      type: "NumUpDown",
                      default: 10,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  xlimit_tick_font: fontPicker("Tick Font", textOptions.font.default),
                  xlimit_tick_size: fontSize("Tick Font Size", textOptions.size.default),
                  xlimit_tick_colour: {
                      displayName: "Tick Font Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  xlimit_tick_rotation: {
                      displayName: "Tick Rotation (Degrees)",
                      type: "NumUpDown",
                      default: -35,
                      options: { minValue: { value: -360 }, maxValue: { value: 360 } }
                  }
              },
              "Label": {
                  xlimit_label: {
                      displayName: "Label",
                      type: "TextInput",
                      default: null
                  },
                  xlimit_label_font: fontPicker("Label Font", textOptions.font.default),
                  xlimit_label_size: fontSize("Label Font Size", textOptions.size.default),
                  xlimit_label_colour: {
                      displayName: "Label Font Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  }
              }
          }
      },
      y_axis: {
          description: "Y Axis Settings",
          displayName: "Y Axis Settings",
          settingsGroups: {
              "Axis": {
                  ylimit_show: {
                      displayName: "Show Y Axis",
                      type: "ToggleSwitch",
                      default: true
                  },
                  ylimit_colour: {
                      displayName: "Axis Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  limit_multiplier: {
                      displayName: "Axis Scaling Factor",
                      type: "NumUpDown",
                      default: 1.5,
                      options: { minValue: { value: 0 } }
                  },
                  ylimit_sig_figs: {
                      displayName: "Tick Decimal Places",
                      type: "NumUpDown",
                      default: null,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  ylimit_l: {
                      displayName: "Lower Limit",
                      type: "NumUpDown",
                      default: null
                  },
                  ylimit_u: {
                      displayName: "Upper Limit",
                      type: "NumUpDown",
                      default: null
                  }
              },
              "Ticks": {
                  ylimit_ticks: {
                      displayName: "Draw Ticks",
                      type: "ToggleSwitch",
                      default: true
                  },
                  ylimit_tick_count: {
                      displayName: "Maximum Ticks",
                      type: "NumUpDown",
                      default: 10,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  ylimit_tick_font: fontPicker("Tick Font", textOptions.font.default),
                  ylimit_tick_size: fontSize("Tick Font Size", textOptions.size.default),
                  ylimit_tick_colour: {
                      displayName: "Tick Font Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  ylimit_tick_rotation: {
                      displayName: "Tick Rotation (Degrees)",
                      type: "NumUpDown",
                      default: 0,
                      options: { minValue: { value: -360 }, maxValue: { value: 360 } }
                  }
              },
              "Label": {
                  ylimit_label: {
                      displayName: "Label",
                      type: "TextInput",
                      default: null
                  },
                  ylimit_label_font: fontPicker("Label Font", textOptions.font.default),
                  ylimit_label_size: fontSize("Label Font Size", textOptions.size.default),
                  ylimit_label_colour: {
                      displayName: "Label Font Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  }
              }
          }
      },
      dates: {
          description: "Date Settings",
          displayName: "Date Settings",
          settingsGroups: {
              "all": {
                  date_format_day: {
                      displayName: "Day Format",
                      type: "Dropdown",
                      default: "DD",
                      valid: ["DD", "Thurs DD", "Thursday DD", "(blank)"],
                      items: [
                          { displayName: "DD", value: "DD" },
                          { displayName: "Thurs DD", value: "Thurs DD" },
                          { displayName: "Thursday DD", value: "Thursday DD" },
                          { displayName: "(blank)", value: "(blank)" }
                      ]
                  },
                  date_format_month: {
                      displayName: "Month Format",
                      type: "Dropdown",
                      default: "MM",
                      valid: ["MM", "Mon", "Month", "(blank)"],
                      items: [
                          { displayName: "MM", value: "MM" },
                          { displayName: "Mon", value: "Mon" },
                          { displayName: "Month", value: "Month" },
                          { displayName: "(blank)", value: "(blank)" }
                      ]
                  },
                  date_format_year: {
                      displayName: "Year Format",
                      type: "Dropdown",
                      default: "YYYY",
                      valid: ["YYYY", "YY", "(blank)"],
                      items: [
                          { displayName: "YYYY", value: "YYYY" },
                          { displayName: "YY", value: "YY" },
                          { displayName: "(blank)", value: "(blank)" }
                      ]
                  },
                  date_format_delim: {
                      displayName: "Delimiter",
                      type: "Dropdown",
                      default: "/",
                      valid: ["/", "-", " "],
                      items: [
                          { displayName: "/", value: "/" },
                          { displayName: "-", value: "-" },
                          { displayName: " ", value: " " }
                      ]
                  },
                  date_format_locale: {
                      displayName: "Locale",
                      type: "Dropdown",
                      default: "en-GB",
                      valid: ["en-GB", "en-US"],
                      items: [
                          { displayName: "en-GB", value: "en-GB" },
                          { displayName: "en-US", value: "en-US" }
                      ]
                  }
              }
          }
      },
      summary_table: {
          description: "Summary Table Settings",
          displayName: "Summary Table Settings",
          settingsGroups: {
              "General": {
                  show_table: {
                      displayName: "Show Summary Table",
                      type: "ToggleSwitch",
                      default: false
                  },
                  table_variation_filter: {
                      displayName: "Filter by Variation Type",
                      type: "Dropdown",
                      default: "all",
                      valid: ["all", "common", "special", "improvement", "deterioration", "neutral"],
                      items: [
                          { displayName: "All", value: "all" },
                          { displayName: "Common Cause", value: "common" },
                          { displayName: "Special Cause - Any", value: "special" },
                          { displayName: "Special Cause - Improvement", value: "improvement" },
                          { displayName: "Special Cause - Deterioration", value: "deterioration" },
                          { displayName: "Special Cause - Neutral", value: "neutral" }
                      ]
                  },
                  table_assurance_filter: {
                      displayName: "Filter by Assurance Type",
                      type: "Dropdown",
                      default: "all",
                      valid: ["all", "any", "pass", "fail", "inconsistent"],
                      items: [
                          { displayName: "All", value: "all" },
                          { displayName: "Consistent - Any", value: "any" },
                          { displayName: "Consistent Pass", value: "pass" },
                          { displayName: "Consistent Fail", value: "fail" },
                          { displayName: "Inconsistent", value: "inconsistent" }
                      ]
                  },
                  table_text_overflow: {
                      displayName: "Text Overflow Handling",
                      type: "Dropdown",
                      default: textOptions.text_overflow.default,
                      valid: textOptions.text_overflow.valid,
                      items: [
                          { displayName: "Ellipsis", value: "ellipsis" },
                          { displayName: "Truncate", value: "clip" },
                          { displayName: "None", value: "none" }
                      ]
                  },
                  table_opacity: opacity("Default Opacity", 1),
                  table_opacity_selected: opacity("Opacity if Selected", 1),
                  table_opacity_unselected: opacity("Opacity if Unselected", 0.2),
                  table_outer_border_style: {
                      displayName: "Outer Border Style",
                      type: "Dropdown",
                      default: borderOptions.style.default,
                      valid: borderOptions.style.valid,
                      items: BORDER_STYLE_ITEMS
                  },
                  table_outer_border_width: {
                      displayName: "Outer Border Width",
                      type: "NumUpDown",
                      default: borderOptions.width.default,
                      options: borderOptions.width.options
                  },
                  table_outer_border_colour: {
                      displayName: "Outer Border Colour",
                      type: "ColorPicker",
                      default: borderOptions.colour.default,
                  },
                  table_outer_border_top: {
                      displayName: "Outer Border Top",
                      type: "ToggleSwitch",
                      default: true
                  },
                  table_outer_border_bottom: {
                      displayName: "Outer Border Bottom",
                      type: "ToggleSwitch",
                      default: true
                  },
                  table_outer_border_left: {
                      displayName: "Outer Border Left",
                      type: "ToggleSwitch",
                      default: true
                  },
                  table_outer_border_right: {
                      displayName: "Outer Border Right",
                      type: "ToggleSwitch",
                      default: true
                  }
              },
              "Header": {
                  table_header_font: fontPicker("Header Font", textOptions.font.default),
                  table_header_size: fontSize("Header Font Size", textOptions.size.default),
                  table_header_text_align: {
                      displayName: "Text Alignment",
                      type: "AlignmentGroup",
                      default: textOptions.text_align.default,
                      valid: textOptions.text_align.valid
                  },
                  table_header_font_weight: {
                      displayName: "Header Font Weight",
                      type: "Dropdown",
                      default: textOptions.weight.default,
                      valid: textOptions.weight.valid,
                      items: [
                          { displayName: "Normal", value: "normal" },
                          { displayName: "Bold", value: "bold" }
                      ]
                  },
                  table_header_text_transform: {
                      displayName: "Header Text Transform",
                      type: "Dropdown",
                      default: textOptions.text_transform.default,
                      valid: textOptions.text_transform.valid,
                      items: [
                          { displayName: "Uppercase", value: "uppercase" },
                          { displayName: "Lowercase", value: "lowercase" },
                          { displayName: "Capitalise", value: "capitalize" },
                          { displayName: "None", value: "none" }
                      ]
                  },
                  table_header_text_padding: {
                      displayName: "Padding Around Text",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  table_header_colour: {
                      displayName: "Header Font Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  table_header_bg_colour: {
                      displayName: "Header Background Colour",
                      type: "ColorPicker",
                      default: "#D3D3D3"
                  },
                  table_header_border_style: {
                      displayName: "Header Border Style",
                      type: "Dropdown",
                      default: borderOptions.style.default,
                      valid: borderOptions.style.valid,
                      items: BORDER_STYLE_ITEMS
                  },
                  table_header_border_width: {
                      displayName: "Header Border Width",
                      type: "NumUpDown",
                      default: borderOptions.width.default,
                      options: borderOptions.width.options
                  },
                  table_header_border_colour: {
                      displayName: "Header Border Colour",
                      type: "ColorPicker",
                      default: borderOptions.colour.default,
                  },
                  table_header_border_bottom: {
                      displayName: "Bottom Border",
                      type: "ToggleSwitch",
                      default: true
                  },
                  table_header_border_inner: {
                      displayName: "Inner Borders",
                      type: "ToggleSwitch",
                      default: true
                  }
              },
              "Body": {
                  table_body_font: fontPicker("Body Font", textOptions.font.default),
                  table_body_size: fontSize("Body Font Size", textOptions.size.default),
                  table_body_text_align: {
                      displayName: "Text Alignment",
                      type: "AlignmentGroup",
                      default: textOptions.text_align.default,
                      valid: textOptions.text_align.valid
                  },
                  table_body_font_weight: {
                      displayName: "Font Weight",
                      type: "Dropdown",
                      default: textOptions.weight.default,
                      valid: textOptions.weight.valid,
                      items: [
                          { displayName: "Normal", value: "normal" },
                          { displayName: "Bold", value: "bold" }
                      ]
                  },
                  table_body_text_transform: {
                      displayName: "Text Transform",
                      type: "Dropdown",
                      default: textOptions.text_transform.default,
                      valid: textOptions.text_transform.valid,
                      items: [
                          { displayName: "Uppercase", value: "uppercase" },
                          { displayName: "Lowercase", value: "lowercase" },
                          { displayName: "Capitalise", value: "capitalize" },
                          { displayName: "None", value: "none" }
                      ]
                  },
                  table_body_text_padding: {
                      displayName: "Padding Around Text",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  table_body_colour: {
                      displayName: "Body Font Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  table_body_bg_colour: {
                      displayName: "Body Background Colour",
                      type: "ColorPicker",
                      default: "#FFFFFF"
                  },
                  table_body_border_style: {
                      displayName: "Body Border Style",
                      type: "Dropdown",
                      default: borderOptions.style.default,
                      valid: borderOptions.style.valid,
                      items: BORDER_STYLE_ITEMS
                  },
                  table_body_border_width: {
                      displayName: "Body Border Width",
                      type: "NumUpDown",
                      default: borderOptions.width.default,
                      options: borderOptions.width.options
                  },
                  table_body_border_colour: {
                      displayName: "Body Border Colour",
                      type: "ColorPicker",
                      default: borderOptions.colour.default,
                  },
                  table_body_border_top_bottom: {
                      displayName: "Top/Bottom Borders",
                      type: "ToggleSwitch",
                      default: true
                  },
                  table_body_border_left_right: {
                      displayName: "Left/Right Borders",
                      type: "ToggleSwitch",
                      default: true
                  }
              }
          }
      },
      download_options: {
          description: "Download Options",
          displayName: "Download Options",
          settingsGroups: {
              "all": {
                  show_button: {
                      displayName: "Show Download Button",
                      type: "ToggleSwitch",
                      default: false
                  }
              }
          }
      },
      labels: {
          description: "Labels Settings",
          displayName: "Labels Settings",
          settingsGroups: {
              "all": {
                  show_labels: {
                      displayName: "Show Value Labels",
                      type: "ToggleSwitch",
                      default: true
                  },
                  label_position: {
                      displayName: "Label Position",
                      type: "Dropdown",
                      default: "top",
                      valid: ["top", "bottom"],
                      items: [
                          { displayName: "Top", value: "top" },
                          { displayName: "Bottom", value: "bottom" }
                      ]
                  },
                  label_y_offset: {
                      displayName: "Label Offset from Top/Bottom (px)",
                      type: "NumUpDown",
                      default: 20
                  },
                  label_line_offset: {
                      displayName: "Label Offset from Connecting Line (px)",
                      type: "NumUpDown",
                      default: 5
                  },
                  label_angle_offset: {
                      displayName: "Label Angle Offset (degrees)",
                      type: "NumUpDown",
                      default: 0,
                      options: { minValue: { value: -90 }, maxValue: { value: 90 } }
                  },
                  label_font: fontPicker("Label Font", textOptions.font.default),
                  label_size: fontSize("Label Font Size", textOptions.size.default),
                  label_colour: {
                      displayName: "Label Font Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  label_line_colour: {
                      displayName: "Connecting Line Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  label_line_width: lineWidth("Connecting Line Width", 1),
                  label_line_type: lineType("Connecting Line Type", "10 0"),
                  label_line_max_length: {
                      displayName: "Max Connecting Line Length (px)",
                      type: "NumUpDown",
                      default: 1000,
                      options: { minValue: { value: 0 }, maxValue: { value: 10000 } }
                  },
                  label_marker_show: {
                      displayName: "Show Line Markers",
                      type: "ToggleSwitch",
                      default: true
                  },
                  label_marker_offset: {
                      displayName: "Marker Offset from Value (px)",
                      type: "NumUpDown",
                      default: 5
                  },
                  label_marker_size: {
                      displayName: "Marker Size",
                      type: "NumUpDown",
                      default: 3,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  label_marker_colour: {
                      displayName: "Marker Fill Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  label_marker_outline_colour: {
                      displayName: "Marker Outline Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  }
              }
          }
      }
  };
  const defaultSettingsArray = [];
  for (const key in settingsModel) {
      const curr_card = [];
      for (const group in settingsModel[key].settingsGroups) {
          for (const setting in settingsModel[key].settingsGroups[group]) {
              curr_card.push([setting, settingsModel[key].settingsGroups[group][setting]]);
          }
      }
      defaultSettingsArray.push([key, Object.fromEntries(curr_card)]);
  }
  const defaultSettings = Object.fromEntries(defaultSettingsArray);

  function drawXAxis(selection, visualObj) {
      const xAxisGroup = selection.select(".xaxisgroup");
      const xAxisLabel = selection.select(".xaxislabel");
      if (!visualObj.viewModel.inputSettings.settings[0].x_axis.xlimit_show) {
          xAxisGroup.remove();
          xAxisLabel.remove();
          return;
      }
      if (xAxisGroup.empty()) {
          selection.append('g').classed("xaxisgroup", true);
      }
      if (xAxisLabel.empty()) {
          selection.append('text').classed('xaxislabel', true);
      }
      const xAxisProperties = visualObj.plotProperties.xAxis;
      const xAxis = axisBottom(visualObj.plotProperties.xScale);
      if (xAxisProperties.ticks) {
          if (xAxisProperties.tick_count) {
              xAxis.ticks(xAxisProperties.tick_count);
          }
          if (visualObj.viewModel.tickLabels) {
              xAxis.tickFormat(axisX => {
                  const targetKey = visualObj.viewModel.tickLabels.filter(d => d.x == axisX);
                  return targetKey.length > 0 ? targetKey[0].label : "";
              });
          }
      }
      else {
          xAxis.tickValues([]);
      }
      const plotHeight = visualObj.viewModel.svgHeight;
      const xAxisHeight = plotHeight - visualObj.plotProperties.yAxis.start_padding;
      const displayPlot = visualObj.plotProperties.displayPlot;
      xAxisGroup
          .call(xAxis)
          .attr("color", displayPlot ? xAxisProperties.colour : "#FFFFFF")
          .attr("transform", `translate(0, ${xAxisHeight})`)
          .selectAll(".tick text")
          .style("text-anchor", xAxisProperties.tick_rotation < 0.0 ? "end" : "start")
          .attr("dx", xAxisProperties.tick_rotation < 0.0 ? "-.8em" : ".8em")
          .attr("dy", xAxisProperties.tick_rotation < 0.0 ? "-.15em" : ".15em")
          .attr("transform", "rotate(" + xAxisProperties.tick_rotation + ")")
          .style("font-size", xAxisProperties.tick_size)
          .style("font-family", xAxisProperties.tick_font)
          .style("fill", displayPlot ? xAxisProperties.tick_colour : "#FFFFFF");
      const textX = visualObj.viewModel.svgWidth / 2;
      let textY;
      if (visualObj.viewModel.frontend) {
          textY = plotHeight - (visualObj.plotProperties.yAxis.start_padding / 3);
      }
      else {
          const xAxisNode = selection.selectAll(".xaxisgroup").node();
          if (!xAxisNode) {
              selection.select(".xaxislabel")
                  .style("fill", displayPlot ? xAxisProperties.label_colour : "#FFFFFF");
              return;
          }
          const xAxisCoordinates = xAxisNode.getBoundingClientRect();
          textY = plotHeight - ((plotHeight - xAxisCoordinates.bottom) / 2);
      }
      selection.select(".xaxislabel")
          .attr("x", textX)
          .attr("y", textY)
          .style("text-anchor", "middle")
          .text(xAxisProperties.label)
          .style("font-size", xAxisProperties.label_size)
          .style("font-family", xAxisProperties.label_font)
          .style("fill", displayPlot ? xAxisProperties.label_colour : "#FFFFFF");
  }

  function isNullOrUndefined(value) {
      return value === null || value === undefined;
  }

  function drawYAxis(selection, visualObj) {
      const yAxisGroup = selection.select(".yaxisgroup");
      const yAxisLabel = selection.select(".yaxislabel");
      if (!visualObj.viewModel.inputSettings.settings[0].y_axis.ylimit_show) {
          yAxisGroup.remove();
          yAxisLabel.remove();
          return;
      }
      if (yAxisGroup.empty()) {
          selection.append('g').classed("yaxisgroup", true);
      }
      if (yAxisLabel.empty()) {
          selection.append('text').classed('yaxislabel', true);
      }
      const yAxisProperties = visualObj.plotProperties.yAxis;
      const yAxis = axisLeft(visualObj.plotProperties.yScale);
      const yaxis_sig_figs = visualObj.viewModel.inputSettings.settings[0].y_axis.ylimit_sig_figs;
      const sig_figs = isNullOrUndefined(yaxis_sig_figs) ? visualObj.viewModel.inputSettings.settings[0].spc.sig_figs : yaxis_sig_figs;
      const displayPlot = visualObj.plotProperties.displayPlot;
      if (yAxisProperties.ticks) {
          if (yAxisProperties.tick_count) {
              yAxis.ticks(yAxisProperties.tick_count);
          }
          if (visualObj.viewModel.inputData.length > 0 && visualObj.viewModel.inputData[0]) {
              const derivedSettings = visualObj.viewModel.inputSettings.derivedSettings[0];
              yAxis.tickFormat((d) => {
                  return derivedSettings.percentLabels
                      ? d.toFixed(sig_figs) + "%"
                      : d.toFixed(sig_figs);
              });
          }
      }
      else {
          yAxis.tickValues([]);
      }
      yAxisGroup
          .call(yAxis)
          .attr("color", displayPlot ? yAxisProperties.colour : "#FFFFFF")
          .attr("transform", `translate(${visualObj.plotProperties.xAxis.start_padding}, 0)`)
          .selectAll(".tick text")
          .style("text-anchor", "right")
          .attr("transform", `rotate(${yAxisProperties.tick_rotation})`)
          .style("font-size", yAxisProperties.tick_size)
          .style("font-family", yAxisProperties.tick_font)
          .style("fill", displayPlot ? yAxisProperties.tick_colour : "#FFFFFF");
      let textX;
      const textY = visualObj.viewModel.svgHeight / 2;
      if (visualObj.viewModel.frontend) {
          textX = visualObj.plotProperties.xAxis.start_padding / 2;
      }
      else {
          const yAxisNode = selection.selectAll(".yaxisgroup").node();
          if (!yAxisNode) {
              selection.select(".yaxislabel")
                  .style("fill", displayPlot ? yAxisProperties.label_colour : "#FFFFFF");
              return;
          }
          const yAxisCoordinates = yAxisNode.getBoundingClientRect();
          textX = yAxisCoordinates.x * 0.7;
      }
      selection.select(".yaxislabel")
          .attr("x", textX)
          .attr("y", textY)
          .attr("transform", `rotate(-90, ${textX}, ${textY})`)
          .text(yAxisProperties.label)
          .style("text-anchor", "middle")
          .style("font-size", yAxisProperties.label_size)
          .style("font-family", yAxisProperties.label_font)
          .style("fill", displayPlot ? yAxisProperties.label_colour : "#FFFFFF");
  }

  function drawTooltipLine(selection, visualObj) {
      const plotProperties = visualObj.plotProperties;
      const colour = visualObj.viewModel.colourPalette.isHighContrast
          ? visualObj.viewModel.colourPalette.foregroundColour
          : "black";
      const xAxisLine = selection
          .select(".ttip-line-x")
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y1", plotProperties.yAxis.end_padding)
          .attr("y2", visualObj.viewModel.svgHeight - plotProperties.yAxis.start_padding)
          .attr("stroke-width", "1px")
          .attr("stroke", colour)
          .style("stroke-opacity", 0);
      const yAxisLine = selection
          .select(".ttip-line-y")
          .attr("x1", plotProperties.xAxis.start_padding)
          .attr("x2", visualObj.viewModel.svgWidth - plotProperties.xAxis.end_padding)
          .attr("y1", 0)
          .attr("y2", 0)
          .attr("stroke-width", "1px")
          .attr("stroke", colour)
          .style("stroke-opacity", 0);
      selection.on("mousemove", (event) => {
          if (!plotProperties.displayPlot) {
              return;
          }
          const plotPoints = visualObj.viewModel.plotPoints[0];
          const boundRect = visualObj.svg.node().getBoundingClientRect();
          const xValue = (event.pageX - boundRect.left);
          let indexNearestValue;
          let nearestDistance = Infinity;
          let x_coord;
          let y_coord;
          for (let i = 0; i < plotPoints.length; i++) {
              const curr_x = plotProperties.xScale(plotPoints[i].x);
              const curr_diff = Math.abs(curr_x - xValue);
              if (curr_diff < nearestDistance) {
                  nearestDistance = curr_diff;
                  indexNearestValue = i;
                  x_coord = curr_x;
                  y_coord = plotProperties.yScale(plotPoints[i].value);
              }
          }
          visualObj.host.tooltipService.show({
              dataItems: plotPoints[indexNearestValue].tooltip,
              identities: [plotPoints[indexNearestValue].identity],
              coordinates: [x_coord, y_coord],
              isTouchEvent: false
          });
          xAxisLine.style("stroke-opacity", 0.4)
              .attr("x1", x_coord)
              .attr("x2", x_coord);
          yAxisLine.style("stroke-opacity", 0.4)
              .attr("y1", y_coord)
              .attr("y2", y_coord);
      })
          .on("mouseleave", () => {
          if (!plotProperties.displayPlot) {
              return;
          }
          visualObj.host.tooltipService.hide({ immediately: true, isTouchEvent: false });
          xAxisLine.style("stroke-opacity", 0);
          yAxisLine.style("stroke-opacity", 0);
      });
  }

  const lineNameMap = {
      "ll99": "99",
      "ll95": "95",
      "ll68": "68",
      "ul68": "68",
      "ul95": "95",
      "ul99": "99",
      "targets": "target",
      "values": "main",
      "alt_targets": "alt_target",
      "speclimits_lower": "specification",
      "speclimits_upper": "specification",
      "trend_line": "trend",
  };
  function getAesthetic(type, group, aesthetic, inputSettings) {
      const mapName = group.includes("line") ? lineNameMap[type] : type;
      const settingName = aesthetic + "_" + mapName;
      return inputSettings[group][settingName];
  }

  function between(x, lower, upper) {
      let is_between = true;
      if (!isNullOrUndefined(lower)) {
          is_between = is_between && (x >= lower);
      }
      if (!isNullOrUndefined(upper)) {
          is_between = is_between && (x <= upper);
      }
      return is_between;
  }

  function drawLines(selection, visualObj) {
      const ylower = visualObj.plotProperties.yAxis.lower;
      const yupper = visualObj.plotProperties.yAxis.upper;
      const xlower = visualObj.plotProperties.xAxis.lower;
      const xupper = visualObj.plotProperties.xAxis.upper;
      selection
          .select(".linesgroup")
          .selectAll(".linegroup")
          .data(visualObj.viewModel.groupedLines)
          .join("g")
          .classed("linegroup", true)
          .each(function (currLineDataFull) {
          const currLine = currLineDataFull[0];
          const currLineData = currLineDataFull[1].filter((d) => between(d.x, xlower, xupper));
          const n = currLineData.length;
          let yValidStatus = new Array(n);
          let anyValid = false;
          let xValues = new Array(n);
          let yValues = new Array(n);
          for (let i = 0; i < n; i++) {
              const currPoint = currLineData[i];
              xValues[i] = visualObj.plotProperties.xScale(currPoint.x);
              yValues[i] = visualObj.plotProperties.yScale(currPoint.line_value);
              yValidStatus[i] = !isNullOrUndefined(currPoint.line_value) && between(currPoint.line_value, ylower, yupper);
              anyValid = anyValid || yValidStatus[i];
          }
          if (!anyValid) {
              select(this).selectAll("line").remove();
              return;
          }
          select(this)
              .selectAll("line")
              .data(currLineData.slice(1))
              .join("line")
              .attr("x1", (_, idx) => yValidStatus[idx] ? xValues[idx] : xValues[idx + 1])
              .attr("y1", (_, idx) => yValidStatus[idx] ? yValues[idx] : yValues[idx + 1])
              .attr("x2", (_, idx) => yValidStatus[idx + 1] ? xValues[idx + 1] : xValues[idx])
              .attr("y2", (_, idx) => yValidStatus[idx + 1] ? yValues[idx + 1] : yValues[idx])
              .attr("fill", "none")
              .attr("stroke", (d) => {
              return visualObj.viewModel.colourPalette.isHighContrast
                  ? visualObj.viewModel.colourPalette.foregroundColour
                  : getAesthetic(currLine, "lines", "colour", { lines: d.aesthetics });
          })
              .attr("stroke-width", (d) => getAesthetic(currLine, "lines", "width", { lines: d.aesthetics }))
              .attr("stroke-dasharray", (d) => getAesthetic(currLine, "lines", "type", { lines: d.aesthetics }))
              .attr("stroke-dashoffset", (_, idx) => {
              const prev_x = visualObj.plotProperties.xScale(currLineData[0].x);
              const curr_x = visualObj.plotProperties.xScale(currLineData[idx].x);
              return curr_x - prev_x;
          });
      });
  }

  function drawDots(selection, visualObj) {
      if (!visualObj.viewModel.inputSettings.settings[0].scatter.show_dots) {
          selection
              .select(".dotsgroup")
              .selectAll("path")
              .data([])
              .join("path")
              .remove();
          return;
      }
      const ylower = visualObj.plotProperties.yAxis.lower;
      const yupper = visualObj.plotProperties.yAxis.upper;
      const xlower = visualObj.plotProperties.xAxis.lower;
      const xupper = visualObj.plotProperties.xAxis.upper;
      selection
          .select(".dotsgroup")
          .selectAll("path")
          .data(visualObj.viewModel.plotPoints[0])
          .join("path")
          .filter((d) => !isNullOrUndefined(d.value))
          .attr("d", (d) => {
          const shape = d.aesthetics.shape;
          const size = d.aesthetics.size;
          return Symbol$1().type(d3[`symbol${shape}`]).size((size * size) * Math.PI)();
      })
          .attr("transform", (d) => {
          if (!between(d.value, ylower, yupper) || !between(d.x, xlower, xupper)) {
              return "translate(0, 0) scale(0)";
          }
          return `translate(${visualObj.plotProperties.xScale(d.x)}, ${visualObj.plotProperties.yScale(d.value)})`;
      })
          .style("fill", (d) => {
          return d.aesthetics.colour;
      })
          .style("stroke", (d) => {
          return d.aesthetics.colour_outline;
      })
          .style("stroke-width", (d) => d.aesthetics.width_outline)
          .on("click", (event, d) => {
          if (visualObj.host.hostCapabilities.allowInteractions) {
              if (visualObj.viewModel.inputSettings.settings[0].spc.split_on_click) {
                  const xIndex = visualObj.viewModel.splitIndexes.indexOf(d.x);
                  if (xIndex > -1) {
                      visualObj.viewModel.splitIndexes.splice(xIndex, 1);
                  }
                  else {
                      visualObj.viewModel.splitIndexes.push(d.x);
                  }
                  visualObj.host.persistProperties({
                      replace: [{
                              objectName: "split_indexes_storage",
                              selector: undefined,
                              properties: { split_indexes: JSON.stringify(visualObj.viewModel.splitIndexes) }
                          }]
                  });
              }
              else {
                  visualObj.selectionManager
                      .select(d.identity, (event.ctrlKey || event.metaKey))
                      .then(() => {
                      visualObj.updateHighlighting();
                  });
              }
              event.stopPropagation();
          }
      })
          .on("mouseover", (event, d) => {
          const x = event.pageX;
          const y = event.pageY;
          visualObj.host.tooltipService.show({
              dataItems: d.tooltip,
              identities: [d.identity],
              coordinates: [x, y],
              isTouchEvent: false
          });
      })
          .on("mouseout", () => {
          visualObj.host.tooltipService.hide({
              immediately: true,
              isTouchEvent: false
          });
      });
      selection.on('click', () => {
          visualObj.selectionManager.clear();
          visualObj.updateHighlighting();
      });
  }

  function commonCause(selection) {
      selection.append("g")
          .attr("clip-path", "url(#clip2)")
          .append("g")
          .attr("clip-path", "url(#clip3)")
          .attr("filter", "url(#fx0)")
          .attr("transform", "translate(16 25)")
          .append("g")
          .attr("clip-path", "url(#clip4)")
          .append("path")
          .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
          .attr("stroke", "#A6A6A6")
          .attr("stroke-width", "21")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
          .attr("stroke", "#A6A6A6")
          .attr("stroke-width", "20")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M106.903 196.084 144.607 228.433 138.766 235.241 101.062 202.892Z")
          .attr("stroke", "#A6A6A6")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#A6A6A6")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M146.159 218.909 179.921 159.846 187.708 164.298 153.946 223.361Z")
          .attr("stroke", "#A6A6A6")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#A6A6A6")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M198.708 154.94 239.365 214.134 231.971 219.212 191.314 160.019Z")
          .attr("stroke", "#A6A6A6")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#A6A6A6")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M238.825 216.117 285.383 198.784 288.512 207.19 241.954 224.523Z")
          .attr("stroke", "#A6A6A6")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#A6A6A6")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M76.5001 195C76.5001 183.678 85.6782 174.5 97.0001 174.5 108.322 174.5 117.5 183.678 117.5 195 117.5 206.322 108.322 215.5 97.0001 215.5 85.6782 215.5 76.5001 206.322 76.5001 195Z")
          .attr("stroke", "#A6A6A6")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#A6A6A6")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M123.5 233C123.5 221.678 132.678 212.5 144 212.5 155.322 212.5 164.5 221.678 164.5 233 164.5 244.322 155.322 253.5 144 253.5 132.678 253.5 123.5 244.322 123.5 233Z")
          .attr("stroke", "#A6A6A6")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#A6A6A6")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M170.5 153.5C170.5 141.902 179.902 132.5 191.5 132.5 203.098 132.5 212.5 141.902 212.5 153.5 212.5 165.098 203.098 174.5 191.5 174.5 179.902 174.5 170.5 165.098 170.5 153.5Z")
          .attr("stroke", "#A6A6A6")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#A6A6A6")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M217.5 221.5C217.5 209.902 226.902 200.5 238.5 200.5 250.098 200.5 259.5 209.902 259.5 221.5 259.5 233.098 250.098 242.5 238.5 242.5 226.902 242.5 217.5 233.098 217.5 221.5Z")
          .attr("stroke", "#A6A6A6")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#A6A6A6")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M265.5 206.5C265.5 194.902 274.678 185.5 286 185.5 297.322 185.5 306.5 194.902 306.5 206.5 306.5 218.098 297.322 227.5 286 227.5 274.678 227.5 265.5 218.098 265.5 206.5Z")
          .attr("stroke", "#A6A6A6")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#A6A6A6")
          .attr("fill-rule", "evenodd");
  }

  function concernHigh(selection) {
      selection.append("g")
          .attr("clip-path", "url(#clip2)")
          .append("g")
          .attr("clip-path", "url(#clip3)")
          .attr("filter", "url(#fx0)")
          .attr("transform", "translate(16 25)")
          .append("g")
          .attr("clip-path", "url(#clip4)")
          .append("path")
          .attr("d", "M0 155.53C-1.9801e-14 69.6331 69.6331-1.9801e-14 155.53-3.96021e-14 241.427-7.92042e-14 311.06 69.6331 311.06 155.53 311.06 241.427 241.427 311.06 155.53 311.06 69.6331 311.06-9.90052e-14 241.427 0 155.53Z")
          .attr("stroke", "#E46C0A")
          .attr("stroke-width", "21")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 17.47 328.36)");
      selection.append("path")
          .attr("d", "M0 151C-1.92243e-14 67.605 67.605-1.92243e-14 151-3.84486e-14 234.395-7.68973e-14 302 67.605 302 151 302 234.395 234.395 302 151 302 67.605 302-9.61216e-14 234.395 0 151Z")
          .attr("stroke", "#E46C0A")
          .attr("stroke-width", "20")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 38 340)");
      selection.append("text")
          .attr("fill", "#E46C0A")
          .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
          .attr("font-weight", "700")
          .attr("font-size", "11.7")
          .attr("transform", "translate(106.228 172) scale(10, 10)")
          .text("H");
      selection.append("rect")
          .attr("x", "0")
          .attr("y", "0")
          .attr("width", "49.6797")
          .attr("height", "8.97008")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("transform", "matrix(0.919094 0.394039 0.394039 -0.919094 95.4025 215.096)");
      selection.append("rect")
          .attr("x", "0")
          .attr("y", "0")
          .attr("width", "49.6797")
          .attr("height", "8.97008")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("transform", "matrix(0.880045 -0.47489 -0.47489 -0.880045 149.897 232.457)");
      selection.append("rect")
          .attr("x", "0")
          .attr("y", "0")
          .attr("width", "49.6797")
          .attr("height", "8.97008")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("transform", "matrix(0.715824 -0.698281 -0.698281 -0.715824 199.882 206.276)");
      selection.append("rect")
          .attr("x", "0")
          .attr("y", "0")
          .attr("width", "49.6797")
          .attr("height", "8.97008")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("transform", "matrix(0.937161 0.348898 0.348898 -0.937161 238.113 168.387)");
      selection.append("path")
          .attr("d", "M0 21C-2.60992e-15 9.40202 9.17816-2.67358e-15 20.5-5.34716e-15 31.8218-1.06943e-14 41 9.40202 41 21 41 32.598 31.8218 42 20.5 42 9.17816 42-1.30496e-14 32.598 0 21Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 76.5001 231.5)");
      selection.append("path")
          .attr("d", "M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 123.5 249.5)");
      selection.append("path")
          .attr("d", "M0 21C-2.67358e-15 9.40202 9.40202-2.67358e-15 21-5.34716e-15 32.598-1.06943e-14 42 9.40202 42 21 42 32.598 32.598 42 21 42 9.40202 42-1.33679e-14 32.598 0 21Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 170.5 231.5)");
      selection.append("path")
          .attr("d", "M0 20.5C-2.67358e-15 9.17816 9.40202-2.60992e-15 21-5.21985e-15 32.598-1.04397e-14 42 9.17816 42 20.5 42 31.8218 32.598 41 21 41 9.40202 41-1.33679e-14 31.8218 0 20.5Z")
          .attr("stroke", "#E46C0A")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#E46C0A")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 217.5 185.5)");
      selection.append("path")
          .attr("d", "M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z")
          .attr("stroke", "#E46C0A")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#E46C0A")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 265.5 200.5)");
  }

  function concernLow(selection) {
      selection.append("g")
          .attr("clip-path", "url(#clip2)")
          .append("g")
          .attr("clip-path", "url(#clip3)")
          .attr("filter", "url(#fx0)")
          .attr("transform", "translate(16 25)")
          .append("g")
          .attr("clip-path", "url(#clip4)")
          .append("path")
          .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
          .attr("stroke", "#E46C0A")
          .attr("stroke-width", "21")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
          .attr("stroke", "#E46C0A")
          .attr("stroke-width", "20")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("text")
          .attr("fill", "#E46C0A")
          .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
          .attr("font-weight", "700")
          .attr("font-size", "11.7")
          .attr("transform", "translate(106.228 292) scale(10, 10)")
          .text("L");
      selection.append("path")
          .attr("d", "M95.4025 162.857 141.063 143.281 144.597 151.525 98.9371 171.101Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M149.897 145.496 193.618 169.089 189.358 176.983 145.638 153.39Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M199.882 171.677 235.443 206.367 229.18 212.788 193.618 178.098Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M238.113 209.566 284.671 192.233 287.8 200.639 241.243 217.972Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M76.5001 168.5C76.5001 156.902 85.6782 147.5 97.0001 147.5 108.322 147.5 117.5 156.902 117.5 168.5 117.5 180.098 108.322 189.5 97.0001 189.5 85.6782 189.5 76.5001 180.098 76.5001 168.5Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M123.5 150C123.5 138.678 132.678 129.5 144 129.5 155.322 129.5 164.5 138.678 164.5 150 164.5 161.322 155.322 170.5 144 170.5 132.678 170.5 123.5 161.322 123.5 150Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M170.5 168.5C170.5 156.902 179.902 147.5 191.5 147.5 203.098 147.5 212.5 156.902 212.5 168.5 212.5 180.098 203.098 189.5 191.5 189.5 179.902 189.5 170.5 180.098 170.5 168.5Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M217.5 214C217.5 202.678 226.902 193.5 238.5 193.5 250.098 193.5 259.5 202.678 259.5 214 259.5 225.322 250.098 234.5 238.5 234.5 226.902 234.5 217.5 225.322 217.5 214Z")
          .attr("stroke", "#E46C0A")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#E46C0A")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M265.5 199C265.5 187.678 274.678 178.5 286 178.5 297.322 178.5 306.5 187.678 306.5 199 306.5 210.322 297.322 219.5 286 219.5 274.678 219.5 265.5 210.322 265.5 199Z")
          .attr("stroke", "#E46C0A")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#E46C0A")
          .attr("fill-rule", "evenodd");
  }

  function improvementHigh(selection) {
      selection.append("g")
          .attr("clip-path", "url(#clip2)")
          .append("g")
          .attr("clip-path", "url(#clip3)")
          .attr("filter", "url(#fx0)")
          .attr("transform", "translate(16 25)")
          .append("g")
          .attr("clip-path", "url(#clip4)")
          .append("path")
          .attr("d", "M0 155.53C-1.9801e-14 69.6331 69.6331-1.9801e-14 155.53-3.96021e-14 241.427-7.92042e-14 311.06 69.6331 311.06 155.53 311.06 241.427 241.427 311.06 155.53 311.06 69.6331 311.06-9.90052e-14 241.427 0 155.53Z")
          .attr("stroke", "#00B0F0")
          .attr("stroke-width", "21")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 17.47 328.36)");
      selection.append("path")
          .attr("d", "M0 151C-1.92243e-14 67.605 67.605-1.92243e-14 151-3.84486e-14 234.395-7.68973e-14 302 67.605 302 151 302 234.395 234.395 302 151 302 67.605 302-9.61216e-14 234.395 0 151Z")
          .attr("stroke", "#00B0F0")
          .attr("stroke-width", "20")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 38 340)");
      selection.append("text")
          .attr("fill", "#00B0F0")
          .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
          .attr("font-weight", "700")
          .attr("font-size", "11.7")
          .attr("transform", "translate(106.228 172) scale(10, 10)")
          .text("H");
      selection.append("rect")
          .attr("x", "0")
          .attr("y", "0")
          .attr("width", "49.6797")
          .attr("height", "8.97008")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("transform", "matrix(0.919094 0.394039 0.394039 -0.919094 95.4025 215.096)");
      selection.append("rect")
          .attr("x", "0")
          .attr("y", "0")
          .attr("width", "49.6797")
          .attr("height", "8.97008")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("transform", "matrix(0.880045 -0.47489 -0.47489 -0.880045 149.897 232.457)");
      selection.append("rect")
          .attr("x", "0")
          .attr("y", "0")
          .attr("width", "49.6797")
          .attr("height", "8.97008")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("transform", "matrix(0.715824 -0.698281 -0.698281 -0.715824 199.882 206.276)");
      selection.append("rect")
          .attr("x", "0")
          .attr("y", "0")
          .attr("width", "49.6797")
          .attr("height", "8.97008")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("transform", "matrix(0.937161 0.348898 0.348898 -0.937161 238.113 168.387)");
      selection.append("path")
          .attr("d", "M0 21C-2.60992e-15 9.40202 9.17816-2.67358e-15 20.5-5.34716e-15 31.8218-1.06943e-14 41 9.40202 41 21 41 32.598 31.8218 42 20.5 42 9.17816 42-1.30496e-14 32.598 0 21Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 76.5001 231.5)");
      selection.append("path")
          .attr("d", "M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 123.5 249.5)");
      selection.append("path")
          .attr("d", "M0 21C-2.67358e-15 9.40202 9.40202-2.67358e-15 21-5.34716e-15 32.598-1.06943e-14 42 9.40202 42 21 42 32.598 32.598 42 21 42 9.40202 42-1.33679e-14 32.598 0 21Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 170.5 231.5)");
      selection.append("path")
          .attr("d", "M0 20.5C-2.67358e-15 9.17816 9.40202-2.60992e-15 21-5.21985e-15 32.598-1.04397e-14 42 9.17816 42 20.5 42 31.8218 32.598 41 21 41 9.40202 41-1.33679e-14 31.8218 0 20.5Z")
          .attr("stroke", "#00B0F0")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#00B0F0")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 217.5 185.5)");
      selection.append("path")
          .attr("d", "M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z")
          .attr("stroke", "#00B0F0")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#00B0F0")
          .attr("fill-rule", "evenodd")
          .attr("transform", "matrix(1 0 0 -1 265.5 200.5)");
  }

  function improvementLow(selection) {
      selection.append("g")
          .attr("clip-path", "url(#clip2)")
          .append("g")
          .attr("clip-path", "url(#clip3)")
          .attr("filter", "url(#fx0)")
          .attr("transform", "translate(16 25)")
          .append("g")
          .attr("clip-path", "url(#clip4)")
          .append("path")
          .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
          .attr("stroke", "#00B0F0")
          .attr("stroke-width", "21")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
          .attr("stroke", "#00B0F0")
          .attr("stroke-width", "20")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("text")
          .attr("fill", "#00B0F0")
          .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
          .attr("font-weight", "700")
          .attr("font-size", "11.7")
          .attr("transform", "translate(106.228 292) scale(10, 10)")
          .text("L");
      selection.append("path")
          .attr("d", "M95.4025 162.857 141.063 143.281 144.597 151.525 98.9371 171.101Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M149.897 145.496 193.618 169.089 189.358 176.983 145.638 153.39Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M199.882 171.677 235.443 206.367 229.18 212.788 193.618 178.098Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M238.113 209.566 284.671 192.233 287.8 200.639 241.243 217.972Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M76.5001 168.5C76.5001 156.902 85.6782 147.5 97.0001 147.5 108.322 147.5 117.5 156.902 117.5 168.5 117.5 180.098 108.322 189.5 97.0001 189.5 85.6782 189.5 76.5001 180.098 76.5001 168.5Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M123.5 150C123.5 138.678 132.678 129.5 144 129.5 155.322 129.5 164.5 138.678 164.5 150 164.5 161.322 155.322 170.5 144 170.5 132.678 170.5 123.5 161.322 123.5 150Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M170.5 168.5C170.5 156.902 179.902 147.5 191.5 147.5 203.098 147.5 212.5 156.902 212.5 168.5 212.5 180.098 203.098 189.5 191.5 189.5 179.902 189.5 170.5 180.098 170.5 168.5Z")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#7F7F7F")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M217.5 214C217.5 202.678 226.902 193.5 238.5 193.5 250.098 193.5 259.5 202.678 259.5 214 259.5 225.322 250.098 234.5 238.5 234.5 226.902 234.5 217.5 225.322 217.5 214Z")
          .attr("stroke", "#00B0F0")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#00B0F0")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M265.5 199C265.5 187.678 274.678 178.5 286 178.5 297.322 178.5 306.5 187.678 306.5 199 306.5 210.322 297.322 219.5 286 219.5 274.678 219.5 265.5 210.322 265.5 199Z")
          .attr("stroke", "#00B0F0")
          .attr("stroke-width", "2.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#00B0F0")
          .attr("fill-rule", "evenodd");
  }

  function neutralHigh(selection) {
      selection.append("g")
          .attr("clip-path", "url(#clip2)")
          .append("g")
          .attr("clip-path", "url(#clip3)")
          .attr("filter", "url(#fx0)")
          .attr("transform", "translate(16 25)")
          .append("g")
          .attr("clip-path", "url(#clip4)")
          .append("path")
          .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
          .attr("stroke", "#490092")
          .attr("stroke-width", "21")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
          .attr("stroke", "#490092")
          .attr("stroke-width", "20")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M103.652 242.245 180.02 165.878 151.735 137.593 258.273 119.68 240.359 226.217 212.075 197.933 135.708 274.3Z")
          .attr("fill", "#490092")
          .attr("fill-rule", "evenodd");
  }

  function neutralLow(selection) {
      selection.append("g")
          .attr("clip-path", "url(#clip2)")
          .append("g")
          .attr("clip-path", "url(#clip3)")
          .attr("filter", "url(#fx0)")
          .attr("transform", "translate(16 25)")
          .append("g")
          .attr("clip-path", "url(#clip4)")
          .append("path")
          .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
          .attr("stroke", "#490092")
          .attr("stroke-width", "21")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
          .attr("stroke", "#490092")
          .attr("stroke-width", "20")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M135.708 103.652 212.075 180.02 240.359 151.735 258.273 258.273 151.735 240.359 180.02 212.075 103.652 135.708Z")
          .attr("fill", "#490092")
          .attr("fill-rule", "evenodd");
  }

  function consistentFail(selection) {
      selection.append("g")
          .attr("clip-path", "url(#clip2)")
          .append("g")
          .attr("clip-path", "url(#clip3)")
          .attr("filter", "url(#fx0)")
          .attr("transform", "translate(16 25)")
          .append("g")
          .attr("clip-path", "url(#clip4)")
          .append("path")
          .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
          .attr("stroke", "#FF6600")
          .attr("stroke-width", "21")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
          .attr("stroke", "#FF6600")
          .attr("stroke-width", "20")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("text")
          .attr("fill", "#FF6600")
          .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
          .attr("font-weight", "700")
          .attr("font-size", "11.7")
          .attr("transform", "translate(155.851 158) scale(10, 10)")
          .text("F");
      selection.append("path")
          .attr("d", "M38.5001 185.5 340.862 185.5")
          .attr("stroke", "#FF6600")
          .attr("stroke-width", "8.66667")
          .attr("stroke-miterlimit", "8")
          .attr("stroke-dasharray", "26 8.66667")
          .attr("fill", "none")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M72.5001 238.762C89.0456 218.168 107.725 200.801 129.638 200.507 152.134 201.459 176.57 238.689 192.563 241.313 206.31 244.118 205.897 217.733 212.814 216.659 217.563 215.414 220.151 238.182 233.066 240.463 248.557 243.786 291.62 234.385 302.5 236.212")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "10.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "none")
          .attr("fill-rule", "evenodd");
  }

  function consistentPass(selection) {
      selection.append("g")
          .attr("clip-path", "url(#clip2)")
          .append("g")
          .attr("clip-path", "url(#clip3)")
          .attr("filter", "url(#fx0)")
          .attr("transform", "translate(16 25)")
          .append("g")
          .attr("clip-path", "url(#clip4)")
          .append("path")
          .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
          .attr("stroke", "#0072C6")
          .attr("stroke-width", "21")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
          .attr("stroke", "#0072C6")
          .attr("stroke-width", "20")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("text")
          .attr("fill", "#0072C6")
          .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
          .attr("font-weight", "700")
          .attr("font-size", "11.7")
          .attr("transform", "translate(155.851 158) scale(10, 10)")
          .text("P");
      selection.append("path")
          .attr("d", "M55.5001 257.5 323.847 257.5")
          .attr("stroke", "#0072C6")
          .attr("stroke-width", "8.66667")
          .attr("stroke-miterlimit", "8")
          .attr("stroke-dasharray", "26 8.66667")
          .attr("fill", "none")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M72.5001 238.762C89.0456 218.168 107.725 200.801 129.638 200.507 152.134 201.459 176.57 238.689 192.563 241.313 206.31 244.118 205.897 217.733 212.814 216.659 217.563 215.414 220.151 238.182 233.066 240.463 248.557 243.786 291.62 234.385 302.5 236.212")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "10.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "none")
          .attr("fill-rule", "evenodd");
  }

  function inconsistent(selection) {
      selection.append("g")
          .attr("clip-path", "url(#clip2)")
          .append("g")
          .attr("clip-path", "url(#clip3)")
          .attr("filter", "url(#fx0)")
          .attr("transform", "translate(16 25)")
          .append("g")
          .attr("clip-path", "url(#clip4)")
          .append("path")
          .attr("d", "M17.47 173.345C17.47 87.1637 87.1031 17.3 173 17.3 258.897 17.3 328.53 87.1637 328.53 173.345 328.53 259.526 258.897 329.39 173 329.39 87.1031 329.39 17.47 259.526 17.47 173.345Z")
          .attr("stroke", "#BFBFBF")
          .attr("stroke-width", "21")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M38 189.5C38 105.829 105.605 38 189 38 272.395 38 340 105.829 340 189.5 340 273.171 272.395 341 189 341 105.605 341 38 273.171 38 189.5Z")
          .attr("stroke", "#BFBFBF")
          .attr("stroke-width", "20")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "#FFFFFF")
          .attr("fill-rule", "evenodd");
      selection.append("text")
          .attr("fill", "#7F7F7F")
          .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
          .attr("font-weight", "700")
          .attr("font-size", "11.7")
          .attr("transform", "translate(155.851 158) scale(10, 10)")
          .text("?");
      selection.append("path")
          .attr("d", "M38.5001 222.5 340.862 222.5")
          .attr("stroke", "#BFBFBF")
          .attr("stroke-width", "8.66667")
          .attr("stroke-miterlimit", "8")
          .attr("stroke-dasharray", "26 8.66667")
          .attr("fill", "none")
          .attr("fill-rule", "evenodd");
      selection.append("path")
          .attr("d", "M72.5001 239.762C89.0456 219.168 107.725 201.801 129.638 201.507 152.134 202.459 176.57 239.689 192.563 242.313 206.31 245.118 205.897 218.733 212.814 217.659 217.563 216.414 220.151 239.182 233.066 241.463 248.557 244.786 291.62 235.385 302.5 237.212")
          .attr("stroke", "#7F7F7F")
          .attr("stroke-width", "10.66667")
          .attr("stroke-miterlimit", "8")
          .attr("fill", "none")
          .attr("fill-rule", "evenodd");
  }

  var nhsIcons = /*#__PURE__*/Object.freeze({
    __proto__: null,
    commonCause: commonCause,
    concernHigh: concernHigh,
    concernLow: concernLow,
    consistentFail: consistentFail,
    consistentPass: consistentPass,
    improvementHigh: improvementHigh,
    improvementLow: improvementLow,
    inconsistent: inconsistent,
    neutralHigh: neutralHigh,
    neutralLow: neutralLow
  });

  function iconTransformSpec(svg_width, svg_height, location, scaling, count) {
      const scaling_factor = (0.08 * (svg_height / 378)) * scaling;
      const icon_x = location.includes("Right")
          ? (svg_width / scaling_factor) - (378 + (count * 378))
          : location.includes("Centre") ? (svg_width / scaling_factor) / 2 - 189
              : (count * 378);
      const icon_y = location.includes("Bottom")
          ? (svg_height / scaling_factor) - 378
          : location.includes("Centre") ? (svg_height / scaling_factor) / 2 - 189
              : 0;
      return `scale(${scaling_factor}) translate(${icon_x}, ${icon_y})`;
  }
  function initialiseIconSVG(selection, icon_name, transform_spec) {
      const icon_group = selection.append('g')
          .classed("icongroup", true);
      if (transform_spec) {
          icon_group.attr("transform", transform_spec);
      }
      const icon_defs = icon_group.append("defs");
      const icon_defs_filter = icon_defs.append("filter")
          .attr("id", "fx0")
          .attr("x", "-10%")
          .attr("y", "-10%")
          .attr("width", "120%")
          .attr("height", "120%")
          .attr("filterUnits", "userSpaceOnUse")
          .attr("userSpaceOnUse", "userSpaceOnUse");
      const icon_comptrans = icon_defs_filter.append("feComponentTransfer")
          .attr("color-interpolation-filters", "sRGB");
      icon_comptrans.append("feFuncR")
          .attr("type", "discrete")
          .attr("tableValues", "0 0");
      icon_comptrans.append("feFuncG")
          .attr("type", "discrete")
          .attr("tableValues", "0 0");
      icon_comptrans.append("feFuncB")
          .attr("type", "discrete")
          .attr("tableValues", "0 0");
      icon_comptrans.append("feFuncA")
          .attr("type", "linear")
          .attr("slope", "0.4")
          .attr("intercept", "0");
      icon_defs_filter.append("feGaussianBlur")
          .attr("stdDeviation", "1.77778 1.77778");
      icon_defs.append("clipPath")
          .attr("id", "clip1")
          .append("rect")
          .attr("x", "0")
          .attr("y", "0")
          .attr("width", "378")
          .attr("height", "378");
      icon_defs.append("clipPath")
          .attr("id", "clip2")
          .append("path")
          .attr("d", "M189 38C105.605 38 38 105.605 38 189 38 272.395 105.605 340 189 340 272.395 340 340 272.395 340 189 340 105.605 272.395 38 189 38ZM5.63264e-06 5.63264e-06 378 5.63264e-06 378 378 5.63264e-06 378Z")
          .attr("fill-rule", "evenodd")
          .attr("clip-rule", "evenodd");
      icon_defs.append("clipPath")
          .attr("id", "clip3")
          .append("rect")
          .attr("x", "-2")
          .attr("y", "-2")
          .attr("width", "346")
          .attr("height", "346");
      icon_group.append("g")
          .classed(icon_name, true)
          .attr("clip-path", "url(#clip1)")
          .append("rect")
          .attr("x", "0")
          .attr("y", "0")
          .attr("width", "378")
          .attr("height", "378")
          .attr("fill", "#FFFFFF");
  }

  function assuranceIconToDraw(controlLimits, inputSettings, derivedSettings) {
      var _a;
      if (!(derivedSettings.chart_type_props.has_control_limits)) {
          return "none";
      }
      const imp_direction = inputSettings.outliers.improvement_direction;
      const N = controlLimits.ll99.length - 1;
      const alt_target = (_a = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.alt_targets) === null || _a === void 0 ? void 0 : _a[N];
      if (isNullOrUndefined(alt_target) || imp_direction === "neutral") {
          return "none";
      }
      const impDirectionIncrease = imp_direction === "increase";
      if (alt_target > controlLimits.ul99[N]) {
          return impDirectionIncrease ? "consistentFail" : "consistentPass";
      }
      else if (alt_target < controlLimits.ll99[N]) {
          return impDirectionIncrease ? "consistentPass" : "consistentFail";
      }
      else {
          return "inconsistent";
      }
  }

  function variationIconsToDraw(outliers, inputSettings) {
      const imp_direction = inputSettings.outliers.improvement_direction;
      const suffix_map = {
          "increase": "High",
          "decrease": "Low",
          "neutral": ""
      };
      const invert_suffix_map = {
          "High": "Low",
          "Low": "High",
          "": ""
      };
      const suffix = suffix_map[imp_direction];
      const flag_last = inputSettings.nhs_icons.flag_last_point;
      let allFlags;
      if (flag_last) {
          const N = outliers.astpoint.length - 1;
          allFlags = [outliers.astpoint[N], outliers.shift[N], outliers.trend[N], outliers.two_in_three[N]];
      }
      else {
          allFlags = outliers.astpoint.concat(outliers.shift, outliers.trend, outliers.two_in_three);
      }
      const iconsPresent = new Array();
      if (allFlags.includes("improvement")) {
          iconsPresent.push("improvement" + suffix);
      }
      if (allFlags.includes("deterioration")) {
          iconsPresent.push("concern" + invert_suffix_map[suffix]);
      }
      if (allFlags.includes("neutral_low")) {
          iconsPresent.push("neutralLow");
      }
      if (allFlags.includes("neutral_high")) {
          iconsPresent.push("neutralHigh");
      }
      if (iconsPresent.length === 0) {
          iconsPresent.push("commonCause");
      }
      return iconsPresent;
  }

  function drawIcons(selection, visualObj) {
      selection.selectAll(".icongroup").remove();
      if (!(visualObj.plotProperties.displayPlot)) {
          return;
      }
      const nhsIconSettings = visualObj.viewModel.inputSettings.settings[0].nhs_icons;
      const draw_variation = nhsIconSettings.show_variation_icons;
      const variation_location = nhsIconSettings.variation_icons_locations;
      const svg_width = visualObj.viewModel.svgWidth;
      const svg_height = visualObj.viewModel.svgHeight;
      let numVariationIcons = 0;
      if (draw_variation) {
          const variation_scaling = nhsIconSettings.variation_icons_scaling;
          const variationIconsPresent = variationIconsToDraw(visualObj.viewModel.outliers[0], visualObj.viewModel.inputSettings.settings[0]);
          variationIconsPresent.forEach((icon, idx) => {
              selection
                  .call(initialiseIconSVG, icon, iconTransformSpec(svg_width, svg_height, variation_location, variation_scaling, idx))
                  .selectAll(`.${icon}`)
                  .call(nhsIcons[icon]);
          });
          numVariationIcons = variationIconsPresent.length;
      }
      const draw_assurance = nhsIconSettings.show_assurance_icons;
      if (draw_assurance) {
          const assurance_location = nhsIconSettings.assurance_icons_locations;
          const assurance_scaling = nhsIconSettings.assurance_icons_scaling;
          const settings = visualObj.viewModel.inputSettings.settings[0];
          const derivedSettings = visualObj.viewModel.inputSettings.derivedSettings[0];
          const assuranceIconPresent = assuranceIconToDraw(visualObj.viewModel.controlLimits[0], settings, derivedSettings);
          if (assuranceIconPresent === "none") {
              return;
          }
          const currIconCount = (numVariationIcons > 0 && variation_location === assurance_location)
              ? numVariationIcons
              : 0;
          selection
              .call(initialiseIconSVG, assuranceIconPresent, iconTransformSpec(svg_width, svg_height, assurance_location, assurance_scaling, currIconCount))
              .selectAll(`.${assuranceIconPresent}`)
              .call(nhsIcons[assuranceIconPresent]);
      }
  }

  function addContextMenu(selection, visualObj) {
      if (!(visualObj.plotProperties.displayPlot
          || visualObj.viewModel.inputSettings.settings[0].summary_table.show_table
          || visualObj.viewModel.showGrouped)) {
          selection.on("contextmenu", () => { return; });
          return;
      }
      selection.on('contextmenu', (event) => {
          const eventTarget = event.target;
          const dataPoint = (select(eventTarget).datum());
          visualObj.selectionManager.showContextMenu(dataPoint ? dataPoint.identity : {}, {
              x: event.clientX,
              y: event.clientY
          });
          event.preventDefault();
      });
  }

  function initialiseSVG(selection, removeAll = false) {
      if (removeAll) {
          selection.selectChildren().remove();
      }
      selection.append('line').classed("ttip-line-x", true);
      selection.append('line').classed("ttip-line-y", true);
      selection.append('g').classed("xaxisgroup", true);
      selection.append('text').classed('xaxislabel', true);
      selection.append('g').classed("yaxisgroup", true);
      selection.append('text').classed('yaxislabel', true);
      selection.append('g').classed("linesgroup", true);
      selection.append('g').classed("dotsgroup", true);
  }

  function drawErrors(selection, options, colourPalette, message, type = null) {
      selection.call(initialiseSVG, true);
      const errMessageSVG = selection.append("g").classed("errormessage", true);
      if (type) {
          const preamble = {
              "internal": "Internal Error! Please file a bug report with the following text:",
              "settings": "Invalid settings provided for all observations! First error:"
          };
          errMessageSVG.append('text')
              .attr("x", options.viewport.width / 2)
              .attr("y", options.viewport.height / 3)
              .style("text-anchor", "middle")
              .text(preamble[type])
              .style("font-size", "10px")
              .style("fill", colourPalette.foregroundColour);
      }
      errMessageSVG.append('text')
          .attr("x", options.viewport.width / 2)
          .attr("y", options.viewport.height / 2)
          .style("text-anchor", "middle")
          .text(message)
          .style("font-size", "10px")
          .style("fill", colourPalette.foregroundColour);
  }

  function identitySelected(identity, selectionManager) {
      const allSelectedIdentities = selectionManager.getSelectionIds();
      var identity_selected = false;
      for (const selected of allSelectedIdentities) {
          if (Array.isArray(identity)) {
              for (const d of identity) {
                  if (selected === d) {
                      identity_selected = true;
                      break;
                  }
              }
          }
          else {
              if (selected === identity) {
                  identity_selected = true;
                  break;
              }
          }
      }
      return identity_selected;
  }

  function drawTableHeaders(selection, cols, tableSettings, maxWidth) {
      const tableHeaders = selection.select(".table-header")
          .selectAll("th")
          .data(cols)
          .join("th");
      tableHeaders.selectAll("text")
          .data(d => [d.label])
          .join("text")
          .text(d => d)
          .style("font-size", `${tableSettings.table_header_size}px`)
          .style("font-family", tableSettings.table_header_font)
          .style("color", tableSettings.table_header_colour);
      tableHeaders.style("padding", `${tableSettings.table_header_text_padding}px`)
          .style("background-color", tableSettings.table_header_bg_colour)
          .style("font-weight", tableSettings.table_header_font_weight)
          .style("text-transform", tableSettings.table_header_text_transform)
          .style("text-align", tableSettings.table_header_text_align)
          .style("border-width", `${tableSettings.table_header_border_width}px`)
          .style("border-style", tableSettings.table_header_border_style)
          .style("border-color", tableSettings.table_header_border_colour)
          .style("border-top", "inherit");
      if (!tableSettings.table_header_border_bottom) {
          tableHeaders.style("border-bottom", "none");
      }
      if (!tableSettings.table_header_border_inner) {
          tableHeaders.style("border-left", "none")
              .style("border-right", "none");
      }
      if (tableSettings.table_text_overflow !== "none") {
          tableHeaders.style("overflow", "hidden")
              .style("max-width", `${maxWidth}px`)
              .style("text-overflow", tableSettings.table_text_overflow);
      }
      else {
          tableHeaders.style("overflow", "auto")
              .style("max-width", "none");
      }
  }
  function drawTableRows(selection, visualObj, plotPoints, tableSettings, maxWidth) {
      const tableRows = selection
          .select(".table-body")
          .selectAll('tr')
          .data(plotPoints)
          .join('tr')
          .on("click", (event, d) => {
          if (visualObj.host.hostCapabilities.allowInteractions) {
              const alreadySel = identitySelected(d.identity, visualObj.selectionManager);
              visualObj.selectionManager
                  .select(d.identity, alreadySel || event.ctrlKey || event.metaKey)
                  .then(() => visualObj.updateHighlighting());
              event.stopPropagation();
          }
      })
          .on("mouseover", (event) => {
          select(event.target).select(function () {
              return this.closest("td");
          }).style("background-color", "lightgray");
      })
          .on("mouseout", (event) => {
          var _a, _b;
          let currentTD = select(event.target).select(function () {
              return this.closest("td");
          });
          let rowData = select(currentTD.node().parentNode).datum();
          currentTD.style("background-color", (_b = (_a = rowData.aesthetics) === null || _a === void 0 ? void 0 : _a["table_body_bg_colour"]) !== null && _b !== void 0 ? _b : "inherit");
      });
      if (tableSettings.table_text_overflow !== "none") {
          tableRows.style("overflow", "hidden")
              .style("max-width", `${maxWidth}px`)
              .style("text-overflow", tableSettings.table_text_overflow);
      }
      else {
          tableRows.style("overflow", "auto")
              .style("max-width", "none");
      }
  }
  function drawOuterBorder(selection, tableSettings) {
      selection.select(".table-group")
          .style("border-width", `${tableSettings.table_outer_border_width}px`)
          .style("border-style", tableSettings.table_outer_border_style)
          .style("border-color", tableSettings.table_outer_border_colour);
      ["top", "right", "bottom", "left"].forEach((side) => {
          if (!tableSettings[`table_outer_border_${side}`]) {
              selection.select(".table-group").style(`border-${side}`, "none");
          }
      });
      selection.selectAll("th:first-child")
          .style("border-left", "inherit");
      selection.selectAll("th:last-child")
          .style("border-right", "inherit");
      selection.selectAll("td:first-child")
          .style("border-left", "inherit");
      selection.selectAll("td:last-child")
          .style("border-right", "inherit");
      selection.selectAll("tr:first-child")
          .selectAll("td")
          .style("border-top", "inherit");
      selection.selectAll("tr:last-child")
          .selectAll("td")
          .style("border-bottom", "inherit");
  }
  function drawTableCells(selection, cols, inputSettings, showGrouped) {
      const tableCells = selection.select(".table-body")
          .selectAll('tr')
          .selectAll('td')
          .data((d) => cols.map(col => {
          return { column: col.name, value: d.table_row[col.name] };
      }))
          .join('td');
      const draw_icons = inputSettings.nhs_icons.show_variation_icons || inputSettings.nhs_icons.show_assurance_icons;
      const thisSelDims = tableCells.node().getBoundingClientRect();
      tableCells.each(function (d) {
          var _a;
          const currNode = select(this);
          const parentNode = select(currNode.property("parentNode"));
          const rowData = parentNode.datum();
          if (showGrouped && draw_icons && (d.column === "variation" || d.column === "assurance")) {
              if (d.value !== "none") {
                  const scaling = inputSettings.nhs_icons[`${d.column}_icons_scaling`];
                  currNode
                      .append("svg")
                      .attr("width", `${thisSelDims.width * 0.5 * scaling}px`)
                      .attr("viewBox", "0 0 378 378")
                      .classed("rowsvg", true)
                      .call(initialiseIconSVG, d.value)
                      .selectAll(".icongroup")
                      .selectAll(`.${d.value}`)
                      .call(nhsIcons[d.value]);
              }
          }
          else {
              const value = typeof d.value === "number"
                  ? d.value.toFixed(inputSettings.spc.sig_figs)
                  : d.value;
              currNode.text(value).classed("cell-text", true);
          }
          const tableAesthetics = ((_a = rowData.aesthetics) === null || _a === void 0 ? void 0 : _a["table_body_bg_colour"])
              ? rowData.aesthetics
              : inputSettings.summary_table;
          currNode.style("background-color", tableAesthetics.table_body_bg_colour)
              .style("font-weight", tableAesthetics.table_body_font_weight)
              .style("text-transform", tableAesthetics.table_body_text_transform)
              .style("text-align", tableAesthetics.table_body_text_align)
              .style("font-size", `${tableAesthetics.table_body_size}px`)
              .style("font-family", tableAesthetics.table_body_font)
              .style("color", tableAesthetics.table_body_colour)
              .style("border-width", `${tableAesthetics.table_body_border_width}px`)
              .style("border-style", tableAesthetics.table_body_border_style)
              .style("border-color", tableAesthetics.table_body_border_colour)
              .style("padding", `${tableAesthetics.table_body_text_padding}px`)
              .style("opacity", "inherit");
          if (!tableAesthetics.table_body_border_left_right) {
              currNode.style("border-left", "none")
                  .style("border-right", "none");
          }
          if (!tableAesthetics.table_body_border_top_bottom) {
              currNode.style("border-top", "none")
                  .style("border-bottom", "none");
          }
      });
  }
  function drawSummaryTable(selection, visualObj) {
      selection.selectAll(".rowsvg").remove();
      selection.selectAll(".cell-text").remove();
      let plotPoints;
      let cols;
      if (visualObj.viewModel.showGrouped) {
          plotPoints = visualObj.viewModel.plotPoints.flat();
          cols = visualObj.viewModel.tableColumns[0];
      }
      else {
          plotPoints = visualObj.viewModel.plotPoints[0];
          cols = visualObj.viewModel.tableColumns[0];
      }
      const maxWidth = visualObj.viewModel.svgWidth / cols.length;
      const tableSettings = visualObj.viewModel.inputSettings.settings[0].summary_table;
      selection.call(drawTableHeaders, cols, tableSettings, maxWidth)
          .call(drawTableRows, visualObj, plotPoints, tableSettings, maxWidth);
      if (plotPoints.length > 0) {
          selection.call(drawTableCells, cols, visualObj.viewModel.inputSettings.settings[0], visualObj.viewModel.showGrouped);
      }
      selection.call(drawOuterBorder, tableSettings);
      selection.on('click', () => {
          visualObj.selectionManager.clear();
          visualObj.updateHighlighting();
      });
  }

  function isValidNumber(value) {
      return !isNullOrUndefined(value) && !Number.isNaN(value) && Number.isFinite(value);
  }

  function getLabelAttributes(d, visualObj) {
      var _a, _b;
      const label_direction_mult = d.label.aesthetics.label_position === "top" ? -1 : 1;
      const plotHeight = visualObj.viewModel.svgHeight;
      const xAxisHeight = plotHeight - visualObj.plotProperties.yAxis.start_padding;
      const label_position = d.label.aesthetics.label_position;
      let y_offset = d.label.aesthetics.label_y_offset;
      const label_initial = label_position === "top" ? (0 + y_offset) : (xAxisHeight - y_offset);
      const y = visualObj.plotProperties.yScale(d.value);
      let side_length = label_position === "top" ? (y - label_initial) : (label_initial - y);
      const x_val = visualObj.plotProperties.xScale(d.x);
      const y_val = visualObj.plotProperties.yScale(d.value);
      const theta = (_a = d.label.angle) !== null && _a !== void 0 ? _a : (d.label.aesthetics.label_angle_offset + label_direction_mult * 90);
      side_length = (_b = d.label.distance) !== null && _b !== void 0 ? _b : (Math.min(side_length, d.label.aesthetics.label_line_max_length));
      let line_offset = d.label.aesthetics.label_line_offset;
      line_offset = label_position === "top" ? line_offset : -(line_offset + d.label.aesthetics.label_size / 2);
      let marker_offset = d.label.aesthetics.label_marker_offset + d.label.aesthetics.label_size / 2;
      marker_offset = label_position === "top" ? -marker_offset : marker_offset;
      const newX = x_val + side_length * Math.cos(theta * Math.PI / 180);
      const newY = y_val + side_length * Math.sin(theta * Math.PI / 180);
      if (!isValidNumber(newX) || !isValidNumber(newY)) {
          return {
              x: 0,
              y: 0,
              theta: 0,
              line_offset: 0,
              marker_offset: 0
          };
      }
      return { x: newX,
          y: newY,
          theta: theta,
          line_offset: line_offset,
          marker_offset: marker_offset
      };
  }
  function drawLabels(selection, visualObj) {
      var _a;
      if (!visualObj.viewModel.inputSettings.settings[0].labels.show_labels
          || !((_a = visualObj.viewModel.inputData[0]) === null || _a === void 0 ? void 0 : _a.anyLabels)) {
          selection.select(".text-labels").remove();
          return;
      }
      if (selection.select(".text-labels").empty()) {
          selection.append("g").classed("text-labels", true);
      }
      const dragFun = drag().on("drag", function (e) {
          const d = e.subject;
          const x_val = visualObj.plotProperties.xScale(d.x);
          const y_val = visualObj.plotProperties.yScale(d.value);
          const angle = Math.atan2(e.sourceEvent.y - y_val, e.sourceEvent.x - x_val) * 180 / Math.PI;
          const distance = Math.sqrt(Math.pow(e.sourceEvent.y - y_val, 2) + Math.pow(e.sourceEvent.x - x_val, 2));
          const marker_offset = 10;
          const x_offset = marker_offset * Math.cos(angle * Math.PI / 180);
          const y_offset = marker_offset * Math.sin(angle * Math.PI / 180);
          e.subject.label.angle = angle;
          e.subject.label.distance = distance;
          select(this)
              .select("text")
              .attr("x", e.sourceEvent.x)
              .attr("y", e.sourceEvent.y);
          let line_offset = d.label.aesthetics.label_line_offset;
          line_offset = d.label.aesthetics.label_position === "top" ? line_offset : -(line_offset + d.label.aesthetics.label_size / 2);
          select(this)
              .select("line")
              .attr("x1", e.sourceEvent.x)
              .attr("y1", e.sourceEvent.y + line_offset)
              .attr("x2", x_val + x_offset)
              .attr("y2", y_val + y_offset);
          select(this)
              .select("path")
              .attr("transform", `translate(${x_val + x_offset}, ${y_val + y_offset}) rotate(${angle - 90})`);
      });
      selection.select(".text-labels")
          .selectAll(".text-group-inner")
          .data(visualObj.viewModel.plotPoints[0])
          .join("g")
          .classed("text-group-inner", true)
          .each(function (d) {
          var _a;
          const textGroup = select(this);
          if (((_a = d.label.text_value) !== null && _a !== void 0 ? _a : "") === "") {
              textGroup.remove();
              return;
          }
          textGroup.selectAll("*").remove();
          const textElement = textGroup.append("text");
          const lineElement = textGroup.append("line");
          const pathElement = textGroup.append("path");
          const { x, y, line_offset, marker_offset, theta } = getLabelAttributes(d, visualObj);
          const invalidXY = x === 0 && y === 0;
          if (invalidXY) {
              textGroup.remove();
              return;
          }
          const angle = theta - (d.label.aesthetics.label_position === "top" ? 180 : 0);
          const angleToRadians = angle * Math.PI / 180;
          textElement
              .attr("x", x)
              .attr("y", y)
              .text(d.label.text_value)
              .style("text-anchor", "middle")
              .style("font-size", `${d.label.aesthetics.label_size}px`)
              .style("font-family", d.label.aesthetics.label_font)
              .style("fill", d.label.aesthetics.label_colour);
          const markerSize = Math.pow(d.label.aesthetics.label_marker_size, 2);
          const markerX = visualObj.plotProperties.xScale(d.x) + marker_offset * Math.cos(angleToRadians);
          const markerY = visualObj.plotProperties.yScale(d.value) + marker_offset * Math.sin(angleToRadians);
          lineElement
              .attr("x1", x)
              .attr("y1", y + line_offset)
              .attr("x2", markerX)
              .attr("y2", markerY)
              .style("stroke", visualObj.viewModel.inputSettings.settings[0].labels.label_line_colour)
              .style("stroke-width", visualObj.viewModel.inputSettings.settings[0].labels.label_line_width)
              .style("stroke-dasharray", visualObj.viewModel.inputSettings.settings[0].labels.label_line_type);
          const markerRotation = angle + (d.label.aesthetics.label_position === "top" ? 90 : 270);
          pathElement
              .attr("d", Symbol$1().type(triangle).size(markerSize)())
              .attr("transform", `translate(${markerX}, ${markerY}) rotate(${markerRotation})`)
              .style("fill", d.label.aesthetics.label_marker_colour)
              .style("stroke", d.label.aesthetics.label_marker_outline_colour);
          if (!visualObj.viewModel.headless) {
              textGroup.call(dragFun);
          }
      });
  }

  const formatValues = function (value, name, inputSettings, derivedSettings) {
      const suffix = derivedSettings.percentLabels ? "%" : "";
      const sig_figs = inputSettings.spc.sig_figs;
      if (isNullOrUndefined(value)) {
          return "";
      }
      switch (name) {
          case "date":
              return value;
          case "integer": {
              return value.toFixed(derivedSettings.chart_type_props.integer_num_den ? 0 : sig_figs);
          }
          default:
              return value.toFixed(sig_figs) + suffix;
      }
  };
  function valueFormatter(inputSettings, derivedSettings) {
      const formatValuesImpl = function (value, name) {
          return formatValues(value, name, inputSettings, derivedSettings);
      };
      return formatValuesImpl;
  }

  const positionOffsetMap = {
      "above": -1,
      "below": 1,
      "beside": -1
  };
  const outsideMap = {
      "ll99": "below",
      "ll95": "below",
      "ll68": "below",
      "ul68": "above",
      "ul95": "above",
      "ul99": "above",
      "speclimits_lower": "below",
      "speclimits_upper": "above"
  };
  const insideMap = {
      "ll99": "above",
      "ll95": "above",
      "ll68": "above",
      "ul68": "below",
      "ul95": "below",
      "ul99": "below",
      "speclimits_lower": "above",
      "speclimits_upper": "below"
  };
  function drawLineLabels(selection, visualObj) {
      if (visualObj.viewModel.groupedLines.length === 0) {
          selection
              .select(".linesgroup")
              .selectAll("text")
              .data([])
              .join("text")
              .remove();
          return;
      }
      const lineSettings = visualObj.viewModel.inputSettings.settings[0].lines;
      const rebaselinePoints = new Array();
      visualObj.viewModel.groupedLines[0][1].forEach((d, idx) => {
          if (d.line_value === null) {
              rebaselinePoints.push(idx - 1);
          }
          if (idx === visualObj.viewModel.groupedLines[0][1].length - 1) {
              rebaselinePoints.push(idx);
          }
      });
      const limits = visualObj.viewModel.groupedLines.map(d => d[0]);
      const labelsToPlot = new Array();
      rebaselinePoints.forEach((d, rb_idx) => {
          limits.forEach((limit, idx) => {
              const lastIndex = rebaselinePoints[rebaselinePoints.length - 1];
              const showN = rebaselinePoints.length - Math.min(rebaselinePoints.length, lineSettings[`plot_label_show_n_${lineNameMap[limit]}`]);
              const showLabel = lineSettings[`plot_label_show_all_${lineNameMap[limit]}`]
                  || (d == lastIndex);
              if (rb_idx >= showN) {
                  labelsToPlot.push({ index: d, limit: idx });
              }
              else if (showLabel) {
                  labelsToPlot.push({ index: d, limit: idx });
              }
          });
      });
      const formatValue = valueFormatter(visualObj.viewModel.inputSettings.settings[0], visualObj.viewModel.inputSettings.derivedSettings[0]);
      selection
          .select(".linesgroup")
          .selectAll("text")
          .data(labelsToPlot)
          .join("text")
          .text((d) => {
          const lineGroup = visualObj.viewModel.groupedLines[d.limit];
          return lineSettings[`plot_label_show_${lineNameMap[lineGroup[0]]}`]
              ? lineSettings[`plot_label_prefix_${lineNameMap[lineGroup[0]]}`] + formatValue(lineGroup[1][d.index].line_value, "value")
              : "";
      })
          .attr("x", (d) => {
          const lineGroup = visualObj.viewModel.groupedLines[d.limit];
          return visualObj.plotProperties.xScale(lineGroup[1][d.index].x);
      })
          .attr("y", (d) => {
          const lineGroup = visualObj.viewModel.groupedLines[d.limit];
          return visualObj.plotProperties.yScale(lineGroup[1][d.index].line_value);
      })
          .attr("fill", (d) => {
          const lineGroup = visualObj.viewModel.groupedLines[d.limit];
          return lineSettings[`plot_label_colour_${lineNameMap[lineGroup[0]]}`];
      })
          .attr("font-size", (d) => {
          const lineGroup = visualObj.viewModel.groupedLines[d.limit];
          return `${lineSettings[`plot_label_size_${lineNameMap[lineGroup[0]]}`]}px`;
      })
          .attr("font-family", (d) => {
          const lineGroup = visualObj.viewModel.groupedLines[d.limit];
          return lineSettings[`plot_label_font_${lineNameMap[lineGroup[0]]}`];
      })
          .attr("text-anchor", (d) => {
          const lineGroup = visualObj.viewModel.groupedLines[d.limit];
          return lineSettings[`plot_label_position_${lineNameMap[lineGroup[0]]}`] === "beside" ? "start" : "end";
      })
          .attr("dx", (d) => {
          const lineGroup = visualObj.viewModel.groupedLines[d.limit];
          const offset = (lineSettings[`plot_label_position_${lineNameMap[lineGroup[0]]}`] === "beside" ? 1 : -1) * lineSettings[`plot_label_hpad_${lineNameMap[lineGroup[0]]}`];
          return `${offset}px`;
      })
          .attr("dy", function (d) {
          const lineGroup = visualObj.viewModel.groupedLines[d.limit];
          const bounds = select(this).node().getBoundingClientRect();
          let position = lineSettings[`plot_label_position_${lineNameMap[lineGroup[0]]}`];
          let vpadding = lineSettings[`plot_label_vpad_${lineNameMap[lineGroup[0]]}`];
          if (["outside", "inside"].includes(position)) {
              position = position === "outside" ? outsideMap[lineGroup[0]] : insideMap[lineGroup[0]];
          }
          const heightMap = {
              "above": -lineSettings[`width_${lineNameMap[lineGroup[0]]}`],
              "below": lineSettings[`plot_label_size_${lineNameMap[lineGroup[0]]}`],
              "beside": bounds.height / 4
          };
          return `${positionOffsetMap[position] * vpadding + heightMap[position]}px`;
      });
  }

  function drawDownloadButton(selection, visualObj) {
      if (!(visualObj.viewModel.inputSettings.settings[0].download_options.show_button)) {
          selection.select(".download-btn-group").remove();
          return;
      }
      if (selection.select(".download-btn-group").empty()) {
          selection.append("text").classed("download-btn-group", true);
      }
      const table_rows = visualObj.viewModel.plotPoints[0].map(d => d.table_row);
      const csv_rows = new Array();
      csv_rows.push(Object.keys(table_rows[0]).join(","));
      table_rows.forEach(row => {
          csv_rows.push(Object.values(row).join(","));
      });
      selection.select(".download-btn-group")
          .attr("x", visualObj.viewModel.svgWidth - 50)
          .attr("y", visualObj.viewModel.svgHeight - 5)
          .text("Download")
          .style("font-size", "10px")
          .style("text-decoration", "underline")
          .on("click", () => {
          visualObj.host.downloadService
              .exportVisualsContent(csv_rows.join("\n"), "chartdata.csv", "csv", "csv file");
      });
  }

  function min(values) {
      return Math.min(...values);
  }

  function max(values) {
      return Math.max(...values);
  }

  class plotPropertiesClass {
      initialiseScale(svgWidth, svgHeight) {
          this.xScale = linear()
              .domain([this.xAxis.lower, this.xAxis.upper])
              .range([this.xAxis.start_padding,
              svgWidth - this.xAxis.end_padding]);
          this.yScale = linear()
              .domain([this.yAxis.lower, this.yAxis.upper])
              .range([svgHeight - this.yAxis.start_padding,
              this.yAxis.end_padding]);
      }
      update(options, viewModel) {
          var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
          const plotPoints = (_a = viewModel.plotPoints[0]) !== null && _a !== void 0 ? _a : [];
          const controlLimits = viewModel.controlLimits[0];
          const inputData = viewModel.inputData[0];
          const inputSettings = viewModel.inputSettings.settings[0];
          const derivedSettings = viewModel.inputSettings.derivedSettings[0];
          const colorPalette = viewModel.colourPalette;
          this.displayPlot = plotPoints
              ? plotPoints.length > 0
              : null;
          let xLowerLimit = inputSettings.x_axis.xlimit_l;
          let xUpperLimit = inputSettings.x_axis.xlimit_u;
          let yLowerLimit = inputSettings.y_axis.ylimit_l;
          let yUpperLimit = inputSettings.y_axis.ylimit_u;
          if (((_b = inputData === null || inputData === void 0 ? void 0 : inputData.validationStatus) === null || _b === void 0 ? void 0 : _b.status) == 0 && controlLimits) {
              xUpperLimit = !isNullOrUndefined(xUpperLimit) ? xUpperLimit : max(controlLimits.keys.map(d => d.x));
              const limitMultiplier = inputSettings.y_axis.limit_multiplier;
              const values = controlLimits.values.filter(d => isValidNumber(d));
              const ul99 = (_c = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.ul99) === null || _c === void 0 ? void 0 : _c.filter(d => isValidNumber(d));
              const speclimits_upper = (_d = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.speclimits_upper) === null || _d === void 0 ? void 0 : _d.filter(d => isValidNumber(d));
              const ll99 = (_e = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.ll99) === null || _e === void 0 ? void 0 : _e.filter(d => isValidNumber(d));
              const speclimits_lower = (_f = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.speclimits_lower) === null || _f === void 0 ? void 0 : _f.filter(d => isValidNumber(d));
              const alt_targets = (_g = controlLimits.alt_targets) === null || _g === void 0 ? void 0 : _g.filter(d => isValidNumber(d));
              const targets = (_h = controlLimits.targets) === null || _h === void 0 ? void 0 : _h.filter(d => isValidNumber(d));
              const maxValue = max(values);
              const maxValueOrLimit = max(values.concat(ul99).concat(speclimits_upper).concat(alt_targets));
              const minValueOrLimit = min(values.concat(ll99).concat(speclimits_lower).concat(alt_targets));
              const maxTarget = (_j = max(targets)) !== null && _j !== void 0 ? _j : 0;
              const minTarget = (_k = min(targets)) !== null && _k !== void 0 ? _k : 0;
              const upperLimitRaw = maxTarget + (maxValueOrLimit - maxTarget) * limitMultiplier;
              const lowerLimitRaw = minTarget - (minTarget - minValueOrLimit) * limitMultiplier;
              const multiplier = derivedSettings.multiplier;
              yUpperLimit !== null && yUpperLimit !== void 0 ? yUpperLimit : (yUpperLimit = (derivedSettings.percentLabels && !(maxValue > (1 * multiplier)))
                  ? Math.min(upperLimitRaw, 1 * multiplier)
                  : upperLimitRaw);
              yLowerLimit !== null && yLowerLimit !== void 0 ? yLowerLimit : (yLowerLimit = derivedSettings.percentLabels
                  ? Math.max(lowerLimitRaw, 0)
                  : lowerLimitRaw);
              const keysToPlot = controlLimits.keys.map(d => d.x);
              xLowerLimit = !isNullOrUndefined(xLowerLimit)
                  ? xLowerLimit
                  : min(keysToPlot);
              xUpperLimit = !isNullOrUndefined(xUpperLimit)
                  ? xUpperLimit
                  : max(keysToPlot);
          }
          const xTickSize = inputSettings.x_axis.xlimit_tick_size;
          const yTickSize = inputSettings.y_axis.ylimit_tick_size;
          const leftLabelPadding = inputSettings.y_axis.ylimit_label
              ? inputSettings.y_axis.ylimit_label_size
              : 0;
          const lowerLabelPadding = inputSettings.x_axis.xlimit_label
              ? inputSettings.x_axis.xlimit_label_size
              : 0;
          this.xAxis = {
              lower: !isNullOrUndefined(xLowerLimit) ? xLowerLimit : 0,
              upper: xUpperLimit,
              start_padding: inputSettings.canvas.left_padding + leftLabelPadding,
              end_padding: inputSettings.canvas.right_padding,
              colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.x_axis.xlimit_colour,
              ticks: inputSettings.x_axis.xlimit_ticks,
              tick_size: `${xTickSize}px`,
              tick_font: inputSettings.x_axis.xlimit_tick_font,
              tick_colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.x_axis.xlimit_tick_colour,
              tick_rotation: inputSettings.x_axis.xlimit_tick_rotation,
              tick_count: inputSettings.x_axis.xlimit_tick_count,
              label: inputSettings.x_axis.xlimit_label,
              label_size: `${inputSettings.x_axis.xlimit_label_size}px`,
              label_font: inputSettings.x_axis.xlimit_label_font,
              label_colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.x_axis.xlimit_label_colour
          };
          this.yAxis = {
              lower: yLowerLimit,
              upper: yUpperLimit,
              start_padding: inputSettings.canvas.lower_padding + lowerLabelPadding,
              end_padding: inputSettings.canvas.upper_padding,
              colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.y_axis.ylimit_colour,
              ticks: inputSettings.y_axis.ylimit_ticks,
              tick_size: `${yTickSize}px`,
              tick_font: inputSettings.y_axis.ylimit_tick_font,
              tick_colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.y_axis.ylimit_tick_colour,
              tick_rotation: inputSettings.y_axis.ylimit_tick_rotation,
              tick_count: inputSettings.y_axis.ylimit_tick_count,
              label: inputSettings.y_axis.ylimit_label,
              label_size: `${inputSettings.y_axis.ylimit_label_size}px`,
              label_font: inputSettings.y_axis.ylimit_label_font,
              label_colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.y_axis.ylimit_label_colour
          };
          this.initialiseScale(options.viewport.width, options.viewport.height);
      }
  }

  function cLimits(args) {
      const n_sub = args.subset_points.length;
      const numerators = args.numerators;
      const subset_points = args.subset_points;
      let cl = 0;
      for (let i = 0; i < n_sub; i++) {
          cl += numerators[subset_points[i]];
      }
      cl = cl / n_sub;
      const sigma = Math.sqrt(cl);
      const n = args.keys.length;
      let rtn = {
          keys: args.keys,
          values: args.numerators,
          targets: new Array(n),
          ll99: new Array(n),
          ll95: new Array(n),
          ll68: new Array(n),
          ul68: new Array(n),
          ul95: new Array(n),
          ul99: new Array(n)
      };
      for (let i = 0; i < n; i++) {
          rtn.targets[i] = cl;
          rtn.ll99[i] = Math.max(0, cl - 3 * sigma);
          rtn.ll95[i] = Math.max(0, cl - 2 * sigma);
          rtn.ll68[i] = Math.max(0, cl - 1 * sigma);
          rtn.ul68[i] = cl + 1 * sigma;
          rtn.ul95[i] = cl + 2 * sigma;
          rtn.ul99[i] = cl + 3 * sigma;
      }
      return rtn;
  }

  function gLimits(args) {
      const numerators = args.numerators;
      const subset_points = args.subset_points;
      const n_sub = subset_points.length;
      let numerator_subset = new Array(n_sub);
      let cl = 0;
      for (let i = 0; i < n_sub; i++) {
          numerator_subset[i] = numerators[subset_points[i]];
          cl += numerators[subset_points[i]];
      }
      cl /= n_sub;
      let sorted_subset = numerator_subset.slice().sort((a, b) => a - b);
      let median_val;
      if (n_sub % 2 === 0) {
          median_val = (sorted_subset[n_sub / 2 - 1] + sorted_subset[n_sub / 2]) / 2;
      }
      else {
          median_val = sorted_subset[Math.floor(n_sub / 2)];
      }
      const sigma = Math.sqrt(cl * (cl + 1));
      const n = args.keys.length;
      let rtn = {
          keys: args.keys,
          values: args.numerators,
          targets: new Array(n),
          ll99: new Array(n),
          ll95: new Array(n),
          ll68: new Array(n),
          ul68: new Array(n),
          ul95: new Array(n),
          ul99: new Array(n)
      };
      for (let i = 0; i < n; i++) {
          rtn.targets[i] = median_val;
          rtn.ll68[i] = 0;
          rtn.ll95[i] = 0;
          rtn.ll99[i] = 0;
          rtn.ul68[i] = cl + 1 * sigma;
          rtn.ul95[i] = cl + 2 * sigma;
          rtn.ul99[i] = cl + 3 * sigma;
      }
      return rtn;
  }

  function iLimits(args) {
      const useRatio = (args.denominators && args.denominators.length > 0);
      const n_sub = args.subset_points.length;
      const numerators = args.numerators;
      const denominators = args.denominators;
      const subset_points = args.subset_points;
      let prevVal = useRatio ? numerators[subset_points[0]] / denominators[subset_points[0]]
          : numerators[subset_points[0]];
      let cl = prevVal;
      let amr = 0;
      let consec_diff = new Array(n_sub - 1);
      for (let i = 1; i < n_sub; i++) {
          let currVal = useRatio ? numerators[subset_points[i]] / denominators[subset_points[i]]
              : numerators[subset_points[i]];
          consec_diff[i - 1] = Math.abs(currVal - prevVal);
          amr += consec_diff[i - 1];
          cl += currVal;
          prevVal = currVal;
      }
      cl /= n_sub;
      amr /= (n_sub - 1);
      if (!args.outliers_in_limits) {
          const consec_diff_ulim = amr * 3.267;
          let screened_amr = 0;
          let screened_count = 0;
          for (let i = 0; i < consec_diff.length; i++) {
              if (consec_diff[i] < consec_diff_ulim) {
                  screened_amr += consec_diff[i];
                  screened_count += 1;
              }
          }
          amr = screened_amr / screened_count;
      }
      const sigma = amr / 1.128;
      const n = args.keys.length;
      let rtn = {
          keys: args.keys,
          values: new Array(n),
          numerators: useRatio ? args.numerators : undefined,
          denominators: useRatio ? args.denominators : undefined,
          targets: new Array(n),
          ll99: new Array(n),
          ll95: new Array(n),
          ll68: new Array(n),
          ul68: new Array(n),
          ul95: new Array(n),
          ul99: new Array(n)
      };
      for (let i = 0; i < n; i++) {
          if (useRatio) {
              rtn.values[i] = numerators[i] / denominators[i];
              rtn.numerators[i] = numerators[i];
              rtn.denominators[i] = denominators[i];
          }
          else {
              rtn.values[i] = numerators[i];
          }
          rtn.targets[i] = cl;
          rtn.ll99[i] = cl - 3 * sigma;
          rtn.ll95[i] = cl - 2 * sigma;
          rtn.ll68[i] = cl - 1 * sigma;
          rtn.ul68[i] = cl + 1 * sigma;
          rtn.ul95[i] = cl + 2 * sigma;
          rtn.ul99[i] = cl + 3 * sigma;
      }
      return rtn;
  }

  function imLimits(args) {
      const useRatio = (args.denominators && args.denominators.length > 0);
      const n_sub = args.subset_points.length;
      const numerators = args.numerators;
      const denominators = args.denominators;
      const subset_points = args.subset_points;
      let ratio_subset = new Array(n_sub);
      for (let i = 0; i < n_sub; i++) {
          ratio_subset[i] = useRatio ? numerators[subset_points[i]] / denominators[subset_points[i]]
              : numerators[subset_points[i]];
      }
      let sorted_subset = ratio_subset.slice().sort((a, b) => a - b);
      let cl;
      if (n_sub % 2 === 0) {
          cl = (sorted_subset[n_sub / 2 - 1] + sorted_subset[n_sub / 2]) / 2;
      }
      else {
          cl = sorted_subset[Math.floor(n_sub / 2)];
      }
      let consec_diff = new Array(n_sub - 1);
      let amr = 0;
      for (let i = 1; i < n_sub; i++) {
          consec_diff[i - 1] = Math.abs(ratio_subset[i] - ratio_subset[i - 1]);
          amr += consec_diff[i - 1];
      }
      amr /= (n_sub - 1);
      if (!args.outliers_in_limits) {
          const consec_diff_ulim = amr * 3.267;
          let screened_amr = 0;
          let screened_count = 0;
          for (let i = 0; i < consec_diff.length; i++) {
              if (consec_diff[i] < consec_diff_ulim) {
                  screened_amr += consec_diff[i];
                  screened_count += 1;
              }
          }
          amr = screened_amr / screened_count;
      }
      const sigma = amr / 1.128;
      const n = args.keys.length;
      let rtn = {
          keys: args.keys,
          values: new Array(n),
          numerators: useRatio ? args.numerators : undefined,
          denominators: useRatio ? args.denominators : undefined,
          targets: new Array(n),
          ll99: new Array(n),
          ll95: new Array(n),
          ll68: new Array(n),
          ul68: new Array(n),
          ul95: new Array(n),
          ul99: new Array(n)
      };
      for (let i = 0; i < n; i++) {
          if (useRatio) {
              rtn.values[i] = numerators[i] / denominators[i];
              rtn.numerators[i] = numerators[i];
              rtn.denominators[i] = denominators[i];
          }
          else {
              rtn.values[i] = numerators[i];
          }
          rtn.targets[i] = cl;
          rtn.ll99[i] = cl - 3 * sigma;
          rtn.ll95[i] = cl - 2 * sigma;
          rtn.ll68[i] = cl - 1 * sigma;
          rtn.ul68[i] = cl + 1 * sigma;
          rtn.ul95[i] = cl + 2 * sigma;
          rtn.ul99[i] = cl + 3 * sigma;
      }
      return rtn;
  }

  function immLimits(args) {
      const useRatio = (args.denominators && args.denominators.length > 0);
      const n_sub = args.subset_points.length;
      const numerators = args.numerators;
      const denominators = args.denominators;
      const subset_points = args.subset_points;
      let ratio_subset = new Array(n_sub);
      for (let i = 0; i < n_sub; i++) {
          ratio_subset[i] = useRatio ? numerators[subset_points[i]] / denominators[subset_points[i]]
              : numerators[subset_points[i]];
      }
      let sorted_subset = ratio_subset.slice().sort((a, b) => a - b);
      let cl;
      if (n_sub % 2 === 0) {
          cl = (sorted_subset[n_sub / 2 - 1] + sorted_subset[n_sub / 2]) / 2;
      }
      else {
          cl = sorted_subset[Math.floor(n_sub / 2)];
      }
      let consec_diff = new Array(n_sub - 1);
      for (let i = 1; i < n_sub; i++) {
          consec_diff[i - 1] = Math.abs(ratio_subset[i] - ratio_subset[i - 1]);
      }
      let sorted_consec_diff = consec_diff.slice().sort((a, b) => a - b);
      let mmr;
      const n_diff = consec_diff.length;
      if (n_diff % 2 === 0) {
          mmr = (sorted_consec_diff[n_diff / 2 - 1] + sorted_consec_diff[n_diff / 2]) / 2;
      }
      else {
          mmr = sorted_consec_diff[Math.floor(n_diff / 2)];
      }
      if (!args.outliers_in_limits) {
          const consec_diff_ulim = mmr * 3.267;
          let valid_diffs = [];
          for (let i = 0; i < consec_diff.length; i++) {
              if (consec_diff[i] < consec_diff_ulim) {
                  valid_diffs.push(consec_diff[i]);
              }
          }
          if (valid_diffs.length > 0) {
              let sorted_valid = valid_diffs.sort((a, b) => a - b);
              const n_valid = valid_diffs.length;
              if (n_valid % 2 === 0) {
                  mmr = (sorted_valid[n_valid / 2 - 1] + sorted_valid[n_valid / 2]) / 2;
              }
              else {
                  mmr = sorted_valid[Math.floor(n_valid / 2)];
              }
          }
      }
      const sigma = mmr / 1.128;
      const n = args.keys.length;
      let rtn = {
          keys: args.keys,
          values: new Array(n),
          numerators: useRatio ? args.numerators : undefined,
          denominators: useRatio ? args.denominators : undefined,
          targets: new Array(n),
          ll99: new Array(n),
          ll95: new Array(n),
          ll68: new Array(n),
          ul68: new Array(n),
          ul95: new Array(n),
          ul99: new Array(n)
      };
      for (let i = 0; i < n; i++) {
          if (useRatio) {
              rtn.values[i] = numerators[i] / denominators[i];
              rtn.numerators[i] = numerators[i];
              rtn.denominators[i] = denominators[i];
          }
          else {
              rtn.values[i] = numerators[i];
          }
          rtn.targets[i] = cl;
          rtn.ll99[i] = cl - 3 * sigma;
          rtn.ll95[i] = cl - 2 * sigma;
          rtn.ll68[i] = cl - 1 * sigma;
          rtn.ul68[i] = cl + 1 * sigma;
          rtn.ul95[i] = cl + 2 * sigma;
          rtn.ul99[i] = cl + 3 * sigma;
      }
      return rtn;
  }

  function mrLimits(args) {
      const useRatio = (args.denominators && args.denominators.length > 0);
      const n = args.keys.length;
      const numerators = args.numerators;
      const denominators = args.denominators;
      const subset_points = args.subset_points;
      let consec_diff = new Array(n - 1);
      for (let i = 1; i < n; i++) {
          let prevVal = useRatio ? numerators[i - 1] / denominators[i - 1] : numerators[i - 1];
          let currVal = useRatio ? numerators[i] / denominators[i] : numerators[i];
          consec_diff[i - 1] = Math.abs(currVal - prevVal);
      }
      let sum_mr = 0;
      let count = 0;
      for (let i = 0; i < subset_points.length; i++) {
          let idx = subset_points[i];
          if (idx > 0 && idx - 1 < consec_diff.length) {
              sum_mr += consec_diff[idx - 1];
              count++;
          }
      }
      const cl = sum_mr / count;
      const n_mr = n - 1;
      let rtn = {
          keys: args.keys.slice(1),
          values: new Array(n_mr),
          numerators: useRatio ? args.numerators.slice(1) : undefined,
          denominators: useRatio ? args.denominators.slice(1) : undefined,
          targets: new Array(n_mr),
          ll99: new Array(n_mr),
          ll95: new Array(n_mr),
          ll68: new Array(n_mr),
          ul68: new Array(n_mr),
          ul95: new Array(n_mr),
          ul99: new Array(n_mr)
      };
      for (let i = 0; i < n_mr; i++) {
          rtn.values[i] = consec_diff[i];
          if (useRatio) {
              rtn.numerators[i] = numerators[i + 1];
              rtn.denominators[i] = denominators[i + 1];
          }
          rtn.targets[i] = cl;
          rtn.ll99[i] = 0;
          rtn.ll95[i] = 0;
          rtn.ll68[i] = 0;
          rtn.ul68[i] = (3.267 / 3) * 1 * cl;
          rtn.ul95[i] = (3.267 / 3) * 2 * cl;
          rtn.ul99[i] = 3.267 * cl;
      }
      return rtn;
  }

  function pLimits(args) {
      const numerators = args.numerators;
      const denominators = args.denominators;
      const subset_points = args.subset_points;
      const n_sub = subset_points.length;
      let sum_num = 0;
      let sum_den = 0;
      for (let i = 0; i < n_sub; i++) {
          sum_num += numerators[subset_points[i]];
          sum_den += denominators[subset_points[i]];
      }
      const cl = sum_num / sum_den;
      const cl_mult = cl * (1 - cl);
      const n = args.keys.length;
      let rtn = {
          keys: args.keys,
          values: new Array(n),
          numerators: args.numerators,
          denominators: args.denominators,
          targets: new Array(n),
          ll99: new Array(n),
          ll95: new Array(n),
          ll68: new Array(n),
          ul68: new Array(n),
          ul95: new Array(n),
          ul99: new Array(n)
      };
      for (let i = 0; i < n; i++) {
          const sigma = Math.sqrt(cl_mult / denominators[i]);
          const twoSigma = 2 * sigma;
          const threeSigma = 3 * sigma;
          rtn.values[i] = numerators[i] / denominators[i];
          rtn.targets[i] = cl;
          rtn.ll99[i] = Math.max(0, cl - threeSigma);
          rtn.ll95[i] = Math.max(0, cl - twoSigma);
          rtn.ll68[i] = Math.max(0, cl - sigma);
          rtn.ul68[i] = Math.min(1, cl + sigma);
          rtn.ul95[i] = Math.min(1, cl + twoSigma);
          rtn.ul99[i] = Math.min(1, cl + threeSigma);
      }
      return rtn;
  }

  function pprimeLimits(args) {
      const n = args.keys.length;
      const numerators = args.numerators;
      const denominators = args.denominators;
      const subset_points = args.subset_points;
      const n_sub = subset_points.length;
      let val = new Array(n);
      for (let i = 0; i < n; i++) {
          val[i] = numerators[i] / denominators[i];
      }
      let sum_numerators = 0;
      let sum_denominators = 0;
      for (let i = 0; i < n_sub; i++) {
          let idx = subset_points[i];
          sum_numerators += numerators[idx];
          sum_denominators += denominators[idx];
      }
      const cl = sum_numerators / sum_denominators;
      let sd = new Array(n);
      for (let i = 0; i < n; i++) {
          sd[i] = Math.sqrt((cl * (1 - cl)) / denominators[i]);
      }
      let zscore = new Array(n_sub);
      for (let i = 0; i < n_sub; i++) {
          let idx = subset_points[i];
          zscore[i] = (val[idx] - cl) / sd[idx];
      }
      let consec_diff = new Array(n_sub - 1);
      let amr = 0;
      for (let i = 1; i < n_sub; i++) {
          consec_diff[i - 1] = Math.abs(zscore[i] - zscore[i - 1]);
          amr += consec_diff[i - 1];
      }
      amr /= (n_sub - 1);
      if (!args.outliers_in_limits) {
          const consec_diff_ulim = amr * 3.267;
          let screened_amr = 0;
          let screened_count = 0;
          for (let i = 0; i < consec_diff.length; i++) {
              if (consec_diff[i] < consec_diff_ulim) {
                  screened_amr += consec_diff[i];
                  screened_count += 1;
              }
          }
          amr = screened_amr / screened_count;
      }
      const sigma_multiplier = amr / 1.128;
      let rtn = {
          keys: args.keys,
          values: val,
          numerators: args.numerators,
          denominators: args.denominators,
          targets: new Array(n),
          ll99: new Array(n),
          ll95: new Array(n),
          ll68: new Array(n),
          ul68: new Array(n),
          ul95: new Array(n),
          ul99: new Array(n)
      };
      for (let i = 0; i < n; i++) {
          const sigma = sd[i] * sigma_multiplier;
          rtn.targets[i] = cl;
          rtn.ll99[i] = Math.max(0, cl - 3 * sigma);
          rtn.ll95[i] = Math.max(0, cl - 2 * sigma);
          rtn.ll68[i] = Math.max(0, cl - 1 * sigma);
          rtn.ul68[i] = Math.min(1, cl + 1 * sigma);
          rtn.ul95[i] = Math.min(1, cl + 2 * sigma);
          rtn.ul99[i] = Math.min(1, cl + 3 * sigma);
      }
      return rtn;
  }

  function runLimits(args) {
      const useRatio = (args.denominators && args.denominators.length > 0);
      const n_sub = args.subset_points.length;
      const numerators = args.numerators;
      const denominators = args.denominators;
      const subset_points = args.subset_points;
      let ratio_subset = new Array(n_sub);
      for (let i = 0; i < n_sub; i++) {
          ratio_subset[i] = useRatio ? numerators[subset_points[i]] / denominators[subset_points[i]]
              : numerators[subset_points[i]];
      }
      let sorted_subset = ratio_subset.slice().sort((a, b) => a - b);
      let cl;
      if (n_sub % 2 === 0) {
          cl = (sorted_subset[n_sub / 2 - 1] + sorted_subset[n_sub / 2]) / 2;
      }
      else {
          cl = sorted_subset[Math.floor(n_sub / 2)];
      }
      const n = args.keys.length;
      let rtn = {
          keys: args.keys,
          values: new Array(n),
          numerators: useRatio ? args.numerators : undefined,
          denominators: useRatio ? args.denominators : undefined,
          targets: new Array(n)
      };
      for (let i = 0; i < n; i++) {
          if (useRatio) {
              rtn.values[i] = numerators[i] / denominators[i];
              rtn.numerators[i] = numerators[i];
              rtn.denominators[i] = denominators[i];
          }
          else {
              rtn.values[i] = numerators[i];
          }
          rtn.targets[i] = cl;
      }
      return rtn;
  }

  function chebyshevPolynomial(x, a, n) {
      if (x < -1.1 || x > 1.1) {
          throw new Error("chebyshevPolynomial: x must be in [-1,1]");
      }
      if (n < 1 || n > 1000) {
          throw new Error("chebyshevPolynomial: n must be in [1,1000]");
      }
      const twox = x * 2;
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      for (let i = 1; i <= n; i++) {
          b2 = b1;
          b1 = b0;
          b0 = twox * b1 - b2 + a[n - i];
      }
      return (b0 - b2) * 0.5;
  }

  function sinpi(x) {
      if (Number.isNaN(x) || !Number.isFinite(x)) {
          return Number.NaN;
      }
      let r = x % 2;
      if (r <= -1) {
          r += 2;
      }
      else if (r > 1) {
          r -= 2;
      }
      if (r === 0 || r === 1) {
          return 0;
      }
      if (r === 0.5) {
          return 1;
      }
      if (r === -0.5) {
          return -1;
      }
      return Math.sin(Math.PI * r);
  }

  function lgammaCorrection(x) {
      const algmcs = [
          .1666389480451863247205729650822e+0,
          -1384948176067564e-20,
          .9810825646924729426157171547487e-8,
          -1809129475572494e-26,
          .6221098041892605227126015543416e-13,
          -3399615005417722e-31,
          .2683181998482698748957538846666e-17,
          -2868042435334643e-35,
          .3962837061046434803679306666666e-21,
          -6831888753985767e-39,
          .1429227355942498147573333333333e-24,
          -35475981581010704e-43,
          .1025680058010470912000000000000e-27,
          -3401102254316749e-45,
          .1276642195630062933333333333333e-30
      ];
      if (x < 10) {
          throw new Error("lgammaCorrection: x must be >= 10");
      }
      else if (x < 94906265.62425156) {
          const tmp = 10 / x;
          return chebyshevPolynomial(tmp * tmp * 2 - 1, algmcs, 5) / x;
      }
      else {
          return 1 / (x * 12);
      }
  }

  function ldexp(x, exp) {
      return x * Math.pow(2, exp);
  }

  function logcf(x, i, d, eps) {
      let c1 = 2 * d;
      let c2 = i + d;
      let c4 = c2 + d;
      let a1 = c2;
      let b1 = i * (c2 - i * x);
      let b2 = d * d * x;
      let a2 = c4 * c2 - b2;
      const scalefactor = 1.157921e+77;
      b2 = c4 * b1 - i * b2;
      while (Math.abs(a2 * b1 - a1 * b2) > Math.abs(eps * b1 * b2)) {
          let c3 = c2 * c2 * x;
          c2 += d;
          c4 += d;
          a1 = c4 * a2 - c3 * a1;
          b1 = c4 * b2 - c3 * b1;
          c3 = c1 * c1 * x;
          c1 += d;
          c4 += d;
          a2 = c4 * a1 - c3 * a2;
          b2 = c4 * b1 - c3 * b2;
          if (Math.abs(b2) > scalefactor) {
              a1 /= scalefactor;
              b1 /= scalefactor;
              a2 /= scalefactor;
              b2 /= scalefactor;
          }
          else if (Math.abs(b2) < 1 / scalefactor) {
              a1 *= scalefactor;
              b1 *= scalefactor;
              a2 *= scalefactor;
              b2 *= scalefactor;
          }
      }
      return a2 / b2;
  }

  function log1pmx(x) {
      if (x > 1 || x < -0.79149064) {
          return Math.log1p(x) - x;
      }
      else {
          const r = x / (2 + x);
          const y = r * r;
          if (Math.abs(x) < 1e-2) {
              const coefs = [2 / 3, 2 / 5, 2 / 7, 2 / 9];
              let result = 0;
              for (let i = 0; i < coefs.length; i++) {
                  result = (result + coefs[i]) * y;
              }
              return r * (result - x);
          }
          else {
              return r * (2 * y * logcf(y, 3, 2, 1e-14) - x);
          }
      }
  }

  const LOG_TWO_PI = 1.837877066409345483560659472811;
  const LOG_SQRT_TWO_PI = 0.918938533204672741780329736406;
  const LOG_SQRT_PI_DIV_2 = 0.225791352644727432363097614947;
  const EULER = 0.5772156649015328606065120900824024;

  function lgamma1p(a) {
      if (Math.abs(a) >= 0.5) {
          return lgamma(a + 1);
      }
      const coeffs = [
          0.3224670334241132182362075833230126e-0,
          0.6735230105319809513324605383715000e-1,
          0.2058080842778454787900092413529198e-1,
          0.7385551028673985266273097291406834e-2,
          0.2890510330741523285752988298486755e-2,
          0.1192753911703260977113935692828109e-2,
          0.5096695247430424223356548135815582e-3,
          0.2231547584535793797614188036013401e-3,
          0.9945751278180853371459589003190170e-4,
          0.4492623673813314170020750240635786e-4,
          0.2050721277567069155316650397830591e-4,
          0.9439488275268395903987425104415055e-5,
          0.4374866789907487804181793223952411e-5,
          0.2039215753801366236781900709670839e-5,
          0.9551412130407419832857179772951265e-6,
          0.4492469198764566043294290331193655e-6,
          0.2120718480555466586923135901077628e-6,
          0.1004322482396809960872083050053344e-6,
          0.4769810169363980565760193417246730e-7,
          0.2271109460894316491031998116062124e-7,
          0.1083865921489695409107491757968159e-7,
          0.5183475041970046655121248647057669e-8,
          0.2483674543802478317185008663991718e-8,
          0.1192140140586091207442548202774640e-8,
          0.5731367241678862013330194857961011e-9,
          0.2759522885124233145178149692816341e-9,
          0.1330476437424448948149715720858008e-9,
          0.6422964563838100022082448087644648e-10,
          0.3104424774732227276239215783404066e-10,
          0.1502138408075414217093301048780668e-10,
          0.7275974480239079662504549924814047e-11,
          0.3527742476575915083615072228655483e-11,
          0.1711991790559617908601084114443031e-11,
          0.8315385841420284819798357793954418e-12,
          0.4042200525289440065536008957032895e-12,
          0.1966475631096616490411045679010286e-12,
          0.9573630387838555763782200936508615e-13,
          0.4664076026428374224576492565974577e-13,
          0.2273736960065972320633279596737272e-13,
          0.1109139947083452201658320007192334e-13
      ];
      const N = coeffs.length;
      const c = 0.2273736845824652515226821577978691e-12;
      let lgam = c * logcf(-a / 2, N + 2, 1, 1e-14);
      for (let i = N - 1; i >= 0; i--) {
          lgam = coeffs[i] - a * lgam;
      }
      return (a * lgam - EULER) * a - log1pmx(a);
  }

  function stirlingError(n) {
      const s_coeffs = [
          0.083333333333333333333,
          0.00277777777777777777778,
          0.00079365079365079365079365,
          0.000595238095238095238095238,
          0.0008417508417508417508417508,
          0.0019175269175269175269175262,
          0.0064102564102564102564102561,
          0.029550653594771241830065352,
          0.17964437236883057316493850,
          1.3924322169059011164274315,
          13.402864044168391994478957,
          156.84828462600201730636509,
          2193.1033333333333333333333,
          36108.771253724989357173269,
          691472.26885131306710839498,
          15238221.539407416192283370,
          382900751.39141414141414141
      ];
      const sferr_halves = [
          0.0,
          0.1534264097200273452913848,
          0.0810614667953272582196702,
          0.0548141210519176538961390,
          0.0413406959554092940938221,
          0.03316287351993628748511048,
          0.02767792568499833914878929,
          0.02374616365629749597132920,
          0.02079067210376509311152277,
          0.01848845053267318523077934,
          0.01664469118982119216319487,
          0.01513497322191737887351255,
          0.01387612882307074799874573,
          0.01281046524292022692424986,
          0.01189670994589177009505572,
          0.01110455975820691732662991,
          0.010411265261972096497478567,
          0.009799416126158803298389475,
          0.009255462182712732917728637,
          0.008768700134139385462952823,
          0.008330563433362871256469318,
          0.007934114564314020547248100,
          0.007573675487951840794972024,
          0.007244554301320383179543912,
          0.006942840107209529865664152,
          0.006665247032707682442354394,
          0.006408994188004207068439631,
          0.006171712263039457647532867,
          0.005951370112758847735624416,
          0.005746216513010115682023589,
          0.005554733551962801371038690
      ];
      let nn = n + n;
      if (n <= 15 && nn === Math.trunc(nn)) {
          return sferr_halves[nn];
      }
      if (n <= 5.25) {
          if (n >= 1) {
              const l_n = Math.log(n);
              return lgamma(n) + n * (1 - l_n) + ldexp(l_n - LOG_TWO_PI, -1);
          }
          else {
              return lgamma1p(n) - (n + 0.5) * Math.log(n) + n - LOG_SQRT_TWO_PI;
          }
      }
      let start_coeff;
      if (n > 15.7e6) {
          start_coeff = 0;
      }
      else if (n > 6180) {
          start_coeff = 1;
      }
      else if (n > 205) {
          start_coeff = 2;
      }
      else if (n > 86) {
          start_coeff = 3;
      }
      else if (n > 27) {
          start_coeff = 4;
      }
      else if (n > 23.5) {
          start_coeff = 5;
      }
      else if (n > 12.8) {
          start_coeff = 6;
      }
      else if (n > 12.3) {
          start_coeff = 7;
      }
      else if (n > 8.9) {
          start_coeff = 8;
      }
      else if (n > 7.3) {
          start_coeff = 10;
      }
      else if (n > 6.6) {
          start_coeff = 12;
      }
      else if (n > 6.1) {
          start_coeff = 14;
      }
      else {
          start_coeff = 16;
      }
      nn = n * n;
      let sum = s_coeffs[start_coeff];
      for (let i = start_coeff - 1; i >= 0; i--) {
          sum = s_coeffs[i] - sum / nn;
      }
      return sum / n;
  }

  function gamma(x) {
      const gamcs = [
          .8571195590989331421920062399942e-2,
          .4415381324841006757191315771652e-2,
          .5685043681599363378632664588789e-1,
          -0.00421983539641856,
          .1326808181212460220584006796352e-2,
          -18930245297988805e-20,
          .3606925327441245256578082217225e-4,
          -6056761904460864e-21,
          .1055829546302283344731823509093e-5,
          -1.811967365542384e-7,
          .3117724964715322277790254593169e-7,
          -5.354219639019687e-9,
          .9193275519859588946887786825940e-9,
          -15779412802883398e-26,
          .2707980622934954543266540433089e-10,
          -464681865382573e-26,
          .7973350192007419656460767175359e-12,
          -1368078209830916e-28,
          .2347319486563800657233471771688e-13,
          -4027432614949067e-30,
          .6910051747372100912138336975257e-15,
          -1185584500221993e-31,
          .2034148542496373955201026051932e-16,
          -3490054341717406e-33,
          .5987993856485305567135051066026e-18,
          -1027378057872228e-34,
          .1762702816060529824942759660748e-19,
          -3024320653735306e-36,
          .5188914660218397839717833550506e-21,
          -8902770842456576e-38,
          .1527474068493342602274596891306e-22,
          -2620731256187363e-39,
          .4496464047830538670331046570666e-24,
          -7714712731336878e-41,
          .1323635453126044036486572714666e-25,
          -22709994129429287e-43,
          .3896418998003991449320816639999e-27,
          -6685198115125953e-44,
          .1146998663140024384347613866666e-28,
          -19679385863451348e-46,
          .3376448816585338090334890666666e-30,
          -5793070335782136e-47
      ];
      const dxrel = 1.490116119384765696e-8;
      if (Number.isNaN(x)) {
          return Number.NaN;
      }
      if (x == 0 || (x < 0 && x === Math.trunc(x))) {
          return Number.NaN;
      }
      let y = Math.abs(x);
      let value;
      if (y <= 10) {
          let n = Math.trunc(x);
          if (x < 0) {
              n--;
          }
          y = x - n;
          n--;
          value = chebyshevPolynomial(y * 2 - 1, gamcs, 22) + .9375;
          if (n == 0) {
              return value;
          }
          if (n < 0) {
              if (x < -0.5 && Math.abs(x - Math.trunc(x - 0.5) / x) < dxrel) {
                  return Number.NaN;
              }
              if (y < 2.2474362225598545e-308) {
                  return x < 0 ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
              }
              n *= -1;
              for (let i = 0; i < n; i++) {
                  value /= (x + i);
              }
              return value;
          }
          else {
              for (let i = 1; i <= n; i++) {
                  value *= (y + i);
              }
              return value;
          }
      }
      else {
          if (x > 171.61447887182298) {
              return Number.POSITIVE_INFINITY;
          }
          if (x < -170.5674972726612) {
              return 0;
          }
          if (y <= 50 && y == Math.trunc(y)) {
              value = 1;
              for (let i = 2; i < y; i++) {
                  value *= i;
              }
          }
          else {
              const two_y = 2 * y;
              value = Math.exp((y - 0.5) * Math.log(y) - y + LOG_SQRT_TWO_PI
                  + ((two_y == Math.trunc(two_y)) ? stirlingError(y) : lgammaCorrection(y)));
          }
          if (x > 0) {
              return value;
          }
          const sinpiy = sinpi(y);
          return (sinpiy === 0) ? Number.POSITIVE_INFINITY : -Math.PI / (y * sinpiy * value);
      }
  }

  function lgamma(x) {
      if (Number.isNaN(x)) {
          return Number.NaN;
      }
      if (x <= 0 && x === Math.trunc(x)) {
          return Number.POSITIVE_INFINITY;
      }
      const y = Math.abs(x);
      if (y < 1e-306) {
          return -Math.log(y);
      }
      if (y <= 10) {
          return Math.log(Math.abs(gamma(x)));
      }
      if (y > Number.MAX_VALUE) {
          return Number.POSITIVE_INFINITY;
      }
      if (x > 0) {
          if (x > 1e17) {
              return x * (Math.log(x) - 1);
          }
          else {
              return LOG_SQRT_TWO_PI + (x - 0.5) * Math.log(x) - x
                  + ((x > 4934720) ? 0 : lgammaCorrection(x));
          }
      }
      return LOG_SQRT_PI_DIV_2 + (x - 0.5) * Math.log(y)
          - x - Math.log(Math.abs(sinpi(y))) - lgammaCorrection(y);
  }

  function c4(sampleSize) {
      if ((sampleSize <= 1) || isNullOrUndefined(sampleSize)) {
          return null;
      }
      const Nminus1 = sampleSize - 1;
      return Math.sqrt(2.0 / Nminus1)
          * Math.exp(lgamma(sampleSize / 2.0) - lgamma(Nminus1 / 2.0));
  }
  function c5(sampleSize) {
      return Math.sqrt(1 - Math.pow(c4(sampleSize), 2));
  }
  function a3(sampleSize) {
      const filt_samp = sampleSize <= 1 ? null : sampleSize;
      return 3.0 / (c4(filt_samp) * Math.sqrt(filt_samp));
  }
  function b_helper(sampleSize, sigma) {
      return (sigma * c5(sampleSize)) / c4(sampleSize);
  }
  function b3(sampleSize, sigma) {
      return 1 - b_helper(sampleSize, sigma);
  }
  function b4(sampleSize, sigma) {
      return 1 + b_helper(sampleSize, sigma);
  }

  function sLimits(args) {
      const group_sd = args.numerators;
      const count_per_group = args.denominators;
      const n_sub = args.subset_points.length;
      let Nm1_sum = 0;
      let weighted_sd_sum = 0;
      for (let i = 0; i < n_sub; i++) {
          const curr_count = count_per_group[args.subset_points[i]];
          const curr_sd = group_sd[args.subset_points[i]];
          const Nm1 = curr_count - 1;
          Nm1_sum += Nm1;
          weighted_sd_sum += Nm1 * Math.pow(curr_sd, 2);
      }
      const cl = Math.sqrt(weighted_sd_sum / Nm1_sum);
      const n = args.keys.length;
      let rtn = {
          keys: args.keys,
          values: group_sd,
          targets: new Array(n),
          ll99: new Array(n),
          ll95: new Array(n),
          ll68: new Array(n),
          ul68: new Array(n),
          ul95: new Array(n),
          ul99: new Array(n)
      };
      for (let i = 0; i < n; i++) {
          rtn.targets[i] = cl;
          rtn.ll99[i] = cl * b3(count_per_group[i], 3);
          rtn.ll95[i] = cl * b3(count_per_group[i], 2);
          rtn.ll68[i] = cl * b3(count_per_group[i], 1);
          rtn.ul68[i] = cl * b4(count_per_group[i], 1);
          rtn.ul95[i] = cl * b4(count_per_group[i], 2);
          rtn.ul99[i] = cl * b4(count_per_group[i], 3);
      }
      return rtn;
  }

  function tLimits(args) {
      const n = args.keys.length;
      let val = new Array(n);
      for (let i = 0; i < n; i++) {
          val[i] = Math.pow(args.numerators[i], 1 / 3.6);
      }
      const inputArgsCopy = {
          numerators: val,
          denominators: null,
          keys: args.keys,
          subset_points: args.subset_points,
          outliers_in_limits: args.outliers_in_limits
      };
      const limits = iLimits(inputArgsCopy);
      for (let i = 0; i < n; i++) {
          limits.targets[i] = Math.pow(limits.targets[i], 3.6);
          limits.values[i] = Math.pow(limits.values[i], 3.6);
          limits.ll99[i] = Math.max(0, Math.pow(limits.ll99[i], 3.6));
          limits.ll95[i] = Math.max(0, Math.pow(limits.ll95[i], 3.6));
          limits.ll68[i] = Math.max(0, Math.pow(limits.ll68[i], 3.6));
          limits.ul68[i] = Math.pow(limits.ul68[i], 3.6);
          limits.ul95[i] = Math.pow(limits.ul95[i], 3.6);
          limits.ul99[i] = Math.pow(limits.ul99[i], 3.6);
      }
      return limits;
  }

  function uLimits(args) {
      const n = args.keys.length;
      const numerators = args.numerators;
      const denominators = args.denominators;
      const subset_points = args.subset_points;
      let sum_numerators = 0;
      let sum_denominators = 0;
      for (let i = 0; i < subset_points.length; i++) {
          let idx = subset_points[i];
          sum_numerators += numerators[idx];
          sum_denominators += denominators[idx];
      }
      const cl = sum_numerators / sum_denominators;
      let rtn = {
          keys: args.keys,
          values: new Array(n),
          numerators: args.numerators,
          denominators: args.denominators,
          targets: new Array(n),
          ll99: new Array(n),
          ll95: new Array(n),
          ll68: new Array(n),
          ul68: new Array(n),
          ul95: new Array(n),
          ul99: new Array(n)
      };
      for (let i = 0; i < n; i++) {
          rtn.values[i] = numerators[i] / denominators[i];
          const sigma = Math.sqrt(cl / denominators[i]);
          rtn.targets[i] = cl;
          rtn.ll99[i] = Math.max(0, cl - 3 * sigma);
          rtn.ll95[i] = Math.max(0, cl - 2 * sigma);
          rtn.ll68[i] = Math.max(0, cl - 1 * sigma);
          rtn.ul68[i] = cl + 1 * sigma;
          rtn.ul95[i] = cl + 2 * sigma;
          rtn.ul99[i] = cl + 3 * sigma;
      }
      return rtn;
  }

  function uprimeLimits(args) {
      const n = args.keys.length;
      const numerators = args.numerators;
      const denominators = args.denominators;
      const subset_points = args.subset_points;
      const n_sub = subset_points.length;
      let val = new Array(n);
      for (let i = 0; i < n; i++) {
          val[i] = numerators[i] / denominators[i];
      }
      let sum_numerators = 0;
      let sum_denominators = 0;
      for (let i = 0; i < n_sub; i++) {
          let idx = subset_points[i];
          sum_numerators += numerators[idx];
          sum_denominators += denominators[idx];
      }
      const cl = sum_numerators / sum_denominators;
      let sd = new Array(n);
      for (let i = 0; i < n; i++) {
          sd[i] = Math.sqrt(cl / denominators[i]);
      }
      let zscore = new Array(n_sub);
      for (let i = 0; i < n_sub; i++) {
          let idx = subset_points[i];
          zscore[i] = (val[idx] - cl) / sd[idx];
      }
      let consec_diff = new Array(n_sub - 1);
      let amr = 0;
      for (let i = 1; i < n_sub; i++) {
          consec_diff[i - 1] = Math.abs(zscore[i] - zscore[i - 1]);
          amr += consec_diff[i - 1];
      }
      amr /= (n_sub - 1);
      if (!args.outliers_in_limits) {
          const consec_diff_ulim = amr * 3.267;
          let screened_amr = 0;
          let screened_count = 0;
          for (let i = 0; i < consec_diff.length; i++) {
              if (consec_diff[i] < consec_diff_ulim) {
                  screened_amr += consec_diff[i];
                  screened_count += 1;
              }
          }
          amr = screened_amr / screened_count;
      }
      const sigma_multiplier = amr / 1.128;
      let rtn = {
          keys: args.keys,
          values: val,
          numerators: args.numerators,
          denominators: args.denominators,
          targets: new Array(n),
          ll99: new Array(n),
          ll95: new Array(n),
          ll68: new Array(n),
          ul68: new Array(n),
          ul95: new Array(n),
          ul99: new Array(n)
      };
      for (let i = 0; i < n; i++) {
          const sigma = sd[i] * sigma_multiplier;
          rtn.targets[i] = cl;
          rtn.ll99[i] = Math.max(0, cl - 3 * sigma);
          rtn.ll95[i] = Math.max(0, cl - 2 * sigma);
          rtn.ll68[i] = Math.max(0, cl - 1 * sigma);
          rtn.ul68[i] = cl + 1 * sigma;
          rtn.ul95[i] = cl + 2 * sigma;
          rtn.ul99[i] = cl + 3 * sigma;
      }
      return rtn;
  }

  function xbarLimits(args) {
      const count_per_group = args.denominators;
      const group_means = args.numerators;
      const group_sd = args.xbar_sds;
      const n_sub = args.subset_points.length;
      const subset_points = args.subset_points;
      let Nm1_sum = 0;
      let weighted_sd_sum = 0;
      let weighted_mean_sum = 0;
      let total_count = 0;
      for (let i = 0; i < n_sub; i++) {
          const curr_count = count_per_group[subset_points[i]];
          const curr_mean = group_means[subset_points[i]];
          const curr_sd = group_sd[subset_points[i]];
          const Nm1 = curr_count - 1;
          Nm1_sum += Nm1;
          weighted_sd_sum += Nm1 * Math.pow(curr_sd, 2);
          weighted_mean_sum += curr_count * curr_mean;
          total_count += curr_count;
      }
      const sd = Math.sqrt(weighted_sd_sum / Nm1_sum);
      const cl = weighted_mean_sum / total_count;
      const n = args.keys.length;
      let rtn = {
          keys: args.keys,
          values: group_means,
          targets: new Array(n),
          ll99: new Array(n),
          ll95: new Array(n),
          ll68: new Array(n),
          ul68: new Array(n),
          ul95: new Array(n),
          ul99: new Array(n),
          count: count_per_group
      };
      for (let i = 0; i < n; i++) {
          const A3_sd = a3(count_per_group[i]) * sd;
          const A3_sd_div_3 = (A3_sd / 3);
          rtn.targets[i] = cl;
          rtn.ll99[i] = cl - A3_sd;
          rtn.ll95[i] = cl - A3_sd_div_3 * 2;
          rtn.ll68[i] = cl - A3_sd_div_3;
          rtn.ul68[i] = cl + A3_sd_div_3;
          rtn.ul95[i] = cl + A3_sd_div_3 * 2;
          rtn.ul99[i] = cl + A3_sd;
      }
      return rtn;
  }

  var limitFunctions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    c: cLimits,
    g: gLimits,
    i: iLimits,
    i_m: imLimits,
    i_mm: immLimits,
    mr: mrLimits,
    p: pLimits,
    pp: pprimeLimits,
    r: runLimits,
    run: runLimits,
    s: sLimits,
    t: tLimits,
    u: uLimits,
    up: uprimeLimits,
    xbar: xbarLimits
  });

  function rep(x, n) {
      let result = new Array(n);
      for (let i = 0; i < n; i++) {
          result[i] = x;
      }
      return result;
  }

  function getSettingValue(settingObject, settingGroup, settingName, defaultValue) {
      var _a;
      const propertyValue = (_a = settingObject === null || settingObject === void 0 ? void 0 : settingObject[settingGroup]) === null || _a === void 0 ? void 0 : _a[settingName];
      if (isNullOrUndefined(propertyValue)) {
          return defaultValue;
      }
      return (propertyValue === null || propertyValue === void 0 ? void 0 : propertyValue.solid) ? propertyValue.solid.color
          : propertyValue;
  }
  function extractConditionalFormatting(categoricalView, settingGroupName, inputSettings, idxs) {
      var _a, _b, _c;
      if (isNullOrUndefined(categoricalView === null || categoricalView === void 0 ? void 0 : categoricalView.categories)) {
          return { values: null, validation: { status: 0, messages: rep(new Array(), 1) } };
      }
      if (((_c = (_b = (_a = categoricalView === null || categoricalView === void 0 ? void 0 : categoricalView.categories) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.identity) === null || _c === void 0 ? void 0 : _c.length) === 0) {
          return { values: null, validation: { status: 0, messages: rep(new Array(), 1) } };
      }
      const inputCategories = categoricalView.categories[0];
      const settingNames = Object.keys(inputSettings[settingGroupName]);
      const validationRtn = JSON.parse(JSON.stringify({ status: 0, messages: rep([], inputCategories.values.length) }));
      const n = idxs.length;
      let rtn = new Array(n);
      for (let i = 0; i < n; i++) {
          const inpObjects = inputCategories.objects ? inputCategories.objects[idxs[i]] : null;
          rtn[i] = Object.fromEntries(settingNames.map(settingName => {
              var _a, _b, _c, _d, _e, _f, _g;
              const defaultSetting = defaultSettings[settingGroupName][settingName]["default"];
              let extractedSetting = getSettingValue(inpObjects, settingGroupName, settingName, defaultSetting);
              extractedSetting = extractedSetting === "" ? defaultSetting : extractedSetting;
              const valid = (_b = (_a = defaultSettings[settingGroupName][settingName]) === null || _a === void 0 ? void 0 : _a["valid"]) !== null && _b !== void 0 ? _b : (_c = defaultSettings[settingGroupName][settingName]) === null || _c === void 0 ? void 0 : _c["options"];
              const isNumericRange = !isNullOrUndefined(valid === null || valid === void 0 ? void 0 : valid.minValue) || !isNullOrUndefined(valid === null || valid === void 0 ? void 0 : valid.maxValue);
              if (valid) {
                  let message = "";
                  if (valid instanceof Array && !valid.includes(extractedSetting)) {
                      message = `${extractedSetting} is not a valid value for ${settingName}. Valid values are: ${valid.join(", ")}`;
                  }
                  else if (isNumericRange && !between(extractedSetting, (_d = valid === null || valid === void 0 ? void 0 : valid.minValue) === null || _d === void 0 ? void 0 : _d.value, (_e = valid === null || valid === void 0 ? void 0 : valid.maxValue) === null || _e === void 0 ? void 0 : _e.value)) {
                      message = `${extractedSetting} is not a valid value for ${settingName}. Valid values are between ${(_f = valid === null || valid === void 0 ? void 0 : valid.minValue) === null || _f === void 0 ? void 0 : _f.value} and ${(_g = valid === null || valid === void 0 ? void 0 : valid.maxValue) === null || _g === void 0 ? void 0 : _g.value}`;
                  }
                  if (message !== "") {
                      extractedSetting = defaultSettings[settingGroupName][settingName]["default"];
                      validationRtn.messages[i].push(message);
                  }
              }
              return [settingName, extractedSetting];
          }));
      }
      const validationMessages = validationRtn.messages.filter(d => d.length > 0);
      if (!validationRtn.messages.some(d => d.length === 0)) {
          validationRtn.status = 1;
          validationRtn.error = `${validationMessages[0][0]}`;
      }
      return { values: rtn, validation: validationRtn };
  }

  const valueNames = {
      "i": "Observation",
      "i_m": "Observation",
      "i_mm": "Observation",
      "c": "Count",
      "t": "Time",
      "xbar": "Group Mean",
      "s": "Group SD",
      "g": "Non-Events",
      "run": "Observation",
      "mr": "Moving Range",
      "p": "Proportion",
      "pp": "Proportion",
      "u": "Rate",
      "up": "Rate"
  };
  class derivedSettingsClass {
      update(inputSettingsSpc) {
          const chartType = inputSettingsSpc.chart_type;
          const pChartType = ["p", "pp"].includes(chartType);
          const percentSettingString = inputSettingsSpc.perc_labels;
          let multiplier = inputSettingsSpc.multiplier;
          let percentLabels;
          if (percentSettingString === "Yes") {
              multiplier = 100;
          }
          if (pChartType && percentSettingString !== "No") {
              multiplier = multiplier === 1 ? 100 : multiplier;
          }
          if (percentSettingString === "Automatic") {
              percentLabels = pChartType && multiplier === 100;
          }
          else {
              percentLabels = percentSettingString === "Yes";
          }
          this.chart_type_props = {
              name: chartType,
              needs_denominator: ["p", "pp", "u", "up", "xbar", "s"].includes(chartType),
              denominator_optional: ["i", "i_m", "i_mm", "run", "mr"].includes(chartType),
              numerator_non_negative: ["p", "pp", "u", "up", "s", "c", "g", "t"].includes(chartType),
              numerator_leq_denominator: ["p", "pp", "u", "up"].includes(chartType),
              has_control_limits: !(["run"].includes(chartType)),
              needs_sd: ["xbar"].includes(chartType),
              integer_num_den: ["c", "p", "pp"].includes(chartType),
              value_name: valueNames[chartType],
              x_axis_use_date: !(["g", "t"].includes(chartType)),
              date_name: !(["g", "t"].includes(chartType)) ? "Date" : "Event"
          };
          this.multiplier = multiplier;
          this.percentLabels = percentLabels;
      }
  }

  class settingsClass {
      update(inputView, groupIdxs) {
          this.validationStatus
              = JSON.parse(JSON.stringify({ status: 0, messages: new Array(), error: "" }));
          this.settings = new Array();
          this.derivedSettings = new Array();
          groupIdxs.forEach(() => {
              this.settings.push(Object.fromEntries(Object.keys(defaultSettings).map((settingGroupName) => {
                  return [settingGroupName, Object.fromEntries(Object.keys(defaultSettings[settingGroupName]).map((settingName) => {
                          return [settingName, defaultSettings[settingGroupName][settingName]];
                      }))];
              })));
              this.derivedSettings.push(new derivedSettingsClass());
          });
          const all_idxs = groupIdxs.flat();
          const allSettingGroups = Object.keys(this.settings[0]);
          allSettingGroups.forEach((settingGroup) => {
              const condFormatting = extractConditionalFormatting(inputView === null || inputView === void 0 ? void 0 : inputView.categorical, settingGroup, this.settings[0], all_idxs);
              if (condFormatting.validation.status !== 0) {
                  this.validationStatus.status = condFormatting.validation.status;
                  this.validationStatus.error = condFormatting.validation.error;
              }
              if (this.validationStatus.messages.length === 0) {
                  this.validationStatus.messages = condFormatting.validation.messages;
              }
              else if (!condFormatting.validation.messages.every(d => d.length === 0)) {
                  condFormatting.validation.messages.forEach((message, idx) => {
                      if (message.length > 0) {
                          this.validationStatus.messages[idx] = this.validationStatus.messages[idx].concat(message);
                      }
                  });
              }
              const settingNames = Object.keys(this.settings[0][settingGroup]);
              settingNames.forEach((settingName) => {
                  groupIdxs.forEach((idx, idx_idx) => {
                      this.settings[idx_idx][settingGroup][settingName]
                          = (condFormatting === null || condFormatting === void 0 ? void 0 : condFormatting.values)
                              ? condFormatting === null || condFormatting === void 0 ? void 0 : condFormatting.values[idx[0]][settingName]
                              : defaultSettings[settingGroup][settingName]["default"];
                  });
              });
          });
          if (this.settings[0].nhs_icons.show_variation_icons) {
              const patterns = ["astronomical", "shift", "trend", "two_in_three"];
              const anyOutlierPatterns = patterns.some(d => this.settings[0].outliers[d]);
              if (!anyOutlierPatterns) {
                  this.validationStatus.status = 1;
                  this.validationStatus.error = "Variation icons require at least one outlier pattern to be selected";
              }
          }
          this.settings.forEach((settingsItem, idx) => {
              this.derivedSettings[idx].update(settingsItem.spc);
          });
      }
      getFormattingModel() {
          var _a, _b;
          const formattingModel = {
              cards: []
          };
          for (const curr_card_name in settingsModel) {
              let curr_card = {
                  description: settingsModel[curr_card_name].description,
                  displayName: settingsModel[curr_card_name].displayName,
                  uid: curr_card_name + "_card_uid",
                  groups: [],
                  revertToDefaultDescriptors: []
              };
              for (const card_group in settingsModel[curr_card_name].settingsGroups) {
                  let curr_group = {
                      displayName: card_group === "all" ? settingsModel[curr_card_name].displayName : card_group,
                      uid: curr_card_name + "_" + card_group + "_uid",
                      slices: []
                  };
                  for (const setting in settingsModel[curr_card_name].settingsGroups[card_group]) {
                      curr_card.revertToDefaultDescriptors.push({
                          objectName: curr_card_name,
                          propertyName: setting
                      });
                      let curr_slice = {
                          uid: curr_card_name + "_" + card_group + "_" + setting + "_slice_uid",
                          displayName: settingsModel[curr_card_name].settingsGroups[card_group][setting].displayName,
                          control: {
                              type: settingsModel[curr_card_name].settingsGroups[card_group][setting].type,
                              properties: {
                                  descriptor: {
                                      objectName: curr_card_name,
                                      propertyName: setting,
                                      selector: { data: [{ dataViewWildcard: { matchingOption: 0 } }] },
                                      instanceKind: (typeof this.settings[0][curr_card_name][setting]) != "boolean"
                                          ? 3
                                          : null
                                  },
                                  value: this.valueLookup(curr_card_name, card_group, setting),
                                  items: (_a = settingsModel[curr_card_name].settingsGroups[card_group][setting]) === null || _a === void 0 ? void 0 : _a.items,
                                  options: (_b = settingsModel[curr_card_name].settingsGroups[card_group][setting]) === null || _b === void 0 ? void 0 : _b.options
                              }
                          }
                      };
                      curr_group.slices.push(curr_slice);
                  }
                  curr_card.groups.push(curr_group);
              }
              formattingModel.cards.push(curr_card);
          }
          return formattingModel;
      }
      valueLookup(settingCardName, settingGroupName, settingName) {
          var _a;
          if (settingName.includes("colour")) {
              return { value: this.settings[0][settingCardName][settingName] };
          }
          if (!isNullOrUndefined((_a = settingsModel[settingCardName].settingsGroups[settingGroupName][settingName]) === null || _a === void 0 ? void 0 : _a.items)) {
              const allItems = settingsModel[settingCardName].settingsGroups[settingGroupName][settingName].items;
              const currValue = this.settings[0][settingCardName][settingName];
              return allItems.find(item => item.value === currValue);
          }
          return this.settings[0][settingCardName][settingName];
      }
      constructor() {
          this.settings = [Object.fromEntries(Object.keys(defaultSettings).map((settingGroupName) => {
                  return [settingGroupName, Object.fromEntries(Object.keys(defaultSettings[settingGroupName]).map((settingName) => {
                          return [settingName, defaultSettings[settingGroupName][settingName]];
                      }))];
              }))];
          this.derivedSettings = [new derivedSettingsClass()];
      }
  }

  function buildTooltip(table_row, inputTooltips, inputSettings, derivedSettings) {
      const ast_limit = inputSettings.outliers.astronomical_limit;
      const two_in_three_limit = inputSettings.outliers.two_in_three_limit;
      const formatValues = valueFormatter(inputSettings, derivedSettings);
      const tooltip = new Array();
      if (inputSettings.spc.ttip_show_date) {
          const ttip_label_date = inputSettings.spc.ttip_label_date;
          tooltip.push({
              displayName: ttip_label_date === "Automatic" ? derivedSettings.chart_type_props.date_name : ttip_label_date,
              value: table_row.date
          });
      }
      if (inputSettings.spc.ttip_show_value) {
          const ttip_label_value = inputSettings.spc.ttip_label_value;
          tooltip.push({
              displayName: ttip_label_value === "Automatic" ? derivedSettings.chart_type_props.value_name : ttip_label_value,
              value: formatValues(table_row.value, "value")
          });
      }
      if (inputSettings.spc.ttip_show_numerator && !isNullOrUndefined(table_row.numerator)) {
          tooltip.push({
              displayName: inputSettings.spc.ttip_label_numerator,
              value: formatValues(table_row.numerator, "integer")
          });
      }
      if (inputSettings.spc.ttip_show_denominator && !isNullOrUndefined(table_row.denominator)) {
          tooltip.push({
              displayName: inputSettings.spc.ttip_label_denominator,
              value: formatValues(table_row.denominator, "integer")
          });
      }
      if (inputSettings.lines.ttip_show_trend && inputSettings.lines.show_trend) {
          tooltip.push({
              displayName: inputSettings.lines.ttip_label_trend,
              value: formatValues(table_row.trend_line, "value")
          });
      }
      if (inputSettings.lines.show_specification && inputSettings.lines.ttip_show_specification) {
          if (!isNullOrUndefined(table_row.speclimits_upper)) {
              tooltip.push({
                  displayName: `Upper ${inputSettings.lines.ttip_label_specification}`,
                  value: formatValues(table_row.speclimits_upper, "value")
              });
          }
          if (!isNullOrUndefined(table_row.speclimits_lower)) {
              tooltip.push({
                  displayName: `Lower ${inputSettings.lines.ttip_label_specification}`,
                  value: formatValues(table_row.speclimits_lower, "value")
              });
          }
      }
      if (derivedSettings.chart_type_props.has_control_limits) {
          ["99", "95", "65"].forEach(limit => {
              if (inputSettings.lines[`ttip_show_${limit}`] && inputSettings.lines[`show_${limit}`]) {
                  tooltip.push({
                      displayName: `${inputSettings.lines[`ttip_label_${limit}_prefix_upper`]}${inputSettings.lines[`ttip_label_${limit}`]}`,
                      value: formatValues(table_row[`ul${limit}`], "value")
                  });
              }
          });
      }
      if (inputSettings.lines.show_target && inputSettings.lines.ttip_show_target) {
          tooltip.push({
              displayName: inputSettings.lines.ttip_label_target,
              value: formatValues(table_row.target, "value")
          });
      }
      if (inputSettings.lines.show_alt_target && inputSettings.lines.ttip_show_alt_target && !isNullOrUndefined(table_row.alt_target)) {
          tooltip.push({
              displayName: inputSettings.lines.ttip_label_alt_target,
              value: formatValues(table_row.alt_target, "value")
          });
      }
      if (derivedSettings.chart_type_props.has_control_limits) {
          ["68", "95", "99"].forEach(limit => {
              if (inputSettings.lines[`ttip_show_${limit}`] && inputSettings.lines[`show_${limit}`]) {
                  tooltip.push({
                      displayName: `${inputSettings.lines[`ttip_label_${limit}_prefix_lower`]}${inputSettings.lines[`ttip_label_${limit}`]}`,
                      value: formatValues(table_row[`ll${limit}`], "value")
                  });
              }
          });
      }
      if ([table_row.astpoint, table_row.trend, table_row.shift, table_row.two_in_three].some(d => d !== "none")) {
          const patterns = new Array();
          if (table_row.astpoint !== "none") {
              let flag_text = "Astronomical Point";
              if (ast_limit !== "3 Sigma") {
                  flag_text = `${flag_text} (${ast_limit})`;
              }
              patterns.push(flag_text);
          }
          if (table_row.trend !== "none") {
              patterns.push("Trend");
          }
          if (table_row.shift !== "none") {
              patterns.push("Shift");
          }
          if (table_row.two_in_three !== "none") {
              let flag_text = "Two-in-Three";
              if (two_in_three_limit !== "2 Sigma") {
                  flag_text = `${flag_text} (${two_in_three_limit})`;
              }
              patterns.push(flag_text);
          }
          tooltip.push({
              displayName: "Pattern(s)",
              value: patterns.join("\n")
          });
      }
      if (!isNullOrUndefined(inputTooltips) && inputTooltips.length > 0) {
          inputTooltips.forEach(customTooltip => tooltip.push(customTooltip));
      }
      return tooltip;
  }

  function checkFlagDirection(outlierStatus, flagSettings) {
      if (outlierStatus === "none") {
          return outlierStatus;
      }
      const increaseDirectionMap = {
          "upper": "improvement",
          "lower": "deterioration"
      };
      const decreaseDirectionMap = {
          "lower": "improvement",
          "upper": "deterioration"
      };
      const neutralDirectionMap = {
          "lower": "neutral_low",
          "upper": "neutral_high"
      };
      const flagDirectionMap = {
          "increase": increaseDirectionMap[outlierStatus],
          "decrease": decreaseDirectionMap[outlierStatus],
          "neutral": neutralDirectionMap[outlierStatus]
      };
      const mappedFlag = flagDirectionMap[flagSettings.improvement_direction];
      if (flagSettings.process_flag_type !== "both") {
          return mappedFlag === flagSettings.process_flag_type ? mappedFlag : "none";
      }
      else {
          return mappedFlag;
      }
  }

  function formatPrimitiveValue(rawValue, config) {
      if (isNullOrUndefined(rawValue)) {
          return null;
      }
      if (config.valueType.numeric) {
          return rawValue.toString();
      }
      else {
          return rawValue;
      }
  }

  const weekdayDateMap = {
      "DD": null,
      "Thurs DD": "short",
      "Thursday DD": "long",
      "(blank)": null
  };
  const monthDateMap = {
      "MM": "2-digit",
      "Mon": "short",
      "Month": "long",
      "(blank)": null
  };
  const yearDateMap = {
      "YYYY": "numeric",
      "YY": "2-digit",
      "(blank)": null
  };
  const dayDateMap = {
      "DD": "2-digit",
      "Thurs DD": "2-digit",
      "Thursday DD": "2-digit",
      "(blank)": null
  };
  const dateOptionsLookup = {
      "weekday": weekdayDateMap,
      "day": dayDateMap,
      "month": monthDateMap,
      "year": yearDateMap
  };
  function dateSettingsToFormatOptions(date_settings) {
      const formatOpts = new Array();
      Object.keys(date_settings).forEach((key) => {
          if (key !== "date_format_locale" && key !== "date_format_delim") {
              const formattedKey = key.replace("date_format_", "");
              const lookup = dateOptionsLookup[formattedKey];
              const val = lookup[date_settings[key]];
              if (!isNullOrUndefined(val)) {
                  formatOpts.push([formattedKey, val]);
                  if (formattedKey === "day" && date_settings[key] !== "DD") {
                      formatOpts.push(["weekday", weekdayDateMap[date_settings[key]]]);
                  }
              }
          }
      });
      return Object.fromEntries(formatOpts);
  }

  const monthNameToNumber = {
      "January": 0,
      "February": 1,
      "March": 2,
      "April": 3,
      "May": 4,
      "June": 5,
      "July": 6,
      "August": 7,
      "September": 8,
      "October": 9,
      "November": 10,
      "December": 11
  };
  function temporalTypeToKey(inputType, inputValue) {
      if (!inputType.temporal) {
          return null;
      }
      if ((inputType === null || inputType === void 0 ? void 0 : inputType["category"]) === "DayOfMonth") {
          return ["day", (inputValue)];
      }
      else if ((inputType === null || inputType === void 0 ? void 0 : inputType["category"]) === "Months") {
          return ["month", monthNameToNumber[(inputValue)]];
      }
      else if ((inputType === null || inputType === void 0 ? void 0 : inputType["category"]) === "Quarters") {
          return ["quarter", inputValue];
      }
      else if ((inputType === null || inputType === void 0 ? void 0 : inputType["category"]) === "Years") {
          return ["year", (inputValue)];
      }
      else {
          return null;
      }
  }
  function parseInputDates(inputs, idxs) {
      var _a, _b, _c, _d, _e;
      const n_keys = idxs.length;
      let inputDates = [];
      const inputQuarters = [];
      if (inputs.length > 1) {
          for (let i = 0; i < n_keys; i++) {
              const datePartsArray = [];
              for (let j = 0; j < inputs.length; j++) {
                  datePartsArray.push(temporalTypeToKey(inputs[j].source.type, inputs[j].values[idxs[i]]));
              }
              const datePartsObj = Object.fromEntries(datePartsArray);
              if (datePartsObj === null || datePartsObj === void 0 ? void 0 : datePartsObj.quarter) {
                  inputQuarters.push(datePartsObj.quarter);
              }
              inputDates[i] = new Date((_a = datePartsObj === null || datePartsObj === void 0 ? void 0 : datePartsObj.year) !== null && _a !== void 0 ? _a : 1970, (_b = datePartsObj === null || datePartsObj === void 0 ? void 0 : datePartsObj.month) !== null && _b !== void 0 ? _b : 0, (_c = datePartsObj === null || datePartsObj === void 0 ? void 0 : datePartsObj.day) !== null && _c !== void 0 ? _c : 1);
          }
      }
      else {
          for (let i = 0; i < n_keys; i++) {
              inputDates[i] = isNullOrUndefined((_d = inputs === null || inputs === void 0 ? void 0 : inputs[0]) === null || _d === void 0 ? void 0 : _d.values[idxs[i]]) ? null : new Date(((_e = inputs === null || inputs === void 0 ? void 0 : inputs[0]) === null || _e === void 0 ? void 0 : _e.values[idxs[i]]));
          }
      }
      return { dates: inputDates, quarters: inputQuarters };
  }

  const weekdayShort = {
      "en-GB": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      "en-US": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  };
  const weekdayLong = {
      "en-GB": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "en-US": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  };
  const monthShort = {
      "en-GB": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      "en-US": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };
  const monthLong = {
      "en-GB": ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"],
      "en-US": ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]
  };
  function formatDateParts(date, locale, options) {
      const result = {
          weekday: "",
          day: "",
          month: "",
          year: ""
      };
      if (options.weekday === "short") {
          result.weekday = weekdayShort[locale][date.getDay()];
      }
      else if (options.weekday === "long") {
          result.weekday = weekdayLong[locale][date.getDay()];
      }
      if (options.day === "2-digit") {
          result.day = String(date.getDate()).padStart(2, "0");
      }
      if (options.month === "2-digit") {
          result.month = String(date.getMonth() + 1).padStart(2, "0");
      }
      else if (options.month === "short") {
          result.month = monthShort[locale][date.getMonth()];
      }
      else if (options.month === "long") {
          result.month = monthLong[locale][date.getMonth()];
      }
      if (options.year === "numeric") {
          result.year = String(date.getFullYear());
      }
      else if (options.year === "2-digit") {
          result.year = String(date.getFullYear()).slice(-2);
      }
      return result;
  }

  function formatKeys(col, inputSettings, idxs) {
      var _a, _b, _c;
      const n_keys = idxs.length;
      let ret = new Array(n_keys);
      if (col.length === 1 && !((_a = col[0].source.type) === null || _a === void 0 ? void 0 : _a.temporal)) {
          for (let i = 0; i < n_keys; i++) {
              ret[i] = isNullOrUndefined(col[0].values[idxs[i]]) ? null : String(col[0].values[idxs[i]]);
          }
          return ret;
      }
      const delim = inputSettings.dates.date_format_delim;
      if (!(col.every(d => { var _a, _b; return (_b = (_a = d.source) === null || _a === void 0 ? void 0 : _a.type) === null || _b === void 0 ? void 0 : _b.temporal; }))) {
          const blankKey = rep("", col.length).join(delim);
          for (let i = 0; i < n_keys; i++) {
              const currKey = col.map(keyCol => keyCol.values[idxs[i]]).join(delim);
              ret[i] = currKey === blankKey ? null : currKey;
          }
          return ret;
      }
      const inputDates = parseInputDates(col, idxs);
      const formatOptions = dateSettingsToFormatOptions(inputSettings.dates);
      const locale = inputSettings.dates.date_format_locale;
      let day_elem = locale === "en-GB" ? "day" : "month";
      let month_elem = locale === "en-GB" ? "month" : "day";
      for (let i = 0; i < n_keys; i++) {
          if (isNullOrUndefined(inputDates.dates[i])) {
              ret[i] = null;
          }
          else {
              const datePartsRecord = formatDateParts(inputDates.dates[i], locale, formatOptions);
              const datePartStrings = [datePartsRecord.weekday + " " + datePartsRecord[day_elem],
                  datePartsRecord[month_elem], (_c = (_b = inputDates.quarters) === null || _b === void 0 ? void 0 : _b[i]) !== null && _c !== void 0 ? _c : "", datePartsRecord.year];
              ret[i] = datePartStrings.filter(d => String(d).trim()).join(delim);
          }
      }
      return ret;
  }
  function extractKeys(inputView, inputSettings, idxs) {
      const col = inputView.categories.filter(viewColumn => { var _a, _b; return (_b = (_a = viewColumn.source) === null || _a === void 0 ? void 0 : _a.roles) === null || _b === void 0 ? void 0 : _b["key"]; });
      const groupedCols = {};
      let queryNames = col.map(d => { var _a, _b; return (_b = (_a = d.source) === null || _a === void 0 ? void 0 : _a.queryName) !== null && _b !== void 0 ? _b : ""; });
      const uniqueQueryNames = new Set();
      queryNames = queryNames.map((queryName, idx) => {
          if (uniqueQueryNames.has(queryName)) {
              queryName = `${idx}_${queryName}`;
          }
          uniqueQueryNames.add(queryName);
          return queryName;
      });
      col.forEach((d, idx) => {
          let queryName = queryNames[idx];
          if (queryName.includes("Date Hierarchy")) {
              const lastDotIndex = queryName.lastIndexOf(".");
              if (lastDotIndex !== -1) {
                  queryName = queryName.substring(0, lastDotIndex);
              }
          }
          if (!groupedCols[queryName]) {
              groupedCols[queryName] = [];
          }
          groupedCols[queryName].push(d);
      });
      const formattedKeys = [];
      for (const queryName in groupedCols) {
          const group = groupedCols[queryName];
          const groupKeys = formatKeys(group, inputSettings, idxs);
          formattedKeys.push(groupKeys);
      }
      const combinedKeys = [];
      const n_keys = idxs.length;
      for (let i = 0; i < n_keys; i++) {
          const keyParts = formattedKeys.map(keys => keys[i]).filter(k => k !== null && k !== undefined);
          combinedKeys.push(keyParts.length > 0 ? keyParts.join(" ") : null);
      }
      return combinedKeys;
  }
  function extractTooltips(inputView, inputSettings, idxs) {
      const tooltipColumns = inputView.values.filter(viewColumn => viewColumn.source.roles.tooltips);
      const n_keys = idxs.length;
      let ret = new Array(n_keys);
      for (let i = 0; i < n_keys; i++) {
          ret[i] = tooltipColumns.map(viewColumn => {
              var _a;
              const config = { valueType: viewColumn.source.type, dateSettings: inputSettings.dates };
              const tooltipValueFormatted = formatPrimitiveValue((_a = viewColumn === null || viewColumn === void 0 ? void 0 : viewColumn.values) === null || _a === void 0 ? void 0 : _a[idxs[i]], config);
              return {
                  displayName: viewColumn.source.displayName,
                  value: tooltipValueFormatted
              };
          });
      }
      return ret;
  }
  function extractDataColumn(inputView, name, inputSettings, idxs) {
      var _a, _b, _c, _d;
      if (name === "key") {
          return extractKeys(inputView, inputSettings, idxs);
      }
      if (name === "tooltips") {
          return extractTooltips(inputView, inputSettings, idxs);
      }
      const columnRaw = inputView.values.filter(viewColumn => { var _a, _b; return (_b = (_a = viewColumn === null || viewColumn === void 0 ? void 0 : viewColumn.source) === null || _a === void 0 ? void 0 : _a.roles) === null || _b === void 0 ? void 0 : _b[name]; });
      if (columnRaw.length === 0) {
          return null;
      }
      const n_keys = idxs.length;
      if (name === "groupings" || name === "labels") {
          let ret = new Array(n_keys);
          for (let i = 0; i < n_keys; i++) {
              ret[i] = isNullOrUndefined((_b = (_a = columnRaw === null || columnRaw === void 0 ? void 0 : columnRaw[0]) === null || _a === void 0 ? void 0 : _a.values) === null || _b === void 0 ? void 0 : _b[idxs[i]]) ? null : String(columnRaw[0].values[idxs[i]]);
          }
          return ret;
      }
      let ret = new Array(n_keys);
      for (let i = 0; i < n_keys; i++) {
          ret[i] = isNullOrUndefined((_d = (_c = columnRaw === null || columnRaw === void 0 ? void 0 : columnRaw[0]) === null || _c === void 0 ? void 0 : _c.values) === null || _d === void 0 ? void 0 : _d[idxs[i]]) ? null : Number(columnRaw[0].values[idxs[i]]);
      }
      return ret;
  }

  function extractValues(valuesArray, indexArray) {
      if (valuesArray) {
          const validIndexArray = indexArray.filter(idx => {
              return idx >= 0 && idx < valuesArray.length && !isNullOrUndefined(idx);
          });
          const n = validIndexArray.length;
          let result = new Array(n);
          for (let i = 0; i < n; i++) {
              result[i] = valuesArray[validIndexArray[i]];
          }
          return result;
      }
      else {
          return [];
      }
  }

  function validateInputDataImpl(key, numerator, denominator, xbar_sd, chart_type_props, check_denom) {
      const rtn = { message: "", type: 0 };
      if (isNullOrUndefined(key)) {
          rtn.message = "Date missing";
          rtn.type = 2;
      }
      if (isNullOrUndefined(numerator)) {
          rtn.message = "Numerator missing";
          rtn.type = 3;
      }
      if (isNaN(numerator)) {
          rtn.message = "Numerator is not a number";
          rtn.type = 10;
      }
      if (chart_type_props.numerator_non_negative && numerator < 0) {
          rtn.message = "Numerator negative";
          rtn.type = 4;
      }
      if (check_denom) {
          if (isNullOrUndefined(denominator)) {
              rtn.message = "Denominator missing";
              rtn.type = 5;
          }
          else if (isNaN(denominator)) {
              rtn.message = "Denominator is not a number";
              rtn.type = 11;
          }
          else if (denominator < 0) {
              rtn.message = "Denominator negative";
              rtn.type = 6;
          }
          else if (chart_type_props.numerator_leq_denominator && denominator < numerator) {
              rtn.message = "Denominator < numerator";
              rtn.type = 7;
          }
      }
      if (chart_type_props.needs_sd) {
          if (isNullOrUndefined(xbar_sd)) {
              rtn.message = "SD missing";
              rtn.type = 8;
          }
          else if (isNaN(xbar_sd)) {
              rtn.message = "SD is not a number";
              rtn.type = 12;
          }
          else if (xbar_sd < 0) {
              rtn.message = "SD negative";
              rtn.type = 9;
          }
      }
      return rtn;
  }
  function validateInputData(keys, numerators, denominators, xbar_sds, chart_type_props, idxs) {
      let allSameType = false;
      let messages = new Array();
      let all_status = new Array();
      const check_denom = chart_type_props.needs_denominator
          || (chart_type_props.denominator_optional && !isNullOrUndefined(denominators) && denominators.length > 0);
      const n = idxs.length;
      for (let i = 0; i < n; i++) {
          const validation = validateInputDataImpl(keys[i], numerators === null || numerators === void 0 ? void 0 : numerators[i], denominators === null || denominators === void 0 ? void 0 : denominators[i], xbar_sds === null || xbar_sds === void 0 ? void 0 : xbar_sds[i], chart_type_props, check_denom);
          messages.push(validation.message);
          all_status.push(validation.type);
      }
      let allSameTypeSet = new Set(all_status);
      allSameType = allSameTypeSet.size === 1;
      let commonType = Array.from(allSameTypeSet)[0];
      let validationRtn = {
          status: (allSameType && commonType !== 0) ? 1 : 0,
          messages: messages
      };
      if (validationRtn.status === 0) {
          const allInvalid = all_status.every(d => d !== 0);
          if (allInvalid) {
              validationRtn.status = 1;
              validationRtn.error = "No valid data found!";
              return validationRtn;
          }
      }
      if (allSameType && commonType !== 0) {
          switch (commonType) {
              case 1: {
                  validationRtn.error = "Grouping missing";
                  break;
              }
              case 2: {
                  validationRtn.error = "All dates/IDs are missing or null!";
                  break;
              }
              case 3: {
                  validationRtn.error = "All numerators are missing or null!";
                  break;
              }
              case 10: {
                  validationRtn.error = "All numerators are not numbers!";
                  break;
              }
              case 4: {
                  validationRtn.error = "All numerators are negative!";
                  break;
              }
              case 5: {
                  validationRtn.error = "All denominators missing or null!";
                  break;
              }
              case 11: {
                  validationRtn.error = "All denominators are not numbers!";
                  break;
              }
              case 6: {
                  validationRtn.error = "All denominators are negative!";
                  break;
              }
              case 7: {
                  validationRtn.error = "All denominators are smaller than numerators!";
                  break;
              }
              case 8: {
                  validationRtn.error = "All SDs missing or null!";
                  break;
              }
              case 12: {
                  validationRtn.error = "All SDs are not numbers!";
                  break;
              }
              case 9: {
                  validationRtn.error = "All SDs are negative!";
                  break;
              }
          }
      }
      return validationRtn;
  }

  function seq(start, end) {
      const n = end - start + 1;
      const result = new Array(n);
      for (let i = start; i <= end; i++) {
          result[i - start] = i;
      }
      return result;
  }

  function invalidInputData(inputValidStatus) {
      return {
          limitInputArgs: null,
          spcSettings: null,
          highlights: null,
          anyHighlights: false,
          categories: null,
          groupings: null,
          groupingIndexes: null,
          scatter_formatting: null,
          line_formatting: null,
          label_formatting: null,
          tooltips: null,
          labels: null,
          anyLabels: false,
          warningMessage: inputValidStatus.error,
          alt_targets: null,
          speclimits_lower: null,
          speclimits_upper: null,
          validationStatus: inputValidStatus
      };
  }
  function extractInputData(inputView, inputSettings, derivedSettings, validationMessages, idxs) {
      var _a, _b, _c, _d, _e, _f, _g;
      const numerators = extractDataColumn(inputView, "numerators", inputSettings, idxs);
      const denominators = extractDataColumn(inputView, "denominators", inputSettings, idxs);
      const xbar_sds = extractDataColumn(inputView, "xbar_sds", inputSettings, idxs);
      const keys = extractDataColumn(inputView, "key", inputSettings, idxs);
      const tooltips = extractDataColumn(inputView, "tooltips", inputSettings, idxs);
      const groupings = extractDataColumn(inputView, "groupings", inputSettings, idxs);
      const labels = extractDataColumn(inputView, "labels", inputSettings, idxs);
      const highlights = idxs.map(d => { var _a, _b, _c; return (_c = (_b = (_a = inputView === null || inputView === void 0 ? void 0 : inputView.values) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.highlights) === null || _c === void 0 ? void 0 : _c[d]; });
      let scatter_cond = (_a = extractConditionalFormatting(inputView, "scatter", inputSettings, idxs)) === null || _a === void 0 ? void 0 : _a.values;
      let lines_cond = (_b = extractConditionalFormatting(inputView, "lines", inputSettings, idxs)) === null || _b === void 0 ? void 0 : _b.values;
      let labels_cond = (_c = extractConditionalFormatting(inputView, "labels", inputSettings, idxs)) === null || _c === void 0 ? void 0 : _c.values;
      let alt_targets = (_d = extractConditionalFormatting(inputView, "lines", inputSettings, idxs)) === null || _d === void 0 ? void 0 : _d.values.map(d => inputSettings.lines.show_alt_target ? d.alt_target : null);
      let speclimits_lower = (_e = extractConditionalFormatting(inputView, "lines", inputSettings, idxs)) === null || _e === void 0 ? void 0 : _e.values.map(d => d.show_specification ? d.specification_lower : null);
      let speclimits_upper = (_f = extractConditionalFormatting(inputView, "lines", inputSettings, idxs)) === null || _f === void 0 ? void 0 : _f.values.map(d => d.show_specification ? d.specification_upper : null);
      let spcSettings = (_g = extractConditionalFormatting(inputView, "spc", inputSettings, idxs)) === null || _g === void 0 ? void 0 : _g.values;
      const inputValidStatus = validateInputData(keys, numerators, denominators, xbar_sds, derivedSettings.chart_type_props, idxs);
      if (inputValidStatus.status !== 0) {
          return invalidInputData(inputValidStatus);
      }
      const valid_ids = new Array();
      const valid_keys = new Array();
      const removalMessages = new Array();
      const groupVarName = inputView.categories[0].source.displayName;
      const settingsMessages = validationMessages;
      let valid_x = 0;
      const x_axis_use_date = derivedSettings.chart_type_props.x_axis_use_date;
      idxs.forEach((i, idx) => {
          if (inputValidStatus.messages[idx] === "") {
              valid_ids.push(idx);
              valid_keys.push({ x: valid_x, id: i, label: x_axis_use_date ? keys[idx] : valid_x.toString() });
              valid_x += 1;
              if (settingsMessages[i].length > 0) {
                  settingsMessages[i].forEach(setting_removal_message => {
                      removalMessages.push(`Conditional formatting for ${groupVarName} ${keys[idx]} ignored due to: ${setting_removal_message}.`);
                  });
              }
          }
          else {
              removalMessages.push(`${groupVarName} ${keys[idx]} removed due to: ${inputValidStatus.messages[idx]}.`);
          }
      });
      const valid_groupings = extractValues(groupings, valid_ids);
      const groupingIndexes = new Array();
      let current_grouping = valid_groupings[0];
      valid_groupings.forEach((d, idx) => {
          if (d !== current_grouping) {
              groupingIndexes.push(idx - 1);
              current_grouping = d;
          }
      });
      const valid_alt_targets = extractValues(alt_targets, valid_ids);
      if (inputSettings.nhs_icons.show_assurance_icons) {
          const alt_targets_length = valid_alt_targets === null || valid_alt_targets === void 0 ? void 0 : valid_alt_targets.length;
          if (alt_targets_length > 0) {
              const last_target = valid_alt_targets === null || valid_alt_targets === void 0 ? void 0 : valid_alt_targets[alt_targets_length - 1];
              if (isNullOrUndefined(last_target)) {
                  removalMessages.push("NHS Assurance icon requires a valid alt. target at last observation.");
              }
          }
          if (!derivedSettings.chart_type_props.has_control_limits) {
              removalMessages.push("NHS Assurance icon requires chart with control limits.");
          }
      }
      const curr_highlights = extractValues(highlights, valid_ids);
      const num_points_subset = spcSettings[0].num_points_subset;
      let subset_points;
      if (isNullOrUndefined(num_points_subset) || !between(num_points_subset, 1, valid_ids.length)) {
          subset_points = seq(0, valid_ids.length - 1);
      }
      else {
          if (spcSettings[0].subset_points_from === "Start") {
              subset_points = seq(0, spcSettings[0].num_points_subset - 1);
          }
          else {
              subset_points = seq(valid_ids.length - spcSettings[0].num_points_subset, valid_ids.length - 1);
          }
      }
      const valid_labels = extractValues(labels, valid_ids);
      return {
          limitInputArgs: {
              keys: valid_keys,
              numerators: extractValues(numerators, valid_ids),
              denominators: extractValues(denominators, valid_ids),
              xbar_sds: extractValues(xbar_sds, valid_ids),
              outliers_in_limits: spcSettings[0].outliers_in_limits,
              subset_points: subset_points
          },
          spcSettings: spcSettings[0],
          tooltips: extractValues(tooltips, valid_ids),
          labels: valid_labels,
          anyLabels: valid_labels.filter(d => !isNullOrUndefined(d) && d !== "").length > 0,
          highlights: curr_highlights,
          anyHighlights: curr_highlights.filter(d => !isNullOrUndefined(d)).length > 0,
          categories: inputView.categories[0],
          groupings: valid_groupings,
          groupingIndexes: groupingIndexes,
          scatter_formatting: extractValues(scatter_cond, valid_ids),
          line_formatting: extractValues(lines_cond, valid_ids),
          label_formatting: extractValues(labels_cond, valid_ids),
          warningMessage: removalMessages.length > 0 ? removalMessages.join("\n") : "",
          alt_targets: valid_alt_targets,
          speclimits_lower: extractValues(speclimits_lower, valid_ids),
          speclimits_upper: extractValues(speclimits_upper, valid_ids),
          validationStatus: inputValidStatus
      };
  }

  function validateDataView(inputDV, inputSettingsClass) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
      if (isNullOrUndefined(inputDV === null || inputDV === void 0 ? void 0 : inputDV[0]) || (((_e = (_d = (_c = (_b = (_a = inputDV === null || inputDV === void 0 ? void 0 : inputDV[0]) === null || _a === void 0 ? void 0 : _a.categorical) === null || _b === void 0 ? void 0 : _b.categories) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.identity) === null || _e === void 0 ? void 0 : _e.length) === 0)) {
          return "";
      }
      if (isNullOrUndefined((_g = (_f = inputDV[0]) === null || _f === void 0 ? void 0 : _f.categorical) === null || _g === void 0 ? void 0 : _g.categories) || isNullOrUndefined((_j = (_h = inputDV[0]) === null || _h === void 0 ? void 0 : _h.categorical) === null || _j === void 0 ? void 0 : _j.categories.some(d => { var _a, _b; return (_b = (_a = d.source) === null || _a === void 0 ? void 0 : _a.roles) === null || _b === void 0 ? void 0 : _b.key; }))) {
          return "";
      }
      const numeratorsPresent = (_l = (_k = inputDV[0].categorical) === null || _k === void 0 ? void 0 : _k.values) === null || _l === void 0 ? void 0 : _l.some(d => { var _a, _b; return (_b = (_a = d.source) === null || _a === void 0 ? void 0 : _a.roles) === null || _b === void 0 ? void 0 : _b.numerators; });
      if (!numeratorsPresent) {
          return "No Numerators passed!";
      }
      let needs_denominator;
      let needs_sd;
      let chart_type;
      if ((inputSettingsClass === null || inputSettingsClass === void 0 ? void 0 : inputSettingsClass.derivedSettings.length) > 0) {
          inputSettingsClass === null || inputSettingsClass === void 0 ? void 0 : inputSettingsClass.derivedSettings.forEach((d) => {
              if (d.chart_type_props.needs_denominator) {
                  chart_type = d.chart_type_props.name;
                  needs_denominator = true;
              }
              if (d.chart_type_props.needs_sd) {
                  chart_type = d.chart_type_props.name;
                  needs_sd = true;
              }
          });
      }
      else {
          chart_type = inputSettingsClass.settings[0].spc.chart_type;
          needs_denominator = inputSettingsClass.derivedSettings[0].chart_type_props.needs_denominator;
          needs_sd = inputSettingsClass.derivedSettings[0].chart_type_props.needs_sd;
      }
      if (needs_denominator) {
          const denominatorsPresent = (_o = (_m = inputDV[0].categorical) === null || _m === void 0 ? void 0 : _m.values) === null || _o === void 0 ? void 0 : _o.some(d => { var _a, _b; return (_b = (_a = d.source) === null || _a === void 0 ? void 0 : _a.roles) === null || _b === void 0 ? void 0 : _b.denominators; });
          if (!denominatorsPresent) {
              return `Chart type '${chart_type}' requires denominators!`;
          }
      }
      if (needs_sd) {
          const xbarSDPresent = (_q = (_p = inputDV[0].categorical) === null || _p === void 0 ? void 0 : _p.values) === null || _q === void 0 ? void 0 : _q.some(d => { var _a, _b; return (_b = (_a = d.source) === null || _a === void 0 ? void 0 : _a.roles) === null || _b === void 0 ? void 0 : _b.xbar_sds; });
          if (!xbarSDPresent) {
              return `Chart type '${chart_type}' requires SDs!`;
          }
      }
      return "valid";
  }

  function calculateTrendLine(values) {
      const n = values.length;
      if (n === 0)
          return [];
      let sumY = 0;
      let sumX = 0;
      let sumXY = 0;
      let sumX2 = 0;
      for (let i = 0; i < n; i++) {
          const x = i + 1;
          const y = values[i];
          sumX += x;
          sumY += y;
          sumXY += x * y;
          sumX2 += x * x;
      }
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      const trendLine = [];
      for (let i = 0; i < n; i++) {
          trendLine.push(slope * (i + 1) + intercept);
      }
      return trendLine;
  }

  function groupBy(data, key) {
      var _a;
      const groupedData = new Map();
      for (let i = 0; i < data.length; i++) {
          const item = data[i];
          const keyValue = item[key];
          if (!groupedData.has(keyValue)) {
              groupedData.set(keyValue, []);
          }
          (_a = groupedData.get(keyValue)) === null || _a === void 0 ? void 0 : _a.push(item);
      }
      return Array.from(groupedData);
  }

  function astronomical(val, ll99, ul99) {
      return val.map((d, i) => {
          if (!between(d, ll99[i], ul99[i])) {
              return d > ul99[i] ? "upper" : "lower";
          }
          else {
              return "none";
          }
      });
  }

  function sum(values) {
      let total = 0;
      for (let i = 0; i < values.length; i++) {
          total += values[i];
      }
      return total;
  }

  function trend(val, n) {
      const lagged_sign = val.map((d, i) => {
          return (i == 0) ? i : Math.sign(d - val[i - 1]);
      });
      const lagged_sign_sum = lagged_sign.map((_, i) => {
          return sum(lagged_sign.slice(Math.max(0, i - (n - 2)), i + 1));
      });
      const trend_detected = lagged_sign_sum.map(d => {
          if (Math.abs(d) >= (n - 1)) {
              return d >= (n - 1) ? "upper" : "lower";
          }
          else {
              return "none";
          }
      });
      for (let i = 0; i < trend_detected.length; i++) {
          if (trend_detected[i] !== "none") {
              for (let j = (i - 1); j >= (i - (n - 1)); j--) {
                  trend_detected[j] = trend_detected[i];
              }
          }
      }
      return trend_detected;
  }

  function twoInThree(val, ll95, ul95, highlight_series) {
      const outside95 = val.map((d, i) => {
          return d > ul95[i] ? 1 : (d < ll95[i] ? -1 : 0);
      });
      const lagged_sign_sum = outside95.map((_, i) => {
          return sum(outside95.slice(Math.max(0, i - 2), i + 1));
      });
      const two_in_three_detected = lagged_sign_sum.map(d => {
          if (Math.abs(d) >= 2) {
              return d >= 2 ? "upper" : "lower";
          }
          else {
              return "none";
          }
      });
      for (let i = 0; i < two_in_three_detected.length; i++) {
          if (two_in_three_detected[i] !== "none") {
              for (let j = (i - 1); j >= (i - 2); j--) {
                  if (outside95[j] !== 0 || highlight_series) {
                      two_in_three_detected[j] = two_in_three_detected[i];
                  }
              }
              if (outside95[i] === 0 && !highlight_series) {
                  two_in_three_detected[i] = "none";
              }
          }
      }
      return two_in_three_detected;
  }

  function shift(val, targets, n) {
      const lagged_sign = val.map((d, i) => {
          return Math.sign(d - targets[i]);
      });
      const lagged_sign_sum = lagged_sign.map((_, i) => {
          return sum(lagged_sign.slice(Math.max(0, i - (n - 1)), i + 1));
      });
      const shift_detected = lagged_sign_sum.map(d => {
          if (Math.abs(d) >= n) {
              return d >= n ? "upper" : "lower";
          }
          else {
              return "none";
          }
      });
      for (let i = 0; i < shift_detected.length; i++) {
          if (shift_detected[i] !== "none") {
              for (let j = (i - 1); j >= (i - (n - 1)); j--) {
                  shift_detected[j] = shift_detected[i];
              }
          }
      }
      return shift_detected;
  }

  class viewModelClass {
      get showGrouped() {
          return this.inputData && this.inputData.length > 1;
      }
      constructor() {
          this.inputData = new Array();
          this.inputSettings = new settingsClass();
          this.controlLimits = new Array();
          this.outliers = new Array();
          this.plotPoints = new Array();
          this.groupedLines = new Array();
          this.firstRun = true;
          this.splitIndexes = new Array();
          this.groupStartEndIndexes = new Array();
          this.identities = new Array();
          this.tableColumns = new Array();
          this.colourPalette = null;
          this.headless = false;
          this.frontend = false;
      }
      update(options, host) {
          var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
          if (isNullOrUndefined(this.colourPalette)) {
              this.colourPalette = {
                  isHighContrast: host.colorPalette.isHighContrast,
                  foregroundColour: host.colorPalette.foreground.value,
                  backgroundColour: host.colorPalette.background.value,
                  foregroundSelectedColour: host.colorPalette.foregroundSelected.value,
                  hyperlinkColour: host.colorPalette.hyperlink.value
              };
          }
          this.svgWidth = options.viewport.width;
          this.svgHeight = options.viewport.height;
          this.headless = (_a = options === null || options === void 0 ? void 0 : options["headless"]) !== null && _a !== void 0 ? _a : false;
          this.frontend = (_b = options === null || options === void 0 ? void 0 : options["frontend"]) !== null && _b !== void 0 ? _b : false;
          const indicator_cols = (_e = (_d = (_c = options.dataViews[0]) === null || _c === void 0 ? void 0 : _c.categorical) === null || _d === void 0 ? void 0 : _d.categories) === null || _e === void 0 ? void 0 : _e.filter(d => d.source.roles.indicator);
          this.indicatorVarNames = (_f = indicator_cols === null || indicator_cols === void 0 ? void 0 : indicator_cols.map(d => d.source.displayName)) !== null && _f !== void 0 ? _f : [];
          const n_indicators = indicator_cols === null || indicator_cols === void 0 ? void 0 : indicator_cols.length;
          const n_values = (_m = (_l = (_k = (_j = (_h = (_g = options.dataViews[0]) === null || _g === void 0 ? void 0 : _g.categorical) === null || _h === void 0 ? void 0 : _h.categories) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.values) === null || _l === void 0 ? void 0 : _l.length) !== null && _m !== void 0 ? _m : 1;
          const res = { status: true };
          const idx_per_indicator = new Array();
          idx_per_indicator.push([0]);
          this.groupNames = new Array();
          this.groupNames.push((_o = indicator_cols === null || indicator_cols === void 0 ? void 0 : indicator_cols.map(d => d.values[0])) !== null && _o !== void 0 ? _o : []);
          let curr_grp = 0;
          for (let i = 1; i < n_values; i++) {
              let same_indicator = true;
              for (let j = 0; j < n_indicators; j++) {
                  same_indicator = same_indicator && ((indicator_cols === null || indicator_cols === void 0 ? void 0 : indicator_cols[j].values[i]) === (indicator_cols === null || indicator_cols === void 0 ? void 0 : indicator_cols[j].values[i - 1]));
              }
              if (same_indicator) {
                  idx_per_indicator[curr_grp].push(i);
              }
              else {
                  idx_per_indicator.push([i]);
                  this.groupNames.push((_p = indicator_cols === null || indicator_cols === void 0 ? void 0 : indicator_cols.map(d => d.values[i])) !== null && _p !== void 0 ? _p : []);
                  curr_grp += 1;
              }
          }
          if (options.type === 2 || this.firstRun) {
              this.inputSettings.update(options.dataViews[0], idx_per_indicator);
          }
          if (this.inputSettings.validationStatus.error !== "") {
              res.status = false;
              res.error = this.inputSettings.validationStatus.error;
              res.type = "settings";
              return res;
          }
          const checkDV = validateDataView(options.dataViews, this.inputSettings);
          if (checkDV !== "valid") {
              res.status = false;
              res.error = checkDV;
              return res;
          }
          if (options.type === 2 || this.firstRun) {
              const hasIndicator = options.dataViews[0].categorical.categories.some(d => d.source.roles.indicator);
              const split_indexes_str = (_u = ((_t = (_s = (_r = (_q = options.dataViews[0]) === null || _q === void 0 ? void 0 : _q.metadata) === null || _r === void 0 ? void 0 : _r.objects) === null || _s === void 0 ? void 0 : _s.split_indexes_storage) === null || _t === void 0 ? void 0 : _t.split_indexes)) !== null && _u !== void 0 ? _u : "[]";
              const split_indexes = JSON.parse(split_indexes_str);
              this.splitIndexes = hasIndicator ? [] : split_indexes;
              this.inputData = new Array();
              this.groupStartEndIndexes = new Array();
              this.controlLimits = new Array();
              this.outliers = new Array();
              this.identities = new Array();
              this.tableColumns = new Array();
              idx_per_indicator.forEach((group_idxs, idx) => {
                  const settings = this.inputSettings.settings[idx];
                  const derivedSettings = this.inputSettings.derivedSettings[idx];
                  const inpData = extractInputData(options.dataViews[0].categorical, settings, derivedSettings, this.inputSettings.validationStatus.messages, group_idxs);
                  const invalidData = inpData.validationStatus.status !== 0;
                  const groupStartEnd = invalidData
                      ? new Array()
                      : this.getGroupingIndexes(inpData, idx === 0 ? this.splitIndexes : undefined);
                  const limits = invalidData
                      ? null
                      : this.calculateLimits(inpData, groupStartEnd, settings);
                  const outliers = invalidData
                      ? null
                      : this.flagOutliers(limits, groupStartEnd, settings, derivedSettings);
                  if (!invalidData) {
                      this.scaleAndTruncateLimits(limits, settings, derivedSettings);
                  }
                  const identities = group_idxs.map(i => {
                      return host.createSelectionIdBuilder()
                          .withCategory(options.dataViews[0].categorical.categories[0], i)
                          .createSelectionId();
                  });
                  this.inputData.push(inpData);
                  this.groupStartEndIndexes.push(groupStartEnd);
                  this.controlLimits.push(limits);
                  this.outliers.push(outliers);
                  this.identities.push(identities);
              });
              if (this.showGrouped) {
                  this.initialisePlotDataGrouped();
              }
              else {
                  this.initialisePlotData(host);
                  this.initialiseGroupedLines();
              }
          }
          this.firstRun = false;
          if (this.inputData.some(d => d.validationStatus.status !== 0)) {
              res.status = false;
              res.error = this.inputData
                  .filter(d => d.validationStatus.status !== 0)
                  .map(d => d.validationStatus.error)
                  .join("\n");
              return res;
          }
          if (this.inputData.some(d => d.warningMessage !== "")) {
              res.warning = this.inputData
                  .filter(d => d.warningMessage !== "")
                  .map(d => d.warningMessage)
                  .join("\n");
          }
          return res;
      }
      getGroupingIndexes(inputData, splitIndexes) {
          const allIndexes = (splitIndexes !== null && splitIndexes !== void 0 ? splitIndexes : [])
              .concat([-1])
              .concat(inputData.groupingIndexes)
              .concat([inputData.limitInputArgs.keys.length - 1])
              .filter((d, idx, arr) => arr.indexOf(d) === idx)
              .sort((a, b) => a - b);
          const groupStartEndIndexes = new Array();
          for (let i = 0; i < allIndexes.length - 1; i++) {
              groupStartEndIndexes.push([allIndexes[i] + 1, allIndexes[i + 1] + 1]);
          }
          return groupStartEndIndexes;
      }
      calculateLimits(inputData, groupStartEndIndexes, inputSettings) {
          var _a;
          const limitFunction = limitFunctions[inputSettings.spc.chart_type];
          inputData.limitInputArgs.outliers_in_limits = inputSettings.spc.outliers_in_limits;
          let controlLimits;
          if (groupStartEndIndexes.length > 1) {
              const groupedData = groupStartEndIndexes.map((indexes) => {
                  let data = JSON.parse(JSON.stringify(inputData));
                  Object.keys(data.limitInputArgs).forEach(key => {
                      if (Array.isArray(data.limitInputArgs[key])) {
                          data.limitInputArgs[key] = data.limitInputArgs[key].slice(indexes[0], indexes[1]);
                          if (key === "subset_points") {
                              data.limitInputArgs[key] = data.limitInputArgs[key].map((d) => d - indexes[0]);
                          }
                      }
                  });
                  return data;
              });
              const calcLimitsGrouped = groupedData.map(d => {
                  const currLimits = limitFunction(d.limitInputArgs);
                  currLimits.trend_line = calculateTrendLine(currLimits.values);
                  return currLimits;
              });
              controlLimits = calcLimitsGrouped.reduce((all, curr) => {
                  const allInner = all;
                  Object.entries(all).forEach((entry, idx) => {
                      var _a;
                      const newValues = Object.entries(curr)[idx][1];
                      allInner[entry[0]] = (_a = entry[1]) === null || _a === void 0 ? void 0 : _a.concat(newValues);
                  });
                  return allInner;
              });
          }
          else {
              controlLimits = limitFunction(inputData.limitInputArgs);
              controlLimits.trend_line = calculateTrendLine(controlLimits.values);
          }
          controlLimits.alt_targets = inputData.alt_targets;
          controlLimits.speclimits_lower = inputData.speclimits_lower;
          controlLimits.speclimits_upper = inputData.speclimits_upper;
          for (const key of Object.keys(controlLimits)) {
              if (key === "keys") {
                  continue;
              }
              controlLimits[key] = (_a = controlLimits[key]) === null || _a === void 0 ? void 0 : _a.map(d => isNaN(d) ? null : d);
          }
          return controlLimits;
      }
      initialisePlotDataGrouped() {
          var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
          this.plotPoints = new Array();
          this.tableColumns = new Array();
          const tableColumnsDef = new Array();
          this.indicatorVarNames.forEach(indicator_name => {
              tableColumnsDef.push({ name: indicator_name, label: indicator_name });
          });
          tableColumnsDef.push({ name: "latest_date", label: "Latest Date" });
          const lineSettings = this.inputSettings.settings[0].lines;
          if (lineSettings.show_main) {
              tableColumnsDef.push({ name: "value", label: "Value" });
          }
          if (this.inputSettings.settings[0].spc.ttip_show_numerator) {
              tableColumnsDef.push({ name: "numerator", label: "Numerator" });
          }
          if (this.inputSettings.settings[0].spc.ttip_show_denominator) {
              tableColumnsDef.push({ name: "denominator", label: "Denominator" });
          }
          if (lineSettings.show_target) {
              tableColumnsDef.push({ name: "target", label: lineSettings.ttip_label_target });
          }
          if (lineSettings.show_alt_target) {
              tableColumnsDef.push({ name: "alt_target", label: lineSettings.ttip_label_alt_target });
          }
          ["99", "95", "68"].forEach(limit => {
              if (lineSettings[`show_${limit}`]) {
                  tableColumnsDef.push({
                      name: `ucl${limit}`,
                      label: `${lineSettings[`ttip_label_${limit}_prefix_upper`]}${lineSettings[`ttip_label_${limit}`]}`
                  });
              }
          });
          ["68", "95", "99"].forEach(limit => {
              if (lineSettings[`show_${limit}`]) {
                  tableColumnsDef.push({
                      name: `lcl${limit}`,
                      label: `${lineSettings[`ttip_label_${limit}_prefix_lower`]}${lineSettings[`ttip_label_${limit}`]}`
                  });
              }
          });
          const nhsIconSettings = this.inputSettings.settings[0].nhs_icons;
          if (nhsIconSettings.show_variation_icons) {
              tableColumnsDef.push({ name: "variation", label: "Variation" });
          }
          if (nhsIconSettings.show_assurance_icons) {
              tableColumnsDef.push({ name: "assurance", label: "Assurance" });
          }
          const anyTooltips = this.inputData.some(d => { var _a; return (_a = d === null || d === void 0 ? void 0 : d.tooltips) === null || _a === void 0 ? void 0 : _a.some(t => t.length > 0); });
          if (anyTooltips) {
              (_b = (_a = this.inputData) === null || _a === void 0 ? void 0 : _a[0].tooltips) === null || _b === void 0 ? void 0 : _b[0].forEach(tooltip => {
                  tableColumnsDef.push({ name: tooltip.displayName, label: tooltip.displayName });
              });
          }
          for (let i = 0; i < this.groupNames.length; i++) {
              if (isNullOrUndefined((_c = this.inputData[i]) === null || _c === void 0 ? void 0 : _c.categories)) {
                  continue;
              }
              const formatValues = valueFormatter(this.inputSettings.settings[i], this.inputSettings.derivedSettings[i]);
              const varIconFilter = this.inputSettings.settings[i].summary_table.table_variation_filter;
              const assIconFilter = this.inputSettings.settings[i].summary_table.table_assurance_filter;
              const limits = this.controlLimits[i];
              if (!limits) {
                  continue;
              }
              const outliers = this.outliers[i];
              const lastIndex = limits.keys.length - 1;
              const varIcons = variationIconsToDraw(outliers, this.inputSettings.settings[i]);
              if (varIconFilter !== "all") {
                  if (varIconFilter === "improvement" && !(["improvementHigh", "improvementLow"].includes(varIcons[0]))) {
                      continue;
                  }
                  if (varIconFilter === "deterioration" && !(["concernHigh", "concernLow"].includes(varIcons[0]))) {
                      continue;
                  }
                  if (varIconFilter === "neutral" && !(["neutralHigh", "neutralLow"].includes(varIcons[0]))) {
                      continue;
                  }
                  if (varIconFilter === "common" && varIcons[0] !== "commonCause") {
                      continue;
                  }
                  if (varIconFilter === "special" && varIcons[0] === "commonCause") {
                      continue;
                  }
              }
              const assIcon = assuranceIconToDraw(limits, this.inputSettings.settings[i], this.inputSettings.derivedSettings[i]);
              if (assIconFilter !== "all") {
                  if (assIconFilter === "any" && assIcon === "inconsistent") {
                      continue;
                  }
                  if (assIconFilter === "pass" && assIcon !== "consistentPass") {
                      continue;
                  }
                  if (assIconFilter === "fail" && assIcon !== "consistentFail") {
                      continue;
                  }
                  if (assIconFilter === "inconsistent" && assIcon !== "inconsistent") {
                      continue;
                  }
              }
              const table_row_entries = new Array();
              this.indicatorVarNames.forEach((indicator_name, idx) => {
                  table_row_entries.push([indicator_name, this.groupNames[i][idx]]);
              });
              table_row_entries.push(["latest_date", (_d = limits.keys) === null || _d === void 0 ? void 0 : _d[lastIndex].label]);
              table_row_entries.push(["value", formatValues((_e = limits.values) === null || _e === void 0 ? void 0 : _e[lastIndex], "value")]);
              table_row_entries.push(["numerator", formatValues((_f = limits.numerators) === null || _f === void 0 ? void 0 : _f[lastIndex], "integer")]);
              table_row_entries.push(["denominator", formatValues((_g = limits.denominators) === null || _g === void 0 ? void 0 : _g[lastIndex], "integer")]);
              table_row_entries.push(["target", formatValues((_h = limits.targets) === null || _h === void 0 ? void 0 : _h[lastIndex], "value")]);
              table_row_entries.push(["alt_target", formatValues((_j = limits.alt_targets) === null || _j === void 0 ? void 0 : _j[lastIndex], "value")]);
              table_row_entries.push(["ucl99", formatValues((_k = limits.ul99) === null || _k === void 0 ? void 0 : _k[lastIndex], "value")]);
              table_row_entries.push(["ucl95", formatValues((_l = limits.ul95) === null || _l === void 0 ? void 0 : _l[lastIndex], "value")]);
              table_row_entries.push(["ucl68", formatValues((_m = limits.ul68) === null || _m === void 0 ? void 0 : _m[lastIndex], "value")]);
              table_row_entries.push(["lcl68", formatValues((_o = limits.ll68) === null || _o === void 0 ? void 0 : _o[lastIndex], "value")]);
              table_row_entries.push(["lcl95", formatValues((_p = limits.ll95) === null || _p === void 0 ? void 0 : _p[lastIndex], "value")]);
              table_row_entries.push(["lcl99", formatValues((_q = limits.ll99) === null || _q === void 0 ? void 0 : _q[lastIndex], "value")]);
              table_row_entries.push(["variation", varIcons[0]]);
              table_row_entries.push(["assurance", assIcon]);
              if (anyTooltips) {
                  this.inputData[i].tooltips[lastIndex].forEach(tooltip => {
                      table_row_entries.push([tooltip.displayName, tooltip.value]);
                  });
              }
              if (!this.plotPoints[i]) {
                  this.plotPoints[i] = [];
              }
              this.plotPoints[i].push({
                  table_row: Object.fromEntries(table_row_entries),
                  identity: this.identities[i],
                  aesthetics: this.inputSettings.settings[i].summary_table,
                  highlighted: this.inputData[i].anyHighlights
              });
              this.tableColumns[i] = tableColumnsDef;
          }
      }
      initialisePlotData(host) {
          var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
          const inputData = this.inputData[0];
          const controlLimits = this.controlLimits[0];
          const outliers = this.outliers[0];
          const settings = this.inputSettings.settings[0];
          const derivedSettings = this.inputSettings.derivedSettings[0];
          this.plotPoints[0] = new Array();
          this.tickLabels = new Array();
          this.tableColumns[0] = new Array();
          this.tableColumns[0].push({ name: "date", label: "Date" });
          this.tableColumns[0].push({ name: "value", label: "Value" });
          if (!controlLimits) {
              return;
          }
          if (!isNullOrUndefined(controlLimits.numerators)) {
              this.tableColumns[0].push({ name: "numerator", label: "Numerator" });
          }
          if (!isNullOrUndefined(controlLimits.denominators)) {
              this.tableColumns[0].push({ name: "denominator", label: "Denominator" });
          }
          if (settings.lines.show_target) {
              this.tableColumns[0].push({ name: "target", label: "Target" });
          }
          if (settings.lines.show_alt_target) {
              this.tableColumns[0].push({ name: "alt_target", label: "Alt. Target" });
          }
          if (settings.lines.show_specification) {
              this.tableColumns[0].push({ name: "speclimits_lower", label: "Spec. Lower" }, { name: "speclimits_upper", label: "Spec. Upper" });
          }
          if (settings.lines.show_trend) {
              this.tableColumns[0].push({ name: "trend_line", label: "Trend Line" });
          }
          if (derivedSettings.chart_type_props.has_control_limits) {
              if (settings.lines.show_99) {
                  this.tableColumns[0].push({ name: "ll99", label: "LL 99%" }, { name: "ul99", label: "UL 99%" });
              }
              if (settings.lines.show_95) {
                  this.tableColumns[0].push({ name: "ll95", label: "LL 95%" }, { name: "ul95", label: "UL 95%" });
              }
              if (settings.lines.show_68) {
                  this.tableColumns[0].push({ name: "ll68", label: "LL 68%" }, { name: "ul68", label: "UL 68%" });
              }
          }
          if (settings.outliers.astronomical) {
              this.tableColumns[0].push({ name: "astpoint", label: "Ast. Point" });
          }
          if (settings.outliers.trend) {
              this.tableColumns[0].push({ name: "trend", label: "Trend" });
          }
          if (settings.outliers.shift) {
              this.tableColumns[0].push({ name: "shift", label: "Shift" });
          }
          for (let i = 0; i < controlLimits.keys.length; i++) {
              const index = controlLimits.keys[i].x;
              const aesthetics = inputData.scatter_formatting[i];
              if (this.colourPalette.isHighContrast) {
                  aesthetics.colour = this.colourPalette.foregroundColour;
              }
              if (outliers.shift[i] !== "none") {
                  aesthetics.colour = getAesthetic(outliers.shift[i], "outliers", "shift_colour", settings);
                  aesthetics.colour_outline = getAesthetic(outliers.shift[i], "outliers", "shift_colour", settings);
              }
              if (outliers.trend[i] !== "none") {
                  aesthetics.colour = getAesthetic(outliers.trend[i], "outliers", "trend_colour", settings);
                  aesthetics.colour_outline = getAesthetic(outliers.trend[i], "outliers", "trend_colour", settings);
              }
              if (outliers.two_in_three[i] !== "none") {
                  aesthetics.colour = getAesthetic(outliers.two_in_three[i], "outliers", "twointhree_colour", settings);
                  aesthetics.colour_outline = getAesthetic(outliers.two_in_three[i], "outliers", "twointhree_colour", settings);
              }
              if (outliers.astpoint[i] !== "none") {
                  aesthetics.colour = getAesthetic(outliers.astpoint[i], "outliers", "ast_colour", settings);
                  aesthetics.colour_outline = getAesthetic(outliers.astpoint[i], "outliers", "ast_colour", settings);
              }
              const table_row = {
                  date: controlLimits.keys[i].label,
                  numerator: (_a = controlLimits.numerators) === null || _a === void 0 ? void 0 : _a[i],
                  denominator: (_b = controlLimits.denominators) === null || _b === void 0 ? void 0 : _b[i],
                  value: controlLimits.values[i],
                  target: controlLimits.targets[i],
                  alt_target: controlLimits.alt_targets[i],
                  ll99: (_c = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.ll99) === null || _c === void 0 ? void 0 : _c[i],
                  ll95: (_d = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.ll95) === null || _d === void 0 ? void 0 : _d[i],
                  ll68: (_e = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.ll68) === null || _e === void 0 ? void 0 : _e[i],
                  ul68: (_f = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.ul68) === null || _f === void 0 ? void 0 : _f[i],
                  ul95: (_g = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.ul95) === null || _g === void 0 ? void 0 : _g[i],
                  ul99: (_h = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.ul99) === null || _h === void 0 ? void 0 : _h[i],
                  speclimits_lower: (_j = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.speclimits_lower) === null || _j === void 0 ? void 0 : _j[i],
                  speclimits_upper: (_k = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.speclimits_upper) === null || _k === void 0 ? void 0 : _k[i],
                  trend_line: (_l = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.trend_line) === null || _l === void 0 ? void 0 : _l[i],
                  astpoint: outliers.astpoint[i],
                  trend: outliers.trend[i],
                  shift: outliers.shift[i],
                  two_in_three: outliers.two_in_three[i]
              };
              this.plotPoints[0].push({
                  x: index,
                  value: controlLimits.values[i],
                  aesthetics: aesthetics,
                  table_row: table_row,
                  identity: host.createSelectionIdBuilder()
                      .withCategory(inputData.categories, inputData.limitInputArgs.keys[i].id)
                      .createSelectionId(),
                  highlighted: !isNullOrUndefined((_m = inputData.highlights) === null || _m === void 0 ? void 0 : _m[index]),
                  tooltip: buildTooltip(table_row, (_o = inputData === null || inputData === void 0 ? void 0 : inputData.tooltips) === null || _o === void 0 ? void 0 : _o[index], settings, derivedSettings),
                  label: {
                      text_value: (_p = inputData.labels) === null || _p === void 0 ? void 0 : _p[index],
                      aesthetics: inputData.label_formatting[index],
                      angle: null,
                      distance: null,
                      line_offset: null,
                      marker_offset: null
                  }
              });
              this.tickLabels.push({ x: index, label: controlLimits.keys[i].label });
          }
      }
      initialiseGroupedLines() {
          const settings = this.inputSettings.settings[0];
          const derivedSettings = this.inputSettings.derivedSettings[0];
          const controlLimits = this.controlLimits[0];
          const inputData = this.inputData[0];
          const labels = new Array();
          if (settings.lines.show_main) {
              labels.push("values");
          }
          if (settings.lines.show_target) {
              labels.push("targets");
          }
          if (settings.lines.show_alt_target) {
              labels.push("alt_targets");
          }
          if (settings.lines.show_specification) {
              labels.push("speclimits_lower", "speclimits_upper");
          }
          if (settings.lines.show_trend) {
              labels.push("trend_line");
          }
          if (derivedSettings.chart_type_props.has_control_limits) {
              if (settings.lines.show_99) {
                  labels.push("ll99", "ul99");
              }
              if (settings.lines.show_95) {
                  labels.push("ll95", "ul95");
              }
              if (settings.lines.show_68) {
                  labels.push("ll68", "ul68");
              }
          }
          const formattedLines = new Array();
          if (!controlLimits) {
              return;
          }
          const nLimits = controlLimits.keys.length;
          for (let i = 0; i < nLimits; i++) {
              const isRebaselinePoint = this.splitIndexes.includes(i - 1) || inputData.groupingIndexes.includes(i - 1);
              let isNewAltTarget = false;
              if (i > 0 && settings.lines.show_alt_target) {
                  isNewAltTarget = controlLimits.alt_targets[i] !== controlLimits.alt_targets[i - 1];
              }
              labels.forEach(label => {
                  var _a, _b;
                  const join_rebaselines = settings.lines[`join_rebaselines_${lineNameMap[label]}`];
                  if (isRebaselinePoint || isNewAltTarget) {
                      const is_alt_target = label === "alt_targets" && isNewAltTarget;
                      const is_rebaseline = label !== "alt_targets" && isRebaselinePoint;
                      formattedLines.push({
                          x: controlLimits.keys[i].x,
                          line_value: (!join_rebaselines && (is_alt_target || is_rebaseline)) ? null : (_a = controlLimits[label]) === null || _a === void 0 ? void 0 : _a[i],
                          group: label,
                          aesthetics: inputData.line_formatting[i]
                      });
                  }
                  formattedLines.push({
                      x: controlLimits.keys[i].x,
                      line_value: (_b = controlLimits[label]) === null || _b === void 0 ? void 0 : _b[i],
                      group: label,
                      aesthetics: inputData.line_formatting[i]
                  });
              });
          }
          this.groupedLines = groupBy(formattedLines, "group");
      }
      scaleAndTruncateLimits(controlLimits, inputSettings, derivedSettings) {
          const multiplier = derivedSettings.multiplier;
          let lines_to_scale = ["values", "targets"];
          if (derivedSettings.chart_type_props.has_control_limits) {
              lines_to_scale = lines_to_scale.concat(["ll99", "ll95", "ll68", "ul68", "ul95", "ul99"]);
          }
          let lines_to_truncate = lines_to_scale;
          if (inputSettings.lines.show_alt_target) {
              lines_to_truncate = lines_to_truncate.concat(["alt_targets"]);
              if (inputSettings.lines.multiplier_alt_target) {
                  lines_to_scale = lines_to_scale.concat(["alt_targets"]);
              }
          }
          if (inputSettings.lines.show_specification) {
              lines_to_truncate = lines_to_truncate.concat(["speclimits_lower", "speclimits_upper"]);
              if (inputSettings.lines.multiplier_specification) {
                  lines_to_scale = lines_to_scale.concat(["speclimits_lower", "speclimits_upper"]);
              }
          }
          lines_to_scale.forEach(limit => {
              for (let i = 0; i < controlLimits[limit].length; i++) {
                  if (!isNullOrUndefined(controlLimits[limit][i])) {
                      controlLimits[limit][i] = controlLimits[limit][i] * multiplier;
                  }
              }
          });
          lines_to_truncate.forEach(limit => {
              for (let i = 0; i < controlLimits[limit].length; i++) {
                  if (!isNullOrUndefined(controlLimits[limit][i])) {
                      const lower_trunc = isValidNumber(inputSettings.spc.ll_truncate)
                          ? Math.max(inputSettings.spc.ll_truncate, controlLimits[limit][i])
                          : controlLimits[limit][i];
                      const upper_trunc = isValidNumber(inputSettings.spc.ul_truncate)
                          ? Math.min(inputSettings.spc.ul_truncate, lower_trunc)
                          : lower_trunc;
                      controlLimits[limit][i] = upper_trunc;
                  }
              }
          });
      }
      flagOutliers(controlLimits, groupStartEndIndexes, inputSettings, derivedSettings) {
          var _a, _b, _c, _d;
          const process_flag_type = inputSettings.outliers.process_flag_type;
          const improvement_direction = inputSettings.outliers.improvement_direction;
          const trend_n = inputSettings.outliers.trend_n;
          const shift_n = inputSettings.outliers.shift_n;
          const ast_specification = inputSettings.outliers.astronomical_limit === "Specification";
          const two_in_three_specification = inputSettings.outliers.two_in_three_limit === "Specification";
          const outliers = {
              astpoint: rep("none", controlLimits.values.length),
              two_in_three: rep("none", controlLimits.values.length),
              trend: rep("none", controlLimits.values.length),
              shift: rep("none", controlLimits.values.length)
          };
          for (let i = 0; i < groupStartEndIndexes.length; i++) {
              const start = groupStartEndIndexes[i][0];
              const end = groupStartEndIndexes[i][1];
              const group_values = controlLimits.values.slice(start, end);
              const group_targets = controlLimits.targets.slice(start, end);
              if (derivedSettings.chart_type_props.has_control_limits || ast_specification || two_in_three_specification) {
                  const limit_map = {
                      "1 Sigma": "68",
                      "2 Sigma": "95",
                      "3 Sigma": "99",
                      "Specification": "",
                  };
                  if (inputSettings.outliers.astronomical) {
                      const ast_limit = limit_map[inputSettings.outliers.astronomical_limit];
                      const ll_prefix = ast_specification ? "speclimits_lower" : "ll";
                      const ul_prefix = ast_specification ? "speclimits_upper" : "ul";
                      const lower_limits = (_a = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits[`${ll_prefix}${ast_limit}`]) === null || _a === void 0 ? void 0 : _a.slice(start, end);
                      const upper_limits = (_b = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits[`${ul_prefix}${ast_limit}`]) === null || _b === void 0 ? void 0 : _b.slice(start, end);
                      astronomical(group_values, lower_limits, upper_limits)
                          .forEach((flag, idx) => outliers.astpoint[start + idx] = flag);
                  }
                  if (inputSettings.outliers.two_in_three) {
                      const highlight_series = inputSettings.outliers.two_in_three_highlight_series;
                      const two_in_three_limit = limit_map[inputSettings.outliers.two_in_three_limit];
                      const ll_prefix = two_in_three_specification ? "speclimits_lower" : "ll";
                      const ul_prefix = two_in_three_specification ? "speclimits_upper" : "ul";
                      const lower_warn_limits = (_c = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits[`${ll_prefix}${two_in_three_limit}`]) === null || _c === void 0 ? void 0 : _c.slice(start, end);
                      const upper_warn_limits = (_d = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits[`${ul_prefix}${two_in_three_limit}`]) === null || _d === void 0 ? void 0 : _d.slice(start, end);
                      twoInThree(group_values, lower_warn_limits, upper_warn_limits, highlight_series)
                          .forEach((flag, idx) => outliers.two_in_three[start + idx] = flag);
                  }
              }
              if (inputSettings.outliers.trend) {
                  trend(group_values, trend_n)
                      .forEach((flag, idx) => outliers.trend[start + idx] = flag);
              }
              if (inputSettings.outliers.shift) {
                  shift(group_values, group_targets, shift_n)
                      .forEach((flag, idx) => outliers.shift[start + idx] = flag);
              }
          }
          Object.keys(outliers).forEach(key => {
              for (let i = 0; i < outliers[key].length; i++) {
                  outliers[key][i] = checkFlagDirection(outliers[key][i], { process_flag_type, improvement_direction });
              }
          });
          return outliers;
      }
  }

  class Visual {
      constructor(options) {
          this.tableDiv = select(options.element).append("div")
              .style("overflow", "auto");
          this.svg = select(options.element).append("svg");
          this.host = options.host;
          this.viewModel = new viewModelClass();
          this.plotProperties = new plotPropertiesClass();
          this.selectionManager = this.host.createSelectionManager();
          this.selectionManager.registerOnSelectCallback(() => this.updateHighlighting());
          this.svg.call(initialiseSVG);
          const table = this.tableDiv.append("table")
              .classed("table-group", true)
              .style("border-collapse", "collapse")
              .style("width", "100%")
              .style("height", "100%");
          table.append("thead").append("tr").classed("table-header", true);
          table.append('tbody').classed("table-body", true);
      }
      update(options) {
          var _a, _b, _c, _d, _e, _f;
          try {
              this.host.eventService.renderingStarted(options);
              this.svg.select(".errormessage").remove();
              const update_status = this.viewModel.update(options, this.host);
              if (!update_status.status) {
                  this.resizeCanvas(options.viewport.width, options.viewport.height);
                  if ((_f = (_e = (_d = (_c = (_b = (_a = this.viewModel) === null || _a === void 0 ? void 0 : _a.inputSettings) === null || _b === void 0 ? void 0 : _b.settings) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.canvas) === null || _e === void 0 ? void 0 : _e.show_errors) !== null && _f !== void 0 ? _f : true) {
                      this.svg.call(drawErrors, options, this.viewModel.colourPalette, update_status === null || update_status === void 0 ? void 0 : update_status.error, update_status === null || update_status === void 0 ? void 0 : update_status.type);
                  }
                  else {
                      this.svg.call(initialiseSVG, true);
                  }
                  this.host.eventService.renderingFailed(options);
                  return;
              }
              this.plotProperties.update(options, this.viewModel);
              if (update_status.warning) {
                  this.host.displayWarningIcon("Invalid inputs or settings ignored.\n", update_status.warning);
              }
              if (this.viewModel.showGrouped || this.viewModel.inputSettings.settings[0].summary_table.show_table) {
                  this.resizeCanvas(0, 0);
                  this.tableDiv.call(drawSummaryTable, this)
                      .call(addContextMenu, this);
              }
              else {
                  this.resizeCanvas(options.viewport.width, options.viewport.height);
                  this.drawVisual();
                  this.adjustPaddingForOverflow();
              }
              this.updateHighlighting();
              this.host.eventService.renderingFinished(options);
          }
          catch (caught_error) {
              this.resizeCanvas(options.viewport.width, options.viewport.height);
              this.svg.call(drawErrors, options, this.viewModel.colourPalette, caught_error.message, "internal");
              console.error(caught_error);
              this.host.eventService.renderingFailed(options);
          }
      }
      drawVisual() {
          this.svg.call(drawXAxis, this)
              .call(drawYAxis, this)
              .call(drawTooltipLine, this)
              .call(drawLines, this)
              .call(drawLineLabels, this)
              .call(drawDots, this)
              .call(drawIcons, this)
              .call(addContextMenu, this)
              .call(drawDownloadButton, this)
              .call(drawLabels, this);
      }
      adjustPaddingForOverflow() {
          if (this.viewModel.headless) {
              return;
          }
          const svgWidth = this.viewModel.svgWidth;
          const svgHeight = this.viewModel.svgHeight;
          const svgBBox = this.svg.node().getBBox();
          const overflowLeft = Math.abs(Math.min(0, svgBBox.x));
          const overflowRight = Math.max(0, svgBBox.width + svgBBox.x - svgWidth);
          const overflowTop = Math.abs(Math.min(0, svgBBox.y));
          const overflowBottom = Math.max(0, svgBBox.height + svgBBox.y - svgHeight);
          if (overflowLeft > 0) {
              this.plotProperties.xAxis.start_padding += overflowLeft + this.plotProperties.xAxis.start_padding;
          }
          if (overflowRight > 0) {
              this.plotProperties.xAxis.end_padding += overflowRight + this.plotProperties.xAxis.end_padding;
          }
          if (overflowTop > 0) {
              this.plotProperties.yAxis.end_padding += overflowTop + this.plotProperties.yAxis.end_padding;
          }
          if (overflowBottom > 0) {
              this.plotProperties.yAxis.start_padding += overflowBottom + this.plotProperties.yAxis.start_padding;
          }
          if (overflowLeft > 0 || overflowRight > 0 || overflowTop > 0 || overflowBottom > 0) {
              this.plotProperties.initialiseScale(svgWidth, svgHeight);
              this.drawVisual();
          }
      }
      resizeCanvas(width, height) {
          this.svg.attr("width", width).attr("height", height);
          if (width === 0 && height === 0) {
              this.tableDiv.style("width", "100%").style("height", "100%");
          }
          else {
              this.tableDiv.style("width", "0%").style("height", "0%");
          }
      }
      updateHighlighting() {
          const anyHighlights = this.viewModel.inputData.length > 0
              && this.viewModel.inputData.some(d => d.anyHighlights);
          const allSelectionIDs = this.selectionManager.getSelectionIds();
          const dotsSelection = this.svg.selectAll(".dotsgroup").selectChildren();
          const linesSelection = this.svg.selectAll(".linesgroup").selectChildren();
          const tableSelection = this.tableDiv.selectAll(".table-body").selectChildren();
          linesSelection.style("stroke-opacity", (d) => {
              return getAesthetic(d[0], "lines", "opacity", this.viewModel.inputSettings.settings[0]);
          });
          dotsSelection.style("fill-opacity", (d) => d.aesthetics.opacity);
          dotsSelection.style("stroke-opacity", (d) => d.aesthetics.opacity);
          tableSelection.style("opacity", (d) => d.aesthetics["table_opacity"]);
          if (anyHighlights || (allSelectionIDs.length > 0)) {
              linesSelection.style("stroke-opacity", (d) => {
                  return getAesthetic(d[0], "lines", "opacity_unselected", this.viewModel.inputSettings.settings[0]);
              });
              dotsSelection.nodes().forEach(currentDotNode => {
                  const dot = select(currentDotNode).datum();
                  const currentPointSelected = identitySelected(dot.identity, this.selectionManager);
                  const currentPointHighlighted = dot.highlighted;
                  const newDotOpacity = (currentPointSelected || currentPointHighlighted) ? dot.aesthetics.opacity_selected : dot.aesthetics.opacity_unselected;
                  select(currentDotNode).style("fill-opacity", newDotOpacity);
                  select(currentDotNode).style("stroke-opacity", newDotOpacity);
              });
              tableSelection.nodes().forEach(currentTableNode => {
                  const dot = select(currentTableNode).datum();
                  const currentPointSelected = identitySelected(dot.identity, this.selectionManager);
                  const currentPointHighlighted = dot.highlighted;
                  const newTableOpacity = (currentPointSelected || currentPointHighlighted) ? dot.aesthetics["table_opacity_selected"] : dot.aesthetics["table_opacity_unselected"];
                  select(currentTableNode).style("opacity", newTableOpacity);
              });
          }
      }
      getFormattingModel() {
          return this.viewModel.inputSettings.getFormattingModel();
      }
  }

  exports.Visual = Visual;
  exports.d3 = d3;
  exports.defaultSettings = defaultSettings;

  return exports;

})({});
