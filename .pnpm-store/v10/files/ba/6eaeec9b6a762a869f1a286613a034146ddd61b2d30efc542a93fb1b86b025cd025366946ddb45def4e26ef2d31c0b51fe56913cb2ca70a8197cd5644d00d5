import { __assign, __rest } from "tslib";
import { animation, annotation, interaction, legend, scale, theme, tooltip } from '../../adaptor/common';
import { interval, point } from '../../adaptor/geometries';
import { pattern } from '../../adaptor/pattern';
import { deepAssign, findGeometry, flow, processIllegalData, transformLabel } from '../../utils';
import { getScaleMax, getStackedData } from './utils';
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var style = options.barStyle, color = options.color, tooltip = options.tooltip, colorField = options.colorField, type = options.type, xField = options.xField, yField = options.yField, data = options.data, shape = options.shape;
    // 处理不合法的数据
    var processData = processIllegalData(data, yField);
    chart.data(processData);
    var p = deepAssign({}, params, {
        options: {
            tooltip: tooltip,
            seriesField: colorField,
            interval: {
                style: style,
                color: color,
                shape: shape || (type === 'line' ? 'line' : 'intervel'),
            },
            // 柱子的一些样式设置：柱子最小宽度、柱子最大宽度、柱子背景
            minColumnWidth: options.minBarWidth,
            maxColumnWidth: options.maxBarWidth,
            columnBackground: options.barBackground,
        },
    });
    interval(p);
    if (type === 'line') {
        point({
            chart: chart,
            options: { xField: xField, yField: yField, seriesField: colorField, point: { shape: 'circle', color: color } },
        });
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
    var yField = options.yField, xField = options.xField, data = options.data, isStack = options.isStack, isGroup = options.isGroup, colorField = options.colorField, maxAngle = options.maxAngle;
    var actualData = isStack && !isGroup && colorField ? getStackedData(data, xField, yField) : data;
    var processData = processIllegalData(actualData, yField);
    return flow(scale((_a = {},
        _a[yField] = {
            min: 0,
            max: getScaleMax(maxAngle, yField, processData),
        },
        _a)))(params);
}
/**
 * coordinate 配置
 * @param params
 */
function coordinate(params) {
    var chart = params.chart, options = params.options;
    var radius = options.radius, innerRadius = options.innerRadius, startAngle = options.startAngle, endAngle = options.endAngle;
    chart
        .coordinate({
        type: 'polar',
        cfg: {
            radius: radius,
            innerRadius: innerRadius,
            startAngle: startAngle,
            endAngle: endAngle,
        },
    })
        .transpose();
    return params;
}
/**
 * axis 配置
 * @param params
 */
export function axis(params) {
    var chart = params.chart, options = params.options;
    var xField = options.xField, xAxis = options.xAxis;
    chart.axis(xField, xAxis);
    return params;
}
/**
 * 数据标签
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, yField = options.yField;
    var intervalGeometry = findGeometry(chart, 'interval');
    // label 为 false, 空 则不显示 label
    if (!label) {
        intervalGeometry.label(false);
    }
    else {
        var callback = label.callback, cfg = __rest(label, ["callback"]);
        intervalGeometry.label({
            fields: [yField],
            callback: callback,
            cfg: __assign(__assign({}, transformLabel(cfg)), { type: 'polar' }),
        });
    }
    return params;
}
/**
 * 图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    return flow(pattern('barStyle'), geometry, meta, axis, coordinate, interaction, animation, theme, tooltip, legend, annotation(), label)(params);
}
//# sourceMappingURL=adaptor.js.map