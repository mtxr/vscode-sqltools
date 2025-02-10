import { __spreadArray } from "tslib";
import { each, isNil, isObject } from '@antv/util';
import { AXIS_META_CONFIG_KEYS } from '../constant';
import { addViewAnimation, deepAssign, pick } from '../utils';
/**
 * 通用 legend 配置, 适用于带 colorField 或 seriesField 的图表
 * @param params
 */
export function legend(params) {
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
/**
 * 通用 tooltip 配置
 * @param params
 */
export function tooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip;
    if (tooltip !== undefined) {
        chart.tooltip(tooltip);
    }
    return params;
}
/**
 * Interaction 配置
 * @param params
 */
export function interaction(params) {
    var chart = params.chart, options = params.options;
    var interactions = options.interactions;
    each(interactions, function (i) {
        if (i.enable === false) {
            chart.removeInteraction(i.type);
        }
        else {
            chart.interaction(i.type, i.cfg || {});
        }
    });
    return params;
}
/**
 * 动画
 * @param params
 */
export function animation(params) {
    var chart = params.chart, options = params.options;
    var animation = options.animation;
    // 所有的 Geometry 都使用同一动画（各个图形如有区别，自行覆盖）
    addViewAnimation(chart, animation);
    return params;
}
/**
 * 设置全局主题配置
 * @param params
 */
export function theme(params) {
    var chart = params.chart, options = params.options;
    var theme = options.theme;
    // 存在主题才设置主题
    if (theme) {
        chart.theme(theme);
    }
    return params;
}
/**
 * 状态 state 配置
 * @param params
 */
export function state(params) {
    var chart = params.chart, options = params.options;
    var state = options.state;
    if (state) {
        each(chart.geometries, function (geometry) {
            geometry.state(state);
        });
    }
    return params;
}
/**
 * 处理缩略轴的 adaptor
 * @param params
 */
export function slider(params) {
    var chart = params.chart, options = params.options;
    var slider = options.slider;
    chart.option('slider', slider);
    return params;
}
/**
 * 处理缩略轴的 adaptor
 * @param params
 */
export function scrollbar(params) {
    var chart = params.chart, options = params.options;
    var scrollbar = options.scrollbar;
    chart.option('scrollbar', scrollbar);
    return params;
}
/**
 * scale 的 adaptor
 * @param axes
 */
export function scale(axes, meta) {
    return function (params) {
        var chart = params.chart, options = params.options;
        // 1. 轴配置中的 scale 信息
        var scales = {};
        each(axes, function (axis, field) {
            scales[field] = pick(axis, AXIS_META_CONFIG_KEYS);
        });
        // 2. meta 直接是 scale 的信息
        scales = deepAssign({}, meta, options.meta, scales);
        chart.scale(scales);
        return params;
    };
}
/**
 * annotation 配置
 * @param params
 */
export function annotation(annotationOptions) {
    return function (params) {
        var chart = params.chart, options = params.options;
        var annotationController = chart.getController('annotation');
        /** 自定义 annotation */
        each(__spreadArray(__spreadArray([], (options.annotations || []), true), (annotationOptions || []), true), function (annotationOption) {
            // @ts-ignore
            annotationController.annotation(annotationOption);
        });
        return params;
    };
}
/**
 * 自动设置 limitInPlot
 * @param params
 */
export function limitInPlot(params) {
    var chart = params.chart, options = params.options;
    var yAxis = options.yAxis, limitInPlot = options.limitInPlot;
    var value = limitInPlot;
    // 用户没有设置 limitInPlot，则自动根据 yAxis 是否有 min/max 来设置 limitInPlot
    if (isObject(yAxis) && isNil(limitInPlot)) {
        if (Object.values(pick(yAxis, ['min', 'max', 'minLimit', 'maxLimit'])).some(function (value) { return !isNil(value); })) {
            value = true;
        }
        else {
            value = false;
        }
    }
    chart.limitInPlot = value;
    return params;
}
/**
 * 坐标系转换
 */
export function transformations(coordinateType) {
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
export { pattern } from './pattern';
//# sourceMappingURL=common.js.map