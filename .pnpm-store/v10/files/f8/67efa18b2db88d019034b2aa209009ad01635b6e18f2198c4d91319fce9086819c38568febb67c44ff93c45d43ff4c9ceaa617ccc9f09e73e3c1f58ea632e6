"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var constant_1 = require("../../constant");
var utils_1 = require("../../utils");
var utils_2 = require("../mix/utils");
var utils_3 = require("./utils");
function facetAdaptor(params) {
    var chart = params.chart, options = params.options;
    var facetType = options.type, data = options.data, fields = options.fields, eachView = options.eachView;
    var restFacetCfg = (0, util_1.omit)(options, [
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
    chart.facet(facetType, tslib_1.__assign(tslib_1.__assign({}, restFacetCfg), { fields: fields, eachView: function (viewOfG2, facet) {
            var viewOptions = eachView(viewOfG2, facet);
            if (viewOptions.geometries) {
                (0, utils_3.execViewAdaptor)(viewOfG2, viewOptions);
            }
            else {
                var plot = viewOptions;
                var plotOptions = plot.options;
                // @ts-ignore 仪表盘没 tooltip
                if (plotOptions.tooltip) {
                    // 配置 tooltip 交互
                    viewOfG2.interaction('tooltip');
                }
                (0, utils_2.execPlotAdaptor)(plot.type, viewOfG2, plotOptions);
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
        (0, util_1.each)(axes, function (axis, field) {
            scales[field] = (0, utils_1.pick)(axis, constant_1.AXIS_META_CONFIG_KEYS);
        });
    }
    scales = (0, utils_1.deepAssign)({}, meta, scales);
    chart.scale(scales);
    // 4. coordinate 配置
    chart.coordinate(coordinate);
    // 5. axis 轴配置 (默认不展示)
    if (!axes) {
        chart.axis(false);
    }
    else {
        (0, util_1.each)(axes, function (axis, field) {
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
    (0, util_1.each)(interactions, function (interaction) {
        if (interaction.enable === false) {
            chart.removeInteraction(interaction.type);
        }
        else {
            chart.interaction(interaction.type, interaction.cfg);
        }
    });
    // 9. annotations
    (0, util_1.each)(annotations, function (annotation) {
        chart.annotation()[annotation.type](tslib_1.__assign({}, annotation));
    });
    return params;
}
/**
 * 分面图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(common_1.theme, facetAdaptor, component)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map