"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pattern = exports.transformations = exports.limitInPlot = exports.annotation = exports.scale = exports.scrollbar = exports.slider = exports.state = exports.theme = exports.animation = exports.interaction = exports.tooltip = exports.legend = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var utils_1 = require("../utils");
/**
 * 通用 legend 配置, 适用于带 colorField 或 seriesField 的图表
 * @param params
 */
function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, colorField = options.colorField, seriesField = options.seriesField;
    if (legend === false) {
        chart.legend(false);
    }
    else if (colorField || seriesField) {
        chart.legend(colorField || seriesField, legend);
    }
    return params;
}
exports.legend = legend;
/**
 * 通用 tooltip 配置
 * @param params
 */
function tooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip;
    if (tooltip !== undefined) {
        chart.tooltip(tooltip);
    }
    return params;
}
exports.tooltip = tooltip;
/**
 * Interaction 配置
 * @param params
 */
function interaction(params) {
    var chart = params.chart, options = params.options;
    var interactions = options.interactions;
    (0, util_1.each)(interactions, function (i) {
        if (i.enable === false) {
            chart.removeInteraction(i.type);
        }
        else {
            chart.interaction(i.type, i.cfg || {});
        }
    });
    return params;
}
exports.interaction = interaction;
/**
 * 动画
 * @param params
 */
function animation(params) {
    var chart = params.chart, options = params.options;
    var animation = options.animation;
    // 所有的 Geometry 都使用同一动画（各个图形如有区别，自行覆盖）
    (0, utils_1.addViewAnimation)(chart, animation);
    return params;
}
exports.animation = animation;
/**
 * 设置全局主题配置
 * @param params
 */
function theme(params) {
    var chart = params.chart, options = params.options;
    var theme = options.theme;
    // 存在主题才设置主题
    if (theme) {
        chart.theme(theme);
    }
    return params;
}
exports.theme = theme;
/**
 * 状态 state 配置
 * @param params
 */
function state(params) {
    var chart = params.chart, options = params.options;
    var state = options.state;
    if (state) {
        (0, util_1.each)(chart.geometries, function (geometry) {
            geometry.state(state);
        });
    }
    return params;
}
exports.state = state;
/**
 * 处理缩略轴的 adaptor
 * @param params
 */
function slider(params) {
    var chart = params.chart, options = params.options;
    var slider = options.slider;
    chart.option('slider', slider);
    return params;
}
exports.slider = slider;
/**
 * 处理缩略轴的 adaptor
 * @param params
 */
function scrollbar(params) {
    var chart = params.chart, options = params.options;
    var scrollbar = options.scrollbar;
    chart.option('scrollbar', scrollbar);
    return params;
}
exports.scrollbar = scrollbar;
/**
 * scale 的 adaptor
 * @param axes
 */
function scale(axes, meta) {
    return function (params) {
        var chart = params.chart, options = params.options;
        // 1. 轴配置中的 scale 信息
        var scales = {};
        (0, util_1.each)(axes, function (axis, field) {
            scales[field] = (0, utils_1.pick)(axis, constant_1.AXIS_META_CONFIG_KEYS);
        });
        // 2. meta 直接是 scale 的信息
        scales = (0, utils_1.deepAssign)({}, meta, options.meta, scales);
        chart.scale(scales);
        return params;
    };
}
exports.scale = scale;
/**
 * annotation 配置
 * @param params
 */
function annotation(annotationOptions) {
    return function (params) {
        var chart = params.chart, options = params.options;
        var annotationController = chart.getController('annotation');
        /** 自定义 annotation */
        (0, util_1.each)(tslib_1.__spreadArray(tslib_1.__spreadArray([], (options.annotations || []), true), (annotationOptions || []), true), function (annotationOption) {
            // @ts-ignore
            annotationController.annotation(annotationOption);
        });
        return params;
    };
}
exports.annotation = annotation;
/**
 * 自动设置 limitInPlot
 * @param params
 */
function limitInPlot(params) {
    var chart = params.chart, options = params.options;
    var yAxis = options.yAxis, limitInPlot = options.limitInPlot;
    var value = limitInPlot;
    // 用户没有设置 limitInPlot，则自动根据 yAxis 是否有 min/max 来设置 limitInPlot
    if ((0, util_1.isObject)(yAxis) && (0, util_1.isNil)(limitInPlot)) {
        if (Object.values((0, utils_1.pick)(yAxis, ['min', 'max', 'minLimit', 'maxLimit'])).some(function (value) { return !(0, util_1.isNil)(value); })) {
            value = true;
        }
        else {
            value = false;
        }
    }
    chart.limitInPlot = value;
    return params;
}
exports.limitInPlot = limitInPlot;
/**
 * 坐标系转换
 */
function transformations(coordinateType) {
    if (coordinateType === void 0) { coordinateType = 'rect'; }
    return function (params) {
        var chart = params.chart, options = params.options;
        var coordinate = options.coordinate;
        var actions = Array.from(coordinate || [])
            .map(function (cfg) {
            if (cfg.type === 'reflectX')
                return ['reflect', 'x'];
            if (cfg.type === 'reflectY')
                return ['reflect', 'y'];
            if (cfg.type === 'transpose')
                return ['transpose'];
            return null;
        })
            .filter(function (d) { return !!d; });
        if (actions.length !== 0) {
            chart.coordinate({ type: coordinateType, actions: actions });
        }
        return params;
    };
}
exports.transformations = transformations;
var pattern_1 = require("./pattern");
Object.defineProperty(exports, "pattern", { enumerable: true, get: function () { return pattern_1.pattern; } });
//# sourceMappingURL=common.js.map