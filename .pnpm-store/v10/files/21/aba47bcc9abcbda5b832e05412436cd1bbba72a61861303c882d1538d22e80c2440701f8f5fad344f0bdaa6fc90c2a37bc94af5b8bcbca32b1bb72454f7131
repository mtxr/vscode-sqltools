import { Params } from '../core/adaptor';
import { Options } from '../types';
/**
 * 使用 Pattern 通道的 options，要求有 colorField/seriesField/stackField 作为分类字段（进行颜色映射）
 */
type OptionsRequiredInPattern = Omit<Options, 'data'>;
/**
 * Pattern 通道，处理图案填充
 * 🚀 目前支持图表类型：饼图、柱状图、条形图、玉珏图等（不支持在多 view 图表中，后续按需扩展）
 *
 * @param key key of style property
 * @returns
 */
export declare function pattern(key: string): <O extends OptionsRequiredInPattern = OptionsRequiredInPattern>(params: Params<O>) => Params<O>;
export {};
