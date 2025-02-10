"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.tooltip = exports.meta = exports.axis = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var padding_1 = require("../../utils/padding");
var constant_1 = require("./constant");
var utils_2 = require("./utils");
/**
 * geometry 配置处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var color = options.color, _a = options.colorField, colorField = _a === void 0 ? constant_1.SUNBURST_ANCESTOR_FIELD : _a, sunburstStyle = options.sunburstStyle, _b = options.rawFields, rawFields = _b === void 0 ? [] : _b, shape = options.shape;
    var data = (0, utils_2.transformData)(options);
    chart.data(data);
    // 特殊处理下样式，如果没有设置 fillOpacity 的时候，默认根据层级进行填充透明度
    var style;
    if (sunburstStyle) {
        style = function (datum) {
            return (0, utils_1.deepAssign)({}, {
                fillOpacity: Math.pow(0.85, datum.depth),
            }, (0, util_1.isFunction)(sunburstStyle) ? sunburstStyle(datum) : sunburstStyle);
        };
    }
    // geometry
    (0, geometries_1.polygon)((0, utils_1.deepAssign)({}, params, {
        options: {
            xField: 'x',
            yField: 'y',
            seriesField: colorField,
            rawFields: (0, util_1.uniq)(tslib_1.__spreadArray(tslib_1.__spreadArray([], constant_1.RAW_FIELDS, true), rawFields, true)),
            polygon: {
                color: color,
                style: style,
                shape: shape,
            },
        },
    }));
    return params;
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart;
    chart.axis(false);
    return params;
}
exports.axis = axis;
/**
 * 数据标签
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label;
    var geometry = (0, utils_1.findGeometry)(chart, 'polygon');
    // 默认不展示，undefined 也不展示
    if (!label) {
        geometry.label(false);
    }
    else {
        var _a = label.fields, fields = _a === void 0 ? ['name'] : _a, callback = label.callback, cfg = tslib_1.__rest(label, ["fields", "callback"]);
        geometry.label({
            fields: fields,
            callback: callback,
            cfg: (0, utils_1.transformLabel)(cfg),
        });
    }
    return params;
}
/**
 * coord 配置
 * @param params
 */
function coordinate(params) {
    var chart = params.chart, options = params.options;
    var innerRadius = options.innerRadius, radius = options.radius, reflect = options.reflect;
    var coord = chart.coordinate({
        type: 'polar',
        cfg: {
            innerRadius: innerRadius,
            radius: radius,
        },
    });
    if (reflect) {
        coord.reflect(reflect);
    }
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a;
    var options = params.options;
    var hierarchyConfig = options.hierarchyConfig, meta = options.meta;
    return (0, utils_1.flow)((0, common_1.scale)({}, (_a = {},
        _a[constant_1.SUNBURST_Y_FIELD] = (0, util_1.get)(meta, (0, util_1.get)(hierarchyConfig, ['field'], 'value')),
        _a)))(params);
}
exports.meta = meta;
/**
 * tooltip 配置
 * @param params
 */
function tooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip;
    if (tooltip === false) {
        chart.tooltip(false);
    }
    else {
        var tooltipOptions = tooltip;
        // 设置了 fields，就不进行 customItems 了; 设置 formatter 时，需要搭配 fields
        if (!(0, util_1.get)(tooltip, 'fields')) {
            tooltipOptions = (0, utils_1.deepAssign)({}, {
                customItems: function (items) {
                    return items.map(function (item) {
                        var scales = (0, util_1.get)(chart.getOptions(), 'scales');
                        var pathFormatter = (0, util_1.get)(scales, [constant_1.SUNBURST_PATH_FIELD, 'formatter'], function (v) { return v; });
                        var valueFormatter = (0, util_1.get)(scales, [constant_1.SUNBURST_Y_FIELD, 'formatter'], function (v) { return v; });
                        return tslib_1.__assign(tslib_1.__assign({}, item), { name: pathFormatter(item.data[constant_1.SUNBURST_PATH_FIELD]), value: valueFormatter(item.data.value) });
                    });
                },
            }, tooltipOptions);
        }
        chart.tooltip(tooltipOptions);
    }
    return params;
}
exports.tooltip = tooltip;
function adaptorInteraction(options) {
    var drilldown = options.drilldown, _a = options.interactions, interactions = _a === void 0 ? [] : _a;
    if (drilldown === null || drilldown === void 0 ? void 0 : drilldown.enabled) {
        return (0, utils_1.deepAssign)({}, options, {
            interactions: tslib_1.__spreadArray(tslib_1.__spreadArray([], interactions, true), [
                {
                    type: 'drill-down',
                    cfg: { drillDownConfig: drilldown, transformData: utils_2.transformData },
                },
            ], false),
        });
    }
    return options;
}
/**
 * 交互配置
 * @param params
 * @returns
 */
function interaction(params) {
    var chart = params.chart, options = params.options;
    var drilldown = options.drilldown;
    (0, common_1.interaction)({
        chart: chart,
        options: adaptorInteraction(options),
    });
    // 适应下钻交互面包屑
    if (drilldown === null || drilldown === void 0 ? void 0 : drilldown.enabled) {
        // 为面包屑留出 25px 的空间
        chart.appendPadding = (0, padding_1.getAdjustAppendPadding)(chart.appendPadding, (0, util_1.get)(drilldown, ['breadCrumb', 'position']));
    }
    return params;
}
/**
 * 旭日图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(common_1.theme, (0, common_1.pattern)('sunburstStyle'), geometry, axis, meta, common_1.legend, coordinate, tooltip, label, interaction, common_1.animation, (0, common_1.annotation)())(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map