import { IShape } from '../interfaces';
import { ShapeCfg, ShapeAttrs, BBox } from '../types';
import Element from './element';
declare abstract class AbstractShape extends Element implements IShape {
    constructor(cfg: ShapeCfg);
    _isInBBox(refX: any, refY: any): boolean;
    /**
     * 属性更改后需要做的事情
     * @protected
     * @param {ShapeAttrs} targetAttrs 渲染的图像属性
     */
    afterAttrsChange(targetAttrs: ShapeAttrs): void;
    getBBox(): BBox;
    getCanvasBBox(): BBox;
    /**
     * 计算包围盒的抽象方法
     * @return {BBox} 包围盒
     */
    abstract calculateBBox(): BBox;
    applyMatrix(matrix: number[]): void;
    /**
     * 计算相对于画布的包围盒，默认等同于 bbox
     * @return {BBox} 包围盒
     */
    calculateCanvasBBox(): {
        x: number;
        y: number;
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
        width: number;
        height: number;
    };
    /**
     * @protected
     * 清理缓存的 bbox
     */
    clearCacheBBox(): void;
    isClipShape(): any;
    /**
     * @protected
     * 不同的图形自己实现是否在图形内部的逻辑，要判断边和填充区域
     * @param  {number}  refX 相对于图形的坐标 x
     * @param  {number}  refY 相对于图形的坐标 Y
     * @return {boolean} 点是否在图形内部
     */
    isInShape(refX: number, refY: number): boolean;
    /**
     * 是否仅仅使用 BBox 检测就可以判定拾取到图形
     * 默认是 false，但是有些图形例如 image、marker 等都可直接使用 BBox 的检测而不需要使用图形拾取
     * @return {Boolean} 仅仅使用 BBox 进行拾取
     */
    isOnlyHitBox(): boolean;
    isHit(x: number, y: number): boolean;
}
export default AbstractShape;
