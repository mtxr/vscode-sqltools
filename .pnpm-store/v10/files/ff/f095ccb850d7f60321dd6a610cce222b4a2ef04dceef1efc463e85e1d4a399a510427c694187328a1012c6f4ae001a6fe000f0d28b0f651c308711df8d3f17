"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PIE_STATISTIC = void 0;
var g2_1 = require("@antv/g2");
var legend_active_1 = require("./actions/legend-active");
var statistic_active_1 = require("./actions/statistic-active");
exports.PIE_STATISTIC = 'pie-statistic';
(0, g2_1.registerAction)(exports.PIE_STATISTIC, statistic_active_1.StatisticAction);
(0, g2_1.registerInteraction)('pie-statistic-active', {
    start: [{ trigger: 'element:mouseenter', action: 'pie-statistic:change' }],
    end: [{ trigger: 'element:mouseleave', action: 'pie-statistic:reset' }],
});
(0, g2_1.registerAction)('pie-legend', legend_active_1.PieLegendAction);
(0, g2_1.registerInteraction)('pie-legend-active', {
    start: [{ trigger: 'legend-item:mouseenter', action: 'pie-legend:active' }],
    end: [{ trigger: 'legend-item:mouseleave', action: 'pie-legend:reset' }],
});
//# sourceMappingURL=index.js.map