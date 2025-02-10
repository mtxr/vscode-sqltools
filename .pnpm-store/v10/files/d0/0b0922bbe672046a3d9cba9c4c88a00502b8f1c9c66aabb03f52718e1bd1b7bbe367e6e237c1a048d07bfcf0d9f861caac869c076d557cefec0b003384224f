"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facetFunnel = void 0;
var utils_1 = require("../../../utils");
var basic_1 = require("./basic");
/**
 * 处理字段数据
 * @param params
 */
function field(params) {
    var _a;
    var chart = params.chart, options = params.options;
    var _b = options.data, data = _b === void 0 ? [] : _b, yField = options.yField;
    // 绘制漏斗图
    chart.data(data);
    chart.scale((_a = {},
        _a[yField] = {
            sync: true,
        },
        _a));
    return params;
}
/**
 * geometry处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var seriesField = options.seriesField, isTransposed = options.isTransposed, showFacetTitle = options.showFacetTitle;
    chart.facet('rect', {
        fields: [seriesField],
        padding: [isTransposed ? 0 : 32, 10, 0, 10],
        showTitle: showFacetTitle,
        eachView: function (view, facet) {
            (0, basic_1.basicFunnel)((0, utils_1.deepAssign)({}, params, {
                chart: view,
                options: {
                    data: facet.data,
                },
            }));
        },
    });
    return params;
}
/**
 * 分面漏斗
 * @param chart
 * @param options
 */
function facetFunnel(params) {
    return (0, utils_1.flow)(field, geometry)(params);
}
exports.facetFunnel = facetFunnel;
//# sourceMappingURL=facet.js.map