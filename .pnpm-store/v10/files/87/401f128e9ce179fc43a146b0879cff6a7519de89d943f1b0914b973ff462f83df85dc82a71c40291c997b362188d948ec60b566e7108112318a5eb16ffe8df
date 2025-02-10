"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSingleGeometry = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var geometries_1 = require("../../../adaptor/geometries");
var utils_1 = require("../../../utils");
var adaptor_1 = require("../../column/adaptor");
var option_1 = require("./option");
/**
 * 绘制单个图形
 * @param params
 */
function drawSingleGeometry(params) {
    var options = params.options, chart = params.chart;
    var geometryOption = options.geometryOption;
    var isStack = geometryOption.isStack, color = geometryOption.color, seriesField = geometryOption.seriesField, groupField = geometryOption.groupField, isGroup = geometryOption.isGroup;
    var FIELD_KEY = ['xField', 'yField'];
    if ((0, option_1.isLine)(geometryOption)) {
        // 绘制线
        (0, geometries_1.line)((0, utils_1.deepAssign)({}, params, {
            options: tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, (0, utils_1.pick)(options, FIELD_KEY)), geometryOption), { line: {
                    color: geometryOption.color,
                    style: geometryOption.lineStyle,
                } }),
        }));
        // 绘制点
        (0, geometries_1.point)((0, utils_1.deepAssign)({}, params, {
            options: tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, (0, utils_1.pick)(options, FIELD_KEY)), geometryOption), { point: geometryOption.point && tslib_1.__assign({ color: color, shape: 'circle' }, geometryOption.point) }),
        }));
        // adjust
        var adjust_1 = [];
        if (isGroup) {
            adjust_1.push({
                type: 'dodge',
                dodgeBy: groupField || seriesField,
                customOffset: 0,
            });
        }
        if (isStack) {
            adjust_1.push({
                type: 'stack',
            });
        }
        if (adjust_1.length) {
            (0, util_1.each)(chart.geometries, function (g) {
                g.adjust(adjust_1);
            });
        }
    }
    if ((0, option_1.isColumn)(geometryOption)) {
        (0, adaptor_1.adaptor)((0, utils_1.deepAssign)({}, params, {
            options: tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, (0, utils_1.pick)(options, FIELD_KEY)), geometryOption), { widthRatio: geometryOption.columnWidthRatio, interval: tslib_1.__assign(tslib_1.__assign({}, (0, utils_1.pick)(geometryOption, ['color'])), { style: geometryOption.columnStyle }) }),
        }));
    }
    return params;
}
exports.drawSingleGeometry = drawSingleGeometry;
//# sourceMappingURL=geometry.js.map