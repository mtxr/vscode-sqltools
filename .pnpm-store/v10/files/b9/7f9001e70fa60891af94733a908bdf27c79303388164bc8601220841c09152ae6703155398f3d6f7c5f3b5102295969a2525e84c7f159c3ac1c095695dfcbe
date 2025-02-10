import { DIRECTION } from '../../constant';
import { BBox } from '../../dependents';
import { Padding } from '../../interface';
export type PaddingCalCtor = {
    readonly instance: (top?: number, right?: number, bottom?: number, left?: number) => PaddingCal;
};
/** @ignore */
export declare class PaddingCal {
    private top;
    private right;
    private bottom;
    private left;
    /**
     * 使用静态方法创建一个
     * @param top
     * @param right
     * @param bottom
     * @param left
     */
    static instance(top?: number, right?: number, bottom?: number, left?: number): PaddingCal;
    /**
     * 初始的 padding 数据
     * @param top
     * @param right
     * @param bottom
     * @param left
     */
    constructor(top?: number, right?: number, bottom?: number, left?: number);
    /**
     * 取最大区间
     * @param padding
     */
    max(padding: Padding): PaddingCal;
    /**
     * 四周增加 padding
     * @param padding
     */
    shrink(padding: Padding): PaddingCal;
    /**
     * 在某一个方向增加 padding
     * @param bbox
     * @param direction
     */
    inc(bbox: BBox, direction: DIRECTION): PaddingCal;
    /**
     * 获得最终的 padding
     */
    getPadding(): Padding;
    /**
     * clone 一个 padding cal
     */
    clone(): PaddingCal;
}
