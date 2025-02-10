"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var g2_1 = require("@antv/g2");
var active_1 = require("./actions/active");
var highlight_1 = require("./actions/highlight");
var selected_1 = require("./actions/selected");
/** ================== 注册交互反馈 aciton ================== */
(0, g2_1.registerAction)('venn-element-active', active_1.VennElementActive);
(0, g2_1.registerAction)('venn-element-highlight', highlight_1.VennElementHighlight);
(0, g2_1.registerAction)('venn-element-selected', selected_1.VennElementSelected);
(0, g2_1.registerAction)('venn-element-single-selected', selected_1.VennElementSingleSelected);
/** ================== 注册交互 ================== */
// ========= Active 交互 =========
(0, g2_1.registerInteraction)('venn-element-active', {
    start: [{ trigger: 'element:mouseenter', action: 'venn-element-active:active' }],
    end: [{ trigger: 'element:mouseleave', action: 'venn-element-active:reset' }],
});
// ========= 高亮 交互 =========
(0, g2_1.registerInteraction)('venn-element-highlight', {
    start: [{ trigger: 'element:mouseenter', action: 'venn-element-highlight:highlight' }],
    end: [{ trigger: 'element:mouseleave', action: 'venn-element-highlight:reset' }],
});
// ========= Selected 交互 =========
// 点击 venn element （可多选）
(0, g2_1.registerInteraction)('venn-element-selected', {
    start: [{ trigger: 'element:click', action: 'venn-element-selected:toggle' }],
    rollback: [{ trigger: 'dblclick', action: ['venn-element-selected:reset'] }],
});
// 点击 venn element （单选）
(0, g2_1.registerInteraction)('venn-element-single-selected', {
    start: [{ trigger: 'element:click', action: 'venn-element-single-selected:toggle' }],
    rollback: [{ trigger: 'dblclick', action: ['venn-element-single-selected:reset'] }],
});
// ========= 韦恩图的图例事件，单独注册 =========
// legend hover，element active
(0, g2_1.registerInteraction)('venn-legend-active', {
    start: [{ trigger: 'legend-item:mouseenter', action: ['list-active:active', 'venn-element-active:active'] }],
    end: [{ trigger: 'legend-item:mouseleave', action: ['list-active:reset', 'venn-element-active:reset'] }],
});
// legend hover，element active
(0, g2_1.registerInteraction)('venn-legend-highlight', {
    start: [
        {
            trigger: 'legend-item:mouseenter',
            action: ['legend-item-highlight:highlight', 'venn-element-highlight:highlight'],
        },
    ],
    end: [{ trigger: 'legend-item:mouseleave', action: ['legend-item-highlight:reset', 'venn-element-highlight:reset'] }],
});
//# sourceMappingURL=index.js.map