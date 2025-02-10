import { head, isNil, last } from '@antv/util';
import d3Linear from '../util/d3-linear';
import interval from '../util/interval';
import strictLimit from '../util/strict-limit';
export default function d3LinearTickMethod(cfg) {
    var min = cfg.min, max = cfg.max, tickInterval = cfg.tickInterval, minLimit = cfg.minLimit, maxLimit = cfg.maxLimit;
    var ticks = d3Linear(cfg);
    if (!isNil(minLimit) || !isNil(maxLimit)) {
        return strictLimit(cfg, head(ticks), last(ticks));
    }
    if (tickInterval) {
        return interval(min, max, tickInterval).ticks;
    }
    return ticks;
}
//# sourceMappingURL=d3-linear.js.map