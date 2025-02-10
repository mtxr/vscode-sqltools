"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.meta = void 0;
var common_1 = require("../../adaptor/common");
var utils_1 = require("../../utils");
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, xField = options.xField, yField = options.yField;
    chart.data(data);
    chart.interval().position("".concat(xField, "*").concat(yField));
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a;
    var options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    return (0, utils_1.flow)((0, common_1.scale)((_a = {},
        _a[xField] = xAxis,
        _a[yField] = yAxis,
        _a)))(params);
}
exports.meta = meta;
/**
 * 图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(common_1.theme, geometry, meta, common_1.interaction, common_1.animation
    // ... 其他的 adaptor flow
    )(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map