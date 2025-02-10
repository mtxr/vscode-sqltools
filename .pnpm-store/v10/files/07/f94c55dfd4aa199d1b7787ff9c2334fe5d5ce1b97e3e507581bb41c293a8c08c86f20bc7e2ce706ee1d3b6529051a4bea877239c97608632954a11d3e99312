"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.legend = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var constant_1 = require("./constant");
var utils_2 = require("./utils");
/**
 * geometry 配置处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var colorField = options.colorField, color = options.color;
    var data = (0, utils_2.transform)(params);
    chart.data(data);
    var p = (0, utils_1.deepAssign)({}, params, {
        options: {
            xField: 'x',
            yField: 'y',
            seriesField: colorField && constant_1.WORD_CLOUD_COLOR_FIELD,
            rawFields: (0, util_1.isFunction)(color) && tslib_1.__spreadArray(tslib_1.__spreadArray([], (0, util_1.get)(options, 'rawFields', []), true), ['datum'], false),
            point: {
                color: color,
                shape: 'word-cloud',
            },
        },
    });
    var ext = (0, geometries_1.point)(p).ext;
    ext.geometry.label(false);
    chart.coordinate().reflect('y');
    chart.axis(false);
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    return (0, utils_1.flow)((0, common_1.scale)({
        x: { nice: false },
        y: { nice: false },
    }))(params);
}
/**
 * 词云图 legend 配置
 * @param params
 */
function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, colorField = options.colorField;
    if (legend === false) {
        chart.legend(false);
    }
    else if (colorField) {
        chart.legend(constant_1.WORD_CLOUD_COLOR_FIELD, legend);
    }
    return params;
}
exports.legend = legend;
/**
 * 词云图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    (0, utils_1.flow)(geometry, meta, common_1.tooltip, legend, common_1.interaction, common_1.animation, common_1.theme, common_1.state)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map