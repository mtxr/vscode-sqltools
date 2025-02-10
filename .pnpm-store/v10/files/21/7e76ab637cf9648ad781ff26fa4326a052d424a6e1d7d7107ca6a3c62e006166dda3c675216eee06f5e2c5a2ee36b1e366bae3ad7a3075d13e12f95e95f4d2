import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { BBox, LegendBaseCfg, Point, PointLocationCfg } from '../types';
import { createBBox, formatPadding } from '../util/util';

abstract class LegendBase<T extends LegendBaseCfg = LegendBaseCfg> extends GroupComponent
  implements ILocation<PointLocationCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'legend',
      /**
       * 布局方式： horizontal，vertical
       * @type {String}
       */
      layout: 'horizontal',
      locationType: 'point',
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
      title: null,
      background: null,
    };
  }

  public getLayoutBBox(): BBox {
    const bbox = super.getLayoutBBox();
    const maxWidth = this.get('maxWidth');
    const maxHeight = this.get('maxHeight');

    let { width, height } = bbox;
    if (maxWidth) {
      width = Math.min(width, maxWidth);
    }
    if (maxHeight) {
      height = Math.min(height, maxHeight);
    }
    
    return createBBox(bbox.minX, bbox.minY, width, height);
  }

  public setLocation(cfg: PointLocationCfg) {
    this.set('x', cfg.x);
    this.set('y', cfg.y);
    this.resetLocation();
  }

  protected resetLocation() {
    const x = this.get('x');
    const y = this.get('y');
    const offsetX = this.get('offsetX');
    const offsetY = this.get('offsetY');
    this.moveElementTo(this.get('group'), {
      x: x + offsetX,
      y: y + offsetY,
    });
  }

  protected applyOffset() {
    this.resetLocation();
  }

  // 获取当前绘制的点
  protected getDrawPoint(): Point {
    return this.get('currentPoint');
  }

  protected setDrawPoint(point: Point) {
    return this.set('currentPoint', point);
  }
  // 复写父类定义的绘制方法
  protected renderInner(group: IGroup) {
    this.resetDraw();
    if (this.get('title')) {
      this.drawTitle(group);
    }
    this.drawLegendContent(group);
    if (this.get('background')) {
      this.drawBackground(group);
    }
    // this.resetLocation(); // 在顶层已经在处理偏移时一起处理了
  }

  protected abstract drawLegendContent(group);

  // 绘制背景
  protected drawBackground(group: IGroup) {
    const background = this.get('background');
    const bbox = group.getBBox();
    const padding = formatPadding(background.padding);
    const attrs = {
      // 背景从 (0,0) 开始绘制
      x: 0,
      y: 0,
      width: bbox.width + padding[1] + padding[3],
      height: bbox.height + padding[0] + padding[2],
      ...background.style,
    };
    const backgroundShape = this.addShape(group, {
      type: 'rect',
      id: this.getElementId('background'),
      name: 'legend-background',
      attrs,
    });
    backgroundShape.toBack();
  }

  // 绘制标题，标题在图例项的上面
  protected drawTitle(group: IGroup) {
    const currentPoint = this.get('currentPoint');
    const titleCfg = this.get('title');
    const { spacing, style, text } = titleCfg;
    const shape = this.addShape(group, {
      type: 'text',
      id: this.getElementId('title'),
      name: 'legend-title',
      attrs: {
        text,
        x: currentPoint.x,
        y: currentPoint.y,
        ...style,
      },
    });
    const bbox = shape.getBBox();
    // 标题单独在一行
    this.set('currentPoint', { x: currentPoint.x, y: bbox.maxY + spacing });
  }

  // 重置绘制时开始的位置，如果绘制边框，考虑边框的 padding
  private resetDraw() {
    const background = this.get('background');
    const currentPoint = { x: 0, y: 0 };
    if (background) {
      const padding = formatPadding(background.padding);
      currentPoint.x = padding[3]; // 左边 padding
      currentPoint.y = padding[0]; // 上面 padding
    }
    this.set('currentPoint', currentPoint); // 设置绘制的初始位置
  }
}

export default LegendBase;
