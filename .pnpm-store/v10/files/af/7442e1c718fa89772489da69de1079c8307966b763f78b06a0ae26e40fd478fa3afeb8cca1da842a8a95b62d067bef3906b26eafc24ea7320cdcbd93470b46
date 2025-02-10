import { Axis } from '../../../types/axis';
import { AxisType, DualAxesOptions, GeometryColumnOption, GeometryLineOption, GeometryOption } from '../types';
/**
 * 根据 GeometryOption 判断 geometry 是否为 line
 */
export declare function isLine(geometryOption: GeometryOption): geometryOption is GeometryLineOption;
/**
 * 根据 GeometryOption 判断 geometry 是否为 Column
 */
export declare function isColumn(geometryOption: GeometryOption): geometryOption is GeometryColumnOption;
/**
 * 获取 GeometryOption
 * @param geometryOption
 * @param axis
 */
export declare function getGeometryOption(xField: string, yField: string, geometryOption: GeometryOption): GeometryOption;
/**
 * 兼容一些属性 为 arr 和 obj 的两种情况， 如 yAxis，annotations
 * 为了防止左右 yField 相同，导致变成 object 之后被覆盖，所以都转变成数组的形式
 * @param yField
 * @param transformAttribute
 */
export declare function transformObjectToArray(yField: DualAxesOptions['yField'], transformAttribute: Record<string, any> | any[]): any[];
/**
 * 获取默认值
 * @param yAxis
 * @param axisType
 */
export declare function getYAxisWithDefault(yAxis: Axis, axisType: AxisType): Axis;
