import { __assign } from "tslib";
import { each } from '@antv/util';
import { animation, annotation, interaction, theme, tooltip } from '../../adaptor/common';
import { geometry as geometryAdaptor } from '../../adaptor/geometries/base';
import { AXIS_META_CONFIG_KEYS } from '../../constant';
import { PLOT_CONTAINER_OPTIONS } from '../../core/plot';
import { deepAssign, flow, pick } from '../../utils';
import { execPlotAdaptor } from './utils';
/**
 * geometry 处理
 * @param params
 */
function multiView(params) {
    var chart = params.chart, options = params.options;
    var views = options.views, legend = options.legend;
    each(views, function (v) {
        var region = v.region, data = v.data, meta = v.meta, axes = v.axes, coordinate = v.coordinate, interactions = v.interactions, annotations = v.annotations, tooltip = v.tooltip, geometries = v.geometries;
        // 1. 创建 view
        var viewOfG2 = chart.createView({
            region: region,
        });
        // 2. data
        viewOfG2.data(data);
        // 3. meta
        var scales = {};
        if (axes) {
            each(axes, function (axis, field) {
                scales[field] = pick(axis, AXIS_META_CONFIG_KEYS);
            });
        }
        scales = deepAssign({}, meta, scales);
        viewOfG2.scale(scales);
        // 4. x y axis
        if (!axes) {
            viewOfG2.axis(false);
        }
        else {
            each(axes, function (axis, field) {
                viewOfG2.axis(field, axis);
            });
        }
        // 5. coordinate
        viewOfG2.coordinate(coordinate);
        // 6. geometry
        each(geometries, function (geometry) {
            var ext = geometryAdaptor({
                chart: viewOfG2,
                options: geometry,
            }).ext;
            // adjust
            var adjust = geometry.adjust;
            if (adjust) {
                ext.geometry.adjust(adjust);
            }
        });
        // 7. interactions
        each(interactions, function (interaction) {
            if (interaction.enable === false) {
                viewOfG2.removeInteraction(interaction.type);
            }
            else {
                viewOfG2.interaction(interaction.type, interaction.cfg);
            }
        });
        // 8. annotations
        each(annotations, function (annotation) {
            viewOfG2.annotation()[annotation.type](__assign({}, annotation));
        });
        // 9. animation (先做动画)
        if (typeof v.animation === 'boolean') {
            viewOfG2.animate(false);
        }
        else {
            viewOfG2.animate(true);
            // 9.1 所有的 Geometry 都使用同一动画（各个图形如有区别，todo 自行覆盖）
            each(viewOfG2.geometries, function (g) {
                g.animate(v.animation);
            });
        }
        if (tooltip) {
            // 10. tooltip
            viewOfG2.interaction('tooltip');
            viewOfG2.tooltip(tooltip);
        }
    });
    // legend
    if (!legend) {
        chart.legend(false);
    }
    else {
        each(legend, function (l, field) {
            chart.legend(field, l);
        });
    }
    // tooltip
    chart.tooltip(options.tooltip);
    return params;
}
/**
 * 支持嵌套使用 g2plot 内置图表
 * @param params
 */
function multiPlot(params) {
    var chart = params.chart, options = params.options;
    var plots = options.plots, _a = options.data, data = _a === void 0 ? [] : _a;
    each(plots, function (plot) {
        var type = plot.type, region = plot.region, _a = plot.options, options = _a === void 0 ? {} : _a, top = plot.top;
        var tooltip = options.tooltip;
        if (top) {
            execPlotAdaptor(type, chart, __assign(__assign({}, options), { data: data }));
            return;
        }
        var viewOfG2 = chart.createView(__assign({ region: region }, pick(options, PLOT_CONTAINER_OPTIONS)));
        if (tooltip) {
            // 配置 tooltip 交互
            viewOfG2.interaction('tooltip');
        }
        execPlotAdaptor(type, viewOfG2, __assign({ data: data }, options));
    });
    return params;
}
/**
 * 处理缩略轴的 adaptor (mix)
 * @param params
 */
export function slider(params) {
    var chart = params.chart, options = params.options;
    chart.option('slider', options.slider);
    return params;
}
/**
 * 图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    return flow(animation, // 多 view 的图，动画配置放到最前面
    multiView, multiPlot, interaction, animation, theme, tooltip, slider, annotation()
    // ... 其他的 adaptor flow
    )(params);
}
//# sourceMappingURL=adaptor.js.map