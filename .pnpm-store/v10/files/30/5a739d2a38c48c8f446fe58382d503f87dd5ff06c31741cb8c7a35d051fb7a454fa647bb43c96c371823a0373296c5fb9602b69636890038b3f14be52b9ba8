"use client";

import React from 'react';
import { generateColor } from '../util';
const ColorClear = _ref => {
  let {
    prefixCls,
    value,
    onChange
  } = _ref;
  const handleClick = () => {
    if (onChange && value && !value.cleared) {
      const hsba = value.toHsb();
      hsba.a = 0;
      const genColor = generateColor(hsba);
      genColor.cleared = true;
      onChange(genColor);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-clear`,
    onClick: handleClick
  });
};
export default ColorClear;