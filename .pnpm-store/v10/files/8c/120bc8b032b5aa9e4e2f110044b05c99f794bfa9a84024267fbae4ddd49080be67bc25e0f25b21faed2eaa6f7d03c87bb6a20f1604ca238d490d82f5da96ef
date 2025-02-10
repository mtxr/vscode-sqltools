import { __assign } from "tslib";
import { each, get, omit, set } from '@antv/util';
import { annotation as baseAnnotation, interaction, theme, tooltip } from '../../adaptor/common';
import { interval, point, violin } from '../../adaptor/geometries';
import { AXIS_META_CONFIG_KEYS } from '../../constant';
import { deepAssign, findViewById, flow, pick } from '../../utils';
import { addViewAnimation } from '../../utils/view';
import { MEDIAN_FIELD, MEDIAN_VIEW_ID, MIN_MAX_FIELD, MIN_MAX_VIEW_ID, QUANTILE_FIELD, QUANTILE_VIEW_ID, VIOLIN_SIZE_FIELD, VIOLIN_VIEW_ID, VIOLIN_Y_FIELD, X_FIELD, } from './constant';
import { transformViolinData } from './utils';
var TOOLTIP_FIELDS = ['low', 'high', 'q1', 'q3', 'median'];
var adjustCfg = [
    {
        type: 'dodge',
        marginRatio: 1 / 32,
    },
];
/** 处理数据 */
function data(params) {
    var chart = params.chart, options = params.options;
    chart.data(transformViolinData(options));
    return params;
}
/** 小提琴轮廓 */
function violinView(params) {
    var chart = params.chart, options = params.options;
    var seriesField = options.seriesField, color = options.color, _a = options.shape, shape = _a === void 0 ? 'violin' : _a, violinStyle = options.violinStyle, tooltip = options.tooltip, state = options.state;
    var view = chart.createView({ id: VIOLIN_VIEW_ID });
    violin({
        chart: view,
        options: {
            xField: X_FIELD,
            yField: VIOLIN_Y_FIELD,
            seriesField: seriesField ? seriesField : X_FIELD,
            sizeField: VIOLIN_SIZE_FIELD,
            tooltip: __assign({ fields: TOOLTIP_FIELDS }, tooltip),
            violin: {
                style: violinStyle,
                color: color,
                shape: shape,
            },
            state: state,
        },
    });
    view.geometries[0].adjust(adjustCfg);
    return params;
}
/** 箱线 */
function boxView(params) {
    var chart = params.chart, options = params.options;
    var seriesField = options.seriesField, color = options.color, tooltip = options.tooltip, box = options.box;
    // 如果配置 `box` 为 false ，不渲染内部箱线图
    if (box === false)
        return params;
    // 边缘线
    var minMaxView = chart.createView({ id: MIN_MAX_VIEW_ID });
    interval({
        chart: minMaxView,
        options: {
            xField: X_FIELD,
            yField: MIN_MAX_FIELD,
            seriesField: seriesField ? seriesField : X_FIELD,
            tooltip: __assign({ fields: TOOLTIP_FIELDS }, tooltip),
            state: typeof box === 'object' ? box.state : {},
            interval: {
                color: color,
                size: 1,
                style: {
                    lineWidth: 0,
                },
            },
        },
    });
    minMaxView.geometries[0].adjust(adjustCfg);
    // 四分点位
    var quantileView = chart.createView({ id: QUANTILE_VIEW_ID });
    interval({
        chart: quantileView,
        options: {
            xField: X_FIELD,
            yField: QUANTILE_FIELD,
            seriesField: seriesField ? seriesField : X_FIELD,
            tooltip: __assign({ fields: TOOLTIP_FIELDS }, tooltip),
            state: typeof box === 'object' ? box.state : {},
            interval: {
                color: color,
                size: 8,
                style: {
                    fillOpacity: 1,
                },
            },
        },
    });
    quantileView.geometries[0].adjust(adjustCfg);
    // 中位值
    var medianView = chart.createView({ id: MEDIAN_VIEW_ID });
    point({
        chart: medianView,
        options: {
            xField: X_FIELD,
            yField: MEDIAN_FIELD,
            seriesField: seriesField ? seriesField : X_FIELD,
            tooltip: __assign({ fields: TOOLTIP_FIELDS }, tooltip),
            state: typeof box === 'object' ? box.state : {},
            point: {
                color: color,
                size: 1,
                style: {
                    fill: 'white',
                    lineWidth: 0,
                },
            },
        },
    });
    medianView.geometries[0].adjust(adjustCfg);
    // 关闭辅助 view 的轴
    quantileView.axis(false);
    minMaxView.axis(false);
    medianView.axis(false);
    // 关闭辅助 view 的图例
    medianView.legend(false);
    minMaxView.legend(false);
    quantileView.legend(false);
    return params;
}
/**
 * meta 配置
 */
function meta(params) {
    var _a;
    var chart = params.chart, options = params.options;
    var meta = options.meta, xAxis = options.xAxis, yAxis = options.yAxis;
    var baseMeta = {};
    var scales = deepAssign(baseMeta, meta, (_a = {},
        _a[X_FIELD] = __assign(__assign({ sync: true }, pick(xAxis, AXIS_META_CONFIG_KEYS)), { 
            // fix:  dodge is not support linear attribute, please use category attribute!
            // 强制 x 轴类型为分类类型
            type: 'cat' }),
        _a[VIOLIN_Y_FIELD] = __assign({ sync: true }, pick(yAxis, AXIS_META_CONFIG_KEYS)),
        _a[MIN_MAX_FIELD] = __assign({ sync: VIOLIN_Y_FIELD }, pick(yAxis, AXIS_META_CONFIG_KEYS)),
        _a[QUANTILE_FIELD] = __assign({ sync: VIOLIN_Y_FIELD }, pick(yAxis, AXIS_META_CONFIG_KEYS)),
        _a[MEDIAN_FIELD] = __assign({ sync: VIOLIN_Y_FIELD }, pick(yAxis, AXIS_META_CONFIG_KEYS)),
        _a));
    chart.scale(scales);
    return params;
}
/**
 * axis 配置
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis;
    var view = findViewById(chart, VIOLIN_VIEW_ID);
    // 为 false 则是不显示轴
    if (xAxis === false) {
        view.axis(X_FIELD, false);
    }
    else {
        view.axis(X_FIELD, xAxis);
    }
    if (yAxis === false) {
        view.axis(VIOLIN_Y_FIELD, false);
    }
    else {
        view.axis(VIOLIN_Y_FIELD, yAxis);
    }
    chart.axis(false);
    return params;
}
/**
 *
 * @param params
 * @returns
 */
function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, seriesField = options.seriesField, shape = options.shape;
    if (legend === false) {
        chart.legend(false);
    }
    else {
        var legendField_1 = seriesField ? seriesField : X_FIELD;
        // fixme 暂不明为啥有描边
        var legendOptions = omit(legend, ['selected']);
        if (!shape || !shape.startsWith('hollow')) {
            if (!get(legendOptions, ['marker', 'style', 'lineWidth'])) {
                set(legendOptions, ['marker', 'style', 'lineWidth'], 0);
            }
        }
        chart.legend(legendField_1, legendOptions);
        // 特殊的处理 fixme G2 层得解决这个问题
        if (get(legend, 'selected')) {
            each(chart.views, function (view) { return view.legend(legendField_1, legend); });
        }
    }
    return params;
}
/**
 * annotation, apply to violin view.
 * @param params
 * @returns
 */
function annotation(params) {
    var chart = params.chart;
    var violinView = findViewById(chart, VIOLIN_VIEW_ID);
    baseAnnotation()(__assign(__assign({}, params), { chart: violinView }));
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
    each(chart.views, function (view) {
        addViewAnimation(view, animation);
    });
    return params;
}
/**
 * 小提琴图适配器
 * @param params
 */
export function adaptor(params) {
    return flow(theme, data, violinView, boxView, meta, tooltip, axis, legend, interaction, annotation, animation)(params);
}
//# sourceMappingURL=adaptor.js.map