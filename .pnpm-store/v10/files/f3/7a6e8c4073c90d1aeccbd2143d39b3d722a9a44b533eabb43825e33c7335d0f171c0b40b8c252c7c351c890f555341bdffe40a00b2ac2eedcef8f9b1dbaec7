"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var extended_1 = require("../util/extended");
var interval_1 = require("../util/interval");
var strict_limit_1 = require("../util/strict-limit");
/**
 * 计算线性的 ticks，使用 wilkinson extended 方法
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
function linear(cfg) {
    var min = cfg.min, max = cfg.max, tickCount = cfg.tickCount, nice = cfg.nice, tickInterval = cfg.tickInterval, minLimit = cfg.minLimit, maxLimit = cfg.maxLimit;
    var ticks = extended_1.default(min, max, tickCount, nice).ticks;
    if (!util_1.isNil(minLimit) || !util_1.isNil(maxLimit)) {
        return strict_limit_1.default(cfg, util_1.head(ticks), util_1.last(ticks));
    }
    if (tickInterval) {
        return interval_1.default(min, max, tickInterval).ticks;
    }
    return ticks;
}
exports.default = linear;
//# sourceMappingURL=linear.js.map