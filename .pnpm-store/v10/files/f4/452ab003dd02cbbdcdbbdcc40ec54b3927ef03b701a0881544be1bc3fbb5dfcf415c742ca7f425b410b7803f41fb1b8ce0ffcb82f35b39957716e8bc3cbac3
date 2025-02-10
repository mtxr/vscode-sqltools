"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.RANGE_VIEW_ID = exports.INDICATEOR_VIEW_ID = exports.DEFAULT_COLOR = exports.PERCENT = exports.RANGE_TYPE = exports.RANGE_VALUE = void 0;
exports.RANGE_VALUE = 'range';
exports.RANGE_TYPE = 'type';
exports.PERCENT = 'percent';
exports.DEFAULT_COLOR = '#f0f0f0';
/** 仪表盘由 指针和表盘 组成 */
exports.INDICATEOR_VIEW_ID = 'indicator-view';
exports.RANGE_VIEW_ID = 'range-view';
/**
 * 仪表盘默认配置项
 */
exports.DEFAULT_OPTIONS = {
    percent: 0,
    range: {
        ticks: [],
    },
    innerRadius: 0.9,
    radius: 0.95,
    startAngle: (-7 / 6) * Math.PI,
    endAngle: (1 / 6) * Math.PI,
    syncViewPadding: true,
    axis: {
        line: null,
        label: {
            offset: -24,
            style: {
                textAlign: 'center',
                textBaseline: 'middle',
            },
        },
        subTickLine: {
            length: -8,
        },
        tickLine: {
            length: -12,
        },
        grid: null,
    },
    indicator: {
        pointer: {
            style: {
                lineWidth: 5,
                lineCap: 'round',
            },
        },
        pin: {
            style: {
                r: 9.75,
                lineWidth: 4.5,
                fill: '#fff',
            },
        },
    },
    statistic: {
        title: false,
    },
    meta: (_a = {},
        // 两个 view 的 scale 同步到 v 上
        _a[exports.RANGE_VALUE] = {
            sync: 'v',
        },
        _a[exports.PERCENT] = {
            sync: 'v',
            tickCount: 5,
            tickInterval: 0.2,
        },
        _a),
    animation: false,
};
//# sourceMappingURL=constants.js.map