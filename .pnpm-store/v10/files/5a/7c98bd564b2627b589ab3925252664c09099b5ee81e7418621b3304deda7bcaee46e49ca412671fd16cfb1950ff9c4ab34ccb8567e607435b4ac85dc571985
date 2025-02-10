import { AbstractGroup } from '@antv/g-base';
import { ChangeType } from '@antv/g-base';
import * as Shape from './shape';
import Defs from './defs';
declare class Group extends AbstractGroup {
    isEntityGroup(): boolean;
    createDom(): SVGElement;
    afterAttrsChange(targetAttrs: any): void;
    /**
     * 一些方法调用会引起画布变化
     * @param {ChangeType} changeType 改变的类型
     */
    onCanvasChange(changeType: ChangeType): void;
    getShapeBase(): typeof Shape;
    getGroupBase(): typeof Group;
    draw(context: Defs): void;
    /**
     * 绘制分组的路径
     * @param {Defs} context 上下文
     * @param {ShapeAttrs} targetAttrs 渲染的目标属性
     */
    createPath(context: Defs, targetAttrs?: any): void;
}
export default Group;
