"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYAxisWithDefault = exports.transformObjectToArray = exports.getGeometryOption = exports.isColumn = exports.isLine = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var utils_1 = require("../../../utils");
var constant_1 = require("../constant");
var types_1 = require("../types");
/**
 * 根据 GeometryOption 判断 geometry 是否为 line
 */
function isLine(geometryOption) {
    return (0, util_1.get)(geometryOption, 'geometry') === types_1.DualAxesGeometry.Line;
}
exports.isLine = isLine;
/**
 * 根据 GeometryOption 判断 geometry 是否为 Column
 */
function isColumn(geometryOption) {
    return (0, util_1.get)(geometryOption, 'geometry') === types_1.DualAxesGeometry.Column;
}
exports.isColumn = isColumn;
/**
 * 获取 GeometryOption
 * @param geometryOption
 * @param axis
 */
function getGeometryOption(xField, yField, geometryOption) {
    // 空默认为线
    return isColumn(geometryOption)
        ? (0, utils_1.deepAssign)({}, {
            geometry: types_1.DualAxesGeometry.Column,
            label: geometryOption.label && geometryOption.isRange
                ? {
                    content: function (item) {
                        var _a;
                        return (_a = item[yField]) === null || _a === void 0 ? void 0 : _a.join('-');
                    },
                }
                : undefined,
        }, geometryOption)
        : tslib_1.__assign({ geometry: types_1.DualAxesGeometry.Line }, geometryOption);
}
exports.getGeometryOption = getGeometryOption;
/**
 * 兼容一些属性 为 arr 和 obj 的两种情况， 如 yAxis，annotations
 * 为了防止左右 yField 相同，导致变成 object 之后被覆盖，所以都转变成数组的形式
 * @param yField
 * @param transformAttribute
 */
function transformObjectToArray(yField, transformAttribute) {
    var y1 = yField[0], y2 = yField[1];
    if ((0, util_1.isArray)(transformAttribute)) {
        // 将数组补齐为两个
        var a1_1 = transformAttribute[0], a2_1 = transformAttribute[1];
        return [a1_1, a2_1];
    }
    var a1 = (0, util_1.get)(transformAttribute, y1);
    var a2 = (0, util_1.get)(transformAttribute, y2);
    return [a1, a2];
}
exports.transformObjectToArray = transformObjectToArray;
/**
 * 获取默认值
 * @param yAxis
 * @param axisType
 */
function getYAxisWithDefault(yAxis, axisType) {
    if (axisType === types_1.AxisType.Left) {
        return yAxis === false ? false : (0, utils_1.deepAssign)({}, constant_1.DEFAULT_LEFT_YAXIS_CONFIG, yAxis);
    }
    else if (axisType === types_1.AxisType.Right) {
        return yAxis === false ? false : (0, utils_1.deepAssign)({}, constant_1.DEFAULT_RIGHT_YAXIS_CONFIG, yAxis);
    }
    return yAxis;
}
exports.getYAxisWithDefault = getYAxisWithDefault;
//# sourceMappingURL=option.js.map