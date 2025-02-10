"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.animation = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var constant_1 = require("../../constant");
var utils_1 = require("../../utils");
var view_1 = require("../../utils/view");
var constant_2 = require("./constant");
var utils_2 = require("./utils");
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
    chart.data((0, utils_2.transformViolinData)(options));
    return params;
}
/** 小提琴轮廓 */
function violinView(params) {
    var chart = params.chart, options = params.options;
    var seriesField = options.seriesField, color = options.color, _a = options.shape, shape = _a === void 0 ? 'violin' : _a, violinStyle = options.violinStyle, tooltip = options.tooltip, state = options.state;
    var view = chart.createView({ id: constant_2.VIOLIN_VIEW_ID });
    (0, geometries_1.violin)({
        chart: view,
        options: {
            xField: constant_2.X_FIELD,
            yField: constant_2.VIOLIN_Y_FIELD,
            seriesField: seriesField ? seriesField : constant_2.X_FIELD,
            sizeField: constant_2.VIOLIN_SIZE_FIELD,
            tooltip: tslib_1.__assign({ fields: TOOLTIP_FIELDS }, tooltip),
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
    var minMaxView = chart.createView({ id: constant_2.MIN_MAX_VIEW_ID });
    (0, geometries_1.interval)({
        chart: minMaxView,
        options: {
            xField: constant_2.X_FIELD,
            yField: constant_2.MIN_MAX_FIELD,
            seriesField: seriesField ? seriesField : constant_2.X_FIELD,
            tooltip: tslib_1.__assign({ fields: TOOLTIP_FIELDS }, tooltip),
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
    var quantileView = chart.createView({ id: constant_2.QUANTILE_VIEW_ID });
    (0, geometries_1.interval)({
        chart: quantileView,
        options: {
            xField: constant_2.X_FIELD,
            yField: constant_2.QUANTILE_FIELD,
            seriesField: seriesField ? seriesField : constant_2.X_FIELD,
            tooltip: tslib_1.__assign({ fields: TOOLTIP_FIELDS }, tooltip),
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
    var medianView = chart.createView({ id: constant_2.MEDIAN_VIEW_ID });
    (0, geometries_1.point)({
        chart: medianView,
        options: {
            xField: constant_2.X_FIELD,
            yField: constant_2.MEDIAN_FIELD,
            seriesField: seriesField ? seriesField : constant_2.X_FIELD,
            tooltip: tslib_1.__assign({ fields: TOOLTIP_FIELDS }, tooltip),
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
    var scales = (0, utils_1.deepAssign)(baseMeta, meta, (_a = {},
        _a[constant_2.X_FIELD] = tslib_1.__assign(tslib_1.__assign({ sync: true }, (0, utils_1.pick)(xAxis, constant_1.AXIS_META_CONFIG_KEYS)), { 
            // fix:  dodge is not support linear attribute, please use category attribute!
            // 强制 x 轴类型为分类类型
            type: 'cat' }),
        _a[constant_2.VIOLIN_Y_FIELD] = tslib_1.__assign({ sync: true }, (0, utils_1.pick)(yAxis, constant_1.AXIS_META_CONFIG_KEYS)),
        _a[constant_2.MIN_MAX_FIELD] = tslib_1.__assign({ sync: constant_2.VIOLIN_Y_FIELD }, (0, utils_1.pick)(yAxis, constant_1.AXIS_META_CONFIG_KEYS)),
        _a[constant_2.QUANTILE_FIELD] = tslib_1.__assign({ sync: constant_2.VIOLIN_Y_FIELD }, (0, utils_1.pick)(yAxis, constant_1.AXIS_META_CONFIG_KEYS)),
        _a[constant_2.MEDIAN_FIELD] = tslib_1.__assign({ sync: constant_2.VIOLIN_Y_FIELD }, (0, utils_1.pick)(yAxis, constant_1.AXIS_META_CONFIG_KEYS)),
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
    var view = (0, utils_1.findViewById)(chart, constant_2.VIOLIN_VIEW_ID);
    // 为 false 则是不显示轴
    if (xAxis === false) {
        view.axis(constant_2.X_FIELD, false);
    }
    else {
        view.axis(constant_2.X_FIELD, xAxis);
    }
    if (yAxis === false) {
        view.axis(constant_2.VIOLIN_Y_FIELD, false);
    }
    else {
        view.axis(constant_2.VIOLIN_Y_FIELD, yAxis);
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
        var legendField_1 = seriesField ? seriesField : constant_2.X_FIELD;
        // fixme 暂不明为啥有描边
        var legendOptions = (0, util_1.omit)(legend, ['selected']);
        if (!shape || !shape.startsWith('hollow')) {
            if (!(0, util_1.get)(legendOptions, ['marker', 'style', 'lineWidth'])) {
                (0, util_1.set)(legendOptions, ['marker', 'style', 'lineWidth'], 0);
            }
        }
        chart.legend(legendField_1, legendOptions);
        // 特殊的处理 fixme G2 层得解决这个问题
        if ((0, util_1.get)(legend, 'selected')) {
            (0, util_1.each)(chart.views, function (view) { return view.legend(legendField_1, legend); });
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
    var violinView = (0, utils_1.findViewById)(chart, constant_2.VIOLIN_VIEW_ID);
    (0, common_1.annotation)()(tslib_1.__assign(tslib_1.__assign({}, params), { chart: violinView }));
    return params;
}
/**
 * 动画
 * @param params
 */
function animation(params) {
    var chart = params.chart, options = params.options;
    var animation = options.animation;
    // 所有的 Geometry 都使用同一动画（各个图形如有区别，自行覆盖）
    (0, util_1.each)(chart.views, function (view) {
        (0, view_1.addViewAnimation)(view, animation);
    });
    return params;
}
exports.animation = animation;
/**
 * 小提琴图适配器
 * @param params
 */
function adaptor(params) {
    return (0, utils_1.flow)(common_1.theme, data, violinView, boxView, meta, common_1.tooltip, axis, legend, common_1.interaction, annotation, animation)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map