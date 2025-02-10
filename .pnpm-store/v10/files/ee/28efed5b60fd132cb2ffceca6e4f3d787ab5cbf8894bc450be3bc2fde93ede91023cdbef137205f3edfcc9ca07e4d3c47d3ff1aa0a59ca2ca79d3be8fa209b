"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));
var _cloneDeep = _interopRequireDefault(require("clone-deep"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// omitEmptyObject({
//   a: {
//     b: {
//       c: 1,
//       d: {
//         e: {
//         }
//       }
//     }
//   }
// });
//
// { a: { b: { c: 1 } } }
//
var _unsetEmptyObject = function unsetEmptyObject(obj) {
  Object.keys(obj).forEach(function (key) {
    if (!(0, _isPlainObject["default"])(obj[key])) {
      return;
    }
    _unsetEmptyObject(obj[key]);
    if ((0, _isPlainObject["default"])(obj[key]) && Object.keys(obj[key]).length === 0) {
      obj[key] = undefined;
      delete obj[key];
    }
  });
  return obj;
};
var omitEmptyObject = function omitEmptyObject(obj) {
  return _unsetEmptyObject((0, _cloneDeep["default"])(obj));
};
var _default = exports["default"] = omitEmptyObject;