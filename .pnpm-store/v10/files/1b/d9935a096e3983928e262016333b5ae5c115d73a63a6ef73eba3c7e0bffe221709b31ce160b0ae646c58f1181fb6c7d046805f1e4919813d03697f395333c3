"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var g2_1 = require("@antv/g2");
var radar_tooltip_action_1 = require("./radar-tooltip-action");
(0, g2_1.registerAction)('radar-tooltip', radar_tooltip_action_1.RadarTooltipAction);
(0, g2_1.registerInteraction)('radar-tooltip', {
    start: [{ trigger: 'plot:mousemove', action: 'radar-tooltip:show' }],
    end: [{ trigger: 'plot:mouseleave', action: 'radar-tooltip:hide' }],
});
//# sourceMappingURL=index.js.map