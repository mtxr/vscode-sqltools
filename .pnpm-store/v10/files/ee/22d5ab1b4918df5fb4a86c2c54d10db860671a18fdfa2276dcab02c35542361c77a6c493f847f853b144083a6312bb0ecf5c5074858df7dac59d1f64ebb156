import { ShapeAttrs } from '@antv/g2';
import { Params } from '../core/adaptor';
import { Options } from '../types';
/** 转化率组件配置选项 */
export interface ConversionTagOptions {
    /** tag 高度 */
    size?: number;
    /** tag 对柱子间距 */
    spacing?: number;
    /** tag 距离轴线距离 */
    offset?: number;
    /** 箭头形状配置 */
    arrow?: {
        /** 箭头宽度 */
        headSize?: number;
        /** 箭头样式 */
        style?: ShapeAttrs;
    } | false;
    /** 文本配置 */
    text?: {
        /** 文字大小 */
        size?: number;
        /** 文字样式 */
        style?: ShapeAttrs;
        /** 文本格式化 */
        formatter?: (prev: number, next: number) => string;
    } | false;
}
export interface OptionWithConversionTag {
    conversionTag?: ConversionTagOptions | false;
}
/**
 * 返回支持转化率组件的 adaptor，适用于柱形图/条形图
 * @param field 用户转化率计算的字段
 * @param horizontal 是否水平方向的转化率
 * @param disabled 是否禁用
 */
export declare function conversionTag<O extends OptionWithConversionTag & Options>(field: string, horizontal?: boolean, disabled?: boolean): (params: Params<O>) => Params<O>;
