"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.tooltip = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var locale_1 = require("../../core/locale");
var utils_1 = require("../../utils");
var constant_1 = require("./constant");
require("./shape");
var utils_2 = require("./utils");
/**
 *  处理默认配置项
 * @param params
 * @returns
 */
function defaultOptions(params) {
    var _a = params.options, locale = _a.locale, total = _a.total;
    var localeTotalLabel = (0, locale_1.getLocale)(locale).get(['waterfall', 'total']);
    if (total && typeof total.label !== 'string' && localeTotalLabel) {
        // @ts-ignore
        params.options.total.label = localeTotalLabel;
    }
    return params;
}
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, xField = options.xField, yField = options.yField, total = options.total, leaderLine = options.leaderLine, columnWidthRatio = options.columnWidthRatio, waterfallStyle = options.waterfallStyle, risingFill = options.risingFill, fallingFill = options.fallingFill, color = options.color, shape = options.shape, customInfo = options.customInfo;
    // 数据处理
    chart.data((0, utils_2.transformData)(data, xField, yField, total));
    // 瀑布图自带的 colorMapping
    var colorMapping = color ||
        function (datum) {
            if ((0, util_1.get)(datum, [constant_1.IS_TOTAL])) {
                return (0, util_1.get)(total, ['style', 'fill'], '');
            }
            return (0, util_1.get)(datum, [constant_1.Y_FIELD, 1]) - (0, util_1.get)(datum, [constant_1.Y_FIELD, 0]) > 0 ? risingFill : fallingFill;
        };
    var p = (0, utils_1.deepAssign)({}, params, {
        options: {
            xField: xField,
            yField: constant_1.Y_FIELD,
            seriesField: xField,
            rawFields: [yField, constant_1.DIFF_FIELD, constant_1.IS_TOTAL, constant_1.Y_FIELD],
            widthRatio: columnWidthRatio,
            interval: {
                style: waterfallStyle,
                // 支持外部自定义形状
                shape: shape || 'waterfall',
                color: colorMapping,
            },
        },
    });
    var ext = (0, geometries_1.interval)(p).ext;
    var geometry = ext.geometry;
    // 将 waterfall leaderLineCfg 传入到自定义 shape 中
    geometry.customInfo(tslib_1.__assign(tslib_1.__assign({}, customInfo), { leaderLine: leaderLine }));
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a, _b;
    var options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField, meta = options.meta;
    var Y_FIELD_META = (0, utils_1.deepAssign)({}, { alias: yField }, (0, util_1.get)(meta, yField));
    return (0, utils_1.flow)((0, common_1.scale)((_a = {},
        _a[xField] = xAxis,
        _a[yField] = yAxis,
        _a[constant_1.Y_FIELD] = yAxis,
        _a), (0, utils_1.deepAssign)({}, meta, (_b = {}, _b[constant_1.Y_FIELD] = Y_FIELD_META, _b[constant_1.DIFF_FIELD] = Y_FIELD_META, _b[constant_1.ABSOLUTE_FIELD] = Y_FIELD_META, _b))))(params);
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
        chart.axis(constant_1.Y_FIELD, false);
    }
    else {
        chart.axis(yField, yAxis);
        chart.axis(constant_1.Y_FIELD, yAxis);
    }
    return params;
}
/**
 * legend 配置 todo 添加 hover 交互
 * @param params
 */
function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, total = options.total, risingFill = options.risingFill, fallingFill = options.fallingFill, locale = options.locale;
    var i18n = (0, locale_1.getLocale)(locale);
    if (legend === false) {
        chart.legend(false);
    }
    else {
        var items = [
            {
                name: i18n.get(['general', 'increase']),
                value: 'increase',
                marker: { symbol: 'square', style: { r: 5, fill: risingFill } },
            },
            {
                name: i18n.get(['general', 'decrease']),
                value: 'decrease',
                marker: { symbol: 'square', style: { r: 5, fill: fallingFill } },
            },
        ];
        if (total) {
            items.push({
                name: total.label || '',
                value: 'total',
                marker: {
                    symbol: 'square',
                    style: (0, utils_1.deepAssign)({}, { r: 5 }, (0, util_1.get)(total, 'style')),
                },
            });
        }
        chart.legend((0, utils_1.deepAssign)({}, {
            custom: true,
            position: 'top',
            items: items,
        }, legend));
        chart.removeInteraction('legend-filter');
    }
    return params;
}
/**
 * 数据标签
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, labelMode = options.labelMode, xField = options.xField;
    var geometry = (0, utils_1.findGeometry)(chart, 'interval');
    if (!label) {
        geometry.label(false);
    }
    else {
        var callback = label.callback, cfg = tslib_1.__rest(label, ["callback"]);
        geometry.label({
            fields: labelMode === 'absolute' ? [constant_1.ABSOLUTE_FIELD, xField] : [constant_1.DIFF_FIELD, xField],
            callback: callback,
            cfg: (0, utils_1.transformLabel)(cfg),
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
    var tooltip = options.tooltip, xField = options.xField, yField = options.yField;
    if (tooltip !== false) {
        chart.tooltip(tslib_1.__assign({ showCrosshairs: false, showMarkers: false, shared: true, 
            // tooltip 默认展示 y 字段值
            fields: [yField] }, tooltip));
        // 瀑布图默认以 yField 作为 tooltip 内容
        var geometry_1 = chart.geometries[0];
        (tooltip === null || tooltip === void 0 ? void 0 : tooltip.formatter) ? geometry_1.tooltip("".concat(xField, "*").concat(yField), tooltip.formatter) : geometry_1.tooltip(yField);
    }
    else {
        chart.tooltip(false);
    }
    return params;
}
exports.tooltip = tooltip;
/**
 * 瀑布图适配器
 * @param params
 */
function adaptor(params) {
    return (0, utils_1.flow)(defaultOptions, common_1.theme, geometry, meta, axis, legend, tooltip, label, common_1.state, common_1.interaction, common_1.animation, (0, common_1.annotation)())(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map