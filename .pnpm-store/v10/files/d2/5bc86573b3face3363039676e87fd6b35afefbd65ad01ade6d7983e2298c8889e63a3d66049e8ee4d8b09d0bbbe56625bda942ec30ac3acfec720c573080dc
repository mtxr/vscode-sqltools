import { __assign } from "tslib";
import { get, isNil } from '@antv/util';
import { animation, interaction, pattern, scale, theme } from '../../adaptor/common';
import { interval } from '../../adaptor/geometries';
import { deepAssign, flow, renderStatistic } from '../../utils';
import { getLiquidData } from './utils';
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var percent = options.percent, liquidStyle = options.liquidStyle, radius = options.radius, outline = options.outline, wave = options.wave, shape = options.shape, shapeStyle = options.shapeStyle, animation = options.animation;
    chart.scale({
        percent: {
            min: 0,
            max: 1,
        },
    });
    chart.data(getLiquidData(percent));
    var color = options.color || chart.getTheme().defaultColor;
    var p = deepAssign({}, params, {
        options: {
            xField: 'type',
            yField: 'percent',
            // radius 放到 columnWidthRatio 中。
            // 保证横向的大小是根据  radius 生成的
            widthRatio: radius,
            interval: {
                color: color,
                style: liquidStyle,
                shape: 'liquid-fill-gauge',
            },
        },
    });
    var ext = interval(p).ext;
    var geometry = ext.geometry;
    var background = chart.getTheme().background;
    var customInfo = {
        percent: percent,
        radius: radius,
        outline: outline,
        wave: wave,
        shape: shape,
        shapeStyle: shapeStyle,
        background: background,
        animation: animation,
    };
    // 将 radius 传入到自定义 shape 中
    geometry.customInfo(customInfo);
    // 关闭组件
    chart.legend(false);
    chart.axis(false);
    chart.tooltip(false);
    return params;
}
/**
 * 统计指标文档
 * @param params
 */
export function statistic(params, updated) {
    var chart = params.chart, options = params.options;
    var statistic = options.statistic, percent = options.percent, meta = options.meta;
    // 先清空标注，再重新渲染
    chart.getController('annotation').clear(true);
    var metaFormatter = get(meta, ['percent', 'formatter']) || (function (v) { return "".concat((v * 100).toFixed(2), "%"); });
    var contentOpt = statistic.content;
    if (contentOpt) {
        contentOpt = deepAssign({}, contentOpt, {
            content: !isNil(contentOpt.content) ? contentOpt.content : metaFormatter(percent),
        });
    }
    renderStatistic(chart, { statistic: __assign(__assign({}, statistic), { content: contentOpt }), plotType: 'liquid' }, { percent: percent });
    if (updated) {
        chart.render(true);
    }
    return params;
}
/**
 * 水波图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API (主题前置，会影响绘制的取色)
    return flow(theme, pattern('liquidStyle'), geometry, statistic, scale({}), animation, interaction)(params);
}
//# sourceMappingURL=adaptor.js.map