import { __assign } from "tslib";
import { each, omit } from '@antv/util';
import { theme } from '../../adaptor/common';
import { AXIS_META_CONFIG_KEYS } from '../../constant';
import { deepAssign, flow, pick } from '../../utils';
import { execPlotAdaptor } from '../mix/utils';
import { execViewAdaptor } from './utils';
function facetAdaptor(params) {
    var chart = params.chart, options = params.options;
    var facetType = options.type, data = options.data, fields = options.fields, eachView = options.eachView;
    var restFacetCfg = omit(options, [
        'type',
        'data',
        'fields',
        'eachView',
        'axes',
        'meta',
        'tooltip',
        'coordinate',
        'theme',
        'legend',
        'interactions',
        'annotations',
    ]);
    // 1. data
    chart.data(data);
    // 2. facet
    chart.facet(facetType, __assign(__assign({}, restFacetCfg), { fields: fields, eachView: function (viewOfG2, facet) {
            var viewOptions = eachView(viewOfG2, facet);
            if (viewOptions.geometries) {
                execViewAdaptor(viewOfG2, viewOptions);
            }
            else {
                var plot = viewOptions;
                var plotOptions = plot.options;
                // @ts-ignore 仪表盘没 tooltip
                if (plotOptions.tooltip) {
                    // 配置 tooltip 交互
                    viewOfG2.interaction('tooltip');
                }
                execPlotAdaptor(plot.type, viewOfG2, plotOptions);
            }
        } }));
    return params;
}
function component(params) {
    var chart = params.chart, options = params.options;
    var axes = options.axes, meta = options.meta, tooltip = options.tooltip, coordinate = options.coordinate, theme = options.theme, legend = options.legend, interactions = options.interactions, annotations = options.annotations;
    // 3. meta 配置
    var scales = {};
    if (axes) {
        each(axes, function (axis, field) {
            scales[field] = pick(axis, AXIS_META_CONFIG_KEYS);
        });
    }
    scales = deepAssign({}, meta, scales);
    chart.scale(scales);
    // 4. coordinate 配置
    chart.coordinate(coordinate);
    // 5. axis 轴配置 (默认不展示)
    if (!axes) {
        chart.axis(false);
    }
    else {
        each(axes, function (axis, field) {
            chart.axis(field, axis);
        });
    }
    // 6. tooltip 配置
    if (tooltip) {
        chart.interaction('tooltip');
        chart.tooltip(tooltip);
    }
    else if (tooltip === false) {
        chart.removeInteraction('tooltip');
    }
    // 7. legend 配置（默认展示）
    chart.legend(legend);
    // theme 配置
    if (theme) {
        chart.theme(theme);
    }
    // 8. interactions
    each(interactions, function (interaction) {
        if (interaction.enable === false) {
            chart.removeInteraction(interaction.type);
        }
        else {
            chart.interaction(interaction.type, interaction.cfg);
        }
    });
    // 9. annotations
    each(annotations, function (annotation) {
        chart.annotation()[annotation.type](__assign({}, annotation));
    });
    return params;
}
/**
 * 分面图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return flow(theme, facetAdaptor, component)(params);
}
//# sourceMappingURL=adaptor.js.map