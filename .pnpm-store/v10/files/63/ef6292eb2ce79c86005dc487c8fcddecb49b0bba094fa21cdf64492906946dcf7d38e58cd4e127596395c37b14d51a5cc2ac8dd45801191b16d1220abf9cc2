"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.legend = exports.meta = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var brush_1 = require("../../adaptor/brush");
var common_1 = require("../../adaptor/common");
var connected_area_1 = require("../../adaptor/connected-area");
var conversion_tag_1 = require("../../adaptor/conversion-tag");
var geometries_1 = require("../../adaptor/geometries");
var pattern_1 = require("../../adaptor/pattern");
var utils_1 = require("../../utils");
var percent_1 = require("../../utils/transform/percent");
/**
 * defaultOptions
 * @param params
 */
function defaultOptions(params) {
    var options = params.options;
    // 默认 legend 位置
    var legend = options.legend;
    var seriesField = options.seriesField, isStack = options.isStack;
    if (seriesField) {
        if (legend !== false) {
            legend = tslib_1.__assign({ position: isStack ? 'right-top' : 'top-left' }, legend);
        }
    }
    else {
        legend = false;
    }
    // @ts-ignore 直接改值
    params.options.legend = legend;
    return params;
}
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, columnStyle = options.columnStyle, color = options.color, columnWidthRatio = options.columnWidthRatio, isPercent = options.isPercent, isGroup = options.isGroup, isStack = options.isStack, xField = options.xField, yField = options.yField, seriesField = options.seriesField, groupField = options.groupField, tooltip = options.tooltip, shape = options.shape;
    var percentData = isPercent && isGroup && isStack
        ? (0, percent_1.getDeepPercent)(data, yField, [xField, groupField], yField)
        : (0, percent_1.getDataWhetherPercentage)(data, yField, xField, yField, isPercent);
    var chartData = [];
    // 存在堆叠,并且存在堆叠seriesField分类，并且不存在分组的时候 进行堆叠
    if (isStack && seriesField && !isGroup) {
        percentData.forEach(function (item) {
            var stackedItem = chartData.find(function (v) { return v[xField] === item[xField] && v[seriesField] === item[seriesField]; });
            if (stackedItem) {
                stackedItem[yField] += item[yField] || 0;
            }
            else {
                chartData.push(tslib_1.__assign({}, item));
            }
        });
    }
    else {
        chartData = percentData;
    }
    chart.data(chartData);
    // 百分比堆积图，默认会给一个 % 格式化逻辑, 用户可自定义
    var tooltipOptions = isPercent
        ? tslib_1.__assign({ formatter: function (datum) {
                var _a;
                return ({
                    name: isGroup && isStack ? "".concat(datum[seriesField], " - ").concat(datum[groupField]) : (_a = datum[seriesField]) !== null && _a !== void 0 ? _a : datum[xField],
                    value: (Number(datum[yField]) * 100).toFixed(2) + '%',
                });
            } }, tooltip) : tooltip;
    var p = (0, utils_1.deepAssign)({}, params, {
        options: {
            data: chartData,
            widthRatio: columnWidthRatio,
            tooltip: tooltipOptions,
            interval: {
                shape: shape,
                style: columnStyle,
                color: color,
            },
        },
    });
    (0, geometries_1.interval)(p);
    return p;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a, _b;
    var options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField, data = options.data, isPercent = options.isPercent;
    var percentYMeta = isPercent ? { max: 1, min: 0, minLimit: 0, maxLimit: 1 } : {};
    return (0, utils_1.flow)((0, common_1.scale)((_a = {},
        _a[xField] = xAxis,
        _a[yField] = yAxis,
        _a), (_b = {},
        _b[xField] = {
            type: 'cat',
        },
        _b[yField] = tslib_1.__assign(tslib_1.__assign({}, (0, utils_1.adjustYMetaByZero)(data, yField)), percentYMeta),
        _b)))(params);
}
exports.meta = meta;
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
    var label = options.label, yField = options.yField, isRange = options.isRange;
    var geometry = (0, utils_1.findGeometry)(chart, 'interval');
    if (!label) {
        geometry.label(false);
    }
    else {
        var callback = label.callback, cfg = tslib_1.__rest(label, ["callback"]);
        geometry.label({
            fields: [yField],
            callback: callback,
            cfg: tslib_1.__assign({ 
                // 配置默认的 label layout： 如果用户没有指定 layout 和 position， 则自动配置 layout
                layout: (cfg === null || cfg === void 0 ? void 0 : cfg.position)
                    ? undefined
                    : [
                        { type: 'interval-adjust-position' },
                        { type: 'interval-hide-overlap' },
                        { type: 'adjust-color' },
                        { type: 'limit-in-plot', cfg: { action: 'hide' } },
                    ] }, (0, utils_1.transformLabel)(isRange
                ? tslib_1.__assign({ content: function (item) {
                        var _a;
                        return (_a = item[yField]) === null || _a === void 0 ? void 0 : _a.join('-');
                    } }, cfg) : cfg)),
        });
    }
    return params;
}
/**
 * 柱形图 tooltip 配置 (对堆叠、分组做特殊处理)
 * @param params
 */
function columnTooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip, isGroup = options.isGroup, isStack = options.isStack, groupField = options.groupField, data = options.data, xField = options.xField, yField = options.yField, seriesField = options.seriesField;
    if (tooltip === false) {
        chart.tooltip(false);
    }
    else {
        var tooltipOptions = tooltip;
        // fix: https://github.com/antvis/G2Plot/issues/2572
        if (isGroup && isStack) {
            var customItems_1 = tooltipOptions.customItems;
            var tooltipFormatter_1 = (tooltipOptions === null || tooltipOptions === void 0 ? void 0 : tooltipOptions.formatter) ||
                (function (datum) { return ({ name: "".concat(datum[seriesField], " - ").concat(datum[groupField]), value: datum[yField] }); });
            tooltipOptions = tslib_1.__assign(tslib_1.__assign({}, tooltipOptions), { customItems: function (originalItems) {
                    var items = [];
                    (0, util_1.each)(originalItems, function (item) {
                        // Find datas in same cluster
                        var datas = (0, util_1.filter)(data, function (d) { return (0, util_1.isMatch)(d, (0, utils_1.pick)(item.data, [xField, seriesField])); });
                        datas.forEach(function (datum) {
                            items.push(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, item), { value: datum[yField], data: datum, mappingData: { _origin: datum } }), tooltipFormatter_1(datum)));
                        });
                    });
                    // fix https://github.com/antvis/G2Plot/issues/3367
                    return customItems_1 ? customItems_1(items) : items;
                } });
        }
        chart.tooltip(tooltipOptions);
    }
    return params;
}
/**
 * 柱形图适配器
 * @param params
 */
function adaptor(params, isBar) {
    if (isBar === void 0) { isBar = false; }
    var options = params.options;
    var seriesField = options.seriesField;
    return (0, utils_1.flow)(defaultOptions, // 处理默认配置
    common_1.theme, // theme 需要在 geometry 之前
    (0, pattern_1.pattern)('columnStyle'), common_1.state, (0, common_1.transformations)('rect'), geometry, meta, axis, legend, columnTooltip, common_1.slider, common_1.scrollbar, label, brush_1.brushInteraction, common_1.interaction, common_1.animation, (0, common_1.annotation)(), (0, conversion_tag_1.conversionTag)(options.yField, !isBar, !!seriesField), // 有拆分的时候禁用转化率
    (0, connected_area_1.connectedArea)(!options.isStack), common_1.limitInPlot)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map