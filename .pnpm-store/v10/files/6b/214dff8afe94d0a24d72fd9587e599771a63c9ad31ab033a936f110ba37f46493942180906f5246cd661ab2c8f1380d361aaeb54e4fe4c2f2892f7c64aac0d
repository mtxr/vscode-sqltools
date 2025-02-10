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
import useMergedState from "rc-util/es/hooks/useMergedState";
import KeyCode from "rc-util/es/KeyCode";
import { getRenderPropValue } from '../_util/getRenderPropValue';
import { getTransitionName } from '../_util/motion';
import { cloneElement } from '../_util/reactNode';
import { ConfigContext } from '../config-provider';
import Tooltip from '../tooltip';
import PurePanel, { Overlay } from './PurePanel';
// CSSINJS
import useStyle from './style';
const InternalPopover = /*#__PURE__*/React.forwardRef((props, ref) => {
  var _a, _b, _c, _d, _e, _f;
  const {
      prefixCls: customizePrefixCls,
      title,
      content,
      overlayClassName,
      placement = 'top',
      trigger = 'hover',
      children,
      mouseEnterDelay = 0.1,
      mouseLeaveDelay = 0.1,
      onOpenChange,
      overlayStyle = {},
      styles,
      classNames: popoverClassNames
    } = props,
    otherProps = __rest(props, ["prefixCls", "title", "content", "overlayClassName", "placement", "trigger", "children", "mouseEnterDelay", "mouseLeaveDelay", "onOpenChange", "overlayStyle", "styles", "classNames"]);
  const {
    popover,
    getPrefixCls
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('popover', customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const rootPrefixCls = getPrefixCls();
  const rootClassNames = classNames(overlayClassName, hashId, cssVarCls, (_a = popover === null || popover === void 0 ? void 0 : popover.classNames) === null || _a === void 0 ? void 0 : _a.root, popoverClassNames === null || popoverClassNames === void 0 ? void 0 : popoverClassNames.root);
  const bodyClassNames = classNames((_b = popover === null || popover === void 0 ? void 0 : popover.classNames) === null || _b === void 0 ? void 0 : _b.body, popoverClassNames === null || popoverClassNames === void 0 ? void 0 : popoverClassNames.body);
  const [open, setOpen] = useMergedState(false, {
    value: (_c = props.open) !== null && _c !== void 0 ? _c : props.visible,
    defaultValue: (_d = props.defaultOpen) !== null && _d !== void 0 ? _d : props.defaultVisible
  });
  const settingOpen = (value, e) => {
    setOpen(value, true);
    onOpenChange === null || onOpenChange === void 0 ? void 0 : onOpenChange(value, e);
  };
  const onKeyDown = e => {
    if (e.keyCode === KeyCode.ESC) {
      settingOpen(false, e);
    }
  };
  const onInternalOpenChange = value => {
    settingOpen(value);
  };
  const titleNode = getRenderPropValue(title);
  const contentNode = getRenderPropValue(content);
  return wrapCSSVar(/*#__PURE__*/React.createElement(Tooltip, Object.assign({
    placement: placement,
    trigger: trigger,
    mouseEnterDelay: mouseEnterDelay,
    mouseLeaveDelay: mouseLeaveDelay
  }, otherProps, {
    prefixCls: prefixCls,
    classNames: {
      root: rootClassNames,
      body: bodyClassNames
    },
    styles: {
      root: Object.assign(Object.assign(Object.assign(Object.assign({}, (_e = popover === null || popover === void 0 ? void 0 : popover.styles) === null || _e === void 0 ? void 0 : _e.root), popover === null || popover === void 0 ? void 0 : popover.style), overlayStyle), styles === null || styles === void 0 ? void 0 : styles.root),
      body: Object.assign(Object.assign({}, (_f = popover === null || popover === void 0 ? void 0 : popover.styles) === null || _f === void 0 ? void 0 : _f.body), styles === null || styles === void 0 ? void 0 : styles.body)
    },
    ref: ref,
    open: open,
    onOpenChange: onInternalOpenChange,
    overlay: titleNode || contentNode ? (/*#__PURE__*/React.createElement(Overlay, {
      prefixCls: prefixCls,
      title: titleNode,
      content: contentNode
    })) : null,
    transitionName: getTransitionName(rootPrefixCls, 'zoom-big', otherProps.transitionName),
    "data-popover-inject": true
  }), cloneElement(children, {
    onKeyDown: e => {
      var _a, _b;
      if (/*#__PURE__*/React.isValidElement(children)) {
        (_b = children === null || children === void 0 ? void 0 : (_a = children.props).onKeyDown) === null || _b === void 0 ? void 0 : _b.call(_a, e);
      }
      onKeyDown(e);
    }
  })));
});
const Popover = InternalPopover;
Popover._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
if (process.env.NODE_ENV !== 'production') {
  Popover.displayName = 'Popover';
}
export default Popover;