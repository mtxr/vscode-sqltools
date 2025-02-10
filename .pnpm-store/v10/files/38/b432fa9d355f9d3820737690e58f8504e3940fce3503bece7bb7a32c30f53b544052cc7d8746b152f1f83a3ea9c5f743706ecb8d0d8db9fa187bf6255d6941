import { Params } from '../../core/adaptor';
import { DualAxesOptions } from './types';
/**
 * transformOptions，双轴图整体的取参逻辑如下
 * 1. get index getOptions: 对应的是默认的图表参数，如 appendPadding，syncView 等
 * 2. get adpator transformOption: 对应的是双轴图的默认参数，deepAssign 优先级从低到高如下
 *    2.1 defaultoption，如 tooltip，legend
 *    2.2 用户填写 options
 *    2.3 根据用户填写的 options 补充的数组型 options，如 yaxis，GeometryOption，因为 deepAssign 无法 assign 数组
 *
 * @param params
 */
export declare function transformOptions(params: Params<DualAxesOptions>): Params<DualAxesOptions>;
export declare function color(params: Params<DualAxesOptions>): Params<DualAxesOptions>;
/**
 * meta 配置
 * @param params
 */
export declare function meta(params: Params<DualAxesOptions>): Params<DualAxesOptions>;
/**
 * axis 配置
 * @param params
 */
export declare function axis(params: Params<DualAxesOptions>): Params<DualAxesOptions>;
/**
 * tooltip 配置
 * @param params
 */
export declare function tooltip(params: Params<DualAxesOptions>): Params<DualAxesOptions>;
/**
 * interaction 配置
 * @param params
 */
export declare function interaction(params: Params<DualAxesOptions>): Params<DualAxesOptions>;
/**
 * annotation 配置
 * @param params
 */
export declare function annotation(params: Params<DualAxesOptions>): Params<DualAxesOptions>;
export declare function theme(params: Params<DualAxesOptions>): Params<DualAxesOptions>;
export declare function animation(params: Params<DualAxesOptions>): Params<DualAxesOptions>;
/**
 * 双轴图 limitInPlot
 * @param params
 */
export declare function limitInPlot(params: Params<DualAxesOptions>): Params<DualAxesOptions>;
/**
 * legend 配置
 * 使用 custom，便于和类似于分组柱状图-单折线图的逻辑统一
 * @param params
 */
export declare function legend(params: Params<DualAxesOptions>): Params<DualAxesOptions>;
/**
 * 双轴图 slider 适配器
 * @param params
 */
export declare function slider(params: Params<DualAxesOptions>): Params<DualAxesOptions>;
/**
 * 双折线图适配器
 * @param chart
 * @param options
 */
export declare function adaptor(params: Params<DualAxesOptions>): Params<DualAxesOptions>;
