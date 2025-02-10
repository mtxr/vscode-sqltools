"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStackedData = exports.getScaleMax = void 0;
var tslib_1 = require("tslib");
function getScaleMax(maxAngle, yField, data) {
    var yData = data.map(function (item) { return item[yField]; }).filter(function (v) { return v !== undefined; });
    var maxValue = yData.length > 0 ? Math.max.apply(Math, yData) : 0;
    var formatRadian = Math.abs(maxAngle) % 360;
    if (!formatRadian) {
        return maxValue;
    }
    return (maxValue * 360) / formatRadian;
}
exports.getScaleMax = getScaleMax;
/**
 * 获取堆叠之后的数据
 */
function getStackedData(data, xField, yField) {
    var stackedData = [];
    data.forEach(function (item) {
        var valueItem = stackedData.find(function (v) { return v[xField] === item[xField]; });
        if (valueItem) {
            valueItem[yField] += item[yField] || null;
        }
        else {
            stackedData.push(tslib_1.__assign({}, item));
        }
    });
    return stackedData;
}
exports.getStackedData = getStackedData;
//# sourceMappingURL=utils.js.map