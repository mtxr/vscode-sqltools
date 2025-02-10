import { isArray, isNumber } from '@antv/util';
/**
 * 把 padding 转换成统一的数组写法
 * @param padding
 */
export function normalPadding(padding) {
    if (isNumber(padding)) {
        return [padding, padding, padding, padding];
    }
    if (isArray(padding)) {
        var length_1 = padding.length;
        if (length_1 === 1) {
            return [padding[0], padding[0], padding[0], padding[0]];
        }
        if (length_1 === 2) {
            return [padding[0], padding[1], padding[0], padding[1]];
        }
        if (length_1 === 3) {
            return [padding[0], padding[1], padding[2], padding[1]];
        }
        if (length_1 === 4) {
            return padding;
        }
    }
    return [0, 0, 0, 0];
}
/**
 * 获取调整的 appendPadding
 */
export function getAdjustAppendPadding(padding, position, append) {
    if (position === void 0) { position = 'bottom'; }
    if (append === void 0) { append = 25; }
    var currentAppendPadding = normalPadding(padding);
    var PADDING = [
        position.startsWith('top') ? append : 0,
        position.startsWith('right') ? append : 0,
        position.startsWith('bottom') ? append : 0,
        position.startsWith('left') ? append : 0,
    ];
    return [
        currentAppendPadding[0] + PADDING[0],
        currentAppendPadding[1] + PADDING[1],
        currentAppendPadding[2] + PADDING[2],
        currentAppendPadding[3] + PADDING[3],
    ];
}
/**
 * 根据图表的 padding 和 appendPadding 计算出图表的最终 padding
 * @param array
 */
export function resolveAllPadding(paddings) {
    // 先把数组里的 padding 全部转换成 normal
    var normalPaddings = paddings.map(function (item) { return normalPadding(item); });
    var finalPadding = [0, 0, 0, 0];
    if (normalPaddings.length > 0) {
        finalPadding = finalPadding.map(function (item, index) {
            // 有几个 padding 数组就遍历几次，累加
            normalPaddings.forEach(function (d, i) {
                item += normalPaddings[i][index];
            });
            return item;
        });
    }
    return finalPadding;
}
//# sourceMappingURL=padding.js.map