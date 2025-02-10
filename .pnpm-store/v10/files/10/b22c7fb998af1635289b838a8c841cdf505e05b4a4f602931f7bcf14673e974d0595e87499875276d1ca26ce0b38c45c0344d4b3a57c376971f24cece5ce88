import { VennData, VennOptions } from './types';
type ColorMapFunction = (colorPalette: string[], data: VennData, blendMode: VennOptions['blendMode'], setsField: VennOptions['setsField']) => Map<string, string>;
/**
 * 获取 颜色映射
 * @usage colorMap.get(id) => color
 *
 * @returns Map<string, string>
 */
export declare const getColorMap: ColorMapFunction;
/**
 * 给韦恩图数据进行布局
 *
 * @param data
 * @param width
 * @param height
 * @param padding
 * @returns 韦恩图数据
 */
export declare function layoutVennData(options: VennOptions, width: number, height: number, padding?: number): VennData;
/**
 * 检查是否存在 非法元素
 * @param legalArr 合法集合：['A', 'B']
 * @param testArr 检查集合：['A', 'B', 'C'] or ['A', 'C']（存在非法 'C'）
 * @return boolean
 */
export declare function islegalSets(legalArr: any[], testArr: any[]): boolean;
export {};
