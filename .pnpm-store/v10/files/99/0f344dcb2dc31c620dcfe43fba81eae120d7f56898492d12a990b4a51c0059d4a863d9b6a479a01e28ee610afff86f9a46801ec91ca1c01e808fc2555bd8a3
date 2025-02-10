import { IElement as IBaseElement } from '@antv/g-base';
import { Region } from './types';

// 导出 g-base 中的 interfaces
export * from '@antv/g-base';

// 覆盖 g-base 中 IElement 的类型定义
export interface IElement extends IBaseElement {
  /**
   * 绘制图形元素
   * @param {CanvasRenderingContext2D} context 上下文
   * @param {Region}                   [region]  限制的区间，可以为空
   */
  draw(context: CanvasRenderingContext2D, region?: Region);

  /**
   * 跳过绘制时需要处理的逻辑
   */
  skipDraw();
}
