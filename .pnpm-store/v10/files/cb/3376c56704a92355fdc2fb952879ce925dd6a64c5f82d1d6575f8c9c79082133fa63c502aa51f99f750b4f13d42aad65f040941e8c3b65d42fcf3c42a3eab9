import { __assign, __rest } from "tslib";
import { get } from '@antv/util';
import { animation, annotation, interaction, scale, state, theme } from '../../adaptor/common';
import { interval } from '../../adaptor/geometries';
import { getLocale } from '../../core/locale';
import { deepAssign, findGeometry, flow, transformLabel } from '../../utils';
import { ABSOLUTE_FIELD, DIFF_FIELD, IS_TOTAL, Y_FIELD } from './constant';
import './shape';
import { transformData } from './utils';
/**
 *  处理默认配置项
 * @param params
 * @returns
 */
function defaultOptions(params) {
    var _a = params.options, locale = _a.locale, total = _a.total;
    var localeTotalLabel = getLocale(locale).get(['waterfall', 'total']);
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
    chart.data(transformData(data, xField, yField, total));
    // 瀑布图自带的 colorMapping
    var colorMapping = color ||
        function (datum) {
            if (get(datum, [IS_TOTAL])) {
                return get(total, ['style', 'fill'], '');
            }
            return get(datum, [Y_FIELD, 1]) - get(datum, [Y_FIELD, 0]) > 0 ? risingFill : fallingFill;
        };
    var p = deepAssign({}, params, {
        options: {
            xField: xField,
            yField: Y_FIELD,
            seriesField: xField,
            rawFields: [yField, DIFF_FIELD, IS_TOTAL, Y_FIELD],
            widthRatio: columnWidthRatio,
            interval: {
                style: waterfallStyle,
                // 支持外部自定义形状
                shape: shape || 'waterfall',
                color: colorMapping,
            },
        },
    });
    var ext = interval(p).ext;
    var geometry = ext.geometry;
    // 将 waterfall leaderLineCfg 传入到自定义 shape 中
    geometry.customInfo(__assign(__assign({}, customInfo), { leaderLine: leaderLine }));
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
    var Y_FIELD_META = deepAssign({}, { alias: yField }, get(meta, yField));
    return flow(scale((_a = {},
        _a[xField] = xAxis,
        _a[yField] = yAxis,
        _a[Y_FIELD] = yAxis,
        _a), deepAssign({}, meta, (_b = {}, _b[Y_FIELD] = Y_FIELD_META, _b[DIFF_FIELD] = Y_FIELD_META, _b[ABSOLUTE_FIELD] = Y_FIELD_META, _b))))(params);
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
        chart.axis(Y_FIELD, false);
    }
    else {
        chart.axis(yField, yAxis);
        chart.axis(Y_FIELD, yAxis);
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
    var i18n = getLocale(locale);
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
                    style: deepAssign({}, { r: 5 }, get(total, 'style')),
                },
            });
        }
        chart.legend(deepAssign({}, {
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
    var geometry = findGeometry(chart, 'interval');
    if (!label) {
        geometry.label(false);
    }
    else {
        var callback = label.callback, cfg = __rest(label, ["callback"]);
        geometry.label({
            fields: labelMode === 'absolute' ? [ABSOLUTE_FIELD, xField] : [DIFF_FIELD, xField],
            callback: callback,
            cfg: transformLabel(cfg),
        });
    }
    return params;
}
/**
 * tooltip 配置
 * @param params
 */
export function tooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip, xField = options.xField, yField = options.yField;
    if (tooltip !== false) {
        chart.tooltip(__assign({ showCrosshairs: false, showMarkers: false, shared: true, 
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
/**
 * 瀑布图适配器
 * @param params
 */
export function adaptor(params) {
    return flow(defaultOptions, theme, geometry, meta, axis, legend, tooltip, label, state, interaction, animation, annotation())(params);
}
//# sourceMappingURL=adaptor.js.map