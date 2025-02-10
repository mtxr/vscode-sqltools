import { __assign, __rest } from "tslib";
import { animation, annotation, interaction, legend, scale, theme, tooltip } from '../../adaptor/common';
import { area, line, point } from '../../adaptor/geometries';
import { deepAssign, findGeometry, flow, transformLabel } from '../../utils';
/**
 * geometry 配置处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, lineStyle = options.lineStyle, color = options.color, pointOptions = options.point, areaOptions = options.area;
    chart.data(data);
    // 雷达图 主 geometry
    var primary = deepAssign({}, params, {
        options: {
            line: {
                style: lineStyle,
                color: color,
            },
            point: pointOptions
                ? __assign({ color: color }, pointOptions) : pointOptions,
            area: areaOptions
                ? __assign({ color: color }, areaOptions) : areaOptions,
            // label 不传递给各个 geometry adaptor，由 label adaptor 处理
            label: undefined,
        },
    });
    // 副 Geometry
    var second = deepAssign({}, primary, {
        options: {
            tooltip: false,
        },
    });
    // 优先使用 point.state, 其次取主元素的 state 状态样式配置
    var pointState = (pointOptions === null || pointOptions === void 0 ? void 0 : pointOptions.state) || options.state;
    var pointParams = deepAssign({}, primary, { options: { tooltip: false, state: pointState } });
    line(primary);
    point(pointParams);
    area(second);
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
 * coord 配置
 * @param params
 */
function coord(params) {
    var chart = params.chart, options = params.options;
    var radius = options.radius, startAngle = options.startAngle, endAngle = options.endAngle;
    chart.coordinate('polar', {
        radius: radius,
        startAngle: startAngle,
        endAngle: endAngle,
    });
    return params;
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xField = options.xField, xAxis = options.xAxis, yField = options.yField, yAxis = options.yAxis;
    chart.axis(xField, xAxis);
    chart.axis(yField, yAxis);
    return params;
}
/**
 * label 配置
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, yField = options.yField;
    var geometry = findGeometry(chart, 'line');
    if (!label) {
        geometry.label(false);
    }
    else {
        var fields = label.fields, callback = label.callback, cfg = __rest(label, ["fields", "callback"]);
        geometry.label({
            fields: fields || [yField],
            callback: callback,
            cfg: transformLabel(cfg),
        });
    }
    return params;
}
/**
 * 雷达图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return flow(geometry, meta, theme, coord, axis, legend, tooltip, label, interaction, animation, annotation())(params);
}
//# sourceMappingURL=adaptor.js.map