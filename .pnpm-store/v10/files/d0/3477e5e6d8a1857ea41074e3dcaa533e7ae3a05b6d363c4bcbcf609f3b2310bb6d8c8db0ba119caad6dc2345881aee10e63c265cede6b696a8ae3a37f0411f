"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.DEFAULT_TOOLTIP_OPTIONS = exports.TREND_DOWN = exports.TREND_UP = exports.TREND_FIELD = exports.Y_FIELD = void 0;
var plot_1 = require("../../core/plot");
var utils_1 = require("../../utils");
exports.Y_FIELD = '$$stock-range$$';
exports.TREND_FIELD = 'trend';
exports.TREND_UP = 'up';
exports.TREND_DOWN = 'down';
/** tooltip 配置 */
exports.DEFAULT_TOOLTIP_OPTIONS = {
    showMarkers: false,
    showCrosshairs: true,
    shared: true,
    crosshairs: {
        type: 'xy',
        follow: true,
        text: function (type, defaultContent, items) {
            var textContent;
            if (type === 'x') {
                var item = items[0];
                textContent = item ? item.title : defaultContent;
            }
            else {
                textContent = defaultContent;
            }
            return {
                position: type === 'y' ? 'start' : 'end',
                content: textContent,
                style: {
                    fill: '#dfdfdf',
                },
            };
        },
        // 自定义 crosshairs textBackground 样式
        textBackground: {
            padding: [2, 4],
            style: {
                fill: '#666',
            },
        },
    },
};
/**
 * 散点图 默认配置项
 */
exports.DEFAULT_OPTIONS = (0, utils_1.deepAssign)({}, plot_1.Plot.getDefaultOptions(), {
    // 设置默认图表 tooltips
    tooltip: exports.DEFAULT_TOOLTIP_OPTIONS,
    interactions: [{ type: 'tooltip' }],
    legend: {
        position: 'top-left',
    },
    risingFill: '#ef5350',
    fallingFill: '#26a69a',
});
//# sourceMappingURL=constant.js.map