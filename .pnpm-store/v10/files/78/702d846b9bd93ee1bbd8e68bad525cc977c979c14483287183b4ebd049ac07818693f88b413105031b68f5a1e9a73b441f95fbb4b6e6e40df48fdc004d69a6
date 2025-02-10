"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = void 0;
var plot_1 = require("../../core/plot");
var utils_1 = require("../../utils");
/**
 * 饼图默认配置项
 */
exports.DEFAULT_OPTIONS = (0, utils_1.deepAssign)({}, plot_1.Plot.getDefaultOptions(), {
    legend: {
        position: 'right',
        radio: {},
    },
    tooltip: {
        shared: false,
        showTitle: false,
        showMarkers: false,
    },
    label: {
        layout: { type: 'limit-in-plot', cfg: { action: 'ellipsis' } },
    },
    /** 饼图样式, 不影响暗黑主题 */
    pieStyle: {
        stroke: 'white',
        lineWidth: 1,
    },
    /** 饼图中心文本默认样式 */
    statistic: {
        title: {
            style: { fontWeight: 300, color: '#4B535E', textAlign: 'center', fontSize: '20px', lineHeight: 1 },
        },
        content: {
            style: {
                fontWeight: 'bold',
                color: 'rgba(44,53,66,0.85)',
                textAlign: 'center',
                fontSize: '32px',
                lineHeight: 1,
            },
        },
    },
    /** 默认关闭 text-annotation 动画 */
    theme: {
        components: {
            annotation: {
                text: {
                    animate: false,
                },
            },
        },
    },
});
//# sourceMappingURL=contants.js.map