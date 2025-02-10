"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.geometry = exports.meta = void 0;
var tslib_1 = require("tslib");
var common_1 = require("../../adaptor/common");
var utils_1 = require("../../utils");
var adaptor_1 = require("../column/adaptor");
var adaptor_2 = require("../column/adaptor");
Object.defineProperty(exports, "meta", { enumerable: true, get: function () { return adaptor_2.meta; } });
/**
 * 处理默认配置项
 * 1. switch xField、 yField
 * 2. switch xAxis、 yAxis and adjust axis.position configuration
 */
function defaultOptions(params) {
    var options = params.options;
    var xField = options.xField, yField = options.yField, xAxis = options.xAxis, yAxis = options.yAxis;
    var position = {
        left: 'bottom',
        right: 'top',
        top: 'left',
        bottom: 'right',
    };
    var verticalAxis = yAxis !== false
        ? tslib_1.__assign({ position: position[(yAxis === null || yAxis === void 0 ? void 0 : yAxis.position) || 'left'] }, yAxis) : false;
    var horizontalAxis = xAxis !== false
        ? tslib_1.__assign({ position: position[(xAxis === null || xAxis === void 0 ? void 0 : xAxis.position) || 'bottom'] }, xAxis) : false;
    return tslib_1.__assign(tslib_1.__assign({}, params), { options: tslib_1.__assign(tslib_1.__assign({}, options), { xField: yField, yField: xField, 
            // 条形图 xAxis，yAxis 不可以做 deepAssign
            xAxis: verticalAxis, yAxis: horizontalAxis }) });
}
/**
 * label 适配器
 * @param params
 */
function label(params) {
    var options = params.options;
    var label = options.label;
    // label of bar charts default position is left, if plot has label
    if (label && !label.position) {
        label.position = 'left';
        // 配置默认的 label layout： 如果用户没有指定 layout 和 position， 则自动配置 layout
        if (!label.layout) {
            label.layout = [
                { type: 'interval-adjust-position' },
                { type: 'interval-hide-overlap' },
                { type: 'adjust-color' },
                { type: 'limit-in-plot', cfg: { action: 'hide' } },
            ];
        }
    }
    return (0, utils_1.deepAssign)({}, params, { options: { label: label } });
}
/**
 * legend 适配器
 * @param params
 */
function legend(params) {
    var options = params.options;
    // 默认 legend 位置
    var seriesField = options.seriesField, isStack = options.isStack;
    var legend = options.legend;
    if (seriesField) {
        if (legend !== false) {
            legend = tslib_1.__assign({ position: isStack ? 'top-left' : 'right-top' }, (legend || {}));
        }
    }
    else {
        legend = false;
    }
    return (0, utils_1.deepAssign)({}, params, { options: { legend: legend } });
}
/**
 * coordinate 适配器
 * @param params
 */
function coordinate(params) {
    // transpose column to bar 对角变换 & y 方向镜像变换
    var options = params.options;
    var coordinateOptions = [{ type: 'transpose' }, { type: 'reflectY' }].concat(options.coordinate || []);
    return (0, utils_1.deepAssign)({}, params, { options: { coordinate: coordinateOptions } });
}
/**
 * 柱形图适配器
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var barStyle = options.barStyle, barWidthRatio = options.barWidthRatio, minBarWidth = options.minBarWidth, maxBarWidth = options.maxBarWidth, barBackground = options.barBackground;
    return (0, adaptor_1.adaptor)({
        chart: chart,
        options: tslib_1.__assign(tslib_1.__assign({}, options), { 
            // rename attrs as column
            columnStyle: barStyle, columnWidthRatio: barWidthRatio, minColumnWidth: minBarWidth, maxColumnWidth: maxBarWidth, columnBackground: barBackground }),
    }, true);
}
exports.geometry = geometry;
/**
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(defaultOptions, label, legend, common_1.tooltip, coordinate, geometry)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map