"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.animation = exports.theme = exports.limitInPlot = exports.interaction = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var constant_1 = require("./constant");
var utils_2 = require("./utils");
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, xField = options.xField, yField = options.yField, color = options.color, barStyle = options.barStyle, widthRatio = options.widthRatio, legend = options.legend, layout = options.layout;
    // 处理数据
    var groupData = (0, utils_2.transformData)(xField, yField, constant_1.SERIES_FIELD_KEY, data, (0, utils_2.isHorizontal)(layout));
    // 在创建子 view 执行后不行，需要在前面处理 legend
    if (legend) {
        chart.legend(constant_1.SERIES_FIELD_KEY, legend);
    }
    else if (legend === false) {
        chart.legend(false);
    }
    // 创建 view
    var firstView;
    var secondView;
    var firstViewData = groupData[0], secondViewData = groupData[1];
    // 横向
    if ((0, utils_2.isHorizontal)(layout)) {
        firstView = chart.createView({
            region: {
                start: { x: 0, y: 0 },
                end: { x: 0.5, y: 1 },
            },
            id: constant_1.FIRST_AXES_VIEW,
        });
        firstView.coordinate().transpose().reflect('x');
        secondView = chart.createView({
            region: {
                start: { x: 0.5, y: 0 },
                end: { x: 1, y: 1 },
            },
            id: constant_1.SECOND_AXES_VIEW,
        });
        secondView.coordinate().transpose();
        // @说明: 测试发现，横向因为轴的反转，需要数据也反转，不然会图形渲染是反的(翻转操作进入到 transform 中处理)
        firstView.data(firstViewData);
        secondView.data(secondViewData);
    }
    else {
        // 纵向
        firstView = chart.createView({
            region: {
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0.5 },
            },
            id: constant_1.FIRST_AXES_VIEW,
        });
        secondView = chart.createView({
            region: {
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 1 },
            },
            id: constant_1.SECOND_AXES_VIEW,
        });
        secondView.coordinate().reflect('y');
        firstView.data(firstViewData);
        secondView.data(secondViewData);
    }
    var left = (0, utils_1.deepAssign)({}, params, {
        chart: firstView,
        options: {
            widthRatio: widthRatio,
            xField: xField,
            yField: yField[0],
            seriesField: constant_1.SERIES_FIELD_KEY,
            interval: {
                color: color,
                style: barStyle,
            },
        },
    });
    (0, geometries_1.interval)(left);
    var right = (0, utils_1.deepAssign)({}, params, {
        chart: secondView,
        options: {
            xField: xField,
            yField: yField[1],
            seriesField: constant_1.SERIES_FIELD_KEY,
            widthRatio: widthRatio,
            interval: {
                color: color,
                style: barStyle,
            },
        },
    });
    (0, geometries_1.interval)(right);
    return params;
}
/**
 * meta 配置
 * - 对称条形图对数据进行了处理，通过 SERIES_FIELD_KEY 来对两条 yField 数据进行分类
 * @param params
 */
function meta(params) {
    var _a, _b, _c;
    var options = params.options, chart = params.chart;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    var firstView = (0, utils_1.findViewById)(chart, constant_1.FIRST_AXES_VIEW);
    var secondView = (0, utils_1.findViewById)(chart, constant_1.SECOND_AXES_VIEW);
    var aliasMap = {};
    (0, util_1.keys)((options === null || options === void 0 ? void 0 : options.meta) || {}).map(function (metaKey) {
        if ((0, util_1.get)(options === null || options === void 0 ? void 0 : options.meta, [metaKey, 'alias'])) {
            aliasMap[metaKey] = options.meta[metaKey].alias;
        }
    });
    chart.scale((_a = {},
        _a[constant_1.SERIES_FIELD_KEY] = {
            sync: true,
            formatter: function (v) {
                return (0, util_1.get)(aliasMap, v, v);
            },
        },
        _a));
    (0, common_1.scale)((_b = {},
        _b[xField] = xAxis,
        _b[yField[0]] = yAxis[yField[0]],
        _b))((0, utils_1.deepAssign)({}, params, { chart: firstView }));
    (0, common_1.scale)((_c = {},
        _c[xField] = xAxis,
        _c[yField[1]] = yAxis[yField[1]],
        _c))((0, utils_1.deepAssign)({}, params, { chart: secondView }));
    return params;
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField, layout = options.layout;
    var firstView = (0, utils_1.findViewById)(chart, constant_1.FIRST_AXES_VIEW);
    var secondView = (0, utils_1.findViewById)(chart, constant_1.SECOND_AXES_VIEW);
    // 第二个 view axis 始终隐藏; 注意 bottom 的时候，只隐藏 label，其他共用配置
    // @ts-ignore
    if ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.position) === 'bottom') {
        // fixme 直接设置 label: null 会导致 tickLine 无法显示
        secondView.axis(xField, tslib_1.__assign(tslib_1.__assign({}, xAxis), { label: { formatter: function () { return ''; } } }));
    }
    else {
        secondView.axis(xField, false);
    }
    // 为 false 则是不显示 firstView 轴
    if (xAxis === false) {
        firstView.axis(xField, false);
    }
    else {
        firstView.axis(xField, tslib_1.__assign({ 
            // 不同布局 firstView 的坐标轴显示位置
            position: (0, utils_2.isHorizontal)(layout) ? 'top' : 'bottom' }, xAxis));
    }
    if (yAxis === false) {
        firstView.axis(yField[0], false);
        secondView.axis(yField[1], false);
    }
    else {
        firstView.axis(yField[0], yAxis[yField[0]]);
        secondView.axis(yField[1], yAxis[yField[1]]);
    }
    /**
     *  这个注入，主要是在syncViewPadding时候拿到相对应的配置：布局和轴的位置
     *  TODO 之后希望 g2 View 对象可以开放 setter 可以设置一些需要的东西
     */
    //@ts-ignore
    chart.__axisPosition = {
        position: firstView.getOptions().axes[xField].position,
        layout: layout,
    };
    return params;
}
/**
 * interaction 配置
 * @param params
 */
function interaction(params) {
    var chart = params.chart;
    (0, common_1.interaction)((0, utils_1.deepAssign)({}, params, { chart: (0, utils_1.findViewById)(chart, constant_1.FIRST_AXES_VIEW) }));
    (0, common_1.interaction)((0, utils_1.deepAssign)({}, params, { chart: (0, utils_1.findViewById)(chart, constant_1.SECOND_AXES_VIEW) }));
    return params;
}
exports.interaction = interaction;
/**
 * limitInPlot
 * @param params
 */
function limitInPlot(params) {
    var chart = params.chart, options = params.options;
    var yField = options.yField, yAxis = options.yAxis;
    (0, common_1.limitInPlot)((0, utils_1.deepAssign)({}, params, {
        chart: (0, utils_1.findViewById)(chart, constant_1.FIRST_AXES_VIEW),
        options: {
            yAxis: yAxis[yField[0]],
        },
    }));
    (0, common_1.limitInPlot)((0, utils_1.deepAssign)({}, params, {
        chart: (0, utils_1.findViewById)(chart, constant_1.SECOND_AXES_VIEW),
        options: {
            yAxis: yAxis[yField[1]],
        },
    }));
    return params;
}
exports.limitInPlot = limitInPlot;
/**
 * theme
 * @param params
 */
function theme(params) {
    var chart = params.chart;
    (0, common_1.theme)((0, utils_1.deepAssign)({}, params, { chart: (0, utils_1.findViewById)(chart, constant_1.FIRST_AXES_VIEW) }));
    (0, common_1.theme)((0, utils_1.deepAssign)({}, params, { chart: (0, utils_1.findViewById)(chart, constant_1.SECOND_AXES_VIEW) }));
    (0, common_1.theme)(params);
    return params;
}
exports.theme = theme;
/**
 * animation
 * @param params
 */
function animation(params) {
    var chart = params.chart;
    (0, common_1.animation)((0, utils_1.deepAssign)({}, params, { chart: (0, utils_1.findViewById)(chart, constant_1.FIRST_AXES_VIEW) }));
    (0, common_1.animation)((0, utils_1.deepAssign)({}, params, { chart: (0, utils_1.findViewById)(chart, constant_1.SECOND_AXES_VIEW) }));
    return params;
}
exports.animation = animation;
/**
 * label 配置 (1. 设置 offset 偏移量默认值 2. leftView 偏移量需要 *= -1)
 * @param params
 */
function label(params) {
    var _this = this;
    var _a, _b;
    var chart = params.chart, options = params.options;
    var label = options.label, yField = options.yField, layout = options.layout;
    var firstView = (0, utils_1.findViewById)(chart, constant_1.FIRST_AXES_VIEW);
    var secondView = (0, utils_1.findViewById)(chart, constant_1.SECOND_AXES_VIEW);
    var leftGeometry = (0, utils_1.findGeometry)(firstView, 'interval');
    var rightGeometry = (0, utils_1.findGeometry)(secondView, 'interval');
    if (!label) {
        leftGeometry.label(false);
        rightGeometry.label(false);
    }
    else {
        var callback = label.callback, cfg_1 = tslib_1.__rest(label, ["callback"]);
        /** ---- 设置默认配置 ---- */
        // 默认居中
        if (!cfg_1.position) {
            cfg_1.position = 'middle';
        }
        if (cfg_1.offset === undefined) {
            cfg_1.offset = 2;
        }
        /** ---- leftView label 设置 ---- */
        var leftLabelCfg = tslib_1.__assign({}, cfg_1);
        if ((0, utils_2.isHorizontal)(layout)) {
            // 设置 textAlign 默认值
            var textAlign = ((_a = leftLabelCfg.style) === null || _a === void 0 ? void 0 : _a.textAlign) || (cfg_1.position === 'middle' ? 'center' : 'left');
            cfg_1.style = (0, utils_1.deepAssign)({}, cfg_1.style, { textAlign: textAlign });
            var textAlignMap = { left: 'right', right: 'left', center: 'center' };
            leftLabelCfg.style = (0, utils_1.deepAssign)({}, leftLabelCfg.style, { textAlign: textAlignMap[textAlign] });
        }
        else {
            var positionMap_1 = { top: 'bottom', bottom: 'top', middle: 'middle' };
            if (typeof cfg_1.position === 'string') {
                cfg_1.position = positionMap_1[cfg_1.position];
            }
            else if (typeof cfg_1.position === 'function') {
                cfg_1.position = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return positionMap_1[cfg_1.position.apply(_this, args)];
                };
            }
            // 设置 textBaseline 默认值
            var textBaseline = ((_b = leftLabelCfg.style) === null || _b === void 0 ? void 0 : _b.textBaseline) || 'bottom';
            leftLabelCfg.style = (0, utils_1.deepAssign)({}, leftLabelCfg.style, { textBaseline: textBaseline });
            var textBaselineMap = { top: 'bottom', bottom: 'top', middle: 'middle' };
            cfg_1.style = (0, utils_1.deepAssign)({}, cfg_1.style, { textBaseline: textBaselineMap[textBaseline] });
        }
        leftGeometry.label({
            fields: [yField[0]],
            callback: callback,
            cfg: (0, utils_1.transformLabel)(leftLabelCfg),
        });
        rightGeometry.label({
            fields: [yField[1]],
            callback: callback,
            cfg: (0, utils_1.transformLabel)(cfg_1),
        });
    }
    return params;
}
/**
 * 对称条形图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(geometry, meta, axis, limitInPlot, theme, label, common_1.tooltip, interaction, animation)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map