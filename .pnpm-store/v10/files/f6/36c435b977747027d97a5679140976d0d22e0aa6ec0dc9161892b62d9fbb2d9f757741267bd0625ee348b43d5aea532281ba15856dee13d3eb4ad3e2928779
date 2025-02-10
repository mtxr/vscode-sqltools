"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.RAW_FIELDS = exports.SUNBURST_PATH_FIELD = exports.SUNBURST_Y_FIELD = exports.SUNBURST_ANCESTOR_FIELD = void 0;
var plot_1 = require("../../core/plot");
var utils_1 = require("../../utils");
var util_1 = require("../../utils/hierarchy/util");
/**
 * 祖先节点，非 root 根节点
 */
exports.SUNBURST_ANCESTOR_FIELD = 'ancestor-node';
exports.SUNBURST_Y_FIELD = 'value';
exports.SUNBURST_PATH_FIELD = 'path';
/** 默认的源字段 */
exports.RAW_FIELDS = [
    exports.SUNBURST_PATH_FIELD,
    util_1.NODE_INDEX_FIELD,
    util_1.NODE_ANCESTORS_FIELD,
    util_1.CHILD_NODE_COUNT,
    'name',
    'depth',
    'height',
];
/**
 * 旭日图 默认配置项
 */
exports.DEFAULT_OPTIONS = (0, utils_1.deepAssign)({}, plot_1.Plot.getDefaultOptions(), {
    innerRadius: 0,
    radius: 0.85,
    // 分层配置
    hierarchyConfig: {
        // 数值字段，默认是 value（可配置）
        field: 'value',
    },
    // 组件
    tooltip: {
        shared: true,
        showMarkers: false,
        offset: 20,
        showTitle: false,
    },
    legend: false,
    // 样式设置
    sunburstStyle: {
        lineWidth: 0.5,
        stroke: '#FFF',
    },
    // 默认开启交互
    drilldown: { enabled: true },
});
//# sourceMappingURL=constant.js.map