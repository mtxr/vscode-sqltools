import { animation, annotation, pattern, theme, tooltip } from '../../adaptor/common';
import { interval } from '../../adaptor/geometries';
import { deepAssign, flow } from '../../utils';
import { meta } from '../tiny-area/adaptor';
import { X_FIELD, Y_FIELD } from '../tiny-line/constants';
import { getTinyData } from '../tiny-line/utils';
export { meta };
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, color = options.color, columnStyle = options.columnStyle, columnWidthRatio = options.columnWidthRatio;
    var seriesData = getTinyData(data);
    chart.data(seriesData);
    var p = deepAssign({}, params, {
        options: {
            xField: X_FIELD,
            yField: Y_FIELD,
            widthRatio: columnWidthRatio,
            interval: {
                style: columnStyle,
                color: color,
            },
        },
    });
    interval(p);
    chart.axis(false);
    chart.legend(false);
    chart.interaction('element-active');
    return params;
}
/**
 * 迷你柱形图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    return flow(theme, pattern('columnStyle'), geometry, meta, tooltip, animation, annotation())(params);
}
//# sourceMappingURL=adaptor.js.map