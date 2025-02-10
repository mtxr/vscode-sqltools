import { Types } from '@antv/g2';
import { Params } from '../../core/adaptor';
import { Datum } from '../../types';
import { Tag, Word, WordCloudOptions, WordStyle } from './types';
/**
 * 用 DataSet 转换词云图数据
 * @param params
 */
export declare function transform(params: Params<WordCloudOptions>): Tag[];
/**
 * 获取最终的实际绘图尺寸：[width, height]
 * @param chart
 */
export declare function getSize(options: {
    width: number;
    height: number;
    padding: Types.ViewPadding;
    appendPadding: Types.ViewAppendPadding;
    autoFit: boolean;
    container: HTMLElement;
}): [number, number];
/**
 * 处理 imageMask 可能为 url 字符串的情况
 * @param  {HTMLImageElement | string} img
 * @return {Promise}
 */
export declare function processImageMask(img: HTMLImageElement | string): Promise<HTMLImageElement>;
/**
 * 把用户提供的 fontSize 值转换成符合 DataSet 要求的值
 * @param options
 * @param range
 */
export declare function getFontSizeMapping(fontSize: WordStyle['fontSize'], range?: [number, number]): (word: Word, index?: number, words?: Word[]) => number;
export declare function getSingleKeyValues(data: Datum[], key: string): any[];
