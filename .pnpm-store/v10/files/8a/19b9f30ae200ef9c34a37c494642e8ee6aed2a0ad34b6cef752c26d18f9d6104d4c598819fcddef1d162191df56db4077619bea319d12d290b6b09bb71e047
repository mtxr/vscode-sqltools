"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = void 0;
var tslib_1 = require("tslib");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var pattern_1 = require("../../adaptor/pattern");
var utils_1 = require("../../utils");
var histogram_1 = require("../../utils/transform/histogram");
var constant_1 = require("./constant");
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, binField = options.binField, binNumber = options.binNumber, binWidth = options.binWidth, color = options.color, stackField = options.stackField, legend = options.legend, columnStyle = options.columnStyle;
    // 处理数据
    var plotData = (0, histogram_1.binHistogram)(data, binField, binWidth, binNumber, stackField);
    chart.data(plotData);
    var p = (0, utils_1.deepAssign)({}, params, {
        options: {
            xField: constant_1.HISTOGRAM_X_FIELD,
            yField: constant_1.HISTOGRAM_Y_FIELD,
            seriesField: stackField,
            isStack: true,
            interval: {
                color: color,
                style: columnStyle,
            },
        },
    });
    (0, geometries_1.interval)(p);
    // 图例
    if (legend && stackField) {
        chart.legend(stackField, legend);
    }
    else {
        chart.legend(false);
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
    var xAxis = options.xAxis, yAxis = options.yAxis;
    return (0, utils_1.flow)((0, common_1.scale)((_a = {},
        _a[constant_1.HISTOGRAM_X_FIELD] = xAxis,
        _a[constant_1.HISTOGRAM_Y_FIELD] = yAxis,
        _a)))(params);
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis;
    // 为 false 则是不显示轴
    if (xAxis === false) {
        chart.axis(constant_1.HISTOGRAM_X_FIELD, false);
    }
    else {
        chart.axis(constant_1.HISTOGRAM_X_FIELD, xAxis);
    }
    if (yAxis === false) {
        chart.axis(constant_1.HISTOGRAM_Y_FIELD, false);
    }
    else {
        chart.axis(constant_1.HISTOGRAM_Y_FIELD, yAxis);
    }
    return params;
}
/**
 * label 配置
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label;
    var geometry = (0, utils_1.findGeometry)(chart, 'interval');
    if (!label) {
        geometry.label(false);
    }
    else {
        var callback = label.callback, cfg = tslib_1.__rest(label, ["callback"]);
        geometry.label({
            fields: [constant_1.HISTOGRAM_Y_FIELD],
            callback: callback,
            cfg: (0, utils_1.transformLabel)(cfg),
        });
    }
    return params;
}
/**
 * 直方图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(common_1.theme, (0, pattern_1.pattern)('columnStyle'), geometry, meta, axis, common_1.state, label, common_1.tooltip, common_1.interaction, common_1.animation)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map