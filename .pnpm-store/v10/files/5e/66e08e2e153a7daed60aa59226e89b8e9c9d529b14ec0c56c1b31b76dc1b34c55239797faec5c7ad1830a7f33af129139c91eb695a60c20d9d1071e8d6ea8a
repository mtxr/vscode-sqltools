import { __assign } from "tslib";
import { get, isNumber, isObject, isUndefined, reduce } from '@antv/util';
import { LEVEL, log } from '../../utils';
import { ABSOLUTE_FIELD, DIFF_FIELD, IS_TOTAL, Y_FIELD } from './constant';
/**
 * @desc 数据处理函数，统一将数据处理成[start, end]
 * @param data
 * @param xField
 * @param yField
 * @param totalLabel
 */
export function processData(data, xField, yField, newYField, total) {
    var _a;
    var newData = [];
    reduce(data, function (r, d) {
        var _a;
        // 校验数据合法性
        log(LEVEL.WARN, isNumber(d[yField]), "".concat(d[yField], " is not a valid number"));
        var value = isUndefined(d[yField]) ? null : d[yField];
        newData.push(__assign(__assign({}, d), (_a = {}, _a[newYField] = [r, r + value], _a)));
        return r + value;
    }, 0);
    // 如果需要展示总和
    if (newData.length && total) {
        var sum = get(newData, [[data.length - 1], newYField, [1]]);
        newData.push((_a = {},
            _a[xField] = total.label,
            _a[yField] = sum,
            _a[newYField] = [0, sum],
            _a));
    }
    return newData;
}
/**
 * 处理为 瀑布图 数据
 */
export function transformData(data, xField, yField, total) {
    var processed = processData(data, xField, yField, Y_FIELD, total);
    return processed.map(function (d, dIdx) {
        var _a;
        if (!isObject(d)) {
            return d;
        }
        return __assign(__assign({}, d), (_a = {}, _a[ABSOLUTE_FIELD] = d[Y_FIELD][1], _a[DIFF_FIELD] = d[Y_FIELD][1] - d[Y_FIELD][0], _a[IS_TOTAL] = dIdx === data.length, _a));
    });
}
//# sourceMappingURL=utils.js.map