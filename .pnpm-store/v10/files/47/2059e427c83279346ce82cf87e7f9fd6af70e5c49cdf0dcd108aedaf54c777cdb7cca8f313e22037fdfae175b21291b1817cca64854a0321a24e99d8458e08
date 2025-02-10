import { __read } from "tslib";
import colorUtil from '@antv/color-util';
// 内置的一些特殊设置
var preset = {
    '#5B8FF9': true,
};
// 根据YIQ亮度判断指定颜色取反色是不是白色
// http://24ways.org/2010/calculating-color-contrast
// http://www.w3.org/TR/AERT#color-contrast
export var isContrastColorWhite = function (color) {
    var rgb = colorUtil.toRGB(color).toUpperCase();
    if (preset[rgb]) {
        return preset[rgb];
    }
    var _a = __read(colorUtil.rgb2arr(rgb), 3), r = _a[0], g = _a[1], b = _a[2];
    var isDark = (r * 299 + g * 587 + b * 114) / 1000 < 128;
    return isDark;
};
//# sourceMappingURL=color.js.map