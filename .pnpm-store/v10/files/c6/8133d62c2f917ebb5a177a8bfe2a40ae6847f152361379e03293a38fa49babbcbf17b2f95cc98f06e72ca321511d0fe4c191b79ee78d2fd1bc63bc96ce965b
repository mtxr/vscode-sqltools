"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversionTagFormatter = void 0;
var util_1 = require("@antv/util");
/**
 * 转化率的计算方式
 * @param prev
 * @param next
 */
function conversionTagFormatter(prev, next) {
    if (!(0, util_1.isNumber)(prev) || !(0, util_1.isNumber)(next)) {
        return '-';
    }
    // 0 / 0 没有意义
    if (prev === 0 && next === 0) {
        return '-';
    }
    if (prev === next) {
        return '100%';
    }
    if (prev === 0) {
        return '∞';
    }
    return "".concat(((100 * next) / prev).toFixed(2), "%");
}
exports.conversionTagFormatter = conversionTagFormatter;
//# sourceMappingURL=conversion.js.map