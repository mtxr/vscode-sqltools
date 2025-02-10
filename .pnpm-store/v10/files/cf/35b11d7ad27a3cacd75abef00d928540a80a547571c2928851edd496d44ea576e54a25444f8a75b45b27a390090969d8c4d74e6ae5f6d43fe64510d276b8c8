"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.slider = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var base_1 = require("../../adaptor/geometries/base");
var constant_1 = require("../../constant");
var plot_1 = require("../../core/plot");
var utils_1 = require("../../utils");
var utils_2 = require("./utils");
/**
 * geometry 处理
 * @param params
 */
function multiView(params) {
    var chart = params.chart, options = params.options;
    var views = options.views, legend = options.legend;
    (0, util_1.each)(views, function (v) {
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
            (0, util_1.each)(axes, function (axis, field) {
                scales[field] = (0, utils_1.pick)(axis, constant_1.AXIS_META_CONFIG_KEYS);
            });
        }
        scales = (0, utils_1.deepAssign)({}, meta, scales);
        viewOfG2.scale(scales);
        // 4. x y axis
        if (!axes) {
            viewOfG2.axis(false);
        }
        else {
            (0, util_1.each)(axes, function (axis, field) {
                viewOfG2.axis(field, axis);
            });
        }
        // 5. coordinate
        viewOfG2.coordinate(coordinate);
        // 6. geometry
        (0, util_1.each)(geometries, function (geometry) {
            var ext = (0, base_1.geometry)({
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
        (0, util_1.each)(interactions, function (interaction) {
            if (interaction.enable === false) {
                viewOfG2.removeInteraction(interaction.type);
            }
            else {
                viewOfG2.interaction(interaction.type, interaction.cfg);
            }
        });
        // 8. annotations
        (0, util_1.each)(annotations, function (annotation) {
            viewOfG2.annotation()[annotation.type](tslib_1.__assign({}, annotation));
        });
        // 9. animation (先做动画)
        if (typeof v.animation === 'boolean') {
            viewOfG2.animate(false);
        }
        else {
            viewOfG2.animate(true);
            // 9.1 所有的 Geometry 都使用同一动画（各个图形如有区别，todo 自行覆盖）
            (0, util_1.each)(viewOfG2.geometries, function (g) {
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
        (0, util_1.each)(legend, function (l, field) {
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
    (0, util_1.each)(plots, function (plot) {
        var type = plot.type, region = plot.region, _a = plot.options, options = _a === void 0 ? {} : _a, top = plot.top;
        var tooltip = options.tooltip;
        if (top) {
            (0, utils_2.execPlotAdaptor)(type, chart, tslib_1.__assign(tslib_1.__assign({}, options), { data: data }));
            return;
        }
        var viewOfG2 = chart.createView(tslib_1.__assign({ region: region }, (0, utils_1.pick)(options, plot_1.PLOT_CONTAINER_OPTIONS)));
        if (tooltip) {
            // 配置 tooltip 交互
            viewOfG2.interaction('tooltip');
        }
        (0, utils_2.execPlotAdaptor)(type, viewOfG2, tslib_1.__assign({ data: data }, options));
    });
    return params;
}
/**
 * 处理缩略轴的 adaptor (mix)
 * @param params
 */
function slider(params) {
    var chart = params.chart, options = params.options;
    chart.option('slider', options.slider);
    return params;
}
exports.slider = slider;
/**
 * 图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    return (0, utils_1.flow)(common_1.animation, // 多 view 的图，动画配置放到最前面
    multiView, multiPlot, common_1.interaction, common_1.animation, common_1.theme, common_1.tooltip, slider, (0, common_1.annotation)()
    // ... 其他的 adaptor flow
    )(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map