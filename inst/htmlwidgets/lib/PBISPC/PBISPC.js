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
  const sqrt$1 = Math.sqrt;
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

  const sqrt3$1 = sqrt$1(3);

  var asterisk = {
    draw(context, size) {
      const r = sqrt$1(size + min$1(size / 28, 0.75)) * 0.59436;
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
      const r = sqrt$1(size / pi$1);
      context.moveTo(r, 0);
      context.arc(0, 0, r, 0, tau$1);
    }
  };

  var cross = {
    draw(context, size) {
      const r = sqrt$1(size / 5) / 2;
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

  const tan30 = sqrt$1(1 / 3);
  const tan30_2 = tan30 * 2;

  var diamond = {
    draw(context, size) {
      const y = sqrt$1(size / tan30_2);
      const x = y * tan30;
      context.moveTo(0, -y);
      context.lineTo(x, 0);
      context.lineTo(0, y);
      context.lineTo(-x, 0);
      context.closePath();
    }
  };

  var square$1 = {
    draw(context, size) {
      const w = sqrt$1(size);
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
      const r = sqrt$1(size * ka);
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

  const sqrt3 = sqrt$1(3);

  var triangle = {
    draw(context, size) {
      const y = -sqrt$1(size / (sqrt3 * 3));
      context.moveTo(0, y * 2);
      context.lineTo(-sqrt3 * y, -y);
      context.lineTo(sqrt3 * y, -y);
      context.closePath();
    }
  };

  const c = -0.5;
  const s = sqrt$1(3) / 2;
  const k = 1 / sqrt$1(12);
  const a = (k / 2 + 1) * 3;

  var wye = {
    draw(context, size) {
      const r = sqrt$1(size / a);
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

  function constants$1(x) {
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
        : constants$1(isNaN(b) ? NaN : 0.5);
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
  var re$1 = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

  function formatSpecifier(specifier) {
    if (!(match = re$1.exec(specifier))) throw new Error("invalid format: " + specifier);
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
    symbolSquare: square$1,
    symbolStar: star,
    symbolTriangle: triangle,
    symbolWye: wye
  });

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
          default: "'Arial', sans-serif",
          valid: [
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
          ]
      },
      size: {
          default: 10,
          options: { minValue: { value: 0 }, maxValue: { value: 100 } }
      },
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
          valid: ["solid", "dotted", "dashed", "double", "groove", "ridge", "inset", "outset", "none"]
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
              "Astronomical Points": {
                  astronomical: {
                      displayName: "Highlight Astronomical Points",
                      type: "ToggleSwitch",
                      default: false
                  },
                  astronomical_limit: {
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
                  },
                  ast_colour_improvement: {
                      displayName: "Imp. Ast. Colour",
                      type: "ColorPicker",
                      default: defaultColours.improvement
                  },
                  ast_colour_deterioration: {
                      displayName: "Det. Ast. Colour",
                      type: "ColorPicker",
                      default: defaultColours.deterioration
                  },
                  ast_colour_neutral_low: {
                      displayName: "Neutral (Low) Ast. Colour",
                      type: "ColorPicker",
                      default: defaultColours.neutral_low
                  },
                  ast_colour_neutral_high: {
                      displayName: "Neutral (High) Ast. Colour",
                      type: "ColorPicker",
                      default: defaultColours.neutral_high
                  }
              },
              "Shifts": {
                  shift: {
                      displayName: "Highlight Shifts",
                      type: "ToggleSwitch",
                      default: false
                  },
                  shift_n: {
                      displayName: "Shift Points",
                      type: "NumUpDown",
                      default: 7,
                      options: { minValue: { value: 1 } }
                  },
                  shift_colour_improvement: {
                      displayName: "Imp. Shift Colour",
                      type: "ColorPicker",
                      default: defaultColours.improvement
                  },
                  shift_colour_deterioration: {
                      displayName: "Det. Shift Colour",
                      type: "ColorPicker",
                      default: defaultColours.deterioration
                  },
                  shift_colour_neutral_low: {
                      displayName: "Neutral (Low) Shift Colour",
                      type: "ColorPicker",
                      default: defaultColours.neutral_low
                  },
                  shift_colour_neutral_high: {
                      displayName: "Neutral (High) Shift Colour",
                      type: "ColorPicker",
                      default: defaultColours.neutral_high
                  }
              },
              "Trends": {
                  trend: {
                      displayName: "Highlight Trends",
                      type: "ToggleSwitch",
                      default: false
                  },
                  trend_n: {
                      displayName: "Trend Points",
                      type: "NumUpDown",
                      default: 5,
                      options: { minValue: { value: 1 } }
                  },
                  trend_colour_improvement: {
                      displayName: "Imp. Trend Colour",
                      type: "ColorPicker",
                      default: defaultColours.improvement
                  },
                  trend_colour_deterioration: {
                      displayName: "Det. Trend Colour",
                      type: "ColorPicker",
                      default: defaultColours.deterioration
                  },
                  trend_colour_neutral_low: {
                      displayName: "Neutral (Low) Trend Colour",
                      type: "ColorPicker",
                      default: defaultColours.neutral_low
                  },
                  trend_colour_neutral_high: {
                      displayName: "Neutral (High) Trend Colour",
                      type: "ColorPicker",
                      default: defaultColours.neutral_high
                  }
              },
              "Two-In-Three": {
                  two_in_three: {
                      displayName: "Highlight Two-in-Three",
                      type: "ToggleSwitch",
                      default: false
                  },
                  two_in_three_highlight_series: {
                      displayName: "Highlight all in Pattern",
                      type: "ToggleSwitch",
                      default: false
                  },
                  two_in_three_limit: {
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
                  },
                  twointhree_colour_improvement: {
                      displayName: "Imp. Two-in-Three Colour",
                      type: "ColorPicker",
                      default: defaultColours.improvement
                  },
                  twointhree_colour_deterioration: {
                      displayName: "Det. Two-in-Three Colour",
                      type: "ColorPicker",
                      default: defaultColours.deterioration
                  },
                  twointhree_colour_neutral_low: {
                      displayName: "Neutral (Low) Two-in-Three Colour",
                      type: "ColorPicker",
                      default: defaultColours.neutral_low
                  },
                  twointhree_colour_neutral_high: {
                      displayName: "Neutral (High) Two-in-Three Colour",
                      type: "ColorPicker",
                      default: defaultColours.neutral_high
                  }
              }
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
              "Main": {
                  show_main: {
                      displayName: "Show Main Line",
                      type: "ToggleSwitch",
                      default: true
                  },
                  width_main: {
                      displayName: "Main Line Width",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  type_main: {
                      displayName: "Main Line Type",
                      type: "Dropdown",
                      default: "10 0",
                      valid: ["10 0", "10 10", "2 5"],
                      items: [
                          { displayName: "Solid", value: "10 0" },
                          { displayName: "Dashed", value: "10 10" },
                          { displayName: "Dotted", value: "2 5" }
                      ]
                  },
                  colour_main: {
                      displayName: "Main Line Colour",
                      type: "ColorPicker",
                      default: defaultColours.common_cause
                  },
                  opacity_main: {
                      displayName: "Default Opacity",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected_main: {
                      displayName: "Opacity if Any Selected",
                      type: "NumUpDown",
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  join_rebaselines_main: {
                      displayName: "Connect Rebaselined Limits",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_main: {
                      displayName: "Show Value on Plot",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_all_main: {
                      displayName: "Show Value at all Re-Baselines",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_n_main: {
                      displayName: "Show Value at Last N Re-Baselines",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 1 } }
                  },
                  plot_label_position_main: {
                      displayName: "Position of Value on Line(s)",
                      type: "Dropdown",
                      default: "beside",
                      valid: ["above", "below", "beside"],
                      items: [
                          { displayName: "Above", value: "above" },
                          { displayName: "Below", value: "below" },
                          { displayName: "Beside", value: "beside" }
                      ]
                  },
                  plot_label_vpad_main: {
                      displayName: "Value Vertical Padding",
                      type: "NumUpDown",
                      default: 0
                  },
                  plot_label_hpad_main: {
                      displayName: "Value Horizontal Padding",
                      type: "NumUpDown",
                      default: 10
                  },
                  plot_label_font_main: {
                      displayName: "Value Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  plot_label_size_main: {
                      displayName: "Value Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  plot_label_colour_main: {
                      displayName: "Value Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  plot_label_prefix_main: {
                      displayName: "Value Prefix",
                      type: "TextInput",
                      default: ""
                  }
              },
              "Target": {
                  show_target: {
                      displayName: "Show Target",
                      type: "ToggleSwitch",
                      default: true
                  },
                  width_target: {
                      displayName: "Line Width",
                      type: "NumUpDown",
                      default: 1.5,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  type_target: {
                      displayName: "Line Type",
                      type: "Dropdown",
                      default: "10 0",
                      valid: ["10 0", "10 10", "2 5"],
                      items: [
                          { displayName: "Solid", value: "10 0" },
                          { displayName: "Dashed", value: "10 10" },
                          { displayName: "Dotted", value: "2 5" }
                      ]
                  },
                  colour_target: {
                      displayName: "Line Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  opacity_target: {
                      displayName: "Default Opacity",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected_target: {
                      displayName: "Opacity if Any Selected",
                      type: "NumUpDown",
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  join_rebaselines_target: {
                      displayName: "Connect Rebaselined Limits",
                      type: "ToggleSwitch",
                      default: false
                  },
                  ttip_show_target: {
                      displayName: "Show value in tooltip",
                      type: "ToggleSwitch",
                      default: true
                  },
                  ttip_label_target: {
                      displayName: "Tooltip Label",
                      type: "TextInput",
                      default: "Centerline"
                  },
                  plot_label_show_target: {
                      displayName: "Show Value on Plot",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_all_target: {
                      displayName: "Show Value at all Re-Baselines",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_n_target: {
                      displayName: "Show Value at Last N Re-Baselines",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 1 } }
                  },
                  plot_label_position_target: {
                      displayName: "Position of Value on Line(s)",
                      type: "Dropdown",
                      default: "beside",
                      valid: ["above", "below", "beside"],
                      items: [
                          { displayName: "Above", value: "above" },
                          { displayName: "Below", value: "below" },
                          { displayName: "Beside", value: "beside" }
                      ]
                  },
                  plot_label_vpad_target: {
                      displayName: "Value Vertical Padding",
                      type: "NumUpDown",
                      default: 0
                  },
                  plot_label_hpad_target: {
                      displayName: "Value Horizontal Padding",
                      type: "NumUpDown",
                      default: 10
                  },
                  plot_label_font_target: {
                      displayName: "Value Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  plot_label_size_target: {
                      displayName: "Value Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  plot_label_colour_target: {
                      displayName: "Value Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  plot_label_prefix_target: {
                      displayName: "Value Prefix",
                      type: "TextInput",
                      default: ""
                  }
              },
              "Alt. Target": {
                  show_alt_target: {
                      displayName: "Show Alt. Target Line",
                      type: "ToggleSwitch",
                      default: false
                  },
                  alt_target: {
                      displayName: "Additional Target Value:",
                      type: "NumUpDown",
                      default: null
                  },
                  multiplier_alt_target: {
                      displayName: "Apply Multiplier to Alt. Target",
                      type: "ToggleSwitch",
                      default: false
                  },
                  width_alt_target: {
                      displayName: "Line Width",
                      type: "NumUpDown",
                      default: 1.5,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  type_alt_target: {
                      displayName: "Line Type",
                      type: "Dropdown",
                      default: "10 0",
                      valid: ["10 0", "10 10", "2 5"],
                      items: [
                          { displayName: "Solid", value: "10 0" },
                          { displayName: "Dashed", value: "10 10" },
                          { displayName: "Dotted", value: "2 5" }
                      ]
                  },
                  colour_alt_target: {
                      displayName: "Line Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  opacity_alt_target: {
                      displayName: "Default Opacity",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected_alt_target: {
                      displayName: "Opacity if Any Selected",
                      type: "NumUpDown",
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  join_rebaselines_alt_target: {
                      displayName: "Connect Rebaselined Limits",
                      type: "ToggleSwitch",
                      default: false
                  },
                  ttip_show_alt_target: {
                      displayName: "Show value in tooltip",
                      type: "ToggleSwitch",
                      default: true
                  },
                  ttip_label_alt_target: {
                      displayName: "Tooltip Label",
                      type: "TextInput",
                      default: "Alt. Target"
                  },
                  plot_label_show_alt_target: {
                      displayName: "Show Value on Plot",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_all_alt_target: {
                      displayName: "Show Value at all Re-Baselines",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_n_alt_target: {
                      displayName: "Show Value at Last N Re-Baselines",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 1 } }
                  },
                  plot_label_position_alt_target: {
                      displayName: "Position of Value on Line(s)",
                      type: "Dropdown",
                      default: "beside",
                      valid: ["above", "below", "beside"],
                      items: [
                          { displayName: "Above", value: "above" },
                          { displayName: "Below", value: "below" },
                          { displayName: "Beside", value: "beside" }
                      ]
                  },
                  plot_label_vpad_alt_target: {
                      displayName: "Value Vertical Padding",
                      type: "NumUpDown",
                      default: 0
                  },
                  plot_label_hpad_alt_target: {
                      displayName: "Value Horizontal Padding",
                      type: "NumUpDown",
                      default: 10
                  },
                  plot_label_font_alt_target: {
                      displayName: "Value Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  plot_label_size_alt_target: {
                      displayName: "Value Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  plot_label_colour_alt_target: {
                      displayName: "Value Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  plot_label_prefix_alt_target: {
                      displayName: "Value Prefix",
                      type: "TextInput",
                      default: ""
                  }
              },
              "68% Limits": {
                  show_68: {
                      displayName: "Show 68% Lines",
                      type: "ToggleSwitch",
                      default: false
                  },
                  width_68: {
                      displayName: "Line Width",
                      type: "NumUpDown",
                      default: 2,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  type_68: {
                      displayName: "Line Type",
                      type: "Dropdown",
                      default: "2 5",
                      valid: ["10 0", "10 10", "2 5"],
                      items: [
                          { displayName: "Solid", value: "10 0" },
                          { displayName: "Dashed", value: "10 10" },
                          { displayName: "Dotted", value: "2 5" }
                      ]
                  },
                  colour_68: {
                      displayName: "Line Colour",
                      type: "ColorPicker",
                      default: defaultColours.limits
                  },
                  opacity_68: {
                      displayName: "Default Opacity",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected_68: {
                      displayName: "Opacity if Any Selected",
                      type: "NumUpDown",
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  join_rebaselines_68: {
                      displayName: "Connect Rebaselined Limits",
                      type: "ToggleSwitch",
                      default: false
                  },
                  ttip_show_68: {
                      displayName: "Show value in tooltip",
                      type: "ToggleSwitch",
                      default: true
                  },
                  ttip_label_68: {
                      displayName: "Tooltip Label",
                      type: "TextInput",
                      default: "68% Limit"
                  },
                  ttip_label_68_prefix_lower: {
                      displayName: "Tooltip Label - Lower Prefix",
                      type: "TextInput",
                      default: "Lower "
                  },
                  ttip_label_68_prefix_upper: {
                      displayName: "Tooltip Label - Upper Prefix",
                      type: "TextInput",
                      default: "Upper "
                  },
                  plot_label_show_68: {
                      displayName: "Show Value on Plot",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_all_68: {
                      displayName: "Show Value at all Re-Baselines",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_n_68: {
                      displayName: "Show Value at Last N Re-Baselines",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 1 } }
                  },
                  plot_label_position_68: {
                      displayName: "Position of Value on Line(s)",
                      type: "Dropdown",
                      default: "beside",
                      valid: ["outside", "inside", "above", "below", "beside"],
                      items: [
                          { displayName: "Outside", value: "outside" },
                          { displayName: "Inside", value: "inside" },
                          { displayName: "Above", value: "above" },
                          { displayName: "Below", value: "below" },
                          { displayName: "Beside", value: "beside" }
                      ]
                  },
                  plot_label_vpad_68: {
                      displayName: "Value Vertical Padding",
                      type: "NumUpDown",
                      default: 0
                  },
                  plot_label_hpad_68: {
                      displayName: "Value Horizontal Padding",
                      type: "NumUpDown",
                      default: 10
                  },
                  plot_label_font_68: {
                      displayName: "Value Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  plot_label_size_68: {
                      displayName: "Value Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  plot_label_colour_68: {
                      displayName: "Value Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  plot_label_prefix_68: {
                      displayName: "Value Prefix",
                      type: "TextInput",
                      default: ""
                  }
              },
              "95% Limits": {
                  show_95: {
                      displayName: "Show 95% Lines",
                      type: "ToggleSwitch",
                      default: true
                  },
                  width_95: {
                      displayName: "Line Width",
                      type: "NumUpDown",
                      default: 2,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  type_95: {
                      displayName: "Line Type",
                      type: "Dropdown",
                      default: "2 5",
                      valid: ["10 0", "10 10", "2 5"],
                      items: [
                          { displayName: "Solid", value: "10 0" },
                          { displayName: "Dashed", value: "10 10" },
                          { displayName: "Dotted", value: "2 5" }
                      ]
                  },
                  colour_95: {
                      displayName: "Line Colour",
                      type: "ColorPicker",
                      default: defaultColours.limits
                  },
                  opacity_95: {
                      displayName: "Default Opacity",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected_95: {
                      displayName: "Opacity if Any Selected",
                      type: "NumUpDown",
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  join_rebaselines_95: {
                      displayName: "Connect Rebaselined Limits",
                      type: "ToggleSwitch",
                      default: false
                  },
                  ttip_show_95: {
                      displayName: "Show value in tooltip",
                      type: "ToggleSwitch",
                      default: true
                  },
                  ttip_label_95: {
                      displayName: "Tooltip Label",
                      type: "TextInput",
                      default: "95% Limit"
                  },
                  ttip_label_95_prefix_lower: {
                      displayName: "Tooltip Label - Lower Prefix",
                      type: "TextInput",
                      default: "Lower "
                  },
                  ttip_label_95_prefix_upper: {
                      displayName: "Tooltip Label - Upper Prefix",
                      type: "TextInput",
                      default: "Upper "
                  },
                  plot_label_show_95: {
                      displayName: "Show Value on Plot",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_all_95: {
                      displayName: "Show Value at all Re-Baselines",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_n_95: {
                      displayName: "Show Value at Last N Re-Baselines",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 1 } }
                  },
                  plot_label_position_95: {
                      displayName: "Position of Value on Line(s)",
                      type: "Dropdown",
                      default: "beside",
                      valid: ["outside", "inside", "above", "below", "beside"],
                      items: [
                          { displayName: "Outside", value: "outside" },
                          { displayName: "Inside", value: "inside" },
                          { displayName: "Above", value: "above" },
                          { displayName: "Below", value: "below" },
                          { displayName: "Beside", value: "beside" }
                      ]
                  },
                  plot_label_vpad_95: {
                      displayName: "Value Vertical Padding",
                      type: "NumUpDown",
                      default: 0
                  },
                  plot_label_hpad_95: {
                      displayName: "Value Horizontal Padding",
                      type: "NumUpDown",
                      default: 10
                  },
                  plot_label_font_95: {
                      displayName: "Value Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  plot_label_size_95: {
                      displayName: "Value Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  plot_label_colour_95: {
                      displayName: "Value Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  plot_label_prefix_95: {
                      displayName: "Value Prefix",
                      type: "TextInput",
                      default: ""
                  }
              },
              "99% Limits": {
                  show_99: {
                      displayName: "Show 99% Lines",
                      type: "ToggleSwitch",
                      default: true
                  },
                  width_99: {
                      displayName: "Line Width",
                      type: "NumUpDown",
                      default: 2,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  type_99: {
                      displayName: "Line Type",
                      type: "Dropdown",
                      default: "10 10",
                      valid: ["10 0", "10 10", "2 5"],
                      items: [
                          { displayName: "Solid", value: "10 0" },
                          { displayName: "Dashed", value: "10 10" },
                          { displayName: "Dotted", value: "2 5" }
                      ]
                  },
                  colour_99: {
                      displayName: "Line Colour",
                      type: "ColorPicker",
                      default: defaultColours.limits
                  },
                  opacity_99: {
                      displayName: "Default Opacity",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected_99: {
                      displayName: "Opacity if Any Selected",
                      type: "NumUpDown",
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  join_rebaselines_99: {
                      displayName: "Connect Rebaselined Limits",
                      type: "ToggleSwitch",
                      default: false
                  },
                  ttip_show_99: {
                      displayName: "Show value in tooltip",
                      type: "ToggleSwitch",
                      default: true
                  },
                  ttip_label_99: {
                      displayName: "Tooltip Label",
                      type: "TextInput",
                      default: "99% Limit"
                  },
                  ttip_label_99_prefix_lower: {
                      displayName: "Tooltip Label - Lower Prefix",
                      type: "TextInput",
                      default: "Lower "
                  },
                  ttip_label_99_prefix_upper: {
                      displayName: "Tooltip Label - Upper Prefix",
                      type: "TextInput",
                      default: "Upper "
                  },
                  plot_label_show_99: {
                      displayName: "Show Value on Plot",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_all_99: {
                      displayName: "Show Value at all Re-Baselines",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_n_99: {
                      displayName: "Show Value at Last N Re-Baselines",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 1 } }
                  },
                  plot_label_position_99: {
                      displayName: "Position of Value on Line(s)",
                      type: "Dropdown",
                      default: "beside",
                      valid: ["outside", "inside", "above", "below", "beside"],
                      items: [
                          { displayName: "Outside", value: "outside" },
                          { displayName: "Inside", value: "inside" },
                          { displayName: "Above", value: "above" },
                          { displayName: "Below", value: "below" },
                          { displayName: "Beside", value: "beside" }
                      ]
                  },
                  plot_label_vpad_99: {
                      displayName: "Value Vertical Padding",
                      type: "NumUpDown",
                      default: 0
                  },
                  plot_label_hpad_99: {
                      displayName: "Value Horizontal Padding",
                      type: "NumUpDown",
                      default: 10
                  },
                  plot_label_font_99: {
                      displayName: "Value Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  plot_label_size_99: {
                      displayName: "Value Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  plot_label_colour_99: {
                      displayName: "Value Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  plot_label_prefix_99: {
                      displayName: "Value Prefix",
                      type: "TextInput",
                      default: ""
                  }
              },
              "Specification Limits": {
                  show_specification: {
                      displayName: "Show Specification Lines",
                      type: "ToggleSwitch",
                      default: false
                  },
                  specification_upper: {
                      displayName: "Upper Specification Limit:",
                      type: "NumUpDown",
                      default: null
                  },
                  specification_lower: {
                      displayName: "Lower Specification Limit:",
                      type: "NumUpDown",
                      default: null
                  },
                  multiplier_specification: {
                      displayName: "Apply Multiplier to Specification Limits",
                      type: "ToggleSwitch",
                      default: false
                  },
                  width_specification: {
                      displayName: "Line Width",
                      type: "NumUpDown",
                      default: 2,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  type_specification: {
                      displayName: "Line Type",
                      type: "Dropdown",
                      default: "10 10",
                      valid: ["10 0", "10 10", "2 5"],
                      items: [
                          { displayName: "Solid", value: "10 0" },
                          { displayName: "Dashed", value: "10 10" },
                          { displayName: "Dotted", value: "2 5" }
                      ]
                  },
                  colour_specification: {
                      displayName: "Line Colour",
                      type: "ColorPicker",
                      default: defaultColours.limits
                  },
                  opacity_specification: {
                      displayName: "Default Opacity",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected_specification: {
                      displayName: "Opacity if Any Selected",
                      type: "NumUpDown",
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  join_rebaselines_specification: {
                      displayName: "Connect Rebaselined Limits",
                      type: "ToggleSwitch",
                      default: false
                  },
                  ttip_show_specification: {
                      displayName: "Show value in tooltip",
                      type: "ToggleSwitch",
                      default: true
                  },
                  ttip_label_specification: {
                      displayName: "Tooltip Label",
                      type: "TextInput",
                      default: "specification Limit"
                  },
                  ttip_label_specification_prefix_lower: {
                      displayName: "Tooltip Label - Lower Prefix",
                      type: "TextInput",
                      default: "Lower "
                  },
                  ttip_label_specification_prefix_upper: {
                      displayName: "Tooltip Label - Upper Prefix",
                      type: "TextInput",
                      default: "Upper "
                  },
                  plot_label_show_specification: {
                      displayName: "Show Value on Plot",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_all_specification: {
                      displayName: "Show Value at all Re-Baselines",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_n_specification: {
                      displayName: "Show Value at Last N Re-Baselines",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 1 } }
                  },
                  plot_label_position_specification: {
                      displayName: "Position of Value on Line(s)",
                      type: "Dropdown",
                      default: "beside",
                      valid: ["outside", "inside", "above", "below", "beside"],
                      items: [
                          { displayName: "Outside", value: "outside" },
                          { displayName: "Inside", value: "inside" },
                          { displayName: "Above", value: "above" },
                          { displayName: "Below", value: "below" },
                          { displayName: "Beside", value: "beside" }
                      ]
                  },
                  plot_label_vpad_specification: {
                      displayName: "Value Vertical Padding",
                      type: "NumUpDown",
                      default: 0
                  },
                  plot_label_hpad_specification: {
                      displayName: "Value Horizontal Padding",
                      type: "NumUpDown",
                      default: 10
                  },
                  plot_label_font_specification: {
                      displayName: "Value Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  plot_label_size_specification: {
                      displayName: "Value Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  plot_label_colour_specification: {
                      displayName: "Value Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  plot_label_prefix_specification: {
                      displayName: "Value Prefix",
                      type: "TextInput",
                      default: ""
                  }
              },
              "Trend": {
                  show_trend: {
                      displayName: "Show Trend",
                      type: "ToggleSwitch",
                      default: false
                  },
                  width_trend: {
                      displayName: "Line Width",
                      type: "NumUpDown",
                      default: 1.5,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  type_trend: {
                      displayName: "Line Type",
                      type: "Dropdown",
                      default: "10 0",
                      valid: ["10 0", "10 10", "2 5"],
                      items: [
                          { displayName: "Solid", value: "10 0" },
                          { displayName: "Dashed", value: "10 10" },
                          { displayName: "Dotted", value: "2 5" }
                      ]
                  },
                  colour_trend: {
                      displayName: "Line Colour",
                      type: "ColorPicker",
                      default: defaultColours.common_cause
                  },
                  opacity_trend: {
                      displayName: "Default Opacity",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected_trend: {
                      displayName: "Opacity if Any Selected",
                      type: "NumUpDown",
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  join_rebaselines_trend: {
                      displayName: "Connect Rebaselined Limits",
                      type: "ToggleSwitch",
                      default: false
                  },
                  ttip_show_trend: {
                      displayName: "Show value in tooltip",
                      type: "ToggleSwitch",
                      default: true
                  },
                  ttip_label_trend: {
                      displayName: "Tooltip Label",
                      type: "TextInput",
                      default: "Centerline"
                  },
                  plot_label_show_trend: {
                      displayName: "Show Value on Plot",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_all_trend: {
                      displayName: "Show Value at all Re-Baselines",
                      type: "ToggleSwitch",
                      default: false
                  },
                  plot_label_show_n_trend: {
                      displayName: "Show Value at Last N Re-Baselines",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 1 } }
                  },
                  plot_label_position_trend: {
                      displayName: "Position of Value on Line(s)",
                      type: "Dropdown",
                      default: "beside",
                      valid: ["above", "below", "beside"],
                      items: [
                          { displayName: "Above", value: "above" },
                          { displayName: "Below", value: "below" },
                          { displayName: "Beside", value: "beside" }
                      ]
                  },
                  plot_label_vpad_trend: {
                      displayName: "Value Vertical Padding",
                      type: "NumUpDown",
                      default: 0
                  },
                  plot_label_hpad_trend: {
                      displayName: "Value Horizontal Padding",
                      type: "NumUpDown",
                      default: 10
                  },
                  plot_label_font_trend: {
                      displayName: "Value Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  plot_label_size_trend: {
                      displayName: "Value Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  plot_label_colour_trend: {
                      displayName: "Value Colour",
                      type: "ColorPicker",
                      default: defaultColours.standard
                  },
                  plot_label_prefix_trend: {
                      displayName: "Value Prefix",
                      type: "TextInput",
                      default: ""
                  }
              }
          }
      },
      x_axis: {
          description: "X Axis Settings",
          displayName: "X Axis Settings",
          settingsGroups: {
              "Axis": {
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
                  xlimit_tick_font: {
                      displayName: "Tick Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  xlimit_tick_size: {
                      displayName: "Tick Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
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
                  xlimit_label_font: {
                      displayName: "Label Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  xlimit_label_size: {
                      displayName: "Label Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
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
                  ylimit_tick_font: {
                      displayName: "Tick Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  ylimit_tick_size: {
                      displayName: "Tick Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
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
                  ylimit_label_font: {
                      displayName: "Label Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  ylimit_label_size: {
                      displayName: "Label Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
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
                  table_opacity: {
                      displayName: "Default Opacity",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  table_opacity_selected: {
                      displayName: "Opacity if Selected",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  table_opacity_unselected: {
                      displayName: "Opacity if Unselected",
                      type: "NumUpDown",
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  table_outer_border_style: {
                      displayName: "Outer Border Style",
                      type: "Dropdown",
                      default: borderOptions.style.default,
                      valid: borderOptions.style.valid,
                      items: [
                          { displayName: "Solid", value: "solid" },
                          { displayName: "Dashed", value: "dashed" },
                          { displayName: "Dotted", value: "dotted" },
                          { displayName: "Double", value: "double" },
                          { displayName: "Groove", value: "groove" },
                          { displayName: "Ridge", value: "ridge" },
                          { displayName: "Inset", value: "inset" },
                          { displayName: "Outset", value: "outset" }
                      ]
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
                  table_header_font: {
                      displayName: "Header Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  table_header_size: {
                      displayName: "Header Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
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
                      items: [
                          { displayName: "Solid", value: "solid" },
                          { displayName: "Dashed", value: "dashed" },
                          { displayName: "Dotted", value: "dotted" },
                          { displayName: "Double", value: "double" },
                          { displayName: "Groove", value: "groove" },
                          { displayName: "Ridge", value: "ridge" },
                          { displayName: "Inset", value: "inset" },
                          { displayName: "Outset", value: "outset" }
                      ]
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
                  table_body_font: {
                      displayName: "Body Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  table_body_size: {
                      displayName: "Body Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
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
                      items: [
                          { displayName: "Solid", value: "solid" },
                          { displayName: "Dashed", value: "dashed" },
                          { displayName: "Dotted", value: "dotted" },
                          { displayName: "Double", value: "double" },
                          { displayName: "Groove", value: "groove" },
                          { displayName: "Ridge", value: "ridge" },
                          { displayName: "Inset", value: "inset" },
                          { displayName: "Outset", value: "outset" }
                      ]
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
                  label_font: {
                      displayName: "Label Font",
                      type: "FontPicker",
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  label_size: {
                      displayName: "Label Font Size",
                      type: "NumUpDown",
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
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
                  label_line_width: {
                      displayName: "Connecting Line Width",
                      type: "NumUpDown",
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  label_line_type: {
                      displayName: "Connecting Line Type",
                      type: "Dropdown",
                      default: "10 0",
                      valid: ["10 0", "10 10", "2 5"],
                      items: [
                          { displayName: "Solid", value: "10 0" },
                          { displayName: "Dashed", value: "10 10" },
                          { displayName: "Dotted", value: "2 5" }
                      ]
                  },
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

  function addContextMenu(selection, visualObj) {
      if (!(visualObj.plotProperties.displayPlot
          || visualObj.viewModel.inputSettings.settings.summary_table.show_table
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

  function isNullOrUndefined(value) {
      return value === null || value === undefined;
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

  function broadcastBinary(fun) {
      return function (x, y) {
          if (Array.isArray(x) && Array.isArray(y)) {
              return x.map((d, idx) => fun(d, y[idx]));
          }
          else if (Array.isArray(x) && !Array.isArray(y)) {
              return x.map(d => fun(d, y));
          }
          else if (!Array.isArray(x) && Array.isArray(y)) {
              return y.map(d => fun(x, d));
          }
          else {
              return fun(x, y);
          }
      };
  }
  const pow = broadcastBinary((x, y) => (x >= 0.0) ? Math.pow(x, y) : -Math.pow(-x, y));
  const add = broadcastBinary((x, y) => x + y);
  const subtract = broadcastBinary((x, y) => x - y);
  const divide = broadcastBinary((x, y) => x / y);
  const multiply = broadcastBinary((x, y) => {
      return (isNullOrUndefined(x) || isNullOrUndefined(y)) ? null : (x * y);
  });

  function broadcastUnary(fun) {
      return function (y) {
          if (Array.isArray(y)) {
              return y.map((d) => fun(d));
          }
          else {
              return fun(y);
          }
      };
  }
  const sqrt = broadcastUnary(Math.sqrt);
  const abs = broadcastUnary((x) => (x ? Math.abs(x) : x));
  const exp = broadcastUnary(Math.exp);
  const square = broadcastUnary((x) => Math.pow(x, 2));

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

  const checkFlagDirection = broadcastBinary((outlierStatus, flagSettings) => {
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
  });

  function c4(sampleSize) {
      if ((sampleSize <= 1) || isNullOrUndefined(sampleSize)) {
          return null;
      }
      const Nminus1 = sampleSize - 1;
      return sqrt(2.0 / Nminus1)
          * exp(lgamma(sampleSize / 2.0) - lgamma(Nminus1 / 2.0));
  }
  const c5 = broadcastUnary((sampleSize) => {
      return sqrt(1 - square(c4(sampleSize)));
  });
  const a3 = broadcastUnary((sampleSize) => {
      const filt_samp = sampleSize <= 1 ? null : sampleSize;
      return 3.0 / (c4(filt_samp) * sqrt(filt_samp));
  });
  const b_helper = broadcastBinary((sampleSize, sigma) => {
      return (sigma * c5(sampleSize)) / c4(sampleSize);
  });
  const b3 = broadcastBinary((sampleSize, sigma) => {
      return 1 - b_helper(sampleSize, sigma);
  });
  const b4 = broadcastBinary((sampleSize, sigma) => {
      return 1 + b_helper(sampleSize, sigma);
  });

  function diff(x) {
      return x.map((d, idx, arr) => (idx > 0) ? d - arr[idx - 1] : null);
  }

  function rep(x, n) {
      return Array(n).fill(x);
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

  function datePartsToRecord(dateParts) {
      const datePartsRecord = Object.fromEntries(dateParts.filter(part => part.type !== "literal").map(part => [part.type, part.value]));
      ["weekday", "day", "month", "year"].forEach(key => {
          var _a;
          (_a = datePartsRecord[key]) !== null && _a !== void 0 ? _a : (datePartsRecord[key] = "");
      });
      return datePartsRecord;
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
      const formatter = new Intl.DateTimeFormat(inputSettings.dates.date_format_locale, dateSettingsToFormatOptions(inputSettings.dates));
      let day_elem = inputSettings.dates.date_format_locale === "en-GB" ? "day" : "month";
      let month_elem = inputSettings.dates.date_format_locale === "en-GB" ? "month" : "day";
      for (let i = 0; i < n_keys; i++) {
          if (isNullOrUndefined(inputDates.dates[i])) {
              ret[i] = null;
          }
          else {
              const dateParts = datePartsToRecord(formatter.formatToParts(inputDates.dates[i]));
              const datePartStrings = [dateParts.weekday + " " + dateParts[day_elem],
                  dateParts[month_elem], (_c = (_b = inputDates.quarters) === null || _b === void 0 ? void 0 : _b[i]) !== null && _c !== void 0 ? _c : "", dateParts.year];
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

  function extractValues(valuesArray, indexArray) {
      if (valuesArray) {
          return valuesArray.filter((_, idx) => indexArray.indexOf(idx) != -1);
      }
      else {
          return [];
      }
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

  const truncate = broadcastBinary((val, limits) => {
      let rtn = val;
      if (limits.lower || limits.lower == 0) {
          rtn = (rtn < limits.lower ? limits.lower : rtn);
      }
      if (limits.upper) {
          rtn = (rtn > limits.upper ? limits.upper : rtn);
      }
      return rtn;
  });

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

  function median(values) {
      const n = values.length;
      if (n === 0) {
          return NaN;
      }
      const sortedValues = [...values].sort((a, b) => a - b);
      const mid = Math.floor(n / 2);
      if (n % 2 === 0) {
          return (sortedValues[mid - 1] + sortedValues[mid]) / 2;
      }
      else {
          return sortedValues[mid];
      }
  }

  function max(values) {
      return Math.max(...values);
  }

  function min(values) {
      return Math.min(...values);
  }

  function mean(values) {
      const n = values.length;
      if (n === 0) {
          return NaN;
      }
      let sum = 0;
      for (let i = 0; i < n; i++) {
          sum += values[i];
      }
      return sum / n;
  }

  function sum(values) {
      let total = 0;
      for (let i = 0; i < values.length; i++) {
          total += values[i];
      }
      return total;
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
      if ((inputSettingsClass === null || inputSettingsClass === void 0 ? void 0 : inputSettingsClass.derivedSettingsGrouped.length) > 0) {
          inputSettingsClass === null || inputSettingsClass === void 0 ? void 0 : inputSettingsClass.derivedSettingsGrouped.forEach((d) => {
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
          chart_type = inputSettingsClass.settings.spc.chart_type;
          needs_denominator = inputSettingsClass.derivedSettings.chart_type_props.needs_denominator;
          needs_sd = inputSettingsClass.derivedSettings.chart_type_props.needs_sd;
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

  const formatPrimitiveValue = broadcastBinary((rawValue, config) => {
      if (isNullOrUndefined(rawValue)) {
          return null;
      }
      if (config.valueType.numeric) {
          return rawValue.toString();
      }
      else {
          return rawValue;
      }
  });

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

  function seq(start, end) {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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

  function isValidNumber(value) {
      return !isNullOrUndefined(value) && !isNaN(value) && isFinite(value);
  }

  function groupBy(data, key) {
      const groupedData = new Map();
      data.forEach(item => {
          var _a;
          const keyValue = item[key];
          if (!groupedData.has(keyValue)) {
              groupedData.set(keyValue, []);
          }
          (_a = groupedData.get(keyValue)) === null || _a === void 0 ? void 0 : _a.push(item);
      });
      return Array.from(groupedData);
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

  function drawDots(selection, visualObj) {
      const ylower = visualObj.plotProperties.yAxis.lower;
      const yupper = visualObj.plotProperties.yAxis.upper;
      const xlower = visualObj.plotProperties.xAxis.lower;
      const xupper = visualObj.plotProperties.xAxis.upper;
      selection
          .select(".dotsgroup")
          .selectAll("path")
          .data(visualObj.viewModel.plotPoints)
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
              if (visualObj.viewModel.inputSettings.settings.spc.split_on_click) {
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

  function drawIcons(selection, visualObj) {
      selection.selectAll(".icongroup").remove();
      if (!(visualObj.plotProperties.displayPlot)) {
          return;
      }
      const nhsIconSettings = visualObj.viewModel.inputSettings.settings.nhs_icons;
      const draw_variation = nhsIconSettings.show_variation_icons;
      const variation_location = nhsIconSettings.variation_icons_locations;
      const svg_width = visualObj.viewModel.svgWidth;
      const svg_height = visualObj.viewModel.svgHeight;
      let numVariationIcons = 0;
      if (draw_variation) {
          const variation_scaling = nhsIconSettings.variation_icons_scaling;
          const variationIconsPresent = variationIconsToDraw(visualObj.viewModel.outliers, visualObj.viewModel.inputSettings.settings);
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
          const assuranceIconPresent = assuranceIconToDraw(visualObj.viewModel.controlLimits, visualObj.viewModel.inputSettings.settings, visualObj.viewModel.inputSettings.derivedSettings);
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
          const plotPoints = visualObj.viewModel.plotPoints;
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

  function drawXAxis(selection, visualObj) {
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
      const xAxisGroup = selection.select(".xaxisgroup");
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

  function drawYAxis(selection, visualObj) {
      const yAxisProperties = visualObj.plotProperties.yAxis;
      const yAxis = axisLeft(visualObj.plotProperties.yScale);
      const yaxis_sig_figs = visualObj.viewModel.inputSettings.settings.y_axis.ylimit_sig_figs;
      const sig_figs = isNullOrUndefined(yaxis_sig_figs) ? visualObj.viewModel.inputSettings.settings.spc.sig_figs : yaxis_sig_figs;
      const displayPlot = visualObj.plotProperties.displayPlot;
      if (yAxisProperties.ticks) {
          if (yAxisProperties.tick_count) {
              yAxis.ticks(yAxisProperties.tick_count);
          }
          if (visualObj.viewModel.inputData) {
              yAxis.tickFormat((d) => {
                  return visualObj.viewModel.inputSettings.derivedSettings.percentLabels
                      ? d.toFixed(sig_figs) + "%"
                      : d.toFixed(sig_figs);
              });
          }
      }
      else {
          yAxis.tickValues([]);
      }
      const yAxisGroup = selection.select(".yaxisgroup");
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
          plotPoints = visualObj.viewModel.plotPointsGrouped;
          cols = visualObj.viewModel.tableColumnsGrouped;
      }
      else {
          plotPoints = visualObj.viewModel.plotPoints;
          cols = visualObj.viewModel.tableColumns;
      }
      const maxWidth = visualObj.viewModel.svgWidth / cols.length;
      const tableSettings = visualObj.viewModel.inputSettings.settings.summary_table;
      selection.call(drawTableHeaders, cols, tableSettings, maxWidth)
          .call(drawTableRows, visualObj, plotPoints, tableSettings, maxWidth);
      if (plotPoints.length > 0) {
          selection.call(drawTableCells, cols, visualObj.viewModel.inputSettings.settings, visualObj.viewModel.showGrouped);
      }
      selection.call(drawOuterBorder, tableSettings);
      selection.on('click', () => {
          visualObj.selectionManager.clear();
          visualObj.updateHighlighting();
      });
  }

  function drawDownloadButton(selection, visualObj) {
      if (!(visualObj.viewModel.inputSettings.settings.download_options.show_button)) {
          selection.select(".download-btn-group").remove();
          return;
      }
      if (selection.select(".download-btn-group").empty()) {
          selection.append("text").classed("download-btn-group", true);
      }
      const table_rows = visualObj.viewModel.plotPoints.map(d => d.table_row);
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
      if (!visualObj.viewModel.inputSettings.settings.labels.show_labels || !visualObj.viewModel.inputData.anyLabels) {
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
          .data(visualObj.viewModel.plotPoints)
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
              .style("stroke", visualObj.viewModel.inputSettings.settings.labels.label_line_colour)
              .style("stroke-width", visualObj.viewModel.inputSettings.settings.labels.label_line_width)
              .style("stroke-dasharray", visualObj.viewModel.inputSettings.settings.labels.label_line_type);
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
      const lineSettings = visualObj.viewModel.inputSettings.settings.lines;
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
      const formatValue = valueFormatter(visualObj.viewModel.inputSettings.settings, visualObj.viewModel.inputSettings.derivedSettings);
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
          var _a, _b, _c, _d, _e, _f, _g, _h, _j;
          const plotPoints = viewModel.plotPoints;
          const controlLimits = viewModel.controlLimits;
          const inputData = viewModel.inputData;
          const inputSettings = viewModel.inputSettings.settings;
          const derivedSettings = viewModel.inputSettings.derivedSettings;
          const colorPalette = viewModel.colourPalette;
          this.displayPlot = plotPoints
              ? plotPoints.length > 1
              : null;
          let xLowerLimit = inputSettings.x_axis.xlimit_l;
          let xUpperLimit = inputSettings.x_axis.xlimit_u;
          let yLowerLimit = inputSettings.y_axis.ylimit_l;
          let yUpperLimit = inputSettings.y_axis.ylimit_u;
          if (((_a = inputData === null || inputData === void 0 ? void 0 : inputData.validationStatus) === null || _a === void 0 ? void 0 : _a.status) == 0 && controlLimits) {
              xUpperLimit = !isNullOrUndefined(xUpperLimit) ? xUpperLimit : max(controlLimits.keys.map(d => d.x));
              const limitMultiplier = inputSettings.y_axis.limit_multiplier;
              const values = controlLimits.values.filter(d => isValidNumber(d));
              const ul99 = (_b = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.ul99) === null || _b === void 0 ? void 0 : _b.filter(d => isValidNumber(d));
              const speclimits_upper = (_c = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.speclimits_upper) === null || _c === void 0 ? void 0 : _c.filter(d => isValidNumber(d));
              const ll99 = (_d = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.ll99) === null || _d === void 0 ? void 0 : _d.filter(d => isValidNumber(d));
              const speclimits_lower = (_e = controlLimits === null || controlLimits === void 0 ? void 0 : controlLimits.speclimits_lower) === null || _e === void 0 ? void 0 : _e.filter(d => isValidNumber(d));
              const alt_targets = (_f = controlLimits.alt_targets) === null || _f === void 0 ? void 0 : _f.filter(d => isValidNumber(d));
              const targets = (_g = controlLimits.targets) === null || _g === void 0 ? void 0 : _g.filter(d => isValidNumber(d));
              const maxValue = max(values);
              const maxValueOrLimit = max(values.concat(ul99).concat(speclimits_upper).concat(alt_targets));
              const minValueOrLimit = min(values.concat(ll99).concat(speclimits_lower).concat(alt_targets));
              const maxTarget = (_h = max(targets)) !== null && _h !== void 0 ? _h : 0;
              const minTarget = (_j = min(targets)) !== null && _j !== void 0 ? _j : 0;
              const upperLimitRaw = maxTarget + (maxValueOrLimit - maxTarget) * limitMultiplier;
              const lowerLimitRaw = minTarget - (minTarget - minValueOrLimit) * limitMultiplier;
              const multiplier = derivedSettings.multiplier;
              yUpperLimit !== null && yUpperLimit !== void 0 ? yUpperLimit : (yUpperLimit = (derivedSettings.percentLabels && !(maxValue > (1 * multiplier)))
                  ? truncate(upperLimitRaw, { upper: 1 * multiplier })
                  : upperLimitRaw);
              yLowerLimit !== null && yLowerLimit !== void 0 ? yLowerLimit : (yLowerLimit = derivedSettings.percentLabels
                  ? truncate(lowerLimitRaw, { lower: 0 * multiplier })
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

  var powerbiVisualsApi = {};

  var re = {exports: {}};

  var constants;
  var hasRequiredConstants;

  function requireConstants () {
  	if (hasRequiredConstants) return constants;
  	hasRequiredConstants = 1;
  	// Note: this is the semver.org version of the spec that it implements
  	// Not necessarily the package version of this code.
  	const SEMVER_SPEC_VERSION = '2.0.0';

  	const MAX_LENGTH = 256;
  	const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  	/* istanbul ignore next */ 9007199254740991;

  	// Max safe segment length for coercion.
  	const MAX_SAFE_COMPONENT_LENGTH = 16;

  	// Max safe length for a build identifier. The max length minus 6 characters for
  	// the shortest version with a build 0.0.0+BUILD.
  	const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;

  	const RELEASE_TYPES = [
  	  'major',
  	  'premajor',
  	  'minor',
  	  'preminor',
  	  'patch',
  	  'prepatch',
  	  'prerelease',
  	];

  	constants = {
  	  MAX_LENGTH,
  	  MAX_SAFE_COMPONENT_LENGTH,
  	  MAX_SAFE_BUILD_LENGTH,
  	  MAX_SAFE_INTEGER,
  	  RELEASE_TYPES,
  	  SEMVER_SPEC_VERSION,
  	  FLAG_INCLUDE_PRERELEASE: 0b001,
  	  FLAG_LOOSE: 0b010,
  	};
  	return constants;
  }

  var debug_1;
  var hasRequiredDebug;

  function requireDebug () {
  	if (hasRequiredDebug) return debug_1;
  	hasRequiredDebug = 1;
  	const debug = (
  	  typeof process === 'object' &&
  	  process.env &&
  	  process.env.NODE_DEBUG &&
  	  /\bsemver\b/i.test(process.env.NODE_DEBUG)
  	) ? (...args) => console.error('SEMVER', ...args)
  	  : () => {};

  	debug_1 = debug;
  	return debug_1;
  }

  var hasRequiredRe;

  function requireRe () {
  	if (hasRequiredRe) return re.exports;
  	hasRequiredRe = 1;
  	(function (module, exports$1) {
  		const {
  		  MAX_SAFE_COMPONENT_LENGTH,
  		  MAX_SAFE_BUILD_LENGTH,
  		  MAX_LENGTH,
  		} = requireConstants();
  		const debug = requireDebug();
  		exports$1 = module.exports = {};

  		// The actual regexps go on exports.re
  		const re = exports$1.re = [];
  		const safeRe = exports$1.safeRe = [];
  		const src = exports$1.src = [];
  		const t = exports$1.t = {};
  		let R = 0;

  		const LETTERDASHNUMBER = '[a-zA-Z0-9-]';

  		// Replace some greedy regex tokens to prevent regex dos issues. These regex are
  		// used internally via the safeRe object since all inputs in this library get
  		// normalized first to trim and collapse all extra whitespace. The original
  		// regexes are exported for userland consumption and lower level usage. A
  		// future breaking change could export the safer regex only with a note that
  		// all input should have extra whitespace removed.
  		const safeRegexReplacements = [
  		  ['\\s', 1],
  		  ['\\d', MAX_LENGTH],
  		  [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
  		];

  		const makeSafeRegex = (value) => {
  		  for (const [token, max] of safeRegexReplacements) {
  		    value = value
  		      .split(`${token}*`).join(`${token}{0,${max}}`)
  		      .split(`${token}+`).join(`${token}{1,${max}}`);
  		  }
  		  return value
  		};

  		const createToken = (name, value, isGlobal) => {
  		  const safe = makeSafeRegex(value);
  		  const index = R++;
  		  debug(name, index, value);
  		  t[name] = index;
  		  src[index] = value;
  		  re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
  		  safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined);
  		};

  		// The following Regular Expressions can be used for tokenizing,
  		// validating, and parsing SemVer version strings.

  		// ## Numeric Identifier
  		// A single `0`, or a non-zero digit followed by zero or more digits.

  		createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
  		createToken('NUMERICIDENTIFIERLOOSE', '\\d+');

  		// ## Non-numeric Identifier
  		// Zero or more digits, followed by a letter or hyphen, and then zero or
  		// more letters, digits, or hyphens.

  		createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);

  		// ## Main Version
  		// Three dot-separated numeric identifiers.

  		createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
  		                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
  		                   `(${src[t.NUMERICIDENTIFIER]})`);

  		createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
  		                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
  		                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`);

  		// ## Pre-release Version Identifier
  		// A numeric identifier, or a non-numeric identifier.

  		createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
		}|${src[t.NONNUMERICIDENTIFIER]})`);

  		createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
		}|${src[t.NONNUMERICIDENTIFIER]})`);

  		// ## Pre-release Version
  		// Hyphen, followed by one or more dot-separated pre-release version
  		// identifiers.

  		createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
		}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);

  		createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
		}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);

  		// ## Build Metadata Identifier
  		// Any combination of digits, letters, or hyphens.

  		createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`);

  		// ## Build Metadata
  		// Plus sign, followed by one or more period-separated build metadata
  		// identifiers.

  		createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
		}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);

  		// ## Full Version String
  		// A main version, followed optionally by a pre-release version and
  		// build metadata.

  		// Note that the only major, minor, patch, and pre-release sections of
  		// the version string are capturing groups.  The build metadata is not a
  		// capturing group, because it should not ever be used in version
  		// comparison.

  		createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
		}${src[t.PRERELEASE]}?${
		  src[t.BUILD]}?`);

  		createToken('FULL', `^${src[t.FULLPLAIN]}$`);

  		// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
  		// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
  		// common in the npm registry.
  		createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
		}${src[t.PRERELEASELOOSE]}?${
		  src[t.BUILD]}?`);

  		createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);

  		createToken('GTLT', '((?:<|>)?=?)');

  		// Something like "2.*" or "1.2.x".
  		// Note that "x.x" is a valid xRange identifer, meaning "any version"
  		// Only the first item is strictly required.
  		createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
  		createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);

  		createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
  		                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
  		                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
  		                   `(?:${src[t.PRERELEASE]})?${
		                     src[t.BUILD]}?` +
  		                   `)?)?`);

  		createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
  		                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
  		                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
  		                        `(?:${src[t.PRERELEASELOOSE]})?${
		                          src[t.BUILD]}?` +
  		                        `)?)?`);

  		createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
  		createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);

  		// Coercion.
  		// Extract anything that could conceivably be a part of a valid semver
  		createToken('COERCEPLAIN', `${'(^|[^\\d])' +
		              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
  		              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
  		              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
  		createToken('COERCE', `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
  		createToken('COERCEFULL', src[t.COERCEPLAIN] +
  		              `(?:${src[t.PRERELEASE]})?` +
  		              `(?:${src[t.BUILD]})?` +
  		              `(?:$|[^\\d])`);
  		createToken('COERCERTL', src[t.COERCE], true);
  		createToken('COERCERTLFULL', src[t.COERCEFULL], true);

  		// Tilde ranges.
  		// Meaning is "reasonably at or greater than"
  		createToken('LONETILDE', '(?:~>?)');

  		createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
  		exports$1.tildeTrimReplace = '$1~';

  		createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
  		createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);

  		// Caret ranges.
  		// Meaning is "at least and backwards compatible with"
  		createToken('LONECARET', '(?:\\^)');

  		createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
  		exports$1.caretTrimReplace = '$1^';

  		createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
  		createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);

  		// A simple gt/lt/eq thing, or just "" to indicate "any version"
  		createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
  		createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);

  		// An expression to strip any whitespace between the gtlt and the thing
  		// it modifies, so that `> 1.2.3` ==> `>1.2.3`
  		createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
		}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
  		exports$1.comparatorTrimReplace = '$1$2$3';

  		// Something like `1.2.3 - 1.2.4`
  		// Note that these all use the loose form, because they'll be
  		// checked against either the strict or loose comparator form
  		// later.
  		createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
  		                   `\\s+-\\s+` +
  		                   `(${src[t.XRANGEPLAIN]})` +
  		                   `\\s*$`);

  		createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
  		                        `\\s+-\\s+` +
  		                        `(${src[t.XRANGEPLAINLOOSE]})` +
  		                        `\\s*$`);

  		// Star ranges basically just allow anything at all.
  		createToken('STAR', '(<|>)?=?\\s*\\*');
  		// >=0.0.0 is like a star
  		createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$');
  		createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$'); 
  	} (re, re.exports));
  	return re.exports;
  }

  var parseOptions_1;
  var hasRequiredParseOptions;

  function requireParseOptions () {
  	if (hasRequiredParseOptions) return parseOptions_1;
  	hasRequiredParseOptions = 1;
  	// parse out just the options we care about
  	const looseOption = Object.freeze({ loose: true });
  	const emptyOpts = Object.freeze({ });
  	const parseOptions = options => {
  	  if (!options) {
  	    return emptyOpts
  	  }

  	  if (typeof options !== 'object') {
  	    return looseOption
  	  }

  	  return options
  	};
  	parseOptions_1 = parseOptions;
  	return parseOptions_1;
  }

  var identifiers;
  var hasRequiredIdentifiers;

  function requireIdentifiers () {
  	if (hasRequiredIdentifiers) return identifiers;
  	hasRequiredIdentifiers = 1;
  	const numeric = /^[0-9]+$/;
  	const compareIdentifiers = (a, b) => {
  	  const anum = numeric.test(a);
  	  const bnum = numeric.test(b);

  	  if (anum && bnum) {
  	    a = +a;
  	    b = +b;
  	  }

  	  return a === b ? 0
  	    : (anum && !bnum) ? -1
  	    : (bnum && !anum) ? 1
  	    : a < b ? -1
  	    : 1
  	};

  	const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);

  	identifiers = {
  	  compareIdentifiers,
  	  rcompareIdentifiers,
  	};
  	return identifiers;
  }

  var semver$1;
  var hasRequiredSemver$1;

  function requireSemver$1 () {
  	if (hasRequiredSemver$1) return semver$1;
  	hasRequiredSemver$1 = 1;
  	const debug = requireDebug();
  	const { MAX_LENGTH, MAX_SAFE_INTEGER } = requireConstants();
  	const { safeRe: re, t } = requireRe();

  	const parseOptions = requireParseOptions();
  	const { compareIdentifiers } = requireIdentifiers();
  	class SemVer {
  	  constructor (version, options) {
  	    options = parseOptions(options);

  	    if (version instanceof SemVer) {
  	      if (version.loose === !!options.loose &&
  	          version.includePrerelease === !!options.includePrerelease) {
  	        return version
  	      } else {
  	        version = version.version;
  	      }
  	    } else if (typeof version !== 'string') {
  	      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`)
  	    }

  	    if (version.length > MAX_LENGTH) {
  	      throw new TypeError(
  	        `version is longer than ${MAX_LENGTH} characters`
  	      )
  	    }

  	    debug('SemVer', version, options);
  	    this.options = options;
  	    this.loose = !!options.loose;
  	    // this isn't actually relevant for versions, but keep it so that we
  	    // don't run into trouble passing this.options around.
  	    this.includePrerelease = !!options.includePrerelease;

  	    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);

  	    if (!m) {
  	      throw new TypeError(`Invalid Version: ${version}`)
  	    }

  	    this.raw = version;

  	    // these are actually numbers
  	    this.major = +m[1];
  	    this.minor = +m[2];
  	    this.patch = +m[3];

  	    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
  	      throw new TypeError('Invalid major version')
  	    }

  	    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
  	      throw new TypeError('Invalid minor version')
  	    }

  	    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
  	      throw new TypeError('Invalid patch version')
  	    }

  	    // numberify any prerelease numeric ids
  	    if (!m[4]) {
  	      this.prerelease = [];
  	    } else {
  	      this.prerelease = m[4].split('.').map((id) => {
  	        if (/^[0-9]+$/.test(id)) {
  	          const num = +id;
  	          if (num >= 0 && num < MAX_SAFE_INTEGER) {
  	            return num
  	          }
  	        }
  	        return id
  	      });
  	    }

  	    this.build = m[5] ? m[5].split('.') : [];
  	    this.format();
  	  }

  	  format () {
  	    this.version = `${this.major}.${this.minor}.${this.patch}`;
  	    if (this.prerelease.length) {
  	      this.version += `-${this.prerelease.join('.')}`;
  	    }
  	    return this.version
  	  }

  	  toString () {
  	    return this.version
  	  }

  	  compare (other) {
  	    debug('SemVer.compare', this.version, this.options, other);
  	    if (!(other instanceof SemVer)) {
  	      if (typeof other === 'string' && other === this.version) {
  	        return 0
  	      }
  	      other = new SemVer(other, this.options);
  	    }

  	    if (other.version === this.version) {
  	      return 0
  	    }

  	    return this.compareMain(other) || this.comparePre(other)
  	  }

  	  compareMain (other) {
  	    if (!(other instanceof SemVer)) {
  	      other = new SemVer(other, this.options);
  	    }

  	    return (
  	      compareIdentifiers(this.major, other.major) ||
  	      compareIdentifiers(this.minor, other.minor) ||
  	      compareIdentifiers(this.patch, other.patch)
  	    )
  	  }

  	  comparePre (other) {
  	    if (!(other instanceof SemVer)) {
  	      other = new SemVer(other, this.options);
  	    }

  	    // NOT having a prerelease is > having one
  	    if (this.prerelease.length && !other.prerelease.length) {
  	      return -1
  	    } else if (!this.prerelease.length && other.prerelease.length) {
  	      return 1
  	    } else if (!this.prerelease.length && !other.prerelease.length) {
  	      return 0
  	    }

  	    let i = 0;
  	    do {
  	      const a = this.prerelease[i];
  	      const b = other.prerelease[i];
  	      debug('prerelease compare', i, a, b);
  	      if (a === undefined && b === undefined) {
  	        return 0
  	      } else if (b === undefined) {
  	        return 1
  	      } else if (a === undefined) {
  	        return -1
  	      } else if (a === b) {
  	        continue
  	      } else {
  	        return compareIdentifiers(a, b)
  	      }
  	    } while (++i)
  	  }

  	  compareBuild (other) {
  	    if (!(other instanceof SemVer)) {
  	      other = new SemVer(other, this.options);
  	    }

  	    let i = 0;
  	    do {
  	      const a = this.build[i];
  	      const b = other.build[i];
  	      debug('build compare', i, a, b);
  	      if (a === undefined && b === undefined) {
  	        return 0
  	      } else if (b === undefined) {
  	        return 1
  	      } else if (a === undefined) {
  	        return -1
  	      } else if (a === b) {
  	        continue
  	      } else {
  	        return compareIdentifiers(a, b)
  	      }
  	    } while (++i)
  	  }

  	  // preminor will bump the version up to the next minor release, and immediately
  	  // down to pre-release. premajor and prepatch work the same way.
  	  inc (release, identifier, identifierBase) {
  	    switch (release) {
  	      case 'premajor':
  	        this.prerelease.length = 0;
  	        this.patch = 0;
  	        this.minor = 0;
  	        this.major++;
  	        this.inc('pre', identifier, identifierBase);
  	        break
  	      case 'preminor':
  	        this.prerelease.length = 0;
  	        this.patch = 0;
  	        this.minor++;
  	        this.inc('pre', identifier, identifierBase);
  	        break
  	      case 'prepatch':
  	        // If this is already a prerelease, it will bump to the next version
  	        // drop any prereleases that might already exist, since they are not
  	        // relevant at this point.
  	        this.prerelease.length = 0;
  	        this.inc('patch', identifier, identifierBase);
  	        this.inc('pre', identifier, identifierBase);
  	        break
  	      // If the input is a non-prerelease version, this acts the same as
  	      // prepatch.
  	      case 'prerelease':
  	        if (this.prerelease.length === 0) {
  	          this.inc('patch', identifier, identifierBase);
  	        }
  	        this.inc('pre', identifier, identifierBase);
  	        break

  	      case 'major':
  	        // If this is a pre-major version, bump up to the same major version.
  	        // Otherwise increment major.
  	        // 1.0.0-5 bumps to 1.0.0
  	        // 1.1.0 bumps to 2.0.0
  	        if (
  	          this.minor !== 0 ||
  	          this.patch !== 0 ||
  	          this.prerelease.length === 0
  	        ) {
  	          this.major++;
  	        }
  	        this.minor = 0;
  	        this.patch = 0;
  	        this.prerelease = [];
  	        break
  	      case 'minor':
  	        // If this is a pre-minor version, bump up to the same minor version.
  	        // Otherwise increment minor.
  	        // 1.2.0-5 bumps to 1.2.0
  	        // 1.2.1 bumps to 1.3.0
  	        if (this.patch !== 0 || this.prerelease.length === 0) {
  	          this.minor++;
  	        }
  	        this.patch = 0;
  	        this.prerelease = [];
  	        break
  	      case 'patch':
  	        // If this is not a pre-release version, it will increment the patch.
  	        // If it is a pre-release it will bump up to the same patch version.
  	        // 1.2.0-5 patches to 1.2.0
  	        // 1.2.0 patches to 1.2.1
  	        if (this.prerelease.length === 0) {
  	          this.patch++;
  	        }
  	        this.prerelease = [];
  	        break
  	      // This probably shouldn't be used publicly.
  	      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
  	      case 'pre': {
  	        const base = Number(identifierBase) ? 1 : 0;

  	        if (!identifier && identifierBase === false) {
  	          throw new Error('invalid increment argument: identifier is empty')
  	        }

  	        if (this.prerelease.length === 0) {
  	          this.prerelease = [base];
  	        } else {
  	          let i = this.prerelease.length;
  	          while (--i >= 0) {
  	            if (typeof this.prerelease[i] === 'number') {
  	              this.prerelease[i]++;
  	              i = -2;
  	            }
  	          }
  	          if (i === -1) {
  	            // didn't increment anything
  	            if (identifier === this.prerelease.join('.') && identifierBase === false) {
  	              throw new Error('invalid increment argument: identifier already exists')
  	            }
  	            this.prerelease.push(base);
  	          }
  	        }
  	        if (identifier) {
  	          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
  	          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
  	          let prerelease = [identifier, base];
  	          if (identifierBase === false) {
  	            prerelease = [identifier];
  	          }
  	          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
  	            if (isNaN(this.prerelease[1])) {
  	              this.prerelease = prerelease;
  	            }
  	          } else {
  	            this.prerelease = prerelease;
  	          }
  	        }
  	        break
  	      }
  	      default:
  	        throw new Error(`invalid increment argument: ${release}`)
  	    }
  	    this.raw = this.format();
  	    if (this.build.length) {
  	      this.raw += `+${this.build.join('.')}`;
  	    }
  	    return this
  	  }
  	}

  	semver$1 = SemVer;
  	return semver$1;
  }

  var parse_1;
  var hasRequiredParse;

  function requireParse () {
  	if (hasRequiredParse) return parse_1;
  	hasRequiredParse = 1;
  	const SemVer = requireSemver$1();
  	const parse = (version, options, throwErrors = false) => {
  	  if (version instanceof SemVer) {
  	    return version
  	  }
  	  try {
  	    return new SemVer(version, options)
  	  } catch (er) {
  	    if (!throwErrors) {
  	      return null
  	    }
  	    throw er
  	  }
  	};

  	parse_1 = parse;
  	return parse_1;
  }

  var valid_1;
  var hasRequiredValid$1;

  function requireValid$1 () {
  	if (hasRequiredValid$1) return valid_1;
  	hasRequiredValid$1 = 1;
  	const parse = requireParse();
  	const valid = (version, options) => {
  	  const v = parse(version, options);
  	  return v ? v.version : null
  	};
  	valid_1 = valid;
  	return valid_1;
  }

  var clean_1;
  var hasRequiredClean;

  function requireClean () {
  	if (hasRequiredClean) return clean_1;
  	hasRequiredClean = 1;
  	const parse = requireParse();
  	const clean = (version, options) => {
  	  const s = parse(version.trim().replace(/^[=v]+/, ''), options);
  	  return s ? s.version : null
  	};
  	clean_1 = clean;
  	return clean_1;
  }

  var inc_1;
  var hasRequiredInc;

  function requireInc () {
  	if (hasRequiredInc) return inc_1;
  	hasRequiredInc = 1;
  	const SemVer = requireSemver$1();

  	const inc = (version, release, options, identifier, identifierBase) => {
  	  if (typeof (options) === 'string') {
  	    identifierBase = identifier;
  	    identifier = options;
  	    options = undefined;
  	  }

  	  try {
  	    return new SemVer(
  	      version instanceof SemVer ? version.version : version,
  	      options
  	    ).inc(release, identifier, identifierBase).version
  	  } catch (er) {
  	    return null
  	  }
  	};
  	inc_1 = inc;
  	return inc_1;
  }

  var diff_1;
  var hasRequiredDiff;

  function requireDiff () {
  	if (hasRequiredDiff) return diff_1;
  	hasRequiredDiff = 1;
  	const parse = requireParse();

  	const diff = (version1, version2) => {
  	  const v1 = parse(version1, null, true);
  	  const v2 = parse(version2, null, true);
  	  const comparison = v1.compare(v2);

  	  if (comparison === 0) {
  	    return null
  	  }

  	  const v1Higher = comparison > 0;
  	  const highVersion = v1Higher ? v1 : v2;
  	  const lowVersion = v1Higher ? v2 : v1;
  	  const highHasPre = !!highVersion.prerelease.length;
  	  const lowHasPre = !!lowVersion.prerelease.length;

  	  if (lowHasPre && !highHasPre) {
  	    // Going from prerelease -> no prerelease requires some special casing

  	    // If the low version has only a major, then it will always be a major
  	    // Some examples:
  	    // 1.0.0-1 -> 1.0.0
  	    // 1.0.0-1 -> 1.1.1
  	    // 1.0.0-1 -> 2.0.0
  	    if (!lowVersion.patch && !lowVersion.minor) {
  	      return 'major'
  	    }

  	    // Otherwise it can be determined by checking the high version

  	    if (highVersion.patch) {
  	      // anything higher than a patch bump would result in the wrong version
  	      return 'patch'
  	    }

  	    if (highVersion.minor) {
  	      // anything higher than a minor bump would result in the wrong version
  	      return 'minor'
  	    }

  	    // bumping major/minor/patch all have same result
  	    return 'major'
  	  }

  	  // add the `pre` prefix if we are going to a prerelease version
  	  const prefix = highHasPre ? 'pre' : '';

  	  if (v1.major !== v2.major) {
  	    return prefix + 'major'
  	  }

  	  if (v1.minor !== v2.minor) {
  	    return prefix + 'minor'
  	  }

  	  if (v1.patch !== v2.patch) {
  	    return prefix + 'patch'
  	  }

  	  // high and low are preleases
  	  return 'prerelease'
  	};

  	diff_1 = diff;
  	return diff_1;
  }

  var major_1;
  var hasRequiredMajor;

  function requireMajor () {
  	if (hasRequiredMajor) return major_1;
  	hasRequiredMajor = 1;
  	const SemVer = requireSemver$1();
  	const major = (a, loose) => new SemVer(a, loose).major;
  	major_1 = major;
  	return major_1;
  }

  var minor_1;
  var hasRequiredMinor;

  function requireMinor () {
  	if (hasRequiredMinor) return minor_1;
  	hasRequiredMinor = 1;
  	const SemVer = requireSemver$1();
  	const minor = (a, loose) => new SemVer(a, loose).minor;
  	minor_1 = minor;
  	return minor_1;
  }

  var patch_1;
  var hasRequiredPatch;

  function requirePatch () {
  	if (hasRequiredPatch) return patch_1;
  	hasRequiredPatch = 1;
  	const SemVer = requireSemver$1();
  	const patch = (a, loose) => new SemVer(a, loose).patch;
  	patch_1 = patch;
  	return patch_1;
  }

  var prerelease_1;
  var hasRequiredPrerelease;

  function requirePrerelease () {
  	if (hasRequiredPrerelease) return prerelease_1;
  	hasRequiredPrerelease = 1;
  	const parse = requireParse();
  	const prerelease = (version, options) => {
  	  const parsed = parse(version, options);
  	  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
  	};
  	prerelease_1 = prerelease;
  	return prerelease_1;
  }

  var compare_1;
  var hasRequiredCompare;

  function requireCompare () {
  	if (hasRequiredCompare) return compare_1;
  	hasRequiredCompare = 1;
  	const SemVer = requireSemver$1();
  	const compare = (a, b, loose) =>
  	  new SemVer(a, loose).compare(new SemVer(b, loose));

  	compare_1 = compare;
  	return compare_1;
  }

  var rcompare_1;
  var hasRequiredRcompare;

  function requireRcompare () {
  	if (hasRequiredRcompare) return rcompare_1;
  	hasRequiredRcompare = 1;
  	const compare = requireCompare();
  	const rcompare = (a, b, loose) => compare(b, a, loose);
  	rcompare_1 = rcompare;
  	return rcompare_1;
  }

  var compareLoose_1;
  var hasRequiredCompareLoose;

  function requireCompareLoose () {
  	if (hasRequiredCompareLoose) return compareLoose_1;
  	hasRequiredCompareLoose = 1;
  	const compare = requireCompare();
  	const compareLoose = (a, b) => compare(a, b, true);
  	compareLoose_1 = compareLoose;
  	return compareLoose_1;
  }

  var compareBuild_1;
  var hasRequiredCompareBuild;

  function requireCompareBuild () {
  	if (hasRequiredCompareBuild) return compareBuild_1;
  	hasRequiredCompareBuild = 1;
  	const SemVer = requireSemver$1();
  	const compareBuild = (a, b, loose) => {
  	  const versionA = new SemVer(a, loose);
  	  const versionB = new SemVer(b, loose);
  	  return versionA.compare(versionB) || versionA.compareBuild(versionB)
  	};
  	compareBuild_1 = compareBuild;
  	return compareBuild_1;
  }

  var sort_1;
  var hasRequiredSort;

  function requireSort () {
  	if (hasRequiredSort) return sort_1;
  	hasRequiredSort = 1;
  	const compareBuild = requireCompareBuild();
  	const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
  	sort_1 = sort;
  	return sort_1;
  }

  var rsort_1;
  var hasRequiredRsort;

  function requireRsort () {
  	if (hasRequiredRsort) return rsort_1;
  	hasRequiredRsort = 1;
  	const compareBuild = requireCompareBuild();
  	const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
  	rsort_1 = rsort;
  	return rsort_1;
  }

  var gt_1;
  var hasRequiredGt;

  function requireGt () {
  	if (hasRequiredGt) return gt_1;
  	hasRequiredGt = 1;
  	const compare = requireCompare();
  	const gt = (a, b, loose) => compare(a, b, loose) > 0;
  	gt_1 = gt;
  	return gt_1;
  }

  var lt_1;
  var hasRequiredLt;

  function requireLt () {
  	if (hasRequiredLt) return lt_1;
  	hasRequiredLt = 1;
  	const compare = requireCompare();
  	const lt = (a, b, loose) => compare(a, b, loose) < 0;
  	lt_1 = lt;
  	return lt_1;
  }

  var eq_1;
  var hasRequiredEq;

  function requireEq () {
  	if (hasRequiredEq) return eq_1;
  	hasRequiredEq = 1;
  	const compare = requireCompare();
  	const eq = (a, b, loose) => compare(a, b, loose) === 0;
  	eq_1 = eq;
  	return eq_1;
  }

  var neq_1;
  var hasRequiredNeq;

  function requireNeq () {
  	if (hasRequiredNeq) return neq_1;
  	hasRequiredNeq = 1;
  	const compare = requireCompare();
  	const neq = (a, b, loose) => compare(a, b, loose) !== 0;
  	neq_1 = neq;
  	return neq_1;
  }

  var gte_1;
  var hasRequiredGte;

  function requireGte () {
  	if (hasRequiredGte) return gte_1;
  	hasRequiredGte = 1;
  	const compare = requireCompare();
  	const gte = (a, b, loose) => compare(a, b, loose) >= 0;
  	gte_1 = gte;
  	return gte_1;
  }

  var lte_1;
  var hasRequiredLte;

  function requireLte () {
  	if (hasRequiredLte) return lte_1;
  	hasRequiredLte = 1;
  	const compare = requireCompare();
  	const lte = (a, b, loose) => compare(a, b, loose) <= 0;
  	lte_1 = lte;
  	return lte_1;
  }

  var cmp_1;
  var hasRequiredCmp;

  function requireCmp () {
  	if (hasRequiredCmp) return cmp_1;
  	hasRequiredCmp = 1;
  	const eq = requireEq();
  	const neq = requireNeq();
  	const gt = requireGt();
  	const gte = requireGte();
  	const lt = requireLt();
  	const lte = requireLte();

  	const cmp = (a, op, b, loose) => {
  	  switch (op) {
  	    case '===':
  	      if (typeof a === 'object') {
  	        a = a.version;
  	      }
  	      if (typeof b === 'object') {
  	        b = b.version;
  	      }
  	      return a === b

  	    case '!==':
  	      if (typeof a === 'object') {
  	        a = a.version;
  	      }
  	      if (typeof b === 'object') {
  	        b = b.version;
  	      }
  	      return a !== b

  	    case '':
  	    case '=':
  	    case '==':
  	      return eq(a, b, loose)

  	    case '!=':
  	      return neq(a, b, loose)

  	    case '>':
  	      return gt(a, b, loose)

  	    case '>=':
  	      return gte(a, b, loose)

  	    case '<':
  	      return lt(a, b, loose)

  	    case '<=':
  	      return lte(a, b, loose)

  	    default:
  	      throw new TypeError(`Invalid operator: ${op}`)
  	  }
  	};
  	cmp_1 = cmp;
  	return cmp_1;
  }

  var coerce_1;
  var hasRequiredCoerce;

  function requireCoerce () {
  	if (hasRequiredCoerce) return coerce_1;
  	hasRequiredCoerce = 1;
  	const SemVer = requireSemver$1();
  	const parse = requireParse();
  	const { safeRe: re, t } = requireRe();

  	const coerce = (version, options) => {
  	  if (version instanceof SemVer) {
  	    return version
  	  }

  	  if (typeof version === 'number') {
  	    version = String(version);
  	  }

  	  if (typeof version !== 'string') {
  	    return null
  	  }

  	  options = options || {};

  	  let match = null;
  	  if (!options.rtl) {
  	    match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
  	  } else {
  	    // Find the right-most coercible string that does not share
  	    // a terminus with a more left-ward coercible string.
  	    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
  	    // With includePrerelease option set, '1.2.3.4-rc' wants to coerce '2.3.4-rc', not '2.3.4'
  	    //
  	    // Walk through the string checking with a /g regexp
  	    // Manually set the index so as to pick up overlapping matches.
  	    // Stop when we get a match that ends at the string end, since no
  	    // coercible string can be more right-ward without the same terminus.
  	    const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
  	    let next;
  	    while ((next = coerceRtlRegex.exec(version)) &&
  	        (!match || match.index + match[0].length !== version.length)
  	    ) {
  	      if (!match ||
  	            next.index + next[0].length !== match.index + match[0].length) {
  	        match = next;
  	      }
  	      coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
  	    }
  	    // leave it in a clean state
  	    coerceRtlRegex.lastIndex = -1;
  	  }

  	  if (match === null) {
  	    return null
  	  }

  	  const major = match[2];
  	  const minor = match[3] || '0';
  	  const patch = match[4] || '0';
  	  const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : '';
  	  const build = options.includePrerelease && match[6] ? `+${match[6]}` : '';

  	  return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options)
  	};
  	coerce_1 = coerce;
  	return coerce_1;
  }

  var lrucache;
  var hasRequiredLrucache;

  function requireLrucache () {
  	if (hasRequiredLrucache) return lrucache;
  	hasRequiredLrucache = 1;
  	class LRUCache {
  	  constructor () {
  	    this.max = 1000;
  	    this.map = new Map();
  	  }

  	  get (key) {
  	    const value = this.map.get(key);
  	    if (value === undefined) {
  	      return undefined
  	    } else {
  	      // Remove the key from the map and add it to the end
  	      this.map.delete(key);
  	      this.map.set(key, value);
  	      return value
  	    }
  	  }

  	  delete (key) {
  	    return this.map.delete(key)
  	  }

  	  set (key, value) {
  	    const deleted = this.delete(key);

  	    if (!deleted && value !== undefined) {
  	      // If cache is full, delete the least recently used item
  	      if (this.map.size >= this.max) {
  	        const firstKey = this.map.keys().next().value;
  	        this.delete(firstKey);
  	      }

  	      this.map.set(key, value);
  	    }

  	    return this
  	  }
  	}

  	lrucache = LRUCache;
  	return lrucache;
  }

  var range;
  var hasRequiredRange;

  function requireRange () {
  	if (hasRequiredRange) return range;
  	hasRequiredRange = 1;
  	const SPACE_CHARACTERS = /\s+/g;

  	// hoisted class for cyclic dependency
  	class Range {
  	  constructor (range, options) {
  	    options = parseOptions(options);

  	    if (range instanceof Range) {
  	      if (
  	        range.loose === !!options.loose &&
  	        range.includePrerelease === !!options.includePrerelease
  	      ) {
  	        return range
  	      } else {
  	        return new Range(range.raw, options)
  	      }
  	    }

  	    if (range instanceof Comparator) {
  	      // just put it in the set and return
  	      this.raw = range.value;
  	      this.set = [[range]];
  	      this.formatted = undefined;
  	      return this
  	    }

  	    this.options = options;
  	    this.loose = !!options.loose;
  	    this.includePrerelease = !!options.includePrerelease;

  	    // First reduce all whitespace as much as possible so we do not have to rely
  	    // on potentially slow regexes like \s*. This is then stored and used for
  	    // future error messages as well.
  	    this.raw = range.trim().replace(SPACE_CHARACTERS, ' ');

  	    // First, split on ||
  	    this.set = this.raw
  	      .split('||')
  	      // map the range to a 2d array of comparators
  	      .map(r => this.parseRange(r.trim()))
  	      // throw out any comparator lists that are empty
  	      // this generally means that it was not a valid range, which is allowed
  	      // in loose mode, but will still throw if the WHOLE range is invalid.
  	      .filter(c => c.length);

  	    if (!this.set.length) {
  	      throw new TypeError(`Invalid SemVer Range: ${this.raw}`)
  	    }

  	    // if we have any that are not the null set, throw out null sets.
  	    if (this.set.length > 1) {
  	      // keep the first one, in case they're all null sets
  	      const first = this.set[0];
  	      this.set = this.set.filter(c => !isNullSet(c[0]));
  	      if (this.set.length === 0) {
  	        this.set = [first];
  	      } else if (this.set.length > 1) {
  	        // if we have any that are *, then the range is just *
  	        for (const c of this.set) {
  	          if (c.length === 1 && isAny(c[0])) {
  	            this.set = [c];
  	            break
  	          }
  	        }
  	      }
  	    }

  	    this.formatted = undefined;
  	  }

  	  get range () {
  	    if (this.formatted === undefined) {
  	      this.formatted = '';
  	      for (let i = 0; i < this.set.length; i++) {
  	        if (i > 0) {
  	          this.formatted += '||';
  	        }
  	        const comps = this.set[i];
  	        for (let k = 0; k < comps.length; k++) {
  	          if (k > 0) {
  	            this.formatted += ' ';
  	          }
  	          this.formatted += comps[k].toString().trim();
  	        }
  	      }
  	    }
  	    return this.formatted
  	  }

  	  format () {
  	    return this.range
  	  }

  	  toString () {
  	    return this.range
  	  }

  	  parseRange (range) {
  	    // memoize range parsing for performance.
  	    // this is a very hot path, and fully deterministic.
  	    const memoOpts =
  	      (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) |
  	      (this.options.loose && FLAG_LOOSE);
  	    const memoKey = memoOpts + ':' + range;
  	    const cached = cache.get(memoKey);
  	    if (cached) {
  	      return cached
  	    }

  	    const loose = this.options.loose;
  	    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  	    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
  	    range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
  	    debug('hyphen replace', range);

  	    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  	    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
  	    debug('comparator trim', range);

  	    // `~ 1.2.3` => `~1.2.3`
  	    range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
  	    debug('tilde trim', range);

  	    // `^ 1.2.3` => `^1.2.3`
  	    range = range.replace(re[t.CARETTRIM], caretTrimReplace);
  	    debug('caret trim', range);

  	    // At this point, the range is completely trimmed and
  	    // ready to be split into comparators.

  	    let rangeList = range
  	      .split(' ')
  	      .map(comp => parseComparator(comp, this.options))
  	      .join(' ')
  	      .split(/\s+/)
  	      // >=0.0.0 is equivalent to *
  	      .map(comp => replaceGTE0(comp, this.options));

  	    if (loose) {
  	      // in loose mode, throw out any that are not valid comparators
  	      rangeList = rangeList.filter(comp => {
  	        debug('loose invalid filter', comp, this.options);
  	        return !!comp.match(re[t.COMPARATORLOOSE])
  	      });
  	    }
  	    debug('range list', rangeList);

  	    // if any comparators are the null set, then replace with JUST null set
  	    // if more than one comparator, remove any * comparators
  	    // also, don't include the same comparator more than once
  	    const rangeMap = new Map();
  	    const comparators = rangeList.map(comp => new Comparator(comp, this.options));
  	    for (const comp of comparators) {
  	      if (isNullSet(comp)) {
  	        return [comp]
  	      }
  	      rangeMap.set(comp.value, comp);
  	    }
  	    if (rangeMap.size > 1 && rangeMap.has('')) {
  	      rangeMap.delete('');
  	    }

  	    const result = [...rangeMap.values()];
  	    cache.set(memoKey, result);
  	    return result
  	  }

  	  intersects (range, options) {
  	    if (!(range instanceof Range)) {
  	      throw new TypeError('a Range is required')
  	    }

  	    return this.set.some((thisComparators) => {
  	      return (
  	        isSatisfiable(thisComparators, options) &&
  	        range.set.some((rangeComparators) => {
  	          return (
  	            isSatisfiable(rangeComparators, options) &&
  	            thisComparators.every((thisComparator) => {
  	              return rangeComparators.every((rangeComparator) => {
  	                return thisComparator.intersects(rangeComparator, options)
  	              })
  	            })
  	          )
  	        })
  	      )
  	    })
  	  }

  	  // if ANY of the sets match ALL of its comparators, then pass
  	  test (version) {
  	    if (!version) {
  	      return false
  	    }

  	    if (typeof version === 'string') {
  	      try {
  	        version = new SemVer(version, this.options);
  	      } catch (er) {
  	        return false
  	      }
  	    }

  	    for (let i = 0; i < this.set.length; i++) {
  	      if (testSet(this.set[i], version, this.options)) {
  	        return true
  	      }
  	    }
  	    return false
  	  }
  	}

  	range = Range;

  	const LRU = requireLrucache();
  	const cache = new LRU();

  	const parseOptions = requireParseOptions();
  	const Comparator = requireComparator();
  	const debug = requireDebug();
  	const SemVer = requireSemver$1();
  	const {
  	  safeRe: re,
  	  t,
  	  comparatorTrimReplace,
  	  tildeTrimReplace,
  	  caretTrimReplace,
  	} = requireRe();
  	const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = requireConstants();

  	const isNullSet = c => c.value === '<0.0.0-0';
  	const isAny = c => c.value === '';

  	// take a set of comparators and determine whether there
  	// exists a version which can satisfy it
  	const isSatisfiable = (comparators, options) => {
  	  let result = true;
  	  const remainingComparators = comparators.slice();
  	  let testComparator = remainingComparators.pop();

  	  while (result && remainingComparators.length) {
  	    result = remainingComparators.every((otherComparator) => {
  	      return testComparator.intersects(otherComparator, options)
  	    });

  	    testComparator = remainingComparators.pop();
  	  }

  	  return result
  	};

  	// comprised of xranges, tildes, stars, and gtlt's at this point.
  	// already replaced the hyphen ranges
  	// turn into a set of JUST comparators.
  	const parseComparator = (comp, options) => {
  	  debug('comp', comp, options);
  	  comp = replaceCarets(comp, options);
  	  debug('caret', comp);
  	  comp = replaceTildes(comp, options);
  	  debug('tildes', comp);
  	  comp = replaceXRanges(comp, options);
  	  debug('xrange', comp);
  	  comp = replaceStars(comp, options);
  	  debug('stars', comp);
  	  return comp
  	};

  	const isX = id => !id || id.toLowerCase() === 'x' || id === '*';

  	// ~, ~> --> * (any, kinda silly)
  	// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
  	// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
  	// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
  	// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
  	// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
  	// ~0.0.1 --> >=0.0.1 <0.1.0-0
  	const replaceTildes = (comp, options) => {
  	  return comp
  	    .trim()
  	    .split(/\s+/)
  	    .map((c) => replaceTilde(c, options))
  	    .join(' ')
  	};

  	const replaceTilde = (comp, options) => {
  	  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
  	  return comp.replace(r, (_, M, m, p, pr) => {
  	    debug('tilde', comp, _, M, m, p, pr);
  	    let ret;

  	    if (isX(M)) {
  	      ret = '';
  	    } else if (isX(m)) {
  	      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
  	    } else if (isX(p)) {
  	      // ~1.2 == >=1.2.0 <1.3.0-0
  	      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
  	    } else if (pr) {
  	      debug('replaceTilde pr', pr);
  	      ret = `>=${M}.${m}.${p}-${pr
	      } <${M}.${+m + 1}.0-0`;
  	    } else {
  	      // ~1.2.3 == >=1.2.3 <1.3.0-0
  	      ret = `>=${M}.${m}.${p
	      } <${M}.${+m + 1}.0-0`;
  	    }

  	    debug('tilde return', ret);
  	    return ret
  	  })
  	};

  	// ^ --> * (any, kinda silly)
  	// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
  	// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
  	// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
  	// ^1.2.3 --> >=1.2.3 <2.0.0-0
  	// ^1.2.0 --> >=1.2.0 <2.0.0-0
  	// ^0.0.1 --> >=0.0.1 <0.0.2-0
  	// ^0.1.0 --> >=0.1.0 <0.2.0-0
  	const replaceCarets = (comp, options) => {
  	  return comp
  	    .trim()
  	    .split(/\s+/)
  	    .map((c) => replaceCaret(c, options))
  	    .join(' ')
  	};

  	const replaceCaret = (comp, options) => {
  	  debug('caret', comp, options);
  	  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
  	  const z = options.includePrerelease ? '-0' : '';
  	  return comp.replace(r, (_, M, m, p, pr) => {
  	    debug('caret', comp, _, M, m, p, pr);
  	    let ret;

  	    if (isX(M)) {
  	      ret = '';
  	    } else if (isX(m)) {
  	      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
  	    } else if (isX(p)) {
  	      if (M === '0') {
  	        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
  	      } else {
  	        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
  	      }
  	    } else if (pr) {
  	      debug('replaceCaret pr', pr);
  	      if (M === '0') {
  	        if (m === '0') {
  	          ret = `>=${M}.${m}.${p}-${pr
	          } <${M}.${m}.${+p + 1}-0`;
  	        } else {
  	          ret = `>=${M}.${m}.${p}-${pr
	          } <${M}.${+m + 1}.0-0`;
  	        }
  	      } else {
  	        ret = `>=${M}.${m}.${p}-${pr
	        } <${+M + 1}.0.0-0`;
  	      }
  	    } else {
  	      debug('no pr');
  	      if (M === '0') {
  	        if (m === '0') {
  	          ret = `>=${M}.${m}.${p
	          }${z} <${M}.${m}.${+p + 1}-0`;
  	        } else {
  	          ret = `>=${M}.${m}.${p
	          }${z} <${M}.${+m + 1}.0-0`;
  	        }
  	      } else {
  	        ret = `>=${M}.${m}.${p
	        } <${+M + 1}.0.0-0`;
  	      }
  	    }

  	    debug('caret return', ret);
  	    return ret
  	  })
  	};

  	const replaceXRanges = (comp, options) => {
  	  debug('replaceXRanges', comp, options);
  	  return comp
  	    .split(/\s+/)
  	    .map((c) => replaceXRange(c, options))
  	    .join(' ')
  	};

  	const replaceXRange = (comp, options) => {
  	  comp = comp.trim();
  	  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
  	  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
  	    debug('xRange', comp, ret, gtlt, M, m, p, pr);
  	    const xM = isX(M);
  	    const xm = xM || isX(m);
  	    const xp = xm || isX(p);
  	    const anyX = xp;

  	    if (gtlt === '=' && anyX) {
  	      gtlt = '';
  	    }

  	    // if we're including prereleases in the match, then we need
  	    // to fix this to -0, the lowest possible prerelease value
  	    pr = options.includePrerelease ? '-0' : '';

  	    if (xM) {
  	      if (gtlt === '>' || gtlt === '<') {
  	        // nothing is allowed
  	        ret = '<0.0.0-0';
  	      } else {
  	        // nothing is forbidden
  	        ret = '*';
  	      }
  	    } else if (gtlt && anyX) {
  	      // we know patch is an x, because we have any x at all.
  	      // replace X with 0
  	      if (xm) {
  	        m = 0;
  	      }
  	      p = 0;

  	      if (gtlt === '>') {
  	        // >1 => >=2.0.0
  	        // >1.2 => >=1.3.0
  	        gtlt = '>=';
  	        if (xm) {
  	          M = +M + 1;
  	          m = 0;
  	          p = 0;
  	        } else {
  	          m = +m + 1;
  	          p = 0;
  	        }
  	      } else if (gtlt === '<=') {
  	        // <=0.7.x is actually <0.8.0, since any 0.7.x should
  	        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
  	        gtlt = '<';
  	        if (xm) {
  	          M = +M + 1;
  	        } else {
  	          m = +m + 1;
  	        }
  	      }

  	      if (gtlt === '<') {
  	        pr = '-0';
  	      }

  	      ret = `${gtlt + M}.${m}.${p}${pr}`;
  	    } else if (xm) {
  	      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
  	    } else if (xp) {
  	      ret = `>=${M}.${m}.0${pr
	      } <${M}.${+m + 1}.0-0`;
  	    }

  	    debug('xRange return', ret);

  	    return ret
  	  })
  	};

  	// Because * is AND-ed with everything else in the comparator,
  	// and '' means "any version", just remove the *s entirely.
  	const replaceStars = (comp, options) => {
  	  debug('replaceStars', comp, options);
  	  // Looseness is ignored here.  star is always as loose as it gets!
  	  return comp
  	    .trim()
  	    .replace(re[t.STAR], '')
  	};

  	const replaceGTE0 = (comp, options) => {
  	  debug('replaceGTE0', comp, options);
  	  return comp
  	    .trim()
  	    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
  	};

  	// This function is passed to string.replace(re[t.HYPHENRANGE])
  	// M, m, patch, prerelease, build
  	// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
  	// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
  	// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
  	// TODO build?
  	const hyphenReplace = incPr => ($0,
  	  from, fM, fm, fp, fpr, fb,
  	  to, tM, tm, tp, tpr) => {
  	  if (isX(fM)) {
  	    from = '';
  	  } else if (isX(fm)) {
  	    from = `>=${fM}.0.0${incPr ? '-0' : ''}`;
  	  } else if (isX(fp)) {
  	    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`;
  	  } else if (fpr) {
  	    from = `>=${from}`;
  	  } else {
  	    from = `>=${from}${incPr ? '-0' : ''}`;
  	  }

  	  if (isX(tM)) {
  	    to = '';
  	  } else if (isX(tm)) {
  	    to = `<${+tM + 1}.0.0-0`;
  	  } else if (isX(tp)) {
  	    to = `<${tM}.${+tm + 1}.0-0`;
  	  } else if (tpr) {
  	    to = `<=${tM}.${tm}.${tp}-${tpr}`;
  	  } else if (incPr) {
  	    to = `<${tM}.${tm}.${+tp + 1}-0`;
  	  } else {
  	    to = `<=${to}`;
  	  }

  	  return `${from} ${to}`.trim()
  	};

  	const testSet = (set, version, options) => {
  	  for (let i = 0; i < set.length; i++) {
  	    if (!set[i].test(version)) {
  	      return false
  	    }
  	  }

  	  if (version.prerelease.length && !options.includePrerelease) {
  	    // Find the set of versions that are allowed to have prereleases
  	    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
  	    // That should allow `1.2.3-pr.2` to pass.
  	    // However, `1.2.4-alpha.notready` should NOT be allowed,
  	    // even though it's within the range set by the comparators.
  	    for (let i = 0; i < set.length; i++) {
  	      debug(set[i].semver);
  	      if (set[i].semver === Comparator.ANY) {
  	        continue
  	      }

  	      if (set[i].semver.prerelease.length > 0) {
  	        const allowed = set[i].semver;
  	        if (allowed.major === version.major &&
  	            allowed.minor === version.minor &&
  	            allowed.patch === version.patch) {
  	          return true
  	        }
  	      }
  	    }

  	    // Version has a -pre, but it's not one of the ones we like.
  	    return false
  	  }

  	  return true
  	};
  	return range;
  }

  var comparator;
  var hasRequiredComparator;

  function requireComparator () {
  	if (hasRequiredComparator) return comparator;
  	hasRequiredComparator = 1;
  	const ANY = Symbol('SemVer ANY');
  	// hoisted class for cyclic dependency
  	class Comparator {
  	  static get ANY () {
  	    return ANY
  	  }

  	  constructor (comp, options) {
  	    options = parseOptions(options);

  	    if (comp instanceof Comparator) {
  	      if (comp.loose === !!options.loose) {
  	        return comp
  	      } else {
  	        comp = comp.value;
  	      }
  	    }

  	    comp = comp.trim().split(/\s+/).join(' ');
  	    debug('comparator', comp, options);
  	    this.options = options;
  	    this.loose = !!options.loose;
  	    this.parse(comp);

  	    if (this.semver === ANY) {
  	      this.value = '';
  	    } else {
  	      this.value = this.operator + this.semver.version;
  	    }

  	    debug('comp', this);
  	  }

  	  parse (comp) {
  	    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
  	    const m = comp.match(r);

  	    if (!m) {
  	      throw new TypeError(`Invalid comparator: ${comp}`)
  	    }

  	    this.operator = m[1] !== undefined ? m[1] : '';
  	    if (this.operator === '=') {
  	      this.operator = '';
  	    }

  	    // if it literally is just '>' or '' then allow anything.
  	    if (!m[2]) {
  	      this.semver = ANY;
  	    } else {
  	      this.semver = new SemVer(m[2], this.options.loose);
  	    }
  	  }

  	  toString () {
  	    return this.value
  	  }

  	  test (version) {
  	    debug('Comparator.test', version, this.options.loose);

  	    if (this.semver === ANY || version === ANY) {
  	      return true
  	    }

  	    if (typeof version === 'string') {
  	      try {
  	        version = new SemVer(version, this.options);
  	      } catch (er) {
  	        return false
  	      }
  	    }

  	    return cmp(version, this.operator, this.semver, this.options)
  	  }

  	  intersects (comp, options) {
  	    if (!(comp instanceof Comparator)) {
  	      throw new TypeError('a Comparator is required')
  	    }

  	    if (this.operator === '') {
  	      if (this.value === '') {
  	        return true
  	      }
  	      return new Range(comp.value, options).test(this.value)
  	    } else if (comp.operator === '') {
  	      if (comp.value === '') {
  	        return true
  	      }
  	      return new Range(this.value, options).test(comp.semver)
  	    }

  	    options = parseOptions(options);

  	    // Special cases where nothing can possibly be lower
  	    if (options.includePrerelease &&
  	      (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
  	      return false
  	    }
  	    if (!options.includePrerelease &&
  	      (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
  	      return false
  	    }

  	    // Same direction increasing (> or >=)
  	    if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
  	      return true
  	    }
  	    // Same direction decreasing (< or <=)
  	    if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
  	      return true
  	    }
  	    // same SemVer and both sides are inclusive (<= or >=)
  	    if (
  	      (this.semver.version === comp.semver.version) &&
  	      this.operator.includes('=') && comp.operator.includes('=')) {
  	      return true
  	    }
  	    // opposite directions less than
  	    if (cmp(this.semver, '<', comp.semver, options) &&
  	      this.operator.startsWith('>') && comp.operator.startsWith('<')) {
  	      return true
  	    }
  	    // opposite directions greater than
  	    if (cmp(this.semver, '>', comp.semver, options) &&
  	      this.operator.startsWith('<') && comp.operator.startsWith('>')) {
  	      return true
  	    }
  	    return false
  	  }
  	}

  	comparator = Comparator;

  	const parseOptions = requireParseOptions();
  	const { safeRe: re, t } = requireRe();
  	const cmp = requireCmp();
  	const debug = requireDebug();
  	const SemVer = requireSemver$1();
  	const Range = requireRange();
  	return comparator;
  }

  var satisfies_1;
  var hasRequiredSatisfies;

  function requireSatisfies () {
  	if (hasRequiredSatisfies) return satisfies_1;
  	hasRequiredSatisfies = 1;
  	const Range = requireRange();
  	const satisfies = (version, range, options) => {
  	  try {
  	    range = new Range(range, options);
  	  } catch (er) {
  	    return false
  	  }
  	  return range.test(version)
  	};
  	satisfies_1 = satisfies;
  	return satisfies_1;
  }

  var toComparators_1;
  var hasRequiredToComparators;

  function requireToComparators () {
  	if (hasRequiredToComparators) return toComparators_1;
  	hasRequiredToComparators = 1;
  	const Range = requireRange();

  	// Mostly just for testing and legacy API reasons
  	const toComparators = (range, options) =>
  	  new Range(range, options).set
  	    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '));

  	toComparators_1 = toComparators;
  	return toComparators_1;
  }

  var maxSatisfying_1;
  var hasRequiredMaxSatisfying;

  function requireMaxSatisfying () {
  	if (hasRequiredMaxSatisfying) return maxSatisfying_1;
  	hasRequiredMaxSatisfying = 1;
  	const SemVer = requireSemver$1();
  	const Range = requireRange();

  	const maxSatisfying = (versions, range, options) => {
  	  let max = null;
  	  let maxSV = null;
  	  let rangeObj = null;
  	  try {
  	    rangeObj = new Range(range, options);
  	  } catch (er) {
  	    return null
  	  }
  	  versions.forEach((v) => {
  	    if (rangeObj.test(v)) {
  	      // satisfies(v, range, options)
  	      if (!max || maxSV.compare(v) === -1) {
  	        // compare(max, v, true)
  	        max = v;
  	        maxSV = new SemVer(max, options);
  	      }
  	    }
  	  });
  	  return max
  	};
  	maxSatisfying_1 = maxSatisfying;
  	return maxSatisfying_1;
  }

  var minSatisfying_1;
  var hasRequiredMinSatisfying;

  function requireMinSatisfying () {
  	if (hasRequiredMinSatisfying) return minSatisfying_1;
  	hasRequiredMinSatisfying = 1;
  	const SemVer = requireSemver$1();
  	const Range = requireRange();
  	const minSatisfying = (versions, range, options) => {
  	  let min = null;
  	  let minSV = null;
  	  let rangeObj = null;
  	  try {
  	    rangeObj = new Range(range, options);
  	  } catch (er) {
  	    return null
  	  }
  	  versions.forEach((v) => {
  	    if (rangeObj.test(v)) {
  	      // satisfies(v, range, options)
  	      if (!min || minSV.compare(v) === 1) {
  	        // compare(min, v, true)
  	        min = v;
  	        minSV = new SemVer(min, options);
  	      }
  	    }
  	  });
  	  return min
  	};
  	minSatisfying_1 = minSatisfying;
  	return minSatisfying_1;
  }

  var minVersion_1;
  var hasRequiredMinVersion;

  function requireMinVersion () {
  	if (hasRequiredMinVersion) return minVersion_1;
  	hasRequiredMinVersion = 1;
  	const SemVer = requireSemver$1();
  	const Range = requireRange();
  	const gt = requireGt();

  	const minVersion = (range, loose) => {
  	  range = new Range(range, loose);

  	  let minver = new SemVer('0.0.0');
  	  if (range.test(minver)) {
  	    return minver
  	  }

  	  minver = new SemVer('0.0.0-0');
  	  if (range.test(minver)) {
  	    return minver
  	  }

  	  minver = null;
  	  for (let i = 0; i < range.set.length; ++i) {
  	    const comparators = range.set[i];

  	    let setMin = null;
  	    comparators.forEach((comparator) => {
  	      // Clone to avoid manipulating the comparator's semver object.
  	      const compver = new SemVer(comparator.semver.version);
  	      switch (comparator.operator) {
  	        case '>':
  	          if (compver.prerelease.length === 0) {
  	            compver.patch++;
  	          } else {
  	            compver.prerelease.push(0);
  	          }
  	          compver.raw = compver.format();
  	          /* fallthrough */
  	        case '':
  	        case '>=':
  	          if (!setMin || gt(compver, setMin)) {
  	            setMin = compver;
  	          }
  	          break
  	        case '<':
  	        case '<=':
  	          /* Ignore maximum versions */
  	          break
  	        /* istanbul ignore next */
  	        default:
  	          throw new Error(`Unexpected operation: ${comparator.operator}`)
  	      }
  	    });
  	    if (setMin && (!minver || gt(minver, setMin))) {
  	      minver = setMin;
  	    }
  	  }

  	  if (minver && range.test(minver)) {
  	    return minver
  	  }

  	  return null
  	};
  	minVersion_1 = minVersion;
  	return minVersion_1;
  }

  var valid;
  var hasRequiredValid;

  function requireValid () {
  	if (hasRequiredValid) return valid;
  	hasRequiredValid = 1;
  	const Range = requireRange();
  	const validRange = (range, options) => {
  	  try {
  	    // Return '*' instead of '' so that truthiness works.
  	    // This will throw if it's invalid anyway
  	    return new Range(range, options).range || '*'
  	  } catch (er) {
  	    return null
  	  }
  	};
  	valid = validRange;
  	return valid;
  }

  var outside_1;
  var hasRequiredOutside;

  function requireOutside () {
  	if (hasRequiredOutside) return outside_1;
  	hasRequiredOutside = 1;
  	const SemVer = requireSemver$1();
  	const Comparator = requireComparator();
  	const { ANY } = Comparator;
  	const Range = requireRange();
  	const satisfies = requireSatisfies();
  	const gt = requireGt();
  	const lt = requireLt();
  	const lte = requireLte();
  	const gte = requireGte();

  	const outside = (version, range, hilo, options) => {
  	  version = new SemVer(version, options);
  	  range = new Range(range, options);

  	  let gtfn, ltefn, ltfn, comp, ecomp;
  	  switch (hilo) {
  	    case '>':
  	      gtfn = gt;
  	      ltefn = lte;
  	      ltfn = lt;
  	      comp = '>';
  	      ecomp = '>=';
  	      break
  	    case '<':
  	      gtfn = lt;
  	      ltefn = gte;
  	      ltfn = gt;
  	      comp = '<';
  	      ecomp = '<=';
  	      break
  	    default:
  	      throw new TypeError('Must provide a hilo val of "<" or ">"')
  	  }

  	  // If it satisfies the range it is not outside
  	  if (satisfies(version, range, options)) {
  	    return false
  	  }

  	  // From now on, variable terms are as if we're in "gtr" mode.
  	  // but note that everything is flipped for the "ltr" function.

  	  for (let i = 0; i < range.set.length; ++i) {
  	    const comparators = range.set[i];

  	    let high = null;
  	    let low = null;

  	    comparators.forEach((comparator) => {
  	      if (comparator.semver === ANY) {
  	        comparator = new Comparator('>=0.0.0');
  	      }
  	      high = high || comparator;
  	      low = low || comparator;
  	      if (gtfn(comparator.semver, high.semver, options)) {
  	        high = comparator;
  	      } else if (ltfn(comparator.semver, low.semver, options)) {
  	        low = comparator;
  	      }
  	    });

  	    // If the edge version comparator has a operator then our version
  	    // isn't outside it
  	    if (high.operator === comp || high.operator === ecomp) {
  	      return false
  	    }

  	    // If the lowest version comparator has an operator and our version
  	    // is less than it then it isn't higher than the range
  	    if ((!low.operator || low.operator === comp) &&
  	        ltefn(version, low.semver)) {
  	      return false
  	    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
  	      return false
  	    }
  	  }
  	  return true
  	};

  	outside_1 = outside;
  	return outside_1;
  }

  var gtr_1;
  var hasRequiredGtr;

  function requireGtr () {
  	if (hasRequiredGtr) return gtr_1;
  	hasRequiredGtr = 1;
  	// Determine if version is greater than all the versions possible in the range.
  	const outside = requireOutside();
  	const gtr = (version, range, options) => outside(version, range, '>', options);
  	gtr_1 = gtr;
  	return gtr_1;
  }

  var ltr_1;
  var hasRequiredLtr;

  function requireLtr () {
  	if (hasRequiredLtr) return ltr_1;
  	hasRequiredLtr = 1;
  	const outside = requireOutside();
  	// Determine if version is less than all the versions possible in the range
  	const ltr = (version, range, options) => outside(version, range, '<', options);
  	ltr_1 = ltr;
  	return ltr_1;
  }

  var intersects_1;
  var hasRequiredIntersects;

  function requireIntersects () {
  	if (hasRequiredIntersects) return intersects_1;
  	hasRequiredIntersects = 1;
  	const Range = requireRange();
  	const intersects = (r1, r2, options) => {
  	  r1 = new Range(r1, options);
  	  r2 = new Range(r2, options);
  	  return r1.intersects(r2, options)
  	};
  	intersects_1 = intersects;
  	return intersects_1;
  }

  var simplify;
  var hasRequiredSimplify;

  function requireSimplify () {
  	if (hasRequiredSimplify) return simplify;
  	hasRequiredSimplify = 1;
  	// given a set of versions and a range, create a "simplified" range
  	// that includes the same versions that the original range does
  	// If the original range is shorter than the simplified one, return that.
  	const satisfies = requireSatisfies();
  	const compare = requireCompare();
  	simplify = (versions, range, options) => {
  	  const set = [];
  	  let first = null;
  	  let prev = null;
  	  const v = versions.sort((a, b) => compare(a, b, options));
  	  for (const version of v) {
  	    const included = satisfies(version, range, options);
  	    if (included) {
  	      prev = version;
  	      if (!first) {
  	        first = version;
  	      }
  	    } else {
  	      if (prev) {
  	        set.push([first, prev]);
  	      }
  	      prev = null;
  	      first = null;
  	    }
  	  }
  	  if (first) {
  	    set.push([first, null]);
  	  }

  	  const ranges = [];
  	  for (const [min, max] of set) {
  	    if (min === max) {
  	      ranges.push(min);
  	    } else if (!max && min === v[0]) {
  	      ranges.push('*');
  	    } else if (!max) {
  	      ranges.push(`>=${min}`);
  	    } else if (min === v[0]) {
  	      ranges.push(`<=${max}`);
  	    } else {
  	      ranges.push(`${min} - ${max}`);
  	    }
  	  }
  	  const simplified = ranges.join(' || ');
  	  const original = typeof range.raw === 'string' ? range.raw : String(range);
  	  return simplified.length < original.length ? simplified : range
  	};
  	return simplify;
  }

  var subset_1;
  var hasRequiredSubset;

  function requireSubset () {
  	if (hasRequiredSubset) return subset_1;
  	hasRequiredSubset = 1;
  	const Range = requireRange();
  	const Comparator = requireComparator();
  	const { ANY } = Comparator;
  	const satisfies = requireSatisfies();
  	const compare = requireCompare();

  	// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
  	// - Every simple range `r1, r2, ...` is a null set, OR
  	// - Every simple range `r1, r2, ...` which is not a null set is a subset of
  	//   some `R1, R2, ...`
  	//
  	// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
  	// - If c is only the ANY comparator
  	//   - If C is only the ANY comparator, return true
  	//   - Else if in prerelease mode, return false
  	//   - else replace c with `[>=0.0.0]`
  	// - If C is only the ANY comparator
  	//   - if in prerelease mode, return true
  	//   - else replace C with `[>=0.0.0]`
  	// - Let EQ be the set of = comparators in c
  	// - If EQ is more than one, return true (null set)
  	// - Let GT be the highest > or >= comparator in c
  	// - Let LT be the lowest < or <= comparator in c
  	// - If GT and LT, and GT.semver > LT.semver, return true (null set)
  	// - If any C is a = range, and GT or LT are set, return false
  	// - If EQ
  	//   - If GT, and EQ does not satisfy GT, return true (null set)
  	//   - If LT, and EQ does not satisfy LT, return true (null set)
  	//   - If EQ satisfies every C, return true
  	//   - Else return false
  	// - If GT
  	//   - If GT.semver is lower than any > or >= comp in C, return false
  	//   - If GT is >=, and GT.semver does not satisfy every C, return false
  	//   - If GT.semver has a prerelease, and not in prerelease mode
  	//     - If no C has a prerelease and the GT.semver tuple, return false
  	// - If LT
  	//   - If LT.semver is greater than any < or <= comp in C, return false
  	//   - If LT is <=, and LT.semver does not satisfy every C, return false
  	//   - If GT.semver has a prerelease, and not in prerelease mode
  	//     - If no C has a prerelease and the LT.semver tuple, return false
  	// - Else return true

  	const subset = (sub, dom, options = {}) => {
  	  if (sub === dom) {
  	    return true
  	  }

  	  sub = new Range(sub, options);
  	  dom = new Range(dom, options);
  	  let sawNonNull = false;

  	  OUTER: for (const simpleSub of sub.set) {
  	    for (const simpleDom of dom.set) {
  	      const isSub = simpleSubset(simpleSub, simpleDom, options);
  	      sawNonNull = sawNonNull || isSub !== null;
  	      if (isSub) {
  	        continue OUTER
  	      }
  	    }
  	    // the null set is a subset of everything, but null simple ranges in
  	    // a complex range should be ignored.  so if we saw a non-null range,
  	    // then we know this isn't a subset, but if EVERY simple range was null,
  	    // then it is a subset.
  	    if (sawNonNull) {
  	      return false
  	    }
  	  }
  	  return true
  	};

  	const minimumVersionWithPreRelease = [new Comparator('>=0.0.0-0')];
  	const minimumVersion = [new Comparator('>=0.0.0')];

  	const simpleSubset = (sub, dom, options) => {
  	  if (sub === dom) {
  	    return true
  	  }

  	  if (sub.length === 1 && sub[0].semver === ANY) {
  	    if (dom.length === 1 && dom[0].semver === ANY) {
  	      return true
  	    } else if (options.includePrerelease) {
  	      sub = minimumVersionWithPreRelease;
  	    } else {
  	      sub = minimumVersion;
  	    }
  	  }

  	  if (dom.length === 1 && dom[0].semver === ANY) {
  	    if (options.includePrerelease) {
  	      return true
  	    } else {
  	      dom = minimumVersion;
  	    }
  	  }

  	  const eqSet = new Set();
  	  let gt, lt;
  	  for (const c of sub) {
  	    if (c.operator === '>' || c.operator === '>=') {
  	      gt = higherGT(gt, c, options);
  	    } else if (c.operator === '<' || c.operator === '<=') {
  	      lt = lowerLT(lt, c, options);
  	    } else {
  	      eqSet.add(c.semver);
  	    }
  	  }

  	  if (eqSet.size > 1) {
  	    return null
  	  }

  	  let gtltComp;
  	  if (gt && lt) {
  	    gtltComp = compare(gt.semver, lt.semver, options);
  	    if (gtltComp > 0) {
  	      return null
  	    } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
  	      return null
  	    }
  	  }

  	  // will iterate one or zero times
  	  for (const eq of eqSet) {
  	    if (gt && !satisfies(eq, String(gt), options)) {
  	      return null
  	    }

  	    if (lt && !satisfies(eq, String(lt), options)) {
  	      return null
  	    }

  	    for (const c of dom) {
  	      if (!satisfies(eq, String(c), options)) {
  	        return false
  	      }
  	    }

  	    return true
  	  }

  	  let higher, lower;
  	  let hasDomLT, hasDomGT;
  	  // if the subset has a prerelease, we need a comparator in the superset
  	  // with the same tuple and a prerelease, or it's not a subset
  	  let needDomLTPre = lt &&
  	    !options.includePrerelease &&
  	    lt.semver.prerelease.length ? lt.semver : false;
  	  let needDomGTPre = gt &&
  	    !options.includePrerelease &&
  	    gt.semver.prerelease.length ? gt.semver : false;
  	  // exception: <1.2.3-0 is the same as <1.2.3
  	  if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
  	      lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
  	    needDomLTPre = false;
  	  }

  	  for (const c of dom) {
  	    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>=';
  	    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<=';
  	    if (gt) {
  	      if (needDomGTPre) {
  	        if (c.semver.prerelease && c.semver.prerelease.length &&
  	            c.semver.major === needDomGTPre.major &&
  	            c.semver.minor === needDomGTPre.minor &&
  	            c.semver.patch === needDomGTPre.patch) {
  	          needDomGTPre = false;
  	        }
  	      }
  	      if (c.operator === '>' || c.operator === '>=') {
  	        higher = higherGT(gt, c, options);
  	        if (higher === c && higher !== gt) {
  	          return false
  	        }
  	      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
  	        return false
  	      }
  	    }
  	    if (lt) {
  	      if (needDomLTPre) {
  	        if (c.semver.prerelease && c.semver.prerelease.length &&
  	            c.semver.major === needDomLTPre.major &&
  	            c.semver.minor === needDomLTPre.minor &&
  	            c.semver.patch === needDomLTPre.patch) {
  	          needDomLTPre = false;
  	        }
  	      }
  	      if (c.operator === '<' || c.operator === '<=') {
  	        lower = lowerLT(lt, c, options);
  	        if (lower === c && lower !== lt) {
  	          return false
  	        }
  	      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
  	        return false
  	      }
  	    }
  	    if (!c.operator && (lt || gt) && gtltComp !== 0) {
  	      return false
  	    }
  	  }

  	  // if there was a < or >, and nothing in the dom, then must be false
  	  // UNLESS it was limited by another range in the other direction.
  	  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  	  if (gt && hasDomLT && !lt && gtltComp !== 0) {
  	    return false
  	  }

  	  if (lt && hasDomGT && !gt && gtltComp !== 0) {
  	    return false
  	  }

  	  // we needed a prerelease range in a specific tuple, but didn't get one
  	  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
  	  // because it includes prereleases in the 1.2.3 tuple
  	  if (needDomGTPre || needDomLTPre) {
  	    return false
  	  }

  	  return true
  	};

  	// >=1.2.3 is lower than >1.2.3
  	const higherGT = (a, b, options) => {
  	  if (!a) {
  	    return b
  	  }
  	  const comp = compare(a.semver, b.semver, options);
  	  return comp > 0 ? a
  	    : comp < 0 ? b
  	    : b.operator === '>' && a.operator === '>=' ? b
  	    : a
  	};

  	// <=1.2.3 is higher than <1.2.3
  	const lowerLT = (a, b, options) => {
  	  if (!a) {
  	    return b
  	  }
  	  const comp = compare(a.semver, b.semver, options);
  	  return comp < 0 ? a
  	    : comp > 0 ? b
  	    : b.operator === '<' && a.operator === '<=' ? b
  	    : a
  	};

  	subset_1 = subset;
  	return subset_1;
  }

  var semver;
  var hasRequiredSemver;

  function requireSemver () {
  	if (hasRequiredSemver) return semver;
  	hasRequiredSemver = 1;
  	// just pre-load all the stuff that index.js lazily exports
  	const internalRe = requireRe();
  	const constants = requireConstants();
  	const SemVer = requireSemver$1();
  	const identifiers = requireIdentifiers();
  	const parse = requireParse();
  	const valid = requireValid$1();
  	const clean = requireClean();
  	const inc = requireInc();
  	const diff = requireDiff();
  	const major = requireMajor();
  	const minor = requireMinor();
  	const patch = requirePatch();
  	const prerelease = requirePrerelease();
  	const compare = requireCompare();
  	const rcompare = requireRcompare();
  	const compareLoose = requireCompareLoose();
  	const compareBuild = requireCompareBuild();
  	const sort = requireSort();
  	const rsort = requireRsort();
  	const gt = requireGt();
  	const lt = requireLt();
  	const eq = requireEq();
  	const neq = requireNeq();
  	const gte = requireGte();
  	const lte = requireLte();
  	const cmp = requireCmp();
  	const coerce = requireCoerce();
  	const Comparator = requireComparator();
  	const Range = requireRange();
  	const satisfies = requireSatisfies();
  	const toComparators = requireToComparators();
  	const maxSatisfying = requireMaxSatisfying();
  	const minSatisfying = requireMinSatisfying();
  	const minVersion = requireMinVersion();
  	const validRange = requireValid();
  	const outside = requireOutside();
  	const gtr = requireGtr();
  	const ltr = requireLtr();
  	const intersects = requireIntersects();
  	const simplifyRange = requireSimplify();
  	const subset = requireSubset();
  	semver = {
  	  parse,
  	  valid,
  	  clean,
  	  inc,
  	  diff,
  	  major,
  	  minor,
  	  patch,
  	  prerelease,
  	  compare,
  	  rcompare,
  	  compareLoose,
  	  compareBuild,
  	  sort,
  	  rsort,
  	  gt,
  	  lt,
  	  eq,
  	  neq,
  	  gte,
  	  lte,
  	  cmp,
  	  coerce,
  	  Comparator,
  	  Range,
  	  satisfies,
  	  toComparators,
  	  maxSatisfying,
  	  minSatisfying,
  	  minVersion,
  	  validRange,
  	  outside,
  	  gtr,
  	  ltr,
  	  intersects,
  	  simplifyRange,
  	  subset,
  	  SemVer,
  	  re: internalRe.re,
  	  src: internalRe.src,
  	  tokens: internalRe.t,
  	  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  	  RELEASE_TYPES: constants.RELEASE_TYPES,
  	  compareIdentifiers: identifiers.compareIdentifiers,
  	  rcompareIdentifiers: identifiers.rcompareIdentifiers,
  	};
  	return semver;
  }

  var version = "5.1.0";
  var require$$1 = {
  	version: version};

  var type$3 = "object";
  var properties$3 = {
  	privileges: {
  		type: "array",
  		description: "Defines required privileges for the visual",
  		items: {
  			$ref: "#/definitions/privilege"
  		}
  	},
  	dataRoles: {
  		type: "array",
  		description: "Defines data roles for the visual",
  		items: {
  			$ref: "#/definitions/dataRole"
  		}
  	},
  	dataViewMappings: {
  		type: "array",
  		description: "Defines data mappings for the visual",
  		items: {
  			$ref: "#/definitions/dataViewMapping"
  		}
  	},
  	objects: {
  		$ref: "#/definitions/objects"
  	},
  	tooltips: {
  		$ref: "#/definitions/tooltips"
  	},
  	sorting: {
  		$ref: "#/definitions/sorting"
  	},
  	drilldown: {
  		$ref: "#/definitions/drilldown"
  	},
  	expandCollapse: {
  		$ref: "#/definitions/expandCollapse"
  	},
  	suppressDefaultTitle: {
  		type: "boolean",
  		description: "Indicates whether the visual should show a default title"
  	},
  	supportsKeyboardFocus: {
  		type: "boolean",
  		description: "Allows the visual to receive focus through keyboard navigation"
  	},
  	supportsHighlight: {
  		type: "boolean",
  		description: "Tells the host to include highlight data"
  	},
  	supportsSynchronizingFilterState: {
  		type: "boolean",
  		description: "Indicates whether the visual supports synchronization across report pages (for slicer visuals only)"
  	},
  	advancedEditModeSupport: {
  		type: "number",
  		description: "Indicates the action requested from the host when this visual enters Advanced Edit mode."
  	},
  	supportsLandingPage: {
  		type: "boolean",
  		description: "Indicates whether the visual supports a landing page"
  	},
  	supportsEmptyDataView: {
  		type: "boolean",
  		description: "Indicates whether the visual can receive formatting pane properties when it has no dataroles"
  	},
  	supportsMultiVisualSelection: {
  		type: "boolean",
  		description: "Indicates whether the visual supports multi selection"
  	},
  	subtotals: {
  		description: "Specifies the subtotal customizations applied in the customizeQuery method",
  		$ref: "#/definitions/subtotals"
  	},
  	migration: {
  		$ref: "#/definitions/migration"
  	},
  	keepAllMetadataColumns: {
  		type: "boolean",
  		description: "Indicates that visual is going to receive all metadata columns, no matter what the active projections are"
  	}
  };
  var required$1 = [
  	"privileges"
  ];
  var additionalProperties = false;
  var definitions$2 = {
  	privilege: {
  		type: "object",
  		description: "privilege - Defines the name, essentiality, and optional parameters for a privilege",
  		properties: {
  			name: {
  				type: "string",
  				description: "The internal name of the privilege",
  				"enum": [
  					"WebAccess",
  					"LocalStorage",
  					"ExportContent"
  				]
  			},
  			essential: {
  				type: "boolean",
  				description: "Determines if the privilege is essential for the visual. Default value is false"
  			},
  			parameters: {
  				type: "array",
  				description: "Determines a list of privilege parameters if any",
  				items: {
  					type: "string",
  					description: "The privilege parameter"
  				}
  			}
  		},
  		required: [
  			"name"
  		]
  	},
  	dataRole: {
  		type: "object",
  		description: "dataRole - Defines the name, displayName, and kind of a data role",
  		properties: {
  			name: {
  				type: "string",
  				description: "The internal name for this data role used for all references to this role"
  			},
  			displayName: {
  				type: "string",
  				description: "The name of this data role that is shown to the user"
  			},
  			displayNameKey: {
  				type: "string",
  				description: "The localization key for the displayed name in the stringResourced file"
  			},
  			kind: {
  				description: "The kind of data that can be bound do this role",
  				$ref: "#/definitions/dataRole.kind"
  			},
  			description: {
  				type: "string",
  				description: "A description of this role shown to the user as a tooltip"
  			},
  			descriptionKey: {
  				type: "string",
  				description: "The localization key for the description in the stringResourced file"
  			},
  			preferredTypes: {
  				type: "array",
  				description: "Defines the preferred type of data for this data role",
  				items: {
  					$ref: "#/definitions/valueType"
  				}
  			},
  			requiredTypes: {
  				type: "array",
  				description: "Defines the required type of data for this data role. Any values that do not match will be set to null",
  				items: {
  					$ref: "#/definitions/valueType"
  				}
  			}
  		},
  		required: [
  			"name",
  			"displayName",
  			"kind"
  		],
  		additionalProperties: false
  	},
  	dataViewMapping: {
  		type: "object",
  		description: "dataMapping - Defines how data is mapped to data roles",
  		properties: {
  			conditions: {
  				type: "array",
  				description: "List of conditions that must be met for this data mapping",
  				items: {
  					type: "object",
  					description: "condition - Defines conditions for a data mapping (each key needs to be a valid data role)",
  					patternProperties: {
  						"^[\\w\\s-]+$": {
  							description: "Specifies the number of values that can be assigned to this data role in this mapping",
  							$ref: "#/definitions/dataViewMapping.numberRangeWithKind"
  						}
  					},
  					additionalProperties: false
  				}
  			},
  			single: {
  				$ref: "#/definitions/dataViewMapping.single"
  			},
  			categorical: {
  				$ref: "#/definitions/dataViewMapping.categorical"
  			},
  			table: {
  				$ref: "#/definitions/dataViewMapping.table"
  			},
  			matrix: {
  				$ref: "#/definitions/dataViewMapping.matrix"
  			},
  			scriptResult: {
  				$ref: "#/definitions/dataViewMapping.scriptResult"
  			}
  		},
  		anyOf: [
  			{
  				required: [
  					"single"
  				]
  			},
  			{
  				required: [
  					"categorical"
  				]
  			},
  			{
  				required: [
  					"table"
  				]
  			},
  			{
  				required: [
  					"matrix"
  				]
  			},
  			{
  				required: [
  					"scriptResult"
  				]
  			}
  		],
  		additionalProperties: false
  	},
  	"dataViewMapping.single": {
  		type: "object",
  		description: "single - Defines a single data mapping",
  		properties: {
  			role: {
  				type: "string",
  				description: "The data role to bind to this mapping"
  			}
  		},
  		required: [
  			"role"
  		],
  		additionalProperties: false
  	},
  	"dataViewMapping.categorical": {
  		type: "object",
  		description: "categorical - Defines a categorical data mapping",
  		properties: {
  			categories: {
  				type: "object",
  				description: "Defines data roles to be used as categories",
  				properties: {
  					bind: {
  						$ref: "#/definitions/dataViewMapping.bindTo"
  					},
  					"for": {
  						$ref: "#/definitions/dataViewMapping.forIn"
  					},
  					select: {
  						$ref: "#/definitions/dataViewMapping.select"
  					},
  					dataReductionAlgorithm: {
  						$ref: "#/definitions/dataViewMapping.dataReductionAlgorithm"
  					}
  				},
  				oneOf: [
  					{
  						required: [
  							"for"
  						]
  					},
  					{
  						required: [
  							"bind"
  						]
  					},
  					{
  						required: [
  							"select"
  						]
  					}
  				]
  			},
  			values: {
  				type: "object",
  				description: "Defines data roles to be used as values",
  				properties: {
  					bind: {
  						$ref: "#/definitions/dataViewMapping.bindTo"
  					},
  					"for": {
  						$ref: "#/definitions/dataViewMapping.forIn"
  					},
  					select: {
  						$ref: "#/definitions/dataViewMapping.select"
  					},
  					group: {
  						type: "object",
  						description: "Groups on a a specific data role",
  						properties: {
  							by: {
  								description: "Specifies a data role to use for grouping",
  								type: "string"
  							},
  							select: {
  								$ref: "#/definitions/dataViewMapping.select"
  							},
  							dataReductionAlgorithm: {
  								$ref: "#/definitions/dataViewMapping.dataReductionAlgorithm"
  							}
  						},
  						required: [
  							"by",
  							"select"
  						]
  					}
  				},
  				oneOf: [
  					{
  						required: [
  							"for"
  						]
  					},
  					{
  						required: [
  							"bind"
  						]
  					},
  					{
  						required: [
  							"select"
  						]
  					},
  					{
  						required: [
  							"group"
  						]
  					}
  				]
  			},
  			dataVolume: {
  				$ref: "#/definitions/dataViewMapping.dataVolume"
  			}
  		},
  		additionalProperties: false
  	},
  	"dataViewMapping.table": {
  		type: "object",
  		description: "table - Defines a table data mapping",
  		properties: {
  			rows: {
  				type: "object",
  				description: "Rows to use for the table",
  				properties: {
  					bind: {
  						$ref: "#/definitions/dataViewMapping.bindTo"
  					},
  					"for": {
  						$ref: "#/definitions/dataViewMapping.forIn"
  					},
  					select: {
  						$ref: "#/definitions/dataViewMapping.select"
  					},
  					dataReductionAlgorithm: {
  						$ref: "#/definitions/dataViewMapping.dataReductionAlgorithm"
  					}
  				},
  				oneOf: [
  					{
  						required: [
  							"for"
  						]
  					},
  					{
  						required: [
  							"bind"
  						]
  					},
  					{
  						required: [
  							"select"
  						]
  					}
  				]
  			},
  			rowCount: {
  				type: "object",
  				description: "Specifies a constraint on the number of data rows supported by the visual",
  				properties: {
  					preferred: {
  						description: "Specifies a preferred range of values for the constraint",
  						$ref: "#/definitions/dataViewMapping.numberRange"
  					},
  					supported: {
  						description: "Specifies a supported range of values for the constraint. Defaults to preferred if not specified.",
  						$ref: "#/definitions/dataViewMapping.numberRange"
  					}
  				}
  			},
  			dataVolume: {
  				$ref: "#/definitions/dataViewMapping.dataVolume"
  			}
  		},
  		requires: [
  			"rows"
  		]
  	},
  	"dataViewMapping.matrix": {
  		type: "object",
  		description: "matrix - Defines a matrix data mapping",
  		properties: {
  			rows: {
  				type: "object",
  				description: "Defines the rows used for the matrix",
  				properties: {
  					"for": {
  						$ref: "#/definitions/dataViewMapping.forIn"
  					},
  					select: {
  						$ref: "#/definitions/dataViewMapping.select"
  					},
  					dataReductionAlgorithm: {
  						$ref: "#/definitions/dataViewMapping.dataReductionAlgorithm"
  					}
  				},
  				oneOf: [
  					{
  						required: [
  							"for"
  						]
  					},
  					{
  						required: [
  							"select"
  						]
  					}
  				]
  			},
  			columns: {
  				type: "object",
  				description: "Defines the columns used for the matrix",
  				properties: {
  					"for": {
  						$ref: "#/definitions/dataViewMapping.forIn"
  					},
  					dataReductionAlgorithm: {
  						$ref: "#/definitions/dataViewMapping.dataReductionAlgorithm"
  					}
  				},
  				required: [
  					"for"
  				]
  			},
  			values: {
  				type: "object",
  				description: "Defines the values used for the matrix",
  				properties: {
  					"for": {
  						$ref: "#/definitions/dataViewMapping.forIn"
  					},
  					select: {
  						$ref: "#/definitions/dataViewMapping.select"
  					}
  				},
  				oneOf: [
  					{
  						required: [
  							"for"
  						]
  					},
  					{
  						required: [
  							"select"
  						]
  					}
  				]
  			},
  			dataVolume: {
  				$ref: "#/definitions/dataViewMapping.dataVolume"
  			}
  		}
  	},
  	"dataViewMapping.scriptResult": {
  		type: "object",
  		description: "scriptResult - Defines a scriptResult data mapping",
  		properties: {
  			dataInput: {
  				type: "object",
  				description: "dataInput - Defines how data is mapped to data roles",
  				properties: {
  					table: {
  						$ref: "#/definitions/dataViewMapping.table"
  					}
  				}
  			},
  			script: {
  				type: "object",
  				description: "script - Defines where the script text and provider are stored",
  				properties: {
  					scriptSourceDefault: {
  						type: "string",
  						description: "scriptSourceDefault - Defines the default script source value to be used when no script object is defined"
  					},
  					scriptProviderDefault: {
  						type: "string",
  						description: "scriptProviderDefault - Defines the default script provider value to be used when no provider object is defined"
  					},
  					scriptOutputType: {
  						type: "string",
  						description: "scriptOutputType - Defines the output type that the R script will generate"
  					},
  					source: {
  						$ref: "#/definitions/dataViewObjectPropertyIdentifier"
  					},
  					provider: {
  						$ref: "#/definitions/dataViewObjectPropertyIdentifier"
  					}
  				}
  			}
  		}
  	},
  	dataViewObjectPropertyIdentifier: {
  		type: "object",
  		description: "Points to an object property",
  		properties: {
  			objectName: {
  				type: "string",
  				description: "The name of a object"
  			},
  			propertyName: {
  				type: "string",
  				description: "The name of a property inside the object"
  			}
  		}
  	},
  	"dataViewMapping.bindTo": {
  		type: "object",
  		description: "Binds this data mapping to a single value",
  		properties: {
  			to: {
  				type: "string",
  				description: "The name of a data role to bind to"
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"to"
  		]
  	},
  	"dataViewMapping.numberRange": {
  		type: "object",
  		description: "A number range from min to max",
  		properties: {
  			min: {
  				type: "number",
  				description: "Minimum value supported"
  			},
  			max: {
  				type: "number",
  				description: "Maximum value supported"
  			}
  		}
  	},
  	"dataViewMapping.numberRangeWithKind": {
  		allOf: [
  			{
  				$ref: "#/definitions/dataViewMapping.numberRange"
  			},
  			{
  				properties: {
  					kind: {
  						$ref: "#/definitions/dataRole.kind"
  					}
  				}
  			}
  		]
  	},
  	"dataRole.kind": {
  		type: "string",
  		"enum": [
  			"Grouping",
  			"Measure",
  			"GroupingOrMeasure"
  		]
  	},
  	"dataViewMapping.select": {
  		type: "array",
  		description: "Defines a list of properties to bind",
  		items: {
  			type: "object",
  			properties: {
  				bind: {
  					$ref: "#/definitions/dataViewMapping.bindTo"
  				},
  				"for": {
  					$ref: "#/definitions/dataViewMapping.forIn"
  				}
  			},
  			oneOf: [
  				{
  					required: [
  						"for"
  					]
  				},
  				{
  					required: [
  						"bind"
  					]
  				}
  			]
  		}
  	},
  	"dataViewMapping.dataReductionAlgorithm": {
  		type: "object",
  		description: "Describes how to reduce the amount of data exposed to the visual",
  		properties: {
  			top: {
  				type: "object",
  				description: "Reduce the data to the Top count items",
  				properties: {
  					count: {
  						type: "number"
  					}
  				}
  			},
  			bottom: {
  				type: "object",
  				description: "Reduce the data to the Bottom count items",
  				properties: {
  					count: {
  						type: "number"
  					}
  				}
  			},
  			sample: {
  				type: "object",
  				description: "Reduce the data using a simple Sample of count items",
  				properties: {
  					count: {
  						type: "number"
  					}
  				}
  			},
  			window: {
  				type: "object",
  				description: "Allow the data to be loaded one window, containing count items, at a time",
  				properties: {
  					count: {
  						type: "number"
  					}
  				}
  			}
  		},
  		additionalProperties: false,
  		oneOf: [
  			{
  				required: [
  					"top"
  				]
  			},
  			{
  				required: [
  					"bottom"
  				]
  			},
  			{
  				required: [
  					"sample"
  				]
  			},
  			{
  				required: [
  					"window"
  				]
  			}
  		]
  	},
  	"dataViewMapping.dataVolume": {
  		description: "Specifies the volume of data the query should return (1-6)",
  		type: "number",
  		"enum": [
  			1,
  			2,
  			3,
  			4,
  			5,
  			6
  		]
  	},
  	"dataViewMapping.forIn": {
  		type: "object",
  		description: "Binds this data mapping for all items in a collection",
  		properties: {
  			"in": {
  				type: "string",
  				description: "The name of a data role to iterate over"
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"in"
  		]
  	},
  	objects: {
  		type: "object",
  		description: "A list of unique property groups",
  		patternProperties: {
  			"^[\\w\\s-]+$": {
  				type: "object",
  				description: "Settings for a group of properties",
  				properties: {
  					displayName: {
  						type: "string",
  						description: "The name shown to the user to describe this group of properties"
  					},
  					displayNameKey: {
  						type: "string",
  						description: "The localization key for the displayed name in the stringResourced file"
  					},
  					objectCategory: {
  						type: "number",
  						description: "What aspect of the visual this object controlls (1 = Formatting, 2 = Analytics). Formatting: look & feel, colors, axes, labels etc. Analytics: forcasts, trendlines, reference lines and shapes etc."
  					},
  					description: {
  						type: "string",
  						description: "A description of this object shown to the user as a tooltip"
  					},
  					descriptionKey: {
  						type: "string",
  						description: "The localization key for the description in the stringResourced file"
  					},
  					properties: {
  						type: "object",
  						description: "A list of unique properties contained in this group",
  						patternProperties: {
  							"^[\\w\\s-]+$": {
  								$ref: "#/definitions/object.propertySettings"
  							}
  						},
  						additionalProperties: false
  					}
  				},
  				additionalProperties: false
  			}
  		},
  		additionalProperties: false
  	},
  	tooltips: {
  		type: "object",
  		description: "Instructs the host to include tooltips ability",
  		properties: {
  			supportedTypes: {
  				type: "object",
  				description: "Instructs the host what tooltip types to support",
  				properties: {
  					"default": {
  						type: "boolean",
  						description: "Instructs the host to support showing default tooltips"
  					},
  					canvas: {
  						type: "boolean",
  						description: "Instructs the host to support showing canvas tooltips"
  					}
  				}
  			},
  			roles: {
  				type: "array",
  				items: {
  					type: "string",
  					description: "The name of the data role to bind the tooltips selected info to"
  				}
  			},
  			supportEnhancedTooltips: {
  				type: "boolean",
  				description: "Indicates whether the visual support modern tooltip feature"
  			}
  		}
  	},
  	"object.propertySettings": {
  		type: "object",
  		description: "Settings for a property",
  		properties: {
  			displayName: {
  				type: "string",
  				description: "The name shown to the user to describe this property"
  			},
  			displayNameKey: {
  				type: "string",
  				description: "The localization key for the displayed name in the stringResourced file"
  			},
  			description: {
  				type: "string",
  				description: "A description of this property shown to the user as a tooltip"
  			},
  			descriptionKey: {
  				type: "string",
  				description: "The localization key for the description in the stringResourced file"
  			},
  			placeHolderText: {
  				type: "string",
  				description: "Text to display if the field is empty"
  			},
  			placeHolderTextKey: {
  				type: "string",
  				description: "The localization key for the placeHolderText in the stringResources file"
  			},
  			suppressFormatPainterCopy: {
  				type: "boolean",
  				description: "Indicates whether the Format Painter should ignore this property"
  			},
  			type: {
  				description: "Describes what type of property this is and how it should be displayed to the user",
  				$ref: "#/definitions/valueType"
  			},
  			rule: {
  				type: "object",
  				description: "Describes substitution rule that replaces property object, described inside the rule, to current property object that contains this rule",
  				$ref: "#/definitions/substitutionRule"
  			},
  			filterState: {
  				type: "boolean",
  				description: "Indicates whether the property is a part of filtration information"
  			}
  		},
  		additionalProperties: false
  	},
  	substitutionRule: {
  		type: "object",
  		description: "Describes substitution rule that replaces property object, described inside the rule, to current property object that contains this rule",
  		properties: {
  			inputRole: {
  				type: "string",
  				description: "The name of role. If this role is set, the substitution will be applied"
  			},
  			output: {
  				type: "object",
  				description: "Describes what exactly is necessary to replace",
  				properties: {
  					property: {
  						type: "string",
  						description: "The name of property object that will be replaced"
  					},
  					selector: {
  						type: "array",
  						description: "The array of selector names. Usually, it contains only one selector -- 'Category'",
  						items: {
  							type: "string",
  							description: "The name of selector"
  						}
  					}
  				}
  			}
  		}
  	},
  	sorting: {
  		type: "object",
  		description: "Specifies the default sorting behavior for the visual",
  		properties: {
  			"default": {
  				type: "object",
  				additionalProperties: false
  			},
  			custom: {
  				type: "object",
  				additionalProperties: false
  			},
  			implicit: {
  				type: "object",
  				description: "implicit sort",
  				properties: {
  					clauses: {
  						type: "array",
  						items: {
  							type: "object",
  							properties: {
  								role: {
  									type: "string"
  								},
  								direction: {
  									type: "number",
  									description: "Determines sort direction (1 = Ascending, 2 = Descending)",
  									"enum": [
  										1,
  										2
  									]
  								}
  							},
  							additionalProperties: false
  						}
  					}
  				},
  				additionalProperties: false
  			}
  		},
  		additionalProperties: false,
  		anyOf: [
  			{
  				required: [
  					"default"
  				]
  			},
  			{
  				required: [
  					"custom"
  				]
  			},
  			{
  				required: [
  					"implicit"
  				]
  			}
  		]
  	},
  	drilldown: {
  		type: "object",
  		description: "Defines the visual's drill capability",
  		properties: {
  			roles: {
  				type: "array",
  				description: "The drillable role names for this visual",
  				items: {
  					type: "string",
  					description: "The name of the role"
  				}
  			}
  		}
  	},
  	expandCollapse: {
  		type: "object",
  		description: "Defines the visual's expandCollapse capability",
  		properties: {
  			roles: {
  				type: "array",
  				description: "The expandCollapsed role names for this visual",
  				items: {
  					type: "string",
  					description: "The name of the role"
  				}
  			},
  			addDataViewFlags: {
  				type: "object",
  				description: "The data view flags",
  				defaultValue: {
  					type: "boolean",
  					description: "Indicates if the DataViewTreeNode will contain the isCollapsed flag by default"
  				}
  			},
  			supportsMerge: {
  				type: "boolean",
  				description: "Indicates that the expansion state should be updated when query projections change, instead of being reset."
  			},
  			restoreProjectionsOrderFromBookmark: {
  				type: "boolean",
  				description: "Indicates that the bookmarked expansion state should be restored even if the query projections order no longer matches the expansion state levels."
  			}
  		}
  	},
  	valueType: {
  		type: "object",
  		properties: {
  			bool: {
  				type: "boolean",
  				description: "A boolean value that will be displayed to the user as a toggle switch"
  			},
  			enumeration: {
  				type: "array",
  				description: "A list of values that will be displayed as a drop down list",
  				items: {
  					type: "object",
  					description: "Describes an item in the enumeration list",
  					properties: {
  						displayName: {
  							type: "string",
  							description: "The name shown to the user to describe this item"
  						},
  						displayNameKey: {
  							type: "string",
  							description: "The localization key for the displayed name in the stringResourced file"
  						},
  						value: {
  							type: "string",
  							description: "The internal value of this property when this item is selected"
  						}
  					}
  				}
  			},
  			fill: {
  				type: "object",
  				description: "A color value that will be displayed to the user as a color picker",
  				properties: {
  					solid: {
  						type: "object",
  						description: "A solid color value that will be displayed to the user as a color picker",
  						properties: {
  							color: {
  								oneOf: [
  									{
  										type: "boolean"
  									},
  									{
  										type: "object",
  										properties: {
  											nullable: {
  												description: "Allows the user to select 'no fill' for the color",
  												type: "boolean"
  											}
  										}
  									}
  								]
  							}
  						}
  					}
  				}
  			},
  			fillRule: {
  				type: "object",
  				description: "A color gradient that will be dispalyed to the user as a minimum (,medium) and maximum color pickers",
  				properties: {
  					linearGradient2: {
  						type: "object",
  						description: "Two color gradient",
  						properties: {
  							max: {
  								type: "object",
  								description: "Maximum color for gradient",
  								properties: {
  									color: {
  										type: "string"
  									},
  									value: {
  										type: "number"
  									}
  								}
  							},
  							min: {
  								type: "object",
  								description: "Minimum color for gradient",
  								properties: {
  									color: {
  										type: "string"
  									},
  									value: {
  										type: "number"
  									}
  								}
  							},
  							nullColoringStrategy: {
  								type: "object",
  								description: "Null color strategy"
  							}
  						}
  					},
  					linearGradient3: {
  						type: "object",
  						description: "Three color gradient",
  						properties: {
  							max: {
  								type: "object",
  								description: "Maximum color for gradient",
  								properties: {
  									color: {
  										type: "string"
  									},
  									value: {
  										type: "number"
  									}
  								}
  							},
  							min: {
  								type: "object",
  								description: "Minimum color for gradient",
  								properties: {
  									color: {
  										type: "string"
  									},
  									value: {
  										type: "number"
  									}
  								}
  							},
  							mid: {
  								type: "object",
  								description: "Middle color for gradient",
  								properties: {
  									color: {
  										type: "string"
  									},
  									value: {
  										type: "number"
  									}
  								}
  							},
  							nullColoringStrategy: {
  								type: "object",
  								description: "Null color strategy"
  							}
  						}
  					}
  				}
  			},
  			formatting: {
  				type: "object",
  				description: "A numeric value that will be displayed to the user as a text input",
  				properties: {
  					labelDisplayUnits: {
  						type: "boolean",
  						description: "Displays a dropdown with common display units (Auto, None, Thousands, Millions, Billions, Trillions)"
  					},
  					alignment: {
  						type: "boolean",
  						description: "Displays a selector to allow the user to choose left, center, or right alignment"
  					},
  					fontSize: {
  						type: "boolean",
  						description: "Displays a slider that allows the user to choose a font size in points"
  					},
  					fontFamily: {
  						type: "boolean",
  						description: "Displays a dropdown with font families"
  					},
  					formatString: {
  						type: "boolean",
  						description: "Displays dynamic format string"
  					}
  				},
  				additionalProperties: false,
  				oneOf: [
  					{
  						required: [
  							"labelDisplayUnits"
  						]
  					},
  					{
  						required: [
  							"alignment"
  						]
  					},
  					{
  						required: [
  							"fontSize"
  						]
  					},
  					{
  						required: [
  							"fontFamily"
  						]
  					},
  					{
  						required: [
  							"formatString"
  						]
  					}
  				]
  			},
  			integer: {
  				type: "boolean",
  				description: "An integer (whole number) value that will be displayed to the user as a text input"
  			},
  			numeric: {
  				type: "boolean",
  				description: "A numeric value that will be displayed to the user as a text input"
  			},
  			filter: {
  				oneOf: [
  					{
  						type: "boolean"
  					},
  					{
  						type: "object",
  						properties: {
  							selfFilter: {
  								type: "boolean"
  							}
  						}
  					}
  				],
  				description: "A filter"
  			},
  			operations: {
  				type: "object",
  				description: "A visual operation",
  				properties: {
  					searchEnabled: {
  						type: "boolean",
  						description: "Turns search ability on"
  					}
  				}
  			},
  			text: {
  				type: "boolean",
  				description: "A text value that will be displayed to the user as a text input"
  			},
  			scripting: {
  				type: "object",
  				description: "A text value that will be displayed to the user as a script",
  				properties: {
  					source: {
  						type: "boolean",
  						description: "A source code"
  					}
  				}
  			},
  			geography: {
  				type: "object",
  				description: "Geographical data",
  				properties: {
  					address: {
  						type: "boolean"
  					},
  					city: {
  						type: "boolean"
  					},
  					continent: {
  						type: "boolean"
  					},
  					country: {
  						type: "boolean"
  					},
  					county: {
  						type: "boolean"
  					},
  					region: {
  						type: "boolean"
  					},
  					postalCode: {
  						type: "boolean"
  					},
  					stateOrProvince: {
  						type: "boolean"
  					},
  					place: {
  						type: "boolean"
  					},
  					latitude: {
  						type: "boolean"
  					},
  					longitude: {
  						type: "boolean"
  					}
  				}
  			}
  		},
  		additionalProperties: false,
  		oneOf: [
  			{
  				required: [
  					"bool"
  				]
  			},
  			{
  				required: [
  					"enumeration"
  				]
  			},
  			{
  				required: [
  					"fill"
  				]
  			},
  			{
  				required: [
  					"fillRule"
  				]
  			},
  			{
  				required: [
  					"formatting"
  				]
  			},
  			{
  				required: [
  					"integer"
  				]
  			},
  			{
  				required: [
  					"numeric"
  				]
  			},
  			{
  				required: [
  					"text"
  				]
  			},
  			{
  				required: [
  					"geography"
  				]
  			},
  			{
  				required: [
  					"scripting"
  				]
  			},
  			{
  				required: [
  					"filter"
  				]
  			},
  			{
  				required: [
  					"operations"
  				]
  			}
  		]
  	},
  	subtotals: {
  		type: "object",
  		description: "Specifies the subtotal request customizations applied to the outgoing data query",
  		properties: {
  			matrix: {
  				description: "Defines the subtotal customizations of the outgoing data query of a matrix-dataview visual",
  				$ref: "#/definitions/subtotals.matrix"
  			}
  		},
  		requires: [
  			"matrix"
  		]
  	},
  	"subtotals.matrix": {
  		type: "object",
  		description: "Specifies the subtotal customizations of the outgoing data query of a matrix-dataview visual",
  		properties: {
  			rowSubtotals: {
  				type: "object",
  				description: "Indicates if the subtotal data should be requested for all fields in the rows field well",
  				properties: {
  					propertyIdentifier: {
  						type: "object",
  						properties: {
  							objectName: {
  								type: "string"
  							},
  							propertyName: {
  								type: "string"
  							}
  						}
  					},
  					defaultValue: {
  						type: "boolean"
  					}
  				}
  			},
  			rowSubtotalsPerLevel: {
  				type: "object",
  				description: "Indicates if the subtotal data can be toggled for individual fields in the rows field well",
  				properties: {
  					propertyIdentifier: {
  						type: "object",
  						properties: {
  							objectName: {
  								type: "string"
  							},
  							propertyName: {
  								type: "string"
  							}
  						}
  					},
  					defaultValue: {
  						type: "boolean"
  					}
  				}
  			},
  			columnSubtotals: {
  				type: "object",
  				description: "Indicates if the subtotal data should be requested for all fields in the columns field well",
  				properties: {
  					propertyIdentifier: {
  						type: "object",
  						properties: {
  							objectName: {
  								type: "string"
  							},
  							propertyName: {
  								type: "string"
  							}
  						}
  					},
  					defaultValue: {
  						type: "boolean"
  					}
  				}
  			},
  			columnSubtotalsPerLevel: {
  				type: "object",
  				description: "Indicates if the subtotal data can be toggled for individual fields in the columns field well",
  				properties: {
  					propertyIdentifier: {
  						type: "object",
  						properties: {
  							objectName: {
  								type: "string"
  							},
  							propertyName: {
  								type: "string"
  							}
  						}
  					},
  					defaultValue: {
  						type: "boolean"
  					}
  				}
  			},
  			levelSubtotalEnabled: {
  				type: "object",
  				description: "Unlike all other properites, this property is applied to individual rows/columns. The property indicates if the subtotals are requested for the row/column",
  				properties: {
  					propertyIdentifier: {
  						type: "object",
  						properties: {
  							objectName: {
  								type: "string"
  							},
  							propertyName: {
  								type: "string"
  							}
  						}
  					},
  					defaultValue: {
  						type: "boolean"
  					}
  				}
  			},
  			rowSubtotalsType: {
  				type: "object",
  				description: "Indicates location of row subtotals locations (Top, Bottom). Top means subtotals located at the start of datasource and calculated even before all datasource rows fetched, Bottom means subtotals located at the end of datasource and shown only after all rows are fetched",
  				properties: {
  					propertyIdentifier: {
  						type: "object",
  						properties: {
  							objectName: {
  								type: "string"
  							},
  							propertyName: {
  								type: "string"
  							}
  						}
  					},
  					defaultValue: {
  						type: "string",
  						"enum": [
  							"Top",
  							"Bottom"
  						]
  					}
  				}
  			}
  		},
  		requires: [
  			"matrix"
  		]
  	},
  	migration: {
  		type: "object",
  		description: "Defines the supported APIs for migration",
  		properties: {
  			filter: {
  				$ref: "#/definitions/migration.filter"
  			}
  		}
  	},
  	"migration.filter": {
  		type: "object",
  		description: "Defines the capabilities for migrating the filter API",
  		properties: {
  			shouldUseIdentityFilter: {
  				type: "boolean",
  				description: "Indicates whether the new filter should migrate to an identity filter"
  			}
  		}
  	}
  };
  var require$$2 = {
  	type: type$3,
  	properties: properties$3,
  	required: required$1,
  	additionalProperties: additionalProperties,
  	definitions: definitions$2
  };

  var type$2 = "object";
  var properties$2 = {
  	apiVersion: {
  		type: "string",
  		description: "Version of the IVisual API"
  	},
  	author: {
  		type: "object",
  		description: "Information about the author of the visual",
  		properties: {
  			name: {
  				type: "string",
  				description: "Name of the visual author. This is displayed to users."
  			},
  			email: {
  				type: "string",
  				description: "E-mail of the visual author. This is displayed to users for support."
  			}
  		}
  	},
  	assets: {
  		type: "object",
  		description: "Assets used by the visual",
  		properties: {
  			icon: {
  				type: "string",
  				description: "A 20x20 png icon used to represent the visual"
  			}
  		}
  	},
  	externalJS: {
  		type: "array",
  		description: "An array of relative paths to 3rd party javascript libraries to load",
  		items: {
  			type: "string"
  		}
  	},
  	stringResources: {
  		type: "array",
  		description: "An array of relative paths to string resources to load",
  		items: {
  			type: "string"
  		},
  		uniqueItems: true
  	},
  	style: {
  		type: "string",
  		description: "Relative path to the stylesheet (less) for the visual"
  	},
  	capabilities: {
  		type: "string",
  		description: "Relative path to the visual capabilities json file"
  	},
  	visual: {
  		type: "object",
  		description: "Details about this visual",
  		properties: {
  			description: {
  				type: "string",
  				description: "What does this visual do?"
  			},
  			name: {
  				type: "string",
  				description: "Internal visual name"
  			},
  			displayName: {
  				type: "string",
  				description: "A friendly name"
  			},
  			externals: {
  				type: "array",
  				description: "External files (such as JavaScript) that you would like to include"
  			},
  			guid: {
  				type: "string",
  				description: "Unique identifier for the visual"
  			},
  			visualClassName: {
  				type: "string",
  				description: "Class of your IVisual"
  			},
  			icon: {
  				type: "string",
  				description: "Icon path"
  			},
  			version: {
  				type: "string",
  				description: "Visual version"
  			},
  			gitHubUrl: {
  				type: "string",
  				description: "Url to the github repository for this visual"
  			},
  			supportUrl: {
  				type: "string",
  				description: "Url to the support page for this visual"
  			}
  		}
  	}
  };
  var require$$3 = {
  	type: type$2,
  	properties: properties$2
  };

  var type$1 = "object";
  var properties$1 = {
  	cranPackages: {
  		type: "array",
  		description: "An array of the Cran packages required for the custom R visual script to operate",
  		items: {
  			$ref: "#/definitions/cranPackage"
  		}
  	}
  };
  var definitions$1 = {
  	cranPackage: {
  		type: "object",
  		description: "cranPackage - Defines the name and displayName of a required Cran package",
  		properties: {
  			name: {
  				type: "string",
  				description: "The name for this Cran package"
  			},
  			displayName: {
  				type: "string",
  				description: "The name for this Cran package that is shown to the user"
  			},
  			url: {
  				type: "string",
  				description: "A url for package documentation in Cran website"
  			}
  		},
  		required: [
  			"name",
  			"url"
  		],
  		additionalProperties: false
  	}
  };
  var require$$4 = {
  	type: type$1,
  	properties: properties$1,
  	definitions: definitions$1
  };

  var type = "object";
  var properties = {
  	locale: {
  		$ref: "#/definitions/localeOptions"
  	},
  	values: {
  		type: "object",
  		description: "translations for the display name keys in the capabilities",
  		additionalProperties: {
  			type: "string"
  		}
  	}
  };
  var required = [
  	"locale"
  ];
  var definitions = {
  	localeOptions: {
  		description: "Specifies the locale key from a list of supported locales",
  		type: "string",
  		"enum": [
  			"ar-SA",
  			"bg-BG",
  			"ca-ES",
  			"cs-CZ",
  			"da-DK",
  			"de-DE",
  			"el-GR",
  			"en-US",
  			"es-ES",
  			"et-EE",
  			"eu-ES",
  			"fi-FI",
  			"fr-FR",
  			"gl-ES",
  			"he-IL",
  			"hi-IN",
  			"hr-HR",
  			"hu-HU",
  			"id-ID",
  			"it-IT",
  			"ja-JP",
  			"kk-KZ",
  			"ko-KR",
  			"lt-LT",
  			"lv-LV",
  			"ms-MY",
  			"nb-NO",
  			"nl-NL",
  			"pl-PL",
  			"pt-BR",
  			"pt-PT",
  			"ro-RO",
  			"ru-RU",
  			"sk-SK",
  			"sl-SI",
  			"sr-Cyrl-RS",
  			"sr-Latn-RS",
  			"sv-SE",
  			"th-TH",
  			"tr-TR",
  			"uk-UA",
  			"vi-VN",
  			"zh-CN",
  			"zh-TW"
  		]
  	}
  };
  var require$$5 = {
  	type: type,
  	properties: properties,
  	required: required,
  	definitions: definitions
  };

  var hasRequiredPowerbiVisualsApi;

  function requirePowerbiVisualsApi () {
  	if (hasRequiredPowerbiVisualsApi) return powerbiVisualsApi;
  	hasRequiredPowerbiVisualsApi = 1;
  	const semver = requireSemver();

  	let packageVersion = require$$1.version;
  	let apiVersion = `${semver.major(packageVersion)}.${semver.minor(packageVersion)}.0`;

  	powerbiVisualsApi.version = apiVersion;

  	powerbiVisualsApi.schemas = {
  	    capabilities: require$$2,
  	    pbiviz: require$$3,
  	    dependencies: require$$4,
  	    stringResources: require$$5
  	};
  	return powerbiVisualsApi;
  }

  requirePowerbiVisualsApi();

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
          var _a, _b, _c;
          this.validationStatus
              = JSON.parse(JSON.stringify({ status: 0, messages: new Array(), error: "" }));
          const allSettingGroups = Object.keys(this.settings);
          const is_grouped = (_c = (_b = (_a = inputView === null || inputView === void 0 ? void 0 : inputView.categorical) === null || _a === void 0 ? void 0 : _a.categories) === null || _b === void 0 ? void 0 : _b.some(d => d.source.roles.indicator)) !== null && _c !== void 0 ? _c : false;
          this.settingsGrouped = new Array();
          if (is_grouped) {
              groupIdxs.forEach(() => {
                  this.settingsGrouped.push(Object.fromEntries(Object.keys(defaultSettings).map((settingGroupName) => {
                      return [settingGroupName, Object.fromEntries(Object.keys(defaultSettings[settingGroupName]).map((settingName) => {
                              return [settingName, defaultSettings[settingGroupName][settingName]];
                          }))];
                  })));
              });
          }
          const all_idxs = groupIdxs.flat();
          allSettingGroups.forEach((settingGroup) => {
              const condFormatting = extractConditionalFormatting(inputView === null || inputView === void 0 ? void 0 : inputView.categorical, settingGroup, this.settings, all_idxs);
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
              const settingNames = Object.keys(this.settings[settingGroup]);
              settingNames.forEach((settingName) => {
                  this.settings[settingGroup][settingName]
                      = (condFormatting === null || condFormatting === void 0 ? void 0 : condFormatting.values)
                          ? condFormatting === null || condFormatting === void 0 ? void 0 : condFormatting.values[0][settingName]
                          : defaultSettings[settingGroup][settingName]["default"];
                  if (is_grouped) {
                      groupIdxs.forEach((idx, idx_idx) => {
                          this.settingsGrouped[idx_idx][settingGroup][settingName]
                              = (condFormatting === null || condFormatting === void 0 ? void 0 : condFormatting.values)
                                  ? condFormatting === null || condFormatting === void 0 ? void 0 : condFormatting.values[idx[0]][settingName]
                                  : defaultSettings[settingGroup][settingName]["default"];
                      });
                  }
              });
          });
          if (this.settings.nhs_icons.show_variation_icons) {
              const patterns = ["astronomical", "shift", "trend", "two_in_three"];
              const anyOutlierPatterns = patterns.some(d => this.settings.outliers[d]);
              if (!anyOutlierPatterns) {
                  this.validationStatus.status = 1;
                  this.validationStatus.error = "Variation icons require at least one outlier pattern to be selected";
              }
          }
          this.derivedSettings.update(this.settings.spc);
          this.derivedSettingsGrouped = new Array();
          if (is_grouped) {
              this.settingsGrouped.forEach((d) => {
                  const newDerived = new derivedSettingsClass();
                  newDerived.update(d.spc);
                  this.derivedSettingsGrouped.push(newDerived);
              });
          }
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
                                      instanceKind: (typeof this.settings[curr_card_name][setting]) != "boolean" ? 3 : null
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
              return { value: this.settings[settingCardName][settingName] };
          }
          if (!isNullOrUndefined((_a = settingsModel[settingCardName].settingsGroups[settingGroupName][settingName]) === null || _a === void 0 ? void 0 : _a.items)) {
              const allItems = settingsModel[settingCardName].settingsGroups[settingGroupName][settingName].items;
              const currValue = this.settings[settingCardName][settingName];
              return allItems.find(item => item.value === currValue);
          }
          return this.settings[settingCardName][settingName];
      }
      constructor() {
          this.settings = Object.fromEntries(Object.keys(defaultSettings).map((settingGroupName) => {
              return [settingGroupName, Object.fromEntries(Object.keys(defaultSettings[settingGroupName]).map((settingName) => {
                      return [settingName, defaultSettings[settingGroupName][settingName]];
                  }))];
          }));
          this.derivedSettings = new derivedSettingsClass();
      }
  }

  function cLimits(args) {
      const cl = mean(extractValues(args.numerators, args.subset_points));
      const sigma = Math.sqrt(cl);
      return {
          keys: args.keys,
          values: args.numerators,
          targets: rep(cl, args.keys.length),
          ll99: rep(truncate(cl - 3 * sigma, { lower: 0 }), args.keys.length),
          ll95: rep(truncate(cl - 2 * sigma, { lower: 0 }), args.keys.length),
          ll68: rep(truncate(cl - 1 * sigma, { lower: 0 }), args.keys.length),
          ul68: rep(cl + 1 * sigma, args.keys.length),
          ul95: rep(cl + 2 * sigma, args.keys.length),
          ul99: rep(cl + 3 * sigma, args.keys.length),
      };
  }

  function gLimits(args) {
      const cl = mean(extractValues(args.numerators, args.subset_points));
      const sigma = sqrt(cl * (cl + 1));
      return {
          keys: args.keys,
          values: args.numerators,
          targets: rep(median(extractValues(args.numerators, args.subset_points)), args.keys.length),
          ll99: rep(0, args.keys.length),
          ll95: rep(0, args.keys.length),
          ll68: rep(0, args.keys.length),
          ul68: rep(cl + 1 * sigma, args.keys.length),
          ul95: rep(cl + 2 * sigma, args.keys.length),
          ul99: rep(cl + 3 * sigma, args.keys.length)
      };
  }

  function iLimits(args) {
      const useRatio = (args.denominators && args.denominators.length > 0);
      const ratio = useRatio
          ? divide(args.numerators, args.denominators)
          : args.numerators;
      const ratio_subset = extractValues(ratio, args.subset_points);
      const cl = mean(ratio_subset);
      const consec_diff = abs(diff(ratio_subset));
      const consec_diff_ulim = mean(consec_diff) * 3.267;
      const outliers_in_limits = args.outliers_in_limits;
      const consec_diff_valid = outliers_in_limits ? consec_diff : consec_diff.filter(d => d < consec_diff_ulim);
      const sigma = mean(consec_diff_valid) / 1.128;
      return {
          keys: args.keys,
          values: ratio.map(d => isNaN(d) ? 0 : d),
          numerators: useRatio ? args.numerators : undefined,
          denominators: useRatio ? args.denominators : undefined,
          targets: rep(cl, args.keys.length),
          ll99: rep(cl - 3 * sigma, args.keys.length),
          ll95: rep(cl - 2 * sigma, args.keys.length),
          ll68: rep(cl - 1 * sigma, args.keys.length),
          ul68: rep(cl + 1 * sigma, args.keys.length),
          ul95: rep(cl + 2 * sigma, args.keys.length),
          ul99: rep(cl + 3 * sigma, args.keys.length)
      };
  }

  function imLimits$1(args) {
      const useRatio = (args.denominators && args.denominators.length > 0);
      const ratio = useRatio
          ? divide(args.numerators, args.denominators)
          : args.numerators;
      const ratio_subset = extractValues(ratio, args.subset_points);
      const cl = median(ratio_subset);
      const consec_diff = abs(diff(ratio_subset));
      const consec_diff_ulim = mean(consec_diff) * 3.267;
      const outliers_in_limits = args.outliers_in_limits;
      const consec_diff_valid = outliers_in_limits ? consec_diff : consec_diff.filter(d => d < consec_diff_ulim);
      const sigma = mean(consec_diff_valid) / 1.128;
      return {
          keys: args.keys,
          values: ratio.map(d => isNaN(d) ? 0 : d),
          numerators: useRatio ? args.numerators : undefined,
          denominators: useRatio ? args.denominators : undefined,
          targets: rep(cl, args.keys.length),
          ll99: rep(cl - 3 * sigma, args.keys.length),
          ll95: rep(cl - 2 * sigma, args.keys.length),
          ll68: rep(cl - 1 * sigma, args.keys.length),
          ul68: rep(cl + 1 * sigma, args.keys.length),
          ul95: rep(cl + 2 * sigma, args.keys.length),
          ul99: rep(cl + 3 * sigma, args.keys.length)
      };
  }

  function imLimits(args) {
      const useRatio = (args.denominators && args.denominators.length > 0);
      const ratio = useRatio
          ? divide(args.numerators, args.denominators)
          : args.numerators;
      const ratio_subset = extractValues(ratio, args.subset_points);
      const cl = median(ratio_subset);
      const consec_diff = abs(diff(ratio_subset));
      const consec_diff_ulim = median(consec_diff) * 3.267;
      const outliers_in_limits = args.outliers_in_limits;
      const consec_diff_valid = outliers_in_limits ? consec_diff : consec_diff.filter(d => d < consec_diff_ulim);
      const sigma = median(consec_diff_valid) / 1.128;
      return {
          keys: args.keys,
          values: ratio.map(d => isNaN(d) ? 0 : d),
          numerators: useRatio ? args.numerators : undefined,
          denominators: useRatio ? args.denominators : undefined,
          targets: rep(cl, args.keys.length),
          ll99: rep(cl - 3 * sigma, args.keys.length),
          ll95: rep(cl - 2 * sigma, args.keys.length),
          ll68: rep(cl - 1 * sigma, args.keys.length),
          ul68: rep(cl + 1 * sigma, args.keys.length),
          ul95: rep(cl + 2 * sigma, args.keys.length),
          ul99: rep(cl + 3 * sigma, args.keys.length)
      };
  }

  function mrLimits(args) {
      const useRatio = (args.denominators && args.denominators.length > 0);
      const ratio = useRatio
          ? divide(args.numerators, args.denominators)
          : args.numerators;
      const consec_diff = abs(diff(ratio));
      const cl = mean(extractValues(consec_diff, args.subset_points));
      return {
          keys: args.keys.slice(1),
          values: consec_diff.slice(1),
          numerators: useRatio ? args.numerators.slice(1) : undefined,
          denominators: useRatio ? args.denominators.slice(1) : undefined,
          targets: rep(cl, args.keys.length - 1),
          ll99: rep(0, args.keys.length - 1),
          ll95: rep(0, args.keys.length - 1),
          ll68: rep(0, args.keys.length - 1),
          ul68: rep((3.267 / 3) * 1 * cl, args.keys.length - 1),
          ul95: rep((3.267 / 3) * 2 * cl, args.keys.length - 1),
          ul99: rep(3.267 * cl, args.keys.length - 1)
      };
  }

  function pLimits(args) {
      const cl = sum(extractValues(args.numerators, args.subset_points))
          / sum(extractValues(args.denominators, args.subset_points));
      const sigma = sqrt(divide(cl * (1 - cl), args.denominators));
      return {
          keys: args.keys,
          values: divide(args.numerators, args.denominators),
          numerators: args.numerators,
          denominators: args.denominators,
          targets: rep(cl, args.keys.length),
          ll99: truncate(subtract(cl, multiply(3, sigma)), { lower: 0 }),
          ll95: truncate(subtract(cl, multiply(2, sigma)), { lower: 0 }),
          ll68: truncate(subtract(cl, multiply(1, sigma)), { lower: 0 }),
          ul68: truncate(add(cl, multiply(1, sigma)), { upper: 1 }),
          ul95: truncate(add(cl, multiply(2, sigma)), { upper: 1 }),
          ul99: truncate(add(cl, multiply(3, sigma)), { upper: 1 })
      };
  }

  function pprimeLimits(args) {
      const val = divide(args.numerators, args.denominators);
      const cl = sum(extractValues(args.numerators, args.subset_points))
          / sum(extractValues(args.denominators, args.subset_points));
      const sd = sqrt(divide(cl * (1 - cl), args.denominators));
      const zscore = extractValues(divide(subtract(val, cl), sd), args.subset_points);
      const consec_diff = abs(diff(zscore));
      const consec_diff_ulim = mean(consec_diff) * 3.267;
      const outliers_in_limits = args.outliers_in_limits;
      const consec_diff_valid = outliers_in_limits ? consec_diff : consec_diff.filter(d => d < consec_diff_ulim);
      const sigma = multiply(sd, mean(consec_diff_valid) / 1.128);
      return {
          keys: args.keys,
          values: val,
          numerators: args.numerators,
          denominators: args.denominators,
          targets: rep(cl, args.keys.length),
          ll99: truncate(subtract(cl, multiply(3, sigma)), { lower: 0 }),
          ll95: truncate(subtract(cl, multiply(2, sigma)), { lower: 0 }),
          ll68: truncate(subtract(cl, multiply(1, sigma)), { lower: 0 }),
          ul68: truncate(add(cl, multiply(1, sigma)), { upper: 1 }),
          ul95: truncate(add(cl, multiply(2, sigma)), { upper: 1 }),
          ul99: truncate(add(cl, multiply(3, sigma)), { upper: 1 })
      };
  }

  function runLimits(args) {
      const useRatio = (args.denominators && args.denominators.length > 0);
      const ratio = useRatio
          ? divide(args.numerators, args.denominators)
          : args.numerators;
      const cl = median(extractValues(ratio, args.subset_points));
      return {
          keys: args.keys,
          values: ratio.map(d => isNaN(d) ? 0 : d),
          numerators: useRatio ? args.numerators : undefined,
          denominators: useRatio ? args.denominators : undefined,
          targets: rep(cl, args.keys.length)
      };
  }

  function sLimits(args) {
      const group_sd = args.numerators;
      const count_per_group = args.denominators;
      const Nm1 = subtract(extractValues(count_per_group, args.subset_points), 1);
      const cl = sqrt(sum(multiply(Nm1, pow(extractValues(group_sd, args.subset_points), 2))) / sum(Nm1));
      return {
          keys: args.keys,
          values: group_sd,
          targets: rep(cl, args.keys.length),
          ll99: multiply(cl, b3(count_per_group, 3)),
          ll95: multiply(cl, b3(count_per_group, 2)),
          ll68: multiply(cl, b3(count_per_group, 1)),
          ul68: multiply(cl, b4(count_per_group, 1)),
          ul95: multiply(cl, b4(count_per_group, 2)),
          ul99: multiply(cl, b4(count_per_group, 3))
      };
  }

  function tLimits(args) {
      const val = pow(args.numerators, 1 / 3.6);
      const inputArgsCopy = JSON.parse(JSON.stringify(args));
      inputArgsCopy.numerators = val;
      inputArgsCopy.denominators = null;
      const limits = iLimits(inputArgsCopy);
      limits.targets = pow(limits.targets, 3.6);
      limits.values = pow(limits.values, 3.6);
      limits.ll99 = truncate(pow(limits.ll99, 3.6), { lower: 0 });
      limits.ll95 = truncate(pow(limits.ll95, 3.6), { lower: 0 });
      limits.ll68 = truncate(pow(limits.ll68, 3.6), { lower: 0 });
      limits.ul68 = pow(limits.ul68, 3.6);
      limits.ul95 = pow(limits.ul95, 3.6);
      limits.ul99 = pow(limits.ul99, 3.6);
      return limits;
  }

  function uLimits(args) {
      const cl = sum(extractValues(args.numerators, args.subset_points))
          / sum(extractValues(args.denominators, args.subset_points));
      const sigma = sqrt(divide(cl, args.denominators));
      return {
          keys: args.keys,
          values: divide(args.numerators, args.denominators),
          numerators: args.numerators,
          denominators: args.denominators,
          targets: rep(cl, args.keys.length),
          ll99: truncate(subtract(cl, multiply(3, sigma)), { lower: 0 }),
          ll95: truncate(subtract(cl, multiply(2, sigma)), { lower: 0 }),
          ll68: truncate(subtract(cl, multiply(1, sigma)), { lower: 0 }),
          ul68: add(cl, multiply(1, sigma)),
          ul95: add(cl, multiply(2, sigma)),
          ul99: add(cl, multiply(3, sigma))
      };
  }

  function uprimeLimits(args) {
      const val = divide(args.numerators, args.denominators);
      const cl = sum(extractValues(args.numerators, args.subset_points))
          / sum(extractValues(args.denominators, args.subset_points));
      const sd = sqrt(divide(cl, args.denominators));
      const zscore = extractValues(divide(subtract(val, cl), sd), args.subset_points);
      const consec_diff = abs(diff(zscore));
      const consec_diff_ulim = mean(consec_diff) * 3.267;
      const outliers_in_limits = args.outliers_in_limits;
      const consec_diff_valid = outliers_in_limits ? consec_diff : consec_diff.filter(d => d < consec_diff_ulim);
      const sigma = multiply(sd, mean(consec_diff_valid) / 1.128);
      return {
          keys: args.keys,
          values: val,
          numerators: args.numerators,
          denominators: args.denominators,
          targets: rep(cl, args.keys.length),
          ll99: truncate(subtract(cl, multiply(3, sigma)), { lower: 0 }),
          ll95: truncate(subtract(cl, multiply(2, sigma)), { lower: 0 }),
          ll68: truncate(subtract(cl, multiply(1, sigma)), { lower: 0 }),
          ul68: add(cl, multiply(1, sigma)),
          ul95: add(cl, multiply(2, sigma)),
          ul99: add(cl, multiply(3, sigma))
      };
  }

  function xbarLimits(args) {
      const count_per_group = args.denominators;
      const count_per_group_sub = extractValues(count_per_group, args.subset_points);
      const group_means = args.numerators;
      const group_means_sub = extractValues(group_means, args.subset_points);
      const group_sd = args.xbar_sds;
      const group_sd_sub = extractValues(group_sd, args.subset_points);
      const Nm1 = subtract(count_per_group_sub, 1);
      const sd = sqrt(sum(multiply(Nm1, square(group_sd_sub))) / sum(Nm1));
      const cl = sum(multiply(count_per_group_sub, group_means_sub)) / sum(count_per_group_sub);
      const A3 = a3(count_per_group);
      return {
          keys: args.keys,
          values: group_means,
          targets: rep(cl, args.keys.length),
          ll99: subtract(cl, multiply(A3, sd)),
          ll95: subtract(cl, multiply(multiply(divide(A3, 3), 2), sd)),
          ll68: subtract(cl, multiply(divide(A3, 3), sd)),
          ul68: add(cl, multiply(divide(A3, 3), sd)),
          ul95: add(cl, multiply(multiply(divide(A3, 3), 2), sd)),
          ul99: add(cl, multiply(A3, sd)),
          count: count_per_group
      };
  }

  var limitFunctions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    c: cLimits,
    g: gLimits,
    i: iLimits,
    i_m: imLimits$1,
    i_mm: imLimits,
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

  function shift(val, targets, n) {
      const lagged_sign = val.map((d, i) => {
          return Math.sign(d - targets[i]);
      });
      const lagged_sign_sum = lagged_sign.map((_, i) => {
          return sum(lagged_sign.slice(Math.max(0, i - (n - 1)), i + 1));
      });
      const shift_detected = lagged_sign_sum.map(d => {
          if (abs(d) >= n) {
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

  function trend(val, n) {
      const lagged_sign = val.map((d, i) => {
          return (i == 0) ? i : Math.sign(d - val[i - 1]);
      });
      const lagged_sign_sum = lagged_sign.map((_, i) => {
          return sum(lagged_sign.slice(Math.max(0, i - (n - 2)), i + 1));
      });
      const trend_detected = lagged_sign_sum.map(d => {
          if (abs(d) >= (n - 1)) {
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
          if (abs(d) >= 2) {
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

  class viewModelClass {
      constructor() {
          this.inputData = null;
          this.inputSettings = new settingsClass();
          this.controlLimits = null;
          this.plotPoints = new Array();
          this.groupedLines = new Array();
          this.firstRun = true;
          this.splitIndexes = new Array();
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
              if (options.dataViews[0].categorical.categories.some(d => d.source.roles.indicator)) {
                  this.showGrouped = true;
                  this.inputDataGrouped = new Array();
                  this.groupStartEndIndexesGrouped = new Array();
                  this.controlLimitsGrouped = new Array();
                  this.outliersGrouped = new Array();
                  this.identitiesGrouped = new Array();
                  idx_per_indicator.forEach((group_idxs, idx) => {
                      const inpData = extractInputData(options.dataViews[0].categorical, this.inputSettings.settingsGrouped[idx], this.inputSettings.derivedSettingsGrouped[idx], this.inputSettings.validationStatus.messages, group_idxs);
                      const invalidData = inpData.validationStatus.status !== 0;
                      const groupStartEndIndexes = invalidData ? new Array() : this.getGroupingIndexes(inpData);
                      const limits = invalidData ? null : this.calculateLimits(inpData, groupStartEndIndexes, this.inputSettings.settingsGrouped[idx]);
                      const outliers = invalidData ? null : this.flagOutliers(limits, groupStartEndIndexes, this.inputSettings.settingsGrouped[idx], this.inputSettings.derivedSettingsGrouped[idx]);
                      if (!invalidData) {
                          this.scaleAndTruncateLimits(limits, this.inputSettings.settingsGrouped[idx], this.inputSettings.derivedSettingsGrouped[idx]);
                      }
                      const identities = group_idxs.map(i => {
                          return host.createSelectionIdBuilder().withCategory(options.dataViews[0].categorical.categories[0], i).createSelectionId();
                      });
                      this.identitiesGrouped.push(identities);
                      this.inputDataGrouped.push(inpData);
                      this.groupStartEndIndexesGrouped.push(groupStartEndIndexes);
                      this.controlLimitsGrouped.push(limits);
                      this.outliersGrouped.push(outliers);
                  });
                  this.initialisePlotDataGrouped();
              }
              else {
                  this.showGrouped = false;
                  this.groupNames = null;
                  this.inputDataGrouped = null;
                  this.groupStartEndIndexesGrouped = null;
                  this.controlLimitsGrouped = null;
                  const split_indexes_str = (_u = ((_t = (_s = (_r = (_q = options.dataViews[0]) === null || _q === void 0 ? void 0 : _q.metadata) === null || _r === void 0 ? void 0 : _r.objects) === null || _s === void 0 ? void 0 : _s.split_indexes_storage) === null || _t === void 0 ? void 0 : _t.split_indexes)) !== null && _u !== void 0 ? _u : "[]";
                  const split_indexes = JSON.parse(split_indexes_str);
                  this.splitIndexes = split_indexes;
                  this.inputData = extractInputData(options.dataViews[0].categorical, this.inputSettings.settings, this.inputSettings.derivedSettings, this.inputSettings.validationStatus.messages, idx_per_indicator[0]);
                  if (this.inputData.validationStatus.status === 0) {
                      this.groupStartEndIndexes = this.getGroupingIndexes(this.inputData, this.splitIndexes);
                      this.controlLimits = this.calculateLimits(this.inputData, this.groupStartEndIndexes, this.inputSettings.settings);
                      this.scaleAndTruncateLimits(this.controlLimits, this.inputSettings.settings, this.inputSettings.derivedSettings);
                      this.outliers = this.flagOutliers(this.controlLimits, this.groupStartEndIndexes, this.inputSettings.settings, this.inputSettings.derivedSettings);
                      this.initialisePlotData(host);
                      this.initialiseGroupedLines();
                  }
              }
          }
          this.firstRun = false;
          if (this.showGrouped) {
              if (this.inputDataGrouped.map(d => d.validationStatus.status).some(d => d !== 0)) {
                  res.status = false;
                  res.error = this.inputDataGrouped.map(d => d.validationStatus.error).join("\n");
                  return res;
              }
              if (this.inputDataGrouped.some(d => d.warningMessage !== "")) {
                  res.warning = this.inputDataGrouped.map(d => d.warningMessage).join("\n");
              }
          }
          else {
              if (this.inputData.validationStatus.status !== 0) {
                  res.status = false;
                  res.error = this.inputData.validationStatus.error;
                  return res;
              }
              if (this.inputData.warningMessage !== "") {
                  res.warning = this.inputData.warningMessage;
              }
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
                  const data = JSON.parse(JSON.stringify(inputData));
                  data.limitInputArgs.denominators = data.limitInputArgs.denominators.slice(indexes[0], indexes[1]);
                  data.limitInputArgs.numerators = data.limitInputArgs.numerators.slice(indexes[0], indexes[1]);
                  data.limitInputArgs.keys = data.limitInputArgs.keys.slice(indexes[0], indexes[1]);
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
          this.plotPointsGrouped = new Array();
          this.tableColumnsGrouped = new Array();
          this.indicatorVarNames.forEach(indicator_name => {
              this.tableColumnsGrouped.push({ name: indicator_name, label: indicator_name });
          });
          this.tableColumnsGrouped.push({ name: "latest_date", label: "Latest Date" });
          const lineSettings = this.inputSettings.settings.lines;
          if (lineSettings.show_main) {
              this.tableColumnsGrouped.push({ name: "value", label: "Value" });
          }
          if (this.inputSettings.settings.spc.ttip_show_numerator) {
              this.tableColumnsGrouped.push({ name: "numerator", label: "Numerator" });
          }
          if (this.inputSettings.settings.spc.ttip_show_denominator) {
              this.tableColumnsGrouped.push({ name: "denominator", label: "Denominator" });
          }
          if (lineSettings.show_target) {
              this.tableColumnsGrouped.push({ name: "target", label: lineSettings.ttip_label_target });
          }
          if (lineSettings.show_alt_target) {
              this.tableColumnsGrouped.push({ name: "alt_target", label: lineSettings.ttip_label_alt_target });
          }
          ["99", "95", "68"].forEach(limit => {
              if (lineSettings[`show_${limit}`]) {
                  this.tableColumnsGrouped.push({
                      name: `ucl${limit}`,
                      label: `${lineSettings[`ttip_label_${limit}_prefix_upper`]}${lineSettings[`ttip_label_${limit}`]}`
                  });
              }
          });
          ["68", "95", "99"].forEach(limit => {
              if (lineSettings[`show_${limit}`]) {
                  this.tableColumnsGrouped.push({
                      name: `lcl${limit}`,
                      label: `${lineSettings[`ttip_label_${limit}_prefix_lower`]}${lineSettings[`ttip_label_${limit}`]}`
                  });
              }
          });
          const nhsIconSettings = this.inputSettings.settings.nhs_icons;
          if (nhsIconSettings.show_variation_icons) {
              this.tableColumnsGrouped.push({ name: "variation", label: "Variation" });
          }
          if (nhsIconSettings.show_assurance_icons) {
              this.tableColumnsGrouped.push({ name: "assurance", label: "Assurance" });
          }
          const anyTooltips = this.inputDataGrouped.some(d => { var _a; return (_a = d === null || d === void 0 ? void 0 : d.tooltips) === null || _a === void 0 ? void 0 : _a.some(t => t.length > 0); });
          if (anyTooltips) {
              (_b = (_a = this.inputDataGrouped) === null || _a === void 0 ? void 0 : _a[0].tooltips) === null || _b === void 0 ? void 0 : _b[0].forEach(tooltip => {
                  this.tableColumnsGrouped.push({ name: tooltip.displayName, label: tooltip.displayName });
              });
          }
          for (let i = 0; i < this.groupNames.length; i++) {
              if (isNullOrUndefined((_c = this.inputDataGrouped[i]) === null || _c === void 0 ? void 0 : _c.categories)) {
                  continue;
              }
              const formatValues = valueFormatter(this.inputSettings.settingsGrouped[i], this.inputSettings.derivedSettingsGrouped[i]);
              const varIconFilter = this.inputSettings.settingsGrouped[i].summary_table.table_variation_filter;
              const assIconFilter = this.inputSettings.settingsGrouped[i].summary_table.table_assurance_filter;
              const limits = this.controlLimitsGrouped[i];
              const outliers = this.outliersGrouped[i];
              const lastIndex = limits.keys.length - 1;
              const varIcons = variationIconsToDraw(outliers, this.inputSettings.settingsGrouped[i]);
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
              const assIcon = assuranceIconToDraw(limits, this.inputSettings.settingsGrouped[i], this.inputSettings.derivedSettingsGrouped[i]);
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
                  this.inputDataGrouped[i].tooltips[lastIndex].forEach(tooltip => {
                      table_row_entries.push([tooltip.displayName, tooltip.value]);
                  });
              }
              this.plotPointsGrouped.push({
                  table_row: Object.fromEntries(table_row_entries),
                  identity: this.identitiesGrouped[i],
                  aesthetics: this.inputSettings.settingsGrouped[i].summary_table,
                  highlighted: this.inputDataGrouped[i].anyHighlights
              });
          }
      }
      initialisePlotData(host) {
          var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
          this.plotPoints = new Array();
          this.tickLabels = new Array();
          this.tableColumns = new Array();
          this.tableColumns.push({ name: "date", label: "Date" });
          this.tableColumns.push({ name: "value", label: "Value" });
          if (!isNullOrUndefined(this.controlLimits.numerators)) {
              this.tableColumns.push({ name: "numerator", label: "Numerator" });
          }
          if (!isNullOrUndefined(this.controlLimits.denominators)) {
              this.tableColumns.push({ name: "denominator", label: "Denominator" });
          }
          if (this.inputSettings.settings.lines.show_target) {
              this.tableColumns.push({ name: "target", label: "Target" });
          }
          if (this.inputSettings.settings.lines.show_alt_target) {
              this.tableColumns.push({ name: "alt_target", label: "Alt. Target" });
          }
          if (this.inputSettings.settings.lines.show_specification) {
              this.tableColumns.push({ name: "speclimits_lower", label: "Spec. Lower" }, { name: "speclimits_upper", label: "Spec. Upper" });
          }
          if (this.inputSettings.settings.lines.show_trend) {
              this.tableColumns.push({ name: "trend_line", label: "Trend Line" });
          }
          if (this.inputSettings.derivedSettings.chart_type_props.has_control_limits) {
              if (this.inputSettings.settings.lines.show_99) {
                  this.tableColumns.push({ name: "ll99", label: "LL 99%" }, { name: "ul99", label: "UL 99%" });
              }
              if (this.inputSettings.settings.lines.show_95) {
                  this.tableColumns.push({ name: "ll95", label: "LL 95%" }, { name: "ul95", label: "UL 95%" });
              }
              if (this.inputSettings.settings.lines.show_68) {
                  this.tableColumns.push({ name: "ll68", label: "LL 68%" }, { name: "ul68", label: "UL 68%" });
              }
          }
          if (this.inputSettings.settings.outliers.astronomical) {
              this.tableColumns.push({ name: "astpoint", label: "Ast. Point" });
          }
          if (this.inputSettings.settings.outliers.trend) {
              this.tableColumns.push({ name: "trend", label: "Trend" });
          }
          if (this.inputSettings.settings.outliers.shift) {
              this.tableColumns.push({ name: "shift", label: "Shift" });
          }
          for (let i = 0; i < this.controlLimits.keys.length; i++) {
              const index = this.controlLimits.keys[i].x;
              const aesthetics = this.inputData.scatter_formatting[i];
              if (this.colourPalette.isHighContrast) {
                  aesthetics.colour = this.colourPalette.foregroundColour;
              }
              if (this.outliers.shift[i] !== "none") {
                  aesthetics.colour = getAesthetic(this.outliers.shift[i], "outliers", "shift_colour", this.inputSettings.settings);
                  aesthetics.colour_outline = getAesthetic(this.outliers.shift[i], "outliers", "shift_colour", this.inputSettings.settings);
              }
              if (this.outliers.trend[i] !== "none") {
                  aesthetics.colour = getAesthetic(this.outliers.trend[i], "outliers", "trend_colour", this.inputSettings.settings);
                  aesthetics.colour_outline = getAesthetic(this.outliers.trend[i], "outliers", "trend_colour", this.inputSettings.settings);
              }
              if (this.outliers.two_in_three[i] !== "none") {
                  aesthetics.colour = getAesthetic(this.outliers.two_in_three[i], "outliers", "twointhree_colour", this.inputSettings.settings);
                  aesthetics.colour_outline = getAesthetic(this.outliers.two_in_three[i], "outliers", "twointhree_colour", this.inputSettings.settings);
              }
              if (this.outliers.astpoint[i] !== "none") {
                  aesthetics.colour = getAesthetic(this.outliers.astpoint[i], "outliers", "ast_colour", this.inputSettings.settings);
                  aesthetics.colour_outline = getAesthetic(this.outliers.astpoint[i], "outliers", "ast_colour", this.inputSettings.settings);
              }
              const table_row = {
                  date: this.controlLimits.keys[i].label,
                  numerator: (_a = this.controlLimits.numerators) === null || _a === void 0 ? void 0 : _a[i],
                  denominator: (_b = this.controlLimits.denominators) === null || _b === void 0 ? void 0 : _b[i],
                  value: this.controlLimits.values[i],
                  target: this.controlLimits.targets[i],
                  alt_target: this.controlLimits.alt_targets[i],
                  ll99: (_d = (_c = this.controlLimits) === null || _c === void 0 ? void 0 : _c.ll99) === null || _d === void 0 ? void 0 : _d[i],
                  ll95: (_f = (_e = this.controlLimits) === null || _e === void 0 ? void 0 : _e.ll95) === null || _f === void 0 ? void 0 : _f[i],
                  ll68: (_h = (_g = this.controlLimits) === null || _g === void 0 ? void 0 : _g.ll68) === null || _h === void 0 ? void 0 : _h[i],
                  ul68: (_k = (_j = this.controlLimits) === null || _j === void 0 ? void 0 : _j.ul68) === null || _k === void 0 ? void 0 : _k[i],
                  ul95: (_m = (_l = this.controlLimits) === null || _l === void 0 ? void 0 : _l.ul95) === null || _m === void 0 ? void 0 : _m[i],
                  ul99: (_p = (_o = this.controlLimits) === null || _o === void 0 ? void 0 : _o.ul99) === null || _p === void 0 ? void 0 : _p[i],
                  speclimits_lower: (_r = (_q = this.controlLimits) === null || _q === void 0 ? void 0 : _q.speclimits_lower) === null || _r === void 0 ? void 0 : _r[i],
                  speclimits_upper: (_t = (_s = this.controlLimits) === null || _s === void 0 ? void 0 : _s.speclimits_upper) === null || _t === void 0 ? void 0 : _t[i],
                  trend_line: (_v = (_u = this.controlLimits) === null || _u === void 0 ? void 0 : _u.trend_line) === null || _v === void 0 ? void 0 : _v[i],
                  astpoint: this.outliers.astpoint[i],
                  trend: this.outliers.trend[i],
                  shift: this.outliers.shift[i],
                  two_in_three: this.outliers.two_in_three[i]
              };
              this.plotPoints.push({
                  x: index,
                  value: this.controlLimits.values[i],
                  aesthetics: aesthetics,
                  table_row: table_row,
                  identity: host.createSelectionIdBuilder()
                      .withCategory(this.inputData.categories, this.inputData.limitInputArgs.keys[i].id)
                      .createSelectionId(),
                  highlighted: !isNullOrUndefined((_w = this.inputData.highlights) === null || _w === void 0 ? void 0 : _w[index]),
                  tooltip: buildTooltip(table_row, (_y = (_x = this.inputData) === null || _x === void 0 ? void 0 : _x.tooltips) === null || _y === void 0 ? void 0 : _y[index], this.inputSettings.settings, this.inputSettings.derivedSettings),
                  label: {
                      text_value: (_z = this.inputData.labels) === null || _z === void 0 ? void 0 : _z[index],
                      aesthetics: this.inputData.label_formatting[index],
                      angle: null,
                      distance: null,
                      line_offset: null,
                      marker_offset: null
                  }
              });
              this.tickLabels.push({ x: index, label: this.controlLimits.keys[i].label });
          }
      }
      initialiseGroupedLines() {
          const labels = new Array();
          if (this.inputSettings.settings.lines.show_main) {
              labels.push("values");
          }
          if (this.inputSettings.settings.lines.show_target) {
              labels.push("targets");
          }
          if (this.inputSettings.settings.lines.show_alt_target) {
              labels.push("alt_targets");
          }
          if (this.inputSettings.settings.lines.show_specification) {
              labels.push("speclimits_lower", "speclimits_upper");
          }
          if (this.inputSettings.settings.lines.show_trend) {
              labels.push("trend_line");
          }
          if (this.inputSettings.derivedSettings.chart_type_props.has_control_limits) {
              if (this.inputSettings.settings.lines.show_99) {
                  labels.push("ll99", "ul99");
              }
              if (this.inputSettings.settings.lines.show_95) {
                  labels.push("ll95", "ul95");
              }
              if (this.inputSettings.settings.lines.show_68) {
                  labels.push("ll68", "ul68");
              }
          }
          const formattedLines = new Array();
          const nLimits = this.controlLimits.keys.length;
          for (let i = 0; i < nLimits; i++) {
              const isRebaselinePoint = this.splitIndexes.includes(i - 1) || this.inputData.groupingIndexes.includes(i - 1);
              let isNewAltTarget = false;
              if (i > 0 && this.inputSettings.settings.lines.show_alt_target) {
                  isNewAltTarget = this.controlLimits.alt_targets[i] !== this.controlLimits.alt_targets[i - 1];
              }
              labels.forEach(label => {
                  var _a, _b;
                  const join_rebaselines = this.inputSettings.settings.lines[`join_rebaselines_${lineNameMap[label]}`];
                  if (isRebaselinePoint || isNewAltTarget) {
                      const is_alt_target = label === "alt_targets" && isNewAltTarget;
                      const is_rebaseline = label !== "alt_targets" && isRebaselinePoint;
                      formattedLines.push({
                          x: this.controlLimits.keys[i].x,
                          line_value: (!join_rebaselines && (is_alt_target || is_rebaseline)) ? null : (_a = this.controlLimits[label]) === null || _a === void 0 ? void 0 : _a[i],
                          group: label,
                          aesthetics: this.inputData.line_formatting[i]
                      });
                  }
                  formattedLines.push({
                      x: this.controlLimits.keys[i].x,
                      line_value: (_b = this.controlLimits[label]) === null || _b === void 0 ? void 0 : _b[i],
                      group: label,
                      aesthetics: this.inputData.line_formatting[i]
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
          const limits = {
              lower: inputSettings.spc.ll_truncate,
              upper: inputSettings.spc.ul_truncate
          };
          lines_to_scale.forEach(limit => {
              controlLimits[limit] = multiply(controlLimits[limit], multiplier);
          });
          lines_to_truncate.forEach(limit => {
              controlLimits[limit] = truncate(controlLimits[limit], limits);
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
              outliers[key] = checkFlagDirection(outliers[key], { process_flag_type, improvement_direction });
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
          var _a, _b, _c, _d, _e;
          try {
              this.host.eventService.renderingStarted(options);
              this.svg.select(".errormessage").remove();
              const update_status = this.viewModel.update(options, this.host);
              if (!update_status.status) {
                  this.resizeCanvas(options.viewport.width, options.viewport.height);
                  if ((_e = (_d = (_c = (_b = (_a = this.viewModel) === null || _a === void 0 ? void 0 : _a.inputSettings) === null || _b === void 0 ? void 0 : _b.settings) === null || _c === void 0 ? void 0 : _c.canvas) === null || _d === void 0 ? void 0 : _d.show_errors) !== null && _e !== void 0 ? _e : true) {
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
              if (this.viewModel.showGrouped || this.viewModel.inputSettings.settings.summary_table.show_table) {
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
          const anyHighlights = this.viewModel.inputData ? this.viewModel.inputData.anyHighlights : false;
          const anyHighlightsGrouped = this.viewModel.inputDataGrouped ? this.viewModel.inputDataGrouped.some(d => d.anyHighlights) : false;
          const allSelectionIDs = this.selectionManager.getSelectionIds();
          const dotsSelection = this.svg.selectAll(".dotsgroup").selectChildren();
          const linesSelection = this.svg.selectAll(".linesgroup").selectChildren();
          const tableSelection = this.tableDiv.selectAll(".table-body").selectChildren();
          linesSelection.style("stroke-opacity", (d) => {
              return getAesthetic(d[0], "lines", "opacity", this.viewModel.inputSettings.settings);
          });
          dotsSelection.style("fill-opacity", (d) => d.aesthetics.opacity);
          dotsSelection.style("stroke-opacity", (d) => d.aesthetics.opacity);
          tableSelection.style("opacity", (d) => d.aesthetics["table_opacity"]);
          if (anyHighlights || (allSelectionIDs.length > 0) || anyHighlightsGrouped) {
              linesSelection.style("stroke-opacity", (d) => {
                  return getAesthetic(d[0], "lines", "opacity_unselected", this.viewModel.inputSettings.settings);
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
