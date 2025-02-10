import { clamp, get, size, uniq } from '@antv/util';
import { PERCENT, RANGE_TYPE, RANGE_VALUE } from './constants';
/**
 * 将 range 生成为 data 数据
 * @param range
 * @param key
 * @returns {GaugeRangeData}
 */
export function processRangeData(range, percent) {
    return (range
        // 映射为 stack 的数据
        .map(function (r, idx) {
        var _a;
        return _a = {}, _a[RANGE_VALUE] = r - (range[idx - 1] || 0), _a[RANGE_TYPE] = "".concat(idx), _a[PERCENT] = percent, _a;
    }));
}
/**
 * 获取 仪表盘 指针数据
 * @param percent
 */
export function getIndicatorData(percent) {
    var _a;
    return [(_a = {}, _a[PERCENT] = clamp(percent, 0, 1), _a)];
}
/**
 * 获取仪表盘 表盘弧形数据
 * @param percent
 * @param range
 */
export function getRangeData(percent, range) {
    var ticks = get(range, ['ticks'], []);
    var clampTicks = size(ticks) ? uniq(ticks) : [0, clamp(percent, 0, 1), 1];
    if (!clampTicks[0]) {
        clampTicks.shift();
    }
    return processRangeData(clampTicks, percent);
}
//# sourceMappingURL=utils.js.map