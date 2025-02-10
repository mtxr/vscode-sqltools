"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicFunnel = exports.conversionTag = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../../../adaptor/geometries/base");
var utils_1 = require("../../../utils");
var tooltip_1 = require("../../../utils/tooltip");
var constant_1 = require("../constant");
var common_1 = require("./common");
/**
 * 处理字段数据
 * @param params
 */
function field(params) {
    var chart = params.chart, options = params.options;
    var _a = options.data, data = _a === void 0 ? [] : _a, yField = options.yField, maxSize = options.maxSize, minSize = options.minSize;
    var formatData = (0, common_1.transformData)(data, data, {
        yField: yField,
        maxSize: maxSize,
        minSize: minSize,
    });
    // 绘制漏斗图
    chart.data(formatData);
    return params;
}
/**
 * geometry处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var xField = options.xField, yField = options.yField, color = options.color, tooltip = options.tooltip, label = options.label, _a = options.shape, shape = _a === void 0 ? 'funnel' : _a, funnelStyle = options.funnelStyle, state = options.state;
    var _b = (0, tooltip_1.getTooltipMapping)(tooltip, [xField, yField]), fields = _b.fields, formatter = _b.formatter;
    (0, base_1.geometry)({
        chart: chart,
        options: {
            type: 'interval',
            xField: xField,
            yField: constant_1.FUNNEL_MAPPING_VALUE,
            colorField: xField,
            tooltipFields: (0, util_1.isArray)(fields) && fields.concat([constant_1.FUNNEL_PERCENT, constant_1.FUNNEL_CONVERSATION]),
            mapping: {
                shape: shape,
                tooltip: formatter,
                color: color,
                style: funnelStyle,
            },
            label: label,
            state: state,
        },
    });
    var geo = (0, utils_1.findGeometry)(params.chart, 'interval');
    geo.adjust('symmetric');
    return params;
}
/**
 * 转置处理
 * @param params
 */
function transpose(params) {
    var chart = params.chart, options = params.options;
    var isTransposed = options.isTransposed;
    chart.coordinate({
        type: 'rect',
        actions: !isTransposed ? [['transpose'], ['scale', 1, -1]] : [],
    });
    return params;
}
/**
 * 转化率组件
 * @param params
 */
function conversionTag(params) {
    var options = params.options, chart = params.chart;
    var maxSize = options.maxSize;
    // 获取形状位置，再转化为需要的转化率位置
    var dataArray = (0, util_1.get)(chart, ['geometries', '0', 'dataArray'], []);
    var size = (0, util_1.get)(chart, ['options', 'data', 'length']);
    var x = (0, util_1.map)(dataArray, function (item) { return (0, util_1.get)(item, ['0', 'nextPoints', '0', 'x']) * size - 0.5; });
    var getLineCoordinate = function (datum, datumIndex, data, initLineOption) {
        var percent = maxSize - (maxSize - datum[constant_1.FUNNEL_MAPPING_VALUE]) / 2;
        return tslib_1.__assign(tslib_1.__assign({}, initLineOption), { start: [x[datumIndex - 1] || datumIndex - 0.5, percent], end: [x[datumIndex - 1] || datumIndex - 0.5, percent + 0.05] });
    };
    (0, common_1.conversionTagComponent)(getLineCoordinate)(params);
    return params;
}
exports.conversionTag = conversionTag;
/**
 * 基础漏斗
 * @param chart
 * @param options
 */
function basicFunnel(params) {
    return (0, utils_1.flow)(field, geometry, transpose, conversionTag)(params);
}
exports.basicFunnel = basicFunnel;
//# sourceMappingURL=basic.js.map