import { Scale, Coordinate } from '../dependents';
import { LooseObject, ScaleOption, ViewCfg } from '../interface';
/**
 * using the scale type if user specified, otherwise infer the type
 */
export declare function inferScaleType(scale: Scale, scaleDef: ScaleOption, attrType: string, geometryType: string): string;
/**
 * @ignore
 * 为指定的 `field` 字段数据创建 scale
 * @param field 字段名
 * @param [data] 数据集，可为空
 * @param [scaleDef] 列定义，可为空
 * @returns scale 返回创建的 Scale 实例
 */
export declare function createScaleByField(field: string | number, data?: LooseObject[] | [], scaleDef?: ScaleOption): Scale;
/**
 * @ignore
 * 同步 scale
 * @todo 是否可以通过 scale.update() 方法进行更新
 * @param scale 需要同步的 scale 实例
 * @param newScale 同步源 Scale
 */
export declare function syncScale(scale: Scale, newScale: Scale): void;
/**
 * @ignore
 * get the scale name, if alias exist, return alias, or else field
 * @param scale
 * @returns the name of field
 */
export declare function getName(scale: Scale): string;
/**
 * 根据 scale values 和 coordinate 获取分类默认 range
 * @param scale 需要获取的 scale 实例
 * @param coordinate coordinate 实例
 * @param theme theme
 */
export declare function getDefaultCategoryScaleRange(scale: Scale, coordinate: Coordinate, theme: ViewCfg['theme']): Scale['range'];
/**
 * @function y轴scale的max
 * @param {yScale}
 */
export declare function getMaxScale(scale: Scale): number;
