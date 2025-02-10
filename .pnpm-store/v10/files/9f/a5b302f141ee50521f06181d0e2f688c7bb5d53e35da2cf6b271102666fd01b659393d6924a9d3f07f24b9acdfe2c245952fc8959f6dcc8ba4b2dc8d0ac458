"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformViolinData = exports.toViolinValue = exports.toBoxValue = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var pdfast_1 = tslib_1.__importDefault(require("pdfast"));
var quantile_1 = require("../../utils/transform/quantile");
var toBoxValue = function (values) {
    return {
        low: (0, util_1.min)(values),
        high: (0, util_1.max)(values),
        q1: (0, quantile_1.quantile)(values, 0.25),
        q3: (0, quantile_1.quantile)(values, 0.75),
        median: (0, quantile_1.quantile)(values, [0.5]),
        minMax: [(0, util_1.min)(values), (0, util_1.max)(values)],
        quantile: [(0, quantile_1.quantile)(values, 0.25), (0, quantile_1.quantile)(values, 0.75)],
    };
};
exports.toBoxValue = toBoxValue;
var toViolinValue = function (values, pdfOptions) {
    var pdfResults = pdfast_1.default.create(values, pdfOptions);
    return {
        violinSize: pdfResults.map(function (result) { return result.y; }),
        violinY: pdfResults.map(function (result) { return result.x; }),
    };
};
exports.toViolinValue = toViolinValue;
var transformViolinData = function (options) {
    var xField = options.xField, yField = options.yField, seriesField = options.seriesField, data = options.data, kde = options.kde;
    /** 生成概率密度函数的配置 */
    var pdfOptions = {
        min: kde.min,
        max: kde.max,
        size: kde.sampleSize,
        width: kde.width,
    };
    // 无拆分
    if (!seriesField) {
        var group_1 = (0, util_1.groupBy)(data, xField);
        return Object.keys(group_1).map(function (x) {
            var records = group_1[x];
            var values = records.map(function (record) { return record[yField]; });
            return tslib_1.__assign(tslib_1.__assign({ x: x }, (0, exports.toViolinValue)(values, pdfOptions)), (0, exports.toBoxValue)(values));
        });
    }
    // 有拆分
    var resultList = [];
    var seriesGroup = (0, util_1.groupBy)(data, seriesField);
    Object.keys(seriesGroup).forEach(function (series) {
        var group = (0, util_1.groupBy)(seriesGroup[series], xField);
        return Object.keys(group).forEach(function (key) {
            var _a;
            var records = group[key];
            var values = records.map(function (record) { return record[yField]; });
            resultList.push(tslib_1.__assign(tslib_1.__assign((_a = { x: key }, _a[seriesField] = series, _a), (0, exports.toViolinValue)(values, pdfOptions)), (0, exports.toBoxValue)(values)));
        });
    });
    return resultList;
};
exports.transformViolinData = transformViolinData;
//# sourceMappingURL=utils.js.map