"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.slider = exports.legend = exports.limitInPlot = exports.animation = exports.theme = exports.annotation = exports.interaction = exports.tooltip = exports.axis = exports.meta = exports.color = exports.transformOptions = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var utils_1 = require("../../utils");
var percent_1 = require("../../utils/transform/percent");
var view_1 = require("../../utils/view");
var constant_1 = require("./constant");
var types_1 = require("./types");
var geometry_1 = require("./util/geometry");
var legend_1 = require("./util/legend");
var option_1 = require("./util/option");
var render_sider_1 = require("./util/render-sider");
/**
 * transformOptions，双轴图整体的取参逻辑如下
 * 1. get index getOptions: 对应的是默认的图表参数，如 appendPadding，syncView 等
 * 2. get adpator transformOption: 对应的是双轴图的默认参数，deepAssign 优先级从低到高如下
 *    2.1 defaultoption，如 tooltip，legend
 *    2.2 用户填写 options
 *    2.3 根据用户填写的 options 补充的数组型 options，如 yaxis，GeometryOption，因为 deepAssign 无法 assign 数组
 *
 * @param params
 */
function transformOptions(params) {
    var _a;
    var options = params.options;
    var _b = options.geometryOptions, geometryOptions = _b === void 0 ? [] : _b, xField = options.xField, yField = options.yField;
    var allLine = (0, util_1.every)(geometryOptions, function (_a) {
        var geometry = _a.geometry;
        return geometry === types_1.DualAxesGeometry.Line || geometry === undefined;
    });
    return (0, utils_1.deepAssign)({}, {
        options: {
            geometryOptions: [],
            meta: (_a = {},
                _a[xField] = {
                    // 默认为 cat 类型
                    type: 'cat',
                    // x 轴一定是同步 scale 的
                    sync: true,
                    // 如果有没有柱子，则
                    range: allLine ? [0, 1] : undefined,
                },
                _a),
            tooltip: {
                showMarkers: allLine,
                // 存在柱状图，不显示 crosshairs
                showCrosshairs: allLine,
                shared: true,
                crosshairs: {
                    type: 'x',
                },
            },
            interactions: !allLine
                ? [{ type: 'legend-visible-filter' }, { type: 'active-region' }]
                : [{ type: 'legend-visible-filter' }],
            legend: {
                position: 'top-left',
            },
        },
    }, params, {
        options: {
            // yAxis
            yAxis: (0, option_1.transformObjectToArray)(yField, options.yAxis),
            // geometryOptions
            geometryOptions: [
                (0, option_1.getGeometryOption)(xField, yField[0], geometryOptions[0]),
                (0, option_1.getGeometryOption)(xField, yField[1], geometryOptions[1]),
            ],
            // annotations
            annotations: (0, option_1.transformObjectToArray)(yField, options.annotations),
        },
    });
}
exports.transformOptions = transformOptions;
/**
 * 创建 双轴图 中绘制图形的 view，提前创建是因为 theme 适配器的需要
 * @param params
 */
function createViews(params) {
    var _a, _b;
    var chart = params.chart, options = params.options;
    var geometryOptions = options.geometryOptions;
    var SORT_MAP = { line: 0, column: 1 };
    // 包含配置，id，数据的结构
    var geometries = [
        { type: (_a = geometryOptions[0]) === null || _a === void 0 ? void 0 : _a.geometry, id: constant_1.LEFT_AXES_VIEW },
        { type: (_b = geometryOptions[1]) === null || _b === void 0 ? void 0 : _b.geometry, id: constant_1.RIGHT_AXES_VIEW },
    ];
    // 将线的 view 放置在更上一层，防止线柱遮挡。先柱后先
    geometries.sort(function (a, b) { return -SORT_MAP[a.type] + SORT_MAP[b.type]; }).forEach(function (g) { return chart.createView({ id: g.id }); });
    return params;
}
/**
 * 绘制图形
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var xField = options.xField, yField = options.yField, geometryOptions = options.geometryOptions, data = options.data, tooltip = options.tooltip;
    // 包含配置，id，数据的结构
    var geometries = [
        tslib_1.__assign(tslib_1.__assign({}, geometryOptions[0]), { id: constant_1.LEFT_AXES_VIEW, data: data[0], yField: yField[0] }),
        tslib_1.__assign(tslib_1.__assign({}, geometryOptions[1]), { id: constant_1.RIGHT_AXES_VIEW, data: data[1], yField: yField[1] }),
    ];
    geometries.forEach(function (geometry) {
        var id = geometry.id, data = geometry.data, yField = geometry.yField;
        // 百分比柱状图需要额外处理一次数据
        var isPercent = (0, option_1.isColumn)(geometry) && geometry.isPercent;
        var formatData = isPercent ? (0, percent_1.percent)(data, yField, xField, yField) : data;
        var view = (0, view_1.findViewById)(chart, id).data(formatData);
        var tooltipOptions = isPercent
            ? tslib_1.__assign({ formatter: function (datum) { return ({
                    name: datum[geometry.seriesField] || yField,
                    value: (Number(datum[yField]) * 100).toFixed(2) + '%',
                }); } }, tooltip) : tooltip;
        // 绘制图形
        (0, geometry_1.drawSingleGeometry)({
            chart: view,
            options: {
                xField: xField,
                yField: yField,
                tooltip: tooltipOptions,
                geometryOption: geometry,
            },
        });
    });
    return params;
}
function color(params) {
    var _a;
    var chart = params.chart, options = params.options;
    var geometryOptions = options.geometryOptions;
    var themeColor = ((_a = chart.getTheme()) === null || _a === void 0 ? void 0 : _a.colors10) || [];
    var start = 0;
    /* 为 geometry 添加默认 color。
     * 1. 若 geometryOptions 存在 color，则在 drawGeometry 时已处理
     * 2. 若 不存在 color，获取 Geometry group scales个数，在 theme color 10 中提取
     * 3. 为防止 group 过多导致右色板无值或值很少，右 view 面板在依次提取剩下的 N 个 后再 concat 一次 themeColor
     * 4. 为简便获取 Geometry group scales个数，在绘制完后再执行 color
     * 5. 考虑之后将不同 view 使用同一个色板的需求沉淀到 g2
     */
    chart.once('beforepaint', function () {
        (0, util_1.each)(geometryOptions, function (geometryOption, index) {
            var view = (0, view_1.findViewById)(chart, index === 0 ? constant_1.LEFT_AXES_VIEW : constant_1.RIGHT_AXES_VIEW);
            if (geometryOption.color)
                return;
            var groupScale = view.getGroupScales();
            var count = (0, util_1.get)(groupScale, [0, 'values', 'length'], 1);
            var color = themeColor.slice(start, start + count).concat(index === 0 ? [] : themeColor);
            view.geometries.forEach(function (geometry) {
                if (geometryOption.seriesField) {
                    geometry.color(geometryOption.seriesField, color);
                }
                else {
                    geometry.color(color[0]);
                }
            });
            start += count;
        });
        chart.render(true);
    });
    return params;
}
exports.color = color;
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a, _b;
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    (0, common_1.scale)((_a = {},
        _a[xField] = xAxis,
        _a[yField[0]] = yAxis[0],
        _a))((0, utils_1.deepAssign)({}, params, { chart: (0, view_1.findViewById)(chart, constant_1.LEFT_AXES_VIEW) }));
    (0, common_1.scale)((_b = {},
        _b[xField] = xAxis,
        _b[yField[1]] = yAxis[1],
        _b))((0, utils_1.deepAssign)({}, params, { chart: (0, view_1.findViewById)(chart, constant_1.RIGHT_AXES_VIEW) }));
    return params;
}
exports.meta = meta;
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var leftView = (0, view_1.findViewById)(chart, constant_1.LEFT_AXES_VIEW);
    var rightView = (0, view_1.findViewById)(chart, constant_1.RIGHT_AXES_VIEW);
    var xField = options.xField, yField = options.yField, xAxis = options.xAxis, yAxis = options.yAxis;
    chart.axis(xField, false);
    chart.axis(yField[0], false);
    chart.axis(yField[1], false);
    // 左 View
    leftView.axis(xField, xAxis);
    leftView.axis(yField[0], (0, option_1.getYAxisWithDefault)(yAxis[0], types_1.AxisType.Left));
    // 右 Y 轴
    rightView.axis(xField, false);
    rightView.axis(yField[1], (0, option_1.getYAxisWithDefault)(yAxis[1], types_1.AxisType.Right));
    return params;
}
exports.axis = axis;
/**
 * tooltip 配置
 * @param params
 */
function tooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip;
    var leftView = (0, view_1.findViewById)(chart, constant_1.LEFT_AXES_VIEW);
    var rightView = (0, view_1.findViewById)(chart, constant_1.RIGHT_AXES_VIEW);
    // tooltip 经过 getDefaultOption 处理后，一定不为 undefined
    chart.tooltip(tooltip);
    // 在 view 上添加 tooltip，使得 shared 和 interaction active-region 起作用
    // view 应该继承 chart 里的 shared，但是从表现看来，继承有点问题
    leftView.tooltip({
        shared: true,
    });
    rightView.tooltip({
        shared: true,
    });
    return params;
}
exports.tooltip = tooltip;
/**
 * interaction 配置
 * @param params
 */
function interaction(params) {
    var chart = params.chart;
    (0, common_1.interaction)((0, utils_1.deepAssign)({}, params, { chart: (0, view_1.findViewById)(chart, constant_1.LEFT_AXES_VIEW) }));
    (0, common_1.interaction)((0, utils_1.deepAssign)({}, params, { chart: (0, view_1.findViewById)(chart, constant_1.RIGHT_AXES_VIEW) }));
    return params;
}
exports.interaction = interaction;
/**
 * annotation 配置
 * @param params
 */
function annotation(params) {
    var chart = params.chart, options = params.options;
    var annotations = options.annotations;
    var a1 = (0, util_1.get)(annotations, [0]);
    var a2 = (0, util_1.get)(annotations, [1]);
    (0, common_1.annotation)(a1)((0, utils_1.deepAssign)({}, params, {
        chart: (0, view_1.findViewById)(chart, constant_1.LEFT_AXES_VIEW),
        options: {
            annotations: a1,
        },
    }));
    (0, common_1.annotation)(a2)((0, utils_1.deepAssign)({}, params, {
        chart: (0, view_1.findViewById)(chart, constant_1.RIGHT_AXES_VIEW),
        options: {
            annotations: a2,
        },
    }));
    return params;
}
exports.annotation = annotation;
function theme(params) {
    var chart = params.chart;
    /*
     * 双轴图中，部分组件是绘制在子 view 层（例如 axis，line），部分组件是绘制在 chart （例如 legend)
     * 为 chart 和 子 view 均注册 theme，使其自行遵循 G2 theme geometry > view > chart 进行渲染。
     */
    (0, common_1.theme)((0, utils_1.deepAssign)({}, params, { chart: (0, view_1.findViewById)(chart, constant_1.LEFT_AXES_VIEW) }));
    (0, common_1.theme)((0, utils_1.deepAssign)({}, params, { chart: (0, view_1.findViewById)(chart, constant_1.RIGHT_AXES_VIEW) }));
    (0, common_1.theme)(params);
    return params;
}
exports.theme = theme;
function animation(params) {
    var chart = params.chart;
    (0, common_1.animation)((0, utils_1.deepAssign)({}, params, { chart: (0, view_1.findViewById)(chart, constant_1.LEFT_AXES_VIEW) }));
    (0, common_1.animation)((0, utils_1.deepAssign)({}, params, { chart: (0, view_1.findViewById)(chart, constant_1.RIGHT_AXES_VIEW) }));
    return params;
}
exports.animation = animation;
/**
 * 双轴图 limitInPlot
 * @param params
 */
function limitInPlot(params) {
    var chart = params.chart, options = params.options;
    var yAxis = options.yAxis;
    (0, common_1.limitInPlot)((0, utils_1.deepAssign)({}, params, {
        chart: (0, view_1.findViewById)(chart, constant_1.LEFT_AXES_VIEW),
        options: {
            yAxis: yAxis[0],
        },
    }));
    (0, common_1.limitInPlot)((0, utils_1.deepAssign)({}, params, {
        chart: (0, view_1.findViewById)(chart, constant_1.RIGHT_AXES_VIEW),
        options: {
            yAxis: yAxis[1],
        },
    }));
    return params;
}
exports.limitInPlot = limitInPlot;
/**
 * legend 配置
 * 使用 custom，便于和类似于分组柱状图-单折线图的逻辑统一
 * @param params
 */
function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, geometryOptions = options.geometryOptions, yField = options.yField, data = options.data;
    var leftView = (0, view_1.findViewById)(chart, constant_1.LEFT_AXES_VIEW);
    var rightView = (0, view_1.findViewById)(chart, constant_1.RIGHT_AXES_VIEW);
    if (legend === false) {
        chart.legend(false);
    }
    else if ((0, util_1.isObject)(legend) && legend.custom === true) {
        chart.legend(legend);
    }
    else {
        var leftLegend_1 = (0, util_1.get)(geometryOptions, [0, 'legend'], legend);
        var rightLegend_1 = (0, util_1.get)(geometryOptions, [1, 'legend'], legend);
        // 均使用自定义图例
        chart.once('beforepaint', function () {
            var leftItems = data[0].length
                ? (0, legend_1.getViewLegendItems)({
                    view: leftView,
                    geometryOption: geometryOptions[0],
                    yField: yField[0],
                    legend: leftLegend_1,
                })
                : [];
            var rightItems = data[1].length
                ? (0, legend_1.getViewLegendItems)({
                    view: rightView,
                    geometryOption: geometryOptions[1],
                    yField: yField[1],
                    legend: rightLegend_1,
                })
                : [];
            chart.legend((0, utils_1.deepAssign)({}, legend, {
                custom: true,
                // todo 修改类型定义
                // @ts-ignore
                items: leftItems.concat(rightItems),
            }));
        });
        if (geometryOptions[0].seriesField) {
            leftView.legend(geometryOptions[0].seriesField, leftLegend_1);
        }
        if (geometryOptions[1].seriesField) {
            rightView.legend(geometryOptions[1].seriesField, rightLegend_1);
        }
        // 自定义图例交互
        chart.on('legend-item:click', function (evt) {
            var delegateObject = (0, util_1.get)(evt, 'gEvent.delegateObject', {});
            if (delegateObject && delegateObject.item) {
                var _a = delegateObject.item, field_1 = _a.value, isGeometry = _a.isGeometry, viewId = _a.viewId;
                // geometry 的时候，直接使用 view.changeVisible
                if (isGeometry) {
                    var idx = (0, util_1.findIndex)(yField, function (yF) { return yF === field_1; });
                    if (idx > -1) {
                        var geometries = (0, util_1.get)((0, view_1.findViewById)(chart, viewId), 'geometries');
                        (0, util_1.each)(geometries, function (g) {
                            g.changeVisible(!delegateObject.item.unchecked);
                        });
                    }
                }
                else {
                    var legendItem_1 = (0, util_1.get)(chart.getController('legend'), 'option.items', []);
                    // 分组柱线图
                    (0, util_1.each)(chart.views, function (view) {
                        // 单折柱图
                        var groupScale = view.getGroupScales();
                        (0, util_1.each)(groupScale, function (scale) {
                            if (scale.values && scale.values.indexOf(field_1) > -1) {
                                view.filter(scale.field, function (value) {
                                    var curLegendItem = (0, util_1.find)(legendItem_1, function (item) { return item.value === value; });
                                    // 使用 legend 中的 unchecked 来判断，使得支持关闭多个图例
                                    return !curLegendItem.unchecked;
                                });
                            }
                        });
                        chart.render(true);
                    });
                }
            }
        });
    }
    return params;
}
exports.legend = legend;
/**
 * 双轴图 slider 适配器
 * @param params
 */
function slider(params) {
    var chart = params.chart, options = params.options;
    var slider = options.slider;
    var leftView = (0, view_1.findViewById)(chart, constant_1.LEFT_AXES_VIEW);
    var rightView = (0, view_1.findViewById)(chart, constant_1.RIGHT_AXES_VIEW);
    if (slider) {
        // 左 View
        leftView.option('slider', slider);
        // 监听左侧 slider 改变事件， 同步右侧 View 视图
        leftView.on('slider:valuechanged', function (evt) {
            var _a = evt.event, value = _a.value, originValue = _a.originValue;
            if ((0, util_1.isEqual)(value, originValue)) {
                return;
            }
            (0, render_sider_1.doSliderFilter)(rightView, value);
        });
        chart.once('afterpaint', function () {
            // 初始化数据，配置默认值时需要同步
            if (!(0, util_1.isBoolean)(slider)) {
                var start = slider.start, end = slider.end;
                if (start || end) {
                    (0, render_sider_1.doSliderFilter)(rightView, [start, end]);
                }
            }
        });
    }
    return params;
}
exports.slider = slider;
/**
 * 双折线图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // transformOptions 一定在最前面处理；color legend 使用了 beforepaint，为便于理解放在最后面
    return (0, utils_1.flow)(transformOptions, createViews, 
    // 主题靠前设置，作为最低优先级
    theme, geometry, meta, axis, limitInPlot, tooltip, interaction, annotation, animation, color, legend, slider)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map