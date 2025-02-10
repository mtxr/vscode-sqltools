"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorToArr = exports.blend = exports.innerBlend = void 0;
var tslib_1 = require("tslib");
var color_util_1 = tslib_1.__importDefault(require("@antv/color-util"));
/*
 * interpolates between a set of colors uzing a bezier spline
 * blend mode formulas taken from http://www.venture-ware.com/kevin/coding/lets-learn-math-photoshop-blend-modes/
 */
var each = function (f) {
    return function (c0, c1) {
        var out = [];
        out[0] = f(c0[0], c1[0]);
        out[1] = f(c0[1], c1[1]);
        out[2] = f(c0[2], c1[2]);
        return out;
    };
};
/**
 * 混合方法集合
 */
var blendObject = {
    normal: function (a) { return a; },
    multiply: function (a, b) { return (a * b) / 255; },
    screen: function (a, b) { return 255 * (1 - (1 - a / 255) * (1 - b / 255)); },
    overlay: function (a, b) { return (b < 128 ? (2 * a * b) / 255 : 255 * (1 - 2 * (1 - a / 255) * (1 - b / 255))); },
    darken: function (a, b) { return (a > b ? b : a); },
    lighten: function (a, b) { return (a > b ? a : b); },
    dodge: function (a, b) {
        if (a === 255)
            return 255;
        a = (255 * (b / 255)) / (1 - a / 255);
        return a > 255 ? 255 : a;
    },
    burn: function (a, b) {
        // 参考 w3c 的写法，考虑除数为 0 的情况
        if (b === 255)
            return 255;
        else if (a === 0)
            return 0;
        else
            return 255 * (1 - Math.min(1, (1 - b / 255) / (a / 255)));
    },
};
/**
 * 获取混合方法
 */
var innerBlend = function (mode) {
    if (!blendObject[mode]) {
        throw new Error('unknown blend mode ' + mode);
    }
    return blendObject[mode];
};
exports.innerBlend = innerBlend;
/**
 * 混合颜色，并处理透明度情况
 * 参考：https://www.w3.org/TR/compositing/#blending
 * @param c0
 * @param c1
 * @param mode 混合模式
 * @return rbga
 */
function blend(c0, c1, mode) {
    if (mode === void 0) { mode = 'normal'; }
    // blendRgbArr: 生成不考虑透明度的 blend color: [r, g, b]
    var blendRgbArr = each((0, exports.innerBlend)(mode))(colorToArr(c0), colorToArr(c1));
    var _a = colorToArr(c0), r0 = _a[0], g0 = _a[1], b0 = _a[2], a0 = _a[3];
    var _b = colorToArr(c1), r1 = _b[0], g1 = _b[1], b1 = _b[2], a1 = _b[3];
    var a = Number((a0 + a1 * (1 - a0)).toFixed(2));
    var r = Math.round(((a0 * (1 - a1) * (r0 / 255) + a0 * a1 * (blendRgbArr[0] / 255) + (1 - a0) * a1 * (r1 / 255)) / a) * 255);
    var g = Math.round(((a0 * (1 - a1) * (g0 / 255) + a0 * a1 * (blendRgbArr[1] / 255) + (1 - a0) * a1 * (g1 / 255)) / a) * 255);
    var b = Math.round(((a0 * (1 - a1) * (b0 / 255) + a0 * a1 * (blendRgbArr[2] / 255) + (1 - a0) * a1 * (b1 / 255)) / a) * 255);
    return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(a, ")");
}
exports.blend = blend;
/**
 * 统一颜色输入的格式 [r, g, b, a]
 * 参考：https://www.w3.org/TR/compositing/#blending
 * @param c color
 * @return [r, g, b, a]
 */
function colorToArr(c) {
    var color = c.replace('/s+/g', ''); // 去除所有空格
    var rgbaArr;
    // 'red' -> [r, g, b, 1]
    if (typeof color === 'string' && !color.startsWith('rgba') && !color.startsWith('#')) {
        return (rgbaArr = color_util_1.default.rgb2arr(color_util_1.default.toRGB(color)).concat([1]));
    }
    // rgba(255, 200, 125, 0.5) -> [r, g, b, a]
    if (color.startsWith('rgba'))
        rgbaArr = color.replace('rgba(', '').replace(')', '').split(',');
    // '#fff000' -> [r, g, b, 1]
    if (color.startsWith('#'))
        rgbaArr = color_util_1.default.rgb2arr(color).concat([1]); // 如果是 16 进制（6 位数），默认透明度 1
    // [r, g, b, a] 前三位取整
    return rgbaArr.map(function (item, index) { return (index === 3 ? Number(item) : item | 0); });
}
exports.colorToArr = colorToArr;
//# sourceMappingURL=blend.js.map