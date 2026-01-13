var funnel = (function (exports) {
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

  function* numbers(values, valueof) {
    {
      for (let value of values) {
        if (value != null && (value = +value) >= value) {
          yield value;
        }
      }
    }
  }

  const ascendingBisect = bisector(ascending);
  const bisectRight = ascendingBisect.right;
  bisector(number$1).center;

  function compareDefined(compare = ascending) {
    if (compare === ascending) return ascendingDefined;
    if (typeof compare !== "function") throw new TypeError("compare is not a function");
    return (a, b) => {
      const x = compare(a, b);
      if (x || x === 0) return x;
      return (compare(b, b) === 0) - (compare(a, a) === 0);
    };
  }

  function ascendingDefined(a, b) {
    return (a == null || !(a >= a)) - (b == null || !(b >= b)) || (a < b ? -1 : a > b ? 1 : 0);
  }

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

  function max(values, valueof) {
    let max;
    {
      for (const value of values) {
        if (value != null
            && (max < value || (max === undefined && value >= value))) {
          max = value;
        }
      }
    }
    return max;
  }

  function min(values, valueof) {
    let min;
    {
      for (const value of values) {
        if (value != null
            && (min > value || (min === undefined && value >= value))) {
          min = value;
        }
      }
    }
    return min;
  }

  // Based on https://github.com/mourner/quickselect
  // ISC license, Copyright 2018 Vladimir Agafonkin.
  function quickselect(array, k, left = 0, right = Infinity, compare) {
    k = Math.floor(k);
    left = Math.floor(Math.max(0, left));
    right = Math.floor(Math.min(array.length - 1, right));

    if (!(left <= k && k <= right)) return array;

    compare = compare === undefined ? ascendingDefined : compareDefined(compare);

    while (right > left) {
      if (right - left > 600) {
        const n = right - left + 1;
        const m = k - left + 1;
        const z = Math.log(n);
        const s = 0.5 * Math.exp(2 * z / 3);
        const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
        const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
        const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
        quickselect(array, k, newLeft, newRight, compare);
      }

      const t = array[k];
      let i = left;
      let j = right;

      swap(array, left, k);
      if (compare(array[right], t) > 0) swap(array, left, right);

      while (i < j) {
        swap(array, i, j), ++i, --j;
        while (compare(array[i], t) < 0) ++i;
        while (compare(array[j], t) > 0) --j;
      }

      if (compare(array[left], t) === 0) swap(array, left, j);
      else ++j, swap(array, j, right);

      if (j <= k) left = j + 1;
      if (k <= j) right = j - 1;
    }

    return array;
  }

  function swap(array, i, j) {
    const t = array[i];
    array[i] = array[j];
    array[j] = t;
  }

  function quantile(values, p, valueof) {
    values = Float64Array.from(numbers(values));
    if (!(n = values.length) || isNaN(p = +p)) return;
    if (p <= 0 || n < 2) return min(values);
    if (p >= 1) return max(values);
    var n,
        i = (n - 1) * p,
        i0 = Math.floor(i),
        value0 = max(quickselect(values, i0).subarray(0, i0 + 1)),
        value1 = min(values.subarray(i0 + 1));
    return value0 + (value1 - value0) * (i - i0);
  }

  function sum(values, valueof) {
    let sum = 0;
    {
      for (let value of values) {
        if (value = +value) {
          sum += value;
        }
      }
    }
    return sum;
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
      }};
  const settingsModel = {
      canvas: {
          description: "Canvas Settings",
          displayName: "Canvas Settings",
          settingsGroups: {
              "all": {
                  show_errors: {
                      displayName: "Show Errors on Canvas",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  lower_padding: {
                      displayName: "Padding Below Plot (pixels):",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 10
                  },
                  upper_padding: {
                      displayName: "Padding Above Plot (pixels):",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 10
                  },
                  left_padding: {
                      displayName: "Padding Left of Plot (pixels):",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 10
                  },
                  right_padding: {
                      displayName: "Padding Right of Plot (pixels):",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 10
                  }
              }
          }
      },
      funnel: {
          description: "Funnel Settings",
          displayName: "Data Settings",
          settingsGroups: {
              "all": {
                  chart_type: {
                      displayName: "Chart Type",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
                      default: "PR",
                      valid: ["SR", "PR", "RC"],
                      items: [
                          { displayName: "Indirectly Standardised (HSMR)", value: "SR" },
                          { displayName: "Proportion", value: "PR" },
                          { displayName: "Rate", value: "RC" }
                      ]
                  },
                  od_adjust: {
                      displayName: "OD Adjustment",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
                      default: "no",
                      valid: ["auto", "yes", "no"],
                      items: [
                          { displayName: "Automatic", value: "auto" },
                          { displayName: "Yes", value: "yes" },
                          { displayName: "No", value: "no" }
                      ]
                  },
                  multiplier: {
                      displayName: "Multiplier",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1,
                      options: { minValue: { value: 0 } }
                  },
                  sig_figs: {
                      displayName: "Decimals to Report:",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 2,
                      options: { minValue: { value: 0 }, maxValue: { value: 20 } }
                  },
                  perc_labels: {
                      displayName: "Report as percentage",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
                      default: "Automatic",
                      valid: ["Automatic", "Yes", "No"],
                      items: [
                          { displayName: "Automatic", value: "Automatic" },
                          { displayName: "Yes", value: "Yes" },
                          { displayName: "No", value: "No" }
                      ]
                  },
                  transformation: {
                      displayName: "Transformation",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
                      default: "none",
                      valid: ["none", "ln", "log10", "sqrt"],
                      items: [
                          { displayName: "None", value: "none" },
                          { displayName: "Natural Log (y+1)", value: "ln" },
                          { displayName: "Log10 (y+1)", value: "log10" },
                          { displayName: "Square-Root", value: "sqrt" }
                      ]
                  },
                  ttip_show_group: {
                      displayName: "Show Group in Tooltip",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  ttip_label_group: {
                      displayName: "Group Tooltip Label",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: "Group"
                  },
                  ttip_show_numerator: {
                      displayName: "Show Numerator in Tooltip",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  ttip_label_numerator: {
                      displayName: "Numerator Tooltip Label",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: "Numerator"
                  },
                  ttip_show_denominator: {
                      displayName: "Show Denominator in Tooltip",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  ttip_label_denominator: {
                      displayName: "Denominator Tooltip Label",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: "Denominator"
                  },
                  ttip_show_value: {
                      displayName: "Show Value in Tooltip",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  ttip_label_value: {
                      displayName: "Value Tooltip Label",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: "Automatic"
                  },
                  ll_truncate: {
                      displayName: "Truncate Lower Limits at:",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: null
                  },
                  ul_truncate: {
                      displayName: "Truncate Upper Limits at:",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
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
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
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
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
                      default: "increase",
                      valid: ["increase", "neutral", "decrease"],
                      items: [
                          { displayName: "Increase", value: "increase" },
                          { displayName: "Neutral", value: "neutral" },
                          { displayName: "Decrease", value: "decrease" }
                      ]
                  }
              },
              "Three Sigma Outliers": {
                  three_sigma: {
                      displayName: "Three Sigma Outliers",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: false
                  },
                  three_sigma_colour_improvement: {
                      displayName: "Imp. Three Sigma Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.improvement
                  },
                  three_sigma_colour_deterioration: {
                      displayName: "Det. Three Sigma Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.deterioration
                  },
                  three_sigma_colour_neutral_low: {
                      displayName: "Neutral (Low) Three Sigma Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.neutral_low
                  },
                  three_sigma_colour_neutral_high: {
                      displayName: "Neutral (High) Three Sigma Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.neutral_high
                  }
              },
              "Two Sigma Outliers": {
                  two_sigma: {
                      displayName: "Two Sigma Outliers",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: false
                  },
                  two_sigma_colour_improvement: {
                      displayName: "Imp. Two Sigma Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.improvement
                  },
                  two_sigma_colour_deterioration: {
                      displayName: "Det. Two Sigma Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.deterioration
                  },
                  two_sigma_colour_neutral_low: {
                      displayName: "Neutral (Low) Two Sigma Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.neutral_low
                  },
                  two_sigma_colour_neutral_high: {
                      displayName: "Neutral (High) Two Sigma Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.neutral_high
                  }
              }
          }
      },
      scatter: {
          description: "Scatter Settings",
          displayName: "Scatter Settings",
          settingsGroups: {
              "Dots": {
                  shape: {
                      displayName: "Shape",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
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
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 2.5,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  colour: {
                      displayName: "Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.common_cause
                  },
                  colour_outline: {
                      displayName: "Outline Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.common_cause
                  },
                  width_outline: {
                      displayName: "Outline Width",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  opacity: {
                      displayName: "Default Opacity",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_selected: {
                      displayName: "Opacity if Selected",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected: {
                      displayName: "Opacity if Unselected",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  }
              },
              "Group Text": {
                  use_group_text: {
                      displayName: "Show Group Text",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: false
                  },
                  scatter_text_font: {
                      displayName: "Group Text Font",
                      type: "FontPicker" /* FormattingComponent.FontPicker */,
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  scatter_text_size: {
                      displayName: "Group Text Size",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  scatter_text_colour: {
                      displayName: "Group Text Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  scatter_text_opacity: {
                      displayName: "Group Text Default Opacity",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  scatter_text_opacity_selected: {
                      displayName: "Group Text Opacity if Selected",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  scatter_text_opacity_unselected: {
                      displayName: "Group Text Opacity if Unselected",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
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
              "Target": {
                  show_target: {
                      displayName: "Show Target",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  width_target: {
                      displayName: "Line Width",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1.5,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  type_target: {
                      displayName: "Line Type",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
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
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  opacity_target: {
                      displayName: "Default Opacity",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected_target: {
                      displayName: "Opacity if Any Selected",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  ttip_show_target: {
                      displayName: "Show value in tooltip",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  ttip_label_target: {
                      displayName: "Tooltip Label",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: "Centerline"
                  },
                  plot_label_show_target: {
                      displayName: "Show Value on Plot",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: false
                  },
                  plot_label_position_target: {
                      displayName: "Position of Value on Line(s)",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
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
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0
                  },
                  plot_label_hpad_target: {
                      displayName: "Value Horizontal Padding",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 10
                  },
                  plot_label_font_target: {
                      displayName: "Value Font",
                      type: "FontPicker" /* FormattingComponent.FontPicker */,
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  plot_label_size_target: {
                      displayName: "Value Font Size",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  plot_label_colour_target: {
                      displayName: "Value Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  plot_label_prefix_target: {
                      displayName: "Value Prefix",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: ""
                  }
              },
              "Alt. Target": {
                  show_alt_target: {
                      displayName: "Show Alt. Target Line",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: false
                  },
                  alt_target: {
                      displayName: "Additional Target Value:",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: null
                  },
                  width_alt_target: {
                      displayName: "Line Width",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1.5,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  type_alt_target: {
                      displayName: "Line Type",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
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
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  opacity_alt_target: {
                      displayName: "Default Opacity",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected_alt_target: {
                      displayName: "Opacity if Any Selected",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  join_rebaselines_alt_target: {
                      displayName: "Connect Rebaselined Limits",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: false
                  },
                  ttip_show_alt_target: {
                      displayName: "Show value in tooltip",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  ttip_label_alt_target: {
                      displayName: "Tooltip Label",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: "Alt. Target"
                  },
                  plot_label_show_alt_target: {
                      displayName: "Show Value on Plot",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: false
                  },
                  plot_label_position_alt_target: {
                      displayName: "Position of Value on Line(s)",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
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
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0
                  },
                  plot_label_hpad_alt_target: {
                      displayName: "Value Horizontal Padding",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 10
                  },
                  plot_label_font_alt_target: {
                      displayName: "Value Font",
                      type: "FontPicker" /* FormattingComponent.FontPicker */,
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  plot_label_size_alt_target: {
                      displayName: "Value Font Size",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  plot_label_colour_alt_target: {
                      displayName: "Value Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  plot_label_prefix_alt_target: {
                      displayName: "Value Prefix",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: ""
                  }
              },
              "68% Limits": {
                  show_68: {
                      displayName: "Show 68% Lines",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: false
                  },
                  width_68: {
                      displayName: "Line Width",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 2,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  type_68: {
                      displayName: "Line Type",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
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
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.limits
                  },
                  opacity_68: {
                      displayName: "Default Opacity",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected_68: {
                      displayName: "Opacity if Any Selected",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  ttip_show_68: {
                      displayName: "Show value in tooltip",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  ttip_label_68: {
                      displayName: "Tooltip Label",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: "68% Limit"
                  },
                  plot_label_show_68: {
                      displayName: "Show Value on Plot",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: false
                  },
                  plot_label_position_68: {
                      displayName: "Position of Value on Line(s)",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
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
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0
                  },
                  plot_label_hpad_68: {
                      displayName: "Value Horizontal Padding",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 10
                  },
                  plot_label_font_68: {
                      displayName: "Value Font",
                      type: "FontPicker" /* FormattingComponent.FontPicker */,
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  plot_label_size_68: {
                      displayName: "Value Font Size",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  plot_label_colour_68: {
                      displayName: "Value Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  plot_label_prefix_68: {
                      displayName: "Value Prefix",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: ""
                  }
              },
              "95% Limits": {
                  show_95: {
                      displayName: "Show 95% Lines",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  width_95: {
                      displayName: "Line Width",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 2,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  type_95: {
                      displayName: "Line Type",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
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
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.limits
                  },
                  opacity_95: {
                      displayName: "Default Opacity",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected_95: {
                      displayName: "Opacity if Any Selected",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  ttip_show_95: {
                      displayName: "Show value in tooltip",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  ttip_label_95: {
                      displayName: "Tooltip Label",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: "95% Limit"
                  },
                  plot_label_show_95: {
                      displayName: "Show Value on Plot",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: false
                  },
                  plot_label_position_95: {
                      displayName: "Position of Value on Line(s)",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
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
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0
                  },
                  plot_label_hpad_95: {
                      displayName: "Value Horizontal Padding",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 10
                  },
                  plot_label_font_95: {
                      displayName: "Value Font",
                      type: "FontPicker" /* FormattingComponent.FontPicker */,
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  plot_label_size_95: {
                      displayName: "Value Font Size",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  plot_label_colour_95: {
                      displayName: "Value Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  plot_label_prefix_95: {
                      displayName: "Value Prefix",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: ""
                  }
              },
              "99% Limits": {
                  show_99: {
                      displayName: "Show 99% Lines",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  width_99: {
                      displayName: "Line Width",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 2,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  type_99: {
                      displayName: "Line Type",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
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
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.limits
                  },
                  opacity_99: {
                      displayName: "Default Opacity",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  opacity_unselected_99: {
                      displayName: "Opacity if Any Selected",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0.2,
                      options: { minValue: { value: 0 }, maxValue: { value: 1 } }
                  },
                  ttip_show_99: {
                      displayName: "Show value in tooltip",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  ttip_label_99: {
                      displayName: "Tooltip Label",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: "99% Limit"
                  },
                  plot_label_show_99: {
                      displayName: "Show Value on Plot",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: false
                  },
                  plot_label_position_99: {
                      displayName: "Position of Value on Line(s)",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
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
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0
                  },
                  plot_label_hpad_99: {
                      displayName: "Value Horizontal Padding",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 10
                  },
                  plot_label_font_99: {
                      displayName: "Value Font",
                      type: "FontPicker" /* FormattingComponent.FontPicker */,
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  plot_label_size_99: {
                      displayName: "Value Font Size",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  plot_label_colour_99: {
                      displayName: "Value Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  plot_label_prefix_99: {
                      displayName: "Value Prefix",
                      type: "TextInput" /* FormattingComponent.TextInput */,
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
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  xlimit_l: {
                      displayName: "Lower Limit",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: null
                  },
                  xlimit_u: {
                      displayName: "Upper Limit",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: null
                  }
              },
              "Ticks": {
                  xlimit_ticks: {
                      displayName: "Draw Ticks",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  xlimit_tick_count: {
                      displayName: "Maximum Ticks",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 10,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  xlimit_tick_font: {
                      displayName: "Tick Font",
                      type: "FontPicker" /* FormattingComponent.FontPicker */,
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  xlimit_tick_size: {
                      displayName: "Tick Font Size",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  xlimit_tick_colour: {
                      displayName: "Tick Font Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  xlimit_tick_rotation: {
                      displayName: "Tick Rotation (Degrees)",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0,
                      options: { minValue: { value: -360 }, maxValue: { value: 360 } }
                  }
              },
              "Label": {
                  xlimit_label: {
                      displayName: "Label",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: null
                  },
                  xlimit_label_font: {
                      displayName: "Label Font",
                      type: "FontPicker" /* FormattingComponent.FontPicker */,
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  xlimit_label_size: {
                      displayName: "Label Font Size",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  xlimit_label_colour: {
                      displayName: "Label Font Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
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
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  ylimit_sig_figs: {
                      displayName: "Tick Decimal Places",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: null,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  ylimit_l: {
                      displayName: "Lower Limit",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: null
                  },
                  ylimit_u: {
                      displayName: "Upper Limit",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: null
                  }
              },
              "Ticks": {
                  ylimit_ticks: {
                      displayName: "Draw Ticks",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  ylimit_tick_count: {
                      displayName: "Maximum Ticks",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 10,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  ylimit_tick_font: {
                      displayName: "Tick Font",
                      type: "FontPicker" /* FormattingComponent.FontPicker */,
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  ylimit_tick_size: {
                      displayName: "Tick Font Size",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  ylimit_tick_colour: {
                      displayName: "Tick Font Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  ylimit_tick_rotation: {
                      displayName: "Tick Rotation (Degrees)",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0,
                      options: { minValue: { value: -360 }, maxValue: { value: 360 } }
                  }
              },
              "Label": {
                  ylimit_label: {
                      displayName: "Label",
                      type: "TextInput" /* FormattingComponent.TextInput */,
                      default: null
                  },
                  ylimit_label_font: {
                      displayName: "Label Font",
                      type: "FontPicker" /* FormattingComponent.FontPicker */,
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  ylimit_label_size: {
                      displayName: "Label Font Size",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  ylimit_label_colour: {
                      displayName: "Label Font Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
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
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  label_position: {
                      displayName: "Label Position",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
                      default: "top",
                      valid: ["top", "bottom"],
                      items: [
                          { displayName: "Top", value: "top" },
                          { displayName: "Bottom", value: "bottom" }
                      ]
                  },
                  label_y_offset: {
                      displayName: "Label Offset from Top/Bottom (px)",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 20
                  },
                  label_line_offset: {
                      displayName: "Label Offset from Connecting Line (px)",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 5
                  },
                  label_angle_offset: {
                      displayName: "Label Angle Offset (degrees)",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 0,
                      options: { minValue: { value: -90 }, maxValue: { value: 90 } }
                  },
                  label_font: {
                      displayName: "Label Font",
                      type: "FontPicker" /* FormattingComponent.FontPicker */,
                      default: textOptions.font.default,
                      valid: textOptions.font.valid
                  },
                  label_size: {
                      displayName: "Label Font Size",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: textOptions.size.default,
                      options: textOptions.size.options
                  },
                  label_colour: {
                      displayName: "Label Font Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  label_line_colour: {
                      displayName: "Connecting Line Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  label_line_width: {
                      displayName: "Connecting Line Width",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  label_line_type: {
                      displayName: "Connecting Line Type",
                      type: "Dropdown" /* FormattingComponent.Dropdown */,
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
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 1000,
                      options: { minValue: { value: 0 }, maxValue: { value: 10000 } }
                  },
                  label_marker_show: {
                      displayName: "Show Line Markers",
                      type: "ToggleSwitch" /* FormattingComponent.ToggleSwitch */,
                      default: true
                  },
                  label_marker_offset: {
                      displayName: "Marker Offset from Value (px)",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 5
                  },
                  label_marker_size: {
                      displayName: "Marker Size",
                      type: "NumUpDown" /* FormattingComponent.NumUpDown */,
                      default: 3,
                      options: { minValue: { value: 0 }, maxValue: { value: 100 } }
                  },
                  label_marker_colour: {
                      displayName: "Marker Fill Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
                      default: defaultColours.standard
                  },
                  label_marker_outline_colour: {
                      displayName: "Marker Outline Colour",
                      type: "ColorPicker" /* FormattingComponent.ColorPicker */,
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
      if (!(visualObj.plotProperties.displayPlot)) {
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

  /**
   * Basic utility function to check for null or undefined values.
   *
   * @template T The type of the input value.
   * @param value The value to check.
   * @returns True if the value is null or undefined, false otherwise.
   */
  function isNullOrUndefined(value) {
      return value === null || value === undefined;
  }

  /**
   * Checks if a value is between a lower and upper bound (inclusive).
   *
   * @template T - The type of the value and bounds.
   * @param x - The value to check.
   * @param lower - The lower bound.
   * @param upper - The upper bound.
   * @returns True if the value is between the lower and upper bounds,
   *            false otherwise.
   */
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

  function broadcast_binary(fun) {
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
  const add = broadcast_binary((x, y) => x + y);
  const subtract = broadcast_binary((x, y) => x - y);
  const divide = broadcast_binary((x, y) => x / y);
  const multiply = broadcast_binary((x, y) => x * y);

  function getTransformation(setting_name) {
      if (setting_name == "none") {
          return function (x) { return x; };
      }
      else if (setting_name == "ln") {
          return function (x) { return Math.log(x + 1); };
      }
      else if (setting_name == "log10") {
          return function (x) { return Math.log10(x + 1); };
      }
      else if (setting_name == "sqrt") {
          return Math.sqrt;
      }
      else {
          return function (x) { return x; };
      }
  }

  function buildTooltip(index, calculatedLimits, outliers, inputData, inputSettings, derivedSettings) {
      const data_type = inputSettings.funnel.chart_type;
      const multiplier = derivedSettings.multiplier;
      const transform_text = inputSettings.funnel.transformation;
      const transform = getTransformation(transform_text);
      const group = inputData.keys[index].label;
      const numerator = inputData.numerators[index];
      const denominator = inputData.denominators[index];
      const limits = calculatedLimits.filter(d => d.denominators === denominator && d.ll99 !== null && d.ul99 !== null)[0];
      const ratio = transform((numerator / denominator) * multiplier);
      const suffix = derivedSettings.percentLabels ? "%" : "";
      const prop_labels = derivedSettings.percentLabels;
      const sig_figs = inputSettings.funnel.sig_figs;
      const valueLabel = {
          "PR": "Proportion",
          "SR": "Standardised Ratio",
          "RC": "Rate"
      };
      const tooltip = new Array();
      if (inputSettings.funnel.ttip_show_group) {
          tooltip.push({
              displayName: inputSettings.funnel.ttip_label_group,
              value: group
          });
      }
      if (inputSettings.funnel.ttip_show_value) {
          const ttip_label_value = inputSettings.funnel.ttip_label_value;
          tooltip.push({
              displayName: ttip_label_value === "Automatic" ? valueLabel[data_type] : ttip_label_value,
              value: ratio.toFixed(sig_figs) + suffix
          });
      }
      if (inputSettings.funnel.ttip_show_numerator && !(numerator === null || numerator === undefined)) {
          tooltip.push({
              displayName: inputSettings.funnel.ttip_label_numerator,
              value: (numerator).toFixed(prop_labels ? 0 : sig_figs)
          });
      }
      if (inputSettings.funnel.ttip_show_denominator && !(denominator === null || denominator === undefined)) {
          tooltip.push({
              displayName: inputSettings.funnel.ttip_label_denominator,
              value: (denominator).toFixed(prop_labels ? 0 : sig_figs)
          });
      }
      ["68", "95", "99"].forEach(limit => {
          if (inputSettings.lines[`ttip_show_${limit}`] && inputSettings.lines[`show_${limit}`]) {
              tooltip.push({
                  displayName: `Upper ${inputSettings.lines[`ttip_label_${limit}`]}`,
                  value: (limits[`ul${limit}`]).toFixed(sig_figs) + suffix
              });
          }
      });
      if (inputSettings.lines.show_target && inputSettings.lines.ttip_show_target) {
          tooltip.push({
              displayName: inputSettings.lines.ttip_label_target,
              value: (limits.target).toFixed(sig_figs) + suffix
          });
      }
      if (inputSettings.lines.show_alt_target && inputSettings.lines.ttip_show_alt_target && !(limits.alt_target === null || limits.alt_target === undefined)) {
          tooltip.push({
              displayName: inputSettings.lines.ttip_label_alt_target,
              value: (limits.alt_target).toFixed(sig_figs) + suffix
          });
      }
      ["68", "95", "99"].forEach(limit => {
          if (inputSettings.lines[`ttip_show_${limit}`] && inputSettings.lines[`show_${limit}`]) {
              tooltip.push({
                  displayName: `Lower ${inputSettings.lines[`ttip_label_${limit}`]}`,
                  value: (limits[`ll${limit}`]).toFixed(sig_figs) + suffix
              });
          }
      });
      if (transform_text !== "none") {
          tooltip.push({
              displayName: "Plot Scaling",
              value: transform_text
          });
      }
      if (outliers.two_sigma || outliers.three_sigma) {
          const patterns = new Array();
          if (outliers.three_sigma) {
              patterns.push("Three Sigma Outlier");
          }
          if (outliers.two_sigma) {
              patterns.push("Two Sigma Outlier");
          }
          tooltip.push({
              displayName: "Pattern(s)",
              value: patterns.join("\n")
          });
      }
      if (inputData.tooltips.length > 0) {
          inputData.tooltips[index].forEach(customTooltip => tooltip.push(customTooltip));
      }
      return tooltip;
  }

  /**
   * Creates an array with `n` elements, where each element is a copy of the
   * provided value `x`.
   *
   * @template T The type of the value `x`.
   * @param x The value to be repeated.
   * @param n The number of times the value should be repeated.
   * @returns An array containing `n` copies of the value `x`.
   */
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
  function extractConditionalFormatting(categoricalView, settingGroupName, inputSettings) {
      if (isNullOrUndefined(categoricalView)) {
          return { values: null, validation: { status: 0, messages: rep(new Array(), 1) } };
      }
      if (isNullOrUndefined(categoricalView === null || categoricalView === void 0 ? void 0 : categoricalView.categories)) {
          return { values: null, validation: { status: 0, messages: rep(new Array(), 1) } };
      }
      const inputCategories = categoricalView.categories[0];
      const settingNames = Object.keys(inputSettings[settingGroupName]);
      // Force a deep copy to avoid JS's absurd pass-by-reference handling
      const validationRtn = JSON.parse(JSON.stringify({ status: 0, messages: rep([], inputCategories.values.length) }));
      const rtn = inputCategories.values.map((_, idx) => {
          const inpObjects = (inputCategories.objects ? inputCategories.objects[idx] : null);
          return Object.fromEntries(settingNames.map(settingName => {
              var _a, _b, _c, _d, _e, _f, _g;
              const defaultSetting = defaultSettings[settingGroupName][settingName]["default"];
              let extractedSetting = getSettingValue(inpObjects, settingGroupName, settingName, defaultSetting);
              // PBI passes empty string when clearing conditional formatting
              // for dropdown setting using the eraser button, so just reset to default
              extractedSetting = extractedSetting === "" ? defaultSetting : extractedSetting;
              // New API has numeric min/max under 'options' member
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
                      validationRtn.messages[idx].push(message);
                  }
              }
              return [settingName, extractedSetting];
          }));
      });
      const validationMessages = validationRtn.messages.filter(d => d.length > 0);
      if (!validationRtn.messages.some(d => d.length === 0)) {
          validationRtn.status = 1;
          validationRtn.error = `${validationMessages[0][0]}`;
      }
      return { values: rtn, validation: validationRtn };
  }

  const formatPrimitiveValue = broadcast_binary((rawValue, valueType) => {
      if (rawValue === null || rawValue === undefined) {
          return null;
      }
      if (valueType.numeric) {
          return rawValue.toString();
      }
      else {
          return rawValue;
      }
  });

  function extractKeys(inputView) {
      var _a, _b, _c;
      const primitiveKeyColumns = inputView.categories.filter(viewColumn => { var _a, _b; return (_b = (_a = viewColumn.source) === null || _a === void 0 ? void 0 : _a.roles) === null || _b === void 0 ? void 0 : _b["key"]; });
      const primitiveKeyValues = (_a = primitiveKeyColumns === null || primitiveKeyColumns === void 0 ? void 0 : primitiveKeyColumns[0]) === null || _a === void 0 ? void 0 : _a.values;
      const primitiveKeyTypes = (_c = (_b = primitiveKeyColumns === null || primitiveKeyColumns === void 0 ? void 0 : primitiveKeyColumns[0]) === null || _b === void 0 ? void 0 : _b.source) === null || _c === void 0 ? void 0 : _c.type;
      return formatPrimitiveValue(primitiveKeyValues, primitiveKeyTypes);
  }
  function extractTooltips(inputView) {
      var _a, _b;
      const tooltipColumns = inputView.values.filter(viewColumn => viewColumn.source.roles.tooltips);
      return (_b = (_a = tooltipColumns === null || tooltipColumns === void 0 ? void 0 : tooltipColumns[0]) === null || _a === void 0 ? void 0 : _a.values) === null || _b === void 0 ? void 0 : _b.map((_, idx) => {
          return tooltipColumns.map(viewColumn => {
              var _a;
              const tooltipValueFormatted = formatPrimitiveValue((_a = viewColumn === null || viewColumn === void 0 ? void 0 : viewColumn.values) === null || _a === void 0 ? void 0 : _a[idx], viewColumn.source.type);
              return {
                  displayName: viewColumn.source.displayName,
                  value: tooltipValueFormatted
              };
          });
      });
  }
  function extractDataColumn(inputView, name) {
      var _a, _b, _c, _d;
      const columnRaw = inputView.values.filter(viewColumn => { var _a, _b; return (_b = (_a = viewColumn === null || viewColumn === void 0 ? void 0 : viewColumn.source) === null || _a === void 0 ? void 0 : _a.roles) === null || _b === void 0 ? void 0 : _b[name]; });
      if (name === "key") {
          return extractKeys(inputView);
      }
      else if (name === "tooltips") {
          return extractTooltips(inputView);
      }
      else if (name === "labels") {
          return (_b = (_a = columnRaw === null || columnRaw === void 0 ? void 0 : columnRaw[0]) === null || _a === void 0 ? void 0 : _a.values) === null || _b === void 0 ? void 0 : _b.map(d => isNullOrUndefined(d) ? null : String(d));
      }
      else {
          // Assumed that any other requested columns are numeric columns for plotting
          return (_d = (_c = columnRaw === null || columnRaw === void 0 ? void 0 : columnRaw[0]) === null || _c === void 0 ? void 0 : _c.values) === null || _d === void 0 ? void 0 : _d.map(d => isNullOrUndefined(d) ? null : Number(d));
      }
  }

  function extractInputData(inputView, inputSettingsClass) {
      var _a, _b;
      const inputSettings = inputSettingsClass.settings;
      const numerators = extractDataColumn(inputView, "numerators");
      const denominators = extractDataColumn(inputView, "denominators");
      const keys = extractDataColumn(inputView, "key");
      const labels = extractDataColumn(inputView, "labels");
      let scatter_cond = (_a = extractConditionalFormatting(inputView, "scatter", inputSettings)) === null || _a === void 0 ? void 0 : _a.values;
      scatter_cond = scatter_cond === null ? rep(inputSettings.scatter, numerators.length) : scatter_cond;
      let labels_cond = (_b = extractConditionalFormatting(inputView, "labels", inputSettings)) === null || _b === void 0 ? void 0 : _b.values;
      labels_cond = labels_cond === null ? rep(inputSettings.labels, numerators.length) : labels_cond;
      const tooltips = extractDataColumn(inputView, "tooltips");
      const highlights = inputView.values[0].highlights;
      const inputValidStatus = validateInputData(keys, numerators, denominators, inputSettings.funnel.chart_type);
      if (inputValidStatus.status !== 0) {
          return {
              keys: null,
              id: null,
              numerators: null,
              denominators: null,
              highlights: null,
              anyHighlights: null,
              categories: null,
              scatter_formatting: null,
              label_formatting: null,
              tooltips: null,
              labels: null,
              anyLabels: false,
              warningMessage: inputValidStatus.error,
              validationStatus: inputValidStatus
          };
      }
      const valid_ids = new Array();
      const valid_keys = new Array();
      const removalMessages = new Array();
      const groupVarName = inputView.categories[0].source.displayName;
      const settingsMessages = inputSettingsClass.validationStatus.messages;
      let valid_x = 0;
      for (let i = 0; i < numerators.length; i++) {
          if (inputValidStatus.messages[i] === "") {
              valid_ids.push(i);
              valid_keys.push({ x: valid_x, id: i, label: keys[i] });
              valid_x += 1;
              if (settingsMessages[i].length > 0) {
                  settingsMessages[i].forEach(setting_removal_message => {
                      removalMessages.push(`Conditional formatting for ${groupVarName} ${keys[i]} ignored due to: ${setting_removal_message}.`);
                  });
              }
          }
          else {
              removalMessages.push(`${groupVarName} ${keys[i]} removed due to: ${inputValidStatus.messages[i]}.`);
          }
      }
      const valid_labels = extractValues(labels, valid_ids);
      return {
          keys: valid_keys,
          id: valid_ids,
          numerators: extractValues(numerators, valid_ids),
          denominators: extractValues(denominators, valid_ids),
          tooltips: extractValues(tooltips, valid_ids),
          labels: valid_labels,
          anyLabels: valid_labels.filter(d => !isNullOrUndefined(d) && d !== "").length > 0,
          highlights: extractValues(highlights, valid_ids),
          anyHighlights: highlights != null,
          categories: inputView.categories[0],
          scatter_formatting: extractValues(scatter_cond, valid_ids),
          label_formatting: extractValues(labels_cond, valid_ids),
          warningMessage: removalMessages.length > 0 ? removalMessages.join("\n") : "",
          validationStatus: inputValidStatus
      };
  }

  /**
   * Extracts values from valuesArray at the specified indices in indexArray.
   * If valuesArray is null or undefined, returns an empty array.
   *
   * @template T The type of the values in the valuesArray.
   * @param valuesArray The array of values to extract from.
   * @param indexArray The array of indices specifying which values to extract.
   * @returns An array of extracted values.
   */
  function extractValues(valuesArray, indexArray) {
      if (valuesArray) {
          const n = indexArray.length;
          let result = new Array(n);
          for (let i = 0; i < n; i++) {
              result[i] = valuesArray[indexArray[i]];
          }
          return result;
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
      "target": "target",
      "alt_target": "alt_target"
  };
  function getAesthetic(type, group, aesthetic, inputSettings) {
      const mapName = group.includes("line") ? lineNameMap[type] : type;
      const settingName = aesthetic + "_" + mapName;
      return inputSettings[group][settingName];
  }

  /**
   * Generates a sequence of numbers from 'from' to 'to' with a step of 'by'.
   *
   * @param from The starting number of the sequence.
   * @param to The ending number of the sequence.
   * @param by The step increment between each number in the sequence.
   * @returns An array containing the generated sequence of numbers.
   */
  function seq(from, to, by) {
      const n_iter = Math.floor((to - from) / by);
      const res = new Array(n_iter);
      res[0] = from;
      for (let i = 1; i < n_iter; i++) {
          res[i] = res[i - 1] + by;
      }
      return res;
  }

  function broadcast_unary(fun) {
      return function (y) {
          if (Array.isArray(y)) {
              return y.map((d) => fun(d));
          }
          else {
              return fun(y);
          }
      };
  }
  const sqrt = broadcast_unary(Math.sqrt);
  const exp = broadcast_unary(Math.exp);
  const log = broadcast_unary(Math.log);
  const asin = broadcast_unary(Math.asin);
  const square = broadcast_unary((x) => Math.pow(x, 2));
  const inv = broadcast_unary((x) => 1.0 / x);

  function winsorise(val, limits) {
      let rtn = val;
      if (limits.lower) {
          if (Array.isArray(rtn)) {
              rtn = rtn.map(d => d < limits.lower ? limits.lower : d);
          }
          else if (typeof rtn === "number") {
              rtn = rtn < limits.lower ? limits.lower : rtn;
          }
      }
      if (limits.upper) {
          if (Array.isArray(rtn)) {
              rtn = rtn.map(d => d > limits.upper ? limits.upper : d);
          }
          else if (typeof rtn === "number") {
              rtn = rtn > limits.upper ? limits.upper : rtn;
          }
      }
      return rtn;
  }

  function validateDataView(inputDV) {
      var _a, _b, _c, _d, _e, _f;
      if (!(inputDV === null || inputDV === void 0 ? void 0 : inputDV[0])) {
          return "No data present";
      }
      if (!((_b = (_a = inputDV[0]) === null || _a === void 0 ? void 0 : _a.categorical) === null || _b === void 0 ? void 0 : _b.categories)) {
          return "No grouping/ID variable passed!";
      }
      const numeratorsPresent = (_d = (_c = inputDV[0].categorical) === null || _c === void 0 ? void 0 : _c.values) === null || _d === void 0 ? void 0 : _d.some(d => { var _a, _b; return (_b = (_a = d.source) === null || _a === void 0 ? void 0 : _a.roles) === null || _b === void 0 ? void 0 : _b.numerators; });
      if (!numeratorsPresent) {
          return "No Numerators passed!";
      }
      const denominatorsPresent = (_f = (_e = inputDV[0].categorical) === null || _e === void 0 ? void 0 : _e.values) === null || _f === void 0 ? void 0 : _f.some(d => { var _a, _b; return (_b = (_a = d.source) === null || _a === void 0 ? void 0 : _a.roles) === null || _b === void 0 ? void 0 : _b.denominators; });
      if (!denominatorsPresent) {
          return "No denominators passed!";
      }
      return "valid";
  }

  function validateInputData(keys, numerators, denominators, data_type) {
      const validationRtn = { status: 0, messages: rep("", keys.length) };
      keys.forEach((d, idx) => {
          validationRtn.messages[idx] = validationRtn.messages[idx] === ""
              ? ((d != null) ? "" : "Group missing")
              : validationRtn.messages[idx];
      });
      if (!validationRtn.messages.some(d => d == "")) {
          validationRtn.status = 1;
          validationRtn.error = "All Groups/IDs are missing or null!";
          return validationRtn;
      }
      numerators.forEach((d, idx) => {
          validationRtn.messages[idx] = validationRtn.messages[idx] === ""
              ? ((d != null) ? "" : "Numerator missing")
              : validationRtn.messages[idx];
      });
      if (!validationRtn.messages.some(d => d == "")) {
          validationRtn.status = 1;
          validationRtn.error = "All numerators are missing or null!";
          return validationRtn;
      }
      numerators.forEach((d, idx) => {
          validationRtn.messages[idx] = validationRtn.messages[idx] === ""
              ? (!isNaN(d) ? "" : "Numerator is not a number")
              : validationRtn.messages[idx];
      });
      if (!validationRtn.messages.some(d => d == "")) {
          validationRtn.status = 1;
          validationRtn.error = "All numerators are not numbers!";
          return validationRtn;
      }
      numerators.forEach((d, idx) => {
          validationRtn.messages[idx] = validationRtn.messages[idx] === ""
              ? ((d >= 0) ? "" : "Numerator negative")
              : validationRtn.messages[idx];
      });
      if (!validationRtn.messages.some(d => d == "")) {
          validationRtn.status = 1;
          validationRtn.error = "All numerators are negative!";
          return validationRtn;
      }
      denominators.forEach((d, idx) => {
          validationRtn.messages[idx] = validationRtn.messages[idx] === ""
              ? ((d != null) ? "" : "Denominator missing")
              : validationRtn.messages[idx];
      });
      if (!validationRtn.messages.some(d => d == "")) {
          validationRtn.status = 1;
          validationRtn.error = "All denominators missing or null!";
          return validationRtn;
      }
      denominators.forEach((d, idx) => {
          validationRtn.messages[idx] = validationRtn.messages[idx] === ""
              ? (!isNaN(d) ? "" : "Denominator is not a number")
              : validationRtn.messages[idx];
      });
      if (!validationRtn.messages.some(d => d == "")) {
          validationRtn.status = 1;
          validationRtn.error = "All denominators are not numbers!";
          return validationRtn;
      }
      denominators.forEach((d, idx) => {
          validationRtn.messages[idx] = validationRtn.messages[idx] === ""
              ? ((d >= 0) ? "" : "Denominator negative")
              : validationRtn.messages[idx];
      });
      if (!validationRtn.messages.some(d => d == "")) {
          validationRtn.status = 1;
          validationRtn.error = "All denominators are negative!";
          return validationRtn;
      }
      if (data_type === "PR") {
          denominators.forEach((d, idx) => {
              validationRtn.messages[idx] = validationRtn.messages[idx] === ""
                  ? ((d >= numerators[idx]) ? "" : "Denominator < numerator")
                  : validationRtn.messages[idx];
          });
          if (!validationRtn.messages.some(d => d == "")) {
              validationRtn.status = 1;
              validationRtn.error = "All denominators are smaller than numerators!";
              return validationRtn;
          }
      }
      return validationRtn;
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

  /**
   * Truncates a number or array of numbers within specified limits.
   * @param val The number or array of numbers to be truncated.
   * @param limits The limits for truncation.
   * @returns The truncated number or array of numbers.
   */
  const truncate = broadcast_binary((val, limits) => {
      let rtn = val;
      if (limits.lower || limits.lower == 0) {
          rtn = (rtn < limits.lower ? limits.lower : rtn);
      }
      if (limits.upper) {
          rtn = (rtn > limits.upper ? limits.upper : rtn);
      }
      return rtn;
  });

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

  const formatValues = function (value, name, inputSettings, derivedSettings) {
      const suffix = derivedSettings.percentLabels ? "%" : "";
      const sig_figs = inputSettings.funnel.sig_figs;
      if (isNullOrUndefined(value)) {
          return "";
      }
      switch (name) {
          case "date":
              return value;
          case "integer": {
              return value.toFixed(0);
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

  /**
   * Checks if a value is a valid number (not null, undefined, NaN, or infinite).
   *
   * @param value The number to check.
   * @returns True if the value is a valid number, false otherwise.
   */
  function isValidNumber(value) {
      return !isNullOrUndefined(value) && !Number.isNaN(value) && Number.isFinite(value);
  }

  /**
   * Groups an array of objects by a specified key. This is a backwards-compatible
   * implementation of the ES2026 Object.groupBy method.
   *
   * @param data The array of objects to group.
   * @param key The key to group the objects by.
   * @returns An array of tuples, where each tuple contains a key and an array of objects with that key.
   */
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

  function drawDots(selection, visualObj) {
      const use_group_text = visualObj.viewModel.inputSettings.settings.scatter.use_group_text;
      /**
       * Use the join() call with custom enter & update functions so that we can
       *   create/update both text and circle elements for a given observation
       *   in a single pass
       */
      selection
          .selectAll(".dotsgroup")
          .selectAll(".dotsgroup-child")
          .data(visualObj.viewModel.plotPoints)
          .join((enter) => {
          const dataPoint = enter.append("g").classed("dotsgroup-child", true);
          if (use_group_text) {
              dataPoint.append("text").call(text_attributes, visualObj);
          }
          else {
              dataPoint.append("path").call(dot_attributes, visualObj);
          }
          dataPoint.call(dot_tooltips, visualObj);
          return dataPoint;
      }, (update) => {
          let current_text = update.select("text");
          let current_circle = update.select("path");
          if (use_group_text) {
              current_circle.remove();
              // The text element may not exist if use_group_text was previously false
              if (!(current_text.node())) {
                  current_text = update.append("text");
              }
              current_text.call(text_attributes, visualObj);
          }
          else {
              current_text.remove();
              if (!(current_circle.node())) {
                  current_circle = update.append("path");
              }
              current_circle.call(dot_attributes, visualObj);
          }
          return update;
      });
      selection.on('click', () => {
          visualObj.selectionManager.clear();
          visualObj.updateHighlighting();
      });
  }
  function dot_tooltips(selection, visualObj) {
      selection
          .on("click", (event, d) => {
          // Pass identities of selected data back to PowerBI
          visualObj
              .selectionManager
              .select(d.identity, (event.ctrlKey || event.metaKey))
              // Change opacity of non-selected dots
              .then(() => visualObj.updateHighlighting());
          event.stopPropagation();
      })
          // Display tooltip content on mouseover
          .on("mouseover", (event, d) => {
          // Get screen coordinates of mouse pointer, tooltip will
          //   be displayed at these coordinates
          const x = event.pageX;
          const y = event.pageY;
          visualObj.host.tooltipService.show({
              dataItems: d.tooltip,
              identities: [d.identity],
              coordinates: [x, y],
              isTouchEvent: false
          });
      })
          // Hide tooltip when mouse moves out of dot
          .on("mouseout", () => {
          visualObj.host.tooltipService.hide({
              immediately: true,
              isTouchEvent: false
          });
      });
  }
  // TODO(Andrew): Construct these attributes in the viewModel
  //   - Tricky as the plotProperties get updated when rendering X & Y axes
  //      to add padding when rendering out of frame
  function dot_attributes(selection, visualObj) {
      const ylower = visualObj.plotProperties.yAxis.lower;
      const yupper = visualObj.plotProperties.yAxis.upper;
      const xlower = visualObj.plotProperties.xAxis.lower;
      const xupper = visualObj.plotProperties.xAxis.upper;
      selection
          .attr("d", (d) => {
          const shape = d.aesthetics.shape;
          const size = d.aesthetics.size;
          return Symbol$1().type(d3[`symbol${shape}`]).size((size * size) * Math.PI)();
      })
          .attr("transform", (d) => {
          if (!between(d.value, ylower, yupper) || !between(d.x, xlower, xupper)) {
              return "translate(0, 0) scale(0, 0)";
          }
          return `translate(${visualObj.plotProperties.xScale(d.x)}, ${visualObj.plotProperties.yScale(d.value)})`;
      })
          .style("fill", (d) => {
          return d.aesthetics.colour;
      })
          .style("stroke", (d) => {
          return d.aesthetics.colour_outline;
      })
          .style("stroke-width", (d) => d.aesthetics.width_outline);
  }
  function text_attributes(selection, visualObj) {
      const ylower = visualObj.plotProperties.yAxis.lower;
      const yupper = visualObj.plotProperties.yAxis.upper;
      const xlower = visualObj.plotProperties.xAxis.lower;
      const xupper = visualObj.plotProperties.xAxis.upper;
      selection
          .attr("transform", (d) => {
          if (!between(d.value, ylower, yupper) || !between(d.x, xlower, xupper)) {
              return "translate(0, 0) scale(0, 0)";
          }
          return `translate(${visualObj.plotProperties.xScale(d.x)}, ${visualObj.plotProperties.yScale(d.value)})`;
      })
          .attr("dy", "0.35em")
          .text((d) => d.group_text)
          .style("text-anchor", "middle")
          .style("font-size", (d) => `${d.aesthetics.scatter_text_size}px`)
          .style("font-family", (d) => d.aesthetics.scatter_text_font)
          .style("fill", (d) => d.aesthetics.scatter_text_colour);
  }

  function drawLines(selection, visualObj) {
      selection
          .select(".linesgroup")
          .selectAll("path")
          .data(visualObj.viewModel.groupedLines)
          .join("path")
          .attr("d", d => {
          const ylower = visualObj.plotProperties.yAxis.lower;
          const yupper = visualObj.plotProperties.yAxis.upper;
          const xlower = visualObj.plotProperties.xAxis.lower;
          const xupper = visualObj.plotProperties.xAxis.upper;
          return line()
              .x(d => visualObj.plotProperties.xScale(d.x))
              .y(d => visualObj.plotProperties.yScale(d.line_value))
              .defined(d => {
              return d.line_value !== null
                  && between(d.line_value, ylower, yupper)
                  && between(d.x, xlower, xupper);
          })(d[1]);
      })
          .attr("fill", "none")
          .attr("stroke", d => {
          if (visualObj.viewModel.colourPalette.isHighContrast) {
              return visualObj.viewModel.colourPalette.foregroundColour;
          }
          return getAesthetic(d[0], "lines", "colour", visualObj.viewModel.inputSettings.settings);
      })
          .attr("stroke-width", d => getAesthetic(d[0], "lines", "width", visualObj.viewModel.inputSettings.settings))
          .attr("stroke-dasharray", d => getAesthetic(d[0], "lines", "type", visualObj.viewModel.inputSettings.settings));
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
          .attr("y2", plotProperties.height - plotProperties.yAxis.start_padding)
          .attr("stroke-width", "1px")
          .attr("stroke", colour)
          .style("stroke-opacity", 0);
      const yAxisLine = selection
          .select(".ttip-line-y")
          .attr("x1", plotProperties.xAxis.start_padding)
          .attr("x2", plotProperties.width - plotProperties.xAxis.end_padding)
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
          const yValue = (event.pageY - boundRect.top);
          let indexNearestValue;
          let nearestDistance = Infinity;
          let x_coord;
          let y_coord;
          for (let i = 0; i < plotPoints.length; i++) {
              const curr_x = plotProperties.xScale(plotPoints[i].x);
              const curr_y = plotProperties.yScale(plotPoints[i].value);
              const curr_diff = Math.abs(curr_x - xValue) + Math.abs(curr_y - yValue);
              if (curr_diff < nearestDistance) {
                  nearestDistance = curr_diff;
                  indexNearestValue = i;
                  x_coord = curr_x;
                  y_coord = curr_y;
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

  function drawXAxis(selection, visualObj, refresh) {
      const xAxisProperties = visualObj.plotProperties.xAxis;
      const xAxis = axisBottom(visualObj.plotProperties.xScale);
      if (xAxisProperties.ticks) {
          if (xAxisProperties.tick_count) {
              xAxis.ticks(xAxisProperties.tick_count);
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
          // Plots the axis at the correct height
          .attr("transform", `translate(0, ${xAxisHeight})`);
      const tickGroup = xAxisGroup
          .selectAll(".tick text")
          .attr("transform", "rotate(" + xAxisProperties.tick_rotation + ")")
          .attr("text-anchor", "middle")
          .attr("dx", null)
          .style("font-size", xAxisProperties.tick_size)
          .style("font-family", xAxisProperties.tick_font)
          .style("fill", displayPlot ? xAxisProperties.tick_colour : "#FFFFFF");
      if (xAxisProperties.tick_rotation != 0) {
          const textAnchor = xAxisProperties.tick_rotation < 0.0 ? "end" : "start";
          const dx = xAxisProperties.tick_rotation < 0.0 ? "-.8em" : ".8em";
          tickGroup.attr("text-anchor", textAnchor)
              .attr("dx", dx);
      }
      const xAxisNode = selection.selectAll(".xaxisgroup").node();
      if (!xAxisNode) {
          selection.select(".xaxislabel")
              .style("fill", displayPlot ? xAxisProperties.label_colour : "#FFFFFF");
          return;
      }
      const textX = visualObj.viewModel.svgWidth / 2;
      const textY = visualObj.plotProperties.yAxis.start_padding - visualObj.viewModel.inputSettings.settings.x_axis.xlimit_label_size * 0.5;
      xAxisGroup.select(".xaxislabel")
          .selectAll("text")
          .data([xAxisProperties.label])
          .join("text")
          .attr("x", 0)
          .attr("y", 0)
          .attr("transform", `translate(${textX}, ${textY})`)
          .style("text-anchor", "middle")
          .text(d => d)
          .style("font-size", xAxisProperties.label_size)
          .style("font-family", xAxisProperties.label_font)
          .style("fill", displayPlot ? xAxisProperties.label_colour : "#FFFFFF");
  }

  function drawYAxis(selection, visualObj, refresh) {
      const yAxisProperties = visualObj.plotProperties.yAxis;
      const yAxis = axisLeft(visualObj.plotProperties.yScale);
      const yaxis_sig_figs = visualObj.viewModel.inputSettings.settings.y_axis.ylimit_sig_figs;
      const sig_figs = yaxis_sig_figs === null ? visualObj.viewModel.inputSettings.settings.funnel.sig_figs : yaxis_sig_figs;
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
          // Right-align
          .style("text-anchor", "right")
          // Rotate tick labels
          .attr("transform", `rotate(${yAxisProperties.tick_rotation})`)
          // Scale font
          .style("font-size", yAxisProperties.tick_size)
          .style("font-family", yAxisProperties.tick_font)
          .style("fill", displayPlot ? yAxisProperties.tick_colour : "#FFFFFF");
      const textX = -(visualObj.plotProperties.xAxis.start_padding - visualObj.viewModel.inputSettings.settings.y_axis.ylimit_label_size * 1.5);
      const textY = visualObj.viewModel.svgHeight / 2;
      yAxisGroup.select(".yaxislabel")
          .selectAll("text")
          .data([visualObj.viewModel.inputSettings.settings.y_axis.ylimit_label])
          .join("text")
          .attr("x", textX)
          .attr("y", textY)
          .attr("transform", `rotate(-90, ${textX}, ${textY})`)
          .style("text-anchor", "middle")
          .text(d => d)
          .style("font-size", yAxisProperties.label_size)
          .style("font-family", yAxisProperties.label_font)
          .style("fill", yAxisProperties.label_colour);
  }

  function initialiseSVG(selection, removeAll = false) {
      if (removeAll) {
          selection.selectChildren().remove();
      }
      selection.append('line').classed("ttip-line-x", true);
      selection.append('line').classed("ttip-line-y", true);
      selection.append('g').classed("xaxisgroup", true).append('g').classed('xaxislabel', true);
      selection.append('g').classed("yaxisgroup", true).append('g').classed('yaxislabel', true);
      selection.append('g').classed("linesgroup", true);
      selection.append('g').classed("dotsgroup", true);
      selection.append('g').classed("text-labels", true);
  }

  function drawErrors(selection, options, message, type = null) {
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
              .style("font-size", "10px");
      }
      errMessageSVG.append('text')
          .attr("x", options.viewport.width / 2)
          .attr("y", options.viewport.height / 2)
          .style("text-anchor", "middle")
          .text(message)
          .style("font-size", "10px");
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
          // Get the angle and distance of label from the point
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
      "ul99": "above"
  };
  const insideMap = {
      "ll99": "above",
      "ll95": "above",
      "ll68": "above",
      "ul68": "below",
      "ul95": "below",
      "ul99": "below"
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

  /**
   * Generate (un-adjusted) z-scores using transformed
   * observations and standard errors
   *
   * @param y
   * @param SE
   * @param target
   * @returns
   */
  function getZScores(y, SE, target) {
      return divide(subtract(y, target), SE);
  }

  /**
   * Winsorise unadjusted z-scores to remove influence of
   *    extreme observations prior to assessing/correcting
   *    for dispersion.
   *
   * @param z
   * @returns
   */
  function winsoriseZScores(z) {
      const z_sorted = z.sort(function (a, b) { return a - b; });
      const lower_z = quantile(z_sorted, 0.1);
      const upper_z = quantile(z_sorted, 0.9);
      return winsorise(z, { lower: lower_z, upper: upper_z });
  }

  /**
   * Estimate the dispersion ratio of the observed responses using
   *    winsorised z-scores
   *
   * @param z_adj
   * @returns
   */
  function getPhi(z_adj) {
      return sum(square(z_adj)) / z_adj.length;
  }

  /**
   * Estimate the between-unit variance to adjust control limits
   *     by, using the DerSimonian & Laird Method-of-Moments estimator.
   *     If the dispersion ratio is not sufficiently large enough to warrant
   *     adjustment then this is fixed to zero.
   *
   * @param phi   - Sample dispersion ratio
   * @param SE    - Array of standard errors for each unit
   * @returns
   */
  function getTau2(phi, SE) {
      const N = SE.length;
      // Check for sufficient dispersion
      if (N * phi < N - 1) {
          return 0.0;
      }
      // Construct sample weights (inverse variances)
      const w = inv(square(SE));
      const w_sq = square(w);
      const w_sum = sum(w);
      const w_sq_sum = sum(w_sq);
      // Estimate variance
      const tau_num = (N * phi) - (N - 1.0);
      const tau_denom = w_sum - (w_sq_sum / w_sum);
      return tau_num / tau_denom;
  }

  class chartClass {
      getPlottingDenominators() {
          const maxDenominator = max(this.inputData.denominators);
          const plotDenomLower = 1;
          const plotDenomUpper = maxDenominator + maxDenominator * 0.1;
          const plotDenomStep = maxDenominator * 0.01;
          return seq(plotDenomLower, plotDenomUpper, plotDenomStep)
              .concat(this.inputData.denominators)
              .filter((d, i, arr) => arr.indexOf(d) === i)
              .sort((a, b) => a - b);
      }
      getTarget(par) {
          const targetFun = par.transformed ? this.targetFunctionTransformed : this.targetFunction;
          return targetFun(this.inputData);
      }
      getSE(par) {
          const seFun = par.odAdjust ? this.seFunctionOD : this.seFunction;
          if (par.plottingDenominators) {
              const dummyArray = JSON.parse(JSON.stringify(this.inputData));
              dummyArray.numerators = null;
              dummyArray.denominators = par.plottingDenominators;
              return seFun(dummyArray);
          }
          else {
              return seFun(this.inputData);
          }
      }
      getY() {
          return this.yFunction(this.inputData);
      }
      getTau2() {
          const targetOD = this.getTarget({ transformed: true });
          const seOD = this.getSE({ odAdjust: true });
          const yTransformed = this.getY();
          const zScores = getZScores(yTransformed, seOD, targetOD);
          const zScoresWinsorized = winsoriseZScores(zScores);
          const phi = getPhi(zScoresWinsorized);
          return getTau2(phi, seOD);
      }
      getTau2Bool() {
          const tauReturn = {
              "yes": true,
              "no": false,
              "auto": true
          };
          return tauReturn[this.inputSettings.settings.funnel.od_adjust];
      }
      getSingleLimit(par) {
          const limitFun = par.odAdjust ? this.limitFunctionOD : this.limitFunction;
          return limitFun(par.inputArgs);
      }
      getIntervals() {
          const probs = [0.001, 0.025, 0.16, 0.84, 0.975, 0.999];
          // Specify the intervals for the limits: 68%, 95% and 99.8%
          const qs = [
              -3.090232306167813,
              -1.9599639845400538,
              -0.9944578832097528,
              0.99445788320975281316,
              1.95996398454005360534,
              3.09023230616781319213
          ];
          const q_labels = ["ll99", "ll95", "ll68", "ul68", "ul95", "ul99"];
          return qs.map((d, idx) => {
              return {
                  prob: probs[idx],
                  quantile: d,
                  label: q_labels[idx]
              };
          });
      }
      getLimits() {
          const calculateTau2 = this.getTau2Bool();
          let odAdjust;
          let tau2;
          if (calculateTau2) {
              tau2 = this.getTau2();
              odAdjust = tau2 > 0;
          }
          else {
              tau2 = 0;
              odAdjust = false;
          }
          const target = this.getTarget({ transformed: false });
          const alt_target = this.inputSettings.settings.lines.alt_target;
          const target_transformed = this.getTarget({ transformed: true });
          const intervals = this.getIntervals();
          const plottingDenominators = this.getPlottingDenominators();
          const plottingSE = this.getSE({
              odAdjust: odAdjust,
              plottingDenominators: plottingDenominators
          });
          const calcLimits = plottingDenominators.map((denom, idx) => {
              const calcLimitEntries = new Array();
              calcLimitEntries.push(["denominators", denom]);
              intervals.forEach(interval => {
                  const functionArgs = {
                      p: interval.prob,
                      q: interval.quantile,
                      target: target,
                      target_transformed: target_transformed,
                      SE: plottingSE[idx],
                      tau2: tau2,
                      denominators: denom
                  };
                  const limit = this.getSingleLimit({
                      odAdjust: odAdjust,
                      inputArgs: functionArgs
                  });
                  calcLimitEntries.push([interval.label, limit]);
              });
              calcLimitEntries.push(["target", target]);
              calcLimitEntries.push(["alt_target", alt_target]);
              return Object.fromEntries(calcLimitEntries);
          });
          return calcLimits.map((d, idx) => {
              const inner = d;
              if (idx < (calcLimits.length - 1)) {
                  ["99", "95", "68"].forEach(type => {
                      const lower = `ll${type}`;
                      const upper = `ul${type}`;
                      if (inner[lower] > calcLimits[idx + 1][lower]) {
                          inner[lower] = undefined;
                      }
                      if (inner[upper] < calcLimits[idx + 1][upper]) {
                          inner[upper] = undefined;
                      }
                      if (inner[lower] >= inner[upper]) {
                          inner[lower] = undefined;
                          inner[upper] = undefined;
                      }
                  });
              }
              return inner;
          });
      }
      constructor(args) {
          this.seFunction = args.seFunction;
          this.seFunctionOD = args.seFunctionOD;
          this.targetFunction = args.targetFunction;
          this.targetFunctionTransformed = args.targetFunctionTransformed;
          this.yFunction = args.yFunction;
          this.limitFunction = args.limitFunction;
          this.limitFunctionOD = args.limitFunctionOD;
          this.inputData = args.inputData;
          this.inputSettings = args.inputSettings;
      }
  }

  class plotPropertiesClass {
      // Separate function so that the axis can be re-calculated on changes to padding
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
          const plotPoints = viewModel.plotPoints;
          const inputData = viewModel.inputData;
          const inputSettings = viewModel.inputSettings.settings;
          const derivedSettings = viewModel.inputSettings.derivedSettings;
          const colorPalette = viewModel.colourPalette;
          // Get the width and height of plotting space
          this.width = options.viewport.width;
          this.height = options.viewport.height;
          this.displayPlot = plotPoints
              ? plotPoints.length > 1
              : null;
          const xTickSize = inputSettings.x_axis.xlimit_tick_size;
          const yTickSize = inputSettings.y_axis.ylimit_tick_size;
          const xTicksCount = inputSettings.x_axis.xlimit_tick_count;
          const yTicksCount = inputSettings.y_axis.ylimit_tick_count;
          const xLowerLimit = inputSettings.x_axis.xlimit_l;
          let xUpperLimit = inputSettings.x_axis.xlimit_u;
          if (!isNullOrUndefined(inputData === null || inputData === void 0 ? void 0 : inputData.denominators)) {
              xUpperLimit = xUpperLimit ? xUpperLimit : max(inputData.denominators) * 1.1;
          }
          const leftLabelPadding = inputSettings.y_axis.ylimit_label
              ? inputSettings.y_axis.ylimit_label_size
              : 0;
          const lowerLabelPadding = inputSettings.x_axis.xlimit_label
              ? inputSettings.x_axis.xlimit_label_size + 20
              : 0;
          this.xAxis = {
              lower: xLowerLimit !== null && xLowerLimit !== void 0 ? xLowerLimit : 0,
              upper: xUpperLimit,
              start_padding: inputSettings.canvas.left_padding + leftLabelPadding,
              end_padding: inputSettings.canvas.right_padding,
              colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.x_axis.xlimit_colour,
              ticks: (xTicksCount !== null) ? (xTicksCount > 0) : inputSettings.x_axis.xlimit_ticks,
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
          const yLowerLimit = inputSettings.y_axis.ylimit_l;
          let yUpperLimit = inputSettings.y_axis.ylimit_u;
          if (!isNullOrUndefined(inputData === null || inputData === void 0 ? void 0 : inputData.numerators) && !isNullOrUndefined(inputData === null || inputData === void 0 ? void 0 : inputData.denominators)) {
              const maxRatio = max(divide(inputData.numerators, inputData.denominators));
              yUpperLimit !== null && yUpperLimit !== void 0 ? yUpperLimit : (yUpperLimit = maxRatio * derivedSettings.multiplier);
          }
          this.yAxis = {
              lower: yLowerLimit !== null && yLowerLimit !== void 0 ? yLowerLimit : 0,
              upper: yUpperLimit,
              start_padding: inputSettings.canvas.lower_padding + lowerLabelPadding,
              end_padding: inputSettings.canvas.upper_padding,
              colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.y_axis.ylimit_colour,
              ticks: (yTicksCount !== null) ? (yTicksCount > 0) : inputSettings.y_axis.ylimit_ticks,
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

  /**
   * Computes the Chebyshev polynomial approximation at a given point x
   * using the provided coefficients a and degree n.
   *
   * This implementation is a TypeScript adaptation of the chebyshev_eval
   * function from the R programming language.
   *
   * @param x The point at which to evaluate the Chebyshev polynomial
   * @param a The coefficients of the Chebyshev polynomial
   * @param n The degree of the Chebyshev polynomial
   * @returns The value of the Chebyshev polynomial at point x
   */
  function chebyshevPolynomial(x, a, n) {
      // Validate input range: Chebyshev polynomials are defined on [-1, 1]
      // Allow slight tolerance for numerical errors
      if (x < -1.1 || x > 1.1) {
          throw new Error("chebyshevPolynomial: x must be in [-1,1]");
      }
      if (n < 1 || n > 1000) {
          throw new Error("chebyshevPolynomial: n must be in [1,1000]");
      }
      // Clenshaw recurrence algorithm for evaluating Chebyshev series
      // Given: S(x) = sum_{k=0}^{n-1} a_k * T_k(x)
      // where T_k(x) are Chebyshev polynomials of the first kind
      const twox = x * 2;
      let b0 = 0; // Current term
      let b1 = 0; // Previous term
      let b2 = 0; // Two terms back
      // Recurrence: b_k = 2x * b_{k+1} - b_{k+2} + a_k
      // Iterate from highest degree term down to constant term
      for (let i = 1; i <= n; i++) {
          b2 = b1;
          b1 = b0;
          b0 = twox * b1 - b2 + a[n - i];
      }
      // Final result: S(x) = (b0 - b2) / 2
      return (b0 - b2) * 0.5;
  }

  /**
   * Numerically stable computation of sin(πx)
   *
   * This implementation is a TypeScript adaptation of the sinpi function
   * from the R programming language.
   *
   * @param x The input value
   * @returns The value of sin(πx)
   */
  function sinpi(x) {
      if (Number.isNaN(x) || !Number.isFinite(x)) {
          return Number.NaN;
      }
      // Reduce range to [-1, 1] using x % 2
      let r = x % 2;
      if (r <= -1) {
          r += 2;
      }
      else if (r > 1) {
          r -= 2;
      }
      // Handle exact cases to avoid floating point inaccuracies
      if (r === 0 || r === 1) {
          return 0; // sin(0), sin(2pi), etc
      }
      if (r === 0.5) {
          return 1; // sin(pi/2)
      }
      if (r === -0.5) {
          return -1; // sin(-pi/2)
      }
      // Compute standard sin(pi * r) for the reduced r
      return Math.sin(Math.PI * r);
  }

  /**
   * Computes the correction term for the logarithm of the gamma function for
   * large x (x >= 10).
   *
   * This implementation is a TypeScript adaptation of the lgammacor function
   * from the R programming language.
   *
   * @param x The input value for which to compute the correction term
   * @returns The correction term for the logarithm of the gamma function at x
   */
  function lgammaCorrection(x) {
      // Coefficients for the Chebyshev approximation
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
          // For intermediate values 10 <= x < ~9.5e7, use Chebyshev approximation
          const tmp = 10 / x;
          return chebyshevPolynomial(tmp * tmp * 2 - 1, algmcs, 5) / x;
      }
      else {
          // For very large x, use simple asymptotic approximation 1/(12x)
          return 1 / (x * 12);
      }
  }

  /**
   * Calculates the value of x multiplied by 2 raised to the power of exp: x * (2^exp)
   *
   * @param x Mantissa
   * @param exp Exponent
   * @returns The result of x multiplied by 2 raised to the power of exp
   */
  function ldexp(x, exp) {
      return x * Math.pow(2, exp);
  }

  /**
   * Computes the continued fraction for the calculation of sum_{k=0}^Inf x^k/(i+k*d)
   *
   * This implementation is a TypeScript adaptation of the logcf function
   * from the R programming language.
   *
   *
   * @param x The value of x in the continued fraction
   * @param i The initial index i
   * @param d The increment d
   * @param eps The desired precision epsilon
   * @returns The value of the continued fraction
   */
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
      // Evaluate continued fraction using modified Lentz's method
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
          // Rescale to prevent overflow/underflow
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

  /**
   * Computes log(1 + x) - x with improved accuracy for small values of x.
   *
   * This implementation is a TypeScript adaptation of the log1pmx function
   * from the R programming language.
   *
   * @param x The input value
   * @returns The value of log(1 + x) - x
   */
  function log1pmx(x) {
      if (x > 1 || x < -0.79149064) {
          // For values far from 0, standard calculation is sufficient
          return Math.log1p(x) - x;
      }
      else {
          // For values close to 0, use more precise approximations
          const r = x / (2 + x);
          const y = r * r;
          if (Math.abs(x) < 1e-2) {
              // For very small x, use Taylor series expansion:
              // 2 * r * (1/1 + 1/3*y + 1/5*y^2 + ...) - x
              const coefs = [2 / 3, 2 / 5, 2 / 7, 2 / 9];
              let result = 0;
              for (let i = 0; i < coefs.length; i++) {
                  result = (result + coefs[i]) * y;
              }
              return r * (result - x);
          }
          else {
              // For moderately small x, use continued fraction for log(1+x)
              return r * (2 * y * logcf(y, 3, 2, 1e-14) - x);
          }
      }
  }

  const LOG_TWO_PI = 1.837877066409345483560659472811;
  const LOG_SQRT_TWO_PI = 0.918938533204672741780329736406;
  const LOG_SQRT_PI_DIV_2 = 0.225791352644727432363097614947;
  const EULER = 0.5772156649015328606065120900824024;
  const SQRT_TWO_PI = 2.50662827463100050241576528481104525301;
  const TWO_PI = 6.283185307179586476925286766559;
  const SQRT_THIRTY_TWO = 5.656854249492380195206754896838;
  const ONE_DIV_SQRT_TWO_PI = 0.398942280401432677939946059934;

  /**
   * Computes the natural logarithm of the gamma function at (1 + a): ln(Γ(1 + a)),
   * providing improved accuracy for small values of a.
   *
   * This implementation is based on a series expansion and continued fraction
   * approximation for better numerical stability when a is close to zero.
   *
   * The below implementation is a TypeScript adaptation of the lgamma1p function
   * from the R programming language.
   *
   * @param a The input value for which to compute lgamma1p
   * @returns The natural logarithm of the gamma function at (1 + a): ln(Γ(1 + a))
   */
  function lgamma1p(a) {
      if (Math.abs(a) >= 0.5) {
          return lgamma(a + 1);
      }
      // Coefficients for the polynomial approximation of ln(gamma(1+x))
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
      // Use continued fraction approximation for the tail of the expansion
      let lgam = c * logcf(-a / 2, N + 2, 1, 1e-14);
      // Evaluate the polynomial using Horner's method
      for (let i = N - 1; i >= 0; i--) {
          lgam = coeffs[i] - a * lgam;
      }
      return (a * lgam - EULER) * a - log1pmx(a);
  }

  /**
   * Computes the (log) Stirling's error term for a given n.
   *
   * This implementation is a TypeScript adaptation of the stirlerr
   * function from the R programming language.
   *
   * @param n The input value for which to compute the Stirling's error term
   * @returns The Stirling's error term for the input n
   */
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
      // If n is a half-integer <= 15, use precomputed table
      if (n <= 15 && nn === Math.trunc(nn)) {
          return sferr_halves[nn];
      }
      // Direct calculation for small values (n <= 5.25) to avoid loss of precision
      if (n <= 5.25) {
          if (n >= 1) {
              const l_n = Math.log(n);
              return lgamma(n) + n * (1 - l_n) + ldexp(l_n - LOG_TWO_PI, -1);
          }
          else {
              return lgamma1p(n) - (n + 0.5) * Math.log(n) + n - LOG_SQRT_TWO_PI;
          }
      }
      // Determine the number of terms in the series expansion based on the magnitude of n.
      // Larger n requires fewer terms for the same precision.
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
      // Evaluate the series expansion using Horner's method
      nn = n * n;
      let sum = s_coeffs[start_coeff];
      for (let i = start_coeff - 1; i >= 0; i--) {
          sum = s_coeffs[i] - sum / nn;
      }
      return sum / n;
  }

  /**
   * Computes the gamma function Γ(x) for a given input x.
   *
   * This implementation is a TypeScript adaptation of the gamma function
   * from the R programming language.
   *
   * @param x - The input value for which to compute the gamma function
   * @returns The value of the gamma function at x
   */
  function gamma(x) {
      // Coefficients for the Chebyshev approximation
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
      // Gamma function has singularities at zero and negative integers.
      if (x == 0 || (x < 0 && x === Math.trunc(x))) {
          return Number.NaN;
      }
      let y = Math.abs(x);
      let value;
      // Use Chebyshev polynomial approximation for small values (|x| <= 10).
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
          // Handle negative range by recursion: Gamma(z) = Gamma(z+1) / z
          if (n < 0) {
              // Check for proximity to non-positive integers (singularities)
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
              // Handle positive range recursion: Gamma(z+1) = z * Gamma(z)
              for (let i = 1; i <= n; i++) {
                  value *= (y + i);
              }
              return value;
          }
      }
      else {
          // Check for overflow (Gamma(172) > Number.MAX_VALUE).
          if (x > 171.61447887182298) {
              return Number.POSITIVE_INFINITY;
          }
          // For very small negative numbers, Gamma approaches zero.
          if (x < -170.5674972726612) {
              return 0;
          }
          // For integer values <= 50, compute factorial directly.
          if (y <= 50 && y == Math.trunc(y)) {
              value = 1;
              for (let i = 2; i < y; i++) {
                  value *= i;
              }
          }
          else {
              // For larger values, use Stirling's approximation
              const two_y = 2 * y;
              value = Math.exp((y - 0.5) * Math.log(y) - y + LOG_SQRT_TWO_PI
                  + ((two_y == Math.trunc(two_y)) ? stirlingError(y) : lgammaCorrection(y)));
          }
          if (x > 0) {
              return value;
          }
          // Reflection formula for negative numbers: Gamma(x) = -pi / (x * sin(pi*x) * Gamma(-x))
          const sinpiy = sinpi(y);
          return (sinpiy === 0) ? Number.POSITIVE_INFINITY : -Math.PI / (y * sinpiy * value);
      }
  }

  /**
   * Computes the natural logarithm of the absolute value of the
   * gamma function: ln|Γ(x)|
   *
   * This implementation is a TypeScript adaptation of the lgamma function
   * from the R programming language.
   *
   * @param x - The input value for which to compute lgamma
   * @returns The natural logarithm of the absolute value of the gamma function at x
   */
  function lgamma(x) {
      if (Number.isNaN(x)) {
          return Number.NaN;
      }
      // Gamma function has singularities at non-positive integers.
      // The limit of |Gamma(x)| approaches infinity, so lgamma approaches infinity.
      if (x <= 0 && x === Math.trunc(x)) {
          return Number.POSITIVE_INFINITY;
      }
      const y = Math.abs(x);
      // For very small numbers, Gamma(x) ~ 1/x, so lgamma(x) ~ -ln(x)
      if (y < 1e-306) {
          return -Math.log(y);
      }
      // For small numbers, compute Gamma directly and take the log.
      // This avoids complexity of approximation for this range.
      if (y <= 10) {
          return Math.log(Math.abs(gamma(x)));
      }
      // Check for overflow.
      if (y > Number.MAX_VALUE) {
          return Number.POSITIVE_INFINITY;
      }
      if (x > 0) {
          // For very large positive numbers, use a simplified Stirling's approximation:
          // ln(Gamma(x)) ~ x * (ln(x) - 1)
          if (x > 1e17) {
              return x * (Math.log(x) - 1);
          }
          else {
              // For moderately large positive numbers, use a more precise Stirling's approximation
              // with correction terms.
              return LOG_SQRT_TWO_PI + (x - 0.5) * Math.log(x) - x
                  + ((x > 4934720) ? 0 : lgammaCorrection(x));
          }
      }
      // Reflection formula for negative numbers:
      // Gamma(1-z) * Gamma(z) = pi / sin(pi * z)
      // Used to compute lgamma for negative x using positive y = |x|.
      return LOG_SQRT_PI_DIV_2 + (x - 0.5) * Math.log(y)
          - x - Math.log(Math.abs(sinpi(y))) - lgammaCorrection(y);
  }

  /**
   * Decomposes a floating-point number into its mantissa and exponent, such that:
   * value = mantissa * 2^exponent, with mantissa in the range [0.5, 1) or 0.
   *
   * @param value The floating-point number to decompose.
   * @returns An object containing the mantissa and exponent.
   */
  function frexp(value) {
      // Handle zero as a special case
      if (value === 0) {
          return { mantissa: 0, exponent: 0 };
      }
      // Use DataView to access the raw IEEE 754 binary representation
      // Float64 format: 1 sign bit | 11 exponent bits | 52 mantissa bits
      const data = new DataView(new ArrayBuffer(8));
      data.setFloat64(0, value);
      // Extract the 11-bit exponent field from the high 32 bits
      // Bits 20-30 of the high word contain the exponent (after masking with 0x7FF)
      let bits = (data.getUint32(0) >>> 20) & 0x7FF;
      // Handle subnormal (denormalized) numbers
      // Subnormal numbers have exponent field = 0 and represent values very close to zero
      if (bits === 0) {
          // Scale up by 2^64 to normalize, then adjust exponent back
          data.setFloat64(0, value * Math.pow(2, 64));
          bits = ((data.getUint32(0) >>> 20) & 0x7FF) - 64;
      }
      // Convert biased exponent to actual exponent
      // IEEE 754 uses bias of 1023, but we want mantissa in [0.5, 1), so use 1022
      const exponent = bits - 1022;
      // Compute mantissa by dividing out the power of 2
      // Result will be in the range [0.5, 1) for positive numbers
      const mantissa = value / Math.pow(2, exponent);
      return { mantissa: mantissa, exponent: exponent };
  }

  const bd0_scale = [
      [0.69314718246459961, -1.9046542121259336e-9, -878318373858934e-31, 3.0618407385293692e-24],
      [0.68530404567718506, -4.2578264469739224e-8, -11723105396588968e-31, 6.2033926372016101e-23],
      [0.67739880084991455, 2.2741890148836319e-08, 1.4411920431605914e-15, 7.0463845466501636e-23],
      [0.66993057727813721, -4.8293856025338755e-8, -8664795531738382e-31, 7.0495576607553246e-24],
      [0.66240608692169189, -4.791602492559832e-8, -2161508226230938e-30, 7.0929683608252748e-23],
      [0.65482449531555176, 6.2377152332260266e-09, 1.1806699607549086e-16, 6.6603235335351226e-25],
      [0.64718508720397949, -4.220866856030625e-8, -13817589176253094e-31, -11159932395766606e-39],
      [0.64000189304351807, -4.979170142860312e-8, 4.8870137639076255e-16, 1.6847465694533583e-23],
      [0.6327667236328125, -5.406177194799966e-8, -27224545250006775e-31, -29070780223955397e-39],
      [0.62495613098144531, 3.285935434860221e-08, 1.2016729367754671e-16, -8668233185091897e-39],
      [0.61813735961914062, -6406189467789147e-26, 3.5505809623358779e-18, -3623679406748965e-40],
      [0.61074161529541016, 4.2298538005525188e-08, 1.5481432935203661e-15, -5446353118719766e-38],
      [0.60329079627990723, 5.5158174916414282e-08, 2.1193636784238266e-15, 1.2471098264106631e-22],
      [0.59632217884063721, 3.2813538553000399e-09, -14033469816541837e-32, 5.5440619826430738e-24],
      [0.58930456638336182, 4.3079985800886789e-08, -32446651600595306e-31, -2569782398567476e-38],
      [0.58223748207092285, -3.983067387025585e-8, 2.9387905513776885e-15, 1.6124430498687833e-22],
      [0.57511997222900391, 2.2423840562169062e-09, -2204516403537114e-32, 4.0785437537513542e-25],
      [0.5685046911239624, 4.4228706030935427e-08, 2.7879957109977287e-16, -9741708794029408e-39],
      [0.56184542179107666, 2.1471613820267521e-08, 1.3374919170106156e-15, -2326922260336506e-38],
      [0.55458080768585205, 4.5778349999636703e-09, 2.6331459121410258e-16, 2.0709959033879981e-23],
      [0.54782783985137939, -7.667999568639061e-9, 6.1990953277753225e-16, 6.3419790110560228e-24],
      [0.54102897644042969, -3.7302321231891256e-8, -33801781496424835e-31, 1.4469198371142414e-22],
      [0.53475570678710938, 4.3828919160660007e-08, -8601820749692393e-31, -8775950563978016e-39],
      [0.52786707878112793, 1.0839714903454478e-08, -4480281248130319e-31, 3.8840996084516777e-23],
      [0.52151048183441162, 4.2031594205127476e-08, 1.211009992711288e-15, -23206744819671555e-39],
      [0.51452970504760742, -1.2322940889930578e-8, 2.8200844954132738e-16, 1.880026562185923e-23],
      [0.50808751583099365, -1.2297126872340414e-8, -4295835588700959e-31, -18036626177499945e-39],
      [0.50160348415374756, 5.9145378372704727e-08, 1.2728561033550608e-15, -5824094430019416e-38],
      [0.49507725238800049, 1.4409851090135817e-08, -6381910184083422e-32, -3500509376717118e-40],
      [0.48910707235336304, 2.7457986107037868e-08, -14470418644525664e-31, 4.2118668969499388e-23],
      [0.48249846696853638, 1.7622454606680549e-08, 4.128675224747099e-16, 2.6082691866392177e-23],
      [0.4764525294303894, -1.2470243504481004e-8, -9162193924794196e-32, 3.7657825422403758e-24],
      [0.46975946426391602, -5.450353945946063e-9, -4304846960468561e-31, 2.0747103437070831e-25],
      [0.46363574266433716, -1.7013046527125653e-9, 7.6016227388785886e-18, -20415879231895994e-41],
      [0.45747429132461548, 6.9436845162584859e-10, -25461310777374286e-33, 5.5412533419976475e-25],
      [0.45127463340759277, 1.0731865174307131e-08, 6.374000219845047e-16, 3.9015473184089939e-23],
      [0.44503629207611084, 2.8650656958006948e-08, -9155352545558342e-31, -47365878254772817e-39],
      [0.43938833475112915, 2.6186132373595683e-08, 1.3619601577579505e-15, -52672794844240613e-39],
      [0.4330751895904541, 1.9065733880552216e-08, 1.0143192014799461e-15, 1.0145670737413337e-22],
      [0.42735910415649414, -1.141359362577532e-8, 1.3242044582274781e-16, -10240055893684678e-39],
      [0.42096930742263794, -1.2778508917676845e-8, 6.1435257312707041e-16, 1.419242178938019e-23],
      [0.41518336534500122, -7.767916088141646e-9, 5.9554431241240708e-16, 2.732668133771502e-23],
      [0.40936374664306641, 1.8807551072086426e-09, 1.9153331349462894e-16, -56208063158075e-37],
      [0.40351009368896484, -2.0416603518924603e-8, -293405013148838e-30, 1.8943469119705811e-24],
      [0.39762192964553833, 1.0016001361634608e-09, 2.2863242352463633e-17, 9.4581336117707638e-25],
      [0.39169889688491821, 1.5459097113534881e-08, 1.0962823446210085e-15, 3.1083022398211258e-23],
      [0.38640439510345459, -2.076412375373593e-9, 1.5073464810114547e-16, 7.4124494543750944e-24],
      [0.38041436672210693, -8.244395388601333e-9, 1.4866224964678982e-16, -3927292740683968e-39],
      [0.37438821792602539, 9.1585299344387749e-09, 5.6569190673585014e-16, 3.4213474905617904e-23],
      [0.36900103092193604, -2.2253590969967263e-8, 6.2314053995483377e-16, -21564751355837555e-39],
      [0.36358463764190674, -2.6778728567933285e-8, -9943908455716573e-31, -4704929732945495e-39],
      [0.35745590925216675, -2.033036139437172e-8, -15794492077344114e-31, 6.3186780320680572e-23],
      [0.35197639465332031, 2.8503858828798911e-08, -9566434575519799e-31, -6409595040255684e-39],
      [0.3464667797088623, -1.236265312343221e-8, -6003368248279719e-31, -2860901497105794e-39],
      [0.34092658758163452, -6110413286464222e-25, 1.7467136243918857e-17, 1.9962587429804357e-25],
      [0.33535552024841309, 2.167272583619706e-08, -10918773497788125e-31, -3047574780704126e-38],
      [0.33045530319213867, -1.608884048209802e-8, -3833435008838916e-31, -7683741875124221e-39],
      [0.32482540607452393, 2.8016703623734429e-08, -20725720961098414e-32, 1.3160777896524739e-23],
      [0.31916368007659912, 2.6222629401218001e-08, -13995222573204161e-31, 8.5998839096808329e-23],
      [0.31418323516845703, 2.6826626253750874e-08, -9792556373536439e-31, 2.2954960929108544e-23],
      [0.3084607720375061, 1.3683509436646091e-08, 5.5919950507426434e-16, -11938701403427125e-39],
      [0.30342662334442139, -8.629042369534545e-9, -5222554219259392e-31, 3.228770766379237e-23],
      [0.2983669638633728, 8.6884242023188563e-09, 2.7641167934234459e-16, -10171858868428321e-39],
      [0.29255300760269165, -4.91631446664087e-9, 2.5622847239605072e-16, -26341575505102177e-39],
      [0.28743791580200195, -1.3782395669181824e-8, 7.2903935187764498e-16, -4431977943282236e-39],
      [0.28229647874832153, 2.3770866164340987e-08, 6.4492283922642536e-16, 3.4175369768452108e-23],
      [0.27712851762771606, 1.4733029018998423e-08, 6.793364114448283e-16, 3.5938980340322221e-24],
      [0.27193373441696167, -1.8933320689029642e-8, 7.7793941095558299e-16, 2.5919724247426189e-23],
      [0.2667117714881897, 1.4300387263244119e-11, -7458876800955772e-34, 4.247418782257993e-26],
      [0.26221400499343872, 7.8022193150673047e-09, 5.0224310387675386e-16, -24063174816868367e-39],
      [0.25694090127944946, 2.9618050234603288e-08, 7.2795282036455453e-16, 2.638556081145549e-23],
      [0.25163990259170532, -6.44787778725231e-9, 4.1220281336935209e-16, 7.4275592961536977e-24],
      [0.24707368016242981, -1.9981829524340355e-9, -10909757890855787e-32, 6.2365520898082133e-24],
      [0.24171993136405945, 5.5230859885568862e-09, -2686547633696265e-31, -2764495989170092e-39],
      [0.23710808157920837, 1.0085374313462125e-08, -4775626813761317e-31, 2.3306205980323631e-23],
      [0.231700599193573, -1.3946383603524737e-8, 1.0970921279709183e-17, 3.229909378627549e-25],
      [0.22704219818115234, -6.451284839670279e-9, -42529947798112047e-32, -10260254677162862e-39],
      [0.2223619818687439, 1.4110645096820917e-08, 6.0255689818272543e-16, 1.9385180739531644e-23],
      [0.21765980124473572, -8.286782815503102e-9, 5.2323639195797807e-16, 5.0784435386540659e-23],
      [0.21214580535888672, -8.254218641923217e-9, 3.2555531333217742e-16, 1.5714300136341619e-23],
      [0.20739519596099854, -1.6149279691290985e-9, 2.1131592679643073e-17, 1.4275617427027514e-24],
      [0.20262190699577332, 8.5976399333276277e-09, -33804619056798137e-32, 2.5623235609364303e-24],
      [0.19782572984695435, 1.348296585490516e-08, -32024568730231384e-32, -25712252251631252e-39],
      [0.19300645589828491, 9.9568597811128257e-10, 9.0016745638446061e-17, -3754797654135173e-39],
      [0.18897256255149841, 4.2415360113068346e-09, 3.8086815297465933e-16, -21147402916208568e-39],
      [0.18411031365394592, 6.9310548411749551e-09, -34784858522920016e-32, 2.4665943434547742e-23],
      [0.17922431230545044, 5.0739235035734964e-09, 3.2221329189922637e-16, -10379009008973928e-39],
      [0.17431432008743286, 3.7943852504440656e-09, 3.1900668985871761e-16, 2.0292714723890484e-23],
      [0.17020416259765625, 3.4223344158590407e-09, -18846416901959178e-32, 1.1415315069779235e-23],
      [0.16524958610534668, -1.3210039284672348e-8, -23213954359040806e-32, 3.0430542132867571e-24],
      [0.16027030348777771, 6.0079221597675314e-09, -7521047737154288e-32, -12649106048711768e-41],
      [0.15610191226005554, -1.2301535790015805e-8, 3.0175617567361414e-16, -8633806506327147e-39],
      [0.15191605687141418, -1.4845571882915465e-8, -3265830289949929e-31, -15268151962784823e-39],
      [0.14686977863311768, -4.6748995785605985e-9, -4294291341758996e-31, 1.328295982896899e-23],
      [0.14264500141143799, 9.1864720275225409e-09, -8049373155998929e-31, 1.437998766909278e-23],
      [0.1384023129940033, 9.8651167235175308e-09, -8837306496940929e-31, 7.2953249091942152e-24],
      [0.1332872211933136, 9.9903507688736681e-10, 3.3169466107343579e-17, 2.7351440526086287e-24],
      [0.12900456786155701, -7.46120853989396e-9, -6212113165383437e-31, 1.8551872649897312e-24],
      [0.12470348179340363, -3.2924463155836747e-9, -7404120132741752e-32, 1.3246955625609024e-24],
      [0.12038381397724152, 3.3791991427278845e-09, 1.6214981996371606e-16, -600070673940474e-38],
      [0.11604541540145874, 3.5638392237302696e-10, -7354219635108878e-33, 7.794312440645008e-26],
      [0.11168810725212097, 3.1367659580894269e-09, -8994406293238225e-34, -7920937558182207e-41],
      [0.10731174051761627, -4.728527791542092e-9, -42976339455270984e-32, 5.3511432872581071e-24],
      [0.10291612148284912, 2.8332007850906393e-09, 4.9257427572340523e-17, 2.794436810397303e-24],
      [0.098501101136207581, 4.9707251648101192e-09, 4.1305127568470488e-16, 6.3134495605958654e-25],
      [0.094066515564918518, -6.525850970717784e-9, -13492816627243298e-32, -9079650179574527e-39],
      [0.08961215615272522, 2.5369617517867482e-09, 1.6110664594961319e-16, -5189504504486964e-39],
      [0.086034342646598816, -5.304795713811927e-9, 5.127575488441481e-17, 1.4636155456921331e-24],
      [0.081543982028961182, 2.0112156384755053e-09, 8.0657693315776084e-17, -30150319017810437e-40],
      [0.077033370733261108, 5.7495661565098999e-09, -2503851097302985e-31, -1846143093040508e-38],
      [0.07250232994556427, 1.177662634077592e-09, -3525476857925506e-32, 1.3164077898906505e-24],
      [0.068862661719322205, -7.043545302565235e-9, 2.4971240675150099e-16, 1.0686882487619963e-23],
      [0.064294353127479553, -2.422082090447475e-9, -20555896149129847e-32, 8.602907613530545e-24],
      [0.0606246218085289, 7.9059432611661151e-12, -8270443345471096e-34, -23533820836754142e-42],
      [0.056018441915512085, -5139745296034448e-25, -3811651571366802e-32, 1.9072195442219776e-24],
      [0.052318163216114044, -3.5574325707443677e-9, 9.1911558341453931e-17, -5321463973420977e-39],
      [0.04767347127199173, -1.8026349302147082e-9, 1.0329634289704177e-16, -22283569301283993e-40],
      [0.043942123651504517, -1.795005699634089e-9, -53817402974104447e-33, -13996196977941442e-40],
      [0.040196798741817474, 3.8451930528538014e-10, -24485452721520977e-33, -7386769024377949e-41],
      [0.0354953333735466, -35901653872016936e-26, -2073207767866976e-32, -2412097216555168e-41],
      [0.0317181795835495, 6.8723504664802704e-10, -6430478093749473e-33, 1.3508692031871337e-25],
      [0.027926705777645111, 7.5687733858131878e-10, -422031585165944e-31, 2.5347605636927818e-24],
      [0.02412080392241478, -1.1255707477175747e-9, 4.89700584100947e-17, 1.4172214525647275e-24],
      [0.019342962652444839, 1.9068610579431322e-10, -10635946218849709e-33, -5300489542457734e-40],
      [0.015504186972975731, -43701048335620385e-26, 6.6110615476371497e-18, 2.5398086818405174e-25],
      [0.011650616303086281, 9.1688900916153671e-10, -15848697818454755e-33, -1350491609984469e-39],
      [0.0077821407467126846, -3046577434773212e-25, 7.7934359967622851e-18, 4.6601001482083692e-25],
      [0.0038986406289041042, -21324678134426733e-26, 1.2541658163801307e-19, 8.7450354317401229e-27],
      [0, 0, 0, 0]
  ];
  /**
   * Helper function to add high and low parts of a number.
   *
   * @param d Number to add
   * @param yh Existing high part
   * @param yl Existing low part
   * @returns High and low parts after addition
   */
  function addHighLow(d, yh, yl) {
      const d1 = Math.floor(d + 0.5);
      const d2 = d - d1;
      return { yh: yh + d1, yl: yl + d2 };
  }
  /**
   * Compute the binomial deviance term for providing higher precision in
   * binomial calculations.
   *
   * This function returns an object with two properties: `yh` and `yl`, which
   * represent the high and low parts of the computed binomial deviance, respectively.
   *
   * This implementation is adapted from the ebd0 function in R's source code.
   *
   * @param x The observed number of successes.
   * @param M The expected number of successes.
   * @returns An object containing the high (`yh`) and low (`yl`) parts of the binomial deviance.
   */
  function binomialDeviance(x, M) {
      const Sb = 10;
      const S = 1 << Sb;
      const N = 128; // Table size factor
      let yh = 0, yl = 0;
      // Handle special cases matching R's dbinom logic
      if (x === M) {
          return { yh: 0, yl: 0 };
      }
      if (x === 0) {
          return { yh: M, yl: 0 };
      }
      if (M === 0) {
          return { yh: Number.POSITIVE_INFINITY, yl: 0 };
      }
      if (M / x === Number.POSITIVE_INFINITY) {
          // This case happens when x is very small relative to M
          return { yh: M, yl: 0 };
      }
      // Argument reduction: M/x = 2^e * r
      let { mantissa: r, exponent: e } = frexp(M / x);
      // Check for potential overflow
      if (Math.LN2 * -e > 1 + Number.MAX_VALUE / x) {
          return { yh: Number.POSITIVE_INFINITY, yl: 0 };
      }
      // Calculate table index and interpolation factor
      const i = Math.floor((r - 0.5) * (2 * N) + 0.5);
      const f = Math.floor(S / (0.5 + i / (2.0 * N)) + 0.5);
      const fg = ldexp(f, -(e + Sb));
      if (fg === Number.POSITIVE_INFINITY) {
          return { yh: Number.POSITIVE_INFINITY, yl: 0 };
      }
      // First term of the expansion
      ({ yh, yl } = addHighLow(-x * log1pmx((M * fg - x) / x), yh, yl));
      if (fg === 1) {
          return { yh: yh, yl: yl };
      }
      // Add terms from the precomputed scale table
      for (let j = 0; j < 4; j++) {
          ({ yh, yl } = addHighLow(x * bd0_scale[i][j], yh, yl));
          ({ yh, yl } = addHighLow(-x * bd0_scale[0][j] * e, yh, yl));
          if (!Number.isFinite(yh)) {
              return { yh: Number.POSITIVE_INFINITY, yl: 0 };
          }
      }
      // Final adjustment
      ({ yh, yl } = addHighLow(M, yh, yl));
      ({ yh, yl } = addHighLow(-M * fg, yh, yl));
      return { yh: yh, yl: yl };
  }

  /**
   * Calculates the Poisson density function for a given continuous x and lambda.
   *
   * The implementation is adapted from the dpois_raw function in R's source code.
   *
   * @param x The point at which to evaluate the density.
   * @param lambda The rate parameter of the Poisson distribution.
   * @param log_p If true, probabilities p are given as log(p).
   * @returns The value of the Poisson density function at x.
   */
  function poissonDensity(x, lambda, log_p) {
      const zeroBound = log_p ? Number.NEGATIVE_INFINITY : 0;
      // Handle degenerate case: lambda = 0 is a point mass at x = 0
      if (lambda === 0) {
          return (x === 0) ? (log_p ? 0 : 1) : zeroBound;
      }
      // Invalid inputs
      if (!Number.isFinite(lambda) || x < 0) {
          return zeroBound;
      }
      // For very small x relative to lambda, use limit: f(x) ≈ exp(-lambda)
      if (x <= lambda * Number.MIN_VALUE) {
          return log_p ? -lambda : Math.exp(-lambda);
      }
      // For very small lambda relative to x, use direct formula
      // f(x) = exp(-lambda + x*log(lambda) - log(Gamma(x+1)))
      if (lambda < x * Number.MIN_VALUE) {
          if (!Number.isFinite(x)) {
              return zeroBound;
          }
          const rtn = -lambda + x * Math.log(lambda) - lgamma1p(x);
          return log_p ? rtn : Math.exp(rtn);
      }
      // General case: use Stirling's approximation for improved precision
      // f(x) = exp(-stirlingError(x) - binomialDeviance(x, lambda)) / sqrt(2*pi*x)
      // This formulation avoids catastrophic cancellation for x ≈ lambda
      let { yh, yl } = binomialDeviance(x, lambda);
      yl += stirlingError(x);
      // Handle very large x separately to avoid overflow in sqrt(2*pi*x)
      let Lrg_x = (x >= Number.MAX_VALUE);
      let r = Lrg_x ? SQRT_TWO_PI * Math.sqrt(x)
          : TWO_PI * x;
      return log_p ? -yl - yh - (Lrg_x ? Math.log(r) : 0.5 * Math.log(r))
          : Math.exp(-yl) * Math.exp(-yh) / (Lrg_x ? r : Math.sqrt(r));
  }

  /**
   * Computes the Poisson density for the previous value (x_plus_1 - 1).
   *
   * The implementation is adapted from the dpois_raw function in R's source code.
   *
   * @param x_plus_1 The value x + 1 for which to compute the Poisson density.
   * @param lambda The rate parameter of the Poisson distribution.
   * @param log_p If true, returns the log of the density; otherwise, returns the density.
   * @returns The Poisson density or its logarithm for the previous value.
   */
  function poissonDensityPrev(x_plus_1, lambda, log_p) {
      // Handle infinite lambda
      if (!Number.isFinite(lambda)) {
          return log_p ? Number.NEGATIVE_INFINITY : 0;
      }
      // For x >= 1, directly compute poissonDensity(x, lambda)
      if (x_plus_1 > 1) {
          return poissonDensity(x_plus_1 - 1, lambda, log_p);
      }
      // For x < 1, use relationship: f(x) = f(x+1) * (x+1) / lambda
      // In log scale: log(f(x)) = log(f(x+1)) + log(x+1) - log(lambda)
      let rtn;
      // Cutoff for when lambda is very large relative to |x|
      const M_cutoff = 3.196577161300664E18;
      if (lambda > Math.abs(x_plus_1 - 1) * M_cutoff) {
          // For very large lambda, use direct formula
          // log(f(x)) = -lambda - log(Gamma(x+1))
          rtn = -lambda - lgamma(x_plus_1);
      }
      else {
          // Use recurrence relation: f(x) = f(x+1) * (x+1) / lambda
          const d = poissonDensity(x_plus_1, lambda, true);
          rtn = d + Math.log(x_plus_1) - Math.log(lambda);
      }
      return log_p ? rtn : Math.exp(rtn);
  }

  /**
   * Continued fraction representation for incomplete gamma function
   * ~=  (y / d) * [1 +  (1-y)/d +  O( ((1-y)/d)^2 ) ]
   *
   * @param y First parameter
   * @param d Second parameter
   * @returns Continued fraction value
   */
  function gammaContFrac(y, d) {
      // Handle trivial case
      if (y == 0) {
          return 0;
      }
      // Initial approximation: f0 = y/d
      let f0 = y / d;
      // If y is approximately 1, return the simple ratio
      if (Math.abs(y - 1) < Math.abs(d) * Number.EPSILON) {
          return f0;
      }
      // Clamp f0 to 1 for numerical stability
      if (f0 > 1) {
          f0 = 1;
      }
      // Initialize recurrence coefficients for continued fraction
      // The continued fraction is evaluated using the modified Lentz algorithm
      let c3;
      let c2 = y;
      let c4 = d;
      // a1/b1 and a2/b2 are successive convergents of the continued fraction
      let a1 = 0;
      let b1 = 1;
      let a2 = y;
      let b2 = d;
      // Scale factor to prevent overflow in intermediate calculations
      const scalefactor = 1.157921e+77;
      // Initial scaling if needed
      while (b2 > scalefactor) {
          a1 /= scalefactor;
          b1 /= scalefactor;
          a2 /= scalefactor;
          b2 /= scalefactor;
      }
      let i = 0;
      let of = -1; // Previous value of f for convergence check
      let f = 0.0; // Current convergent value
      // Main iteration loop: compute successive convergents
      // Each iteration computes two terms of the continued fraction
      while (i < 200000) {
          // First term of the pair
          i++;
          c2--;
          c3 = i * c2;
          c4 += 2;
          a1 = c4 * a2 + c3 * a1;
          b1 = c4 * b2 + c3 * b1;
          // Second term of the pair
          i++;
          c2--;
          c3 = i * c2;
          c4 += 2;
          a2 = c4 * a1 + c3 * a2;
          b2 = c4 * b1 + c3 * b2;
          // Rescale to prevent overflow
          if (b2 > scalefactor) {
              a1 /= scalefactor;
              b1 /= scalefactor;
              a2 /= scalefactor;
              b2 /= scalefactor;
          }
          // Check convergence: |f - f_prev| <= epsilon * max(f0, |f|)
          if (b2 !== 0) {
              f = a2 / b2;
              if (Math.abs(f - of) <= Number.EPSILON * Math.max(f0, Math.abs(f))) {
                  return f;
              }
              of = f;
          }
      }
      return f; // Did not converge within iteration limit
  }

  /**
   * Implementation of the normal cumulative distribution function (CDF).
   *
   * The below code was adapted from the pnorm_both function in R's source code.
   *
   * @param x Point at which to evaluate the CDF
   * @param lower_tail If true, probabilities are P[X ≤ x], otherwise, P[X > x]
   * @param log_p If true, probabilities p are given as log(p)
   * @returns The cumulative probability up to x for the standard normal distribution.
   */
  function normalCDFImpl(x, lower_tail, log_p) {
      let i_tail = lower_tail ? 0 : 1;
      // Polynomial coefficients for different approximation regions
      // Region 1: |x| <= 0.67448975 (central region)
      // Uses rational approximation: Phi(x) ≈ 0.5 + x * P(x²) / Q(x²)
      const a = [
          2.2352520354606839287,
          161.02823106855587881,
          1067.6894854603709582,
          18154.981253343561249,
          0.065682337918207449113
      ];
      const b = [
          47.20258190468824187,
          976.09855173777669322,
          10260.932208618978205,
          45507.789335026729956
      ];
      // Region 2: 0.67448975 < |x| <= sqrt(32) (intermediate region)
      // Uses rational approximation with exponential scaling
      const c = [
          0.39894151208813466764,
          8.8831497943883759412,
          93.506656132177855979,
          597.27027639480026226,
          2494.5375852903726711,
          6848.1904505362823326,
          11602.651437647350124,
          9842.7148383839780218,
          1.0765576773720192317e-8
      ];
      const d = [
          22.266688044328115691,
          235.38790178262499861,
          1519.377599407554805,
          6485.558298266760755,
          18615.571640885098091,
          34900.952721145977266,
          38912.003286093271411,
          19685.429676859990727
      ];
      // Region 3: |x| > sqrt(32) (tail region)
      // Uses asymptotic expansion for extreme tails
      const p = [
          0.21589853405795699,
          0.1274011611602473639,
          0.022235277870649807,
          0.001421619193227893466,
          2.9112874951168792e-5,
          0.02307344176494017303
      ];
      const q = [
          1.28426009614491121,
          0.468238212480865118,
          0.0659881378689285515,
          0.00378239633202758244,
          7.29751555083966205e-5
      ];
      let xden, xnum, temp, del, eps, xsq, y;
      let i, lower, upper;
      if (Number.isNaN(x)) {
          return Number.NaN;
      }
      eps = Number.EPSILON * 0.5;
      lower = i_tail != 1;
      upper = i_tail != 0;
      let cum = 0; // Lower tail probability
      let ccum = 0; // Upper tail probability (complement)
      y = Math.abs(x);
      // Region 1: Central region |x| <= 0.67448975
      // Use Taylor series expansion around 0
      if (y <= 0.67448975) {
          if (y > eps) {
              xsq = x * x;
              xnum = a[4] * xsq;
              xden = xsq;
              for (i = 0; i < 3; ++i) {
                  xnum = (xnum + a[i]) * xsq;
                  xden = (xden + b[i]) * xsq;
              }
          }
          else {
              xnum = xden = 0.0;
          }
          // Phi(x) = 0.5 + x * R(x²) where R is a rational function
          temp = x * (xnum + a[3]) / (xden + b[3]);
          if (lower) {
              cum = 0.5 + temp;
          }
          if (upper) {
              ccum = 0.5 - temp;
          }
          if (log_p) {
              if (lower) {
                  cum = Math.log(cum);
              }
              if (upper) {
                  ccum = Math.log(ccum);
              }
          }
      }
      else if (y <= SQRT_THIRTY_TWO) {
          // Region 2: Intermediate region 0.67448975 < |x| <= sqrt(32)
          // Use rational approximation with careful exponential handling
          xnum = c[8] * y;
          xden = y;
          for (i = 0; i < 7; ++i) {
              xnum = (xnum + c[i]) * y;
              xden = (xden + d[i]) * y;
          }
          temp = (xnum + c[7]) / (xden + d[7]);
          // Split x² into integer and fractional parts for precision
          // Compute exp(-x²/2) as exp(-xsq²/2) * exp(-del/2)
          xsq = ldexp(Math.trunc(ldexp(y, 4)), -4);
          del = (y - xsq) * (y + xsq);
          if (log_p) {
              cum = (-xsq * ldexp(xsq, -1)) - ldexp(del, -1) + Math.log(temp);
              if ((lower && x > 0.) || (upper && x <= 0.)) {
                  ccum = Math.log1p(-Math.exp(-xsq * ldexp(xsq, -1)) * Math.exp(-ldexp(del, -1)) * temp);
              }
          }
          else {
              cum = Math.exp(-xsq * ldexp(xsq, -1)) * Math.exp(-ldexp(del, -1)) * temp;
              ccum = 1.0 - cum;
          }
          // Swap if x > 0 (we computed the upper tail)
          if (x > 0.) {
              temp = cum;
              if (lower) {
                  cum = ccum;
              }
              ccum = temp;
          }
      }
      else if ((log_p && y < 1e170) || (lower && -38.4674 < x && x < 8.2924) || (upper && -8.2924 < x && x < 38.4674)) {
          // Region 3: Tail region |x| > sqrt(32)
          // Use asymptotic expansion: Phi(x) ≈ phi(x) * (1/x - 1/x³ + ...)
          xsq = 1.0 / (x * x);
          xnum = p[5] * xsq;
          xden = xsq;
          for (i = 0; i < 4; ++i) {
              xnum = (xnum + p[i]) * xsq;
              xden = (xden + q[i]) * xsq;
          }
          temp = xsq * (xnum + p[4]) / (xden + q[4]);
          temp = (ONE_DIV_SQRT_TWO_PI - temp) / y;
          // Same precision technique as Region 2
          xsq = ldexp(Math.trunc(ldexp(x, 4)), -4);
          del = (x - xsq) * (x + xsq);
          if (log_p) {
              cum = (-xsq * ldexp(xsq, -1)) - ldexp(del, -1) + Math.log(temp);
              if ((lower && x > 0) || (upper && x <= 0)) {
                  ccum = Math.log1p(-Math.exp(-xsq * ldexp(xsq, -1)) * Math.exp(-ldexp(del, -1)) * temp);
              }
          }
          else {
              cum = Math.exp(-xsq * ldexp(xsq, -1)) * Math.exp(-ldexp(del, -1)) * temp;
              ccum = 1.0 - cum;
          }
          if (x > 0) {
              temp = cum;
              if (lower) {
                  cum = ccum;
              }
              ccum = temp;
          }
      }
      else {
          // Region 4: Extreme tails - return 0 or 1
          if (x > 0) {
              cum = (log_p ? 0 : 1);
              ccum = (log_p ? Number.NEGATIVE_INFINITY : 0);
          }
          else {
              cum = (log_p ? Number.NEGATIVE_INFINITY : 0);
              ccum = (log_p ? 0 : 1);
          }
      }
      return lower_tail ? cum : ccum;
  }

  /**
   * Normal cumulative distribution function (CDF).
   *
   * The below code was adapted from the pnorm function in R's source code.
   *
   * @param x Point at which to evaluate the CDF
   * @param mu Mean of the normal distribution
   * @param sigma SD of the normal distribution
   * @param lower_tail If true, probabilities are P[X ≤ x], otherwise, P[X > x]
   * @param log_p If true, probabilities p are given as log(p)
   * @returns The cumulative probability up to x for the standard normal distribution.
   */
  function normalCDF(x, mu, sigma, lower_tail = true, log_p = false) {
      // Handle NaN inputs: propagate NaN
      if (Number.isNaN(x) || Number.isNaN(mu) || Number.isNaN(sigma)) {
          return x + mu + sigma;
      }
      // Handle infinity - infinity case (indeterminate form)
      if (!Number.isFinite(x) && mu == x) {
          return Number.NaN;
      }
      // Precompute boundary values for edge cases
      const zeroBoundLower = (lower_tail ? (log_p ? Number.NEGATIVE_INFINITY : 0) : (log_p ? 0 : 1));
      const zeroBoundUpper = (lower_tail ? (log_p ? 0 : 1) : (log_p ? Number.NEGATIVE_INFINITY : 0));
      // Standardize: z = (x - mu) / sigma transforms N(mu, sigma) to N(0, 1)
      let p = (x - mu) / sigma;
      // Handle overflow in standardization
      if (!Number.isFinite(p)) {
          return (x < mu) ? zeroBoundLower : zeroBoundUpper;
      }
      // Delegate to implementation for standard normal N(0, 1)
      return normalCDFImpl(p, lower_tail, log_p);
  }

  /**
   * Calculates the probability density function (PDF) of the normal distribution.
   *
   * The implementation is adapted from the dnorm function in R's source code.
   *
   * @param x The point at which to evaluate the density.
   * @param mu The mean of the normal distribution.
   * @param sigma The standard deviation of the normal distribution.
   * @param log_p If true, returns the log of the density.
   * @returns The probability density or log-density at the given point.
   */
  function normalDensity(x, mu, sigma, log_p = false) {
      // Handle NaN inputs
      if (Number.isNaN(x) || Number.isNaN(mu) || Number.isNaN(sigma)) {
          return x + mu + sigma;
      }
      const zeroBound = log_p ? Number.NEGATIVE_INFINITY : 0;
      // Infinite sigma means density is 0 everywhere
      if (!Number.isFinite(sigma)) {
          return zeroBound;
      }
      // Handle infinity - infinity case
      if (!Number.isFinite(x) && mu == x) {
          return Number.NaN;
      }
      // Standardize: z = (x - mu) / sigma
      const z = (x - mu) / sigma;
      if (!Number.isFinite(z)) {
          return zeroBound;
      }
      const absZ = Math.abs(z);
      // Check for potential overflow in z²
      if (absZ >= 2 * Math.sqrt(Number.MAX_VALUE)) {
          return zeroBound;
      }
      // Compute density: f(x) = (1 / (sigma * sqrt(2*pi))) * exp(-z²/2)
      // In log scale: log(f) = -log(sqrt(2*pi)) - log(sigma) - z²/2
      if (log_p) {
          return -(LOG_SQRT_TWO_PI + 0.5 * absZ * absZ + Math.log(sigma));
      }
      // For small |z|, direct computation is stable
      if (absZ < 5) {
          return ONE_DIV_SQRT_TWO_PI * Math.exp(-0.5 * absZ * absZ) / sigma;
      }
      // Underflow threshold: exp(-z²/2) underflows for |z| > 38.57
      if (absZ > 38.56804181549334) {
          return 0;
      }
      // For larger |z|, split z to avoid precision loss in z²
      // z = x1 + x2 where x1 has limited precision
      // exp(-z²/2) = exp(-x1²/2) * exp((-x2/2 - x1) * x2)
      let x1 = ldexp(Math.trunc(ldexp(absZ, 16)), -16);
      let x2 = absZ - x1;
      return ONE_DIV_SQRT_TWO_PI / sigma
          * (Math.exp(-0.5 * x1 * x1) * Math.exp((-0.5 * x2 - x1) * x2));
  }

  /**
   * Asymptotic expansion for the Poisson CDF for large lambda and x
   *
   * The below code was adapted from the ppois_asymp function in R's source code.
   *
   * @param x Point at which to evaluate the CDF
   * @param lambda Rate parameter of the Poisson distribution
   * @param lower_tail If true, probabilities are P[X ≤ x], otherwise, P[X > x]
   * @param log_p If true, probabilities p are given as log(p)
   * @returns The cumulative probability up to x for the Poisson distribution with given parameters.
   */
  function poissonCDFAsymp(x, lambda, lower_tail, log_p) {
      // Coefficients for asymptotic expansion
      // These are derived from the Edgeworth expansion of the Poisson distribution
      const coefs_a = [
          -1e99, /* placeholder used for 1-indexing */
          2 / 3.,
          -4 / 135.,
          8 / 2835.,
          16 / 8505.,
          -8992 / 12629925.,
          -334144 / 492567075.,
          698752 / 1477701225.
      ];
      const coefs_b = [
          -1e99, /* placeholder */
          1 / 12.,
          1 / 288.,
          -139 / 51840.,
          -571 / 2488320.,
          163879 / 209018880.,
          5246819 / 75246796800.,
          -534703531 / 902961561600.
      ];
      let elfb, elfb_term;
      let res12, res1_term, res1_ig, res2_term, res2_ig;
      let dfm, pt_, s2pt, f, np;
      let i;
      // Compute deviation from mean
      dfm = lambda - x;
      // pt_ is related to the relative deviation: -log(1 + (lambda-x)/x) + (lambda-x)/x
      pt_ = -log1pmx(dfm / x);
      // s2pt is the signed square root: sqrt(2 * x * pt_)
      // This transforms the Poisson to approximate normal
      s2pt = Math.sqrt(2 * x * pt_);
      if (dfm < 0) {
          s2pt = -s2pt; // Preserve sign based on deviation direction
      }
      // Compute the correction terms using asymptotic series
      res12 = 0;
      res1_ig = res1_term = Math.sqrt(x);
      res2_ig = res2_term = s2pt;
      for (i = 1; i < 8; i++) {
          res12 += res1_ig * coefs_a[i];
          res12 += res2_ig * coefs_b[i];
          res1_term *= pt_ / i;
          res2_term *= 2 * pt_ / (2 * i + 1);
          res1_ig = res1_ig / x + res1_term;
          res2_ig = res2_ig / x + res2_term;
      }
      // Compute the leading factor for the expansion
      elfb = x;
      elfb_term = 1;
      for (i = 1; i < 8; i++) {
          elfb += elfb_term * coefs_b[i];
          elfb_term /= x;
      }
      if (!lower_tail) {
          elfb = -elfb;
      }
      // f is the correction factor to apply to the normal approximation
      // f is the correction factor to apply to the normal approximation
      f = res12 / elfb;
      // Get base normal CDF at the transformed point
      np = normalCDF(s2pt, 0, 1, !lower_tail, log_p);
      // Apply correction to normal approximation
      if (log_p) {
          let i_tail = !lower_tail;
          let n_d_over_p; // Ratio of normal density to probability
          // Handle sign for tail computation
          if (s2pt < 0) {
              s2pt = -s2pt;
              i_tail = !i_tail;
          }
          // For large s2pt in the correct tail, use asymptotic expansion
          // This avoids computing exp(np) which could underflow
          if (s2pt > 10 && !i_tail) {
              // Asymptotic expansion: phi(x)/Phi(x) ≈ x / (1 + 1/x² - 1/x⁴ + ...)
              let term = 1 / s2pt;
              let sum = term;
              let x2 = s2pt * s2pt;
              let i = 1;
              while (Math.abs(term) > Number.EPSILON * sum) {
                  term *= -i / x2;
                  sum += term;
                  i += 2;
              }
              n_d_over_p = 1 / sum;
          }
          else {
              // Direct computation for moderate values
              let d = normalDensity(s2pt, 0, 1, false);
              n_d_over_p = d / Math.exp(np);
          }
          // log(P) = log(Phi(s2pt)) + log(1 + f * phi(s2pt)/Phi(s2pt))
          return np + Math.log1p(f * n_d_over_p);
      }
      else {
          // Non-log case: P = Phi(s2pt) + f * phi(s2pt)
          return np + f * normalDensity(s2pt, 0, 1, log_p);
      }
  }

  /**
   * Numerically stable computation of log(1 - exp(x))
   *
   * @param x Value to compute log(1 - exp(x)) for
   * @returns log(1 - exp(x))
   */
  function log1mExp(x) {
      return (x > -Math.LN2) ? Math.log(-Math.expm1(x)) : Math.log1p(-Math.exp(x));
  }

  /**
   * Calculates the cumulative distribution function (CDF) of the gamma distribution.
   *
   * The implementation is adapted from the pgamma_raw function in R's source code.
   *
   * @param x The quantile at which to evaluate the CDF.
   * @param alph The shape parameter of the gamma distribution.
   * @param lower_tail If true, probabilities are P[X ≤ x], otherwise, P[X > x].
   * @param log_p If true, probabilities p are given as log(p).
   * @returns The cumulative probability up to x for the gamma distribution with given parameters.
   */
  function gammaCDFImpl(x, alph, lower_tail = true, log_p = false) {
      let res;
      const zeroBoundLower = log_p ? Number.NEGATIVE_INFINITY : 0;
      const zeroBoundUpper = log_p ? 0 : 1;
      // Handle edge cases
      if (x <= 0) {
          return lower_tail ? zeroBoundLower : zeroBoundUpper;
      }
      if (x >= Number.POSITIVE_INFINITY) {
          return lower_tail ? zeroBoundUpper : zeroBoundLower;
      }
      // Case 1: Small x. Use series expansion.
      // This corresponds to the power series expansion of the lower incomplete gamma function:
      // gamma(alpha, x) = x^alpha * sum_{n=0}^{infinity} ((-1)^n * x^n) / (n! * (alpha + n))
      //                 = x^alpha * sum_{n=0}^{infinity} (c_n / (alpha + n))
      if (x < 1) {
          let sum = 0, c = alph, n = 0, term = 1;
          while (Math.abs(term) > Number.EPSILON * Math.abs(sum)) {
              n++;
              c *= -x / n;
              term = c / (alph + n);
              sum += term;
          }
          if (lower_tail) {
              const f1 = log_p ? Math.log1p(sum) : 1 + sum;
              let f2;
              if (alph > 1) {
                  f2 = poissonDensity(alph, x, log_p);
                  f2 = log_p ? f2 + x : f2 * Math.exp(x);
              }
              else if (log_p) {
                  f2 = alph * Math.log(x) - lgamma1p(alph);
              }
              else {
                  f2 = Math.pow(x, alph) / Math.exp(lgamma1p(alph));
              }
              res = log_p ? f1 + f2 : f1 * f2;
          }
          else {
              const lf2 = alph * Math.log(x) - lgamma1p(alph);
              if (log_p) {
                  res = log1mExp(Math.log1p(sum) + lf2);
              }
              else {
                  let f1m1 = sum;
                  let f2m1 = Math.expm1(lf2);
                  res = -(f1m1 + f2m1 + f1m1 * f2m1);
              }
          }
      }
      else if (x <= alph - 1 && x < 0.8 * (alph + 50)) {
          // Case 2: x is smaller than mean (alpha). Use series approximation.
          // Computes lower tail using a series related to the Poisson distribution:
          // P(X <= x) = P(Y >= alpha) where Y ~ Poisson(x).
          // Uses the identity: integral_0^x t^(a-1) e^(-t) dt / Gamma(a) = sum_{k=0}^infinity e^(-x) x^(a+k) / Gamma(a+k+1)
          let y = alph;
          let term = x / y;
          let sum = term;
          while (term > Number.EPSILON * sum) {
              y++;
              term *= x / y;
              sum += term;
          }
          sum = log_p ? Math.log(sum) : sum;
          const d = poissonDensityPrev(alph, x, log_p);
          if (!lower_tail) {
              res = log_p ? log1mExp(d + sum) : 1 - d * sum;
          }
          else {
              res = log_p ? sum + d : sum * d;
          }
      }
      else if (alph - 1 < x && alph < 0.8 * (x + 50)) {
          // Case 3: x is larger than mean. Use continued fraction or finite sum.
          // Computes upper tail using reduction or continued fractions.
          // For integer alpha, summation is finite. Use Legendre's continued fraction for Gamma(alpha, x).
          let sum = 0;
          const d = poissonDensityPrev(alph, x, log_p);
          if (alph < 1) {
              if (x * Number.EPSILON > 1 - alph) {
                  sum = log_p ? 0 : 1;
              }
              else {
                  const f = gammaContFrac(alph, x - (alph - 1)) * x / alph;
                  sum = log_p ? Math.log(f) : f;
              }
          }
          else {
              let term = 1;
              let y = alph - 1;
              while (y >= 1 && term > sum * Number.EPSILON) {
                  term *= y / x;
                  sum += term;
                  y--;
              }
              if (y != Math.floor(y)) {
                  sum += term * gammaContFrac(y, x + 1 - y);
              }
              sum = log_p ? Math.log1p(sum) : 1 + sum;
          }
          if (!lower_tail) {
              res = log_p ? sum + d : sum * d;
          }
          else {
              res = log_p ? log1mExp(d + sum) : 1 - d * sum;
          }
      }
      else {
          // Case 4: Asymptotic approximation for large parameters
          // Uses Peizer-Pratt approximation via Poisson CDF asymp.
          res = poissonCDFAsymp(alph - 1, x, !lower_tail, log_p);
      }
      // Final check for underflow in non-log case to improve precision by using log scale first
      if (!log_p && res < Number.MIN_VALUE / Number.EPSILON) {
          return Math.exp(gammaCDFImpl(x, alph, lower_tail, true));
      }
      return res;
  }

  /**
   * Calculates the cumulative distribution function (CDF) of the gamma distribution.
   *
   * The implementation is adapted from the pgamma function in R's source code.
   *
   * @param x The quantile at which to evaluate the CDF.
   * @param alpha The shape parameter of the gamma distribution.
   * @param scale The scale parameter of the gamma distribution.
   * @param lower_tail If true, probabilities are P[X ≤ x], otherwise, P[X > x].
   * @param log_p If true, probabilities p are given as log(p).
   * @returns The cumulative probability up to x for the gamma distribution with given parameters.
   */
  function gammaCDF(x, alpha, scale, lower_tail = true, log_p = false) {
      // Handle NaN inputs: propagate NaN
      if (Number.isNaN(x) || Number.isNaN(alpha) || Number.isNaN(scale)) {
          return x + alpha + scale;
      }
      // Validate parameters: alpha >= 0, scale > 0
      if (alpha < 0 || scale <= 0) {
          return Number.NaN;
      }
      // Standardize to unit scale: X/scale ~ Gamma(alpha, 1)
      // This simplifies the implementation to only handle scale = 1
      x /= scale;
      if (Number.isNaN(x)) {
          return x;
      }
      // Degenerate case: alpha = 0 is a point mass at 0
      if (alpha === 0) {
          const zeroBoundLower = log_p ? Number.NEGATIVE_INFINITY : 0;
          const zeroBoundUpper = log_p ? 0 : 1;
          return (x <= 0) ? (lower_tail ? zeroBoundLower : zeroBoundUpper)
              : (lower_tail ? zeroBoundUpper : zeroBoundLower);
      }
      // Delegate to implementation for standardized gamma
      return gammaCDFImpl(x, alpha, lower_tail, log_p);
  }

  /**
   * Calculates the gamma density function.
   *
   * The below code was adapted from the dgamma function in R's source code.
   *
   * @param x The point at which to evaluate the density.
   * @param shape The shape parameter of the gamma distribution.
   * @param scale The scale parameter of the gamma distribution.
   * @param log_p If true, probabilities p are given as log(p).
   * @returns The value of the gamma density function at x.
   */
  function gammaDensity(x, shape, scale, log_p) {
      // Handle NaN inputs: propagate NaN
      if (Number.isNaN(x) || Number.isNaN(shape) || Number.isNaN(scale)) {
          return x + shape + scale;
      }
      // Validate parameters: shape >= 0, scale > 0
      if (shape < 0 || scale <= 0) {
          return Number.NaN;
      }
      const zeroBound = log_p ? Number.NEGATIVE_INFINITY : 0;
      // Density is zero for negative x
      if (x < 0) {
          return zeroBound;
      }
      // Degenerate case: shape = 0 is a point mass at 0
      if (shape === 0) {
          return (x === 0) ? Number.POSITIVE_INFINITY : zeroBound;
      }
      // Handle x = 0 separately based on shape parameter
      // Gamma density: f(x) = x^(shape-1) * exp(-x/scale) / (Gamma(shape) * scale^shape)
      // At x = 0: f(0) = infinity if shape < 1, 0 if shape > 1, 1/scale if shape = 1
      if (x === 0) {
          if (shape < 1) {
              return Number.POSITIVE_INFINITY;
          }
          if (shape > 1) {
              return zeroBound;
          }
          // shape === 1: Exponential distribution, f(0) = 1/scale
          return log_p ? -Math.log(scale) : 1 / scale;
      }
      // Use relationship between Gamma and Poisson densities:
      // For shape < 1: f_Gamma(x; shape, scale) = (shape/x) * f_Poisson(shape; x/scale)
      // For shape >= 1: f_Gamma(x; shape, scale) = (1/scale) * f_Poisson(shape-1; x/scale)
      let pr;
      if (shape < 1) {
          pr = poissonDensity(shape, x / scale, log_p);
          if (log_p) {
              const shapeDivX = shape / x;
              const offset = Number.isFinite(shapeDivX)
                  ? Math.log(shapeDivX)
                  : Math.log(shape) - Math.log(x);
              return pr + offset;
          }
          else {
              return pr * shape / x;
          }
      }
      // shape >= 1: use f_Gamma = f_Poisson(shape-1, x/scale) / scale
      pr = poissonDensity(shape - 1, x / scale, log_p);
      return log_p ? pr - Math.log(scale) : pr / scale;
  }

  /**
   * Performs Newton-Raphson iterations to refine the estimate of the quantile function
   * for the gamma distribution.
   *
   * The below code was adapted from the qgamma function in R's source code.
   *
   * @param ch Initial estimate of quantile
   * @param p Probability value
   * @param alpha Shape parameter
   * @param scale Scale parameter
   * @param lower_tail Logical; if true, probabilities are P[X ≤ x], otherwise, P[X > x]
   * @param log_p Logical; if true, probabilities p are given as log(p)
   * @param max_it_Newton Maximum number of Newton-Raphson iterations
   * @param EPS_N Convergence tolerance for Newton-Raphson iterations
   * @returns Refined estimate of the quantile
   */
  function gammaNewtonIter(ch, p, alpha, scale, lower_tail, log_p, max_it_Newton, EPS_N) {
      // Convert chi-squared estimate to gamma scale: x = (scale * ch) / 2
      let x = 0.5 * scale * ch;
      // If no iterations requested, return the initial estimate
      if (max_it_Newton === 0) {
          return x;
      }
      // Work in log scale for better numerical precision
      if (!log_p) {
          p = Math.log(p);
          log_p = true;
      }
      let p_; // Current CDF value at x
      // Handle x = 0 edge case
      if (x === 0) {
          const _1_p = 1. + 1e-7; // Tolerance factor (upper)
          const _1_m = 1. - 1e-7; // Tolerance factor (lower)
          x = Number.MIN_VALUE;
          p_ = gammaCDF(x, alpha, scale, lower_tail, log_p);
          // Check if p is so small that the quantile is effectively 0
          if ((lower_tail && p_ > p * _1_p) || (!lower_tail && p_ < p * _1_m)) {
              return 0;
          }
      }
      else {
          p_ = gammaCDF(x, alpha, scale, lower_tail, log_p);
      }
      // If CDF is -infinity (log scale), quantile is 0
      if (p_ === Number.NEGATIVE_INFINITY) {
          return 0;
      }
      const zeroBound = log_p ? Number.NEGATIVE_INFINITY : 0;
      // Newton-Raphson iteration loop
      // Update rule: x_{n+1} = x_n - (F(x_n) - p) / f(x_n)
      // where F is the CDF and f is the PDF (density)
      for (let i = 1; i <= max_it_Newton; i++) {
          const p1 = p_ - p; // Residual: F(x) - p
          // Check convergence: |F(x) - p| < epsilon * |p|
          if (Math.abs(p1) < Math.abs(EPS_N * p)) {
              break;
          }
          // Compute density (derivative of CDF) for Newton step
          const g = gammaDensity(x, alpha, scale, log_p);
          if (g === zeroBound) {
              break; // Density is 0, cannot continue
          }
          // Compute Newton step: delta = (F(x) - p) / f(x)
          // In log scale: delta = (p_ - p) * exp(p_ - g)
          let t = log_p ? p1 * Math.exp(p_ - g) : p1 / g;
          t = lower_tail ? x - t : x + t; // Apply step in correct direction
          // Evaluate CDF at new point
          p_ = gammaCDF(t, alpha, scale, lower_tail, log_p);
          // Check if we are making progress; stop if not improving
          const absDiff = Math.abs(p_ - p);
          const absP1 = Math.abs(p1);
          if (absDiff > absP1 || (i > 1 && absDiff === absP1)) {
              break;
          }
          x = t;
      }
      return x;
  }

  /**
   * Evaluates a rational polynomial P(x)/Q(x) using Horner's method.
   *
   * @param x The point at which to evaluate
   * @param q Multiplier for the result
   * @param num_coeffs Numerator polynomial coefficients (highest degree first)
   * @param den_coeffs Denominator polynomial coefficients (highest degree first)
   * @returns q * P(x) / Q(x)
   */
  function polyEval(x, q, num_coeffs, den_coeffs) {
      let numerator = num_coeffs[0];
      let denominator = den_coeffs[0];
      for (let i = 1; i < num_coeffs.length; i++) {
          numerator = numerator * x + num_coeffs[i];
          denominator = denominator * x + den_coeffs[i];
      }
      return q * numerator / denominator;
  }
  /**
   * Calculates the quantile function (inverse CDF) of the normal distribution.
   *
   * The implementation is adapted from the qnorm function in R's source code.
   *
   * @param p Probability value
   * @param mu Mean of the normal distribution
   * @param sigma SD of the normal distribution
   * @param lower_tail If true, probabilities are P[X ≤ x], otherwise, P[X > x]
   * @param log_p If true, probabilities p are given as log(p)
   * @returns The quantile corresponding to the given probability for the normal distribution with specified parameters.
   */
  function normalQuantile(p, mu, sigma, lower_tail, log_p) {
      let p_, q, r, val;
      // Handle NaN inputs
      if (Number.isNaN(p) || Number.isNaN(mu) || Number.isNaN(sigma)) {
          return p + mu + sigma;
      }
      // Validate probability bounds and handle edge cases
      if (log_p) {
          if (p > 0) {
              return Number.NaN; // log(p) > 0 means p > 1
          }
          if (p == 0) {
              return lower_tail ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY; // p = 1
          }
          if (p == Number.NEGATIVE_INFINITY) {
              return lower_tail ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY; // p = 0
          }
      }
      else {
          if (p < 0 || p > 1) {
              return Number.NaN;
          }
          if (p == 0) {
              return lower_tail ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
          }
          if (p == 1) {
              return lower_tail ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
          }
      }
      // Convert to standard form: compute p_ as lower-tail probability
      p_ = log_p ? (lower_tail ? Math.exp(p) : -Math.expm1(p))
          : (lower_tail ? p : (0.5 - p + 0.5));
      q = p_ - 0.5; // Deviation from median  // Deviation from median
      // Rational approximation coefficients for central region |q| <= 0.425
      // Based on Wichura's AS 241 algorithm
      const coeffs_a = [
          2509.0809287301226727,
          33430.575583588128105,
          67265.770927008700853,
          45921.953931549871457,
          13731.693765509461125,
          1971.5909503065514427,
          133.14166789178437745,
          3.387132872796366608
      ];
      const coeffs_b = [
          5226.495278852854561,
          28729.085735721942674,
          39307.89580009271061,
          21213.794301586595867,
          5394.1960214247511077,
          687.1870074920579083,
          42.313330701600911252,
          1
      ];
      // Coefficients for intermediate tail region (r <= 5)
      const coeffs_c = [
          7.7454501427834140764e-4,
          0.0227238449892691845833,
          0.24178072517745061177,
          1.27045825245236838258,
          3.64784832476320460504,
          5.7694972214606914055,
          4.6303378461565452959,
          1.42343711074968357734
      ];
      const coeffs_d = [
          1.05075007164441684324e-9,
          5.475938084995344946e-4,
          0.0151986665636164571966,
          0.14810397642748007459,
          0.68976733498510000455,
          1.6763848301838038494,
          2.05319162663775882187,
          1
      ];
      // Coefficients for extreme tail region (r <= 27)
      const coeffs_e = [
          2.01033439929228813265e-7,
          2.71155556874348757815e-5,
          0.0012426609473880784386,
          0.026532189526576123093,
          0.29656057182850489123,
          1.7848265399172913358,
          5.4637849111641143699,
          6.6579046435011037772
      ];
      const coeffs_f = [
          2.04426310338993978564e-15,
          1.4215117583164458887e-7,
          1.8463183175100546818e-5,
          7.868691311456132591e-4,
          0.0148753612908506148525,
          0.13692988092273580531,
          0.59983220655588793769,
          1
      ];
      // Region 1: Central region |q| <= 0.425 (covers about 85% of distribution)
      // Use rational approximation in r = 0.180625 - q²
      if (Math.abs(q) <= 0.425) {
          r = 0.180625 - q * q;
          val = polyEval(r, q, coeffs_a, coeffs_b);
      }
      else {
          // Tail regions: work with r = sqrt(-log(p)) for numerical stability
          let lp;
          if (log_p && ((lower_tail && q <= 0) || (!lower_tail && q > 0))) {
              lp = p;
          }
          else {
              if (q > 0) {
                  lp = log_p ? (lower_tail ? -Math.expm1(p) : Math.exp(p))
                      : (lower_tail ? (0.5 - p + 0.5) : p);
              }
              else {
                  lp = p_;
              }
              lp = Math.log(lp);
          }
          r = Math.sqrt(-lp);
          // Region 2: Intermediate tail (r <= 5)
          if (r <= 5) {
              val = polyEval(r - 1.6, 1, coeffs_c, coeffs_d);
          }
          else if (r <= 27) {
              // Region 3: Far tail (r <= 27)
              val = polyEval(r - 5, 1, coeffs_e, coeffs_f);
          }
          else {
              // Region 4: Extreme tail - use asymptotic expansion
              // Based on inverting the Mills ratio approximation
              if (r >= 6.4e8) {
                  val = r * Math.SQRT2;
              }
              else {
                  // Iterative refinement using asymptotic formula
                  // Phi^{-1}(p) ≈ sqrt(-2*log(p) - log(2*pi) - log(-2*log(p) - log(2*pi)))
                  const s2 = -ldexp(lp, 1); // s2 = -2 * log(p)
                  let x2 = s2 - (Math.log(s2) + LOG_TWO_PI);
                  if (r < 36000) {
                      x2 = s2 - (LOG_TWO_PI + Math.log(x2)) - 2 / (2 + x2);
                      if (r < 840) {
                          x2 = s2 - (LOG_TWO_PI + Math.log(x2))
                              + 2 * Math.log1p(-(1 - 1 / (4 + x2)) / (2 + x2));
                          if (r < 109) {
                              x2 = s2 - (LOG_TWO_PI + Math.log(x2))
                                  + 2 * Math.log1p(-(1 - (1 - 5 / (6 + x2)) / (4 + x2)) / (2 + x2));
                              if (r < 55) {
                                  x2 = s2 - (LOG_TWO_PI + Math.log(x2))
                                      + 2 * Math.log1p(-(1 - (1 - (5 - 9 / (8 + x2)) / (6 + x2)) / (4 + x2)) / (2 + x2));
                              }
                          }
                      }
                  }
                  val = Math.sqrt(x2);
              }
          }
          // Apply sign based on which tail
          if (q < 0.0) {
              val = -val;
          }
      }
      // Transform from standard normal to N(mu, sigma)
      return mu + sigma * val;
  }

  /**
   * Return the probability or its complement in log scale
   *
   * @param p Probability in log scale if log_p is true
   * @param lower_tail Whether to return the lower tail probability
   * @param log_p Whether the probability is given in log scale
   * @returns The probability or its complement in log scale
   */
  function logP(p, lower_tail, log_p) {
      if (lower_tail) {
          return log_p ? p : Math.log(p);
      }
      return log_p ? log1mExp(p) : Math.log1p(-p);
  }

  /**
   * Compute an approximate quantile for the chi-squared distribution
   *
   * This function is adapted from R's qchisq_appr function
   *
   * @param p Probability
   * @param nu Degrees of freedom
   * @param g Log-Gamma of nu/2
   * @param lower_tail If true, probabilities are P[X ≤ x], otherwise, P[X > x]
   * @param log_p If true, probabilities p are given as log(p)
   * @param tol Tolerance for convergence
   * @returns Approximate quantile for the chi-squared distribution
   */
  function chisqQuantileApprox(p, nu, g, lower_tail = true, log_p = false, tol) {
      // Check for invalid inputs (NaN or out of bounds)
      if (Number.isNaN(p) || Number.isNaN(nu)) {
          return p + nu;
      }
      if ((log_p && p > 0) || (!log_p && (p < 0 || p > 1)) || nu <= 0) {
          return Number.NaN;
      }
      const alpha = 0.5 * nu;
      let p1 = logP(p, lower_tail, log_p);
      // Approximation for small degrees of freedom or extreme tail probabilities
      if (nu < -1.24 * p1) {
          const lgam1pa = (alpha < 0.5) ? lgamma1p(alpha)
              : ((Math.log(nu) - Math.LN2) + g);
          return Math.exp((lgam1pa + p1) / alpha + Math.LN2);
      }
      const c = alpha - 1;
      // Wilson-Hilferty approximation for larger degrees of freedom
      if (nu > 0.32) {
          const x = normalQuantile(p, 0, 1, lower_tail, log_p);
          p1 = 2 / (9 * nu);
          const ch = nu * Math.pow(x * Math.sqrt(p1) + 1 - p1, 3);
          // If approximation is large, use a logarithmic correction
          return (ch > 2.2 * nu + 6)
              ? -2 * (logP(p, !lower_tail, log_p) - c * (Math.log(ch) - Math.LN2) + g)
              : ch;
      }
      // Iterative approximation for intermediate range
      const C7 = 4.67;
      const C8 = 6.66;
      const C9 = 6.73;
      const C10 = 13.32;
      let ch = 0.4;
      let p2 = 0;
      let q = 0;
      let t = 0;
      const a = logP(p, !lower_tail, log_p) + g + c * Math.LN2;
      // Refine the approximation iteratively
      while (Math.abs(q - ch) > tol * Math.abs(ch)) {
          q = ch;
          p1 = 1 / (1 + ch * (C7 + ch));
          p2 = ch * (C9 + ch * (C8 + ch));
          t = -0.5 + (C7 + 2 * ch) * p1 - (C9 + ch * (C10 + 3 * ch)) / p2;
          ch -= (1 - Math.exp(a + 0.5 * ch) * p2 * p1) / t;
      }
      return ch;
  }

  /**
   * Computes the quantile function (inverse CDF) of the gamma distribution.
   *
   * Uses a combination of chi-squared approximation and Newton-Raphson refinement.
   * This implementation is adapted from R's qgamma function.
   *
   * @param p Probability value (or log(p) if log_p is true)
   * @param alpha Shape parameter of the gamma distribution
   * @param scale Scale parameter of the gamma distribution
   * @param lower_tail If true, returns quantile for P(X <= x) = p; otherwise P(X > x) = p
   * @param log_p If true, p is given as log(p)
   * @returns The quantile x such that P(X <= x) = p (or P(X > x) = p)
   */
  function gammaQuantile(p, alpha, scale, lower_tail = true, log_p = false) {
      // Handle NaN inputs
      if (Number.isNaN(p) || Number.isNaN(alpha) || Number.isNaN(scale)) {
          return p + alpha + scale;
      }
      // Validate probability bounds and handle edge cases
      if (log_p) {
          if (p > 0) {
              return Number.NaN; // log(p) > 0 means p > 1, invalid
          }
          if (p === 0) {
              return lower_tail ? Number.POSITIVE_INFINITY : 0; // p = 1
          }
          if (p === Number.NEGATIVE_INFINITY) {
              return lower_tail ? 0 : Number.POSITIVE_INFINITY; // p = 0
          }
      }
      else {
          if (p < 0 || p > 1) {
              return Number.NaN;
          }
          if (p === 0) {
              return lower_tail ? 0 : Number.POSITIVE_INFINITY;
          }
          if (p === 1) {
              return lower_tail ? Number.POSITIVE_INFINITY : 0;
          }
      }
      // Validate shape and scale parameters
      if (alpha < 0 || scale <= 0) {
          return Number.NaN;
      }
      // Degenerate case: alpha = 0 means point mass at 0
      if (alpha === 0) {
          return 0;
      }
      // For very small alpha, use more Newton iterations for accuracy
      let max_it_Newton = 1;
      if (alpha < 1e-10) {
          max_it_Newton = 7;
      }
      // Use chi-squared approximation as initial estimate
      // Gamma(alpha, scale) relates to chi-squared: if X ~ Gamma(alpha, 2), then X ~ chi-squared(2*alpha)
      const g = lgamma(alpha);
      let ch = chisqQuantileApprox(p, 2 * alpha, g, lower_tail, log_p, 1e-2);
      // If chi-squared approximation failed, return scaled result directly
      if (!Number.isFinite(ch)) {
          return gammaNewtonIter(ch, p, alpha, scale, lower_tail, log_p, 0, 1e-15);
      }
      // Convert probability to standard form for iteration
      const p_ = log_p ? (lower_tail ? Math.exp(p) : -Math.expm1(p))
          : (lower_tail ? p : (0.5 - p + 0.5));
      // For extreme probabilities or small ch, use Newton refinement directly
      if (ch < 5e-7 || p_ > (1 - 1e-14) || p_ < 1e-100) {
          return gammaNewtonIter(ch, p, alpha, scale, lower_tail, log_p, 20, 1e-15);
      }
      // Precomputed constants for the Wilson-Hilferty-based iteration
      const i420 = 1 / 420;
      const i2520 = 1 / 2520;
      const i5040 = 1 / 5040;
      const c = alpha - 1;
      const s6 = (120 + c * (346 + 127 * c)) * i5040;
      const ch0 = ch; // Save initial estimate for fallback
      // Main iteration: refine chi-squared estimate using higher-order correction
      // This is a modified Cornish-Fisher expansion for improved convergence
      for (let i = 1; i <= 1000; i++) {
          const q = ch; // Previous estimate
          const p1 = 0.5 * ch;
          const p2 = p_ - gammaCDFImpl(p1, alpha); // Residual
          // If iteration becomes unstable, fall back to Newton method
          if (!Number.isFinite(p2) || ch <= 0) {
              return gammaNewtonIter(ch0, p, alpha, scale, lower_tail, log_p, 27, 1e-15);
          }
          // Compute correction term t
          const t = p2 * Math.exp(alpha * Math.LN2 + g + p1 - c * Math.log(ch));
          const b = t / ch;
          const a = 0.5 * t - b * c;
          // Polynomial coefficients for higher-order correction (Cornish-Fisher)
          const s1 = (210 + a * (140 + a * (105 + a * (84 + a * (70 + 60 * a))))) * i420;
          const s2 = (420 + a * (735 + a * (966 + a * (1141 + 1278 * a)))) * i2520;
          const s3 = (210 + a * (462 + a * (707 + 932 * a))) * i2520;
          const s4 = (252 + a * (672 + 1182 * a) + c * (294 + a * (889 + 1740 * a))) * i5040;
          const s5 = (84 + 2264 * a + c * (1175 + 606 * a)) * i2520;
          // Apply correction with nested polynomial evaluation
          ch += t * (1 + 0.5 * t * s1 - b * c * (s1 - b * (s2 - b * (s3 - b * (s4 - b * (s5 - b * s6))))));
          // Check convergence
          if (Math.abs(q - ch) < (5e-7) * ch) {
              return gammaNewtonIter(ch, p, alpha, scale, lower_tail, log_p, max_it_Newton, 1e-15);
          }
          // Dampen large steps to maintain stability
          if (Math.abs(q - ch) > 0.1 * ch) {
              ch = q * (ch < q ? 0.9 : 1.1);
          }
      }
      // Return result after max iterations with final Newton polish
      return gammaNewtonIter(ch, p, alpha, scale, lower_tail, log_p, max_it_Newton, 1e-15);
  }

  /**
   * Calculates the quantile function for the chi-squared distribution.
   *
   * This function uses the relationship between the chi-squared distribution
   * and the gamma distribution to compute the quantile.
   *
   * @param p Probability value
   * @param df Degrees of freedom (nu) parameter
   * @param lower_tail If true, probabilities are P[X ≤ x], otherwise, P[X > x]
   * @param log_p If true, probabilities p are given as log(p)
   * @returns The quantile corresponding to the given probability
   */
  function chisqQuantile(p, df, lower_tail = true, log_p = false) {
      // Chi-squared distribution is a special case of the gamma distribution:
      // If X ~ chi-squared(df), then X ~ Gamma(shape = df/2, scale = 2)
      // Therefore: Q_chi2(p, df) = Q_gamma(p, df/2, 2)
      return gammaQuantile(p, 0.5 * df, 2.0, lower_tail, log_p);
  }

  const smrSE = function (inputData) {
      return [];
  };
  const smrSEOD = function (inputData) {
      const denominators = inputData.denominators;
      return inv(multiply(2, sqrt(denominators)));
  };
  const smrTarget = function (inputData) {
      return 1;
  };
  const smrY = function (inputData) {
      const numerators = inputData.numerators;
      const denominators = inputData.denominators;
      return sqrt(divide(numerators, denominators));
  };
  const smrLimitOD = function (args) {
      const target = args.target_transformed;
      const q = args.q;
      const SE = args.SE;
      const tau2 = args.tau2;
      const limit_transformed = target + q * sqrt(square(SE) + tau2);
      const limit = square(limit_transformed);
      return winsorise(limit, { lower: 0 });
  };
  const smrLimit = function (args) {
      const denominators = args.denominators;
      const p = args.p;
      const is_upper = p > 0.5;
      const offset = is_upper ? 1 : 0;
      const limit = (chisqQuantile(p, 2 * (denominators + offset)) / 2.0)
          / denominators;
      return winsorise(limit, { lower: 0 });
  };
  class smrFunnelClass extends chartClass {
      constructor(inputData, inputSettings) {
          super({
              seFunction: smrSE,
              seFunctionOD: smrSEOD,
              targetFunction: smrTarget,
              targetFunctionTransformed: smrTarget,
              yFunction: smrY,
              limitFunction: smrLimit,
              limitFunctionOD: smrLimitOD,
              inputData: inputData,
              inputSettings: inputSettings
          });
      }
  }

  const prSE = function (inputData) {
      const denominators = inputData.denominators;
      return inv(multiply(2, sqrt(denominators)));
  };
  const prTarget = function (inputData) {
      const numerators = inputData.numerators;
      const denominators = inputData.denominators;
      return sum(numerators) / sum(denominators);
  };
  const prTargetTransformed = function (inputData) {
      return Math.asin(Math.sqrt(prTarget(inputData)));
  };
  const prY = function (inputData) {
      const numerators = inputData.numerators;
      const denominators = inputData.denominators;
      return asin(sqrt(divide(numerators, denominators)));
  };
  const prLimit = function (args) {
      const target = args.target_transformed;
      const q = args.q;
      const SE = args.SE;
      const tau2 = args.tau2;
      const limit_transformed = target + q * sqrt(square(SE) + tau2);
      const limit = square(Math.sin(limit_transformed));
      return winsorise(limit, { lower: 0, upper: 1 });
  };
  class prFunnelClass extends chartClass {
      constructor(inputData, inputSettings) {
          super({
              seFunction: prSE,
              seFunctionOD: prSE,
              targetFunction: prTarget,
              targetFunctionTransformed: prTargetTransformed,
              yFunction: prY,
              limitFunction: prLimit,
              limitFunctionOD: prLimit,
              inputData: inputData,
              inputSettings: inputSettings
          });
      }
  }

  const rcSE = function (inputData) {
      const numerators = inputData.numerators ? inputData.numerators : inputData.denominators;
      const denominators = inputData.denominators;
      return sqrt(add(divide(numerators, square(add(numerators, 0.5))), divide(denominators, square(add(denominators, 0.5)))));
  };
  const rcTarget = function (inputData) {
      const numerators = inputData.numerators;
      const denominators = inputData.denominators;
      return sum(numerators) / sum(denominators);
  };
  const rcTargetTransformed = function (inputData) {
      const numerators = inputData.numerators;
      const denominators = inputData.denominators;
      return log(sum(numerators)) - log(sum(denominators));
  };
  const rcY = function (inputData) {
      const numerators = inputData.numerators;
      const denominators = inputData.denominators;
      return log(divide(add(numerators, 0.5), add(denominators, 0.5)));
  };
  const rcLimit = function (args) {
      const target = args.target_transformed;
      const q = args.q;
      const SE = args.SE;
      const tau2 = args.tau2;
      const limit_transformed = target + q * sqrt(square(SE) + tau2);
      const limit = exp(limit_transformed);
      return winsorise(limit, { lower: 0 });
  };
  class rcFunnelClass extends chartClass {
      constructor(inputData, inputSettings) {
          super({
              seFunction: rcSE,
              seFunctionOD: rcSE,
              targetFunction: rcTarget,
              targetFunctionTransformed: rcTargetTransformed,
              yFunction: rcY,
              limitFunction: rcLimit,
              limitFunctionOD: rcLimit,
              inputData: inputData,
              inputSettings: inputSettings
          });
      }
  }

  var chartObjects = /*#__PURE__*/Object.freeze({
    __proto__: null,
    PR: prFunnelClass,
    RC: rcFunnelClass,
    SR: smrFunnelClass
  });

  function two_sigma(value, limits) {
      if ((limits.ll95 !== null) && (value < limits.ll95)) {
          return "lower";
      }
      else if ((limits.ul95 !== null) && (value > limits.ul95)) {
          return "upper";
      }
      else {
          return "none";
      }
  }

  function three_sigma(value, limits) {
      if ((limits.ll99 !== null) && (value < limits.ll99)) {
          return "lower";
      }
      else if ((limits.ul99 !== null) && (value > limits.ul99)) {
          return "upper";
      }
      else {
          return "none";
      }
  }

  class viewModelClass {
      constructor() {
          this.inputData = null;
          this.inputSettings = new settingsClass();
          this.chartBase = null;
          this.calculatedLimits = null;
          this.plotPoints = new Array();
          this.groupedLines = new Array();
          this.firstRun = true;
          this.colourPalette = null;
          this.headless = false;
      }
      update(options, host) {
          var _a;
          const res = { status: true };
          if (options.type === 2 || this.firstRun) {
              this.inputSettings.update(options.dataViews[0]);
          }
          if (this.inputSettings.validationStatus.error !== "") {
              res.status = false;
              res.error = this.inputSettings.validationStatus.error;
              res.type = "settings";
              return res;
          }
          const checkDV = validateDataView(options.dataViews);
          if (checkDV !== "valid") {
              res.status = false;
              res.error = checkDV;
              return res;
          }
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
          // Only re-construct data and re-calculate limits if they have changed
          if (options.type === 2 || this.firstRun) {
              const chart_type = this.inputSettings.settings.funnel.chart_type;
              this.inputData = extractInputData(options.dataViews[0].categorical, this.inputSettings);
              if (this.inputData.validationStatus.status === 0) {
                  this.chartBase = new chartObjects[chart_type](this.inputData, this.inputSettings);
                  this.calculatedLimits = this.chartBase.getLimits();
                  this.scaleAndTruncateLimits();
                  this.initialisePlotData(host);
                  this.initialiseGroupedLines();
              }
          }
          this.firstRun = false;
          if (this.inputData.validationStatus.status !== 0) {
              res.status = false;
              res.error = this.inputData.validationStatus.error;
              return res;
          }
          if (this.inputData.warningMessage !== "") {
              res.warning = this.inputData.warningMessage;
          }
          return res;
      }
      initialisePlotData(host) {
          var _a, _b;
          this.plotPoints = new Array();
          const transform_text = this.inputSettings.settings.funnel.transformation;
          const transform = getTransformation(transform_text);
          const multiplier = this.inputSettings.derivedSettings.multiplier;
          const flag_two_sigma = this.inputSettings.settings.outliers.two_sigma;
          const flag_three_sigma = this.inputSettings.settings.outliers.three_sigma;
          for (let i = 0; i < this.inputData.id.length; i++) {
              const original_index = this.inputData.id[i];
              const numerator = this.inputData.numerators[i];
              const denominator = this.inputData.denominators[i];
              const value = transform((numerator / denominator) * multiplier);
              const limits = this.calculatedLimits.filter(d => d.denominators === denominator && d.ll99 !== null && d.ul99 !== null)[0];
              const aesthetics = this.inputData.scatter_formatting[i];
              if (this.colourPalette.isHighContrast) {
                  aesthetics.colour = this.colourPalette.foregroundColour;
              }
              const flagSettings = {
                  process_flag_type: this.inputSettings.settings.outliers.process_flag_type,
                  improvement_direction: this.inputSettings.settings.outliers.improvement_direction
              };
              const two_sigma_outlier = checkFlagDirection(flag_two_sigma ? two_sigma(value, limits) : "none", flagSettings);
              const three_sigma_outlier = checkFlagDirection(flag_three_sigma ? three_sigma(value, limits) : "none", flagSettings);
              const category = (typeof this.inputData.categories.values[original_index] === "number") ?
                  (this.inputData.categories.values[original_index]).toString() :
                  (this.inputData.categories.values[original_index]);
              if (two_sigma_outlier !== "none") {
                  aesthetics.colour = this.inputSettings.settings.outliers["two_sigma_colour_" + two_sigma_outlier];
                  aesthetics.colour_outline = this.inputSettings.settings.outliers["two_sigma_colour_" + two_sigma_outlier];
                  aesthetics.scatter_text_colour = aesthetics.colour;
              }
              if (three_sigma_outlier !== "none") {
                  aesthetics.colour = this.inputSettings.settings.outliers["three_sigma_colour_" + three_sigma_outlier];
                  aesthetics.colour_outline = this.inputSettings.settings.outliers["three_sigma_colour_" + three_sigma_outlier];
                  aesthetics.scatter_text_colour = aesthetics.colour;
              }
              this.plotPoints.push({
                  x: denominator,
                  numerator: numerator,
                  value: value,
                  group_text: category,
                  aesthetics: aesthetics,
                  identity: host.createSelectionIdBuilder()
                      .withCategory(this.inputData.categories, original_index)
                      .createSelectionId(),
                  highlighted: ((_a = this.inputData.highlights) === null || _a === void 0 ? void 0 : _a[i]) != null,
                  tooltip: buildTooltip(i, this.calculatedLimits, { two_sigma: two_sigma_outlier !== "none", three_sigma: three_sigma_outlier !== "none" }, this.inputData, this.inputSettings.settings, this.inputSettings.derivedSettings),
                  label: {
                      text_value: (_b = this.inputData.labels) === null || _b === void 0 ? void 0 : _b[i],
                      aesthetics: this.inputData.label_formatting[i],
                      angle: null,
                      distance: null,
                      line_offset: null,
                      marker_offset: null
                  },
                  two_sigma: two_sigma_outlier,
                  three_sigma: three_sigma_outlier
              });
          }
      }
      initialiseGroupedLines() {
          const labels = new Array();
          if (this.inputSettings.settings.lines.show_target) {
              labels.push("target");
          }
          if (this.inputSettings.settings.lines.show_alt_target) {
              labels.push("alt_target");
          }
          if (this.inputSettings.settings.lines.show_99) {
              labels.push("ll99", "ul99");
          }
          if (this.inputSettings.settings.lines.show_95) {
              labels.push("ll95", "ul95");
          }
          if (this.inputSettings.settings.lines.show_68) {
              labels.push("ll68", "ul68");
          }
          const formattedLines = new Array();
          this.calculatedLimits.forEach(limits => {
              labels.forEach(label => {
                  formattedLines.push({
                      x: limits.denominators,
                      line_value: limits === null || limits === void 0 ? void 0 : limits[label],
                      group: label
                  });
              });
          });
          this.groupedLines = groupBy(formattedLines, "group");
      }
      scaleAndTruncateLimits() {
          // Scale limits using provided multiplier
          const multiplier = this.inputSettings.derivedSettings.multiplier;
          const transform = getTransformation(this.inputSettings.settings.funnel.transformation);
          const limits = {
              lower: this.inputSettings.settings.funnel.ll_truncate,
              upper: this.inputSettings.settings.funnel.ul_truncate
          };
          this.calculatedLimits.forEach(limit => {
              ["target", "ll99", "ll95", "ll68", "ul68", "ul95", "ul99"].forEach(type => {
                  limit[type] = truncate(transform(multiply(limit[type], multiplier)), limits);
              });
          });
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

  var iterator;
  var hasRequiredIterator;

  function requireIterator () {
  	if (hasRequiredIterator) return iterator;
  	hasRequiredIterator = 1;
  	iterator = function (Yallist) {
  	  Yallist.prototype[Symbol.iterator] = function* () {
  	    for (let walker = this.head; walker; walker = walker.next) {
  	      yield walker.value;
  	    }
  	  };
  	};
  	return iterator;
  }

  var yallist;
  var hasRequiredYallist;

  function requireYallist () {
  	if (hasRequiredYallist) return yallist;
  	hasRequiredYallist = 1;
  	yallist = Yallist;

  	Yallist.Node = Node;
  	Yallist.create = Yallist;

  	function Yallist (list) {
  	  var self = this;
  	  if (!(self instanceof Yallist)) {
  	    self = new Yallist();
  	  }

  	  self.tail = null;
  	  self.head = null;
  	  self.length = 0;

  	  if (list && typeof list.forEach === 'function') {
  	    list.forEach(function (item) {
  	      self.push(item);
  	    });
  	  } else if (arguments.length > 0) {
  	    for (var i = 0, l = arguments.length; i < l; i++) {
  	      self.push(arguments[i]);
  	    }
  	  }

  	  return self
  	}

  	Yallist.prototype.removeNode = function (node) {
  	  if (node.list !== this) {
  	    throw new Error('removing node which does not belong to this list')
  	  }

  	  var next = node.next;
  	  var prev = node.prev;

  	  if (next) {
  	    next.prev = prev;
  	  }

  	  if (prev) {
  	    prev.next = next;
  	  }

  	  if (node === this.head) {
  	    this.head = next;
  	  }
  	  if (node === this.tail) {
  	    this.tail = prev;
  	  }

  	  node.list.length--;
  	  node.next = null;
  	  node.prev = null;
  	  node.list = null;

  	  return next
  	};

  	Yallist.prototype.unshiftNode = function (node) {
  	  if (node === this.head) {
  	    return
  	  }

  	  if (node.list) {
  	    node.list.removeNode(node);
  	  }

  	  var head = this.head;
  	  node.list = this;
  	  node.next = head;
  	  if (head) {
  	    head.prev = node;
  	  }

  	  this.head = node;
  	  if (!this.tail) {
  	    this.tail = node;
  	  }
  	  this.length++;
  	};

  	Yallist.prototype.pushNode = function (node) {
  	  if (node === this.tail) {
  	    return
  	  }

  	  if (node.list) {
  	    node.list.removeNode(node);
  	  }

  	  var tail = this.tail;
  	  node.list = this;
  	  node.prev = tail;
  	  if (tail) {
  	    tail.next = node;
  	  }

  	  this.tail = node;
  	  if (!this.head) {
  	    this.head = node;
  	  }
  	  this.length++;
  	};

  	Yallist.prototype.push = function () {
  	  for (var i = 0, l = arguments.length; i < l; i++) {
  	    push(this, arguments[i]);
  	  }
  	  return this.length
  	};

  	Yallist.prototype.unshift = function () {
  	  for (var i = 0, l = arguments.length; i < l; i++) {
  	    unshift(this, arguments[i]);
  	  }
  	  return this.length
  	};

  	Yallist.prototype.pop = function () {
  	  if (!this.tail) {
  	    return undefined
  	  }

  	  var res = this.tail.value;
  	  this.tail = this.tail.prev;
  	  if (this.tail) {
  	    this.tail.next = null;
  	  } else {
  	    this.head = null;
  	  }
  	  this.length--;
  	  return res
  	};

  	Yallist.prototype.shift = function () {
  	  if (!this.head) {
  	    return undefined
  	  }

  	  var res = this.head.value;
  	  this.head = this.head.next;
  	  if (this.head) {
  	    this.head.prev = null;
  	  } else {
  	    this.tail = null;
  	  }
  	  this.length--;
  	  return res
  	};

  	Yallist.prototype.forEach = function (fn, thisp) {
  	  thisp = thisp || this;
  	  for (var walker = this.head, i = 0; walker !== null; i++) {
  	    fn.call(thisp, walker.value, i, this);
  	    walker = walker.next;
  	  }
  	};

  	Yallist.prototype.forEachReverse = function (fn, thisp) {
  	  thisp = thisp || this;
  	  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
  	    fn.call(thisp, walker.value, i, this);
  	    walker = walker.prev;
  	  }
  	};

  	Yallist.prototype.get = function (n) {
  	  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
  	    // abort out of the list early if we hit a cycle
  	    walker = walker.next;
  	  }
  	  if (i === n && walker !== null) {
  	    return walker.value
  	  }
  	};

  	Yallist.prototype.getReverse = function (n) {
  	  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
  	    // abort out of the list early if we hit a cycle
  	    walker = walker.prev;
  	  }
  	  if (i === n && walker !== null) {
  	    return walker.value
  	  }
  	};

  	Yallist.prototype.map = function (fn, thisp) {
  	  thisp = thisp || this;
  	  var res = new Yallist();
  	  for (var walker = this.head; walker !== null;) {
  	    res.push(fn.call(thisp, walker.value, this));
  	    walker = walker.next;
  	  }
  	  return res
  	};

  	Yallist.prototype.mapReverse = function (fn, thisp) {
  	  thisp = thisp || this;
  	  var res = new Yallist();
  	  for (var walker = this.tail; walker !== null;) {
  	    res.push(fn.call(thisp, walker.value, this));
  	    walker = walker.prev;
  	  }
  	  return res
  	};

  	Yallist.prototype.reduce = function (fn, initial) {
  	  var acc;
  	  var walker = this.head;
  	  if (arguments.length > 1) {
  	    acc = initial;
  	  } else if (this.head) {
  	    walker = this.head.next;
  	    acc = this.head.value;
  	  } else {
  	    throw new TypeError('Reduce of empty list with no initial value')
  	  }

  	  for (var i = 0; walker !== null; i++) {
  	    acc = fn(acc, walker.value, i);
  	    walker = walker.next;
  	  }

  	  return acc
  	};

  	Yallist.prototype.reduceReverse = function (fn, initial) {
  	  var acc;
  	  var walker = this.tail;
  	  if (arguments.length > 1) {
  	    acc = initial;
  	  } else if (this.tail) {
  	    walker = this.tail.prev;
  	    acc = this.tail.value;
  	  } else {
  	    throw new TypeError('Reduce of empty list with no initial value')
  	  }

  	  for (var i = this.length - 1; walker !== null; i--) {
  	    acc = fn(acc, walker.value, i);
  	    walker = walker.prev;
  	  }

  	  return acc
  	};

  	Yallist.prototype.toArray = function () {
  	  var arr = new Array(this.length);
  	  for (var i = 0, walker = this.head; walker !== null; i++) {
  	    arr[i] = walker.value;
  	    walker = walker.next;
  	  }
  	  return arr
  	};

  	Yallist.prototype.toArrayReverse = function () {
  	  var arr = new Array(this.length);
  	  for (var i = 0, walker = this.tail; walker !== null; i++) {
  	    arr[i] = walker.value;
  	    walker = walker.prev;
  	  }
  	  return arr
  	};

  	Yallist.prototype.slice = function (from, to) {
  	  to = to || this.length;
  	  if (to < 0) {
  	    to += this.length;
  	  }
  	  from = from || 0;
  	  if (from < 0) {
  	    from += this.length;
  	  }
  	  var ret = new Yallist();
  	  if (to < from || to < 0) {
  	    return ret
  	  }
  	  if (from < 0) {
  	    from = 0;
  	  }
  	  if (to > this.length) {
  	    to = this.length;
  	  }
  	  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
  	    walker = walker.next;
  	  }
  	  for (; walker !== null && i < to; i++, walker = walker.next) {
  	    ret.push(walker.value);
  	  }
  	  return ret
  	};

  	Yallist.prototype.sliceReverse = function (from, to) {
  	  to = to || this.length;
  	  if (to < 0) {
  	    to += this.length;
  	  }
  	  from = from || 0;
  	  if (from < 0) {
  	    from += this.length;
  	  }
  	  var ret = new Yallist();
  	  if (to < from || to < 0) {
  	    return ret
  	  }
  	  if (from < 0) {
  	    from = 0;
  	  }
  	  if (to > this.length) {
  	    to = this.length;
  	  }
  	  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
  	    walker = walker.prev;
  	  }
  	  for (; walker !== null && i > from; i--, walker = walker.prev) {
  	    ret.push(walker.value);
  	  }
  	  return ret
  	};

  	Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  	  if (start > this.length) {
  	    start = this.length - 1;
  	  }
  	  if (start < 0) {
  	    start = this.length + start;
  	  }

  	  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
  	    walker = walker.next;
  	  }

  	  var ret = [];
  	  for (var i = 0; walker && i < deleteCount; i++) {
  	    ret.push(walker.value);
  	    walker = this.removeNode(walker);
  	  }
  	  if (walker === null) {
  	    walker = this.tail;
  	  }

  	  if (walker !== this.head && walker !== this.tail) {
  	    walker = walker.prev;
  	  }

  	  for (var i = 0; i < nodes.length; i++) {
  	    walker = insert(this, walker, nodes[i]);
  	  }
  	  return ret;
  	};

  	Yallist.prototype.reverse = function () {
  	  var head = this.head;
  	  var tail = this.tail;
  	  for (var walker = head; walker !== null; walker = walker.prev) {
  	    var p = walker.prev;
  	    walker.prev = walker.next;
  	    walker.next = p;
  	  }
  	  this.head = tail;
  	  this.tail = head;
  	  return this
  	};

  	function insert (self, node, value) {
  	  var inserted = node === self.head ?
  	    new Node(value, null, node, self) :
  	    new Node(value, node, node.next, self);

  	  if (inserted.next === null) {
  	    self.tail = inserted;
  	  }
  	  if (inserted.prev === null) {
  	    self.head = inserted;
  	  }

  	  self.length++;

  	  return inserted
  	}

  	function push (self, item) {
  	  self.tail = new Node(item, self.tail, null, self);
  	  if (!self.head) {
  	    self.head = self.tail;
  	  }
  	  self.length++;
  	}

  	function unshift (self, item) {
  	  self.head = new Node(item, null, self.head, self);
  	  if (!self.tail) {
  	    self.tail = self.head;
  	  }
  	  self.length++;
  	}

  	function Node (value, prev, next, list) {
  	  if (!(this instanceof Node)) {
  	    return new Node(value, prev, next, list)
  	  }

  	  this.list = list;
  	  this.value = value;

  	  if (prev) {
  	    prev.next = this;
  	    this.prev = prev;
  	  } else {
  	    this.prev = null;
  	  }

  	  if (next) {
  	    next.prev = this;
  	    this.next = next;
  	  } else {
  	    this.next = null;
  	  }
  	}

  	try {
  	  // add if support for Symbol.iterator is present
  	  requireIterator()(Yallist);
  	} catch (er) {}
  	return yallist;
  }

  var lruCache;
  var hasRequiredLruCache;

  function requireLruCache () {
  	if (hasRequiredLruCache) return lruCache;
  	hasRequiredLruCache = 1;

  	// A linked list to keep track of recently-used-ness
  	const Yallist = requireYallist();

  	const MAX = Symbol('max');
  	const LENGTH = Symbol('length');
  	const LENGTH_CALCULATOR = Symbol('lengthCalculator');
  	const ALLOW_STALE = Symbol('allowStale');
  	const MAX_AGE = Symbol('maxAge');
  	const DISPOSE = Symbol('dispose');
  	const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet');
  	const LRU_LIST = Symbol('lruList');
  	const CACHE = Symbol('cache');
  	const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet');

  	const naiveLength = () => 1;

  	// lruList is a yallist where the head is the youngest
  	// item, and the tail is the oldest.  the list contains the Hit
  	// objects as the entries.
  	// Each Hit object has a reference to its Yallist.Node.  This
  	// never changes.
  	//
  	// cache is a Map (or PseudoMap) that matches the keys to
  	// the Yallist.Node object.
  	class LRUCache {
  	  constructor (options) {
  	    if (typeof options === 'number')
  	      options = { max: options };

  	    if (!options)
  	      options = {};

  	    if (options.max && (typeof options.max !== 'number' || options.max < 0))
  	      throw new TypeError('max must be a non-negative number')
  	    // Kind of weird to have a default max of Infinity, but oh well.
  	    this[MAX] = options.max || Infinity;

  	    const lc = options.length || naiveLength;
  	    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc;
  	    this[ALLOW_STALE] = options.stale || false;
  	    if (options.maxAge && typeof options.maxAge !== 'number')
  	      throw new TypeError('maxAge must be a number')
  	    this[MAX_AGE] = options.maxAge || 0;
  	    this[DISPOSE] = options.dispose;
  	    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
  	    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
  	    this.reset();
  	  }

  	  // resize the cache when the max changes.
  	  set max (mL) {
  	    if (typeof mL !== 'number' || mL < 0)
  	      throw new TypeError('max must be a non-negative number')

  	    this[MAX] = mL || Infinity;
  	    trim(this);
  	  }
  	  get max () {
  	    return this[MAX]
  	  }

  	  set allowStale (allowStale) {
  	    this[ALLOW_STALE] = !!allowStale;
  	  }
  	  get allowStale () {
  	    return this[ALLOW_STALE]
  	  }

  	  set maxAge (mA) {
  	    if (typeof mA !== 'number')
  	      throw new TypeError('maxAge must be a non-negative number')

  	    this[MAX_AGE] = mA;
  	    trim(this);
  	  }
  	  get maxAge () {
  	    return this[MAX_AGE]
  	  }

  	  // resize the cache when the lengthCalculator changes.
  	  set lengthCalculator (lC) {
  	    if (typeof lC !== 'function')
  	      lC = naiveLength;

  	    if (lC !== this[LENGTH_CALCULATOR]) {
  	      this[LENGTH_CALCULATOR] = lC;
  	      this[LENGTH] = 0;
  	      this[LRU_LIST].forEach(hit => {
  	        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
  	        this[LENGTH] += hit.length;
  	      });
  	    }
  	    trim(this);
  	  }
  	  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  	  get length () { return this[LENGTH] }
  	  get itemCount () { return this[LRU_LIST].length }

  	  rforEach (fn, thisp) {
  	    thisp = thisp || this;
  	    for (let walker = this[LRU_LIST].tail; walker !== null;) {
  	      const prev = walker.prev;
  	      forEachStep(this, fn, walker, thisp);
  	      walker = prev;
  	    }
  	  }

  	  forEach (fn, thisp) {
  	    thisp = thisp || this;
  	    for (let walker = this[LRU_LIST].head; walker !== null;) {
  	      const next = walker.next;
  	      forEachStep(this, fn, walker, thisp);
  	      walker = next;
  	    }
  	  }

  	  keys () {
  	    return this[LRU_LIST].toArray().map(k => k.key)
  	  }

  	  values () {
  	    return this[LRU_LIST].toArray().map(k => k.value)
  	  }

  	  reset () {
  	    if (this[DISPOSE] &&
  	        this[LRU_LIST] &&
  	        this[LRU_LIST].length) {
  	      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value));
  	    }

  	    this[CACHE] = new Map(); // hash of items by key
  	    this[LRU_LIST] = new Yallist(); // list of items in order of use recency
  	    this[LENGTH] = 0; // length of items in the list
  	  }

  	  dump () {
  	    return this[LRU_LIST].map(hit =>
  	      isStale(this, hit) ? false : {
  	        k: hit.key,
  	        v: hit.value,
  	        e: hit.now + (hit.maxAge || 0)
  	      }).toArray().filter(h => h)
  	  }

  	  dumpLru () {
  	    return this[LRU_LIST]
  	  }

  	  set (key, value, maxAge) {
  	    maxAge = maxAge || this[MAX_AGE];

  	    if (maxAge && typeof maxAge !== 'number')
  	      throw new TypeError('maxAge must be a number')

  	    const now = maxAge ? Date.now() : 0;
  	    const len = this[LENGTH_CALCULATOR](value, key);

  	    if (this[CACHE].has(key)) {
  	      if (len > this[MAX]) {
  	        del(this, this[CACHE].get(key));
  	        return false
  	      }

  	      const node = this[CACHE].get(key);
  	      const item = node.value;

  	      // dispose of the old one before overwriting
  	      // split out into 2 ifs for better coverage tracking
  	      if (this[DISPOSE]) {
  	        if (!this[NO_DISPOSE_ON_SET])
  	          this[DISPOSE](key, item.value);
  	      }

  	      item.now = now;
  	      item.maxAge = maxAge;
  	      item.value = value;
  	      this[LENGTH] += len - item.length;
  	      item.length = len;
  	      this.get(key);
  	      trim(this);
  	      return true
  	    }

  	    const hit = new Entry(key, value, len, now, maxAge);

  	    // oversized objects fall out of cache automatically.
  	    if (hit.length > this[MAX]) {
  	      if (this[DISPOSE])
  	        this[DISPOSE](key, value);

  	      return false
  	    }

  	    this[LENGTH] += hit.length;
  	    this[LRU_LIST].unshift(hit);
  	    this[CACHE].set(key, this[LRU_LIST].head);
  	    trim(this);
  	    return true
  	  }

  	  has (key) {
  	    if (!this[CACHE].has(key)) return false
  	    const hit = this[CACHE].get(key).value;
  	    return !isStale(this, hit)
  	  }

  	  get (key) {
  	    return get(this, key, true)
  	  }

  	  peek (key) {
  	    return get(this, key, false)
  	  }

  	  pop () {
  	    const node = this[LRU_LIST].tail;
  	    if (!node)
  	      return null

  	    del(this, node);
  	    return node.value
  	  }

  	  del (key) {
  	    del(this, this[CACHE].get(key));
  	  }

  	  load (arr) {
  	    // reset the cache
  	    this.reset();

  	    const now = Date.now();
  	    // A previous serialized cache has the most recent items first
  	    for (let l = arr.length - 1; l >= 0; l--) {
  	      const hit = arr[l];
  	      const expiresAt = hit.e || 0;
  	      if (expiresAt === 0)
  	        // the item was created without expiration in a non aged cache
  	        this.set(hit.k, hit.v);
  	      else {
  	        const maxAge = expiresAt - now;
  	        // dont add already expired items
  	        if (maxAge > 0) {
  	          this.set(hit.k, hit.v, maxAge);
  	        }
  	      }
  	    }
  	  }

  	  prune () {
  	    this[CACHE].forEach((value, key) => get(this, key, false));
  	  }
  	}

  	const get = (self, key, doUse) => {
  	  const node = self[CACHE].get(key);
  	  if (node) {
  	    const hit = node.value;
  	    if (isStale(self, hit)) {
  	      del(self, node);
  	      if (!self[ALLOW_STALE])
  	        return undefined
  	    } else {
  	      if (doUse) {
  	        if (self[UPDATE_AGE_ON_GET])
  	          node.value.now = Date.now();
  	        self[LRU_LIST].unshiftNode(node);
  	      }
  	    }
  	    return hit.value
  	  }
  	};

  	const isStale = (self, hit) => {
  	  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
  	    return false

  	  const diff = Date.now() - hit.now;
  	  return hit.maxAge ? diff > hit.maxAge
  	    : self[MAX_AGE] && (diff > self[MAX_AGE])
  	};

  	const trim = self => {
  	  if (self[LENGTH] > self[MAX]) {
  	    for (let walker = self[LRU_LIST].tail;
  	      self[LENGTH] > self[MAX] && walker !== null;) {
  	      // We know that we're about to delete this one, and also
  	      // what the next least recently used key will be, so just
  	      // go ahead and set it now.
  	      const prev = walker.prev;
  	      del(self, walker);
  	      walker = prev;
  	    }
  	  }
  	};

  	const del = (self, node) => {
  	  if (node) {
  	    const hit = node.value;
  	    if (self[DISPOSE])
  	      self[DISPOSE](hit.key, hit.value);

  	    self[LENGTH] -= hit.length;
  	    self[CACHE].delete(hit.key);
  	    self[LRU_LIST].removeNode(node);
  	  }
  	};

  	class Entry {
  	  constructor (key, value, length, now, maxAge) {
  	    this.key = key;
  	    this.value = value;
  	    this.length = length;
  	    this.now = now;
  	    this.maxAge = maxAge || 0;
  	  }
  	}

  	const forEachStep = (self, fn, node, thisp) => {
  	  let hit = node.value;
  	  if (isStale(self, hit)) {
  	    del(self, node);
  	    if (!self[ALLOW_STALE])
  	      hit = undefined;
  	  }
  	  if (hit)
  	    fn.call(thisp, hit.value, hit.key, self);
  	};

  	lruCache = LRUCache;
  	return lruCache;
  }

  var range;
  var hasRequiredRange;

  function requireRange () {
  	if (hasRequiredRange) return range;
  	hasRequiredRange = 1;
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
  	      this.format();
  	      return this
  	    }

  	    this.options = options;
  	    this.loose = !!options.loose;
  	    this.includePrerelease = !!options.includePrerelease;

  	    // First reduce all whitespace as much as possible so we do not have to rely
  	    // on potentially slow regexes like \s*. This is then stored and used for
  	    // future error messages as well.
  	    this.raw = range
  	      .trim()
  	      .split(/\s+/)
  	      .join(' ');

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

  	    this.format();
  	  }

  	  format () {
  	    this.range = this.set
  	      .map((comps) => comps.join(' ').trim())
  	      .join('||')
  	      .trim();
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

  	const LRU = requireLruCache();
  	const cache = new LRU({ max: 1000 });

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
  	const hyphenReplace = incPr => ($0,
  	  from, fM, fm, fp, fpr, fb,
  	  to, tM, tm, tp, tpr, tb) => {
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

  class derivedSettingsClass {
      update(inputSettings) {
          const chartType = inputSettings.funnel.chart_type;
          const pChartType = ["PR"].includes(chartType);
          const percentSettingString = inputSettings.funnel.perc_labels;
          let multiplier = inputSettings.funnel.multiplier;
          let percentLabels;
          if (percentSettingString === "Yes") {
              multiplier = 100;
          }
          if (pChartType) {
              multiplier = multiplier === 1 ? 100 : multiplier;
          }
          if (percentSettingString === "Automatic") {
              percentLabels = pChartType && multiplier === 100;
          }
          else {
              percentLabels = percentSettingString === "Yes";
          }
          this.multiplier = multiplier;
          this.percentLabels = percentLabels;
      }
  }

  /**
   * This is the core class which controls the initialisation and
   * updating of user-settings. Each member is its own class defining
   * the types and default values for a given group of settings.
   *
   * These are defined in the settingsGroups.ts file
   */
  class settingsClass {
      /**
       * Function to read the values from the settings pane and update the
       * values stored in the class.
       *
       * @param inputObjects
       */
      update(inputView) {
          this.validationStatus
              = JSON.parse(JSON.stringify({ status: 0, messages: new Array(), error: "" }));
          // Get the names of all classes in settingsObject which have values to be updated
          const allSettingGroups = Object.keys(this.settings);
          allSettingGroups.forEach((settingGroup) => {
              const condFormatting = extractConditionalFormatting(inputView === null || inputView === void 0 ? void 0 : inputView.categorical, settingGroup, this.settings);
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
              // Get the names of all settings in a given class and
              // use those to extract and update the relevant values
              const settingNames = Object.keys(this.settings[settingGroup]);
              settingNames.forEach((settingName) => {
                  this.settings[settingGroup][settingName]
                      = (condFormatting === null || condFormatting === void 0 ? void 0 : condFormatting.values)
                          ? condFormatting === null || condFormatting === void 0 ? void 0 : condFormatting.values[0][settingName]
                          : defaultSettings[settingGroup][settingName]["default"];
              });
          });
          this.derivedSettings.update(this.settings);
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
                                      instanceKind: (typeof this.settings[curr_card_name][setting]) != "boolean" ? 3 /* powerbi.default.VisualEnumerationInstanceKinds.ConstantOrRule */ : null
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

  class Visual {
      constructor(options) {
          this.svg = select(options.element).append("svg");
          this.host = options.host;
          this.viewModel = new viewModelClass();
          this.plotProperties = new plotPropertiesClass();
          this.selectionManager = this.host.createSelectionManager();
          this.selectionManager.registerOnSelectCallback(() => this.updateHighlighting());
          this.svg.call(initialiseSVG);
      }
      update(options) {
          var _a, _b, _c, _d, _e;
          try {
              this.host.eventService.renderingStarted(options);
              // Remove printed error if refreshing after a previous error run
              this.svg.select(".errormessage").remove();
              // This step handles the updating of both the input data and settings
              // If there are any errors or failures, the update exits early sets the
              // update status to false
              const update_status = this.viewModel.update(options, this.host);
              if (!update_status.status) {
                  this.resizeCanvas(options.viewport.width, options.viewport.height);
                  if ((_e = (_d = (_c = (_b = (_a = this.viewModel) === null || _a === void 0 ? void 0 : _a.inputSettings) === null || _b === void 0 ? void 0 : _b.settings) === null || _c === void 0 ? void 0 : _c.canvas) === null || _d === void 0 ? void 0 : _d.show_errors) !== null && _e !== void 0 ? _e : true) {
                      this.svg.call(drawErrors, options, update_status === null || update_status === void 0 ? void 0 : update_status.error, update_status === null || update_status === void 0 ? void 0 : update_status.type);
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
              this.resizeCanvas(options.viewport.width, options.viewport.height);
              this.drawVisual();
              this.adjustPaddingForOverflow();
              this.updateHighlighting();
              this.host.eventService.renderingFinished(options);
          }
          catch (caught_error) {
              this.svg.call(drawErrors, options, caught_error.message, "internal");
              console.error(caught_error);
              this.host.eventService.renderingFailed(options);
          }
      }
      resizeCanvas(width, height) {
          this.svg.attr("width", width).attr("height", height);
      }
      updateHighlighting() {
          const anyHighlights = this.viewModel.inputData ? this.viewModel.inputData.anyHighlights : false;
          const allSelectionIDs = this.selectionManager.getSelectionIds();
          const dotsSelection = this.svg.selectAll(".dotsgroup").selectChildren();
          const linesSelection = this.svg.selectAll(".linesgroup").selectChildren();
          // Set the default opacity for all lines and dots
          linesSelection.style("stroke-opacity", (d) => {
              return getAesthetic(d[0], "lines", "opacity", this.viewModel.inputSettings.settings);
          });
          dotsSelection.style("fill-opacity", (d) => d.aesthetics.opacity);
          dotsSelection.style("stroke-opacity", (d) => d.aesthetics.opacity);
          if (anyHighlights || (allSelectionIDs.length > 0)) {
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
          }
      }
      drawVisual() {
          this.svg.call(drawXAxis, this)
              .call(drawYAxis, this)
              .call(drawTooltipLine, this)
              .call(drawLines, this)
              .call(drawLineLabels, this)
              .call(drawDots, this)
              .call(addContextMenu, this)
              .call(drawLabels, this);
      }
      adjustPaddingForOverflow() {
          // Headless mode does not render to screen so do not attempt to adjust for overflow
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
      getFormattingModel() {
          return this.viewModel.inputSettings.getFormattingModel();
      }
  }

  exports.Visual = Visual;
  exports.d3 = d3;
  exports.defaultSettings = defaultSettings;

  return exports;

})({});
