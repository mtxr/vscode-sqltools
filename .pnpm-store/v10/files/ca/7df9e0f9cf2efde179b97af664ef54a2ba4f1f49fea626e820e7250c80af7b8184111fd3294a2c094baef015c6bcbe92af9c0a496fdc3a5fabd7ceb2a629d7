import { animation, annotation, theme, tooltip } from '../../adaptor/common';
import { line, point } from '../../adaptor/geometries';
import { deepAssign, flow } from '../../utils';
import { meta } from '../tiny-area/adaptor';
import { X_FIELD, Y_FIELD } from './constants';
import { getTinyData } from './utils';
export { meta };
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, color = options.color, lineStyle = options.lineStyle, pointMapping = options.point;
    var pointState = pointMapping === null || pointMapping === void 0 ? void 0 : pointMapping.state;
    var seriesData = getTinyData(data);
    chart.data(seriesData);
    // line geometry 处理
    var primary = deepAssign({}, params, {
        options: {
            xField: X_FIELD,
            yField: Y_FIELD,
            line: {
                color: color,
                style: lineStyle,
            },
            point: pointMapping,
        },
    });
    var pointParams = deepAssign({}, primary, { options: { tooltip: false, state: pointState } });
    line(primary);
    point(pointParams);
    chart.axis(false);
    chart.legend(false);
    return params;
}
/**
 * 迷你折线图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    return flow(geometry, meta, theme, tooltip, animation, annotation())(params);
}
//# sourceMappingURL=adaptor.js.map