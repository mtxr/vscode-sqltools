"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllZero = exports.adaptOffset = exports.getTotalValue = void 0;
var util_1 = require("@antv/util");
var utils_1 = require("../../utils");
/**
 * 获取总计值
 * @param data
 * @param field
 */
function getTotalValue(data, field) {
    var total = null;
    (0, util_1.each)(data, function (item) {
        if (typeof item[field] === 'number') {
            total += item[field];
        }
    });
    return total;
}
exports.getTotalValue = getTotalValue;
/**
 * pie label offset adaptor
 */
function adaptOffset(type, offset) {
    var defaultOffset;
    switch (type) {
        case 'inner':
            defaultOffset = '-30%';
            if ((0, util_1.isString)(offset) && offset.endsWith('%')) {
                return parseFloat(offset) * 0.01 > 0 ? defaultOffset : offset;
            }
            return offset < 0 ? offset : defaultOffset;
        case 'outer':
            defaultOffset = 12;
            if ((0, util_1.isString)(offset) && offset.endsWith('%')) {
                return parseFloat(offset) * 0.01 < 0 ? defaultOffset : offset;
            }
            return offset > 0 ? offset : defaultOffset;
        default:
            return offset;
    }
}
exports.adaptOffset = adaptOffset;
/**
 * 判断数据是否全部为 0
 * @param data
 * @param angleField
 */
function isAllZero(data, angleField) {
    return (0, util_1.every)((0, utils_1.processIllegalData)(data, angleField), function (d) { return d[angleField] === 0; });
}
exports.isAllZero = isAllZero;
//# sourceMappingURL=utils.js.map