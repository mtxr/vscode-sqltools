import { Tag, Word } from '../../plots/word-cloud/types';
type FontWeight = number | 'normal' | 'bold' | 'bolder' | 'lighter';
export interface Options {
    size: [number, number];
    font?: string | ((row: Word, index?: number, words?: Word[]) => string);
    fontSize?: number | ((row: Word, index?: number, words?: Word[]) => number);
    fontWeight?: FontWeight | ((row: Word, index?: number, words?: Word[]) => FontWeight);
    rotate?: number | ((row: Word, index?: number, words?: Word[]) => number);
    padding?: number | ((row: Word, index?: number, words?: Word[]) => number);
    spiral?: 'archimedean' | 'rectangular' | ((size: [number, number]) => (t: number) => number[]);
    random?: number | (() => number);
    timeInterval?: number;
    imageMask?: HTMLImageElement;
}
/**
 * 根据对应的数据对象，计算每个
 * 词语在画布中的渲染位置，并返回
 * 计算后的数据对象
 * @param words
 * @param options
 */
export declare function wordCloud(words: Word[], options?: Partial<Options>): Tag[];
/**
 * 抛出没有混入默认配置的方法，用于测试。
 * @param words
 * @param options
 */
export declare function transform(words: Word[], options: Options): any[];
export declare function functor(d: any): any;
export {};
