import { Params } from '../../core/adaptor';
import { ColorAttr, Datum, Options, RawFields, ShapeAttr, SizeAttr, StyleAttr, TooltipAttr } from '../../types';
import { Label } from '../../types/label';
import { State } from '../../types/state';
/**
 * 图形映射属性，按照优先级来的
 */
export type MappingOptions = {
    /** color 映射 */
    readonly color?: ColorAttr;
    /** shape 映射 */
    readonly shape?: ShapeAttr;
    /** 大小映射, 提供回调的方式 */
    readonly size?: SizeAttr;
    /** 样式映射 */
    readonly style?: StyleAttr;
    /** tooltip 映射 */
    readonly tooltip?: TooltipAttr;
};
/**
 * 一个图形映射的逻辑，纯粹的图形语法
 * // TODO 后续需要处理 adjust 的配置，然后通过 field 信息。比如 styleField，labelField 等一定是一个数组形式
 */
export type Geometry = {
    /** geometry 类型, 'line' | 'interval' | 'point' | 'area' | 'polygon' */
    readonly type?: string;
    /** x 轴字段 */
    readonly xField?: string;
    /** y 轴字段 */
    readonly yField?: string;
    /** 分组字段 */
    readonly colorField?: string;
    /** shape 的映射字段 */
    readonly shapeField?: string;
    /** size 映射字段 */
    readonly sizeField?: string;
    /** style 的映射字段 */
    readonly styleField?: string;
    /** tooltip 的映射字段 */
    readonly tooltipFields?: string[] | false;
    /** 其他原始字段, 用于 mapping 回调参数 */
    readonly rawFields?: RawFields;
    /** 图形映射规则 */
    readonly mapping?: MappingOptions;
    /** label 映射通道，因为历史原因导致实现略有区别 */
    readonly label?: Label;
    /** 不同状态的样式 */
    readonly state?: State;
    /** 自定义信息，一般在 registerShape 中使用 */
    readonly customInfo?: any;
    /** geometry params */
    readonly args?: any;
};
/**
 * geometry options
 */
export type GeometryOptions = Geometry & Partial<Options>;
/**
 * 获得映射的字段列表
 * @param options
 * @param field
 */
export declare function getMappingField(o: GeometryOptions, field: 'color' | 'shape' | 'size' | 'style'): {
    mappingFields: string[];
    tileMappingField: string;
};
/**
 * 获得映射函数
 * @param mappingFields
 * @param func
 */
export declare function getMappingFunction(mappingFields: string[], func: (datum: Datum) => any): (...args: any[]) => any;
/**
 * 通用 geometry 的配置处理的 adaptor
 * @param params
 */
export declare function geometry<O extends GeometryOptions>(params: Params<O>): Params<O>;
