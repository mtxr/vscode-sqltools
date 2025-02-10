import { __assign } from "tslib";
import { get, isNil } from '@antv/util';
import { animation, annotation, scale, theme } from '../../adaptor/common';
import { deepAssign, flow, renderStatistic } from '../../utils';
import { geometry } from '../progress/adaptor';
/**
 * coordinate 配置
 * @param params
 */
function coordinate(params) {
    var chart = params.chart, options = params.options;
    var innerRadius = options.innerRadius, radius = options.radius;
    // coordinate
    chart.coordinate('theta', {
        innerRadius: innerRadius,
        radius: radius,
    });
    return params;
}
/**
 * statistic 配置
 * @param params
 */
export function statistic(params, updated) {
    var chart = params.chart, options = params.options;
    var innerRadius = options.innerRadius, statistic = options.statistic, percent = options.percent, meta = options.meta;
    // 先清空标注，再重新渲染
    chart.getController('annotation').clear(true);
    /** 中心文本 指标卡 */
    if (innerRadius && statistic) {
        var metaFormatter = get(meta, ['percent', 'formatter']) || (function (v) { return "".concat((v * 100).toFixed(2), "%"); });
        var contentOpt = statistic.content;
        if (contentOpt) {
            contentOpt = deepAssign({}, contentOpt, {
                content: !isNil(contentOpt.content) ? contentOpt.content : metaFormatter(percent),
            });
        }
        renderStatistic(chart, { statistic: __assign(__assign({}, statistic), { content: contentOpt }), plotType: 'ring-progress' }, { percent: percent });
    }
    if (updated) {
        chart.render(true);
    }
    return params;
}
/**
 * 环形进度图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    return flow(geometry, scale({}), coordinate, statistic, animation, theme, annotation())(params);
}
//# sourceMappingURL=adaptor.js.map