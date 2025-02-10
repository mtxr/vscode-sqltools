"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.interaction = exports.meta = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var locale_1 = require("../../core/locale");
var utils_1 = require("../../utils");
var conversion_1 = require("../../utils/conversion");
var constant_1 = require("./constant");
var basic_1 = require("./geometries/basic");
var compare_1 = require("./geometries/compare");
var dynamic_height_1 = require("./geometries/dynamic-height");
var facet_1 = require("./geometries/facet");
var interactions_1 = require("./interactions");
/**
 *
 * 各式漏斗图geometry实现细节有较大不同,
 * 1. 普通漏斗图：interval.shape('funnel')
 * 2. 对比漏斗图：分面
 * 3. 动态高度漏斗图：polypon
 * 4. 分面漏斗图：普通 + list 分面
* /

/**
 * options 处理
 * @param params
 */
function defaultOptions(params) {
    var options = params.options;
    var compareField = options.compareField, xField = options.xField, yField = options.yField, locale = options.locale, funnelStyle = options.funnelStyle, data = options.data;
    var i18n = (0, locale_1.getLocale)(locale);
    var defaultOption = {
        label: compareField
            ? {
                fields: [xField, yField, compareField, constant_1.FUNNEL_PERCENT, constant_1.FUNNEL_CONVERSATION],
                formatter: function (datum) { return "".concat(datum[yField]); },
            }
            : {
                fields: [xField, yField, constant_1.FUNNEL_PERCENT, constant_1.FUNNEL_CONVERSATION],
                offset: 0,
                position: 'middle',
                formatter: function (datum) { return "".concat(datum[xField], " ").concat(datum[yField]); },
            },
        tooltip: {
            title: xField,
            formatter: function (datum) {
                return { name: datum[xField], value: datum[yField] };
            },
        },
        conversionTag: {
            // conversionTag 的计算和显示逻辑统一保持一致
            formatter: function (datum) {
                return "".concat(i18n.get(['conversionTag', 'label']), ": ").concat(conversion_1.conversionTagFormatter.apply(void 0, datum[constant_1.FUNNEL_CONVERSATION]));
            },
        },
    };
    // 漏斗图样式
    var style;
    if (compareField || funnelStyle) {
        style = function (datum) {
            return (0, utils_1.deepAssign)({}, 
            // 对比漏斗图默认描边
            compareField && { lineWidth: 1, stroke: '#fff' }, (0, util_1.isFunction)(funnelStyle) ? funnelStyle(datum) : funnelStyle);
        };
    }
    return (0, utils_1.deepAssign)({ options: defaultOption }, params, { options: { funnelStyle: style, data: (0, util_1.clone)(data) } });
}
/**
 * geometry处理
 * @param params
 */
function geometry(params) {
    var options = params.options;
    var compareField = options.compareField, dynamicHeight = options.dynamicHeight, seriesField = options.seriesField;
    if (seriesField) {
        return (0, facet_1.facetFunnel)(params);
    }
    if (compareField) {
        return (0, compare_1.compareFunnel)(params);
    }
    if (dynamicHeight) {
        return (0, dynamic_height_1.dynamicHeightFunnel)(params);
    }
    return (0, basic_1.basicFunnel)(params);
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
exports.meta = meta;
/**
 * 坐标轴
 * @param params
 */
function axis(params) {
    var chart = params.chart;
    chart.axis(false);
    return params;
}
/**
 * legend 配置
 * @param params
 */
function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend;
    if (legend === false) {
        chart.legend(false);
    }
    else {
        chart.legend(legend);
        // TODO FIX: legend-click 时间和转化率组件之间的关联
    }
    return params;
}
/**
 * Interaction 配置
 * @param params
 */
function interaction(params) {
    var chart = params.chart, options = params.options;
    // @ts-ignore
    var interactions = options.interactions, dynamicHeight = options.dynamicHeight;
    (0, util_1.each)(interactions, function (i) {
        if (i.enable === false) {
            chart.removeInteraction(i.type);
        }
        else {
            chart.interaction(i.type, i.cfg || {});
        }
    });
    // 动态高度  不进行交互操作
    if (!dynamicHeight) {
        chart.interaction(interactions_1.FUNNEL_LEGEND_FILTER, {
            start: [tslib_1.__assign(tslib_1.__assign({}, interactions_1.interactionStart), { arg: options })],
        });
    }
    else {
        chart.removeInteraction(interactions_1.FUNNEL_LEGEND_FILTER);
    }
    return params;
}
exports.interaction = interaction;
/**
 * 漏斗图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    return (0, utils_1.flow)(defaultOptions, geometry, meta, axis, common_1.tooltip, interaction, legend, common_1.animation, common_1.theme, (0, common_1.annotation)())(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map