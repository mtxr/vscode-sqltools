"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.interaction = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var polygon_1 = require("../../adaptor/geometries/polygon");
var pattern_1 = require("../../adaptor/pattern");
var utils_1 = require("../../utils");
var padding_1 = require("../../utils/padding");
var utils_2 = require("./utils");
/**
 * 获取默认 option
 * @param params
 */
function defaultOptions(params) {
    var options = params.options;
    var colorField = options.colorField;
    return (0, utils_1.deepAssign)({
        options: {
            rawFields: ['value'],
            tooltip: {
                fields: ['name', 'value', colorField, 'path'],
                formatter: function (data) {
                    return {
                        name: data.name,
                        value: data.value,
                    };
                },
            },
        },
    }, params);
}
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var color = options.color, colorField = options.colorField, rectStyle = options.rectStyle, hierarchyConfig = options.hierarchyConfig, rawFields = options.rawFields;
    var data = (0, utils_2.transformData)({
        data: options.data,
        colorField: options.colorField,
        enableDrillDown: (0, utils_2.enableDrillInteraction)(options),
        hierarchyConfig: hierarchyConfig,
    });
    chart.data(data);
    // geometry
    (0, polygon_1.polygon)((0, utils_1.deepAssign)({}, params, {
        options: {
            xField: 'x',
            yField: 'y',
            seriesField: colorField,
            rawFields: rawFields,
            polygon: {
                color: color,
                style: rectStyle,
            },
        },
    }));
    // 做一个反转，这样配合排序，可以将最大值放到左上角，最小值放到右下角
    chart.coordinate().reflect('y');
    return params;
}
/**
 * 坐标轴
 * @param params
 */
function axis(params) {
    var chart = params.chart;
    chart.axis(false);
    return params;
}
function adaptorInteraction(options) {
    var drilldown = options.drilldown, _a = options.interactions, interactions = _a === void 0 ? [] : _a;
    var enableDrillDown = (0, utils_2.enableDrillInteraction)(options);
    if (enableDrillDown) {
        return (0, utils_1.deepAssign)({}, options, {
            interactions: tslib_1.__spreadArray(tslib_1.__spreadArray([], interactions, true), [
                {
                    type: 'drill-down',
                    // 🚓 这不是一个规范的 API，后续会变更。慎重参考
                    cfg: { drillDownConfig: drilldown, transformData: utils_2.transformData },
                },
            ], false),
        });
    }
    return options;
}
/**
 * Interaction 配置
 * @param params
 */
function interaction(params) {
    var chart = params.chart, options = params.options;
    var interactions = options.interactions, drilldown = options.drilldown;
    (0, common_1.interaction)({
        chart: chart,
        options: adaptorInteraction(options),
    });
    // 适配 view-zoom
    var viewZoomInteraction = (0, utils_2.findInteraction)(interactions, 'view-zoom');
    if (viewZoomInteraction) {
        // 开启缩放 interaction 后，则阻止默认滚动事件，避免整个窗口的滚动
        if (viewZoomInteraction.enable !== false) {
            chart.getCanvas().on('mousewheel', function (ev) {
                ev.preventDefault();
            });
        }
        else {
            // 手动关闭后，清除。仅对声明 viewZoomInteraction 的清除。
            chart.getCanvas().off('mousewheel');
        }
    }
    // 适应下钻交互面包屑
    var enableDrillDown = (0, utils_2.enableDrillInteraction)(options);
    if (enableDrillDown) {
        // 为面包屑在底部留出 25px 的空间
        chart.appendPadding = (0, padding_1.getAdjustAppendPadding)(chart.appendPadding, (0, util_1.get)(drilldown, ['breadCrumb', 'position']));
    }
    return params;
}
exports.interaction = interaction;
/**
 * 矩形树图
 * @param chart
 * @param options
 */
function adaptor(params) {
    return (0, utils_1.flow)(defaultOptions, common_1.theme, (0, pattern_1.pattern)('rectStyle'), geometry, axis, common_1.legend, common_1.tooltip, interaction, common_1.animation, (0, common_1.annotation)())(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map