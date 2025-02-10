import { __rest } from "tslib";
import { filter, isArray, isObject } from '@antv/util';
import { animation, annotation, interaction, pattern, scale, state, theme, tooltip } from '../../adaptor/common';
import { interval } from '../../adaptor/geometries';
import { deepAssign, findGeometry, flow, LEVEL, log, transformLabel } from '../../utils';
/**
 * geometry 配置处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, sectorStyle = options.sectorStyle, shape = options.shape, color = options.color;
    // 装载数据
    chart.data(data);
    flow(interval)(deepAssign({}, params, {
        options: {
            marginRatio: 1,
            interval: {
                style: sectorStyle,
                color: color,
                shape: shape,
            },
        },
    }));
    return params;
}
/**
 * label 配置
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, xField = options.xField;
    var geometry = findGeometry(chart, 'interval');
    // label 为 false 不显示 label
    if (label === false) {
        geometry.label(false);
    }
    else if (isObject(label)) {
        var callback = label.callback, fields = label.fields, cfg = __rest(label, ["callback", "fields"]);
        var offset = cfg.offset;
        var layout = cfg.layout;
        // 当 label 在 shape 外部显示时，设置 'limit-in-shape' 会
        // 造成 label 不显示。
        if (offset === undefined || offset >= 0) {
            layout = layout ? (isArray(layout) ? layout : [layout]) : [];
            cfg.layout = filter(layout, function (v) { return v.type !== 'limit-in-shape'; });
            cfg.layout.length || delete cfg.layout;
        }
        geometry.label({
            fields: fields || [xField],
            callback: callback,
            cfg: transformLabel(cfg),
        });
    }
    else {
        log(LEVEL.WARN, label === null, 'the label option must be an Object.');
        geometry.label({ fields: [xField] });
    }
    return params;
}
/**
 * legend 配置
 * @param params
 */
export function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, seriesField = options.seriesField;
    if (legend === false) {
        chart.legend(false);
    }
    else if (seriesField) {
        chart.legend(seriesField, legend);
    }
    return params;
}
/**
 * coord 配置
 * @param params
 */
function coordinate(params) {
    var chart = params.chart, options = params.options;
    var radius = options.radius, innerRadius = options.innerRadius, startAngle = options.startAngle, endAngle = options.endAngle;
    chart.coordinate({
        type: 'polar',
        cfg: {
            radius: radius,
            innerRadius: innerRadius,
            startAngle: startAngle,
            endAngle: endAngle,
        },
    });
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a;
    var options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    return flow(scale((_a = {},
        _a[xField] = xAxis,
        _a[yField] = yAxis,
        _a)))(params);
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    // 为 falsy 则是不显示轴
    if (!xAxis) {
        chart.axis(xField, false);
    }
    else {
        chart.axis(xField, xAxis);
    }
    if (!yAxis) {
        chart.axis(yField, false);
    }
    else {
        chart.axis(yField, yAxis);
    }
    return params;
}
/**
 * 玫瑰图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    flow(pattern('sectorStyle'), geometry, meta, label, coordinate, axis, legend, tooltip, interaction, animation, theme, annotation(), state)(params);
}
//# sourceMappingURL=adaptor.js.map