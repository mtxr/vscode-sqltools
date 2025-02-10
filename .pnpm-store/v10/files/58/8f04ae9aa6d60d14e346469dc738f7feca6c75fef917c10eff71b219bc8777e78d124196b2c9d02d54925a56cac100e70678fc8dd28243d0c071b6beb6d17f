import { IElement as IBaseElement } from '@antv/g-base';
import { Region } from './types';
export * from '@antv/g-base';
export interface IElement extends IBaseElement {
    /**
     * 绘制图形元素
     * @param {CanvasRenderingContext2D} context 上下文
     * @param {Region}                   [region]  限制的区间，可以为空
     */
    draw(context: CanvasRenderingContext2D, region?: Region): any;
    /**
     * 跳过绘制时需要处理的逻辑
     */
    skipDraw(): any;
}
