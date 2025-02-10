"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ellipsisLabel = exports.testLabel = exports.getLabelLength = exports.getMaxLabelWidth = void 0;
var util_1 = require("@antv/util");
var text_1 = require("./text");
var ELLIPSIS_CODE = '\u2026';
var ELLIPSIS_CODE_LENGTH = 2; // 省略号的长度
/** 大数据量阈值 */
var OPTIMIZE_THRESHOLD = 400;
/**
 * 针对大数据量做优化的 getMaxLabelWidth，做法不是直接去比较每一个 label 的最大宽度
 * 而是先通过比较每个 label 每个的字符串的长度，这里区分了下中英文字符
 * 最终是去字符串最“长”的那个 label 的宽度。
 * @param labels
 */
function getMaxLabelWidthOptimized(labels) {
    var texts = labels.map(function (label) {
        var text = label.attr('text');
        return util_1.isNil(text) ? '' : "" + text;
    });
    var maxLen = 0;
    var maxIdx = 0;
    for (var i = 0; i < texts.length; i += 1) {
        var len = 0;
        for (var j = 0; j <= texts[i].length; j += 1) {
            var code = texts[i].charCodeAt(j);
            if (code >= 19968 && code <= 40869) {
                len += 2;
            }
            else {
                len += 1;
            }
        }
        if (len > maxLen) {
            maxLen = len;
            maxIdx = i;
        }
    }
    return labels[maxIdx].getBBox().width;
}
/** 获取最长的 label */
function getMaxLabelWidth(labels) {
    if (labels.length > OPTIMIZE_THRESHOLD) {
        return getMaxLabelWidthOptimized(labels);
    }
    var max = 0;
    util_1.each(labels, function (label) {
        var bbox = label.getBBox();
        var width = bbox.width;
        if (max < width) {
            max = width;
        }
    });
    return max;
}
exports.getMaxLabelWidth = getMaxLabelWidth;
/** 获取label长度 */
function getLabelLength(isVertical, label) {
    var bbox = label.getCanvasBBox();
    return isVertical ? bbox.width : bbox.height;
}
exports.getLabelLength = getLabelLength;
/* label长度是否超过约束值 */
function testLabel(label, limitLength) {
    return label.getBBox().width < limitLength;
}
exports.testLabel = testLabel;
/** 处理 text shape 的自动省略 */
function ellipsisLabel(isVertical, label, limitLength, position) {
    var _a;
    if (position === void 0) { position = 'tail'; }
    var text = (_a = label.attr('text')) !== null && _a !== void 0 ? _a : ''; // 避免出现null、undefined
    if (position === 'tail') {
        // component 里的缩略处理做得很糟糕，文字长度测算完全不准确
        // 这里暂时只对 tail 做处理
        var font = util_1.pick(label.attr(), ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'fontVariant']);
        var ellipsisText = util_1.getEllipsisText(text, limitLength, font, '…');
        if (text !== ellipsisText) {
            label.attr('text', ellipsisText);
            label.set('tip', text);
            return true;
        }
        label.set('tip', null);
        return false;
    }
    var labelLength = getLabelLength(isVertical, label);
    var codeLength = text_1.strLen(text);
    var ellipsisFlag = false;
    if (limitLength < labelLength) {
        var reserveLength = Math.floor((limitLength / labelLength) * codeLength) - ELLIPSIS_CODE_LENGTH; // 计算出来的应该保存的长度
        var newText = void 0;
        if (reserveLength >= 0) {
            newText = text_1.ellipsisString(text, reserveLength, position);
        }
        else {
            newText = ELLIPSIS_CODE;
        }
        if (newText) {
            label.attr('text', newText);
            ellipsisFlag = true;
        }
    }
    if (ellipsisFlag) {
        label.set('tip', text);
    }
    else {
        label.set('tip', null);
    }
    return ellipsisFlag;
}
exports.ellipsisLabel = ellipsisLabel;
//# sourceMappingURL=label.js.map