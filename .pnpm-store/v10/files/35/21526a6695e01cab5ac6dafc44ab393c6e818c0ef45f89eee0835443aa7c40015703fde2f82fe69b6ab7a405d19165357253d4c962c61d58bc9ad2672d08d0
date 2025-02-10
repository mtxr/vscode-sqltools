"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChart = void 0;
var util_1 = require("@antv/util");
/**
 * 获取或者绑定图表实例
 */
var getChart = function (chartRef, chart) {
    if (!chartRef) {
        return;
    }
    if ((0, util_1.isFunction)(chartRef)) {
        chartRef(chart);
    }
    else {
        chartRef.current = chart;
    }
};
exports.getChart = getChart;
