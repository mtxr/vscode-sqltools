"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
/**
 * 计算分类 ticks
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
function calculateCatTicks(cfg) {
    var values = cfg.values, tickInterval = cfg.tickInterval, tickCount = cfg.tickCount, showLast = cfg.showLast;
    if (util_1.isNumber(tickInterval)) {
        var ticks_1 = util_1.filter(values, function (__, i) { return i % tickInterval === 0; });
        var lastValue = util_1.last(values);
        if (showLast && util_1.last(ticks_1) !== lastValue) {
            ticks_1.push(lastValue);
        }
        return ticks_1;
    }
    var len = values.length;
    var min = cfg.min, max = cfg.max;
    if (util_1.isNil(min)) {
        min = 0;
    }
    if (util_1.isNil(max)) {
        max = values.length - 1;
    }
    if (!util_1.isNumber(tickCount) || tickCount >= len)
        return values.slice(min, max + 1);
    if (tickCount <= 0 || max <= 0)
        return [];
    var interval = tickCount === 1 ? len : Math.floor(len / (tickCount - 1));
    var ticks = [];
    var idx = min;
    for (var i = 0; i < tickCount; i++) {
        if (idx >= max)
            break;
        idx = Math.min(min + i * interval, max);
        if (i === tickCount - 1 && showLast)
            ticks.push(values[max]);
        else
            ticks.push(values[idx]);
    }
    return ticks;
}
exports.default = calculateCatTicks;
//# sourceMappingURL=cat.js.map