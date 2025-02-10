import { __spreadArray } from "tslib";
import { isString, memoize, values } from '@antv/util';
import { getCanvasContext } from './context';
/**
 * 计算文本在画布中的宽度
 * @param text 文本
 * @param font 字体
 */
export var measureTextWidth = memoize(function (text, font) {
    if (font === void 0) { font = {}; }
    var fontSize = font.fontSize, _a = font.fontFamily, fontFamily = _a === void 0 ? 'sans-serif' : _a, fontWeight = font.fontWeight, fontStyle = font.fontStyle, fontVariant = font.fontVariant;
    var ctx = getCanvasContext();
    // @see https://developer.mozilla.org/zh-CN/docs/Web/CSS/font
    ctx.font = [fontStyle, fontWeight, fontVariant, "".concat(fontSize, "px"), fontFamily].join(' ');
    var metrics = ctx.measureText(isString(text) ? text : '');
    return metrics.width;
}, function (text, font) {
    if (font === void 0) { font = {}; }
    return __spreadArray([text], values(font), true).join('');
});
//# sourceMappingURL=measure-text.js.map