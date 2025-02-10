"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.adjust = exports.legend = exports.axis = exports.meta = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var data_1 = require("../../utils/data");
/**
 * geometry 配置处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, color = options.color, lineStyle = options.lineStyle, lineShape = options.lineShape, pointMapping = options.point, areaMapping = options.area, seriesField = options.seriesField;
    var pointState = pointMapping === null || pointMapping === void 0 ? void 0 : pointMapping.state;
    var areaState = areaMapping === null || areaMapping === void 0 ? void 0 : areaMapping.state;
    chart.data(data);
    // line geometry 处理
    var primary = (0, utils_1.deepAssign)({}, params, {
        options: {
            shapeField: seriesField,
            line: {
                color: color,
                style: lineStyle,
                shape: lineShape,
            },
            // 颜色保持一致，因为如果颜色不一致，会导致 tooltip 中元素重复。
            // 如果存在，才设置，否则为空
            point: pointMapping && tslib_1.__assign({ color: color, shape: 'circle' }, pointMapping),
            // 面积配置
            area: areaMapping && tslib_1.__assign({ color: color }, areaMapping),
            // label 不传递给各个 geometry adaptor，由 label adaptor 处理
            label: undefined,
        },
    });
    var second = (0, utils_1.deepAssign)({}, primary, { options: { tooltip: false, state: pointState } });
    var areaParams = (0, utils_1.deepAssign)({}, primary, { options: { tooltip: false, state: areaState } });
    (0, geometries_1.line)(primary);
    (0, geometries_1.point)(second);
    (0, geometries_1.area)(areaParams);
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a, _b;
    var options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField, data = options.data;
    return (0, utils_1.flow)((0, common_1.scale)((_a = {},
        _a[xField] = xAxis,
        _a[yField] = yAxis,
        _a), (_b = {},
        _b[xField] = {
            type: 'cat',
        },
        _b[yField] = (0, data_1.adjustYMetaByZero)(data, yField),
        _b)))(params);
}
exports.meta = meta;
/**
 * 坐标系配置. 支持 reflect 镜像处理
 * @param params
 */
function coordinate(params) {
    var chart = params.chart, options = params.options;
    var reflect = options.reflect;
    if (reflect) {
        var p = reflect;
        if (!(0, util_1.isArray)(p)) {
            p = [p];
        }
        var actions = p.map(function (d) { return ['reflect', d]; });
        chart.coordinate({ type: 'rect', actions: actions });
    }
    return params;
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    // 为 false 则是不显示轴
    if (xAxis === false) {
        chart.axis(xField, false);
    }
    else {
        chart.axis(xField, xAxis);
    }
    if (yAxis === false) {
        chart.axis(yField, false);
    }
    else {
        chart.axis(yField, yAxis);
    }
    return params;
}
exports.axis = axis;
/**
 * legend 配置
 * @param params
 */
function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, seriesField = options.seriesField;
    if (legend && seriesField) {
        chart.legend(seriesField, legend);
    }
    else if (legend === false) {
        chart.legend(false);
    }
    return params;
}
exports.legend = legend;
/**
 * 数据标签
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, yField = options.yField;
    var lineGeometry = (0, utils_1.findGeometry)(chart, 'line');
    // label 为 false, 空 则不显示 label
    if (!label) {
        lineGeometry.label(false);
    }
    else {
        var fields = label.fields, callback = label.callback, cfg = tslib_1.__rest(label, ["fields", "callback"]);
        lineGeometry.label({
            fields: fields || [yField],
            callback: callback,
            cfg: tslib_1.__assign({ layout: [
                    { type: 'limit-in-plot' },
                    { type: 'path-adjust-position' },
                    { type: 'point-adjust-position' },
                    { type: 'limit-in-plot', cfg: { action: 'hide' } },
                ] }, (0, utils_1.transformLabel)(cfg)),
        });
    }
    return params;
}
/**
 * 统一处理 adjust
 * @param params
 */
function adjust(params) {
    var chart = params.chart, options = params.options;
    var isStack = options.isStack;
    if (isStack) {
        (0, util_1.each)(chart.geometries, function (g) {
            g.adjust('stack');
        });
    }
    return params;
}
exports.adjust = adjust;
/**
 * 折线图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(geometry, meta, adjust, common_1.theme, coordinate, axis, legend, common_1.tooltip, label, common_1.slider, common_1.scrollbar, common_1.interaction, common_1.animation, (0, common_1.annotation)(), common_1.limitInPlot)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map