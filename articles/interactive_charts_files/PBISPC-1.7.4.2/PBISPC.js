var spc=function(t){"use strict";var e="http://www.w3.org/1999/xhtml",i={svg:"http://www.w3.org/2000/svg",xhtml:e,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function r(t){var e=t+="",r=e.indexOf(":");return r>=0&&"xmlns"!==(e=t.slice(0,r))&&(t=t.slice(r+1)),i.hasOwnProperty(e)?{space:i[e],local:t}:t}function a(t){return function(){var i=this.ownerDocument,r=this.namespaceURI;return r===e&&i.documentElement.namespaceURI===e?i.createElement(t):i.createElementNS(r,t)}}function n(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}function o(t){var e=r(t);return(e.local?n:a)(e)}function l(){}function s(t){return null==t?l:function(){return this.querySelector(t)}}function u(t){return null==t?[]:Array.isArray(t)?t:Array.from(t)}function p(){return[]}function d(t){return function(e){return e.matches(t)}}var c=Array.prototype.find;function f(){return this.firstElementChild}var h=Array.prototype.filter;function m(){return Array.from(this.children)}function y(t){return new Array(t.length)}function g(t,e){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.__data__=e}function v(t,e,i,r,a,n){for(var o,l=0,s=e.length,u=n.length;l<u;++l)(o=e[l])?(o.__data__=n[l],r[l]=o):i[l]=new g(t,n[l]);for(;l<s;++l)(o=e[l])&&(a[l]=o)}function _(t,e,i,r,a,n,o){var l,s,u,p=new Map,d=e.length,c=n.length,f=new Array(d);for(l=0;l<d;++l)(s=e[l])&&(f[l]=u=o.call(s,s.__data__,l,e)+"",p.has(u)?a[l]=s:p.set(u,s));for(l=0;l<c;++l)u=o.call(t,n[l],l,n)+"",(s=p.get(u))?(r[l]=s,s.__data__=n[l],p.delete(u)):i[l]=new g(t,n[l]);for(l=0;l<d;++l)(s=e[l])&&p.get(f[l])===s&&(a[l]=s)}function w(t){return t.__data__}function b(t){return"object"==typeof t&&"length"in t?t:Array.from(t)}function N(t,e){return t<e?-1:t>e?1:t>=e?0:NaN}function x(t){return function(){this.removeAttribute(t)}}function S(t){return function(){this.removeAttributeNS(t.space,t.local)}}function k(t,e){return function(){this.setAttribute(t,e)}}function A(t,e){return function(){this.setAttributeNS(t.space,t.local,e)}}function F(t,e){return function(){var i=e.apply(this,arguments);null==i?this.removeAttribute(t):this.setAttribute(t,i)}}function E(t,e){return function(){var i=e.apply(this,arguments);null==i?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,i)}}function M(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView}function T(t){return function(){this.style.removeProperty(t)}}function $(t,e,i){return function(){this.style.setProperty(t,e,i)}}function D(t,e,i){return function(){var r=e.apply(this,arguments);null==r?this.style.removeProperty(t):this.style.setProperty(t,r,i)}}function L(t){return function(){delete this[t]}}function C(t,e){return function(){this[t]=e}}function P(t,e){return function(){var i=e.apply(this,arguments);null==i?delete this[t]:this[t]=i}}function I(t){return t.trim().split(/^|\s+/)}function V(t){return t.classList||new R(t)}function R(t){this._node=t,this._names=I(t.getAttribute("class")||"")}function O(t,e){for(var i=V(t),r=-1,a=e.length;++r<a;)i.add(e[r])}function j(t,e){for(var i=V(t),r=-1,a=e.length;++r<a;)i.remove(e[r])}function U(t){return function(){O(this,t)}}function G(t){return function(){j(this,t)}}function z(t,e){return function(){(e.apply(this,arguments)?O:j)(this,t)}}function B(){this.textContent=""}function q(t){return function(){this.textContent=t}}function H(t){return function(){var e=t.apply(this,arguments);this.textContent=null==e?"":e}}function Z(){this.innerHTML=""}function Y(t){return function(){this.innerHTML=t}}function W(t){return function(){var e=t.apply(this,arguments);this.innerHTML=null==e?"":e}}function X(){this.nextSibling&&this.parentNode.appendChild(this)}function K(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function J(){return null}function Q(){var t=this.parentNode;t&&t.removeChild(this)}function tt(){var t=this.cloneNode(!1),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function et(){var t=this.cloneNode(!0),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function it(t){return function(){var e=this.__on;if(e){for(var i,r=0,a=-1,n=e.length;r<n;++r)i=e[r],t.type&&i.type!==t.type||i.name!==t.name?e[++a]=i:this.removeEventListener(i.type,i.listener,i.options);++a?e.length=a:delete this.__on}}}function rt(t,e,i){return function(){var r,a=this.__on,n=function(t){return function(e){t.call(this,e,this.__data__)}}(e);if(a)for(var o=0,l=a.length;o<l;++o)if((r=a[o]).type===t.type&&r.name===t.name)return this.removeEventListener(r.type,r.listener,r.options),this.addEventListener(r.type,r.listener=n,r.options=i),void(r.value=e);this.addEventListener(t.type,n,i),r={type:t.type,name:t.name,value:e,listener:n,options:i},a?a.push(r):this.__on=[r]}}function at(t,e,i){var r=M(t),a=r.CustomEvent;"function"==typeof a?a=new a(e,i):(a=r.document.createEvent("Event"),i?(a.initEvent(e,i.bubbles,i.cancelable),a.detail=i.detail):a.initEvent(e,!1,!1)),t.dispatchEvent(a)}function nt(t,e){return function(){return at(this,t,e)}}function ot(t,e){return function(){return at(this,t,e.apply(this,arguments))}}g.prototype={constructor:g,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,e){return this._parent.insertBefore(t,e)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}},R.prototype={add:function(t){this._names.indexOf(t)<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")))},remove:function(t){var e=this._names.indexOf(t);e>=0&&(this._names.splice(e,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(t){return this._names.indexOf(t)>=0}};var lt=[null];function st(t,e){this._groups=t,this._parents=e}function ut(t){return"string"==typeof t?new st([[document.querySelector(t)]],[document.documentElement]):new st([[t]],lt)}function pt(t,e){if(t=function(t){let e;for(;e=t.sourceEvent;)t=e;return t}(t),void 0===e&&(e=t.currentTarget),e){var i=e.ownerSVGElement||e;if(i.createSVGPoint){var r=i.createSVGPoint();return r.x=t.clientX,r.y=t.clientY,[(r=r.matrixTransform(e.getScreenCTM().inverse())).x,r.y]}if(e.getBoundingClientRect){var a=e.getBoundingClientRect();return[t.clientX-a.left-e.clientLeft,t.clientY-a.top-e.clientTop]}}return[t.pageX,t.pageY]}function dt(t){return function(){return t}}st.prototype={constructor:st,select:function(t){"function"!=typeof t&&(t=s(t));for(var e=this._groups,i=e.length,r=new Array(i),a=0;a<i;++a)for(var n,o,l=e[a],u=l.length,p=r[a]=new Array(u),d=0;d<u;++d)(n=l[d])&&(o=t.call(n,n.__data__,d,l))&&("__data__"in n&&(o.__data__=n.__data__),p[d]=o);return new st(r,this._parents)},selectAll:function(t){t="function"==typeof t?function(t){return function(){return u(t.apply(this,arguments))}}(t):function(t){return null==t?p:function(){return this.querySelectorAll(t)}}(t);for(var e=this._groups,i=e.length,r=[],a=[],n=0;n<i;++n)for(var o,l=e[n],s=l.length,d=0;d<s;++d)(o=l[d])&&(r.push(t.call(o,o.__data__,d,l)),a.push(o));return new st(r,a)},selectChild:function(t){return this.select(null==t?f:function(t){return function(){return c.call(this.children,t)}}("function"==typeof t?t:d(t)))},selectChildren:function(t){return this.selectAll(null==t?m:function(t){return function(){return h.call(this.children,t)}}("function"==typeof t?t:d(t)))},filter:function(t){"function"!=typeof t&&(t=function(t){return function(){return this.matches(t)}}(t));for(var e=this._groups,i=e.length,r=new Array(i),a=0;a<i;++a)for(var n,o=e[a],l=o.length,s=r[a]=[],u=0;u<l;++u)(n=o[u])&&t.call(n,n.__data__,u,o)&&s.push(n);return new st(r,this._parents)},data:function(t,e){if(!arguments.length)return Array.from(this,w);var i=e?_:v,r=this._parents,a=this._groups;"function"!=typeof t&&(t=function(t){return function(){return t}}(t));for(var n=a.length,o=new Array(n),l=new Array(n),s=new Array(n),u=0;u<n;++u){var p=r[u],d=a[u],c=d.length,f=b(t.call(p,p&&p.__data__,u,r)),h=f.length,m=l[u]=new Array(h),y=o[u]=new Array(h);i(p,d,m,y,s[u]=new Array(c),f,e);for(var g,N,x=0,S=0;x<h;++x)if(g=m[x]){for(x>=S&&(S=x+1);!(N=y[S])&&++S<h;);g._next=N||null}}return(o=new st(o,r))._enter=l,o._exit=s,o},enter:function(){return new st(this._enter||this._groups.map(y),this._parents)},exit:function(){return new st(this._exit||this._groups.map(y),this._parents)},join:function(t,e,i){var r=this.enter(),a=this,n=this.exit();return"function"==typeof t?(r=t(r))&&(r=r.selection()):r=r.append(t+""),null!=e&&(a=e(a))&&(a=a.selection()),null==i?n.remove():i(n),r&&a?r.merge(a).order():a},merge:function(t){for(var e=t.selection?t.selection():t,i=this._groups,r=e._groups,a=i.length,n=r.length,o=Math.min(a,n),l=new Array(a),s=0;s<o;++s)for(var u,p=i[s],d=r[s],c=p.length,f=l[s]=new Array(c),h=0;h<c;++h)(u=p[h]||d[h])&&(f[h]=u);for(;s<a;++s)l[s]=i[s];return new st(l,this._parents)},selection:function(){return this},order:function(){for(var t=this._groups,e=-1,i=t.length;++e<i;)for(var r,a=t[e],n=a.length-1,o=a[n];--n>=0;)(r=a[n])&&(o&&4^r.compareDocumentPosition(o)&&o.parentNode.insertBefore(r,o),o=r);return this},sort:function(t){function e(e,i){return e&&i?t(e.__data__,i.__data__):!e-!i}t||(t=N);for(var i=this._groups,r=i.length,a=new Array(r),n=0;n<r;++n){for(var o,l=i[n],s=l.length,u=a[n]=new Array(s),p=0;p<s;++p)(o=l[p])&&(u[p]=o);u.sort(e)}return new st(a,this._parents).order()},call:function(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this},nodes:function(){return Array.from(this)},node:function(){for(var t=this._groups,e=0,i=t.length;e<i;++e)for(var r=t[e],a=0,n=r.length;a<n;++a){var o=r[a];if(o)return o}return null},size:function(){let t=0;for(const e of this)++t;return t},empty:function(){return!this.node()},each:function(t){for(var e=this._groups,i=0,r=e.length;i<r;++i)for(var a,n=e[i],o=0,l=n.length;o<l;++o)(a=n[o])&&t.call(a,a.__data__,o,n);return this},attr:function(t,e){var i=r(t);if(arguments.length<2){var a=this.node();return i.local?a.getAttributeNS(i.space,i.local):a.getAttribute(i)}return this.each((null==e?i.local?S:x:"function"==typeof e?i.local?E:F:i.local?A:k)(i,e))},style:function(t,e,i){return arguments.length>1?this.each((null==e?T:"function"==typeof e?D:$)(t,e,null==i?"":i)):function(t,e){return t.style.getPropertyValue(e)||M(t).getComputedStyle(t,null).getPropertyValue(e)}(this.node(),t)},property:function(t,e){return arguments.length>1?this.each((null==e?L:"function"==typeof e?P:C)(t,e)):this.node()[t]},classed:function(t,e){var i=I(t+"");if(arguments.length<2){for(var r=V(this.node()),a=-1,n=i.length;++a<n;)if(!r.contains(i[a]))return!1;return!0}return this.each(("function"==typeof e?z:e?U:G)(i,e))},text:function(t){return arguments.length?this.each(null==t?B:("function"==typeof t?H:q)(t)):this.node().textContent},html:function(t){return arguments.length?this.each(null==t?Z:("function"==typeof t?W:Y)(t)):this.node().innerHTML},raise:function(){return this.each(X)},lower:function(){return this.each(K)},append:function(t){var e="function"==typeof t?t:o(t);return this.select((function(){return this.appendChild(e.apply(this,arguments))}))},insert:function(t,e){var i="function"==typeof t?t:o(t),r=null==e?J:"function"==typeof e?e:s(e);return this.select((function(){return this.insertBefore(i.apply(this,arguments),r.apply(this,arguments)||null)}))},remove:function(){return this.each(Q)},clone:function(t){return this.select(t?et:tt)},datum:function(t){return arguments.length?this.property("__data__",t):this.node().__data__},on:function(t,e,i){var r,a,n=function(t){return t.trim().split(/^|\s+/).map((function(t){var e="",i=t.indexOf(".");return i>=0&&(e=t.slice(i+1),t=t.slice(0,i)),{type:t,name:e}}))}(t+""),o=n.length;if(!(arguments.length<2)){for(l=e?rt:it,r=0;r<o;++r)this.each(l(n[r],e,i));return this}var l=this.node().__on;if(l)for(var s,u=0,p=l.length;u<p;++u)for(r=0,s=l[u];r<o;++r)if((a=n[r]).type===s.type&&a.name===s.name)return s.value},dispatch:function(t,e){return this.each(("function"==typeof e?ot:nt)(t,e))},[Symbol.iterator]:function*(){for(var t=this._groups,e=0,i=t.length;e<i;++e)for(var r,a=t[e],n=0,o=a.length;n<o;++n)(r=a[n])&&(yield r)}};const ct=Math.cos,ft=Math.min,ht=Math.sin,mt=Math.sqrt,yt=Math.PI,gt=2*yt,vt=Math.PI,_t=2*vt,wt=1e-6,bt=_t-wt;function Nt(t){this._+=t[0];for(let e=1,i=t.length;e<i;++e)this._+=arguments[e]+t[e]}class xt{constructor(t){this._x0=this._y0=this._x1=this._y1=null,this._="",this._append=null==t?Nt:function(t){let e=Math.floor(t);if(!(e>=0))throw new Error(`invalid digits: ${t}`);if(e>15)return Nt;const i=10**e;return function(t){this._+=t[0];for(let e=1,r=t.length;e<r;++e)this._+=Math.round(arguments[e]*i)/i+t[e]}}(t)}moveTo(t,e){this._append`M${this._x0=this._x1=+t},${this._y0=this._y1=+e}`}closePath(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._append`Z`)}lineTo(t,e){this._append`L${this._x1=+t},${this._y1=+e}`}quadraticCurveTo(t,e,i,r){this._append`Q${+t},${+e},${this._x1=+i},${this._y1=+r}`}bezierCurveTo(t,e,i,r,a,n){this._append`C${+t},${+e},${+i},${+r},${this._x1=+a},${this._y1=+n}`}arcTo(t,e,i,r,a){if(t=+t,e=+e,i=+i,r=+r,(a=+a)<0)throw new Error(`negative radius: ${a}`);let n=this._x1,o=this._y1,l=i-t,s=r-e,u=n-t,p=o-e,d=u*u+p*p;if(null===this._x1)this._append`M${this._x1=t},${this._y1=e}`;else if(d>wt)if(Math.abs(p*l-s*u)>wt&&a){let c=i-n,f=r-o,h=l*l+s*s,m=c*c+f*f,y=Math.sqrt(h),g=Math.sqrt(d),v=a*Math.tan((vt-Math.acos((h+d-m)/(2*y*g)))/2),_=v/g,w=v/y;Math.abs(_-1)>wt&&this._append`L${t+_*u},${e+_*p}`,this._append`A${a},${a},0,0,${+(p*c>u*f)},${this._x1=t+w*l},${this._y1=e+w*s}`}else this._append`L${this._x1=t},${this._y1=e}`;else;}arc(t,e,i,r,a,n){if(t=+t,e=+e,n=!!n,(i=+i)<0)throw new Error(`negative radius: ${i}`);let o=i*Math.cos(r),l=i*Math.sin(r),s=t+o,u=e+l,p=1^n,d=n?r-a:a-r;null===this._x1?this._append`M${s},${u}`:(Math.abs(this._x1-s)>wt||Math.abs(this._y1-u)>wt)&&this._append`L${s},${u}`,i&&(d<0&&(d=d%_t+_t),d>bt?this._append`A${i},${i},0,1,${p},${t-o},${e-l}A${i},${i},0,1,${p},${this._x1=s},${this._y1=u}`:d>wt&&this._append`A${i},${i},0,${+(d>=vt)},${p},${this._x1=t+i*Math.cos(a)},${this._y1=e+i*Math.sin(a)}`)}rect(t,e,i,r){this._append`M${this._x0=this._x1=+t},${this._y0=this._y1=+e}h${i=+i}v${+r}h${-i}Z`}toString(){return this._}}function St(t){let e=3;return t.digits=function(i){if(!arguments.length)return e;if(null==i)e=null;else{const t=Math.floor(i);if(!(t>=0))throw new RangeError(`invalid digits: ${i}`);e=t}return t},()=>new xt(e)}function kt(t){this._context=t}function At(t){return new kt(t)}function Ft(t){return t[0]}function Et(t){return t[1]}function Mt(t,e){var i=dt(!0),r=null,a=At,n=null,o=St(l);function l(l){var s,u,p,d=(l=function(t){return"object"==typeof t&&"length"in t?t:Array.from(t)}(l)).length,c=!1;for(null==r&&(n=a(p=o())),s=0;s<=d;++s)!(s<d&&i(u=l[s],s,l))===c&&((c=!c)?n.lineStart():n.lineEnd()),c&&n.point(+t(u,s,l),+e(u,s,l));if(p)return n=null,p+""||null}return t="function"==typeof t?t:void 0===t?Ft:dt(t),e="function"==typeof e?e:void 0===e?Et:dt(e),l.x=function(e){return arguments.length?(t="function"==typeof e?e:dt(+e),l):t},l.y=function(t){return arguments.length?(e="function"==typeof t?t:dt(+t),l):e},l.defined=function(t){return arguments.length?(i="function"==typeof t?t:dt(!!t),l):i},l.curve=function(t){return arguments.length?(a=t,null!=r&&(n=a(r)),l):a},l.context=function(t){return arguments.length?(null==t?r=n=null:n=a(r=t),l):r},l}kt.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,e){switch(t=+t,e=+e,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,e):this._context.moveTo(t,e);break;case 1:this._point=2;default:this._context.lineTo(t,e)}}};const Tt=mt(3);var $t={draw(t,e){const i=.59436*mt(e+ft(e/28,.75)),r=i/2,a=r*Tt;t.moveTo(0,i),t.lineTo(0,-i),t.moveTo(-a,-r),t.lineTo(a,r),t.moveTo(-a,r),t.lineTo(a,-r)}},Dt={draw(t,e){const i=mt(e/yt);t.moveTo(i,0),t.arc(0,0,i,0,gt)}},Lt={draw(t,e){const i=mt(e/5)/2;t.moveTo(-3*i,-i),t.lineTo(-i,-i),t.lineTo(-i,-3*i),t.lineTo(i,-3*i),t.lineTo(i,-i),t.lineTo(3*i,-i),t.lineTo(3*i,i),t.lineTo(i,i),t.lineTo(i,3*i),t.lineTo(-i,3*i),t.lineTo(-i,i),t.lineTo(-3*i,i),t.closePath()}};const Ct=mt(1/3),Pt=2*Ct;var It={draw(t,e){const i=mt(e/Pt),r=i*Ct;t.moveTo(0,-i),t.lineTo(r,0),t.lineTo(0,i),t.lineTo(-r,0),t.closePath()}},Vt={draw(t,e){const i=mt(e),r=-i/2;t.rect(r,r,i,i)}};const Rt=ht(yt/10)/ht(7*yt/10),Ot=ht(gt/10)*Rt,jt=-ct(gt/10)*Rt;var Ut={draw(t,e){const i=mt(.8908130915292852*e),r=Ot*i,a=jt*i;t.moveTo(0,-i),t.lineTo(r,a);for(let e=1;e<5;++e){const n=gt*e/5,o=ct(n),l=ht(n);t.lineTo(l*i,-o*i),t.lineTo(o*r-l*a,l*r+o*a)}t.closePath()}};const Gt=mt(3);var zt={draw(t,e){const i=-mt(e/(3*Gt));t.moveTo(0,2*i),t.lineTo(-Gt*i,-i),t.lineTo(Gt*i,-i),t.closePath()}};const Bt=-.5,qt=mt(3)/2,Ht=1/mt(12),Zt=3*(Ht/2+1);var Yt={draw(t,e){const i=mt(e/Zt),r=i/2,a=i*Ht,n=r,o=i*Ht+i,l=-n,s=o;t.moveTo(r,a),t.lineTo(n,o),t.lineTo(l,s),t.lineTo(Bt*r-qt*a,qt*r+Bt*a),t.lineTo(Bt*n-qt*o,qt*n+Bt*o),t.lineTo(Bt*l-qt*s,qt*l+Bt*s),t.lineTo(Bt*r+qt*a,Bt*a-qt*r),t.lineTo(Bt*n+qt*o,Bt*o-qt*n),t.lineTo(Bt*l+qt*s,Bt*s-qt*l),t.closePath()}};function Wt(t,e){let i=null,r=St(a);function a(){let a;if(i||(i=a=r()),t.apply(this,arguments).draw(i,+e.apply(this,arguments)),a)return i=null,a+""||null}return t="function"==typeof t?t:dt(t||Dt),e="function"==typeof e?e:dt(void 0===e?64:+e),a.type=function(e){return arguments.length?(t="function"==typeof e?e:dt(e),a):t},a.size=function(t){return arguments.length?(e="function"==typeof t?t:dt(+t),a):e},a.context=function(t){return arguments.length?(i=null==t?null:t,a):i},a}function Xt(t){return t}var Kt=1e-6;function Jt(t){return"translate("+t+",0)"}function Qt(t){return"translate(0,"+t+")"}function te(t){return e=>+t(e)}function ee(t,e){return e=Math.max(0,t.bandwidth()-2*e)/2,t.round()&&(e=Math.round(e)),i=>+t(i)+e}function ie(){return!this.__axis}function re(t,e){var i=[],r=null,a=null,n=6,o=6,l=3,s="undefined"!=typeof window&&window.devicePixelRatio>1?0:.5,u=1===t||4===t?-1:1,p=4===t||2===t?"x":"y",d=1===t||3===t?Jt:Qt;function c(c){var f=null==r?e.ticks?e.ticks.apply(e,i):e.domain():r,h=null==a?e.tickFormat?e.tickFormat.apply(e,i):Xt:a,m=Math.max(n,0)+l,y=e.range(),g=+y[0]+s,v=+y[y.length-1]+s,_=(e.bandwidth?ee:te)(e.copy(),s),w=c.selection?c.selection():c,b=w.selectAll(".domain").data([null]),N=w.selectAll(".tick").data(f,e).order(),x=N.exit(),S=N.enter().append("g").attr("class","tick"),k=N.select("line"),A=N.select("text");b=b.merge(b.enter().insert("path",".tick").attr("class","domain").attr("stroke","currentColor")),N=N.merge(S),k=k.merge(S.append("line").attr("stroke","currentColor").attr(p+"2",u*n)),A=A.merge(S.append("text").attr("fill","currentColor").attr(p,u*m).attr("dy",1===t?"0em":3===t?"0.71em":"0.32em")),c!==w&&(b=b.transition(c),N=N.transition(c),k=k.transition(c),A=A.transition(c),x=x.transition(c).attr("opacity",Kt).attr("transform",(function(t){return isFinite(t=_(t))?d(t+s):this.getAttribute("transform")})),S.attr("opacity",Kt).attr("transform",(function(t){var e=this.parentNode.__axis;return d((e&&isFinite(e=e(t))?e:_(t))+s)}))),x.remove(),b.attr("d",4===t||2===t?o?"M"+u*o+","+g+"H"+s+"V"+v+"H"+u*o:"M"+s+","+g+"V"+v:o?"M"+g+","+u*o+"V"+s+"H"+v+"V"+u*o:"M"+g+","+s+"H"+v),N.attr("opacity",1).attr("transform",(function(t){return d(_(t)+s)})),k.attr(p+"2",u*n),A.attr(p,u*m).text(h),w.filter(ie).attr("fill","none").attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor",2===t?"start":4===t?"end":"middle"),w.each((function(){this.__axis=_}))}return c.scale=function(t){return arguments.length?(e=t,c):e},c.ticks=function(){return i=Array.from(arguments),c},c.tickArguments=function(t){return arguments.length?(i=null==t?[]:Array.from(t),c):i.slice()},c.tickValues=function(t){return arguments.length?(r=null==t?null:Array.from(t),c):r&&r.slice()},c.tickFormat=function(t){return arguments.length?(a=t,c):a},c.tickSize=function(t){return arguments.length?(n=o=+t,c):n},c.tickSizeInner=function(t){return arguments.length?(n=+t,c):n},c.tickSizeOuter=function(t){return arguments.length?(o=+t,c):o},c.tickPadding=function(t){return arguments.length?(l=+t,c):l},c.offset=function(t){return arguments.length?(s=+t,c):s},c}function ae(t){return re(3,t)}function ne(t){return re(4,t)}function oe(t,e){return null==t||null==e?NaN:t<e?-1:t>e?1:t>=e?0:NaN}function le(t,e){return null==t||null==e?NaN:e<t?-1:e>t?1:e>=t?0:NaN}function se(t){let e,i,r;function a(t,r,a=0,n=t.length){if(a<n){if(0!==e(r,r))return n;do{const e=a+n>>>1;i(t[e],r)<0?a=e+1:n=e}while(a<n)}return a}return 2!==t.length?(e=oe,i=(e,i)=>oe(t(e),i),r=(e,i)=>t(e)-i):(e=t===oe||t===le?t:ue,i=t,r=t),{left:a,center:function(t,e,i=0,n=t.length){const o=a(t,e,i,n-1);return o>i&&r(t[o-1],e)>-r(t[o],e)?o-1:o},right:function(t,r,a=0,n=t.length){if(a<n){if(0!==e(r,r))return n;do{const e=a+n>>>1;i(t[e],r)<=0?a=e+1:n=e}while(a<n)}return a}}}function ue(){return 0}const pe=se(oe).right;function de(t,e){return(null==t||!(t>=t))-(null==e||!(e>=e))||(t<e?-1:t>e?1:0)}se((function(t){return null===t?NaN:+t})).center;const ce=Math.sqrt(50),fe=Math.sqrt(10),he=Math.sqrt(2);function me(t,e,i){const r=(e-t)/Math.max(0,i),a=Math.floor(Math.log10(r)),n=r/Math.pow(10,a),o=n>=ce?10:n>=fe?5:n>=he?2:1;let l,s,u;return a<0?(u=Math.pow(10,-a)/o,l=Math.round(t*u),s=Math.round(e*u),l/u<t&&++l,s/u>e&&--s,u=-u):(u=Math.pow(10,a)*o,l=Math.round(t/u),s=Math.round(e/u),l*u<t&&++l,s*u>e&&--s),s<l&&.5<=i&&i<2?me(t,e,2*i):[l,s,u]}function ye(t,e,i){return me(t=+t,e=+e,i=+i)[2]}function ge(t,e){let i;for(const e of t)null!=e&&(i<e||void 0===i&&e>=e)&&(i=e);return i}function ve(t,e){let i;for(const e of t)null!=e&&(i>e||void 0===i&&e>=e)&&(i=e);return i}function _e(t,e,i=0,r=1/0,a){if(e=Math.floor(e),i=Math.floor(Math.max(0,i)),r=Math.floor(Math.min(t.length-1,r)),!(i<=e&&e<=r))return t;for(a=void 0===a?de:function(t=oe){if(t===oe)return de;if("function"!=typeof t)throw new TypeError("compare is not a function");return(e,i)=>{const r=t(e,i);return r||0===r?r:(0===t(i,i))-(0===t(e,e))}}(a);r>i;){if(r-i>600){const n=r-i+1,o=e-i+1,l=Math.log(n),s=.5*Math.exp(2*l/3),u=.5*Math.sqrt(l*s*(n-s)/n)*(o-n/2<0?-1:1);_e(t,e,Math.max(i,Math.floor(e-o*s/n+u)),Math.min(r,Math.floor(e+(n-o)*s/n+u)),a)}const n=t[e];let o=i,l=r;for(we(t,i,e),a(t[r],n)>0&&we(t,i,r);o<l;){for(we(t,o,l),++o,--l;a(t[o],n)<0;)++o;for(;a(t[l],n)>0;)--l}0===a(t[i],n)?we(t,i,l):(++l,we(t,l,r)),l<=e&&(i=l+1),e<=l&&(r=l-1)}return t}function we(t,e,i){const r=t[e];t[e]=t[i],t[i]=r}function be(t,e){let i=0,r=0;for(let e of t)null!=e&&(e=+e)>=e&&(++i,r+=e);if(i)return r/i}function Ne(t,e){return function(t,e){if((i=(t=Float64Array.from(function*(t){for(let e of t)null!=e&&(e=+e)>=e&&(yield e)}(t))).length)&&!isNaN(e=+e)){if(e<=0||i<2)return ve(t);if(e>=1)return ge(t);var i,r=(i-1)*e,a=Math.floor(r),n=ge(_e(t,a).subarray(0,a+1));return n+(ve(t.subarray(a+1))-n)*(r-a)}}(t,.5)}function xe(t,e){let i=0;for(let e of t)(e=+e)&&(i+=e);return i}function Se(t,e){switch(arguments.length){case 0:break;case 1:this.range(t);break;default:this.range(e).domain(t)}return this}function ke(t,e,i){t.prototype=e.prototype=i,i.constructor=t}function Ae(t,e){var i=Object.create(t.prototype);for(var r in e)i[r]=e[r];return i}function Fe(){}var Ee=.7,Me=1/Ee,Te="\\s*([+-]?\\d+)\\s*",$e="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",De="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",Le=/^#([0-9a-f]{3,8})$/,Ce=new RegExp(`^rgb\\(${Te},${Te},${Te}\\)$`),Pe=new RegExp(`^rgb\\(${De},${De},${De}\\)$`),Ie=new RegExp(`^rgba\\(${Te},${Te},${Te},${$e}\\)$`),Ve=new RegExp(`^rgba\\(${De},${De},${De},${$e}\\)$`),Re=new RegExp(`^hsl\\(${$e},${De},${De}\\)$`),Oe=new RegExp(`^hsla\\(${$e},${De},${De},${$e}\\)$`),je={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};function Ue(){return this.rgb().formatHex()}function Ge(){return this.rgb().formatRgb()}function ze(t){var e,i;return t=(t+"").trim().toLowerCase(),(e=Le.exec(t))?(i=e[1].length,e=parseInt(e[1],16),6===i?Be(e):3===i?new Ze(e>>8&15|e>>4&240,e>>4&15|240&e,(15&e)<<4|15&e,1):8===i?qe(e>>24&255,e>>16&255,e>>8&255,(255&e)/255):4===i?qe(e>>12&15|e>>8&240,e>>8&15|e>>4&240,e>>4&15|240&e,((15&e)<<4|15&e)/255):null):(e=Ce.exec(t))?new Ze(e[1],e[2],e[3],1):(e=Pe.exec(t))?new Ze(255*e[1]/100,255*e[2]/100,255*e[3]/100,1):(e=Ie.exec(t))?qe(e[1],e[2],e[3],e[4]):(e=Ve.exec(t))?qe(255*e[1]/100,255*e[2]/100,255*e[3]/100,e[4]):(e=Re.exec(t))?Qe(e[1],e[2]/100,e[3]/100,1):(e=Oe.exec(t))?Qe(e[1],e[2]/100,e[3]/100,e[4]):je.hasOwnProperty(t)?Be(je[t]):"transparent"===t?new Ze(NaN,NaN,NaN,0):null}function Be(t){return new Ze(t>>16&255,t>>8&255,255&t,1)}function qe(t,e,i,r){return r<=0&&(t=e=i=NaN),new Ze(t,e,i,r)}function He(t,e,i,r){return 1===arguments.length?((a=t)instanceof Fe||(a=ze(a)),a?new Ze((a=a.rgb()).r,a.g,a.b,a.opacity):new Ze):new Ze(t,e,i,null==r?1:r);var a}function Ze(t,e,i,r){this.r=+t,this.g=+e,this.b=+i,this.opacity=+r}function Ye(){return`#${Je(this.r)}${Je(this.g)}${Je(this.b)}`}function We(){const t=Xe(this.opacity);return`${1===t?"rgb(":"rgba("}${Ke(this.r)}, ${Ke(this.g)}, ${Ke(this.b)}${1===t?")":`, ${t})`}`}function Xe(t){return isNaN(t)?1:Math.max(0,Math.min(1,t))}function Ke(t){return Math.max(0,Math.min(255,Math.round(t)||0))}function Je(t){return((t=Ke(t))<16?"0":"")+t.toString(16)}function Qe(t,e,i,r){return r<=0?t=e=i=NaN:i<=0||i>=1?t=e=NaN:e<=0&&(t=NaN),new ei(t,e,i,r)}function ti(t){if(t instanceof ei)return new ei(t.h,t.s,t.l,t.opacity);if(t instanceof Fe||(t=ze(t)),!t)return new ei;if(t instanceof ei)return t;var e=(t=t.rgb()).r/255,i=t.g/255,r=t.b/255,a=Math.min(e,i,r),n=Math.max(e,i,r),o=NaN,l=n-a,s=(n+a)/2;return l?(o=e===n?(i-r)/l+6*(i<r):i===n?(r-e)/l+2:(e-i)/l+4,l/=s<.5?n+a:2-n-a,o*=60):l=s>0&&s<1?0:o,new ei(o,l,s,t.opacity)}function ei(t,e,i,r){this.h=+t,this.s=+e,this.l=+i,this.opacity=+r}function ii(t){return(t=(t||0)%360)<0?t+360:t}function ri(t){return Math.max(0,Math.min(1,t||0))}function ai(t,e,i){return 255*(t<60?e+(i-e)*t/60:t<180?i:t<240?e+(i-e)*(240-t)/60:e)}ke(Fe,ze,{copy(t){return Object.assign(new this.constructor,this,t)},displayable(){return this.rgb().displayable()},hex:Ue,formatHex:Ue,formatHex8:function(){return this.rgb().formatHex8()},formatHsl:function(){return ti(this).formatHsl()},formatRgb:Ge,toString:Ge}),ke(Ze,He,Ae(Fe,{brighter(t){return t=null==t?Me:Math.pow(Me,t),new Ze(this.r*t,this.g*t,this.b*t,this.opacity)},darker(t){return t=null==t?Ee:Math.pow(Ee,t),new Ze(this.r*t,this.g*t,this.b*t,this.opacity)},rgb(){return this},clamp(){return new Ze(Ke(this.r),Ke(this.g),Ke(this.b),Xe(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:Ye,formatHex:Ye,formatHex8:function(){return`#${Je(this.r)}${Je(this.g)}${Je(this.b)}${Je(255*(isNaN(this.opacity)?1:this.opacity))}`},formatRgb:We,toString:We})),ke(ei,(function(t,e,i,r){return 1===arguments.length?ti(t):new ei(t,e,i,null==r?1:r)}),Ae(Fe,{brighter(t){return t=null==t?Me:Math.pow(Me,t),new ei(this.h,this.s,this.l*t,this.opacity)},darker(t){return t=null==t?Ee:Math.pow(Ee,t),new ei(this.h,this.s,this.l*t,this.opacity)},rgb(){var t=this.h%360+360*(this.h<0),e=isNaN(t)||isNaN(this.s)?0:this.s,i=this.l,r=i+(i<.5?i:1-i)*e,a=2*i-r;return new Ze(ai(t>=240?t-240:t+120,a,r),ai(t,a,r),ai(t<120?t+240:t-120,a,r),this.opacity)},clamp(){return new ei(ii(this.h),ri(this.s),ri(this.l),Xe(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const t=Xe(this.opacity);return`${1===t?"hsl(":"hsla("}${ii(this.h)}, ${100*ri(this.s)}%, ${100*ri(this.l)}%${1===t?")":`, ${t})`}`}}));var ni=t=>()=>t;function oi(t){return 1==(t=+t)?li:function(e,i){return i-e?function(t,e,i){return t=Math.pow(t,i),e=Math.pow(e,i)-t,i=1/i,function(r){return Math.pow(t+r*e,i)}}(e,i,t):ni(isNaN(e)?i:e)}}function li(t,e){var i=e-t;return i?function(t,e){return function(i){return t+i*e}}(t,i):ni(isNaN(t)?e:t)}var si=function t(e){var i=oi(e);function r(t,e){var r=i((t=He(t)).r,(e=He(e)).r),a=i(t.g,e.g),n=i(t.b,e.b),o=li(t.opacity,e.opacity);return function(e){return t.r=r(e),t.g=a(e),t.b=n(e),t.opacity=o(e),t+""}}return r.gamma=t,r}(1);function ui(t,e){e||(e=[]);var i,r=t?Math.min(e.length,t.length):0,a=e.slice();return function(n){for(i=0;i<r;++i)a[i]=t[i]*(1-n)+e[i]*n;return a}}function pi(t,e){var i,r=e?e.length:0,a=t?Math.min(r,t.length):0,n=new Array(a),o=new Array(r);for(i=0;i<a;++i)n[i]=gi(t[i],e[i]);for(;i<r;++i)o[i]=e[i];return function(t){for(i=0;i<a;++i)o[i]=n[i](t);return o}}function di(t,e){var i=new Date;return t=+t,e=+e,function(r){return i.setTime(t*(1-r)+e*r),i}}function ci(t,e){return t=+t,e=+e,function(i){return t*(1-i)+e*i}}function fi(t,e){var i,r={},a={};for(i in null!==t&&"object"==typeof t||(t={}),null!==e&&"object"==typeof e||(e={}),e)i in t?r[i]=gi(t[i],e[i]):a[i]=e[i];return function(t){for(i in r)a[i]=r[i](t);return a}}var hi=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,mi=new RegExp(hi.source,"g");function yi(t,e){var i,r,a,n=hi.lastIndex=mi.lastIndex=0,o=-1,l=[],s=[];for(t+="",e+="";(i=hi.exec(t))&&(r=mi.exec(e));)(a=r.index)>n&&(a=e.slice(n,a),l[o]?l[o]+=a:l[++o]=a),(i=i[0])===(r=r[0])?l[o]?l[o]+=r:l[++o]=r:(l[++o]=null,s.push({i:o,x:ci(i,r)})),n=mi.lastIndex;return n<e.length&&(a=e.slice(n),l[o]?l[o]+=a:l[++o]=a),l.length<2?s[0]?function(t){return function(e){return t(e)+""}}(s[0].x):function(t){return function(){return t}}(e):(e=s.length,function(t){for(var i,r=0;r<e;++r)l[(i=s[r]).i]=i.x(t);return l.join("")})}function gi(t,e){var i,r=typeof e;return null==e||"boolean"===r?ni(e):("number"===r?ci:"string"===r?(i=ze(e))?(e=i,si):yi:e instanceof ze?si:e instanceof Date?di:function(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)}(e)?ui:Array.isArray(e)?pi:"function"!=typeof e.valueOf&&"function"!=typeof e.toString||isNaN(e)?fi:ci)(t,e)}function vi(t,e){return t=+t,e=+e,function(i){return Math.round(t*(1-i)+e*i)}}function _i(t){return+t}var wi=[0,1];function bi(t){return t}function Ni(t,e){return(e-=t=+t)?function(i){return(i-t)/e}:function(t){return function(){return t}}(isNaN(e)?NaN:.5)}function xi(t,e,i){var r=t[0],a=t[1],n=e[0],o=e[1];return a<r?(r=Ni(a,r),n=i(o,n)):(r=Ni(r,a),n=i(n,o)),function(t){return n(r(t))}}function Si(t,e,i){var r=Math.min(t.length,e.length)-1,a=new Array(r),n=new Array(r),o=-1;for(t[r]<t[0]&&(t=t.slice().reverse(),e=e.slice().reverse());++o<r;)a[o]=Ni(t[o],t[o+1]),n[o]=i(e[o],e[o+1]);return function(e){var i=pe(t,e,1,r)-1;return n[i](a[i](e))}}function ki(){var t,e,i,r,a,n,o=wi,l=wi,s=gi,u=bi;function p(){var t=Math.min(o.length,l.length);return u!==bi&&(u=function(t,e){var i;return t>e&&(i=t,t=e,e=i),function(i){return Math.max(t,Math.min(e,i))}}(o[0],o[t-1])),r=t>2?Si:xi,a=n=null,d}function d(e){return null==e||isNaN(e=+e)?i:(a||(a=r(o.map(t),l,s)))(t(u(e)))}return d.invert=function(i){return u(e((n||(n=r(l,o.map(t),ci)))(i)))},d.domain=function(t){return arguments.length?(o=Array.from(t,_i),p()):o.slice()},d.range=function(t){return arguments.length?(l=Array.from(t),p()):l.slice()},d.rangeRound=function(t){return l=Array.from(t),s=vi,p()},d.clamp=function(t){return arguments.length?(u=!!t||bi,p()):u!==bi},d.interpolate=function(t){return arguments.length?(s=t,p()):s},d.unknown=function(t){return arguments.length?(i=t,d):i},function(i,r){return t=i,e=r,p()}}function Ai(t,e){if((i=(t=e?t.toExponential(e-1):t.toExponential()).indexOf("e"))<0)return null;var i,r=t.slice(0,i);return[r.length>1?r[0]+r.slice(2):r,+t.slice(i+1)]}function Fi(t){return(t=Ai(Math.abs(t)))?t[1]:NaN}var Ei,Mi=/^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function Ti(t){if(!(e=Mi.exec(t)))throw new Error("invalid format: "+t);var e;return new $i({fill:e[1],align:e[2],sign:e[3],symbol:e[4],zero:e[5],width:e[6],comma:e[7],precision:e[8]&&e[8].slice(1),trim:e[9],type:e[10]})}function $i(t){this.fill=void 0===t.fill?" ":t.fill+"",this.align=void 0===t.align?">":t.align+"",this.sign=void 0===t.sign?"-":t.sign+"",this.symbol=void 0===t.symbol?"":t.symbol+"",this.zero=!!t.zero,this.width=void 0===t.width?void 0:+t.width,this.comma=!!t.comma,this.precision=void 0===t.precision?void 0:+t.precision,this.trim=!!t.trim,this.type=void 0===t.type?"":t.type+""}function Di(t,e){var i=Ai(t,e);if(!i)return t+"";var r=i[0],a=i[1];return a<0?"0."+new Array(-a).join("0")+r:r.length>a+1?r.slice(0,a+1)+"."+r.slice(a+1):r+new Array(a-r.length+2).join("0")}Ti.prototype=$i.prototype,$i.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(void 0===this.width?"":Math.max(1,0|this.width))+(this.comma?",":"")+(void 0===this.precision?"":"."+Math.max(0,0|this.precision))+(this.trim?"~":"")+this.type};var Li={"%":(t,e)=>(100*t).toFixed(e),b:t=>Math.round(t).toString(2),c:t=>t+"",d:function(t){return Math.abs(t=Math.round(t))>=1e21?t.toLocaleString("en").replace(/,/g,""):t.toString(10)},e:(t,e)=>t.toExponential(e),f:(t,e)=>t.toFixed(e),g:(t,e)=>t.toPrecision(e),o:t=>Math.round(t).toString(8),p:(t,e)=>Di(100*t,e),r:Di,s:function(t,e){var i=Ai(t,e);if(!i)return t+"";var r=i[0],a=i[1],n=a-(Ei=3*Math.max(-8,Math.min(8,Math.floor(a/3))))+1,o=r.length;return n===o?r:n>o?r+new Array(n-o+1).join("0"):n>0?r.slice(0,n)+"."+r.slice(n):"0."+new Array(1-n).join("0")+Ai(t,Math.max(0,e+n-1))[0]},X:t=>Math.round(t).toString(16).toUpperCase(),x:t=>Math.round(t).toString(16)};function Ci(t){return t}var Pi,Ii,Vi,Ri=Array.prototype.map,Oi=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];function ji(t){var e,i,r=void 0===t.grouping||void 0===t.thousands?Ci:(e=Ri.call(t.grouping,Number),i=t.thousands+"",function(t,r){for(var a=t.length,n=[],o=0,l=e[0],s=0;a>0&&l>0&&(s+l+1>r&&(l=Math.max(1,r-s)),n.push(t.substring(a-=l,a+l)),!((s+=l+1)>r));)l=e[o=(o+1)%e.length];return n.reverse().join(i)}),a=void 0===t.currency?"":t.currency[0]+"",n=void 0===t.currency?"":t.currency[1]+"",o=void 0===t.decimal?".":t.decimal+"",l=void 0===t.numerals?Ci:function(t){return function(e){return e.replace(/[0-9]/g,(function(e){return t[+e]}))}}(Ri.call(t.numerals,String)),s=void 0===t.percent?"%":t.percent+"",u=void 0===t.minus?"−":t.minus+"",p=void 0===t.nan?"NaN":t.nan+"";function d(t){var e=(t=Ti(t)).fill,i=t.align,d=t.sign,c=t.symbol,f=t.zero,h=t.width,m=t.comma,y=t.precision,g=t.trim,v=t.type;"n"===v?(m=!0,v="g"):Li[v]||(void 0===y&&(y=12),g=!0,v="g"),(f||"0"===e&&"="===i)&&(f=!0,e="0",i="=");var _="$"===c?a:"#"===c&&/[boxX]/.test(v)?"0"+v.toLowerCase():"",w="$"===c?n:/[%p]/.test(v)?s:"",b=Li[v],N=/[defgprs%]/.test(v);function x(t){var a,n,s,c=_,x=w;if("c"===v)x=b(t)+x,t="";else{var S=(t=+t)<0||1/t<0;if(t=isNaN(t)?p:b(Math.abs(t),y),g&&(t=function(t){t:for(var e,i=t.length,r=1,a=-1;r<i;++r)switch(t[r]){case".":a=e=r;break;case"0":0===a&&(a=r),e=r;break;default:if(!+t[r])break t;a>0&&(a=0)}return a>0?t.slice(0,a)+t.slice(e+1):t}(t)),S&&0==+t&&"+"!==d&&(S=!1),c=(S?"("===d?d:u:"-"===d||"("===d?"":d)+c,x=("s"===v?Oi[8+Ei/3]:"")+x+(S&&"("===d?")":""),N)for(a=-1,n=t.length;++a<n;)if(48>(s=t.charCodeAt(a))||s>57){x=(46===s?o+t.slice(a+1):t.slice(a))+x,t=t.slice(0,a);break}}m&&!f&&(t=r(t,1/0));var k=c.length+t.length+x.length,A=k<h?new Array(h-k+1).join(e):"";switch(m&&f&&(t=r(A+t,A.length?h-x.length:1/0),A=""),i){case"<":t=c+t+x+A;break;case"=":t=c+A+t+x;break;case"^":t=A.slice(0,k=A.length>>1)+c+t+x+A.slice(k);break;default:t=A+c+t+x}return l(t)}return y=void 0===y?6:/[gprs]/.test(v)?Math.max(1,Math.min(21,y)):Math.max(0,Math.min(20,y)),x.toString=function(){return t+""},x}return{format:d,formatPrefix:function(t,e){var i=d(((t=Ti(t)).type="f",t)),r=3*Math.max(-8,Math.min(8,Math.floor(Fi(e)/3))),a=Math.pow(10,-r),n=Oi[8+r/3];return function(t){return i(a*t)+n}}}}function Ui(t,e,i,r){var a,n=function(t,e,i){i=+i;const r=(e=+e)<(t=+t),a=r?ye(e,t,i):ye(t,e,i);return(r?-1:1)*(a<0?1/-a:a)}(t,e,i);switch((r=Ti(null==r?",f":r)).type){case"s":var o=Math.max(Math.abs(t),Math.abs(e));return null!=r.precision||isNaN(a=function(t,e){return Math.max(0,3*Math.max(-8,Math.min(8,Math.floor(Fi(e)/3)))-Fi(Math.abs(t)))}(n,o))||(r.precision=a),Vi(r,o);case"":case"e":case"g":case"p":case"r":null!=r.precision||isNaN(a=function(t,e){return t=Math.abs(t),e=Math.abs(e)-t,Math.max(0,Fi(e)-Fi(t))+1}(n,Math.max(Math.abs(t),Math.abs(e))))||(r.precision=a-("e"===r.type));break;case"f":case"%":null!=r.precision||isNaN(a=function(t){return Math.max(0,-Fi(Math.abs(t)))}(n))||(r.precision=a-2*("%"===r.type))}return Ii(r)}function Gi(t){var e=t.domain;return t.ticks=function(t){var i=e();return function(t,e,i){if(!((i=+i)>0))return[];if((t=+t)==(e=+e))return[t];const r=e<t,[a,n,o]=r?me(e,t,i):me(t,e,i);if(!(n>=a))return[];const l=n-a+1,s=new Array(l);if(r)if(o<0)for(let t=0;t<l;++t)s[t]=(n-t)/-o;else for(let t=0;t<l;++t)s[t]=(n-t)*o;else if(o<0)for(let t=0;t<l;++t)s[t]=(a+t)/-o;else for(let t=0;t<l;++t)s[t]=(a+t)*o;return s}(i[0],i[i.length-1],null==t?10:t)},t.tickFormat=function(t,i){var r=e();return Ui(r[0],r[r.length-1],null==t?10:t,i)},t.nice=function(i){null==i&&(i=10);var r,a,n=e(),o=0,l=n.length-1,s=n[o],u=n[l],p=10;for(u<s&&(a=s,s=u,u=a,a=o,o=l,l=a);p-- >0;){if((a=ye(s,u,i))===r)return n[o]=s,n[l]=u,e(n);if(a>0)s=Math.floor(s/a)*a,u=Math.ceil(u/a)*a;else{if(!(a<0))break;s=Math.ceil(s*a)/a,u=Math.floor(u*a)/a}r=a}return t},t}function zi(){var t=ki()(bi,bi);return t.copy=function(){return e=t,zi().domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());var e},Se.apply(t,arguments),Gi(t)}Pi=ji({thousands:",",grouping:[3],currency:["$",""]}),Ii=Pi.format,Vi=Pi.formatPrefix;var Bi={value:()=>{}};function qi(){for(var t,e=0,i=arguments.length,r={};e<i;++e){if(!(t=arguments[e]+"")||t in r||/[\s.]/.test(t))throw new Error("illegal type: "+t);r[t]=[]}return new Hi(r)}function Hi(t){this._=t}function Zi(t,e){for(var i,r=0,a=t.length;r<a;++r)if((i=t[r]).name===e)return i.value}function Yi(t,e,i){for(var r=0,a=t.length;r<a;++r)if(t[r].name===e){t[r]=Bi,t=t.slice(0,r).concat(t.slice(r+1));break}return null!=i&&t.push({name:e,value:i}),t}Hi.prototype=qi.prototype={constructor:Hi,on:function(t,e){var i,r,a=this._,n=(r=a,(t+"").trim().split(/^|\s+/).map((function(t){var e="",i=t.indexOf(".");if(i>=0&&(e=t.slice(i+1),t=t.slice(0,i)),t&&!r.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:e}}))),o=-1,l=n.length;if(!(arguments.length<2)){if(null!=e&&"function"!=typeof e)throw new Error("invalid callback: "+e);for(;++o<l;)if(i=(t=n[o]).type)a[i]=Yi(a[i],t.name,e);else if(null==e)for(i in a)a[i]=Yi(a[i],t.name,null);return this}for(;++o<l;)if((i=(t=n[o]).type)&&(i=Zi(a[i],t.name)))return i},copy:function(){var t={},e=this._;for(var i in e)t[i]=e[i].slice();return new Hi(t)},call:function(t,e){if((i=arguments.length-2)>0)for(var i,r,a=new Array(i),n=0;n<i;++n)a[n]=arguments[n+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(n=0,i=(r=this._[t]).length;n<i;++n)r[n].value.apply(e,a)},apply:function(t,e,i){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var r=this._[t],a=0,n=r.length;a<n;++a)r[a].value.apply(e,i)}};const Wi={passive:!1},Xi={capture:!0,passive:!1};function Ki(t){t.stopImmediatePropagation()}function Ji(t){t.preventDefault(),t.stopImmediatePropagation()}var Qi=t=>()=>t;function tr(t,{sourceEvent:e,subject:i,target:r,identifier:a,active:n,x:o,y:l,dx:s,dy:u,dispatch:p}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:e,enumerable:!0,configurable:!0},subject:{value:i,enumerable:!0,configurable:!0},target:{value:r,enumerable:!0,configurable:!0},identifier:{value:a,enumerable:!0,configurable:!0},active:{value:n,enumerable:!0,configurable:!0},x:{value:o,enumerable:!0,configurable:!0},y:{value:l,enumerable:!0,configurable:!0},dx:{value:s,enumerable:!0,configurable:!0},dy:{value:u,enumerable:!0,configurable:!0},_:{value:p}})}function er(t){return!t.ctrlKey&&!t.button}function ir(){return this.parentNode}function rr(t,e){return null==e?{x:t.x,y:t.y}:e}function ar(){return navigator.maxTouchPoints||"ontouchstart"in this}function nr(){var t,e,i,r,a=er,n=ir,o=rr,l=ar,s={},u=qi("start","drag","end"),p=0,d=0;function c(t){t.on("mousedown.drag",f).filter(l).on("touchstart.drag",y).on("touchmove.drag",g,Wi).on("touchend.drag touchcancel.drag",v).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function f(o,l){if(!r&&a.call(this,o,l)){var s=_(this,n.call(this,o,l),o,l,"mouse");s&&(ut(o.view).on("mousemove.drag",h,Xi).on("mouseup.drag",m,Xi),function(t){var e=t.document.documentElement,i=ut(t).on("dragstart.drag",Ji,Xi);"onselectstart"in e?i.on("selectstart.drag",Ji,Xi):(e.__noselect=e.style.MozUserSelect,e.style.MozUserSelect="none")}(o.view),Ki(o),i=!1,t=o.clientX,e=o.clientY,s("start",o))}}function h(r){if(Ji(r),!i){var a=r.clientX-t,n=r.clientY-e;i=a*a+n*n>d}s.mouse("drag",r)}function m(t){ut(t.view).on("mousemove.drag mouseup.drag",null),function(t,e){var i=t.document.documentElement,r=ut(t).on("dragstart.drag",null);e&&(r.on("click.drag",Ji,Xi),setTimeout((function(){r.on("click.drag",null)}),0)),"onselectstart"in i?r.on("selectstart.drag",null):(i.style.MozUserSelect=i.__noselect,delete i.__noselect)}(t.view,i),Ji(t),s.mouse("end",t)}function y(t,e){if(a.call(this,t,e)){var i,r,o=t.changedTouches,l=n.call(this,t,e),s=o.length;for(i=0;i<s;++i)(r=_(this,l,t,e,o[i].identifier,o[i]))&&(Ki(t),r("start",t,o[i]))}}function g(t){var e,i,r=t.changedTouches,a=r.length;for(e=0;e<a;++e)(i=s[r[e].identifier])&&(Ji(t),i("drag",t,r[e]))}function v(t){var e,i,a=t.changedTouches,n=a.length;for(r&&clearTimeout(r),r=setTimeout((function(){r=null}),500),e=0;e<n;++e)(i=s[a[e].identifier])&&(Ki(t),i("end",t,a[e]))}function _(t,e,i,r,a,n){var l,d,f,h=u.copy(),m=pt(n||i,e);if(null!=(f=o.call(t,new tr("beforestart",{sourceEvent:i,target:c,identifier:a,active:p,x:m[0],y:m[1],dx:0,dy:0,dispatch:h}),r)))return l=f.x-m[0]||0,d=f.y-m[1]||0,function i(n,o,u){var y,g=m;switch(n){case"start":s[a]=i,y=p++;break;case"end":delete s[a],--p;case"drag":m=pt(u||o,e),y=p}h.call(n,t,new tr(n,{sourceEvent:o,subject:f,target:c,identifier:a,active:y,x:m[0]+l,y:m[1]+d,dx:m[0]-g[0],dy:m[1]-g[1],dispatch:h}),r)}}return c.filter=function(t){return arguments.length?(a="function"==typeof t?t:Qi(!!t),c):a},c.container=function(t){return arguments.length?(n="function"==typeof t?t:Qi(t),c):n},c.subject=function(t){return arguments.length?(o="function"==typeof t?t:Qi(t),c):o},c.touchable=function(t){return arguments.length?(l="function"==typeof t?t:Qi(!!t),c):l},c.on=function(){var t=u.on.apply(u,arguments);return t===u?c:t},c.clickDistance=function(t){return arguments.length?(d=(t=+t)*t,c):Math.sqrt(d)},c}tr.prototype.on=function(){var t=this._.on.apply(this._,arguments);return t===this._?this:t};var or=Object.freeze({__proto__:null,axisBottom:ae,axisLeft:ne,drag:nr,line:Mt,scaleLinear:zi,select:ut,selectAll:function(t){return"string"==typeof t?new st([document.querySelectorAll(t)],[document.documentElement]):new st([u(t)],lt)},symbol:Wt,symbolAsterisk:$t,symbolCircle:Dt,symbolCross:Lt,symbolDiamond:It,symbolSquare:Vt,symbolStar:Ut,symbolTriangle:zt,symbolWye:Yt});const lr="#00B0F0",sr="#E46C0A",ur="#490092",pr="#490092",dr="#A6A6A6",cr="#6495ED",fr="#000000",hr={font:{default:"'Arial', sans-serif",valid:["'Arial', sans-serif","Arial","'Arial Black'","'Arial Unicode MS'","Calibri","Cambria","'Cambria Math'","Candara","'Comic Sans MS'","Consolas","Constantia","Corbel","'Courier New'","wf_standard-font, helvetica, arial, sans-serif","wf_standard-font_light, helvetica, arial, sans-serif","Georgia","'Lucida Sans Unicode'","'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif","'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif","'Segoe UI Semibold', wf_segoe-ui_semibold, helvetica, arial, sans-serif","'Segoe UI Bold', wf_segoe-ui_bold, helvetica, arial, sans-serif","Symbol","Tahoma","'Times New Roman'","'Trebuchet MS'","Verdana","Wingdings"]},size:{default:10,options:{minValue:{value:0},maxValue:{value:100}}},weight:{default:"normal",valid:["normal","bold","bolder","lighter"]},text_transform:{default:"uppercase",valid:["uppercase","lowercase","capitalize","none"]},text_overflow:{default:"ellipsis",valid:["ellipsis","clip","none"]},text_align:{default:"center",valid:["center","left","right"]}},mr={width:{default:1,options:{minValue:{value:0}}},style:{default:"solid",valid:["solid","dotted","dashed","double","groove","ridge","inset","outset","none"]},colour:{default:"#000000"}},yr={canvas:{description:"Canvas Settings",displayName:"Canvas Settings",settingsGroups:{all:{show_errors:{displayName:"Show Errors on Canvas",type:"ToggleSwitch",default:!0},lower_padding:{displayName:"Padding Below Plot (pixels):",type:"NumUpDown",default:10},upper_padding:{displayName:"Padding Above Plot (pixels):",type:"NumUpDown",default:10},left_padding:{displayName:"Padding Left of Plot (pixels):",type:"NumUpDown",default:10},right_padding:{displayName:"Padding Right of Plot (pixels):",type:"NumUpDown",default:10}}}},spc:{description:"SPC Settings",displayName:"Data Settings",settingsGroups:{all:{chart_type:{displayName:"Chart Type",type:"Dropdown",default:"i",valid:["run","i","i_m","i_mm","mr","p","pp","u","up","c","xbar","s","g","t"],items:[{displayName:"run - Run Chart",value:"run"},{displayName:"i - Individual Measurements",value:"i"},{displayName:"i_m - Individual Measurements: Median centerline",value:"i_m"},{displayName:"i_mm - Individual Measurements: Median centerline, Median MR Limits",value:"i_mm"},{displayName:"mr - Moving Range of Individual Measurements",value:"mr"},{displayName:"p - Proportions",value:"p"},{displayName:"p prime - Proportions: Large-Sample Corrected",value:"pp"},{displayName:"u - Rates",value:"u"},{displayName:"u prime - Rates: Large-Sample Correction",value:"up"},{displayName:"c - Counts",value:"c"},{displayName:"xbar - Sample Means",value:"xbar"},{displayName:"s - Sample SDs",value:"s"},{displayName:"g - Number of Non-Events Between Events",value:"g"},{displayName:"t - Time Between Events",value:"t"}]},outliers_in_limits:{displayName:"Keep Outliers in Limit Calcs.",type:"ToggleSwitch",default:!1},multiplier:{displayName:"Multiplier",type:"NumUpDown",default:1,options:{minValue:{value:0}}},sig_figs:{displayName:"Decimals to Report:",type:"NumUpDown",default:2,options:{minValue:{value:0},maxValue:{value:20}}},perc_labels:{displayName:"Report as percentage",type:"Dropdown",default:"Automatic",valid:["Automatic","Yes","No"],items:[{displayName:"Automatic",value:"Automatic"},{displayName:"Yes",value:"Yes"},{displayName:"No",value:"No"}]},split_on_click:{displayName:"Split Limits on Click",type:"ToggleSwitch",default:!1},num_points_subset:{displayName:"Subset Number of Points for Limit Calculations",type:"NumUpDown",default:null},subset_points_from:{displayName:"Subset Points From",type:"Dropdown",default:"Start",valid:["Start","End"],items:[{displayName:"Start",value:"Start"},{displayName:"End",value:"End"}]},ttip_show_date:{displayName:"Show Date in Tooltip",type:"ToggleSwitch",default:!0},ttip_label_date:{displayName:"Date Tooltip Label",type:"TextInput",default:"Automatic"},ttip_show_numerator:{displayName:"Show Numerator in Tooltip",type:"ToggleSwitch",default:!0},ttip_label_numerator:{displayName:"Numerator Tooltip Label",type:"TextInput",default:"Numerator"},ttip_show_denominator:{displayName:"Show Denominator in Tooltip",type:"ToggleSwitch",default:!0},ttip_label_denominator:{displayName:"Denominator Tooltip Label",type:"TextInput",default:"Denominator"},ttip_show_value:{displayName:"Show Value in Tooltip",type:"ToggleSwitch",default:!0},ttip_label_value:{displayName:"Value Tooltip Label",type:"TextInput",default:"Automatic"},ll_truncate:{displayName:"Truncate Lower Limits at:",type:"NumUpDown",default:null},ul_truncate:{displayName:"Truncate Upper Limits at:",type:"NumUpDown",default:null}}}},outliers:{description:"Outlier Settings",displayName:"Outlier Settings",settingsGroups:{General:{process_flag_type:{displayName:"Type of Change to Flag",type:"Dropdown",default:"both",valid:["both","improvement","deterioration"],items:[{displayName:"Both",value:"both"},{displayName:"Improvement (Imp.)",value:"improvement"},{displayName:"Deterioration (Det.)",value:"deterioration"}]},improvement_direction:{displayName:"Improvement Direction",type:"Dropdown",default:"increase",valid:["increase","neutral","decrease"],items:[{displayName:"Increase",value:"increase"},{displayName:"Neutral",value:"neutral"},{displayName:"Decrease",value:"decrease"}]}},"Astronomical Points":{astronomical:{displayName:"Highlight Astronomical Points",type:"ToggleSwitch",default:!1},astronomical_limit:{displayName:"Limit for Astronomical Points",type:"Dropdown",default:"3 Sigma",valid:["1 Sigma","2 Sigma","3 Sigma","Specification"],items:[{displayName:"1 Sigma",value:"1 Sigma"},{displayName:"2 Sigma",value:"2 Sigma"},{displayName:"3 Sigma",value:"3 Sigma"},{displayName:"Specification",value:"Specification"}]},ast_colour_improvement:{displayName:"Imp. Ast. Colour",type:"ColorPicker",default:lr},ast_colour_deterioration:{displayName:"Det. Ast. Colour",type:"ColorPicker",default:sr},ast_colour_neutral_low:{displayName:"Neutral (Low) Ast. Colour",type:"ColorPicker",default:ur},ast_colour_neutral_high:{displayName:"Neutral (High) Ast. Colour",type:"ColorPicker",default:pr}},Shifts:{shift:{displayName:"Highlight Shifts",type:"ToggleSwitch",default:!1},shift_n:{displayName:"Shift Points",type:"NumUpDown",default:7,options:{minValue:{value:1}}},shift_colour_improvement:{displayName:"Imp. Shift Colour",type:"ColorPicker",default:lr},shift_colour_deterioration:{displayName:"Det. Shift Colour",type:"ColorPicker",default:sr},shift_colour_neutral_low:{displayName:"Neutral (Low) Shift Colour",type:"ColorPicker",default:ur},shift_colour_neutral_high:{displayName:"Neutral (High) Shift Colour",type:"ColorPicker",default:pr}},Trends:{trend:{displayName:"Highlight Trends",type:"ToggleSwitch",default:!1},trend_n:{displayName:"Trend Points",type:"NumUpDown",default:5,options:{minValue:{value:1}}},trend_colour_improvement:{displayName:"Imp. Trend Colour",type:"ColorPicker",default:lr},trend_colour_deterioration:{displayName:"Det. Trend Colour",type:"ColorPicker",default:sr},trend_colour_neutral_low:{displayName:"Neutral (Low) Trend Colour",type:"ColorPicker",default:ur},trend_colour_neutral_high:{displayName:"Neutral (High) Trend Colour",type:"ColorPicker",default:pr}},"Two-In-Three":{two_in_three:{displayName:"Highlight Two-in-Three",type:"ToggleSwitch",default:!1},two_in_three_highlight_series:{displayName:"Highlight all in Pattern",type:"ToggleSwitch",default:!1},two_in_three_limit:{displayName:"Warning Limit for Two-in-Three",type:"Dropdown",default:"2 Sigma",valid:["1 Sigma","2 Sigma","3 Sigma","Specification"],items:[{displayName:"1 Sigma",value:"1 Sigma"},{displayName:"2 Sigma",value:"2 Sigma"},{displayName:"3 Sigma",value:"3 Sigma"},{displayName:"Specification",value:"Specification"}]},twointhree_colour_improvement:{displayName:"Imp. Two-in-Three Colour",type:"ColorPicker",default:lr},twointhree_colour_deterioration:{displayName:"Det. Two-in-Three Colour",type:"ColorPicker",default:sr},twointhree_colour_neutral_low:{displayName:"Neutral (Low) Two-in-Three Colour",type:"ColorPicker",default:ur},twointhree_colour_neutral_high:{displayName:"Neutral (High) Two-in-Three Colour",type:"ColorPicker",default:pr}}}},nhs_icons:{description:"NHS Icons Settings",displayName:"NHS Icons Settings",settingsGroups:{all:{show_variation_icons:{displayName:"Show Variation Icons",type:"ToggleSwitch",default:!1},flag_last_point:{displayName:"Flag Only Last Point",type:"ToggleSwitch",default:!0},variation_icons_locations:{displayName:"Variation Icon Locations",type:"Dropdown",default:"Top Right",valid:["Top Right","Bottom Right","Top Left","Bottom Left"],items:[{displayName:"Top Right",value:"Top Right"},{displayName:"Bottom Right",value:"Bottom Right"},{displayName:"Top Left",value:"Top Left"},{displayName:"Bottom Left",value:"Bottom Left"}]},variation_icons_scaling:{displayName:"Scale Variation Icon Size",type:"NumUpDown",default:1,options:{minValue:{value:0}}},show_assurance_icons:{displayName:"Show Assurance Icons",type:"ToggleSwitch",default:!1},assurance_icons_locations:{displayName:"Assurance Icon Locations",type:"Dropdown",default:"Top Right",valid:["Top Right","Bottom Right","Top Left","Bottom Left"],items:[{displayName:"Top Right",value:"Top Right"},{displayName:"Bottom Right",value:"Bottom Right"},{displayName:"Top Left",value:"Top Left"},{displayName:"Bottom Left",value:"Bottom Left"}]},assurance_icons_scaling:{displayName:"Scale Assurance Icon Size",type:"NumUpDown",default:1,options:{minValue:{value:0}}}}}},scatter:{description:"Scatter Settings",displayName:"Scatter Settings",settingsGroups:{all:{shape:{displayName:"Shape",type:"Dropdown",default:"Circle",valid:["Circle","Cross","Diamond","Square","Star","Triangle","Wye"],items:[{displayName:"Circle",value:"Circle"},{displayName:"Cross",value:"Cross"},{displayName:"Diamond",value:"Diamond"},{displayName:"Square",value:"Square"},{displayName:"Star",value:"Star"},{displayName:"Triangle",value:"Triangle"},{displayName:"Wye",value:"Wye"}]},size:{displayName:"Size",type:"NumUpDown",default:2.5,options:{minValue:{value:0},maxValue:{value:100}}},colour:{displayName:"Colour",type:"ColorPicker",default:dr},colour_outline:{displayName:"Outline Colour",type:"ColorPicker",default:dr},width_outline:{displayName:"Outline Width",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:100}}},opacity:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_selected:{displayName:"Opacity if Selected",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected:{displayName:"Opacity if Unselected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}}}}},lines:{description:"Line Settings",displayName:"Line Settings",settingsGroups:{Main:{show_main:{displayName:"Show Main Line",type:"ToggleSwitch",default:!0},width_main:{displayName:"Main Line Width",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:100}}},type_main:{displayName:"Main Line Type",type:"Dropdown",default:"10 0",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},colour_main:{displayName:"Main Line Colour",type:"ColorPicker",default:dr},opacity_main:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected_main:{displayName:"Opacity if Any Selected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},join_rebaselines_main:{displayName:"Connect Rebaselined Limits",type:"ToggleSwitch",default:!1},plot_label_show_main:{displayName:"Show Value on Plot",type:"ToggleSwitch",default:!1},plot_label_show_all_main:{displayName:"Show Value at all Re-Baselines",type:"ToggleSwitch",default:!1},plot_label_show_n_main:{displayName:"Show Value at Last N Re-Baselines",type:"NumUpDown",default:1,options:{minValue:{value:1}}},plot_label_position_main:{displayName:"Position of Value on Line(s)",type:"Dropdown",default:"beside",valid:["above","below","beside"],items:[{displayName:"Above",value:"above"},{displayName:"Below",value:"below"},{displayName:"Beside",value:"beside"}]},plot_label_vpad_main:{displayName:"Value Vertical Padding",type:"NumUpDown",default:0},plot_label_hpad_main:{displayName:"Value Horizontal Padding",type:"NumUpDown",default:10},plot_label_font_main:{displayName:"Value Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},plot_label_size_main:{displayName:"Value Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},plot_label_colour_main:{displayName:"Value Colour",type:"ColorPicker",default:fr},plot_label_prefix_main:{displayName:"Value Prefix",type:"TextInput",default:""}},Target:{show_target:{displayName:"Show Target",type:"ToggleSwitch",default:!0},width_target:{displayName:"Line Width",type:"NumUpDown",default:1.5,options:{minValue:{value:0},maxValue:{value:100}}},type_target:{displayName:"Line Type",type:"Dropdown",default:"10 0",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},colour_target:{displayName:"Line Colour",type:"ColorPicker",default:fr},opacity_target:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected_target:{displayName:"Opacity if Any Selected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},join_rebaselines_target:{displayName:"Connect Rebaselined Limits",type:"ToggleSwitch",default:!1},ttip_show_target:{displayName:"Show value in tooltip",type:"ToggleSwitch",default:!0},ttip_label_target:{displayName:"Tooltip Label",type:"TextInput",default:"Centerline"},plot_label_show_target:{displayName:"Show Value on Plot",type:"ToggleSwitch",default:!1},plot_label_show_all_target:{displayName:"Show Value at all Re-Baselines",type:"ToggleSwitch",default:!1},plot_label_show_n_target:{displayName:"Show Value at Last N Re-Baselines",type:"NumUpDown",default:1,options:{minValue:{value:1}}},plot_label_position_target:{displayName:"Position of Value on Line(s)",type:"Dropdown",default:"beside",valid:["above","below","beside"],items:[{displayName:"Above",value:"above"},{displayName:"Below",value:"below"},{displayName:"Beside",value:"beside"}]},plot_label_vpad_target:{displayName:"Value Vertical Padding",type:"NumUpDown",default:0},plot_label_hpad_target:{displayName:"Value Horizontal Padding",type:"NumUpDown",default:10},plot_label_font_target:{displayName:"Value Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},plot_label_size_target:{displayName:"Value Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},plot_label_colour_target:{displayName:"Value Colour",type:"ColorPicker",default:fr},plot_label_prefix_target:{displayName:"Value Prefix",type:"TextInput",default:""}},"Alt. Target":{show_alt_target:{displayName:"Show Alt. Target Line",type:"ToggleSwitch",default:!1},alt_target:{displayName:"Additional Target Value:",type:"NumUpDown",default:null},multiplier_alt_target:{displayName:"Apply Multiplier to Alt. Target",type:"ToggleSwitch",default:!1},width_alt_target:{displayName:"Line Width",type:"NumUpDown",default:1.5,options:{minValue:{value:0},maxValue:{value:100}}},type_alt_target:{displayName:"Line Type",type:"Dropdown",default:"10 0",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},colour_alt_target:{displayName:"Line Colour",type:"ColorPicker",default:fr},opacity_alt_target:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected_alt_target:{displayName:"Opacity if Any Selected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},join_rebaselines_alt_target:{displayName:"Connect Rebaselined Limits",type:"ToggleSwitch",default:!1},ttip_show_alt_target:{displayName:"Show value in tooltip",type:"ToggleSwitch",default:!0},ttip_label_alt_target:{displayName:"Tooltip Label",type:"TextInput",default:"Alt. Target"},plot_label_show_alt_target:{displayName:"Show Value on Plot",type:"ToggleSwitch",default:!1},plot_label_show_all_alt_target:{displayName:"Show Value at all Re-Baselines",type:"ToggleSwitch",default:!1},plot_label_show_n_alt_target:{displayName:"Show Value at Last N Re-Baselines",type:"NumUpDown",default:1,options:{minValue:{value:1}}},plot_label_position_alt_target:{displayName:"Position of Value on Line(s)",type:"Dropdown",default:"beside",valid:["above","below","beside"],items:[{displayName:"Above",value:"above"},{displayName:"Below",value:"below"},{displayName:"Beside",value:"beside"}]},plot_label_vpad_alt_target:{displayName:"Value Vertical Padding",type:"NumUpDown",default:0},plot_label_hpad_alt_target:{displayName:"Value Horizontal Padding",type:"NumUpDown",default:10},plot_label_font_alt_target:{displayName:"Value Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},plot_label_size_alt_target:{displayName:"Value Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},plot_label_colour_alt_target:{displayName:"Value Colour",type:"ColorPicker",default:fr},plot_label_prefix_alt_target:{displayName:"Value Prefix",type:"TextInput",default:""}},"68% Limits":{show_68:{displayName:"Show 68% Lines",type:"ToggleSwitch",default:!1},width_68:{displayName:"Line Width",type:"NumUpDown",default:2,options:{minValue:{value:0},maxValue:{value:100}}},type_68:{displayName:"Line Type",type:"Dropdown",default:"2 5",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},colour_68:{displayName:"Line Colour",type:"ColorPicker",default:cr},opacity_68:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected_68:{displayName:"Opacity if Any Selected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},join_rebaselines_68:{displayName:"Connect Rebaselined Limits",type:"ToggleSwitch",default:!1},ttip_show_68:{displayName:"Show value in tooltip",type:"ToggleSwitch",default:!0},ttip_label_68:{displayName:"Tooltip Label",type:"TextInput",default:"68% Limit"},ttip_label_68_prefix_lower:{displayName:"Tooltip Label - Lower Prefix",type:"TextInput",default:"Lower "},ttip_label_68_prefix_upper:{displayName:"Tooltip Label - Upper Prefix",type:"TextInput",default:"Upper "},plot_label_show_68:{displayName:"Show Value on Plot",type:"ToggleSwitch",default:!1},plot_label_show_all_68:{displayName:"Show Value at all Re-Baselines",type:"ToggleSwitch",default:!1},plot_label_show_n_68:{displayName:"Show Value at Last N Re-Baselines",type:"NumUpDown",default:1,options:{minValue:{value:1}}},plot_label_position_68:{displayName:"Position of Value on Line(s)",type:"Dropdown",default:"beside",valid:["outside","inside","above","below","beside"],items:[{displayName:"Outside",value:"outside"},{displayName:"Inside",value:"inside"},{displayName:"Above",value:"above"},{displayName:"Below",value:"below"},{displayName:"Beside",value:"beside"}]},plot_label_vpad_68:{displayName:"Value Vertical Padding",type:"NumUpDown",default:0},plot_label_hpad_68:{displayName:"Value Horizontal Padding",type:"NumUpDown",default:10},plot_label_font_68:{displayName:"Value Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},plot_label_size_68:{displayName:"Value Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},plot_label_colour_68:{displayName:"Value Colour",type:"ColorPicker",default:fr},plot_label_prefix_68:{displayName:"Value Prefix",type:"TextInput",default:""}},"95% Limits":{show_95:{displayName:"Show 95% Lines",type:"ToggleSwitch",default:!0},width_95:{displayName:"Line Width",type:"NumUpDown",default:2,options:{minValue:{value:0},maxValue:{value:100}}},type_95:{displayName:"Line Type",type:"Dropdown",default:"2 5",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},colour_95:{displayName:"Line Colour",type:"ColorPicker",default:cr},opacity_95:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected_95:{displayName:"Opacity if Any Selected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},join_rebaselines_95:{displayName:"Connect Rebaselined Limits",type:"ToggleSwitch",default:!1},ttip_show_95:{displayName:"Show value in tooltip",type:"ToggleSwitch",default:!0},ttip_label_95:{displayName:"Tooltip Label",type:"TextInput",default:"95% Limit"},ttip_label_95_prefix_lower:{displayName:"Tooltip Label - Lower Prefix",type:"TextInput",default:"Lower "},ttip_label_95_prefix_upper:{displayName:"Tooltip Label - Upper Prefix",type:"TextInput",default:"Upper "},plot_label_show_95:{displayName:"Show Value on Plot",type:"ToggleSwitch",default:!1},plot_label_show_all_95:{displayName:"Show Value at all Re-Baselines",type:"ToggleSwitch",default:!1},plot_label_show_n_95:{displayName:"Show Value at Last N Re-Baselines",type:"NumUpDown",default:1,options:{minValue:{value:1}}},plot_label_position_95:{displayName:"Position of Value on Line(s)",type:"Dropdown",default:"beside",valid:["outside","inside","above","below","beside"],items:[{displayName:"Outside",value:"outside"},{displayName:"Inside",value:"inside"},{displayName:"Above",value:"above"},{displayName:"Below",value:"below"},{displayName:"Beside",value:"beside"}]},plot_label_vpad_95:{displayName:"Value Vertical Padding",type:"NumUpDown",default:0},plot_label_hpad_95:{displayName:"Value Horizontal Padding",type:"NumUpDown",default:10},plot_label_font_95:{displayName:"Value Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},plot_label_size_95:{displayName:"Value Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},plot_label_colour_95:{displayName:"Value Colour",type:"ColorPicker",default:fr},plot_label_prefix_95:{displayName:"Value Prefix",type:"TextInput",default:""}},"99% Limits":{show_99:{displayName:"Show 99% Lines",type:"ToggleSwitch",default:!0},width_99:{displayName:"Line Width",type:"NumUpDown",default:2,options:{minValue:{value:0},maxValue:{value:100}}},type_99:{displayName:"Line Type",type:"Dropdown",default:"10 10",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},colour_99:{displayName:"Line Colour",type:"ColorPicker",default:cr},opacity_99:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected_99:{displayName:"Opacity if Any Selected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},join_rebaselines_99:{displayName:"Connect Rebaselined Limits",type:"ToggleSwitch",default:!1},ttip_show_99:{displayName:"Show value in tooltip",type:"ToggleSwitch",default:!0},ttip_label_99:{displayName:"Tooltip Label",type:"TextInput",default:"99% Limit"},ttip_label_99_prefix_lower:{displayName:"Tooltip Label - Lower Prefix",type:"TextInput",default:"Lower "},ttip_label_99_prefix_upper:{displayName:"Tooltip Label - Upper Prefix",type:"TextInput",default:"Upper "},plot_label_show_99:{displayName:"Show Value on Plot",type:"ToggleSwitch",default:!1},plot_label_show_all_99:{displayName:"Show Value at all Re-Baselines",type:"ToggleSwitch",default:!1},plot_label_show_n_99:{displayName:"Show Value at Last N Re-Baselines",type:"NumUpDown",default:1,options:{minValue:{value:1}}},plot_label_position_99:{displayName:"Position of Value on Line(s)",type:"Dropdown",default:"beside",valid:["outside","inside","above","below","beside"],items:[{displayName:"Outside",value:"outside"},{displayName:"Inside",value:"inside"},{displayName:"Above",value:"above"},{displayName:"Below",value:"below"},{displayName:"Beside",value:"beside"}]},plot_label_vpad_99:{displayName:"Value Vertical Padding",type:"NumUpDown",default:0},plot_label_hpad_99:{displayName:"Value Horizontal Padding",type:"NumUpDown",default:10},plot_label_font_99:{displayName:"Value Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},plot_label_size_99:{displayName:"Value Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},plot_label_colour_99:{displayName:"Value Colour",type:"ColorPicker",default:fr},plot_label_prefix_99:{displayName:"Value Prefix",type:"TextInput",default:""}},"Specification Limits":{show_specification:{displayName:"Show Specification Lines",type:"ToggleSwitch",default:!1},specification_upper:{displayName:"Upper Specification Limit:",type:"NumUpDown",default:null},specification_lower:{displayName:"Lower Specification Limit:",type:"NumUpDown",default:null},multiplier_specification:{displayName:"Apply Multiplier to Specification Limits",type:"ToggleSwitch",default:!1},width_specification:{displayName:"Line Width",type:"NumUpDown",default:2,options:{minValue:{value:0},maxValue:{value:100}}},type_specification:{displayName:"Line Type",type:"Dropdown",default:"10 10",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},colour_specification:{displayName:"Line Colour",type:"ColorPicker",default:cr},opacity_specification:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected_specification:{displayName:"Opacity if Any Selected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},join_rebaselines_specification:{displayName:"Connect Rebaselined Limits",type:"ToggleSwitch",default:!1},ttip_show_specification:{displayName:"Show value in tooltip",type:"ToggleSwitch",default:!0},ttip_label_specification:{displayName:"Tooltip Label",type:"TextInput",default:"specification Limit"},ttip_label_specification_prefix_lower:{displayName:"Tooltip Label - Lower Prefix",type:"TextInput",default:"Lower "},ttip_label_specification_prefix_upper:{displayName:"Tooltip Label - Upper Prefix",type:"TextInput",default:"Upper "},plot_label_show_specification:{displayName:"Show Value on Plot",type:"ToggleSwitch",default:!1},plot_label_show_all_specification:{displayName:"Show Value at all Re-Baselines",type:"ToggleSwitch",default:!1},plot_label_show_n_specification:{displayName:"Show Value at Last N Re-Baselines",type:"NumUpDown",default:1,options:{minValue:{value:1}}},plot_label_position_specification:{displayName:"Position of Value on Line(s)",type:"Dropdown",default:"beside",valid:["outside","inside","above","below","beside"],items:[{displayName:"Outside",value:"outside"},{displayName:"Inside",value:"inside"},{displayName:"Above",value:"above"},{displayName:"Below",value:"below"},{displayName:"Beside",value:"beside"}]},plot_label_vpad_specification:{displayName:"Value Vertical Padding",type:"NumUpDown",default:0},plot_label_hpad_specification:{displayName:"Value Horizontal Padding",type:"NumUpDown",default:10},plot_label_font_specification:{displayName:"Value Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},plot_label_size_specification:{displayName:"Value Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},plot_label_colour_specification:{displayName:"Value Colour",type:"ColorPicker",default:fr},plot_label_prefix_specification:{displayName:"Value Prefix",type:"TextInput",default:""}},Trend:{show_trend:{displayName:"Show Trend",type:"ToggleSwitch",default:!1},width_trend:{displayName:"Line Width",type:"NumUpDown",default:1.5,options:{minValue:{value:0},maxValue:{value:100}}},type_trend:{displayName:"Line Type",type:"Dropdown",default:"10 0",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},colour_trend:{displayName:"Line Colour",type:"ColorPicker",default:dr},opacity_trend:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},opacity_unselected_trend:{displayName:"Opacity if Any Selected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},join_rebaselines_trend:{displayName:"Connect Rebaselined Limits",type:"ToggleSwitch",default:!1},ttip_show_trend:{displayName:"Show value in tooltip",type:"ToggleSwitch",default:!0},ttip_label_trend:{displayName:"Tooltip Label",type:"TextInput",default:"Centerline"},plot_label_show_trend:{displayName:"Show Value on Plot",type:"ToggleSwitch",default:!1},plot_label_show_all_trend:{displayName:"Show Value at all Re-Baselines",type:"ToggleSwitch",default:!1},plot_label_show_n_trend:{displayName:"Show Value at Last N Re-Baselines",type:"NumUpDown",default:1,options:{minValue:{value:1}}},plot_label_position_trend:{displayName:"Position of Value on Line(s)",type:"Dropdown",default:"beside",valid:["above","below","beside"],items:[{displayName:"Above",value:"above"},{displayName:"Below",value:"below"},{displayName:"Beside",value:"beside"}]},plot_label_vpad_trend:{displayName:"Value Vertical Padding",type:"NumUpDown",default:0},plot_label_hpad_trend:{displayName:"Value Horizontal Padding",type:"NumUpDown",default:10},plot_label_font_trend:{displayName:"Value Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},plot_label_size_trend:{displayName:"Value Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},plot_label_colour_trend:{displayName:"Value Colour",type:"ColorPicker",default:fr},plot_label_prefix_trend:{displayName:"Value Prefix",type:"TextInput",default:""}}}},x_axis:{description:"X Axis Settings",displayName:"X Axis Settings",settingsGroups:{Axis:{xlimit_colour:{displayName:"Axis Colour",type:"ColorPicker",default:fr},xlimit_l:{displayName:"Lower Limit",type:"NumUpDown",default:null},xlimit_u:{displayName:"Upper Limit",type:"NumUpDown",default:null}},Ticks:{xlimit_ticks:{displayName:"Draw Ticks",type:"ToggleSwitch",default:!0},xlimit_tick_count:{displayName:"Maximum Ticks",type:"NumUpDown",default:10,options:{minValue:{value:0},maxValue:{value:100}}},xlimit_tick_font:{displayName:"Tick Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},xlimit_tick_size:{displayName:"Tick Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},xlimit_tick_colour:{displayName:"Tick Font Colour",type:"ColorPicker",default:fr},xlimit_tick_rotation:{displayName:"Tick Rotation (Degrees)",type:"NumUpDown",default:-35,options:{minValue:{value:-360},maxValue:{value:360}}}},Label:{xlimit_label:{displayName:"Label",type:"TextInput",default:null},xlimit_label_font:{displayName:"Label Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},xlimit_label_size:{displayName:"Label Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},xlimit_label_colour:{displayName:"Label Font Colour",type:"ColorPicker",default:fr}}}},y_axis:{description:"Y Axis Settings",displayName:"Y Axis Settings",settingsGroups:{Axis:{ylimit_colour:{displayName:"Axis Colour",type:"ColorPicker",default:fr},limit_multiplier:{displayName:"Axis Scaling Factor",type:"NumUpDown",default:1.5,options:{minValue:{value:0}}},ylimit_sig_figs:{displayName:"Tick Decimal Places",type:"NumUpDown",default:null,options:{minValue:{value:0},maxValue:{value:100}}},ylimit_l:{displayName:"Lower Limit",type:"NumUpDown",default:null},ylimit_u:{displayName:"Upper Limit",type:"NumUpDown",default:null}},Ticks:{ylimit_ticks:{displayName:"Draw Ticks",type:"ToggleSwitch",default:!0},ylimit_tick_count:{displayName:"Maximum Ticks",type:"NumUpDown",default:10,options:{minValue:{value:0},maxValue:{value:100}}},ylimit_tick_font:{displayName:"Tick Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},ylimit_tick_size:{displayName:"Tick Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},ylimit_tick_colour:{displayName:"Tick Font Colour",type:"ColorPicker",default:fr},ylimit_tick_rotation:{displayName:"Tick Rotation (Degrees)",type:"NumUpDown",default:0,options:{minValue:{value:-360},maxValue:{value:360}}}},Label:{ylimit_label:{displayName:"Label",type:"TextInput",default:null},ylimit_label_font:{displayName:"Label Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},ylimit_label_size:{displayName:"Label Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},ylimit_label_colour:{displayName:"Label Font Colour",type:"ColorPicker",default:fr}}}},dates:{description:"Date Settings",displayName:"Date Settings",settingsGroups:{all:{date_format_day:{displayName:"Day Format",type:"Dropdown",default:"DD",valid:["DD","Thurs DD","Thursday DD","(blank)"],items:[{displayName:"DD",value:"DD"},{displayName:"Thurs DD",value:"Thurs DD"},{displayName:"Thursday DD",value:"Thursday DD"},{displayName:"(blank)",value:"(blank)"}]},date_format_month:{displayName:"Month Format",type:"Dropdown",default:"MM",valid:["MM","Mon","Month","(blank)"],items:[{displayName:"MM",value:"MM"},{displayName:"Mon",value:"Mon"},{displayName:"Month",value:"Month"},{displayName:"(blank)",value:"(blank)"}]},date_format_year:{displayName:"Year Format",type:"Dropdown",default:"YYYY",valid:["YYYY","YY","(blank)"],items:[{displayName:"YYYY",value:"YYYY"},{displayName:"YY",value:"YY"},{displayName:"(blank)",value:"(blank)"}]},date_format_delim:{displayName:"Delimiter",type:"Dropdown",default:"/",valid:["/","-"," "],items:[{displayName:"/",value:"/"},{displayName:"-",value:"-"},{displayName:" ",value:" "}]},date_format_locale:{displayName:"Locale",type:"Dropdown",default:"en-GB",valid:["en-GB","en-US"],items:[{displayName:"en-GB",value:"en-GB"},{displayName:"en-US",value:"en-US"}]}}}},summary_table:{description:"Summary Table Settings",displayName:"Summary Table Settings",settingsGroups:{General:{show_table:{displayName:"Show Summary Table",type:"ToggleSwitch",default:!1},table_variation_filter:{displayName:"Filter by Variation Type",type:"Dropdown",default:"all",valid:["all","common","special","improvement","deterioration","neutral"],items:[{displayName:"All",value:"all"},{displayName:"Common Cause",value:"common"},{displayName:"Special Cause - Any",value:"special"},{displayName:"Special Cause - Improvement",value:"improvement"},{displayName:"Special Cause - Deterioration",value:"deterioration"},{displayName:"Special Cause - Neutral",value:"neutral"}]},table_assurance_filter:{displayName:"Filter by Assurance Type",type:"Dropdown",default:"all",valid:["all","any","pass","fail","inconsistent"],items:[{displayName:"All",value:"all"},{displayName:"Consistent - Any",value:"any"},{displayName:"Consistent Pass",value:"pass"},{displayName:"Consistent Fail",value:"fail"},{displayName:"Inconsistent",value:"inconsistent"}]},table_text_overflow:{displayName:"Text Overflow Handling",type:"Dropdown",default:hr.text_overflow.default,valid:hr.text_overflow.valid,items:[{displayName:"Ellipsis",value:"ellipsis"},{displayName:"Truncate",value:"clip"},{displayName:"None",value:"none"}]},table_opacity:{displayName:"Default Opacity",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},table_opacity_selected:{displayName:"Opacity if Selected",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:1}}},table_opacity_unselected:{displayName:"Opacity if Unselected",type:"NumUpDown",default:.2,options:{minValue:{value:0},maxValue:{value:1}}},table_outer_border_style:{displayName:"Outer Border Style",type:"Dropdown",default:mr.style.default,valid:mr.style.valid,items:[{displayName:"Solid",value:"solid"},{displayName:"Dashed",value:"dashed"},{displayName:"Dotted",value:"dotted"},{displayName:"Double",value:"double"},{displayName:"Groove",value:"groove"},{displayName:"Ridge",value:"ridge"},{displayName:"Inset",value:"inset"},{displayName:"Outset",value:"outset"}]},table_outer_border_width:{displayName:"Outer Border Width",type:"NumUpDown",default:mr.width.default,options:mr.width.options},table_outer_border_colour:{displayName:"Outer Border Colour",type:"ColorPicker",default:mr.colour.default},table_outer_border_top:{displayName:"Outer Border Top",type:"ToggleSwitch",default:!0},table_outer_border_bottom:{displayName:"Outer Border Bottom",type:"ToggleSwitch",default:!0},table_outer_border_left:{displayName:"Outer Border Left",type:"ToggleSwitch",default:!0},table_outer_border_right:{displayName:"Outer Border Right",type:"ToggleSwitch",default:!0}},Header:{table_header_font:{displayName:"Header Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},table_header_size:{displayName:"Header Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},table_header_text_align:{displayName:"Text Alignment",type:"AlignmentGroup",default:hr.text_align.default,valid:hr.text_align.valid},table_header_font_weight:{displayName:"Header Font Weight",type:"Dropdown",default:hr.weight.default,valid:hr.weight.valid,items:[{displayName:"Normal",value:"normal"},{displayName:"Bold",value:"bold"}]},table_header_text_transform:{displayName:"Header Text Transform",type:"Dropdown",default:hr.text_transform.default,valid:hr.text_transform.valid,items:[{displayName:"Uppercase",value:"uppercase"},{displayName:"Lowercase",value:"lowercase"},{displayName:"Capitalise",value:"capitalize"},{displayName:"None",value:"none"}]},table_header_text_padding:{displayName:"Padding Around Text",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:100}}},table_header_colour:{displayName:"Header Font Colour",type:"ColorPicker",default:fr},table_header_bg_colour:{displayName:"Header Background Colour",type:"ColorPicker",default:"#D3D3D3"},table_header_border_style:{displayName:"Header Border Style",type:"Dropdown",default:mr.style.default,valid:mr.style.valid,items:[{displayName:"Solid",value:"solid"},{displayName:"Dashed",value:"dashed"},{displayName:"Dotted",value:"dotted"},{displayName:"Double",value:"double"},{displayName:"Groove",value:"groove"},{displayName:"Ridge",value:"ridge"},{displayName:"Inset",value:"inset"},{displayName:"Outset",value:"outset"}]},table_header_border_width:{displayName:"Header Border Width",type:"NumUpDown",default:mr.width.default,options:mr.width.options},table_header_border_colour:{displayName:"Header Border Colour",type:"ColorPicker",default:mr.colour.default},table_header_border_bottom:{displayName:"Bottom Border",type:"ToggleSwitch",default:!0},table_header_border_inner:{displayName:"Inner Borders",type:"ToggleSwitch",default:!0}},Body:{table_body_font:{displayName:"Body Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},table_body_size:{displayName:"Body Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},table_body_text_align:{displayName:"Text Alignment",type:"AlignmentGroup",default:hr.text_align.default,valid:hr.text_align.valid},table_body_font_weight:{displayName:"Font Weight",type:"Dropdown",default:hr.weight.default,valid:hr.weight.valid,items:[{displayName:"Normal",value:"normal"},{displayName:"Bold",value:"bold"}]},table_body_text_transform:{displayName:"Text Transform",type:"Dropdown",default:hr.text_transform.default,valid:hr.text_transform.valid,items:[{displayName:"Uppercase",value:"uppercase"},{displayName:"Lowercase",value:"lowercase"},{displayName:"Capitalise",value:"capitalize"},{displayName:"None",value:"none"}]},table_body_text_padding:{displayName:"Padding Around Text",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:100}}},table_body_colour:{displayName:"Body Font Colour",type:"ColorPicker",default:fr},table_body_bg_colour:{displayName:"Body Background Colour",type:"ColorPicker",default:"#FFFFFF"},table_body_border_style:{displayName:"Body Border Style",type:"Dropdown",default:mr.style.default,valid:mr.style.valid,items:[{displayName:"Solid",value:"solid"},{displayName:"Dashed",value:"dashed"},{displayName:"Dotted",value:"dotted"},{displayName:"Double",value:"double"},{displayName:"Groove",value:"groove"},{displayName:"Ridge",value:"ridge"},{displayName:"Inset",value:"inset"},{displayName:"Outset",value:"outset"}]},table_body_border_width:{displayName:"Body Border Width",type:"NumUpDown",default:mr.width.default,options:mr.width.options},table_body_border_colour:{displayName:"Body Border Colour",type:"ColorPicker",default:mr.colour.default},table_body_border_top_bottom:{displayName:"Top/Bottom Borders",type:"ToggleSwitch",default:!0},table_body_border_left_right:{displayName:"Left/Right Borders",type:"ToggleSwitch",default:!0}}}},download_options:{description:"Download Options",displayName:"Download Options",settingsGroups:{all:{show_button:{displayName:"Show Download Button",type:"ToggleSwitch",default:!1}}}},labels:{description:"Labels Settings",displayName:"Labels Settings",settingsGroups:{all:{show_labels:{displayName:"Show Value Labels",type:"ToggleSwitch",default:!0},label_position:{displayName:"Label Position",type:"Dropdown",default:"top",valid:["top","bottom"],items:[{displayName:"Top",value:"top"},{displayName:"Bottom",value:"bottom"}]},label_y_offset:{displayName:"Label Offset from Top/Bottom (px)",type:"NumUpDown",default:20},label_line_offset:{displayName:"Label Offset from Connecting Line (px)",type:"NumUpDown",default:5},label_angle_offset:{displayName:"Label Angle Offset (degrees)",type:"NumUpDown",default:0,options:{minValue:{value:-90},maxValue:{value:90}}},label_font:{displayName:"Label Font",type:"FontPicker",default:hr.font.default,valid:hr.font.valid},label_size:{displayName:"Label Font Size",type:"NumUpDown",default:hr.size.default,options:hr.size.options},label_colour:{displayName:"Label Font Colour",type:"ColorPicker",default:fr},label_line_colour:{displayName:"Connecting Line Colour",type:"ColorPicker",default:fr},label_line_width:{displayName:"Connecting Line Width",type:"NumUpDown",default:1,options:{minValue:{value:0},maxValue:{value:100}}},label_line_type:{displayName:"Connecting Line Type",type:"Dropdown",default:"10 0",valid:["10 0","10 10","2 5"],items:[{displayName:"Solid",value:"10 0"},{displayName:"Dashed",value:"10 10"},{displayName:"Dotted",value:"2 5"}]},label_line_max_length:{displayName:"Max Connecting Line Length (px)",type:"NumUpDown",default:1e3,options:{minValue:{value:0},maxValue:{value:1e4}}},label_marker_show:{displayName:"Show Line Markers",type:"ToggleSwitch",default:!0},label_marker_offset:{displayName:"Marker Offset from Value (px)",type:"NumUpDown",default:5},label_marker_size:{displayName:"Marker Size",type:"NumUpDown",default:3,options:{minValue:{value:0},maxValue:{value:100}}},label_marker_colour:{displayName:"Marker Fill Colour",type:"ColorPicker",default:fr},label_marker_outline_colour:{displayName:"Marker Outline Colour",type:"ColorPicker",default:fr}}}}},gr=[];for(const t in yr){const e=[];for(const i in yr[t].settingsGroups)for(const r in yr[t].settingsGroups[i])e.push([r,yr[t].settingsGroups[i][r]]);gr.push([t,Object.fromEntries(e)])}const vr=Object.fromEntries(gr);function _r(t,e){e.plotProperties.displayPlot||e.viewModel.inputSettings.settings.summary_table.show_table||e.viewModel.showGrouped?t.on("contextmenu",(t=>{const i=ut(t.target).datum();e.selectionManager.showContextMenu(i?i.identity:{},{x:t.clientX,y:t.clientY}),t.preventDefault()})):t.on("contextmenu",(()=>{}))}function wr(t,e,i){var r;if(!i.chart_type_props.has_control_limits)return"none";const a=e.outliers.improvement_direction,n=t.ll99.length-1,o=null===(r=null==t?void 0:t.alt_targets)||void 0===r?void 0:r[n];if(br(o)||"neutral"===a)return"none";const l="increase"===a;return o>t.ul99[n]?l?"consistentFail":"consistentPass":o<t.ll99[n]?l?"consistentPass":"consistentFail":"inconsistent"}function br(t){return null==t}function Nr(t,e,i){let r=!0;return br(e)||(r=r&&t>=e),br(i)||(r=r&&t<=i),r}function xr(t){return function(e,i){return Array.isArray(e)&&Array.isArray(i)?e.map(((e,r)=>t(e,i[r]))):Array.isArray(e)&&!Array.isArray(i)?e.map((e=>t(e,i))):!Array.isArray(e)&&Array.isArray(i)?i.map((i=>t(e,i))):t(e,i)}}const Sr=xr(((t,e)=>t>=0?Math.pow(t,e):-Math.pow(-t,e))),kr=xr(((t,e)=>t+e)),Ar=xr(((t,e)=>t-e)),Fr=xr(((t,e)=>t/e)),Er=xr(((t,e)=>br(t)||br(e)?null:t*e));function Mr(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}
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
  */var Tr,$r,Dr,Lr,Cr,Pr,Ir,Vr,Rr,Or,jr,Ur,Gr,zr,Br,qr,Hr,Zr,Yr,Wr,Xr,Kr,Jr,Qr,ta,ea,ia,ra,aa,na,oa,la,sa,ua,pa,da,ca,fa,ha,ma,ya,ga,va,_a,wa,ba,Na,xa,Sa,ka,Aa,Fa,Ea,Ma,Ta,$a,Da,La,Ca,Pa,Ia,Va,Ra,Oa,ja,Ua,Ga,za,Ba,qa,Ha,Za,Ya,Wa,Xa,Ka,Ja,Qa,tn,en,rn,an,nn,on,ln,sn,un,pn,dn,cn,fn,hn,mn,yn,gn,vn,_n,wn,bn,Nn,xn,Sn,kn,An,Fn,En,Mn,Tn,$n,Dn,Ln,Cn,Pn,In,Vn,Rn,On,jn,Un,Gn,zn,Bn,qn,Hn,Zn,Yn,Wn,Xn,Kn,Jn,Qn,to,eo,io,ro,ao,no,oo,lo,so,uo,po,co,fo,ho,mo,yo,go,vo,_o,wo,bo,No,xo,So,ko,Ao,Fo,Eo,Mo,To,$o,Do,Lo,Co,Po,Io,Vo,Ro,Oo,jo,Uo,Go,zo,Bo,qo,Ho,Zo,Yo,Wo,Xo,Ko,Jo,Qo,tl,el,il,rl,al,nl,ol,ll,sl,ul,pl,dl,cl,fl,hl,ml,yl,gl,vl,_l,wl,bl,Nl,xl,Sl,kl,Al,Fl,El,Ml,Tl,$l,Dl,Ll,Cl,Pl,Il,Vl,Rl,Ol,jl,Ul,Gl,zl,Bl,ql,Hl,Zl,Yl,Wl,Xl,Kl,Jl,Ql,ts,es,is,rs,as,ns,os,ls,ss,us,ps,ds,cs,fs,hs,ms,ys,gs,vs,_s,ws,bs,Ns,xs,Ss,ks,As,Fs,Es,Ms,Ts,$s,Ds,Ls,Cs,Ps,Is,Vs,Rs,Os,js,Us,Gs,zs,Bs,qs,Hs,Zs,Ys,Ws,Xs,Ks,Js,Qs,tu,eu,iu,ru,au,nu,ou,lu,su,uu,pu,du,cu,fu,hu,mu,yu,gu,vu,_u,wu,bu,Nu,xu,Su,ku,Au,Fu;function Eu(){if(Lr)return Dr;Lr=1;var t=($r||($r=1,Tr=function(t){return t!=t}),Tr);return Dr=t}
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
  */function Mu(){if(Pr)return Cr;Pr=1;var t=Number.POSITIVE_INFINITY;return Cr=t}
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
  */function Tu(){if(Or)return Rr;Or=1;var t=Vr?Ir:(Vr=1,Ir=Number);return Rr=t}
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
  */function $u(){if(Ur)return jr;Ur=1;var t=Tu().NEGATIVE_INFINITY;return jr=t}
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
  */function Du(){if(qr)return Br;qr=1;var t=function(){if(zr)return Gr;zr=1;var t=Mu(),e=$u();return Gr=function(i){return i===t||i===e},Gr}
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
  */();return Br=t}
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
  */function Lu(){if(Wr)return Yr;Wr=1;var t=(Zr||(Zr=1,Hr=function(t){return Math.abs(t)}),Hr);return Yr=t}
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
  */function Cu(){if(Qr)return Jr;Qr=1;var t=Kr?Xr:(Kr=1,Xr=function(){return"function"==typeof Symbol&&"symbol"==typeof Symbol("foo")});return Jr=t}
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
  */function Pu(){if(ra)return ia;ra=1;var t=function(){if(ea)return ta;ea=1;var t=Cu()();return ta=function(){return t&&"symbol"==typeof Symbol.toStringTag}}
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
  */();return ia=t}
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
  */function Iu(){if(na)return aa;na=1;var t=Object.prototype.toString;return aa=t}
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
  */function Vu(){if(da)return pa;da=1;var t=function(){if(ua)return sa;ua=1;var t=Object.prototype.hasOwnProperty;return sa=function(e,i){return null!=e&&t.call(e,i)}}
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
  */();return pa=t}
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
  */function Ru(){if(ma)return ha;ma=1;var t=function(){if(fa)return ca;fa=1;var t="function"==typeof Symbol?Symbol:void 0;return ca=t}
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
  */();return ha=t}
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
  */function Ou(){if(_a)return va;_a=1;var t=Vu(),e=function(){if(ga)return ya;ga=1;var t=Ru(),e="function"==typeof t?t.toStringTag:"";return ya=e}
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
  */(),i=Iu();return va=function(r){var a,n,o;if(null==r)return i.call(r);n=r[e],a=t(r,e);try{r[e]=void 0}catch(t){return i.call(r)}return o=i.call(r),a?r[e]=n:delete r[e],o}}
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
  */function ju(){if(ba)return wa;ba=1;var t,e=Pu(),i=function(){if(la)return oa;la=1;var t=Iu();return oa=function(e){return t.call(e)}}
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
  */(),r=Ou();return t=e()?r:i,wa=t}
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
  */function Uu(){if(ka)return Sa;ka=1;var t=function(){if(xa)return Na;xa=1;var t=ju(),e="function"==typeof Uint32Array;return Na=function(i){return e&&i instanceof Uint32Array||"[object Uint32Array]"===t(i)}}
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
  */();return Sa=t}
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
  */function Gu(){if($a)return Ta;$a=1;var t=Uu(),e=Fa?Aa:(Fa=1,Aa=4294967295),i=function(){if(Ma)return Ea;Ma=1;var t="function"==typeof Uint32Array?Uint32Array:null;return Ea=t}
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
  */();return Ta=function(){var r,a;if("function"!=typeof i)return!1;try{a=new i(a=[1,3.14,-3.14,e+1,e+2]),r=t(a)&&1===a[0]&&3===a[1]&&a[2]===e-2&&0===a[3]&&1===a[4]}catch(t){r=!1}return r}}
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
  */function zu(){if(Oa)return Ra;Oa=1;var t,e=function(){if(La)return Da;La=1;var t=Gu();return Da=t}
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
  */(),i=function(){if(Pa)return Ca;Pa=1;var t="function"==typeof Uint32Array?Uint32Array:void 0;return Ca=t}
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
  */(),r=Va?Ia:(Va=1,Ia=function(){throw new Error("not implemented")});return t=e()?i:r,Ra=t}
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
  */function Bu(){if(za)return Ga;za=1;var t=function(){if(Ua)return ja;Ua=1;var t=ju(),e="function"==typeof Float64Array;return ja=function(i){return e&&i instanceof Float64Array||"[object Float64Array]"===t(i)}}
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
  */();return Ga=t}
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
  */function qu(){if(Za)return Ha;Za=1;var t=Bu(),e=function(){if(qa)return Ba;qa=1;var t="function"==typeof Float64Array?Float64Array:null;return Ba=t}
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
  */();return Ha=function(){var i,r;if("function"!=typeof e)return!1;try{r=new e([1,3.14,-3.14,NaN]),i=t(r)&&1===r[0]&&3.14===r[1]&&-3.14===r[2]&&r[3]!=r[3]}catch(t){i=!1}return i}}
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
  */function Hu(){if(en)return tn;en=1;var t,e=function(){if(Wa)return Ya;Wa=1;var t=qu();return Ya=t}
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
  */(),i=function(){if(Ka)return Xa;Ka=1;var t="function"==typeof Float64Array?Float64Array:void 0;return Xa=t}
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
  */(),r=Qa?Ja:(Qa=1,Ja=function(){throw new Error("not implemented")});return t=e()?i:r,tn=t}
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
  */function Zu(){if(on)return nn;on=1;var t=function(){if(an)return rn;an=1;var t=ju(),e="function"==typeof Uint8Array;return rn=function(i){return e&&i instanceof Uint8Array||"[object Uint8Array]"===t(i)}}
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
  */();return nn=t}
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
  */function Yu(){if(cn)return dn;cn=1;var t=Zu(),e=sn?ln:(sn=1,ln=255),i=function(){if(pn)return un;pn=1;var t="function"==typeof Uint8Array?Uint8Array:null;return un=t}
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
  */();return dn=function(){var r,a;if("function"!=typeof i)return!1;try{a=new i(a=[1,3.14,-3.14,e+1,e+2]),r=t(a)&&1===a[0]&&3===a[1]&&a[2]===e-2&&0===a[3]&&1===a[4]}catch(t){r=!1}return r}}
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
  */function Wu(){if(wn)return _n;wn=1;var t,e=function(){if(hn)return fn;hn=1;var t=Yu();return fn=t}
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
  */(),i=function(){if(yn)return mn;yn=1;var t="function"==typeof Uint8Array?Uint8Array:void 0;return mn=t}
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
  */(),r=vn?gn:(vn=1,gn=function(){throw new Error("not implemented")});return t=e()?i:r,_n=t}
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
  */function Xu(){if(Sn)return xn;Sn=1;var t=function(){if(Nn)return bn;Nn=1;var t=ju(),e="function"==typeof Uint16Array;return bn=function(i){return e&&i instanceof Uint16Array||"[object Uint16Array]"===t(i)}}
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
  */();return xn=t}
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
  */function Ku(){if(Tn)return Mn;Tn=1;var t=Xu(),e=An?kn:(An=1,kn=65535),i=function(){if(En)return Fn;En=1;var t="function"==typeof Uint16Array?Uint16Array:null;return Fn=t}
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
  */();return Mn=function(){var r,a;if("function"!=typeof i)return!1;try{a=new i(a=[1,3.14,-3.14,e+1,e+2]),r=t(a)&&1===a[0]&&3===a[1]&&a[2]===e-2&&0===a[3]&&1===a[4]}catch(t){r=!1}return r}}
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
  */function Ju(){if(Rn)return Vn;Rn=1;var t,e=function(){if(Dn)return $n;Dn=1;var t=Ku();return $n=t}
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
  */(),i=function(){if(Cn)return Ln;Cn=1;var t="function"==typeof Uint16Array?Uint16Array:void 0;return Ln=t}
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
  */(),r=In?Pn:(In=1,Pn=function(){throw new Error("not implemented")});return t=e()?i:r,Vn=t}
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
  */function Qu(){if(Gn)return Un;Gn=1;var t,e,i=function(){if(jn)return On;jn=1;var t=Wu(),e=Ju();return On={uint16:e,uint8:t}}
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
  */();return(e=new i.uint16(1))[0]=4660,t=52===new i.uint8(e.buffer)[0],Un=t}
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
  */function tp(){if(Bn)return zn;Bn=1;var t=Qu();return zn=t}
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
  */function ep(){if(Yn)return Zn;Yn=1;var t=zu(),e=Hu(),i=function(){if(Hn)return qn;Hn=1;var t=tp();return qn=!0===t?1:0}
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
  */(),r=new e(1),a=new t(r.buffer);return Zn=function(t){return r[0]=t,a[i]},Zn}
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
  */function ip(){if(Xn)return Wn;Xn=1;var t=ep();return Wn=t}
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
  */function rp(){if(to)return Qn;to=1;var t=zu(),e=Hu(),i=function(){if(Jn)return Kn;Jn=1;var t=tp();return Kn=!0===t?1:0}
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
  */(),r=new e(1),a=new t(r.buffer);return Qn=function(t,e){return r[0]=t,a[i]=e>>>0,r[0]},Qn}
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
  */function ap(){if(ao)return ro;ao=1;return ro=1023}
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
  */function np(){if(po)return uo;po=1;var t=ip(),e=function(){if(io)return eo;io=1;var t=rp();return eo=t}
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
  */(),i=Eu(),r=ap(),a=$u(),n=(oo||(oo=1,no=function(t){return 0===t?.3999999999940942:.3999999999940942+t*(.22222198432149784+.15313837699209373*t)}),no),o=(so||(so=1,lo=function(t){return 0===t?.6666666666666735:.6666666666666735+t*(.2857142874366239+t*(.1818357216161805+.14798198605116586*t))}),lo),l=.6931471803691238,s=1.9082149292705877e-10,u=1048575;return uo=function(p){var d,c,f,h,m,y,g,v,_,w,b;return 0===p?a:i(p)||p<0?NaN:(h=0,(c=t(p))<1048576&&(h-=54,c=t(p*=0x40000000000000)),c>=2146435072?p+p:(h+=(c>>20)-r|0,h+=(g=(c&=u)+614244&1048576)>>20,y=(p=e(p,c|1072693248^g))-1,(u&2+c)<3?0===y?0===h?0:h*l+h*s:(m=y*y*(.5-.3333333333333333*y),0===h?y-m:h*l-(m-h*s-y)):(g=c-398458|0,v=440401-c|0,f=(w=(b=(_=y/(2+y))*_)*b)*n(w),m=b*o(w)+f,(g|=v)>0?(d=.5*y*y,0===h?y-(d-_*(d+m)):h*l-(d-(_*(d+m)+h*s)-y)):0===h?y-_*(y-m):h*l-(_*(y-m)-h*s-y))))},uo}
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
  */function op(){if(go)return yo;go=1;var t=function(){if(mo)return ho;mo=1;var t=Math.floor;return ho=t}
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
  */();return yo=t}
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
  */function lp(){if(bo)return wo;bo=1;var t=function(){if(_o)return vo;_o=1;var t=Math.ceil;return vo=t}
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
  */();return wo=t}
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
  */function sp(){if(ko)return So;ko=1;var t=function(){if(xo)return No;xo=1;var t=op(),e=lp();return No=function(i){return i<0?e(i):t(i)},No}
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
  */();return So=t}
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
  */function up(){if($o)return To;$o=1;var t=(Fo||(Fo=1,Ao=function(t){return 0===t?.0416666666666666:.0416666666666666+t*(2480158728947673e-20*t-.001388888888887411)}),Ao),e=(Mo||(Mo=1,Eo=function(t){return 0===t?-2.7557314351390663e-7:t*(2.087572321298175e-9+-11359647557788195e-27*t)-2.7557314351390663e-7}),Eo);return To=function(i,r){var a,n,o,l;return o=(l=i*i)*l,n=l*t(l),n+=o*o*e(l),(o=1-(a=.5*l))+(1-o-a+(l*n-i*r))},To}
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
  */function pp(){if(Lo)return Do;Lo=1;var t=up();return Do=t}
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
  */function dp(){if(Vo)return Io;Vo=1;var t=function(){if(Po)return Co;Po=1;var t=-.16666666666666632;return Co=function(e,i){var r,a,n;return r=.00833333333332249+(n=e*e)*(27557313707070068e-22*n-.0001984126982985795)+n*(n*n)*(1.58969099521155e-10*n-2.5050760253406863e-8),a=n*e,0===i?e+a*(t+n*r):e-(n*(.5*i-a*r)-i-a*t)},Co}
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
  */();return Io=t}
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
  */function cp(){if(Oo)return Ro;Oo=1;return Ro=2147483647}
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
  */function fp(){if(Uo)return jo;Uo=1;return jo=2146435072}
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
  */function hp(){if(Zo)return Ho;Zo=1;var t=zu(),e=Hu(),i=function(){if(qo)return Bo;qo=1;var t=tp();return Bo=!0===t?0:1}
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
  */(),r=new e(1),a=new t(r.buffer);return Ho=function(t){return r[0]=t,a[i]},Ho}
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
  */function mp(){if(Qo)return Jo;Qo=1;var t=zu(),e=Hu(),i=function(){return Ko?Xo:(Ko=1,!0===tp()?(t=1,e=0):(t=0,e=1),Xo={HIGH:t,LOW:e});var t,e}
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
  */(),r=new e(1),a=new t(r.buffer),n=i.HIGH,o=i.LOW;return Jo=function(t,e){return a[n]=t,a[o]=e,r[0]},Jo}
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
  */function yp(){if(el)return tl;el=1;var t=mp();return tl=t}
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
  */function gp(){if(fl)return cl;fl=1;var t=function(){if(dl)return pl;dl=1;var t="function"==typeof Object.defineProperty?Object.defineProperty:null;return pl=t}
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
  */();return cl=function(){try{return t({},"x",{}),!0}catch(t){return!1}}}
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
  */function vp(){if(ml)return hl;ml=1;var t=Object.defineProperty;return hl=t}
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
  */function _p(){if(gl)return yl;return gl=1,yl=function(t){return"number"==typeof t}}
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
  */function wp(){if(_l)return vl;function t(t){var e,i="";for(e=0;e<t;e++)i+="0";return i}return _l=1,vl=function(e,i,r){var a=!1,n=i-e.length;return n<0||(function(t){return"-"===t[0]}(e)&&(a=!0,e=e.substr(1)),e=r?e+t(n):t(n)+e,a&&(e="-"+e)),e},vl}
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
  */function bp(){if(Ml)return El;Ml=1;var t=function(){if(bl)return wl;bl=1;var t=_p(),e=wp(),i=String.prototype.toLowerCase,r=String.prototype.toUpperCase;return wl=function(a){var n,o,l;switch(a.specifier){case"b":n=2;break;case"o":n=8;break;case"x":case"X":n=16;break;default:n=10}if(o=a.arg,l=parseInt(o,10),!isFinite(l)){if(!t(o))throw new Error("invalid integer. Value: "+o);l=0}return l<0&&("u"===a.specifier||10!==n)&&(l=4294967295+l+1),l<0?(o=(-l).toString(n),a.precision&&(o=e(o,a.precision,a.padRight)),o="-"+o):(o=l.toString(n),l||a.precision?a.precision&&(o=e(o,a.precision,a.padRight)):o="",a.sign&&(o=a.sign+o)),16===n&&(a.alternate&&(o="0x"+o),o=a.specifier===r.call(a.specifier)?r.call(o):i.call(o)),8===n&&a.alternate&&"0"!==o.charAt(0)&&(o="0"+o),o}}
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
  */(),e=xl?Nl:(xl=1,Nl=function(t){return"string"==typeof t}),i=function(){if(kl)return Sl;kl=1;var t=_p(),e=Math.abs,i=String.prototype.toLowerCase,r=String.prototype.toUpperCase,a=String.prototype.replace,n=/e\+(\d)$/,o=/e-(\d)$/,l=/^(\d+)$/,s=/^(\d+)e/,u=/\.0$/,p=/\.0*e/,d=/(\..*[^0])0*e/;return Sl=function(c){var f,h,m=parseFloat(c.arg);if(!isFinite(m)){if(!t(c.arg))throw new Error("invalid floating-point number. Value: "+h);m=c.arg}switch(c.specifier){case"e":case"E":h=m.toExponential(c.precision);break;case"f":case"F":h=m.toFixed(c.precision);break;case"g":case"G":e(m)<1e-4?((f=c.precision)>0&&(f-=1),h=m.toExponential(f)):h=m.toPrecision(c.precision),c.alternate||(h=a.call(h,d,"$1e"),h=a.call(h,p,"e"),h=a.call(h,u,""));break;default:throw new Error("invalid double notation. Value: "+c.specifier)}return h=a.call(h,n,"e+0$1"),h=a.call(h,o,"e-0$1"),c.alternate&&(h=a.call(h,l,"$1."),h=a.call(h,s,"$1.e")),m>=0&&c.sign&&(h=c.sign+h),c.specifier===r.call(c.specifier)?r.call(h):i.call(h)}}
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
  */(),r=function(){if(Fl)return Al;function t(t){var e,i="";for(e=0;e<t;e++)i+=" ";return i}return Fl=1,Al=function(e,i,r){var a=i-e.length;return a<0?e:e=r?e+t(a):t(a)+e},Al}
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
  */(),a=wp(),n=String.fromCharCode,o=Array.isArray;function l(t){return t!=t}function s(t){var e={};return e.specifier=t.specifier,e.precision=void 0===t.precision?1:t.precision,e.width=t.width,e.flags=t.flags||"",e.mapping=t.mapping,e}return El=function(u){var p,d,c,f,h,m,y,g,v;if(!o(u))throw new TypeError("invalid argument. First argument must be an array. Value: `"+u+"`.");for(m="",y=1,g=0;g<u.length;g++)if(c=u[g],e(c))m+=c;else{if(p=void 0!==c.precision,!(c=s(c)).specifier)throw new TypeError("invalid argument. Token is missing `specifier` property. Index: `"+g+"`. Value: `"+c+"`.");for(c.mapping&&(y=c.mapping),d=c.flags,v=0;v<d.length;v++)switch(f=d.charAt(v)){case" ":c.sign=" ";break;case"+":c.sign="+";break;case"-":c.padRight=!0,c.padZeros=!1;break;case"0":c.padZeros=d.indexOf("-")<0;break;case"#":c.alternate=!0;break;default:throw new Error("invalid flag: "+f)}if("*"===c.width){if(c.width=parseInt(arguments[y],10),y+=1,l(c.width))throw new TypeError("the argument for * width at position "+y+" is not a number. Value: `"+c.width+"`.");c.width<0&&(c.padRight=!0,c.width=-c.width)}if(p&&"*"===c.precision){if(c.precision=parseInt(arguments[y],10),y+=1,l(c.precision))throw new TypeError("the argument for * precision at position "+y+" is not a number. Value: `"+c.precision+"`.");c.precision<0&&(c.precision=1,p=!1)}switch(c.arg=arguments[y],c.specifier){case"b":case"o":case"x":case"X":case"d":case"i":case"u":p&&(c.padZeros=!1),c.arg=t(c);break;case"s":c.maxWidth=p?c.precision:-1,c.arg=String(c.arg);break;case"c":if(!l(c.arg)){if((h=parseInt(c.arg,10))<0||h>127)throw new Error("invalid character code. Value: "+c.arg);c.arg=l(h)?String(c.arg):n(h)}break;case"e":case"E":case"f":case"F":case"g":case"G":p||(c.precision=6),c.arg=i(c);break;default:throw new Error("invalid specifier: "+c.specifier)}c.maxWidth>=0&&c.arg.length>c.maxWidth&&(c.arg=c.arg.substring(0,c.maxWidth)),c.padZeros?c.arg=a(c.arg,c.width||c.precision,c.padRight):c.width&&(c.arg=r(c.arg,c.width,c.padRight)),m+=c.arg||"",y+=1}return m},El}
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
  */function Np(){if(Pl)return Cl;Pl=1;var t=function(){if(Ll)return Dl;Ll=1;var t=/%(?:([1-9]\d*)\$)?([0 +\-#]*)(\*|\d+)?(?:(\.)(\*|\d+)?)?[hlL]?([%A-Za-z])/g;function e(t){var e={mapping:t[1]?parseInt(t[1],10):void 0,flags:t[2],width:t[3],precision:t[5],specifier:t[6]};return"."===t[4]&&void 0===t[5]&&(e.precision="1"),e}return Dl=function(i){var r,a,n,o;for(a=[],o=0,n=t.exec(i);n;)(r=i.slice(o,t.lastIndex-n[0].length)).length&&a.push(r),a.push(e(n)),o=t.lastIndex,n=t.exec(i);return(r=i.slice(o)).length&&a.push(r),a}}
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
  */();return Cl=t}
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
  */function xp(){if(Ol)return Rl;Ol=1;var t=function(){if($l)return Tl;$l=1;var t=bp();return Tl=t}
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
  */(),e=Np(),i=Vl?Il:(Vl=1,Il=function(t){return"string"==typeof t});return Rl=function r(a){var n,o;if(!i(a))throw new TypeError(r("invalid argument. First argument must be a string. Value: `%s`.",a));for(n=[e(a)],o=1;o<arguments.length;o++)n.push(arguments[o]);return t.apply(null,n)},Rl}
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
  */function Sp(){if(zl)return Gl;zl=1;var t=function(){if(Ul)return jl;Ul=1;var t=xp();return jl=t}
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
  */(),e=Object.prototype,i=e.toString,r=e.__defineGetter__,a=e.__defineSetter__,n=e.__lookupGetter__,o=e.__lookupSetter__;return Gl=function(l,s,u){var p,d,c,f;if("object"!=typeof l||null===l||"[object Array]"===i.call(l))throw new TypeError(t("invalid argument. First argument must be an object. Value: `%s`.",l));if("object"!=typeof u||null===u||"[object Array]"===i.call(u))throw new TypeError(t("invalid argument. Property descriptor must be an object. Value: `%s`.",u));if((d="value"in u)&&(n.call(l,s)||o.call(l,s)?(p=l.__proto__,l.__proto__=e,delete l[s],l[s]=u.value,l.__proto__=p):l[s]=u.value),c="get"in u,f="set"in u,d&&(c||f))throw new Error("invalid argument. Cannot specify one or more accessors and a value or writable attribute in the property descriptor.");return c&&r&&r.call(l,s,u.get),f&&a&&a.call(l,s,u.set),l}}
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
  */function kp(){if(Zl)return Hl;Zl=1;var t=function(){if(ql)return Bl;ql=1;var t,e=gp(),i=vp(),r=Sp();return t=e()?i:r,Bl=t}
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
  */();return Hl=function(e,i,r){t(e,i,{configurable:!1,enumerable:!1,writable:!1,value:r})}}
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
  */function Ap(){if(Wl)return Yl;Wl=1;var t=kp();return Yl=t}
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
  */function Fp(){if(Ql)return Jl;Ql=1;var t=zu(),e=Hu(),i=function(){return Kl?Xl:(Kl=1,!0===tp()?(t=1,e=0):(t=0,e=1),Xl={HIGH:t,LOW:e});var t,e}
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
  */(),r=new e(1),a=new t(r.buffer),n=i.HIGH,o=i.LOW;return Jl=function(t,e,i,l){return r[0]=t,e[l]=a[n],e[l+i]=a[o],e},Jl}
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
  */function Ep(){if(rs)return is;rs=1;var t=Ap(),e=function(){if(es)return ts;es=1;var t=Fp();return ts=function(e){return t(e,[0,0],1,0)},ts}
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
  */();return t(e,"assign",Fp()),is=e}
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
  */function Mp(){if(ns)return as;ns=1;var t=ul?sl:(ul=1,sl=2147483648),e=cp(),i=Ep(),r=ip(),a=yp(),n=[0,0];return as=function(o,l){var s,u;return i.assign(o,n,1,0),s=n[0],s&=e,u=r(l),a(s|=u&=t,n[1])},as}
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
  */function Tp(){if(ls)return os;ls=1;var t=Mp();return os=t}
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
  */function $p(){if(ds)return ps;ds=1;var t=us?ss:(us=1,ss=22250738585072014e-324),e=Du(),i=Eu(),r=Lu();return ps=function(a,n,o,l){return i(a)||e(a)?(n[l]=a,n[l+o]=0,n):0!==a&&r(a)<t?(n[l]=4503599627370496*a,n[l+o]=-52,n):(n[l]=a,n[l+o]=0,n)},ps}
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
  */function Dp(){if(ms)return hs;ms=1;var t=Ap(),e=function(){if(fs)return cs;fs=1;var t=$p();return cs=function(e){return t(e,[0,0],1,0)},cs}
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
  */();return t(e,"assign",$p()),hs=e}
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
  */function Lp(){if(_s)return vs;_s=1;var t=function(){if(gs)return ys;gs=1;var t=ip(),e=fp(),i=ap();return ys=function(r){var a=t(r);return(a=(a&e)>>>20)-i|0},ys}
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
  */();return vs=t}
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
  */function Cp(){if(bs)return ws;bs=1;var t=Mu(),e=$u(),i=ap(),r=rl?il:(rl=1,il=1023),a=nl?al:(nl=1,al=-1023),n=ll?ol:(ll=1,ol=-1074),o=Eu(),l=Du(),s=Tp(),u=Dp().assign,p=Lp(),d=Ep(),c=yp(),f=[0,0],h=[0,0];return ws=function(m,y){var g,v;return 0===y||0===m||o(m)||l(m)?m:(u(m,f,1,0),y+=f[1],(y+=p(m=f[0]))<n?s(0,m):y>r?m<0?e:t:(y<=a?(y+=52,v=2220446049250313e-31):v=1,d.assign(m,h,1,0),g=h[0],g&=2148532223,v*c(g|=y+i<<20,h[1])))},ws}
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
  */function Pp(){if(Fs)return As;Fs=1;var t=ks?Ss:(ks=1,Ss=function(t,e){var i,r;for(i=[],r=0;r<e;r++)i.push(t);return i});return As=t}
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
  */function Ip(){if($s)return Ts;$s=1;var t=function(){if(Ms)return Es;Ms=1;var t=Pp();return Es=function(e){return t(0,e)}}
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
  */();return Ts=t}
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
  */function Vp(){if(Ls)return Ds;Ls=1;var t=op(),e=function(){if(xs)return Ns;xs=1;var t=Cp();return Ns=t}
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
  */(),i=Ip(),r=[10680707,7228996,1387004,2578385,16069853,12639074,9804092,4427841,16666979,11263675,12935607,2387514,4345298,14681673,3074569,13734428,16653803,1880361,10960616,8533493,3062596,8710556,7349940,6258241,3772886,3769171,3798172,8675211,12450088,3874808,9961438,366607,15675153,9132554,7151469,3571407,2607881,12013382,4155038,6285869,7677882,13102053,15825725,473591,9065106,15363067,6271263,9264392,5636912,4652155,7056368,13614112,10155062,1944035,9527646,15080200,6658437,6231200,6832269,16767104,5075751,3212806,1398474,7579849,6349435,12618859],a=[1.570796251296997,7.549789415861596e-8,5390302529957765e-30,3282003415807913e-37,1270655753080676e-44,12293330898111133e-52,27337005381646456e-60,21674168387780482e-67],n=16777216,o=5.960464477539063e-8,l=i(20),s=i(20),u=i(20),p=i(20);function d(i,l,s,c,f,h,m,y,g){var v,_,w,b,N,x,S,k,A;for(b=h,A=c[s],k=s,N=0;k>0;N++)_=o*A|0,p[N]=A-n*_|0,A=c[k-1]+_,k-=1;if(A=e(A,f),A-=8*t(.125*A),A-=S=0|A,w=0,f>0?(S+=N=p[s-1]>>24-f,p[s-1]-=N<<24-f,w=p[s-1]>>23-f):0===f?w=p[s-1]>>23:A>=.5&&(w=2),w>0){for(S+=1,v=0,N=0;N<s;N++)k=p[N],0===v?0!==k&&(v=1,p[N]=16777216-k):p[N]=16777215-k;if(f>0)switch(f){case 1:p[s-1]&=8388607;break;case 2:p[s-1]&=4194303}2===w&&(A=1-A,0!==v&&(A-=e(1,f)))}if(0===A){for(k=0,N=s-1;N>=h;N--)k|=p[N];if(0===k){for(x=1;0===p[h-x];x++);for(N=s+1;N<=s+x;N++){for(g[y+N]=r[m+N],_=0,k=0;k<=y;k++)_+=i[k]*g[y+(N-k)];c[N]=_}return d(i,l,s+=x,c,f,h,m,y,g)}}if(0===A)for(s-=1,f-=24;0===p[s];)s-=1,f-=24;else(A=e(A,-f))>=n?(_=o*A|0,p[s]=A-n*_|0,f+=24,p[s+=1]=_):p[s]=0|A;for(_=e(1,f),N=s;N>=0;N--)c[N]=_*p[N],_*=o;for(N=s;N>=0;N--){for(_=0,x=0;x<=b&&x<=s-N;x++)_+=a[x]*c[N+x];u[s-N]=_}for(_=0,N=s;N>=0;N--)_+=u[N];for(l[0]=0===w?_:-_,_=u[0]-_,N=1;N<=s;N++)_+=u[N];return l[1]=0===w?_:-_,7&S}return Ds=function(t,e,i,a){var n,o,u,p,c,f,h;for((o=(i-3)/24|0)<0&&(o=0),p=i-24*(o+1),f=o-(u=a-1),h=u+4,c=0;c<=h;c++)l[c]=f<0?0:r[f],f+=1;for(c=0;c<=4;c++){for(n=0,f=0;f<=u;f++)n+=t[f]*l[u+(c-f)];s[c]=n}return d(t,e,4,s,p,4,o,u,l)},Ds}
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
  */function Rp(){if(Vs)return Is;Vs=1;var t=function(){if(Ps)return Cs;Ps=1;var t=Math.round;return Cs=t}
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
  */();return Is=t}
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
  */function Op(){if(Us)return js;Us=1;var t=cp(),e=fp(),i=zo?Go:(zo=1,Go=1048575),r=ip(),a=function(){if(Wo)return Yo;Wo=1;var t=hp();return Yo=t}
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
  */(),n=yp(),o=Vp(),l=function(){if(Os)return Rs;Os=1;var t=Rp(),e=ip();return Rs=function(i,r,a){var n,o,l,s,u;return l=i-1.5707963267341256*(n=t(.6366197723675814*i)),s=6077100506506192e-26*n,u=r>>20,a[0]=l-s,u-(e(a[0])>>20&2047)>16&&(s=20222662487959506e-37*n-((o=l)-(l=o-(s=6077100506303966e-26*n))-s),a[0]=l-s,u-(e(a[0])>>20&2047)>49&&(s=84784276603689e-45*n-((o=l)-(l=o-(s=20222662487111665e-37*n))-s),a[0]=l-s)),a[1]=l-a[0]-s,n},Rs}
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
  */(),s=1.5707963267341256,u=6077100506506192e-26,p=2*u,d=3*u,c=4*u,f=[0,0,0],h=[0,0];return js=function(m,y){var g,v,_,w,b,N,x;if((_=r(m)&t)<=1072243195)return y[0]=m,y[1]=0,0;if(_<=1074752122)return 598523==(_&i)?l(m,_,y):_<=1073928572?m>0?(x=m-s,y[0]=x-u,y[1]=x-y[0]-u,1):(x=m+s,y[0]=x+u,y[1]=x-y[0]+u,-1):m>0?(x=m-2*s,y[0]=x-p,y[1]=x-y[0]-p,2):(x=m+2*s,y[0]=x+p,y[1]=x-y[0]+p,-2);if(_<=1075594811)return _<=1075183036?1074977148===_?l(m,_,y):m>0?(x=m-3*s,y[0]=x-d,y[1]=x-y[0]-d,3):(x=m+3*s,y[0]=x+d,y[1]=x-y[0]+d,-3):1075388923===_?l(m,_,y):m>0?(x=m-4*s,y[0]=x-c,y[1]=x-y[0]-c,4):(x=m+4*s,y[0]=x+c,y[1]=x-y[0]+c,-4);if(_<1094263291)return l(m,_,y);if(_>=e)return y[0]=NaN,y[1]=NaN,0;for(g=a(m),x=n(_-((v=(_>>20)-1046)<<20),g),b=0;b<2;b++)f[b]=0|x,x=16777216*(x-f[b]);for(f[2]=x,w=3;0===f[w-1];)w-=1;return N=o(f,h,v,w,1),m<0?(y[0]=-h[0],y[1]=-h[1],-N):(y[0]=h[0],y[1]=h[1],N)},js}
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
  */function jp(){if(zs)return Gs;zs=1;var t=Op();return Gs=t}
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
  */function Up(){if(Zs)return Hs;Zs=1;var t=function(){if(qs)return Bs;qs=1;var t=ip(),e=pp(),i=dp(),r=jp(),a=[0,0];return Bs=function(n){var o;if(o=t(n),(o&=2147483647)<=1072243195)return o<1044381696?1:e(n,0);if(o>=2146435072)return NaN;switch(3&r(n,a)){case 0:return e(a[0],a[1]);case 1:return-i(a[0],a[1]);case 2:return-e(a[0],a[1]);default:return i(a[0],a[1])}},Bs}
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
  */();return Hs=t}
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
  */function Gp(){if(Ks)return Xs;Ks=1;var t=function(){if(Ws)return Ys;Ws=1;var t=cp(),e=fp(),i=ip(),r=pp(),a=dp(),n=jp(),o=[0,0];return Ys=function(l){var s;if(s=i(l),(s&=t)<=1072243195)return s<1045430272?l:a(l,0);if(s>=e)return NaN;switch(3&n(l,o)){case 0:return a(o[0],o[1]);case 1:return r(o[0],o[1]);case 2:return-a(o[0],o[1]);default:return-r(o[0],o[1])}},Ys}
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
  */();return Xs=t}
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
  */function zp(){if(Qs)return Js;Qs=1;return Js=3.141592653589793}
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
  */function Bp(){if(ru)return iu;ru=1;var t=function(){if(eu)return tu;eu=1;var t=Eu(),e=Du(),i=Up(),r=Gp(),a=Lu(),n=Tp(),o=zp();return tu=function(l){var s,u;return t(l)||e(l)?NaN:0===(s=a(u=l%2))||1===s?n(0,u):s<.25?r(o*u):s<.75?n(i(o*(s=.5-s)),u):s<1.25?(u=n(1,u)-u,r(o*u)):s<1.75?-n(i(o*(s-=1.5)),u):(u-=n(2,u),r(o*u))},tu}
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
  */();return iu=t}
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
  */function qp(){if(ku)return Su;ku=1;var t=Eu(),e=Du(),i=Lu(),r=function(){if(fo)return co;fo=1;var t=np();return co=t}
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
  */(),a=sp(),n=Bp(),o=zp(),l=Mu(),s=(nu||(nu=1,au=function(t){return 0===t?.06735230105312927:.06735230105312927+t*(.007385550860814029+t*(.0011927076318336207+t*(.00022086279071390839+25214456545125733e-21*t)))}),au),u=(lu||(lu=1,ou=function(t){return 0===t?.020580808432516733:.020580808432516733+t*(.0028905138367341563+t*(.0005100697921535113+t*(.00010801156724758394+44864094961891516e-21*t)))}),ou),p=(uu||(uu=1,su=function(t){return 0===t?1.3920053346762105:1.3920053346762105+t*(.7219355475671381+t*(.17193386563280308+t*(.01864591917156529+t*(.0007779424963818936+7326684307446256e-21*t))))}),su),d=(du||(du=1,pu=function(t){return 0===t?.21498241596060885:.21498241596060885+t*(.325778796408931+t*(.14635047265246445+t*(.02664227030336386+t*(.0018402845140733772+3194753265841009e-20*t))))}),pu),c=(fu||(fu=1,cu=function(t){return 0===t?-.032788541075985965:t*(.006100538702462913+t*(.00031563207090362595*t-.0014034646998923284))-.032788541075985965}),cu),f=(mu||(mu=1,hu=function(t){return 0===t?.01797067508118204:.01797067508118204+t*(t*(.000881081882437654+-.00031275416837512086*t)-.0036845201678113826)}),hu),h=(gu||(gu=1,yu=function(t){return 0===t?-.010314224129834144:t*(.0022596478090061247+t*(.0003355291926355191*t-.0005385953053567405))-.010314224129834144}),yu),m=(_u||(_u=1,vu=function(t){return 0===t?.6328270640250934:.6328270640250934+t*(1.4549225013723477+t*(.9777175279633727+t*(.22896372806469245+.013381091853678766*t)))}),vu),y=(bu||(bu=1,wu=function(t){return 0===t?2.4559779371304113:2.4559779371304113+t*(2.128489763798934+t*(.7692851504566728+t*(.10422264559336913+.003217092422824239*t)))}),wu),g=(xu||(xu=1,Nu=function(t){return 0===t?.08333333333333297:.08333333333333297+t*(t*(.0007936505586430196+t*(t*(.0008363399189962821+-.0016309293409657527*t)-.00059518755745034))-.0027777777772877554)}),Nu),v=1.4616321449683622,_=1.4616321449683622;return Su=function(w){var b,N,x,S,k,A,F,E;if(t(w)||e(w))return w;if(0===w)return l;if(w<0?(b=!0,w=-w):b=!1,w<8470329472543003e-37)return-r(w);if(b){if(w>=4503599627370496)return l;if(0===(S=n(w)))return l;N=r(o/i(S*w))}if(1===w||2===w)return 0;if(w<2)switch(w<=.9?(E=-r(w),w>=v-1+.27?(A=1-w,x=0):w>=v-1-.27?(A=w-(_-1),x=1):(A=w,x=2)):(E=0,w>=v+.27?(A=2-w,x=0):w>=v-.27?(A=w-_,x=1):(A=w-1,x=2)),x){case 0:E+=A*(.07721566490153287+(F=A*A)*s(F))+F*(.3224670334241136+F*u(F))-.5*A;break;case 1:E+=-.12148629053584961+((F=A*A)*(.48383612272381005+(k=F*A)*c(k))-(-3638676997039505e-33-k*(k*f(k)-.1475877229945939+A*(.06462494023913339+k*h(k)))));break;case 2:E+=-.5*A+A*(A*m(A)-.07721566490153287)/(1+A*y(A))}else if(w<8)switch(E=.5*(A=w-(x=a(w)))+A*(A*d(A)-.07721566490153287)/(1+A*p(A)),F=1,x){case 7:F*=A+6;case 6:F*=A+5;case 5:F*=A+4;case 4:F*=A+3;case 3:E+=r(F*=A+2)}else E=w<0x400000000000000?(w-.5)*((S=r(w))-1)+(k=.4189385332046727+(F=1/w)*g(A=F*F)):w*(r(w)-1);return b&&(E=N-E),E},Su}
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
  */var Hp=function(){if(Fu)return Au;Fu=1;var t=qp();return Au=t}(),Zp=Mr(Hp);function Yp(t){return function(e){return Array.isArray(e)?e.map((e=>t(e))):t(e)}}const Wp=Yp(Math.sqrt),Xp=Yp((t=>t?Math.abs(t):t)),Kp=Yp(Math.exp),Jp=Yp(Zp),Qp=Yp((t=>Math.pow(t,2)));function td(t,e){return function(i,r){return function(t,e,i,r){const a=r.percentLabels?"%":"",n=i.spc.sig_figs;if(br(t))return"";switch(e){case"date":return t;case"integer":return t.toFixed(r.chart_type_props.integer_num_den?0:n);default:return t.toFixed(n)+a}}(i,r,t,e)}}function ed(t,e,i,r){const a=i.outliers.astronomical_limit,n=i.outliers.two_in_three_limit,o=td(i,r),l=new Array;if(i.spc.ttip_show_date){const e=i.spc.ttip_label_date;l.push({displayName:"Automatic"===e?r.chart_type_props.date_name:e,value:t.date})}if(i.spc.ttip_show_value){const e=i.spc.ttip_label_value;l.push({displayName:"Automatic"===e?r.chart_type_props.value_name:e,value:o(t.value,"value")})}if(i.spc.ttip_show_numerator&&!br(t.numerator)&&l.push({displayName:i.spc.ttip_label_numerator,value:o(t.numerator,"integer")}),i.spc.ttip_show_denominator&&!br(t.denominator)&&l.push({displayName:i.spc.ttip_label_denominator,value:o(t.denominator,"integer")}),i.lines.ttip_show_trend&&i.lines.show_trend&&l.push({displayName:i.lines.ttip_label_trend,value:o(t.trend_line,"value")}),i.lines.show_specification&&i.lines.ttip_show_specification&&(br(t.speclimits_upper)||l.push({displayName:`Upper ${i.lines.ttip_label_specification}`,value:o(t.speclimits_upper,"value")}),br(t.speclimits_lower)||l.push({displayName:`Lower ${i.lines.ttip_label_specification}`,value:o(t.speclimits_lower,"value")})),r.chart_type_props.has_control_limits&&["99","95","65"].forEach((e=>{i.lines[`ttip_show_${e}`]&&i.lines[`show_${e}`]&&l.push({displayName:`${i.lines[`ttip_label_${e}_prefix_upper`]}${i.lines[`ttip_label_${e}`]}`,value:o(t[`ul${e}`],"value")})})),i.lines.show_target&&i.lines.ttip_show_target&&l.push({displayName:i.lines.ttip_label_target,value:o(t.target,"value")}),i.lines.show_alt_target&&i.lines.ttip_show_alt_target&&!br(t.alt_target)&&l.push({displayName:i.lines.ttip_label_alt_target,value:o(t.alt_target,"value")}),r.chart_type_props.has_control_limits&&["68","95","99"].forEach((e=>{i.lines[`ttip_show_${e}`]&&i.lines[`show_${e}`]&&l.push({displayName:`${i.lines[`ttip_label_${e}_prefix_lower`]}${i.lines[`ttip_label_${e}`]}`,value:o(t[`ll${e}`],"value")})})),[t.astpoint,t.trend,t.shift,t.two_in_three].some((t=>"none"!==t))){const e=new Array;if("none"!==t.astpoint){let t="Astronomical Point";"3 Sigma"!==a&&(t=`${t} (${a})`),e.push(t)}if("none"!==t.trend&&e.push("Trend"),"none"!==t.shift&&e.push("Shift"),"none"!==t.two_in_three){let t="Two-in-Three";"2 Sigma"!==n&&(t=`${t} (${n})`),e.push(t)}l.push({displayName:"Pattern(s)",value:e.join("\n")})}return!br(e)&&e.length>0&&e.forEach((t=>l.push(t))),l}const id=xr(((t,e)=>{if("none"===t)return t;const i={increase:{upper:"improvement",lower:"deterioration"}[t],decrease:{lower:"improvement",upper:"deterioration"}[t],neutral:{lower:"neutral_low",upper:"neutral_high"}[t]}[e.improvement_direction];return"both"!==e.process_flag_type?i===e.process_flag_type?i:"none":i})),rd=Yp((t=>{if(t<=1||br(t))return null;const e=t-1;return Wp(2/e)*Kp(Jp(t/2)-Jp(e/2))})),ad=Yp((t=>Wp(1-Qp(rd(t))))),nd=Yp((t=>{const e=t<=1?null:t;return 3/(rd(e)*Wp(e))})),od=xr(((t,e)=>e*ad(t)/rd(t))),ld=xr(((t,e)=>1-od(t,e))),sd=xr(((t,e)=>1+od(t,e)));function ud(t){return t.map(((t,e,i)=>e>0?t-i[e-1]:null))}function pd(t,e){return Array(e).fill(t)}function dd(t,e,i,r){var a;const n=null===(a=null==t?void 0:t[e])||void 0===a?void 0:a[i];return br(n)?r:(null==n?void 0:n.solid)?n.solid.color:n}function cd(t,e,i,r){var a,n,o;if(br(null==t?void 0:t.categories))return{values:null,validation:{status:0,messages:pd(new Array,1)}};if(0===(null===(o=null===(n=null===(a=null==t?void 0:t.categories)||void 0===a?void 0:a[0])||void 0===n?void 0:n.identity)||void 0===o?void 0:o.length))return{values:null,validation:{status:0,messages:pd(new Array,1)}};const l=t.categories[0],s=Object.keys(i[e]),u=JSON.parse(JSON.stringify({status:0,messages:pd([],l.values.length)})),p=r.length;let d=new Array(p);for(let t=0;t<p;t++){const i=l.objects?l.objects[r[t]]:null;d[t]=Object.fromEntries(s.map((r=>{var a,n,o,l,s,p,d;const c=vr[e][r].default;let f=dd(i,e,r,c);f=""===f?c:f;const h=null!==(n=null===(a=vr[e][r])||void 0===a?void 0:a.valid)&&void 0!==n?n:null===(o=vr[e][r])||void 0===o?void 0:o.options,m=!br(null==h?void 0:h.minValue)||!br(null==h?void 0:h.maxValue);if(h){let i="";h instanceof Array&&!h.includes(f)?i=`${f} is not a valid value for ${r}. Valid values are: ${h.join(", ")}`:m&&!Nr(f,null===(l=null==h?void 0:h.minValue)||void 0===l?void 0:l.value,null===(s=null==h?void 0:h.maxValue)||void 0===s?void 0:s.value)&&(i=`${f} is not a valid value for ${r}. Valid values are between ${null===(p=null==h?void 0:h.minValue)||void 0===p?void 0:p.value} and ${null===(d=null==h?void 0:h.maxValue)||void 0===d?void 0:d.value}`),""!==i&&(f=vr[e][r].default,u.messages[t].push(i))}return[r,f]})))}const c=u.messages.filter((t=>t.length>0));return u.messages.some((t=>0===t.length))||(u.status=1,u.error=`${c[0][0]}`),{values:d,validation:u}}function fd(t){const e=Object.fromEntries(t.filter((t=>"literal"!==t.type)).map((t=>[t.type,t.value])));return["weekday","day","month","year"].forEach((t=>{var i;null!==(i=e[t])&&void 0!==i||(e[t]="")})),e}function hd(t,e,i){var r,a,n;const o=i.length;let l=new Array(o);if(1===t.length&&!(null===(r=t[0].source.type)||void 0===r?void 0:r.temporal)){for(let e=0;e<o;e++)l[e]=br(t[0].values[i[e]])?null:String(t[0].values[i[e]]);return l}const s=e.dates.date_format_delim;if(!t.every((t=>{var e,i;return null===(i=null===(e=t.source)||void 0===e?void 0:e.type)||void 0===i?void 0:i.temporal}))){const e=pd("",t.length).join(s);for(let r=0;r<o;r++){const a=t.map((t=>t.values[i[r]])).join(s);l[r]=a===e?null:a}return l}const u=function(t,e){var i,r,a,n,o;const l=e.length;let s=[];const u=[];if(t.length>1)for(let n=0;n<l;n++){const o=[];for(let i=0;i<t.length;i++)o.push(Fd(t[i].source.type,t[i].values[e[n]]));const l=Object.fromEntries(o);(null==l?void 0:l.quarter)&&u.push(l.quarter),s[n]=new Date(null!==(i=null==l?void 0:l.year)&&void 0!==i?i:1970,null!==(r=null==l?void 0:l.month)&&void 0!==r?r:0,null!==(a=null==l?void 0:l.day)&&void 0!==a?a:1)}else for(let i=0;i<l;i++)s[i]=br(null===(n=null==t?void 0:t[0])||void 0===n?void 0:n.values[e[i]])?null:new Date(null===(o=null==t?void 0:t[0])||void 0===o?void 0:o.values[e[i]]);return{dates:s,quarters:u}}(t,i),p=new Intl.DateTimeFormat(e.dates.date_format_locale,function(t){const e=new Array;return Object.keys(t).forEach((i=>{if("date_format_locale"!==i&&"date_format_delim"!==i){const r=i.replace("date_format_",""),a=kd[r][t[i]];br(a)||(e.push([r,a]),"day"===r&&"DD"!==t[i]&&e.push(["weekday",Sd[t[i]]]))}})),Object.fromEntries(e)}(e.dates));let d="en-GB"===e.dates.date_format_locale?"day":"month",c="en-GB"===e.dates.date_format_locale?"month":"day";for(let t=0;t<o;t++)if(br(u.dates[t]))l[t]=null;else{const e=fd(p.formatToParts(u.dates[t])),i=[e.weekday+" "+e[d],e[c],null!==(n=null===(a=u.quarters)||void 0===a?void 0:a[t])&&void 0!==n?n:"",e.year];l[t]=i.filter((t=>String(t).trim())).join(s)}return l}function md(t,e,i,r){var a,n,o,l;if("key"===e)return function(t,e,i){const r=t.categories.filter((t=>{var e,i;return null===(i=null===(e=t.source)||void 0===e?void 0:e.roles)||void 0===i?void 0:i.key})),a={};let n=r.map((t=>{var e,i;return null!==(i=null===(e=t.source)||void 0===e?void 0:e.queryName)&&void 0!==i?i:""}));const o=new Set;n=n.map(((t,e)=>(o.has(t)&&(t=`${e}_${t}`),o.add(t),t))),r.forEach(((t,e)=>{let i=n[e];if(i.includes("Date Hierarchy")){const t=i.lastIndexOf(".");-1!==t&&(i=i.substring(0,t))}a[i]||(a[i]=[]),a[i].push(t)}));const l=[];for(const t in a){const r=hd(a[t],e,i);l.push(r)}const s=[],u=i.length;for(let t=0;t<u;t++){const e=l.map((e=>e[t])).filter((t=>null!=t));s.push(e.length>0?e.join(" "):null)}return s}(t,i,r);if("tooltips"===e)return function(t,e,i){const r=t.values.filter((t=>t.source.roles.tooltips)),a=i.length;let n=new Array(a);for(let t=0;t<a;t++)n[t]=r.map((r=>{var a;const n={valueType:r.source.type,dateSettings:e.dates},o=xd(null===(a=null==r?void 0:r.values)||void 0===a?void 0:a[i[t]],n);return{displayName:r.source.displayName,value:o}}));return n}(t,i,r);const s=t.values.filter((t=>{var i,r;return null===(r=null===(i=null==t?void 0:t.source)||void 0===i?void 0:i.roles)||void 0===r?void 0:r[e]}));if(0===s.length)return null;const u=r.length;if("groupings"===e||"labels"===e){let t=new Array(u);for(let e=0;e<u;e++)t[e]=br(null===(n=null===(a=null==s?void 0:s[0])||void 0===a?void 0:a.values)||void 0===n?void 0:n[r[e]])?null:String(s[0].values[r[e]]);return t}let p=new Array(u);for(let t=0;t<u;t++)p[t]=br(null===(l=null===(o=null==s?void 0:s[0])||void 0===o?void 0:o.values)||void 0===l?void 0:l[r[t]])?null:Number(s[0].values[r[t]]);return p}function yd(t,e,i,r,a){var n,o,l,s,u,p;const d=md(t,"numerators",e,a),c=md(t,"denominators",e,a),f=md(t,"xbar_sds",e,a),h=md(t,"key",e,a),m=md(t,"tooltips",e,a),y=md(t,"groupings",e,a),g=md(t,"labels",e,a),v=a.map((e=>{var i,r,a;return null===(a=null===(r=null===(i=null==t?void 0:t.values)||void 0===i?void 0:i[0])||void 0===r?void 0:r.highlights)||void 0===a?void 0:a[e]}));let _=null===(n=cd(t,"scatter",e,a))||void 0===n?void 0:n.values,w=null===(o=cd(t,"labels",e,a))||void 0===o?void 0:o.values,b=null===(l=cd(t,"lines",e,a))||void 0===l?void 0:l.values.map((t=>e.lines.show_alt_target?t.alt_target:null)),N=null===(s=cd(t,"lines",e,a))||void 0===s?void 0:s.values.map((t=>t.show_specification?t.specification_lower:null)),x=null===(u=cd(t,"lines",e,a))||void 0===u?void 0:u.values.map((t=>t.show_specification?t.specification_upper:null)),S=null===(p=cd(t,"spc",e,a))||void 0===p?void 0:p.values;const k=function(t,e,i,r,a,n){let o=!1,l=new Array,s=new Array;const u=a.needs_denominator||a.denominator_optional&&!br(i)&&i.length>0,p=n.length;for(let n=0;n<p;n++){const o=Nd(t[n],null==e?void 0:e[n],null==i?void 0:i[n],null==r?void 0:r[n],a,u);l.push(o.message),s.push(o.type)}let d=new Set(s);o=1===d.size;let c=Array.from(d)[0],f={status:o&&0!==c?1:0,messages:l};if(0===f.status){if(s.every((t=>0!==t)))return f.status=1,f.error="No valid data found!",f}if(o&&0!==c)switch(c){case 1:f.error="Grouping missing";break;case 2:f.error="All dates/IDs are missing or null!";break;case 3:f.error="All numerators are missing or null!";break;case 10:f.error="All numerators are not numbers!";break;case 4:f.error="All numerators are negative!";break;case 5:f.error="All denominators missing or null!";break;case 11:f.error="All denominators are not numbers!";break;case 6:f.error="All denominators are negative!";break;case 7:f.error="All denominators are smaller than numerators!";break;case 8:f.error="All SDs missing or null!";break;case 12:f.error="All SDs are not numbers!";break;case 9:f.error="All SDs are negative!"}return f}(h,d,c,f,i.chart_type_props,a);if(0!==k.status)return function(t){return{limitInputArgs:null,spcSettings:null,highlights:null,anyHighlights:!1,categories:null,groupings:null,groupingIndexes:null,scatter_formatting:null,label_formatting:null,tooltips:null,labels:null,anyLabels:!1,warningMessage:t.error,alt_targets:null,speclimits_lower:null,speclimits_upper:null,validationStatus:t}}(k);const A=new Array,F=new Array,E=new Array,M=t.categories[0].source.displayName,T=r;let $=0;const D=i.chart_type_props.x_axis_use_date;a.forEach(((t,e)=>{""===k.messages[e]?(A.push(e),F.push({x:$,id:t,label:D?h[e]:$.toString()}),$+=1,T[t].length>0&&T[t].forEach((t=>{E.push(`Conditional formatting for ${M} ${h[e]} ignored due to: ${t}.`)}))):E.push(`${M} ${h[e]} removed due to: ${k.messages[e]}.`)}));const L=gd(y,A),C=new Array;let P=L[0];L.forEach(((t,e)=>{t!==P&&(C.push(e-1),P=t)}));const I=gd(b,A);if(e.nhs_icons.show_assurance_icons){const t=null==I?void 0:I.length;if(t>0){br(null==I?void 0:I[t-1])&&E.push("NHS Assurance icon requires a valid alt. target at last observation.")}i.chart_type_props.has_control_limits||E.push("NHS Assurance icon requires chart with control limits.")}const V=gd(v,A),R=S[0].num_points_subset;let O;O=br(R)||!Nr(R,1,A.length)?Md(0,A.length-1):"Start"===S[0].subset_points_from?Md(0,S[0].num_points_subset-1):Md(A.length-S[0].num_points_subset,A.length-1);const j=gd(g,A);return{limitInputArgs:{keys:F,numerators:gd(d,A),denominators:gd(c,A),xbar_sds:gd(f,A),outliers_in_limits:S[0].outliers_in_limits,subset_points:O},spcSettings:S[0],tooltips:gd(m,A),labels:j,anyLabels:j.filter((t=>!br(t)&&""!==t)).length>0,highlights:V,anyHighlights:V.filter((t=>!br(t))).length>0,categories:t.categories[0],groupings:L,groupingIndexes:C,scatter_formatting:gd(_,A),label_formatting:gd(w,A),warningMessage:E.length>0?E.join("\n"):"",alt_targets:I,speclimits_lower:gd(N,A),speclimits_upper:gd(x,A),validationStatus:k}}function gd(t,e){return t?t.filter(((t,i)=>-1!=e.indexOf(i))):[]}const vd={ll99:"99",ll95:"95",ll68:"68",ul68:"68",ul95:"95",ul99:"99",targets:"target",values:"main",alt_targets:"alt_target",speclimits_lower:"specification",speclimits_upper:"specification",trend_line:"trend"};function _d(t,e,i,r){const a=i+"_"+(e.includes("line")?vd[t]:t);return r[e][a]}const wd=xr(((t,e)=>{let i=t;return(e.lower||0==e.lower)&&(i=i<e.lower?e.lower:i),e.upper&&(i=i>e.upper?e.upper:i),i}));function bd(t,e){const i={High:"Low",Low:"High","":""},r={increase:"High",decrease:"Low",neutral:""}[e.outliers.improvement_direction];let a;if(e.nhs_icons.flag_last_point){const e=t.astpoint.length-1;a=[t.astpoint[e],t.shift[e],t.trend[e],t.two_in_three[e]]}else a=t.astpoint.concat(t.shift,t.trend,t.two_in_three);const n=new Array;return a.includes("improvement")&&n.push("improvement"+r),a.includes("deterioration")&&n.push("concern"+i[r]),a.includes("neutral_low")&&n.push("neutralLow"),a.includes("neutral_high")&&n.push("neutralHigh"),0===n.length&&n.push("commonCause"),n}function Nd(t,e,i,r,a,n){const o={message:"",type:0};return br(t)&&(o.message="Date missing",o.type=2),br(e)&&(o.message="Numerator missing",o.type=3),isNaN(e)&&(o.message="Numerator is not a number",o.type=10),a.numerator_non_negative&&e<0&&(o.message="Numerator negative",o.type=4),n&&(br(i)?(o.message="Denominator missing",o.type=5):isNaN(i)?(o.message="Denominator is not a number",o.type=11):i<0?(o.message="Denominator negative",o.type=6):a.numerator_leq_denominator&&i<e&&(o.message="Denominator < numerator",o.type=7)),a.needs_sd&&(br(r)?(o.message="SD missing",o.type=8):isNaN(r)?(o.message="SD is not a number",o.type=12):r<0&&(o.message="SD negative",o.type=9)),o}const xd=xr(((t,e)=>br(t)?null:e.valueType.numeric?t.toString():t)),Sd={DD:null,"Thurs DD":"short","Thursday DD":"long","(blank)":null},kd={weekday:Sd,day:{DD:"2-digit","Thurs DD":"2-digit","Thursday DD":"2-digit","(blank)":null},month:{MM:"2-digit",Mon:"short",Month:"long","(blank)":null},year:{YYYY:"numeric",YY:"2-digit","(blank)":null}};const Ad={January:0,February:1,March:2,April:3,May:4,June:5,July:6,August:7,September:8,October:9,November:10,December:11};function Fd(t,e){return t.temporal?"DayOfMonth"===(null==t?void 0:t.category)?["day",e]:"Months"===(null==t?void 0:t.category)?["month",Ad[e]]:"Quarters"===(null==t?void 0:t.category)?["quarter",e]:"Years"===(null==t?void 0:t.category)?["year",e]:null:null}function Ed(t,e){const i=e.getSelectionIds();var r=!1;for(const e of i)if(Array.isArray(t)){for(const i of t)if(e===i){r=!0;break}}else if(e===t){r=!0;break}return r}function Md(t,e){return Array.from({length:e-t+1},((e,i)=>t+i))}function Td(t){const e=t.length;if(0===e)return[];let i=0,r=0,a=0,n=0;for(let o=0;o<e;o++){const e=o+1,l=t[o];r+=e,i+=l,a+=e*l,n+=e*e}const o=(e*a-r*i)/(e*n-r*r),l=(i-o*r)/e,s=[];for(let t=0;t<e;t++)s.push(o*(t+1)+l);return s}function $d(t){return!br(t)&&!isNaN(t)&&isFinite(t)}function Dd(t,e){const i=e.plotProperties.yAxis.lower,r=e.plotProperties.yAxis.upper,a=e.plotProperties.xAxis.lower,n=e.plotProperties.xAxis.upper;t.select(".dotsgroup").selectAll("path").data(e.viewModel.plotPoints).join("path").filter((t=>!br(t.value))).attr("d",(t=>{const e=t.aesthetics.shape,i=t.aesthetics.size;return Wt().type(or[`symbol${e}`]).size(i*i*Math.PI)()})).attr("transform",(t=>Nr(t.value,i,r)&&Nr(t.x,a,n)?`translate(${e.plotProperties.xScale(t.x)}, ${e.plotProperties.yScale(t.value)})`:"translate(0, 0) scale(0)")).style("fill",(t=>t.aesthetics.colour)).style("stroke",(t=>t.aesthetics.colour_outline)).style("stroke-width",(t=>t.aesthetics.width_outline)).on("click",((t,i)=>{if(e.host.hostCapabilities.allowInteractions){if(e.viewModel.inputSettings.settings.spc.split_on_click){const t=e.viewModel.splitIndexes.indexOf(i.x);t>-1?e.viewModel.splitIndexes.splice(t,1):e.viewModel.splitIndexes.push(i.x),e.host.persistProperties({replace:[{objectName:"split_indexes_storage",selector:void 0,properties:{split_indexes:JSON.stringify(e.viewModel.splitIndexes)}}]})}else e.selectionManager.select(i.identity,t.ctrlKey||t.metaKey).then((()=>{e.updateHighlighting()}));t.stopPropagation()}})).on("mouseover",((t,i)=>{const r=t.pageX,a=t.pageY;e.host.tooltipService.show({dataItems:i.tooltip,identities:[i.identity],coordinates:[r,a],isTouchEvent:!1})})).on("mouseout",(()=>{e.host.tooltipService.hide({immediately:!0,isTouchEvent:!1})})),t.on("click",(()=>{e.selectionManager.clear(),e.updateHighlighting()}))}var Ld=Object.freeze({__proto__:null,commonCause:function(t){t.append("g").attr("clip-path","url(#clip2)").append("g").attr("clip-path","url(#clip3)").attr("filter","url(#fx0)").attr("transform","translate(16 25)").append("g").attr("clip-path","url(#clip4)").append("path").attr("d","M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z").attr("stroke","#A6A6A6").attr("stroke-width","21").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("path").attr("d","M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z").attr("stroke","#A6A6A6").attr("stroke-width","20").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("path").attr("d","M106.903 196.084 144.607 228.433 138.766 235.241 101.062 202.892Z").attr("stroke","#A6A6A6").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#A6A6A6").attr("fill-rule","evenodd"),t.append("path").attr("d","M146.159 218.909 179.921 159.846 187.708 164.298 153.946 223.361Z").attr("stroke","#A6A6A6").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#A6A6A6").attr("fill-rule","evenodd"),t.append("path").attr("d","M198.708 154.94 239.365 214.134 231.971 219.212 191.314 160.019Z").attr("stroke","#A6A6A6").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#A6A6A6").attr("fill-rule","evenodd"),t.append("path").attr("d","M238.825 216.117 285.383 198.784 288.512 207.19 241.954 224.523Z").attr("stroke","#A6A6A6").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#A6A6A6").attr("fill-rule","evenodd"),t.append("path").attr("d","M76.5001 195C76.5001 183.678 85.6782 174.5 97.0001 174.5 108.322 174.5 117.5 183.678 117.5 195 117.5 206.322 108.322 215.5 97.0001 215.5 85.6782 215.5 76.5001 206.322 76.5001 195Z").attr("stroke","#A6A6A6").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#A6A6A6").attr("fill-rule","evenodd"),t.append("path").attr("d","M123.5 233C123.5 221.678 132.678 212.5 144 212.5 155.322 212.5 164.5 221.678 164.5 233 164.5 244.322 155.322 253.5 144 253.5 132.678 253.5 123.5 244.322 123.5 233Z").attr("stroke","#A6A6A6").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#A6A6A6").attr("fill-rule","evenodd"),t.append("path").attr("d","M170.5 153.5C170.5 141.902 179.902 132.5 191.5 132.5 203.098 132.5 212.5 141.902 212.5 153.5 212.5 165.098 203.098 174.5 191.5 174.5 179.902 174.5 170.5 165.098 170.5 153.5Z").attr("stroke","#A6A6A6").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#A6A6A6").attr("fill-rule","evenodd"),t.append("path").attr("d","M217.5 221.5C217.5 209.902 226.902 200.5 238.5 200.5 250.098 200.5 259.5 209.902 259.5 221.5 259.5 233.098 250.098 242.5 238.5 242.5 226.902 242.5 217.5 233.098 217.5 221.5Z").attr("stroke","#A6A6A6").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#A6A6A6").attr("fill-rule","evenodd"),t.append("path").attr("d","M265.5 206.5C265.5 194.902 274.678 185.5 286 185.5 297.322 185.5 306.5 194.902 306.5 206.5 306.5 218.098 297.322 227.5 286 227.5 274.678 227.5 265.5 218.098 265.5 206.5Z").attr("stroke","#A6A6A6").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#A6A6A6").attr("fill-rule","evenodd")},concernHigh:function(t){t.append("g").attr("clip-path","url(#clip2)").append("g").attr("clip-path","url(#clip3)").attr("filter","url(#fx0)").attr("transform","translate(16 25)").append("g").attr("clip-path","url(#clip4)").append("path").attr("d","M0 155.53C-1.9801e-14 69.6331 69.6331-1.9801e-14 155.53-3.96021e-14 241.427-7.92042e-14 311.06 69.6331 311.06 155.53 311.06 241.427 241.427 311.06 155.53 311.06 69.6331 311.06-9.90052e-14 241.427 0 155.53Z").attr("stroke","#E46C0A").attr("stroke-width","21").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 17.47 328.36)"),t.append("path").attr("d","M0 151C-1.92243e-14 67.605 67.605-1.92243e-14 151-3.84486e-14 234.395-7.68973e-14 302 67.605 302 151 302 234.395 234.395 302 151 302 67.605 302-9.61216e-14 234.395 0 151Z").attr("stroke","#E46C0A").attr("stroke-width","20").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 38 340)"),t.append("text").attr("fill","#E46C0A").attr("font-family","Arial,Arial_MSFontService,sans-serif").attr("font-weight","700").attr("font-size","11.7").attr("transform","translate(106.228 172) scale(10, 10)").text("H"),t.append("rect").attr("x","0").attr("y","0").attr("width","49.6797").attr("height","8.97008").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("transform","matrix(0.919094 0.394039 0.394039 -0.919094 95.4025 215.096)"),t.append("rect").attr("x","0").attr("y","0").attr("width","49.6797").attr("height","8.97008").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("transform","matrix(0.880045 -0.47489 -0.47489 -0.880045 149.897 232.457)"),t.append("rect").attr("x","0").attr("y","0").attr("width","49.6797").attr("height","8.97008").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("transform","matrix(0.715824 -0.698281 -0.698281 -0.715824 199.882 206.276)"),t.append("rect").attr("x","0").attr("y","0").attr("width","49.6797").attr("height","8.97008").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("transform","matrix(0.937161 0.348898 0.348898 -0.937161 238.113 168.387)"),t.append("path").attr("d","M0 21C-2.60992e-15 9.40202 9.17816-2.67358e-15 20.5-5.34716e-15 31.8218-1.06943e-14 41 9.40202 41 21 41 32.598 31.8218 42 20.5 42 9.17816 42-1.30496e-14 32.598 0 21Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 76.5001 231.5)"),t.append("path").attr("d","M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 123.5 249.5)"),t.append("path").attr("d","M0 21C-2.67358e-15 9.40202 9.40202-2.67358e-15 21-5.34716e-15 32.598-1.06943e-14 42 9.40202 42 21 42 32.598 32.598 42 21 42 9.40202 42-1.33679e-14 32.598 0 21Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 170.5 231.5)"),t.append("path").attr("d","M0 20.5C-2.67358e-15 9.17816 9.40202-2.60992e-15 21-5.21985e-15 32.598-1.04397e-14 42 9.17816 42 20.5 42 31.8218 32.598 41 21 41 9.40202 41-1.33679e-14 31.8218 0 20.5Z").attr("stroke","#E46C0A").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#E46C0A").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 217.5 185.5)"),t.append("path").attr("d","M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z").attr("stroke","#E46C0A").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#E46C0A").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 265.5 200.5)")},concernLow:function(t){t.append("g").attr("clip-path","url(#clip2)").append("g").attr("clip-path","url(#clip3)").attr("filter","url(#fx0)").attr("transform","translate(16 25)").append("g").attr("clip-path","url(#clip4)").append("path").attr("d","M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z").attr("stroke","#E46C0A").attr("stroke-width","21").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("path").attr("d","M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z").attr("stroke","#E46C0A").attr("stroke-width","20").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("text").attr("fill","#E46C0A").attr("font-family","Arial,Arial_MSFontService,sans-serif").attr("font-weight","700").attr("font-size","11.7").attr("transform","translate(106.228 292) scale(10, 10)").text("L"),t.append("path").attr("d","M95.4025 162.857 141.063 143.281 144.597 151.525 98.9371 171.101Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M149.897 145.496 193.618 169.089 189.358 176.983 145.638 153.39Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M199.882 171.677 235.443 206.367 229.18 212.788 193.618 178.098Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M238.113 209.566 284.671 192.233 287.8 200.639 241.243 217.972Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M76.5001 168.5C76.5001 156.902 85.6782 147.5 97.0001 147.5 108.322 147.5 117.5 156.902 117.5 168.5 117.5 180.098 108.322 189.5 97.0001 189.5 85.6782 189.5 76.5001 180.098 76.5001 168.5Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M123.5 150C123.5 138.678 132.678 129.5 144 129.5 155.322 129.5 164.5 138.678 164.5 150 164.5 161.322 155.322 170.5 144 170.5 132.678 170.5 123.5 161.322 123.5 150Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M170.5 168.5C170.5 156.902 179.902 147.5 191.5 147.5 203.098 147.5 212.5 156.902 212.5 168.5 212.5 180.098 203.098 189.5 191.5 189.5 179.902 189.5 170.5 180.098 170.5 168.5Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M217.5 214C217.5 202.678 226.902 193.5 238.5 193.5 250.098 193.5 259.5 202.678 259.5 214 259.5 225.322 250.098 234.5 238.5 234.5 226.902 234.5 217.5 225.322 217.5 214Z").attr("stroke","#E46C0A").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#E46C0A").attr("fill-rule","evenodd"),t.append("path").attr("d","M265.5 199C265.5 187.678 274.678 178.5 286 178.5 297.322 178.5 306.5 187.678 306.5 199 306.5 210.322 297.322 219.5 286 219.5 274.678 219.5 265.5 210.322 265.5 199Z").attr("stroke","#E46C0A").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#E46C0A").attr("fill-rule","evenodd")},consistentFail:function(t){t.append("g").attr("clip-path","url(#clip2)").append("g").attr("clip-path","url(#clip3)").attr("filter","url(#fx0)").attr("transform","translate(16 25)").append("g").attr("clip-path","url(#clip4)").append("path").attr("d","M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z").attr("stroke","#FF6600").attr("stroke-width","21").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("path").attr("d","M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z").attr("stroke","#FF6600").attr("stroke-width","20").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("text").attr("fill","#FF6600").attr("font-family","Arial,Arial_MSFontService,sans-serif").attr("font-weight","700").attr("font-size","11.7").attr("transform","translate(155.851 158) scale(10, 10)").text("F"),t.append("path").attr("d","M38.5001 185.5 340.862 185.5").attr("stroke","#FF6600").attr("stroke-width","8.66667").attr("stroke-miterlimit","8").attr("stroke-dasharray","26 8.66667").attr("fill","none").attr("fill-rule","evenodd"),t.append("path").attr("d","M72.5001 238.762C89.0456 218.168 107.725 200.801 129.638 200.507 152.134 201.459 176.57 238.689 192.563 241.313 206.31 244.118 205.897 217.733 212.814 216.659 217.563 215.414 220.151 238.182 233.066 240.463 248.557 243.786 291.62 234.385 302.5 236.212").attr("stroke","#7F7F7F").attr("stroke-width","10.66667").attr("stroke-miterlimit","8").attr("fill","none").attr("fill-rule","evenodd")},consistentPass:function(t){t.append("g").attr("clip-path","url(#clip2)").append("g").attr("clip-path","url(#clip3)").attr("filter","url(#fx0)").attr("transform","translate(16 25)").append("g").attr("clip-path","url(#clip4)").append("path").attr("d","M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z").attr("stroke","#0072C6").attr("stroke-width","21").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("path").attr("d","M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z").attr("stroke","#0072C6").attr("stroke-width","20").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("text").attr("fill","#0072C6").attr("font-family","Arial,Arial_MSFontService,sans-serif").attr("font-weight","700").attr("font-size","11.7").attr("transform","translate(155.851 158) scale(10, 10)").text("P"),t.append("path").attr("d","M55.5001 257.5 323.847 257.5").attr("stroke","#0072C6").attr("stroke-width","8.66667").attr("stroke-miterlimit","8").attr("stroke-dasharray","26 8.66667").attr("fill","none").attr("fill-rule","evenodd"),t.append("path").attr("d","M72.5001 238.762C89.0456 218.168 107.725 200.801 129.638 200.507 152.134 201.459 176.57 238.689 192.563 241.313 206.31 244.118 205.897 217.733 212.814 216.659 217.563 215.414 220.151 238.182 233.066 240.463 248.557 243.786 291.62 234.385 302.5 236.212").attr("stroke","#7F7F7F").attr("stroke-width","10.66667").attr("stroke-miterlimit","8").attr("fill","none").attr("fill-rule","evenodd")},improvementHigh:function(t){t.append("g").attr("clip-path","url(#clip2)").append("g").attr("clip-path","url(#clip3)").attr("filter","url(#fx0)").attr("transform","translate(16 25)").append("g").attr("clip-path","url(#clip4)").append("path").attr("d","M0 155.53C-1.9801e-14 69.6331 69.6331-1.9801e-14 155.53-3.96021e-14 241.427-7.92042e-14 311.06 69.6331 311.06 155.53 311.06 241.427 241.427 311.06 155.53 311.06 69.6331 311.06-9.90052e-14 241.427 0 155.53Z").attr("stroke","#00B0F0").attr("stroke-width","21").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 17.47 328.36)"),t.append("path").attr("d","M0 151C-1.92243e-14 67.605 67.605-1.92243e-14 151-3.84486e-14 234.395-7.68973e-14 302 67.605 302 151 302 234.395 234.395 302 151 302 67.605 302-9.61216e-14 234.395 0 151Z").attr("stroke","#00B0F0").attr("stroke-width","20").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 38 340)"),t.append("text").attr("fill","#00B0F0").attr("font-family","Arial,Arial_MSFontService,sans-serif").attr("font-weight","700").attr("font-size","11.7").attr("transform","translate(106.228 172) scale(10, 10)").text("H"),t.append("rect").attr("x","0").attr("y","0").attr("width","49.6797").attr("height","8.97008").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("transform","matrix(0.919094 0.394039 0.394039 -0.919094 95.4025 215.096)"),t.append("rect").attr("x","0").attr("y","0").attr("width","49.6797").attr("height","8.97008").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("transform","matrix(0.880045 -0.47489 -0.47489 -0.880045 149.897 232.457)"),t.append("rect").attr("x","0").attr("y","0").attr("width","49.6797").attr("height","8.97008").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("transform","matrix(0.715824 -0.698281 -0.698281 -0.715824 199.882 206.276)"),t.append("rect").attr("x","0").attr("y","0").attr("width","49.6797").attr("height","8.97008").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("transform","matrix(0.937161 0.348898 0.348898 -0.937161 238.113 168.387)"),t.append("path").attr("d","M0 21C-2.60992e-15 9.40202 9.17816-2.67358e-15 20.5-5.34716e-15 31.8218-1.06943e-14 41 9.40202 41 21 41 32.598 31.8218 42 20.5 42 9.17816 42-1.30496e-14 32.598 0 21Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 76.5001 231.5)"),t.append("path").attr("d","M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 123.5 249.5)"),t.append("path").attr("d","M0 21C-2.67358e-15 9.40202 9.40202-2.67358e-15 21-5.34716e-15 32.598-1.06943e-14 42 9.40202 42 21 42 32.598 32.598 42 21 42 9.40202 42-1.33679e-14 32.598 0 21Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 170.5 231.5)"),t.append("path").attr("d","M0 20.5C-2.67358e-15 9.17816 9.40202-2.60992e-15 21-5.21985e-15 32.598-1.04397e-14 42 9.17816 42 20.5 42 31.8218 32.598 41 21 41 9.40202 41-1.33679e-14 31.8218 0 20.5Z").attr("stroke","#00B0F0").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#00B0F0").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 217.5 185.5)"),t.append("path").attr("d","M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z").attr("stroke","#00B0F0").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#00B0F0").attr("fill-rule","evenodd").attr("transform","matrix(1 0 0 -1 265.5 200.5)")},improvementLow:function(t){t.append("g").attr("clip-path","url(#clip2)").append("g").attr("clip-path","url(#clip3)").attr("filter","url(#fx0)").attr("transform","translate(16 25)").append("g").attr("clip-path","url(#clip4)").append("path").attr("d","M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z").attr("stroke","#00B0F0").attr("stroke-width","21").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("path").attr("d","M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z").attr("stroke","#00B0F0").attr("stroke-width","20").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("text").attr("fill","#00B0F0").attr("font-family","Arial,Arial_MSFontService,sans-serif").attr("font-weight","700").attr("font-size","11.7").attr("transform","translate(106.228 292) scale(10, 10)").text("L"),t.append("path").attr("d","M95.4025 162.857 141.063 143.281 144.597 151.525 98.9371 171.101Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M149.897 145.496 193.618 169.089 189.358 176.983 145.638 153.39Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M199.882 171.677 235.443 206.367 229.18 212.788 193.618 178.098Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M238.113 209.566 284.671 192.233 287.8 200.639 241.243 217.972Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M76.5001 168.5C76.5001 156.902 85.6782 147.5 97.0001 147.5 108.322 147.5 117.5 156.902 117.5 168.5 117.5 180.098 108.322 189.5 97.0001 189.5 85.6782 189.5 76.5001 180.098 76.5001 168.5Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M123.5 150C123.5 138.678 132.678 129.5 144 129.5 155.322 129.5 164.5 138.678 164.5 150 164.5 161.322 155.322 170.5 144 170.5 132.678 170.5 123.5 161.322 123.5 150Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M170.5 168.5C170.5 156.902 179.902 147.5 191.5 147.5 203.098 147.5 212.5 156.902 212.5 168.5 212.5 180.098 203.098 189.5 191.5 189.5 179.902 189.5 170.5 180.098 170.5 168.5Z").attr("stroke","#7F7F7F").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#7F7F7F").attr("fill-rule","evenodd"),t.append("path").attr("d","M217.5 214C217.5 202.678 226.902 193.5 238.5 193.5 250.098 193.5 259.5 202.678 259.5 214 259.5 225.322 250.098 234.5 238.5 234.5 226.902 234.5 217.5 225.322 217.5 214Z").attr("stroke","#00B0F0").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#00B0F0").attr("fill-rule","evenodd"),t.append("path").attr("d","M265.5 199C265.5 187.678 274.678 178.5 286 178.5 297.322 178.5 306.5 187.678 306.5 199 306.5 210.322 297.322 219.5 286 219.5 274.678 219.5 265.5 210.322 265.5 199Z").attr("stroke","#00B0F0").attr("stroke-width","2.66667").attr("stroke-miterlimit","8").attr("fill","#00B0F0").attr("fill-rule","evenodd")},inconsistent:function(t){t.append("g").attr("clip-path","url(#clip2)").append("g").attr("clip-path","url(#clip3)").attr("filter","url(#fx0)").attr("transform","translate(16 25)").append("g").attr("clip-path","url(#clip4)").append("path").attr("d","M17.47 173.345C17.47 87.1637 87.1031 17.3 173 17.3 258.897 17.3 328.53 87.1637 328.53 173.345 328.53 259.526 258.897 329.39 173 329.39 87.1031 329.39 17.47 259.526 17.47 173.345Z").attr("stroke","#BFBFBF").attr("stroke-width","21").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("path").attr("d","M38 189.5C38 105.829 105.605 38 189 38 272.395 38 340 105.829 340 189.5 340 273.171 272.395 341 189 341 105.605 341 38 273.171 38 189.5Z").attr("stroke","#BFBFBF").attr("stroke-width","20").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("text").attr("fill","#7F7F7F").attr("font-family","Arial,Arial_MSFontService,sans-serif").attr("font-weight","700").attr("font-size","11.7").attr("transform","translate(155.851 158) scale(10, 10)").text("?"),t.append("path").attr("d","M38.5001 222.5 340.862 222.5").attr("stroke","#BFBFBF").attr("stroke-width","8.66667").attr("stroke-miterlimit","8").attr("stroke-dasharray","26 8.66667").attr("fill","none").attr("fill-rule","evenodd"),t.append("path").attr("d","M72.5001 239.762C89.0456 219.168 107.725 201.801 129.638 201.507 152.134 202.459 176.57 239.689 192.563 242.313 206.31 245.118 205.897 218.733 212.814 217.659 217.563 216.414 220.151 239.182 233.066 241.463 248.557 244.786 291.62 235.385 302.5 237.212").attr("stroke","#7F7F7F").attr("stroke-width","10.66667").attr("stroke-miterlimit","8").attr("fill","none").attr("fill-rule","evenodd")},neutralHigh:function(t){t.append("g").attr("clip-path","url(#clip2)").append("g").attr("clip-path","url(#clip3)").attr("filter","url(#fx0)").attr("transform","translate(16 25)").append("g").attr("clip-path","url(#clip4)").append("path").attr("d","M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z").attr("stroke","#490092").attr("stroke-width","21").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("path").attr("d","M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z").attr("stroke","#490092").attr("stroke-width","20").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("path").attr("d","M103.652 242.245 180.02 165.878 151.735 137.593 258.273 119.68 240.359 226.217 212.075 197.933 135.708 274.3Z").attr("fill","#490092").attr("fill-rule","evenodd")},neutralLow:function(t){t.append("g").attr("clip-path","url(#clip2)").append("g").attr("clip-path","url(#clip3)").attr("filter","url(#fx0)").attr("transform","translate(16 25)").append("g").attr("clip-path","url(#clip4)").append("path").attr("d","M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z").attr("stroke","#490092").attr("stroke-width","21").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("path").attr("d","M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z").attr("stroke","#490092").attr("stroke-width","20").attr("stroke-miterlimit","8").attr("fill","#FFFFFF").attr("fill-rule","evenodd"),t.append("path").attr("d","M135.708 103.652 212.075 180.02 240.359 151.735 258.273 258.273 151.735 240.359 180.02 212.075 103.652 135.708Z").attr("fill","#490092").attr("fill-rule","evenodd")}});function Cd(t,e,i,r,a){const n=e/378*.08*r;return`scale(${n}) translate(${i.includes("Right")?t/n-(378+378*a):i.includes("Centre")?t/n/2-189:378*a}, ${i.includes("Bottom")?e/n-378:i.includes("Centre")?e/n/2-189:0})`}function Pd(t,e,i){const r=t.append("g").classed("icongroup",!0);i&&r.attr("transform",i);const a=r.append("defs"),n=a.append("filter").attr("id","fx0").attr("x","-10%").attr("y","-10%").attr("width","120%").attr("height","120%").attr("filterUnits","userSpaceOnUse").attr("userSpaceOnUse","userSpaceOnUse"),o=n.append("feComponentTransfer").attr("color-interpolation-filters","sRGB");o.append("feFuncR").attr("type","discrete").attr("tableValues","0 0"),o.append("feFuncG").attr("type","discrete").attr("tableValues","0 0"),o.append("feFuncB").attr("type","discrete").attr("tableValues","0 0"),o.append("feFuncA").attr("type","linear").attr("slope","0.4").attr("intercept","0"),n.append("feGaussianBlur").attr("stdDeviation","1.77778 1.77778"),a.append("clipPath").attr("id","clip1").append("rect").attr("x","0").attr("y","0").attr("width","378").attr("height","378"),a.append("clipPath").attr("id","clip2").append("path").attr("d","M189 38C105.605 38 38 105.605 38 189 38 272.395 105.605 340 189 340 272.395 340 340 272.395 340 189 340 105.605 272.395 38 189 38ZM5.63264e-06 5.63264e-06 378 5.63264e-06 378 378 5.63264e-06 378Z").attr("fill-rule","evenodd").attr("clip-rule","evenodd"),a.append("clipPath").attr("id","clip3").append("rect").attr("x","-2").attr("y","-2").attr("width","346").attr("height","346"),r.append("g").classed(e,!0).attr("clip-path","url(#clip1)").append("rect").attr("x","0").attr("y","0").attr("width","378").attr("height","378").attr("fill","#FFFFFF")}function Id(t,e){if(t.selectAll(".icongroup").remove(),!e.plotProperties.displayPlot)return;const i=e.viewModel.inputSettings.settings.nhs_icons,r=i.show_variation_icons,a=i.variation_icons_locations,n=e.viewModel.svgWidth,o=e.viewModel.svgHeight;let l=0;if(r){const r=i.variation_icons_scaling,s=bd(e.viewModel.outliers,e.viewModel.inputSettings.settings);s.forEach(((e,i)=>{t.call(Pd,e,Cd(n,o,a,r,i)).selectAll(`.${e}`).call(Ld[e])})),l=s.length}if(i.show_assurance_icons){const r=i.assurance_icons_locations,s=i.assurance_icons_scaling,u=wr(e.viewModel.controlLimits,e.viewModel.inputSettings.settings,e.viewModel.inputSettings.derivedSettings);if("none"===u)return;const p=l>0&&a===r?l:0;t.call(Pd,u,Cd(n,o,r,s,p)).selectAll(`.${u}`).call(Ld[u])}}function Vd(t,e){t.select(".linesgroup").selectAll("path").data(e.viewModel.groupedLines).join("path").attr("d",(t=>{const i=e.plotProperties.yAxis.lower,r=e.plotProperties.yAxis.upper,a=e.plotProperties.xAxis.lower,n=e.plotProperties.xAxis.upper;return Mt().x((t=>e.plotProperties.xScale(t.x))).y((t=>e.plotProperties.yScale(t.line_value))).defined((t=>!br(t.line_value)&&Nr(t.line_value,i,r)&&Nr(t.x,a,n)))(t[1])})).attr("fill","none").attr("stroke",(t=>e.viewModel.colourPalette.isHighContrast?e.viewModel.colourPalette.foregroundColour:_d(t[0],"lines","colour",e.viewModel.inputSettings.settings))).attr("stroke-width",(t=>_d(t[0],"lines","width",e.viewModel.inputSettings.settings))).attr("stroke-dasharray",(t=>_d(t[0],"lines","type",e.viewModel.inputSettings.settings)))}function Rd(t,e){const i=e.plotProperties,r=e.viewModel.colourPalette.isHighContrast?e.viewModel.colourPalette.foregroundColour:"black",a=t.select(".ttip-line-x").attr("x1",0).attr("x2",0).attr("y1",i.yAxis.end_padding).attr("y2",e.viewModel.svgHeight-i.yAxis.start_padding).attr("stroke-width","1px").attr("stroke",r).style("stroke-opacity",0),n=t.select(".ttip-line-y").attr("x1",i.xAxis.start_padding).attr("x2",e.viewModel.svgWidth-i.xAxis.end_padding).attr("y1",0).attr("y2",0).attr("stroke-width","1px").attr("stroke",r).style("stroke-opacity",0);t.on("mousemove",(t=>{if(!i.displayPlot)return;const r=e.viewModel.plotPoints,o=e.svg.node().getBoundingClientRect(),l=t.pageX-o.left;let s,u,p,d=1/0;for(let t=0;t<r.length;t++){const e=i.xScale(r[t].x),a=Math.abs(e-l);a<d&&(d=a,s=t,u=e,p=i.yScale(r[t].value))}e.host.tooltipService.show({dataItems:r[s].tooltip,identities:[r[s].identity],coordinates:[u,p],isTouchEvent:!1}),a.style("stroke-opacity",.4).attr("x1",u).attr("x2",u),n.style("stroke-opacity",.4).attr("y1",p).attr("y2",p)})).on("mouseleave",(()=>{i.displayPlot&&(e.host.tooltipService.hide({immediately:!0,isTouchEvent:!1}),a.style("stroke-opacity",0),n.style("stroke-opacity",0))}))}function Od(t,e){const i=e.plotProperties.xAxis,r=ae(e.plotProperties.xScale);i.ticks?(i.tick_count&&r.ticks(i.tick_count),e.viewModel.tickLabels&&r.tickFormat((t=>{const i=e.viewModel.tickLabels.filter((e=>e.x==t));return i.length>0?i[0].label:""}))):r.tickValues([]);const a=e.viewModel.svgHeight,n=a-e.plotProperties.yAxis.start_padding,o=e.plotProperties.displayPlot;t.select(".xaxisgroup").call(r).attr("color",o?i.colour:"#FFFFFF").attr("transform",`translate(0, ${n})`).selectAll(".tick text").style("text-anchor",i.tick_rotation<0?"end":"start").attr("dx",i.tick_rotation<0?"-.8em":".8em").attr("dy",i.tick_rotation<0?"-.15em":".15em").attr("transform","rotate("+i.tick_rotation+")").style("font-size",i.tick_size).style("font-family",i.tick_font).style("fill",o?i.tick_colour:"#FFFFFF");const l=e.viewModel.svgWidth/2;let s;if(e.viewModel.frontend)s=a-e.plotProperties.yAxis.start_padding/3;else{const e=t.selectAll(".xaxisgroup").node();if(!e)return void t.select(".xaxislabel").style("fill",o?i.label_colour:"#FFFFFF");s=a-(a-e.getBoundingClientRect().bottom)/2}t.select(".xaxislabel").attr("x",l).attr("y",s).style("text-anchor","middle").text(i.label).style("font-size",i.label_size).style("font-family",i.label_font).style("fill",o?i.label_colour:"#FFFFFF")}function jd(t,e){const i=e.plotProperties.yAxis,r=ne(e.plotProperties.yScale),a=e.viewModel.inputSettings.settings.y_axis.ylimit_sig_figs,n=br(a)?e.viewModel.inputSettings.settings.spc.sig_figs:a,o=e.plotProperties.displayPlot;i.ticks?(i.tick_count&&r.ticks(i.tick_count),e.viewModel.inputData&&r.tickFormat((t=>e.viewModel.inputSettings.derivedSettings.percentLabels?t.toFixed(n)+"%":t.toFixed(n)))):r.tickValues([]);let l;t.select(".yaxisgroup").call(r).attr("color",o?i.colour:"#FFFFFF").attr("transform",`translate(${e.plotProperties.xAxis.start_padding}, 0)`).selectAll(".tick text").style("text-anchor","right").attr("transform",`rotate(${i.tick_rotation})`).style("font-size",i.tick_size).style("font-family",i.tick_font).style("fill",o?i.tick_colour:"#FFFFFF");const s=e.viewModel.svgHeight/2;if(e.viewModel.frontend)l=e.plotProperties.xAxis.start_padding/2;else{const e=t.selectAll(".yaxisgroup").node();if(!e)return void t.select(".yaxislabel").style("fill",o?i.label_colour:"#FFFFFF");l=.7*e.getBoundingClientRect().x}t.select(".yaxislabel").attr("x",l).attr("y",s).attr("transform",`rotate(-90, ${l}, ${s})`).text(i.label).style("text-anchor","middle").style("font-size",i.label_size).style("font-family",i.label_font).style("fill",o?i.label_colour:"#FFFFFF")}function Ud(t,e=!1){e&&t.selectChildren().remove(),t.append("line").classed("ttip-line-x",!0),t.append("line").classed("ttip-line-y",!0),t.append("g").classed("xaxisgroup",!0),t.append("text").classed("xaxislabel",!0),t.append("g").classed("yaxisgroup",!0),t.append("text").classed("yaxislabel",!0),t.append("g").classed("linesgroup",!0),t.append("g").classed("dotsgroup",!0)}function Gd(t,e,i,r,a=null){t.call(Ud,!0);const n=t.append("g").classed("errormessage",!0);if(a){const t={internal:"Internal Error! Please file a bug report with the following text:",settings:"Invalid settings provided for all observations! First error:"};n.append("text").attr("x",e.viewport.width/2).attr("y",e.viewport.height/3).style("text-anchor","middle").text(t[a]).style("font-size","10px").style("fill",i.foregroundColour)}n.append("text").attr("x",e.viewport.width/2).attr("y",e.viewport.height/2).style("text-anchor","middle").text(r).style("font-size","10px").style("fill",i.foregroundColour)}function zd(t,e,i,r){const a=t.select(".table-header").selectAll("th").data(e).join("th");a.selectAll("text").data((t=>[t.label])).join("text").text((t=>t)).style("font-size",`${i.table_header_size}px`).style("font-family",i.table_header_font).style("color",i.table_header_colour),a.style("padding",`${i.table_header_text_padding}px`).style("background-color",i.table_header_bg_colour).style("font-weight",i.table_header_font_weight).style("text-transform",i.table_header_text_transform).style("text-align",i.table_header_text_align).style("border-width",`${i.table_header_border_width}px`).style("border-style",i.table_header_border_style).style("border-color",i.table_header_border_colour).style("border-top","inherit"),i.table_header_border_bottom||a.style("border-bottom","none"),i.table_header_border_inner||a.style("border-left","none").style("border-right","none"),"none"!==i.table_text_overflow?a.style("overflow","hidden").style("max-width",`${r}px`).style("text-overflow",i.table_text_overflow):a.style("overflow","auto").style("max-width","none")}function Bd(t,e,i,r,a){const n=t.select(".table-body").selectAll("tr").data(i).join("tr").on("click",((t,i)=>{if(e.host.hostCapabilities.allowInteractions){const r=Ed(i.identity,e.selectionManager);e.selectionManager.select(i.identity,r||t.ctrlKey||t.metaKey).then((()=>e.updateHighlighting())),t.stopPropagation()}})).on("mouseover",(t=>{ut(t.target).select((function(){return this.closest("td")})).style("background-color","lightgray")})).on("mouseout",(t=>{var e,i;let r=ut(t.target).select((function(){return this.closest("td")})),a=ut(r.node().parentNode).datum();r.style("background-color",null!==(i=null===(e=a.aesthetics)||void 0===e?void 0:e.table_body_bg_colour)&&void 0!==i?i:"inherit")}));"none"!==r.table_text_overflow?n.style("overflow","hidden").style("max-width",`${a}px`).style("text-overflow",r.table_text_overflow):n.style("overflow","auto").style("max-width","none")}function qd(t,e){t.select(".table-group").style("border-width",`${e.table_outer_border_width}px`).style("border-style",e.table_outer_border_style).style("border-color",e.table_outer_border_colour),["top","right","bottom","left"].forEach((i=>{e[`table_outer_border_${i}`]||t.select(".table-group").style(`border-${i}`,"none")})),t.selectAll("th:first-child").style("border-left","inherit"),t.selectAll("th:last-child").style("border-right","inherit"),t.selectAll("td:first-child").style("border-left","inherit"),t.selectAll("td:last-child").style("border-right","inherit"),t.selectAll("tr:first-child").selectAll("td").style("border-top","inherit"),t.selectAll("tr:last-child").selectAll("td").style("border-bottom","inherit")}function Hd(t,e,i,r){const a=t.select(".table-body").selectAll("tr").selectAll("td").data((t=>e.map((e=>({column:e.name,value:t.table_row[e.name]}))))).join("td"),n=i.nhs_icons.show_variation_icons||i.nhs_icons.show_assurance_icons,o=a.node().getBoundingClientRect();a.each((function(t){var e;const a=ut(this),l=ut(a.property("parentNode")).datum();if(r&&n&&("variation"===t.column||"assurance"===t.column)){if("none"!==t.value){const e=i.nhs_icons[`${t.column}_icons_scaling`];a.append("svg").attr("width",.5*o.width*e+"px").attr("viewBox","0 0 378 378").classed("rowsvg",!0).call(Pd,t.value).selectAll(".icongroup").selectAll(`.${t.value}`).call(Ld[t.value])}}else{const e="number"==typeof t.value?t.value.toFixed(i.spc.sig_figs):t.value;a.text(e).classed("cell-text",!0)}const s=(null===(e=l.aesthetics)||void 0===e?void 0:e.table_body_bg_colour)?l.aesthetics:i.summary_table;a.style("background-color",s.table_body_bg_colour).style("font-weight",s.table_body_font_weight).style("text-transform",s.table_body_text_transform).style("text-align",s.table_body_text_align).style("font-size",`${s.table_body_size}px`).style("font-family",s.table_body_font).style("color",s.table_body_colour).style("border-width",`${s.table_body_border_width}px`).style("border-style",s.table_body_border_style).style("border-color",s.table_body_border_colour).style("padding",`${s.table_body_text_padding}px`).style("opacity","inherit"),s.table_body_border_left_right||a.style("border-left","none").style("border-right","none"),s.table_body_border_top_bottom||a.style("border-top","none").style("border-bottom","none")}))}function Zd(t,e){let i,r;t.selectAll(".rowsvg").remove(),t.selectAll(".cell-text").remove(),e.viewModel.showGrouped?(i=e.viewModel.plotPointsGrouped,r=e.viewModel.tableColumnsGrouped):(i=e.viewModel.plotPoints,r=e.viewModel.tableColumns);const a=e.viewModel.svgWidth/r.length,n=e.viewModel.inputSettings.settings.summary_table;t.call(zd,r,n,a).call(Bd,e,i,n,a),i.length>0&&t.call(Hd,r,e.viewModel.inputSettings.settings,e.viewModel.showGrouped),t.call(qd,n),t.on("click",(()=>{e.selectionManager.clear(),e.updateHighlighting()}))}function Yd(t,e){if(!e.viewModel.inputSettings.settings.download_options.show_button)return void t.select(".download-btn-group").remove();t.select(".download-btn-group").empty()&&t.append("text").classed("download-btn-group",!0);const i=e.viewModel.plotPoints.map((t=>t.table_row)),r=new Array;r.push(Object.keys(i[0]).join(",")),i.forEach((t=>{r.push(Object.values(t).join(","))})),t.select(".download-btn-group").attr("x",e.viewModel.svgWidth-50).attr("y",e.viewModel.svgHeight-5).text("Download").style("font-size","10px").style("text-decoration","underline").on("click",(()=>{e.host.downloadService.exportVisualsContent(r.join("\n"),"chartdata.csv","csv","csv file")}))}function Wd(t,e){if(!e.viewModel.inputSettings.settings.labels.show_labels||!e.viewModel.inputData.anyLabels)return void t.select(".text-labels").remove();t.select(".text-labels").empty()&&t.append("g").classed("text-labels",!0);const i=nr().on("drag",(function(t){const i=t.subject,r=e.plotProperties.xScale(i.x),a=e.plotProperties.yScale(i.value),n=180*Math.atan2(t.sourceEvent.y-a,t.sourceEvent.x-r)/Math.PI,o=Math.sqrt(Math.pow(t.sourceEvent.y-a,2)+Math.pow(t.sourceEvent.x-r,2)),l=10*Math.cos(n*Math.PI/180),s=10*Math.sin(n*Math.PI/180);t.subject.label.angle=n,t.subject.label.distance=o,ut(this).select("text").attr("x",t.sourceEvent.x).attr("y",t.sourceEvent.y);let u=i.label.aesthetics.label_line_offset;u="top"===i.label.aesthetics.label_position?u:-(u+i.label.aesthetics.label_size/2),ut(this).select("line").attr("x1",t.sourceEvent.x).attr("y1",t.sourceEvent.y+u).attr("x2",r+l).attr("y2",a+s),ut(this).select("path").attr("transform",`translate(${r+l}, ${a+s}) rotate(${n-90})`)}));t.select(".text-labels").selectAll(".text-group-inner").data(e.viewModel.plotPoints).join("g").classed("text-group-inner",!0).each((function(t){var r;const a=ut(this);if(""===(null!==(r=t.label.text_value)&&void 0!==r?r:""))return void a.remove();a.selectAll("*").remove();const n=a.append("text"),o=a.append("line"),l=a.append("path"),{x:s,y:u,line_offset:p,marker_offset:d,theta:c}=function(t,e){var i,r;const a="top"===t.label.aesthetics.label_position?-1:1,n=e.viewModel.svgHeight-e.plotProperties.yAxis.start_padding,o=t.label.aesthetics.label_position;let l=t.label.aesthetics.label_y_offset;const s="top"===o?0+l:n-l,u=e.plotProperties.yScale(t.value);let p="top"===o?u-s:s-u;const d=e.plotProperties.xScale(t.x),c=e.plotProperties.yScale(t.value),f=null!==(i=t.label.angle)&&void 0!==i?i:t.label.aesthetics.label_angle_offset+90*a;p=null!==(r=t.label.distance)&&void 0!==r?r:Math.min(p,t.label.aesthetics.label_line_max_length);let h=t.label.aesthetics.label_line_offset;h="top"===o?h:-(h+t.label.aesthetics.label_size/2);let m=t.label.aesthetics.label_marker_offset+t.label.aesthetics.label_size/2;m="top"===o?-m:m;const y=d+p*Math.cos(f*Math.PI/180),g=c+p*Math.sin(f*Math.PI/180);return $d(y)&&$d(g)?{x:y,y:g,theta:f,line_offset:h,marker_offset:m}:{x:0,y:0,theta:0,line_offset:0,marker_offset:0}}(t,e);if(0===s&&0===u)return void a.remove();const f=c-("top"===t.label.aesthetics.label_position?180:0),h=f*Math.PI/180;n.attr("x",s).attr("y",u).text(t.label.text_value).style("text-anchor","middle").style("font-size",`${t.label.aesthetics.label_size}px`).style("font-family",t.label.aesthetics.label_font).style("fill",t.label.aesthetics.label_colour);const m=Math.pow(t.label.aesthetics.label_marker_size,2),y=e.plotProperties.xScale(t.x)+d*Math.cos(h),g=e.plotProperties.yScale(t.value)+d*Math.sin(h);o.attr("x1",s).attr("y1",u+p).attr("x2",y).attr("y2",g).style("stroke",e.viewModel.inputSettings.settings.labels.label_line_colour).style("stroke-width",e.viewModel.inputSettings.settings.labels.label_line_width).style("stroke-dasharray",e.viewModel.inputSettings.settings.labels.label_line_type);const v=f+("top"===t.label.aesthetics.label_position?90:270);l.attr("d",Wt().type(zt).size(m)()).attr("transform",`translate(${y}, ${g}) rotate(${v})`).style("fill",t.label.aesthetics.label_marker_colour).style("stroke",t.label.aesthetics.label_marker_outline_colour),e.viewModel.headless||a.call(i)}))}const Xd={above:-1,below:1,beside:-1},Kd={ll99:"below",ll95:"below",ll68:"below",ul68:"above",ul95:"above",ul99:"above",speclimits_lower:"below",speclimits_upper:"above"},Jd={ll99:"above",ll95:"above",ll68:"above",ul68:"below",ul95:"below",ul99:"below",speclimits_lower:"above",speclimits_upper:"below"};function Qd(t,e){const i=e.viewModel.inputSettings.settings.lines,r=new Array;e.viewModel.groupedLines[0][1].forEach(((t,i)=>{null===t.line_value&&r.push(i-1),i===e.viewModel.groupedLines[0][1].length-1&&r.push(i)}));const a=e.viewModel.groupedLines.map((t=>t[0])),n=new Array;r.forEach(((t,e)=>{a.forEach(((a,o)=>{const l=r[r.length-1],s=r.length-Math.min(r.length,i[`plot_label_show_n_${vd[a]}`]),u=i[`plot_label_show_all_${vd[a]}`]||t==l;(e>=s||u)&&n.push({index:t,limit:o})}))}));const o=td(e.viewModel.inputSettings.settings,e.viewModel.inputSettings.derivedSettings);t.select(".linesgroup").selectAll("text").data(n).join("text").text((t=>{const r=e.viewModel.groupedLines[t.limit];return i[`plot_label_show_${vd[r[0]]}`]?i[`plot_label_prefix_${vd[r[0]]}`]+o(r[1][t.index].line_value,"value"):""})).attr("x",(t=>{const i=e.viewModel.groupedLines[t.limit];return e.plotProperties.xScale(i[1][t.index].x)})).attr("y",(t=>{const i=e.viewModel.groupedLines[t.limit];return e.plotProperties.yScale(i[1][t.index].line_value)})).attr("fill",(t=>{const r=e.viewModel.groupedLines[t.limit];return i[`plot_label_colour_${vd[r[0]]}`]})).attr("font-size",(t=>{const r=e.viewModel.groupedLines[t.limit];return`${i[`plot_label_size_${vd[r[0]]}`]}px`})).attr("font-family",(t=>{const r=e.viewModel.groupedLines[t.limit];return i[`plot_label_font_${vd[r[0]]}`]})).attr("text-anchor",(t=>{const r=e.viewModel.groupedLines[t.limit];return"beside"===i[`plot_label_position_${vd[r[0]]}`]?"start":"end"})).attr("dx",(t=>{const r=e.viewModel.groupedLines[t.limit];return`${("beside"===i[`plot_label_position_${vd[r[0]]}`]?1:-1)*i[`plot_label_hpad_${vd[r[0]]}`]}px`})).attr("dy",(function(t){const r=e.viewModel.groupedLines[t.limit],a=ut(this).node().getBoundingClientRect();let n=i[`plot_label_position_${vd[r[0]]}`],o=i[`plot_label_vpad_${vd[r[0]]}`];["outside","inside"].includes(n)&&(n="outside"===n?Kd[r[0]]:Jd[r[0]]);const l={above:-i[`width_${vd[r[0]]}`],below:i[`plot_label_size_${vd[r[0]]}`],beside:a.height/4};return`${Xd[n]*o+l[n]}px`}))}class tc{initialiseScale(t,e){this.xScale=zi().domain([this.xAxis.lower,this.xAxis.upper]).range([this.xAxis.start_padding,t-this.xAxis.end_padding]),this.yScale=zi().domain([this.yAxis.lower,this.yAxis.upper]).range([e-this.yAxis.start_padding,this.yAxis.end_padding])}update(t,e){var i,r,a,n,o,l,s,u,p;const d=e.plotPoints,c=e.controlLimits,f=e.inputData,h=e.inputSettings.settings,m=e.inputSettings.derivedSettings,y=e.colourPalette;this.displayPlot=d?d.length>1:null;let g=h.x_axis.xlimit_l,v=h.x_axis.xlimit_u,_=h.y_axis.ylimit_l,w=h.y_axis.ylimit_u;if(0==(null===(i=null==f?void 0:f.validationStatus)||void 0===i?void 0:i.status)&&c){v=br(v)?ge(c.keys.map((t=>t.x))):v;const t=h.y_axis.limit_multiplier,e=c.values.filter((t=>$d(t))),i=null===(r=null==c?void 0:c.ul99)||void 0===r?void 0:r.filter((t=>$d(t))),d=null===(a=null==c?void 0:c.speclimits_upper)||void 0===a?void 0:a.filter((t=>$d(t))),f=null===(n=null==c?void 0:c.ll99)||void 0===n?void 0:n.filter((t=>$d(t))),y=null===(o=null==c?void 0:c.speclimits_lower)||void 0===o?void 0:o.filter((t=>$d(t))),b=null===(l=c.alt_targets)||void 0===l?void 0:l.filter((t=>$d(t))),N=null===(s=c.targets)||void 0===s?void 0:s.filter((t=>$d(t))),x=ge(e),S=ge(e.concat(i).concat(d).concat(b)),k=ve(e.concat(f).concat(y).concat(b)),A=null!==(u=ge(N))&&void 0!==u?u:0,F=null!==(p=ve(N))&&void 0!==p?p:0,E=A+(S-A)*t,M=F-(F-k)*t,T=m.multiplier;null!=w||(w=!m.percentLabels||x>1*T?E:wd(E,{upper:1*T})),null!=_||(_=m.percentLabels?wd(M,{lower:0*T}):M);const $=c.keys.map((t=>t.x));g=br(g)?ve($):g,v=br(v)?ge($):v}const b=h.x_axis.xlimit_tick_size,N=h.y_axis.ylimit_tick_size,x=h.y_axis.ylimit_label?h.y_axis.ylimit_label_size:0,S=h.x_axis.xlimit_label?h.x_axis.xlimit_label_size:0;this.xAxis={lower:br(g)?0:g,upper:v,start_padding:h.canvas.left_padding+x,end_padding:h.canvas.right_padding,colour:y.isHighContrast?y.foregroundColour:h.x_axis.xlimit_colour,ticks:h.x_axis.xlimit_ticks,tick_size:`${b}px`,tick_font:h.x_axis.xlimit_tick_font,tick_colour:y.isHighContrast?y.foregroundColour:h.x_axis.xlimit_tick_colour,tick_rotation:h.x_axis.xlimit_tick_rotation,tick_count:h.x_axis.xlimit_tick_count,label:h.x_axis.xlimit_label,label_size:`${h.x_axis.xlimit_label_size}px`,label_font:h.x_axis.xlimit_label_font,label_colour:y.isHighContrast?y.foregroundColour:h.x_axis.xlimit_label_colour},this.yAxis={lower:_,upper:w,start_padding:h.canvas.lower_padding+S,end_padding:h.canvas.upper_padding,colour:y.isHighContrast?y.foregroundColour:h.y_axis.ylimit_colour,ticks:h.y_axis.ylimit_ticks,tick_size:`${N}px`,tick_font:h.y_axis.ylimit_tick_font,tick_colour:y.isHighContrast?y.foregroundColour:h.y_axis.ylimit_tick_colour,tick_rotation:h.y_axis.ylimit_tick_rotation,tick_count:h.y_axis.ylimit_tick_count,label:h.y_axis.ylimit_label,label_size:`${h.y_axis.ylimit_label_size}px`,label_font:h.y_axis.ylimit_label_font,label_colour:y.isHighContrast?y.foregroundColour:h.y_axis.ylimit_label_colour},this.initialiseScale(t.viewport.width,t.viewport.height)}}var ec,ic,rc,ac,nc,oc,lc,sc,uc,pc,dc,cc,fc,hc,mc,yc,gc,vc,_c,wc,bc,Nc,xc,Sc,kc,Ac,Fc,Ec,Mc,Tc,$c,Dc,Lc,Cc,Pc,Ic,Vc,Rc,Oc,jc,Uc,Gc,zc,Bc,qc,Hc,Zc,Yc,Wc,Xc,Kc,Jc,Qc,tf,ef,rf,af,nf,of,lf,sf,uf,pf,df,cf,ff,hf,mf,yf,gf,vf,_f,wf,bf,Nf,xf,Sf,kf,Af,Ff,Ef,Mf,Tf,$f,Df,Lf,Cf,Pf,If,Vf={},Rf={exports:{}};function Of(){if(ic)return ec;ic=1;const t=Number.MAX_SAFE_INTEGER||9007199254740991;return ec={MAX_LENGTH:256,MAX_SAFE_COMPONENT_LENGTH:16,MAX_SAFE_BUILD_LENGTH:250,MAX_SAFE_INTEGER:t,RELEASE_TYPES:["major","premajor","minor","preminor","patch","prepatch","prerelease"],SEMVER_SPEC_VERSION:"2.0.0",FLAG_INCLUDE_PRERELEASE:1,FLAG_LOOSE:2}}function jf(){if(ac)return rc;ac=1;const t="object"==typeof process&&process.env&&process.env.NODE_DEBUG&&/\bsemver\b/i.test(process.env.NODE_DEBUG)?(...t)=>console.error("SEMVER",...t):()=>{};return rc=t}function Uf(){return nc||(nc=1,function(t,e){const{MAX_SAFE_COMPONENT_LENGTH:i,MAX_SAFE_BUILD_LENGTH:r,MAX_LENGTH:a}=Of(),n=jf(),o=(e=t.exports={}).re=[],l=e.safeRe=[],s=e.src=[],u=e.t={};let p=0;const d="[a-zA-Z0-9-]",c=[["\\s",1],["\\d",a],[d,r]],f=(t,e,i)=>{const r=(t=>{for(const[e,i]of c)t=t.split(`${e}*`).join(`${e}{0,${i}}`).split(`${e}+`).join(`${e}{1,${i}}`);return t})(e),a=p++;n(t,a,e),u[t]=a,s[a]=e,o[a]=new RegExp(e,i?"g":void 0),l[a]=new RegExp(r,i?"g":void 0)};f("NUMERICIDENTIFIER","0|[1-9]\\d*"),f("NUMERICIDENTIFIERLOOSE","\\d+"),f("NONNUMERICIDENTIFIER",`\\d*[a-zA-Z-]${d}*`),f("MAINVERSION",`(${s[u.NUMERICIDENTIFIER]})\\.(${s[u.NUMERICIDENTIFIER]})\\.(${s[u.NUMERICIDENTIFIER]})`),f("MAINVERSIONLOOSE",`(${s[u.NUMERICIDENTIFIERLOOSE]})\\.(${s[u.NUMERICIDENTIFIERLOOSE]})\\.(${s[u.NUMERICIDENTIFIERLOOSE]})`),f("PRERELEASEIDENTIFIER",`(?:${s[u.NUMERICIDENTIFIER]}|${s[u.NONNUMERICIDENTIFIER]})`),f("PRERELEASEIDENTIFIERLOOSE",`(?:${s[u.NUMERICIDENTIFIERLOOSE]}|${s[u.NONNUMERICIDENTIFIER]})`),f("PRERELEASE",`(?:-(${s[u.PRERELEASEIDENTIFIER]}(?:\\.${s[u.PRERELEASEIDENTIFIER]})*))`),f("PRERELEASELOOSE",`(?:-?(${s[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${s[u.PRERELEASEIDENTIFIERLOOSE]})*))`),f("BUILDIDENTIFIER",`${d}+`),f("BUILD",`(?:\\+(${s[u.BUILDIDENTIFIER]}(?:\\.${s[u.BUILDIDENTIFIER]})*))`),f("FULLPLAIN",`v?${s[u.MAINVERSION]}${s[u.PRERELEASE]}?${s[u.BUILD]}?`),f("FULL",`^${s[u.FULLPLAIN]}$`),f("LOOSEPLAIN",`[v=\\s]*${s[u.MAINVERSIONLOOSE]}${s[u.PRERELEASELOOSE]}?${s[u.BUILD]}?`),f("LOOSE",`^${s[u.LOOSEPLAIN]}$`),f("GTLT","((?:<|>)?=?)"),f("XRANGEIDENTIFIERLOOSE",`${s[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`),f("XRANGEIDENTIFIER",`${s[u.NUMERICIDENTIFIER]}|x|X|\\*`),f("XRANGEPLAIN",`[v=\\s]*(${s[u.XRANGEIDENTIFIER]})(?:\\.(${s[u.XRANGEIDENTIFIER]})(?:\\.(${s[u.XRANGEIDENTIFIER]})(?:${s[u.PRERELEASE]})?${s[u.BUILD]}?)?)?`),f("XRANGEPLAINLOOSE",`[v=\\s]*(${s[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${s[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${s[u.XRANGEIDENTIFIERLOOSE]})(?:${s[u.PRERELEASELOOSE]})?${s[u.BUILD]}?)?)?`),f("XRANGE",`^${s[u.GTLT]}\\s*${s[u.XRANGEPLAIN]}$`),f("XRANGELOOSE",`^${s[u.GTLT]}\\s*${s[u.XRANGEPLAINLOOSE]}$`),f("COERCEPLAIN",`(^|[^\\d])(\\d{1,${i}})(?:\\.(\\d{1,${i}}))?(?:\\.(\\d{1,${i}}))?`),f("COERCE",`${s[u.COERCEPLAIN]}(?:$|[^\\d])`),f("COERCEFULL",s[u.COERCEPLAIN]+`(?:${s[u.PRERELEASE]})?`+`(?:${s[u.BUILD]})?(?:$|[^\\d])`),f("COERCERTL",s[u.COERCE],!0),f("COERCERTLFULL",s[u.COERCEFULL],!0),f("LONETILDE","(?:~>?)"),f("TILDETRIM",`(\\s*)${s[u.LONETILDE]}\\s+`,!0),e.tildeTrimReplace="$1~",f("TILDE",`^${s[u.LONETILDE]}${s[u.XRANGEPLAIN]}$`),f("TILDELOOSE",`^${s[u.LONETILDE]}${s[u.XRANGEPLAINLOOSE]}$`),f("LONECARET","(?:\\^)"),f("CARETTRIM",`(\\s*)${s[u.LONECARET]}\\s+`,!0),e.caretTrimReplace="$1^",f("CARET",`^${s[u.LONECARET]}${s[u.XRANGEPLAIN]}$`),f("CARETLOOSE",`^${s[u.LONECARET]}${s[u.XRANGEPLAINLOOSE]}$`),f("COMPARATORLOOSE",`^${s[u.GTLT]}\\s*(${s[u.LOOSEPLAIN]})$|^$`),f("COMPARATOR",`^${s[u.GTLT]}\\s*(${s[u.FULLPLAIN]})$|^$`),f("COMPARATORTRIM",`(\\s*)${s[u.GTLT]}\\s*(${s[u.LOOSEPLAIN]}|${s[u.XRANGEPLAIN]})`,!0),e.comparatorTrimReplace="$1$2$3",f("HYPHENRANGE",`^\\s*(${s[u.XRANGEPLAIN]})\\s+-\\s+(${s[u.XRANGEPLAIN]})\\s*$`),f("HYPHENRANGELOOSE",`^\\s*(${s[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${s[u.XRANGEPLAINLOOSE]})\\s*$`),f("STAR","(<|>)?=?\\s*\\*"),f("GTE0","^\\s*>=\\s*0\\.0\\.0\\s*$"),f("GTE0PRE","^\\s*>=\\s*0\\.0\\.0-0\\s*$")}(Rf,Rf.exports)),Rf.exports}function Gf(){if(lc)return oc;lc=1;const t=Object.freeze({loose:!0}),e=Object.freeze({});return oc=i=>i?"object"!=typeof i?t:i:e}function zf(){if(uc)return sc;uc=1;const t=/^[0-9]+$/,e=(e,i)=>{const r=t.test(e),a=t.test(i);return r&&a&&(e=+e,i=+i),e===i?0:r&&!a?-1:a&&!r?1:e<i?-1:1};return sc={compareIdentifiers:e,rcompareIdentifiers:(t,i)=>e(i,t)},sc}function Bf(){if(dc)return pc;dc=1;const t=jf(),{MAX_LENGTH:e,MAX_SAFE_INTEGER:i}=Of(),{safeRe:r,t:a}=Uf(),n=Gf(),{compareIdentifiers:o}=zf();class l{constructor(o,s){if(s=n(s),o instanceof l){if(o.loose===!!s.loose&&o.includePrerelease===!!s.includePrerelease)return o;o=o.version}else if("string"!=typeof o)throw new TypeError(`Invalid version. Must be a string. Got type "${typeof o}".`);if(o.length>e)throw new TypeError(`version is longer than ${e} characters`);t("SemVer",o,s),this.options=s,this.loose=!!s.loose,this.includePrerelease=!!s.includePrerelease;const u=o.trim().match(s.loose?r[a.LOOSE]:r[a.FULL]);if(!u)throw new TypeError(`Invalid Version: ${o}`);if(this.raw=o,this.major=+u[1],this.minor=+u[2],this.patch=+u[3],this.major>i||this.major<0)throw new TypeError("Invalid major version");if(this.minor>i||this.minor<0)throw new TypeError("Invalid minor version");if(this.patch>i||this.patch<0)throw new TypeError("Invalid patch version");u[4]?this.prerelease=u[4].split(".").map((t=>{if(/^[0-9]+$/.test(t)){const e=+t;if(e>=0&&e<i)return e}return t})):this.prerelease=[],this.build=u[5]?u[5].split("."):[],this.format()}format(){return this.version=`${this.major}.${this.minor}.${this.patch}`,this.prerelease.length&&(this.version+=`-${this.prerelease.join(".")}`),this.version}toString(){return this.version}compare(e){if(t("SemVer.compare",this.version,this.options,e),!(e instanceof l)){if("string"==typeof e&&e===this.version)return 0;e=new l(e,this.options)}return e.version===this.version?0:this.compareMain(e)||this.comparePre(e)}compareMain(t){return t instanceof l||(t=new l(t,this.options)),o(this.major,t.major)||o(this.minor,t.minor)||o(this.patch,t.patch)}comparePre(e){if(e instanceof l||(e=new l(e,this.options)),this.prerelease.length&&!e.prerelease.length)return-1;if(!this.prerelease.length&&e.prerelease.length)return 1;if(!this.prerelease.length&&!e.prerelease.length)return 0;let i=0;do{const r=this.prerelease[i],a=e.prerelease[i];if(t("prerelease compare",i,r,a),void 0===r&&void 0===a)return 0;if(void 0===a)return 1;if(void 0===r)return-1;if(r!==a)return o(r,a)}while(++i)}compareBuild(e){e instanceof l||(e=new l(e,this.options));let i=0;do{const r=this.build[i],a=e.build[i];if(t("build compare",i,r,a),void 0===r&&void 0===a)return 0;if(void 0===a)return 1;if(void 0===r)return-1;if(r!==a)return o(r,a)}while(++i)}inc(t,e,i){switch(t){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",e,i);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",e,i);break;case"prepatch":this.prerelease.length=0,this.inc("patch",e,i),this.inc("pre",e,i);break;case"prerelease":0===this.prerelease.length&&this.inc("patch",e,i),this.inc("pre",e,i);break;case"major":0===this.minor&&0===this.patch&&0!==this.prerelease.length||this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":0===this.patch&&0!==this.prerelease.length||this.minor++,this.patch=0,this.prerelease=[];break;case"patch":0===this.prerelease.length&&this.patch++,this.prerelease=[];break;case"pre":{const t=Number(i)?1:0;if(!e&&!1===i)throw new Error("invalid increment argument: identifier is empty");if(0===this.prerelease.length)this.prerelease=[t];else{let r=this.prerelease.length;for(;--r>=0;)"number"==typeof this.prerelease[r]&&(this.prerelease[r]++,r=-2);if(-1===r){if(e===this.prerelease.join(".")&&!1===i)throw new Error("invalid increment argument: identifier already exists");this.prerelease.push(t)}}if(e){let r=[e,t];!1===i&&(r=[e]),0===o(this.prerelease[0],e)?isNaN(this.prerelease[1])&&(this.prerelease=r):this.prerelease=r}break}default:throw new Error(`invalid increment argument: ${t}`)}return this.raw=this.format(),this.build.length&&(this.raw+=`+${this.build.join(".")}`),this}}return pc=l}function qf(){if(fc)return cc;fc=1;const t=Bf();return cc=(e,i,r=!1)=>{if(e instanceof t)return e;try{return new t(e,i)}catch(t){if(!r)return null;throw t}},cc}function Hf(){if($c)return Tc;$c=1;const t=Bf();return Tc=(e,i,r)=>new t(e,r).compare(new t(i,r)),Tc}function Zf(){if(Vc)return Ic;Vc=1;const t=Bf();return Ic=(e,i,r)=>{const a=new t(e,r),n=new t(i,r);return a.compare(n)||a.compareBuild(n)},Ic}function Yf(){if(zc)return Gc;zc=1;const t=Hf();return Gc=(e,i,r)=>t(e,i,r)>0,Gc}function Wf(){if(qc)return Bc;qc=1;const t=Hf();return Bc=(e,i,r)=>t(e,i,r)<0,Bc}function Xf(){if(Zc)return Hc;Zc=1;const t=Hf();return Hc=(e,i,r)=>0===t(e,i,r),Hc}function Kf(){if(Wc)return Yc;Wc=1;const t=Hf();return Yc=(e,i,r)=>0!==t(e,i,r),Yc}function Jf(){if(Kc)return Xc;Kc=1;const t=Hf();return Xc=(e,i,r)=>t(e,i,r)>=0,Xc}function Qf(){if(Qc)return Jc;Qc=1;const t=Hf();return Jc=(e,i,r)=>t(e,i,r)<=0,Jc}function th(){if(ef)return tf;ef=1;const t=Xf(),e=Kf(),i=Yf(),r=Jf(),a=Wf(),n=Qf();return tf=(o,l,s,u)=>{switch(l){case"===":return"object"==typeof o&&(o=o.version),"object"==typeof s&&(s=s.version),o===s;case"!==":return"object"==typeof o&&(o=o.version),"object"==typeof s&&(s=s.version),o!==s;case"":case"=":case"==":return t(o,s,u);case"!=":return e(o,s,u);case">":return i(o,s,u);case">=":return r(o,s,u);case"<":return a(o,s,u);case"<=":return n(o,s,u);default:throw new TypeError(`Invalid operator: ${l}`)}},tf}function eh(){if(sf)return lf;sf=1;const t=/\s+/g;class e{constructor(i,n){if(n=r(n),i instanceof e)return i.loose===!!n.loose&&i.includePrerelease===!!n.includePrerelease?i:new e(i.raw,n);if(i instanceof a)return this.raw=i.value,this.set=[[i]],this.formatted=void 0,this;if(this.options=n,this.loose=!!n.loose,this.includePrerelease=!!n.includePrerelease,this.raw=i.trim().replace(t," "),this.set=this.raw.split("||").map((t=>this.parseRange(t.trim()))).filter((t=>t.length)),!this.set.length)throw new TypeError(`Invalid SemVer Range: ${this.raw}`);if(this.set.length>1){const t=this.set[0];if(this.set=this.set.filter((t=>!h(t[0]))),0===this.set.length)this.set=[t];else if(this.set.length>1)for(const t of this.set)if(1===t.length&&m(t[0])){this.set=[t];break}}this.formatted=void 0}get range(){if(void 0===this.formatted){this.formatted="";for(let t=0;t<this.set.length;t++){t>0&&(this.formatted+="||");const e=this.set[t];for(let t=0;t<e.length;t++)t>0&&(this.formatted+=" "),this.formatted+=e[t].toString().trim()}}return this.formatted}format(){return this.range}toString(){return this.range}parseRange(t){const e=((this.options.includePrerelease&&c)|(this.options.loose&&f))+":"+t,r=i.get(e);if(r)return r;const o=this.options.loose,m=o?l[s.HYPHENRANGELOOSE]:l[s.HYPHENRANGE];t=t.replace(m,F(this.options.includePrerelease)),n("hyphen replace",t),t=t.replace(l[s.COMPARATORTRIM],u),n("comparator trim",t),t=t.replace(l[s.TILDETRIM],p),n("tilde trim",t),t=t.replace(l[s.CARETTRIM],d),n("caret trim",t);let y=t.split(" ").map((t=>g(t,this.options))).join(" ").split(/\s+/).map((t=>A(t,this.options)));o&&(y=y.filter((t=>(n("loose invalid filter",t,this.options),!!t.match(l[s.COMPARATORLOOSE]))))),n("range list",y);const v=new Map,_=y.map((t=>new a(t,this.options)));for(const t of _){if(h(t))return[t];v.set(t.value,t)}v.size>1&&v.has("")&&v.delete("");const w=[...v.values()];return i.set(e,w),w}intersects(t,i){if(!(t instanceof e))throw new TypeError("a Range is required");return this.set.some((e=>y(e,i)&&t.set.some((t=>y(t,i)&&e.every((e=>t.every((t=>e.intersects(t,i)))))))))}test(t){if(!t)return!1;if("string"==typeof t)try{t=new o(t,this.options)}catch(t){return!1}for(let e=0;e<this.set.length;e++)if(E(this.set[e],t,this.options))return!0;return!1}}lf=e;const i=new(of?nf:(of=1,nf=class{constructor(){this.max=1e3,this.map=new Map}get(t){const e=this.map.get(t);return void 0===e?void 0:(this.map.delete(t),this.map.set(t,e),e)}delete(t){return this.map.delete(t)}set(t,e){if(!this.delete(t)&&void 0!==e){if(this.map.size>=this.max){const t=this.map.keys().next().value;this.delete(t)}this.map.set(t,e)}return this}})),r=Gf(),a=ih(),n=jf(),o=Bf(),{safeRe:l,t:s,comparatorTrimReplace:u,tildeTrimReplace:p,caretTrimReplace:d}=Uf(),{FLAG_INCLUDE_PRERELEASE:c,FLAG_LOOSE:f}=Of(),h=t=>"<0.0.0-0"===t.value,m=t=>""===t.value,y=(t,e)=>{let i=!0;const r=t.slice();let a=r.pop();for(;i&&r.length;)i=r.every((t=>a.intersects(t,e))),a=r.pop();return i},g=(t,e)=>(n("comp",t,e),t=b(t,e),n("caret",t),t=_(t,e),n("tildes",t),t=x(t,e),n("xrange",t),t=k(t,e),n("stars",t),t),v=t=>!t||"x"===t.toLowerCase()||"*"===t,_=(t,e)=>t.trim().split(/\s+/).map((t=>w(t,e))).join(" "),w=(t,e)=>{const i=e.loose?l[s.TILDELOOSE]:l[s.TILDE];return t.replace(i,((e,i,r,a,o)=>{let l;return n("tilde",t,e,i,r,a,o),v(i)?l="":v(r)?l=`>=${i}.0.0 <${+i+1}.0.0-0`:v(a)?l=`>=${i}.${r}.0 <${i}.${+r+1}.0-0`:o?(n("replaceTilde pr",o),l=`>=${i}.${r}.${a}-${o} <${i}.${+r+1}.0-0`):l=`>=${i}.${r}.${a} <${i}.${+r+1}.0-0`,n("tilde return",l),l}))},b=(t,e)=>t.trim().split(/\s+/).map((t=>N(t,e))).join(" "),N=(t,e)=>{n("caret",t,e);const i=e.loose?l[s.CARETLOOSE]:l[s.CARET],r=e.includePrerelease?"-0":"";return t.replace(i,((e,i,a,o,l)=>{let s;return n("caret",t,e,i,a,o,l),v(i)?s="":v(a)?s=`>=${i}.0.0${r} <${+i+1}.0.0-0`:v(o)?s="0"===i?`>=${i}.${a}.0${r} <${i}.${+a+1}.0-0`:`>=${i}.${a}.0${r} <${+i+1}.0.0-0`:l?(n("replaceCaret pr",l),s="0"===i?"0"===a?`>=${i}.${a}.${o}-${l} <${i}.${a}.${+o+1}-0`:`>=${i}.${a}.${o}-${l} <${i}.${+a+1}.0-0`:`>=${i}.${a}.${o}-${l} <${+i+1}.0.0-0`):(n("no pr"),s="0"===i?"0"===a?`>=${i}.${a}.${o}${r} <${i}.${a}.${+o+1}-0`:`>=${i}.${a}.${o}${r} <${i}.${+a+1}.0-0`:`>=${i}.${a}.${o} <${+i+1}.0.0-0`),n("caret return",s),s}))},x=(t,e)=>(n("replaceXRanges",t,e),t.split(/\s+/).map((t=>S(t,e))).join(" ")),S=(t,e)=>{t=t.trim();const i=e.loose?l[s.XRANGELOOSE]:l[s.XRANGE];return t.replace(i,((i,r,a,o,l,s)=>{n("xRange",t,i,r,a,o,l,s);const u=v(a),p=u||v(o),d=p||v(l),c=d;return"="===r&&c&&(r=""),s=e.includePrerelease?"-0":"",u?i=">"===r||"<"===r?"<0.0.0-0":"*":r&&c?(p&&(o=0),l=0,">"===r?(r=">=",p?(a=+a+1,o=0,l=0):(o=+o+1,l=0)):"<="===r&&(r="<",p?a=+a+1:o=+o+1),"<"===r&&(s="-0"),i=`${r+a}.${o}.${l}${s}`):p?i=`>=${a}.0.0${s} <${+a+1}.0.0-0`:d&&(i=`>=${a}.${o}.0${s} <${a}.${+o+1}.0-0`),n("xRange return",i),i}))},k=(t,e)=>(n("replaceStars",t,e),t.trim().replace(l[s.STAR],"")),A=(t,e)=>(n("replaceGTE0",t,e),t.trim().replace(l[e.includePrerelease?s.GTE0PRE:s.GTE0],"")),F=t=>(e,i,r,a,n,o,l,s,u,p,d,c)=>`${i=v(r)?"":v(a)?`>=${r}.0.0${t?"-0":""}`:v(n)?`>=${r}.${a}.0${t?"-0":""}`:o?`>=${i}`:`>=${i}${t?"-0":""}`} ${s=v(u)?"":v(p)?`<${+u+1}.0.0-0`:v(d)?`<${u}.${+p+1}.0-0`:c?`<=${u}.${p}.${d}-${c}`:t?`<${u}.${p}.${+d+1}-0`:`<=${s}`}`.trim(),E=(t,e,i)=>{for(let i=0;i<t.length;i++)if(!t[i].test(e))return!1;if(e.prerelease.length&&!i.includePrerelease){for(let i=0;i<t.length;i++)if(n(t[i].semver),t[i].semver!==a.ANY&&t[i].semver.prerelease.length>0){const r=t[i].semver;if(r.major===e.major&&r.minor===e.minor&&r.patch===e.patch)return!0}return!1}return!0};return lf}function ih(){if(pf)return uf;pf=1;const t=Symbol("SemVer ANY");class e{static get ANY(){return t}constructor(r,a){if(a=i(a),r instanceof e){if(r.loose===!!a.loose)return r;r=r.value}r=r.trim().split(/\s+/).join(" "),o("comparator",r,a),this.options=a,this.loose=!!a.loose,this.parse(r),this.semver===t?this.value="":this.value=this.operator+this.semver.version,o("comp",this)}parse(e){const i=this.options.loose?r[a.COMPARATORLOOSE]:r[a.COMPARATOR],n=e.match(i);if(!n)throw new TypeError(`Invalid comparator: ${e}`);this.operator=void 0!==n[1]?n[1]:"","="===this.operator&&(this.operator=""),n[2]?this.semver=new l(n[2],this.options.loose):this.semver=t}toString(){return this.value}test(e){if(o("Comparator.test",e,this.options.loose),this.semver===t||e===t)return!0;if("string"==typeof e)try{e=new l(e,this.options)}catch(t){return!1}return n(e,this.operator,this.semver,this.options)}intersects(t,r){if(!(t instanceof e))throw new TypeError("a Comparator is required");return""===this.operator?""===this.value||new s(t.value,r).test(this.value):""===t.operator?""===t.value||new s(this.value,r).test(t.semver):(!(r=i(r)).includePrerelease||"<0.0.0-0"!==this.value&&"<0.0.0-0"!==t.value)&&(!(!r.includePrerelease&&(this.value.startsWith("<0.0.0")||t.value.startsWith("<0.0.0")))&&(!(!this.operator.startsWith(">")||!t.operator.startsWith(">"))||(!(!this.operator.startsWith("<")||!t.operator.startsWith("<"))||(!(this.semver.version!==t.semver.version||!this.operator.includes("=")||!t.operator.includes("="))||(!!(n(this.semver,"<",t.semver,r)&&this.operator.startsWith(">")&&t.operator.startsWith("<"))||!!(n(this.semver,">",t.semver,r)&&this.operator.startsWith("<")&&t.operator.startsWith(">")))))))}}uf=e;const i=Gf(),{safeRe:r,t:a}=Uf(),n=th(),o=jf(),l=Bf(),s=eh();return uf}function rh(){if(cf)return df;cf=1;const t=eh();return df=(e,i,r)=>{try{i=new t(i,r)}catch(t){return!1}return i.test(e)},df}function ah(){if(Nf)return bf;Nf=1;const t=eh();return bf=(e,i)=>{try{return new t(e,i).range||"*"}catch(t){return null}},bf}function nh(){if(Sf)return xf;Sf=1;const t=Bf(),e=ih(),{ANY:i}=e,r=eh(),a=rh(),n=Yf(),o=Wf(),l=Qf(),s=Jf();return xf=(u,p,d,c)=>{let f,h,m,y,g;switch(u=new t(u,c),p=new r(p,c),d){case">":f=n,h=l,m=o,y=">",g=">=";break;case"<":f=o,h=s,m=n,y="<",g="<=";break;default:throw new TypeError('Must provide a hilo val of "<" or ">"')}if(a(u,p,c))return!1;for(let t=0;t<p.set.length;++t){const r=p.set[t];let a=null,n=null;if(r.forEach((t=>{t.semver===i&&(t=new e(">=0.0.0")),a=a||t,n=n||t,f(t.semver,a.semver,c)?a=t:m(t.semver,n.semver,c)&&(n=t)})),a.operator===y||a.operator===g)return!1;if((!n.operator||n.operator===y)&&h(u,n.semver))return!1;if(n.operator===g&&m(u,n.semver))return!1}return!0},xf}function oh(){if(If)return Pf;If=1;const t=Uf(),e=Of(),i=Bf(),r=zf(),a=qf(),n=function(){if(mc)return hc;mc=1;const t=qf();return hc=(e,i)=>{const r=t(e,i);return r?r.version:null},hc}(),o=function(){if(gc)return yc;gc=1;const t=qf();return yc=(e,i)=>{const r=t(e.trim().replace(/^[=v]+/,""),i);return r?r.version:null},yc}(),l=function(){if(_c)return vc;_c=1;const t=Bf();return vc=(e,i,r,a,n)=>{"string"==typeof r&&(n=a,a=r,r=void 0);try{return new t(e instanceof t?e.version:e,r).inc(i,a,n).version}catch(t){return null}},vc}(),s=function(){if(bc)return wc;bc=1;const t=qf();return wc=(e,i)=>{const r=t(e,null,!0),a=t(i,null,!0),n=r.compare(a);if(0===n)return null;const o=n>0,l=o?r:a,s=o?a:r,u=!!l.prerelease.length;if(s.prerelease.length&&!u)return s.patch||s.minor?l.patch?"patch":l.minor?"minor":"major":"major";const p=u?"pre":"";return r.major!==a.major?p+"major":r.minor!==a.minor?p+"minor":r.patch!==a.patch?p+"patch":"prerelease"}}(),u=function(){if(xc)return Nc;xc=1;const t=Bf();return Nc=(e,i)=>new t(e,i).major,Nc}(),p=function(){if(kc)return Sc;kc=1;const t=Bf();return Sc=(e,i)=>new t(e,i).minor,Sc}(),d=function(){if(Fc)return Ac;Fc=1;const t=Bf();return Ac=(e,i)=>new t(e,i).patch,Ac}(),c=function(){if(Mc)return Ec;Mc=1;const t=qf();return Ec=(e,i)=>{const r=t(e,i);return r&&r.prerelease.length?r.prerelease:null},Ec}(),f=Hf(),h=function(){if(Lc)return Dc;Lc=1;const t=Hf();return Dc=(e,i,r)=>t(i,e,r),Dc}(),m=function(){if(Pc)return Cc;Pc=1;const t=Hf();return Cc=(e,i)=>t(e,i,!0),Cc}(),y=Zf(),g=function(){if(Oc)return Rc;Oc=1;const t=Zf();return Rc=(e,i)=>e.sort(((e,r)=>t(e,r,i))),Rc}(),v=function(){if(Uc)return jc;Uc=1;const t=Zf();return jc=(e,i)=>e.sort(((e,r)=>t(r,e,i))),jc}(),_=Yf(),w=Wf(),b=Xf(),N=Kf(),x=Jf(),S=Qf(),k=th(),A=function(){if(af)return rf;af=1;const t=Bf(),e=qf(),{safeRe:i,t:r}=Uf();return rf=(a,n)=>{if(a instanceof t)return a;if("number"==typeof a&&(a=String(a)),"string"!=typeof a)return null;let o=null;if((n=n||{}).rtl){const t=n.includePrerelease?i[r.COERCERTLFULL]:i[r.COERCERTL];let e;for(;(e=t.exec(a))&&(!o||o.index+o[0].length!==a.length);)o&&e.index+e[0].length===o.index+o[0].length||(o=e),t.lastIndex=e.index+e[1].length+e[2].length;t.lastIndex=-1}else o=a.match(n.includePrerelease?i[r.COERCEFULL]:i[r.COERCE]);if(null===o)return null;const l=o[2],s=o[3]||"0",u=o[4]||"0",p=n.includePrerelease&&o[5]?`-${o[5]}`:"",d=n.includePrerelease&&o[6]?`+${o[6]}`:"";return e(`${l}.${s}.${u}${p}${d}`,n)},rf}(),F=ih(),E=eh(),M=rh(),T=function(){if(hf)return ff;hf=1;const t=eh();return ff=(e,i)=>new t(e,i).set.map((t=>t.map((t=>t.value)).join(" ").trim().split(" "))),ff}(),$=function(){if(yf)return mf;yf=1;const t=Bf(),e=eh();return mf=(i,r,a)=>{let n=null,o=null,l=null;try{l=new e(r,a)}catch(t){return null}return i.forEach((e=>{l.test(e)&&(n&&-1!==o.compare(e)||(n=e,o=new t(n,a)))})),n},mf}(),D=function(){if(vf)return gf;vf=1;const t=Bf(),e=eh();return gf=(i,r,a)=>{let n=null,o=null,l=null;try{l=new e(r,a)}catch(t){return null}return i.forEach((e=>{l.test(e)&&(n&&1!==o.compare(e)||(n=e,o=new t(n,a)))})),n},gf}(),L=function(){if(wf)return _f;wf=1;const t=Bf(),e=eh(),i=Yf();return _f=(r,a)=>{r=new e(r,a);let n=new t("0.0.0");if(r.test(n))return n;if(n=new t("0.0.0-0"),r.test(n))return n;n=null;for(let e=0;e<r.set.length;++e){const a=r.set[e];let o=null;a.forEach((e=>{const r=new t(e.semver.version);switch(e.operator){case">":0===r.prerelease.length?r.patch++:r.prerelease.push(0),r.raw=r.format();case"":case">=":o&&!i(r,o)||(o=r);break;case"<":case"<=":break;default:throw new Error(`Unexpected operation: ${e.operator}`)}})),!o||n&&!i(n,o)||(n=o)}return n&&r.test(n)?n:null},_f}(),C=ah(),P=nh(),I=function(){if(Af)return kf;Af=1;const t=nh();return kf=(e,i,r)=>t(e,i,">",r),kf}(),V=function(){if(Ef)return Ff;Ef=1;const t=nh();return Ff=(e,i,r)=>t(e,i,"<",r),Ff}(),R=function(){if(Tf)return Mf;Tf=1;const t=eh();return Mf=(e,i,r)=>(e=new t(e,r),i=new t(i,r),e.intersects(i,r))}(),O=function(){if(Df)return $f;Df=1;const t=rh(),e=Hf();return $f=(i,r,a)=>{const n=[];let o=null,l=null;const s=i.sort(((t,i)=>e(t,i,a)));for(const e of s)t(e,r,a)?(l=e,o||(o=e)):(l&&n.push([o,l]),l=null,o=null);o&&n.push([o,null]);const u=[];for(const[t,e]of n)t===e?u.push(t):e||t!==s[0]?e?t===s[0]?u.push(`<=${e}`):u.push(`${t} - ${e}`):u.push(`>=${t}`):u.push("*");const p=u.join(" || "),d="string"==typeof r.raw?r.raw:String(r);return p.length<d.length?p:r},$f}(),j=function(){if(Cf)return Lf;Cf=1;const t=eh(),e=ih(),{ANY:i}=e,r=rh(),a=Hf(),n=[new e(">=0.0.0-0")],o=[new e(">=0.0.0")],l=(t,e,l)=>{if(t===e)return!0;if(1===t.length&&t[0].semver===i){if(1===e.length&&e[0].semver===i)return!0;t=l.includePrerelease?n:o}if(1===e.length&&e[0].semver===i){if(l.includePrerelease)return!0;e=o}const p=new Set;let d,c,f,h,m,y,g;for(const e of t)">"===e.operator||">="===e.operator?d=s(d,e,l):"<"===e.operator||"<="===e.operator?c=u(c,e,l):p.add(e.semver);if(p.size>1)return null;if(d&&c){if(f=a(d.semver,c.semver,l),f>0)return null;if(0===f&&(">="!==d.operator||"<="!==c.operator))return null}for(const t of p){if(d&&!r(t,String(d),l))return null;if(c&&!r(t,String(c),l))return null;for(const i of e)if(!r(t,String(i),l))return!1;return!0}let v=!(!c||l.includePrerelease||!c.semver.prerelease.length)&&c.semver,_=!(!d||l.includePrerelease||!d.semver.prerelease.length)&&d.semver;v&&1===v.prerelease.length&&"<"===c.operator&&0===v.prerelease[0]&&(v=!1);for(const t of e){if(g=g||">"===t.operator||">="===t.operator,y=y||"<"===t.operator||"<="===t.operator,d)if(_&&t.semver.prerelease&&t.semver.prerelease.length&&t.semver.major===_.major&&t.semver.minor===_.minor&&t.semver.patch===_.patch&&(_=!1),">"===t.operator||">="===t.operator){if(h=s(d,t,l),h===t&&h!==d)return!1}else if(">="===d.operator&&!r(d.semver,String(t),l))return!1;if(c)if(v&&t.semver.prerelease&&t.semver.prerelease.length&&t.semver.major===v.major&&t.semver.minor===v.minor&&t.semver.patch===v.patch&&(v=!1),"<"===t.operator||"<="===t.operator){if(m=u(c,t,l),m===t&&m!==c)return!1}else if("<="===c.operator&&!r(c.semver,String(t),l))return!1;if(!t.operator&&(c||d)&&0!==f)return!1}return!(d&&y&&!c&&0!==f||c&&g&&!d&&0!==f||_||v)},s=(t,e,i)=>{if(!t)return e;const r=a(t.semver,e.semver,i);return r>0?t:r<0||">"===e.operator&&">="===t.operator?e:t},u=(t,e,i)=>{if(!t)return e;const r=a(t.semver,e.semver,i);return r<0?t:r>0||"<"===e.operator&&"<="===t.operator?e:t};return Lf=(e,i,r={})=>{if(e===i)return!0;e=new t(e,r),i=new t(i,r);let a=!1;t:for(const t of e.set){for(const e of i.set){const i=l(t,e,r);if(a=a||null!==i,i)continue t}if(a)return!1}return!0}}();return Pf={parse:a,valid:n,clean:o,inc:l,diff:s,major:u,minor:p,patch:d,prerelease:c,compare:f,rcompare:h,compareLoose:m,compareBuild:y,sort:g,rsort:v,gt:_,lt:w,eq:b,neq:N,gte:x,lte:S,cmp:k,coerce:A,Comparator:F,Range:E,satisfies:M,toComparators:T,maxSatisfying:$,minSatisfying:D,minVersion:L,validRange:C,outside:P,gtr:I,ltr:V,intersects:R,simplifyRange:O,subset:j,SemVer:i,re:t.re,src:t.src,tokens:t.t,SEMVER_SPEC_VERSION:e.SEMVER_SPEC_VERSION,RELEASE_TYPES:e.RELEASE_TYPES,compareIdentifiers:r.compareIdentifiers,rcompareIdentifiers:r.rcompareIdentifiers}}var lh,sh="5.1.0",uh={type:"object",properties:{privileges:{type:"array",description:"Defines required privileges for the visual",items:{$ref:"#/definitions/privilege"}},dataRoles:{type:"array",description:"Defines data roles for the visual",items:{$ref:"#/definitions/dataRole"}},dataViewMappings:{type:"array",description:"Defines data mappings for the visual",items:{$ref:"#/definitions/dataViewMapping"}},objects:{$ref:"#/definitions/objects"},tooltips:{$ref:"#/definitions/tooltips"},sorting:{$ref:"#/definitions/sorting"},drilldown:{$ref:"#/definitions/drilldown"},expandCollapse:{$ref:"#/definitions/expandCollapse"},suppressDefaultTitle:{type:"boolean",description:"Indicates whether the visual should show a default title"},supportsKeyboardFocus:{type:"boolean",description:"Allows the visual to receive focus through keyboard navigation"},supportsHighlight:{type:"boolean",description:"Tells the host to include highlight data"},supportsSynchronizingFilterState:{type:"boolean",description:"Indicates whether the visual supports synchronization across report pages (for slicer visuals only)"},advancedEditModeSupport:{type:"number",description:"Indicates the action requested from the host when this visual enters Advanced Edit mode."},supportsLandingPage:{type:"boolean",description:"Indicates whether the visual supports a landing page"},supportsEmptyDataView:{type:"boolean",description:"Indicates whether the visual can receive formatting pane properties when it has no dataroles"},supportsMultiVisualSelection:{type:"boolean",description:"Indicates whether the visual supports multi selection"},subtotals:{description:"Specifies the subtotal customizations applied in the customizeQuery method",$ref:"#/definitions/subtotals"},migration:{$ref:"#/definitions/migration"},keepAllMetadataColumns:{type:"boolean",description:"Indicates that visual is going to receive all metadata columns, no matter what the active projections are"}},required:["privileges"],additionalProperties:!1,definitions:{privilege:{type:"object",description:"privilege - Defines the name, essentiality, and optional parameters for a privilege",properties:{name:{type:"string",description:"The internal name of the privilege",enum:["WebAccess","LocalStorage","ExportContent"]},essential:{type:"boolean",description:"Determines if the privilege is essential for the visual. Default value is false"},parameters:{type:"array",description:"Determines a list of privilege parameters if any",items:{type:"string",description:"The privilege parameter"}}},required:["name"]},dataRole:{type:"object",description:"dataRole - Defines the name, displayName, and kind of a data role",properties:{name:{type:"string",description:"The internal name for this data role used for all references to this role"},displayName:{type:"string",description:"The name of this data role that is shown to the user"},displayNameKey:{type:"string",description:"The localization key for the displayed name in the stringResourced file"},kind:{description:"The kind of data that can be bound do this role",$ref:"#/definitions/dataRole.kind"},description:{type:"string",description:"A description of this role shown to the user as a tooltip"},descriptionKey:{type:"string",description:"The localization key for the description in the stringResourced file"},preferredTypes:{type:"array",description:"Defines the preferred type of data for this data role",items:{$ref:"#/definitions/valueType"}},requiredTypes:{type:"array",description:"Defines the required type of data for this data role. Any values that do not match will be set to null",items:{$ref:"#/definitions/valueType"}}},required:["name","displayName","kind"],additionalProperties:!1},dataViewMapping:{type:"object",description:"dataMapping - Defines how data is mapped to data roles",properties:{conditions:{type:"array",description:"List of conditions that must be met for this data mapping",items:{type:"object",description:"condition - Defines conditions for a data mapping (each key needs to be a valid data role)",patternProperties:{"^[\\w\\s-]+$":{description:"Specifies the number of values that can be assigned to this data role in this mapping",$ref:"#/definitions/dataViewMapping.numberRangeWithKind"}},additionalProperties:!1}},single:{$ref:"#/definitions/dataViewMapping.single"},categorical:{$ref:"#/definitions/dataViewMapping.categorical"},table:{$ref:"#/definitions/dataViewMapping.table"},matrix:{$ref:"#/definitions/dataViewMapping.matrix"},scriptResult:{$ref:"#/definitions/dataViewMapping.scriptResult"}},anyOf:[{required:["single"]},{required:["categorical"]},{required:["table"]},{required:["matrix"]},{required:["scriptResult"]}],additionalProperties:!1},"dataViewMapping.single":{type:"object",description:"single - Defines a single data mapping",properties:{role:{type:"string",description:"The data role to bind to this mapping"}},required:["role"],additionalProperties:!1},"dataViewMapping.categorical":{type:"object",description:"categorical - Defines a categorical data mapping",properties:{categories:{type:"object",description:"Defines data roles to be used as categories",properties:{bind:{$ref:"#/definitions/dataViewMapping.bindTo"},for:{$ref:"#/definitions/dataViewMapping.forIn"},select:{$ref:"#/definitions/dataViewMapping.select"},dataReductionAlgorithm:{$ref:"#/definitions/dataViewMapping.dataReductionAlgorithm"}},oneOf:[{required:["for"]},{required:["bind"]},{required:["select"]}]},values:{type:"object",description:"Defines data roles to be used as values",properties:{bind:{$ref:"#/definitions/dataViewMapping.bindTo"},for:{$ref:"#/definitions/dataViewMapping.forIn"},select:{$ref:"#/definitions/dataViewMapping.select"},group:{type:"object",description:"Groups on a a specific data role",properties:{by:{description:"Specifies a data role to use for grouping",type:"string"},select:{$ref:"#/definitions/dataViewMapping.select"},dataReductionAlgorithm:{$ref:"#/definitions/dataViewMapping.dataReductionAlgorithm"}},required:["by","select"]}},oneOf:[{required:["for"]},{required:["bind"]},{required:["select"]},{required:["group"]}]},dataVolume:{$ref:"#/definitions/dataViewMapping.dataVolume"}},additionalProperties:!1},"dataViewMapping.table":{type:"object",description:"table - Defines a table data mapping",properties:{rows:{type:"object",description:"Rows to use for the table",properties:{bind:{$ref:"#/definitions/dataViewMapping.bindTo"},for:{$ref:"#/definitions/dataViewMapping.forIn"},select:{$ref:"#/definitions/dataViewMapping.select"},dataReductionAlgorithm:{$ref:"#/definitions/dataViewMapping.dataReductionAlgorithm"}},oneOf:[{required:["for"]},{required:["bind"]},{required:["select"]}]},rowCount:{type:"object",description:"Specifies a constraint on the number of data rows supported by the visual",properties:{preferred:{description:"Specifies a preferred range of values for the constraint",$ref:"#/definitions/dataViewMapping.numberRange"},supported:{description:"Specifies a supported range of values for the constraint. Defaults to preferred if not specified.",$ref:"#/definitions/dataViewMapping.numberRange"}}},dataVolume:{$ref:"#/definitions/dataViewMapping.dataVolume"}},requires:["rows"]},"dataViewMapping.matrix":{type:"object",description:"matrix - Defines a matrix data mapping",properties:{rows:{type:"object",description:"Defines the rows used for the matrix",properties:{for:{$ref:"#/definitions/dataViewMapping.forIn"},select:{$ref:"#/definitions/dataViewMapping.select"},dataReductionAlgorithm:{$ref:"#/definitions/dataViewMapping.dataReductionAlgorithm"}},oneOf:[{required:["for"]},{required:["select"]}]},columns:{type:"object",description:"Defines the columns used for the matrix",properties:{for:{$ref:"#/definitions/dataViewMapping.forIn"},dataReductionAlgorithm:{$ref:"#/definitions/dataViewMapping.dataReductionAlgorithm"}},required:["for"]},values:{type:"object",description:"Defines the values used for the matrix",properties:{for:{$ref:"#/definitions/dataViewMapping.forIn"},select:{$ref:"#/definitions/dataViewMapping.select"}},oneOf:[{required:["for"]},{required:["select"]}]},dataVolume:{$ref:"#/definitions/dataViewMapping.dataVolume"}}},"dataViewMapping.scriptResult":{type:"object",description:"scriptResult - Defines a scriptResult data mapping",properties:{dataInput:{type:"object",description:"dataInput - Defines how data is mapped to data roles",properties:{table:{$ref:"#/definitions/dataViewMapping.table"}}},script:{type:"object",description:"script - Defines where the script text and provider are stored",properties:{scriptSourceDefault:{type:"string",description:"scriptSourceDefault - Defines the default script source value to be used when no script object is defined"},scriptProviderDefault:{type:"string",description:"scriptProviderDefault - Defines the default script provider value to be used when no provider object is defined"},scriptOutputType:{type:"string",description:"scriptOutputType - Defines the output type that the R script will generate"},source:{$ref:"#/definitions/dataViewObjectPropertyIdentifier"},provider:{$ref:"#/definitions/dataViewObjectPropertyIdentifier"}}}}},dataViewObjectPropertyIdentifier:{type:"object",description:"Points to an object property",properties:{objectName:{type:"string",description:"The name of a object"},propertyName:{type:"string",description:"The name of a property inside the object"}}},"dataViewMapping.bindTo":{type:"object",description:"Binds this data mapping to a single value",properties:{to:{type:"string",description:"The name of a data role to bind to"}},additionalProperties:!1,required:["to"]},"dataViewMapping.numberRange":{type:"object",description:"A number range from min to max",properties:{min:{type:"number",description:"Minimum value supported"},max:{type:"number",description:"Maximum value supported"}}},"dataViewMapping.numberRangeWithKind":{allOf:[{$ref:"#/definitions/dataViewMapping.numberRange"},{properties:{kind:{$ref:"#/definitions/dataRole.kind"}}}]},"dataRole.kind":{type:"string",enum:["Grouping","Measure","GroupingOrMeasure"]},"dataViewMapping.select":{type:"array",description:"Defines a list of properties to bind",items:{type:"object",properties:{bind:{$ref:"#/definitions/dataViewMapping.bindTo"},for:{$ref:"#/definitions/dataViewMapping.forIn"}},oneOf:[{required:["for"]},{required:["bind"]}]}},"dataViewMapping.dataReductionAlgorithm":{type:"object",description:"Describes how to reduce the amount of data exposed to the visual",properties:{top:{type:"object",description:"Reduce the data to the Top count items",properties:{count:{type:"number"}}},bottom:{type:"object",description:"Reduce the data to the Bottom count items",properties:{count:{type:"number"}}},sample:{type:"object",description:"Reduce the data using a simple Sample of count items",properties:{count:{type:"number"}}},window:{type:"object",description:"Allow the data to be loaded one window, containing count items, at a time",properties:{count:{type:"number"}}}},additionalProperties:!1,oneOf:[{required:["top"]},{required:["bottom"]},{required:["sample"]},{required:["window"]}]},"dataViewMapping.dataVolume":{description:"Specifies the volume of data the query should return (1-6)",type:"number",enum:[1,2,3,4,5,6]},"dataViewMapping.forIn":{type:"object",description:"Binds this data mapping for all items in a collection",properties:{in:{type:"string",description:"The name of a data role to iterate over"}},additionalProperties:!1,required:["in"]},objects:{type:"object",description:"A list of unique property groups",patternProperties:{"^[\\w\\s-]+$":{type:"object",description:"Settings for a group of properties",properties:{displayName:{type:"string",description:"The name shown to the user to describe this group of properties"},displayNameKey:{type:"string",description:"The localization key for the displayed name in the stringResourced file"},objectCategory:{type:"number",description:"What aspect of the visual this object controlls (1 = Formatting, 2 = Analytics). Formatting: look & feel, colors, axes, labels etc. Analytics: forcasts, trendlines, reference lines and shapes etc."},description:{type:"string",description:"A description of this object shown to the user as a tooltip"},descriptionKey:{type:"string",description:"The localization key for the description in the stringResourced file"},properties:{type:"object",description:"A list of unique properties contained in this group",patternProperties:{"^[\\w\\s-]+$":{$ref:"#/definitions/object.propertySettings"}},additionalProperties:!1}},additionalProperties:!1}},additionalProperties:!1},tooltips:{type:"object",description:"Instructs the host to include tooltips ability",properties:{supportedTypes:{type:"object",description:"Instructs the host what tooltip types to support",properties:{default:{type:"boolean",description:"Instructs the host to support showing default tooltips"},canvas:{type:"boolean",description:"Instructs the host to support showing canvas tooltips"}}},roles:{type:"array",items:{type:"string",description:"The name of the data role to bind the tooltips selected info to"}},supportEnhancedTooltips:{type:"boolean",description:"Indicates whether the visual support modern tooltip feature"}}},"object.propertySettings":{type:"object",description:"Settings for a property",properties:{displayName:{type:"string",description:"The name shown to the user to describe this property"},displayNameKey:{type:"string",description:"The localization key for the displayed name in the stringResourced file"},description:{type:"string",description:"A description of this property shown to the user as a tooltip"},descriptionKey:{type:"string",description:"The localization key for the description in the stringResourced file"},placeHolderText:{type:"string",description:"Text to display if the field is empty"},placeHolderTextKey:{type:"string",description:"The localization key for the placeHolderText in the stringResources file"},suppressFormatPainterCopy:{type:"boolean",description:"Indicates whether the Format Painter should ignore this property"},type:{description:"Describes what type of property this is and how it should be displayed to the user",$ref:"#/definitions/valueType"},rule:{type:"object",description:"Describes substitution rule that replaces property object, described inside the rule, to current property object that contains this rule",$ref:"#/definitions/substitutionRule"},filterState:{type:"boolean",description:"Indicates whether the property is a part of filtration information"}},additionalProperties:!1},substitutionRule:{type:"object",description:"Describes substitution rule that replaces property object, described inside the rule, to current property object that contains this rule",properties:{inputRole:{type:"string",description:"The name of role. If this role is set, the substitution will be applied"},output:{type:"object",description:"Describes what exactly is necessary to replace",properties:{property:{type:"string",description:"The name of property object that will be replaced"},selector:{type:"array",description:"The array of selector names. Usually, it contains only one selector -- 'Category'",items:{type:"string",description:"The name of selector"}}}}}},sorting:{type:"object",description:"Specifies the default sorting behavior for the visual",properties:{default:{type:"object",additionalProperties:!1},custom:{type:"object",additionalProperties:!1},implicit:{type:"object",description:"implicit sort",properties:{clauses:{type:"array",items:{type:"object",properties:{role:{type:"string"},direction:{type:"number",description:"Determines sort direction (1 = Ascending, 2 = Descending)",enum:[1,2]}},additionalProperties:!1}}},additionalProperties:!1}},additionalProperties:!1,anyOf:[{required:["default"]},{required:["custom"]},{required:["implicit"]}]},drilldown:{type:"object",description:"Defines the visual's drill capability",properties:{roles:{type:"array",description:"The drillable role names for this visual",items:{type:"string",description:"The name of the role"}}}},expandCollapse:{type:"object",description:"Defines the visual's expandCollapse capability",properties:{roles:{type:"array",description:"The expandCollapsed role names for this visual",items:{type:"string",description:"The name of the role"}},addDataViewFlags:{type:"object",description:"The data view flags",defaultValue:{type:"boolean",description:"Indicates if the DataViewTreeNode will contain the isCollapsed flag by default"}},supportsMerge:{type:"boolean",description:"Indicates that the expansion state should be updated when query projections change, instead of being reset."},restoreProjectionsOrderFromBookmark:{type:"boolean",description:"Indicates that the bookmarked expansion state should be restored even if the query projections order no longer matches the expansion state levels."}}},valueType:{type:"object",properties:{bool:{type:"boolean",description:"A boolean value that will be displayed to the user as a toggle switch"},enumeration:{type:"array",description:"A list of values that will be displayed as a drop down list",items:{type:"object",description:"Describes an item in the enumeration list",properties:{displayName:{type:"string",description:"The name shown to the user to describe this item"},displayNameKey:{type:"string",description:"The localization key for the displayed name in the stringResourced file"},value:{type:"string",description:"The internal value of this property when this item is selected"}}}},fill:{type:"object",description:"A color value that will be displayed to the user as a color picker",properties:{solid:{type:"object",description:"A solid color value that will be displayed to the user as a color picker",properties:{color:{oneOf:[{type:"boolean"},{type:"object",properties:{nullable:{description:"Allows the user to select 'no fill' for the color",type:"boolean"}}}]}}}}},fillRule:{type:"object",description:"A color gradient that will be dispalyed to the user as a minimum (,medium) and maximum color pickers",properties:{linearGradient2:{type:"object",description:"Two color gradient",properties:{max:{type:"object",description:"Maximum color for gradient",properties:{color:{type:"string"},value:{type:"number"}}},min:{type:"object",description:"Minimum color for gradient",properties:{color:{type:"string"},value:{type:"number"}}},nullColoringStrategy:{type:"object",description:"Null color strategy"}}},linearGradient3:{type:"object",description:"Three color gradient",properties:{max:{type:"object",description:"Maximum color for gradient",properties:{color:{type:"string"},value:{type:"number"}}},min:{type:"object",description:"Minimum color for gradient",properties:{color:{type:"string"},value:{type:"number"}}},mid:{type:"object",description:"Middle color for gradient",properties:{color:{type:"string"},value:{type:"number"}}},nullColoringStrategy:{type:"object",description:"Null color strategy"}}}}},formatting:{type:"object",description:"A numeric value that will be displayed to the user as a text input",properties:{labelDisplayUnits:{type:"boolean",description:"Displays a dropdown with common display units (Auto, None, Thousands, Millions, Billions, Trillions)"},alignment:{type:"boolean",description:"Displays a selector to allow the user to choose left, center, or right alignment"},fontSize:{type:"boolean",description:"Displays a slider that allows the user to choose a font size in points"},fontFamily:{type:"boolean",description:"Displays a dropdown with font families"},formatString:{type:"boolean",description:"Displays dynamic format string"}},additionalProperties:!1,oneOf:[{required:["labelDisplayUnits"]},{required:["alignment"]},{required:["fontSize"]},{required:["fontFamily"]},{required:["formatString"]}]},integer:{type:"boolean",description:"An integer (whole number) value that will be displayed to the user as a text input"},numeric:{type:"boolean",description:"A numeric value that will be displayed to the user as a text input"},filter:{oneOf:[{type:"boolean"},{type:"object",properties:{selfFilter:{type:"boolean"}}}],description:"A filter"},operations:{type:"object",description:"A visual operation",properties:{searchEnabled:{type:"boolean",description:"Turns search ability on"}}},text:{type:"boolean",description:"A text value that will be displayed to the user as a text input"},scripting:{type:"object",description:"A text value that will be displayed to the user as a script",properties:{source:{type:"boolean",description:"A source code"}}},geography:{type:"object",description:"Geographical data",properties:{address:{type:"boolean"},city:{type:"boolean"},continent:{type:"boolean"},country:{type:"boolean"},county:{type:"boolean"},region:{type:"boolean"},postalCode:{type:"boolean"},stateOrProvince:{type:"boolean"},place:{type:"boolean"},latitude:{type:"boolean"},longitude:{type:"boolean"}}}},additionalProperties:!1,oneOf:[{required:["bool"]},{required:["enumeration"]},{required:["fill"]},{required:["fillRule"]},{required:["formatting"]},{required:["integer"]},{required:["numeric"]},{required:["text"]},{required:["geography"]},{required:["scripting"]},{required:["filter"]},{required:["operations"]}]},subtotals:{type:"object",description:"Specifies the subtotal request customizations applied to the outgoing data query",properties:{matrix:{description:"Defines the subtotal customizations of the outgoing data query of a matrix-dataview visual",$ref:"#/definitions/subtotals.matrix"}},requires:["matrix"]},"subtotals.matrix":{type:"object",description:"Specifies the subtotal customizations of the outgoing data query of a matrix-dataview visual",properties:{rowSubtotals:{type:"object",description:"Indicates if the subtotal data should be requested for all fields in the rows field well",properties:{propertyIdentifier:{type:"object",properties:{objectName:{type:"string"},propertyName:{type:"string"}}},defaultValue:{type:"boolean"}}},rowSubtotalsPerLevel:{type:"object",description:"Indicates if the subtotal data can be toggled for individual fields in the rows field well",properties:{propertyIdentifier:{type:"object",properties:{objectName:{type:"string"},propertyName:{type:"string"}}},defaultValue:{type:"boolean"}}},columnSubtotals:{type:"object",description:"Indicates if the subtotal data should be requested for all fields in the columns field well",properties:{propertyIdentifier:{type:"object",properties:{objectName:{type:"string"},propertyName:{type:"string"}}},defaultValue:{type:"boolean"}}},columnSubtotalsPerLevel:{type:"object",description:"Indicates if the subtotal data can be toggled for individual fields in the columns field well",properties:{propertyIdentifier:{type:"object",properties:{objectName:{type:"string"},propertyName:{type:"string"}}},defaultValue:{type:"boolean"}}},levelSubtotalEnabled:{type:"object",description:"Unlike all other properites, this property is applied to individual rows/columns. The property indicates if the subtotals are requested for the row/column",properties:{propertyIdentifier:{type:"object",properties:{objectName:{type:"string"},propertyName:{type:"string"}}},defaultValue:{type:"boolean"}}},rowSubtotalsType:{type:"object",description:"Indicates location of row subtotals locations (Top, Bottom). Top means subtotals located at the start of datasource and calculated even before all datasource rows fetched, Bottom means subtotals located at the end of datasource and shown only after all rows are fetched",properties:{propertyIdentifier:{type:"object",properties:{objectName:{type:"string"},propertyName:{type:"string"}}},defaultValue:{type:"string",enum:["Top","Bottom"]}}}},requires:["matrix"]},migration:{type:"object",description:"Defines the supported APIs for migration",properties:{filter:{$ref:"#/definitions/migration.filter"}}},"migration.filter":{type:"object",description:"Defines the capabilities for migrating the filter API",properties:{shouldUseIdentityFilter:{type:"boolean",description:"Indicates whether the new filter should migrate to an identity filter"}}}}},ph={type:"object",properties:{apiVersion:{type:"string",description:"Version of the IVisual API"},author:{type:"object",description:"Information about the author of the visual",properties:{name:{type:"string",description:"Name of the visual author. This is displayed to users."},email:{type:"string",description:"E-mail of the visual author. This is displayed to users for support."}}},assets:{type:"object",description:"Assets used by the visual",properties:{icon:{type:"string",description:"A 20x20 png icon used to represent the visual"}}},externalJS:{type:"array",description:"An array of relative paths to 3rd party javascript libraries to load",items:{type:"string"}},stringResources:{type:"array",description:"An array of relative paths to string resources to load",items:{type:"string"},uniqueItems:!0},style:{type:"string",description:"Relative path to the stylesheet (less) for the visual"},capabilities:{type:"string",description:"Relative path to the visual capabilities json file"},visual:{type:"object",description:"Details about this visual",properties:{description:{type:"string",description:"What does this visual do?"},name:{type:"string",description:"Internal visual name"},displayName:{type:"string",description:"A friendly name"},externals:{type:"array",description:"External files (such as JavaScript) that you would like to include"},guid:{type:"string",description:"Unique identifier for the visual"},visualClassName:{type:"string",description:"Class of your IVisual"},icon:{type:"string",description:"Icon path"},version:{type:"string",description:"Visual version"},gitHubUrl:{type:"string",description:"Url to the github repository for this visual"},supportUrl:{type:"string",description:"Url to the support page for this visual"}}}}},dh={type:"object",properties:{cranPackages:{type:"array",description:"An array of the Cran packages required for the custom R visual script to operate",items:{$ref:"#/definitions/cranPackage"}}},definitions:{cranPackage:{type:"object",description:"cranPackage - Defines the name and displayName of a required Cran package",properties:{name:{type:"string",description:"The name for this Cran package"},displayName:{type:"string",description:"The name for this Cran package that is shown to the user"},url:{type:"string",description:"A url for package documentation in Cran website"}},required:["name","url"],additionalProperties:!1}}},ch={type:"object",properties:{locale:{$ref:"#/definitions/localeOptions"},values:{type:"object",description:"translations for the display name keys in the capabilities",additionalProperties:{type:"string"}}},required:["locale"],definitions:{localeOptions:{description:"Specifies the locale key from a list of supported locales",type:"string",enum:["ar-SA","bg-BG","ca-ES","cs-CZ","da-DK","de-DE","el-GR","en-US","es-ES","et-EE","eu-ES","fi-FI","fr-FR","gl-ES","he-IL","hi-IN","hr-HR","hu-HU","id-ID","it-IT","ja-JP","kk-KZ","ko-KR","lt-LT","lv-LV","ms-MY","nb-NO","nl-NL","pl-PL","pt-BR","pt-PT","ro-RO","ru-RU","sk-SK","sl-SI","sr-Cyrl-RS","sr-Latn-RS","sv-SE","th-TH","tr-TR","uk-UA","vi-VN","zh-CN","zh-TW"]}}};!function(){if(lh)return Vf;lh=1;const t=oh();let e=sh,i=`${t.major(e)}.${t.minor(e)}.0`;Vf.version=i,Vf.schemas={capabilities:uh,pbiviz:ph,dependencies:dh,stringResources:ch}}();const fh={i:"Observation",i_m:"Observation",i_mm:"Observation",c:"Count",t:"Time",xbar:"Group Mean",s:"Group SD",g:"Non-Events",run:"Observation",mr:"Moving Range",p:"Proportion",pp:"Proportion",u:"Rate",up:"Rate"};class hh{update(t){const e=t.chart_type,i=["p","pp"].includes(e),r=t.perc_labels;let a,n=t.multiplier;"Yes"===r&&(n=100),i&&"No"!==r&&(n=1===n?100:n),a="Automatic"===r?i&&100===n:"Yes"===r,this.chart_type_props={name:e,needs_denominator:["p","pp","u","up","xbar","s"].includes(e),denominator_optional:["i","i_m","i_mm","run","mr"].includes(e),numerator_non_negative:["p","pp","u","up","s","c","g","t"].includes(e),numerator_leq_denominator:["p","pp","u","up"].includes(e),has_control_limits:!["run"].includes(e),needs_sd:["xbar"].includes(e),integer_num_den:["c","p","pp"].includes(e),value_name:fh[e],x_axis_use_date:!["g","t"].includes(e),date_name:["g","t"].includes(e)?"Event":"Date"},this.multiplier=n,this.percentLabels=a}}class mh{update(t,e){var i,r,a;this.validationStatus=JSON.parse(JSON.stringify({status:0,messages:new Array,error:""}));const n=Object.keys(this.settings),o=null!==(a=null===(r=null===(i=null==t?void 0:t.categorical)||void 0===i?void 0:i.categories)||void 0===r?void 0:r.some((t=>t.source.roles.indicator)))&&void 0!==a&&a;this.settingsGrouped=new Array,o&&e.forEach((()=>{this.settingsGrouped.push(Object.fromEntries(Object.keys(vr).map((t=>[t,Object.fromEntries(Object.keys(vr[t]).map((e=>[e,vr[t][e]])))]))))}));const l=e.flat();if(n.forEach((i=>{const r=cd(null==t?void 0:t.categorical,i,this.settings,l);0!==r.validation.status&&(this.validationStatus.status=r.validation.status,this.validationStatus.error=r.validation.error),0===this.validationStatus.messages.length?this.validationStatus.messages=r.validation.messages:r.validation.messages.every((t=>0===t.length))||r.validation.messages.forEach(((t,e)=>{t.length>0&&(this.validationStatus.messages[e]=this.validationStatus.messages[e].concat(t))}));Object.keys(this.settings[i]).forEach((t=>{this.settings[i][t]=(null==r?void 0:r.values)?null==r?void 0:r.values[0][t]:vr[i][t].default,o&&e.forEach(((e,a)=>{this.settingsGrouped[a][i][t]=(null==r?void 0:r.values)?null==r?void 0:r.values[e[0]][t]:vr[i][t].default}))}))})),this.settings.nhs_icons.show_variation_icons){["astronomical","shift","trend","two_in_three"].some((t=>this.settings.outliers[t]))||(this.validationStatus.status=1,this.validationStatus.error="Variation icons require at least one outlier pattern to be selected")}this.derivedSettings.update(this.settings.spc),this.derivedSettingsGrouped=new Array,o&&this.settingsGrouped.forEach((t=>{const e=new hh;e.update(t.spc),this.derivedSettingsGrouped.push(e)}))}getFormattingModel(){var t,e;const i={cards:[]};for(const r in yr){let a={description:yr[r].description,displayName:yr[r].displayName,uid:r+"_card_uid",groups:[],revertToDefaultDescriptors:[]};for(const i in yr[r].settingsGroups){let n={displayName:"all"===i?yr[r].displayName:i,uid:r+"_"+i+"_uid",slices:[]};for(const o in yr[r].settingsGroups[i]){a.revertToDefaultDescriptors.push({objectName:r,propertyName:o});let l={uid:r+"_"+i+"_"+o+"_slice_uid",displayName:yr[r].settingsGroups[i][o].displayName,control:{type:yr[r].settingsGroups[i][o].type,properties:{descriptor:{objectName:r,propertyName:o,selector:{data:[{dataViewWildcard:{matchingOption:0}}]},instanceKind:"boolean"!=typeof this.settings[r][o]?3:null},value:this.valueLookup(r,i,o),items:null===(t=yr[r].settingsGroups[i][o])||void 0===t?void 0:t.items,options:null===(e=yr[r].settingsGroups[i][o])||void 0===e?void 0:e.options}}};n.slices.push(l)}a.groups.push(n)}i.cards.push(a)}return i}valueLookup(t,e,i){var r;if(i.includes("colour"))return{value:this.settings[t][i]};if(!br(null===(r=yr[t].settingsGroups[e][i])||void 0===r?void 0:r.items)){const r=yr[t].settingsGroups[e][i].items,a=this.settings[t][i];return r.find((t=>t.value===a))}return this.settings[t][i]}constructor(){this.settings=Object.fromEntries(Object.keys(vr).map((t=>[t,Object.fromEntries(Object.keys(vr[t]).map((e=>[e,vr[t][e]])))]))),this.derivedSettings=new hh}}function yh(t){const e=t.denominators&&t.denominators.length>0,i=e?Fr(t.numerators,t.denominators):t.numerators,r=gd(i,t.subset_points),a=be(r),n=Xp(ud(r)),o=3.267*be(n),l=be(t.outliers_in_limits?n:n.filter((t=>t<o)))/1.128;return{keys:t.keys,values:i.map((t=>isNaN(t)?0:t)),numerators:e?t.numerators:void 0,denominators:e?t.denominators:void 0,targets:pd(a,t.keys.length),ll99:pd(a-3*l,t.keys.length),ll95:pd(a-2*l,t.keys.length),ll68:pd(a-1*l,t.keys.length),ul68:pd(a+1*l,t.keys.length),ul95:pd(a+2*l,t.keys.length),ul99:pd(a+3*l,t.keys.length)}}function gh(t){const e=t.denominators&&t.denominators.length>0,i=e?Fr(t.numerators,t.denominators):t.numerators,r=Ne(gd(i,t.subset_points));return{keys:t.keys,values:i.map((t=>isNaN(t)?0:t)),numerators:e?t.numerators:void 0,denominators:e?t.denominators:void 0,targets:pd(r,t.keys.length)}}var vh=Object.freeze({__proto__:null,c:function(t){const e=be(gd(t.numerators,t.subset_points)),i=Math.sqrt(e);return{keys:t.keys,values:t.numerators,targets:pd(e,t.keys.length),ll99:pd(wd(e-3*i,{lower:0}),t.keys.length),ll95:pd(wd(e-2*i,{lower:0}),t.keys.length),ll68:pd(wd(e-1*i,{lower:0}),t.keys.length),ul68:pd(e+1*i,t.keys.length),ul95:pd(e+2*i,t.keys.length),ul99:pd(e+3*i,t.keys.length)}},g:function(t){const e=be(gd(t.numerators,t.subset_points)),i=Wp(e*(e+1));return{keys:t.keys,values:t.numerators,targets:pd(Ne(gd(t.numerators,t.subset_points)),t.keys.length),ll99:pd(0,t.keys.length),ll95:pd(0,t.keys.length),ll68:pd(0,t.keys.length),ul68:pd(e+1*i,t.keys.length),ul95:pd(e+2*i,t.keys.length),ul99:pd(e+3*i,t.keys.length)}},i:yh,i_m:function(t){const e=t.denominators&&t.denominators.length>0,i=e?Fr(t.numerators,t.denominators):t.numerators,r=gd(i,t.subset_points),a=Ne(r),n=Xp(ud(r)),o=3.267*be(n),l=be(t.outliers_in_limits?n:n.filter((t=>t<o)))/1.128;return{keys:t.keys,values:i.map((t=>isNaN(t)?0:t)),numerators:e?t.numerators:void 0,denominators:e?t.denominators:void 0,targets:pd(a,t.keys.length),ll99:pd(a-3*l,t.keys.length),ll95:pd(a-2*l,t.keys.length),ll68:pd(a-1*l,t.keys.length),ul68:pd(a+1*l,t.keys.length),ul95:pd(a+2*l,t.keys.length),ul99:pd(a+3*l,t.keys.length)}},i_mm:function(t){const e=t.denominators&&t.denominators.length>0,i=e?Fr(t.numerators,t.denominators):t.numerators,r=gd(i,t.subset_points),a=Ne(r),n=Xp(ud(r)),o=3.267*Ne(n),l=Ne(t.outliers_in_limits?n:n.filter((t=>t<o)))/1.128;return{keys:t.keys,values:i.map((t=>isNaN(t)?0:t)),numerators:e?t.numerators:void 0,denominators:e?t.denominators:void 0,targets:pd(a,t.keys.length),ll99:pd(a-3*l,t.keys.length),ll95:pd(a-2*l,t.keys.length),ll68:pd(a-1*l,t.keys.length),ul68:pd(a+1*l,t.keys.length),ul95:pd(a+2*l,t.keys.length),ul99:pd(a+3*l,t.keys.length)}},mr:function(t){const e=t.denominators&&t.denominators.length>0,i=e?Fr(t.numerators,t.denominators):t.numerators,r=Xp(ud(i)),a=be(gd(r,t.subset_points));return{keys:t.keys.slice(1),values:r.slice(1),numerators:e?t.numerators.slice(1):void 0,denominators:e?t.denominators.slice(1):void 0,targets:pd(a,t.keys.length-1),ll99:pd(0,t.keys.length-1),ll95:pd(0,t.keys.length-1),ll68:pd(0,t.keys.length-1),ul68:pd(1.089*a,t.keys.length-1),ul95:pd(2.178*a,t.keys.length-1),ul99:pd(3.267*a,t.keys.length-1)}},p:function(t){const e=xe(gd(t.numerators,t.subset_points))/xe(gd(t.denominators,t.subset_points)),i=Wp(Fr(e*(1-e),t.denominators));return{keys:t.keys,values:Fr(t.numerators,t.denominators),numerators:t.numerators,denominators:t.denominators,targets:pd(e,t.keys.length),ll99:wd(Ar(e,Er(3,i)),{lower:0}),ll95:wd(Ar(e,Er(2,i)),{lower:0}),ll68:wd(Ar(e,Er(1,i)),{lower:0}),ul68:wd(kr(e,Er(1,i)),{upper:1}),ul95:wd(kr(e,Er(2,i)),{upper:1}),ul99:wd(kr(e,Er(3,i)),{upper:1})}},pp:function(t){const e=Fr(t.numerators,t.denominators),i=xe(gd(t.numerators,t.subset_points))/xe(gd(t.denominators,t.subset_points)),r=Wp(Fr(i*(1-i),t.denominators)),a=gd(Fr(Ar(e,i),r),t.subset_points),n=Xp(ud(a)),o=3.267*be(n),l=t.outliers_in_limits?n:n.filter((t=>t<o)),s=Er(r,be(l)/1.128);return{keys:t.keys,values:e,numerators:t.numerators,denominators:t.denominators,targets:pd(i,t.keys.length),ll99:wd(Ar(i,Er(3,s)),{lower:0}),ll95:wd(Ar(i,Er(2,s)),{lower:0}),ll68:wd(Ar(i,Er(1,s)),{lower:0}),ul68:wd(kr(i,Er(1,s)),{upper:1}),ul95:wd(kr(i,Er(2,s)),{upper:1}),ul99:wd(kr(i,Er(3,s)),{upper:1})}},r:gh,run:gh,s:function(t){const e=t.numerators,i=t.denominators,r=Ar(gd(i,t.subset_points),1),a=Wp(xe(Er(r,Sr(gd(e,t.subset_points),2)))/xe(r));return{keys:t.keys,values:e,targets:pd(a,t.keys.length),ll99:Er(a,ld(i,3)),ll95:Er(a,ld(i,2)),ll68:Er(a,ld(i,1)),ul68:Er(a,sd(i,1)),ul95:Er(a,sd(i,2)),ul99:Er(a,sd(i,3))}},t:function(t){const e=Sr(t.numerators,1/3.6),i=JSON.parse(JSON.stringify(t));i.numerators=e,i.denominators=null;const r=yh(i);return r.targets=Sr(r.targets,3.6),r.values=Sr(r.values,3.6),r.ll99=wd(Sr(r.ll99,3.6),{lower:0}),r.ll95=wd(Sr(r.ll95,3.6),{lower:0}),r.ll68=wd(Sr(r.ll68,3.6),{lower:0}),r.ul68=Sr(r.ul68,3.6),r.ul95=Sr(r.ul95,3.6),r.ul99=Sr(r.ul99,3.6),r},u:function(t){const e=xe(gd(t.numerators,t.subset_points))/xe(gd(t.denominators,t.subset_points)),i=Wp(Fr(e,t.denominators));return{keys:t.keys,values:Fr(t.numerators,t.denominators),numerators:t.numerators,denominators:t.denominators,targets:pd(e,t.keys.length),ll99:wd(Ar(e,Er(3,i)),{lower:0}),ll95:wd(Ar(e,Er(2,i)),{lower:0}),ll68:wd(Ar(e,Er(1,i)),{lower:0}),ul68:kr(e,Er(1,i)),ul95:kr(e,Er(2,i)),ul99:kr(e,Er(3,i))}},up:function(t){const e=Fr(t.numerators,t.denominators),i=xe(gd(t.numerators,t.subset_points))/xe(gd(t.denominators,t.subset_points)),r=Wp(Fr(i,t.denominators)),a=gd(Fr(Ar(e,i),r),t.subset_points),n=Xp(ud(a)),o=3.267*be(n),l=t.outliers_in_limits?n:n.filter((t=>t<o)),s=Er(r,be(l)/1.128);return{keys:t.keys,values:e,numerators:t.numerators,denominators:t.denominators,targets:pd(i,t.keys.length),ll99:wd(Ar(i,Er(3,s)),{lower:0}),ll95:wd(Ar(i,Er(2,s)),{lower:0}),ll68:wd(Ar(i,Er(1,s)),{lower:0}),ul68:kr(i,Er(1,s)),ul95:kr(i,Er(2,s)),ul99:kr(i,Er(3,s))}},xbar:function(t){const e=t.denominators,i=gd(e,t.subset_points),r=t.numerators,a=gd(r,t.subset_points),n=gd(t.xbar_sds,t.subset_points),o=Ar(i,1),l=Wp(xe(Er(o,Qp(n)))/xe(o)),s=xe(Er(i,a))/xe(i),u=nd(e);return{keys:t.keys,values:r,targets:pd(s,t.keys.length),ll99:Ar(s,Er(u,l)),ll95:Ar(s,Er(Er(Fr(u,3),2),l)),ll68:Ar(s,Er(Fr(u,3),l)),ul68:kr(s,Er(Fr(u,3),l)),ul95:kr(s,Er(Er(Fr(u,3),2),l)),ul99:kr(s,Er(u,l)),count:e}}});function _h(t,e,i){return t.map(((t,r)=>Nr(t,e[r],i[r])?"none":t>i[r]?"upper":"lower"))}function wh(t,e,i){const r=t.map(((t,i)=>Math.sign(t-e[i]))),a=r.map(((t,e)=>xe(r.slice(Math.max(0,e-(i-1)),e+1)))).map((t=>Xp(t)>=i?t>=i?"upper":"lower":"none"));for(let t=0;t<a.length;t++)if("none"!==a[t])for(let e=t-1;e>=t-(i-1);e--)a[e]=a[t];return a}function bh(t,e){const i=t.map(((e,i)=>0==i?i:Math.sign(e-t[i-1]))),r=i.map(((t,r)=>xe(i.slice(Math.max(0,r-(e-2)),r+1)))).map((t=>Xp(t)>=e-1?t>=e-1?"upper":"lower":"none"));for(let t=0;t<r.length;t++)if("none"!==r[t])for(let i=t-1;i>=t-(e-1);i--)r[i]=r[t];return r}function Nh(t,e,i,r){const a=t.map(((t,r)=>t>i[r]?1:t<e[r]?-1:0)),n=a.map(((t,e)=>xe(a.slice(Math.max(0,e-2),e+1)))).map((t=>Xp(t)>=2?t>=2?"upper":"lower":"none"));for(let t=0;t<n.length;t++)if("none"!==n[t]){for(let e=t-1;e>=t-2;e--)(0!==a[e]||r)&&(n[e]=n[t]);0!==a[t]||r||(n[t]="none")}return n}class xh{constructor(){this.inputData=null,this.inputSettings=new mh,this.controlLimits=null,this.plotPoints=new Array,this.groupedLines=new Array,this.firstRun=!0,this.splitIndexes=new Array,this.colourPalette=null,this.headless=!1,this.frontend=!1}update(t,e){var i,r,a,n,o,l,s,u,p,d,c,f,h,m,y,g,v,_,w;br(this.colourPalette)&&(this.colourPalette={isHighContrast:e.colorPalette.isHighContrast,foregroundColour:e.colorPalette.foreground.value,backgroundColour:e.colorPalette.background.value,foregroundSelectedColour:e.colorPalette.foregroundSelected.value,hyperlinkColour:e.colorPalette.hyperlink.value}),this.svgWidth=t.viewport.width,this.svgHeight=t.viewport.height,this.headless=null!==(i=null==t?void 0:t.headless)&&void 0!==i&&i,this.frontend=null!==(r=null==t?void 0:t.frontend)&&void 0!==r&&r;const b=null===(o=null===(n=null===(a=t.dataViews[0])||void 0===a?void 0:a.categorical)||void 0===n?void 0:n.categories)||void 0===o?void 0:o.filter((t=>t.source.roles.indicator));this.indicatorVarNames=null!==(l=null==b?void 0:b.map((t=>t.source.displayName)))&&void 0!==l?l:[];const N=null==b?void 0:b.length,x=null!==(f=null===(c=null===(d=null===(p=null===(u=null===(s=t.dataViews[0])||void 0===s?void 0:s.categorical)||void 0===u?void 0:u.categories)||void 0===p?void 0:p[0])||void 0===d?void 0:d.values)||void 0===c?void 0:c.length)&&void 0!==f?f:1,S={status:!0},k=new Array;k.push([0]),this.groupNames=new Array,this.groupNames.push(null!==(h=null==b?void 0:b.map((t=>t.values[0])))&&void 0!==h?h:[]);let A=0;for(let t=1;t<x;t++){let e=!0;for(let i=0;i<N;i++)e=e&&(null==b?void 0:b[i].values[t])===(null==b?void 0:b[i].values[t-1]);e?k[A].push(t):(k.push([t]),this.groupNames.push(null!==(m=null==b?void 0:b.map((e=>e.values[t])))&&void 0!==m?m:[]),A+=1)}if((2===t.type||this.firstRun)&&this.inputSettings.update(t.dataViews[0],k),""!==this.inputSettings.validationStatus.error)return S.status=!1,S.error=this.inputSettings.validationStatus.error,S.type="settings",S;const F=function(t,e){var i,r,a,n,o,l,s,u,p,d,c,f,h,m,y;if(br(null==t?void 0:t[0])||0===(null===(o=null===(n=null===(a=null===(r=null===(i=null==t?void 0:t[0])||void 0===i?void 0:i.categorical)||void 0===r?void 0:r.categories)||void 0===a?void 0:a[0])||void 0===n?void 0:n.identity)||void 0===o?void 0:o.length))return"";if(br(null===(s=null===(l=t[0])||void 0===l?void 0:l.categorical)||void 0===s?void 0:s.categories)||br(null===(p=null===(u=t[0])||void 0===u?void 0:u.categorical)||void 0===p?void 0:p.categories.some((t=>{var e,i;return null===(i=null===(e=t.source)||void 0===e?void 0:e.roles)||void 0===i?void 0:i.key}))))return"";const g=null===(c=null===(d=t[0].categorical)||void 0===d?void 0:d.values)||void 0===c?void 0:c.some((t=>{var e,i;return null===(i=null===(e=t.source)||void 0===e?void 0:e.roles)||void 0===i?void 0:i.numerators}));if(!g)return"No Numerators passed!";let v,_,w;if((null==e?void 0:e.derivedSettingsGrouped.length)>0?null==e||e.derivedSettingsGrouped.forEach((t=>{t.chart_type_props.needs_denominator&&(w=t.chart_type_props.name,v=!0),t.chart_type_props.needs_sd&&(w=t.chart_type_props.name,_=!0)})):(w=e.settings.spc.chart_type,v=e.derivedSettings.chart_type_props.needs_denominator,_=e.derivedSettings.chart_type_props.needs_sd),v){const e=null===(h=null===(f=t[0].categorical)||void 0===f?void 0:f.values)||void 0===h?void 0:h.some((t=>{var e,i;return null===(i=null===(e=t.source)||void 0===e?void 0:e.roles)||void 0===i?void 0:i.denominators}));if(!e)return`Chart type '${w}' requires denominators!`}if(_){const e=null===(y=null===(m=t[0].categorical)||void 0===m?void 0:m.values)||void 0===y?void 0:y.some((t=>{var e,i;return null===(i=null===(e=t.source)||void 0===e?void 0:e.roles)||void 0===i?void 0:i.xbar_sds}));if(!e)return`Chart type '${w}' requires SDs!`}return"valid"}(t.dataViews,this.inputSettings);if("valid"!==F)return S.status=!1,S.error=F,S;if(2===t.type||this.firstRun)if(t.dataViews[0].categorical.categories.some((t=>t.source.roles.indicator)))this.showGrouped=!0,this.inputDataGrouped=new Array,this.groupStartEndIndexesGrouped=new Array,this.controlLimitsGrouped=new Array,this.outliersGrouped=new Array,this.identitiesGrouped=new Array,k.forEach(((i,r)=>{const a=yd(t.dataViews[0].categorical,this.inputSettings.settingsGrouped[r],this.inputSettings.derivedSettingsGrouped[r],this.inputSettings.validationStatus.messages,i),n=0!==a.validationStatus.status,o=n?new Array:this.getGroupingIndexes(a),l=n?null:this.calculateLimits(a,o,this.inputSettings.settingsGrouped[r]),s=n?null:this.flagOutliers(l,o,this.inputSettings.settingsGrouped[r],this.inputSettings.derivedSettingsGrouped[r]);n||this.scaleAndTruncateLimits(l,this.inputSettings.settingsGrouped[r],this.inputSettings.derivedSettingsGrouped[r]);const u=i.map((i=>e.createSelectionIdBuilder().withCategory(t.dataViews[0].categorical.categories[0],i).createSelectionId()));this.identitiesGrouped.push(u),this.inputDataGrouped.push(a),this.groupStartEndIndexesGrouped.push(o),this.controlLimitsGrouped.push(l),this.outliersGrouped.push(s)})),this.initialisePlotDataGrouped();else{this.showGrouped=!1,this.groupNames=null,this.inputDataGrouped=null,this.groupStartEndIndexesGrouped=null,this.controlLimitsGrouped=null;const i=null!==(w=null===(_=null===(v=null===(g=null===(y=t.dataViews[0])||void 0===y?void 0:y.metadata)||void 0===g?void 0:g.objects)||void 0===v?void 0:v.split_indexes_storage)||void 0===_?void 0:_.split_indexes)&&void 0!==w?w:"[]",r=JSON.parse(i);this.splitIndexes=r,this.inputData=yd(t.dataViews[0].categorical,this.inputSettings.settings,this.inputSettings.derivedSettings,this.inputSettings.validationStatus.messages,k[0]),0===this.inputData.validationStatus.status&&(this.groupStartEndIndexes=this.getGroupingIndexes(this.inputData,this.splitIndexes),this.controlLimits=this.calculateLimits(this.inputData,this.groupStartEndIndexes,this.inputSettings.settings),this.scaleAndTruncateLimits(this.controlLimits,this.inputSettings.settings,this.inputSettings.derivedSettings),this.outliers=this.flagOutliers(this.controlLimits,this.groupStartEndIndexes,this.inputSettings.settings,this.inputSettings.derivedSettings),this.initialisePlotData(e),this.initialiseGroupedLines())}if(this.firstRun=!1,this.showGrouped){if(this.inputDataGrouped.map((t=>t.validationStatus.status)).some((t=>0!==t)))return S.status=!1,S.error=this.inputDataGrouped.map((t=>t.validationStatus.error)).join("\n"),S;this.inputDataGrouped.some((t=>""!==t.warningMessage))&&(S.warning=this.inputDataGrouped.map((t=>t.warningMessage)).join("\n"))}else{if(0!==this.inputData.validationStatus.status)return S.status=!1,S.error=this.inputData.validationStatus.error,S;""!==this.inputData.warningMessage&&(S.warning=this.inputData.warningMessage)}return S}getGroupingIndexes(t,e){const i=(null!=e?e:[]).concat([-1]).concat(t.groupingIndexes).concat([t.limitInputArgs.keys.length-1]).filter(((t,e,i)=>i.indexOf(t)===e)).sort(((t,e)=>t-e)),r=new Array;for(let t=0;t<i.length-1;t++)r.push([i[t]+1,i[t+1]+1]);return r}calculateLimits(t,e,i){var r;const a=vh[i.spc.chart_type];let n;if(t.limitInputArgs.outliers_in_limits=i.spc.outliers_in_limits,e.length>1){n=e.map((e=>{const i=JSON.parse(JSON.stringify(t));return i.limitInputArgs.denominators=i.limitInputArgs.denominators.slice(e[0],e[1]),i.limitInputArgs.numerators=i.limitInputArgs.numerators.slice(e[0],e[1]),i.limitInputArgs.keys=i.limitInputArgs.keys.slice(e[0],e[1]),i})).map((t=>{const e=a(t.limitInputArgs);return e.trend_line=Td(e.values),e})).reduce(((t,e)=>{const i=t;return Object.entries(t).forEach(((t,r)=>{var a;const n=Object.entries(e)[r][1];i[t[0]]=null===(a=t[1])||void 0===a?void 0:a.concat(n)})),i}))}else n=a(t.limitInputArgs),n.trend_line=Td(n.values);n.alt_targets=t.alt_targets,n.speclimits_lower=t.speclimits_lower,n.speclimits_upper=t.speclimits_upper;for(const t of Object.keys(n))"keys"!==t&&(n[t]=null===(r=n[t])||void 0===r?void 0:r.map((t=>isNaN(t)?null:t)));return n}initialisePlotDataGrouped(){var t,e,i,r,a,n,o,l,s,u,p,d,c,f,h;this.plotPointsGrouped=new Array,this.tableColumnsGrouped=new Array,this.indicatorVarNames.forEach((t=>{this.tableColumnsGrouped.push({name:t,label:t})})),this.tableColumnsGrouped.push({name:"latest_date",label:"Latest Date"});const m=this.inputSettings.settings.lines;m.show_main&&this.tableColumnsGrouped.push({name:"value",label:"Value"}),this.inputSettings.settings.spc.ttip_show_numerator&&this.tableColumnsGrouped.push({name:"numerator",label:"Numerator"}),this.inputSettings.settings.spc.ttip_show_denominator&&this.tableColumnsGrouped.push({name:"denominator",label:"Denominator"}),m.show_target&&this.tableColumnsGrouped.push({name:"target",label:m.ttip_label_target}),m.show_alt_target&&this.tableColumnsGrouped.push({name:"alt_target",label:m.ttip_label_alt_target}),["99","95","68"].forEach((t=>{m[`show_${t}`]&&this.tableColumnsGrouped.push({name:`ucl${t}`,label:`${m[`ttip_label_${t}_prefix_upper`]}${m[`ttip_label_${t}`]}`})})),["68","95","99"].forEach((t=>{m[`show_${t}`]&&this.tableColumnsGrouped.push({name:`lcl${t}`,label:`${m[`ttip_label_${t}_prefix_lower`]}${m[`ttip_label_${t}`]}`})}));const y=this.inputSettings.settings.nhs_icons;y.show_variation_icons&&this.tableColumnsGrouped.push({name:"variation",label:"Variation"}),y.show_assurance_icons&&this.tableColumnsGrouped.push({name:"assurance",label:"Assurance"});const g=this.inputDataGrouped.some((t=>{var e;return null===(e=null==t?void 0:t.tooltips)||void 0===e?void 0:e.some((t=>t.length>0))}));g&&(null===(e=null===(t=this.inputDataGrouped)||void 0===t?void 0:t[0].tooltips)||void 0===e||e[0].forEach((t=>{this.tableColumnsGrouped.push({name:t.displayName,label:t.displayName})})));for(let t=0;t<this.groupNames.length;t++){if(br(null===(i=this.inputDataGrouped[t])||void 0===i?void 0:i.categories))continue;const e=td(this.inputSettings.settingsGrouped[t],this.inputSettings.derivedSettingsGrouped[t]),m=this.inputSettings.settingsGrouped[t].summary_table.table_variation_filter,y=this.inputSettings.settingsGrouped[t].summary_table.table_assurance_filter,v=this.controlLimitsGrouped[t],_=this.outliersGrouped[t],w=v.keys.length-1,b=bd(_,this.inputSettings.settingsGrouped[t]);if("all"!==m){if("improvement"===m&&!["improvementHigh","improvementLow"].includes(b[0]))continue;if("deterioration"===m&&!["concernHigh","concernLow"].includes(b[0]))continue;if("neutral"===m&&!["neutralHigh","neutralLow"].includes(b[0]))continue;if("common"===m&&"commonCause"!==b[0])continue;if("special"===m&&"commonCause"===b[0])continue}const N=wr(v,this.inputSettings.settingsGrouped[t],this.inputSettings.derivedSettingsGrouped[t]);if("all"!==y){if("any"===y&&"inconsistent"===N)continue;if("pass"===y&&"consistentPass"!==N)continue;if("fail"===y&&"consistentFail"!==N)continue;if("inconsistent"===y&&"inconsistent"!==N)continue}const x=new Array;this.indicatorVarNames.forEach(((e,i)=>{x.push([e,this.groupNames[t][i]])})),x.push(["latest_date",null===(r=v.keys)||void 0===r?void 0:r[w].label]),x.push(["value",e(null===(a=v.values)||void 0===a?void 0:a[w],"value")]),x.push(["numerator",e(null===(n=v.numerators)||void 0===n?void 0:n[w],"integer")]),x.push(["denominator",e(null===(o=v.denominators)||void 0===o?void 0:o[w],"integer")]),x.push(["target",e(null===(l=v.targets)||void 0===l?void 0:l[w],"value")]),x.push(["alt_target",e(null===(s=v.alt_targets)||void 0===s?void 0:s[w],"value")]),x.push(["ucl99",e(null===(u=v.ul99)||void 0===u?void 0:u[w],"value")]),x.push(["ucl95",e(null===(p=v.ul95)||void 0===p?void 0:p[w],"value")]),x.push(["ucl68",e(null===(d=v.ul68)||void 0===d?void 0:d[w],"value")]),x.push(["lcl68",e(null===(c=v.ll68)||void 0===c?void 0:c[w],"value")]),x.push(["lcl95",e(null===(f=v.ll95)||void 0===f?void 0:f[w],"value")]),x.push(["lcl99",e(null===(h=v.ll99)||void 0===h?void 0:h[w],"value")]),x.push(["variation",b[0]]),x.push(["assurance",N]),g&&this.inputDataGrouped[t].tooltips[w].forEach((t=>{x.push([t.displayName,t.value])})),this.plotPointsGrouped.push({table_row:Object.fromEntries(x),identity:this.identitiesGrouped[t],aesthetics:this.inputSettings.settingsGrouped[t].summary_table,highlighted:this.inputDataGrouped[t].anyHighlights})}}initialisePlotData(t){var e,i,r,a,n,o,l,s,u,p,d,c,f,h,m,y,g,v,_,w,b,N,x,S;this.plotPoints=new Array,this.tickLabels=new Array,this.tableColumns=new Array,this.tableColumns.push({name:"date",label:"Date"}),this.tableColumns.push({name:"value",label:"Value"}),br(this.controlLimits.numerators)||this.tableColumns.push({name:"numerator",label:"Numerator"}),br(this.controlLimits.denominators)||this.tableColumns.push({name:"denominator",label:"Denominator"}),this.inputSettings.settings.lines.show_target&&this.tableColumns.push({name:"target",label:"Target"}),this.inputSettings.settings.lines.show_alt_target&&this.tableColumns.push({name:"alt_target",label:"Alt. Target"}),this.inputSettings.settings.lines.show_specification&&this.tableColumns.push({name:"speclimits_lower",label:"Spec. Lower"},{name:"speclimits_upper",label:"Spec. Upper"}),this.inputSettings.settings.lines.show_trend&&this.tableColumns.push({name:"trend_line",label:"Trend Line"}),this.inputSettings.derivedSettings.chart_type_props.has_control_limits&&(this.inputSettings.settings.lines.show_99&&this.tableColumns.push({name:"ll99",label:"LL 99%"},{name:"ul99",label:"UL 99%"}),this.inputSettings.settings.lines.show_95&&this.tableColumns.push({name:"ll95",label:"LL 95%"},{name:"ul95",label:"UL 95%"}),this.inputSettings.settings.lines.show_68&&this.tableColumns.push({name:"ll68",label:"LL 68%"},{name:"ul68",label:"UL 68%"})),this.inputSettings.settings.outliers.astronomical&&this.tableColumns.push({name:"astpoint",label:"Ast. Point"}),this.inputSettings.settings.outliers.trend&&this.tableColumns.push({name:"trend",label:"Trend"}),this.inputSettings.settings.outliers.shift&&this.tableColumns.push({name:"shift",label:"Shift"});for(let k=0;k<this.controlLimits.keys.length;k++){const A=this.controlLimits.keys[k].x,F=this.inputData.scatter_formatting[k];this.colourPalette.isHighContrast&&(F.colour=this.colourPalette.foregroundColour),"none"!==this.outliers.shift[k]&&(F.colour=_d(this.outliers.shift[k],"outliers","shift_colour",this.inputSettings.settings),F.colour_outline=_d(this.outliers.shift[k],"outliers","shift_colour",this.inputSettings.settings)),"none"!==this.outliers.trend[k]&&(F.colour=_d(this.outliers.trend[k],"outliers","trend_colour",this.inputSettings.settings),F.colour_outline=_d(this.outliers.trend[k],"outliers","trend_colour",this.inputSettings.settings)),"none"!==this.outliers.two_in_three[k]&&(F.colour=_d(this.outliers.two_in_three[k],"outliers","twointhree_colour",this.inputSettings.settings),F.colour_outline=_d(this.outliers.two_in_three[k],"outliers","twointhree_colour",this.inputSettings.settings)),"none"!==this.outliers.astpoint[k]&&(F.colour=_d(this.outliers.astpoint[k],"outliers","ast_colour",this.inputSettings.settings),F.colour_outline=_d(this.outliers.astpoint[k],"outliers","ast_colour",this.inputSettings.settings));const E={date:this.controlLimits.keys[k].label,numerator:null===(e=this.controlLimits.numerators)||void 0===e?void 0:e[k],denominator:null===(i=this.controlLimits.denominators)||void 0===i?void 0:i[k],value:this.controlLimits.values[k],target:this.controlLimits.targets[k],alt_target:this.controlLimits.alt_targets[k],ll99:null===(a=null===(r=this.controlLimits)||void 0===r?void 0:r.ll99)||void 0===a?void 0:a[k],ll95:null===(o=null===(n=this.controlLimits)||void 0===n?void 0:n.ll95)||void 0===o?void 0:o[k],ll68:null===(s=null===(l=this.controlLimits)||void 0===l?void 0:l.ll68)||void 0===s?void 0:s[k],ul68:null===(p=null===(u=this.controlLimits)||void 0===u?void 0:u.ul68)||void 0===p?void 0:p[k],ul95:null===(c=null===(d=this.controlLimits)||void 0===d?void 0:d.ul95)||void 0===c?void 0:c[k],ul99:null===(h=null===(f=this.controlLimits)||void 0===f?void 0:f.ul99)||void 0===h?void 0:h[k],speclimits_lower:null===(y=null===(m=this.controlLimits)||void 0===m?void 0:m.speclimits_lower)||void 0===y?void 0:y[k],speclimits_upper:null===(v=null===(g=this.controlLimits)||void 0===g?void 0:g.speclimits_upper)||void 0===v?void 0:v[k],trend_line:null===(w=null===(_=this.controlLimits)||void 0===_?void 0:_.trend_line)||void 0===w?void 0:w[k],astpoint:this.outliers.astpoint[k],trend:this.outliers.trend[k],shift:this.outliers.shift[k],two_in_three:this.outliers.two_in_three[k]};this.plotPoints.push({x:A,value:this.controlLimits.values[k],aesthetics:F,table_row:E,identity:t.createSelectionIdBuilder().withCategory(this.inputData.categories,this.inputData.limitInputArgs.keys[k].id).createSelectionId(),highlighted:!br(null===(b=this.inputData.highlights)||void 0===b?void 0:b[A]),tooltip:ed(E,null===(x=null===(N=this.inputData)||void 0===N?void 0:N.tooltips)||void 0===x?void 0:x[A],this.inputSettings.settings,this.inputSettings.derivedSettings),label:{text_value:null===(S=this.inputData.labels)||void 0===S?void 0:S[A],aesthetics:this.inputData.label_formatting[A],angle:null,distance:null,line_offset:null,marker_offset:null}}),this.tickLabels.push({x:A,label:this.controlLimits.keys[k].label})}}initialiseGroupedLines(){const t=new Array;this.inputSettings.settings.lines.show_main&&t.push("values"),this.inputSettings.settings.lines.show_target&&t.push("targets"),this.inputSettings.settings.lines.show_alt_target&&t.push("alt_targets"),this.inputSettings.settings.lines.show_specification&&t.push("speclimits_lower","speclimits_upper"),this.inputSettings.settings.lines.show_trend&&t.push("trend_line"),this.inputSettings.derivedSettings.chart_type_props.has_control_limits&&(this.inputSettings.settings.lines.show_99&&t.push("ll99","ul99"),this.inputSettings.settings.lines.show_95&&t.push("ll95","ul95"),this.inputSettings.settings.lines.show_68&&t.push("ll68","ul68"));const e=new Array,i=this.controlLimits.keys.length;for(let r=0;r<i;r++){const i=this.splitIndexes.includes(r-1)||this.inputData.groupingIndexes.includes(r-1);let a=!1;r>0&&this.inputSettings.settings.lines.show_alt_target&&(a=this.controlLimits.alt_targets[r]!==this.controlLimits.alt_targets[r-1]),t.forEach((t=>{var n,o;const l=this.inputSettings.settings.lines[`join_rebaselines_${vd[t]}`];if(i||a){const o="alt_targets"===t&&a,s="alt_targets"!==t&&i;e.push({x:this.controlLimits.keys[r].x,line_value:l||!o&&!s?null===(n=this.controlLimits[t])||void 0===n?void 0:n[r]:null,group:t})}e.push({x:this.controlLimits.keys[r].x,line_value:null===(o=this.controlLimits[t])||void 0===o?void 0:o[r],group:t})}))}this.groupedLines=function(t,e){const i=new Map;return t.forEach((t=>{var r;const a=t[e];i.has(a)||i.set(a,[]),null===(r=i.get(a))||void 0===r||r.push(t)})),Array.from(i)}(e,"group")}scaleAndTruncateLimits(t,e,i){const r=i.multiplier;let a=["values","targets"];i.chart_type_props.has_control_limits&&(a=a.concat(["ll99","ll95","ll68","ul68","ul95","ul99"]));let n=a;e.lines.show_alt_target&&(n=n.concat(["alt_targets"]),e.lines.multiplier_alt_target&&(a=a.concat(["alt_targets"]))),e.lines.show_specification&&(n=n.concat(["speclimits_lower","speclimits_upper"]),e.lines.multiplier_specification&&(a=a.concat(["speclimits_lower","speclimits_upper"])));const o={lower:e.spc.ll_truncate,upper:e.spc.ul_truncate};a.forEach((e=>{t[e]=Er(t[e],r)})),n.forEach((e=>{t[e]=wd(t[e],o)}))}flagOutliers(t,e,i,r){var a,n,o,l;const s=i.outliers.process_flag_type,u=i.outliers.improvement_direction,p=i.outliers.trend_n,d=i.outliers.shift_n,c="Specification"===i.outliers.astronomical_limit,f="Specification"===i.outliers.two_in_three_limit,h={astpoint:pd("none",t.values.length),two_in_three:pd("none",t.values.length),trend:pd("none",t.values.length),shift:pd("none",t.values.length)};for(let s=0;s<e.length;s++){const u=e[s][0],m=e[s][1],y=t.values.slice(u,m),g=t.targets.slice(u,m);if(r.chart_type_props.has_control_limits||c||f){const e={"1 Sigma":"68","2 Sigma":"95","3 Sigma":"99",Specification:""};if(i.outliers.astronomical){const r=e[i.outliers.astronomical_limit],o=c?"speclimits_upper":"ul";_h(y,null===(a=null==t?void 0:t[`${c?"speclimits_lower":"ll"}${r}`])||void 0===a?void 0:a.slice(u,m),null===(n=null==t?void 0:t[`${o}${r}`])||void 0===n?void 0:n.slice(u,m)).forEach(((t,e)=>h.astpoint[u+e]=t))}if(i.outliers.two_in_three){const r=i.outliers.two_in_three_highlight_series,a=e[i.outliers.two_in_three_limit],n=f?"speclimits_upper":"ul";Nh(y,null===(o=null==t?void 0:t[`${f?"speclimits_lower":"ll"}${a}`])||void 0===o?void 0:o.slice(u,m),null===(l=null==t?void 0:t[`${n}${a}`])||void 0===l?void 0:l.slice(u,m),r).forEach(((t,e)=>h.two_in_three[u+e]=t))}}i.outliers.trend&&bh(y,p).forEach(((t,e)=>h.trend[u+e]=t)),i.outliers.shift&&wh(y,g,d).forEach(((t,e)=>h.shift[u+e]=t))}return Object.keys(h).forEach((t=>{h[t]=id(h[t],{process_flag_type:s,improvement_direction:u})})),h}}return t.Visual=class{constructor(t){this.tableDiv=ut(t.element).append("div").style("overflow","auto"),this.svg=ut(t.element).append("svg"),this.host=t.host,this.viewModel=new xh,this.plotProperties=new tc,this.selectionManager=this.host.createSelectionManager(),this.selectionManager.registerOnSelectCallback((()=>this.updateHighlighting())),this.svg.call(Ud);const e=this.tableDiv.append("table").classed("table-group",!0).style("border-collapse","collapse").style("width","100%").style("height","100%");e.append("thead").append("tr").classed("table-header",!0),e.append("tbody").classed("table-body",!0)}update(t){var e,i,r,a,n;try{this.host.eventService.renderingStarted(t),this.svg.select(".errormessage").remove();const o=this.viewModel.update(t,this.host);if(!o.status)return this.resizeCanvas(t.viewport.width,t.viewport.height),null===(n=null===(a=null===(r=null===(i=null===(e=this.viewModel)||void 0===e?void 0:e.inputSettings)||void 0===i?void 0:i.settings)||void 0===r?void 0:r.canvas)||void 0===a?void 0:a.show_errors)||void 0===n||n?this.svg.call(Gd,t,this.viewModel.colourPalette,null==o?void 0:o.error,null==o?void 0:o.type):this.svg.call(Ud,!0),void this.host.eventService.renderingFailed(t);this.plotProperties.update(t,this.viewModel),o.warning&&this.host.displayWarningIcon("Invalid inputs or settings ignored.\n",o.warning),this.viewModel.showGrouped||this.viewModel.inputSettings.settings.summary_table.show_table?(this.resizeCanvas(0,0),this.tableDiv.call(Zd,this).call(_r,this)):(this.resizeCanvas(t.viewport.width,t.viewport.height),this.drawVisual(),this.adjustPaddingForOverflow()),this.updateHighlighting(),this.host.eventService.renderingFinished(t)}catch(e){this.resizeCanvas(t.viewport.width,t.viewport.height),this.svg.call(Gd,t,this.viewModel.colourPalette,e.message,"internal"),console.error(e),this.host.eventService.renderingFailed(t)}}drawVisual(){this.svg.call(Od,this).call(jd,this).call(Rd,this).call(Vd,this).call(Qd,this).call(Dd,this).call(Id,this).call(_r,this).call(Yd,this).call(Wd,this)}adjustPaddingForOverflow(){if(this.viewModel.headless)return;const t=this.viewModel.svgWidth,e=this.viewModel.svgHeight,i=this.svg.node().getBBox(),r=Math.abs(Math.min(0,i.x)),a=Math.max(0,i.width+i.x-t),n=Math.abs(Math.min(0,i.y)),o=Math.max(0,i.height+i.y-e);r>0&&(this.plotProperties.xAxis.start_padding+=r+this.plotProperties.xAxis.start_padding),a>0&&(this.plotProperties.xAxis.end_padding+=a+this.plotProperties.xAxis.end_padding),n>0&&(this.plotProperties.yAxis.end_padding+=n+this.plotProperties.yAxis.end_padding),o>0&&(this.plotProperties.yAxis.start_padding+=o+this.plotProperties.yAxis.start_padding),(r>0||a>0||n>0||o>0)&&(this.plotProperties.initialiseScale(t,e),this.drawVisual())}resizeCanvas(t,e){this.svg.attr("width",t).attr("height",e),0===t&&0===e?this.tableDiv.style("width","100%").style("height","100%"):this.tableDiv.style("width","0%").style("height","0%")}updateHighlighting(){const t=!!this.viewModel.inputData&&this.viewModel.inputData.anyHighlights,e=!!this.viewModel.inputDataGrouped&&this.viewModel.inputDataGrouped.some((t=>t.anyHighlights)),i=this.selectionManager.getSelectionIds(),r=this.svg.selectAll(".dotsgroup").selectChildren(),a=this.svg.selectAll(".linesgroup").selectChildren(),n=this.tableDiv.selectAll(".table-body").selectChildren();a.style("stroke-opacity",(t=>_d(t[0],"lines","opacity",this.viewModel.inputSettings.settings))),r.style("fill-opacity",(t=>t.aesthetics.opacity)),r.style("stroke-opacity",(t=>t.aesthetics.opacity)),n.style("opacity",(t=>t.aesthetics.table_opacity)),(t||i.length>0||e)&&(a.style("stroke-opacity",(t=>_d(t[0],"lines","opacity_unselected",this.viewModel.inputSettings.settings))),r.nodes().forEach((t=>{const e=ut(t).datum(),i=Ed(e.identity,this.selectionManager),r=e.highlighted,a=i||r?e.aesthetics.opacity_selected:e.aesthetics.opacity_unselected;ut(t).style("fill-opacity",a),ut(t).style("stroke-opacity",a)})),n.nodes().forEach((t=>{const e=ut(t).datum(),i=Ed(e.identity,this.selectionManager),r=e.highlighted,a=i||r?e.aesthetics.table_opacity_selected:e.aesthetics.table_opacity_unselected;ut(t).style("opacity",a)})))}getFormattingModel(){return this.viewModel.inputSettings.getFormattingModel()}},t.d3=or,t.defaultSettings=vr,t}({});
