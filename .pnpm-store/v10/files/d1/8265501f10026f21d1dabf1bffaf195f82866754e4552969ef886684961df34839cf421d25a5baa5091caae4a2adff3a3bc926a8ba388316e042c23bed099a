"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _acornWalk = require("acorn-walk");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // Originally from: https://github.com/sderosiaux/acorn-jsx-walk
Object.assign(_acornWalk.base, {
  FieldDefinition: function FieldDefinition(node, state, callback) {
    if (node.value !== null) {
      callback(node.value, state);
    }
  }
});

// Extends acorn walk with JSX elements
// https://github.com/RReverser/acorn-jsx/issues/23#issuecomment-403753801
Object.assign(_acornWalk.base, {
  JSXAttribute: function JSXAttribute(node, state, callback) {
    if (node.value !== null) {
      callback(node.value, state);
    }
  },
  JSXElement: function JSXElement(node, state, callback) {
    node.openingElement.attributes.forEach(function (attribute) {
      callback(attribute, state);
    });
    node.children.forEach(function (node) {
      callback(node, state);
    });
  },
  JSXEmptyExpression: function JSXEmptyExpression(node, state, callback) {
    // Comments. Just ignore.
  },
  JSXExpressionContainer: function JSXExpressionContainer(node, state, callback) {
    callback(node.expression, state);
  },
  JSXFragment: function JSXFragment(node, state, callback) {
    node.children.forEach(function (node) {
      callback(node, state);
    });
  },
  JSXSpreadAttribute: function JSXSpreadAttribute(node, state, callback) {
    callback(node.argument, state);
  },
  JSXText: function JSXText() {}
});
var _default = exports["default"] = function _default(ast, options) {
  (0, _acornWalk.simple)(ast, _objectSpread({}, options));
};