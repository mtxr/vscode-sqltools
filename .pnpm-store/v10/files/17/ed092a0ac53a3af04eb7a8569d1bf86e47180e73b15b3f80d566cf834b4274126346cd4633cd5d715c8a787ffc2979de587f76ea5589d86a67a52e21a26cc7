"use client";

var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import * as React from 'react';
import classNames from 'classnames';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import { useLocale } from '../locale';
import DefaultEmptyImg from './empty';
import SimpleEmptyImg from './simple';
import useStyle from './style';
const defaultEmptyImg = /*#__PURE__*/React.createElement(DefaultEmptyImg, null);
const simpleEmptyImg = /*#__PURE__*/React.createElement(SimpleEmptyImg, null);
const Empty = props => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const {
      className,
      rootClassName,
      prefixCls: customizePrefixCls,
      image = defaultEmptyImg,
      description,
      children,
      imageStyle,
      style,
      classNames: emptyClassNames,
      styles
    } = props,
    restProps = __rest(props, ["className", "rootClassName", "prefixCls", "image", "description", "children", "imageStyle", "style", "classNames", "styles"]);
  const {
    getPrefixCls,
    direction,
    empty
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('empty', customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const [locale] = useLocale('Empty');
  const des = typeof description !== 'undefined' ? description : locale === null || locale === void 0 ? void 0 : locale.description;
  const alt = typeof des === 'string' ? des : 'empty';
  let imageNode = null;
  if (typeof image === 'string') {
    imageNode = /*#__PURE__*/React.createElement("img", {
      alt: alt,
      src: image
    });
  } else {
    imageNode = image;
  }
  // ============================= Warning ==============================
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Empty');
    [['imageStyle', 'styles: { image: {} }']].forEach(_ref => {
      let [deprecatedName, newName] = _ref;
      warning.deprecated(!(deprecatedName in props), deprecatedName, newName);
    });
  }
  return wrapCSSVar(/*#__PURE__*/React.createElement("div", Object.assign({
    className: classNames(hashId, cssVarCls, prefixCls, empty === null || empty === void 0 ? void 0 : empty.className, {
      [`${prefixCls}-normal`]: image === simpleEmptyImg,
      [`${prefixCls}-rtl`]: direction === 'rtl'
    }, className, rootClassName, (_a = empty === null || empty === void 0 ? void 0 : empty.classNames) === null || _a === void 0 ? void 0 : _a.root, emptyClassNames === null || emptyClassNames === void 0 ? void 0 : emptyClassNames.root),
    style: Object.assign(Object.assign(Object.assign(Object.assign({}, (_b = empty === null || empty === void 0 ? void 0 : empty.styles) === null || _b === void 0 ? void 0 : _b.root), empty === null || empty === void 0 ? void 0 : empty.style), styles === null || styles === void 0 ? void 0 : styles.root), style)
  }, restProps), /*#__PURE__*/React.createElement("div", {
    className: classNames(`${prefixCls}-image`, (_c = empty === null || empty === void 0 ? void 0 : empty.classNames) === null || _c === void 0 ? void 0 : _c.image, emptyClassNames === null || emptyClassNames === void 0 ? void 0 : emptyClassNames.image),
    style: Object.assign(Object.assign(Object.assign({}, imageStyle), (_d = empty === null || empty === void 0 ? void 0 : empty.styles) === null || _d === void 0 ? void 0 : _d.image), styles === null || styles === void 0 ? void 0 : styles.image)
  }, imageNode), des && (/*#__PURE__*/React.createElement("div", {
    className: classNames(`${prefixCls}-description`, (_e = empty === null || empty === void 0 ? void 0 : empty.classNames) === null || _e === void 0 ? void 0 : _e.description, emptyClassNames === null || emptyClassNames === void 0 ? void 0 : emptyClassNames.description),
    style: Object.assign(Object.assign({}, (_f = empty === null || empty === void 0 ? void 0 : empty.styles) === null || _f === void 0 ? void 0 : _f.description), styles === null || styles === void 0 ? void 0 : styles.description)
  }, des)), children && (/*#__PURE__*/React.createElement("div", {
    className: classNames(`${prefixCls}-footer`, (_g = empty === null || empty === void 0 ? void 0 : empty.classNames) === null || _g === void 0 ? void 0 : _g.footer, emptyClassNames === null || emptyClassNames === void 0 ? void 0 : emptyClassNames.footer),
    style: Object.assign(Object.assign({}, (_h = empty === null || empty === void 0 ? void 0 : empty.styles) === null || _h === void 0 ? void 0 : _h.footer), styles === null || styles === void 0 ? void 0 : styles.footer)
  }, children))));
};
Empty.PRESENTED_IMAGE_DEFAULT = defaultEmptyImg;
Empty.PRESENTED_IMAGE_SIMPLE = simpleEmptyImg;
if (process.env.NODE_ENV !== 'production') {
  Empty.displayName = 'Empty';
}
export default Empty;