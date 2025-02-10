"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.meta = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var percent_1 = require("../../utils/transform/percent");
var adaptor_1 = require("../line/adaptor");
Object.defineProperty(exports, "meta", { enumerable: true, get: function () { return adaptor_1.meta; } });
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, areaStyle = options.areaStyle, areaShape = options.areaShape, color = options.color, pointMapping = options.point, lineMapping = options.line, isPercent = options.isPercent, xField = options.xField, yField = options.yField, tooltip = options.tooltip, seriesField = options.seriesField, startOnZero = options.startOnZero;
    var pointState = pointMapping === null || pointMapping === void 0 ? void 0 : pointMapping.state;
    var chartData = (0, percent_1.getDataWhetherPercentage)(data, yField, xField, yField, isPercent);
    chart.data(chartData);
    // 百分比堆积图，默认会给一个 % 格式化逻辑, 用户可自定义
    var tooltipOptions = isPercent
        ? tslib_1.__assign({ formatter: function (datum) { return ({
                name: datum[seriesField] || datum[xField],
                value: (Number(datum[yField]) * 100).toFixed(2) + '%',
            }); } }, tooltip) : tooltip;
    var primary = (0, utils_1.deepAssign)({}, params, {
        options: {
            area: {
                color: color,
                style: areaStyle,
                shape: areaShape,
            },
            point: pointMapping && tslib_1.__assign({ color: color }, pointMapping),
            tooltip: tooltipOptions,
            // label 不传递给各个 geometry adaptor，由 label adaptor 处理
            label: undefined,
            args: {
                startOnZero: startOnZero,
            },
        },
    });
    // 线默认 2px (折线不能复用面积图的 state，因为 fill 和 stroke 不匹配)
    var lineParams = {
        chart: chart,
        options: (0, utils_1.deepAssign)({ line: { size: 2 } }, (0, util_1.omit)(options, ['state']), {
            // 颜色保持一致，因为如果颜色不一致，会导致 tooltip 中元素重复。
            // 如果存在，才设置，否则为空
            line: lineMapping && tslib_1.__assign({ color: color }, lineMapping),
            sizeField: seriesField,
            state: lineMapping === null || lineMapping === void 0 ? void 0 : lineMapping.state,
            tooltip: false,
            // label 不传递给各个 geometry adaptor，由 label adaptor 处理
            label: undefined,
            args: {
                startOnZero: startOnZero,
            },
        }),
    };
    var pointParams = (0, utils_1.deepAssign)({}, primary, { options: { tooltip: false, state: pointState } });
    // area geometry 处理
    (0, geometries_1.area)(primary);
    (0, geometries_1.line)(lineParams);
    (0, geometries_1.point)(pointParams);
    return params;
}
/**
 * 数据标签
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, yField = options.yField;
    var areaGeometry = (0, utils_1.findGeometry)(chart, 'area');
    // label 为 false, 空 则不显示 label
    if (!label) {
        areaGeometry.label(false);
    }
    else {
        var fields = label.fields, callback = label.callback, cfg = tslib_1.__rest(label, ["fields", "callback"]);
        areaGeometry.label({
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
 * 处理 adjust
 * @param params
 */
function adjust(params) {
    var chart = params.chart, options = params.options;
    var isStack = options.isStack, isPercent = options.isPercent, seriesField = options.seriesField;
    if ((isPercent || isStack) && seriesField) {
        (0, util_1.each)(chart.geometries, function (g) {
            g.adjust('stack');
        });
    }
    return params;
}
/**
 * 折线图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(common_1.theme, (0, common_1.pattern)('areaStyle'), (0, common_1.transformations)('rect'), geometry, adaptor_1.meta, adjust, adaptor_1.axis, adaptor_1.legend, common_1.tooltip, label, common_1.slider, (0, common_1.annotation)(), common_1.interaction, common_1.animation, common_1.limitInPlot)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map