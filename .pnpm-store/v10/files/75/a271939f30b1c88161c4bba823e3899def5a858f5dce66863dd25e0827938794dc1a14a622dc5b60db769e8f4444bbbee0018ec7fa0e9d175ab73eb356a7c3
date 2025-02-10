import * as CSS from 'csstype';
type FontFace = CSS.Properties;
type Font = Pick<FontFace, 'fontFamily' | 'fontWeight' | 'fontStyle' | 'fontVariant'> & {
    fontSize?: number;
};
/**
 * 计算文本在画布中的宽度
 */
export declare const measureTextWidth: {
    (...args: any[]): any;
    cache: Map<any, any>;
};
/**
 * 获取文本的 ... 文本。
 * 算法（减少每次 measureText 的长度，measureText 的性能跟字符串时间相关）：
 * 1. 先通过 STEP 逐步计算，找到最后一个小于 maxWidth 的字符串
 * 2. 然后对最后这个字符串二分计算
 * @param text 需要计算的文本, 由于历史原因 除了支持string，还支持空值,number和数组等
 * @param maxWidth
 * @param font
 */
export declare const getEllipsisText: (text: any, maxWidth: number, font?: Font) => any;
export {};
