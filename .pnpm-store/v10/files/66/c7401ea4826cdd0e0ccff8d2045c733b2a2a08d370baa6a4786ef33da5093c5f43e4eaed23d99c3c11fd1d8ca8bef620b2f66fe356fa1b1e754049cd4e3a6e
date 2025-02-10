import { animation, annotation, interaction, slider, theme } from '../../adaptor/common';
import { schema } from '../../adaptor/geometries';
import { AXIS_META_CONFIG_KEYS } from '../../constant';
import { deepAssign, flow, pick } from '../../utils';
import { TREND_DOWN, TREND_FIELD, TREND_UP, Y_FIELD } from './constant';
import { getStockData } from './utils';
/**
 * 图表配置处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var yField = options.yField;
    var data = options.data, risingFill = options.risingFill, fallingFill = options.fallingFill, tooltip = options.tooltip, stockStyle = options.stockStyle;
    chart.data(getStockData(data, yField));
    var tooltipOptions = tooltip;
    if (tooltipOptions !== false) {
        tooltipOptions = deepAssign({}, { fields: yField }, tooltipOptions);
    }
    schema(deepAssign({}, params, {
        options: {
            schema: {
                shape: 'candle',
                color: [risingFill, fallingFill],
                style: stockStyle,
            },
            yField: Y_FIELD,
            seriesField: TREND_FIELD,
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
export function meta(params) {
    var _a, _b;
    var chart = params.chart, options = params.options;
    var meta = options.meta, xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField;
    var baseMeta = (_a = {},
        _a[xField] = {
            type: 'timeCat',
            tickCount: 6,
        },
        _a[TREND_FIELD] = {
            values: [TREND_UP, TREND_DOWN],
        },
        _a);
    var scales = deepAssign(baseMeta, meta, (_b = {},
        _b[xField] = pick(xAxis, AXIS_META_CONFIG_KEYS),
        _b[Y_FIELD] = pick(yAxis, AXIS_META_CONFIG_KEYS),
        _b));
    chart.scale(scales);
    return params;
}
/**
 * axis 配置
 * @param params
 */
export function axis(params) {
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
        chart.axis(Y_FIELD, false);
    }
    else {
        chart.axis(Y_FIELD, yAxis);
    }
    return params;
}
/**
 * tooltip 配置
 * @param params
 */
export function tooltip(params) {
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
/**
 * legend 配置
 * @param params
 */
export function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend;
    if (legend) {
        chart.legend(TREND_FIELD, legend);
    }
    else if (legend === false) {
        chart.legend(false);
    }
    return params;
}
/**
 * K线图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    flow(theme, geometry, meta, axis, tooltip, legend, interaction, animation, annotation(), slider)(params);
}
//# sourceMappingURL=adaptor.js.map