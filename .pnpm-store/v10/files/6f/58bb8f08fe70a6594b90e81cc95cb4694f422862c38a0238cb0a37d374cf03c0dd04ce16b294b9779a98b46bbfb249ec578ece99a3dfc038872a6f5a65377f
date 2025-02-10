import { __assign } from "tslib";
import { get, isFunction } from '@antv/util';
import { animation, interaction, scale, theme, tooltip } from '../../adaptor/common';
import { interval, point } from '../../adaptor/geometries';
import { deepAssign, flow, transformLabel } from '../../utils';
import { transformData } from './utils';
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var bulletStyle = options.bulletStyle, targetField = options.targetField, rangeField = options.rangeField, measureField = options.measureField, xField = options.xField, color = options.color, layout = options.layout, size = options.size, label = options.label;
    // 处理数据
    var _a = transformData(options), min = _a.min, max = _a.max, ds = _a.ds;
    chart.data(ds);
    // rangeGeometry
    var r = deepAssign({}, params, {
        options: {
            xField: xField,
            yField: rangeField,
            seriesField: 'rKey',
            isStack: true,
            label: get(label, 'range'),
            interval: {
                color: get(color, 'range'),
                style: get(bulletStyle, 'range'),
                size: get(size, 'range'),
            },
        },
    });
    interval(r);
    // 范围值的 tooltip 隐藏掉
    chart.geometries[0].tooltip(false);
    // measureGeometry
    var m = deepAssign({}, params, {
        options: {
            xField: xField,
            yField: measureField,
            seriesField: 'mKey',
            isStack: true,
            label: get(label, 'measure'),
            interval: {
                color: get(color, 'measure'),
                style: get(bulletStyle, 'measure'),
                size: get(size, 'measure'),
            },
        },
    });
    interval(m);
    // targetGeometry
    var t = deepAssign({}, params, {
        options: {
            xField: xField,
            yField: targetField,
            seriesField: 'tKey',
            label: get(label, 'target'),
            point: {
                color: get(color, 'target'),
                style: get(bulletStyle, 'target'),
                size: isFunction(get(size, 'target'))
                    ? function (data) { return get(size, 'target')(data) / 2; }
                    : get(size, 'target') / 2,
                shape: layout === 'horizontal' ? 'line' : 'hyphen',
            },
        },
    });
    point(t);
    // 水平的时候，要转换坐标轴
    if (layout === 'horizontal') {
        chart.coordinate().transpose();
    }
    return __assign(__assign({}, params), { ext: { data: { min: min, max: max } } });
}
/**
 * meta 配置
 * @param params
 */
export function meta(params) {
    var _a, _b;
    var options = params.options, ext = params.ext;
    var xAxis = options.xAxis, yAxis = options.yAxis, targetField = options.targetField, rangeField = options.rangeField, measureField = options.measureField, xField = options.xField;
    var extData = ext.data;
    return flow(scale((_a = {},
        _a[xField] = xAxis,
        _a[measureField] = yAxis,
        _a), (_b = {},
        _b[measureField] = { min: extData === null || extData === void 0 ? void 0 : extData.min, max: extData === null || extData === void 0 ? void 0 : extData.max, sync: true },
        _b[targetField] = {
            sync: "".concat(measureField),
        },
        _b[rangeField] = {
            sync: "".concat(measureField),
        },
        _b)))(params);
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, measureField = options.measureField, rangeField = options.rangeField, targetField = options.targetField;
    chart.axis("".concat(rangeField), false);
    chart.axis("".concat(targetField), false);
    // 为 false 则是不显示轴
    if (xAxis === false) {
        chart.axis("".concat(xField), false);
    }
    else {
        chart.axis("".concat(xField), xAxis);
    }
    if (yAxis === false) {
        chart.axis("".concat(measureField), false);
    }
    else {
        chart.axis("".concat(measureField), yAxis);
    }
    return params;
}
/**
 * legend 配置
 * @param params
 */
function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend;
    chart.removeInteraction('legend-filter');
    // @TODO 后续看是否内部自定义一个 legend
    chart.legend(legend);
    // 默认关闭掉所在 color 字段的 legend, 从而不影响自定义的legend
    chart.legend('rKey', false);
    chart.legend('mKey', false);
    chart.legend('tKey', false);
    return params;
}
/**
 * label 配置
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, measureField = options.measureField, targetField = options.targetField, rangeField = options.rangeField;
    var _a = chart.geometries, rangeGeometry = _a[0], measureGeometry = _a[1], targetGeometry = _a[2];
    if (get(label, 'range')) {
        rangeGeometry.label("".concat(rangeField), __assign({ layout: [{ type: 'limit-in-plot' }] }, transformLabel(label.range)));
    }
    else {
        rangeGeometry.label(false);
    }
    if (get(label, 'measure')) {
        measureGeometry.label("".concat(measureField), __assign({ layout: [{ type: 'limit-in-plot' }] }, transformLabel(label.measure)));
    }
    else {
        measureGeometry.label(false);
    }
    if (get(label, 'target')) {
        targetGeometry.label("".concat(targetField), __assign({ layout: [{ type: 'limit-in-plot' }] }, transformLabel(label.target)));
    }
    else {
        targetGeometry.label(false);
    }
    return params;
}
/**
 * 子弹图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    flow(geometry, meta, axis, legend, theme, label, tooltip, interaction, animation)(params);
}
//# sourceMappingURL=adaptor.js.map