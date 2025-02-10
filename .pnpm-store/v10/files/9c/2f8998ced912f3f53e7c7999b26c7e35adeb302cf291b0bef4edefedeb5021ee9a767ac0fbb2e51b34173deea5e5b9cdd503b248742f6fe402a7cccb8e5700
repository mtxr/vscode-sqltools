import { __assign, __rest } from "tslib";
import { each, isArray } from '@antv/util';
import { animation, annotation, interaction, limitInPlot, scale, scrollbar, slider, theme, tooltip, } from '../../adaptor/common';
import { area, line, point } from '../../adaptor/geometries';
import { deepAssign, findGeometry, flow, transformLabel } from '../../utils';
import { adjustYMetaByZero } from '../../utils/data';
/**
 * geometry 配置处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, color = options.color, lineStyle = options.lineStyle, lineShape = options.lineShape, pointMapping = options.point, areaMapping = options.area, seriesField = options.seriesField;
    var pointState = pointMapping === null || pointMapping === void 0 ? void 0 : pointMapping.state;
    var areaState = areaMapping === null || areaMapping === void 0 ? void 0 : areaMapping.state;
    chart.data(data);
    // line geometry 处理
    var primary = deepAssign({}, params, {
        options: {
            shapeField: seriesField,
            line: {
                color: color,
                style: lineStyle,
                shape: lineShape,
            },
            // 颜色保持一致，因为如果颜色不一致，会导致 tooltip 中元素重复。
            // 如果存在，才设置，否则为空
            point: pointMapping && __assign({ color: color, shape: 'circle' }, pointMapping),
            // 面积配置
            area: areaMapping && __assign({ color: color }, areaMapping),
            // label 不传递给各个 geometry adaptor，由 label adaptor 处理
            label: undefined,
        },
    });
    var second = deepAssign({}, primary, { options: { tooltip: false, state: pointState } });
    var areaParams = deepAssign({}, primary, { options: { tooltip: false, state: areaState } });
    line(primary);
    point(second);
    area(areaParams);
    return params;
}
/**
 * meta 配置
 * @param params
 */
export function meta(params) {
    var _a, _b;
    var options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField, data = options.data;
    return flow(scale((_a = {},
        _a[xField] = xAxis,
        _a[yField] = yAxis,
        _a), (_b = {},
        _b[xField] = {
            type: 'cat',
        },
        _b[yField] = adjustYMetaByZero(data, yField),
        _b)))(params);
}
/**
 * 坐标系配置. 支持 reflect 镜像处理
 * @param params
 */
function coordinate(params) {
    var chart = params.chart, options = params.options;
    var reflect = options.reflect;
    if (reflect) {
        var p = reflect;
        if (!isArray(p)) {
            p = [p];
        }
        var actions = p.map(function (d) { return ['reflect', d]; });
        chart.coordinate({ type: 'rect', actions: actions });
    }
    return params;
}
/**
 * axis 配置
 * @param params
 */
export function axis(params) {
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
    }
    else {
        chart.axis(yField, yAxis);
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
    if (legend && seriesField) {
        chart.legend(seriesField, legend);
    }
    else if (legend === false) {
        chart.legend(false);
    }
    return params;
}
/**
 * 数据标签
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, yField = options.yField;
    var lineGeometry = findGeometry(chart, 'line');
    // label 为 false, 空 则不显示 label
    if (!label) {
        lineGeometry.label(false);
    }
    else {
        var fields = label.fields, callback = label.callback, cfg = __rest(label, ["fields", "callback"]);
        lineGeometry.label({
            fields: fields || [yField],
            callback: callback,
            cfg: __assign({ layout: [
                    { type: 'limit-in-plot' },
                    { type: 'path-adjust-position' },
                    { type: 'point-adjust-position' },
                    { type: 'limit-in-plot', cfg: { action: 'hide' } },
                ] }, transformLabel(cfg)),
        });
    }
    return params;
}
/**
 * 统一处理 adjust
 * @param params
 */
export function adjust(params) {
    var chart = params.chart, options = params.options;
    var isStack = options.isStack;
    if (isStack) {
        each(chart.geometries, function (g) {
            g.adjust('stack');
        });
    }
    return params;
}
/**
 * 折线图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return flow(geometry, meta, adjust, theme, coordinate, axis, legend, tooltip, label, slider, scrollbar, interaction, animation, annotation(), limitInPlot)(params);
}
//# sourceMappingURL=adaptor.js.map