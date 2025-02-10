"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = void 0;
var tslib_1 = require("tslib");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
/**
 * geometry 配置处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, lineStyle = options.lineStyle, color = options.color, pointOptions = options.point, areaOptions = options.area;
    chart.data(data);
    // 雷达图 主 geometry
    var primary = (0, utils_1.deepAssign)({}, params, {
        options: {
            line: {
                style: lineStyle,
                color: color,
            },
            point: pointOptions
                ? tslib_1.__assign({ color: color }, pointOptions) : pointOptions,
            area: areaOptions
                ? tslib_1.__assign({ color: color }, areaOptions) : areaOptions,
            // label 不传递给各个 geometry adaptor，由 label adaptor 处理
            label: undefined,
        },
    });
    // 副 Geometry
    var second = (0, utils_1.deepAssign)({}, primary, {
        options: {
            tooltip: false,
        },
    });
    // 优先使用 point.state, 其次取主元素的 state 状态样式配置
    var pointState = (pointOptions === null || pointOptions === void 0 ? void 0 : pointOptions.state) || options.state;
    var pointParams = (0, utils_1.deepAssign)({}, primary, { options: { tooltip: false, state: pointState } });
    (0, geometries_1.line)(primary);
    (0, geometries_1.point)(pointParams);
    (0, geometries_1.area)(second);
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
 * coord 配置
 * @param params
 */
function coord(params) {
    var chart = params.chart, options = params.options;
    var radius = options.radius, startAngle = options.startAngle, endAngle = options.endAngle;
    chart.coordinate('polar', {
        radius: radius,
        startAngle: startAngle,
        endAngle: endAngle,
    });
    return params;
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xField = options.xField, xAxis = options.xAxis, yField = options.yField, yAxis = options.yAxis;
    chart.axis(xField, xAxis);
    chart.axis(yField, yAxis);
    return params;
}
/**
 * label 配置
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, yField = options.yField;
    var geometry = (0, utils_1.findGeometry)(chart, 'line');
    if (!label) {
        geometry.label(false);
    }
    else {
        var fields = label.fields, callback = label.callback, cfg = tslib_1.__rest(label, ["fields", "callback"]);
        geometry.label({
            fields: fields || [yField],
            callback: callback,
            cfg: (0, utils_1.transformLabel)(cfg),
        });
    }
    return params;
}
/**
 * 雷达图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(geometry, meta, common_1.theme, coord, axis, common_1.legend, common_1.tooltip, label, common_1.interaction, common_1.animation, (0, common_1.annotation)())(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map