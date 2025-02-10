import { __rest } from "tslib";
import { animation, interaction, scale, state, theme, tooltip } from '../../adaptor/common';
import { interval } from '../../adaptor/geometries';
import { pattern } from '../../adaptor/pattern';
import { deepAssign, findGeometry, flow, transformLabel } from '../../utils';
import { binHistogram } from '../../utils/transform/histogram';
import { HISTOGRAM_X_FIELD, HISTOGRAM_Y_FIELD } from './constant';
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, binField = options.binField, binNumber = options.binNumber, binWidth = options.binWidth, color = options.color, stackField = options.stackField, legend = options.legend, columnStyle = options.columnStyle;
    // 处理数据
    var plotData = binHistogram(data, binField, binWidth, binNumber, stackField);
    chart.data(plotData);
    var p = deepAssign({}, params, {
        options: {
            xField: HISTOGRAM_X_FIELD,
            yField: HISTOGRAM_Y_FIELD,
            seriesField: stackField,
            isStack: true,
            interval: {
                color: color,
                style: columnStyle,
            },
        },
    });
    interval(p);
    // 图例
    if (legend && stackField) {
        chart.legend(stackField, legend);
    }
    else {
        chart.legend(false);
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
    var xAxis = options.xAxis, yAxis = options.yAxis;
    return flow(scale((_a = {},
        _a[HISTOGRAM_X_FIELD] = xAxis,
        _a[HISTOGRAM_Y_FIELD] = yAxis,
        _a)))(params);
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis;
    // 为 false 则是不显示轴
    if (xAxis === false) {
        chart.axis(HISTOGRAM_X_FIELD, false);
    }
    else {
        chart.axis(HISTOGRAM_X_FIELD, xAxis);
    }
    if (yAxis === false) {
        chart.axis(HISTOGRAM_Y_FIELD, false);
    }
    else {
        chart.axis(HISTOGRAM_Y_FIELD, yAxis);
    }
    return params;
}
/**
 * label 配置
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label;
    var geometry = findGeometry(chart, 'interval');
    if (!label) {
        geometry.label(false);
    }
    else {
        var callback = label.callback, cfg = __rest(label, ["callback"]);
        geometry.label({
            fields: [HISTOGRAM_Y_FIELD],
            callback: callback,
            cfg: transformLabel(cfg),
        });
    }
    return params;
}
/**
 * 直方图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return flow(theme, pattern('columnStyle'), geometry, meta, axis, state, label, tooltip, interaction, animation)(params);
}
//# sourceMappingURL=adaptor.js.map