import { ViolinOptions } from './types';
export type ViolinData = {
    /** X轴 */
    x: string;
    /** 小提琴轮廓的 size 通道数据 */
    violinSize: number[];
    /** 小提琴轮廓的 y 通道数据 */
    violinY: number[];
    /** 最大值 */
    high: number;
    /** 最小值 */
    low: number;
    /** 上四分位数 */
    q1: number;
    /** 下四分位数 */
    q3: number;
    /** 箱线图中的中位值 */
    median: number[];
    /** 箱线图中的上线边缘线 */
    minMax: number[];
    /** 箱线图中的上下四分位点 */
    quantile: number[];
};
export type PdfOptions = {
    min: number;
    max: number;
    size: number;
    width: number;
};
export declare const toBoxValue: (values: number[]) => {
    low: number;
    high: number;
    q1: number;
    q3: number;
    median: number[];
    minMax: number[];
    quantile: number[];
};
export declare const toViolinValue: (values: number[], pdfOptions: PdfOptions) => {
    violinSize: number[];
    violinY: number[];
};
export declare const transformViolinData: (options: ViolinOptions) => ViolinData[];
