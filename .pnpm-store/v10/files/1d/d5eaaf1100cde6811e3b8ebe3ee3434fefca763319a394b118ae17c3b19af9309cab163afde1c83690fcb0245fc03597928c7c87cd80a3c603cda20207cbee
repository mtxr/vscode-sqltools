"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ensureType = require("ensure-type");
var _get2 = _interopRequireDefault(require("lodash/get"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var isJSXText = function isJSXText(node) {
  if (!node) {
    return false;
  }
  return node.type === 'JSXText';
};
var isNumericLiteral = function isNumericLiteral(node) {
  if (!node) {
    return false;
  }
  return node.type === 'Literal' && typeof node.value === 'number';
};
var isStringLiteral = function isStringLiteral(node) {
  if (!node) {
    return false;
  }
  return node.type === 'Literal' && typeof node.value === 'string';
};
var isObjectExpression = function isObjectExpression(node) {
  if (!node) {
    return false;
  }
  return node.type === 'ObjectExpression';
};
var trimValue = function trimValue(value) {
  return (0, _ensureType.ensureString)(value).replace(/^[\r\n]+\s*/g, '') // remove leading spaces containing a leading newline character
  .replace(/[\r\n]+\s*$/g, '') // remove trailing spaces containing a leading newline character
  .replace(/[\r\n]+\s*/g, ' ');
}; // replace spaces containing a leading newline character with a single space character

var _nodesToString = function nodesToString(nodes, options) {
  var supportBasicHtmlNodes = (0, _ensureType.ensureBoolean)(options === null || options === void 0 ? void 0 : options.supportBasicHtmlNodes);
  var keepBasicHtmlNodesFor = (0, _ensureType.ensureArray)(options === null || options === void 0 ? void 0 : options.keepBasicHtmlNodesFor);
  var filteredNodes = (0, _ensureType.ensureArray)(nodes).filter(function (node) {
    if (isJSXText(node)) {
      return trimValue(node.value);
    }
    return true;
  });
  var memo = '';
  filteredNodes.forEach(function (node, nodeIndex) {
    if (isJSXText(node)) {
      var value = trimValue(node.value);
      if (!value) {
        return;
      }
      memo += value;
    } else if (node.type === 'JSXExpressionContainer') {
      var _node$expression = node.expression,
        expression = _node$expression === void 0 ? {} : _node$expression;
      if (isNumericLiteral(expression)) {
        // Numeric literal is ignored in react-i18next
        memo += '';
      }
      if (isStringLiteral(expression)) {
        memo += expression.value;
      } else if (isObjectExpression(expression) && (0, _get2["default"])(expression, 'properties[0].type') === 'Property') {
        memo += "{{".concat(expression.properties[0].key.name, "}}");
      } else {
        console.error("Unsupported JSX expression. Only static values or {{interpolation}} blocks are supported. Got ".concat(expression.type, ":"));
        console.error((0, _ensureType.ensureString)(options === null || options === void 0 ? void 0 : options.code).slice(node.start, node.end));
        console.error(node.expression);
      }
    } else if (node.children) {
      var _node$openingElement, _node$openingElement$, _node$openingElement2, _node$openingElement3, _node$openingElement4, _node$openingElement5;
      var nodeType = (_node$openingElement = node.openingElement) === null || _node$openingElement === void 0 ? void 0 : (_node$openingElement$ = _node$openingElement.name) === null || _node$openingElement$ === void 0 ? void 0 : _node$openingElement$.name;
      var selfClosing = (_node$openingElement2 = node.openingElement) === null || _node$openingElement2 === void 0 ? void 0 : _node$openingElement2.selfClosing;
      var attributeCount = (0, _ensureType.ensureArray)((_node$openingElement3 = node.openingElement) === null || _node$openingElement3 === void 0 ? void 0 : _node$openingElement3.attributes).length;
      var filteredChildNodes = (0, _ensureType.ensureArray)(node.children).filter(function (childNode) {
        if (isJSXText(childNode)) {
          return trimValue(childNode.value);
        }
        return true;
      });
      var childCount = filteredChildNodes.length;
      var firstChildNode = filteredChildNodes[0];
      var shouldKeepChild = supportBasicHtmlNodes && keepBasicHtmlNodesFor.indexOf((_node$openingElement4 = node.openingElement) === null || _node$openingElement4 === void 0 ? void 0 : (_node$openingElement5 = _node$openingElement4.name) === null || _node$openingElement5 === void 0 ? void 0 : _node$openingElement5.name) > -1;
      if (selfClosing && shouldKeepChild && attributeCount === 0) {
        // actual e.g. lorem <br/> ipsum
        // expected e.g. lorem <br/> ipsum
        memo += "<".concat(nodeType, "/>");
      } else if (childCount === 0 && !shouldKeepChild || childCount === 0 && attributeCount !== 0) {
        // actual e.g. lorem <hr className="test" /> ipsum
        // expected e.g. lorem <0></0> ipsum
        memo += "<".concat(nodeIndex, "></").concat(nodeIndex, ">");
      } else if (shouldKeepChild && attributeCount === 0 && childCount === 1 && (isJSXText(firstChildNode) || isStringLiteral(firstChildNode === null || firstChildNode === void 0 ? void 0 : firstChildNode.expression))) {
        // actual e.g. dolor <strong>bold</strong> amet
        // expected e.g. dolor <strong>bold</strong> amet
        memo += "<".concat(nodeType, ">").concat(_nodesToString(node.children, options), "</").concat(nodeType, ">");
      } else {
        // regular case mapping the inner children
        memo += "<".concat(nodeIndex, ">").concat(_nodesToString(node.children, options), "</").concat(nodeIndex, ">");
      }
    }
  });
  return memo;
};
var _default = exports["default"] = _nodesToString;