"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRangeData = exports.getIndicatorData = exports.processRangeData = void 0;
var util_1 = require("@antv/util");
var constants_1 = require("./constants");
/**
 * 将 range 生成为 data 数据
 * @param range
 * @param key
 * @returns {GaugeRangeData}
 */
function processRangeData(range, percent) {
    return (range
        // 映射为 stack 的数据
        .map(function (r, idx) {
        var _a;
        return _a = {}, _a[constants_1.RANGE_VALUE] = r - (range[idx - 1] || 0), _a[constants_1.RANGE_TYPE] = "".concat(idx), _a[constants_1.PERCENT] = percent, _a;
    }));
}
exports.processRangeData = processRangeData;
/**
 * 获取 仪表盘 指针数据
 * @param percent
 */
function getIndicatorData(percent) {
    var _a;
    return [(_a = {}, _a[constants_1.PERCENT] = (0, util_1.clamp)(percent, 0, 1), _a)];
}
exports.getIndicatorData = getIndicatorData;
/**
 * 获取仪表盘 表盘弧形数据
 * @param percent
 * @param range
 */
function getRangeData(percent, range) {
    var ticks = (0, util_1.get)(range, ['ticks'], []);
    var clampTicks = (0, util_1.size)(ticks) ? (0, util_1.uniq)(ticks) : [0, (0, util_1.clamp)(percent, 0, 1), 1];
    if (!clampTicks[0]) {
        clampTicks.shift();
    }
    return processRangeData(clampTicks, percent);
}
exports.getRangeData = getRangeData;
//# sourceMappingURL=utils.js.map