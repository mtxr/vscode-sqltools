"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
/**
 * 按照给定的 minLimit/maxLimit/tickCount 均匀计算出刻度 ticks
 *
 * @param cfg Scale 配置项
 * @return ticks
 */
function strictLimit(cfg, defaultMin, defaultMax) {
    var _a;
    var minLimit = cfg.minLimit, maxLimit = cfg.maxLimit, min = cfg.min, max = cfg.max, _b = cfg.tickCount, tickCount = _b === void 0 ? 5 : _b;
    var tickMin = util_1.isNil(minLimit) ? (util_1.isNil(defaultMin) ? min : defaultMin) : minLimit;
    var tickMax = util_1.isNil(maxLimit) ? (util_1.isNil(defaultMax) ? max : defaultMax) : maxLimit;
    if (tickMin > tickMax) {
        _a = [tickMin, tickMax], tickMax = _a[0], tickMin = _a[1];
    }
    if (tickCount <= 2) {
        return [tickMin, tickMax];
    }
    var step = (tickMax - tickMin) / (tickCount - 1);
    var ticks = [];
    for (var i = 0; i < tickCount; i++) {
        ticks.push(tickMin + step * i);
    }
    return ticks;
}
exports.default = strictLimit;
//# sourceMappingURL=strict-limit.js.map