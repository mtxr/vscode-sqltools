import { head, isNil, last } from '@antv/util';
import extended from '../util/extended';
import interval from '../util/interval';
import strictLimit from '../util/strict-limit';
/**
 * 计算线性的 ticks，使用 wilkinson extended 方法
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
export default function linear(cfg) {
    var min = cfg.min, max = cfg.max, tickCount = cfg.tickCount, nice = cfg.nice, tickInterval = cfg.tickInterval, minLimit = cfg.minLimit, maxLimit = cfg.maxLimit;
    var ticks = extended(min, max, tickCount, nice).ticks;
    if (!isNil(minLimit) || !isNil(maxLimit)) {
        return strictLimit(cfg, head(ticks), last(ticks));
    }
    if (tickInterval) {
        return interval(min, max, tickInterval).ticks;
    }
    return ticks;
}
//# sourceMappingURL=linear.js.map