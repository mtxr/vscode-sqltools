"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureTextWidth = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var context_1 = require("./context");
/**
 * 计算文本在画布中的宽度
 * @param text 文本
 * @param font 字体
 */
exports.measureTextWidth = (0, util_1.memoize)(function (text, font) {
    if (font === void 0) { font = {}; }
    var fontSize = font.fontSize, _a = font.fontFamily, fontFamily = _a === void 0 ? 'sans-serif' : _a, fontWeight = font.fontWeight, fontStyle = font.fontStyle, fontVariant = font.fontVariant;
    var ctx = (0, context_1.getCanvasContext)();
    // @see https://developer.mozilla.org/zh-CN/docs/Web/CSS/font
    ctx.font = [fontStyle, fontWeight, fontVariant, "".concat(fontSize, "px"), fontFamily].join(' ');
    var metrics = ctx.measureText((0, util_1.isString)(text) ? text : '');
    return metrics.width;
}, function (text, font) {
    if (font === void 0) { font = {}; }
    return tslib_1.__spreadArray([text], (0, util_1.values)(font), true).join('');
});
//# sourceMappingURL=measure-text.js.map