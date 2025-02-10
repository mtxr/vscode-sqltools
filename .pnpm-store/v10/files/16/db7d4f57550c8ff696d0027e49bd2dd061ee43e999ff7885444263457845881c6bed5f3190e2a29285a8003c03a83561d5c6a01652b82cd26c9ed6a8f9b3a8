"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.legend = exports.tooltip = exports.axis = exports.meta = void 0;
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var constant_1 = require("../../constant");
var utils_1 = require("../../utils");
var constant_2 = require("./constant");
var utils_2 = require("./utils");
/**
 * 图表配置处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var yField = options.yField;
    var data = options.data, risingFill = options.risingFill, fallingFill = options.fallingFill, tooltip = options.tooltip, stockStyle = options.stockStyle;
    chart.data((0, utils_2.getStockData)(data, yField));
    var tooltipOptions = tooltip;
    if (tooltipOptions !== false) {
        tooltipOptions = (0, utils_1.deepAssign)({}, { fields: yField }, tooltipOptions);
    }
    (0, geometries_1.schema)((0, utils_1.deepAssign)({}, params, {
        options: {
            schema: {
                shape: 'candle',
                color: [risingFill, fallingFill],
                style: stockStyle,
            },
            yField: constant_2.Y_FIELD,
            seriesField: constant_2.TREND_FIELD,
            rawFields: yField,
            tooltip: tooltipOptions,
        },
    }));
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a, _b;
    var chart = params.chart, options = params.options;
    var meta = options.meta, xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField;
    var baseMeta = (_a = {},
        _a[xField] = {
            type: 'timeCat',
            tickCount: 6,
        },
        _a[constant_2.TREND_FIELD] = {
            values: [constant_2.TREND_UP, constant_2.TREND_DOWN],
        },
        _a);
    var scales = (0, utils_1.deepAssign)(baseMeta, meta, (_b = {},
        _b[xField] = (0, utils_1.pick)(xAxis, constant_1.AXIS_META_CONFIG_KEYS),
        _b[constant_2.Y_FIELD] = (0, utils_1.pick)(yAxis, constant_1.AXIS_META_CONFIG_KEYS),
        _b));
    chart.scale(scales);
    return params;
}
exports.meta = meta;
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField;
    // 为 false 则是不显示轴
    if (xAxis === false) {
        chart.axis(xField, false);
    }
    else {
        chart.axis(xField, xAxis);
    }
    if (yAxis === false) {
        chart.axis(constant_2.Y_FIELD, false);
    }
    else {
        chart.axis(constant_2.Y_FIELD, yAxis);
    }
    return params;
}
exports.axis = axis;
/**
 * tooltip 配置
 * @param params
 */
function tooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip;
    if (tooltip !== false) {
        chart.tooltip(tooltip);
    }
    else {
        chart.tooltip(false);
    }
    return params;
}
exports.tooltip = tooltip;
/**
 * legend 配置
 * @param params
 */
function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend;
    if (legend) {
        chart.legend(constant_2.TREND_FIELD, legend);
    }
    else if (legend === false) {
        chart.legend(false);
    }
    return params;
}
exports.legend = legend;
/**
 * K线图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    (0, utils_1.flow)(common_1.theme, geometry, meta, axis, tooltip, legend, common_1.interaction, common_1.animation, (0, common_1.annotation)(), common_1.slider)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map