"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var acorn = _interopRequireWildcard(require("acorn"));
var _acornJsx = _interopRequireDefault(require("acorn-jsx"));
var _acornStage = _interopRequireDefault(require("acorn-stage3"));
var _chalk = _interopRequireDefault(require("chalk"));
var _cloneDeep = _interopRequireDefault(require("clone-deep"));
var _deepmerge = _interopRequireDefault(require("deepmerge"));
var _ensureType = require("ensure-type");
var _esprimaNext = require("esprima-next");
var _fs = _interopRequireDefault(require("fs"));
var _i18next = _interopRequireDefault(require("i18next"));
var _lodash = _interopRequireDefault(require("lodash"));
var _parse = _interopRequireDefault(require("parse5"));
var _sortobject = _interopRequireDefault(require("sortobject"));
var _acornJsxWalk = _interopRequireDefault(require("./acorn-jsx-walk"));
var _flattenObjectKeys = _interopRequireDefault(require("./flatten-object-keys"));
var _nodesToString = _interopRequireDefault(require("./nodes-to-string"));
var _omitEmptyObject = _interopRequireDefault(require("./omit-empty-object"));
var _excluded = ["replacer", "space"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* eslint no-console: 0 */ /* eslint no-eval: 0 */
var defaults = {
  compatibilityJSON: 'v3',
  // JSON format

  debug: false,
  // verbose logging

  sort: false,
  // sort keys in alphabetical order

  attr: {
    // HTML attributes to parse
    list: ['data-i18n'],
    extensions: ['.html', '.htm']
  },
  func: {
    // function names to parse
    list: ['i18next.t', 'i18n.t'],
    extensions: ['.js', '.jsx']
  },
  trans: {
    // Trans component (https://github.com/i18next/react-i18next)
    component: 'Trans',
    i18nKey: 'i18nKey',
    defaultsKey: 'defaults',
    extensions: ['.js', '.jsx'],
    fallbackKey: false,
    supportBasicHtmlNodes: true,
    // Enables keeping the name of simple nodes (e.g. <br/>) in translations instead of indexed keys.
    keepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    // Which nodes are allowed to be kept in translations during defaultValue generation of <Trans>.
    acorn: {
      ecmaVersion: 2020,
      // defaults to 2020
      sourceType: 'module' // defaults to 'module'
      // Check out https://github.com/acornjs/acorn/tree/master/acorn#interface for additional options
    }
  },
  lngs: ['en'],
  // array of supported languages
  fallbackLng: 'en',
  // language to lookup key if not found while calling `parser.get(key, { lng: '' })`

  ns: [],
  // string or array of namespaces

  defaultLng: 'en',
  // default language used for checking default values

  defaultNs: 'translation',
  // default namespace used if not passed to translation function

  defaultValue: '',
  // default value used if not passed to `parser.set`

  // resource
  resource: {
    // The path where resources get loaded from. Relative to current working directory.
    loadPath: 'i18n/{{lng}}/{{ns}}.json',
    // The path to store resources. Relative to the path specified by `gulp.dest(path)`.
    savePath: 'i18n/{{lng}}/{{ns}}.json',
    // Specify the number of space characters to use as white space to insert into the output JSON string for readability purpose.
    jsonIndent: 2,
    // Normalize line endings to '\r\n', '\r', '\n', or 'auto' for the current operating system. Defaults to '\n'.
    // Aliases: 'CRLF', 'CR', 'LF', 'crlf', 'cr', 'lf'
    lineEnding: '\n'
  },
  keySeparator: '.',
  // char to separate keys
  nsSeparator: ':',
  // char to split namespace from key

  // Context Form
  context: true,
  // whether to add context form key
  contextFallback: true,
  // whether to add a fallback key as well as the context form key
  contextSeparator: '_',
  // char to split context from key
  contextDefaultValues: [],
  // list of values for dynamic values

  // Plural Form
  plural: true,
  // whether to add plural form key
  pluralFallback: true,
  // whether to add a fallback key as well as the plural form key
  pluralSeparator: '_',
  // char to split plural from key

  // interpolation options
  interpolation: {
    prefix: '{{',
    // prefix for interpolation
    suffix: '}}' // suffix for interpolation
  },
  metadata: {},
  // additional custom options
  allowDynamicKeys: false // allow Dynamic Keys
};

// http://codereview.stackexchange.com/questions/45991/balanced-parentheses
var matchBalancedParentheses = function matchBalancedParentheses() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var parentheses = '[]{}()';
  var stack = [];
  var bracePosition;
  var start = -1;
  var i = 0;
  str = '' + str; // ensure string
  for (i = 0; i < str.length; ++i) {
    if (start >= 0 && stack.length === 0) {
      return str.substring(start, i);
    }
    bracePosition = parentheses.indexOf(str[i]);
    if (bracePosition < 0) {
      continue;
    }
    if (bracePosition % 2 === 0) {
      if (start < 0) {
        start = i; // remember the start position
      }
      stack.push(bracePosition + 1); // push next expected brace position
      continue;
    }
    if (stack.pop() !== bracePosition) {
      return str.substring(start, i);
    }
  }
  return str.substring(start, i);
};
var normalizeOptions = function normalizeOptions(options) {
  // Attribute
  if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'attr.list'))) {
    _lodash["default"].set(options, 'attr.list', defaults.attr.list);
  }
  if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'attr.extensions'))) {
    _lodash["default"].set(options, 'attr.extensions', defaults.attr.extensions);
  }

  // Function
  if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'func.list'))) {
    _lodash["default"].set(options, 'func.list', defaults.func.list);
  }
  if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'func.extensions'))) {
    _lodash["default"].set(options, 'func.extensions', defaults.func.extensions);
  }

  // Trans
  if (_lodash["default"].get(options, 'trans')) {
    if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'trans.component'))) {
      _lodash["default"].set(options, 'trans.component', defaults.trans.component);
    }
    if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'trans.i18nKey'))) {
      _lodash["default"].set(options, 'trans.i18nKey', defaults.trans.i18nKey);
    }
    if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'trans.defaultsKey'))) {
      _lodash["default"].set(options, 'trans.defaultsKey', defaults.trans.defaultsKey);
    }
    if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'trans.extensions'))) {
      _lodash["default"].set(options, 'trans.extensions', defaults.trans.extensions);
    }
    if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'trans.fallbackKey'))) {
      _lodash["default"].set(options, 'trans.fallbackKey', defaults.trans.fallbackKey);
    }
    if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'trans.acorn'))) {
      _lodash["default"].set(options, 'trans.acorn', defaults.trans.acorn);
    }
    if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'trans.supportBasicHtmlNodes'))) {
      _lodash["default"].set(options, 'trans.supportBasicHtmlNodes', defaults.trans.supportBasicHtmlNodes);
    }
    if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'trans.keepBasicHtmlNodesFor'))) {
      _lodash["default"].set(options, 'trans.keepBasicHtmlNodesFor', defaults.trans.keepBasicHtmlNodesFor);
    }
  }

  // Resource
  if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'resource.loadPath'))) {
    _lodash["default"].set(options, 'resource.loadPath', defaults.resource.loadPath);
  }
  if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'resource.savePath'))) {
    _lodash["default"].set(options, 'resource.savePath', defaults.resource.savePath);
  }
  if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'resource.jsonIndent'))) {
    _lodash["default"].set(options, 'resource.jsonIndent', defaults.resource.jsonIndent);
  }
  if (_lodash["default"].isUndefined(_lodash["default"].get(options, 'resource.lineEnding'))) {
    _lodash["default"].set(options, 'resource.lineEnding', defaults.resource.lineEnding);
  }

  // Accept both nsseparator or nsSeparator
  if (!_lodash["default"].isUndefined(options.nsseparator)) {
    options.nsSeparator = options.nsseparator;
    delete options.nsseparator;
  }
  // Allowed only string or false
  if (!_lodash["default"].isString(options.nsSeparator)) {
    options.nsSeparator = false;
  }

  // Accept both keyseparator or keySeparator
  if (!_lodash["default"].isUndefined(options.keyseparator)) {
    options.keySeparator = options.keyseparator;
    delete options.keyseparator;
  }
  // Allowed only string or false
  if (!_lodash["default"].isString(options.keySeparator)) {
    options.keySeparator = false;
  }
  if (!_lodash["default"].isArray(options.ns)) {
    options.ns = [options.ns];
  }
  options.ns = _lodash["default"].union(_lodash["default"].flatten(options.ns.concat(options.defaultNs)));
  return options;
};

/**
* Creates a new parser
* @constructor
*/
var Parser = /*#__PURE__*/function () {
  function Parser(options) {
    var _this = this;
    _classCallCheck(this, Parser);
    _defineProperty(this, "options", _objectSpread({}, defaults));
    // The resStore stores all translation keys including unused ones
    _defineProperty(this, "resStore", {});
    // The resScan only stores translation keys parsed from code
    _defineProperty(this, "resScan", {});
    // The all plurals suffixes for each of target languages.
    _defineProperty(this, "pluralSuffixes", {});
    this.options = normalizeOptions(_objectSpread(_objectSpread({}, this.options), options));
    var i18nextInstance = _i18next["default"].createInstance();
    i18nextInstance.init({
      compatibilityJSON: this.options.compatibilityJSON,
      pluralSeparator: this.options.pluralSeparator
    });
    var lngs = this.options.lngs;
    var namespaces = this.options.ns;
    lngs.forEach(function (lng) {
      _this.resStore[lng] = _this.resStore[lng] || {};
      _this.resScan[lng] = _this.resScan[lng] || {};
      _this.pluralSuffixes[lng] = i18nextInstance.services.pluralResolver.getSuffixes(lng);
      if (_this.pluralSuffixes[lng].length === 0) {
        _this.log("No plural rule found for: ".concat(lng));
      }
      namespaces.forEach(function (ns) {
        var resPath = _this.formatResourceLoadPath(lng, ns);
        _this.resStore[lng][ns] = {};
        _this.resScan[lng][ns] = {};
        try {
          if (_fs["default"].existsSync(resPath)) {
            _this.resStore[lng][ns] = JSON.parse(_fs["default"].readFileSync(resPath, 'utf-8'));
          }
        } catch (err) {
          _this.error("Unable to load resource file ".concat(_chalk["default"].yellow(JSON.stringify(resPath)), ": lng=").concat(lng, ", ns=").concat(ns));
          _this.error(err);
        }
      });
    });
    this.log("options=".concat(JSON.stringify(this.options, null, 2)));
  }
  return _createClass(Parser, [{
    key: "log",
    value: function log() {
      var debug = this.options.debug;
      if (debug) {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        console.log.apply(this, [_chalk["default"].cyan('i18next-scanner:')].concat(args));
      }
    }
  }, {
    key: "error",
    value: function error() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      console.error.apply(this, [_chalk["default"].red('i18next-scanner:')].concat(args));
    }
  }, {
    key: "formatResourceLoadPath",
    value: function formatResourceLoadPath(lng, ns) {
      var options = this.options;
      var regex = {
        lng: new RegExp(_lodash["default"].escapeRegExp(options.interpolation.prefix + 'lng' + options.interpolation.suffix), 'g'),
        ns: new RegExp(_lodash["default"].escapeRegExp(options.interpolation.prefix + 'ns' + options.interpolation.suffix), 'g')
      };
      return _lodash["default"].isFunction(options.resource.loadPath) ? options.resource.loadPath(lng, ns) : options.resource.loadPath.replace(regex.lng, lng).replace(regex.ns, ns);
    }
  }, {
    key: "formatResourceSavePath",
    value: function formatResourceSavePath(lng, ns) {
      var options = this.options;
      var regex = {
        lng: new RegExp(_lodash["default"].escapeRegExp(options.interpolation.prefix + 'lng' + options.interpolation.suffix), 'g'),
        ns: new RegExp(_lodash["default"].escapeRegExp(options.interpolation.prefix + 'ns' + options.interpolation.suffix), 'g')
      };
      return _lodash["default"].isFunction(options.resource.savePath) ? options.resource.savePath(lng, ns) : options.resource.savePath.replace(regex.lng, lng).replace(regex.ns, ns);
    }
  }, {
    key: "fixStringAfterRegExpAsArray",
    value: function fixStringAfterRegExpAsArray(strToFix) {
      var _this2 = this;
      var fixedString = _lodash["default"].trim(strToFix);
      var firstChar = fixedString[0];
      var lastChar = fixedString[fixedString.length - 1];
      if (firstChar === '[' && lastChar === ']') {
        return fixedString.substring(1, fixedString.length - 1).split(',').map(function (part) {
          return _this2.fixStringAfterRegExp(part, true);
        });
      }
      return [this.fixStringAfterRegExp(strToFix, true)];
    }
  }, {
    key: "fixStringAfterRegExp",
    value: function fixStringAfterRegExp(strToFix) {
      var options = this.options;
      var fixedString = _lodash["default"].trim(strToFix); // Remove leading and trailing whitespace
      var firstChar = fixedString[0];
      if (firstChar === '`' && fixedString.match(/\${.*?}/)) {
        if (options.allowDynamicKeys && fixedString.endsWith('}`')) {
          // Allow Dyanmic Keys at the end of the string literal with option enabled
          fixedString = fixedString.replace(/\$\{(.+?)\}/g, '');
        } else {
          // Ignore key with embedded expressions in string literals
          return null;
        }
      }
      if (_lodash["default"].includes(['\'', '"', '`'], firstChar)) {
        // Remove first and last character
        fixedString = fixedString.slice(1, -1);
      }

      // restore multiline strings
      fixedString = fixedString.replace(/(\\\n|\\\r\n)/g, '');

      // JavaScript character escape sequences
      // https://mathiasbynens.be/notes/javascript-escapes

      // Single character escape sequences
      // Note: IE < 9 treats '\v' as 'v' instead of a vertical tab ('\x0B'). If cross-browser compatibility is a concern, use \x0B instead of \v.
      // Another thing to note is that the \v and \0 escapes are not allowed in JSON strings.
      fixedString = fixedString.replace(/(\\b|\\f|\\n|\\r|\\t|\\v|\\0|\\\\|\\"|\\')/g, function (match) {
        return eval("\"".concat(match, "\""));
      });

      // * Octal escapes have been deprecated in ES5.
      // * Hexadecimal escape sequences: \\x[a-fA-F0-9]{2}
      // * Unicode escape sequences: \\u[a-fA-F0-9]{4}
      fixedString = fixedString.replace(/(\\x[a-fA-F0-9]{2}|\\u[a-fA-F0-9]{4})/g, function (match) {
        return eval("\"".concat(match, "\""));
      });
      return fixedString;
    }
  }, {
    key: "handleObjectExpression",
    value: function handleObjectExpression(props) {
      var _this3 = this;
      return props.reduce(function (acc, prop) {
        if (prop.type !== 'ObjectMethod') {
          var value = _this3.optionsBuilder(prop.value);
          if (value !== undefined) {
            return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, prop.key.name, value));
          }
        }
        return acc;
      }, {});
    }
  }, {
    key: "handleArrayExpression",
    value: function handleArrayExpression(elements) {
      var _this4 = this;
      return elements.reduce(function (acc, element) {
        return [].concat(_toConsumableArray(acc), [_this4.optionsBuilder(element)]);
      }, []);
    }
  }, {
    key: "optionsBuilder",
    value: function optionsBuilder(prop) {
      if (prop.value && prop.value.type === 'Literal' || prop.type && prop.type === 'Literal') {
        return prop.value.value !== undefined ? prop.value.value : prop.value;
      } else if (prop.value && prop.value.type === 'TemplateLiteral' || prop.type && prop.type === 'TemplateLiteral') {
        return prop.value.quasis.map(function (element) {
          return element.value.cooked;
        }).join('');
      } else if (prop.value && prop.value.type === 'ObjectExpression' || prop.type && prop.type === 'ObjectExpression') {
        return this.handleObjectExpression(prop.value.properties);
      } else if (prop.value && prop.value.type === 'ArrayExpression' || prop.type && prop.type === 'ArrayExpression') {
        return this.handleArrayExpression(prop.elements);
      } else {
        // Unable to get value of the property
        return '';
      }
    }

    // i18next.t('ns:foo.bar') // matched
    // i18next.t("ns:foo.bar") // matched
    // i18next.t('ns:foo.bar') // matched
    // i18next.t("ns:foo.bar", { count: 1 }); // matched
    // i18next.t("ns:foo.bar" + str); // not matched
  }, {
    key: "parseFuncFromString",
    value: function parseFuncFromString(content) {
      var _this5 = this;
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var customHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      if (_lodash["default"].isFunction(opts)) {
        customHandler = opts;
        opts = {};
      }
      var funcs = opts.list !== undefined ? (0, _ensureType.ensureArray)(opts.list) : (0, _ensureType.ensureArray)(this.options.func.list);
      if (funcs.length === 0) {
        return this;
      }
      var matchFuncs = funcs.map(function (func) {
        return '(?:' + _lodash["default"].escapeRegExp(func) + ')';
      }).join('|');
      // `\s` matches a single whitespace character, which includes spaces, tabs, form feeds, line feeds and other unicode spaces.
      var matchSpecialCharacters = '[\\r\\n\\s]*';
      var string =
      // backtick (``)
      '`(?:[^`\\\\]|\\\\(?:.|$))*`' + '|' +
      // double quotes ("")
      '"(?:[^"\\\\]|\\\\(?:.|$))*"' + '|' +
      // single quote ('')
      '\'(?:[^\'\\\\]|\\\\(?:.|$))*\'';
      var stringGroup = matchSpecialCharacters + '(' + string + ')' + matchSpecialCharacters;
      var stringNoGroup = matchSpecialCharacters + '(?:' + string + ')' + matchSpecialCharacters;
      var keys = '(' + stringNoGroup + '|' + '\\[' + stringNoGroup + '(?:[\\,]' + stringNoGroup + ')?' + '\\]' + ')';
      var pattern = '(?:(?:^\\s*)|[^a-zA-Z0-9_])' + '(?:' + matchFuncs + ')' + '\\(' + keys + '(?:[\\,]' + stringGroup + ')?' + '[\\,\\)]';
      var re = new RegExp(pattern, 'gim');
      var r;
      var _loop = function _loop() {
        var options = {};
        var full = r[0];
        var keys = _this5.fixStringAfterRegExpAsArray(r[1]);
        var _iterator = _createForOfIteratorHelper(keys),
          _step;
        try {
          var _loop2 = function _loop2() {
              var key = _step.value;
              if (!key) {
                return 0; // continue
              }
              if (r[2] !== undefined) {
                var defaultValue = _this5.fixStringAfterRegExp(r[2], false);
                if (!defaultValue) {
                  return 0; // continue
                }
                options.defaultValue = defaultValue;
              }
              var endsWithComma = full[full.length - 1] === ',';
              if (endsWithComma) {
                var _opts = _objectSpread({}, opts),
                  propsFilter = _opts.propsFilter;
                var code = matchBalancedParentheses(content.substr(re.lastIndex));
                if (typeof propsFilter === 'function') {
                  code = propsFilter(code);
                }
                try {
                  var syntax = code.trim() !== '' ? (0, _esprimaNext.parse)('(' + code + ')') : {};
                  var props = _lodash["default"].get(syntax, 'body[0].expression.properties') || [];
                  // http://i18next.com/docs/options/
                  var supportedOptions = ['defaultValue', 'defaultValue_plural', 'count', 'context', 'ns', 'keySeparator', 'nsSeparator', 'metadata'];
                  props.forEach(function (prop) {
                    if (_lodash["default"].includes(supportedOptions, prop.key.name)) {
                      options[prop.key.name] = _this5.optionsBuilder(prop);
                    }
                  });
                } catch (err) {
                  _this5.error("Unable to parse code \"".concat(code, "\""));
                  _this5.error(err);
                }
              }
              if (customHandler) {
                customHandler(key, options);
                return 0; // continue
              }
              _this5.set(key, options);
            },
            _ret;
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            _ret = _loop2();
            if (_ret === 0) continue;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };
      while (r = re.exec(content)) {
        _loop();
      }
      return this;
    }

    // Parses translation keys from `Trans` components in JSX
    // <Trans i18nKey="some.key">Default text</Trans>
  }, {
    key: "parseTransFromString",
    value: function parseTransFromString(content) {
      var _this6 = this;
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var customHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      if (_lodash["default"].isFunction(opts)) {
        customHandler = opts;
        opts = {};
      }
      var _opts2 = _objectSpread({}, opts),
        _opts2$transformOptio = _opts2.transformOptions,
        transformOptions = _opts2$transformOptio === void 0 ? {} : _opts2$transformOptio,
        _opts2$component = _opts2.component,
        component = _opts2$component === void 0 ? this.options.trans.component : _opts2$component,
        _opts2$i18nKey = _opts2.i18nKey,
        i18nKey = _opts2$i18nKey === void 0 ? this.options.trans.i18nKey : _opts2$i18nKey,
        _opts2$defaultsKey = _opts2.defaultsKey,
        defaultsKey = _opts2$defaultsKey === void 0 ? this.options.trans.defaultsKey : _opts2$defaultsKey,
        fallbackKey = _opts2.fallbackKey,
        _opts2$acorn = _opts2.acorn,
        acornOptions = _opts2$acorn === void 0 ? this.options.trans.acorn : _opts2$acorn,
        _opts2$supportBasicHt = _opts2.supportBasicHtmlNodes,
        supportBasicHtmlNodes = _opts2$supportBasicHt === void 0 ? this.options.trans.supportBasicHtmlNodes : _opts2$supportBasicHt,
        _opts2$keepBasicHtmlN = _opts2.keepBasicHtmlNodesFor,
        keepBasicHtmlNodesFor = _opts2$keepBasicHtmlN === void 0 ? this.options.trans.keepBasicHtmlNodesFor : _opts2$keepBasicHtmlN;
      var parseJSXElement = function parseJSXElement(node, code) {
        if (!node) {
          return;
        }
        if (component instanceof RegExp ? !node.openingElement.name.name.match(component) : node.openingElement.name.name !== component) {
          return;
        }
        var attr = (0, _ensureType.ensureArray)(node.openingElement.attributes).reduce(function (acc, attribute) {
          if (attribute.type !== 'JSXAttribute' || attribute.name.type !== 'JSXIdentifier' || attribute.value === null) {
            return acc;
          }
          var name = attribute.name.name;
          if (attribute.value.type === 'Literal') {
            acc[name] = attribute.value.value;
          } else if (attribute.value.type === 'JSXExpressionContainer') {
            var expression = attribute.value.expression;

            // Identifier
            if (expression.type === 'Identifier') {
              acc[name] = expression.name;
            }

            // Literal
            if (expression.type === 'Literal') {
              acc[name] = expression.value;
            }

            // Object Expression
            if (expression.type === 'ObjectExpression') {
              var properties = (0, _ensureType.ensureArray)(expression.properties);
              acc[name] = properties.reduce(function (obj, property) {
                if (property.value.type === 'Literal') {
                  obj[property.key.name] = property.value.value;
                } else if (property.value.type === 'TemplateLiteral') {
                  obj[property.key.name] = property.value.quasis.map(function (element) {
                    return element.value.cooked;
                  }).join('');
                } else {
                  // Unable to get value of the property
                  obj[property.key.name] = '';
                }
                return obj;
              }, {});
            }

            // Member Expression (e.g. i18nKey={foo.bar})
            if (expression.type === 'MemberExpression') {
              acc[name] = expression.object.name + '.' + expression.property.name;
            }

            // Conditional Expression (e.g. i18nKey={true ? 'foo' : 'bar'})
            if (expression.type === 'ConditionalExpression') {
              acc[name] = expression.consequent.value;
            }

            // Unary Expression (e.g. i18nKey={foo?.bar})
            if (expression.type === 'UnaryExpression') {
              acc[name] = expression.alternate.object.name + '.' + expression.alternate.property.name;
            }

            // Binary Expression (e.g. i18nKey={foo.bar - 1})
            if (expression.type === 'BinaryExpression') {
              if (expression.left.type === 'MemberExpression' && expression.right.type === 'Literal') {
                acc[name] = expression.left.object.name + '.' + expression.left.property.name;
              }
            }

            // Template Literal
            if (expression.type === 'TemplateLiteral') {
              acc[name] = expression.quasis.map(function (element) {
                return element.value.cooked;
              }).join('');
            }
          }
          return acc;
        }, {});
        var transKey = _lodash["default"].trim(attr[i18nKey]);
        var defaultsString = attr[defaultsKey] || '';
        if (typeof defaultsString !== 'string') {
          _this6.log("defaults value must be a static string, saw ".concat(_chalk["default"].yellow(defaultsString)));
        }

        // https://www.i18next.com/translation-function/essentials#overview-options
        var tOptions = attr.tOptions;
        var options = _objectSpread(_objectSpread({}, tOptions), {}, {
          defaultValue: defaultsString || (0, _nodesToString["default"])(node.children, {
            code: code,
            supportBasicHtmlNodes: supportBasicHtmlNodes,
            keepBasicHtmlNodesFor: keepBasicHtmlNodesFor
          }),
          fallbackKey: fallbackKey || _this6.options.trans.fallbackKey
        });
        if (Object.prototype.hasOwnProperty.call(attr, 'count')) {
          options.count = Number(attr.count) || 0;
        }
        if (Object.prototype.hasOwnProperty.call(attr, 'ns')) {
          if (typeof attr.ns !== 'string') {
            _this6.log("The ns attribute must be a string, saw ".concat(_chalk["default"].yellow(attr.ns)));
          }
          options.ns = attr.ns;
        }
        if (customHandler) {
          customHandler(transKey, options);
          return;
        }
        _this6.set(transKey, options);
      };
      try {
        var ast = acorn.Parser.extend(_acornStage["default"], (0, _acornJsx["default"])()).parse(content, _objectSpread(_objectSpread({}, defaults.trans.acorn), acornOptions));
        (0, _acornJsxWalk["default"])(ast, {
          JSXElement: function JSXElement(node) {
            return parseJSXElement(node, content);
          }
        });
      } catch (err) {
        if (transformOptions.filepath) {
          this.error("Unable to parse ".concat(_chalk["default"].blue(component), " component from ").concat(_chalk["default"].yellow(JSON.stringify(transformOptions.filepath))));
          console.error('    ' + err);
        } else {
          this.error("Unable to parse ".concat(_chalk["default"].blue(component), " component:"));
          console.error(content);
          console.error('    ' + err);
        }
      }
      return this;
    }

    // Parses translation keys from `data-i18n` attribute in HTML
    // <div data-i18n="[attr]ns:foo.bar;[attr]ns:foo.baz">
    // </div>
  }, {
    key: "parseAttrFromString",
    value: function parseAttrFromString(content) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var customHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var setter = this.set.bind(this);
      if (_lodash["default"].isFunction(opts)) {
        setter = opts;
        opts = {};
      } else if (_lodash["default"].isFunction(customHandler)) {
        setter = customHandler;
      }
      var attrs = opts.list !== undefined ? (0, _ensureType.ensureArray)(opts.list) : (0, _ensureType.ensureArray)(this.options.attr.list);
      if (attrs.length === 0) {
        return this;
      }
      var ast = _parse["default"].parse(content);
      var parseAttributeValue = function parseAttributeValue(key) {
        key = _lodash["default"].trim(key);
        if (key.length === 0) {
          return;
        }
        if (key.indexOf('[') === 0) {
          var parts = key.split(']');
          key = parts[1];
        }
        if (key.indexOf(';') === key.length - 1) {
          key = key.substr(0, key.length - 2);
        }
        setter(key);
      };
      var _walk = function walk(nodes) {
        nodes.forEach(function (node) {
          if (node.attrs) {
            node.attrs.forEach(function (attr) {
              if (attrs.indexOf(attr.name) !== -1) {
                var values = attr.value.split(';');
                values.forEach(parseAttributeValue);
              }
            });
          }
          if (node.childNodes) {
            _walk(node.childNodes);
          }
          if (node.content && node.content.childNodes) {
            _walk(node.content.childNodes);
          }
        });
      };
      _walk(ast.childNodes);
      return this;
    }

    // Get the value of a translation key or the whole resource store containing translation information
    // @param {string} [key] The translation key
    // @param {object} [opts] The opts object
    // @param {boolean} [opts.sort] True to sort object by key
    // @param {boolean} [opts.lng] The language to use
    // @return {object}
  }, {
    key: "get",
    value: function get(key) {
      var _this7 = this;
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (_lodash["default"].isPlainObject(key)) {
        opts = key;
        key = undefined;
      }
      var resStore = {};
      if (!!this.options.removeUnusedKeys) {
        // Merge two objects `resStore` and `resScan` deeply, returning a new merged object with the elements from both `resStore` and `resScan`.
        var overwriteMerge = function overwriteMerge(destinationArray, sourceArray, options) {
          return sourceArray;
        };
        var resMerged = (0, _deepmerge["default"])(this.resStore, this.resScan, {
          arrayMerge: overwriteMerge
        });
        Object.keys(this.resStore).forEach(function (lng) {
          Object.keys(_this7.resStore[lng]).forEach(function (ns) {
            var resStoreKeys = (0, _flattenObjectKeys["default"])(_lodash["default"].get(_this7.resStore, [lng, ns], {}));
            var resScanKeys = (0, _flattenObjectKeys["default"])(_lodash["default"].get(_this7.resScan, [lng, ns], {}));
            var unusedKeys = _lodash["default"].differenceWith(resStoreKeys, resScanKeys, _lodash["default"].isEqual);
            for (var i = 0; i < unusedKeys.length; ++i) {
              var unusedKey = unusedKeys[i];
              var isRemovable = typeof _this7.options.removeUnusedKeys === 'function' ? _this7.options.removeUnusedKeys(lng, ns, unusedKey) : !!_this7.options.removeUnusedKeys;
              if (isRemovable) {
                _lodash["default"].unset(resMerged[lng][ns], unusedKey);
                _this7.log("Removed an unused translation key { ".concat(_chalk["default"].red(JSON.stringify(unusedKey)), " } from ").concat(_chalk["default"].red(JSON.stringify(_this7.formatResourceLoadPath(lng, ns)))));
              }
            }

            // Omit empty object
            resMerged[lng][ns] = (0, _omitEmptyObject["default"])(resMerged[lng][ns]);
          });
        });
        resStore = resMerged;
      } else {
        resStore = (0, _cloneDeep["default"])(this.resStore);
      }
      if (opts.sort) {
        Object.keys(resStore).forEach(function (lng) {
          var namespaces = resStore[lng];
          Object.keys(namespaces).forEach(function (ns) {
            // Deeply sort an object by its keys without mangling any arrays inside of it
            resStore[lng][ns] = (0, _sortobject["default"])(namespaces[ns]);
          });
        });
      }
      if (!_lodash["default"].isUndefined(key)) {
        var ns = this.options.defaultNs;

        // http://i18next.com/translate/keyBasedFallback/
        // Set nsSeparator and keySeparator to false if you prefer
        // having keys as the fallback for translation.
        // i18next.init({
        //   nsSeparator: false,
        //   keySeparator: false
        // })

        if (_lodash["default"].isString(this.options.nsSeparator) && key.indexOf(this.options.nsSeparator) > -1) {
          var parts = key.split(this.options.nsSeparator);
          ns = parts[0];
          key = parts[1];
        }
        var keys = _lodash["default"].isString(this.options.keySeparator) ? key.split(this.options.keySeparator) : [key];
        var lng = opts.lng ? opts.lng : this.options.fallbackLng;
        var namespaces = resStore[lng] || {};
        var value = namespaces[ns];
        var x = 0;
        while (keys[x]) {
          value = value && value[keys[x]];
          x++;
        }
        return value;
      }
      return resStore;
    }

    // Set translation key with an optional defaultValue to i18n resource store
    // @param {string} key The translation key
    // @param {object} [options] The options object
    // @param {boolean|function} [options.fallbackKey] When the key is missing, pass `true` to return `options.defaultValue` as key, or pass a function to return user-defined key.
    // @param {string} [options.defaultValue] defaultValue to return if translation not found
    // @param {number} [options.count] count value used for plurals
    // @param {string} [options.context] used for contexts (eg. male)
    // @param {string} [options.ns] namespace for the translation
    // @param {string|boolean} [options.nsSeparator] The value used to override this.options.nsSeparator
    // @param {string|boolean} [options.keySeparator] The value used to override this.options.keySeparator
  }, {
    key: "set",
    value: function set(key) {
      var _this8 = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // Backward compatibility
      if (_lodash["default"].isString(options)) {
        var _defaultValue = options;
        options = {
          defaultValue: _defaultValue
        };
      }
      var nsSeparator = options.nsSeparator !== undefined ? options.nsSeparator : this.options.nsSeparator;
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
      var ns = options.ns || this.options.defaultNs;
      console.assert(_lodash["default"].isString(ns) && !!ns.length, 'ns is not a valid string', ns);

      // http://i18next.com/translate/keyBasedFallback/
      // Set nsSeparator and keySeparator to false if you prefer
      // having keys as the fallback for translation.
      // i18next.init({
      //   nsSeparator: false,
      //   keySeparator: false
      // })

      if (_lodash["default"].isString(nsSeparator) && key.indexOf(nsSeparator) > -1) {
        var parts = key.split(nsSeparator);
        ns = parts[0];
        key = parts[1];
      }
      var keys = [];
      if (key) {
        keys = _lodash["default"].isString(keySeparator) ? key.split(keySeparator) : [key];
      } else {
        // fallback key
        if (options.fallbackKey === true) {
          key = options.defaultValue;
        }
        if (typeof options.fallbackKey === 'function') {
          key = options.fallbackKey(ns, options.defaultValue);
        }
        if (!key) {
          // Ignore empty key
          return;
        }
        keys = [key];
      }
      var _this$options = this.options,
        lngs = _this$options.lngs,
        context = _this$options.context,
        contextFallback = _this$options.contextFallback,
        contextSeparator = _this$options.contextSeparator,
        contextDefaultValues = _this$options.contextDefaultValues,
        plural = _this$options.plural,
        pluralFallback = _this$options.pluralFallback,
        pluralSeparator = _this$options.pluralSeparator,
        defaultLng = _this$options.defaultLng,
        defaultValue = _this$options.defaultValue;
      lngs.forEach(function (lng) {
        var resLoad = _this8.resStore[lng] && _this8.resStore[lng][ns];
        var resScan = _this8.resScan[lng] && _this8.resScan[lng][ns];
        if (!_lodash["default"].isPlainObject(resLoad)) {
          // Skip undefined namespace
          _this8.error("".concat(_chalk["default"].yellow(JSON.stringify(ns)), " does not exist in the namespaces (").concat(_chalk["default"].yellow(JSON.stringify(_this8.options.ns)), "): key=").concat(_chalk["default"].yellow(JSON.stringify(key)), ", options=").concat(_chalk["default"].yellow(JSON.stringify(options))));
          return;
        }
        Object.keys(keys).forEach(function (index) {
          var key = keys[index];
          if (index < keys.length - 1) {
            resLoad[key] = resLoad[key] || {};
            resLoad = resLoad[key];
            resScan[key] = resScan[key] || {};
            resScan = resScan[key];
            return; // continue
          }

          // Context & Plural
          // http://i18next.com/translate/context/
          // http://i18next.com/translate/pluralSimple/
          //
          // Format:
          // "<key>[[{{contextSeparator}}<context>]{{pluralSeparator}}<plural>]"
          //
          // Example:
          // {
          //   "translation": {
          //     "friend": "A friend",
          //     "friend_male": "A boyfriend",
          //     "friend_female": "A girlfriend",
          //     "friend_male_plural": "{{count}} boyfriends",
          //     "friend_female_plural": "{{count}} girlfriends"
          //   }
          // }
          var resKeys = [];

          // http://i18next.com/translate/context/
          var containsContext = function () {
            if (!context) {
              return false;
            }
            if (_lodash["default"].isUndefined(options.context)) {
              return false;
            }
            return _lodash["default"].isFunction(context) ? context(lng, ns, key, options) : !!context;
          }();

          // http://i18next.com/translate/pluralSimple/
          var containsPlural = function () {
            if (!plural) {
              return false;
            }
            if (_lodash["default"].isUndefined(options.count)) {
              return false;
            }
            return _lodash["default"].isFunction(plural) ? plural(lng, ns, key, options) : !!plural;
          }();
          var contextValues = function () {
            if (options.context !== '') {
              return [options.context];
            }
            if ((0, _ensureType.ensureArray)(contextDefaultValues).length > 0) {
              return (0, _ensureType.ensureArray)(contextDefaultValues);
            }
            return [];
          }();
          if (containsPlural) {
            var suffixes = pluralFallback ? _this8.pluralSuffixes[lng] : _this8.pluralSuffixes[lng].slice(1);
            suffixes.forEach(function (pluralSuffix) {
              resKeys.push("".concat(key).concat(pluralSuffix));
            });
            if (containsContext && containsPlural) {
              suffixes.forEach(function (pluralSuffix) {
                contextValues.forEach(function (contextValue) {
                  resKeys.push("".concat(key).concat(contextSeparator).concat(contextValue).concat(pluralSuffix));
                });
              });
            }
          } else {
            if (!containsContext || containsContext && contextFallback) {
              resKeys.push(key);
            }
            if (containsContext) {
              contextValues.forEach(function (contextValue) {
                resKeys.push("".concat(key).concat(contextSeparator).concat(contextValue));
              });
            }
          }
          resKeys.forEach(function (resKey) {
            if (resLoad[resKey] === undefined) {
              if (options.defaultValue_plural !== undefined && resKey.endsWith("".concat(pluralSeparator, "plural"))) {
                resLoad[resKey] = options.defaultValue_plural;
              } else {
                // Fallback to `defaultValue`
                resLoad[resKey] = _lodash["default"].isFunction(defaultValue) ? defaultValue(lng, ns, key, options) : options.defaultValue || defaultValue;
              }
              if (resLoad[resKey] !== undefined) {
                _this8.log("Added a new translation key { ".concat(_chalk["default"].yellow(JSON.stringify(resKey)), ": ").concat(_chalk["default"].yellow(JSON.stringify(resLoad[resKey])), " } to ").concat(_chalk["default"].yellow(JSON.stringify(_this8.formatResourceLoadPath(lng, ns)))));
              }
            } else if (options.defaultValue && (!options.defaultValue_plural || !resKey.endsWith("".concat(pluralSeparator, "plural")))) {
              var value = _lodash["default"].isFunction(defaultValue) ? defaultValue(lng, ns, key, options) : options.defaultValue || defaultValue; // Use `options.defaultValue` if specified

              if (!resLoad[resKey]) {
                resLoad[resKey] = value;
              } else if (resLoad[resKey] !== value && lng === defaultLng) {
                // A default value has provided but it's different with the expected default
                _this8.log("The translation key ".concat(_chalk["default"].yellow(JSON.stringify(resKey)), ", with a default value of \"").concat(_chalk["default"].yellow(options.defaultValue), "\" has a different default value, you may need to check the translation key of default language (").concat(defaultLng, ")"));
              }
            } else if (options.defaultValue_plural && resKey.endsWith("".concat(pluralSeparator, "plural"))) {
              if (!resLoad[resKey]) {
                resLoad[resKey] = options.defaultValue_plural;
              } else if (resLoad[resKey] !== options.defaultValue_plural && lng === defaultLng) {
                // A default value has provided but it's different with the expected default
                _this8.log("The translation key ".concat(_chalk["default"].yellow(JSON.stringify(resKey)), ", with a default value of \"").concat(_chalk["default"].yellow(options.defaultValue_plural), "\" has a different default value, you may need to check the translation key of default language (").concat(defaultLng, ")"));
              }
            }
            resScan[resKey] = resLoad[resKey];
          });
        });
      });
    }

    // Returns a JSON string containing translation information
    // @param {object} [options] The options object
    // @param {boolean} [options.sort] True to sort object by key
    // @param {function|string[]|number[]} [options.replacer] The same as the JSON.stringify()
    // @param {string|number} [options.space] The same as the JSON.stringify() method
    // @return {string}
  }, {
    key: "toJSON",
    value: function toJSON() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var replacer = options.replacer,
        space = options.space,
        others = _objectWithoutProperties(options, _excluded);
      return JSON.stringify(this.get(others), replacer, space);
    }
  }]);
}();
var _default = exports["default"] = Parser;