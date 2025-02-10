"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var time_1 = require("../util/time");
function calculateTimeTicks(cfg) {
    var min = cfg.min, max = cfg.max, minTickInterval = cfg.minTickInterval;
    var tickInterval = cfg.tickInterval;
    var tickCount = cfg.tickCount;
    // 指定 tickInterval 后 tickCount 不生效，需要重新计算
    if (tickInterval) {
        tickCount = Math.ceil((max - min) / tickInterval);
    }
    else {
        tickInterval = time_1.getTickInterval(min, max, tickCount)[1];
        var count = (max - min) / tickInterval;
        var ratio = count / tickCount;
        if (ratio > 1) {
            tickInterval = tickInterval * Math.ceil(ratio);
        }
        // 如果设置了最小间距，则使用最小间距
        if (minTickInterval && tickInterval < minTickInterval) {
            tickInterval = minTickInterval;
        }
    }
    tickInterval = Math.max(Math.floor((max - min) / (Math.pow(2, 12) - 1)), tickInterval);
    var ticks = [];
    for (var i = min; i < max + tickInterval; i += tickInterval) {
        ticks.push(i);
    }
    return ticks;
}
exports.default = calculateTimeTicks;
//# sourceMappingURL=time.js.map