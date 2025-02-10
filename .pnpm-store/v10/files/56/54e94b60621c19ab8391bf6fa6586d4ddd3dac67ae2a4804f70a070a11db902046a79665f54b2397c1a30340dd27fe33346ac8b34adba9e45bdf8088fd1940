import { AbstractShape } from '@antv/g-base';
import { ChangeType, BBox } from '@antv/g-base';
import { Region } from '../types';
import * as Shape from './index';
import Group from '../group';
declare class ShapeBase extends AbstractShape {
    getDefaultAttrs(): {
        lineWidth: number;
        lineAppendWidth: number;
        strokeOpacity: number;
        fillOpacity: number;
        matrix: any;
        opacity: number;
    };
    getShapeBase(): typeof Shape;
    getGroupBase(): typeof Group;
    /**
     * 一些方法调用会引起画布变化
     * @param {ChangeType} changeType 改变的类型
     */
    onCanvasChange(changeType: ChangeType): void;
    calculateBBox(): BBox;
    isFill(): any;
    isStroke(): boolean;
    _applyClip(context: any, clip: ShapeBase): void;
    draw(context: CanvasRenderingContext2D, region?: Region): void;
    private getCanvasViewBox;
    cacheCanvasBBox(): void;
    _afterDraw(): void;
    skipDraw(): void;
    /**
     * 绘制图形的路径
     * @param {CanvasRenderingContext2D} context 上下文
     */
    drawPath(context: CanvasRenderingContext2D): void;
    /**
     * @protected
     * 填充图形
     * @param {CanvasRenderingContext2D} context context 上下文
     */
    fill(context: CanvasRenderingContext2D): void;
    /**
     * @protected
     * 绘制图形边框
     * @param {CanvasRenderingContext2D} context context 上下文
     */
    stroke(context: CanvasRenderingContext2D): void;
    strokeAndFill(context: any): void;
    /**
     * @protected
     * 绘制图形的路径
     * @param {CanvasRenderingContext2D} context 上下文
     */
    createPath(context: CanvasRenderingContext2D): void;
    /**
     * 绘制完成 path 后的操作
     * @param {CanvasRenderingContext2D} context 上下文
     */
    afterDrawPath(context: CanvasRenderingContext2D): void;
    isInShape(refX: number, refY: number): boolean;
    isInStrokeOrPath(x: any, y: any, isStroke: any, isFill: any, lineWidth: any): boolean;
    /**
     * 获取线拾取的宽度
     * @returns {number} 线的拾取宽度
     */
    getHitLineWidth(): any;
}
export default ShapeBase;
