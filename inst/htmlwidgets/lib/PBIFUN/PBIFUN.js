var funnel=function(e){"use strict";var t="http://www.w3.org/1999/xhtml",r={svg:"http://www.w3.org/2000/svg",xhtml:t,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function n(e){var t=e+="",n=t.indexOf(":");return n>=0&&"xmlns"!==(t=e.slice(0,n))&&(e=e.slice(n+1)),r.hasOwnProperty(t)?{space:r[t],local:e}:e}function i(e){return function(){var r=this.ownerDocument,n=this.namespaceURI;return n===t&&r.documentElement.namespaceURI===t?r.createElement(e):r.createElementNS(n,e)}}function o(e){return function(){return this.ownerDocument.createElementNS(e.space,e.local)}}function a(e){var t=n(e);return(t.local?o:i)(t)}function s(){}function l(e){return null==e?s:function(){return this.querySelector(e)}}function u(e){return null==e?[]:Array.isArray(e)?e:Array.from(e)}function c(){return[]}function p(e){return function(t){return t.matches(e)}}var f=Array.prototype.find;function d(){return this.firstElementChild}var h=Array.prototype.filter;function m(){return Array.from(this.children)}function g(e){return new Array(e.length)}function y(e,t){this.ownerDocument=e.ownerDocument,this.namespaceURI=e.namespaceURI,this._next=null,this._parent=e,this.__data__=t}function v(e,t,r,n,i,o){for(var a,s=0,l=t.length,u=o.length;s<u;++s)(a=t[s])?(a.__data__=o[s],n[s]=a):r[s]=new y(e,o[s]);for(;s<l;++s)(a=t[s])&&(i[s]=a)}function w(e,t,r,n,i,o,a){var s,l,u,c=new Map,p=t.length,f=o.length,d=new Array(p);for(s=0;s<p;++s)(l=t[s])&&(d[s]=u=a.call(l,l.__data__,s,t)+"",c.has(u)?i[s]=l:c.set(u,l));for(s=0;s<f;++s)u=a.call(e,o[s],s,o)+"",(l=c.get(u))?(n[s]=l,l.__data__=o[s],c.delete(u)):r[s]=new y(e,o[s]);for(s=0;s<p;++s)(l=t[s])&&c.get(d[s])===l&&(i[s]=l)}function _(e){return e.__data__}function b(e){return"object"==typeof e&&"length"in e?e:Array.from(e)}function N(e,t){return e<t?-1:e>t?1:e>=t?0:NaN}function x(e){return function(){this.removeAttribute(e)}}function E(e){return function(){this.removeAttributeNS(e.space,e.local)}}function S(e,t){return function(){this.setAttribute(e,t)}}function A(e,t){return function(){this.setAttributeNS(e.space,e.local,t)}}function $(e,t){return function(){var r=t.apply(this,arguments);null==r?this.removeAttribute(e):this.setAttribute(e,r)}}function T(e,t){return function(){var r=t.apply(this,arguments);null==r?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,r)}}function M(e){return e.ownerDocument&&e.ownerDocument.defaultView||e.document&&e||e.defaultView}function k(e){return function(){this.style.removeProperty(e)}}function P(e,t,r){return function(){this.style.setProperty(e,t,r)}}function I(e,t,r){return function(){var n=t.apply(this,arguments);null==n?this.style.removeProperty(e):this.style.setProperty(e,n,r)}}function D(e){return function(){delete this[e]}}function R(e,t){return function(){this[e]=t}}function L(e,t){return function(){var r=t.apply(this,arguments);null==r?delete this[e]:this[e]=r}}function O(e){return e.trim().split(/^|\s+/)}function C(e){return e.classList||new V(e)}function V(e){this._node=e,this._names=O(e.getAttribute("class")||"")}function j(e,t){for(var r=C(e),n=-1,i=t.length;++n<i;)r.add(t[n])}function F(e,t){for(var r=C(e),n=-1,i=t.length;++n<i;)r.remove(t[n])}function U(e){return function(){j(this,e)}}function z(e){return function(){F(this,e)}}function q(e,t){return function(){(t.apply(this,arguments)?j:F)(this,e)}}function G(){this.textContent=""}function H(e){return function(){this.textContent=e}}function B(e){return function(){var t=e.apply(this,arguments);this.textContent=null==t?"":t}}function X(){this.innerHTML=""}function W(e){return function(){this.innerHTML=e}}function Y(e){return function(){var t=e.apply(this,arguments);this.innerHTML=null==t?"":t}}function K(){this.nextSibling&&this.parentNode.appendChild(this)}function Z(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function J(){return null}function Q(){var e=this.parentNode;e&&e.removeChild(this)}function ee(){var e=this.cloneNode(!1),t=this.parentNode;return t?t.insertBefore(e,this.nextSibling):e}function te(){var e=this.cloneNode(!0),t=this.parentNode;return t?t.insertBefore(e,this.nextSibling):e}function re(e){return function(){var t=this.__on;if(t){for(var r,n=0,i=-1,o=t.length;n<o;++n)r=t[n],e.type&&r.type!==e.type||r.name!==e.name?t[++i]=r:this.removeEventListener(r.type,r.listener,r.options);++i?t.length=i:delete this.__on}}}function ne(e,t,r){return function(){var n,i=this.__on,o=function(e){return function(t){e.call(this,t,this.__data__)}}(t);if(i)for(var a=0,s=i.length;a<s;++a)if((n=i[a]).type===e.type&&n.name===e.name)return this.removeEventListener(n.type,n.listener,n.options),this.addEventListener(n.type,n.listener=o,n.options=r),void(n.value=t);this.addEventListener(e.type,o,r),n={type:e.type,name:e.name,value:t,listener:o,options:r},i?i.push(n):this.__on=[n]}}function ie(e,t,r){var n=M(e),i=n.CustomEvent;"function"==typeof i?i=new i(t,r):(i=n.document.createEvent("Event"),r?(i.initEvent(t,r.bubbles,r.cancelable),i.detail=r.detail):i.initEvent(t,!1,!1)),e.dispatchEvent(i)}function oe(e,t){return function(){return ie(this,e,t)}}function ae(e,t){return function(){return ie(this,e,t.apply(this,arguments))}}y.prototype={constructor:y,appendChild:function(e){return this._parent.insertBefore(e,this._next)},insertBefore:function(e,t){return this._parent.insertBefore(e,t)},querySelector:function(e){return this._parent.querySelector(e)},querySelectorAll:function(e){return this._parent.querySelectorAll(e)}},V.prototype={add:function(e){this._names.indexOf(e)<0&&(this._names.push(e),this._node.setAttribute("class",this._names.join(" ")))},remove:function(e){var t=this._names.indexOf(e);t>=0&&(this._names.splice(t,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(e){return this._names.indexOf(e)>=0}};var se=[null];function le(e,t){this._groups=e,this._parents=t}function ue(e){return"string"==typeof e?new le([[document.querySelector(e)]],[document.documentElement]):new le([[e]],se)}function ce(e,t){if(e=function(e){let t;for(;t=e.sourceEvent;)e=t;return e}(e),void 0===t&&(t=e.currentTarget),t){var r=t.ownerSVGElement||t;if(r.createSVGPoint){var n=r.createSVGPoint();return n.x=e.clientX,n.y=e.clientY,[(n=n.matrixTransform(t.getScreenCTM().inverse())).x,n.y]}if(t.getBoundingClientRect){var i=t.getBoundingClientRect();return[e.clientX-i.left-t.clientLeft,e.clientY-i.top-t.clientTop]}}return[e.pageX,e.pageY]}function pe(e){return function(){return e}}le.prototype={constructor:le,select:function(e){"function"!=typeof e&&(e=l(e));for(var t=this._groups,r=t.length,n=new Array(r),i=0;i<r;++i)for(var o,a,s=t[i],u=s.length,c=n[i]=new Array(u),p=0;p<u;++p)(o=s[p])&&(a=e.call(o,o.__data__,p,s))&&("__data__"in o&&(a.__data__=o.__data__),c[p]=a);return new le(n,this._parents)},selectAll:function(e){e="function"==typeof e?function(e){return function(){return u(e.apply(this,arguments))}}(e):function(e){return null==e?c:function(){return this.querySelectorAll(e)}}(e);for(var t=this._groups,r=t.length,n=[],i=[],o=0;o<r;++o)for(var a,s=t[o],l=s.length,p=0;p<l;++p)(a=s[p])&&(n.push(e.call(a,a.__data__,p,s)),i.push(a));return new le(n,i)},selectChild:function(e){return this.select(null==e?d:function(e){return function(){return f.call(this.children,e)}}("function"==typeof e?e:p(e)))},selectChildren:function(e){return this.selectAll(null==e?m:function(e){return function(){return h.call(this.children,e)}}("function"==typeof e?e:p(e)))},filter:function(e){"function"!=typeof e&&(e=function(e){return function(){return this.matches(e)}}(e));for(var t=this._groups,r=t.length,n=new Array(r),i=0;i<r;++i)for(var o,a=t[i],s=a.length,l=n[i]=[],u=0;u<s;++u)(o=a[u])&&e.call(o,o.__data__,u,a)&&l.push(o);return new le(n,this._parents)},data:function(e,t){if(!arguments.length)return Array.from(this,_);var r=t?w:v,n=this._parents,i=this._groups;"function"!=typeof e&&(e=function(e){return function(){return e}}(e));for(var o=i.length,a=new Array(o),s=new Array(o),l=new Array(o),u=0;u<o;++u){var c=n[u],p=i[u],f=p.length,d=b(e.call(c,c&&c.__data__,u,n)),h=d.length,m=s[u]=new Array(h),g=a[u]=new Array(h);r(c,p,m,g,l[u]=new Array(f),d,t);for(var y,N,x=0,E=0;x<h;++x)if(y=m[x]){for(x>=E&&(E=x+1);!(N=g[E])&&++E<h;);y._next=N||null}}return(a=new le(a,n))._enter=s,a._exit=l,a},enter:function(){return new le(this._enter||this._groups.map(g),this._parents)},exit:function(){return new le(this._exit||this._groups.map(g),this._parents)},join:function(e,t,r){var n=this.enter(),i=this,o=this.exit();return"function"==typeof e?(n=e(n))&&(n=n.selection()):n=n.append(e+""),null!=t&&(i=t(i))&&(i=i.selection()),null==r?o.remove():r(o),n&&i?n.merge(i).order():i},merge:function(e){for(var t=e.selection?e.selection():e,r=this._groups,n=t._groups,i=r.length,o=n.length,a=Math.min(i,o),s=new Array(i),l=0;l<a;++l)for(var u,c=r[l],p=n[l],f=c.length,d=s[l]=new Array(f),h=0;h<f;++h)(u=c[h]||p[h])&&(d[h]=u);for(;l<i;++l)s[l]=r[l];return new le(s,this._parents)},selection:function(){return this},order:function(){for(var e=this._groups,t=-1,r=e.length;++t<r;)for(var n,i=e[t],o=i.length-1,a=i[o];--o>=0;)(n=i[o])&&(a&&4^n.compareDocumentPosition(a)&&a.parentNode.insertBefore(n,a),a=n);return this},sort:function(e){function t(t,r){return t&&r?e(t.__data__,r.__data__):!t-!r}e||(e=N);for(var r=this._groups,n=r.length,i=new Array(n),o=0;o<n;++o){for(var a,s=r[o],l=s.length,u=i[o]=new Array(l),c=0;c<l;++c)(a=s[c])&&(u[c]=a);u.sort(t)}return new le(i,this._parents).order()},call:function(){var e=arguments[0];return arguments[0]=this,e.apply(null,arguments),this},nodes:function(){return Array.from(this)},node:function(){for(var e=this._groups,t=0,r=e.length;t<r;++t)for(var n=e[t],i=0,o=n.length;i<o;++i){var a=n[i];if(a)return a}return null},size:function(){let e=0;for(const t of this)++e;return e},empty:function(){return!this.node()},each:function(e){for(var t=this._groups,r=0,n=t.length;r<n;++r)for(var i,o=t[r],a=0,s=o.length;a<s;++a)(i=o[a])&&e.call(i,i.__data__,a,o);return this},attr:function(e,t){var r=n(e);if(arguments.length<2){var i=this.node();return r.local?i.getAttributeNS(r.space,r.local):i.getAttribute(r)}return this.each((null==t?r.local?E:x:"function"==typeof t?r.local?T:$:r.local?A:S)(r,t))},style:function(e,t,r){return arguments.length>1?this.each((null==t?k:"function"==typeof t?I:P)(e,t,null==r?"":r)):function(e,t){return e.style.getPropertyValue(t)||M(e).getComputedStyle(e,null).getPropertyValue(t)}(this.node(),e)},property:function(e,t){return arguments.length>1?this.each((null==t?D:"function"==typeof t?L:R)(e,t)):this.node()[e]},classed:function(e,t){var r=O(e+"");if(arguments.length<2){for(var n=C(this.node()),i=-1,o=r.length;++i<o;)if(!n.contains(r[i]))return!1;return!0}return this.each(("function"==typeof t?q:t?U:z)(r,t))},text:function(e){return arguments.length?this.each(null==e?G:("function"==typeof e?B:H)(e)):this.node().textContent},html:function(e){return arguments.length?this.each(null==e?X:("function"==typeof e?Y:W)(e)):this.node().innerHTML},raise:function(){return this.each(K)},lower:function(){return this.each(Z)},append:function(e){var t="function"==typeof e?e:a(e);return this.select((function(){return this.appendChild(t.apply(this,arguments))}))},insert:function(e,t){var r="function"==typeof e?e:a(e),n=null==t?J:"function"==typeof t?t:l(t);return this.select((function(){return this.insertBefore(r.apply(this,arguments),n.apply(this,arguments)||null)}))},remove:function(){return this.each(Q)},clone:function(e){return this.select(e?te:ee)},datum:function(e){return arguments.length?this.property("__data__",e):this.node().__data__},on:function(e,t,r){var n,i,o=function(e){return e.trim().split(/^|\s+/).map((function(e){var t="",r=e.indexOf(".");return r>=0&&(t=e.slice(r+1),e=e.slice(0,r)),{type:e,name:t}}))}(e+""),a=o.length;if(!(arguments.length<2)){for(s=t?ne:re,n=0;n<a;++n)this.each(s(o[n],t,r));return this}var s=this.node().__on;if(s)for(var l,u=0,c=s.length;u<c;++u)for(n=0,l=s[u];n<a;++n)if((i=o[n]).type===l.type&&i.name===l.name)return l.value},dispatch:function(e,t){return this.each(("function"==typeof t?ae:oe)(e,t))},[Symbol.iterator]:function*(){for(var e=this._groups,t=0,r=e.length;t<r;++t)for(var n,i=e[t],o=0,a=i.length;o<a;++o)(n=i[o])&&(yield n)}};const fe=Math.cos,de=Math.min,he=Math.sin,me=Math.sqrt,ge=Math.PI,ye=2*ge,ve=Math.PI,we=2*ve,_e=1e-6,be=we-_e;function Ne(e){this._+=e[0];for(let t=1,r=e.length;t<r;++t)this._+=arguments[t]+e[t]}class xe{constructor(e){this._x0=this._y0=this._x1=this._y1=null,this._="",this._append=null==e?Ne:function(e){let t=Math.floor(e);if(!(t>=0))throw new Error(`invalid digits: ${e}`);if(t>15)return Ne;const r=10**t;return function(e){this._+=e[0];for(let t=1,n=e.length;t<n;++t)this._+=Math.round(arguments[t]*r)/r+e[t]}}(e)}moveTo(e,t){this._append`M${this._x0=this._x1=+e},${this._y0=this._y1=+t}`}closePath(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._append`Z`)}lineTo(e,t){this._append`L${this._x1=+e},${this._y1=+t}`}quadraticCurveTo(e,t,r,n){this._append`Q${+e},${+t},${this._x1=+r},${this._y1=+n}`}bezierCurveTo(e,t,r,n,i,o){this._append`C${+e},${+t},${+r},${+n},${this._x1=+i},${this._y1=+o}`}arcTo(e,t,r,n,i){if(e=+e,t=+t,r=+r,n=+n,(i=+i)<0)throw new Error(`negative radius: ${i}`);let o=this._x1,a=this._y1,s=r-e,l=n-t,u=o-e,c=a-t,p=u*u+c*c;if(null===this._x1)this._append`M${this._x1=e},${this._y1=t}`;else if(p>_e)if(Math.abs(c*s-l*u)>_e&&i){let f=r-o,d=n-a,h=s*s+l*l,m=f*f+d*d,g=Math.sqrt(h),y=Math.sqrt(p),v=i*Math.tan((ve-Math.acos((h+p-m)/(2*g*y)))/2),w=v/y,_=v/g;Math.abs(w-1)>_e&&this._append`L${e+w*u},${t+w*c}`,this._append`A${i},${i},0,0,${+(c*f>u*d)},${this._x1=e+_*s},${this._y1=t+_*l}`}else this._append`L${this._x1=e},${this._y1=t}`;else;}arc(e,t,r,n,i,o){if(e=+e,t=+t,o=!!o,(r=+r)<0)throw new Error(`negative radius: ${r}`);let a=r*Math.cos(n),s=r*Math.sin(n),l=e+a,u=t+s,c=1^o,p=o?n-i:i-n;null===this._x1?this._append`M${l},${u}`:(Math.abs(this._x1-l)>_e||Math.abs(this._y1-u)>_e)&&this._append`L${l},${u}`,r&&(p<0&&(p=p%we+we),p>be?this._append`A${r},${r},0,1,${c},${e-a},${t-s}A${r},${r},0,1,${c},${this._x1=l},${this._y1=u}`:p>_e&&this._append`A${r},${r},0,${+(p>=ve)},${c},${this._x1=e+r*Math.cos(i)},${this._y1=t+r*Math.sin(i)}`)}rect(e,t,r,n){this._append`M${this._x0=this._x1=+e},${this._y0=this._y1=+t}h${r=+r}v${+n}h${-r}Z`}toString(){return this._}}function Ee(e){let t=3;return e.digits=function(r){if(!arguments.length)return t;if(null==r)t=null;else{const e=Math.floor(r);if(!(e>=0))throw new RangeError(`invalid digits: ${r}`);t=e}return e},()=>new xe(t)}function Se(e){this._context=e}function Ae(e){return new Se(e)}function $e(e){return e[0]}function Te(e){return e[1]}function Me(e,t){var r=pe(!0),n=null,i=Ae,o=null,a=Ee(s);function s(s){var l,u,c,p=(s=function(e){return"object"==typeof e&&"length"in e?e:Array.from(e)}(s)).length,f=!1;for(null==n&&(o=i(c=a())),l=0;l<=p;++l)!(l<p&&r(u=s[l],l,s))===f&&((f=!f)?o.lineStart():o.lineEnd()),f&&o.point(+e(u,l,s),+t(u,l,s));if(c)return o=null,c+""||null}return e="function"==typeof e?e:void 0===e?$e:pe(e),t="function"==typeof t?t:void 0===t?Te:pe(t),s.x=function(t){return arguments.length?(e="function"==typeof t?t:pe(+t),s):e},s.y=function(e){return arguments.length?(t="function"==typeof e?e:pe(+e),s):t},s.defined=function(e){return arguments.length?(r="function"==typeof e?e:pe(!!e),s):r},s.curve=function(e){return arguments.length?(i=e,null!=n&&(o=i(n)),s):i},s.context=function(e){return arguments.length?(null==e?n=o=null:o=i(n=e),s):n},s}Se.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(e,t){switch(e=+e,t=+t,this._point){case 0:this._point=1,this._line?this._context.lineTo(e,t):this._context.moveTo(e,t);break;case 1:this._point=2;default:this._context.lineTo(e,t)}}};const ke=me(3);var Pe={draw(e,t){const r=.59436*me(t+de(t/28,.75)),n=r/2,i=n*ke;e.moveTo(0,r),e.lineTo(0,-r),e.moveTo(-i,-n),e.lineTo(i,n),e.moveTo(-i,n),e.lineTo(i,-n)}},Ie={draw(e,t){const r=me(t/ge);e.moveTo(r,0),e.arc(0,0,r,0,ye)}},De={draw(e,t){const r=me(t/5)/2;e.moveTo(-3*r,-r),e.lineTo(-r,-r),e.lineTo(-r,-3*r),e.lineTo(r,-3*r),e.lineTo(r,-r),e.lineTo(3*r,-r),e.lineTo(3*r,r),e.lineTo(r,r),e.lineTo(r,3*r),e.lineTo(-r,3*r),e.lineTo(-r,r),e.lineTo(-3*r,r),e.closePath()}};const Re=me(1/3),Le=2*Re;var Oe={draw(e,t){const r=me(t/Le),n=r*Re;e.moveTo(0,-r),e.lineTo(n,0),e.lineTo(0,r),e.lineTo(-n,0),e.closePath()}},Ce={draw(e,t){const r=me(t),n=-r/2;e.rect(n,n,r,r)}};const Ve=he(ge/10)/he(7*ge/10),je=he(ye/10)*Ve,Fe=-fe(ye/10)*Ve;var Ue={draw(e,t){const r=me(.8908130915292852*t),n=je*r,i=Fe*r;e.moveTo(0,-r),e.lineTo(n,i);for(let t=1;t<5;++t){const o=ye*t/5,a=fe(o),s=he(o);e.lineTo(s*r,-a*r),e.lineTo(a*n-s*i,s*n+a*i)}e.closePath()}};const ze=me(3);var qe={draw(e,t){const r=-me(t/(3*ze));e.moveTo(0,2*r),e.lineTo(-ze*r,-r),e.lineTo(ze*r,-r),e.closePath()}};const Ge=-.5,He=me(3)/2,Be=1/me(12),Xe=3*(Be/2+1);var We={draw(e,t){const r=me(t/Xe),n=r/2,i=r*Be,o=n,a=r*Be+r,s=-o,l=a;e.moveTo(n,i),e.lineTo(o,a),e.lineTo(s,l),e.lineTo(Ge*n-He*i,He*n+Ge*i),e.lineTo(Ge*o-He*a,He*o+Ge*a),e.lineTo(Ge*s-He*l,He*s+Ge*l),e.lineTo(Ge*n+He*i,Ge*i-He*n),e.lineTo(Ge*o+He*a,Ge*a-He*o),e.lineTo(Ge*s+He*l,Ge*l-He*s),e.closePath()}};function Ye(e,t){let r=null,n=Ee(i);function i(){let i;if(r||(r=i=n()),e.apply(this,arguments).draw(r,+t.apply(this,arguments)),i)return r=null,i+""||null}return e="function"==typeof e?e:pe(e||Ie),t="function"==typeof t?t:pe(void 0===t?64:+t),i.type=function(t){return arguments.length?(e="function"==typeof t?t:pe(t),i):e},i.size=function(e){return arguments.length?(t="function"==typeof e?e:pe(+e),i):t},i.context=function(e){return arguments.length?(r=null==e?null:e,i):r},i}function Ke(e){return e}var Ze=1e-6;function Je(e){return"translate("+e+",0)"}function Qe(e){return"translate(0,"+e+")"}function et(e){return t=>+e(t)}function tt(e,t){return t=Math.max(0,e.bandwidth()-2*t)/2,e.round()&&(t=Math.round(t)),r=>+e(r)+t}function rt(){return!this.__axis}function nt(e,t){var r=[],n=null,i=null,o=6,a=6,s=3,l="undefined"!=typeof window&&window.devicePixelRatio>1?0:.5,u=1===e||4===e?-1:1,c=4===e||2===e?"x":"y",p=1===e||3===e?Je:Qe;function f(f){var d=null==n?t.ticks?t.ticks.apply(t,r):t.domain():n,h=null==i?t.tickFormat?t.tickFormat.apply(t,r):Ke:i,m=Math.max(o,0)+s,g=t.range(),y=+g[0]+l,v=+g[g.length-1]+l,w=(t.bandwidth?tt:et)(t.copy(),l),_=f.selection?f.selection():f,b=_.selectAll(".domain").data([null]),N=_.selectAll(".tick").data(d,t).order(),x=N.exit(),E=N.enter().append("g").attr("class","tick"),S=N.select("line"),A=N.select("text");b=b.merge(b.enter().insert("path",".tick").attr("class","domain").attr("stroke","currentColor")),N=N.merge(E),S=S.merge(E.append("line").attr("stroke","currentColor").attr(c+"2",u*o)),A=A.merge(E.append("text").attr("fill","currentColor").attr(c,u*m).attr("dy",1===e?"0em":3===e?"0.71em":"0.32em")),f!==_&&(b=b.transition(f),N=N.transition(f),S=S.transition(f),A=A.transition(f),x=x.transition(f).attr("opacity",Ze).attr("transform",(function(e){return isFinite(e=w(e))?p(e+l):this.getAttribute("transform")})),E.attr("opacity",Ze).attr("transform",(function(e){var t=this.parentNode.__axis;return p((t&&isFinite(t=t(e))?t:w(e))+l)}))),x.remove(),b.attr("d",4===e||2===e?a?"M"+u*a+","+y+"H"+l+"V"+v+"H"+u*a:"M"+l+","+y+"V"+v:a?"M"+y+","+u*a+"V"+l+"H"+v+"V"+u*a:"M"+y+","+l+"H"+v),N.attr("opacity",1).attr("transform",(function(e){return p(w(e)+l)})),S.attr(c+"2",u*o),A.attr(c,u*m).text(h),_.filter(rt).attr("fill","none").attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor",2===e?"start":4===e?"end":"middle"),_.each((function(){this.__axis=w}))}return f.scale=function(e){return arguments.length?(t=e,f):t},f.ticks=function(){return r=Array.from(arguments),f},f.tickArguments=function(e){return arguments.length?(r=null==e?[]:Array.from(e),f):r.slice()},f.tickValues=function(e){return arguments.length?(n=null==e?null:Array.from(e),f):n&&n.slice()},f.tickFormat=function(e){return arguments.length?(i=e,f):i},f.tickSize=function(e){return arguments.length?(o=a=+e,f):o},f.tickSizeInner=function(e){return arguments.length?(o=+e,f):o},f.tickSizeOuter=function(e){return arguments.length?(a=+e,f):a},f.tickPadding=function(e){return arguments.length?(s=+e,f):s},f.offset=function(e){return arguments.length?(l=+e,f):l},f}function it(e){return nt(3,e)}function ot(e){return nt(4,e)}function at(e,t){return null==e||null==t?NaN:e<t?-1:e>t?1:e>=t?0:NaN}function st(e,t){return null==e||null==t?NaN:t<e?-1:t>e?1:t>=e?0:NaN}function lt(e){let t,r,n;function i(e,n,i=0,o=e.length){if(i<o){if(0!==t(n,n))return o;do{const t=i+o>>>1;r(e[t],n)<0?i=t+1:o=t}while(i<o)}return i}return 2!==e.length?(t=at,r=(t,r)=>at(e(t),r),n=(t,r)=>e(t)-r):(t=e===at||e===st?e:ut,r=e,n=e),{left:i,center:function(e,t,r=0,o=e.length){const a=i(e,t,r,o-1);return a>r&&n(e[a-1],t)>-n(e[a],t)?a-1:a},right:function(e,n,i=0,o=e.length){if(i<o){if(0!==t(n,n))return o;do{const t=i+o>>>1;r(e[t],n)<=0?i=t+1:o=t}while(i<o)}return i}}}function ut(){return 0}const ct=lt(at).right;function pt(e,t){return(null==e||!(e>=e))-(null==t||!(t>=t))||(e<t?-1:e>t?1:0)}lt((function(e){return null===e?NaN:+e})).center;const ft=Math.sqrt(50),dt=Math.sqrt(10),ht=Math.sqrt(2);function mt(e,t,r){const n=(t-e)/Math.max(0,r),i=Math.floor(Math.log10(n)),o=n/Math.pow(10,i),a=o>=ft?10:o>=dt?5:o>=ht?2:1;let s,l,u;return i<0?(u=Math.pow(10,-i)/a,s=Math.round(e*u),l=Math.round(t*u),s/u<e&&++s,l/u>t&&--l,u=-u):(u=Math.pow(10,i)*a,s=Math.round(e/u),l=Math.round(t/u),s*u<e&&++s,l*u>t&&--l),l<s&&.5<=r&&r<2?mt(e,t,2*r):[s,l,u]}function gt(e,t,r){return mt(e=+e,t=+t,r=+r)[2]}function yt(e,t){let r;for(const t of e)null!=t&&(r<t||void 0===r&&t>=t)&&(r=t);return r}function vt(e,t){let r;for(const t of e)null!=t&&(r>t||void 0===r&&t>=t)&&(r=t);return r}function wt(e,t,r=0,n=1/0,i){if(t=Math.floor(t),r=Math.floor(Math.max(0,r)),n=Math.floor(Math.min(e.length-1,n)),!(r<=t&&t<=n))return e;for(i=void 0===i?pt:function(e=at){if(e===at)return pt;if("function"!=typeof e)throw new TypeError("compare is not a function");return(t,r)=>{const n=e(t,r);return n||0===n?n:(0===e(r,r))-(0===e(t,t))}}(i);n>r;){if(n-r>600){const o=n-r+1,a=t-r+1,s=Math.log(o),l=.5*Math.exp(2*s/3),u=.5*Math.sqrt(s*l*(o-l)/o)*(a-o/2<0?-1:1);wt(e,t,Math.max(r,Math.floor(t-a*l/o+u)),Math.min(n,Math.floor(t+(o-a)*l/o+u)),i)}const o=e[t];let a=r,s=n;for(_t(e,r,t),i(e[n],o)>0&&_t(e,r,n);a<s;){for(_t(e,a,s),++a,--s;i(e[a],o)<0;)++a;for(;i(e[s],o)>0;)--s}0===i(e[r],o)?_t(e,r,s):(++s,_t(e,s,n)),s<=t&&(r=s+1),t<=s&&(n=s-1)}return e}function _t(e,t,r){const n=e[t];e[t]=e[r],e[r]=n}function bt(e,t,r){if((n=(e=Float64Array.from(function*(e){for(let t of e)null!=t&&(t=+t)>=t&&(yield t)}(e))).length)&&!isNaN(t=+t)){if(t<=0||n<2)return vt(e);if(t>=1)return yt(e);var n,i=(n-1)*t,o=Math.floor(i),a=yt(wt(e,o).subarray(0,o+1));return a+(vt(e.subarray(o+1))-a)*(i-o)}}function Nt(e,t){let r=0;for(let t of e)(t=+t)&&(r+=t);return r}function xt(e,t){switch(arguments.length){case 0:break;case 1:this.range(e);break;default:this.range(t).domain(e)}return this}function Et(e,t,r){e.prototype=t.prototype=r,r.constructor=e}function St(e,t){var r=Object.create(e.prototype);for(var n in t)r[n]=t[n];return r}function At(){}var $t=.7,Tt=1/$t,Mt="\\s*([+-]?\\d+)\\s*",kt="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",Pt="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",It=/^#([0-9a-f]{3,8})$/,Dt=new RegExp(`^rgb\\(${Mt},${Mt},${Mt}\\)$`),Rt=new RegExp(`^rgb\\(${Pt},${Pt},${Pt}\\)$`),Lt=new RegExp(`^rgba\\(${Mt},${Mt},${Mt},${kt}\\)$`),Ot=new RegExp(`^rgba\\(${Pt},${Pt},${Pt},${kt}\\)$`),Ct=new RegExp(`^hsl\\(${kt},${Pt},${Pt}\\)$`),Vt=new RegExp(`^hsla\\(${kt},${Pt},${Pt},${kt}\\)$`),jt={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};function Ft(){return this.rgb().formatHex()}function Ut(){return this.rgb().formatRgb()}function zt(e){var t,r;return e=(e+"").trim().toLowerCase(),(t=It.exec(e))?(r=t[1].length,t=parseInt(t[1],16),6===r?qt(t):3===r?new Bt(t>>8&15|t>>4&240,t>>4&15|240&t,(15&t)<<4|15&t,1):8===r?Gt(t>>24&255,t>>16&255,t>>8&255,(255&t)/255):4===r?Gt(t>>12&15|t>>8&240,t>>8&15|t>>4&240,t>>4&15|240&t,((15&t)<<4|15&t)/255):null):(t=Dt.exec(e))?new Bt(t[1],t[2],t[3],1):(t=Rt.exec(e))?new Bt(255*t[1]/100,255*t[2]/100,255*t[3]/100,1):(t=Lt.exec(e))?Gt(t[1],t[2],t[3],t[4]):(t=Ot.exec(e))?Gt(255*t[1]/100,255*t[2]/100,255*t[3]/100,t[4]):(t=Ct.exec(e))?Jt(t[1],t[2]/100,t[3]/100,1):(t=Vt.exec(e))?Jt(t[1],t[2]/100,t[3]/100,t[4]):jt.hasOwnProperty(e)?qt(jt[e]):"transparent"===e?new Bt(NaN,NaN,NaN,0):null}function qt(e){return new Bt(e>>16&255,e>>8&255,255&e,1)}function Gt(e,t,r,n){return n<=0&&(e=t=r=NaN),new Bt(e,t,r,n)}function Ht(e,t,r,n){return 1===arguments.length?((i=e)instanceof At||(i=zt(i)),i?new Bt((i=i.rgb()).r,i.g,i.b,i.opacity):new Bt):new Bt(e,t,r,null==n?1:n);var i}function Bt(e,t,r,n){this.r=+e,this.g=+t,this.b=+r,this.opacity=+n}function Xt(){return`#${Zt(this.r)}${Zt(this.g)}${Zt(this.b)}`}function Wt(){const e=Yt(this.opacity);return`${1===e?"rgb(":"rgba("}${Kt(this.r)}, ${Kt(this.g)}, ${Kt(this.b)}${1===e?")":`, ${e})`}`}function Yt(e){return isNaN(e)?1:Math.max(0,Math.min(1,e))}function Kt(e){return Math.max(0,Math.min(255,Math.round(e)||0))}function Zt(e){return((e=Kt(e))<16?"0":"")+e.toString(16)}function Jt(e,t,r,n){return n<=0?e=t=r=NaN:r<=0||r>=1?e=t=NaN:t<=0&&(e=NaN),new er(e,t,r,n)}function Qt(e){if(e instanceof er)return new er(e.h,e.s,e.l,e.opacity);if(e instanceof At||(e=zt(e)),!e)return new er;if(e instanceof er)return e;var t=(e=e.rgb()).r/255,r=e.g/255,n=e.b/255,i=Math.min(t,r,n),o=Math.max(t,r,n),a=NaN,s=o-i,l=(o+i)/2;return s?(a=t===o?(r-n)/s+6*(r<n):r===o?(n-t)/s+2:(t-r)/s+4,s/=l<.5?o+i:2-o-i,a*=60):s=l>0&&l<1?0:a,new er(a,s,l,e.opacity)}function er(e,t,r,n){this.h=+e,this.s=+t,this.l=+r,this.opacity=+n}function tr(e){return(e=(e||0)%360)<0?e+360:e}function rr(e){return Math.max(0,Math.min(1,e||0))}function nr(e,t,r){return 255*(e<60?t+(r-t)*e/60:e<180?r:e<240?t+(r-t)*(240-e)/60:t)}Et(At,zt,{copy(e){return Object.assign(new this.constructor,this,e)},displayable(){return this.rgb().displayable()},hex:Ft,formatHex:Ft,formatHex8:function(){return this.rgb().formatHex8()},formatHsl:function(){return Qt(this).formatHsl()},formatRgb:Ut,toString:Ut}),Et(Bt,Ht,St(At,{brighter(e){return e=null==e?Tt:Math.pow(Tt,e),new Bt(this.r*e,this.g*e,this.b*e,this.opacity)},darker(e){return e=null==e?$t:Math.pow($t,e),new Bt(this.r*e,this.g*e,this.b*e,this.opacity)},rgb(){return this},clamp(){return new Bt(Kt(this.r),Kt(this.g),Kt(this.b),Yt(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:Xt,formatHex:Xt,formatHex8:function(){return`#${Zt(this.r)}${Zt(this.g)}${Zt(this.b)}${Zt(255*(isNaN(this.opacity)?1:this.opacity))}`},formatRgb:Wt,toString:Wt})),Et(er,(function(e,t,r,n){return 1===arguments.length?Qt(e):new er(e,t,r,null==n?1:n)}),St(At,{brighter(e){return e=null==e?Tt:Math.pow(Tt,e),new er(this.h,this.s,this.l*e,this.opacity)},darker(e){return e=null==e?$t:Math.pow($t,e),new er(this.h,this.s,this.l*e,this.opacity)},rgb(){var e=this.h%360+360*(this.h<0),t=isNaN(e)||isNaN(this.s)?0:this.s,r=this.l,n=r+(r<.5?r:1-r)*t,i=2*r-n;return new Bt(nr(e>=240?e-240:e+120,i,n),nr(e,i,n),nr(e<120?e+240:e-120,i,n),this.opacity)},clamp(){return new er(tr(this.h),rr(this.s),rr(this.l),Yt(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const e=Yt(this.opacity);return`${1===e?"hsl(":"hsla("}${tr(this.h)}, ${100*rr(this.s)}%, ${100*rr(this.l)}%${1===e?")":`, ${e})`}`}}));var ir=e=>()=>e;function or(e){return 1==(e=+e)?ar:function(t,r){return r-t?function(e,t,r){return e=Math.pow(e,r),t=Math.pow(t,r)-e,r=1/r,function(n){return Math.pow(e+n*t,r)}}(t,r,e):ir(isNaN(t)?r:t)}}function ar(e,t){var r=t-e;return r?function(e,t){return function(r){return e+r*t}}(e,r):ir(isNaN(e)?t:e)}var sr=function e(t){var r=or(t);function n(e,t){var n=r((e=Ht(e)).r,(t=Ht(t)).r),i=r(e.g,t.g),o=r(e.b,t.b),a=ar(e.opacity,t.opacity);return function(t){return e.r=n(t),e.g=i(t),e.b=o(t),e.opacity=a(t),e+""}}return n.gamma=e,n}(1);function lr(e,t){t||(t=[]);var r,n=e?Math.min(t.length,e.length):0,i=t.slice();return function(o){for(r=0;r<n;++r)i[r]=e[r]*(1-o)+t[r]*o;return i}}function ur(e,t){var r,n=t?t.length:0,i=e?Math.min(n,e.length):0,o=new Array(i),a=new Array(n);for(r=0;r<i;++r)o[r]=gr(e[r],t[r]);for(;r<n;++r)a[r]=t[r];return function(e){for(r=0;r<i;++r)a[r]=o[r](e);return a}}function cr(e,t){var r=new Date;return e=+e,t=+t,function(n){return r.setTime(e*(1-n)+t*n),r}}function pr(e,t){return e=+e,t=+t,function(r){return e*(1-r)+t*r}}function fr(e,t){var r,n={},i={};for(r in null!==e&&"object"==typeof e||(e={}),null!==t&&"object"==typeof t||(t={}),t)r in e?n[r]=gr(e[r],t[r]):i[r]=t[r];return function(e){for(r in n)i[r]=n[r](e);return i}}var dr=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,hr=new RegExp(dr.source,"g");function mr(e,t){var r,n,i,o=dr.lastIndex=hr.lastIndex=0,a=-1,s=[],l=[];for(e+="",t+="";(r=dr.exec(e))&&(n=hr.exec(t));)(i=n.index)>o&&(i=t.slice(o,i),s[a]?s[a]+=i:s[++a]=i),(r=r[0])===(n=n[0])?s[a]?s[a]+=n:s[++a]=n:(s[++a]=null,l.push({i:a,x:pr(r,n)})),o=hr.lastIndex;return o<t.length&&(i=t.slice(o),s[a]?s[a]+=i:s[++a]=i),s.length<2?l[0]?function(e){return function(t){return e(t)+""}}(l[0].x):function(e){return function(){return e}}(t):(t=l.length,function(e){for(var r,n=0;n<t;++n)s[(r=l[n]).i]=r.x(e);return s.join("")})}function gr(e,t){var r,n=typeof t;return null==t||"boolean"===n?ir(t):("number"===n?pr:"string"===n?(r=zt(t))?(t=r,sr):mr:t instanceof zt?sr:t instanceof Date?cr:function(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}(t)?lr:Array.isArray(t)?ur:"function"!=typeof t.valueOf&&"function"!=typeof t.toString||isNaN(t)?fr:pr)(e,t)}function yr(e,t){return e=+e,t=+t,function(r){return Math.round(e*(1-r)+t*r)}}function vr(e){return+e}var wr=[0,1];function _r(e){return e}function br(e,t){return(t-=e=+e)?function(r){return(r-e)/t}:function(e){return function(){return e}}(isNaN(t)?NaN:.5)}function Nr(e,t,r){var n=e[0],i=e[1],o=t[0],a=t[1];return i<n?(n=br(i,n),o=r(a,o)):(n=br(n,i),o=r(o,a)),function(e){return o(n(e))}}function xr(e,t,r){var n=Math.min(e.length,t.length)-1,i=new Array(n),o=new Array(n),a=-1;for(e[n]<e[0]&&(e=e.slice().reverse(),t=t.slice().reverse());++a<n;)i[a]=br(e[a],e[a+1]),o[a]=r(t[a],t[a+1]);return function(t){var r=ct(e,t,1,n)-1;return o[r](i[r](t))}}function Er(){var e,t,r,n,i,o,a=wr,s=wr,l=gr,u=_r;function c(){var e=Math.min(a.length,s.length);return u!==_r&&(u=function(e,t){var r;return e>t&&(r=e,e=t,t=r),function(r){return Math.max(e,Math.min(t,r))}}(a[0],a[e-1])),n=e>2?xr:Nr,i=o=null,p}function p(t){return null==t||isNaN(t=+t)?r:(i||(i=n(a.map(e),s,l)))(e(u(t)))}return p.invert=function(r){return u(t((o||(o=n(s,a.map(e),pr)))(r)))},p.domain=function(e){return arguments.length?(a=Array.from(e,vr),c()):a.slice()},p.range=function(e){return arguments.length?(s=Array.from(e),c()):s.slice()},p.rangeRound=function(e){return s=Array.from(e),l=yr,c()},p.clamp=function(e){return arguments.length?(u=!!e||_r,c()):u!==_r},p.interpolate=function(e){return arguments.length?(l=e,c()):l},p.unknown=function(e){return arguments.length?(r=e,p):r},function(r,n){return e=r,t=n,c()}}function Sr(e,t){if((r=(e=t?e.toExponential(t-1):e.toExponential()).indexOf("e"))<0)return null;var r,n=e.slice(0,r);return[n.length>1?n[0]+n.slice(2):n,+e.slice(r+1)]}function Ar(e){return(e=Sr(Math.abs(e)))?e[1]:NaN}var $r,Tr=/^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function Mr(e){if(!(t=Tr.exec(e)))throw new Error("invalid format: "+e);var t;return new kr({fill:t[1],align:t[2],sign:t[3],symbol:t[4],zero:t[5],width:t[6],comma:t[7],precision:t[8]&&t[8].slice(1),trim:t[9],type:t[10]})}function kr(e){this.fill=void 0===e.fill?" ":e.fill+"",this.align=void 0===e.align?">":e.align+"",this.sign=void 0===e.sign?"-":e.sign+"",this.symbol=void 0===e.symbol?"":e.symbol+"",this.zero=!!e.zero,this.width=void 0===e.width?void 0:+e.width,this.comma=!!e.comma,this.precision=void 0===e.precision?void 0:+e.precision,this.trim=!!e.trim,this.type=void 0===e.type?"":e.type+""}function Pr(e,t){var r=Sr(e,t);if(!r)return e+"";var n=r[0],i=r[1];return i<0?"0."+new Array(-i).join("0")+n:n.length>i+1?n.slice(0,i+1)+"."+n.slice(i+1):n+new Array(i-n.length+2).join("0")}Mr.prototype=kr.prototype,kr.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(void 0===this.width?"":Math.max(1,0|this.width))+(this.comma?",":"")+(void 0===this.precision?"":"."+Math.max(0,0|this.precision))+(this.trim?"~":"")+this.type};var Ir={"%":(e,t)=>(100*e).toFixed(t),b:e=>Math.round(e).toString(2),c:e=>e+"",d:function(e){return Math.abs(e=Math.round(e))>=1e21?e.toLocaleString("en").replace(/,/g,""):e.toString(10)},e:(e,t)=>e.toExponential(t),f:(e,t)=>e.toFixed(t),g:(e,t)=>e.toPrecision(t),o:e=>Math.round(e).toString(8),p:(e,t)=>Pr(100*e,t),r:Pr,s:function(e,t){var r=Sr(e,t);if(!r)return e+"";var n=r[0],i=r[1],o=i-($r=3*Math.max(-8,Math.min(8,Math.floor(i/3))))+1,a=n.length;return o===a?n:o>a?n+new Array(o-a+1).join("0"):o>0?n.slice(0,o)+"."+n.slice(o):"0."+new Array(1-o).join("0")+Sr(e,Math.max(0,t+o-1))[0]},X:e=>Math.round(e).toString(16).toUpperCase(),x:e=>Math.round(e).toString(16)};function Dr(e){return e}var Rr,Lr,Or,Cr=Array.prototype.map,Vr=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];function jr(e){var t,r,n=void 0===e.grouping||void 0===e.thousands?Dr:(t=Cr.call(e.grouping,Number),r=e.thousands+"",function(e,n){for(var i=e.length,o=[],a=0,s=t[0],l=0;i>0&&s>0&&(l+s+1>n&&(s=Math.max(1,n-l)),o.push(e.substring(i-=s,i+s)),!((l+=s+1)>n));)s=t[a=(a+1)%t.length];return o.reverse().join(r)}),i=void 0===e.currency?"":e.currency[0]+"",o=void 0===e.currency?"":e.currency[1]+"",a=void 0===e.decimal?".":e.decimal+"",s=void 0===e.numerals?Dr:function(e){return function(t){return t.replace(/[0-9]/g,(function(t){return e[+t]}))}}(Cr.call(e.numerals,String)),l=void 0===e.percent?"%":e.percent+"",u=void 0===e.minus?"−":e.minus+"",c=void 0===e.nan?"NaN":e.nan+"";function p(e){var t=(e=Mr(e)).fill,r=e.align,p=e.sign,f=e.symbol,d=e.zero,h=e.width,m=e.comma,g=e.precision,y=e.trim,v=e.type;"n"===v?(m=!0,v="g"):Ir[v]||(void 0===g&&(g=12),y=!0,v="g"),(d||"0"===t&&"="===r)&&(d=!0,t="0",r="=");var w="$"===f?i:"#"===f&&/[boxX]/.test(v)?"0"+v.toLowerCase():"",_="$"===f?o:/[%p]/.test(v)?l:"",b=Ir[v],N=/[defgprs%]/.test(v);function x(e){var i,o,l,f=w,x=_;if("c"===v)x=b(e)+x,e="";else{var E=(e=+e)<0||1/e<0;if(e=isNaN(e)?c:b(Math.abs(e),g),y&&(e=function(e){e:for(var t,r=e.length,n=1,i=-1;n<r;++n)switch(e[n]){case".":i=t=n;break;case"0":0===i&&(i=n),t=n;break;default:if(!+e[n])break e;i>0&&(i=0)}return i>0?e.slice(0,i)+e.slice(t+1):e}(e)),E&&0==+e&&"+"!==p&&(E=!1),f=(E?"("===p?p:u:"-"===p||"("===p?"":p)+f,x=("s"===v?Vr[8+$r/3]:"")+x+(E&&"("===p?")":""),N)for(i=-1,o=e.length;++i<o;)if(48>(l=e.charCodeAt(i))||l>57){x=(46===l?a+e.slice(i+1):e.slice(i))+x,e=e.slice(0,i);break}}m&&!d&&(e=n(e,1/0));var S=f.length+e.length+x.length,A=S<h?new Array(h-S+1).join(t):"";switch(m&&d&&(e=n(A+e,A.length?h-x.length:1/0),A=""),r){case"<":e=f+e+x+A;break;case"=":e=f+A+e+x;break;case"^":e=A.slice(0,S=A.length>>1)+f+e+x+A.slice(S);break;default:e=A+f+e+x}return s(e)}return g=void 0===g?6:/[gprs]/.test(v)?Math.max(1,Math.min(21,g)):Math.max(0,Math.min(20,g)),x.toString=function(){return e+""},x}return{format:p,formatPrefix:function(e,t){var r=p(((e=Mr(e)).type="f",e)),n=3*Math.max(-8,Math.min(8,Math.floor(Ar(t)/3))),i=Math.pow(10,-n),o=Vr[8+n/3];return function(e){return r(i*e)+o}}}}function Fr(e,t,r,n){var i,o=function(e,t,r){r=+r;const n=(t=+t)<(e=+e),i=n?gt(t,e,r):gt(e,t,r);return(n?-1:1)*(i<0?1/-i:i)}(e,t,r);switch((n=Mr(null==n?",f":n)).type){case"s":var a=Math.max(Math.abs(e),Math.abs(t));return null!=n.precision||isNaN(i=function(e,t){return Math.max(0,3*Math.max(-8,Math.min(8,Math.floor(Ar(t)/3)))-Ar(Math.abs(e)))}(o,a))||(n.precision=i),Or(n,a);case"":case"e":case"g":case"p":case"r":null!=n.precision||isNaN(i=function(e,t){return e=Math.abs(e),t=Math.abs(t)-e,Math.max(0,Ar(t)-Ar(e))+1}(o,Math.max(Math.abs(e),Math.abs(t))))||(n.precision=i-("e"===n.type));break;case"f":case"%":null!=n.precision||isNaN(i=function(e){return Math.max(0,-Ar(Math.abs(e)))}(o))||(n.precision=i-2*("%"===n.type))}return Lr(n)}function Ur(e){var t=e.domain;return e.ticks=function(e){var r=t();return function(e,t,r){if(!((r=+r)>0))return[];if((e=+e)==(t=+t))return[e];const n=t<e,[i,o,a]=n?mt(t,e,r):mt(e,t,r);if(!(o>=i))return[];const s=o-i+1,l=new Array(s);if(n)if(a<0)for(let e=0;e<s;++e)l[e]=(o-e)/-a;else for(let e=0;e<s;++e)l[e]=(o-e)*a;else if(a<0)for(let e=0;e<s;++e)l[e]=(i+e)/-a;else for(let e=0;e<s;++e)l[e]=(i+e)*a;return l}(r[0],r[r.length-1],null==e?10:e)},e.tickFormat=function(e,r){var n=t();return Fr(n[0],n[n.length-1],null==e?10:e,r)},e.nice=function(r){null==r&&(r=10);var n,i,o=t(),a=0,s=o.length-1,l=o[a],u=o[s],c=10;for(u<l&&(i=l,l=u,u=i,i=a,a=s,s=i);c-- >0;){if((i=gt(l,u,r))===n)return o[a]=l,o[s]=u,t(o);if(i>0)l=Math.floor(l/i)*i,u=Math.ceil(u/i)*i;else{if(!(i<0))break;l=Math.ceil(l*i)/i,u=Math.floor(u*i)/i}n=i}return e},e}function zr(){var e=Er()(_r,_r);return e.copy=function(){return t=e,zr().domain(t.domain()).range(t.range()).interpolate(t.interpolate()).clamp(t.clamp()).unknown(t.unknown());var t},xt.apply(e,arguments),Ur(e)}Rr=jr({thousands:",",grouping:[3],currency:["$",""]}),Lr=Rr.format,Or=Rr.formatPrefix;var qr={value:()=>{}};function Gr(){for(var e,t=0,r=arguments.length,n={};t<r;++t){if(!(e=arguments[t]+"")||e in n||/[\s.]/.test(e))throw new Error("illegal type: "+e);n[e]=[]}return new Hr(n)}function Hr(e){this._=e}function Br(e,t){for(var r,n=0,i=e.length;n<i;++n)if((r=e[n]).name===t)return r.value}function Xr(e,t,r){for(var n=0,i=e.length;n<i;++n)if(e[n].name===t){e[n]=qr,e=e.slice(0,n).concat(e.slice(n+1));break}return null!=r&&e.push({name:t,value:r}),e}Hr.prototype=Gr.prototype={constructor:Hr,on:function(e,t){var r,n,i=this._,o=(n=i,(e+"").trim().split(/^|\s+/).map((function(e){var t="",r=e.indexOf(".");if(r>=0&&(t=e.slice(r+1),e=e.slice(0,r)),e&&!n.hasOwnProperty(e))throw new Error("unknown type: "+e);return{type:e,name:t}}))),a=-1,s=o.length;if(!(arguments.length<2)){if(null!=t&&"function"!=typeof t)throw new Error("invalid callback: "+t);for(;++a<s;)if(r=(e=o[a]).type)i[r]=Xr(i[r],e.name,t);else if(null==t)for(r in i)i[r]=Xr(i[r],e.name,null);return this}for(;++a<s;)if((r=(e=o[a]).type)&&(r=Br(i[r],e.name)))return r},copy:function(){var e={},t=this._;for(var r in t)e[r]=t[r].slice();return new Hr(e)},call:function(e,t){if((r=arguments.length-2)>0)for(var r,n,i=new Array(r),o=0;o<r;++o)i[o]=arguments[o+2];if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(o=0,r=(n=this._[e]).length;o<r;++o)n[o].value.apply(t,i)},apply:function(e,t,r){if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(var n=this._[e],i=0,o=n.length;i<o;++i)n[i].value.apply(t,r)}};const Wr={passive:!1},Yr={capture:!0,passive:!1};function Kr(e){e.stopImmediatePropagation()}function Zr(e){e.preventDefault(),e.stopImmediatePropagation()}var Jr=e=>()=>e;function Qr(e,{sourceEvent:t,subject:r,target:n,identifier:i,active:o,x:a,y:s,dx:l,dy:u,dispatch:c}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:t,enumerable:!0,configurable:!0},subject:{value:r,enumerable:!0,configurable:!0},target:{value:n,enumerable:!0,configurable:!0},identifier:{value:i,enumerable:!0,configurable:!0},active:{value:o,enumerable:!0,configurable:!0},x:{value:a,enumerable:!0,configurable:!0},y:{value:s,enumerable:!0,configurable:!0},dx:{value:l,enumerable:!0,configurable:!0},dy:{value:u,enumerable:!0,configurable:!0},_:{value:c}})}function en(e){return!e.ctrlKey&&!e.button}function tn(){return this.parentNode}function rn(e,t){return null==t?{x:e.x,y:e.y}:t}function nn(){return navigator.maxTouchPoints||"ontouchstart"in this}function on(){var e,t,r,n,i=en,o=tn,a=rn,s=nn,l={},u=Gr("start","drag","end"),c=0,p=0;function f(e){e.on("mousedown.drag",d).filter(s).on("touchstart.drag",g).on("touchmove.drag",y,Wr).on("touchend.drag touchcancel.drag",v).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function d(a,s){if(!n&&i.call(this,a,s)){var l=w(this,o.call(this,a,s),a,s,"mouse");l&&(ue(a.view).on("mousemove.drag",h,Yr).on("mouseup.drag",m,Yr),function(e){var t=e.document.documentElement,r=ue(e).on("dragstart.drag",Zr,Yr);"onselectstart"in t?r.on("selectstart.drag",Zr,Yr):(t.__noselect=t.style.MozUserSelect,t.style.MozUserSelect="none")}(a.view),Kr(a),r=!1,e=a.clientX,t=a.clientY,l("start",a))}}function h(n){if(Zr(n),!r){var i=n.clientX-e,o=n.clientY-t;r=i*i+o*o>p}l.mouse("drag",n)}function m(e){ue(e.view).on("mousemove.drag mouseup.drag",null),function(e,t){var r=e.document.documentElement,n=ue(e).on("dragstart.drag",null);t&&(n.on("click.drag",Zr,Yr),setTimeout((function(){n.on("click.drag",null)}),0)),"onselectstart"in r?n.on("selectstart.drag",null):(r.style.MozUserSelect=r.__noselect,delete r.__noselect)}(e.view,r),Zr(e),l.mouse("end",e)}function g(e,t){if(i.call(this,e,t)){var r,n,a=e.changedTouches,s=o.call(this,e,t),l=a.length;for(r=0;r<l;++r)(n=w(this,s,e,t,a[r].identifier,a[r]))&&(Kr(e),n("start",e,a[r]))}}function y(e){var t,r,n=e.changedTouches,i=n.length;for(t=0;t<i;++t)(r=l[n[t].identifier])&&(Zr(e),r("drag",e,n[t]))}function v(e){var t,r,i=e.changedTouches,o=i.length;for(n&&clearTimeout(n),n=setTimeout((function(){n=null}),500),t=0;t<o;++t)(r=l[i[t].identifier])&&(Kr(e),r("end",e,i[t]))}function w(e,t,r,n,i,o){var s,p,d,h=u.copy(),m=ce(o||r,t);if(null!=(d=a.call(e,new Qr("beforestart",{sourceEvent:r,target:f,identifier:i,active:c,x:m[0],y:m[1],dx:0,dy:0,dispatch:h}),n)))return s=d.x-m[0]||0,p=d.y-m[1]||0,function r(o,a,u){var g,y=m;switch(o){case"start":l[i]=r,g=c++;break;case"end":delete l[i],--c;case"drag":m=ce(u||a,t),g=c}h.call(o,e,new Qr(o,{sourceEvent:a,subject:d,target:f,identifier:i,active:g,x:m[0]+s,y:m[1]+p,dx:m[0]-y[0],dy:m[1]-y[1],dispatch:h}),n)}}return f.filter=function(e){return arguments.length?(i="function"==typeof e?e:Jr(!!e),f):i},f.container=function(e){return arguments.length?(o="function"==typeof e?e:Jr(e),f):o},f.subject=function(e){return arguments.length?(a="function"==typeof e?e:Jr(e),f):a},f.touchable=function(e){return arguments.length?(s="function"==typeof e?e:Jr(!!e),f):s},f.on=function(){var e=u.on.apply(u,arguments);return e===u?f:e},f.clickDistance=function(e){return arguments.length?(p=(e=+e)*e,f):Math.sqrt(p)},f}Qr.prototype.on=function(){var e=this._.on.apply(this._,arguments);return e===this._?this:e};var an=Object.freeze({__proto__:null,axisBottom:it,axisLeft:ot,drag:on,line:Me,scaleLinear:zr,select:ue,selectAll:function(e){return"string"==typeof e?new le([document.querySelectorAll(e)],[document.documentElement]):new le([u(e)],se)},symbol:Ye,symbolAsterisk:Pe,symbolCircle:Ie,symbolCross:De,symbolDiamond:Oe,symbolSquare:Ce,symbolStar:Ue,symbolTriangle:qe,symbolWye:We});const sn="#00B0F0",ln="#E46C0A",un="#490092",cn="#490092",pn="#A6A6A6",fn="#6495ED",dn="#000000",hn={font:{default:"'Arial', sans-serif",valid:["'Arial', sans-serif","Arial","'Arial Black'","'Arial Unicode MS'","Calibri","Cambria","'Cambria Math'","Candara","'Comic Sans MS'","Consolas","Constantia","Corbel","'Courier New'","wf_standard-font, helvetica, arial, sans-serif","wf_standard-font_light, helvetica, arial, sans-serif","Georgia","'Lucida Sans Unicode'","'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif","'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif","'Segoe UI Semibold', wf_segoe-ui_semibold, helvetica, arial, sans-serif","'Segoe UI Bold', wf_segoe-ui_bold, helvetica, arial, sans-serif","Symbol","Tahoma","'Times New Roman'","'Trebuchet MS'","Verdana","Wingdings"]},size:{default:10,options:{minValue:{value:0},maxValue:{value:100}}}},mn={canvas:{description:"Canvas Settings",displayName:"Canvas Settings",settingsGroups:{all:{show_errors:{displayName:"Show Errors on Canvas",type:"ToggleSwitch",default:!0},lower_padding:{displayName:"Padding Below Plot (pixels):",type:"NumUpDown",default:10},upper_padding:{displayName:"Padding Above Plot (pixels):",type:"NumUpDown",default:10},left_padding:{displayName:"Padding Left of Plot (pixels):",type:"NumUpDown",default:10},right_padding:{displayName:"Padding Right of Plot (pixels):",type:"NumUpDown",default:10}}}},funnel:{description:"Funnel Settings",displayName:"Data Settings",settingsGroups:{all:{chart_type:{displayName:"Chart Type",type:"Dropdown",default:"PR",valid:["SR","PR","RC"],items:[{displayName:"Indirectly Standardised (HSMR)",value:"SR"},{displayName:"Proportion",value:"PR"},{displayName:"Rate",value:"RC"}]},od_adjust:{displayName:"OD Adjustment",type:"Dropdown",default:"no",valid:["auto","yes","no"],items:[{displayName:"Automatic",value:"auto"},{displayName:"Yes",value:"yes"},{displayName:"No",value:"no"}]},multiplier:{displayName:"Multiplier",type:"NumUpDown",default:1,options:{minValue:{value:0}}},sig_figs:{displayName:"Decimals to Report:",type:"NumUpDown",default:2,options:{minValue:{value:0},maxValue:{value:20}}},perc_labels:{displayName:"Report as percentage",type:"Dropdown",default:"Automatic",valid:["Automatic","Yes","No"],items:[{displayName:"Automatic",value:"Automatic"},{displayName:"Yes",value:"Yes"},{displayName:"No",value:"No"}]},transformation:{displayName:"Transformation",type:"Dropdown",default:"none",valid:["none","ln","log10","sqrt"],items:[{displayName:"None",value:"none"},{displayName:"Natural Log (y+1)",value:"ln"},{displayName:"Log10 (y+1)",value:"log10"},{displayName:"Square-Root",value:"sqrt"}]},ttip_show_group:{displayName:"Show Group in Tooltip",type:"ToggleSwitch",default:!0},ttip_label_group:{displayName:"Group Tooltip Label",type:"TextInput",default:"Group"},ttip_show_numerator:{displayName:"Show Numerator in Tooltip",type:"ToggleSwitch",default:!0},ttip_label_numerator:{displayName:"Numerator Tooltip Label",type:"TextInput",default:"Numerator"},ttip_show_denominator:{displayName:"Show Denominator in Tooltip",type:"ToggleSwitch",default:!0},ttip_label_denominator:{displayName:"Denominator Tooltip Label",type:"TextInput",default:"Denominator"},ttip_show_value:{displayName:"Show Value in Tooltip",type:"ToggleSwitch",default:!0},ttip_label_value:{displayName:"Value Tooltip Label",type:"TextInput",default:"Automatic"},ll_truncate:{displayName:"Truncate Lower Limits at:",type:"NumUpDown",default:null},ul_truncate:{displayName:"Truncate Upper Limits at:",type:"NumUpDown",default:null}}}},outliers:{description:"Outlier Settings",displayName:"Outlier Settings",settingsGroups:{General:{process_flag_type:{displayName:"Type of Change to Flag",type:"Dropdown",default:"both",valid:["both","improvement","deterioration"],items:[{displayName:"Both",value:"both"},{displayName:"Improvement (Imp.)",value:"improvement"},{displayName:"Deterioration (Det.)",value:"deterioration"}]},improvement_direction:{displayName:"Improvement Direction",type:"Dropdown",default:"increase",valid:["increase","neutral","decrease"],items:[{displayName:"Increase",value:"increase"},{displayName:"Neutral",value:"neutral"},{displayName:"Decrease",value:"decrease"}]}},"Three Sigma Outliers":{three_sigma:{displayName:"Three Sigma Outliers",type:"ToggleSwitch",default:!1},three_sigma_colour_improvement:{displayName:"Imp. Three Sigma Colour",type:"ColorPicker",default:sn},three_sigma_colour_deterioration:{displayName:"Det. Three Sigma Colour",type:"ColorPicker",default:ln},three_sigma_colour_neutral_low:{displayName:"Neutral (Low) Three Sigma Colour",type:"ColorPicker",default:un},three_sigma_colour_neutral_high:{displayName:"Neutral (High) Three Sigma Colour",type:"ColorPicker",default:cn}},"Two Sigma Outliers":{two_sigma:{displayName:"Two Sigma Outliers",type:"ToggleSwitch",default:!1},two_sigma_colour_improvement:{displayName:"Imp. Two Sigma Colour",type:"ColorPicker",default:sn},two_sigma_colour_deterioration:{displayName:"Det. Two Sigma Colour",type:"ColorPicker",default:ln},two_sigma_colour_neutral_low:{displayName:"Neutral (Low) Two Sigma Colour",type:"ColorPicker",default:un},two_sigma_colour_neutral_high:{displayName:"Neutral (High) Two Sigma Colour",type:"ColorPicker",default:cn}}}},scatter:{description:"Scatter Settings",displayName:"Scatter Settings",settingsGroups:{Dots:{shape:{displayName:"Shape",type:"Dropdown",default:"Circle",valid:["Circle","Cross","Diamond","Square","Star","Triangle","Wye"],items:[{displayName:"Circle",value:"Circle"},{displayName:"Cross",value:"Cross"},{displayName:"Diamond",value:"Diamond"},{displayName:"Square",value:"Square"},{displayName:"Star",value:"Star"},{displayName:"Triangle",value:"Triangle"},{displayName:"Wye",value:"Wye"}]},size:{displayName:"Size",type:"NumUpDown",default:2.5,options:{minValue:{value:0},maxValue:{value:100}}},colour:{displayName:"Colour",type:"ColorPicker",default:pn},colour_outline:{displayName:"Outline Colour",type:"ColorPicker",default:pn},width_outline:{displayName:"Outline Width",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:100}}},opacity:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_selected:{displayName:"Opacity if Selected",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected:{displayName:"Opacity if Unselected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}}},"Group Text":{use_group_text:{displayName:"Show Group Text",type:"ToggleSwitch",default:!1},scatter_text_font:{displayName:"Group Text Font",type:"FontPicker",default:hn.font.default,valid:hn.font.valid},scatter_text_size:{displayName:"Group Text Size",type:"NumUpDown",default:hn.size.default,options:hn.size.options},scatter_text_colour:{displayName:"Group Text Colour",type:"ColorPicker",default:dn},scatter_text_opacity:{displayName:"Group Text Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},scatter_text_opacity_selected:{displayName:"Group Text Opacity if Selected",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},scatter_text_opacity_unselected:{displayName:"Group Text Opacity if Unselected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}}}}},lines:{description:"Line Settings",displayName:"Line Settings",settingsGroups:{Target:{show_target:{displayName:"Show Target",type:"ToggleSwitch",default:!0},width_target:{displayName:"Line Width",type:"NumUpDown",default:1.5,options:{minValue:{value:0},maxValue:{value:100}}},type_target:{displayName:"Line Type",type:"Dropdown",default:"10 0",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},colour_target:{displayName:"Line Colour",type:"ColorPicker",default:dn},opacity_target:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected_target:{displayName:"Opacity if Any Selected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},ttip_show_target:{displayName:"Show value in tooltip",type:"ToggleSwitch",default:!0},ttip_label_target:{displayName:"Tooltip Label",type:"TextInput",default:"Centerline"},plot_label_show_target:{displayName:"Show Value on Plot",type:"ToggleSwitch",default:!1},plot_label_position_target:{displayName:"Position of Value on Line(s)",type:"Dropdown",default:"beside",valid:["above","below","beside"],items:[{displayName:"Above",value:"above"},{displayName:"Below",value:"below"},{displayName:"Beside",value:"beside"}]},plot_label_vpad_target:{displayName:"Value Vertical Padding",type:"NumUpDown",default:0},plot_label_hpad_target:{displayName:"Value Horizontal Padding",type:"NumUpDown",default:10},plot_label_font_target:{displayName:"Value Font",type:"FontPicker",default:hn.font.default,valid:hn.font.valid},plot_label_size_target:{displayName:"Value Font Size",type:"NumUpDown",default:hn.size.default,options:hn.size.options},plot_label_colour_target:{displayName:"Value Colour",type:"ColorPicker",default:dn},plot_label_prefix_target:{displayName:"Value Prefix",type:"TextInput",default:""}},"Alt. Target":{show_alt_target:{displayName:"Show Alt. Target Line",type:"ToggleSwitch",default:!1},alt_target:{displayName:"Additional Target Value:",type:"NumUpDown",default:null},width_alt_target:{displayName:"Line Width",type:"NumUpDown",default:1.5,options:{minValue:{value:0},maxValue:{value:100}}},type_alt_target:{displayName:"Line Type",type:"Dropdown",default:"10 0",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},colour_alt_target:{displayName:"Line Colour",type:"ColorPicker",default:dn},opacity_alt_target:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected_alt_target:{displayName:"Opacity if Any Selected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},join_rebaselines_alt_target:{displayName:"Connect Rebaselined Limits",type:"ToggleSwitch",default:!1},ttip_show_alt_target:{displayName:"Show value in tooltip",type:"ToggleSwitch",default:!0},ttip_label_alt_target:{displayName:"Tooltip Label",type:"TextInput",default:"Alt. Target"},plot_label_show_alt_target:{displayName:"Show Value on Plot",type:"ToggleSwitch",default:!1},plot_label_position_alt_target:{displayName:"Position of Value on Line(s)",type:"Dropdown",default:"beside",valid:["above","below","beside"],items:[{displayName:"Above",value:"above"},{displayName:"Below",value:"below"},{displayName:"Beside",value:"beside"}]},plot_label_vpad_alt_target:{displayName:"Value Vertical Padding",type:"NumUpDown",default:0},plot_label_hpad_alt_target:{displayName:"Value Horizontal Padding",type:"NumUpDown",default:10},plot_label_font_alt_target:{displayName:"Value Font",type:"FontPicker",default:hn.font.default,valid:hn.font.valid},plot_label_size_alt_target:{displayName:"Value Font Size",type:"NumUpDown",default:hn.size.default,options:hn.size.options},plot_label_colour_alt_target:{displayName:"Value Colour",type:"ColorPicker",default:dn},plot_label_prefix_alt_target:{displayName:"Value Prefix",type:"TextInput",default:""}},"68% Limits":{show_68:{displayName:"Show 68% Lines",type:"ToggleSwitch",default:!1},width_68:{displayName:"Line Width",type:"NumUpDown",default:2,options:{minValue:{value:0},maxValue:{value:100}}},type_68:{displayName:"Line Type",type:"Dropdown",default:"2 5",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},colour_68:{displayName:"Line Colour",type:"ColorPicker",default:fn},opacity_68:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected_68:{displayName:"Opacity if Any Selected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},ttip_show_68:{displayName:"Show value in tooltip",type:"ToggleSwitch",default:!0},ttip_label_68:{displayName:"Tooltip Label",type:"TextInput",default:"68% Limit"},plot_label_show_68:{displayName:"Show Value on Plot",type:"ToggleSwitch",default:!1},plot_label_position_68:{displayName:"Position of Value on Line(s)",type:"Dropdown",default:"beside",valid:["outside","inside","above","below","beside"],items:[{displayName:"Outside",value:"outside"},{displayName:"Inside",value:"inside"},{displayName:"Above",value:"above"},{displayName:"Below",value:"below"},{displayName:"Beside",value:"beside"}]},plot_label_vpad_68:{displayName:"Value Vertical Padding",type:"NumUpDown",default:0},plot_label_hpad_68:{displayName:"Value Horizontal Padding",type:"NumUpDown",default:10},plot_label_font_68:{displayName:"Value Font",type:"FontPicker",default:hn.font.default,valid:hn.font.valid},plot_label_size_68:{displayName:"Value Font Size",type:"NumUpDown",default:hn.size.default,options:hn.size.options},plot_label_colour_68:{displayName:"Value Colour",type:"ColorPicker",default:dn},plot_label_prefix_68:{displayName:"Value Prefix",type:"TextInput",default:""}},"95% Limits":{show_95:{displayName:"Show 95% Lines",type:"ToggleSwitch",default:!0},width_95:{displayName:"Line Width",type:"NumUpDown",default:2,options:{minValue:{value:0},maxValue:{value:100}}},type_95:{displayName:"Line Type",type:"Dropdown",default:"2 5",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},colour_95:{displayName:"Line Colour",type:"ColorPicker",default:fn},opacity_95:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected_95:{displayName:"Opacity if Any Selected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},ttip_show_95:{displayName:"Show value in tooltip",type:"ToggleSwitch",default:!0},ttip_label_95:{displayName:"Tooltip Label",type:"TextInput",default:"95% Limit"},plot_label_show_95:{displayName:"Show Value on Plot",type:"ToggleSwitch",default:!1},plot_label_position_95:{displayName:"Position of Value on Line(s)",type:"Dropdown",default:"beside",valid:["outside","inside","above","below","beside"],items:[{displayName:"Outside",value:"outside"},{displayName:"Inside",value:"inside"},{displayName:"Above",value:"above"},{displayName:"Below",value:"below"},{displayName:"Beside",value:"beside"}]},plot_label_vpad_95:{displayName:"Value Vertical Padding",type:"NumUpDown",default:0},plot_label_hpad_95:{displayName:"Value Horizontal Padding",type:"NumUpDown",default:10},plot_label_font_95:{displayName:"Value Font",type:"FontPicker",default:hn.font.default,valid:hn.font.valid},plot_label_size_95:{displayName:"Value Font Size",type:"NumUpDown",default:hn.size.default,options:hn.size.options},plot_label_colour_95:{displayName:"Value Colour",type:"ColorPicker",default:dn},plot_label_prefix_95:{displayName:"Value Prefix",type:"TextInput",default:""}},"99% Limits":{show_99:{displayName:"Show 99% Lines",type:"ToggleSwitch",default:!0},width_99:{displayName:"Line Width",type:"NumUpDown",default:2,options:{minValue:{value:0},maxValue:{value:100}}},type_99:{displayName:"Line Type",type:"Dropdown",default:"10 10",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},colour_99:{displayName:"Line Colour",type:"ColorPicker",default:fn},opacity_99:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected_99:{displayName:"Opacity if Any Selected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},ttip_show_99:{displayName:"Show value in tooltip",type:"ToggleSwitch",default:!0},ttip_label_99:{displayName:"Tooltip Label",type:"TextInput",default:"99% Limit"},plot_label_show_99:{displayName:"Show Value on Plot",type:"ToggleSwitch",default:!1},plot_label_position_99:{displayName:"Position of Value on Line(s)",type:"Dropdown",default:"beside",valid:["outside","inside","above","below","beside"],items:[{displayName:"Outside",value:"outside"},{displayName:"Inside",value:"inside"},{displayName:"Above",value:"above"},{displayName:"Below",value:"below"},{displayName:"Beside",value:"beside"}]},plot_label_vpad_99:{displayName:"Value Vertical Padding",type:"NumUpDown",default:0},plot_label_hpad_99:{displayName:"Value Horizontal Padding",type:"NumUpDown",default:10},plot_label_font_99:{displayName:"Value Font",type:"FontPicker",default:hn.font.default,valid:hn.font.valid},plot_label_size_99:{displayName:"Value Font Size",type:"NumUpDown",default:hn.size.default,options:hn.size.options},plot_label_colour_99:{displayName:"Value Colour",type:"ColorPicker",default:dn},plot_label_prefix_99:{displayName:"Value Prefix",type:"TextInput",default:""}}}},x_axis:{description:"X Axis Settings",displayName:"X Axis Settings",settingsGroups:{Axis:{xlimit_colour:{displayName:"Axis Colour",type:"ColorPicker",default:dn},xlimit_l:{displayName:"Lower Limit",type:"NumUpDown",default:null},xlimit_u:{displayName:"Upper Limit",type:"NumUpDown",default:null}},Ticks:{xlimit_ticks:{displayName:"Draw Ticks",type:"ToggleSwitch",default:!0},xlimit_tick_count:{displayName:"Maximum Ticks",type:"NumUpDown",default:10,options:{minValue:{value:0},maxValue:{value:100}}},xlimit_tick_font:{displayName:"Tick Font",type:"FontPicker",default:hn.font.default,valid:hn.font.valid},xlimit_tick_size:{displayName:"Tick Font Size",type:"NumUpDown",default:hn.size.default,options:hn.size.options},xlimit_tick_colour:{displayName:"Tick Font Colour",type:"ColorPicker",default:dn},xlimit_tick_rotation:{displayName:"Tick Rotation (Degrees)",type:"NumUpDown",default:0,options:{minValue:{value:-360},maxValue:{value:360}}}},Label:{xlimit_label:{displayName:"Label",type:"TextInput",default:null},xlimit_label_font:{displayName:"Label Font",type:"FontPicker",default:hn.font.default,valid:hn.font.valid},xlimit_label_size:{displayName:"Label Font Size",type:"NumUpDown",default:hn.size.default,options:hn.size.options},xlimit_label_colour:{displayName:"Label Font Colour",type:"ColorPicker",default:dn}}}},y_axis:{description:"Y Axis Settings",displayName:"Y Axis Settings",settingsGroups:{Axis:{ylimit_colour:{displayName:"Axis Colour",type:"ColorPicker",default:dn},ylimit_sig_figs:{displayName:"Tick Decimal Places",type:"NumUpDown",default:null,options:{minValue:{value:0},maxValue:{value:100}}},ylimit_l:{displayName:"Lower Limit",type:"NumUpDown",default:null},ylimit_u:{displayName:"Upper Limit",type:"NumUpDown",default:null}},Ticks:{ylimit_ticks:{displayName:"Draw Ticks",type:"ToggleSwitch",default:!0},ylimit_tick_count:{displayName:"Maximum Ticks",type:"NumUpDown",default:10,options:{minValue:{value:0},maxValue:{value:100}}},ylimit_tick_font:{displayName:"Tick Font",type:"FontPicker",default:hn.font.default,valid:hn.font.valid},ylimit_tick_size:{displayName:"Tick Font Size",type:"NumUpDown",default:hn.size.default,options:hn.size.options},ylimit_tick_colour:{displayName:"Tick Font Colour",type:"ColorPicker",default:dn},ylimit_tick_rotation:{displayName:"Tick Rotation (Degrees)",type:"NumUpDown",default:0,options:{minValue:{value:-360},maxValue:{value:360}}}},Label:{ylimit_label:{displayName:"Label",type:"TextInput",default:null},ylimit_label_font:{displayName:"Label Font",type:"FontPicker",default:hn.font.default,valid:hn.font.valid},ylimit_label_size:{displayName:"Label Font Size",type:"NumUpDown",default:hn.size.default,options:hn.size.options},ylimit_label_colour:{displayName:"Label Font Colour",type:"ColorPicker",default:dn}}}},labels:{description:"Labels Settings",displayName:"Labels Settings",settingsGroups:{all:{show_labels:{displayName:"Show Value Labels",type:"ToggleSwitch",default:!0},label_position:{displayName:"Label Position",type:"Dropdown",default:"top",valid:["top","bottom"],items:[{displayName:"Top",value:"top"},{displayName:"Bottom",value:"bottom"}]},label_y_offset:{displayName:"Label Offset from Top/Bottom (px)",type:"NumUpDown",default:20},label_line_offset:{displayName:"Label Offset from Connecting Line (px)",type:"NumUpDown",default:5},label_angle_offset:{displayName:"Label Angle Offset (degrees)",type:"NumUpDown",default:0,options:{minValue:{value:-90},maxValue:{value:90}}},label_font:{displayName:"Label Font",type:"FontPicker",default:hn.font.default,valid:hn.font.valid},label_size:{displayName:"Label Font Size",type:"NumUpDown",default:hn.size.default,options:hn.size.options},label_colour:{displayName:"Label Font Colour",type:"ColorPicker",default:dn},label_line_colour:{displayName:"Connecting Line Colour",type:"ColorPicker",default:dn},label_line_width:{displayName:"Connecting Line Width",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:100}}},label_line_type:{displayName:"Connecting Line Type",type:"Dropdown",default:"10 0",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},label_line_max_length:{displayName:"Max Connecting Line Length (px)",type:"NumUpDown",default:1e3,options:{minValue:{value:0},maxValue:{value:1e4}}},label_marker_show:{displayName:"Show Line Markers",type:"ToggleSwitch",default:!0},label_marker_offset:{displayName:"Marker Offset from Value (px)",type:"NumUpDown",default:5},label_marker_size:{displayName:"Marker Size",type:"NumUpDown",default:3,options:{minValue:{value:0},maxValue:{value:100}}},label_marker_colour:{displayName:"Marker Fill Colour",type:"ColorPicker",default:dn},label_marker_outline_colour:{displayName:"Marker Outline Colour",type:"ColorPicker",default:dn}}}}},gn=[];for(const e in mn){const t=[];for(const r in mn[e].settingsGroups)for(const n in mn[e].settingsGroups[r])t.push([n,mn[e].settingsGroups[r][n]]);gn.push([e,Object.fromEntries(t)])}const yn=Object.fromEntries(gn);function vn(e,t){t.plotProperties.displayPlot?e.on("contextmenu",(e=>{const r=ue(e.target).datum();t.selectionManager.showContextMenu(r?r.identity:{},{x:e.clientX,y:e.clientY}),e.preventDefault()})):e.on("contextmenu",(()=>{}))}function wn(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2021 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */var _n,bn,Nn,xn,En,Sn,An,$n,Tn,Mn,kn,Pn,In,Dn,Rn,Ln,On,Cn,Vn,jn,Fn,Un,zn,qn,Gn,Hn,Bn,Xn,Wn,Yn,Kn,Zn,Jn,Qn,ei,ti,ri,ni,ii,oi,ai,si,li,ui,ci,pi,fi,di;function hi(){if(xn)return Nn;xn=1;var e=function(){if(bn)return _n;bn=1;var e="function"==typeof Object.defineProperty?Object.defineProperty:null;return _n=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2021 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Nn=function(){try{return e({},"x",{}),!0}catch(e){return!1}}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function mi(){if(Sn)return En;Sn=1;var e=Object.defineProperty;return En=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function gi(){if($n)return An;return $n=1,An=function(e){return"number"==typeof e}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function yi(){if(Mn)return Tn;function e(e){var t,r="";for(t=0;t<e;t++)r+="0";return r}return Mn=1,Tn=function(t,r,n){var i=!1,o=r-t.length;return o<0||(function(e){return"-"===e[0]}(t)&&(i=!0,t=t.substr(1)),t=n?t+e(o):e(o)+t,i&&(t="-"+t)),t},Tn}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function vi(){if(jn)return Vn;jn=1;var e=function(){if(Pn)return kn;Pn=1;var e=gi(),t=yi(),r=String.prototype.toLowerCase,n=String.prototype.toUpperCase;return kn=function(i){var o,a,s;switch(i.specifier){case"b":o=2;break;case"o":o=8;break;case"x":case"X":o=16;break;default:o=10}if(a=i.arg,s=parseInt(a,10),!isFinite(s)){if(!e(a))throw new Error("invalid integer. Value: "+a);s=0}return s<0&&("u"===i.specifier||10!==o)&&(s=4294967295+s+1),s<0?(a=(-s).toString(o),i.precision&&(a=t(a,i.precision,i.padRight)),a="-"+a):(a=s.toString(o),s||i.precision?i.precision&&(a=t(a,i.precision,i.padRight)):a="",i.sign&&(a=i.sign+a)),16===o&&(i.alternate&&(a="0x"+a),a=i.specifier===n.call(i.specifier)?n.call(a):r.call(a)),8===o&&i.alternate&&"0"!==a.charAt(0)&&(a="0"+a),a}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),t=Dn?In:(Dn=1,In=function(e){return"string"==typeof e}),r=function(){if(Ln)return Rn;Ln=1;var e=gi(),t=Math.abs,r=String.prototype.toLowerCase,n=String.prototype.toUpperCase,i=String.prototype.replace,o=/e\+(\d)$/,a=/e-(\d)$/,s=/^(\d+)$/,l=/^(\d+)e/,u=/\.0$/,c=/\.0*e/,p=/(\..*[^0])0*e/;return Rn=function(f){var d,h,m=parseFloat(f.arg);if(!isFinite(m)){if(!e(f.arg))throw new Error("invalid floating-point number. Value: "+h);m=f.arg}switch(f.specifier){case"e":case"E":h=m.toExponential(f.precision);break;case"f":case"F":h=m.toFixed(f.precision);break;case"g":case"G":t(m)<1e-4?((d=f.precision)>0&&(d-=1),h=m.toExponential(d)):h=m.toPrecision(f.precision),f.alternate||(h=i.call(h,p,"$1e"),h=i.call(h,c,"e"),h=i.call(h,u,""));break;default:throw new Error("invalid double notation. Value: "+f.specifier)}return h=i.call(h,o,"e+0$1"),h=i.call(h,a,"e-0$1"),f.alternate&&(h=i.call(h,s,"$1."),h=i.call(h,l,"$1.e")),m>=0&&f.sign&&(h=f.sign+h),f.specifier===n.call(f.specifier)?n.call(h):r.call(h)}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),n=function(){if(Cn)return On;function e(e){var t,r="";for(t=0;t<e;t++)r+=" ";return r}return Cn=1,On=function(t,r,n){var i=r-t.length;return i<0?t:t=n?t+e(i):e(i)+t},On}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),i=yi(),o=String.fromCharCode,a=isNaN,s=Array.isArray;function l(e){var t={};return t.specifier=e.specifier,t.precision=void 0===e.precision?1:e.precision,t.width=e.width,t.flags=e.flags||"",t.mapping=e.mapping,t}return Vn=function(u){var c,p,f,d,h,m,g,y,v;if(!s(u))throw new TypeError("invalid argument. First argument must be an array. Value: `"+u+"`.");for(m="",g=1,y=0;y<u.length;y++)if(f=u[y],t(f))m+=f;else{if(c=void 0!==f.precision,!(f=l(f)).specifier)throw new TypeError("invalid argument. Token is missing `specifier` property. Index: `"+y+"`. Value: `"+f+"`.");for(f.mapping&&(g=f.mapping),p=f.flags,v=0;v<p.length;v++)switch(d=p.charAt(v)){case" ":f.sign=" ";break;case"+":f.sign="+";break;case"-":f.padRight=!0,f.padZeros=!1;break;case"0":f.padZeros=p.indexOf("-")<0;break;case"#":f.alternate=!0;break;default:throw new Error("invalid flag: "+d)}if("*"===f.width){if(f.width=parseInt(arguments[g],10),g+=1,a(f.width))throw new TypeError("the argument for * width at position "+g+" is not a number. Value: `"+f.width+"`.");f.width<0&&(f.padRight=!0,f.width=-f.width)}if(c&&"*"===f.precision){if(f.precision=parseInt(arguments[g],10),g+=1,a(f.precision))throw new TypeError("the argument for * precision at position "+g+" is not a number. Value: `"+f.precision+"`.");f.precision<0&&(f.precision=1,c=!1)}switch(f.arg=arguments[g],f.specifier){case"b":case"o":case"x":case"X":case"d":case"i":case"u":c&&(f.padZeros=!1),f.arg=e(f);break;case"s":f.maxWidth=c?f.precision:-1;break;case"c":if(!a(f.arg)){if((h=parseInt(f.arg,10))<0||h>127)throw new Error("invalid character code. Value: "+f.arg);f.arg=a(h)?String(f.arg):o(h)}break;case"e":case"E":case"f":case"F":case"g":case"G":c||(f.precision=6),f.arg=r(f);break;default:throw new Error("invalid specifier: "+f.specifier)}f.maxWidth>=0&&f.arg.length>f.maxWidth&&(f.arg=f.arg.substring(0,f.maxWidth)),f.padZeros?f.arg=i(f.arg,f.width||f.precision,f.padRight):f.width&&(f.arg=n(f.arg,f.width,f.padRight)),m+=f.arg||"",g+=1}return m},Vn}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function wi(){if(Hn)return Gn;Hn=1;var e=function(){if(qn)return zn;qn=1;var e=/%(?:([1-9]\d*)\$)?([0 +\-#]*)(\*|\d+)?(?:(\.)(\*|\d+)?)?[hlL]?([%A-Za-z])/g;function t(e){var t={mapping:e[1]?parseInt(e[1],10):void 0,flags:e[2],width:e[3],precision:e[5],specifier:e[6]};return"."===e[4]&&void 0===e[5]&&(t.precision="1"),t}return zn=function(r){var n,i,o,a;for(i=[],a=0,o=e.exec(r);o;)(n=r.slice(a,e.lastIndex-o[0].length)).length&&i.push(n),i.push(t(o)),a=e.lastIndex,o=e.exec(r);return(n=r.slice(a)).length&&i.push(n),i}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Gn=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function _i(){if(Yn)return Wn;Yn=1;var e=function(){if(Un)return Fn;Un=1;var e=vi();return Fn=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),t=wi(),r=Xn?Bn:(Xn=1,Bn=function(e){return"string"==typeof e});return Wn=function n(i){var o,a;if(!r(i))throw new TypeError(n("invalid argument. First argument must be a string. Value: `%s`.",i));for(o=[t(i)],a=1;a<arguments.length;a++)o.push(arguments[a]);return e.apply(null,o)},Wn}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function bi(){if(Qn)return Jn;Qn=1;var e=function(){if(Zn)return Kn;Zn=1;var e=_i();return Kn=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),t=Object.prototype,r=t.toString,n=t.__defineGetter__,i=t.__defineSetter__,o=t.__lookupGetter__,a=t.__lookupSetter__;return Jn=function(s,l,u){var c,p,f,d;if("object"!=typeof s||null===s||"[object Array]"===r.call(s))throw new TypeError(e("invalid argument. First argument must be an object. Value: `%s`.",s));if("object"!=typeof u||null===u||"[object Array]"===r.call(u))throw new TypeError(e("invalid argument. Property descriptor must be an object. Value: `%s`.",u));if((p="value"in u)&&(o.call(s,l)||a.call(s,l)?(c=s.__proto__,s.__proto__=t,delete s[l],s[l]=u.value,s.__proto__=c):s[l]=u.value),f="get"in u,d="set"in u,p&&(f||d))throw new Error("invalid argument. Cannot specify one or more accessors and a value or writable attribute in the property descriptor.");return f&&n&&n.call(s,l,u.get),d&&i&&i.call(s,l,u.set),s}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Ni(){if(ni)return ri;ni=1;var e=function(){if(ti)return ei;ti=1;var e,t=hi(),r=mi(),n=bi();return e=t()?r:n,ei=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return ri=function(t,r,n){e(t,r,{configurable:!1,enumerable:!1,writable:!1,value:n})}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function xi(){if(oi)return ii;oi=1;var e=Ni();return ii=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Ei(){if(ui)return li;ui=1;var e=(si||(si=1,ai=function(e){return e!=e}),ai);return li=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Si(){if(pi)return ci;pi=1;return ci=11754943508222875e-54}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Ai(){if(di)return fi;di=1;var e=Number.POSITIVE_INFINITY;return fi=e}var $i,Ti,Mi,ki,Pi,Ii,Di,Ri,Li,Oi,Ci,Vi,ji,Fi,Ui,zi,qi,Gi,Hi,Bi,Xi,Wi,Yi,Ki,Zi,Ji,Qi,eo,to,ro,no,io,oo,ao,so,lo,uo,co,po,fo,ho,mo,go,yo,vo,wo,_o,bo,No,xo,Eo,So,Ao,$o,To,Mo,ko,Po,Io,Do,Ro,Lo,Oo,Co,Vo,jo,Fo,Uo,zo,qo,Go,Ho,Bo,Xo,Wo,Yo,Ko,Zo,Jo,Qo,ea,ta,ra,na,ia,oa,aa,sa,la,ua,ca,pa,fa,da,ha,ma,ga,ya,va,wa,_a,ba,Na,xa,Ea,Sa,Aa,$a,Ta,Ma,ka,Pa,Ia,Da,Ra,La,Oa,Ca,Va,ja,Fa,Ua,za,qa,Ga,Ha,Ba,Xa,Wa,Ya,Ka,Za,Ja,Qa,es,ts,rs,ns,is,os,as,ss,ls,us,cs,ps,fs,ds,hs,ms,gs,ys,vs,ws,_s,bs,Ns,xs,Es,Ss,As,$s,Ts,Ms,ks,Ps,Is,Ds,Rs,Ls,Os,Cs,Vs,js,Fs,Us,zs,qs,Gs,Hs,Bs,Xs,Ws,Ys,Ks,Zs,Js,Qs,el,tl,rl,nl,il,ol,al,sl,ll,ul,cl,pl,fl,dl,hl,ml,gl,yl,vl,wl,_l,bl,Nl,xl,El,Sl,Al,$l,Tl,Ml,kl,Pl,Il,Dl,Rl,Ll,Ol,Cl,Vl,jl,Fl,Ul,zl,ql,Gl,Hl,Bl,Xl,Wl,Yl,Kl,Zl,Jl,Ql,eu,tu,ru,nu,iu,ou,au,su,lu,uu,cu,pu,fu,du,hu,mu,gu,yu,vu,wu,_u,bu,Nu,xu,Eu,Su,Au,$u,Tu,Mu,ku,Pu,Iu,Du,Ru,Lu,Ou,Cu,Vu,ju,Fu,Uu,zu,qu,Gu,Hu,Bu,Xu,Wu,Yu,Ku,Zu,Ju,Qu,ec,tc,rc,nc,ic,oc,ac,sc,lc,uc,cc,pc,fc,dc,hc,mc,gc,yc,vc,wc,_c,bc,Nc,xc,Ec,Sc,Ac,$c,Tc,Mc,kc,Pc,Ic,Dc,Rc,Lc,Oc,Cc,Vc,jc,Fc,Uc,zc,qc,Gc,Hc,Bc,Xc,Wc,Yc,Kc,Zc,Jc,Qc,ep,tp,rp,np,ip,op,ap,sp,lp,up,cp,pp,fp,dp,hp,mp,gp,yp,vp,wp,_p,bp,Np,xp,Ep,Sp,Ap,$p,Tp,Mp,kp,Pp,Ip,Dp,Rp,Lp,Op,Cp,Vp,jp,Fp,Up,zp,qp,Gp,Hp,Bp,Xp,Wp,Yp,Kp,Zp,Jp,Qp,ef,tf,rf,nf,of,af,sf,lf,uf,cf,pf,ff,df,hf,mf,gf,yf,vf,wf,_f,bf,Nf,xf,Ef,Sf,Af,$f,Tf,Mf,kf,Pf,If,Df,Rf,Lf,Of,Cf,Vf,jf,Ff,Uf,zf,qf,Gf,Hf,Bf,Xf,Wf,Yf,Kf,Zf,Jf,Qf,ed,td,rd,nd,id,od,ad,sd,ld,ud,cd,pd,fd,dd,hd,md,gd,yd,vd,wd,_d,bd,Nd,xd,Ed,Sd,Ad,$d,Td,Md,kd,Pd,Id,Dd,Rd,Ld,Od,Cd,Vd,jd,Fd,Ud,zd,qd,Gd,Hd,Bd,Xd,Wd,Yd,Kd,Zd,Jd,Qd,eh,th,rh,nh,ih,oh,ah,sh,lh,uh,ch,ph,fh,dh,hh,mh,gh,yh,vh,wh,_h,bh,Nh,xh,Eh,Sh,Ah,$h,Th,Mh,kh,Ph,Ih,Dh,Rh,Lh,Oh,Ch,Vh,jh,Fh,Uh,zh,qh,Gh,Hh,Bh,Xh,Wh,Yh,Kh,Zh,Jh,Qh,em,tm,rm,nm,im,om,am,sm,lm,um,cm,pm,fm,dm,hm,mm,gm,ym,vm,wm,_m,bm,Nm,xm,Em,Sm,Am,$m,Tm,Mm,km,Pm,Im,Dm,Rm,Lm,Om,Cm,Vm,jm,Fm,Um,zm,qm,Gm,Hm,Bm,Xm,Wm,Ym,Km,Zm,Jm,Qm,eg,tg,rg,ng,ig,og,ag,sg,lg,ug,cg,pg,fg,dg,hg,mg,gg,yg,vg,wg,_g,bg,Ng,xg,Eg,Sg={exports:{}},Ag={exports:{}};function $g(){if(Ti)return $i;Ti=1;var e=1e3,t=60*e,r=60*t,n=24*r,i=365.25*n;function o(e,t,r){if(!(e<t))return e<1.5*t?Math.floor(e/t)+" "+r:Math.ceil(e/t)+" "+r+"s"}return $i=function(a,s){s=s||{};var l=typeof a;if("string"===l&&a.length>0)return function(o){if((o=String(o)).length>100)return;var a=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(o);if(!a)return;var s=parseFloat(a[1]);switch((a[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return s*i;case"days":case"day":case"d":return s*n;case"hours":case"hour":case"hrs":case"hr":case"h":return s*r;case"minutes":case"minute":case"mins":case"min":case"m":return s*t;case"seconds":case"second":case"secs":case"sec":case"s":return s*e;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return s;default:return}}(a);if("number"===l&&!1===isNaN(a))return s.long?function(i){return o(i,n,"day")||o(i,r,"hour")||o(i,t,"minute")||o(i,e,"second")||i+" ms"}(a):function(i){if(i>=n)return Math.round(i/n)+"d";if(i>=r)return Math.round(i/r)+"h";if(i>=t)return Math.round(i/t)+"m";if(i>=e)return Math.round(i/e)+"s";return i+"ms"}(a);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(a))},$i}function Tg(){return Mi||(Mi=1,function(e,t){var r;function n(e){function n(){if(n.enabled){var e=n,i=+new Date,o=i-(r||i);e.diff=o,e.prev=r,e.curr=i,r=i;for(var a=new Array(arguments.length),s=0;s<a.length;s++)a[s]=arguments[s];a[0]=t.coerce(a[0]),"string"!=typeof a[0]&&a.unshift("%O");var l=0;a[0]=a[0].replace(/%([a-zA-Z%])/g,(function(r,n){if("%%"===r)return r;l++;var i=t.formatters[n];if("function"==typeof i){var o=a[l];r=i.call(e,o),a.splice(l,1),l--}return r})),t.formatArgs.call(e,a),(n.log||t.log||console.log.bind(console)).apply(e,a)}}return n.namespace=e,n.enabled=t.enabled(e),n.useColors=t.useColors(),n.color=function(e){var r,n=0;for(r in e)n=(n<<5)-n+e.charCodeAt(r),n|=0;return t.colors[Math.abs(n)%t.colors.length]}(e),"function"==typeof t.init&&t.init(n),n}(t=e.exports=n.debug=n.default=n).coerce=function(e){return e instanceof Error?e.stack||e.message:e},t.disable=function(){t.enable("")},t.enable=function(e){t.save(e),t.names=[],t.skips=[];for(var r=("string"==typeof e?e:"").split(/[\s,]+/),n=r.length,i=0;i<n;i++)r[i]&&("-"===(e=r[i].replace(/\*/g,".*?"))[0]?t.skips.push(new RegExp("^"+e.substr(1)+"$")):t.names.push(new RegExp("^"+e+"$")))},t.enabled=function(e){var r,n;for(r=0,n=t.skips.length;r<n;r++)if(t.skips[r].test(e))return!1;for(r=0,n=t.names.length;r<n;r++)if(t.names[r].test(e))return!0;return!1},t.humanize=$g(),t.names=[],t.skips=[],t.formatters={}}(Ag,Ag.exports)),Ag.exports}function Mg(){return ki||(ki=1,function(e,t){function r(){var e;try{e=t.storage.debug}catch(e){}return!e&&"undefined"!=typeof process&&"env"in process&&(e=process.env.DEBUG),e}(t=e.exports=Tg()).log=function(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)},t.formatArgs=function(e){var r=this.useColors;if(e[0]=(r?"%c":"")+this.namespace+(r?" %c":" ")+e[0]+(r?"%c ":" ")+"+"+t.humanize(this.diff),!r)return;var n="color: "+this.color;e.splice(1,0,n,"color: inherit");var i=0,o=0;e[0].replace(/%[a-zA-Z%]/g,(function(e){"%%"!==e&&(i++,"%c"===e&&(o=i))})),e.splice(o,0,n)},t.save=function(e){try{null==e?t.storage.removeItem("debug"):t.storage.debug=e}catch(e){}},t.load=r,t.useColors=function(){if("undefined"!=typeof window&&window.process&&"renderer"===window.process.type)return!0;return"undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)},t.storage="undefined"!=typeof chrome&&void 0!==chrome.storage?chrome.storage.local:function(){try{return window.localStorage}catch(e){}}(),t.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"],t.formatters.j=function(e){try{return JSON.stringify(e)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}},t.enable(r())}(Sg,Sg.exports)),Sg.exports}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function kg(){if(Ii)return Pi;return Ii=1,Pi=function(e,t){var r,n;if((n=e.length)<2||0===t)return 0===n?0:e[0];for(r=e[n-=1]*t+e[n-1],n-=2;n>=0;)r=r*t+e[n],n-=1;return r},Pi}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Pg(){if(Oi)return Li;Oi=1;var e=Ri?Di:(Ri=1,Di=Function);return Li=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Ig(){if(Fi)return ji;Fi=1;var e=xi(),t=kg(),r=function(){if(Vi)return Ci;Vi=1;var e=Pg(),t=kg();return Ci=function(r){var n,i,o,a;if(r.length>500)return function(e){return t(r,e)};if(n="return function evalpoly(x){",0===(i=r.length))n+="return 0.0;";else if(1===i)n+="return "+r[0]+";";else{for(n+="if(x===0.0){return "+r[0]+";}",n+="return "+r[0],o=i-1,a=1;a<i;a++)n+="+x*",a<o&&(n+="("),n+=r[a];for(a=0;a<o-1;a++)n+=")";n+=";"}return n+="}",new e(n+="//# sourceURL=evalpoly.factory.js")()},Ci}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return e(t,"factory",r),ji=t}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Dg(){if(Gi)return qi;Gi=1;var e=zi?Ui:(zi=1,Ui=Number);return qi=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Rg(){if(Bi)return Hi;Bi=1;var e=Dg().NEGATIVE_INFINITY;return Hi=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Lg(){if(Ki)return Yi;Ki=1;var e=function(){if(Wi)return Xi;Wi=1;var e=Ai(),t=Rg();return Xi=function(r){return r===e||r===t},Xi}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Yi=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2021 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Og(){if(eo)return Qi;eo=1;var e=(Ji||(Ji=1,Zi=function(e){return Math.abs(e)}),Zi);return Qi=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Cg(){if(io)return no;io=1;var e=ro?to:(ro=1,to=function(){return"function"==typeof Symbol&&"symbol"==typeof Symbol("foo")});return no=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Vg(){if(lo)return so;lo=1;var e=function(){if(ao)return oo;ao=1;var e=Cg()();return oo=function(){return e&&"symbol"==typeof Symbol.toStringTag}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return so=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function jg(){if(co)return uo;co=1;var e=Object.prototype.toString;return uo=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Fg(){if(yo)return go;yo=1;var e=function(){if(mo)return ho;mo=1;var e=Object.prototype.hasOwnProperty;return ho=function(t,r){return null!=t&&e.call(t,r)}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return go=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Ug(){if(bo)return _o;bo=1;var e=function(){if(wo)return vo;wo=1;var e="function"==typeof Symbol?Symbol:void 0;return vo=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return _o=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function zg(){if(So)return Eo;So=1;var e=Fg(),t=function(){if(xo)return No;xo=1;var e=Ug(),t="function"==typeof e?e.toStringTag:"";return No=t}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),r=jg();return Eo=function(n){var i,o,a;if(null==n)return r.call(n);o=n[t],i=e(n,t);try{n[t]=void 0}catch(e){return r.call(n)}return a=r.call(n),i?n[t]=o:delete n[t],a}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function qg(){if($o)return Ao;$o=1;var e,t=Vg(),r=function(){if(fo)return po;fo=1;var e=jg();return po=function(t){return e.call(t)}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),n=zg();return e=t()?n:r,Ao=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Gg(){if(Po)return ko;Po=1;var e=function(){if(Mo)return To;Mo=1;var e=qg(),t="function"==typeof Uint32Array;return To=function(r){return t&&r instanceof Uint32Array||"[object Uint32Array]"===e(r)}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return ko=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Hg(){if(Co)return Oo;Co=1;var e=Gg(),t=Do?Io:(Do=1,Io=4294967295),r=function(){if(Lo)return Ro;Lo=1;var e="function"==typeof Uint32Array?Uint32Array:null;return Ro=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Oo=function(){var n,i;if("function"!=typeof r)return!1;try{i=new r(i=[1,3.14,-3.14,t+1,t+2]),n=e(i)&&1===i[0]&&3===i[1]&&i[2]===t-2&&0===i[3]&&1===i[4]}catch(e){n=!1}return n}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Bg(){if(Ho)return Go;Ho=1;var e,t=function(){if(jo)return Vo;jo=1;var e=Hg();return Vo=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),r=function(){if(Uo)return Fo;Uo=1;var e="function"==typeof Uint32Array?Uint32Array:void 0;return Fo=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),n=qo?zo:(qo=1,zo=function(){throw new Error("not implemented")});return e=t()?r:n,Go=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Xg(){if(Yo)return Wo;Yo=1;var e=function(){if(Xo)return Bo;Xo=1;var e=qg(),t="function"==typeof Float64Array;return Bo=function(r){return t&&r instanceof Float64Array||"[object Float64Array]"===e(r)}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Wo=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Wg(){if(Qo)return Jo;Qo=1;var e=Xg(),t=function(){if(Zo)return Ko;Zo=1;var e="function"==typeof Float64Array?Float64Array:null;return Ko=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Jo=function(){var r,n;if("function"!=typeof t)return!1;try{n=new t([1,3.14,-3.14,NaN]),r=e(n)&&1===n[0]&&3.14===n[1]&&-3.14===n[2]&&n[3]!=n[3]}catch(e){r=!1}return r}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Yg(){if(sa)return aa;sa=1;var e,t=function(){if(ta)return ea;ta=1;var e=Wg();return ea=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),r=function(){if(na)return ra;na=1;var e="function"==typeof Float64Array?Float64Array:void 0;return ra=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),n=oa?ia:(oa=1,ia=function(){throw new Error("not implemented")});return e=t()?r:n,aa=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Kg(){if(pa)return ca;pa=1;var e=function(){if(ua)return la;ua=1;var e=qg(),t="function"==typeof Uint8Array;return la=function(r){return t&&r instanceof Uint8Array||"[object Uint8Array]"===e(r)}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return ca=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Zg(){if(ya)return ga;ya=1;var e=Kg(),t=da?fa:(da=1,fa=255),r=function(){if(ma)return ha;ma=1;var e="function"==typeof Uint8Array?Uint8Array:null;return ha=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return ga=function(){var n,i;if("function"!=typeof r)return!1;try{i=new r(i=[1,3.14,-3.14,t+1,t+2]),n=e(i)&&1===i[0]&&3===i[1]&&i[2]===t-2&&0===i[3]&&1===i[4]}catch(e){n=!1}return n}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Jg(){if(Sa)return Ea;Sa=1;var e,t=function(){if(wa)return va;wa=1;var e=Zg();return va=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),r=function(){if(ba)return _a;ba=1;var e="function"==typeof Uint8Array?Uint8Array:void 0;return _a=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),n=xa?Na:(xa=1,Na=function(){throw new Error("not implemented")});return e=t()?r:n,Ea=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Qg(){if(Ma)return Ta;Ma=1;var e=function(){if($a)return Aa;$a=1;var e=qg(),t="function"==typeof Uint16Array;return Aa=function(r){return t&&r instanceof Uint16Array||"[object Uint16Array]"===e(r)}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Ta=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function ey(){if(La)return Ra;La=1;var e=Qg(),t=Pa?ka:(Pa=1,ka=65535),r=function(){if(Da)return Ia;Da=1;var e="function"==typeof Uint16Array?Uint16Array:null;return Ia=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Ra=function(){var n,i;if("function"!=typeof r)return!1;try{i=new r(i=[1,3.14,-3.14,t+1,t+2]),n=e(i)&&1===i[0]&&3===i[1]&&i[2]===t-2&&0===i[3]&&1===i[4]}catch(e){n=!1}return n}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function ty(){if(qa)return za;qa=1;var e,t=function(){if(Ca)return Oa;Ca=1;var e=ey();return Oa=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),r=function(){if(ja)return Va;ja=1;var e="function"==typeof Uint16Array?Uint16Array:void 0;return Va=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),n=Ua?Fa:(Ua=1,Fa=function(){throw new Error("not implemented")});return e=t()?r:n,za=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function ry(){if(Xa)return Ba;Xa=1;var e,t,r=function(){if(Ha)return Ga;Ha=1;var e=Jg(),t=ty();return Ga={uint16:t,uint8:e}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return(t=new r.uint16(1))[0]=4660,e=52===new r.uint8(t.buffer)[0],Ba=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function ny(){if(Ya)return Wa;Ya=1;var e=ry();return Wa=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function iy(){if(Qa)return Ja;Qa=1;var e=Bg(),t=Yg(),r=function(){if(Za)return Ka;Za=1;var e=ny();return Ka=!0===e?1:0}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),n=new t(1),i=new e(n.buffer);return Ja=function(e){return n[0]=e,i[r]},Ja}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function oy(){if(ts)return es;ts=1;var e=iy();return es=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function ay(){if(os)return is;os=1;var e=Bg(),t=Yg(),r=function(){if(ns)return rs;ns=1;var e=ny();return rs=!0===e?1:0}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),n=new t(1),i=new e(n.buffer);return is=function(e,t){return n[0]=e,i[r]=t>>>0,n[0]},is}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function sy(){if(ss)return as;ss=1;var e=ay();return as=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function ly(){if(us)return ls;us=1;return ls=1023}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function uy(){if(ms)return hs;ms=1;var e=oy(),t=sy(),r=Ei(),n=ly(),i=Rg(),o=(ps||(ps=1,cs=function(e){return 0===e?.3999999999940942:.3999999999940942+e*(.22222198432149784+.15313837699209373*e)}),cs),a=(ds||(ds=1,fs=function(e){return 0===e?.6666666666666735:.6666666666666735+e*(.2857142874366239+e*(.1818357216161805+.14798198605116586*e))}),fs),s=.6931471803691238,l=1.9082149292705877e-10,u=1048575;return hs=function(c){var p,f,d,h,m,g,y,v,w,_,b;return 0===c?i:r(c)||c<0?NaN:(h=0,(f=e(c))<1048576&&(h-=54,f=e(c*=0x40000000000000)),f>=2146435072?c+c:(h+=(f>>20)-n|0,h+=(y=(f&=u)+614244&1048576)>>20,g=(c=t(c,f|1072693248^y))-1,(u&2+f)<3?0===g?0===h?0:h*s+h*l:(m=g*g*(.5-.3333333333333333*g),0===h?g-m:h*s-(m-h*l-g)):(y=f-398458|0,v=440401-f|0,d=(_=(b=(w=g/(2+g))*w)*b)*o(_),m=b*a(_)+d,(y|=v)>0?(p=.5*g*g,0===h?g-(p-w*(p+m)):h*s-(p-(w*(p+m)+h*l)-g)):0===h?g-w*(g-m):h*s-(w*(g-m)-h*l-g))))},hs}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function cy(){if(ys)return gs;ys=1;var e=uy();return gs=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function py(){if(bs)return _s;bs=1;var e=function(){if(ws)return vs;ws=1;var e=Math.floor;return vs=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return _s=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function fy(){if(Ss)return Es;Ss=1;var e=function(){if(xs)return Ns;xs=1;var e=Math.ceil;return Ns=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Es=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function dy(){if(Ms)return Ts;Ms=1;var e=function(){if($s)return As;$s=1;var e=py(),t=fy();return As=function(r){return r<0?t(r):e(r)},As}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Ts=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function hy(){if(Ls)return Rs;Ls=1;var e=(Ps||(Ps=1,ks=function(e){return 0===e?.0416666666666666:.0416666666666666+e*(2480158728947673e-20*e-.001388888888887411)}),ks),t=(Ds||(Ds=1,Is=function(e){return 0===e?-2.7557314351390663e-7:e*(2.087572321298175e-9+-11359647557788195e-27*e)-2.7557314351390663e-7}),Is);return Rs=function(r,n){var i,o,a,s;return a=(s=r*r)*s,o=s*e(s),o+=a*a*t(s),(a=1-(i=.5*s))+(1-a-i+(s*o-r*n))},Rs}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function my(){if(Cs)return Os;Cs=1;var e=hy();return Os=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The following copyright, license, and long comment were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/k_sin.c}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
  *
  * Developed at SunPro, a Sun Microsystems, Inc. business.
  * Permission to use, copy, modify, and distribute this
  * software is freely granted, provided that this notice
  * is preserved.
  * ```
  */function gy(){if(Us)return Fs;Us=1;var e=function(){if(js)return Vs;js=1;var e=-.16666666666666632;return Vs=function(t,r){var n,i,o;return n=.00833333333332249+(o=t*t)*(27557313707070068e-22*o-.0001984126982985795)+o*(o*o)*(1.58969099521155e-10*o-2.5050760253406863e-8),i=o*t,0===r?t+i*(e+o*n):t-(o*(.5*r-i*n)-r-i*e)},Vs}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Fs=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function yy(){if(qs)return zs;qs=1;return zs=2147483647}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function vy(){if(Hs)return Gs;Hs=1;return Gs=2146435072}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function wy(){if(Xs)return Bs;Xs=1;return Bs=1048575}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function _y(){if(Zs)return Ks;Zs=1;var e=Bg(),t=Yg(),r=function(){if(Ys)return Ws;Ys=1;var e=ny();return Ws=!0===e?0:1}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),n=new t(1),i=new e(n.buffer);return Ks=function(e){return n[0]=e,i[r]},Ks}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function by(){if(nl)return rl;nl=1;var e=Bg(),t=Yg(),r=function(){return tl?el:(tl=1,!0===ny()?(e=1,t=0):(e=0,t=1),el={HIGH:e,LOW:t});var e,t}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),n=new t(1),i=new e(n.buffer),o=r.HIGH,a=r.LOW;return rl=function(e,t){return i[o]=e,i[a]=t,n[0]},rl}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Ny(){if(ol)return il;ol=1;var e=by();return il=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function xy(){if(yl)return gl;yl=1;var e=Bg(),t=Yg(),r=function(){return ml?hl:(ml=1,!0===ny()?(e=1,t=0):(e=0,t=1),hl={HIGH:e,LOW:t});var e,t}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),n=new t(1),i=new e(n.buffer),o=r.HIGH,a=r.LOW;return gl=function(e,t,r,s){return n[0]=e,t[s]=i[o],t[s+r]=i[a],t},gl}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Ey(){if(bl)return _l;bl=1;var e=xi(),t=function(){if(wl)return vl;wl=1;var e=xy();return vl=function(t){return e(t,[0,0],1,0)},vl}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return e(t,"assign",xy()),_l=t}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Sy(){if(xl)return Nl;xl=1;var e=dl?fl:(dl=1,fl=2147483648),t=yy(),r=Ey(),n=oy(),i=Ny(),o=[0,0];return Nl=function(a,s){var l,u;return r.assign(a,o,1,0),l=o[0],l&=t,u=n(s),i(l|=u&=e,o[1])},Nl}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Ay(){if(Sl)return El;Sl=1;var e=Sy();return El=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function $y(){if(Ml)return Tl;Ml=1;var e=$l?Al:($l=1,Al=22250738585072014e-324),t=Lg(),r=Ei(),n=Og();return Tl=function(i,o,a,s){return r(i)||t(i)?(o[s]=i,o[s+a]=0,o):0!==i&&n(i)<e?(o[s]=4503599627370496*i,o[s+a]=-52,o):(o[s]=i,o[s+a]=0,o)},Tl}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Ty(){if(Dl)return Il;Dl=1;var e=xi(),t=function(){if(Pl)return kl;Pl=1;var e=$y();return kl=function(t){return e(t,[0,0],1,0)},kl}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return e(t,"assign",$y()),Il=t}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function My(){if(Cl)return Ol;Cl=1;var e=function(){if(Ll)return Rl;Ll=1;var e=oy(),t=vy(),r=ly();return Rl=function(n){var i=e(n);return(i=(i&t)>>>20)-r|0},Rl}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Ol=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function ky(){if(jl)return Vl;jl=1;var e=Ai(),t=Rg(),r=ly(),n=sl?al:(sl=1,al=1023),i=ul?ll:(ul=1,ll=-1023),o=pl?cl:(pl=1,cl=-1074),a=Ei(),s=Lg(),l=Ay(),u=Ty().assign,c=My(),p=Ey(),f=Ny(),d=[0,0],h=[0,0];return Vl=function(m,g){var y,v;return 0===g||0===m||a(m)||s(m)?m:(u(m,d,1,0),g+=d[1],(g+=c(m=d[0]))<o?l(0,m):g>n?m<0?t:e:(g<=i?(g+=52,v=2220446049250313e-31):v=1,p.assign(m,h,1,0),y=h[0],y&=2148532223,v*f(y|=g+r<<20,h[1])))},Vl}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Py(){if(Ul)return Fl;Ul=1;var e=ky();return Fl=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2021 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Iy(){if(Hl)return Gl;Hl=1;var e=ql?zl:(ql=1,zl=function(e,t){var r,n;for(r=[],n=0;n<t;n++)r.push(e);return r});return Gl=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2021 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Dy(){if(Yl)return Wl;Yl=1;var e=function(){if(Xl)return Bl;Xl=1;var e=Iy();return Bl=function(t){return e(0,t)}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2021 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Wl=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/k_rem_pio2.c}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
  *
  * Developed at SunPro, a Sun Microsystems, Inc. business.
  * Permission to use, copy, modify, and distribute this
  * software is freely granted, provided that this notice
  * is preserved.
  * ```
  */function Ry(){if(Zl)return Kl;Zl=1;var e=py(),t=Py(),r=Dy(),n=[10680707,7228996,1387004,2578385,16069853,12639074,9804092,4427841,16666979,11263675,12935607,2387514,4345298,14681673,3074569,13734428,16653803,1880361,10960616,8533493,3062596,8710556,7349940,6258241,3772886,3769171,3798172,8675211,12450088,3874808,9961438,366607,15675153,9132554,7151469,3571407,2607881,12013382,4155038,6285869,7677882,13102053,15825725,473591,9065106,15363067,6271263,9264392,5636912,4652155,7056368,13614112,10155062,1944035,9527646,15080200,6658437,6231200,6832269,16767104,5075751,3212806,1398474,7579849,6349435,12618859],i=[1.570796251296997,7.549789415861596e-8,5390302529957765e-30,3282003415807913e-37,1270655753080676e-44,12293330898111133e-52,27337005381646456e-60,21674168387780482e-67],o=16777216,a=5.960464477539063e-8,s=r(20),l=r(20),u=r(20),c=r(20);function p(r,s,l,f,d,h,m,g,y){var v,w,_,b,N,x,E,S,A;for(b=h,A=f[l],S=l,N=0;S>0;N++)w=a*A|0,c[N]=A-o*w|0,A=f[S-1]+w,S-=1;if(A=t(A,d),A-=8*e(.125*A),A-=E=0|A,_=0,d>0?(E+=N=c[l-1]>>24-d,c[l-1]-=N<<24-d,_=c[l-1]>>23-d):0===d?_=c[l-1]>>23:A>=.5&&(_=2),_>0){for(E+=1,v=0,N=0;N<l;N++)S=c[N],0===v?0!==S&&(v=1,c[N]=16777216-S):c[N]=16777215-S;if(d>0)switch(d){case 1:c[l-1]&=8388607;break;case 2:c[l-1]&=4194303}2===_&&(A=1-A,0!==v&&(A-=t(1,d)))}if(0===A){for(S=0,N=l-1;N>=h;N--)S|=c[N];if(0===S){for(x=1;0===c[h-x];x++);for(N=l+1;N<=l+x;N++){for(y[g+N]=n[m+N],w=0,S=0;S<=g;S++)w+=r[S]*y[g+(N-S)];f[N]=w}return p(r,s,l+=x,f,d,h,m,g,y)}}if(0===A)for(l-=1,d-=24;0===c[l];)l-=1,d-=24;else(A=t(A,-d))>=o?(w=a*A|0,c[l]=A-o*w|0,d+=24,c[l+=1]=w):c[l]=0|A;for(w=t(1,d),N=l;N>=0;N--)f[N]=w*c[N],w*=a;for(N=l;N>=0;N--){for(w=0,x=0;x<=b&&x<=l-N;x++)w+=i[x]*f[N+x];u[l-N]=w}for(w=0,N=l;N>=0;N--)w+=u[N];for(s[0]=0===_?w:-w,w=u[0]-w,N=1;N<=l;N++)w+=u[N];return s[1]=0===_?w:-w,7&E}return Kl=function(e,t,r,i){var o,a,u,c,f,d,h;for((a=(r-3)/24|0)<0&&(a=0),c=r-24*(a+1),d=a-(u=i-1),h=u+4,f=0;f<=h;f++)s[f]=d<0?0:n[d],d+=1;for(f=0;f<=4;f++){for(o=0,d=0;d<=u;d++)o+=e[d]*s[u+(f-d)];l[f]=o}return p(e,t,4,l,c,4,a,u,s)},Kl}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Ly(){if(tu)return eu;tu=1;var e=function(){if(Ql)return Jl;Ql=1;var e=Math.round;return Jl=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return eu=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/k_rem_pio2.c}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
  *
  * Developed at SunPro, a Sun Microsystems, Inc. business.
  * Permission to use, copy, modify, and distribute this
  * software is freely granted, provided that this notice
  * is preserved.
  * ```
  */function Oy(){if(ou)return iu;ou=1;var e=yy(),t=vy(),r=wy(),n=oy(),i=function(){if(Qs)return Js;Qs=1;var e=_y();return Js=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),o=Ny(),a=Ry(),s=function(){if(nu)return ru;nu=1;var e=Ly(),t=oy();return ru=function(r,n,i){var o,a,s,l,u;return s=r-1.5707963267341256*(o=e(.6366197723675814*r)),l=6077100506506192e-26*o,u=n>>20,i[0]=s-l,u-(t(i[0])>>20&2047)>16&&(l=20222662487959506e-37*o-((a=s)-(s=a-(l=6077100506303966e-26*o))-l),i[0]=s-l,u-(t(i[0])>>20&2047)>49&&(l=84784276603689e-45*o-((a=s)-(s=a-(l=20222662487111665e-37*o))-l),i[0]=s-l)),i[1]=s-i[0]-l,o},ru}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/e_rem_pio2.c}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
  *
  * Developed at SunPro, a Sun Microsystems, Inc. business.
  * Permission to use, copy, modify, and distribute this
  * software is freely granted, provided that this notice
  * is preserved.
  *
  * Optimized by Bruce D. Evans.
  * ```
  */(),l=1.5707963267341256,u=6077100506506192e-26,c=2*u,p=3*u,f=4*u,d=[0,0,0],h=[0,0];return iu=function(m,g){var y,v,w,_,b,N,x;if((w=n(m)&e)<=1072243195)return g[0]=m,g[1]=0,0;if(w<=1074752122)return 598523==(w&r)?s(m,w,g):w<=1073928572?m>0?(x=m-l,g[0]=x-u,g[1]=x-g[0]-u,1):(x=m+l,g[0]=x+u,g[1]=x-g[0]+u,-1):m>0?(x=m-2*l,g[0]=x-c,g[1]=x-g[0]-c,2):(x=m+2*l,g[0]=x+c,g[1]=x-g[0]+c,-2);if(w<=1075594811)return w<=1075183036?1074977148===w?s(m,w,g):m>0?(x=m-3*l,g[0]=x-p,g[1]=x-g[0]-p,3):(x=m+3*l,g[0]=x+p,g[1]=x-g[0]+p,-3):1075388923===w?s(m,w,g):m>0?(x=m-4*l,g[0]=x-f,g[1]=x-g[0]-f,4):(x=m+4*l,g[0]=x+f,g[1]=x-g[0]+f,-4);if(w<1094263291)return s(m,w,g);if(w>=t)return g[0]=NaN,g[1]=NaN,0;for(y=i(m),x=o(w-((v=(w>>20)-1046)<<20),y),b=0;b<2;b++)d[b]=0|x,x=16777216*(x-d[b]);for(d[2]=x,_=3;0===d[_-1];)_-=1;return N=a(d,h,v,_,1),m<0?(g[0]=-h[0],g[1]=-h[1],-N):(g[0]=h[0],g[1]=h[1],N)},iu}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Cy(){if(su)return au;su=1;var e=Oy();return au=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The following copyright, license, and long comment were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_cos.c}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
  *
  * Developed at SunPro, a Sun Microsystems, Inc. business.
  * Permission to use, copy, modify, and distribute this
  * software is freely granted, provided that this notice
  * is preserved.
  * ```
  */function Vy(){if(pu)return cu;pu=1;var e=function(){if(uu)return lu;uu=1;var e=oy(),t=my(),r=gy(),n=Cy(),i=[0,0];return lu=function(o){var a;if(a=e(o),(a&=2147483647)<=1072243195)return a<1044381696?1:t(o,0);if(a>=2146435072)return NaN;switch(3&n(o,i)){case 0:return t(i[0],i[1]);case 1:return-r(i[0],i[1]);case 2:return-t(i[0],i[1]);default:return r(i[0],i[1])}},lu}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return cu=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The following copyright, license, and long comment were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_sin.c}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
  *
  * Developed at SunPro, a Sun Microsystems, Inc. business.
  * Permission to use, copy, modify, and distribute this
  * software is freely granted, provided that this notice
  * is preserved.
  * ```
  */function jy(){if(mu)return hu;mu=1;var e=function(){if(du)return fu;du=1;var e=yy(),t=vy(),r=oy(),n=my(),i=gy(),o=Cy(),a=[0,0];return fu=function(s){var l;if(l=r(s),(l&=e)<=1072243195)return l<1045430272?s:i(s,0);if(l>=t)return NaN;switch(3&o(s,a)){case 0:return i(a[0],a[1]);case 1:return n(a[0],a[1]);case 2:return-i(a[0],a[1]);default:return-n(a[0],a[1])}},fu}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return hu=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Fy(){if(yu)return gu;yu=1;return gu=3.141592653589793}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Uy(){if(bu)return _u;bu=1;var e=function(){if(wu)return vu;wu=1;var e=Ei(),t=Lg(),r=Vy(),n=jy(),i=Og(),o=Ay(),a=Fy();return vu=function(s){var l,u;return e(s)||t(s)?NaN:0===(l=i(u=s%2))||1===l?o(0,u):l<.25?n(a*u):l<.75?o(r(a*(l=.5-l)),u):l<1.25?(u=o(1,u)-u,n(a*u)):l<1.75?-o(r(a*(l-=1.5)),u):(u-=o(2,u),n(a*u))},vu}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return _u=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function zy(){if(qu)return zu;qu=1;var e=Ei(),t=Lg(),r=Og(),n=cy(),i=dy(),o=Uy(),a=Fy(),s=Ai(),l=(xu||(xu=1,Nu=function(e){return 0===e?.06735230105312927:.06735230105312927+e*(.007385550860814029+e*(.0011927076318336207+e*(.00022086279071390839+25214456545125733e-21*e)))}),Nu),u=(Su||(Su=1,Eu=function(e){return 0===e?.020580808432516733:.020580808432516733+e*(.0028905138367341563+e*(.0005100697921535113+e*(.00010801156724758394+44864094961891516e-21*e)))}),Eu),c=($u||($u=1,Au=function(e){return 0===e?1.3920053346762105:1.3920053346762105+e*(.7219355475671381+e*(.17193386563280308+e*(.01864591917156529+e*(.0007779424963818936+7326684307446256e-21*e))))}),Au),p=(Mu||(Mu=1,Tu=function(e){return 0===e?.21498241596060885:.21498241596060885+e*(.325778796408931+e*(.14635047265246445+e*(.02664227030336386+e*(.0018402845140733772+3194753265841009e-20*e))))}),Tu),f=(Pu||(Pu=1,ku=function(e){return 0===e?-.032788541075985965:e*(.006100538702462913+e*(.00031563207090362595*e-.0014034646998923284))-.032788541075985965}),ku),d=(Du||(Du=1,Iu=function(e){return 0===e?.01797067508118204:.01797067508118204+e*(e*(.000881081882437654+-.00031275416837512086*e)-.0036845201678113826)}),Iu),h=(Lu||(Lu=1,Ru=function(e){return 0===e?-.010314224129834144:e*(.0022596478090061247+e*(.0003355291926355191*e-.0005385953053567405))-.010314224129834144}),Ru),m=(Cu||(Cu=1,Ou=function(e){return 0===e?.6328270640250934:.6328270640250934+e*(1.4549225013723477+e*(.9777175279633727+e*(.22896372806469245+.013381091853678766*e)))}),Ou),g=(ju||(ju=1,Vu=function(e){return 0===e?2.4559779371304113:2.4559779371304113+e*(2.128489763798934+e*(.7692851504566728+e*(.10422264559336913+.003217092422824239*e)))}),Vu),y=(Uu||(Uu=1,Fu=function(e){return 0===e?.08333333333333297:.08333333333333297+e*(e*(.0007936505586430196+e*(e*(.0008363399189962821+-.0016309293409657527*e)-.00059518755745034))-.0027777777772877554)}),Fu),v=1.4616321449683622,w=1.4616321449683622;return zu=function(_){var b,N,x,E,S,A,$,T;if(e(_)||t(_))return _;if(0===_)return s;if(_<0?(b=!0,_=-_):b=!1,_<8470329472543003e-37)return-n(_);if(b){if(_>=4503599627370496)return s;if(0===(E=o(_)))return s;N=n(a/r(E*_))}if(1===_||2===_)return 0;if(_<2)switch(_<=.9?(T=-n(_),_>=v-1+.27?(A=1-_,x=0):_>=v-1-.27?(A=_-(w-1),x=1):(A=_,x=2)):(T=0,_>=v+.27?(A=2-_,x=0):_>=v-.27?(A=_-w,x=1):(A=_-1,x=2)),x){case 0:T+=A*(.07721566490153287+($=A*A)*l($))+$*(.3224670334241136+$*u($))-.5*A;break;case 1:T+=-.12148629053584961+(($=A*A)*(.48383612272381005+(S=$*A)*f(S))-(-3638676997039505e-33-S*(S*d(S)-.1475877229945939+A*(.06462494023913339+S*h(S)))));break;case 2:T+=-.5*A+A*(A*m(A)-.07721566490153287)/(1+A*g(A))}else if(_<8)switch(T=.5*(A=_-(x=i(_)))+A*(A*p(A)-.07721566490153287)/(1+A*c(A)),$=1,x){case 7:$*=A+6;case 6:$*=A+5;case 5:$*=A+4;case 4:$*=A+3;case 3:T+=n($*=A+2)}else T=_<0x400000000000000?(_-.5)*((E=n(_))-1)+(S=.4189385332046727+($=1/_)*y(A=$*$)):_*(n(_)-1);return b&&(T=N-T),T},zu}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function qy(){if(Hu)return Gu;Hu=1;var e=zy();return Gu=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Gy(){if(Yu)return Wu;Yu=1;var e=function(){if(Xu)return Bu;Xu=1;var e=Math.sqrt;return Bu=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Wu=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Hy(){if(sc)return ac;sc=1;var e=Ei(),t=Gy(),r=cy(),n=Ai(),i=Rg(),o=(Zu||(Zu=1,Ku=function(e){var t,r;return 0===e?-.0005087819496582806:((e<0?-e:e)<=1?(t=e*(e*(.03348066254097446+e*(e*(e*(.02198786811111689+e*(.008226878746769157+e*(e*(0+0*e)-.005387729650712429)))-.03656379714117627)-.012692614766297404))-.008368748197417368)-.0005087819496582806,r=1+e*(e*(e*(1.5622155839842302+e*(.662328840472003+e*(e*(e*(.07952836873415717+e*(.0008862163904564247*e-.0023339375937419))-.05273963823400997)-.7122890234154284)))-1.5657455823417585)-.9700050433032906)):(t=0+(e=1/e)*(0+e*(e*(.008226878746769157+e*(.02198786811111689+e*(e*(e*(.03348066254097446+e*(-.0005087819496582806*e-.008368748197417368))-.012692614766297404)-.03656379714117627)))-.005387729650712429)),r=.0008862163904564247+e*(e*(.07952836873415717+e*(e*(e*(.662328840472003+e*(1.5622155839842302+e*(e*(1*e-.9700050433032906)-1.5657455823417585)))-.7122890234154284)-.05273963823400997))-.0023339375937419)),t/r)}),Ku),a=(Qu||(Qu=1,Ju=function(e){var t,r;return 0===e?-.20243350835593876:((e<0?-e:e)<=1?(t=e*(.10526468069939171+e*(8.3705032834312+e*(17.644729840837403+e*(e*(e*(17.445385985570866+e*(21.12946554483405+-3.6719225470772936*e))-44.6382324441787)-18.851064805871424))))-.20243350835593876,r=1+e*(6.242641248542475+e*(3.971343795334387+e*(e*(e*(48.560921310873994+e*(10.826866735546016+e*(1.7211476576120028*e-22.643693341313973)))-20.14326346804852)-28.66081804998)))):(t=(e=1/e)*(21.12946554483405+e*(17.445385985570866+e*(e*(e*(17.644729840837403+e*(8.3705032834312+e*(.10526468069939171+-.20243350835593876*e)))-18.851064805871424)-44.6382324441787)))-3.6719225470772936,r=1.7211476576120028+e*(e*(10.826866735546016+e*(48.560921310873994+e*(e*(e*(3.971343795334387+e*(6.242641248542475+1*e))-28.66081804998)-20.14326346804852)))-22.643693341313973)),t/r)}),Ju),s=(tc||(tc=1,ec=function(e){var t,r;return 0===e?-.1311027816799519:((e<0?-e:e)<=1?(t=e*(e*(.11703015634199525+e*(.38707973897260434+e*(.3377855389120359+e*(.14286953440815717+e*(.029015791000532906+e*(.0021455899538880526+e*(e*(2.8522533178221704e-8+-6.81149956853777e-10*e)-6.794655751811263e-7)))))))-.16379404719331705)-.1311027816799519,r=1+e*(3.4662540724256723+e*(5.381683457070069+e*(4.778465929458438+e*(2.5930192162362027+e*(.848854343457902+e*(.15226433829533179+e*(.011059242293464892+e*(0+e*(0+0*e)))))))))):(t=(e=1/e)*(2.8522533178221704e-8+e*(e*(.0021455899538880526+e*(.029015791000532906+e*(.14286953440815717+e*(.3377855389120359+e*(.38707973897260434+e*(.11703015634199525+e*(-.1311027816799519*e-.16379404719331705)))))))-6.794655751811263e-7))-6.81149956853777e-10,r=0+e*(0+e*(0+e*(.011059242293464892+e*(.15226433829533179+e*(.848854343457902+e*(2.5930192162362027+e*(4.778465929458438+e*(5.381683457070069+e*(3.4662540724256723+1*e)))))))))),t/r)}),ec),l=(nc||(nc=1,rc=function(e){var t,r;return 0===e?-.0350353787183178:((e<0?-e:e)<=1?(t=e*(e*(.018557330651423107+e*(.009508047013259196+e*(.0018712349281955923+e*(.00015754461742496055+e*(460469890584318e-20+e*(26633922742578204e-28*e-2.304047769118826e-10))))))-.0022242652921344794)-.0350353787183178,r=1+e*(1.3653349817554064+e*(.7620591645536234+e*(.22009110576413124+e*(.03415891436709477+e*(.00263861676657016+e*(7646752923027944e-20+e*(0+0*e)))))))):(t=26633922742578204e-28+(e=1/e)*(e*(460469890584318e-20+e*(.00015754461742496055+e*(.0018712349281955923+e*(.009508047013259196+e*(.018557330651423107+e*(-.0350353787183178*e-.0022242652921344794))))))-2.304047769118826e-10),r=0+e*(0+e*(7646752923027944e-20+e*(.00263861676657016+e*(.03415891436709477+e*(.22009110576413124+e*(.7620591645536234+e*(1.3653349817554064+1*e)))))))),t/r)}),rc),u=(oc||(oc=1,ic=function(e){var t,r;return 0===e?-.016743100507663373:((e<0?-e:e)<=1?(t=e*(e*(.001056288621524929+e*(.00020938631748758808+e*(14962478375834237e-21+e*(4.4969678992770644e-7+e*(4.625961635228786e-9+e*(9905570997331033e-32*e-2811287356288318e-29))))))-.0011295143874558028)-.016743100507663373,r=1+e*(.5914293448864175+e*(.1381518657490833+e*(.016074608709367652+e*(.0009640118070051656+e*(27533547476472603e-21+e*(2.82243172016108e-7+e*(0+0*e)))))))):(t=9905570997331033e-32+(e=1/e)*(e*(4.625961635228786e-9+e*(4.4969678992770644e-7+e*(14962478375834237e-21+e*(.00020938631748758808+e*(.001056288621524929+e*(-.016743100507663373*e-.0011295143874558028))))))-2811287356288318e-29),r=0+e*(0+e*(2.82243172016108e-7+e*(27533547476472603e-21+e*(.0009640118070051656+e*(.016074608709367652+e*(.1381518657490833+e*(.5914293448864175+1*e)))))))),t/r)}),ic);return ac=function(c){var p,f,d;return e(c)?NaN:0===c?n:2===c?i:1===c?0:c>2||c<0?NaN:(c>1?(p=-1,f=2-c):(p=1,f=c),(c=1-f)<=.5?p*(.08913147449493408*(d=c*(c+10))+d*o(c)):f>=.25?p*((d=t(-2*r(f)))/(2.249481201171875+a(f-=.25))):(f=t(-r(f)))<3?p*(.807220458984375*f+s(f-1.125)*f):f<6?p*(.9399557113647461*f+l(f-3)*f):p*(.9836282730102539*f+u(f-6)*f))},ac}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function By(){if(dc)return fc;dc=1;var e=function(){if(pc)return cc;pc=1;var e=py();return cc=function(t){return e(t)===t},cc}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return fc=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Xy(){if(yc)return gc;yc=1;var e=function(){if(mc)return hc;mc=1;var e=Rg();return hc=function(t){return 0===t&&1/t===e},hc}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return gc=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Wy(){if(wc)return vc;wc=1;return vc=2.5066282746310007}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Yy(){if(xc)return Nc;xc=1;var e=function(){if(bc)return _c;bc=1;var e=By();return _c=function(t){return e(t/2)},_c}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Nc=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Ky(){if($c)return Ac;$c=1;var e=function(){if(Sc)return Ec;Sc=1;var e=Yy();return Ec=function(t){return e(t>0?t-1:t+1)},Ec}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Ac=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Zy(){if(Pc)return kc;Pc=1;var e=Bg(),t=Yg(),r=function(){if(Mc)return Tc;Mc=1;var e=ny();return Tc=!0===e?0:1}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),n=new t(1),i=new e(n.buffer);return kc=function(e,t){return n[0]=e,i[r]=t>>>0,n[0]},kc}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Jy(){if(Dc)return Ic;Dc=1;var e=Zy();return Ic=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Qy(){if(Cc)return Oc;Cc=1;var e=(Lc||(Lc=1,Rc=function(e){return 0|e}),Rc);return Oc=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_pow.c}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
  *
  * Developed at SunPro, a Sun Microsystems, Inc. business.
  * Permission to use, copy, modify, and distribute this
  * software is freely granted, provided that this notice
  * is preserved.
  * ```
  */function ev(){if(Xc)return Bc;Xc=1;var e=oy(),t=Jy(),r=sy(),n=ly(),i=(Hc||(Hc=1,Gc=function(e){return 0===e?.5999999999999946:.5999999999999946+e*(.4285714285785502+e*(.33333332981837743+e*(.272728123808534+e*(.23066074577556175+.20697501780033842*e))))}),Gc),o=1048576,a=[1,1.5],s=[0,.5849624872207642],l=[0,1.350039202129749e-8];return Bc=function(u,c,p){var f,d,h,m,g,y,v,w,_,b,N,x,E,S,A,$,T,M,k,P;return M=0,p<o&&(M-=53,p=e(c*=9007199254740992)),M+=(p>>20)-n|0,p=1072693248|(k=1048575&p),k<=235662?P=0:k<767610?P=1:(P=0,M+=1,p-=o),f=524288+(p>>1|536870912),g=(T=1/((c=r(c,p))+(v=a[P])))*(($=c-v)-(m=t(d=$*T,0))*(y=r(0,f+=P<<18))-m*(c-(y-v))),A=(h=d*d)*h*i(h),y=t(y=3+(h=m*m)+(A+=g*(m+d)),0),E=(N=-7.028461650952758e-9*(_=t(_=($=m*y)+(T=g*y+(A-(y-3-h))*d),0))+.9617966939259756*(T-(_-$))+l[P])-((x=t(x=(b=.9617967009544373*_)+N+(w=s[P])+(S=M),0))-S-w-b),u[0]=x,u[1]=E,u},Bc}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2024 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function tv(){if(Zc)return Kc;Zc=1;var e=Jy(),t=(Yc||(Yc=1,Wc=function(e){return 0===e?.5:.5+e*(.25*e-.3333333333333333)}),Wc);return Kc=function(r,n){var i,o,a,s,l;return i=(l=1.9259629911266175e-8*(a=n-1)-1.4426950408889634*(a*a*t(a)))-((o=e(o=(s=1.4426950216293335*a)+l,0))-s),r[0]=o,r[1]=i,r}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function rv(){if(Qc)return Jc;Qc=1;return Jc=.6931471805599453}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2024 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function nv(){if(np)return rp;np=1;var e=oy(),t=sy(),r=Jy(),n=Qy(),i=Py(),o=rv(),a=ly(),s=yy(),l=wy(),u=(tp||(tp=1,ep=function(e){return 0===e?.16666666666666602:.16666666666666602+e*(e*(6613756321437934e-20+e*(4.1381367970572385e-8*e-16533902205465252e-22))-.0027777777777015593)}),ep),c=1048576;return rp=function(p,f,d){var h,m,g,y,v,w,_,b,N;return N=((b=p&s)>>20)-a|0,_=0,b>1071644672&&(m=t(0,((_=p+(c>>N+1)>>>0)&~(l>>(N=((_&s)>>20)-a|0)))>>>0),_=(_&l|c)>>20-N>>>0,p<0&&(_=-_),f-=m),v=(y=(d-((m=r(m=d+f,0))-f))*o+-1.904654299957768e-9*m)-((w=(g=.6931471824645996*m)+y)-g),h=w-(m=w*w)*u(m),p=e(w=1-(w*h/(h-2)-(v+w*v)-w)),p=n(p),w=(p+=_<<20>>>0)>>20<=0?i(w,_):t(w,p)},rp}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_pow.c}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
  *
  * Developed at SunPro, a Sun Microsystems, Inc. business.
  * Permission to use, copy, modify, and distribute this
  * software is freely granted, provided that this notice
  * is preserved.
  * ```
  */function iv(){if(op)return ip;op=1;var e=Ei(),t=Ky(),r=Lg(),n=By(),i=Gy(),o=Og(),a=Ey(),s=Jy(),l=Qy(),u=Rg(),c=Ai(),p=yy(),f=function(){if(jc)return Vc;jc=1;var e=Ky(),t=Ay(),r=Rg(),n=Ai();return Vc=function(i,o){return o===r?n:o===n?0:o>0?e(o)?i:0:e(o)?t(n,i):n},Vc}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_pow.c}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
  *
  * Developed at SunPro, a Sun Microsystems, Inc. business.
  * Permission to use, copy, modify, and distribute this
  * software is freely granted, provided that this notice
  * is preserved.
  * ```
  */(),d=function(){if(Uc)return Fc;Uc=1;var e=yy(),t=oy();return Fc=function(r,n){return(t(r)&e)<=1072693247?n<0?1/0:0:n>0?1/0:0},Fc}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),h=function(){if(qc)return zc;qc=1;var e=Og(),t=Ai();return zc=function(r,n){return-1===r?(r-r)/(r-r):1===r?1:e(r)<1==(n===t)?0:t},zc}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2024 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),m=ev(),g=tv(),y=nv(),v=1083179008,w=1e300,_=1e-300,b=[0,0],N=[0,0];return ip=function x(E,S){var A,$,T,M,k,P,I,D,R,L,O,C,V,j;if(e(E)||e(S))return NaN;if(a.assign(S,b,1,0),k=b[0],0===b[1]){if(0===S)return 1;if(1===S)return E;if(-1===S)return 1/E;if(.5===S)return i(E);if(-.5===S)return 1/i(E);if(2===S)return E*E;if(3===S)return E*E*E;if(4===S)return(E*=E)*E;if(r(S))return h(E,S)}if(a.assign(E,b,1,0),M=b[0],0===b[1]){if(0===M)return f(E,S);if(1===E)return 1;if(-1===E&&t(S))return-1;if(r(E))return E===u?x(-0,-S):S<0?0:c}if(E<0&&!1===n(S))return(E-E)/(E-E);if(T=o(E),A=M&p,$=k&p,I=k>>>31|0,P=(P=M>>>31|0)&&t(S)?-1:1,$>1105199104){if($>1139802112)return d(E,S);if(A<1072693247)return 1===I?P*w*w:P*_*_;if(A>1072693248)return 0===I?P*w*w:P*_*_;O=g(N,T)}else O=m(N,T,A);if(C=(L=(S-(D=s(S,0)))*O[0]+S*O[1])+(R=D*O[0]),a.assign(C,b,1,0),V=l(b[0]),j=l(b[1]),V>=v){if(V-v|j)return P*w*w;if(L+8008566259537294e-32>C-R)return P*w*w}else if((V&p)>=1083231232){if(V-3230714880|j)return P*_*_;if(L<=C-R)return P*_*_}return P*(C=y(V,R,L))},ip}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function ov(){if(sp)return ap;sp=1;var e=iv();return ap=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function av(){if(pp)return cp;pp=1;var e=Py(),t=(up||(up=1,lp=function(e){return 0===e?.16666666666666602:.16666666666666602+e*(e*(6613756321437934e-20+e*(4.1381367970572385e-8*e-16533902205465252e-22))-.0027777777777015593)}),lp);return cp=function(r,n,i){var o,a,s;return s=(o=r-n)-(a=o*o)*t(a),e(1-(n-o*s/(2-s)-r),i)},cp}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The following copyrights, licenses, and long comment were part of the original implementation available as part of [Go]{@link https://github.com/golang/go/blob/cb07765045aed5104a3df31507564ac99e6ddce8/src/math/exp.go}, which in turn was based on an implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/e_exp.c}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright (c) 2009 The Go Authors. All rights reserved.
  *
  * Redistribution and use in source and binary forms, with or without
  * modification, are permitted provided that the following conditions are
  * met:
  *
  *    * Redistributions of source code must retain the above copyright
  * notice, this list of conditions and the following disclaimer.
  *    * Redistributions in binary form must reproduce the above
  * copyright notice, this list of conditions and the following disclaimer
  * in the documentation and/or other materials provided with the
  * distribution.
  *    * Neither the name of Google Inc. nor the names of its
  * contributors may be used to endorse or promote products derived from
  * this software without specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
  * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
  * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
  * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
  * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
  * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
  * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
  * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  * ```
  *
  * ```text
  * Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
  *
  * Developed at SunPro, a Sun Microsystems, Inc. business.
  * Permission to use, copy, modify, and distribute this
  * software is freely granted, provided that this notice
  * is preserved.
  * ```
  */function sv(){if(mp)return hp;mp=1;var e=function(){if(dp)return fp;dp=1;var e=Ei(),t=dy(),r=Rg(),n=Ai(),i=av(),o=1.4426950408889634,a=1/(1<<28),s=-a;return fp=function(l){var u;return e(l)||l===n?l:l===r?0:l>709.782712893384?n:l<-745.1332191019411?0:l>s&&l<a?1+l:(u=t(l<0?o*l-.5:o*l+.5),i(l-.6931471803691238*u,1.9082149292705877e-10*u,u))},fp}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return hp=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2024 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function lv(){if(wp)return vp;wp=1;var e=Wy(),t=ov(),r=sv(),n=(yp||(yp=1,gp=function(e){return 0===e?.08333333333334822:.08333333333334822+e*(.0034722222160545866+e*(e*(.0007873113957930937*e-.00022954996161337813)-.0026813261780578124))}),gp);return vp=function(i){var o,a,s;return o=1+(o=1/i)*n(o),a=r(i),a=i>143.01608?(s=t(i,.5*i-.25))*(s/a):t(i,i-.5)/a,e*a*o},vp}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function uv(){if(bp)return _p;bp=1;return _p=.5772156649015329}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The original C code, copyright, license, and constants are from [Cephes]{@link http://www.netlib.org/cephes}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright 1984, 1987, 1989, 1992, 2000 by Stephen L. Moshier
  *
  * Some software in this archive may be from the book _Methods and Programs for Mathematical Functions_ (Prentice-Hall or Simon & Schuster International, 1989) or from the Cephes Mathematical Library, a commercial product. In either event, it is copyrighted by the author. What you see here may be used freely but it comes with no support or guarantee.
  *
  * Stephen L. Moshier
  * moshier@na-net.ornl.gov
  * ```
  */function cv(){if($p)return Ap;$p=1;var e=Ei(),t=By(),r=Xy(),n=Og(),i=py(),o=jy(),a=Ai(),s=Rg(),l=Fy(),u=lv(),c=function(){if(xp)return Np;xp=1;var e=uv();return Np=function(t,r){return r/((1+e*t)*t)},Np}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2024 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),p=(Sp||(Sp=1,Ep=function(e){var t,r;return 0===e?1:((e<0?-e:e)<=1?(t=1+e*(.4942148268014971+e*(.20744822764843598+e*(.04763678004571372+e*(.010421379756176158+e*(.0011913514700658638+e*(.00016011952247675185+0*e)))))),r=1+e*(.0714304917030273+e*(e*(.035823639860549865+e*(.011813978522206043+e*(e*(.0005396055804933034+-23158187332412014e-21*e)-.004456419138517973)))-.23459179571824335))):(t=0+(e=1/e)*(.00016011952247675185+e*(.0011913514700658638+e*(.010421379756176158+e*(.04763678004571372+e*(.20744822764843598+e*(.4942148268014971+1*e)))))),r=e*(.0005396055804933034+e*(e*(.011813978522206043+e*(.035823639860549865+e*(e*(.0714304917030273+1*e)-.23459179571824335)))-.004456419138517973))-23158187332412014e-21),t/r)}),Ep);return Ap=function(f){var d,h,m,g;if(t(f)&&f<0||f===s||e(f))return NaN;if(0===f)return r(f)?s:a;if(f>171.61447887182297)return a;if(f<-170.5674972726612)return 0;if((h=n(f))>33)return f>=0?u(f):(d=1&(m=i(h))?1:-1,(g=h-m)>.5&&(g=h-(m+=1)),g=h*o(l*g),d*l/(n(g)*u(h)));for(g=1;f>=3;)g*=f-=1;for(;f<0;){if(f>-1e-9)return c(f,g);g/=f,f+=1}for(;f<2;){if(f<1e-9)return c(f,g);g/=f,f+=1}return 2===f?g:g*p(f-=2)},Ap}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function pv(){if(Mp)return Tp;Mp=1;var e=cv();return Tp=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function fv(){if(Dp)return Ip;Dp=1;var e=function(){if(Pp)return kp;Pp=1;var e=Xy(),t=Ei(),r=Rg();return kp=function(n,i){return t(n)||t(i)?NaN:n===r||i===r?r:n===i&&0===n?e(n)?n:i:n<i?n:i},kp}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Ip=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function dv(){if(Lp)return Rp;Lp=1;return Rp=34028234663852886e22}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function hv(){if(Cp)return Op;Cp=1;return Op=6.283185307179586}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function mv(){if(qp)return zp;qp=1;return zp=709.782712893384}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The original C++ code and copyright notice are from the [Boost library]{@link http://www.boost.org/doc/libs/1_37_0/boost/math/special_functions/gamma.hpp}. The implementation has been modified for JavaScript.
  *
  * ```text
  * (C) Copyright John Maddock 2006.
  * (C) Copyright Paul A. Bristow 2007.
  *
  * Use, modification and distribution are subject to the
  * Boost Software License, Version 1.0. (See accompanying file
  * LICENSE or copy at http://www.boost.org/LICENSE_1_0.txt)
  * ```
  */function gv(){if(cf)return uf;cf=1;var e=Ei(),t=sv(),r=Jy(),n=Ai(),i=Rg(),o=(Xp||(Xp=1,Bp=function(e){return 0===e?-.3250421072470015:e*(e*(-23763016656650163e-21*e-.005770270296489442)-.02848174957559851)-.3250421072470015}),Bp),a=(Yp||(Yp=1,Wp=function(e){return 0===e?.39791722395915535:.39791722395915535+e*(.0650222499887673+e*(.005081306281875766+e*(.00013249473800432164+-3960228278775368e-21*e)))}),Wp),s=(Zp||(Zp=1,Kp=function(e){return 0===e?.41485611868374833:.41485611868374833+e*(e*(.31834661990116175+e*(e*(.035478304325618236+-.002166375594868791*e)-.11089469428239668))-.3722078760357013)}),Kp),l=(Qp||(Qp=1,Jp=function(e){return 0===e?.10642088040084423:.10642088040084423+e*(.540397917702171+e*(.07182865441419627+e*(.12617121980876164+e*(.01363708391202905+.011984499846799107*e))))}),Jp),u=(tf||(tf=1,ef=function(e){return 0===e?-.6938585727071818:e*(e*(e*(e*(e*(-9.814329344169145*e-81.2874355063066)-184.60509290671104)-162.39666946257347)-62.375332450326006)-10.558626225323291)-.6938585727071818}),ef),c=(nf||(nf=1,rf=function(e){return 0===e?19.651271667439257:19.651271667439257+e*(137.65775414351904+e*(434.56587747522923+e*(645.3872717332679+e*(429.00814002756783+e*(108.63500554177944+e*(6.570249770319282+-.0604244152148581*e))))))}),rf),p=(af||(af=1,of=function(e){return 0===e?-.799283237680523:e*(e*(e*(e*(-483.5191916086514*e-1025.0951316110772)-637.5664433683896)-160.63638485582192)-17.757954917754752)-.799283237680523}),of),f=(lf||(lf=1,sf=function(e){return 0===e?30.33806074348246:30.33806074348246+e*(325.7925129965739+e*(1536.729586084437+e*(3199.8582195085955+e*(2553.0504064331644+e*(474.52854120695537+-22.44095244658582*e)))))}),sf),d=.8450629115104675;return uf=function(h){var m,g,y,v,w,_,b,N;if(e(h))return NaN;if(h===n)return 0;if(h===i)return 2;if(0===h)return 1;if(h<0?(m=!0,g=-h):(m=!1,g=h),g<.84375)return g<13877787807814457e-33?1-h:(_=(v=.12837916709551256+(y=h*h)*o(y))/(w=1+y*a(y)),h<.25?1-(h+h*_):(v=h*_,.5-(v+=h-.5)));if(g<1.25)return b=(w=g-1)*s(w)-.0023621185607526594,N=1+w*l(w),m?1+d+b/N:1-d-b/N;if(g<28){if(w=1/(g*g),g<2.857142857142857)v=w*u(w)-.009864944034847148,w=1+w*c(w);else{if(h<-6)return 2;v=w*p(w)-.0098649429247001,w=1+w*f(w)}return y=r(g,0),v=t(-y*y-.5625)*t((y-g)*(y+g)+v/w),m?2-v/g:v/g}return m?2:0},uf}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function yv(){if(ff)return pf;ff=1;var e=gv();return pf=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The original C++ code and copyright notice are from the [Boost library]{@link http://www.boost.org/doc/libs/1_37_0/boost/math/special_functions/gamma.hpp}. The implementation has been modified for JavaScript.
  *
  * ```text
  * (C) Copyright John Maddock 2006.
  * (C) Copyright Paul A. Bristow 2007.
  *
  * Use, modification and distribution are subject to the
  * Boost Software License, Version 1.0. (See accompanying file
  * LICENSE or copy at http://www.boost.org/LICENSE_1_0.txt)
  * ```
  */function vv(){if(gf)return mf;gf=1;return mf=-708.3964185322641}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The original C++ code and copyright notice are from the [Boost library]{@link http://www.boost.org/doc/libs/1_37_0/boost/math/special_functions/gamma.hpp}. The implementation has been modified for JavaScript.
  *
  * ```text
  * (C) Copyright John Maddock 2006.
  * (C) Copyright Paul A. Bristow 2007.
  *
  * Use, modification and distribution are subject to the
  * Boost Software License, Version 1.0. (See accompanying file
  * LICENSE or copy at http://www.boost.org/LICENSE_1_0.txt)
  * ```
  */function wv(){if(_f)return wf;_f=1;return wf=2220446049250313e-31}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function _v(){if(Ef)return xf;Ef=1;var e=function(){if(Nf)return bf;Nf=1;var e=eval;return bf=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return xf=function(){var t;try{e('"use strict"; (function* () {})'),t=!0}catch(e){t=!1}return t}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function bv(){if(Af)return Sf;Af=1;var e=_v();return Sf=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Nv(){if(If)return Pf;If=1;var e,t=bv(),r=function(){if(Tf)return $f;Tf=1;var e=Og(),t=wv();return $f=function(r,n){var i,o,a,s,l;if(l={},arguments.length>1&&(l=n),i=l.tolerance||t,a=l.maxTerms||1e6,s=l.initialValue||0,!0==("function"==typeof r.next)){for(o of r)if(e(i*(s+=o))>=e(o)||0==--a)break}else do{s+=o=r()}while(e(i*s)<e(o)&&--a);return s},$f}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),n=function(){if(kf)return Mf;kf=1;var e=Og(),t=wv();return Mf=function(r,n){var i,o,a,s,l;l={},arguments.length>1&&(l=n),i=l.tolerance||t,a=l.maxTerms||1e6,s=l.initialValue||0;do{s+=o=r()}while(e(i*s)<e(o)&&--a);return s},Mf}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return e=t()?r:n,Pf=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2023 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The original C++ code and copyright notice are from the [Boost library]{@link https://www.boost.org/doc/libs/1_83_0/boost/math/special_functions/log1p.hpp}. The implementation has been modified for JavaScript.
  *
  * ```text
  * (C) Copyright John Maddock 2005-2006.
  *
  * Use, modification and distribution are subject to the
  * Boost Software License, Version 1.0. (See accompanying file
  * LICENSE or copy at http://www.boost.org/LICENSE_1_0.txt)
  */function xv(){if(Of)return Lf;Of=1;var e=Og(),t=cy(),r=wv(),n=Nv(),i=(Rf||(Rf=1,Df=function(e){var t=-e,r=-1,n=0;return function(){return(r*=t)/(n+=1)}}),Df);return Lf=function(o){var a,s;return o<=-1?NaN:(s=e(o))>.95?t(1+o)-o:s<r?-o*o/2:(a={initialValue:-o},n(i(o),a))},Lf}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2023 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Ev(){if(id)return nd;id=1;var e=Ig(),t=function(){if(Vf)return Cf;Vf=1;var e=xv();return Cf=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),r=yv(),n=Gy(),i=sv(),o=hv(),a=(Ff||(Ff=1,jf=function(e){return 0===e?-.3333333333333333:e*(.08333333333333333+e*(e*(.0011574074074074073+e*(.0003527336860670194+e*(e*(3919263178522438e-20+e*(e*(e*(8.296711340953087e-7+e*(e*(6.707853543401498e-9+e*(1.0261809784240309e-8+e*(9.14769958223679e-10*e-4.382036018453353e-9)))-1.7665952736826078e-7))-185406221071516e-20)-21854485106799924e-22))-.0001787551440329218)))-.014814814814814815))-.3333333333333333}),jf),s=(zf||(zf=1,Uf=function(e){return 0===e?-.001851851851851852:e*(e*(.0026455026455026454+e*(e*(.00020576131687242798+e*(e*(e*(764916091608111e-20+e*(e*(4.647127802807434e-9+e*(1.378633446915721e-7+e*(1.1951628599778148e-8*e-5.752545603517705e-8)))-16120900894563446e-22))-18098550334489977e-21)-4.018775720164609e-7))-.0009902263374485596))-.003472222222222222)-.001851851851851852}),Uf),l=(Gf||(Gf=1,qf=function(e){return 0===e?.004133597883597883:.004133597883597883+e*(e*(.0007716049382716049+e*(20093878600823047e-22+e*(e*(52923448829120125e-21+e*(e*(3.423578734096138e-8+e*(13721957309062932e-22+e*(1.4280614206064242e-7*e-6.298992138380055e-7)))-12760635188618728e-21))-.00010736653226365161)))-.0026813271604938273)}),qf),u=(Bf||(Bf=1,Hf=function(e){return 0===e?.0006494341563786008:.0006494341563786008+e*(.00022947209362139917+e*(e*(.00026772063206283885+e*(e*(e*(11082654115347302e-21+e*(14230900732435883e-22*e-56749528269915965e-22))-2.396505113867297e-7)-7561801671883977e-20))-.0004691894943952557))}),Hf),c=(Wf||(Wf=1,Xf=function(e){return 0===e?-.0008618882909167117:e*(.0007840392217200666+e*(e*(e*(6641498215465122e-20+e*(11375726970678419e-21*e-3968365047179435e-20))-14638452578843418e-22)-.0002990724803031902))-.0008618882909167117}),Xf),p=(Kf||(Kf=1,Yf=function(e){return 0===e?-.00033679855336635813:e*(e*(.0002772753244959392+e*(e*(6797780477937208e-20+e*(1.419062920643967e-7+e*(e*(8018470256334202e-21+-2291481176508095e-21*e)-13594048189768693e-21)))-.00019932570516188847))-6972813758365858e-20)-.00033679855336635813}),Yf),f=(Jf||(Jf=1,Zf=function(e){return 0===e?.0005313079364639922:.0005313079364639922+e*(e*(.0002708782096718045+e*(7.902353232660328e-7+e*(e*(561168275310625e-19+-18329116582843375e-21*e)-8153969367561969e-20)))-.0005921664373536939)}),Zf),d=(ed||(ed=1,Qf=function(e){return 0===e?.00034436760689237765:.00034436760689237765+e*(5171790908260592e-20+e*(e*(.0002812695154763237+-.00010976582244684731*e)-.00033493161081142234))}),Qf),h=(rd||(rd=1,td=function(e){return 0===e?-.0006526239185953094:e*(.0008394987206720873+-.000438297098541721*e)-.0006526239185953094}),td),m=[0,0,0,0,0,0,0,0,0,0];return nd=function(g,y){var v,w,_,b;return _=g*(w=-t((y-g)/g)),b=n(2*w),y<g&&(b=-b),m[0]=a(b),m[1]=s(b),m[2]=l(b),m[3]=u(b),m[4]=c(b),m[5]=p(b),m[6]=f(b),m[7]=d(b),m[8]=h(b),m[9]=-.0005967612901927463,v=e(m,1/g),v*=i(-_)/n(o*g),y<g&&(v=-v),v+=r(n(_))/2},nd}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The original C++ code and copyright notice are from the [Boost library]{@link http://www.boost.org/doc/libs/1_37_0/boost/math/special_functions/gamma.hpp}. The implementation has been modified for JavaScript.
  *
  * ```text
  * (C) Copyright John Maddock 2006.
  * (C) Copyright Paul A. Bristow 2007.
  *
  * Use, modification and distribution are subject to the
  * Boost Software License, Version 1.0. (See accompanying file
  * LICENSE or copy at http://www.boost.org/LICENSE_1_0.txt)
  * ```
  */function Sv(){if(ld)return sd;ld=1;var e=Nv(),t=(ad||(ad=1,od=function(e,t){var r=1,n=e,i=t;return function(){var e=r;return r*=i/(n+=1),e}}),od);return sd=function(r,n,i){var o;return i=i||0,o=t(r,n),e(o,{initialValue:i})},sd}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Av(){if(fd)return pd;fd=1;var e=(cd||(cd=1,ud=function(e){var t,r;return 0===e?1/0:((e<0?-e:e)<=1?(t=709811.662581658+e*(679979.8474157227+e*(293136.7857211597+e*(74887.54032914672+e*(12555.290582413863+e*(1443.4299244417066+e*(115.24194596137347+e*(6.309239205732627+e*(.22668404630224365+e*(.004826466289237662+4624429436045379e-20*e))))))))),r=0+e*(362880+e*(1026576+e*(1172700+e*(723680+e*(269325+e*(63273+e*(9450+e*(870+e*(45+1*e)))))))))):(t=4624429436045379e-20+(e=1/e)*(.004826466289237662+e*(.22668404630224365+e*(6.309239205732627+e*(115.24194596137347+e*(1443.4299244417066+e*(12555.290582413863+e*(74887.54032914672+e*(293136.7857211597+e*(679979.8474157227+709811.662581658*e))))))))),r=1+e*(45+e*(870+e*(9450+e*(63273+e*(269325+e*(723680+e*(1172700+e*(1026576+e*(362880+0*e)))))))))),t/r)}),ud);return pd=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function $v(){if(vd)return yd;vd=1;var e=Ei(),t=oy(),r=sy(),n=Ai(),i=Rg(),o=ly(),a=(gd||(gd=1,md=function(e){return 0===e?.6666666666666735:.6666666666666735+e*(.3999999999940942+e*(.2857142874366239+e*(.22222198432149784+e*(.1818357216161805+e*(.15313837699209373+.14798198605116586*e)))))}),md),s=.6931471803691238,l=1.9082149292705877e-10;return yd=function(u){var c,p,f,d,h,m,g,y,v,w;if(u<-1||e(u))return NaN;if(-1===u)return i;if(u===n)return u;if(0===u)return u;if(w=1,(f=u<0?-u:u)<.41421356237309503){if(f<1.862645149230957e-9)return f<5551115123125783e-32?u:u-u*u*.5;u>-.2928932188134525&&(w=0,d=u,p=1)}return 0!==w&&(f<9007199254740992?(h=(w=((p=t(v=1+u))>>20)-o)>0?1-(v-u):u-(v-1),h/=v):(w=((p=t(v=u))>>20)-o,h=0),(p&=1048575)<434334?v=r(v,1072693248|p):(w+=1,v=r(v,1071644672|p),p=1048576-p>>2),d=v-1),c=.5*d*d,0===p?0===d?w*s+(h+=w*l):w*s-((y=c*(1-.6666666666666666*d))-(w*l+h)-d):(y=(g=(m=d/(2+d))*m)*a(g),0===w?d-(c-m*(c+y)):w*s-(c-(m*(c+y)+(w*l+h))-d))},yd}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Tv(){if(_d)return wd;_d=1;var e=$v();return wd=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Mv(){if(Ed)return xd;Ed=1;var e=function(){if(Nd)return bd;Nd=1;var e=Ai();return bd=function(t){return 0===t&&1/t===e},bd}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return xd=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function kv(){if(Td)return $d;Td=1;var e=function(){if(Ad)return Sd;Ad=1;var e=Mv(),t=Ei(),r=Ai();return Sd=function(n,i){return t(n)||t(i)?NaN:n===r||i===r?r:n===i&&0===n?e(n)?n:i:n>i?n:i},Sd}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return $d=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Pv(){if(Rd)return Dd;Rd=1;var e=function(){if(hd)return dd;hd=1;var e=Av();return dd=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),t=qy(),r=pv(),n=Tv(),i=Gy(),o=Og(),a=sv(),s=ov(),l=kv(),u=fv(),c=cy(),p=mv(),f=vv(),d=kd?Md:(kd=1,Md=10.900511),h=Id?Pd:(Id=1,Pd=2.718281828459045);return Dd=function(m,g){var y,v,w,_,b,N,x;return x=(g-m-d+.5)/(w=m+d-.5),m<1?g<=f?a(m*c(g)-g-t(m)):s(g,m)*a(-g)/r(m):(o(x*x*m)<=100&&m>150?(y=m*(n(x)-x)+g*(.5-d)/w,y=a(y)):(_=m*c(g/w),u(_,b=m-g)<=f||l(_,b)>=p?(v=b/m,u(_,b)/2>f&&l(_,b)/2<p?y=(N=s(g/w,m/2)*a(b/2))*N:u(_,b)/4>f&&l(_,b)/4<p&&g>m?(y=(N=s(g/w,m/4)*a(b/4))*N,y*=y):y=v>f&&v<p?s(g*a(v)/w,m):a(_+b)):y=s(g/w,m)*a(b)),y*=i(w/h)/e(m))},Dd}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Iv(){if(Fd)return jd;Fd=1;var e=Ei(),t=oy(),r=sy(),n=Ny(),i=Ai(),o=Rg(),a=ly(),s=Od?Ld:(Od=1,Ld=.34657359027997264),l=(Vd||(Vd=1,Cd=function(e){return 0===e?-.03333333333333313:e*(.0015873015872548146+e*(e*(4008217827329362e-21+-2.0109921818362437e-7*e)-793650757867488e-19))-.03333333333333313}),Cd),u=.6931471803691238,c=1.9082149292705877e-10,p=1.4426950408889634;return jd=function(f){var d,h,m,g,y,v,w,_,b,N,x,E,S;if(f===i||e(f))return f;if(f===o)return-1;if(0===f)return f;if(f<0?(m=!0,_=-f):(m=!1,_=f),_>=38.816242111356935){if(m)return-1;if(_>=709.782712893384)return i}if(v=0|t(_),_>s)_<1.0397207708399179?m?(g=f+u,y=-c,S=-1):(g=f-u,y=c,S=1):(S=m?p*f-.5:p*f+.5,g=f-(x=S|=0)*u,y=x*c),N=g-(f=g-y)-y;else{if(v<1016070144)return f;S=0}return E=(b=f*(d=.5*f))*(((w=1+b*l(b))-(x=3-w*d))/(6-f*x)),0===S?f-(f*E-b):(h=n(a+S<<20,0),E=f*(E-N)-N,E-=b,-1===S?.5*(f-E)-.5:1===S?f<-.25?-2*(E-(f+.5)):1+2*(f-E):S<=-2||S>56?(_=1-(E-f),1024===S?(g=t(_)+(S<<20)|0,_=r(_,g)):_*=h,_-1):(x=1,S<20?_=(x=r(x,g=1072693248-(2097152>>S)|0))-(E-f):(_=f-(E+(x=r(x,g=a-S<<20))),_+=1),_*=h))},jd}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Dv(){if(zd)return Ud;zd=1;var e=Iv();return Ud=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The original C++ code and copyright notice are from the [Boost library]{@link http://www.boost.org/doc/libs/1_85_0/boost/math/special_functions/powm1.hpp}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * (C) Copyright John Maddock 2006.
  *
  * Use, modification and distribution are subject to the
  * Boost Software License, Version 1.0. (See accompanying file
  * LICENSE or copy at http://www.boost.org/LICENSE_1_0.txt)
  * ```
  */function Rv(){if(Bd)return Hd;Bd=1;var e=function(){if(Gd)return qd;Gd=1;var e=Ei(),t=Lg(),r=Og(),n=Dv(),i=cy(),o=ov(),a=dy();return qd=function(s,l){var u,c;if(e(s)||e(l))return NaN;if(0===l)return 0;if(0===s)return-1;if(s<0&&l%2==0&&(s=-s),s>0){if((r(l*(s-1))<.5||r(l)<.2)&&(c=i(s)*l)<.5)return n(c)}else if(a(l)!==l)return NaN;return u=o(s,l)-1,t(u)||e(u)?NaN:u},qd}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Hd=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Lv(){if(Kd)return Yd;Kd=1;var e=function(){if(Wd)return Xd;Wd=1;var e=Yy();return Xd=function(t){return e(t>0?t-1:t+1)},Xd}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return Yd=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_pow.c}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
  *
  * Developed at SunPro, a Sun Microsystems, Inc. business.
  * Permission to use, copy, modify, and distribute this
  * software is freely granted, provided that this notice
  * is preserved.
  * ```
  */function Ov(){if(ah)return oh;ah=1;var e=oy(),t=Jy(),r=sy(),n=ly(),i=(ih||(ih=1,nh=function(e){return 0===e?.5999999999999946:.5999999999999946+e*(.4285714285785502+e*(.33333332981837743+e*(.272728123808534+e*(.23066074577556175+.20697501780033842*e))))}),nh),o=1048576,a=[1,1.5],s=[0,.5849624872207642],l=[0,1.350039202129749e-8];return oh=function(u,c,p){var f,d,h,m,g,y,v,w,_,b,N,x,E,S,A,$,T,M,k,P;return M=0,p<o&&(M-=53,p=e(c*=9007199254740992)),M+=(p>>20)-n|0,p=1072693248|(k=1048575&p),k<=235662?P=0:k<767610?P=1:(P=0,M+=1,p-=o),f=524288+(p>>1|536870912),g=(T=1/((c=r(c,p))+(v=a[P])))*(($=c-v)-(m=t(d=$*T,0))*(y=r(0,f+=P<<18))-m*(c-(y-v))),A=(h=d*d)*h*i(h),y=t(y=3+(h=m*m)+(A+=g*(m+d)),0),E=(N=-7.028461650952758e-9*(_=t(_=($=m*y)+(T=g*y+(A-(y-3-h))*d),0))+.9617966939259756*(T-(_-$))+l[P])-((x=t(x=(b=.9617967009544373*_)+N+(w=s[P])+(S=M),0))-S-w-b),u[0]=x,u[1]=E,u},oh}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Cv(){if(ch)return uh;ch=1;var e=Jy(),t=(lh||(lh=1,sh=function(e){return 0===e?.5:.5+e*(.25*e-.3333333333333333)}),sh);return uh=function(r,n){var i,o,a,s,l;return i=(l=1.9259629911266175e-8*(a=n-1)-1.4426950408889634*(a*a*t(a)))-((o=e(o=(s=1.4426950216293335*a)+l,0))-s),r[0]=o,r[1]=i,r}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Vv(){if(hh)return dh;hh=1;var e=oy(),t=sy(),r=Jy(),n=Qy(),i=Py(),o=rv(),a=ly(),s=yy(),l=wy(),u=(fh||(fh=1,ph=function(e){return 0===e?.16666666666666602:.16666666666666602+e*(e*(6613756321437934e-20+e*(4.1381367970572385e-8*e-16533902205465252e-22))-.0027777777777015593)}),ph),c=1048576;return dh=function(p,f,d){var h,m,g,y,v,w,_,b,N;return N=((b=p&s)>>20)-a|0,_=0,b>1071644672&&(m=t(0,((_=p+(c>>N+1)>>>0)&~(l>>(N=((_&s)>>20)-a|0)))>>>0),_=(_&l|c)>>20-N>>>0,p<0&&(_=-_),f-=m),v=(y=(d-((m=r(m=d+f,0))-f))*o+-1.904654299957768e-9*m)-((w=(g=.6931471824645996*m)+y)-g),h=w-(m=w*w)*u(m),p=e(w=1-(w*h/(h-2)-(v+w*v)-w)),p=n(p),w=(p+=_<<20>>>0)>>20<=0?i(w,_):t(w,p)},dh}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_pow.c}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
  *
  * Developed at SunPro, a Sun Microsystems, Inc. business.
  * Permission to use, copy, modify, and distribute this
  * software is freely granted, provided that this notice
  * is preserved.
  * ```
  */function jv(){if(gh)return mh;gh=1;var e=Ei(),t=Lv(),r=Lg(),n=By(),i=Gy(),o=Og(),a=Ey(),s=Jy(),l=Qy(),u=Rg(),c=Ai(),p=yy(),f=function(){if(Jd)return Zd;Jd=1;var e=Lv(),t=Ay(),r=Rg(),n=Ai();return Zd=function(i,o){return o===r?n:o===n?0:o>0?e(o)?i:0:e(o)?t(n,i):n},Zd}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_pow.c}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
  *
  * Developed at SunPro, a Sun Microsystems, Inc. business.
  * Permission to use, copy, modify, and distribute this
  * software is freely granted, provided that this notice
  * is preserved.
  * ```
  */(),d=function(){if(eh)return Qd;eh=1;var e=yy(),t=oy();return Qd=function(r,n){return(t(r)&e)<=1072693247?n<0?1/0:0:n>0?1/0:0},Qd}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),h=function(){if(rh)return th;rh=1;var e=Og(),t=Ai();return th=function(r,n){return-1===r?(r-r)/(r-r):1===r?1:e(r)<1==(n===t)?0:t},th}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),m=Ov(),g=Cv(),y=Vv(),v=1083179008,w=1e300,_=1e-300,b=[0,0],N=[0,0];return mh=function x(E,S){var A,$,T,M,k,P,I,D,R,L,O,C,V,j;if(e(E)||e(S))return NaN;if(a.assign(S,b,1,0),k=b[0],0===b[1]){if(0===S)return 1;if(1===S)return E;if(-1===S)return 1/E;if(.5===S)return i(E);if(-.5===S)return 1/i(E);if(2===S)return E*E;if(3===S)return E*E*E;if(4===S)return(E*=E)*E;if(r(S))return h(E,S)}if(a.assign(E,b,1,0),M=b[0],0===b[1]){if(0===M)return f(E,S);if(1===E)return 1;if(-1===E&&t(S))return-1;if(r(E))return E===u?x(-0,-S):S<0?0:c}if(E<0&&!1===n(S))return(E-E)/(E-E);if(T=o(E),A=M&p,$=k&p,I=k>>>31|0,P=(P=M>>>31|0)&&t(S)?-1:1,$>1105199104){if($>1139802112)return d(E,S);if(A<1072693247)return 1===I?P*w*w:P*_*_;if(A>1072693248)return 0===I?P*w*w:P*_*_;O=g(N,T)}else O=m(N,T,A);if(C=(L=(S-(D=s(S,0)))*O[0]+S*O[1])+(R=D*O[0]),a.assign(C,b,1,0),V=l(b[0]),j=l(b[1]),V>=v){if(V-v|j)return P*w*w;if(L+8008566259537294e-32>C-R)return P*w*w}else if((V&p)>=1083231232){if(V-3230714880|j)return P*_*_;if(L<=C-R)return P*_*_}return P*(C=y(V,R,L))},mh}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Fv(){if(Nh)return bh;Nh=1;var e=Wy(),t=function(){if(vh)return yh;vh=1;var e=jv();return yh=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),r=sv(),n=(_h||(_h=1,wh=function(e){return 0===e?.08333333333334822:.08333333333334822+e*(.0034722222160545866+e*(e*(.0007873113957930937*e-.00022954996161337813)-.0026813261780578124))}),wh);return bh=function(i){var o,a,s;return o=1+(o=1/i)*n(o),a=r(i),a=i>143.01608?(s=t(i,.5*i-.25))*(s/a):t(i,i-.5)/a,e*a*o},bh}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The original C code, copyright, license, and constants are from [Cephes]{@link http://www.netlib.org/cephes}. The implementation follows the original, but has been modified for JavaScript.
  *
  * ```text
  * Copyright 1984, 1987, 1989, 1992, 2000 by Stephen L. Moshier
  *
  * Some software in this archive may be from the book _Methods and Programs for Mathematical Functions_ (Prentice-Hall or Simon & Schuster International, 1989) or from the Cephes Mathematical Library, a commercial product. In either event, it is copyrighted by the author. What you see here may be used freely but it comes with no support or guarantee.
  *
  * Stephen L. Moshier
  * moshier@na-net.ornl.gov
  * ```
  */function Uv(){if(Th)return $h;Th=1;var e=Ei(),t=By(),r=Xy(),n=Og(),i=py(),o=jy(),a=Ai(),s=Rg(),l=Fy(),u=Fv(),c=function(){if(Eh)return xh;Eh=1;var e=uv();return xh=function(t,r){return r/((1+e*t)*t)},xh}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),p=(Ah||(Ah=1,Sh=function(e){var t,r;return 0===e?1:((e<0?-e:e)<=1?(t=1+e*(.4942148268014971+e*(.20744822764843598+e*(.04763678004571372+e*(.010421379756176158+e*(.0011913514700658638+e*(.00016011952247675185+0*e)))))),r=1+e*(.0714304917030273+e*(e*(.035823639860549865+e*(.011813978522206043+e*(e*(.0005396055804933034+-23158187332412014e-21*e)-.004456419138517973)))-.23459179571824335))):(t=0+(e=1/e)*(.00016011952247675185+e*(.0011913514700658638+e*(.010421379756176158+e*(.04763678004571372+e*(.20744822764843598+e*(.4942148268014971+1*e)))))),r=e*(.0005396055804933034+e*(e*(.011813978522206043+e*(.035823639860549865+e*(e*(.0714304917030273+1*e)-.23459179571824335)))-.004456419138517973))-23158187332412014e-21),t/r)}),Sh);return $h=function(f){var d,h,m,g;if(t(f)&&f<0||f===s||e(f))return NaN;if(0===f)return r(f)?s:a;if(f>171.61447887182297)return a;if(f<-170.5674972726612)return 0;if((h=n(f))>33)return f>=0?u(f):(d=1&(m=i(h))?1:-1,(g=h-m)>.5&&(g=h-(m+=1)),g=h*o(l*g),d*l/(n(g)*u(h)));for(g=1;f>=3;)g*=f-=1;for(;f<0;){if(f>-1e-9)return c(f,g);g/=f,f+=1}for(;f<2;){if(f<1e-9)return c(f,g);g/=f,f+=1}return 2===f?g:g*p(f-=2)},$h}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function zv(){if(Vh)return Ch;Vh=1;var e=cy(),t=wv(),r=(Ih||(Ih=1,Ph=function(e){var t,r;return 0===e?-.01803556856784494:((e<0?-e:e)<=1?(t=e*(.02512664961998968+e*(.049410315156753225+e*(.0172491608709614+e*(e*(e*(0*e-3245886498259485e-20)-.0005410098692152044)-.0002594535632054381))))-.01803556856784494,r=1+e*(1.962029871977952+e*(1.4801966942423133+e*(.5413914320717209+e*(.09885042511280101+e*(.008213096746488934+e*(.00022493629192211576+-2.2335276320861708e-7*e))))))):(t=0+(e=1/e)*(e*(e*(e*(.0172491608709614+e*(.049410315156753225+e*(.02512664961998968+-.01803556856784494*e)))-.0002594535632054381)-.0005410098692152044)-3245886498259485e-20),r=e*(.00022493629192211576+e*(.008213096746488934+e*(.09885042511280101+e*(.5413914320717209+e*(1.4801966942423133+e*(1.962029871977952+1*e))))))-2.2335276320861708e-7),t/r)}),Ph),n=(Rh||(Rh=1,Dh=function(e){var t,r;return 0===e?.04906224540690395:((e<0?-e:e)<=1?(t=.04906224540690395+e*(e*(e*(e*(e*(-.0010034668769627955*e-.024014982064857155)-.1584135863906922)-.4065671242119384)-.4149833583594954)-.09691175301595212),r=1+e*(3.0234982984646304+e*(3.4873958536072385+e*(1.9141558827442668+e*(.5071377386143635+e*(.05770397226904519+.001957681026011072*e)))))):(t=(e=1/e)*(e*(e*(e*(e*(.04906224540690395*e-.09691175301595212)-.4149833583594954)-.4065671242119384)-.1584135863906922)-.024014982064857155)-.0010034668769627955,r=.001957681026011072+e*(.05770397226904519+e*(.5071377386143635+e*(1.9141558827442668+e*(3.4873958536072385+e*(3.0234982984646304+1*e)))))),t/r)}),Dh),i=(Oh||(Oh=1,Lh=function(e){var t,r;return 0===e?-.029232972183027003:((e<0?-e:e)<=1?(t=e*(.14421626775719232+e*(e*(.05428096940550536+e*(e*(.0004311713426792973+0*e)-.008505359768683364))-.14244039073863127))-.029232972183027003,r=1+e*(e*(.846973248876495+e*(e*(.02558279715597587+e*(-8.271935218912905e-7*e-.0010066679553914337))-.22009515181499575))-1.5016935605448505)):(t=0+(e=1/e)*(.0004311713426792973+e*(e*(.05428096940550536+e*(e*(.14421626775719232+-.029232972183027003*e)-.14244039073863127))-.008505359768683364)),r=e*(e*(.02558279715597587+e*(e*(.846973248876495+e*(1*e-1.5016935605448505))-.22009515181499575))-.0010066679553914337)-8.271935218912905e-7),t/r)}),Lh);return Ch=function(o,a,s){var l,u,c;if(o<t)return-e(o);if(0===a||0===s)return 0;if(u=0,o>2){if(o>=3){do{s-=1,u+=e(o-=1)}while(o>=3);s=o-2}return u+=.15896368026733398*(c=s*(o+1))+c*r(s)}return o<1&&(u+=-e(o),s=a,a=o,o+=1),u+=o<=1.5?.5281534194946289*(l=a*s)+l*(c=n(a)):.45201730728149414*(c=s*a)+c*i(-s)}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The original C++ code and copyright notice are from the [Boost library]{@link http://www.boost.org/doc/libs/1_64_0/boost/math/special_functions/gamma.hpp}. The implementation has been modified for JavaScript.
  *
  * ```text
  * (C) Copyright John Maddock 2006-7, 2013-14.
  * (C) Copyright Paul A. Bristow 2007, 2013-14.
  * (C) Copyright Nikhar Agrawal 2013-14.
  * (C) Copyright Christopher Kormanyos 2013-14.
  *
  * Use, modification and distribution are subject to the
  * Boost Software License, Version 1.0. (See accompanying file
  * LICENSE or copy at http://www.boost.org/LICENSE_1_0.txt)
  * ```
  */function qv(){if(Fh)return jh;Fh=1;var e=function(){if(kh)return Mh;kh=1;var e=Uv();return Mh=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),t=Dv(),r=Tv(),n=Ei(),i=zv();return jh=function(o){return n(o)?NaN:o<0?o<-.5?e(1+o)-1:t(-r(o)+i(o+2,o+1,o)):o<2?t(i(o+1,o,o-1)):e(1+o)-1},jh}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Gv(){if(Bh)return Hh;Bh=1;var e=Rv(),t=Nv(),r=function(){if(zh)return Uh;zh=1;var e=qv();return Uh=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The original C++ code and copyright notice are from the [Boost library]{@link http://www.boost.org/doc/libs/1_37_0/boost/math/special_functions/gamma.hpp}. The implementation has been modified for JavaScript.
  *
  * ```text
  * (C) Copyright John Maddock 2006.
  * (C) Copyright Paul A. Bristow 2007.
  *
  * Use, modification and distribution are subject to the
  * Boost Software License, Version 1.0. (See accompanying file
  * LICENSE or copy at http://www.boost.org/LICENSE_1_0.txt)
  * ```
  */(),n=(Gh||(Gh=1,qh=function(e,t){var r,n,i,o;return r=-t,t=-t,n=e+1,i=1,function(){return o=r/n,r*=t,r/=i+=1,n+=1,o}}),qh);return Hh=function(i,o,a){var s,l,u,c;return l=((s=r(i))+1)/i,s-=u=e(o,i),s/=i,c=n(i,o),s=-(u+=1)*t(c,{initialValue:((a?l:0)-s)/u}),a&&(s=-s),[s,l]},Hh}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Hv(){if(Wh)return Xh;Wh=1;var e=Og(),t=Si(),r=wv();return Xh=function(n,i){var o,a,s;return a={},arguments.length>1&&(a=i),o=a.maxIter||1e6,s=a.tolerance||r,a.keep?function(r,n,i){var o,a,s,l,u,c;if(0===(s=(c=(o="function"==typeof r.next)?r.next().value:r())[1])&&(s=t),l=s,u=0,!0===o)do{(c=r.next().value)&&(0===(u=c[1]+c[0]*u)&&(u=t),0===(l=c[1]+c[0]/l)&&(l=t),s*=a=l*(u=1/u))}while(c&&e(a-1)>n&&--i);else do{(c=r())&&(0===(u=c[1]+c[0]*u)&&(u=t),0===(l=c[1]+c[0]/l)&&(l=t),s*=a=l*(u=1/u))}while(c&&e(a-1)>n&&--i);return s}(n,s,o):function(r,n,i){var o,a,s,l,u,c,p;if(l=(p=(o="function"==typeof r.next)?r.next().value:r())[1],s=p[0],0===l&&(l=t),u=l,c=0,!0===o)do{(p=r.next().value)&&(0===(c=p[1]+p[0]*c)&&(c=t),0===(u=p[1]+p[0]/u)&&(u=t),l*=a=u*(c=1/c))}while(e(a-1)>n&&--i);else do{(p=r())&&(0===(c=p[1]+p[0]*c)&&(c=t),0===(u=p[1]+p[0]/u)&&(u=t),l*=a=u*(c=1/c))}while(p&&e(a-1)>n&&--i);return s/l}(n,s,o)},Xh}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Bv(){if(Kh)return Yh;Kh=1;var e=Og(),t=wv(),r=Si();return Yh=function(n,i){var o,a,s;return a={},arguments.length>1&&(a=i),s=a.tolerance||t,o=a.maxIter||1e6,a.keep?function(t,n,i){var o,a,s,l,u;0===(l=(u=t())[1])&&(l=r),a=l,s=0;do{(u=t())&&(0===(s=u[1]+u[0]*s)&&(s=r),0===(a=u[1]+u[0]/a)&&(a=r),l*=o=a*(s=1/s))}while(u&&e(o-1)>n&&--i);return l}(n,s,o):function(t,n,i){var o,a,s,l,u,c;u=(c=t())[1],a=c[0],0===u&&(u=r),s=u,l=0;do{(c=t())&&(0===(l=c[1]+c[0]*l)&&(l=r),0===(s=c[1]+c[0]/s)&&(s=r),u*=o=s*(l=1/l))}while(c&&e(o-1)>n&&--i);return a/u}(n,s,o)},Yh}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Xv(){if(rm)return tm;rm=1;var e=function(){if(Jh)return Zh;Jh=1;var e,t=bv(),r=Hv(),n=Bv();return e=t()?r:n,Zh=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The original C++ code and copyright notice are from the [Boost library]{@link http://www.boost.org/doc/libs/1_37_0/boost/math/special_functions/gamma.hpp}. The implementation has been modified for JavaScript.
  *
  * ```text
  * (C) Copyright John Maddock 2006.
  * (C) Copyright Paul A. Bristow 2007.
  *
  * Use, modification and distribution are subject to the
  * Boost Software License, Version 1.0. (See accompanying file
  * LICENSE or copy at http://www.boost.org/LICENSE_1_0.txt)
  * ```
  */(),t=(em||(em=1,Qh=function(e,t){var r=t-e+1,n=e,i=0;return function(){return[(i+=1)*(n-i),r+=2]}}),Qh);return tm=function(r,n){var i=t(r,n);return 1/(n-r+1+e(i))},tm}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  *
  * ## Notice
  *
  * The original C++ code and copyright notice are from the [Boost library]{@link http://www.boost.org/doc/libs/1_62_0/boost/math/special_functions/gamma.hpp}. The implementation has been modified for JavaScript.
  *
  * ```text
  * (C) Copyright John Maddock 2006-7, 2013-14.
  * (C) Copyright Paul A. Bristow 2007, 2013-14.
  * (C) Copyright Nikhar Agrawal 2013-14.
  * (C) Christopher Kormanyos 2013-14.
  *
  * Use, modification and distribution are subject to the
  * Boost Software License, Version 1.0. (See accompanying file
  * LICENSE or copy at http://www.boost.org/LICENSE_1_0.txt)
  * ```
  */function Wv(){if(im)return nm;im=1;var e=qy(),t=py(),r=pv(),n=Og(),i=sv(),o=ov(),a=cy(),s=jp?Vp:(jp=1,Vp=1.4901161193847656e-8),l=Up?Fp:(Up=1,Fp=17976931348623157e292),u=Wy(),c=mv(),p=Ai(),f=function(){if(Hp)return Gp;Hp=1;var e=sv();return Gp=function(t,r){var n,i,o;if(0!==(i=e(-r)))for(n=i,o=1;o<t;++o)n/=o,i+=n*=r;return i},Gp}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),d=function(){if(hf)return df;hf=1;var e=yv(),t=Gy(),r=sv(),n=Fy();return df=function(i,o){var a,s,l,u;if(0!==(l=e(t(o)))&&i>1){for(a=r(-o)/t(n*o),a*=o,s=a/=.5,u=2;u<i;++u)a/=u-.5,s+=a*=o;l+=s}return l},df}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),h=function(){if(vf)return yf;vf=1;var e=sv(),t=ov(),r=cy(),n=mv(),i=vv();return yf=function(o,a){var s;return s=o*r(a),a>=1?s<n&&-a>i?t(a,o)*e(-a):o>=1?t(a/e(a/o),o):e(s-a):s>i?t(a,o)*e(-a):a/o<n?t(a/e(a/o),o):e(s-a)},yf}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),m=Ev(),g=Sv(),y=Pv(),v=Gv(),w=Xv();return nm=function _(b,N,x,E){var S,A,$,T,M,k,P,I,D,R,L,O,C;if(b<0||N<=0)return NaN;if(A=void 0===x||x,P=E,I=0,N>=170&&!A)return P&&4*N<b?(I=N*a(b)-b,I+=a(w(N,b))):!P&&N>4*b?(I=N*a(b)-b,I+=a(g(N,b,T=0)/N)):0===(I=_(N,b,!0,P))?P?(I=a(I=1+1/(12*N)+1/(288*N*N))-N+(N-.5)*a(N),I+=a(u)):(I=N*a(b)-b,I+=a(g(N,b,T=0)/N)):I=a(I)+e(N),I>c?p:i(I);switch(N<30&&N<=b+1&&b<c?M=!(D=(O=t(N))===N)&&.5===n(O-N):D=M=!1,D&&b>.6?(P=!P,$=0):M&&b>.2?(P=!P,$=1):b<s&&N>1?$=6:b<.5?$=-.4/a(b)<N?2:3:b<1.1?$=.75*b<N?2:3:(k=!1,A&&N>20&&(R=n((b-N)/N),N>200?20/N>R*R&&(k=!0):R<.4&&(k=!0)),k?$=5:b-1/(3*b)<N?$=2:($=4,P=!P)),$){case 0:I=f(N,b),!1===A&&(I*=r(N));break;case 1:I=d(N,b),!1===A&&(I*=r(N));break;case 2:0!==(I=A?y(N,b):h(N,b))&&(T=0,S=!1,P&&(T=A?1:r(N),A||I>=1||l*I>T?(T/=I,A||N<1||l/N>T?(T*=-N,S=!0):T=0):T=0)),I*=g(N,b,T)/N,S&&(P=!1,I=-I);break;case 3:I=(L=v(N,b,P=!P))[0],C=L[1],P=!1,A&&(I/=C);break;case 4:0!==(I=A?y(N,b):h(N,b))&&(I*=w(N,b));break;case 5:I=m(N,b),b>=N&&(P=!P);break;case 6:I=A?o(b,N)/r(N+1):o(b,N)/N,I*=1-N*b/(N+1)}return A&&I>1&&(I=1),P&&(I=(A?1:r(N))-I),I},nm}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Yv(){if(lm)return sm;lm=1;var e=Mg(),t=function(){if(am)return om;am=1;var e=Wv();return om=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),r=Og(),n=sv(),i=cy(),o=dv(),a=e("gammaincinv:higher_newton");return sm=function(e,s,l,u,c,p,f,d){var h,m,g,y,v,w,_,b,N;N=e,w=1,_=1,y=s*s,m=e;do{if(v=(N=e)*N,0===l){if((h=(1-s)*i(N)+N+p)>i(o))return a("Warning: overflow problems in one or more steps of the computation. The initial approximation to the root is returned."),m;b=n(h)}else b=-f*N;b=d?-b*(t(N,s,!0,!1)-u):b*(t(N,s,!0,!0)-c),u>1e-120||_>1?(g=(2*v-4*N*s+4*N+2*y-3*s+1)/v,e=N+b*(1+b*(.5*(N-s+1)/N+b*(g/=6)))):e=N+b,w=r(N/e-1),_+=1,(N=e)<0&&(N=m,_=100)}while(w>2e-14&&_<35);return(w>2e-14||_>99)&&a("Warning: the number of iterations in the Newton method reached the upper limit N=35. The last value obtained for the root is given as output."),N||0},sm}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Kv(){if(hm)return dm;hm=1;var e=Og(),t=sv(),r=cy(),n=Ig(),i=(cm||(cm=1,um=function(e){return 0===e?0:0+e*(1+e*(1+e*(1.5+e*(2.6666666666666665+e*(5.208333333333333+10.8*e)))))}),um),o=(fm||(fm=1,pm=function(e){return 0===e?1:1+e*(1+e*(.3333333333333333+e*(.027777777777777776+e*(e*(.0002314814814814815+5878894767783657e-20*e)-.003703703703703704))))}),pm),a=[1,0,0,0,0,0];return dm=function(s){var l,u,c,p,f,d,h,m,g;if(g=s*s*.5,0===s?f=0:s<-1?(m=t(-1-g),f=i(m)):s<1?f=o(m=s):(f=(m=11+g)+(d=r(m)),m=1/m,p=(c=(u=(l=d*d)*d)*d)*d,a[1]=.5*(2-d),a[2]=(-9*d+6+2*l)/6,a[3]=.08333333333333333*-(3*u+36*d-22*l-12),a[4]=(60+350*l-300*d-125*u+12*c)/60,a[5]=.008333333333333333*-(-120-274*c+900*d-1700*l+1125*u+20*p),f+=d*m*n(a,m)),m=1,s>-3.5&&s<-.03||s>.03&&s<40){m=1,h=f;do{f=h*(g+r(h))/(h-1),m=e(h/f-1),h=f}while(m>1e-8)}return f},dm}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Zv(){if(Em)return xm;Em=1;var e=qy(),t=cy(),r=gm?mm:(gm=1,mm=.9189385332046728),n=Si(),i=dv(),o=function(){if(vm)return ym;vm=1;var e=[1.9963790515900766,-.0017971032528832887,13129285796384672e-21,-2.340875228178749e-7,7.2291210671127e-9,-3.280997607821e-10,19875070901e-21,-1509214183e-21,1375340084e-22,-145728923e-22,17532367e-22,-2351465e-22,346551e-22,-55471e-22,9548e-22,-1748e-22,3.32e-20,-58e-22];return ym=function(t,r){var n,i,o,a,s;i=0,o=0,n=r+r,s=t;do{a=o,i=n*(o=i)-a+e[s],s-=1}while(s>=0);return(i-a)/2},ym}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),a=(_m||(_m=1,wm=function(e){return 0===e?.025721014990011306:.025721014990011306+e*(.08247596616699963+e*(e*(.0006099292666946337+e*(.000250505279903*e-.00033543297638406))-.0025328157302663564))}),wm),s=(Nm||(Nm=1,bm=function(e){return 0===e?.08333333333333333:.08333333333333333+e*(e*(.0007936507936507937+-.0005952380952380953*e)-.002777777777777778)}),bm);return xm=function(l){var u;return l<n?i:l<1?e(l+1)-(l+.5)*t(l)+l-r:l<2?e(l)-(l-.5)*t(l)+l-r:l<3?e(l-1)-(l-.5)*t(l)+l-r+t(l-1):l<12?o(17,u=18/(l*l)-1)/(12*l):(u=1/(l*l),l<1e3?a(u)/(.30865217988013566+u)/l:s(u)/l)},xm}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Jv(){if(km)return Mm;km=1;var e=Og(),t=cy(),r=Kv(),n=(Tm||(Tm=1,$m=function(e){var t,r;return 0===e?-.3333333333438:((e<0?-e:e)<=1?(t=e*(e*(e*(-4293658292782e-17*e-.004923635739372)-.05041806657154)-.2070740359969)-.3333333333438,r=1+e*(.7045554412463+e*(.2118190062224+e*(.03048648397436+.001605037988091*e)))):(t=(e=1/e)*(e*(e*(-.3333333333438*e-.2070740359969)-.05041806657154)-.004923635739372)-4293658292782e-17,r=.001605037988091+e*(.03048648397436+e*(.2118190062224+e*(.7045554412463+1*e)))),t/r)}),$m);return Mm=function(i){var o;return e(i)<1?n(i):(o=r(i),t(i/(o-1))/i)}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Qv(){if(Vm)return Cm;Vm=1;var e=cy(),t=(Im||(Im=1,Pm=function(e){var t,r;return 0===e?-.0172847633523:((e<0?-e:e)<=1?(t=e*(e*(e*(-614830384279e-17*e-.00060683488776)-.00464910887221)-.0159372646475)-.0172847633523,r=1+e*(.764050615669+e*(.297143406325+e*(.0579490176079+.00574558524851*e)))):(t=(e=1/e)*(e*(e*(-.0172847633523*e-.0159372646475)-.00464910887221)-.00060683488776)-614830384279e-17,r=.00574558524851+e*(.0579490176079+e*(.297143406325+e*(.764050615669+1*e)))),t/r)}),Pm),r=(Rm||(Rm=1,Dm=function(e){var t,r;return 0===e?-.0172839517431:((e<0?-e:e)<=1?(t=e*(e*(e*(249634036069e-17*e-.000391032032692)-.00357406772616)-.0146362417966)-.0172839517431,r=1+e*(.690560400696+e*(.249962384741+e*(.0443843438769+.00424073217211*e)))):(t=249634036069e-17+(e=1/e)*(e*(e*(-.0172839517431*e-.0146362417966)-.00357406772616)-.000391032032692),r=.00424073217211+e*(.0443843438769+e*(.249962384741+e*(.690560400696+1*e)))),t/r)}),Dm),n=(Om||(Om=1,Lm=function(e){var t,r;return 0===e?.99994466948:((e<0?-e:e)<=1?(t=.99994466948+e*(104.649839762+e*(857.204033806+e*(731.901559577+45.5174411671*e))),r=1+e*(104.526456943+e*(823.313447808+e*(3119.93802124+3970.03311219*e)))):(t=45.5174411671+(e=1/e)*(731.901559577+e*(857.204033806+e*(104.649839762+.99994466948*e))),r=3970.03311219+e*(3119.93802124+e*(823.313447808+e*(104.526456943+1*e)))),t/r)}),Lm);return Cm=function(i){var o,a;return i<-5?(12-(a=i*i)-(o=e(-i))*o*6)/(12*a*i):i<-2?t(i):i<2?r(i):i<1e3?(a=1/i,n(i)/(-12*i)):-1/(12*i)},Cm}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function ew(){if(Km)return Ym;Km=1;var e=cy(),t=(Fm||(Fm=1,jm=function(e){var t,r;return 0===e?.0495346498136:((e<0?-e:e)<=1?(t=.0495346498136+e*(.0299521337141+e*(.00688296911516+e*(.000512634846317+-201411722031e-16*e))),r=1+e*(.759803615283+e*(.261547111595+e*(.0464854522477+.00403751193496*e)))):(t=(e=1/e)*(.000512634846317+e*(.00688296911516+e*(.0299521337141+.0495346498136*e)))-201411722031e-16,r=.00403751193496+e*(.0464854522477+e*(.261547111595+e*(.759803615283+1*e)))),t/r)}),jm),r=(zm||(zm=1,Um=function(e){var t,r;return 0===e?.00452313583942:((e<0?-e:e)<=1?(t=.00452313583942+e*(.00120744920113+e*(e*(-535770949796e-17*e-504476066942e-16)-789724156582e-16)),r=1+e*(.912203410349+e*(.405368773071+e*(.0901638932349+.00948935714996*e)))):(t=(e=1/e)*(e*(e*(.00120744920113+.00452313583942*e)-789724156582e-16)-504476066942e-16)-535770949796e-17,r=.00948935714996+e*(.0901638932349+e*(.405368773071+e*(.912203410349+1*e)))),t/r)}),Um),n=(Gm||(Gm=1,qm=function(e){var t,r;return 0===e?.00439937562904:((e<0?-e:e)<=1?(t=.00439937562904+e*(.000487225670639+e*(e*(529110969589e-17+1.5716677175e-7*e)-.000128470657374)),r=1+e*(.794435257415+e*(.333094721709+e*(.0703527806143+.00806110846078*e)))):(t=1.5716677175e-7+(e=1/e)*(529110969589e-17+e*(e*(.000487225670639+.00439937562904*e)-.000128470657374)),r=.00806110846078+e*(.0703527806143+e*(.333094721709+e*(.794435257415+1*e)))),t/r)}),qm),i=(Bm||(Bm=1,Hm=function(e){var t,r;return 0===e?-.0011481191232:((e<0?-e:e)<=1?(t=e*(e*(1.51623048511+e*(.0730002451555*e-.218472031183))-.112850923276)-.0011481191232,r=1+e*(14.2482206905+e*(69.7360396285+e*(218.938950816+277.067027185*e)))):(t=.0730002451555+(e=1/e)*(e*(1.51623048511+e*(-.0011481191232*e-.112850923276))-.218472031183),r=277.067027185+e*(218.938950816+e*(69.7360396285+e*(14.2482206905+1*e)))),t/r)}),Hm),o=(Wm||(Wm=1,Xm=function(e){var t,r;return 0===e?-.000145727889667:((e<0?-e:e)<=1?(t=e*(e*(e*(199.722374056+-11.4311378756*e)-13.308504545)-.290806748131)-.000145727889667,r=1+e*(139.612587808+e*(2189.01116348+e*(7115.24019009+45574.6081453*e)))):(t=(e=1/e)*(199.722374056+e*(e*(-.000145727889667*e-.290806748131)-13.308504545))-11.4311378756,r=45574.6081453+e*(7115.24019009+e*(2189.01116348+e*(139.612587808+1*e)))),t/r)}),Xm);return Ym=function(a){var s,l;return a<-8?(s=a*a,(a*(l=e(-a)/a)*(6*s*l*l-12+s)-30)/(12*a*s*s)):a<-4?t(a)/(a*a):a<-2?r(a):a<2?n(a):a<10?i(s=1/a)/(a*a):a<100?o(s=1/a)/(a*a):-e(a)/(12*a*a*a)},Ym}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function tw(){if(Jm)return Zm;Jm=1;var e=Mg(),t=Ig(),r=qy(),n=function(){if(uc)return lc;uc=1;var e=Hy();return lc=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),i=pv(),o=Gy(),a=Og(),s=sv(),l=fv(),u=ov(),c=cy(),p=Wy(),f=dv(),d=hv(),h=Yv(),m=Kv(),g=function(){if(Am)return Sm;Am=1;var e=sv(),t=pv(),r=cy(),n=dv(),i=Wy(),o=Zv();return Sm=function(a){return a>=3?e(o(a)):a>0?t(a)/(e(-a+(a-.5)*r(a))*i):n},Sm}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),y=Jv(),v=Qv(),w=ew(),_=e("gammaincinv:compute"),b=.5,N=.3333333333333333,x=.16666666666666666,E=[0,0,0,0,0];return Zm=function(e,S,A){var $,T,M,k,P,I,D,R,L,O,C,V,j,F,U,z,q,G,H,B,X,W,Y,K,Z,J,Q,ee,te,re,ne,ie,oe,ae,se,le,ue,ce,pe,fe;if(S<b?(k=!0,P=S,ce=-1):(k=!1,P=A,ce=1),se=0,a(e-1)<1e-4&&(le=0,H=k?S<.001?S+(te=S*S)*b+(J=te*S)*N+.25*(ee=J*S)+.2*(G=ee*S)+G*S*x:-c(1-S):-c(A),1===e?(se=2,ne=H):(M=r(e),se=1)),A<1e-30&&e<b&&(le=0,H=-c(A*i(e))+(e-1)*c(-c(A*i(e))),se=1,M=r(e)),e>1&&e<500&&S<1e-80){for(le=0,I=1/e,$=1/(e+1),H=(r(e+1)+c(S))*I,j=H=s(H),ae=0;ae<10;ae++)H=j*s(H*I)*u(1-H*$,I);se=1,M=r(e)}if((D=1/e*(c(S)+r(e+1)))<c(.2*(1+e))&&0===se&&(ue=s(D),le=0,Q=(re=(B=e*e)*e)*e,O=(F=e+1)*(C=F*F),L=C*C,R=(U=e+2)*U,z=e+3,E[0]=1,E[1]=1/F,E[2]=b*(3*e+5)/(C*U),E[3]=N*(31+8*B+33*e)/(O*U*z),E[4]=.041666666666666664*(2888+1179*re+125*Q+3971*B+5661*e)/(L*R*z*(e+4)),H=ue*t(E,ue),M=r(e),se=1),e<10&&0===se&&(V=o(e)/(g(e)*p),A<l(.02,V)&&(le=0,Z=(K=(ie=1-e)*ie)*ie,q=o(-2/e*c(A/V)),H=e*m(q),oe=c(H),H>5?(Y=(W=(X=oe*oe)*oe)*oe,ue=1/H,E[0]=oe-1,E[1]=(3*ie-2*ie*oe+X-2*oe+2)*b,E[2]=(24*ie*oe-11*K-24*ie-6*X+12*oe-12-9*ie*X+6*K*oe+2*W)*x,E[3]=.08333333333333333*(-12*Z*oe+8.04*ie*X-114*K*oe+(72+36*X)+(3*Y-72*oe+162)*(ie-168*ie*oe)-(12*W+25*Z)-(22*ie*W+36*K*X+120*K)),E[4]=0,H=H-oe+ie*ue*t(E,ue)):(X=oe*oe,(pe=oe-ie*(ue=1/H)*(oe-1))<H&&(H-=pe)),M=r(e),se=1)),a(P-b)<1e-5&&0===se&&(le=0,H=e-N+(.019753086419753086+.007211444248481286*(I=1/e))*I,M=r(e),se=1),e<1&&0===se&&(le=0,H=s(k?1/e*(c(P)+r(e+1)):1/e*(c(1-P)+r(e+1))),M=r(e),se=1),0===se){if(le=1,I=1/e,q=ce*(ue=n(2*P))/o(e*b),!(ue<f))return _("Warning: Overflow problems in one or more steps of the computation."),NaN;q+=(y(q)+(v(q)+w(q)*I)*I)*I,H=e*m(q),fe=q,T=1/(-o(e/d)*s(-.5*e*fe*fe)/g(e))}return se<2&&(ne=h(H,e,le,S,A,M,T,k)),ne},Zm}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function rw(){if(rg)return tg;rg=1;var e=function(){if(eg)return Qm;eg=1;var e=Ei(),t=Si(),r=Ai(),n=tw();return Qm=function(i,o,a){return e(i)||e(o)||o<t||i>1||i<0?NaN:!0===a?0===i?r:1===i?0:n(o,1-i,i):0===i?0:1===i?r:n(o,i,1-i)},Qm}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return tg=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function nw(){if(lg)return sg;lg=1;var e=ag?og:(ag=1,og=function(e){return function(){return e}});return sg=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function iw(){if(hg)return dg;hg=1;var e=xi(),t=function(){if(cg)return ug;cg=1;var e=Ei();return ug=function(t,r){return e(t)||t<0||t>1?NaN:r}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return e(t,"factory",function(){if(fg)return pg;fg=1;var e=nw(),t=Ei();return pg=function(r){return t(r)?e(NaN):function(e){return t(e)||e<0||e>1?NaN:r}}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */()),dg=t}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function ow(){if(vg)return yg;vg=1;var e=xi(),t=function(){if(ig)return ng;ig=1;var e=Ei(),t=rw();return ng=function(r,n,i){return e(n)||e(i)||e(r)||n<0||i<=0||r<0||r>1?NaN:0===n?0:1/i*t(r,n)}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return e(t,"factory",function(){if(gg)return mg;gg=1;var e=nw(),t=rw(),r=iw().factory,n=Ei();return mg=function(i,o){return n(i)||n(o)||i<0||o<=0?e(NaN):0===i?r(0):function(e){return n(e)||e<0||e>1?NaN:1/o*t(e,i)}}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */()),yg=t}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */var aw,sw,lw,uw,cw,pw,fw,dw,hw,mw,gw,yw,vw=function(){if(Eg)return xg;Eg=1;var e=xi(),t=function(){if(_g)return wg;_g=1;var e=ow();return wg=function(t,r){return e(t,r/2,.5)},wg}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),r=function(){if(Ng)return bg;Ng=1;var e=ow().factory;return bg=function(t){return e(t/2,.5)},bg}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return e(t,"factory",r),xg=t}(),ww=wn(vw);function _w(){if(dw)return fw;dw=1;var e=xi(),t=function(){if(uw)return lw;uw=1;var e=Ei();return lw=function(t,r){return e(t)||e(r)?NaN:t<r?0:1},lw}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),r=function(){if(pw)return cw;pw=1;var e=nw(),t=Ei();return cw=function(r){return t(r)?e(NaN):function(e){return t(e)?NaN:e<r?0:1}},cw}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return e(t,"factory",r),fw=t}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */var bw,Nw,xw,Ew,Sw,Aw,$w,Tw,Mw,kw,Pw,Iw,Dw,Rw,Lw,Ow,Cw,Vw,jw,Fw,Uw=function(){if(yw)return gw;yw=1;var e=xi(),t=function(){if(sw)return aw;sw=1;var e=yv(),t=Gy(),r=Ei();return aw=function(n,i,o){var a;return r(n)||r(i)||r(o)||o<0?NaN:0===o?n<i?0:1:(a=o*t(2),.5*e(-(n-i)/a))},aw}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */(),r=function(){if(mw)return hw;mw=1;var e=nw(),t=_w().factory,r=Ei(),n=Gy(),i=yv();return hw=function(o,a){var s;return r(o)||r(a)||a<0?e(NaN):0===a?t(o):(s=a*n(2),function(e){return r(e)?NaN:.5*i(-(e-o)/s)})},hw}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return e(t,"factory",r),gw=t}(),zw=wn(Uw);function qw(){if(Iw)return Pw;Iw=1;var e=Ei(),t=Gy(),r=cy(),n=Ai(),i=Rg(),o=(Nw||(Nw=1,bw=function(e){var t,r;return 0===e?-.0005087819496582806:((e<0?-e:e)<=1?(t=e*(e*(.03348066254097446+e*(e*(e*(.02198786811111689+e*(.008226878746769157+e*(e*(0+0*e)-.005387729650712429)))-.03656379714117627)-.012692614766297404))-.008368748197417368)-.0005087819496582806,r=1+e*(e*(e*(1.5622155839842302+e*(.662328840472003+e*(e*(e*(.07952836873415717+e*(.0008862163904564247*e-.0023339375937419))-.05273963823400997)-.7122890234154284)))-1.5657455823417585)-.9700050433032906)):(t=0+(e=1/e)*(0+e*(e*(.008226878746769157+e*(.02198786811111689+e*(e*(e*(.03348066254097446+e*(-.0005087819496582806*e-.008368748197417368))-.012692614766297404)-.03656379714117627)))-.005387729650712429)),r=.0008862163904564247+e*(e*(.07952836873415717+e*(e*(e*(.662328840472003+e*(1.5622155839842302+e*(e*(1*e-.9700050433032906)-1.5657455823417585)))-.7122890234154284)-.05273963823400997))-.0023339375937419)),t/r)}),bw),a=(Ew||(Ew=1,xw=function(e){var t,r;return 0===e?-.20243350835593876:((e<0?-e:e)<=1?(t=e*(.10526468069939171+e*(8.3705032834312+e*(17.644729840837403+e*(e*(e*(17.445385985570866+e*(21.12946554483405+-3.6719225470772936*e))-44.6382324441787)-18.851064805871424))))-.20243350835593876,r=1+e*(6.242641248542475+e*(3.971343795334387+e*(e*(e*(48.560921310873994+e*(10.826866735546016+e*(1.7211476576120028*e-22.643693341313973)))-20.14326346804852)-28.66081804998)))):(t=(e=1/e)*(21.12946554483405+e*(17.445385985570866+e*(e*(e*(17.644729840837403+e*(8.3705032834312+e*(.10526468069939171+-.20243350835593876*e)))-18.851064805871424)-44.6382324441787)))-3.6719225470772936,r=1.7211476576120028+e*(e*(10.826866735546016+e*(48.560921310873994+e*(e*(e*(3.971343795334387+e*(6.242641248542475+1*e))-28.66081804998)-20.14326346804852)))-22.643693341313973)),t/r)}),xw),s=(Aw||(Aw=1,Sw=function(e){var t,r;return 0===e?-.1311027816799519:((e<0?-e:e)<=1?(t=e*(e*(.11703015634199525+e*(.38707973897260434+e*(.3377855389120359+e*(.14286953440815717+e*(.029015791000532906+e*(.0021455899538880526+e*(e*(2.8522533178221704e-8+-6.81149956853777e-10*e)-6.794655751811263e-7)))))))-.16379404719331705)-.1311027816799519,r=1+e*(3.4662540724256723+e*(5.381683457070069+e*(4.778465929458438+e*(2.5930192162362027+e*(.848854343457902+e*(.15226433829533179+e*(.011059242293464892+e*(0+e*(0+0*e)))))))))):(t=(e=1/e)*(2.8522533178221704e-8+e*(e*(.0021455899538880526+e*(.029015791000532906+e*(.14286953440815717+e*(.3377855389120359+e*(.38707973897260434+e*(.11703015634199525+e*(-.1311027816799519*e-.16379404719331705)))))))-6.794655751811263e-7))-6.81149956853777e-10,r=0+e*(0+e*(0+e*(.011059242293464892+e*(.15226433829533179+e*(.848854343457902+e*(2.5930192162362027+e*(4.778465929458438+e*(5.381683457070069+e*(3.4662540724256723+1*e)))))))))),t/r)}),Sw),l=(Tw||(Tw=1,$w=function(e){var t,r;return 0===e?-.0350353787183178:((e<0?-e:e)<=1?(t=e*(e*(.018557330651423107+e*(.009508047013259196+e*(.0018712349281955923+e*(.00015754461742496055+e*(460469890584318e-20+e*(26633922742578204e-28*e-2.304047769118826e-10))))))-.0022242652921344794)-.0350353787183178,r=1+e*(1.3653349817554064+e*(.7620591645536234+e*(.22009110576413124+e*(.03415891436709477+e*(.00263861676657016+e*(7646752923027944e-20+e*(0+0*e)))))))):(t=26633922742578204e-28+(e=1/e)*(e*(460469890584318e-20+e*(.00015754461742496055+e*(.0018712349281955923+e*(.009508047013259196+e*(.018557330651423107+e*(-.0350353787183178*e-.0022242652921344794))))))-2.304047769118826e-10),r=0+e*(0+e*(7646752923027944e-20+e*(.00263861676657016+e*(.03415891436709477+e*(.22009110576413124+e*(.7620591645536234+e*(1.3653349817554064+1*e)))))))),t/r)}),$w),u=(kw||(kw=1,Mw=function(e){var t,r;return 0===e?-.016743100507663373:((e<0?-e:e)<=1?(t=e*(e*(.001056288621524929+e*(.00020938631748758808+e*(14962478375834237e-21+e*(4.4969678992770644e-7+e*(4.625961635228786e-9+e*(9905570997331033e-32*e-2811287356288318e-29))))))-.0011295143874558028)-.016743100507663373,r=1+e*(.5914293448864175+e*(.1381518657490833+e*(.016074608709367652+e*(.0009640118070051656+e*(27533547476472603e-21+e*(2.82243172016108e-7+e*(0+0*e)))))))):(t=9905570997331033e-32+(e=1/e)*(e*(4.625961635228786e-9+e*(4.4969678992770644e-7+e*(14962478375834237e-21+e*(.00020938631748758808+e*(.001056288621524929+e*(-.016743100507663373*e-.0011295143874558028))))))-2811287356288318e-29),r=0+e*(0+e*(2.82243172016108e-7+e*(27533547476472603e-21+e*(.0009640118070051656+e*(.016074608709367652+e*(.1381518657490833+e*(.5914293448864175+1*e)))))))),t/r)}),Mw);return Pw=function(c){var p,f,d,h;return e(c)?NaN:1===c?n:-1===c?i:0===c?c:c>1||c<-1?NaN:(c<0?(p=-1,f=-c):(p=1,f=c),d=1-f,f<=.5?p*(.08913147449493408*(h=f*(f+10))+h*o(f)):d>=.25?p*((h=t(-2*r(d)))/(2.249481201171875+a(d-=.25))):(d=t(-r(d)))<3?p*(.807220458984375*d+s(d-1.125)*d):d<6?p*(.9399557113647461*d+l(d-3)*d):p*(.9836282730102539*d+u(d-6)*d))},Pw}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Gw(){if(Rw)return Dw;Rw=1;var e=qw();return Dw=e}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */function Hw(){if(Ow)return Lw;Ow=1;var e=Gw(),t=Ei(),r=Gy();return Lw=function(n,i,o){return t(i)||t(o)||t(n)||o<0||n<0||n>1?NaN:0===o?i:i+o*r(2)*e(2*n-1)}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */var Bw=function(){if(Fw)return jw;Fw=1;var e=xi(),t=Hw(),r=function(){if(Vw)return Cw;Vw=1;var e=nw(),t=iw().factory,r=Gw(),n=Ei(),i=Gy();return Cw=function(o,a){var s,l;return n(o)||n(a)||a<0?e(NaN):(0===a&&t(o),s=o,l=a*i(2),function(e){return n(e)||e<0||e>1?NaN:s+l*r(2*e-1)})}}
/**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */();return e(t,"factory",r),jw=t}(),Xw=wn(Bw);function Ww(e,t,r){let n=!0;return null!=t&&(n=n&&e>=t),null!=r&&(n=n&&e<=r),n}function Yw(e){return function(t,r){return Array.isArray(t)&&Array.isArray(r)?t.map(((t,n)=>e(t,r[n]))):Array.isArray(t)&&!Array.isArray(r)?t.map((t=>e(t,r))):!Array.isArray(t)&&Array.isArray(r)?r.map((r=>e(t,r))):e(t,r)}}const Kw=Yw(((e,t)=>e+t)),Zw=Yw(((e,t)=>e-t)),Jw=Yw(((e,t)=>e/t)),Qw=Yw(((e,t)=>e*t));function e_(e){return"none"==e?function(e){return e}:"ln"==e?function(e){return Math.log(e+1)}:"log10"==e?function(e){return Math.log10(e+1)}:"sqrt"==e?Math.sqrt:function(e){return e}}function t_(e,t,r,n,i,o){const a=i.funnel.chart_type,s=o.multiplier,l=i.funnel.transformation,u=e_(l),c=n.keys[e].label,p=n.numerators[e],f=n.denominators[e],d=t.filter((e=>e.denominators===f&&null!==e.ll99&&null!==e.ul99))[0],h=u(p/f*s),m=o.percentLabels?"%":"",g=o.percentLabels,y=i.funnel.sig_figs,v={PR:"Proportion",SR:"Standardised Ratio",RC:"Rate"},w=new Array;if(i.funnel.ttip_show_group&&w.push({displayName:i.funnel.ttip_label_group,value:c}),i.funnel.ttip_show_value){const e=i.funnel.ttip_label_value;w.push({displayName:"Automatic"===e?v[a]:e,value:h.toFixed(y)+m})}if(i.funnel.ttip_show_numerator&&null!=p&&w.push({displayName:i.funnel.ttip_label_numerator,value:p.toFixed(g?0:y)}),i.funnel.ttip_show_denominator&&null!=f&&w.push({displayName:i.funnel.ttip_label_denominator,value:f.toFixed(g?0:y)}),["68","95","99"].forEach((e=>{i.lines[`ttip_show_${e}`]&&i.lines[`show_${e}`]&&w.push({displayName:`Upper ${i.lines[`ttip_label_${e}`]}`,value:d[`ul${e}`].toFixed(y)+m})})),i.lines.show_target&&i.lines.ttip_show_target&&w.push({displayName:i.lines.ttip_label_target,value:d.target.toFixed(y)+m}),i.lines.show_alt_target&&i.lines.ttip_show_alt_target&&null!==d.alt_target&&void 0!==d.alt_target&&w.push({displayName:i.lines.ttip_label_alt_target,value:d.alt_target.toFixed(y)+m}),["68","95","99"].forEach((e=>{i.lines[`ttip_show_${e}`]&&i.lines[`show_${e}`]&&w.push({displayName:`Lower ${i.lines[`ttip_label_${e}`]}`,value:d[`ll${e}`].toFixed(y)+m})})),"none"!==l&&w.push({displayName:"Plot Scaling",value:l}),r.two_sigma||r.three_sigma){const e=new Array;r.three_sigma&&e.push("Three Sigma Outlier"),r.two_sigma&&e.push("Two Sigma Outlier"),w.push({displayName:"Pattern(s)",value:e.join("\n")})}return n.tooltips.length>0&&n.tooltips[e].forEach((e=>w.push(e))),w}function r_(e,t){return Array(t).fill(e)}function n_(e){return null==e}function i_(e,t,r){if(n_(e))return{values:null,validation:{status:0,messages:r_(new Array,1)}};if(n_(null==e?void 0:e.categories))return{values:null,validation:{status:0,messages:r_(new Array,1)}};const n=e.categories[0],i=Object.keys(r[t]),o=JSON.parse(JSON.stringify({status:0,messages:r_([],n.values.length)})),a=n.values.map(((e,r)=>{const a=n.objects?n.objects[r]:null;return Object.fromEntries(i.map((e=>{var n,i,s,l,u,c,p;const f=yn[t][e].default;let d=function(e,t,r,n){var i;const o=null===(i=null==e?void 0:e[t])||void 0===i?void 0:i[r];return n_(o)?n:(null==o?void 0:o.solid)?o.solid.color:o}(a,t,e,f);d=""===d?f:d;const h=null!==(i=null===(n=yn[t][e])||void 0===n?void 0:n.valid)&&void 0!==i?i:null===(s=yn[t][e])||void 0===s?void 0:s.options,m=!n_(null==h?void 0:h.minValue)||!n_(null==h?void 0:h.maxValue);if(h){let n="";h instanceof Array&&!h.includes(d)?n=`${d} is not a valid value for ${e}. Valid values are: ${h.join(", ")}`:m&&!Ww(d,null===(l=null==h?void 0:h.minValue)||void 0===l?void 0:l.value,null===(u=null==h?void 0:h.maxValue)||void 0===u?void 0:u.value)&&(n=`${d} is not a valid value for ${e}. Valid values are between ${null===(c=null==h?void 0:h.minValue)||void 0===c?void 0:c.value} and ${null===(p=null==h?void 0:h.maxValue)||void 0===p?void 0:p.value}`),""!==n&&(d=yn[t][e].default,o.messages[r].push(n))}return[e,d]})))})),s=o.messages.filter((e=>e.length>0));return o.messages.some((e=>0===e.length))||(o.status=1,o.error=`${s[0][0]}`),{values:a,validation:o}}const o_=Yw(((e,t)=>null==e?null:t.numeric?e.toString():e));function a_(e,t){var r,n,i,o;const a=e.values.filter((e=>{var r,n;return null===(n=null===(r=null==e?void 0:e.source)||void 0===r?void 0:r.roles)||void 0===n?void 0:n[t]}));return"key"===t?function(e){var t,r,n;const i=e.categories.filter((e=>{var t,r;return null===(r=null===(t=e.source)||void 0===t?void 0:t.roles)||void 0===r?void 0:r.key})),o=null===(t=null==i?void 0:i[0])||void 0===t?void 0:t.values,a=null===(n=null===(r=null==i?void 0:i[0])||void 0===r?void 0:r.source)||void 0===n?void 0:n.type;return o_(o,a)}(e):"tooltips"===t?function(e){var t,r;const n=e.values.filter((e=>e.source.roles.tooltips));return null===(r=null===(t=null==n?void 0:n[0])||void 0===t?void 0:t.values)||void 0===r?void 0:r.map(((e,t)=>n.map((e=>{var r;const n=o_(null===(r=null==e?void 0:e.values)||void 0===r?void 0:r[t],e.source.type);return{displayName:e.source.displayName,value:n}}))))}(e):"labels"===t?null===(n=null===(r=null==a?void 0:a[0])||void 0===r?void 0:r.values)||void 0===n?void 0:n.map((e=>n_(e)?null:String(e))):null===(o=null===(i=null==a?void 0:a[0])||void 0===i?void 0:i.values)||void 0===o?void 0:o.map((e=>n_(e)?null:Number(e)))}function s_(e,t){var r,n;const i=t.settings,o=a_(e,"numerators"),a=a_(e,"denominators"),s=a_(e,"key"),l=a_(e,"labels");let u=null===(r=i_(e,"scatter",i))||void 0===r?void 0:r.values;u=null===u?r_(i.scatter,o.length):u;let c=null===(n=i_(e,"labels",i))||void 0===n?void 0:n.values;c=null===c?r_(i.labels,o.length):c;const p=a_(e,"tooltips"),f=e.values[0].highlights,d=function(e,t,r,n){const i={status:0,messages:r_("",e.length)};if(e.forEach(((e,t)=>{i.messages[t]=""===i.messages[t]?null!=e?"":"Group missing":i.messages[t]})),!i.messages.some((e=>""==e)))return i.status=1,i.error="All Groups/IDs are missing or null!",i;if(t.forEach(((e,t)=>{i.messages[t]=""===i.messages[t]?null!=e?"":"Numerator missing":i.messages[t]})),!i.messages.some((e=>""==e)))return i.status=1,i.error="All numerators are missing or null!",i;if(t.forEach(((e,t)=>{i.messages[t]=""===i.messages[t]?isNaN(e)?"Numerator is not a number":"":i.messages[t]})),!i.messages.some((e=>""==e)))return i.status=1,i.error="All numerators are not numbers!",i;if(t.forEach(((e,t)=>{i.messages[t]=""===i.messages[t]?e>=0?"":"Numerator negative":i.messages[t]})),!i.messages.some((e=>""==e)))return i.status=1,i.error="All numerators are negative!",i;if(r.forEach(((e,t)=>{i.messages[t]=""===i.messages[t]?null!=e?"":"Denominator missing":i.messages[t]})),!i.messages.some((e=>""==e)))return i.status=1,i.error="All denominators missing or null!",i;if(r.forEach(((e,t)=>{i.messages[t]=""===i.messages[t]?isNaN(e)?"Denominator is not a number":"":i.messages[t]})),!i.messages.some((e=>""==e)))return i.status=1,i.error="All denominators are not numbers!",i;if(r.forEach(((e,t)=>{i.messages[t]=""===i.messages[t]?e>=0?"":"Denominator negative":i.messages[t]})),!i.messages.some((e=>""==e)))return i.status=1,i.error="All denominators are negative!",i;if("PR"===n&&(r.forEach(((e,r)=>{i.messages[r]=""===i.messages[r]?e>=t[r]?"":"Denominator < numerator":i.messages[r]})),!i.messages.some((e=>""==e))))return i.status=1,i.error="All denominators are smaller than numerators!",i;return i}(s,o,a,i.funnel.chart_type);if(0!==d.status)return{keys:null,id:null,numerators:null,denominators:null,highlights:null,anyHighlights:null,categories:null,scatter_formatting:null,label_formatting:null,tooltips:null,labels:null,anyLabels:!1,warningMessage:d.error,validationStatus:d};const h=new Array,m=new Array,g=new Array,y=e.categories[0].source.displayName,v=t.validationStatus.messages;let w=0;for(let e=0;e<o.length;e++)""===d.messages[e]?(h.push(e),m.push({x:w,id:e,label:s[e]}),w+=1,v[e].length>0&&v[e].forEach((t=>{g.push(`Conditional formatting for ${y} ${s[e]} ignored due to: ${t}.`)}))):g.push(`${y} ${s[e]} removed due to: ${d.messages[e]}.`);const _=l_(l,h);return{keys:m,id:h,numerators:l_(o,h),denominators:l_(a,h),tooltips:l_(p,h),labels:_,anyLabels:_.filter((e=>!n_(e)&&""!==e)).length>0,highlights:l_(f,h),anyHighlights:null!=f,categories:e.categories[0],scatter_formatting:l_(u,h),label_formatting:l_(c,h),warningMessage:g.length>0?g.join("\n"):"",validationStatus:d}}function l_(e,t){return e?e.filter(((e,r)=>-1!=t.indexOf(r))):[]}const u_={ll99:"99",ll95:"95",ll68:"68",ul68:"68",ul95:"95",ul99:"99",target:"target",alt_target:"alt_target"};function c_(e,t,r,n){const i=r+"_"+(t.includes("line")?u_[e]:e);return n[t][i]}function p_(e){return function(t){return Array.isArray(t)?t.map((t=>e(t))):e(t)}}const f_=p_(Math.sqrt),d_=p_(Math.exp),h_=p_(Math.log),m_=p_(Math.asin),g_=p_((e=>Math.pow(e,2))),y_=p_((e=>1/e));function v_(e,t){let r=e;return t.lower&&(Array.isArray(r)?r=r.map((e=>e<t.lower?t.lower:e)):"number"==typeof r&&(r=r<t.lower?t.lower:r)),t.upper&&(Array.isArray(r)?r=r.map((e=>e>t.upper?t.upper:e)):"number"==typeof r&&(r=r>t.upper?t.upper:r)),r}function w_(e,t){if("none"===e)return e;const r={increase:{upper:"improvement",lower:"deterioration"}[e],decrease:{lower:"improvement",upper:"deterioration"}[e],neutral:{lower:"neutral_low",upper:"neutral_high"}[e]}[t.improvement_direction];return"both"!==t.process_flag_type?r===t.process_flag_type?r:"none":r}const __=Yw(((e,t)=>{let r=e;return(t.lower||0==t.lower)&&(r=r<t.lower?t.lower:r),t.upper&&(r=r>t.upper?t.upper:r),r}));function b_(e,t){return function(r,n){return function(e,t,r,n){const i=n.percentLabels?"%":"",o=r.funnel.sig_figs;if(n_(e))return"";switch(t){case"date":return e;case"integer":return e.toFixed(0);default:return e.toFixed(o)+i}}(r,n,e,t)}}function N_(e){return!n_(e)&&!isNaN(e)&&isFinite(e)}function x_(e,t){const r=t.viewModel.inputSettings.settings.scatter.use_group_text;e.selectAll(".dotsgroup").selectAll(".dotsgroup-child").data(t.viewModel.plotPoints).join((e=>{const n=e.append("g").classed("dotsgroup-child",!0);return r?n.append("text").call(A_,t):n.append("path").call(S_,t),n.call(E_,t),n}),(e=>{let n=e.select("text"),i=e.select("path");return r?(i.remove(),n.node()||(n=e.append("text")),n.call(A_,t)):(n.remove(),i.node()||(i=e.append("path")),i.call(S_,t)),e})),e.on("click",(()=>{t.selectionManager.clear(),t.updateHighlighting()}))}function E_(e,t){e.on("click",((e,r)=>{t.selectionManager.select(r.identity,e.ctrlKey||e.metaKey).then((()=>t.updateHighlighting())),e.stopPropagation()})).on("mouseover",((e,r)=>{const n=e.pageX,i=e.pageY;t.host.tooltipService.show({dataItems:r.tooltip,identities:[r.identity],coordinates:[n,i],isTouchEvent:!1})})).on("mouseout",(()=>{t.host.tooltipService.hide({immediately:!0,isTouchEvent:!1})}))}function S_(e,t){const r=t.plotProperties.yAxis.lower,n=t.plotProperties.yAxis.upper,i=t.plotProperties.xAxis.lower,o=t.plotProperties.xAxis.upper;e.attr("d",(e=>{const t=e.aesthetics.shape,r=e.aesthetics.size;return Ye().type(an[`symbol${t}`]).size(r*r*Math.PI)()})).attr("transform",(e=>Ww(e.value,r,n)&&Ww(e.x,i,o)?`translate(${t.plotProperties.xScale(e.x)}, ${t.plotProperties.yScale(e.value)})`:"translate(0, 0) scale(0, 0)")).style("fill",(e=>e.aesthetics.colour)).style("stroke",(e=>e.aesthetics.colour_outline)).style("stroke-width",(e=>e.aesthetics.width_outline))}function A_(e,t){const r=t.plotProperties.yAxis.lower,n=t.plotProperties.yAxis.upper,i=t.plotProperties.xAxis.lower,o=t.plotProperties.xAxis.upper;e.attr("transform",(e=>Ww(e.value,r,n)&&Ww(e.x,i,o)?`translate(${t.plotProperties.xScale(e.x)}, ${t.plotProperties.yScale(e.value)})`:"translate(0, 0) scale(0, 0)")).attr("dy","0.35em").text((e=>e.group_text)).style("text-anchor","middle").style("font-size",(e=>`${e.aesthetics.scatter_text_size}px`)).style("font-family",(e=>e.aesthetics.scatter_text_font)).style("fill",(e=>e.aesthetics.scatter_text_colour))}function $_(e,t){e.select(".linesgroup").selectAll("path").data(t.viewModel.groupedLines).join("path").attr("d",(e=>{const r=t.plotProperties.yAxis.lower,n=t.plotProperties.yAxis.upper,i=t.plotProperties.xAxis.lower,o=t.plotProperties.xAxis.upper;return Me().x((e=>t.plotProperties.xScale(e.x))).y((e=>t.plotProperties.yScale(e.line_value))).defined((e=>null!==e.line_value&&Ww(e.line_value,r,n)&&Ww(e.x,i,o)))(e[1])})).attr("fill","none").attr("stroke",(e=>t.viewModel.colourPalette.isHighContrast?t.viewModel.colourPalette.foregroundColour:c_(e[0],"lines","colour",t.viewModel.inputSettings.settings))).attr("stroke-width",(e=>c_(e[0],"lines","width",t.viewModel.inputSettings.settings))).attr("stroke-dasharray",(e=>c_(e[0],"lines","type",t.viewModel.inputSettings.settings)))}function T_(e,t){const r=t.plotProperties,n=t.viewModel.colourPalette.isHighContrast?t.viewModel.colourPalette.foregroundColour:"black",i=e.select(".ttip-line-x").attr("x1",0).attr("x2",0).attr("y1",r.yAxis.end_padding).attr("y2",r.height-r.yAxis.start_padding).attr("stroke-width","1px").attr("stroke",n).style("stroke-opacity",0),o=e.select(".ttip-line-y").attr("x1",r.xAxis.start_padding).attr("x2",r.width-r.xAxis.end_padding).attr("y1",0).attr("y2",0).attr("stroke-width","1px").attr("stroke",n).style("stroke-opacity",0);e.on("mousemove",(e=>{if(!r.displayPlot)return;const n=t.viewModel.plotPoints,a=t.svg.node().getBoundingClientRect(),s=e.pageX-a.left,l=e.pageY-a.top;let u,c,p,f=1/0;for(let e=0;e<n.length;e++){const t=r.xScale(n[e].x),i=r.yScale(n[e].value),o=Math.abs(t-s)+Math.abs(i-l);o<f&&(f=o,u=e,c=t,p=i)}t.host.tooltipService.show({dataItems:n[u].tooltip,identities:[n[u].identity],coordinates:[c,p],isTouchEvent:!1}),i.style("stroke-opacity",.4).attr("x1",c).attr("x2",c),o.style("stroke-opacity",.4).attr("y1",p).attr("y2",p)})).on("mouseleave",(()=>{r.displayPlot&&(t.host.tooltipService.hide({immediately:!0,isTouchEvent:!1}),i.style("stroke-opacity",0),o.style("stroke-opacity",0))}))}function M_(e,t,r){const n=t.plotProperties.xAxis,i=it(t.plotProperties.xScale);n.ticks?n.tick_count&&i.ticks(n.tick_count):i.tickValues([]);const o=t.viewModel.svgHeight-t.plotProperties.yAxis.start_padding,a=t.plotProperties.displayPlot,s=e.select(".xaxisgroup");s.call(i).attr("color",a?n.colour:"#FFFFFF").attr("transform",`translate(0, ${o})`);const l=s.selectAll(".tick text").attr("transform","rotate("+n.tick_rotation+")").attr("text-anchor","middle").attr("dx",null).style("font-size",n.tick_size).style("font-family",n.tick_font).style("fill",a?n.tick_colour:"#FFFFFF");if(0!=n.tick_rotation){const e=n.tick_rotation<0?"end":"start",t=n.tick_rotation<0?"-.8em":".8em";l.attr("text-anchor",e).attr("dx",t)}if(!e.selectAll(".xaxisgroup").node())return void e.select(".xaxislabel").style("fill",a?n.label_colour:"#FFFFFF");const u=t.viewModel.svgWidth/2,c=t.plotProperties.yAxis.start_padding-.5*t.viewModel.inputSettings.settings.x_axis.xlimit_label_size;s.select(".xaxislabel").selectAll("text").data([n.label]).join("text").attr("x",0).attr("y",0).attr("transform",`translate(${u}, ${c})`).style("text-anchor","middle").text((e=>e)).style("font-size",n.label_size).style("font-family",n.label_font).style("fill",a?n.label_colour:"#FFFFFF")}function k_(e,t,r){const n=t.plotProperties.yAxis,i=ot(t.plotProperties.yScale),o=t.viewModel.inputSettings.settings.y_axis.ylimit_sig_figs,a=null===o?t.viewModel.inputSettings.settings.funnel.sig_figs:o,s=t.plotProperties.displayPlot;n.ticks?(n.tick_count&&i.ticks(n.tick_count),t.viewModel.inputData&&i.tickFormat((e=>t.viewModel.inputSettings.derivedSettings.percentLabels?e.toFixed(a)+"%":e.toFixed(a)))):i.tickValues([]);const l=e.select(".yaxisgroup");l.call(i).attr("color",s?n.colour:"#FFFFFF").attr("transform",`translate(${t.plotProperties.xAxis.start_padding}, 0)`).selectAll(".tick text").style("text-anchor","right").attr("transform",`rotate(${n.tick_rotation})`).style("font-size",n.tick_size).style("font-family",n.tick_font).style("fill",s?n.tick_colour:"#FFFFFF");const u=-(t.plotProperties.xAxis.start_padding-1.5*t.viewModel.inputSettings.settings.y_axis.ylimit_label_size),c=t.viewModel.svgHeight/2;l.select(".yaxislabel").selectAll("text").data([t.viewModel.inputSettings.settings.y_axis.ylimit_label]).join("text").attr("x",u).attr("y",c).attr("transform",`rotate(-90, ${u}, ${c})`).style("text-anchor","middle").text((e=>e)).style("font-size",n.label_size).style("font-family",n.label_font).style("fill",n.label_colour)}function P_(e,t=!1){t&&e.selectChildren().remove(),e.append("line").classed("ttip-line-x",!0),e.append("line").classed("ttip-line-y",!0),e.append("g").classed("xaxisgroup",!0).append("g").classed("xaxislabel",!0),e.append("g").classed("yaxisgroup",!0).append("g").classed("yaxislabel",!0),e.append("g").classed("linesgroup",!0),e.append("g").classed("dotsgroup",!0),e.append("g").classed("text-labels",!0)}function I_(e,t,r,n=null){e.call(P_,!0);const i=e.append("g").classed("errormessage",!0);if(n){const e={internal:"Internal Error! Please file a bug report with the following text:",settings:"Invalid settings provided for all observations! First error:"};i.append("text").attr("x",t.viewport.width/2).attr("y",t.viewport.height/3).style("text-anchor","middle").text(e[n]).style("font-size","10px")}i.append("text").attr("x",t.viewport.width/2).attr("y",t.viewport.height/2).style("text-anchor","middle").text(r).style("font-size","10px")}function D_(e,t){if(!t.viewModel.inputSettings.settings.labels.show_labels||!t.viewModel.inputData.anyLabels)return void e.select(".text-labels").remove();e.select(".text-labels").empty()&&e.append("g").classed("text-labels",!0);const r=on().on("drag",(function(e){const r=e.subject,n=t.plotProperties.xScale(r.x),i=t.plotProperties.yScale(r.value),o=180*Math.atan2(e.sourceEvent.y-i,e.sourceEvent.x-n)/Math.PI,a=Math.sqrt(Math.pow(e.sourceEvent.y-i,2)+Math.pow(e.sourceEvent.x-n,2)),s=10*Math.cos(o*Math.PI/180),l=10*Math.sin(o*Math.PI/180);e.subject.label.angle=o,e.subject.label.distance=a,ue(this).select("text").attr("x",e.sourceEvent.x).attr("y",e.sourceEvent.y);let u=r.label.aesthetics.label_line_offset;u="top"===r.label.aesthetics.label_position?u:-(u+r.label.aesthetics.label_size/2),ue(this).select("line").attr("x1",e.sourceEvent.x).attr("y1",e.sourceEvent.y+u).attr("x2",n+s).attr("y2",i+l),ue(this).select("path").attr("transform",`translate(${n+s}, ${i+l}) rotate(${o-90})`)}));e.select(".text-labels").selectAll(".text-group-inner").data(t.viewModel.plotPoints).join("g").classed("text-group-inner",!0).each((function(e){var n;const i=ue(this);if(""===(null!==(n=e.label.text_value)&&void 0!==n?n:""))return void i.remove();i.selectAll("*").remove();const o=i.append("text"),a=i.append("line"),s=i.append("path"),{x:l,y:u,line_offset:c,marker_offset:p,theta:f}=function(e,t){var r,n;const i="top"===e.label.aesthetics.label_position?-1:1,o=t.viewModel.svgHeight-t.plotProperties.yAxis.start_padding,a=e.label.aesthetics.label_position;let s=e.label.aesthetics.label_y_offset;const l="top"===a?0+s:o-s,u=t.plotProperties.yScale(e.value);let c="top"===a?u-l:l-u;const p=t.plotProperties.xScale(e.x),f=t.plotProperties.yScale(e.value),d=null!==(r=e.label.angle)&&void 0!==r?r:e.label.aesthetics.label_angle_offset+90*i;c=null!==(n=e.label.distance)&&void 0!==n?n:Math.min(c,e.label.aesthetics.label_line_max_length);let h=e.label.aesthetics.label_line_offset;h="top"===a?h:-(h+e.label.aesthetics.label_size/2);let m=e.label.aesthetics.label_marker_offset+e.label.aesthetics.label_size/2;m="top"===a?-m:m;const g=p+c*Math.cos(d*Math.PI/180),y=f+c*Math.sin(d*Math.PI/180);return N_(g)&&N_(y)?{x:g,y:y,theta:d,line_offset:h,marker_offset:m}:{x:0,y:0,theta:0,line_offset:0,marker_offset:0}}(e,t);if(0===l&&0===u)return void i.remove();const d=f-("top"===e.label.aesthetics.label_position?180:0),h=d*Math.PI/180;o.attr("x",l).attr("y",u).text(e.label.text_value).style("text-anchor","middle").style("font-size",`${e.label.aesthetics.label_size}px`).style("font-family",e.label.aesthetics.label_font).style("fill",e.label.aesthetics.label_colour);const m=Math.pow(e.label.aesthetics.label_marker_size,2),g=t.plotProperties.xScale(e.x)+p*Math.cos(h),y=t.plotProperties.yScale(e.value)+p*Math.sin(h);a.attr("x1",l).attr("y1",u+c).attr("x2",g).attr("y2",y).style("stroke",t.viewModel.inputSettings.settings.labels.label_line_colour).style("stroke-width",t.viewModel.inputSettings.settings.labels.label_line_width).style("stroke-dasharray",t.viewModel.inputSettings.settings.labels.label_line_type);const v=d+("top"===e.label.aesthetics.label_position?90:270);s.attr("d",Ye().type(qe).size(m)()).attr("transform",`translate(${g}, ${y}) rotate(${v})`).style("fill",e.label.aesthetics.label_marker_colour).style("stroke",e.label.aesthetics.label_marker_outline_colour),t.viewModel.headless||i.call(r)}))}const R_={above:-1,below:1,beside:-1},L_={ll99:"below",ll95:"below",ll68:"below",ul68:"above",ul95:"above",ul99:"above"},O_={ll99:"above",ll95:"above",ll68:"above",ul68:"below",ul95:"below",ul99:"below"};function C_(e,t){const r=t.viewModel.inputSettings.settings.lines,n=new Array;t.viewModel.groupedLines[0][1].forEach(((e,r)=>{null===e.line_value&&n.push(r-1),r===t.viewModel.groupedLines[0][1].length-1&&n.push(r)}));const i=t.viewModel.groupedLines.map((e=>e[0])),o=new Array;n.forEach(((e,t)=>{i.forEach(((i,a)=>{const s=n[n.length-1],l=n.length-Math.min(n.length,r[`plot_label_show_n_${u_[i]}`]),u=r[`plot_label_show_all_${u_[i]}`]||e==s;(t>=l||u)&&o.push({index:e,limit:a})}))}));const a=b_(t.viewModel.inputSettings.settings,t.viewModel.inputSettings.derivedSettings);e.select(".linesgroup").selectAll("text").data(o).join("text").text((e=>{const n=t.viewModel.groupedLines[e.limit];return r[`plot_label_show_${u_[n[0]]}`]?r[`plot_label_prefix_${u_[n[0]]}`]+a(n[1][e.index].line_value,"value"):""})).attr("x",(e=>{const r=t.viewModel.groupedLines[e.limit];return t.plotProperties.xScale(r[1][e.index].x)})).attr("y",(e=>{const r=t.viewModel.groupedLines[e.limit];return t.plotProperties.yScale(r[1][e.index].line_value)})).attr("fill",(e=>{const n=t.viewModel.groupedLines[e.limit];return r[`plot_label_colour_${u_[n[0]]}`]})).attr("font-size",(e=>{const n=t.viewModel.groupedLines[e.limit];return`${r[`plot_label_size_${u_[n[0]]}`]}px`})).attr("font-family",(e=>{const n=t.viewModel.groupedLines[e.limit];return r[`plot_label_font_${u_[n[0]]}`]})).attr("text-anchor",(e=>{const n=t.viewModel.groupedLines[e.limit];return"beside"===r[`plot_label_position_${u_[n[0]]}`]?"start":"end"})).attr("dx",(e=>{const n=t.viewModel.groupedLines[e.limit];return`${("beside"===r[`plot_label_position_${u_[n[0]]}`]?1:-1)*r[`plot_label_hpad_${u_[n[0]]}`]}px`})).attr("dy",(function(e){const n=t.viewModel.groupedLines[e.limit],i=ue(this).node().getBoundingClientRect();let o=r[`plot_label_position_${u_[n[0]]}`],a=r[`plot_label_vpad_${u_[n[0]]}`];["outside","inside"].includes(o)&&(o="outside"===o?L_[n[0]]:O_[n[0]]);const s={above:-r[`width_${u_[n[0]]}`],below:r[`plot_label_size_${u_[n[0]]}`],beside:i.height/4};return`${R_[o]*a+s[o]}px`}))}class V_{getPlottingDenominators(){const e=yt(this.inputData.denominators);return function(e,t,r){const n=Math.floor((t-e)/r),i=new Array(n);i[0]=e;for(let e=1;e<n;e++)i[e]=i[e-1]+r;return i}(1,e+.1*e,.01*e).concat(this.inputData.denominators).filter(((e,t,r)=>r.indexOf(e)===t)).sort(((e,t)=>e-t))}getTarget(e){return(e.transformed?this.targetFunctionTransformed:this.targetFunction)(this.inputData)}getSE(e){const t=e.odAdjust?this.seFunctionOD:this.seFunction;if(e.plottingDenominators){const r=JSON.parse(JSON.stringify(this.inputData));return r.numerators=null,r.denominators=e.plottingDenominators,t(r)}return t(this.inputData)}getY(){return this.yFunction(this.inputData)}getTau2(){const e=this.getTarget({transformed:!0}),t=this.getSE({odAdjust:!0}),r=function(e,t,r){return Jw(Zw(e,r),t)}(this.getY(),t,e),n=function(e){const t=e.sort((function(e,t){return e-t}));return v_(e,{lower:bt(t,.1),upper:bt(t,.9)})}(r);var i;return function(e,t){const r=t.length;if(r*e<r-1)return 0;const n=y_(g_(t)),i=g_(n),o=Nt(n);return(r*e-(r-1))/(o-Nt(i)/o)}(Nt(g_(i=n))/i.length,t)}getTau2Bool(){return{yes:!0,no:!1,auto:!0}[this.inputSettings.settings.funnel.od_adjust]}getSingleLimit(e){return(e.odAdjust?this.limitFunctionOD:this.limitFunction)(e.inputArgs)}getIntervals(){const e=[.001,.025,.16,.84,.975,.999].map((e=>Xw(e,0,1))),t=["ll99","ll95","ll68","ul68","ul95","ul99"];return e.map(((e,r)=>({quantile:e,label:t[r]})))}getLimits(){let e,t;this.getTau2Bool()?(t=this.getTau2(),e=t>0):(t=0,e=!1);const r=this.getTarget({transformed:!1}),n=this.inputSettings.settings.lines.alt_target,i=this.getTarget({transformed:!0}),o=this.getIntervals(),a=this.getPlottingDenominators(),s=this.getSE({odAdjust:e,plottingDenominators:a}),l=a.map(((a,l)=>{const u=new Array;return u.push(["denominators",a]),o.forEach((n=>{const o={q:n.quantile,target:r,target_transformed:i,SE:s[l],tau2:t,denominators:a},c=this.getSingleLimit({odAdjust:e,inputArgs:o});u.push([n.label,c])})),u.push(["target",r]),u.push(["alt_target",n]),Object.fromEntries(u)}));return l.map(((e,t)=>{const r=e;return t<l.length-1&&["99","95","68"].forEach((e=>{const n=`ll${e}`,i=`ul${e}`;r[n]>l[t+1][n]&&(r[n]=void 0),r[i]<l[t+1][i]&&(r[i]=void 0),r[n]>=r[i]&&(r[n]=void 0,r[i]=void 0)})),r}))}constructor(e){this.seFunction=e.seFunction,this.seFunctionOD=e.seFunctionOD,this.targetFunction=e.targetFunction,this.targetFunctionTransformed=e.targetFunctionTransformed,this.yFunction=e.yFunction,this.limitFunction=e.limitFunction,this.limitFunctionOD=e.limitFunctionOD,this.inputData=e.inputData,this.inputSettings=e.inputSettings}}class j_{initialiseScale(e,t){this.xScale=zr().domain([this.xAxis.lower,this.xAxis.upper]).range([this.xAxis.start_padding,e-this.xAxis.end_padding]),this.yScale=zr().domain([this.yAxis.lower,this.yAxis.upper]).range([t-this.yAxis.start_padding,this.yAxis.end_padding])}update(e,t){const r=t.plotPoints,n=t.inputData,i=t.inputSettings.settings,o=t.inputSettings.derivedSettings,a=t.colourPalette;this.width=e.viewport.width,this.height=e.viewport.height,this.displayPlot=r?r.length>1:null;const s=i.x_axis.xlimit_tick_size,l=i.y_axis.ylimit_tick_size,u=i.x_axis.xlimit_tick_count,c=i.y_axis.ylimit_tick_count,p=i.x_axis.xlimit_l;let f=i.x_axis.xlimit_u;n_(null==n?void 0:n.denominators)||(f=f||1.1*yt(n.denominators));const d=i.y_axis.ylimit_label?i.y_axis.ylimit_label_size:0,h=i.x_axis.xlimit_label?i.x_axis.xlimit_label_size+20:0;this.xAxis={lower:null!=p?p:0,upper:f,start_padding:i.canvas.left_padding+d,end_padding:i.canvas.right_padding,colour:a.isHighContrast?a.foregroundColour:i.x_axis.xlimit_colour,ticks:null!==u?u>0:i.x_axis.xlimit_ticks,tick_size:`${s}px`,tick_font:i.x_axis.xlimit_tick_font,tick_colour:a.isHighContrast?a.foregroundColour:i.x_axis.xlimit_tick_colour,tick_rotation:i.x_axis.xlimit_tick_rotation,tick_count:i.x_axis.xlimit_tick_count,label:i.x_axis.xlimit_label,label_size:`${i.x_axis.xlimit_label_size}px`,label_font:i.x_axis.xlimit_label_font,label_colour:a.isHighContrast?a.foregroundColour:i.x_axis.xlimit_label_colour};const m=i.y_axis.ylimit_l;let g=i.y_axis.ylimit_u;if(!n_(null==n?void 0:n.numerators)&&!n_(null==n?void 0:n.denominators)){const e=yt(Jw(n.numerators,n.denominators));null!=g||(g=e*o.multiplier)}this.yAxis={lower:null!=m?m:0,upper:g,start_padding:i.canvas.lower_padding+h,end_padding:i.canvas.upper_padding,colour:a.isHighContrast?a.foregroundColour:i.y_axis.ylimit_colour,ticks:null!==c?c>0:i.y_axis.ylimit_ticks,tick_size:`${l}px`,tick_font:i.y_axis.ylimit_tick_font,tick_colour:a.isHighContrast?a.foregroundColour:i.y_axis.ylimit_tick_colour,tick_rotation:i.y_axis.ylimit_tick_rotation,tick_count:i.y_axis.ylimit_tick_count,label:i.y_axis.ylimit_label,label_size:`${i.y_axis.ylimit_label_size}px`,label_font:i.y_axis.ylimit_label_font,label_colour:a.isHighContrast?a.foregroundColour:i.y_axis.ylimit_label_colour},this.initialiseScale(e.viewport.width,e.viewport.height)}}const F_=function(e){return[]},U_=function(e){const t=e.denominators;return y_(Qw(2,f_(t)))},z_=function(e){return 1},q_=function(e){const t=e.numerators,r=e.denominators;return f_(Jw(t,r))},G_=function(e){const t=e.target_transformed,r=e.q,n=e.SE,i=e.tau2,o=t+r*f_(g_(n)+i);return v_(g_(o),{lower:0})},H_=function(e){const t=e.q,r=e.denominators,n=zw(t,0,1);return v_(ww(n,2*(r+(n>.5?1:0)))/2/r,{lower:0})};const B_=function(e){const t=e.denominators;return y_(Qw(2,f_(t)))},X_=function(e){const t=e.numerators,r=e.denominators;return Nt(t)/Nt(r)},W_=function(e){return Math.asin(Math.sqrt(X_(e)))},Y_=function(e){const t=e.numerators,r=e.denominators;return m_(f_(Jw(t,r)))},K_=function(e){const t=e.target_transformed,r=e.q,n=e.SE,i=e.tau2,o=t+r*f_(g_(n)+i);return v_(g_(Math.sin(o)),{lower:0,upper:1})};const Z_=function(e){const t=e.numerators?e.numerators:e.denominators,r=e.denominators;return f_(Kw(Jw(t,g_(Kw(t,.5))),Jw(r,g_(Kw(r,.5)))))},J_=function(e){const t=e.numerators,r=e.denominators;return Nt(t)/Nt(r)},Q_=function(e){const t=e.numerators,r=e.denominators;return h_(Nt(t))-h_(Nt(r))},eb=function(e){const t=e.numerators,r=e.denominators;return h_(Jw(Kw(t,.5),Kw(r,.5)))},tb=function(e){const t=e.target_transformed,r=e.q,n=e.SE,i=e.tau2,o=t+r*f_(g_(n)+i);return v_(d_(o),{lower:0})};var rb=Object.freeze({__proto__:null,PR:class extends V_{constructor(e,t){super({seFunction:B_,seFunctionOD:B_,targetFunction:X_,targetFunctionTransformed:W_,yFunction:Y_,limitFunction:K_,limitFunctionOD:K_,inputData:e,inputSettings:t})}},RC:class extends V_{constructor(e,t){super({seFunction:Z_,seFunctionOD:Z_,targetFunction:J_,targetFunctionTransformed:Q_,yFunction:eb,limitFunction:tb,limitFunctionOD:tb,inputData:e,inputSettings:t})}},SR:class extends V_{constructor(e,t){super({seFunction:F_,seFunctionOD:U_,targetFunction:z_,targetFunctionTransformed:z_,yFunction:q_,limitFunction:H_,limitFunctionOD:G_,inputData:e,inputSettings:t})}}});function nb(e,t){return null!==t.ll95&&e<t.ll95?"lower":null!==t.ul95&&e>t.ul95?"upper":"none"}function ib(e,t){return null!==t.ll99&&e<t.ll99?"lower":null!==t.ul99&&e>t.ul99?"upper":"none"}class ob{constructor(){this.inputData=null,this.inputSettings=new xx,this.chartBase=null,this.calculatedLimits=null,this.plotPoints=new Array,this.groupedLines=new Array,this.firstRun=!0,this.colourPalette=null,this.headless=!1}update(e,t){var r;const n={status:!0};if((2===e.type||this.firstRun)&&this.inputSettings.update(e.dataViews[0]),""!==this.inputSettings.validationStatus.error)return n.status=!1,n.error=this.inputSettings.validationStatus.error,n.type="settings",n;const i=function(e){var t,r,n,i,o,a;if(!(null==e?void 0:e[0]))return"No data present";if(!(null===(r=null===(t=e[0])||void 0===t?void 0:t.categorical)||void 0===r?void 0:r.categories))return"No grouping/ID variable passed!";const s=null===(i=null===(n=e[0].categorical)||void 0===n?void 0:n.values)||void 0===i?void 0:i.some((e=>{var t,r;return null===(r=null===(t=e.source)||void 0===t?void 0:t.roles)||void 0===r?void 0:r.numerators}));if(!s)return"No Numerators passed!";const l=null===(a=null===(o=e[0].categorical)||void 0===o?void 0:o.values)||void 0===a?void 0:a.some((e=>{var t,r;return null===(r=null===(t=e.source)||void 0===t?void 0:t.roles)||void 0===r?void 0:r.denominators}));return l?"valid":"No denominators passed!"}(e.dataViews);if("valid"!==i)return n.status=!1,n.error=i,n;if(n_(this.colourPalette)&&(this.colourPalette={isHighContrast:t.colorPalette.isHighContrast,foregroundColour:t.colorPalette.foreground.value,backgroundColour:t.colorPalette.background.value,foregroundSelectedColour:t.colorPalette.foregroundSelected.value,hyperlinkColour:t.colorPalette.hyperlink.value}),this.svgWidth=e.viewport.width,this.svgHeight=e.viewport.height,this.headless=null!==(r=null==e?void 0:e.headless)&&void 0!==r&&r,2===e.type||this.firstRun){const r=this.inputSettings.settings.funnel.chart_type;this.inputData=s_(e.dataViews[0].categorical,this.inputSettings),0===this.inputData.validationStatus.status&&(this.chartBase=new rb[r](this.inputData,this.inputSettings),this.calculatedLimits=this.chartBase.getLimits(),this.scaleAndTruncateLimits(),this.initialisePlotData(t),this.initialiseGroupedLines())}return this.firstRun=!1,0!==this.inputData.validationStatus.status?(n.status=!1,n.error=this.inputData.validationStatus.error,n):(""!==this.inputData.warningMessage&&(n.warning=this.inputData.warningMessage),n)}initialisePlotData(e){var t,r;this.plotPoints=new Array;const n=e_(this.inputSettings.settings.funnel.transformation),i=this.inputSettings.derivedSettings.multiplier,o=this.inputSettings.settings.outliers.two_sigma,a=this.inputSettings.settings.outliers.three_sigma;for(let s=0;s<this.inputData.id.length;s++){const l=this.inputData.id[s],u=this.inputData.numerators[s],c=this.inputData.denominators[s],p=n(u/c*i),f=this.calculatedLimits.filter((e=>e.denominators===c&&null!==e.ll99&&null!==e.ul99))[0],d=this.inputData.scatter_formatting[s];this.colourPalette.isHighContrast&&(d.colour=this.colourPalette.foregroundColour);const h={process_flag_type:this.inputSettings.settings.outliers.process_flag_type,improvement_direction:this.inputSettings.settings.outliers.improvement_direction},m=w_(o?nb(p,f):"none",h),g=w_(a?ib(p,f):"none",h),y="number"==typeof this.inputData.categories.values[l]?this.inputData.categories.values[l].toString():this.inputData.categories.values[l];"none"!==m&&(d.colour=this.inputSettings.settings.outliers["two_sigma_colour_"+m],d.colour_outline=this.inputSettings.settings.outliers["two_sigma_colour_"+m],d.scatter_text_colour=d.colour),"none"!==g&&(d.colour=this.inputSettings.settings.outliers["three_sigma_colour_"+g],d.colour_outline=this.inputSettings.settings.outliers["three_sigma_colour_"+g],d.scatter_text_colour=d.colour),this.plotPoints.push({x:c,numerator:u,value:p,group_text:y,aesthetics:d,identity:e.createSelectionIdBuilder().withCategory(this.inputData.categories,l).createSelectionId(),highlighted:null!=(null===(t=this.inputData.highlights)||void 0===t?void 0:t[s]),tooltip:t_(s,this.calculatedLimits,{two_sigma:"none"!==m,three_sigma:"none"!==g},this.inputData,this.inputSettings.settings,this.inputSettings.derivedSettings),label:{text_value:null===(r=this.inputData.labels)||void 0===r?void 0:r[s],aesthetics:this.inputData.label_formatting[s],angle:null,distance:null,line_offset:null,marker_offset:null},two_sigma:m,three_sigma:g})}}initialiseGroupedLines(){const e=new Array;this.inputSettings.settings.lines.show_target&&e.push("target"),this.inputSettings.settings.lines.show_alt_target&&e.push("alt_target"),this.inputSettings.settings.lines.show_99&&e.push("ll99","ul99"),this.inputSettings.settings.lines.show_95&&e.push("ll95","ul95"),this.inputSettings.settings.lines.show_68&&e.push("ll68","ul68");const t=new Array;this.calculatedLimits.forEach((r=>{e.forEach((e=>{t.push({x:r.denominators,line_value:null==r?void 0:r[e],group:e})}))})),this.groupedLines=function(e,t){const r=new Map;return e.forEach((e=>{var n;const i=e[t];r.has(i)||r.set(i,[]),null===(n=r.get(i))||void 0===n||n.push(e)})),Array.from(r)}(t,"group")}scaleAndTruncateLimits(){const e=this.inputSettings.derivedSettings.multiplier,t=e_(this.inputSettings.settings.funnel.transformation),r={lower:this.inputSettings.settings.funnel.ll_truncate,upper:this.inputSettings.settings.funnel.ul_truncate};this.calculatedLimits.forEach((n=>{["target","ll99","ll95","ll68","ul68","ul95","ul99"].forEach((i=>{n[i]=__(t(Qw(n[i],e)),r)}))}))}}var ab,sb,lb,ub,cb,pb,fb,db,hb,mb,gb,yb,vb,wb,_b,bb,Nb,xb,Eb,Sb,Ab,$b,Tb,Mb,kb,Pb,Ib,Db,Rb,Lb,Ob,Cb,Vb,jb,Fb,Ub,zb,qb,Gb,Hb,Bb,Xb,Wb,Yb,Kb,Zb,Jb,Qb,eN,tN,rN,nN,iN,oN,aN,sN,lN,uN,cN,pN,fN,dN,hN,mN,gN,yN,vN,wN,_N,bN,NN,xN,EN,SN,AN,$N,TN,MN,kN,PN,IN,DN,RN,LN,ON,CN,VN,jN,FN,UN,zN,qN,GN,HN={},BN={exports:{}};function XN(){if(sb)return ab;sb=1;const e=Number.MAX_SAFE_INTEGER||9007199254740991;return ab={MAX_LENGTH:256,MAX_SAFE_COMPONENT_LENGTH:16,MAX_SAFE_BUILD_LENGTH:250,MAX_SAFE_INTEGER:e,RELEASE_TYPES:["major","premajor","minor","preminor","patch","prepatch","prerelease"],SEMVER_SPEC_VERSION:"2.0.0",FLAG_INCLUDE_PRERELEASE:1,FLAG_LOOSE:2}}function WN(){if(ub)return lb;ub=1;const e="object"==typeof process&&process.env&&process.env.NODE_DEBUG&&/\bsemver\b/i.test(process.env.NODE_DEBUG)?(...e)=>console.error("SEMVER",...e):()=>{};return lb=e}function YN(){return cb||(cb=1,function(e,t){const{MAX_SAFE_COMPONENT_LENGTH:r,MAX_SAFE_BUILD_LENGTH:n,MAX_LENGTH:i}=XN(),o=WN(),a=(t=e.exports={}).re=[],s=t.safeRe=[],l=t.src=[],u=t.t={};let c=0;const p="[a-zA-Z0-9-]",f=[["\\s",1],["\\d",i],[p,n]],d=(e,t,r)=>{const n=(e=>{for(const[t,r]of f)e=e.split(`${t}*`).join(`${t}{0,${r}}`).split(`${t}+`).join(`${t}{1,${r}}`);return e})(t),i=c++;o(e,i,t),u[e]=i,l[i]=t,a[i]=new RegExp(t,r?"g":void 0),s[i]=new RegExp(n,r?"g":void 0)};d("NUMERICIDENTIFIER","0|[1-9]\\d*"),d("NUMERICIDENTIFIERLOOSE","\\d+"),d("NONNUMERICIDENTIFIER",`\\d*[a-zA-Z-]${p}*`),d("MAINVERSION",`(${l[u.NUMERICIDENTIFIER]})\\.(${l[u.NUMERICIDENTIFIER]})\\.(${l[u.NUMERICIDENTIFIER]})`),d("MAINVERSIONLOOSE",`(${l[u.NUMERICIDENTIFIERLOOSE]})\\.(${l[u.NUMERICIDENTIFIERLOOSE]})\\.(${l[u.NUMERICIDENTIFIERLOOSE]})`),d("PRERELEASEIDENTIFIER",`(?:${l[u.NUMERICIDENTIFIER]}|${l[u.NONNUMERICIDENTIFIER]})`),d("PRERELEASEIDENTIFIERLOOSE",`(?:${l[u.NUMERICIDENTIFIERLOOSE]}|${l[u.NONNUMERICIDENTIFIER]})`),d("PRERELEASE",`(?:-(${l[u.PRERELEASEIDENTIFIER]}(?:\\.${l[u.PRERELEASEIDENTIFIER]})*))`),d("PRERELEASELOOSE",`(?:-?(${l[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[u.PRERELEASEIDENTIFIERLOOSE]})*))`),d("BUILDIDENTIFIER",`${p}+`),d("BUILD",`(?:\\+(${l[u.BUILDIDENTIFIER]}(?:\\.${l[u.BUILDIDENTIFIER]})*))`),d("FULLPLAIN",`v?${l[u.MAINVERSION]}${l[u.PRERELEASE]}?${l[u.BUILD]}?`),d("FULL",`^${l[u.FULLPLAIN]}$`),d("LOOSEPLAIN",`[v=\\s]*${l[u.MAINVERSIONLOOSE]}${l[u.PRERELEASELOOSE]}?${l[u.BUILD]}?`),d("LOOSE",`^${l[u.LOOSEPLAIN]}$`),d("GTLT","((?:<|>)?=?)"),d("XRANGEIDENTIFIERLOOSE",`${l[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`),d("XRANGEIDENTIFIER",`${l[u.NUMERICIDENTIFIER]}|x|X|\\*`),d("XRANGEPLAIN",`[v=\\s]*(${l[u.XRANGEIDENTIFIER]})(?:\\.(${l[u.XRANGEIDENTIFIER]})(?:\\.(${l[u.XRANGEIDENTIFIER]})(?:${l[u.PRERELEASE]})?${l[u.BUILD]}?)?)?`),d("XRANGEPLAINLOOSE",`[v=\\s]*(${l[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[u.XRANGEIDENTIFIERLOOSE]})(?:${l[u.PRERELEASELOOSE]})?${l[u.BUILD]}?)?)?`),d("XRANGE",`^${l[u.GTLT]}\\s*${l[u.XRANGEPLAIN]}$`),d("XRANGELOOSE",`^${l[u.GTLT]}\\s*${l[u.XRANGEPLAINLOOSE]}$`),d("COERCEPLAIN",`(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`),d("COERCE",`${l[u.COERCEPLAIN]}(?:$|[^\\d])`),d("COERCEFULL",l[u.COERCEPLAIN]+`(?:${l[u.PRERELEASE]})?`+`(?:${l[u.BUILD]})?(?:$|[^\\d])`),d("COERCERTL",l[u.COERCE],!0),d("COERCERTLFULL",l[u.COERCEFULL],!0),d("LONETILDE","(?:~>?)"),d("TILDETRIM",`(\\s*)${l[u.LONETILDE]}\\s+`,!0),t.tildeTrimReplace="$1~",d("TILDE",`^${l[u.LONETILDE]}${l[u.XRANGEPLAIN]}$`),d("TILDELOOSE",`^${l[u.LONETILDE]}${l[u.XRANGEPLAINLOOSE]}$`),d("LONECARET","(?:\\^)"),d("CARETTRIM",`(\\s*)${l[u.LONECARET]}\\s+`,!0),t.caretTrimReplace="$1^",d("CARET",`^${l[u.LONECARET]}${l[u.XRANGEPLAIN]}$`),d("CARETLOOSE",`^${l[u.LONECARET]}${l[u.XRANGEPLAINLOOSE]}$`),d("COMPARATORLOOSE",`^${l[u.GTLT]}\\s*(${l[u.LOOSEPLAIN]})$|^$`),d("COMPARATOR",`^${l[u.GTLT]}\\s*(${l[u.FULLPLAIN]})$|^$`),d("COMPARATORTRIM",`(\\s*)${l[u.GTLT]}\\s*(${l[u.LOOSEPLAIN]}|${l[u.XRANGEPLAIN]})`,!0),t.comparatorTrimReplace="$1$2$3",d("HYPHENRANGE",`^\\s*(${l[u.XRANGEPLAIN]})\\s+-\\s+(${l[u.XRANGEPLAIN]})\\s*$`),d("HYPHENRANGELOOSE",`^\\s*(${l[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[u.XRANGEPLAINLOOSE]})\\s*$`),d("STAR","(<|>)?=?\\s*\\*"),d("GTE0","^\\s*>=\\s*0\\.0\\.0\\s*$"),d("GTE0PRE","^\\s*>=\\s*0\\.0\\.0-0\\s*$")}(BN,BN.exports)),BN.exports}function KN(){if(fb)return pb;fb=1;const e=Object.freeze({loose:!0}),t=Object.freeze({});return pb=r=>r?"object"!=typeof r?e:r:t}function ZN(){if(hb)return db;hb=1;const e=/^[0-9]+$/,t=(t,r)=>{const n=e.test(t),i=e.test(r);return n&&i&&(t=+t,r=+r),t===r?0:n&&!i?-1:i&&!n?1:t<r?-1:1};return db={compareIdentifiers:t,rcompareIdentifiers:(e,r)=>t(r,e)},db}function JN(){if(gb)return mb;gb=1;const e=WN(),{MAX_LENGTH:t,MAX_SAFE_INTEGER:r}=XN(),{safeRe:n,t:i}=YN(),o=KN(),{compareIdentifiers:a}=ZN();class s{constructor(a,l){if(l=o(l),a instanceof s){if(a.loose===!!l.loose&&a.includePrerelease===!!l.includePrerelease)return a;a=a.version}else if("string"!=typeof a)throw new TypeError(`Invalid version. Must be a string. Got type "${typeof a}".`);if(a.length>t)throw new TypeError(`version is longer than ${t} characters`);e("SemVer",a,l),this.options=l,this.loose=!!l.loose,this.includePrerelease=!!l.includePrerelease;const u=a.trim().match(l.loose?n[i.LOOSE]:n[i.FULL]);if(!u)throw new TypeError(`Invalid Version: ${a}`);if(this.raw=a,this.major=+u[1],this.minor=+u[2],this.patch=+u[3],this.major>r||this.major<0)throw new TypeError("Invalid major version");if(this.minor>r||this.minor<0)throw new TypeError("Invalid minor version");if(this.patch>r||this.patch<0)throw new TypeError("Invalid patch version");u[4]?this.prerelease=u[4].split(".").map((e=>{if(/^[0-9]+$/.test(e)){const t=+e;if(t>=0&&t<r)return t}return e})):this.prerelease=[],this.build=u[5]?u[5].split("."):[],this.format()}format(){return this.version=`${this.major}.${this.minor}.${this.patch}`,this.prerelease.length&&(this.version+=`-${this.prerelease.join(".")}`),this.version}toString(){return this.version}compare(t){if(e("SemVer.compare",this.version,this.options,t),!(t instanceof s)){if("string"==typeof t&&t===this.version)return 0;t=new s(t,this.options)}return t.version===this.version?0:this.compareMain(t)||this.comparePre(t)}compareMain(e){return e instanceof s||(e=new s(e,this.options)),a(this.major,e.major)||a(this.minor,e.minor)||a(this.patch,e.patch)}comparePre(t){if(t instanceof s||(t=new s(t,this.options)),this.prerelease.length&&!t.prerelease.length)return-1;if(!this.prerelease.length&&t.prerelease.length)return 1;if(!this.prerelease.length&&!t.prerelease.length)return 0;let r=0;do{const n=this.prerelease[r],i=t.prerelease[r];if(e("prerelease compare",r,n,i),void 0===n&&void 0===i)return 0;if(void 0===i)return 1;if(void 0===n)return-1;if(n!==i)return a(n,i)}while(++r)}compareBuild(t){t instanceof s||(t=new s(t,this.options));let r=0;do{const n=this.build[r],i=t.build[r];if(e("prerelease compare",r,n,i),void 0===n&&void 0===i)return 0;if(void 0===i)return 1;if(void 0===n)return-1;if(n!==i)return a(n,i)}while(++r)}inc(e,t,r){switch(e){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",t,r);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",t,r);break;case"prepatch":this.prerelease.length=0,this.inc("patch",t,r),this.inc("pre",t,r);break;case"prerelease":0===this.prerelease.length&&this.inc("patch",t,r),this.inc("pre",t,r);break;case"major":0===this.minor&&0===this.patch&&0!==this.prerelease.length||this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":0===this.patch&&0!==this.prerelease.length||this.minor++,this.patch=0,this.prerelease=[];break;case"patch":0===this.prerelease.length&&this.patch++,this.prerelease=[];break;case"pre":{const e=Number(r)?1:0;if(!t&&!1===r)throw new Error("invalid increment argument: identifier is empty");if(0===this.prerelease.length)this.prerelease=[e];else{let n=this.prerelease.length;for(;--n>=0;)"number"==typeof this.prerelease[n]&&(this.prerelease[n]++,n=-2);if(-1===n){if(t===this.prerelease.join(".")&&!1===r)throw new Error("invalid increment argument: identifier already exists");this.prerelease.push(e)}}if(t){let n=[t,e];!1===r&&(n=[t]),0===a(this.prerelease[0],t)?isNaN(this.prerelease[1])&&(this.prerelease=n):this.prerelease=n}break}default:throw new Error(`invalid increment argument: ${e}`)}return this.raw=this.format(),this.build.length&&(this.raw+=`+${this.build.join(".")}`),this}}return mb=s}function QN(){if(vb)return yb;vb=1;const e=JN();return yb=(t,r,n=!1)=>{if(t instanceof e)return t;try{return new e(t,r)}catch(e){if(!n)return null;throw e}},yb}function ex(){if(Ob)return Lb;Ob=1;const e=JN();return Lb=(t,r,n)=>new e(t,n).compare(new e(r,n)),Lb}function tx(){if(zb)return Ub;zb=1;const e=JN();return Ub=(t,r,n)=>{const i=new e(t,n),o=new e(r,n);return i.compare(o)||i.compareBuild(o)},Ub}function rx(){if(Wb)return Xb;Wb=1;const e=ex();return Xb=(t,r,n)=>e(t,r,n)>0,Xb}function nx(){if(Kb)return Yb;Kb=1;const e=ex();return Yb=(t,r,n)=>e(t,r,n)<0,Yb}function ix(){if(Jb)return Zb;Jb=1;const e=ex();return Zb=(t,r,n)=>0===e(t,r,n),Zb}function ox(){if(eN)return Qb;eN=1;const e=ex();return Qb=(t,r,n)=>0!==e(t,r,n),Qb}function ax(){if(rN)return tN;rN=1;const e=ex();return tN=(t,r,n)=>e(t,r,n)>=0,tN}function sx(){if(iN)return nN;iN=1;const e=ex();return nN=(t,r,n)=>e(t,r,n)<=0,nN}function lx(){if(aN)return oN;aN=1;const e=ix(),t=ox(),r=rx(),n=ax(),i=nx(),o=sx();return oN=(a,s,l,u)=>{switch(s){case"===":return"object"==typeof a&&(a=a.version),"object"==typeof l&&(l=l.version),a===l;case"!==":return"object"==typeof a&&(a=a.version),"object"==typeof l&&(l=l.version),a!==l;case"":case"=":case"==":return e(a,l,u);case"!=":return t(a,l,u);case">":return r(a,l,u);case">=":return n(a,l,u);case"<":return i(a,l,u);case"<=":return o(a,l,u);default:throw new TypeError(`Invalid operator: ${s}`)}},oN}function ux(){if(fN)return pN;function e(t){var r=this;if(r instanceof e||(r=new e),r.tail=null,r.head=null,r.length=0,t&&"function"==typeof t.forEach)t.forEach((function(e){r.push(e)}));else if(arguments.length>0)for(var n=0,i=arguments.length;n<i;n++)r.push(arguments[n]);return r}function t(e,t,r){var n=t===e.head?new i(r,null,t,e):new i(r,t,t.next,e);return null===n.next&&(e.tail=n),null===n.prev&&(e.head=n),e.length++,n}function r(e,t){e.tail=new i(t,e.tail,null,e),e.head||(e.head=e.tail),e.length++}function n(e,t){e.head=new i(t,null,e.head,e),e.tail||(e.tail=e.head),e.length++}function i(e,t,r,n){if(!(this instanceof i))return new i(e,t,r,n);this.list=n,this.value=e,t?(t.next=this,this.prev=t):this.prev=null,r?(r.prev=this,this.next=r):this.next=null}fN=1,pN=e,e.Node=i,e.create=e,e.prototype.removeNode=function(e){if(e.list!==this)throw new Error("removing node which does not belong to this list");var t=e.next,r=e.prev;return t&&(t.prev=r),r&&(r.next=t),e===this.head&&(this.head=t),e===this.tail&&(this.tail=r),e.list.length--,e.next=null,e.prev=null,e.list=null,t},e.prototype.unshiftNode=function(e){if(e!==this.head){e.list&&e.list.removeNode(e);var t=this.head;e.list=this,e.next=t,t&&(t.prev=e),this.head=e,this.tail||(this.tail=e),this.length++}},e.prototype.pushNode=function(e){if(e!==this.tail){e.list&&e.list.removeNode(e);var t=this.tail;e.list=this,e.prev=t,t&&(t.next=e),this.tail=e,this.head||(this.head=e),this.length++}},e.prototype.push=function(){for(var e=0,t=arguments.length;e<t;e++)r(this,arguments[e]);return this.length},e.prototype.unshift=function(){for(var e=0,t=arguments.length;e<t;e++)n(this,arguments[e]);return this.length},e.prototype.pop=function(){if(this.tail){var e=this.tail.value;return this.tail=this.tail.prev,this.tail?this.tail.next=null:this.head=null,this.length--,e}},e.prototype.shift=function(){if(this.head){var e=this.head.value;return this.head=this.head.next,this.head?this.head.prev=null:this.tail=null,this.length--,e}},e.prototype.forEach=function(e,t){t=t||this;for(var r=this.head,n=0;null!==r;n++)e.call(t,r.value,n,this),r=r.next},e.prototype.forEachReverse=function(e,t){t=t||this;for(var r=this.tail,n=this.length-1;null!==r;n--)e.call(t,r.value,n,this),r=r.prev},e.prototype.get=function(e){for(var t=0,r=this.head;null!==r&&t<e;t++)r=r.next;if(t===e&&null!==r)return r.value},e.prototype.getReverse=function(e){for(var t=0,r=this.tail;null!==r&&t<e;t++)r=r.prev;if(t===e&&null!==r)return r.value},e.prototype.map=function(t,r){r=r||this;for(var n=new e,i=this.head;null!==i;)n.push(t.call(r,i.value,this)),i=i.next;return n},e.prototype.mapReverse=function(t,r){r=r||this;for(var n=new e,i=this.tail;null!==i;)n.push(t.call(r,i.value,this)),i=i.prev;return n},e.prototype.reduce=function(e,t){var r,n=this.head;if(arguments.length>1)r=t;else{if(!this.head)throw new TypeError("Reduce of empty list with no initial value");n=this.head.next,r=this.head.value}for(var i=0;null!==n;i++)r=e(r,n.value,i),n=n.next;return r},e.prototype.reduceReverse=function(e,t){var r,n=this.tail;if(arguments.length>1)r=t;else{if(!this.tail)throw new TypeError("Reduce of empty list with no initial value");n=this.tail.prev,r=this.tail.value}for(var i=this.length-1;null!==n;i--)r=e(r,n.value,i),n=n.prev;return r},e.prototype.toArray=function(){for(var e=new Array(this.length),t=0,r=this.head;null!==r;t++)e[t]=r.value,r=r.next;return e},e.prototype.toArrayReverse=function(){for(var e=new Array(this.length),t=0,r=this.tail;null!==r;t++)e[t]=r.value,r=r.prev;return e},e.prototype.slice=function(t,r){(r=r||this.length)<0&&(r+=this.length),(t=t||0)<0&&(t+=this.length);var n=new e;if(r<t||r<0)return n;t<0&&(t=0),r>this.length&&(r=this.length);for(var i=0,o=this.head;null!==o&&i<t;i++)o=o.next;for(;null!==o&&i<r;i++,o=o.next)n.push(o.value);return n},e.prototype.sliceReverse=function(t,r){(r=r||this.length)<0&&(r+=this.length),(t=t||0)<0&&(t+=this.length);var n=new e;if(r<t||r<0)return n;t<0&&(t=0),r>this.length&&(r=this.length);for(var i=this.length,o=this.tail;null!==o&&i>r;i--)o=o.prev;for(;null!==o&&i>t;i--,o=o.prev)n.push(o.value);return n},e.prototype.splice=function(e,r,...n){e>this.length&&(e=this.length-1),e<0&&(e=this.length+e);for(var i=0,o=this.head;null!==o&&i<e;i++)o=o.next;var a=[];for(i=0;o&&i<r;i++)a.push(o.value),o=this.removeNode(o);null===o&&(o=this.tail),o!==this.head&&o!==this.tail&&(o=o.prev);for(i=0;i<n.length;i++)o=t(this,o,n[i]);return a},e.prototype.reverse=function(){for(var e=this.head,t=this.tail,r=e;null!==r;r=r.prev){var n=r.prev;r.prev=r.next,r.next=n}return this.head=t,this.tail=e,this};try{(cN?uN:(cN=1,uN=function(e){e.prototype[Symbol.iterator]=function*(){for(let e=this.head;e;e=e.next)yield e.value}}))(e)}catch(e){}return pN}function cx(){if(gN)return mN;gN=1;class e{constructor(t,r){if(r=n(r),t instanceof e)return t.loose===!!r.loose&&t.includePrerelease===!!r.includePrerelease?t:new e(t.raw,r);if(t instanceof i)return this.raw=t.value,this.set=[[t]],this.format(),this;if(this.options=r,this.loose=!!r.loose,this.includePrerelease=!!r.includePrerelease,this.raw=t.trim().split(/\s+/).join(" "),this.set=this.raw.split("||").map((e=>this.parseRange(e.trim()))).filter((e=>e.length)),!this.set.length)throw new TypeError(`Invalid SemVer Range: ${this.raw}`);if(this.set.length>1){const e=this.set[0];if(this.set=this.set.filter((e=>!h(e[0]))),0===this.set.length)this.set=[e];else if(this.set.length>1)for(const e of this.set)if(1===e.length&&m(e[0])){this.set=[e];break}}this.format()}format(){return this.range=this.set.map((e=>e.join(" ").trim())).join("||").trim(),this.range}toString(){return this.range}parseRange(e){const t=((this.options.includePrerelease&&f)|(this.options.loose&&d))+":"+e,n=r.get(t);if(n)return n;const a=this.options.loose,m=a?s[l.HYPHENRANGELOOSE]:s[l.HYPHENRANGE];e=e.replace(m,$(this.options.includePrerelease)),o("hyphen replace",e),e=e.replace(s[l.COMPARATORTRIM],u),o("comparator trim",e),e=e.replace(s[l.TILDETRIM],c),o("tilde trim",e),e=e.replace(s[l.CARETTRIM],p),o("caret trim",e);let g=e.split(" ").map((e=>y(e,this.options))).join(" ").split(/\s+/).map((e=>A(e,this.options)));a&&(g=g.filter((e=>(o("loose invalid filter",e,this.options),!!e.match(s[l.COMPARATORLOOSE]))))),o("range list",g);const v=new Map,w=g.map((e=>new i(e,this.options)));for(const e of w){if(h(e))return[e];v.set(e.value,e)}v.size>1&&v.has("")&&v.delete("");const _=[...v.values()];return r.set(t,_),_}intersects(t,r){if(!(t instanceof e))throw new TypeError("a Range is required");return this.set.some((e=>g(e,r)&&t.set.some((t=>g(t,r)&&e.every((e=>t.every((t=>e.intersects(t,r)))))))))}test(e){if(!e)return!1;if("string"==typeof e)try{e=new a(e,this.options)}catch(e){return!1}for(let t=0;t<this.set.length;t++)if(T(this.set[t],e,this.options))return!0;return!1}}mN=e;const t=function(){if(hN)return dN;hN=1;const e=ux(),t=Symbol("max"),r=Symbol("length"),n=Symbol("lengthCalculator"),i=Symbol("allowStale"),o=Symbol("maxAge"),a=Symbol("dispose"),s=Symbol("noDisposeOnSet"),l=Symbol("lruList"),u=Symbol("cache"),c=Symbol("updateAgeOnGet"),p=()=>1,f=(e,t,r)=>{const n=e[u].get(t);if(n){const t=n.value;if(d(e,t)){if(m(e,n),!e[i])return}else r&&(e[c]&&(n.value.now=Date.now()),e[l].unshiftNode(n));return t.value}},d=(e,t)=>{if(!t||!t.maxAge&&!e[o])return!1;const r=Date.now()-t.now;return t.maxAge?r>t.maxAge:e[o]&&r>e[o]},h=e=>{if(e[r]>e[t])for(let n=e[l].tail;e[r]>e[t]&&null!==n;){const t=n.prev;m(e,n),n=t}},m=(e,t)=>{if(t){const n=t.value;e[a]&&e[a](n.key,n.value),e[r]-=n.length,e[u].delete(n.key),e[l].removeNode(t)}};class g{constructor(e,t,r,n,i){this.key=e,this.value=t,this.length=r,this.now=n,this.maxAge=i||0}}const y=(e,t,r,n)=>{let o=r.value;d(e,o)&&(m(e,r),e[i]||(o=void 0)),o&&t.call(n,o.value,o.key,e)};return dN=class{constructor(e){if("number"==typeof e&&(e={max:e}),e||(e={}),e.max&&("number"!=typeof e.max||e.max<0))throw new TypeError("max must be a non-negative number");this[t]=e.max||1/0;const r=e.length||p;if(this[n]="function"!=typeof r?p:r,this[i]=e.stale||!1,e.maxAge&&"number"!=typeof e.maxAge)throw new TypeError("maxAge must be a number");this[o]=e.maxAge||0,this[a]=e.dispose,this[s]=e.noDisposeOnSet||!1,this[c]=e.updateAgeOnGet||!1,this.reset()}set max(e){if("number"!=typeof e||e<0)throw new TypeError("max must be a non-negative number");this[t]=e||1/0,h(this)}get max(){return this[t]}set allowStale(e){this[i]=!!e}get allowStale(){return this[i]}set maxAge(e){if("number"!=typeof e)throw new TypeError("maxAge must be a non-negative number");this[o]=e,h(this)}get maxAge(){return this[o]}set lengthCalculator(e){"function"!=typeof e&&(e=p),e!==this[n]&&(this[n]=e,this[r]=0,this[l].forEach((e=>{e.length=this[n](e.value,e.key),this[r]+=e.length}))),h(this)}get lengthCalculator(){return this[n]}get length(){return this[r]}get itemCount(){return this[l].length}rforEach(e,t){t=t||this;for(let r=this[l].tail;null!==r;){const n=r.prev;y(this,e,r,t),r=n}}forEach(e,t){t=t||this;for(let r=this[l].head;null!==r;){const n=r.next;y(this,e,r,t),r=n}}keys(){return this[l].toArray().map((e=>e.key))}values(){return this[l].toArray().map((e=>e.value))}reset(){this[a]&&this[l]&&this[l].length&&this[l].forEach((e=>this[a](e.key,e.value))),this[u]=new Map,this[l]=new e,this[r]=0}dump(){return this[l].map((e=>!d(this,e)&&{k:e.key,v:e.value,e:e.now+(e.maxAge||0)})).toArray().filter((e=>e))}dumpLru(){return this[l]}set(e,i,c){if((c=c||this[o])&&"number"!=typeof c)throw new TypeError("maxAge must be a number");const p=c?Date.now():0,f=this[n](i,e);if(this[u].has(e)){if(f>this[t])return m(this,this[u].get(e)),!1;const n=this[u].get(e).value;return this[a]&&(this[s]||this[a](e,n.value)),n.now=p,n.maxAge=c,n.value=i,this[r]+=f-n.length,n.length=f,this.get(e),h(this),!0}const d=new g(e,i,f,p,c);return d.length>this[t]?(this[a]&&this[a](e,i),!1):(this[r]+=d.length,this[l].unshift(d),this[u].set(e,this[l].head),h(this),!0)}has(e){if(!this[u].has(e))return!1;const t=this[u].get(e).value;return!d(this,t)}get(e){return f(this,e,!0)}peek(e){return f(this,e,!1)}pop(){const e=this[l].tail;return e?(m(this,e),e.value):null}del(e){m(this,this[u].get(e))}load(e){this.reset();const t=Date.now();for(let r=e.length-1;r>=0;r--){const n=e[r],i=n.e||0;if(0===i)this.set(n.k,n.v);else{const e=i-t;e>0&&this.set(n.k,n.v,e)}}}prune(){this[u].forEach(((e,t)=>f(this,t,!1)))}},dN}(),r=new t({max:1e3}),n=KN(),i=px(),o=WN(),a=JN(),{safeRe:s,t:l,comparatorTrimReplace:u,tildeTrimReplace:c,caretTrimReplace:p}=YN(),{FLAG_INCLUDE_PRERELEASE:f,FLAG_LOOSE:d}=XN(),h=e=>"<0.0.0-0"===e.value,m=e=>""===e.value,g=(e,t)=>{let r=!0;const n=e.slice();let i=n.pop();for(;r&&n.length;)r=n.every((e=>i.intersects(e,t))),i=n.pop();return r},y=(e,t)=>(o("comp",e,t),e=b(e,t),o("caret",e),e=w(e,t),o("tildes",e),e=x(e,t),o("xrange",e),e=S(e,t),o("stars",e),e),v=e=>!e||"x"===e.toLowerCase()||"*"===e,w=(e,t)=>e.trim().split(/\s+/).map((e=>_(e,t))).join(" "),_=(e,t)=>{const r=t.loose?s[l.TILDELOOSE]:s[l.TILDE];return e.replace(r,((t,r,n,i,a)=>{let s;return o("tilde",e,t,r,n,i,a),v(r)?s="":v(n)?s=`>=${r}.0.0 <${+r+1}.0.0-0`:v(i)?s=`>=${r}.${n}.0 <${r}.${+n+1}.0-0`:a?(o("replaceTilde pr",a),s=`>=${r}.${n}.${i}-${a} <${r}.${+n+1}.0-0`):s=`>=${r}.${n}.${i} <${r}.${+n+1}.0-0`,o("tilde return",s),s}))},b=(e,t)=>e.trim().split(/\s+/).map((e=>N(e,t))).join(" "),N=(e,t)=>{o("caret",e,t);const r=t.loose?s[l.CARETLOOSE]:s[l.CARET],n=t.includePrerelease?"-0":"";return e.replace(r,((t,r,i,a,s)=>{let l;return o("caret",e,t,r,i,a,s),v(r)?l="":v(i)?l=`>=${r}.0.0${n} <${+r+1}.0.0-0`:v(a)?l="0"===r?`>=${r}.${i}.0${n} <${r}.${+i+1}.0-0`:`>=${r}.${i}.0${n} <${+r+1}.0.0-0`:s?(o("replaceCaret pr",s),l="0"===r?"0"===i?`>=${r}.${i}.${a}-${s} <${r}.${i}.${+a+1}-0`:`>=${r}.${i}.${a}-${s} <${r}.${+i+1}.0-0`:`>=${r}.${i}.${a}-${s} <${+r+1}.0.0-0`):(o("no pr"),l="0"===r?"0"===i?`>=${r}.${i}.${a}${n} <${r}.${i}.${+a+1}-0`:`>=${r}.${i}.${a}${n} <${r}.${+i+1}.0-0`:`>=${r}.${i}.${a} <${+r+1}.0.0-0`),o("caret return",l),l}))},x=(e,t)=>(o("replaceXRanges",e,t),e.split(/\s+/).map((e=>E(e,t))).join(" ")),E=(e,t)=>{e=e.trim();const r=t.loose?s[l.XRANGELOOSE]:s[l.XRANGE];return e.replace(r,((r,n,i,a,s,l)=>{o("xRange",e,r,n,i,a,s,l);const u=v(i),c=u||v(a),p=c||v(s),f=p;return"="===n&&f&&(n=""),l=t.includePrerelease?"-0":"",u?r=">"===n||"<"===n?"<0.0.0-0":"*":n&&f?(c&&(a=0),s=0,">"===n?(n=">=",c?(i=+i+1,a=0,s=0):(a=+a+1,s=0)):"<="===n&&(n="<",c?i=+i+1:a=+a+1),"<"===n&&(l="-0"),r=`${n+i}.${a}.${s}${l}`):c?r=`>=${i}.0.0${l} <${+i+1}.0.0-0`:p&&(r=`>=${i}.${a}.0${l} <${i}.${+a+1}.0-0`),o("xRange return",r),r}))},S=(e,t)=>(o("replaceStars",e,t),e.trim().replace(s[l.STAR],"")),A=(e,t)=>(o("replaceGTE0",e,t),e.trim().replace(s[t.includePrerelease?l.GTE0PRE:l.GTE0],"")),$=e=>(t,r,n,i,o,a,s,l,u,c,p,f,d)=>`${r=v(n)?"":v(i)?`>=${n}.0.0${e?"-0":""}`:v(o)?`>=${n}.${i}.0${e?"-0":""}`:a?`>=${r}`:`>=${r}${e?"-0":""}`} ${l=v(u)?"":v(c)?`<${+u+1}.0.0-0`:v(p)?`<${u}.${+c+1}.0-0`:f?`<=${u}.${c}.${p}-${f}`:e?`<${u}.${c}.${+p+1}-0`:`<=${l}`}`.trim(),T=(e,t,r)=>{for(let r=0;r<e.length;r++)if(!e[r].test(t))return!1;if(t.prerelease.length&&!r.includePrerelease){for(let r=0;r<e.length;r++)if(o(e[r].semver),e[r].semver!==i.ANY&&e[r].semver.prerelease.length>0){const n=e[r].semver;if(n.major===t.major&&n.minor===t.minor&&n.patch===t.patch)return!0}return!1}return!0};return mN}function px(){if(vN)return yN;vN=1;const e=Symbol("SemVer ANY");class t{static get ANY(){return e}constructor(n,i){if(i=r(i),n instanceof t){if(n.loose===!!i.loose)return n;n=n.value}n=n.trim().split(/\s+/).join(" "),a("comparator",n,i),this.options=i,this.loose=!!i.loose,this.parse(n),this.semver===e?this.value="":this.value=this.operator+this.semver.version,a("comp",this)}parse(t){const r=this.options.loose?n[i.COMPARATORLOOSE]:n[i.COMPARATOR],o=t.match(r);if(!o)throw new TypeError(`Invalid comparator: ${t}`);this.operator=void 0!==o[1]?o[1]:"","="===this.operator&&(this.operator=""),o[2]?this.semver=new s(o[2],this.options.loose):this.semver=e}toString(){return this.value}test(t){if(a("Comparator.test",t,this.options.loose),this.semver===e||t===e)return!0;if("string"==typeof t)try{t=new s(t,this.options)}catch(e){return!1}return o(t,this.operator,this.semver,this.options)}intersects(e,n){if(!(e instanceof t))throw new TypeError("a Comparator is required");return""===this.operator?""===this.value||new l(e.value,n).test(this.value):""===e.operator?""===e.value||new l(this.value,n).test(e.semver):(!(n=r(n)).includePrerelease||"<0.0.0-0"!==this.value&&"<0.0.0-0"!==e.value)&&(!(!n.includePrerelease&&(this.value.startsWith("<0.0.0")||e.value.startsWith("<0.0.0")))&&(!(!this.operator.startsWith(">")||!e.operator.startsWith(">"))||(!(!this.operator.startsWith("<")||!e.operator.startsWith("<"))||(!(this.semver.version!==e.semver.version||!this.operator.includes("=")||!e.operator.includes("="))||(!!(o(this.semver,"<",e.semver,n)&&this.operator.startsWith(">")&&e.operator.startsWith("<"))||!!(o(this.semver,">",e.semver,n)&&this.operator.startsWith("<")&&e.operator.startsWith(">")))))))}}yN=t;const r=KN(),{safeRe:n,t:i}=YN(),o=lx(),a=WN(),s=JN(),l=cx();return yN}function fx(){if(_N)return wN;_N=1;const e=cx();return wN=(t,r,n)=>{try{r=new e(r,n)}catch(e){return!1}return r.test(t)},wN}function dx(){if(kN)return MN;kN=1;const e=cx();return MN=(t,r)=>{try{return new e(t,r).range||"*"}catch(e){return null}},MN}function hx(){if(IN)return PN;IN=1;const e=JN(),t=px(),{ANY:r}=t,n=cx(),i=fx(),o=rx(),a=nx(),s=sx(),l=ax();return PN=(u,c,p,f)=>{let d,h,m,g,y;switch(u=new e(u,f),c=new n(c,f),p){case">":d=o,h=s,m=a,g=">",y=">=";break;case"<":d=a,h=l,m=o,g="<",y="<=";break;default:throw new TypeError('Must provide a hilo val of "<" or ">"')}if(i(u,c,f))return!1;for(let e=0;e<c.set.length;++e){const n=c.set[e];let i=null,o=null;if(n.forEach((e=>{e.semver===r&&(e=new t(">=0.0.0")),i=i||e,o=o||e,d(e.semver,i.semver,f)?i=e:m(e.semver,o.semver,f)&&(o=e)})),i.operator===g||i.operator===y)return!1;if((!o.operator||o.operator===g)&&h(u,o.semver))return!1;if(o.operator===y&&m(u,o.semver))return!1}return!0},PN}function mx(){if(GN)return qN;GN=1;const e=YN(),t=XN(),r=JN(),n=ZN(),i=QN(),o=function(){if(_b)return wb;_b=1;const e=QN();return wb=(t,r)=>{const n=e(t,r);return n?n.version:null},wb}(),a=function(){if(Nb)return bb;Nb=1;const e=QN();return bb=(t,r)=>{const n=e(t.trim().replace(/^[=v]+/,""),r);return n?n.version:null},bb}(),s=function(){if(Eb)return xb;Eb=1;const e=JN();return xb=(t,r,n,i,o)=>{"string"==typeof n&&(o=i,i=n,n=void 0);try{return new e(t instanceof e?t.version:t,n).inc(r,i,o).version}catch(e){return null}},xb}(),l=function(){if(Ab)return Sb;Ab=1;const e=QN();return Sb=(t,r)=>{const n=e(t,null,!0),i=e(r,null,!0),o=n.compare(i);if(0===o)return null;const a=o>0,s=a?n:i,l=a?i:n,u=!!s.prerelease.length;if(l.prerelease.length&&!u)return l.patch||l.minor?s.patch?"patch":s.minor?"minor":"major":"major";const c=u?"pre":"";return n.major!==i.major?c+"major":n.minor!==i.minor?c+"minor":n.patch!==i.patch?c+"patch":"prerelease"}}(),u=function(){if(Tb)return $b;Tb=1;const e=JN();return $b=(t,r)=>new e(t,r).major,$b}(),c=function(){if(kb)return Mb;kb=1;const e=JN();return Mb=(t,r)=>new e(t,r).minor,Mb}(),p=function(){if(Ib)return Pb;Ib=1;const e=JN();return Pb=(t,r)=>new e(t,r).patch,Pb}(),f=function(){if(Rb)return Db;Rb=1;const e=QN();return Db=(t,r)=>{const n=e(t,r);return n&&n.prerelease.length?n.prerelease:null},Db}(),d=ex(),h=function(){if(Vb)return Cb;Vb=1;const e=ex();return Cb=(t,r,n)=>e(r,t,n),Cb}(),m=function(){if(Fb)return jb;Fb=1;const e=ex();return jb=(t,r)=>e(t,r,!0),jb}(),g=tx(),y=function(){if(Gb)return qb;Gb=1;const e=tx();return qb=(t,r)=>t.sort(((t,n)=>e(t,n,r))),qb}(),v=function(){if(Bb)return Hb;Bb=1;const e=tx();return Hb=(t,r)=>t.sort(((t,n)=>e(n,t,r))),Hb}(),w=rx(),_=nx(),b=ix(),N=ox(),x=ax(),E=sx(),S=lx(),A=function(){if(lN)return sN;lN=1;const e=JN(),t=QN(),{safeRe:r,t:n}=YN();return sN=(i,o)=>{if(i instanceof e)return i;if("number"==typeof i&&(i=String(i)),"string"!=typeof i)return null;let a=null;if((o=o||{}).rtl){const e=o.includePrerelease?r[n.COERCERTLFULL]:r[n.COERCERTL];let t;for(;(t=e.exec(i))&&(!a||a.index+a[0].length!==i.length);)a&&t.index+t[0].length===a.index+a[0].length||(a=t),e.lastIndex=t.index+t[1].length+t[2].length;e.lastIndex=-1}else a=i.match(o.includePrerelease?r[n.COERCEFULL]:r[n.COERCE]);if(null===a)return null;const s=a[2],l=a[3]||"0",u=a[4]||"0",c=o.includePrerelease&&a[5]?`-${a[5]}`:"",p=o.includePrerelease&&a[6]?`+${a[6]}`:"";return t(`${s}.${l}.${u}${c}${p}`,o)},sN}(),$=px(),T=cx(),M=fx(),k=function(){if(NN)return bN;NN=1;const e=cx();return bN=(t,r)=>new e(t,r).set.map((e=>e.map((e=>e.value)).join(" ").trim().split(" "))),bN}(),P=function(){if(EN)return xN;EN=1;const e=JN(),t=cx();return xN=(r,n,i)=>{let o=null,a=null,s=null;try{s=new t(n,i)}catch(e){return null}return r.forEach((t=>{s.test(t)&&(o&&-1!==a.compare(t)||(o=t,a=new e(o,i)))})),o},xN}(),I=function(){if(AN)return SN;AN=1;const e=JN(),t=cx();return SN=(r,n,i)=>{let o=null,a=null,s=null;try{s=new t(n,i)}catch(e){return null}return r.forEach((t=>{s.test(t)&&(o&&1!==a.compare(t)||(o=t,a=new e(o,i)))})),o},SN}(),D=function(){if(TN)return $N;TN=1;const e=JN(),t=cx(),r=rx();return $N=(n,i)=>{n=new t(n,i);let o=new e("0.0.0");if(n.test(o))return o;if(o=new e("0.0.0-0"),n.test(o))return o;o=null;for(let t=0;t<n.set.length;++t){const i=n.set[t];let a=null;i.forEach((t=>{const n=new e(t.semver.version);switch(t.operator){case">":0===n.prerelease.length?n.patch++:n.prerelease.push(0),n.raw=n.format();case"":case">=":a&&!r(n,a)||(a=n);break;case"<":case"<=":break;default:throw new Error(`Unexpected operation: ${t.operator}`)}})),!a||o&&!r(o,a)||(o=a)}return o&&n.test(o)?o:null},$N}(),R=dx(),L=hx(),O=function(){if(RN)return DN;RN=1;const e=hx();return DN=(t,r,n)=>e(t,r,">",n),DN}(),C=function(){if(ON)return LN;ON=1;const e=hx();return LN=(t,r,n)=>e(t,r,"<",n),LN}(),V=function(){if(VN)return CN;VN=1;const e=cx();return CN=(t,r,n)=>(t=new e(t,n),r=new e(r,n),t.intersects(r,n))}(),j=function(){if(FN)return jN;FN=1;const e=fx(),t=ex();return jN=(r,n,i)=>{const o=[];let a=null,s=null;const l=r.sort(((e,r)=>t(e,r,i)));for(const t of l)e(t,n,i)?(s=t,a||(a=t)):(s&&o.push([a,s]),s=null,a=null);a&&o.push([a,null]);const u=[];for(const[e,t]of o)e===t?u.push(e):t||e!==l[0]?t?e===l[0]?u.push(`<=${t}`):u.push(`${e} - ${t}`):u.push(`>=${e}`):u.push("*");const c=u.join(" || "),p="string"==typeof n.raw?n.raw:String(n);return c.length<p.length?c:n},jN}(),F=function(){if(zN)return UN;zN=1;const e=cx(),t=px(),{ANY:r}=t,n=fx(),i=ex(),o=[new t(">=0.0.0-0")],a=[new t(">=0.0.0")],s=(e,t,s)=>{if(e===t)return!0;if(1===e.length&&e[0].semver===r){if(1===t.length&&t[0].semver===r)return!0;e=s.includePrerelease?o:a}if(1===t.length&&t[0].semver===r){if(s.includePrerelease)return!0;t=a}const c=new Set;let p,f,d,h,m,g,y;for(const t of e)">"===t.operator||">="===t.operator?p=l(p,t,s):"<"===t.operator||"<="===t.operator?f=u(f,t,s):c.add(t.semver);if(c.size>1)return null;if(p&&f){if(d=i(p.semver,f.semver,s),d>0)return null;if(0===d&&(">="!==p.operator||"<="!==f.operator))return null}for(const e of c){if(p&&!n(e,String(p),s))return null;if(f&&!n(e,String(f),s))return null;for(const r of t)if(!n(e,String(r),s))return!1;return!0}let v=!(!f||s.includePrerelease||!f.semver.prerelease.length)&&f.semver,w=!(!p||s.includePrerelease||!p.semver.prerelease.length)&&p.semver;v&&1===v.prerelease.length&&"<"===f.operator&&0===v.prerelease[0]&&(v=!1);for(const e of t){if(y=y||">"===e.operator||">="===e.operator,g=g||"<"===e.operator||"<="===e.operator,p)if(w&&e.semver.prerelease&&e.semver.prerelease.length&&e.semver.major===w.major&&e.semver.minor===w.minor&&e.semver.patch===w.patch&&(w=!1),">"===e.operator||">="===e.operator){if(h=l(p,e,s),h===e&&h!==p)return!1}else if(">="===p.operator&&!n(p.semver,String(e),s))return!1;if(f)if(v&&e.semver.prerelease&&e.semver.prerelease.length&&e.semver.major===v.major&&e.semver.minor===v.minor&&e.semver.patch===v.patch&&(v=!1),"<"===e.operator||"<="===e.operator){if(m=u(f,e,s),m===e&&m!==f)return!1}else if("<="===f.operator&&!n(f.semver,String(e),s))return!1;if(!e.operator&&(f||p)&&0!==d)return!1}return!(p&&g&&!f&&0!==d||f&&y&&!p&&0!==d||w||v)},l=(e,t,r)=>{if(!e)return t;const n=i(e.semver,t.semver,r);return n>0?e:n<0||">"===t.operator&&">="===e.operator?t:e},u=(e,t,r)=>{if(!e)return t;const n=i(e.semver,t.semver,r);return n<0?e:n>0||"<"===t.operator&&"<="===e.operator?t:e};return UN=(t,r,n={})=>{if(t===r)return!0;t=new e(t,n),r=new e(r,n);let i=!1;e:for(const e of t.set){for(const t of r.set){const r=s(e,t,n);if(i=i||null!==r,r)continue e}if(i)return!1}return!0}}();return qN={parse:i,valid:o,clean:a,inc:s,diff:l,major:u,minor:c,patch:p,prerelease:f,compare:d,rcompare:h,compareLoose:m,compareBuild:g,sort:y,rsort:v,gt:w,lt:_,eq:b,neq:N,gte:x,lte:E,cmp:S,coerce:A,Comparator:$,Range:T,satisfies:M,toComparators:k,maxSatisfying:P,minSatisfying:I,minVersion:D,validRange:R,outside:L,gtr:O,ltr:C,intersects:V,simplifyRange:j,subset:F,SemVer:r,re:e.re,src:e.src,tokens:e.t,SEMVER_SPEC_VERSION:t.SEMVER_SPEC_VERSION,RELEASE_TYPES:t.RELEASE_TYPES,compareIdentifiers:n.compareIdentifiers,rcompareIdentifiers:n.rcompareIdentifiers}}var gx,yx="5.1.0",vx={type:"object",properties:{privileges:{type:"array",description:"Defines required privileges for the visual",items:{$ref:"#/definitions/privilege"}},dataRoles:{type:"array",description:"Defines data roles for the visual",items:{$ref:"#/definitions/dataRole"}},dataViewMappings:{type:"array",description:"Defines data mappings for the visual",items:{$ref:"#/definitions/dataViewMapping"}},objects:{$ref:"#/definitions/objects"},tooltips:{$ref:"#/definitions/tooltips"},sorting:{$ref:"#/definitions/sorting"},drilldown:{$ref:"#/definitions/drilldown"},expandCollapse:{$ref:"#/definitions/expandCollapse"},suppressDefaultTitle:{type:"boolean",description:"Indicates whether the visual should show a default title"},supportsKeyboardFocus:{type:"boolean",description:"Allows the visual to receive focus through keyboard navigation"},supportsHighlight:{type:"boolean",description:"Tells the host to include highlight data"},supportsSynchronizingFilterState:{type:"boolean",description:"Indicates whether the visual supports synchronization across report pages (for slicer visuals only)"},advancedEditModeSupport:{type:"number",description:"Indicates the action requested from the host when this visual enters Advanced Edit mode."},supportsLandingPage:{type:"boolean",description:"Indicates whether the visual supports a landing page"},supportsEmptyDataView:{type:"boolean",description:"Indicates whether the visual can receive formatting pane properties when it has no dataroles"},supportsMultiVisualSelection:{type:"boolean",description:"Indicates whether the visual supports multi selection"},subtotals:{description:"Specifies the subtotal customizations applied in the customizeQuery method",$ref:"#/definitions/subtotals"},migration:{$ref:"#/definitions/migration"},keepAllMetadataColumns:{type:"boolean",description:"Indicates that visual is going to receive all metadata columns, no matter what the active projections are"}},required:["privileges"],additionalProperties:!1,definitions:{privilege:{type:"object",description:"privilege - Defines the name, essentiality, and optional parameters for a privilege",properties:{name:{type:"string",description:"The internal name of the privilege",enum:["WebAccess","LocalStorage","ExportContent"]},essential:{type:"boolean",description:"Determines if the privilege is essential for the visual. Default value is false"},parameters:{type:"array",description:"Determines a list of privilege parameters if any",items:{type:"string",description:"The privilege parameter"}}},required:["name"]},dataRole:{type:"object",description:"dataRole - Defines the name, displayName, and kind of a data role",properties:{name:{type:"string",description:"The internal name for this data role used for all references to this role"},displayName:{type:"string",description:"The name of this data role that is shown to the user"},displayNameKey:{type:"string",description:"The localization key for the displayed name in the stringResourced file"},kind:{description:"The kind of data that can be bound do this role",$ref:"#/definitions/dataRole.kind"},description:{type:"string",description:"A description of this role shown to the user as a tooltip"},descriptionKey:{type:"string",description:"The localization key for the description in the stringResourced file"},preferredTypes:{type:"array",description:"Defines the preferred type of data for this data role",items:{$ref:"#/definitions/valueType"}},requiredTypes:{type:"array",description:"Defines the required type of data for this data role. Any values that do not match will be set to null",items:{$ref:"#/definitions/valueType"}}},required:["name","displayName","kind"],additionalProperties:!1},dataViewMapping:{type:"object",description:"dataMapping - Defines how data is mapped to data roles",properties:{conditions:{type:"array",description:"List of conditions that must be met for this data mapping",items:{type:"object",description:"condition - Defines conditions for a data mapping (each key needs to be a valid data role)",patternProperties:{"^[\\w\\s-]+$":{description:"Specifies the number of values that can be assigned to this data role in this mapping",$ref:"#/definitions/dataViewMapping.numberRangeWithKind"}},additionalProperties:!1}},single:{$ref:"#/definitions/dataViewMapping.single"},categorical:{$ref:"#/definitions/dataViewMapping.categorical"},table:{$ref:"#/definitions/dataViewMapping.table"},matrix:{$ref:"#/definitions/dataViewMapping.matrix"},scriptResult:{$ref:"#/definitions/dataViewMapping.scriptResult"}},anyOf:[{required:["single"]},{required:["categorical"]},{required:["table"]},{required:["matrix"]},{required:["scriptResult"]}],additionalProperties:!1},"dataViewMapping.single":{type:"object",description:"single - Defines a single data mapping",properties:{role:{type:"string",description:"The data role to bind to this mapping"}},required:["role"],additionalProperties:!1},"dataViewMapping.categorical":{type:"object",description:"categorical - Defines a categorical data mapping",properties:{categories:{type:"object",description:"Defines data roles to be used as categories",properties:{bind:{$ref:"#/definitions/dataViewMapping.bindTo"},for:{$ref:"#/definitions/dataViewMapping.forIn"},select:{$ref:"#/definitions/dataViewMapping.select"},dataReductionAlgorithm:{$ref:"#/definitions/dataViewMapping.dataReductionAlgorithm"}},oneOf:[{required:["for"]},{required:["bind"]},{required:["select"]}]},values:{type:"object",description:"Defines data roles to be used as values",properties:{bind:{$ref:"#/definitions/dataViewMapping.bindTo"},for:{$ref:"#/definitions/dataViewMapping.forIn"},select:{$ref:"#/definitions/dataViewMapping.select"},group:{type:"object",description:"Groups on a a specific data role",properties:{by:{description:"Specifies a data role to use for grouping",type:"string"},select:{$ref:"#/definitions/dataViewMapping.select"},dataReductionAlgorithm:{$ref:"#/definitions/dataViewMapping.dataReductionAlgorithm"}},required:["by","select"]}},oneOf:[{required:["for"]},{required:["bind"]},{required:["select"]},{required:["group"]}]},dataVolume:{$ref:"#/definitions/dataViewMapping.dataVolume"}},additionalProperties:!1},"dataViewMapping.table":{type:"object",description:"table - Defines a table data mapping",properties:{rows:{type:"object",description:"Rows to use for the table",properties:{bind:{$ref:"#/definitions/dataViewMapping.bindTo"},for:{$ref:"#/definitions/dataViewMapping.forIn"},select:{$ref:"#/definitions/dataViewMapping.select"},dataReductionAlgorithm:{$ref:"#/definitions/dataViewMapping.dataReductionAlgorithm"}},oneOf:[{required:["for"]},{required:["bind"]},{required:["select"]}]},rowCount:{type:"object",description:"Specifies a constraint on the number of data rows supported by the visual",properties:{preferred:{description:"Specifies a preferred range of values for the constraint",$ref:"#/definitions/dataViewMapping.numberRange"},supported:{description:"Specifies a supported range of values for the constraint. Defaults to preferred if not specified.",$ref:"#/definitions/dataViewMapping.numberRange"}}},dataVolume:{$ref:"#/definitions/dataViewMapping.dataVolume"}},requires:["rows"]},"dataViewMapping.matrix":{type:"object",description:"matrix - Defines a matrix data mapping",properties:{rows:{type:"object",description:"Defines the rows used for the matrix",properties:{for:{$ref:"#/definitions/dataViewMapping.forIn"},select:{$ref:"#/definitions/dataViewMapping.select"},dataReductionAlgorithm:{$ref:"#/definitions/dataViewMapping.dataReductionAlgorithm"}},oneOf:[{required:["for"]},{required:["select"]}]},columns:{type:"object",description:"Defines the columns used for the matrix",properties:{for:{$ref:"#/definitions/dataViewMapping.forIn"},dataReductionAlgorithm:{$ref:"#/definitions/dataViewMapping.dataReductionAlgorithm"}},required:["for"]},values:{type:"object",description:"Defines the values used for the matrix",properties:{for:{$ref:"#/definitions/dataViewMapping.forIn"},select:{$ref:"#/definitions/dataViewMapping.select"}},oneOf:[{required:["for"]},{required:["select"]}]},dataVolume:{$ref:"#/definitions/dataViewMapping.dataVolume"}}},"dataViewMapping.scriptResult":{type:"object",description:"scriptResult - Defines a scriptResult data mapping",properties:{dataInput:{type:"object",description:"dataInput - Defines how data is mapped to data roles",properties:{table:{$ref:"#/definitions/dataViewMapping.table"}}},script:{type:"object",description:"script - Defines where the script text and provider are stored",properties:{scriptSourceDefault:{type:"string",description:"scriptSourceDefault - Defines the default script source value to be used when no script object is defined"},scriptProviderDefault:{type:"string",description:"scriptProviderDefault - Defines the default script provider value to be used when no provider object is defined"},scriptOutputType:{type:"string",description:"scriptOutputType - Defines the output type that the R script will generate"},source:{$ref:"#/definitions/dataViewObjectPropertyIdentifier"},provider:{$ref:"#/definitions/dataViewObjectPropertyIdentifier"}}}}},dataViewObjectPropertyIdentifier:{type:"object",description:"Points to an object property",properties:{objectName:{type:"string",description:"The name of a object"},propertyName:{type:"string",description:"The name of a property inside the object"}}},"dataViewMapping.bindTo":{type:"object",description:"Binds this data mapping to a single value",properties:{to:{type:"string",description:"The name of a data role to bind to"}},additionalProperties:!1,required:["to"]},"dataViewMapping.numberRange":{type:"object",description:"A number range from min to max",properties:{min:{type:"number",description:"Minimum value supported"},max:{type:"number",description:"Maximum value supported"}}},"dataViewMapping.numberRangeWithKind":{allOf:[{$ref:"#/definitions/dataViewMapping.numberRange"},{properties:{kind:{$ref:"#/definitions/dataRole.kind"}}}]},"dataRole.kind":{type:"string",enum:["Grouping","Measure","GroupingOrMeasure"]},"dataViewMapping.select":{type:"array",description:"Defines a list of properties to bind",items:{type:"object",properties:{bind:{$ref:"#/definitions/dataViewMapping.bindTo"},for:{$ref:"#/definitions/dataViewMapping.forIn"}},oneOf:[{required:["for"]},{required:["bind"]}]}},"dataViewMapping.dataReductionAlgorithm":{type:"object",description:"Describes how to reduce the amount of data exposed to the visual",properties:{top:{type:"object",description:"Reduce the data to the Top count items",properties:{count:{type:"number"}}},bottom:{type:"object",description:"Reduce the data to the Bottom count items",properties:{count:{type:"number"}}},sample:{type:"object",description:"Reduce the data using a simple Sample of count items",properties:{count:{type:"number"}}},window:{type:"object",description:"Allow the data to be loaded one window, containing count items, at a time",properties:{count:{type:"number"}}}},additionalProperties:!1,oneOf:[{required:["top"]},{required:["bottom"]},{required:["sample"]},{required:["window"]}]},"dataViewMapping.dataVolume":{description:"Specifies the volume of data the query should return (1-6)",type:"number",enum:[1,2,3,4,5,6]},"dataViewMapping.forIn":{type:"object",description:"Binds this data mapping for all items in a collection",properties:{in:{type:"string",description:"The name of a data role to iterate over"}},additionalProperties:!1,required:["in"]},objects:{type:"object",description:"A list of unique property groups",patternProperties:{"^[\\w\\s-]+$":{type:"object",description:"Settings for a group of properties",properties:{displayName:{type:"string",description:"The name shown to the user to describe this group of properties"},displayNameKey:{type:"string",description:"The localization key for the displayed name in the stringResourced file"},objectCategory:{type:"number",description:"What aspect of the visual this object controlls (1 = Formatting, 2 = Analytics). Formatting: look & feel, colors, axes, labels etc. Analytics: forcasts, trendlines, reference lines and shapes etc."},description:{type:"string",description:"A description of this object shown to the user as a tooltip"},descriptionKey:{type:"string",description:"The localization key for the description in the stringResourced file"},properties:{type:"object",description:"A list of unique properties contained in this group",patternProperties:{"^[\\w\\s-]+$":{$ref:"#/definitions/object.propertySettings"}},additionalProperties:!1}},additionalProperties:!1}},additionalProperties:!1},tooltips:{type:"object",description:"Instructs the host to include tooltips ability",properties:{supportedTypes:{type:"object",description:"Instructs the host what tooltip types to support",properties:{default:{type:"boolean",description:"Instructs the host to support showing default tooltips"},canvas:{type:"boolean",description:"Instructs the host to support showing canvas tooltips"}}},roles:{type:"array",items:{type:"string",description:"The name of the data role to bind the tooltips selected info to"}},supportEnhancedTooltips:{type:"boolean",description:"Indicates whether the visual support modern tooltip feature"}}},"object.propertySettings":{type:"object",description:"Settings for a property",properties:{displayName:{type:"string",description:"The name shown to the user to describe this property"},displayNameKey:{type:"string",description:"The localization key for the displayed name in the stringResourced file"},description:{type:"string",description:"A description of this property shown to the user as a tooltip"},descriptionKey:{type:"string",description:"The localization key for the description in the stringResourced file"},placeHolderText:{type:"string",description:"Text to display if the field is empty"},placeHolderTextKey:{type:"string",description:"The localization key for the placeHolderText in the stringResources file"},suppressFormatPainterCopy:{type:"boolean",description:"Indicates whether the Format Painter should ignore this property"},type:{description:"Describes what type of property this is and how it should be displayed to the user",$ref:"#/definitions/valueType"},rule:{type:"object",description:"Describes substitution rule that replaces property object, described inside the rule, to current property object that contains this rule",$ref:"#/definitions/substitutionRule"},filterState:{type:"boolean",description:"Indicates whether the property is a part of filtration information"}},additionalProperties:!1},substitutionRule:{type:"object",description:"Describes substitution rule that replaces property object, described inside the rule, to current property object that contains this rule",properties:{inputRole:{type:"string",description:"The name of role. If this role is set, the substitution will be applied"},output:{type:"object",description:"Describes what exactly is necessary to replace",properties:{property:{type:"string",description:"The name of property object that will be replaced"},selector:{type:"array",description:"The array of selector names. Usually, it contains only one selector -- 'Category'",items:{type:"string",description:"The name of selector"}}}}}},sorting:{type:"object",description:"Specifies the default sorting behavior for the visual",properties:{default:{type:"object",additionalProperties:!1},custom:{type:"object",additionalProperties:!1},implicit:{type:"object",description:"implicit sort",properties:{clauses:{type:"array",items:{type:"object",properties:{role:{type:"string"},direction:{type:"number",description:"Determines sort direction (1 = Ascending, 2 = Descending)",enum:[1,2]}},additionalProperties:!1}}},additionalProperties:!1}},additionalProperties:!1,anyOf:[{required:["default"]},{required:["custom"]},{required:["implicit"]}]},drilldown:{type:"object",description:"Defines the visual's drill capability",properties:{roles:{type:"array",description:"The drillable role names for this visual",items:{type:"string",description:"The name of the role"}}}},expandCollapse:{type:"object",description:"Defines the visual's expandCollapse capability",properties:{roles:{type:"array",description:"The expandCollapsed role names for this visual",items:{type:"string",description:"The name of the role"}},addDataViewFlags:{type:"object",description:"The data view flags",defaultValue:{type:"boolean",description:"Indicates if the DataViewTreeNode will contain the isCollapsed flag by default"}},supportsMerge:{type:"boolean",description:"Indicates that the expansion state should be updated when query projections change, instead of being reset."},restoreProjectionsOrderFromBookmark:{type:"boolean",description:"Indicates that the bookmarked expansion state should be restored even if the query projections order no longer matches the expansion state levels."}}},valueType:{type:"object",properties:{bool:{type:"boolean",description:"A boolean value that will be displayed to the user as a toggle switch"},enumeration:{type:"array",description:"A list of values that will be displayed as a drop down list",items:{type:"object",description:"Describes an item in the enumeration list",properties:{displayName:{type:"string",description:"The name shown to the user to describe this item"},displayNameKey:{type:"string",description:"The localization key for the displayed name in the stringResourced file"},value:{type:"string",description:"The internal value of this property when this item is selected"}}}},fill:{type:"object",description:"A color value that will be displayed to the user as a color picker",properties:{solid:{type:"object",description:"A solid color value that will be displayed to the user as a color picker",properties:{color:{oneOf:[{type:"boolean"},{type:"object",properties:{nullable:{description:"Allows the user to select 'no fill' for the color",type:"boolean"}}}]}}}}},fillRule:{type:"object",description:"A color gradient that will be dispalyed to the user as a minimum (,medium) and maximum color pickers",properties:{linearGradient2:{type:"object",description:"Two color gradient",properties:{max:{type:"object",description:"Maximum color for gradient",properties:{color:{type:"string"},value:{type:"number"}}},min:{type:"object",description:"Minimum color for gradient",properties:{color:{type:"string"},value:{type:"number"}}},nullColoringStrategy:{type:"object",description:"Null color strategy"}}},linearGradient3:{type:"object",description:"Three color gradient",properties:{max:{type:"object",description:"Maximum color for gradient",properties:{color:{type:"string"},value:{type:"number"}}},min:{type:"object",description:"Minimum color for gradient",properties:{color:{type:"string"},value:{type:"number"}}},mid:{type:"object",description:"Middle color for gradient",properties:{color:{type:"string"},value:{type:"number"}}},nullColoringStrategy:{type:"object",description:"Null color strategy"}}}}},formatting:{type:"object",description:"A numeric value that will be displayed to the user as a text input",properties:{labelDisplayUnits:{type:"boolean",description:"Displays a dropdown with common display units (Auto, None, Thousands, Millions, Billions, Trillions)"},alignment:{type:"boolean",description:"Displays a selector to allow the user to choose left, center, or right alignment"},fontSize:{type:"boolean",description:"Displays a slider that allows the user to choose a font size in points"},fontFamily:{type:"boolean",description:"Displays a dropdown with font families"},formatString:{type:"boolean",description:"Displays dynamic format string"}},additionalProperties:!1,oneOf:[{required:["labelDisplayUnits"]},{required:["alignment"]},{required:["fontSize"]},{required:["fontFamily"]},{required:["formatString"]}]},integer:{type:"boolean",description:"An integer (whole number) value that will be displayed to the user as a text input"},numeric:{type:"boolean",description:"A numeric value that will be displayed to the user as a text input"},filter:{oneOf:[{type:"boolean"},{type:"object",properties:{selfFilter:{type:"boolean"}}}],description:"A filter"},operations:{type:"object",description:"A visual operation",properties:{searchEnabled:{type:"boolean",description:"Turns search ability on"}}},text:{type:"boolean",description:"A text value that will be displayed to the user as a text input"},scripting:{type:"object",description:"A text value that will be displayed to the user as a script",properties:{source:{type:"boolean",description:"A source code"}}},geography:{type:"object",description:"Geographical data",properties:{address:{type:"boolean"},city:{type:"boolean"},continent:{type:"boolean"},country:{type:"boolean"},county:{type:"boolean"},region:{type:"boolean"},postalCode:{type:"boolean"},stateOrProvince:{type:"boolean"},place:{type:"boolean"},latitude:{type:"boolean"},longitude:{type:"boolean"}}}},additionalProperties:!1,oneOf:[{required:["bool"]},{required:["enumeration"]},{required:["fill"]},{required:["fillRule"]},{required:["formatting"]},{required:["integer"]},{required:["numeric"]},{required:["text"]},{required:["geography"]},{required:["scripting"]},{required:["filter"]},{required:["operations"]}]},subtotals:{type:"object",description:"Specifies the subtotal request customizations applied to the outgoing data query",properties:{matrix:{description:"Defines the subtotal customizations of the outgoing data query of a matrix-dataview visual",$ref:"#/definitions/subtotals.matrix"}},requires:["matrix"]},"subtotals.matrix":{type:"object",description:"Specifies the subtotal customizations of the outgoing data query of a matrix-dataview visual",properties:{rowSubtotals:{type:"object",description:"Indicates if the subtotal data should be requested for all fields in the rows field well",properties:{propertyIdentifier:{type:"object",properties:{objectName:{type:"string"},propertyName:{type:"string"}}},defaultValue:{type:"boolean"}}},rowSubtotalsPerLevel:{type:"object",description:"Indicates if the subtotal data can be toggled for individual fields in the rows field well",properties:{propertyIdentifier:{type:"object",properties:{objectName:{type:"string"},propertyName:{type:"string"}}},defaultValue:{type:"boolean"}}},columnSubtotals:{type:"object",description:"Indicates if the subtotal data should be requested for all fields in the columns field well",properties:{propertyIdentifier:{type:"object",properties:{objectName:{type:"string"},propertyName:{type:"string"}}},defaultValue:{type:"boolean"}}},columnSubtotalsPerLevel:{type:"object",description:"Indicates if the subtotal data can be toggled for individual fields in the columns field well",properties:{propertyIdentifier:{type:"object",properties:{objectName:{type:"string"},propertyName:{type:"string"}}},defaultValue:{type:"boolean"}}},levelSubtotalEnabled:{type:"object",description:"Unlike all other properites, this property is applied to individual rows/columns. The property indicates if the subtotals are requested for the row/column",properties:{propertyIdentifier:{type:"object",properties:{objectName:{type:"string"},propertyName:{type:"string"}}},defaultValue:{type:"boolean"}}},rowSubtotalsType:{type:"object",description:"Indicates location of row subtotals locations (Top, Bottom). Top means subtotals located at the start of datasource and calculated even before all datasource rows fetched, Bottom means subtotals located at the end of datasource and shown only after all rows are fetched",properties:{propertyIdentifier:{type:"object",properties:{objectName:{type:"string"},propertyName:{type:"string"}}},defaultValue:{type:"string",enum:["Top","Bottom"]}}}},requires:["matrix"]},migration:{type:"object",description:"Defines the supported APIs for migration",properties:{filter:{$ref:"#/definitions/migration.filter"}}},"migration.filter":{type:"object",description:"Defines the capabilities for migrating the filter API",properties:{shouldUseIdentityFilter:{type:"boolean",description:"Indicates whether the new filter should migrate to an identity filter"}}}}},wx={type:"object",properties:{apiVersion:{type:"string",description:"Version of the IVisual API"},author:{type:"object",description:"Information about the author of the visual",properties:{name:{type:"string",description:"Name of the visual author. This is displayed to users."},email:{type:"string",description:"E-mail of the visual author. This is displayed to users for support."}}},assets:{type:"object",description:"Assets used by the visual",properties:{icon:{type:"string",description:"A 20x20 png icon used to represent the visual"}}},externalJS:{type:"array",description:"An array of relative paths to 3rd party javascript libraries to load",items:{type:"string"}},stringResources:{type:"array",description:"An array of relative paths to string resources to load",items:{type:"string"},uniqueItems:!0},style:{type:"string",description:"Relative path to the stylesheet (less) for the visual"},capabilities:{type:"string",description:"Relative path to the visual capabilities json file"},visual:{type:"object",description:"Details about this visual",properties:{description:{type:"string",description:"What does this visual do?"},name:{type:"string",description:"Internal visual name"},displayName:{type:"string",description:"A friendly name"},externals:{type:"array",description:"External files (such as JavaScript) that you would like to include"},guid:{type:"string",description:"Unique identifier for the visual"},visualClassName:{type:"string",description:"Class of your IVisual"},icon:{type:"string",description:"Icon path"},version:{type:"string",description:"Visual version"},gitHubUrl:{type:"string",description:"Url to the github repository for this visual"},supportUrl:{type:"string",description:"Url to the support page for this visual"}}}}},_x={type:"object",properties:{cranPackages:{type:"array",description:"An array of the Cran packages required for the custom R visual script to operate",items:{$ref:"#/definitions/cranPackage"}}},definitions:{cranPackage:{type:"object",description:"cranPackage - Defines the name and displayName of a required Cran package",properties:{name:{type:"string",description:"The name for this Cran package"},displayName:{type:"string",description:"The name for this Cran package that is shown to the user"},url:{type:"string",description:"A url for package documentation in Cran website"}},required:["name","url"],additionalProperties:!1}}},bx={type:"object",properties:{locale:{$ref:"#/definitions/localeOptions"},values:{type:"object",description:"translations for the display name keys in the capabilities",additionalProperties:{type:"string"}}},required:["locale"],definitions:{localeOptions:{description:"Specifies the locale key from a list of supported locales",type:"string",enum:["ar-SA","bg-BG","ca-ES","cs-CZ","da-DK","de-DE","el-GR","en-US","es-ES","et-EE","eu-ES","fi-FI","fr-FR","gl-ES","he-IL","hi-IN","hr-HR","hu-HU","id-ID","it-IT","ja-JP","kk-KZ","ko-KR","lt-LT","lv-LV","ms-MY","nb-NO","nl-NL","pl-PL","pt-BR","pt-PT","ro-RO","ru-RU","sk-SK","sl-SI","sr-Cyrl-RS","sr-Latn-RS","sv-SE","th-TH","tr-TR","uk-UA","vi-VN","zh-CN","zh-TW"]}}};!function(){if(gx)return HN;gx=1;const e=mx();let t=yx,r=`${e.major(t)}.${e.minor(t)}.0`;HN.version=r,HN.schemas={capabilities:vx,pbiviz:wx,dependencies:_x,stringResources:bx}}();class Nx{update(e){const t=e.funnel.chart_type,r=["PR"].includes(t),n=e.funnel.perc_labels;let i,o=e.funnel.multiplier;"Yes"===n&&(o=100),r&&(o=1===o?100:o),i="Automatic"===n?r&&100===o:"Yes"===n,this.multiplier=o,this.percentLabels=i}}class xx{update(e){this.validationStatus=JSON.parse(JSON.stringify({status:0,messages:new Array,error:""}));Object.keys(this.settings).forEach((t=>{const r=i_(null==e?void 0:e.categorical,t,this.settings);0!==r.validation.status&&(this.validationStatus.status=r.validation.status,this.validationStatus.error=r.validation.error),0===this.validationStatus.messages.length?this.validationStatus.messages=r.validation.messages:r.validation.messages.every((e=>0===e.length))||r.validation.messages.forEach(((e,t)=>{e.length>0&&(this.validationStatus.messages[t]=this.validationStatus.messages[t].concat(e))}));Object.keys(this.settings[t]).forEach((e=>{this.settings[t][e]=(null==r?void 0:r.values)?null==r?void 0:r.values[0][e]:yn[t][e].default}))})),this.derivedSettings.update(this.settings)}getFormattingModel(){var e,t;const r={cards:[]};for(const n in mn){let i={description:mn[n].description,displayName:mn[n].displayName,uid:n+"_card_uid",groups:[],revertToDefaultDescriptors:[]};for(const r in mn[n].settingsGroups){let o={displayName:"all"===r?mn[n].displayName:r,uid:n+"_"+r+"_uid",slices:[]};for(const a in mn[n].settingsGroups[r]){i.revertToDefaultDescriptors.push({objectName:n,propertyName:a});let s={uid:n+"_"+r+"_"+a+"_slice_uid",displayName:mn[n].settingsGroups[r][a].displayName,control:{type:mn[n].settingsGroups[r][a].type,properties:{descriptor:{objectName:n,propertyName:a,selector:{data:[{dataViewWildcard:{matchingOption:0}}]},instanceKind:"boolean"!=typeof this.settings[n][a]?3:null},value:this.valueLookup(n,r,a),items:null===(e=mn[n].settingsGroups[r][a])||void 0===e?void 0:e.items,options:null===(t=mn[n].settingsGroups[r][a])||void 0===t?void 0:t.options}}};o.slices.push(s)}i.groups.push(o)}r.cards.push(i)}return r}valueLookup(e,t,r){var n;if(r.includes("colour"))return{value:this.settings[e][r]};if(!n_(null===(n=mn[e].settingsGroups[t][r])||void 0===n?void 0:n.items)){const n=mn[e].settingsGroups[t][r].items,i=this.settings[e][r];return n.find((e=>e.value===i))}return this.settings[e][r]}constructor(){this.settings=Object.fromEntries(Object.keys(yn).map((e=>[e,Object.fromEntries(Object.keys(yn[e]).map((t=>[t,yn[e][t]])))]))),this.derivedSettings=new Nx}}return e.Visual=class{constructor(e){this.svg=ue(e.element).append("svg"),this.host=e.host,this.viewModel=new ob,this.plotProperties=new j_,this.selectionManager=this.host.createSelectionManager(),this.selectionManager.registerOnSelectCallback((()=>this.updateHighlighting())),this.svg.call(P_)}update(e){var t,r,n,i,o;try{this.host.eventService.renderingStarted(e),this.svg.select(".errormessage").remove();const a=this.viewModel.update(e,this.host);if(!a.status)return this.resizeCanvas(e.viewport.width,e.viewport.height),null===(o=null===(i=null===(n=null===(r=null===(t=this.viewModel)||void 0===t?void 0:t.inputSettings)||void 0===r?void 0:r.settings)||void 0===n?void 0:n.canvas)||void 0===i?void 0:i.show_errors)||void 0===o||o?this.svg.call(I_,e,null==a?void 0:a.error,null==a?void 0:a.type):this.svg.call(P_,!0),void this.host.eventService.renderingFailed(e);this.plotProperties.update(e,this.viewModel),a.warning&&this.host.displayWarningIcon("Invalid inputs or settings ignored.\n",a.warning),this.resizeCanvas(e.viewport.width,e.viewport.height),this.drawVisual(),this.adjustPaddingForOverflow(),this.updateHighlighting(),this.host.eventService.renderingFinished(e)}catch(t){this.svg.call(I_,e,t.message,"internal"),console.error(t),this.host.eventService.renderingFailed(e)}}resizeCanvas(e,t){this.svg.attr("width",e).attr("height",t)}updateHighlighting(){const e=!!this.viewModel.inputData&&this.viewModel.inputData.anyHighlights,t=this.selectionManager.getSelectionIds(),r=this.svg.selectAll(".dotsgroup").selectChildren(),n=this.svg.selectAll(".linesgroup").selectChildren();n.style("stroke-opacity",(e=>c_(e[0],"lines","opacity",this.viewModel.inputSettings.settings))),r.style("fill-opacity",(e=>e.aesthetics.opacity)),r.style("stroke-opacity",(e=>e.aesthetics.opacity)),(e||t.length>0)&&(n.style("stroke-opacity",(e=>c_(e[0],"lines","opacity_unselected",this.viewModel.inputSettings.settings))),r.nodes().forEach((e=>{const t=ue(e).datum(),r=function(e,t){const r=t.getSelectionIds();var n=!1;for(const t of r)if(Array.isArray(e)){for(const r of e)if(t===r){n=!0;break}}else if(t===e){n=!0;break}return n}(t.identity,this.selectionManager),n=t.highlighted,i=r||n?t.aesthetics.opacity_selected:t.aesthetics.opacity_unselected;ue(e).style("fill-opacity",i),ue(e).style("stroke-opacity",i)})))}drawVisual(){this.svg.call(M_,this).call(k_,this).call(T_,this).call($_,this).call(C_,this).call(x_,this).call(vn,this).call(D_,this)}adjustPaddingForOverflow(){if(this.viewModel.headless)return;const e=this.viewModel.svgWidth,t=this.viewModel.svgHeight,r=this.svg.node().getBBox(),n=Math.abs(Math.min(0,r.x)),i=Math.max(0,r.width+r.x-e),o=Math.abs(Math.min(0,r.y)),a=Math.max(0,r.height+r.y-t);n>0&&(this.plotProperties.xAxis.start_padding+=n+this.plotProperties.xAxis.start_padding),i>0&&(this.plotProperties.xAxis.end_padding+=i+this.plotProperties.xAxis.end_padding),o>0&&(this.plotProperties.yAxis.end_padding+=o+this.plotProperties.yAxis.end_padding),a>0&&(this.plotProperties.yAxis.start_padding+=a+this.plotProperties.yAxis.start_padding),(n>0||i>0||o>0||a>0)&&(this.plotProperties.initialiseScale(e,t),this.drawVisual())}getFormattingModel(){return this.viewModel.inputSettings.getFormattingModel()}},e.d3=an,e.defaultSettings=yn,e}({});
