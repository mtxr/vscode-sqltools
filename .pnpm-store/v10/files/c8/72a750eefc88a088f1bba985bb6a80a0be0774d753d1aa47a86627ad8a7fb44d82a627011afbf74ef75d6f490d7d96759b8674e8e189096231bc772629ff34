"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.WORD_CLOUD_COLOR_FIELD = void 0;
var plot_1 = require("../../core/plot");
var utils_1 = require("../../utils");
/** 词云图 color 通道映射字段 */
exports.WORD_CLOUD_COLOR_FIELD = 'color';
/**
 * 词云图 默认配置项
 */
exports.DEFAULT_OPTIONS = (0, utils_1.deepAssign)({}, plot_1.Plot.getDefaultOptions(), {
    timeInterval: 2000,
    legend: false,
    tooltip: {
        showTitle: false,
        showMarkers: false,
        showCrosshairs: false,
        fields: ['text', 'value', exports.WORD_CLOUD_COLOR_FIELD],
        formatter: function (datum) {
            return { name: datum.text, value: datum.value };
        },
    },
    wordStyle: {
        fontFamily: 'Verdana',
        fontWeight: 'normal',
        padding: 1,
        fontSize: [12, 60],
        rotation: [0, 90],
        rotationSteps: 2,
        rotateRatio: 0.5,
    },
});
//# sourceMappingURL=constant.js.map