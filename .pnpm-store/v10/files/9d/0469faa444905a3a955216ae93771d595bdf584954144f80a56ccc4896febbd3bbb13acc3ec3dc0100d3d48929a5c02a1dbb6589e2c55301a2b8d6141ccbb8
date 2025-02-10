import { calBase } from '../util/math';
import pretty from '../util/pretty';
/**
 * 计算 Pow 的 ticks
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
export default function calculatePowTicks(cfg) {
    var exponent = cfg.exponent, tickCount = cfg.tickCount;
    var max = Math.ceil(calBase(exponent, cfg.max));
    var min = Math.floor(calBase(exponent, cfg.min));
    var ticks = pretty(min, max, tickCount).ticks;
    return ticks.map(function (tick) {
        var factor = tick >= 0 ? 1 : -1;
        return Math.pow(tick, exponent) * factor;
    });
}
//# sourceMappingURL=pow.js.map