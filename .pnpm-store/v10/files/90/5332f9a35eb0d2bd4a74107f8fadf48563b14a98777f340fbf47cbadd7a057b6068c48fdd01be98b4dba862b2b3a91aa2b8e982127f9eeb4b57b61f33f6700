"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformData = exports.processData = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var utils_1 = require("../../utils");
var constant_1 = require("./constant");
/**
 * @desc 数据处理函数，统一将数据处理成[start, end]
 * @param data
 * @param xField
 * @param yField
 * @param totalLabel
 */
function processData(data, xField, yField, newYField, total) {
    var _a;
    var newData = [];
    (0, util_1.reduce)(data, function (r, d) {
        var _a;
        // 校验数据合法性
        (0, utils_1.log)(utils_1.LEVEL.WARN, (0, util_1.isNumber)(d[yField]), "".concat(d[yField], " is not a valid number"));
        var value = (0, util_1.isUndefined)(d[yField]) ? null : d[yField];
        newData.push(tslib_1.__assign(tslib_1.__assign({}, d), (_a = {}, _a[newYField] = [r, r + value], _a)));
        return r + value;
    }, 0);
    // 如果需要展示总和
    if (newData.length && total) {
        var sum = (0, util_1.get)(newData, [[data.length - 1], newYField, [1]]);
        newData.push((_a = {},
            _a[xField] = total.label,
            _a[yField] = sum,
            _a[newYField] = [0, sum],
            _a));
    }
    return newData;
}
exports.processData = processData;
/**
 * 处理为 瀑布图 数据
 */
function transformData(data, xField, yField, total) {
    var processed = processData(data, xField, yField, constant_1.Y_FIELD, total);
    return processed.map(function (d, dIdx) {
        var _a;
        if (!(0, util_1.isObject)(d)) {
            return d;
        }
        return tslib_1.__assign(tslib_1.__assign({}, d), (_a = {}, _a[constant_1.ABSOLUTE_FIELD] = d[constant_1.Y_FIELD][1], _a[constant_1.DIFF_FIELD] = d[constant_1.Y_FIELD][1] - d[constant_1.Y_FIELD][0], _a[constant_1.IS_TOTAL] = dIdx === data.length, _a));
    });
}
exports.transformData = transformData;
//# sourceMappingURL=utils.js.map