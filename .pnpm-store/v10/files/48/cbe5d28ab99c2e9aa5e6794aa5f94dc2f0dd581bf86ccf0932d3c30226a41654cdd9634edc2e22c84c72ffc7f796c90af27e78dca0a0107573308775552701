"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assembleFont = exports.getTextWidth = exports.getLineSpaceing = exports.getTextHeight = void 0;
var util_1 = require("./util");
var offscreen_1 = require("./offscreen");
/**
 * 获取文本的高度
 * @param text 文本
 * @param fontSize 字体大小
 * @param lineHeight 行高，可以为空
 */
function getTextHeight(text, fontSize, lineHeight) {
    var lineCount = 1;
    if (util_1.isString(text)) {
        lineCount = text.split('\n').length;
    }
    if (lineCount > 1) {
        var spaceingY = getLineSpaceing(fontSize, lineHeight);
        return fontSize * lineCount + spaceingY * (lineCount - 1);
    }
    return fontSize;
}
exports.getTextHeight = getTextHeight;
/**
 * 获取行间距如果文本多行，需要获取文本间距
 * @param fontSize 字体大小
 * @param lineHeight 行高
 */
function getLineSpaceing(fontSize, lineHeight) {
    return lineHeight ? lineHeight - fontSize : fontSize * 0.14;
}
exports.getLineSpaceing = getLineSpaceing;
/**
 * 字体宽度
 * @param text 文本
 * @param font 字体
 */
function getTextWidth(text, font) {
    var context = offscreen_1.getOffScreenContext(); // 获取离屏的 ctx 进行计算
    var width = 0;
    // null 或者 undefined 时，宽度为 0
    if (util_1.isNil(text) || text === '') {
        return width;
    }
    context.save();
    context.font = font;
    if (util_1.isString(text) && text.includes('\n')) {
        var textArr = text.split('\n');
        util_1.each(textArr, function (subText) {
            var measureWidth = context.measureText(subText).width;
            if (width < measureWidth) {
                width = measureWidth;
            }
        });
    }
    else {
        width = context.measureText(text).width;
    }
    context.restore();
    return width;
}
exports.getTextWidth = getTextWidth;
function assembleFont(attrs) {
    var fontSize = attrs.fontSize, fontFamily = attrs.fontFamily, fontWeight = attrs.fontWeight, fontStyle = attrs.fontStyle, fontVariant = attrs.fontVariant;
    return [fontStyle, fontVariant, fontWeight, fontSize + "px", fontFamily].join(' ').trim();
}
exports.assembleFont = assembleFont;
//# sourceMappingURL=text.js.map