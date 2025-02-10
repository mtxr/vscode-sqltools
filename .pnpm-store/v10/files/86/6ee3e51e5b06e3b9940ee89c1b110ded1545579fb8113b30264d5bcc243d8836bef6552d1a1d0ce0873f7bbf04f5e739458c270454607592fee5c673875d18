import { __assign } from "tslib";
import { groupBy, max, min } from '@antv/util';
import pdf from 'pdfast';
import { quantile } from '../../utils/transform/quantile';
export var toBoxValue = function (values) {
    return {
        low: min(values),
        high: max(values),
        q1: quantile(values, 0.25),
        q3: quantile(values, 0.75),
        median: quantile(values, [0.5]),
        minMax: [min(values), max(values)],
        quantile: [quantile(values, 0.25), quantile(values, 0.75)],
    };
};
export var toViolinValue = function (values, pdfOptions) {
    var pdfResults = pdf.create(values, pdfOptions);
    return {
        violinSize: pdfResults.map(function (result) { return result.y; }),
        violinY: pdfResults.map(function (result) { return result.x; }),
    };
};
export var transformViolinData = function (options) {
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
        var group_1 = groupBy(data, xField);
        return Object.keys(group_1).map(function (x) {
            var records = group_1[x];
            var values = records.map(function (record) { return record[yField]; });
            return __assign(__assign({ x: x }, toViolinValue(values, pdfOptions)), toBoxValue(values));
        });
    }
    // 有拆分
    var resultList = [];
    var seriesGroup = groupBy(data, seriesField);
    Object.keys(seriesGroup).forEach(function (series) {
        var group = groupBy(seriesGroup[series], xField);
        return Object.keys(group).forEach(function (key) {
            var _a;
            var records = group[key];
            var values = records.map(function (record) { return record[yField]; });
            resultList.push(__assign(__assign((_a = { x: key }, _a[seriesField] = series, _a), toViolinValue(values, pdfOptions)), toBoxValue(values)));
        });
    });
    return resultList;
};
//# sourceMappingURL=utils.js.map