"use strict";
"use client";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DescriptionsContext", {
  enumerable: true,
  get: function () {
    return _DescriptionsContext.default;
  }
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
var _responsiveObserver = require("../_util/responsiveObserver");
var _warning = require("../_util/warning");
var _configProvider = require("../config-provider");
var _useSize = _interopRequireDefault(require("../config-provider/hooks/useSize"));
var _useBreakpoint = _interopRequireDefault(require("../grid/hooks/useBreakpoint"));
var _constant = _interopRequireDefault(require("./constant"));
var _DescriptionsContext = _interopRequireDefault(require("./DescriptionsContext"));
var _useItems = _interopRequireDefault(require("./hooks/useItems"));
var _useRow = _interopRequireDefault(require("./hooks/useRow"));
var _Item = _interopRequireDefault(require("./Item"));
var _Row = _interopRequireDefault(require("./Row"));
var _style = _interopRequireDefault(require("./style"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
/* eslint-disable react/no-array-index-key */

const Descriptions = props => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const {
      prefixCls: customizePrefixCls,
      title,
      extra,
      column,
      colon = true,
      bordered,
      layout,
      children,
      className,
      rootClassName,
      style,
      size: customizeSize,
      labelStyle,
      contentStyle,
      styles,
      items,
      classNames: descriptionsClassNames
    } = props,
    restProps = __rest(props, ["prefixCls", "title", "extra", "column", "colon", "bordered", "layout", "children", "className", "rootClassName", "style", "size", "labelStyle", "contentStyle", "styles", "items", "classNames"]);
  const {
    getPrefixCls,
    direction,
    descriptions
  } = React.useContext(_configProvider.ConfigContext);
  const prefixCls = getPrefixCls('descriptions', customizePrefixCls);
  const screens = (0, _useBreakpoint.default)();
  // ============================== Warn ==============================
  if (process.env.NODE_ENV !== 'production') {
    const warning = (0, _warning.devUseWarning)('Descriptions');
    [['labelStyle', 'styles={{ label: {} }}'], ['contentStyle', 'styles={{ content: {} }}']].forEach(_ref => {
      let [deprecatedName, newName] = _ref;
      warning.deprecated(!(deprecatedName in props), deprecatedName, newName);
    });
  }
  // Column count
  const mergedColumn = React.useMemo(() => {
    var _a;
    if (typeof column === 'number') {
      return column;
    }
    return (_a = (0, _responsiveObserver.matchScreen)(screens, Object.assign(Object.assign({}, _constant.default), column))) !== null && _a !== void 0 ? _a : 3;
  }, [screens, column]);
  // Items with responsive
  const mergedItems = (0, _useItems.default)(screens, items, children);
  const mergedSize = (0, _useSize.default)(customizeSize);
  const rows = (0, _useRow.default)(mergedColumn, mergedItems);
  const [wrapCSSVar, hashId, cssVarCls] = (0, _style.default)(prefixCls);
  // ======================== Render ========================
  const contextValue = React.useMemo(() => {
    var _a, _b, _c, _d;
    return {
      labelStyle,
      contentStyle,
      styles: {
        content: Object.assign(Object.assign({}, (_a = descriptions === null || descriptions === void 0 ? void 0 : descriptions.styles) === null || _a === void 0 ? void 0 : _a.content), styles === null || styles === void 0 ? void 0 : styles.content),
        label: Object.assign(Object.assign({}, (_b = descriptions === null || descriptions === void 0 ? void 0 : descriptions.styles) === null || _b === void 0 ? void 0 : _b.label), styles === null || styles === void 0 ? void 0 : styles.label)
      },
      classNames: {
        label: (0, _classnames.default)((_c = descriptions === null || descriptions === void 0 ? void 0 : descriptions.classNames) === null || _c === void 0 ? void 0 : _c.label, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.label),
        content: (0, _classnames.default)((_d = descriptions === null || descriptions === void 0 ? void 0 : descriptions.classNames) === null || _d === void 0 ? void 0 : _d.content, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.content)
      }
    };
  }, [labelStyle, contentStyle, styles, descriptionsClassNames, descriptions]);
  return wrapCSSVar(/*#__PURE__*/React.createElement(_DescriptionsContext.default.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement("div", Object.assign({
    className: (0, _classnames.default)(prefixCls, descriptions === null || descriptions === void 0 ? void 0 : descriptions.className, (_a = descriptions === null || descriptions === void 0 ? void 0 : descriptions.classNames) === null || _a === void 0 ? void 0 : _a.root, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.root, {
      [`${prefixCls}-${mergedSize}`]: mergedSize && mergedSize !== 'default',
      [`${prefixCls}-bordered`]: !!bordered,
      [`${prefixCls}-rtl`]: direction === 'rtl'
    }, className, rootClassName, hashId, cssVarCls),
    style: Object.assign(Object.assign(Object.assign(Object.assign({}, descriptions === null || descriptions === void 0 ? void 0 : descriptions.style), (_b = descriptions === null || descriptions === void 0 ? void 0 : descriptions.styles) === null || _b === void 0 ? void 0 : _b.root), styles === null || styles === void 0 ? void 0 : styles.root), style)
  }, restProps), (title || extra) && (/*#__PURE__*/React.createElement("div", {
    className: (0, _classnames.default)(`${prefixCls}-header`, (_c = descriptions === null || descriptions === void 0 ? void 0 : descriptions.classNames) === null || _c === void 0 ? void 0 : _c.header, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.header),
    style: Object.assign(Object.assign({}, (_d = descriptions === null || descriptions === void 0 ? void 0 : descriptions.styles) === null || _d === void 0 ? void 0 : _d.header), styles === null || styles === void 0 ? void 0 : styles.header)
  }, title && (/*#__PURE__*/React.createElement("div", {
    className: (0, _classnames.default)(`${prefixCls}-title`, (_e = descriptions === null || descriptions === void 0 ? void 0 : descriptions.classNames) === null || _e === void 0 ? void 0 : _e.title, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.title),
    style: Object.assign(Object.assign({}, (_f = descriptions === null || descriptions === void 0 ? void 0 : descriptions.styles) === null || _f === void 0 ? void 0 : _f.title), styles === null || styles === void 0 ? void 0 : styles.title)
  }, title)), extra && (/*#__PURE__*/React.createElement("div", {
    className: (0, _classnames.default)(`${prefixCls}-extra`, (_g = descriptions === null || descriptions === void 0 ? void 0 : descriptions.classNames) === null || _g === void 0 ? void 0 : _g.extra, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.extra),
    style: Object.assign(Object.assign({}, (_h = descriptions === null || descriptions === void 0 ? void 0 : descriptions.styles) === null || _h === void 0 ? void 0 : _h.extra), styles === null || styles === void 0 ? void 0 : styles.extra)
  }, extra)))), /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-view`
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, rows.map((row, index) => (/*#__PURE__*/React.createElement(_Row.default, {
    key: index,
    index: index,
    colon: colon,
    prefixCls: prefixCls,
    vertical: layout === 'vertical',
    bordered: bordered,
    row: row
  })))))))));
};
if (process.env.NODE_ENV !== 'production') {
  Descriptions.displayName = 'Descriptions';
}
Descriptions.Item = _Item.default;
var _default = exports.default = Descriptions;