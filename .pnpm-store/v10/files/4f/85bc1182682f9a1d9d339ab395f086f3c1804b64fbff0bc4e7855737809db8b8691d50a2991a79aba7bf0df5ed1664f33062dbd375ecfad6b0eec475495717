"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultPrefixCls = exports.defaultIconPrefixCls = exports.Variants = exports.ConfigContext = exports.ConfigConsumer = void 0;
var React = _interopRequireWildcard(require("react"));
const defaultPrefixCls = exports.defaultPrefixCls = 'ant';
const defaultIconPrefixCls = exports.defaultIconPrefixCls = 'anticon';
const Variants = exports.Variants = ['outlined', 'borderless', 'filled'];
const defaultGetPrefixCls = (suffixCls, customizePrefixCls) => {
  if (customizePrefixCls) {
    return customizePrefixCls;
  }
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls;
};
// zombieJ: 🚨 Do not pass `defaultRenderEmpty` here since it will cause circular dependency.
const ConfigContext = exports.ConfigContext = /*#__PURE__*/React.createContext({
  // We provide a default function for Context without provider
  getPrefixCls: defaultGetPrefixCls,
  iconPrefixCls: defaultIconPrefixCls
});
const {
  Consumer: ConfigConsumer
} = ConfigContext;
exports.ConfigConsumer = ConfigConsumer;