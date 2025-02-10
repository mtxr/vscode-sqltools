"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// flattenObjectKeys({
//   a: {
//     b: {
//       c: [],
//       d: {
//         e: [{ f: [] }, { b: 1 }],
//         g: {}
//       }
//     }
//   }
// });
//
// [ [ 'a', 'b', 'c' ],
//   [ 'a', 'b', 'd', 'e', '0', 'f' ],
//   [ 'a', 'b', 'd', 'e', '1', 'b' ],
//   [ 'a', 'b', 'd', 'g' ] ]
//
var _flattenObjectKeys = function flattenObjectKeys(obj) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return Object.keys(obj).reduce(function (acc, key) {
    var o = (0, _isPlainObject["default"])(obj[key]) && Object.keys(obj[key]).length > 0 || Array.isArray(obj[key]) && obj[key].length > 0 ? _flattenObjectKeys(obj[key], keys.concat(key)) : [keys.concat(key)];
    return acc.concat(o);
  }, []);
};
var _default = exports["default"] = _flattenObjectKeys;