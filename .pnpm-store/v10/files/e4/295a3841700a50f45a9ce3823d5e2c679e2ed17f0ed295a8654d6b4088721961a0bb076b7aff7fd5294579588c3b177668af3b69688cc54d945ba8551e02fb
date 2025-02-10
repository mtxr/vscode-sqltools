import { Types } from '@antv/g2';
import { Params } from '../core/adaptor';
import { Options } from '../types';
import { Axis } from '../types/axis';
import { Transformations } from '../types/coordinate';
/**
 * 通用 legend 配置, 适用于带 colorField 或 seriesField 的图表
 * @param params
 */
export declare function legend<O extends Pick<Options, 'legend'> & {
    colorField?: string;
    seriesField?: string;
}>(params: Params<O>): Params<O>;
/**
 * 通用 tooltip 配置
 * @param params
 */
export declare function tooltip<O extends Pick<Options, 'tooltip'>>(params: Params<O>): Params<O>;
/**
 * Interaction 配置
 * @param params
 */
export declare function interaction<O extends Pick<Options, 'interactions'>>(params: Params<O>): Params<O>;
/**
 * 动画
 * @param params
 */
export declare function animation<O extends Pick<Options, 'animation'>>(params: Params<O>): Params<O>;
/**
 * 设置全局主题配置
 * @param params
 */
export declare function theme<O extends Pick<Options, 'theme'>>(params: Params<O>): Params<O>;
/**
 * 状态 state 配置
 * @param params
 */
export declare function state<O extends Options>(params: Params<O>): Params<O>;
/**
 * 处理缩略轴的 adaptor
 * @param params
 */
export declare function slider(params: Params<Options>): Params<Options>;
/**
 * 处理缩略轴的 adaptor
 * @param params
 */
export declare function scrollbar(params: Params<Options>): Params<Options>;
/**
 * scale 的 adaptor
 * @param axes
 */
export declare function scale(axes: Record<string, Axis>, meta?: Options['meta']): <O extends Pick<Options, "meta">>(params: Params<O>) => Params<O>;
/**
 * annotation 配置
 * @param params
 */
export declare function annotation(annotationOptions?: Options['annotations']): <O extends Pick<Options, "annotations">>(params: Params<O>) => Params<O>;
/**
 * 自动设置 limitInPlot
 * @param params
 */
export declare function limitInPlot(params: Params<Options>): Params<Options>;
/**
 * 坐标系转换
 */
export declare function transformations(coordinateType?: Types.CoordinateOption['type']): (params: Params<Options & {
    coordinate: Transformations;
}>) => Params<Options & {
    coordinate: Transformations;
}>;
export { pattern } from './pattern';
