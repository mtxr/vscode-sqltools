"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.geometry = void 0;
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var constants_1 = require("./constants");
var utils_2 = require("./utils");
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var percent = options.percent, progressStyle = options.progressStyle, color = options.color, barWidthRatio = options.barWidthRatio;
    chart.data((0, utils_2.getProgressData)(percent));
    var p = (0, utils_1.deepAssign)({}, params, {
        options: {
            xField: 'current',
            yField: 'percent',
            seriesField: 'type',
            widthRatio: barWidthRatio,
            interval: {
                style: progressStyle,
                color: (0, util_1.isString)(color) ? [color, constants_1.DEFAULT_COLOR[1]] : color,
            },
            args: {
                zIndexReversed: true,
                sortZIndex: true,
            },
        },
    });
    (0, geometries_1.interval)(p);
    // 关闭组件
    chart.tooltip(false);
    chart.axis(false);
    chart.legend(false);
    return params;
}
exports.geometry = geometry;
/**
 * other 配置
 * @param params
 */
function coordinate(params) {
    var chart = params.chart;
    chart.coordinate('rect').transpose();
    return params;
}
/**
 * 进度图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // @ts-ignore
    return (0, utils_1.flow)(geometry, (0, common_1.scale)({}), coordinate, common_1.animation, common_1.theme, (0, common_1.annotation)())(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map