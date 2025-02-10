import { __assign } from "tslib";
import { map, reduce } from '@antv/util';
import { isRealNumber } from '../number';
/**
 * 对数据进行百分比化
 * @param data
 * @param measure
 * @param groupField
 * @param as
 */
export function percent(data, measure, groupField, as) {
    // 1. 先计算每一个分组的 max 值
    var sumMap = reduce(data, function (map, datum) {
        var groupValue = datum[groupField];
        var sum = map.has(groupValue) ? map.get(groupValue) : 0;
        var v = datum[measure];
        sum = isRealNumber(v) ? sum + v : sum;
        map.set(groupValue, sum);
        return map;
    }, new Map());
    // 2. 循环数组，计算占比
    return map(data, function (datum) {
        var _a;
        var v = datum[measure];
        var groupValue = datum[groupField];
        var percentage = isRealNumber(v) && sumMap.get(groupValue) !== 0 ? v / sumMap.get(groupValue) : 0;
        return __assign(__assign({}, datum), (_a = {}, _a[as] = percentage, _a));
    });
}
/**
 * 对数据进行深层百分比化
 * @param data
 * @param measure  // 数值
 * @param fields // 需要分组的 field值
 * @param as // 存储percent 百分比的值
 */
export function getDeepPercent(data, measure, fields, percent) {
    var sumMap = reduce(data, function (map, datum) {
        // 获取分组得到的枚举key值
        var groupValue = reduce(fields, function (value, field) { return "".concat(value).concat(datum[field]); }, '');
        var sum = map.has(groupValue) ? map.get(groupValue) : 0;
        var v = datum[measure];
        sum = isRealNumber(v) ? sum + v : sum;
        map.set(groupValue, sum);
        return map;
    }, new Map());
    // 2. 循环数组，计算占比
    return map(data, function (datum) {
        var _a;
        var v = datum[measure];
        // 获取分组得到的枚举key值
        var groupValue = reduce(fields, function (value, field) { return "".concat(value).concat(datum[field]); }, '');
        var percentage = isRealNumber(v) && sumMap.get(groupValue) !== 0 ? v / sumMap.get(groupValue) : 0;
        return __assign(__assign({}, datum), (_a = {}, _a[percent] = percentage, _a));
    });
}
/**
 * 获取数据，如果是百分比，进行数据转换 (适用于面积图、柱状图、条形图)
 * @param isPercent 是否百分比
 */
export function getDataWhetherPercentage(data, yField, groupField, asField, isPercent) {
    return !isPercent ? data : percent(data, yField, groupField, asField);
}
//# sourceMappingURL=percent.js.map