import { isString } from '@antv/util';
import { animation, annotation, scale, theme } from '../../adaptor/common';
import { interval } from '../../adaptor/geometries';
import { deepAssign, flow } from '../../utils';
import { DEFAULT_COLOR } from './constants';
import { getProgressData } from './utils';
/**
 * 字段
 * @param params
 */
export function geometry(params) {
    var chart = params.chart, options = params.options;
    var percent = options.percent, progressStyle = options.progressStyle, color = options.color, barWidthRatio = options.barWidthRatio;
    chart.data(getProgressData(percent));
    var p = deepAssign({}, params, {
        options: {
            xField: 'current',
            yField: 'percent',
            seriesField: 'type',
            widthRatio: barWidthRatio,
            interval: {
                style: progressStyle,
                color: isString(color) ? [color, DEFAULT_COLOR[1]] : color,
            },
            args: {
                zIndexReversed: true,
                sortZIndex: true,
            },
        },
    });
    interval(p);
    // 关闭组件
    chart.tooltip(false);
    chart.axis(false);
    chart.legend(false);
    return params;
}
/**
 * other 配置
 * @param params
 */
function coordinate(params) {
    var chart = params.chart;
    chart.coordinate('rect').transpose();
    return params;
}
/**
 * 进度图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // @ts-ignore
    return flow(geometry, scale({}), coordinate, animation, theme, annotation())(params);
}
//# sourceMappingURL=adaptor.js.map