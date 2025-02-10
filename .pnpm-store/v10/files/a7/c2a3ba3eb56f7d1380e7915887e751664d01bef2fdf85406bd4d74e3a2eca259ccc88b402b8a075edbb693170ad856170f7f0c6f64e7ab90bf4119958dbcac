import { animation, annotation, pattern, scale, theme, tooltip } from '../../adaptor/common';
import { area, line, point } from '../../adaptor/geometries';
import { deepAssign, flow } from '../../utils';
import { adjustYMetaByZero } from '../../utils/data';
import { X_FIELD, Y_FIELD } from '../tiny-line/constants';
import { getTinyData } from '../tiny-line/utils';
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, color = options.color, areaStyle = options.areaStyle, pointOptions = options.point, lineOptions = options.line;
    var pointState = pointOptions === null || pointOptions === void 0 ? void 0 : pointOptions.state;
    var seriesData = getTinyData(data);
    chart.data(seriesData);
    var primary = deepAssign({}, params, {
        options: {
            xField: X_FIELD,
            yField: Y_FIELD,
            area: { color: color, style: areaStyle },
            line: lineOptions,
            point: pointOptions,
        },
    });
    var second = deepAssign({}, primary, { options: { tooltip: false } });
    var pointParams = deepAssign({}, primary, { options: { tooltip: false, state: pointState } });
    // area geometry 处理
    area(primary);
    line(second);
    point(pointParams);
    chart.axis(false);
    chart.legend(false);
    return params;
}
/**
 * meta 配置
 * @param params
 */
export function meta(params) {
    var _a, _b;
    var options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, data = options.data;
    var seriesData = getTinyData(data);
    return flow(scale((_a = {},
        _a[X_FIELD] = xAxis,
        _a[Y_FIELD] = yAxis,
        _a), (_b = {},
        _b[X_FIELD] = {
            type: 'cat',
        },
        _b[Y_FIELD] = adjustYMetaByZero(seriesData, Y_FIELD),
        _b)))(params);
}
/**
 * 迷你面积图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    return flow(pattern('areaStyle'), geometry, meta, tooltip, theme, animation, annotation())(params);
}
//# sourceMappingURL=adaptor.js.map