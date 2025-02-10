"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.statistic = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var constant_1 = require("../../constant");
var utils_1 = require("../../utils");
var constants_1 = require("./constants");
var utils_2 = require("./utils");
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var percent = options.percent, range = options.range, radius = options.radius, innerRadius = options.innerRadius, startAngle = options.startAngle, endAngle = options.endAngle, axis = options.axis, indicator = options.indicator, gaugeStyle = options.gaugeStyle, type = options.type, meter = options.meter;
    var color = range.color, rangeWidth = range.width;
    // 指标 & 指针
    // 如果开启在应用
    if (indicator) {
        var indicatorData = (0, utils_2.getIndicatorData)(percent);
        var v1 = chart.createView({ id: constants_1.INDICATEOR_VIEW_ID });
        v1.data(indicatorData);
        v1.point()
            .position("".concat(constants_1.PERCENT, "*1"))
            .shape(indicator.shape || 'gauge-indicator')
            // 传入指针的样式到自定义 shape 中
            .customInfo({
            defaultColor: chart.getTheme().defaultColor,
            indicator: indicator,
        });
        v1.coordinate('polar', {
            startAngle: startAngle,
            endAngle: endAngle,
            radius: innerRadius * radius, // 外部的 innerRadius * radius = 这里的 radius
        });
        v1.axis(constants_1.PERCENT, axis);
        // 一部分应用到 scale 中
        v1.scale(constants_1.PERCENT, (0, utils_1.pick)(axis, constant_1.AXIS_META_CONFIG_KEYS));
    }
    // 辅助 range
    // [{ range: 1, type: '0', percent: 原始进度百分比 }]
    var rangeData = (0, utils_2.getRangeData)(percent, options.range);
    var v2 = chart.createView({ id: constants_1.RANGE_VIEW_ID });
    v2.data(rangeData);
    var rangeColor = (0, util_1.isString)(color) ? [color, constants_1.DEFAULT_COLOR] : color;
    var ext = (0, geometries_1.interval)({
        chart: v2,
        options: {
            xField: '1',
            yField: constants_1.RANGE_VALUE,
            seriesField: constants_1.RANGE_TYPE,
            rawFields: [constants_1.PERCENT],
            isStack: true,
            interval: {
                color: rangeColor,
                style: gaugeStyle,
                shape: type === 'meter' ? 'meter-gauge' : null,
            },
            args: {
                zIndexReversed: true,
                sortZIndex: true,
            },
            minColumnWidth: rangeWidth,
            maxColumnWidth: rangeWidth,
        },
    }).ext;
    var geometry = ext.geometry;
    // 传入到自定义 shape 中
    geometry.customInfo({ meter: meter });
    v2.coordinate('polar', {
        innerRadius: innerRadius,
        radius: radius,
        startAngle: startAngle,
        endAngle: endAngle,
    }).transpose();
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a;
    return (0, utils_1.flow)((0, common_1.scale)((_a = {
            range: {
                min: 0,
                max: 1,
                maxLimit: 1,
                minLimit: 0,
            }
        },
        _a[constants_1.PERCENT] = {},
        _a)))(params);
}
/**
 * 统计指标文档
 * @param params
 */
function statistic(params, updated) {
    var chart = params.chart, options = params.options;
    var statistic = options.statistic, percent = options.percent;
    // 先清空标注，再重新渲染
    chart.getController('annotation').clear(true);
    if (statistic) {
        var contentOption = statistic.content;
        var transformContent = void 0;
        // 当设置 content 的时候，设置默认样式
        if (contentOption) {
            transformContent = (0, utils_1.deepAssign)({}, {
                content: "".concat((percent * 100).toFixed(2), "%"),
                style: {
                    opacity: 0.75,
                    fontSize: '30px',
                    lineHeight: 1,
                    textAlign: 'center',
                    color: 'rgba(44,53,66,0.85)',
                },
            }, contentOption);
        }
        (0, utils_1.renderGaugeStatistic)(chart, { statistic: tslib_1.__assign(tslib_1.__assign({}, statistic), { content: transformContent }) }, { percent: percent });
    }
    if (updated) {
        chart.render(true);
    }
    return params;
}
exports.statistic = statistic;
/**
 * tooltip 配置
 */
function tooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip;
    if (tooltip) {
        chart.tooltip((0, utils_1.deepAssign)({
            showTitle: false,
            showMarkers: false,
            containerTpl: '<div class="g2-tooltip"><div class="g2-tooltip-list"></div></div>',
            domStyles: {
                'g2-tooltip': {
                    padding: '4px 8px',
                    fontSize: '10px',
                },
            },
            customContent: function (x, data) {
                var percent = (0, util_1.get)(data, [0, 'data', constants_1.PERCENT], 0);
                return "".concat((percent * 100).toFixed(2), "%");
            },
        }, tooltip));
    }
    else {
        // 默认，不展示 tooltip
        chart.tooltip(false);
    }
    return params;
}
/**
 * other 配置
 * @param params
 */
function other(params) {
    var chart = params.chart;
    chart.legend(false);
    return params;
}
/**
 * 图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(common_1.theme, 
    // animation 配置必须在 createView 之前，不然无法让子 View 生效
    common_1.animation, geometry, meta, tooltip, statistic, common_1.interaction, (0, common_1.annotation)(), other
    // ... 其他的 adaptor flow
    )(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map