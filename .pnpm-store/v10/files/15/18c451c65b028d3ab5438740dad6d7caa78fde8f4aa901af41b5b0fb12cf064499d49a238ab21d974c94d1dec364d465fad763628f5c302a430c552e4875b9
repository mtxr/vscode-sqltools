"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.meta = void 0;
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var adaptor_1 = require("../tiny-area/adaptor");
Object.defineProperty(exports, "meta", { enumerable: true, get: function () { return adaptor_1.meta; } });
var constants_1 = require("../tiny-line/constants");
var utils_2 = require("../tiny-line/utils");
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, color = options.color, columnStyle = options.columnStyle, columnWidthRatio = options.columnWidthRatio;
    var seriesData = (0, utils_2.getTinyData)(data);
    chart.data(seriesData);
    var p = (0, utils_1.deepAssign)({}, params, {
        options: {
            xField: constants_1.X_FIELD,
            yField: constants_1.Y_FIELD,
            widthRatio: columnWidthRatio,
            interval: {
                style: columnStyle,
                color: color,
            },
        },
    });
    (0, geometries_1.interval)(p);
    chart.axis(false);
    chart.legend(false);
    chart.interaction('element-active');
    return params;
}
/**
 * 迷你柱形图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    return (0, utils_1.flow)(common_1.theme, (0, common_1.pattern)('columnStyle'), geometry, adaptor_1.meta, common_1.tooltip, common_1.animation, (0, common_1.annotation)())(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map