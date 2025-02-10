"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectedArea = void 0;
var g2_1 = require("@antv/g2");
var INTERACTION_MAP = {
    hover: '__interval-connected-area-hover__',
    click: '__interval-connected-area-click__',
};
var getStartStages = function (trigger, style) {
    if (trigger === 'hover') {
        return [
            {
                trigger: "interval:mouseenter",
                action: ['element-highlight-by-color:highlight', 'element-link-by-color:link'],
                arg: [null, { style: style }],
            },
        ];
    }
    return [
        {
            trigger: "interval:click",
            action: [
                'element-highlight-by-color:clear',
                'element-highlight-by-color:highlight',
                'element-link-by-color:clear',
                'element-link-by-color:unlink',
                'element-link-by-color:link',
            ],
            arg: [null, null, null, null, { style: style }],
        },
    ];
};
/** hover 触发的连通区域交互 */
(0, g2_1.registerInteraction)(INTERACTION_MAP.hover, {
    start: getStartStages(INTERACTION_MAP.hover),
    end: [
        {
            trigger: 'interval:mouseleave',
            action: ['element-highlight-by-color:reset', 'element-link-by-color:unlink'],
        },
    ],
});
/** click 触发的联通区域交互 */
(0, g2_1.registerInteraction)(INTERACTION_MAP.click, {
    start: getStartStages(INTERACTION_MAP.click),
    end: [
        {
            trigger: 'document:mousedown',
            action: ['element-highlight-by-color:clear', 'element-link-by-color:clear'],
        },
    ],
});
/**
 * 返回支持联通区域组件交互的 adaptor，适用于堆叠柱形图/堆叠条形图
 * @param disable
 */
function connectedArea(disable) {
    if (disable === void 0) { disable = false; }
    return function (params) {
        var chart = params.chart, options = params.options;
        var connectedArea = options.connectedArea;
        var clear = function () {
            chart.removeInteraction(INTERACTION_MAP.hover);
            chart.removeInteraction(INTERACTION_MAP.click);
        };
        if (!disable && connectedArea) {
            var trigger = connectedArea.trigger || 'hover';
            clear();
            chart.interaction(INTERACTION_MAP[trigger], {
                start: getStartStages(trigger, connectedArea.style),
            });
        }
        else {
            clear();
        }
        return params;
    };
}
exports.connectedArea = connectedArea;
//# sourceMappingURL=connected-area.js.map