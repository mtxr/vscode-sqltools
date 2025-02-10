import { __assign } from "tslib";
import { get, isArray, map } from '@antv/util';
import { geometry as baseGeometry } from '../../../adaptor/geometries/base';
import { findGeometry, flow } from '../../../utils';
import { getTooltipMapping } from '../../../utils/tooltip';
import { FUNNEL_CONVERSATION, FUNNEL_MAPPING_VALUE, FUNNEL_PERCENT } from '../constant';
import { conversionTagComponent, transformData } from './common';
/**
 * 处理字段数据
 * @param params
 */
function field(params) {
    var chart = params.chart, options = params.options;
    var _a = options.data, data = _a === void 0 ? [] : _a, yField = options.yField, maxSize = options.maxSize, minSize = options.minSize;
    var formatData = transformData(data, data, {
        yField: yField,
        maxSize: maxSize,
        minSize: minSize,
    });
    // 绘制漏斗图
    chart.data(formatData);
    return params;
}
/**
 * geometry处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var xField = options.xField, yField = options.yField, color = options.color, tooltip = options.tooltip, label = options.label, _a = options.shape, shape = _a === void 0 ? 'funnel' : _a, funnelStyle = options.funnelStyle, state = options.state;
    var _b = getTooltipMapping(tooltip, [xField, yField]), fields = _b.fields, formatter = _b.formatter;
    baseGeometry({
        chart: chart,
        options: {
            type: 'interval',
            xField: xField,
            yField: FUNNEL_MAPPING_VALUE,
            colorField: xField,
            tooltipFields: isArray(fields) && fields.concat([FUNNEL_PERCENT, FUNNEL_CONVERSATION]),
            mapping: {
                shape: shape,
                tooltip: formatter,
                color: color,
                style: funnelStyle,
            },
            label: label,
            state: state,
        },
    });
    var geo = findGeometry(params.chart, 'interval');
    geo.adjust('symmetric');
    return params;
}
/**
 * 转置处理
 * @param params
 */
function transpose(params) {
    var chart = params.chart, options = params.options;
    var isTransposed = options.isTransposed;
    chart.coordinate({
        type: 'rect',
        actions: !isTransposed ? [['transpose'], ['scale', 1, -1]] : [],
    });
    return params;
}
/**
 * 转化率组件
 * @param params
 */
export function conversionTag(params) {
    var options = params.options, chart = params.chart;
    var maxSize = options.maxSize;
    // 获取形状位置，再转化为需要的转化率位置
    var dataArray = get(chart, ['geometries', '0', 'dataArray'], []);
    var size = get(chart, ['options', 'data', 'length']);
    var x = map(dataArray, function (item) { return get(item, ['0', 'nextPoints', '0', 'x']) * size - 0.5; });
    var getLineCoordinate = function (datum, datumIndex, data, initLineOption) {
        var percent = maxSize - (maxSize - datum[FUNNEL_MAPPING_VALUE]) / 2;
        return __assign(__assign({}, initLineOption), { start: [x[datumIndex - 1] || datumIndex - 0.5, percent], end: [x[datumIndex - 1] || datumIndex - 0.5, percent + 0.05] });
    };
    conversionTagComponent(getLineCoordinate)(params);
    return params;
}
/**
 * 基础漏斗
 * @param chart
 * @param options
 */
export function basicFunnel(params) {
    return flow(field, geometry, transpose, conversionTag)(params);
}
//# sourceMappingURL=basic.js.map