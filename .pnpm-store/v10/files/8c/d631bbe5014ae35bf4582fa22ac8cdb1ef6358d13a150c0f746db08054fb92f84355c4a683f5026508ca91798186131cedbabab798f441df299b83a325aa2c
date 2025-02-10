import { head, isNil, last } from '@antv/util';
import interval from '../util/interval';
import pretty from '../util/pretty';
import strictLimit from '../util/strict-limit';
/**
 * 计算线性的 ticks，使用 R's pretty 方法
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
export default function linearPretty(cfg) {
    var min = cfg.min, max = cfg.max, tickCount = cfg.tickCount, tickInterval = cfg.tickInterval, minLimit = cfg.minLimit, maxLimit = cfg.maxLimit;
    var ticks = pretty(min, max, tickCount).ticks;
    if (!isNil(minLimit) || !isNil(maxLimit)) {
        return strictLimit(cfg, head(ticks), last(ticks));
    }
    if (tickInterval) {
        return interval(min, max, tickInterval).ticks;
    }
    return ticks;
}
//# sourceMappingURL=r-prettry.js.map