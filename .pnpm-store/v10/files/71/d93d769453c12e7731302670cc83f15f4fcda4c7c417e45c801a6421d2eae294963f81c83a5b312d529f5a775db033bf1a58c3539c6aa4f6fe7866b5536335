"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.meta = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var point_1 = require("../../adaptor/geometries/point");
var utils_1 = require("../../utils");
var padding_1 = require("../../utils/padding");
var constant_1 = require("./constant");
var utils_2 = require("./utils");
/**
 * 获取默认 option
 * @param params
 */
function defaultOptions(params) {
    var chart = params.chart;
    var diameter = Math.min(chart.viewBBox.width, chart.viewBBox.height);
    return (0, utils_1.deepAssign)({
        options: {
            size: function (_a) {
                var r = _a.r;
                return r * diameter;
            }, // 当autofit：false时，默认给固定半径
        },
    }, params);
}
/**
 * padding 配置
 * @param params
 */
function padding(params) {
    var options = params.options, chart = params.chart;
    // 通过改变 padding，修改 coordinate 的绘制区域
    var containerSize = chart.viewBBox;
    var padding = options.padding, appendPadding = options.appendPadding, drilldown = options.drilldown;
    var tempAppendPadding = appendPadding;
    if (drilldown === null || drilldown === void 0 ? void 0 : drilldown.enabled) {
        var appendPaddingByDrilldown = (0, padding_1.getAdjustAppendPadding)(chart.appendPadding, (0, util_1.get)(drilldown, ['breadCrumb', 'position']));
        tempAppendPadding = (0, padding_1.resolveAllPadding)([appendPaddingByDrilldown, appendPadding]);
    }
    var finalPadding = (0, utils_2.resolvePaddingForCircle)(padding, tempAppendPadding, containerSize).finalPadding;
    chart.padding = finalPadding;
    chart.appendPadding = 0;
    return params;
}
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var padding = chart.padding, appendPadding = chart.appendPadding;
    var color = options.color, colorField = options.colorField, pointStyle = options.pointStyle, hierarchyConfig = options.hierarchyConfig, sizeField = options.sizeField, _a = options.rawFields, rawFields = _a === void 0 ? [] : _a, drilldown = options.drilldown;
    var data = (0, utils_2.transformData)({
        data: options.data,
        hierarchyConfig: hierarchyConfig,
        enableDrillDown: drilldown === null || drilldown === void 0 ? void 0 : drilldown.enabled,
        rawFields: rawFields,
    });
    chart.data(data);
    var containerSize = chart.viewBBox;
    var finalSize = (0, utils_2.resolvePaddingForCircle)(padding, appendPadding, containerSize).finalSize;
    // 有sizeField的时候，例如 value ，可以选择映射 size 函数，自己计算出映射的半径
    var circleSize = function (_a) {
        var r = _a.r;
        return r * finalSize;
    }; // 默认配置
    if (sizeField) {
        circleSize = function (d) { return d[sizeField] * finalSize; }; // 目前只有 r 通道映射效果会正常
    }
    // geometry
    (0, point_1.point)((0, utils_1.deepAssign)({}, params, {
        options: {
            xField: 'x',
            yField: 'y',
            seriesField: colorField,
            sizeField: sizeField,
            rawFields: tslib_1.__spreadArray(tslib_1.__spreadArray([], constant_1.RAW_FIELDS, true), rawFields, true),
            point: {
                color: color,
                style: pointStyle,
                shape: 'circle',
                size: circleSize,
            },
        },
    }));
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    return (0, utils_1.flow)((0, common_1.scale)({}, {
        // 必须强制为 nice
        x: { min: 0, max: 1, minLimit: 0, maxLimit: 1, nice: true },
        y: { min: 0, max: 1, minLimit: 0, maxLimit: 1, nice: true },
    }))(params);
}
exports.meta = meta;
/**
 * tooltip 配置
 * @param params
 */
function tooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip;
    if (tooltip === false) {
        chart.tooltip(false);
    }
    else {
        var tooltipOptions = tooltip;
        // 设置了 fields，就不进行 customItems 了; 设置 formatter 时，需要搭配 fields
        if (!(0, util_1.get)(tooltip, 'fields')) {
            tooltipOptions = (0, utils_1.deepAssign)({}, {
                customItems: function (items) {
                    return items.map(function (item) {
                        var scales = (0, util_1.get)(chart.getOptions(), 'scales');
                        var nameFormatter = (0, util_1.get)(scales, ['name', 'formatter'], function (v) { return v; });
                        var valueFormatter = (0, util_1.get)(scales, ['value', 'formatter'], function (v) { return v; });
                        return tslib_1.__assign(tslib_1.__assign({}, item), { name: nameFormatter(item.data.name), value: valueFormatter(item.data.value) });
                    });
                },
            }, tooltipOptions);
        }
        chart.tooltip(tooltipOptions);
    }
    return params;
}
/**
 * 坐标轴, 默认关闭
 * @param params
 */
function axis(params) {
    var chart = params.chart;
    chart.axis(false);
    return params;
}
function adaptorInteraction(options) {
    var drilldown = options.drilldown, _a = options.interactions, interactions = _a === void 0 ? [] : _a;
    if (drilldown === null || drilldown === void 0 ? void 0 : drilldown.enabled) {
        return (0, utils_1.deepAssign)({}, options, {
            interactions: tslib_1.__spreadArray(tslib_1.__spreadArray([], interactions, true), [
                {
                    type: 'drill-down',
                    cfg: { drillDownConfig: drilldown, transformData: utils_2.transformData, enableDrillDown: true },
                },
            ], false),
        });
    }
    return options;
}
/**
 * 交互配置
 * @param params
 * @returns
 */
function interaction(params) {
    var chart = params.chart, options = params.options;
    (0, common_1.interaction)({
        chart: chart,
        options: adaptorInteraction(options),
    });
    return params;
}
/**
 * 矩形树图
 * @param chart
 * @param options
 */
function adaptor(params) {
    return (0, utils_1.flow)((0, common_1.pattern)('pointStyle'), defaultOptions, padding, common_1.theme, meta, geometry, axis, common_1.legend, tooltip, interaction, common_1.animation, (0, common_1.annotation)())(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map