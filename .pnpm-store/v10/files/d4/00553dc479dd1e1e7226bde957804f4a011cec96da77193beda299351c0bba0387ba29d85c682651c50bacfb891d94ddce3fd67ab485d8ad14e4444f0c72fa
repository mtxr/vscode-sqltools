"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.MEDIAN_VIEW_ID = exports.QUANTILE_VIEW_ID = exports.MIN_MAX_VIEW_ID = exports.VIOLIN_VIEW_ID = exports.MEDIAN_FIELD = exports.QUANTILE_FIELD = exports.MIN_MAX_FIELD = exports.VIOLIN_SIZE_FIELD = exports.VIOLIN_Y_FIELD = exports.X_FIELD = void 0;
var plot_1 = require("../../core/plot");
var utils_1 = require("../../utils");
exports.X_FIELD = 'x';
exports.VIOLIN_Y_FIELD = 'violinY';
exports.VIOLIN_SIZE_FIELD = 'violinSize';
exports.MIN_MAX_FIELD = 'minMax';
exports.QUANTILE_FIELD = 'quantile';
exports.MEDIAN_FIELD = 'median';
exports.VIOLIN_VIEW_ID = 'violin_view';
exports.MIN_MAX_VIEW_ID = 'min_max_view';
exports.QUANTILE_VIEW_ID = 'quantile_view';
exports.MEDIAN_VIEW_ID = 'median_view';
exports.DEFAULT_OPTIONS = (0, utils_1.deepAssign)({}, plot_1.Plot.getDefaultOptions(), {
    // 多 view 组成，一定要设置 view padding 同步
    syncViewPadding: true,
    // 默认核函数
    kde: {
        type: 'triangular',
        sampleSize: 32,
        width: 3,
    },
    // 默认小提琴轮廓样式
    violinStyle: {
        lineWidth: 1,
        fillOpacity: 0.3,
        strokeOpacity: 0.75,
    },
    // 坐标轴
    xAxis: {
        grid: {
            line: null,
        },
        tickLine: {
            alignTick: false,
        },
    },
    yAxis: {
        grid: {
            line: {
                style: {
                    lineWidth: 0.5,
                    lineDash: [4, 4],
                },
            },
        },
    },
    // 图例
    legend: {
        position: 'top-left',
    },
    // Tooltip
    tooltip: {
        showMarkers: false,
    },
    // 默认区域交互
    // interactions: [{ type: 'active-region' }],
});
//# sourceMappingURL=constant.js.map