"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.meta = void 0;
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var adaptor_1 = require("../tiny-area/adaptor");
Object.defineProperty(exports, "meta", { enumerable: true, get: function () { return adaptor_1.meta; } });
var constants_1 = require("./constants");
var utils_2 = require("./utils");
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, color = options.color, lineStyle = options.lineStyle, pointMapping = options.point;
    var pointState = pointMapping === null || pointMapping === void 0 ? void 0 : pointMapping.state;
    var seriesData = (0, utils_2.getTinyData)(data);
    chart.data(seriesData);
    // line geometry 处理
    var primary = (0, utils_1.deepAssign)({}, params, {
        options: {
            xField: constants_1.X_FIELD,
            yField: constants_1.Y_FIELD,
            line: {
                color: color,
                style: lineStyle,
            },
            point: pointMapping,
        },
    });
    var pointParams = (0, utils_1.deepAssign)({}, primary, { options: { tooltip: false, state: pointState } });
    (0, geometries_1.line)(primary);
    (0, geometries_1.point)(pointParams);
    chart.axis(false);
    chart.legend(false);
    return params;
}
/**
 * 迷你折线图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    return (0, utils_1.flow)(geometry, adaptor_1.meta, common_1.theme, common_1.tooltip, common_1.animation, (0, common_1.annotation)())(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map