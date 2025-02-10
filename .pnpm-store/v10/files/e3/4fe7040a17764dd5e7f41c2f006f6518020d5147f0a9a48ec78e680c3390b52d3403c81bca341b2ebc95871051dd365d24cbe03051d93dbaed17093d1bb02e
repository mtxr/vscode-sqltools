"use strict";

var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _eol = _interopRequireDefault(require("eol"));
var _get = _interopRequireDefault(require("lodash/get"));
var _includes = _interopRequireDefault(require("lodash/includes"));
var _vinyl = _interopRequireDefault(require("vinyl"));
var _through = _interopRequireDefault(require("through2"));
var _parser = _interopRequireDefault(require("./parser"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/* eslint-disable import/no-import-module-exports */

var transform = function transform(parser, customTransform) {
  return function _transform(file, enc, done) {
    var options = parser.options;
    var content = _fs["default"].readFileSync(file.path, enc);
    var extname = _path["default"].extname(file.path);
    if ((0, _includes["default"])((0, _get["default"])(options, 'attr.extensions'), extname)) {
      // Parse attribute (e.g. data-i18n="key")
      parser.parseAttrFromString(content, {
        transformOptions: {
          filepath: file.path
        }
      });
    }
    if ((0, _includes["default"])((0, _get["default"])(options, 'func.extensions'), extname)) {
      // Parse translation function (e.g. i18next.t('key'))
      parser.parseFuncFromString(content, {
        transformOptions: {
          filepath: file.path
        }
      });
    }
    if ((0, _includes["default"])((0, _get["default"])(options, 'trans.extensions'), extname)) {
      // Look for Trans components in JSX
      parser.parseTransFromString(content, {
        transformOptions: {
          filepath: file.path
        }
      });
    }
    if (typeof customTransform === 'function') {
      this.parser = parser;
      customTransform.call(this, file, enc, done);
      return;
    }
    done();
  };
};
var flush = function flush(parser, customFlush) {
  return function _flush(done) {
    var _this = this;
    var options = parser.options;
    if (typeof customFlush === 'function') {
      this.parser = parser;
      customFlush.call(this, done);
      return;
    }

    // Flush to resource store
    var resStore = parser.get({
      sort: options.sort
    });
    var jsonIndent = options.resource.jsonIndent;
    var lineEnding = String(options.resource.lineEnding).toLowerCase();
    Object.keys(resStore).forEach(function (lng) {
      var namespaces = resStore[lng];
      Object.keys(namespaces).forEach(function (ns) {
        var obj = namespaces[ns];
        var resPath = parser.formatResourceSavePath(lng, ns);
        var text = JSON.stringify(obj, null, jsonIndent) + '\n';
        if (lineEnding === 'auto') {
          text = _eol["default"].auto(text);
        } else if (lineEnding === '\r\n' || lineEnding === 'crlf') {
          text = _eol["default"].crlf(text);
        } else if (lineEnding === '\n' || lineEnding === 'lf') {
          text = _eol["default"].lf(text);
        } else if (lineEnding === '\r' || lineEnding === 'cr') {
          text = _eol["default"].cr(text);
        } else {
          // Defaults to LF
          text = _eol["default"].lf(text);
        }
        var contents = null;
        try {
          // "Buffer.from(string[, encoding])" is added in Node.js v5.10.0
          contents = Buffer.from(text);
        } catch (e) {
          // Fallback to "new Buffer(string[, encoding])" which is deprecated since Node.js v6.0.0
          contents = new Buffer(text); // eslint-disable-line no-buffer-constructor
        }
        _this.push(new _vinyl["default"]({
          path: resPath,
          contents: contents
        }));
      });
    });
    done();
  };
};

// @param {object} options The options object.
// @param {function} [customTransform]
// @param {function} [customFlush]
// @return {object} Returns a through2.obj().
var createStream = function createStream(options, customTransform, customFlush) {
  var parser = new _parser["default"](options);
  var stream = _through["default"].obj(transform(parser, customTransform), flush(parser, customFlush));
  return stream;
};

// Convenience API
module.exports = function () {
  var _module$exports;
  return (_module$exports = module.exports).createStream.apply(_module$exports, arguments);
};

// Basic API
module.exports.createStream = createStream;

// Parser
module.exports.Parser = _parser["default"];