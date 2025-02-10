import { isFunction } from '@antv/util';
/**
 * 获取或者绑定图表实例
 */
export var getChart = function (chartRef, chart) {
    if (!chartRef) {
        return;
    }
    if (isFunction(chartRef)) {
        chartRef(chart);
    }
    else {
        chartRef.current = chart;
    }
};
