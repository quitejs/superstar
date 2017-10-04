(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("pages/book/index.coffee", function(exports, require, module) {
var Page,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Page = (function(superClass) {
  extend(Page, superClass);

  function Page() {
    return Page.__super__.constructor.apply(this, arguments);
  }

  Page.prototype.build = function() {
    return P.div().C("booked ok still?");
  };

  return Page;

})(Widget);

module.exports = new Page();

});

require.register("pages/login/index.coffee", function(exports, require, module) {
var Login,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

window.json = JSON;

require('share/quite');

require('share/box');

require('share/under');

Login = (function(superClass) {
  extend(Login, superClass);

  function Login() {
    this.build = bind(this.build, this);
    return Login.__super__.constructor.apply(this, arguments);
  }

  Login.prototype.build = function() {
    return P.div('form-box').C(P.div('header').C('Sign In'), P.div().C(P.form().method('post').C(P.div('body bg-gray').C(P.div('form-group').C(this.username = P.inputBox('form-control').name('username').placeholder('User ID')), P.div('form-group').C(this.password = P.input('form-control').type('password').name('password').placeholder('password')).onkeyup((function(_this) {
      return function(e) {
        if (e.which === 13) {
          return _this.submit.click();
        }
      };
    })(this)))), this.submit = P.button('btn bg-olive btn-block').type('submit').C('Sign me in').onclick((function(_this) {
      return function() {
        var password, username;
        username = _this.username.value();
        password = _this.password.value();
        return _.login(username, password, function(err, out) {
          var origin;
          origin = window.location.href.split("?path=")[1];
          if (err) {
            toastr.error("login failed");
            return;
          }
          if (origin) {
            origin = decodeURIComponent(origin);
            return window.location = origin;
          } else {
            return window.location = "/";
          }
        });
      };
    })(this))), P.div('footer').C(P.p().C(P.a().href('#').C('I forgot my password')), P.a('text-center').href('#').C('Register a new membership')));
  };

  return Login;

})(Block);

window.onload = function() {
  var login;
  login = new Login();
  return document.body.appendChild(login.build().elmt);
};

});

require.register("pages/note/index.coffee", function(exports, require, module) {
var Page,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Page = (function(superClass) {
  extend(Page, superClass);

  function Page() {
    return Page.__super__.constructor.apply(this, arguments);
  }

  Page.prototype.build = function() {
    return P.div().C("note");
  };

  return Page;

})(Widget);

module.exports = new Page();

});

require.register("pages/todo/index.coffee", function(exports, require, module) {
var Page,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Page = (function(superClass) {
  extend(Page, superClass);

  function Page() {
    return Page.__super__.constructor.apply(this, arguments);
  }

  Page.prototype.build = function() {
    return P.div().C("todo");
  };

  return Page;

})(Widget);

module.exports = new Page();

});

require.register("share/box.coffee", function(exports, require, module) {
window.Box = {};

_.extend(Box, {
  env: 'prod',
  dataUrl: 'https://api.rjft.net/api/v2/'
});

});

require.register("share/frame/index.coffee", function(exports, require, module) {
var Page, nav,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

nav = require("./nav");

Page = (function(superClass) {
  extend(Page, superClass);

  function Page() {
    this.update = bind(this.update, this);
    this.build = bind(this.build, this);
    this.attrs("currentPage", "page");
  }

  Page.prototype.build = function() {
    return P.div().id("frame").C(P.div("main-header").C(nav.build()), this.mainWrapper = P.div().id("main-wrapper"));
  };

  Page.prototype.update = function() {
    this.mainWrapper.reC(this._page.build());
    return this._page.render();
  };

  return Page;

})(Widget);

module.exports = new Page();

});

require.register("share/frame/nav.coffee", function(exports, require, module) {
var Page, items,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

items = {
  book: "笔记本",
  note: "笔记",
  todo: "TODO"
};

Page = (function(superClass) {
  extend(Page, superClass);

  function Page() {
    this.build = bind(this.build, this);
    this.attrs("page", "items");
  }

  Page.prototype.build = function() {
    var key, link, toggleButton, value;
    return P.nav('navbar navbar-default').C(P.div('container-fluid').C(P.div('navbar-header').C(toggleButton = P.button('navbar-toggle collapsed').type('button').dataAttr('toggle', 'collapse').dataAttr('target', '#bs-example-navbar-collapse-1').attr('aria-expanded', 'false').C(P.span('sr-only').C('Toggle navigation'), P.span('icon-bar'), P.span('icon-bar'), P.span('icon-bar')), P.a('navbar-brand').href('#').C('社区管理')), this.collapse = P.div('collapse navbar-collapse').id('bs-example-navbar-collapse-1').C(P.ul('nav navbar-nav').C(this.items = (function() {
      var results;
      results = [];
      for (key in items) {
        value = items[key];
        link = "#page?name=" + key;
        results.push(P.li("nav-item").C(P.a().href(link).C(value).onclick(function() {})).onclick(function() {
          $(".nav-item").removeClass("select");
          $(this).addClass("select");
          console.log(toggleButton.attr("aria-expanded"));
          if (toggleButton.attr("aria-expanded") === "true") {
            return toggleButton.click();
          }
        }));
      }
      return results;
    })()), P.form('navbar-form navbar-left').role('search').C(P.div('form-group').C(this.input = P.input('form-control').type('text').placeholder('课程名称 讲师').onkeyup((function(_this) {
      return function(e) {
        if (e.which === 13) {
          if (!_this.input.value()) {
            return;
          }
          window.location = "#profile?id=" + (_this.input.value());
          return window.location.reload();
        }
      };
    })(this))), P.button('btn btn-default').type('submit').C('检索').onclick((function(_this) {
      return function() {
        if (!_this.input.value()) {
          return;
        }
        return window.location = "#profile?id=" + (_this.input.value());
      };
    })(this))), P.ul('nav navbar-nav navbar-right').C(P.li().C(P.a().href('#').C('退出').onclick((function(_this) {
      return function() {
        return localStorage.removeItem("token");
      };
    })(this)))))));
  };

  return Page;

})(Widget);

module.exports = new Page();

});

require.register("share/index.coffee", function(exports, require, module) {
var frame;

window.json = JSON;

require('./quite');

require('./box');

require('./under');

frame = require('./frame');

window.onload = function() {
  document.body.insertBefore(frame.build().elmt, document.body.childNodes[0]);
  Router.frame(frame).index('todo');
  return Router.hash(Hash.init()).change();
};

});

require.register("share/quite/hash.coffee", function(exports, require, module) {
var Hash, HashClass, defaultPartName, nameSpliter, paramSpliter, partSpliter, rewriteParam, valueSpliter,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

partSpliter = "|";

paramSpliter = "&";

nameSpliter = "?";

valueSpliter = "=";

defaultPartName = "page";

rewriteParam = function(hash, paramName, value) {
  var params, partName, ref;
  if (value === void 0) {
    params = paramName;
    if (_.isObject(params)) {
      return params;
    }
    return {};
  }
  params = hash.params();
  if (paramName.indexOf(".") > 0) {
    ref = paramName.split("."), partName = ref[0], paramName = ref[1];
    params[partName][paramName] = value;
  } else {
    if (value instanceof Object) {
      params[paramName] = value;
    } else {
      params[defaultPartName][paramName] = value;
    }
  }
  return params;
};

HashClass = (function(superClass) {
  extend(HashClass, superClass);

  function HashClass() {
    this.set = bind(this.set, this);
    this.stringify = bind(this.stringify, this);
    this.parse = bind(this.parse, this);
    this.attrs("params", "hashStr");
  }

  HashClass.prototype.parse = function() {
    var i, key, len, name, param, params, partParam, partParams, ref, value;
    if (!this._hashStr) {
      if (!window.location.hash) {
        return this;
      }
      this._hashStr = window.location.hash.slice(1);
    }
    partParams = this._hashStr.split(partSpliter);
    partParams = _.compact(partParams);
    this._params = {};
    for (i = 0, len = partParams.length; i < len; i++) {
      partParam = partParams[i];
      ref = partParam.split(nameSpliter), name = ref[0], params = ref[1];
      if (!params) {
        continue;
      }
      params = params.split(paramSpliter);
      params = (function() {
        var j, len1, ref1, results;
        results = [];
        for (j = 0, len1 = params.length; j < len1; j++) {
          param = params[j];
          ref1 = param.split(valueSpliter), key = ref1[0], value = ref1[1];
          if (!value) {
            continue;
          }
          value = _.jsonParse(value);
          results.push([key, value]);
        }
        return results;
      })();
      params = _.object(params);
      this._params[name] = params;
    }
    return this;
  };

  HashClass.prototype.stringify = function() {
    var key, name, param, paramStrs, partStrs, value;
    this._hashStr = "";
    if (!this._params) {
      return;
    }
    partStrs = (function() {
      var ref, results;
      ref = this._params;
      results = [];
      for (name in ref) {
        param = ref[name];
        paramStrs = (function() {
          var results1;
          results1 = [];
          for (key in param) {
            value = param[key];
            results1.push("" + key + valueSpliter + value);
          }
          return results1;
        })();
        paramStrs = paramStrs.join(paramSpliter);
        results.push("" + name + nameSpliter + paramStrs);
      }
      return results;
    }).call(this);
    return this._hashStr = "#" + partStrs.join(partSpliter);
  };

  HashClass.prototype.set = function(paramName, value) {
    if (paramName === void 0) {
      return this.stringify();
    }
    return this.params(rewriteParam(this, paramName, value)).stringify();
  };

  return HashClass;

})(Quite);

Hash = new HashClass();

Hash = _.extend(Hash, {
  page: function(pageName) {
    var param;
    return new HashClass().params(param = {
      page: {
        name: pageName
      }
    });
  },
  init: function() {
    return new HashClass().parse();
  },
  set: function(paramName, value) {
    var hash, params;
    hash = new HashClass().parse();
    params = {};
    if (paramName !== void 0) {
      params = rewriteParam(hash, paramName, value);
    }
    return hash.params(params).stringify();
  }
});

window.Hash = Hash;

});

require.register("share/quite/index.coffee", function(exports, require, module) {
require('./under');

require('./quite');

require('./piece');

require('./widget');

require("./hash");

require("./router");

});

require.register("share/quite/piece/constants.coffee", function(exports, require, module) {
var constants;

module.exports = constants = {
  tags: function() {
    return "doctype, html, head, body, h1, h6, p, ul, ol, dl, a, table, strong, b, div, header, nav, article, footer, aside, section, img, map, area, form, input, !DOCTYPE, a, abbr, acronym, address, applet, area, article, aside, audio, b, base, basefont, bdi, bdo, big, blockquote, body, br, button, canvas, caption, center, cite, code, col, colgroup, command, datalist, dd, del, details, dfn, dir, div, dl, dt, em, embed, fieldset, figcaption, figure, font, footer, form, frame, frameset, h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html, i, iframe, img, input, ins, kbd, keygen, label, legend, li, link, map, mark, menu, meta, meter, nav, noframes, noscript, object, ol, optgroup, option, output, p, param, pre, progress, q, rp, rt, ruby, s, samp, script, section, select, small, source, span, strike, strong, style, sub, summary, sup, table, tbody, td, textarea, tfoot, th, thead, time, title, tr, track, tt, u, ul, var, video, wbr, abbr, object".split(',');
  },
  attrs: function() {
    return "role, accept, accept-charset, accesskey, action, align, alt, async, autocomplete, autofocus, autoplay, bgcolor, border, buffered, challenge, charset, checked, cite, class, code, codebase, color, cols, colspan, content, contenteditable, contextmenu, controls, coords, data, datetime, default, defer, dir, dirname, disabled, download, draggable, dropzone, enctype, for, form, headers, height, hidden, high, href, hreflang, http-equiv, icon, id, ismap, itemprop, keytype, kind, label, lang, language, list, loop, low, manifest, max, maxlength, media, method, min, multiple, name, novalidate, open, optimum, pattern, ping, placeholder, poster, preload, pubdate, radiogroup, readonly, rel, required, reversed, rows, rowspan, sandbox, spellcheck, scope, scoped, seamless, selected, shape, size, sizes, span, src, srcdoc, srclang, start, step, style, summary, tabindex, target, title, type, usemap, value, width, wrap".split(',');
  },
  events: function() {
    return "onabort ,onblur ,onchange ,onclick ,onclose ,oncontextmenu ,ondblclick ,onerror ,onfocus ,oninput ,onkeydown ,onkeypress ,onkeyup ,onload ,onmousedown ,onmousemove ,onmouseout ,onmouseover ,onmouseup ,onscroll ,onselect ,onsubmit".split(',');
  },
  props: function() {
    return "classList ,className ,clientHeight ,clientLeft ,clientTop ,clientWidth ,id ,innerHTML ,outerHTML ,scrollHeight ,scrollLeft ,scrollTop ,scrollWidth ,tagName".split(',');
  },
  nodeProps: function() {
    return "attributes ,baseURI ,baseURIObject ,childNodes ,firstChild ,lastChild ,localName ,namespaceURI ,nextSibling ,nodeName ,nodePrincipal ,nodeType ,nodeValue ,ownerDocument ,parentElement ,parentNode ,prefix ,previousSibling ,textContent".split(',');
  },
  nodeMethods: function() {
    return "appendChild, cloneNode, compareDocumentPosition, contains, getUserData, hasAttributes, hasChildNodes, insertBefore, isDefaultNamespace, isEqualNode, isSameNode, isSupported, lookupNamespaceURI, lookupPrefix, normalize, removeChild, replaceChild, setUserData".split(',');
  },
  elmtMethods: function() {
    return "getAttributeNS, getAttributeNode, getAttributeNodeNS, getBoundingClientRect, undefined, getClientRects, undefined, getElementsByClassName, getElementsByTagName, getElementsByTagNameNS, hasAttribute, hasAttributeNS, insertAdjacentHTML, matches, querySelector, querySelectorAll, removeAttribute, removeAttributeNS, removeAttributeNode, requestFullscreen, requestPointerLock, scrollIntoView, setAttribute, setAttributeNS, setAttributeNode, setAttributeNodeNS, setCapture, supports, getAttribute".split(',');
  },
  htmlElmtMethods: function() {
    return ['blur', 'click', 'focus'];
  }
};

});

require.register("share/quite/piece/index.coffee", function(exports, require, module) {
var Piece, PieceSet, appendHTML, attrs, constants, elmtMethods, events, fn, func, htmlElmtMethods, i, len, methods, nodeMethods, nodeProps, props, ref, tags,
  slice = [].slice;

constants = require('./constants');

attrs = constants.attrs();

events = constants.events();

props = constants.props();

nodeProps = constants.nodeProps();

props = props.concat(nodeProps);

tags = constants.tags();

nodeMethods = constants.nodeMethods();

elmtMethods = constants.elmtMethods();

htmlElmtMethods = constants.htmlElmtMethods();

methods = nodeMethods.concat(elmtMethods);

methods = methods.concat(htmlElmtMethods);

Piece = (function() {
  function Piece(elmt) {
    if (typeof elmt === 'string') {
      this.elmt = document.createElement(elmt);
    } else if (elmt instanceof Element) {
      this.elmt = elmt;
    }
  }

  Piece.prototype.insertNext = function(pieces) {
    var i, len, piece, results;
    if (!(pieces instanceof Array)) {
      pieces = [pieces];
    }
    results = [];
    for (i = 0, len = pieces.length; i < len; i++) {
      piece = pieces[i];
      results.push(this.elmt.parentNode.insertBefore(piece.elmt, this.elmt.nextSibling));
    }
    return results;
  };

  Piece.prototype.insertAt = function(pieces, position) {
    var i, index, len, piece;
    if (!(pieces instanceof Array)) {
      pieces = [pieces];
    }
    for (index = i = 0, len = pieces.length; i < len; index = ++i) {
      piece = pieces[index];
      this.elmt.insertBefore(piece.elmt, this.elmt.children[position + index]);
    }
    return this;
  };

  Piece.prototype.h = function(attr, elmtAttr) {
    attr || (attr = 'D');
    this.elmt.setAttribute('data-holderid', attr);
    if (elmtAttr !== void 0) {
      this.elmt.setAttribute('data-attr', elmtAttr);
    }
    this.addClass('pieceHolder');
    return this;
  };

  Piece.prototype.select = function(selector) {
    var elmt, elmts, name, type;
    type = selector[0];
    name = selector.slice(1);
    elmts = {};
    if (type === '#') {
      elmt = this.elmt.getElementById(name);
      return new Piece(elmt);
    } else if (type === '.') {
      elmts = this.elmt.getElementsByClassName(name);
      return new PieceSet(elmts);
    } else {
      elmts = this.elmt.getElementsByTagName(selector);
      return new PieceSet(elmts);
    }
  };

  Piece.prototype.render = function(data, attrView) {
    var attr, elmt, elmts, holders, i, j, len, len1, piece, ref, results;
    holders = this.select('.pieceHolder');
    elmts = [];
    for (i = 0, len = holders.length; i < len; i++) {
      elmt = holders[i];
      elmts.push(elmt);
    }
    if (this["class"]().indexOf('pieceHolder') >= 0) {
      holders.elmts.push(this);
    }
    results = [];
    for (j = 0, len1 = holders.length; j < len1; j++) {
      piece = holders[j];
      attr = piece.attr('data-holderid');
      attrView = this[attr + "View"];
      if (typeof attrView === "function" ? attrView(this.get(attr)) : void 0) {
        results.push(elmt.innerHTML = (ref = attrView(this.get(attr)).elmt) != null ? ref.outerHTML : void 0);
      } else {
        results.push(elmt.innerText = this.get(attr));
      }
    }
    return results;
  };

  Piece.prototype.attr = function(name, value) {
    if (value === void 0) {
      return this.elmt.getAttribute(name);
    } else {
      this.elmt.setAttribute(name, value);
      return this;
    }
  };

  Piece.prototype.dataAttr = function(name, value) {
    return this.attr("data-" + name, value);
  };

  Piece.prototype.replace = function(piece) {
    var newElmt;
    newElmt = this.elmt.parentNode.insertBefore(piece.elmt, this.elmt);
    this.remove();
    this.elmt = newElmt;
    return this;
  };

  Piece.prototype.hide = function() {
    this._hide = true;
    this.style('display:none');
    return this;
  };

  Piece.prototype.show = function() {
    if (this._hide) {
      this._hide = false;
    }
    this.style('display');
    return this;
  };

  Piece.prototype.addClass = function(name) {
    this["class"](name + " " + (this.className()));
    return this;
  };

  Piece.prototype.removeClass = function(name) {
    this["class"](this["class"]().replace("" + name, ''));
    return this;
  };

  Piece.prototype.toggleClass = function(name) {
    if (this["class"]().indexOf(name) >= 0) {
      return this.removeClass(name);
    } else {
      return this.addClass(name);
    }
  };

  Piece.prototype.remove = function() {
    return this.elmt.parentElement.removeChild(this.elmt);
  };

  Piece.prototype.destroy = function() {
    return this.remove();
  };

  Piece.prototype.insert = function(elmt, position) {
    var children, target;
    if (elmt instanceof Piece) {
      elmt = elmt.elmt;
    }
    children = this.childNodes();
    if (position < 0) {
      position = 0;
    }
    if (position >= children.length) {
      console.log(elmt);
      return this.appendChild(elmt);
    } else {
      target = children[position];
      return this.insertBefore(elmt, target);
    }
  };

  Piece.prototype.move = function(current, targetPosition) {
    if (typeof current === 'number') {
      current = this.children(current);
    }
    return this.insert(current, targetPosition);
  };

  Piece.prototype.del = function(position) {};

  Piece.prototype.C = function() {
    var children;
    children = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (!children) {
      return this.elmt;
    }
    children.forEach((function(_this) {
      return function(child) {
        if (!child) {
          return;
        }
        if (child instanceof Piece) {
          return _this.elmt.appendChild(child.elmt);
        } else if (child instanceof Function) {
          return _this.C(child());
        } else if (child instanceof Array) {
          return _this.C.apply(_this, child);
        } else if (child.piece) {
          return _this.C(child.piece);
        } else {
          return appendHTML(_this.elmt, child.toString());
        }
      };
    })(this));
    return this;
  };

  Piece.prototype.reC = function() {
    var children;
    children = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    this.elmt.innerHTML = '';
    return this.C.apply(this, children);
  };

  return Piece;

})();

appendHTML = function(parent, html) {
  var child, div, i, len, ref, results;
  div = document.createElement('div');
  div.innerHTML = html;
  ref = div.childNodes;
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    child = ref[i];
    results.push(parent.appendChild(child));
  }
  return results;
};

attrs.forEach(function(attr) {
  attr = attr.trim();
  return Piece.prototype[attr] = function(value) {
    if (value !== void 0) {
      if (value instanceof Piece) {
        value = value.elmt;
      }
      if (value instanceof Function) {
        value = value();
      }
      this.elmt.setAttribute(attr, value);
      return this;
    } else {
      return this.elmt.getAttribute(attr);
    }
  };
});

events.forEach(function(event) {
  event = event.trim();
  return Piece.prototype[event] = function(func) {
    if (func) {
      this.elmt[event] = func;
    }
    return this;
  };
});

props.forEach(function(prop) {
  prop = prop.trim();
  return Piece.prototype[prop] = function(value) {
    if (value !== void 0) {
      if (value instanceof Function) {
        value = value();
      }
      this.elmt[prop] = value;
      return this;
    } else {
      return this.elmt[prop];
    }
  };
});

methods.forEach(function(method) {
  method = method.trim();
  return Piece.prototype[method] = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    (ref = this.elmt)[method].apply(ref, args);
    return this;
  };
});

Piece.prototype.value = function(value) {
  if (value !== void 0) {
    this.elmt['value'] = value;
    return this;
  } else {
    return this.elmt['value'];
  }
};

PieceSet = (function() {
  function PieceSet(elmts1) {
    var elmt, i, len, ref;
    this.elmts = elmts1;
    this.set = [];
    ref = this.elmts;
    for (i = 0, len = ref.length; i < len; i++) {
      elmt = ref[i];
      this.set.push(new Piece(elmt));
    }
  }

  PieceSet.prototype.run = function() {
    var args, funName, i, len, piece, ref, results;
    funName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    ref = this.set;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      piece = ref[i];
      results.push(piece[funName].apply(piece, args));
    }
    return results;
  };

  return PieceSet;

})();

ref = Object.keys(Piece.prototype);
fn = function(func) {
  if (Piece.prototype[func] instanceof Function) {
    return PieceSet.prototype[func] = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.run.apply(this, [func].concat(slice.call(args)));
    };
  }
};
for (i = 0, len = ref.length; i < len; i++) {
  func = ref[i];
  fn(func);
}

window.P = function(selector, element) {
  var elmt, elmts, name, type;
  if (element == null) {
    element = document;
  }
  if (selector instanceof Element) {
    return new Piece(selector);
  }
  type = selector[0];
  name = selector.slice(1);
  elmts = {};
  if (type === '#') {
    elmt = element.getElementById(name);
    return new Piece(elmt);
  } else if (type === '.') {
    elmts = element.getElementsByClassName(name);
    return new PieceSet(elmts);
  } else {
    elmts = element.getElementsByTagName(selector);
    return new PieceSet(elmts);
  }
};

tags.forEach(function(tag) {
  tag = tag.trim();
  return P[tag] = function(className) {
    if (className) {
      return new Piece(tag)["class"](className);
    } else {
      return new Piece(tag);
    }
  };
});

P.inputBox = function(className) {
  if (className) {
    return P.input(className).type('text');
  } else {
    return P.input().type('text');
  }
};

});

require.register("share/quite/quite.coffee", function(exports, require, module) {
var Quite,
  slice = [].slice;

window.Quite = Quite = (function() {
  function Quite() {
    this._attrs = [];
  }

  Quite.prototype.attrs = function() {
    var attr, attrs, i, len, results;
    attrs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    this._attrs || (this._attrs = []);
    results = [];
    for (i = 0, len = attrs.length; i < len; i++) {
      attr = attrs[i];
      results.push((function(_this) {
        return function(attr) {
          if (attr instanceof Array) {
            return _this.attrs.apply(_this, attr);
          } else {
            _this._attrs.push(attr);
            return _this[attr] = function() {
              var attrValue;
              attrValue = 1 <= arguments.length ? slice.call(arguments, 0) : [];
              if (attrValue.length === 0) {
                return this["_" + attr];
              } else if (attrValue.length === 1) {
                this["_" + attr] = attrValue[0];
                return this;
              } else {
                this["_" + attr] = attrValue;
                return this;
              }
            };
          }
        };
      })(this)(attr));
    }
    return results;
  };

  return Quite;

})();

});

require.register("share/quite/router.coffee", function(exports, require, module) {

/*
 * 页面间的通讯主要靠url, 也即 window.onhashchange 事件
 *
 * 页面内的操作，要在url上保存状态。直接调用即可，没必要使用事件，url trigger。
 *
 *
 */
var RouterClass, frame,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

frame = require('../frame');

RouterClass = (function(superClass) {
  extend(RouterClass, superClass);

  function RouterClass() {
    this.change = bind(this.change, this);
    this.changeParam = bind(this.changeParam, this);
    this.changeParams = bind(this.changeParams, this);
    this.changePage = bind(this.changePage, this);
    this.attrs('currentHash', 'currentPage', 'hash', 'frame', 'index');
  }

  RouterClass.prototype.changePage = function() {
    var e, error, page;
    this.currentHash(this.hash());
    page = null;
    try {
      page = require("pages/" + (this._hash.params().page.name));
    } catch (error) {
      e = error;
      page = require("pages/" + this._index);
    }
    this.currentPage(page);
    this.frame().page(page).update();
    if (page.onload) {
      page.onload();
    }
    return this.changeParams();
  };

  RouterClass.prototype.changeParams = function() {
    return console.log("change params");
  };

  RouterClass.prototype.changeParam = function() {};

  RouterClass.prototype.change = function() {
    console.log("hash", this.currentHash(), this.hash());
    if (!this.hash()) {
      return;
    }
    if (!this.currentHash()) {
      return this.changePage();
    } else if (this.hash().params().page.name !== this.currentHash().params().page.name) {
      return this.changePage();
    } else {
      return this.changeParams();
    }
  };

  return RouterClass;

})(Quite);

window.Router = new RouterClass();

window.onhashchange = (function(_this) {
  return function() {
    return Router.hash(Hash.init()).change();
  };
})(this);

});

require.register("share/quite/under/common.coffee", function(exports, require, module) {
var Url;

module.exports = {
  jsonParse: function(str) {
    var e, error, parsedStr;
    try {
      parsedStr = JSON.parse(str);
    } catch (error) {
      e = error;
      return str;
    }
    return parsedStr;
  },
  parse: function(str) {
    var e, error;
    try {
      str = JSON.parse(str);
    } catch (error) {
      e = error;
      return str;
    }
    return str;
  },
  isjson: function(str) {
    var e, error;
    try {
      JSON.parse(str);
    } catch (error) {
      e = error;
      return false;
    }
    return true;
  },
  merge: function(subject, guest) {
    return subject;
  },
  stringObject: function(str) {
    var i, item, items, key, len, obj, ref, value;
    obj = {};
    items = str.split('\n');
    for (i = 0, len = items.length; i < len; i++) {
      item = items[i];
      ref = item.split(/\s+/), key = ref[0], value = ref[1];
      obj[key] = value;
    }
    return obj;
  },
  stringArray: function(str) {
    return str.split(/\s+/);
  },
  clearSelection: function() {
    var sel;
    if (document.selection && document.selection.empty) {
      return document.selection.empty();
    } else if (window.getSelection) {
      sel = window.getSelection();
      return sel.removeAllRanges();
    }
  },
  move: function(array, current, targetIndex) {
    if (typeof current !== 'number') {
      current = array.indexOf(current);
    }
    if (targetIndex < 0) {
      targetIndex = 0;
    }
    return array.splice(targetIndex, 0, array.splice(current, 1)[0]);
  },
  insert: function(array, item, position) {
    return array.splice(position, 0, item);
  },
  keycode: function(num) {
    var keycode_dict;
    keycode_dict = require('./constants').keycode_dict;
    return keycode_dict[num];
  },
  url: function(url) {
    return new Url(url);
  },
  ajax: function(url, params, cb) {
    var done, fail;
    params = "params=" + (json.stringify(params));
    done = (function(_this) {
      return function(data, status) {
        if (data.error) {
          console.log(data.error);
        }
        return cb(null, data.result);
      };
    })(this);
    fail = function() {
      return console.log('error');
    };
    return $.ajax({
      method: 'post',
      url: url,
      data: params,
      dataType: 'json',
      success: done,
      error: fail,
      async: false
    });
  },
  keydown: function(character) {
    var evt, init;
    evt = document.createEvent("KeyboardEvent");
    init = evt.initKeyEvent || evt.initKeyboardEvent;
    init("keydown", true, true, window, 0, 0, 0, 0, 0, character.charCodeAt(0));
    return document.body.dispatchEvent(evt);
  }
};

Url = (function() {
  function Url(url1) {
    this.url = url1;
  }

  Url.prototype.get = function(attrName) {
    return $.url(attrName, this.url);
  };

  return Url;

})();

});

require.register("share/quite/under/constants.coffee", function(exports, require, module) {
module.exports = {
  keycode_dict: {
    0: "\\",
    8: "backspace",
    9: "tab",
    12: "num",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    19: "pause",
    20: "caps",
    27: "esc",
    32: "space",
    33: "pageup",
    34: "pagedown",
    35: "end",
    36: "home",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    44: "print",
    45: "insert",
    46: "delete",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    91: "cmd",
    92: "cmd",
    93: "cmd",
    96: "num_0",
    97: "num_1",
    98: "num_2",
    99: "num_3",
    100: "num_4",
    101: "num_5",
    102: "num_6",
    103: "num_7",
    104: "num_8",
    105: "num_9",
    106: "num_multiply",
    107: "num_add",
    108: "num_enter",
    109: "num_subtract",
    110: "num_decimal",
    111: "num_divide",
    124: "print",
    144: "num",
    145: "scroll",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "\'",
    223: "`",
    224: "cmd",
    225: "alt",
    57392: "ctrl",
    63289: "num",
    59: ";"
  }
};

});

require.register("share/quite/under/index.coffee", function(exports, require, module) {
var common;

common = require('./common');

_.extend(_, common);

});

require.register("share/quite/under/test/common.coffee", function(exports, require, module) {
var TestCommon, common;

common = require('../common');

module.exports = TestCommon = (function() {
  function TestCommon() {}

  TestCommon.prototype.move = function() {
    var array;
    array = ['zero', 'one', 'two', 'three'];
    common.move(array, 'one', 2);
    return console.log(array);
  };

  return TestCommon;

})();

});

require.register("share/quite/under/test/test.coffee", function(exports, require, module) {
var i, len, method, methods;

methods = ["Element.getAttributeNS", "Element.getAttributeNode", "Element.getAttributeNodeNS", "Element.getBoundingClientRect", "", "Element.getClientRects", "", "Element.getElementsByClassName", "Element.getElementsByTagName", "Element.getElementsByTagNameNS", "Element.hasAttribute", "Element.hasAttributeNS", "Element.insertAdjacentHTML", "Element.matches", "Element.querySelector", "Element.querySelectorAll", "Element.removeAttribute", "Element.removeAttributeNS", "Element.removeAttributeNode", "Element.requestFullscreen", "Element.requestPointerLock", "Element.scrollIntoView", "Element.setAttribute", "Element.setAttributeNS", "Element.setAttributeNode", "Element.setAttributeNodeNS", "Element.setCapture", "Element.supports", "element.getAttribute", ""];

for (i = 0, len = methods.length; i < len; i++) {
  method = methods[i];
  console.log(method.split('.')[1] + ',');
}

});

;require.register("share/quite/widget/index.coffee", function(exports, require, module) {
var Widget,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

window.Widget = Widget = (function(superClass) {
  extend(Widget, superClass);

  function Widget() {
    Widget.__super__.constructor.apply(this, arguments);
    this.attrs('piece');
    this._members = [];
  }

  Widget.prototype.D = {};

  Widget.prototype.show = function() {
    return this._piece || this.build();
  };

  Widget.prototype.render = function(D) {
    var i, len, member, ref, results;
    this.D = D;
    if (this.D === void 0) {
      this.D = {};
    }
    ref = this._members;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      member = ref[i];
      results.push(member.render(this.D));
    }
    return results;
  };

  Widget.prototype.remove = function() {
    return this.piece.remove();
  };

  Widget.prototype.C = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    (ref = this.piece).C.apply(ref, args);
    return this;
  };

  Widget.prototype.build = function() {
    return P.div('block');
  };

  Widget.prototype.update = function(data) {
    var attr, attrName, attrView, element, elmt, elmts, holders, i, j, len, len1, ref, ref1;
    if (data !== void 0) {
      this.D = data;
    }
    element = this._piece.elmt;
    holders = element.getElementsByClassName('pieceHolder');
    elmts = [];
    for (i = 0, len = holders.length; i < len; i++) {
      elmt = holders[i];
      elmts.push(elmt);
    }
    if (((ref = element.className) != null ? ref.indexOf('pieceHolder') : void 0) !== -1) {
      elmts.push(element);
    }
    for (j = 0, len1 = elmts.length; j < len1; j++) {
      elmt = elmts[j];
      attr = elmt.getAttribute('data-holderid');
      if (attr === 'D') {
        this.render();
      }
      attrView = this[attr + "View"];
      if (typeof attrView === "function" ? attrView(this.D[attr]) : void 0) {
        elmt.innerHTML = (ref1 = attrView(this.D[attr]).elmt) != null ? ref1.outerHTML : void 0;
      } else {
        if (attrName = elmt.getAttribute('data-attr')) {
          elmt.setAttribute(attrName, this.D[attr]);
        } else {
          elmt.innerText = this.D[attr];
        }
      }
    }
    return this;
  };

  return Widget;

})(Quite);

});

require.register("share/under.coffee", function(exports, require, module) {
var fail;

fail = function(jqXHR, textStatus) {
  return console.log('error', jqXHR, textStatus);
};

_.extend(_, {
  formatDate: function(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()) + ' ' + date.getHours() + '点';
  },
  getToken: function() {
    var href, token;
    token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      console.log('not token');
      href = encodeURIComponent(window.location.href);
      console.log({
        href: href
      });
      window.location = "login.html?path=" + href;
    }
  },
  appGet: (function(_this) {
    return function(path, params, cb) {
      var done;
      fail = function(jqXHR, textStatus) {
        console.log('error', jqXHR, textStatus);
        return cb("err");
      };
      done = function(data, status) {
        if (data.error) {
          return console.log('数据请求错误', data.error);
        } else {
          return cb(null, data);
        }
      };
      return $.ajax({
        method: 'get',
        url: "" + Box.appUrl + path,
        data: params,
        success: done,
        headers: {
          'Authorization': "Bearer " + _.getToken()
        },
        error: fail
      });
    };
  })(this),
  get: (function(_this) {
    return function(path, params, cb) {
      var done;
      done = function(data, status) {
        if (data != null ? data.error : void 0) {
          return console.log('数据请求错误', data.error);
        } else {
          return cb(null, data);
        }
      };
      return $.ajax({
        method: 'get',
        url: "" + Box.dataUrl + path,
        data: params,
        success: done,
        headers: {
          'Authorization': "Bearer " + _.getToken()
        },
        error: fail
      });
    };
  })(this),
  "delete": (function(_this) {
    return function(path, params, cb) {
      var done;
      done = function(data, status) {
        if (data != null ? data.error : void 0) {
          console.log('数据请求错误', data.error);
          return cb(new Error("an error"), {});
        } else {
          return cb(null, data);
        }
      };
      return $.ajax({
        method: 'delete',
        url: "" + Box.appUrl + path,
        data: params,
        success: done,
        headers: {
          'Authorization': "Bearer " + _.getToken()
        },
        error: done
      });
    };
  })(this),
  post: (function(_this) {
    return function(path, params, cb) {
      var done, localFail, url;
      localFail = function(jqXHR, textStatus) {
        console.log('error', jqXHR, textStatus);
        return cb(null);
      };
      done = function(data, status) {
        if (data.error) {
          return console.log('数据请求错误', data.error);
        } else {
          return cb(null, data);
        }
      };
      url = path;
      if (path.indexOf('.') < 0) {
        url = "" + Box.dataUrl + path;
      }
      return $.ajax({
        method: 'post',
        url: url,
        data: params,
        success: done,
        headers: {
          'Authorization': "Bearer " + _.getToken()
        },
        error: localFail
      });
    };
  })(this),
  mallGet: (function(_this) {
    return function(path, params, cb) {
      var done;
      done = function(data, status) {
        if (data != null ? data.error : void 0) {
          return console.log('数据请求错误', data.error);
        } else {
          return cb(null, data);
        }
      };
      return $.ajax({
        method: 'get',
        url: "" + Box.mallUrl + path,
        data: params,
        success: done,
        headers: {
          'Authorization': "Bearer " + _.getToken()
        },
        error: fail
      });
    };
  })(this),
  mallPost: (function(_this) {
    return function(path, params, cb) {
      var done, localFail, url;
      localFail = function(jqXHR, textStatus) {
        console.log('error', jqXHR, textStatus);
        return cb(null);
      };
      done = function(data, status) {
        if (data.error) {
          return console.log('数据请求错误', data.error);
        } else {
          return cb(null, data);
        }
      };
      url = "" + Box.mallUrl + path;
      return $.ajax({
        method: 'post',
        url: url,
        data: params,
        success: done,
        headers: {
          'Authorization': "Bearer " + _.getToken()
        },
        error: localFail
      });
    };
  })(this),
  put: (function(_this) {
    return function(path, params, cb) {
      var done;
      params = json.stringify(params);
      done = function(data, status) {
        if (data != null ? data.error : void 0) {
          return console.log('数据请求错误', data.error);
        } else {
          return cb(null, data);
        }
      };
      console.log('box url', Box, Box.dataUrl);
      return $.ajax({
        method: 'put',
        contentType: 'application/json; charset=utf-8',
        url: "" + Box.dataUrl + path,
        data: params,
        dataType: 'json',
        success: done,
        headers: {
          'Authorization': "Bearer " + _.getToken()
        },
        error: fail
      });
    };
  })(this),
  appPost: (function(_this) {
    return function(path, params, cb) {
      var done;
      done = function(data, status) {
        if (data.error) {
          console.log('数据请求错误', data.error);
          return cb(new Error("an error"), {});
        } else {
          return cb(null, data);
        }
      };
      console.log('box url', Box, Box.dataUrl);
      return $.ajax({
        method: 'post',
        url: "" + Box.appUrl + path,
        data: params,
        success: done,
        headers: {
          'Authorization': "Bearer " + _.getToken()
        },
        error: done
      });
    };
  })(this),
  data: (function(_this) {
    return function(path, params, cb) {
      var done, url;
      params = json.stringify(params);
      done = function(data, status) {
        data = json.parse(data);
        if (data.error) {
          return console.log('数据请求错误', data.error);
        } else {
          return cb(null, data.result);
        }
      };
      url = path;
      if (path.indexOf('.') < 0) {
        url = "" + Box.dataUrl + path;
      }
      return $.ajax({
        method: 'post',
        url: url,
        data: params,
        success: done,
        error: fail
      });
    };
  })(this),
  loginPost: (function(_this) {
    return function(url, params, cb) {
      var done, loginFail;
      loginFail = function(jqXHR, textStatus) {
        console.log('error', jqXHR, textStatus);
        return cb(jqXHR);
      };
      done = function(data, status) {
        if (data.error) {
          return console.log('数据请求错误', data.error);
        } else {
          return cb(null, data);
        }
      };
      return $.ajax({
        method: 'post',
        url: url,
        data: params,
        success: done,
        error: loginFail
      });
    };
  })(this),
  login: (function(_this) {
    return function(username, password, cb) {
      var params;
      params = {
        username: username,
        password: password,
        deviceID: "1234212342",
        deviceType: "ios",
        clientVersion: "1.1.2"
      };
      return _.loginPost(Box.authUrl, params, function(err, out) {
        if (err) {
          return cb(err);
        }
        if (out && out.token) {
          localStorage.setItem('token', out.token);
          return cb(null);
        } else {
          return cb(out.body);
        }
      });
    };
  })(this),
  updateActivity: (function(_this) {
    return function(activity, param, cb) {
      var path;
      if (param.is_reject === true) {
        param.weight = -1000;
      } else if (param.is_reject === false) {
        param.weight = 0;
      }
      delete param.is_reject;
      path = "activities/" + activity.id;
      return _.put(path, param, cb);
    };
  })(this),
  updateRoster: (function(_this) {
    return function(userId, userType, isTop, expireTime, cb) {
      if (isTop == null) {
        isTop = false;
      }
      return _.mallPost("userPool/edit.json", {
        userId: userId,
        userType: userType,
        isTop: isTop,
        expireTime: expireTime
      }, cb);
    };
  })(this),
  getPopUsers: (function(_this) {
    return function(params, cb) {
      console.log({
        params: params
      });
      if (["stranger", "global"].indexOf(params.userType) >= 0) {
        params = {
          type: params.userType,
          page: (params.offset / params.limit) + 1,
          pageSize: params.limit
        };
        return _.mallGet("roster/list.json", params, function(err, out) {
          console.log({
            out: out
          });
          return cb(null, out.object.list);
        });
      } else {
        return _.mallGet("userPool/queryList.json", params, function(err, out) {
          return cb(null, out.list);
        });
      }
    };
  })(this),
  getRosters: (function(_this) {
    return function(userType, isTop, cb) {
      var limit, offset, params;
      offset = 0;
      limit = 100;
      params = {
        userType: userType,
        isTop: isTop,
        offset: offset,
        limit: limit
      };
      return _.mallGet("userPool/queryList.json", params, function(err, out) {
        return cb(null, out.list);
      });
    };
  })(this),
  defaultImg: (function(_this) {
    return function(profile) {
      if (!profile) {
        return;
      }
      if (!profile.avatar_url || profile.avatar_url.indexOf("null") > 0) {
        return profile.avatar_url = "http://source.rjfittime.com/1ffda870265211e6a7f7bbfa18ac56c6";
      }
    };
  })(this),
  populateProfiles: (function(_this) {
    return function(ids, cb) {
      var params;
      console.log("populateProfiles", ids);
      params = {
        id: ids
      };
      return _.appGet("v3/list-user", params, function(err, users) {
        return _.appGet("statistics/user/batch", params, function(err, statistics) {
          var img, imgs, index, profile, profiles, statistic, user;
          console.log({
            statistics: statistics
          });
          profiles = (function() {
            var i, len, results;
            results = [];
            for (index = i = 0, len = users.length; i < len; index = ++i) {
              user = users[index];
              profile = user.user;
              imgs = user.activities;
              profile.imgs = [];
              if (imgs != null ? imgs.length : void 0) {
                imgs = (function() {
                  var j, len1, results1;
                  results1 = [];
                  for (j = 0, len1 = imgs.length; j < len1; j++) {
                    img = imgs[j];
                    img.image = [img.image];
                    results1.push(img);
                  }
                  return results1;
                })();
                imgs = _.sortBy(imgs, (function(_this) {
                  return function(img) {
                    return 1 / new Date(img.create_time).valueOf();
                  };
                })(this));
                profile.imgs = imgs;
              }
              statistic = statistics[index];
              statistic.registDay = dateFns.differenceInCalendarDays(new Date(), new Date(profile.create_time), new Date());
              if (profile.imgs.length > 0) {
                statistic.lastPhotoTime = dateFns.differenceInCalendarDays(new Date(), new Date(profile.imgs[0].create_time));
              }
              profile.statistic = statistic;
              results.push(profile);
            }
            return results;
          }).call(_this);
          console.log({
            profiles: profiles
          });
          return cb(null, profiles);
        });
      });
    };
  })(this)
});

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

/* jshint ignore:start */
(function() {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = (window.brunch || {});
  var ar = br['auto-reload'] = (br['auto-reload'] || {});
  if (!WebSocket || ar.disabled) return;

  var cacheBuster = function(url){
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') +'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function(){
      window.location.reload(true);
    },

    stylesheet: function(){
      [].slice
        .call(document.querySelectorAll('link[rel=stylesheet]'))
        .filter(function(link) {
          var val = link.getAttribute('data-autoreload');
          return link.href && val != 'false';
        })
        .forEach(function(link) {
          link.href = cacheBuster(link.href);
        });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function() { document.body.offsetHeight; }, 25);
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function(){
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function(event){
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function(){
      if (connection.readyState) connection.close();
    };
    connection.onclose = function(){
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();
/* jshint ignore:end */
;
//# sourceMappingURL=app.js.map