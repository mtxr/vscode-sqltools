import { __assign } from "tslib";
import { clone, each, isFunction } from '@antv/util';
import { animation, annotation, scale, theme, tooltip } from '../../adaptor/common';
import { getLocale } from '../../core/locale';
import { deepAssign, flow } from '../../utils';
import { conversionTagFormatter } from '../../utils/conversion';
import { FUNNEL_CONVERSATION, FUNNEL_PERCENT } from './constant';
import { basicFunnel } from './geometries/basic';
import { compareFunnel } from './geometries/compare';
import { dynamicHeightFunnel } from './geometries/dynamic-height';
import { facetFunnel } from './geometries/facet';
import { FUNNEL_LEGEND_FILTER, interactionStart } from './interactions';
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
    var i18n = getLocale(locale);
    var defaultOption = {
        label: compareField
            ? {
                fields: [xField, yField, compareField, FUNNEL_PERCENT, FUNNEL_CONVERSATION],
                formatter: function (datum) { return "".concat(datum[yField]); },
            }
            : {
                fields: [xField, yField, FUNNEL_PERCENT, FUNNEL_CONVERSATION],
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
                return "".concat(i18n.get(['conversionTag', 'label']), ": ").concat(conversionTagFormatter.apply(void 0, datum[FUNNEL_CONVERSATION]));
            },
        },
    };
    // 漏斗图样式
    var style;
    if (compareField || funnelStyle) {
        style = function (datum) {
            return deepAssign({}, 
            // 对比漏斗图默认描边
            compareField && { lineWidth: 1, stroke: '#fff' }, isFunction(funnelStyle) ? funnelStyle(datum) : funnelStyle);
        };
    }
    return deepAssign({ options: defaultOption }, params, { options: { funnelStyle: style, data: clone(data) } });
}
/**
 * geometry处理
 * @param params
 */
function geometry(params) {
    var options = params.options;
    var compareField = options.compareField, dynamicHeight = options.dynamicHeight, seriesField = options.seriesField;
    if (seriesField) {
        return facetFunnel(params);
    }
    if (compareField) {
        return compareFunnel(params);
    }
    if (dynamicHeight) {
        return dynamicHeightFunnel(params);
    }
    return basicFunnel(params);
}
/**
 * meta 配置
 * @param params
 */
export function meta(params) {
    var _a;
    var options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    return flow(scale((_a = {},
        _a[xField] = xAxis,
        _a[yField] = yAxis,
        _a)))(params);
}
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
export function interaction(params) {
    var chart = params.chart, options = params.options;
    // @ts-ignore
    var interactions = options.interactions, dynamicHeight = options.dynamicHeight;
    each(interactions, function (i) {
        if (i.enable === false) {
            chart.removeInteraction(i.type);
        }
        else {
            chart.interaction(i.type, i.cfg || {});
        }
    });
    // 动态高度  不进行交互操作
    if (!dynamicHeight) {
        chart.interaction(FUNNEL_LEGEND_FILTER, {
            start: [__assign(__assign({}, interactionStart), { arg: options })],
        });
    }
    else {
        chart.removeInteraction(FUNNEL_LEGEND_FILTER);
    }
    return params;
}
/**
 * 漏斗图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    return flow(defaultOptions, geometry, meta, axis, tooltip, interaction, legend, animation, theme, annotation())(params);
}
//# sourceMappingURL=adaptor.js.map