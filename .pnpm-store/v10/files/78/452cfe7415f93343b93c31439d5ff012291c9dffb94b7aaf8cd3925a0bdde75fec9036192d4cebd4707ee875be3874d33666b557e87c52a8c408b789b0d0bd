import { animation, interaction, scale, theme } from '../../adaptor/common';
import { flow } from '../../utils';
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, xField = options.xField, yField = options.yField;
    chart.data(data);
    chart.interval().position("".concat(xField, "*").concat(yField));
    return params;
}
/**
 * meta 配置
 * @param params
 */
export function meta(params) {
    var _a;
    var options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    return flow(scale((_a = {},
        _a[xField] = xAxis,
        _a[yField] = yAxis,
        _a)))(params);
}
/**
 * 图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return flow(theme, geometry, meta, interaction, animation
    // ... 其他的 adaptor flow
    )(params);
}
//# sourceMappingURL=adaptor.js.map