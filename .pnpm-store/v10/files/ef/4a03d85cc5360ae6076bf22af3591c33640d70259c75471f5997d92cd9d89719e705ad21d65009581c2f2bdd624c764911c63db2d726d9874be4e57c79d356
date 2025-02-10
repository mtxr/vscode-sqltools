"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var d3_linear_1 = require("../util/d3-linear");
var interval_1 = require("../util/interval");
var strict_limit_1 = require("../util/strict-limit");
function d3LinearTickMethod(cfg) {
    var min = cfg.min, max = cfg.max, tickInterval = cfg.tickInterval, minLimit = cfg.minLimit, maxLimit = cfg.maxLimit;
    var ticks = d3_linear_1.default(cfg);
    if (!util_1.isNil(minLimit) || !util_1.isNil(maxLimit)) {
        return strict_limit_1.default(cfg, util_1.head(ticks), util_1.last(ticks));
    }
    if (tickInterval) {
        return interval_1.default(min, max, tickInterval).ticks;
    }
    return ticks;
}
exports.default = d3LinearTickMethod;
//# sourceMappingURL=d3-linear.js.map