import { AbstractShape } from '@antv/g-base';
import { ShapeAttrs, ChangeType, BBox } from '@antv/g-base';
import { IShape } from '../interfaces';
import Defs from '../defs';
import * as Shape from './index';
import Group from '../group';
declare class ShapeBase extends AbstractShape implements IShape {
    type: string;
    canFill: boolean;
    canStroke: boolean;
    getDefaultAttrs(): {
        lineWidth: number;
        lineAppendWidth: number;
        strokeOpacity: number;
        fillOpacity: number;
        matrix: any;
        opacity: number;
    };
    afterAttrsChange(targetAttrs: ShapeAttrs): void;
    getShapeBase(): typeof Shape;
    getGroupBase(): typeof Group;
    /**
     * 一些方法调用会引起画布变化
     * @param {ChangeType} changeType 改变的类型
     */
    onCanvasChange(changeType: ChangeType): void;
    calculateBBox(): BBox;
    isFill(): boolean;
    isStroke(): boolean;
    draw(context: any, targetAttrs: any): void;
    /**
     * @protected
     * 绘制图形的路径
     * @param {Defs} context 上下文
     * @param {ShapeAttrs} targetAttrs 渲染的目标属性
     */
    createPath(context: Defs, targetAttrs?: ShapeAttrs): void;
    strokeAndFill(context: any, targetAttrs?: any): void;
    _setColor(context: any, attr: any, value: any): void;
    shadow(context: any, targetAttrs?: any): void;
    transform(targetAttrs?: any): void;
    isInShape(refX: number, refY: number): boolean;
    isPointInPath(refX: number, refY: number): boolean;
    /**
     * 获取线拾取的宽度
     * @returns {number} 线的拾取宽度
     */
    getHitLineWidth(): any;
}
export default ShapeBase;
