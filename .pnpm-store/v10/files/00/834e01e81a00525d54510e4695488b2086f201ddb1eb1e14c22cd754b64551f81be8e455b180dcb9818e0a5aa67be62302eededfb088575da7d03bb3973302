"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.axis = exports.meta = void 0;
var tslib_1 = require("tslib");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var pattern_1 = require("../../adaptor/pattern");
var utils_1 = require("../../utils");
var utils_2 = require("./utils");
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var style = options.barStyle, color = options.color, tooltip = options.tooltip, colorField = options.colorField, type = options.type, xField = options.xField, yField = options.yField, data = options.data, shape = options.shape;
    // 处理不合法的数据
    var processData = (0, utils_1.processIllegalData)(data, yField);
    chart.data(processData);
    var p = (0, utils_1.deepAssign)({}, params, {
        options: {
            tooltip: tooltip,
            seriesField: colorField,
            interval: {
                style: style,
                color: color,
                shape: shape || (type === 'line' ? 'line' : 'intervel'),
            },
            // 柱子的一些样式设置：柱子最小宽度、柱子最大宽度、柱子背景
            minColumnWidth: options.minBarWidth,
            maxColumnWidth: options.maxBarWidth,
            columnBackground: options.barBackground,
        },
    });
    (0, geometries_1.interval)(p);
    if (type === 'line') {
        (0, geometries_1.point)({
            chart: chart,
            options: { xField: xField, yField: yField, seriesField: colorField, point: { shape: 'circle', color: color } },
        });
    }
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a;
    var options = params.options;
    var yField = options.yField, xField = options.xField, data = options.data, isStack = options.isStack, isGroup = options.isGroup, colorField = options.colorField, maxAngle = options.maxAngle;
    var actualData = isStack && !isGroup && colorField ? (0, utils_2.getStackedData)(data, xField, yField) : data;
    var processData = (0, utils_1.processIllegalData)(actualData, yField);
    return (0, utils_1.flow)((0, common_1.scale)((_a = {},
        _a[yField] = {
            min: 0,
            max: (0, utils_2.getScaleMax)(maxAngle, yField, processData),
        },
        _a)))(params);
}
exports.meta = meta;
/**
 * coordinate 配置
 * @param params
 */
function coordinate(params) {
    var chart = params.chart, options = params.options;
    var radius = options.radius, innerRadius = options.innerRadius, startAngle = options.startAngle, endAngle = options.endAngle;
    chart
        .coordinate({
        type: 'polar',
        cfg: {
            radius: radius,
            innerRadius: innerRadius,
            startAngle: startAngle,
            endAngle: endAngle,
        },
    })
        .transpose();
    return params;
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xField = options.xField, xAxis = options.xAxis;
    chart.axis(xField, xAxis);
    return params;
}
exports.axis = axis;
/**
 * 数据标签
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, yField = options.yField;
    var intervalGeometry = (0, utils_1.findGeometry)(chart, 'interval');
    // label 为 false, 空 则不显示 label
    if (!label) {
        intervalGeometry.label(false);
    }
    else {
        var callback = label.callback, cfg = tslib_1.__rest(label, ["callback"]);
        intervalGeometry.label({
            fields: [yField],
            callback: callback,
            cfg: tslib_1.__assign(tslib_1.__assign({}, (0, utils_1.transformLabel)(cfg)), { type: 'polar' }),
        });
    }
    return params;
}
/**
 * 图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    return (0, utils_1.flow)((0, pattern_1.pattern)('barStyle'), geometry, meta, axis, coordinate, common_1.interaction, common_1.animation, common_1.theme, common_1.tooltip, common_1.legend, (0, common_1.annotation)(), label)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map