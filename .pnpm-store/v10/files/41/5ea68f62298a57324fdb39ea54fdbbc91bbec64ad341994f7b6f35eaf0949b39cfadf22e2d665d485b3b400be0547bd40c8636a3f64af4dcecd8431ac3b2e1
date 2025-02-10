"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.statistic = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var utils_2 = require("./utils");
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
    chart.data((0, utils_2.getLiquidData)(percent));
    var color = options.color || chart.getTheme().defaultColor;
    var p = (0, utils_1.deepAssign)({}, params, {
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
    var ext = (0, geometries_1.interval)(p).ext;
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
function statistic(params, updated) {
    var chart = params.chart, options = params.options;
    var statistic = options.statistic, percent = options.percent, meta = options.meta;
    // 先清空标注，再重新渲染
    chart.getController('annotation').clear(true);
    var metaFormatter = (0, util_1.get)(meta, ['percent', 'formatter']) || (function (v) { return "".concat((v * 100).toFixed(2), "%"); });
    var contentOpt = statistic.content;
    if (contentOpt) {
        contentOpt = (0, utils_1.deepAssign)({}, contentOpt, {
            content: !(0, util_1.isNil)(contentOpt.content) ? contentOpt.content : metaFormatter(percent),
        });
    }
    (0, utils_1.renderStatistic)(chart, { statistic: tslib_1.__assign(tslib_1.__assign({}, statistic), { content: contentOpt }), plotType: 'liquid' }, { percent: percent });
    if (updated) {
        chart.render(true);
    }
    return params;
}
exports.statistic = statistic;
/**
 * 水波图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API (主题前置，会影响绘制的取色)
    return (0, utils_1.flow)(common_1.theme, (0, common_1.pattern)('liquidStyle'), geometry, statistic, (0, common_1.scale)({}), common_1.animation, common_1.interaction)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map