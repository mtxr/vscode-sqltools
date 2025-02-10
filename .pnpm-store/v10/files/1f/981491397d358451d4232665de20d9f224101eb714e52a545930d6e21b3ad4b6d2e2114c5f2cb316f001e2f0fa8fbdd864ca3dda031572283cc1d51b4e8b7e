import { AbstractCanvas, IShape } from '@antv/g-base';
import { ChangeType } from '@antv/g-base';
import * as Shape from './shape';
import Group from './group';
declare class Canvas extends AbstractCanvas {
    constructor(cfg: any);
    getShapeBase(): typeof Shape;
    getGroupBase(): typeof Group;
    getShape(x: number, y: number, ev: Event): IShape;
    createDom(): SVGSVGElement;
    /**
     * 一些方法调用会引起画布变化
     * @param {ChangeType} changeType 改变的类型
     */
    onCanvasChange(changeType: ChangeType): void;
    draw(): void;
}
export default Canvas;
