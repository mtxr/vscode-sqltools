import { DIRECTION } from '../constant';
import { Padding, Point, Region } from '../interface';
import { BBox as BBoxObject } from '../dependents';
/**
 * 用于包围盒计算。
 */
export declare class BBox {
    /** x 轴坐标系 */
    x: number;
    /** y 轴坐标系 */
    y: number;
    /** 包围盒高度 */
    height: number;
    /** 包围盒宽度 */
    width: number;
    static fromRange(minX: number, minY: number, maxX: number, maxY: number): BBox;
    static fromObject(bbox: BBoxObject): BBox;
    constructor(x?: number, y?: number, width?: number, height?: number);
    get minX(): number;
    get maxX(): number;
    get minY(): number;
    get maxY(): number;
    get tl(): Point;
    get tr(): Point;
    get bl(): Point;
    get br(): Point;
    get top(): Point;
    get right(): Point;
    get bottom(): Point;
    get left(): Point;
    /**
     * 包围盒是否相等
     * @param {BBox} bbox 包围盒
     * @returns      包围盒是否相等
     */
    isEqual(bbox: BBox): boolean;
    /**
     * 是否包含了另一个包围盒
     * @param child
     */
    contains(child: BBox): boolean;
    /**
     * 克隆包围盒
     * @returns 包围盒
     */
    clone(): BBox;
    /**
     * 取并集
     * @param subBBox
     */
    add(...subBBox: BBox[]): BBox;
    /**
     * 取交集
     * @param subBBox
     */
    merge(...subBBox: BBox[]): BBox;
    /**
     * bbox 剪裁
     * @param subBBox
     * @param direction
     */
    cut(subBBox: BBox, direction: DIRECTION): BBox;
    /**
     * 收缩形成新的
     * @param gap
     */
    shrink(gap: Padding): BBox;
    /**
     * 扩张形成新的
     * @param gap
     */
    expand(gap: Padding): BBox;
    /**
     * get the gap of two bbox, if not exceed, then 0
     * @param bbox
     * @returns [top, right, bottom, left]
     */
    exceed(bbox: BBox): Padding;
    /**
     * 是否碰撞
     * @param bbox
     */
    collide(bbox: BBox): boolean;
    /**
     * 获取包围盒大小
     * @returns 包围盒大小
     */
    size(): number;
    /**
     * 点是否在 bbox 中
     * @param p
     */
    isPointIn(p: Point): boolean;
}
/**
 * 从一个 bbox 的 region 获取 bbox
 * @param bbox
 * @param region
 */
export declare const getRegionBBox: (bbox: BBox, region: Region) => BBox;
/**
 * 将 bbox 转换成 points
 * @param bbox
 */
export declare function toPoints(bbox: Partial<BBox>): any[];
