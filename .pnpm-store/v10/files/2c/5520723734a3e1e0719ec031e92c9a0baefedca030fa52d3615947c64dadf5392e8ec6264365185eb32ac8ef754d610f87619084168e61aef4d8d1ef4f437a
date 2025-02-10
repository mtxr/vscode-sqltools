import { __assign, __rest, __spreadArray } from "tslib";
import { get, isFunction, uniq } from '@antv/util';
import { animation, annotation, interaction as baseInteraction, legend, pattern, scale, theme, } from '../../adaptor/common';
import { polygon as polygonAdaptor } from '../../adaptor/geometries';
import { deepAssign, findGeometry, flow, transformLabel } from '../../utils';
import { getAdjustAppendPadding } from '../../utils/padding';
import { RAW_FIELDS, SUNBURST_ANCESTOR_FIELD, SUNBURST_PATH_FIELD, SUNBURST_Y_FIELD } from './constant';
import { transformData } from './utils';
/**
 * geometry 配置处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var color = options.color, _a = options.colorField, colorField = _a === void 0 ? SUNBURST_ANCESTOR_FIELD : _a, sunburstStyle = options.sunburstStyle, _b = options.rawFields, rawFields = _b === void 0 ? [] : _b, shape = options.shape;
    var data = transformData(options);
    chart.data(data);
    // 特殊处理下样式，如果没有设置 fillOpacity 的时候，默认根据层级进行填充透明度
    var style;
    if (sunburstStyle) {
        style = function (datum) {
            return deepAssign({}, {
                fillOpacity: Math.pow(0.85, datum.depth),
            }, isFunction(sunburstStyle) ? sunburstStyle(datum) : sunburstStyle);
        };
    }
    // geometry
    polygonAdaptor(deepAssign({}, params, {
        options: {
            xField: 'x',
            yField: 'y',
            seriesField: colorField,
            rawFields: uniq(__spreadArray(__spreadArray([], RAW_FIELDS, true), rawFields, true)),
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
export function axis(params) {
    var chart = params.chart;
    chart.axis(false);
    return params;
}
/**
 * 数据标签
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label;
    var geometry = findGeometry(chart, 'polygon');
    // 默认不展示，undefined 也不展示
    if (!label) {
        geometry.label(false);
    }
    else {
        var _a = label.fields, fields = _a === void 0 ? ['name'] : _a, callback = label.callback, cfg = __rest(label, ["fields", "callback"]);
        geometry.label({
            fields: fields,
            callback: callback,
            cfg: transformLabel(cfg),
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
export function meta(params) {
    var _a;
    var options = params.options;
    var hierarchyConfig = options.hierarchyConfig, meta = options.meta;
    return flow(scale({}, (_a = {},
        _a[SUNBURST_Y_FIELD] = get(meta, get(hierarchyConfig, ['field'], 'value')),
        _a)))(params);
}
/**
 * tooltip 配置
 * @param params
 */
export function tooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip;
    if (tooltip === false) {
        chart.tooltip(false);
    }
    else {
        var tooltipOptions = tooltip;
        // 设置了 fields，就不进行 customItems 了; 设置 formatter 时，需要搭配 fields
        if (!get(tooltip, 'fields')) {
            tooltipOptions = deepAssign({}, {
                customItems: function (items) {
                    return items.map(function (item) {
                        var scales = get(chart.getOptions(), 'scales');
                        var pathFormatter = get(scales, [SUNBURST_PATH_FIELD, 'formatter'], function (v) { return v; });
                        var valueFormatter = get(scales, [SUNBURST_Y_FIELD, 'formatter'], function (v) { return v; });
                        return __assign(__assign({}, item), { name: pathFormatter(item.data[SUNBURST_PATH_FIELD]), value: valueFormatter(item.data.value) });
                    });
                },
            }, tooltipOptions);
        }
        chart.tooltip(tooltipOptions);
    }
    return params;
}
function adaptorInteraction(options) {
    var drilldown = options.drilldown, _a = options.interactions, interactions = _a === void 0 ? [] : _a;
    if (drilldown === null || drilldown === void 0 ? void 0 : drilldown.enabled) {
        return deepAssign({}, options, {
            interactions: __spreadArray(__spreadArray([], interactions, true), [
                {
                    type: 'drill-down',
                    cfg: { drillDownConfig: drilldown, transformData: transformData },
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
    baseInteraction({
        chart: chart,
        options: adaptorInteraction(options),
    });
    // 适应下钻交互面包屑
    if (drilldown === null || drilldown === void 0 ? void 0 : drilldown.enabled) {
        // 为面包屑留出 25px 的空间
        chart.appendPadding = getAdjustAppendPadding(chart.appendPadding, get(drilldown, ['breadCrumb', 'position']));
    }
    return params;
}
/**
 * 旭日图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return flow(theme, pattern('sunburstStyle'), geometry, axis, meta, legend, coordinate, tooltip, label, interaction, animation, annotation())(params);
}
//# sourceMappingURL=adaptor.js.map