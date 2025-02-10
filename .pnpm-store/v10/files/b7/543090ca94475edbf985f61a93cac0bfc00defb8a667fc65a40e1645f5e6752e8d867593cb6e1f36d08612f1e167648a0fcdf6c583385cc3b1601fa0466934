"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.legend = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
/**
 * geometry 配置处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, sectorStyle = options.sectorStyle, shape = options.shape, color = options.color;
    // 装载数据
    chart.data(data);
    (0, utils_1.flow)(geometries_1.interval)((0, utils_1.deepAssign)({}, params, {
        options: {
            marginRatio: 1,
            interval: {
                style: sectorStyle,
                color: color,
                shape: shape,
            },
        },
    }));
    return params;
}
/**
 * label 配置
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, xField = options.xField;
    var geometry = (0, utils_1.findGeometry)(chart, 'interval');
    // label 为 false 不显示 label
    if (label === false) {
        geometry.label(false);
    }
    else if ((0, util_1.isObject)(label)) {
        var callback = label.callback, fields = label.fields, cfg = tslib_1.__rest(label, ["callback", "fields"]);
        var offset = cfg.offset;
        var layout = cfg.layout;
        // 当 label 在 shape 外部显示时，设置 'limit-in-shape' 会
        // 造成 label 不显示。
        if (offset === undefined || offset >= 0) {
            layout = layout ? ((0, util_1.isArray)(layout) ? layout : [layout]) : [];
            cfg.layout = (0, util_1.filter)(layout, function (v) { return v.type !== 'limit-in-shape'; });
            cfg.layout.length || delete cfg.layout;
        }
        geometry.label({
            fields: fields || [xField],
            callback: callback,
            cfg: (0, utils_1.transformLabel)(cfg),
        });
    }
    else {
        (0, utils_1.log)(utils_1.LEVEL.WARN, label === null, 'the label option must be an Object.');
        geometry.label({ fields: [xField] });
    }
    return params;
}
/**
 * legend 配置
 * @param params
 */
function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, seriesField = options.seriesField;
    if (legend === false) {
        chart.legend(false);
    }
    else if (seriesField) {
        chart.legend(seriesField, legend);
    }
    return params;
}
exports.legend = legend;
/**
 * coord 配置
 * @param params
 */
function coordinate(params) {
    var chart = params.chart, options = params.options;
    var radius = options.radius, innerRadius = options.innerRadius, startAngle = options.startAngle, endAngle = options.endAngle;
    chart.coordinate({
        type: 'polar',
        cfg: {
            radius: radius,
            innerRadius: innerRadius,
            startAngle: startAngle,
            endAngle: endAngle,
        },
    });
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a;
    var options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    return (0, utils_1.flow)((0, common_1.scale)((_a = {},
        _a[xField] = xAxis,
        _a[yField] = yAxis,
        _a)))(params);
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    // 为 falsy 则是不显示轴
    if (!xAxis) {
        chart.axis(xField, false);
    }
    else {
        chart.axis(xField, xAxis);
    }
    if (!yAxis) {
        chart.axis(yField, false);
    }
    else {
        chart.axis(yField, yAxis);
    }
    return params;
}
/**
 * 玫瑰图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    (0, utils_1.flow)((0, common_1.pattern)('sectorStyle'), geometry, meta, label, coordinate, axis, legend, common_1.tooltip, common_1.interaction, common_1.animation, common_1.theme, (0, common_1.annotation)(), common_1.state)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map