import { AbstractGroup } from '@antv/g-base';
import { ChangeType } from '@antv/g-base';
import { Region } from './types';
import ShapeBase from './shape/base';
import * as Shape from './shape';
declare class Group extends AbstractGroup {
    /**
     * 一些方法调用会引起画布变化
     * @param {ChangeType} changeType 改变的类型
     */
    onCanvasChange(changeType: ChangeType): void;
    getShapeBase(): typeof Shape;
    getGroupBase(): typeof Group;
    _applyClip(context: any, clip: ShapeBase): void;
    private cacheCanvasBBox;
    draw(context: CanvasRenderingContext2D, region?: Region): void;
    skipDraw(): void;
}
export default Group;
