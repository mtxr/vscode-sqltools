import { AbstractCanvas } from '@antv/g-base';
import { ChangeType } from '@antv/g-base';
import { IElement } from './interfaces';
import * as Shape from './shape';
import Group from './group';
declare class Canvas extends AbstractCanvas {
    getDefaultCfg(): {
        visible: boolean;
        capture: boolean;
        zIndex: number;
    };
    /**
     * 一些方法调用会引起画布变化
     * @param {ChangeType} changeType 改变的类型
     */
    onCanvasChange(changeType: ChangeType): void;
    getShapeBase(): typeof Shape;
    getGroupBase(): typeof Group;
    /**
     * 获取屏幕像素比
     */
    getPixelRatio(): number;
    getViewRange(): {
        minX: number;
        minY: number;
        maxX: any;
        maxY: any;
    };
    createDom(): HTMLElement;
    setDOMSize(width: number, height: number): void;
    clear(): void;
    getShape(x: number, y: number): any;
    _getRefreshRegion(): any;
    /**
     * 刷新图形元素，这里仅仅是放入队列，下次绘制时进行绘制
     * @param {IElement} element 图形元素
     */
    refreshElement(element: IElement): void;
    _clearFrame(): void;
    draw(): void;
    _drawAll(): void;
    _drawRegion(): void;
    _startDraw(): void;
    skipDraw(): void;
    removeDom(): void;
}
export default Canvas;
