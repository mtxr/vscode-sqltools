"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.tooltip = exports.meta = exports.transformOptions = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var brush_1 = require("../../adaptor/brush");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var util_2 = require("./util");
/**
 * 散点图默认美观
 * ① data.length === 1 ② 所有数据 y 值相等 ③ 所有数据 x 值相等
 * @param params
 * @returns params
 */
function transformOptions(options) {
    var _a = options.data, data = _a === void 0 ? [] : _a, xField = options.xField, yField = options.yField;
    if (data.length) {
        // x y 字段知否只有一个值，如果只有一个值，则进行优化
        var isOneX = true;
        var isOneY = true;
        var prev = data[0];
        var curr = void 0;
        for (var i = 1; i < data.length; i++) {
            curr = data[i];
            if (prev[xField] !== curr[xField]) {
                isOneX = false;
            }
            if (prev[yField] !== curr[yField]) {
                isOneY = false;
            }
            // 如果都不是 oneValue，那么可提前跳出循环
            if (!isOneX && !isOneY) {
                break;
            }
            prev = curr;
        }
        var keys = [];
        isOneX && keys.push(xField);
        isOneY && keys.push(yField);
        var meta_1 = (0, utils_1.pick)((0, util_2.getMeta)(options), keys);
        return (0, utils_1.deepAssign)({}, options, { meta: meta_1 });
    }
    return options;
}
exports.transformOptions = transformOptions;
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, type = options.type, color = options.color, shape = options.shape, pointStyle = options.pointStyle, shapeField = options.shapeField, colorField = options.colorField, xField = options.xField, yField = options.yField, sizeField = options.sizeField;
    var size = options.size;
    var tooltip = options.tooltip;
    if (sizeField) {
        if (!size) {
            size = [2, 8];
        }
        if ((0, util_1.isNumber)(size)) {
            size = [size, size];
        }
    }
    if (tooltip && !tooltip.fields) {
        tooltip = tslib_1.__assign(tslib_1.__assign({}, tooltip), { fields: [xField, yField, colorField, sizeField, shapeField] });
    }
    // 数据
    chart.data(data);
    // geometry
    (0, geometries_1.point)((0, utils_1.deepAssign)({}, params, {
        options: {
            seriesField: colorField,
            point: {
                color: color,
                shape: shape,
                size: size,
                style: pointStyle,
            },
            tooltip: tooltip,
        },
    }));
    var geometry = (0, utils_1.findGeometry)(chart, 'point');
    // 数据调整
    if (type) {
        geometry.adjust(type);
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
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    var newOptions = transformOptions(options);
    return (0, utils_1.flow)((0, common_1.scale)((_a = {},
        _a[xField] = xAxis,
        _a[yField] = yAxis,
        _a)))((0, utils_1.deepAssign)({}, params, { options: newOptions }));
}
exports.meta = meta;
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    chart.axis(xField, xAxis);
    chart.axis(yField, yAxis);
    return params;
}
/**
 * legend 配置
 * @param params
 */
function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, colorField = options.colorField, shapeField = options.shapeField, sizeField = options.sizeField, shapeLegend = options.shapeLegend, sizeLegend = options.sizeLegend;
    /** legend 不为 false, 则展示图例, 优先展示 color 分类图例 */
    var showLegend = legend !== false;
    if (colorField) {
        chart.legend(colorField, showLegend ? legend : false);
    }
    // 优先取 shapeLegend, 否则取 legend
    if (shapeField) {
        if (shapeLegend) {
            chart.legend(shapeField, shapeLegend);
        }
        else {
            chart.legend(shapeField, shapeLegend === false ? false : legend);
        }
    }
    if (sizeField) {
        chart.legend(sizeField, sizeLegend ? sizeLegend : false);
    }
    /** 默认不展示 shape 图例，当 shapeLegend 为 undefined 也不展示图例 */
    /** 默认没有 sizeField，则隐藏连续图例 */
    if (!showLegend && !shapeLegend && !sizeLegend) {
        chart.legend(false);
    }
    return params;
}
/**
 * 数据标签
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, yField = options.yField;
    var scatterGeometry = (0, utils_1.findGeometry)(chart, 'point');
    // label 为 false, 空 则不显示 label
    if (!label) {
        scatterGeometry.label(false);
    }
    else {
        var callback = label.callback, cfg = tslib_1.__rest(label, ["callback"]);
        scatterGeometry.label({
            fields: [yField],
            callback: callback,
            cfg: (0, utils_1.transformLabel)(cfg),
        });
    }
    return params;
}
/**
 * annotation 配置
 * - 特殊 annotation: quadrant(四象限)
 * @param params
 */
function scatterAnnotation(params) {
    var options = params.options;
    var quadrant = options.quadrant;
    var annotationOptions = [];
    if (quadrant) {
        var _a = quadrant.xBaseline, xBaseline = _a === void 0 ? 0 : _a, _b = quadrant.yBaseline, yBaseline = _b === void 0 ? 0 : _b, labels_1 = quadrant.labels, regionStyle_1 = quadrant.regionStyle, lineStyle = quadrant.lineStyle;
        var defaultConfig_1 = (0, util_2.getQuadrantDefaultConfig)(xBaseline, yBaseline);
        // 仅支持四象限
        var quadrants = new Array(4).join(',').split(',');
        quadrants.forEach(function (_, index) {
            annotationOptions.push(tslib_1.__assign(tslib_1.__assign({ type: 'region', top: false }, defaultConfig_1.regionStyle[index].position), { style: (0, utils_1.deepAssign)({}, defaultConfig_1.regionStyle[index].style, regionStyle_1 === null || regionStyle_1 === void 0 ? void 0 : regionStyle_1[index]) }), tslib_1.__assign({ type: 'text', top: true }, (0, utils_1.deepAssign)({}, defaultConfig_1.labelStyle[index], labels_1 === null || labels_1 === void 0 ? void 0 : labels_1[index])));
        });
        // 生成坐标轴
        annotationOptions.push({
            type: 'line',
            top: false,
            start: ['min', yBaseline],
            end: ['max', yBaseline],
            style: (0, utils_1.deepAssign)({}, defaultConfig_1.lineStyle, lineStyle),
        }, {
            type: 'line',
            top: false,
            start: [xBaseline, 'min'],
            end: [xBaseline, 'max'],
            style: (0, utils_1.deepAssign)({}, defaultConfig_1.lineStyle, lineStyle),
        });
    }
    return (0, utils_1.flow)((0, common_1.annotation)(annotationOptions))(params);
}
// 趋势线
function regressionLine(params) {
    var options = params.options, chart = params.chart;
    var regressionLine = options.regressionLine;
    if (regressionLine) {
        var style_1 = regressionLine.style, _a = regressionLine.equationStyle, equationStyle_1 = _a === void 0 ? {} : _a, _b = regressionLine.top, top_1 = _b === void 0 ? false : _b, _c = regressionLine.showEquation, showEquation_1 = _c === void 0 ? false : _c;
        var defaultStyle_1 = {
            stroke: '#9ba29a',
            lineWidth: 2,
            opacity: 0.5,
        };
        var defaulEquationStyle_1 = {
            x: 20,
            y: 20,
            textAlign: 'left',
            textBaseline: 'middle',
            fontSize: 14,
            fillOpacity: 0.5,
        };
        chart.annotation().shape({
            top: top_1,
            render: function (container, view) {
                var group = container.addGroup({
                    id: "".concat(chart.id, "-regression-line"),
                    name: 'regression-line-group',
                });
                var _a = (0, util_2.getPath)({
                    view: view,
                    options: options,
                }), path = _a[0], equation = _a[1];
                group.addShape('path', {
                    name: 'regression-line',
                    attrs: tslib_1.__assign(tslib_1.__assign({ path: path }, defaultStyle_1), style_1),
                });
                if (showEquation_1) {
                    group.addShape('text', {
                        name: 'regression-equation',
                        attrs: tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, defaulEquationStyle_1), equationStyle_1), { text: equation }),
                    });
                }
            },
        });
    }
    return params;
}
/**
 * tooltip 配置
 * @param params
 */
function tooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip;
    if (tooltip) {
        chart.tooltip(tooltip);
    }
    else if (tooltip === false) {
        chart.tooltip(false);
    }
    return params;
}
exports.tooltip = tooltip;
/**
 * 散点图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(geometry, meta, axis, legend, tooltip, label, 
    // 需要在 interaction 前面
    brush_1.brushInteraction, common_1.slider, common_1.scrollbar, common_1.interaction, scatterAnnotation, common_1.animation, common_1.theme, regressionLine)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map