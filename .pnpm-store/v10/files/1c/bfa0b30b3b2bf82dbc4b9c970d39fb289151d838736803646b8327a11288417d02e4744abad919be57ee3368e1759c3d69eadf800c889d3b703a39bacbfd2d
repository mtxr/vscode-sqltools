import { __assign, __rest } from "tslib";
import { each, omit } from '@antv/util';
import { animation, annotation, interaction, limitInPlot, pattern, slider, theme, tooltip, transformations, } from '../../adaptor/common';
import { area, line, point } from '../../adaptor/geometries';
import { deepAssign, findGeometry, flow, transformLabel } from '../../utils';
import { getDataWhetherPercentage } from '../../utils/transform/percent';
import { axis, legend, meta } from '../line/adaptor';
export { meta };
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, areaStyle = options.areaStyle, areaShape = options.areaShape, color = options.color, pointMapping = options.point, lineMapping = options.line, isPercent = options.isPercent, xField = options.xField, yField = options.yField, tooltip = options.tooltip, seriesField = options.seriesField, startOnZero = options.startOnZero;
    var pointState = pointMapping === null || pointMapping === void 0 ? void 0 : pointMapping.state;
    var chartData = getDataWhetherPercentage(data, yField, xField, yField, isPercent);
    chart.data(chartData);
    // 百分比堆积图，默认会给一个 % 格式化逻辑, 用户可自定义
    var tooltipOptions = isPercent
        ? __assign({ formatter: function (datum) { return ({
                name: datum[seriesField] || datum[xField],
                value: (Number(datum[yField]) * 100).toFixed(2) + '%',
            }); } }, tooltip) : tooltip;
    var primary = deepAssign({}, params, {
        options: {
            area: {
                color: color,
                style: areaStyle,
                shape: areaShape,
            },
            point: pointMapping && __assign({ color: color }, pointMapping),
            tooltip: tooltipOptions,
            // label 不传递给各个 geometry adaptor，由 label adaptor 处理
            label: undefined,
            args: {
                startOnZero: startOnZero,
            },
        },
    });
    // 线默认 2px (折线不能复用面积图的 state，因为 fill 和 stroke 不匹配)
    var lineParams = {
        chart: chart,
        options: deepAssign({ line: { size: 2 } }, omit(options, ['state']), {
            // 颜色保持一致，因为如果颜色不一致，会导致 tooltip 中元素重复。
            // 如果存在，才设置，否则为空
            line: lineMapping && __assign({ color: color }, lineMapping),
            sizeField: seriesField,
            state: lineMapping === null || lineMapping === void 0 ? void 0 : lineMapping.state,
            tooltip: false,
            // label 不传递给各个 geometry adaptor，由 label adaptor 处理
            label: undefined,
            args: {
                startOnZero: startOnZero,
            },
        }),
    };
    var pointParams = deepAssign({}, primary, { options: { tooltip: false, state: pointState } });
    // area geometry 处理
    area(primary);
    line(lineParams);
    point(pointParams);
    return params;
}
/**
 * 数据标签
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, yField = options.yField;
    var areaGeometry = findGeometry(chart, 'area');
    // label 为 false, 空 则不显示 label
    if (!label) {
        areaGeometry.label(false);
    }
    else {
        var fields = label.fields, callback = label.callback, cfg = __rest(label, ["fields", "callback"]);
        areaGeometry.label({
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
 * 处理 adjust
 * @param params
 */
function adjust(params) {
    var chart = params.chart, options = params.options;
    var isStack = options.isStack, isPercent = options.isPercent, seriesField = options.seriesField;
    if ((isPercent || isStack) && seriesField) {
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
    return flow(theme, pattern('areaStyle'), transformations('rect'), geometry, meta, adjust, axis, legend, tooltip, label, slider, annotation(), interaction, animation, limitInPlot)(params);
}
//# sourceMappingURL=adaptor.js.map