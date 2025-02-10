"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var interval_1 = require("../util/interval");
var pretty_1 = require("../util/pretty");
var strict_limit_1 = require("../util/strict-limit");
/**
 * 计算线性的 ticks，使用 R's pretty 方法
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
function linearPretty(cfg) {
    var min = cfg.min, max = cfg.max, tickCount = cfg.tickCount, tickInterval = cfg.tickInterval, minLimit = cfg.minLimit, maxLimit = cfg.maxLimit;
    var ticks = pretty_1.default(min, max, tickCount).ticks;
    if (!util_1.isNil(minLimit) || !util_1.isNil(maxLimit)) {
        return strict_limit_1.default(cfg, util_1.head(ticks), util_1.last(ticks));
    }
    if (tickInterval) {
        return interval_1.default(min, max, tickInterval).ticks;
    }
    return ticks;
}
exports.default = linearPretty;
//# sourceMappingURL=r-prettry.js.map