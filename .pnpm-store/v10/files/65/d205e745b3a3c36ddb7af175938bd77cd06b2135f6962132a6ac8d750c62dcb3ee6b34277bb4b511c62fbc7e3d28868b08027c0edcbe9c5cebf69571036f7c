"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.PLOYGON_Y = exports.PLOYGON_X = exports.FUNNEL_TOTAL_PERCENT = exports.FUNNEL_CONVERSATION = exports.FUNNEL_MAPPING_VALUE = exports.FUNNEL_PERCENT = void 0;
// 漏斗占比: data[n][yField] / data[0][yField]
exports.FUNNEL_PERCENT = '$$percentage$$';
// 漏斗映射值
exports.FUNNEL_MAPPING_VALUE = '$$mappingValue$$';
// 漏斗转化率: data[n][yField] / data[n-1][yField];
exports.FUNNEL_CONVERSATION = '$$conversion$$';
// 漏斗单项占总体和的百分比，用于动态漏斗图计算高度：
// data[n][yField] / sum(data[0-n][yField])
exports.FUNNEL_TOTAL_PERCENT = '$$totalPercentage$$';
// 漏斗多边型 x 坐标
exports.PLOYGON_X = '$$x$$';
exports.PLOYGON_Y = '$$y$$';
/**
 * 漏斗图 默认配置项
 */
exports.DEFAULT_OPTIONS = {
    appendPadding: [0, 80],
    minSize: 0,
    maxSize: 1,
    meta: (_a = {},
        _a[exports.FUNNEL_MAPPING_VALUE] = {
            min: 0,
            max: 1,
            nice: false,
        },
        _a),
    label: {
        style: {
            fill: '#fff',
            fontSize: 12,
        },
    },
    tooltip: {
        showTitle: false,
        showMarkers: false,
        shared: false,
    },
    conversionTag: {
        offsetX: 10,
        offsetY: 0,
        style: {
            fontSize: 12,
            fill: 'rgba(0,0,0,0.45)',
        },
    },
};
//# sourceMappingURL=constant.js.map