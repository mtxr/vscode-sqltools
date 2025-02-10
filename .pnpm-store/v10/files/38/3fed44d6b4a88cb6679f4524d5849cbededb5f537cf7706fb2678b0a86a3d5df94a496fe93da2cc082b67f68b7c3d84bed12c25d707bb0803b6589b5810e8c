"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.meta = void 0;
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var data_1 = require("../../utils/data");
var constants_1 = require("../tiny-line/constants");
var utils_2 = require("../tiny-line/utils");
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, color = options.color, areaStyle = options.areaStyle, pointOptions = options.point, lineOptions = options.line;
    var pointState = pointOptions === null || pointOptions === void 0 ? void 0 : pointOptions.state;
    var seriesData = (0, utils_2.getTinyData)(data);
    chart.data(seriesData);
    var primary = (0, utils_1.deepAssign)({}, params, {
        options: {
            xField: constants_1.X_FIELD,
            yField: constants_1.Y_FIELD,
            area: { color: color, style: areaStyle },
            line: lineOptions,
            point: pointOptions,
        },
    });
    var second = (0, utils_1.deepAssign)({}, primary, { options: { tooltip: false } });
    var pointParams = (0, utils_1.deepAssign)({}, primary, { options: { tooltip: false, state: pointState } });
    // area geometry 处理
    (0, geometries_1.area)(primary);
    (0, geometries_1.line)(second);
    (0, geometries_1.point)(pointParams);
    chart.axis(false);
    chart.legend(false);
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a, _b;
    var options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, data = options.data;
    var seriesData = (0, utils_2.getTinyData)(data);
    return (0, utils_1.flow)((0, common_1.scale)((_a = {},
        _a[constants_1.X_FIELD] = xAxis,
        _a[constants_1.Y_FIELD] = yAxis,
        _a), (_b = {},
        _b[constants_1.X_FIELD] = {
            type: 'cat',
        },
        _b[constants_1.Y_FIELD] = (0, data_1.adjustYMetaByZero)(seriesData, constants_1.Y_FIELD),
        _b)))(params);
}
exports.meta = meta;
/**
 * 迷你面积图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    return (0, utils_1.flow)((0, common_1.pattern)('areaStyle'), geometry, meta, common_1.tooltip, common_1.theme, common_1.animation, (0, common_1.annotation)())(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map