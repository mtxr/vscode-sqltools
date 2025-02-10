import { __assign, __rest } from "tslib";
import { get, keys } from '@antv/util';
import { animation as commonAnimation, interaction as commonInteraction, limitInPlot as commonLimitInPlot, scale, theme as commonTheme, tooltip, } from '../../adaptor/common';
import { interval } from '../../adaptor/geometries';
import { deepAssign, findGeometry, findViewById, flow, transformLabel } from '../../utils';
import { FIRST_AXES_VIEW, SECOND_AXES_VIEW, SERIES_FIELD_KEY } from './constant';
import { isHorizontal, transformData } from './utils';
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, xField = options.xField, yField = options.yField, color = options.color, barStyle = options.barStyle, widthRatio = options.widthRatio, legend = options.legend, layout = options.layout;
    // 处理数据
    var groupData = transformData(xField, yField, SERIES_FIELD_KEY, data, isHorizontal(layout));
    // 在创建子 view 执行后不行，需要在前面处理 legend
    if (legend) {
        chart.legend(SERIES_FIELD_KEY, legend);
    }
    else if (legend === false) {
        chart.legend(false);
    }
    // 创建 view
    var firstView;
    var secondView;
    var firstViewData = groupData[0], secondViewData = groupData[1];
    // 横向
    if (isHorizontal(layout)) {
        firstView = chart.createView({
            region: {
                start: { x: 0, y: 0 },
                end: { x: 0.5, y: 1 },
            },
            id: FIRST_AXES_VIEW,
        });
        firstView.coordinate().transpose().reflect('x');
        secondView = chart.createView({
            region: {
                start: { x: 0.5, y: 0 },
                end: { x: 1, y: 1 },
            },
            id: SECOND_AXES_VIEW,
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
            id: FIRST_AXES_VIEW,
        });
        secondView = chart.createView({
            region: {
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 1 },
            },
            id: SECOND_AXES_VIEW,
        });
        secondView.coordinate().reflect('y');
        firstView.data(firstViewData);
        secondView.data(secondViewData);
    }
    var left = deepAssign({}, params, {
        chart: firstView,
        options: {
            widthRatio: widthRatio,
            xField: xField,
            yField: yField[0],
            seriesField: SERIES_FIELD_KEY,
            interval: {
                color: color,
                style: barStyle,
            },
        },
    });
    interval(left);
    var right = deepAssign({}, params, {
        chart: secondView,
        options: {
            xField: xField,
            yField: yField[1],
            seriesField: SERIES_FIELD_KEY,
            widthRatio: widthRatio,
            interval: {
                color: color,
                style: barStyle,
            },
        },
    });
    interval(right);
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
    var firstView = findViewById(chart, FIRST_AXES_VIEW);
    var secondView = findViewById(chart, SECOND_AXES_VIEW);
    var aliasMap = {};
    keys((options === null || options === void 0 ? void 0 : options.meta) || {}).map(function (metaKey) {
        if (get(options === null || options === void 0 ? void 0 : options.meta, [metaKey, 'alias'])) {
            aliasMap[metaKey] = options.meta[metaKey].alias;
        }
    });
    chart.scale((_a = {},
        _a[SERIES_FIELD_KEY] = {
            sync: true,
            formatter: function (v) {
                return get(aliasMap, v, v);
            },
        },
        _a));
    scale((_b = {},
        _b[xField] = xAxis,
        _b[yField[0]] = yAxis[yField[0]],
        _b))(deepAssign({}, params, { chart: firstView }));
    scale((_c = {},
        _c[xField] = xAxis,
        _c[yField[1]] = yAxis[yField[1]],
        _c))(deepAssign({}, params, { chart: secondView }));
    return params;
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField, layout = options.layout;
    var firstView = findViewById(chart, FIRST_AXES_VIEW);
    var secondView = findViewById(chart, SECOND_AXES_VIEW);
    // 第二个 view axis 始终隐藏; 注意 bottom 的时候，只隐藏 label，其他共用配置
    // @ts-ignore
    if ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.position) === 'bottom') {
        // fixme 直接设置 label: null 会导致 tickLine 无法显示
        secondView.axis(xField, __assign(__assign({}, xAxis), { label: { formatter: function () { return ''; } } }));
    }
    else {
        secondView.axis(xField, false);
    }
    // 为 false 则是不显示 firstView 轴
    if (xAxis === false) {
        firstView.axis(xField, false);
    }
    else {
        firstView.axis(xField, __assign({ 
            // 不同布局 firstView 的坐标轴显示位置
            position: isHorizontal(layout) ? 'top' : 'bottom' }, xAxis));
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
export function interaction(params) {
    var chart = params.chart;
    commonInteraction(deepAssign({}, params, { chart: findViewById(chart, FIRST_AXES_VIEW) }));
    commonInteraction(deepAssign({}, params, { chart: findViewById(chart, SECOND_AXES_VIEW) }));
    return params;
}
/**
 * limitInPlot
 * @param params
 */
export function limitInPlot(params) {
    var chart = params.chart, options = params.options;
    var yField = options.yField, yAxis = options.yAxis;
    commonLimitInPlot(deepAssign({}, params, {
        chart: findViewById(chart, FIRST_AXES_VIEW),
        options: {
            yAxis: yAxis[yField[0]],
        },
    }));
    commonLimitInPlot(deepAssign({}, params, {
        chart: findViewById(chart, SECOND_AXES_VIEW),
        options: {
            yAxis: yAxis[yField[1]],
        },
    }));
    return params;
}
/**
 * theme
 * @param params
 */
export function theme(params) {
    var chart = params.chart;
    commonTheme(deepAssign({}, params, { chart: findViewById(chart, FIRST_AXES_VIEW) }));
    commonTheme(deepAssign({}, params, { chart: findViewById(chart, SECOND_AXES_VIEW) }));
    commonTheme(params);
    return params;
}
/**
 * animation
 * @param params
 */
export function animation(params) {
    var chart = params.chart;
    commonAnimation(deepAssign({}, params, { chart: findViewById(chart, FIRST_AXES_VIEW) }));
    commonAnimation(deepAssign({}, params, { chart: findViewById(chart, SECOND_AXES_VIEW) }));
    return params;
}
/**
 * label 配置 (1. 设置 offset 偏移量默认值 2. leftView 偏移量需要 *= -1)
 * @param params
 */
function label(params) {
    var _this = this;
    var _a, _b;
    var chart = params.chart, options = params.options;
    var label = options.label, yField = options.yField, layout = options.layout;
    var firstView = findViewById(chart, FIRST_AXES_VIEW);
    var secondView = findViewById(chart, SECOND_AXES_VIEW);
    var leftGeometry = findGeometry(firstView, 'interval');
    var rightGeometry = findGeometry(secondView, 'interval');
    if (!label) {
        leftGeometry.label(false);
        rightGeometry.label(false);
    }
    else {
        var callback = label.callback, cfg_1 = __rest(label, ["callback"]);
        /** ---- 设置默认配置 ---- */
        // 默认居中
        if (!cfg_1.position) {
            cfg_1.position = 'middle';
        }
        if (cfg_1.offset === undefined) {
            cfg_1.offset = 2;
        }
        /** ---- leftView label 设置 ---- */
        var leftLabelCfg = __assign({}, cfg_1);
        if (isHorizontal(layout)) {
            // 设置 textAlign 默认值
            var textAlign = ((_a = leftLabelCfg.style) === null || _a === void 0 ? void 0 : _a.textAlign) || (cfg_1.position === 'middle' ? 'center' : 'left');
            cfg_1.style = deepAssign({}, cfg_1.style, { textAlign: textAlign });
            var textAlignMap = { left: 'right', right: 'left', center: 'center' };
            leftLabelCfg.style = deepAssign({}, leftLabelCfg.style, { textAlign: textAlignMap[textAlign] });
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
            leftLabelCfg.style = deepAssign({}, leftLabelCfg.style, { textBaseline: textBaseline });
            var textBaselineMap = { top: 'bottom', bottom: 'top', middle: 'middle' };
            cfg_1.style = deepAssign({}, cfg_1.style, { textBaseline: textBaselineMap[textBaseline] });
        }
        leftGeometry.label({
            fields: [yField[0]],
            callback: callback,
            cfg: transformLabel(leftLabelCfg),
        });
        rightGeometry.label({
            fields: [yField[1]],
            callback: callback,
            cfg: transformLabel(cfg_1),
        });
    }
    return params;
}
/**
 * 对称条形图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return flow(geometry, meta, axis, limitInPlot, theme, label, tooltip, interaction, animation)(params);
}
//# sourceMappingURL=adaptor.js.map