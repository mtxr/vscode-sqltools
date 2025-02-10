import { __assign } from "tslib";
import { get, isArray } from '@antv/util';
import { deepAssign } from '../../../utils';
import { DEFAULT_LEFT_YAXIS_CONFIG, DEFAULT_RIGHT_YAXIS_CONFIG } from '../constant';
import { AxisType, DualAxesGeometry, } from '../types';
/**
 * 根据 GeometryOption 判断 geometry 是否为 line
 */
export function isLine(geometryOption) {
    return get(geometryOption, 'geometry') === DualAxesGeometry.Line;
}
/**
 * 根据 GeometryOption 判断 geometry 是否为 Column
 */
export function isColumn(geometryOption) {
    return get(geometryOption, 'geometry') === DualAxesGeometry.Column;
}
/**
 * 获取 GeometryOption
 * @param geometryOption
 * @param axis
 */
export function getGeometryOption(xField, yField, geometryOption) {
    // 空默认为线
    return isColumn(geometryOption)
        ? deepAssign({}, {
            geometry: DualAxesGeometry.Column,
            label: geometryOption.label && geometryOption.isRange
                ? {
                    content: function (item) {
                        var _a;
                        return (_a = item[yField]) === null || _a === void 0 ? void 0 : _a.join('-');
                    },
                }
                : undefined,
        }, geometryOption)
        : __assign({ geometry: DualAxesGeometry.Line }, geometryOption);
}
/**
 * 兼容一些属性 为 arr 和 obj 的两种情况， 如 yAxis，annotations
 * 为了防止左右 yField 相同，导致变成 object 之后被覆盖，所以都转变成数组的形式
 * @param yField
 * @param transformAttribute
 */
export function transformObjectToArray(yField, transformAttribute) {
    var y1 = yField[0], y2 = yField[1];
    if (isArray(transformAttribute)) {
        // 将数组补齐为两个
        var a1_1 = transformAttribute[0], a2_1 = transformAttribute[1];
        return [a1_1, a2_1];
    }
    var a1 = get(transformAttribute, y1);
    var a2 = get(transformAttribute, y2);
    return [a1, a2];
}
/**
 * 获取默认值
 * @param yAxis
 * @param axisType
 */
export function getYAxisWithDefault(yAxis, axisType) {
    if (axisType === AxisType.Left) {
        return yAxis === false ? false : deepAssign({}, DEFAULT_LEFT_YAXIS_CONFIG, yAxis);
    }
    else if (axisType === AxisType.Right) {
        return yAxis === false ? false : deepAssign({}, DEFAULT_RIGHT_YAXIS_CONFIG, yAxis);
    }
    return yAxis;
}
//# sourceMappingURL=option.js.map