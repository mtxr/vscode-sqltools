"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.OUTLIERS_VIEW_ID = exports.BOX_SYNC_NAME = exports.BOX_RANGE_ALIAS = exports.BOX_RANGE = void 0;
var plot_1 = require("../../core/plot");
var utils_1 = require("../../utils");
exports.BOX_RANGE = '$$range$$';
exports.BOX_RANGE_ALIAS = 'low-q1-median-q3-high';
exports.BOX_SYNC_NAME = '$$y_outliers$$';
exports.OUTLIERS_VIEW_ID = 'outliers_view';
/**
 * 面积图默认配置项
 */
exports.DEFAULT_OPTIONS = (0, utils_1.deepAssign)({}, plot_1.Plot.getDefaultOptions(), {
    meta: (_a = {},
        _a[exports.BOX_RANGE] = { min: 0, alias: exports.BOX_RANGE_ALIAS },
        _a),
    // 默认区域交互
    interactions: [{ type: 'active-region' }],
    // 默认 tooltips 共享，不显示 markers
    tooltip: {
        showMarkers: false,
        shared: true,
    },
    boxStyle: {
        lineWidth: 1,
    },
});
//# sourceMappingURL=constant.js.map