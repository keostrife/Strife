/*! modernizr 3.2.0 (Custom Build) | MIT *
 * http://modernizr.com/download/?-inputtypes-localstorage-sessionstorage-touchevents !*/
!function(e,t,n){function o(e,t){return typeof e===t}function s(){var e,t,n,s,a,i,r;for(var l in d)if(d.hasOwnProperty(l)){if(e=[],t=d[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(s=o(t.fn,"function")?t.fn():t.fn,a=0;a<e.length;a++)i=e[a],r=i.split("."),1===r.length?Modernizr[r[0]]=s:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=s),c.push((s?"":"no-")+r.join("-"))}}function a(e){var t=u.className,n=Modernizr._config.classPrefix||"";if(p&&(t=t.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(o,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),p?u.className.baseVal=t:u.className=t)}function i(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):p?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function r(){var e=t.body;return e||(e=i(p?"svg":"body"),e.fake=!0),e}function l(e,n,o,s){var a,l,c,d,f="modernizr",p=i("div"),m=r();if(parseInt(o,10))for(;o--;)c=i("div"),c.id=s?s[o]:f+(o+1),p.appendChild(c);return a=i("style"),a.type="text/css",a.id="s"+f,(m.fake?m:p).appendChild(a),m.appendChild(p),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(t.createTextNode(e)),p.id=f,m.fake&&(m.style.background="",m.style.overflow="hidden",d=u.style.overflow,u.style.overflow="hidden",u.appendChild(m)),l=n(p,e),m.fake?(m.parentNode.removeChild(m),u.style.overflow=d,u.offsetHeight):p.parentNode.removeChild(p),!!l}var c=[],d=[],f={_version:"3.2.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){d.push({name:e,fn:t,options:n})},addAsyncTest:function(e){d.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=f,Modernizr=new Modernizr,Modernizr.addTest("sessionstorage",function(){var e="modernizr";try{return sessionStorage.setItem(e,e),sessionStorage.removeItem(e),!0}catch(t){return!1}});var u=t.documentElement,p="svg"===u.nodeName.toLowerCase(),m=f._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];f._prefixes=m;var h=i("input"),v="search tel url email datetime date month week time datetime-local number range color".split(" "),g={};Modernizr.inputtypes=function(e){for(var o,s,a,i=e.length,r=":)",l=0;i>l;l++)h.setAttribute("type",o=e[l]),a="text"!==h.type&&"style"in h,a&&(h.value=r,h.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(o)&&h.style.WebkitAppearance!==n?(u.appendChild(h),s=t.defaultView,a=s.getComputedStyle&&"textfield"!==s.getComputedStyle(h,null).WebkitAppearance&&0!==h.offsetHeight,u.removeChild(h)):/^(search|tel)$/.test(o)||(a=/^(url|email|number)$/.test(o)?h.checkValidity&&h.checkValidity()===!1:h.value!=r)),g[e[l]]=!!a;return g}(v);var y=f.testStyles=l;Modernizr.addTest("touchevents",function(){var n;if("ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch)n=!0;else{var o=["@media (",m.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");y(o,function(e){n=9===e.offsetTop})}return n}),Modernizr.addTest("localstorage",function(){var e="modernizr";try{return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return!1}}),s(),a(c),delete f.addTest,delete f.addAsyncTest;for(var w=0;w<Modernizr._q.length;w++)Modernizr._q[w]();e.Modernizr=Modernizr}(window,document);