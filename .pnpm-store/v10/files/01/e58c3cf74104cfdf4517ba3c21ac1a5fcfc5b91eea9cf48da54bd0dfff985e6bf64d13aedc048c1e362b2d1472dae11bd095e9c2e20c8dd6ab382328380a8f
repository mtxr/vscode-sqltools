"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var math_1 = require("../util/math");
var pretty_1 = require("../util/pretty");
/**
 * 计算 Pow 的 ticks
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
function calculatePowTicks(cfg) {
    var exponent = cfg.exponent, tickCount = cfg.tickCount;
    var max = Math.ceil(math_1.calBase(exponent, cfg.max));
    var min = Math.floor(math_1.calBase(exponent, cfg.min));
    var ticks = pretty_1.default(min, max, tickCount).ticks;
    return ticks.map(function (tick) {
        var factor = tick >= 0 ? 1 : -1;
        return Math.pow(tick, exponent) * factor;
    });
}
exports.default = calculatePowTicks;
//# sourceMappingURL=pow.js.map