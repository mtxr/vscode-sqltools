"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEllipsisText = exports.measureTextWidth = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var context_1 = require("./context");
/**
 * 计算文本在画布中的宽度
 */
exports.measureTextWidth = (0, util_1.memoize)(function (text, font) {
    if (font === void 0) { font = {}; }
    var fontSize = font.fontSize, fontFamily = font.fontFamily, fontWeight = font.fontWeight, fontStyle = font.fontStyle, fontVariant = font.fontVariant;
    var ctx = (0, context_1.getCanvasContext)();
    ctx.font = [fontStyle, fontVariant, fontWeight, "".concat(fontSize, "px"), fontFamily].join(' ');
    return ctx.measureText((0, util_1.isString)(text) ? text : '').width;
}, function (text, font) {
    if (font === void 0) { font = {}; }
    return tslib_1.__spreadArray([text], tslib_1.__read((0, util_1.values)(font)), false).join('');
});
/**
 * 获取文本的 ... 文本。
 * 算法（减少每次 measureText 的长度，measureText 的性能跟字符串时间相关）：
 * 1. 先通过 STEP 逐步计算，找到最后一个小于 maxWidth 的字符串
 * 2. 然后对最后这个字符串二分计算
 * @param text 需要计算的文本, 由于历史原因 除了支持string，还支持空值,number和数组等
 * @param maxWidth
 * @param font
 */
var getEllipsisText = function (text, maxWidth, font) {
    var STEP = 16; // 每次 16，调参工程师
    var DOT_WIDTH = (0, exports.measureTextWidth)('...', font);
    var leftText;
    if (!(0, util_1.isString)(text)) {
        leftText = (0, util_1.toString)(text);
    }
    else {
        leftText = text;
    }
    var leftWidth = maxWidth;
    var r = []; // 最终的分段字符串
    var currentText;
    var currentWidth;
    if ((0, exports.measureTextWidth)(text, font) <= maxWidth) {
        return text;
    }
    // 首先通过 step 计算，找出最大的未超出长度的
    while (true) {
        // 更新字符串
        currentText = leftText.substr(0, STEP);
        // 计算宽度
        currentWidth = (0, exports.measureTextWidth)(currentText, font);
        // 超出剩余宽度，则停止
        if (currentWidth + DOT_WIDTH > leftWidth) {
            if (currentWidth > leftWidth) {
                break;
            }
        }
        r.push(currentText);
        // 没有超出，则计算剩余宽度
        leftWidth -= currentWidth;
        leftText = leftText.substr(STEP);
        // 字符串整体没有超出
        if (!leftText) {
            return r.join('');
        }
    }
    // 最下的最后一个 STEP，使用 1 递增（用二分效果更高）
    while (true) {
        // 更新字符串
        currentText = leftText.substr(0, 1);
        // 计算宽度
        currentWidth = (0, exports.measureTextWidth)(currentText, font);
        // 超出剩余宽度，则停止
        if (currentWidth + DOT_WIDTH > leftWidth) {
            break;
        }
        r.push(currentText);
        // 没有超出，则计算剩余宽度
        leftWidth -= currentWidth;
        leftText = leftText.substr(1);
        if (!leftText) {
            return r.join('');
        }
    }
    return "".concat(r.join(''), "...");
};
exports.getEllipsisText = getEllipsisText;
//# sourceMappingURL=text.js.map