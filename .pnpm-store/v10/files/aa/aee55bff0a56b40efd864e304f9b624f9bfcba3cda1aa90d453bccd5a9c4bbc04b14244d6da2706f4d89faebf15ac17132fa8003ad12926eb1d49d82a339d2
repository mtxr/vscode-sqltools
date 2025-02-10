import { Plot } from '../../core/plot';
import { deepAssign } from '../../utils';
export var Y_FIELD = '$$stock-range$$';
export var TREND_FIELD = 'trend';
export var TREND_UP = 'up';
export var TREND_DOWN = 'down';
/** tooltip 配置 */
export var DEFAULT_TOOLTIP_OPTIONS = {
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
export var DEFAULT_OPTIONS = deepAssign({}, Plot.getDefaultOptions(), {
    // 设置默认图表 tooltips
    tooltip: DEFAULT_TOOLTIP_OPTIONS,
    interactions: [{ type: 'tooltip' }],
    legend: {
        position: 'top-left',
    },
    risingFill: '#ef5350',
    fallingFill: '#26a69a',
});
//# sourceMappingURL=constant.js.map