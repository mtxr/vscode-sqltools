import { AbstractShape } from '@antv/g-base';
import { ChangeType, BBox } from '@antv/g-base';
import { isNil, intersectRect } from '../util/util';
import { applyAttrsToContext, refreshElement } from '../util/draw';
import { getBBoxMethod } from '@antv/g-base';
import { Region } from '../types';
import * as Shape from './index';
import Group from '../group';

class ShapeBase extends AbstractShape {
  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    // 设置默认值
    return {
      ...attrs,
      lineWidth: 1,
      lineAppendWidth: 0,
      strokeOpacity: 1,
      fillOpacity: 1,
    };
  }

  getShapeBase() {
    return Shape;
  }

  getGroupBase() {
    return Group;
  }

  /**
   * 一些方法调用会引起画布变化
   * @param {ChangeType} changeType 改变的类型
   */
  onCanvasChange(changeType: ChangeType) {
    refreshElement(this, changeType);
  }

  calculateBBox(): BBox {
    const type = this.get('type');
    const lineWidth = this.getHitLineWidth();
    // const attrs = this.attr();
    const bboxMethod = getBBoxMethod(type);
    const box = bboxMethod(this);
    const halfLineWidth = lineWidth / 2;
    const minX = box.x - halfLineWidth;
    const minY = box.y - halfLineWidth;
    const maxX = box.x + box.width + halfLineWidth;
    const maxY = box.y + box.height + halfLineWidth;
    return {
      x: minX,
      minX,
      y: minY,
      minY,
      width: box.width + lineWidth,
      height: box.height + lineWidth,
      maxX,
      maxY,
    };
  }

  isFill() {
    return !!this.attrs['fill'] || this.isClipShape();
  }

  isStroke() {
    return !!this.attrs['stroke'];
  }

  // 同 shape 中的方法重复了
  _applyClip(context, clip: ShapeBase) {
    if (clip) {
      context.save();
      // 将 clip 的属性挂载到 context 上
      applyAttrsToContext(context, clip);
      // 绘制 clip 路径
      clip.createPath(context);
      context.restore();
      // 裁剪
      context.clip();
      clip._afterDraw();
    }
  }

  // 绘制图形时需要考虑 region 限制
  draw(context: CanvasRenderingContext2D, region?: Region) {
    const clip = this.cfg.clipShape;
    // 如果指定了 region，同时不允许刷新时，直接返回
    if (region) {
      if (this.cfg.refresh === false) {
        // this._afterDraw();
        this.set('hasChanged', false);
        return;
      }
      // 是否相交需要考虑 clip 的包围盒
      const bbox = this.getCanvasBBox();
      if (!intersectRect(region, bbox)) {
        // 图形的包围盒与重绘区域不相交时，也需要清除标记
        this.set('hasChanged', false);
        // 存在多种情形需要更新 cacheCanvasBBox 和 isInview 的判定
        // 1. 之前图形在视窗内，但是现在不再视窗内
        // 2. 如果当前的图形以及父元素都没有发生过变化，refresh = false 不会走到这里，所以这里的图形都是父元素发生变化，但是没有在视图内的元素
        if (this.cfg.isInView) {
          this._afterDraw();
        }
        return;
      }
    }
    context.save();
    // 先将 attrs 应用到上下文中，再设置 clip。因为 clip 应该被当前元素的 matrix 所影响
    applyAttrsToContext(context, this);
    this._applyClip(context, clip as ShapeBase);
    this.drawPath(context);
    context.restore();
    this._afterDraw();
  }

  private getCanvasViewBox() {
    const canvas = this.cfg.canvas;
    if (canvas) {
      // @ts-ignore
      return canvas.getViewRange();
    }
    return null;
  }

  cacheCanvasBBox() {
    const canvasBBox = this.getCanvasViewBox();
    // 绘制的时候缓存包围盒
    if (canvasBBox) {
      const bbox = this.getCanvasBBox();
      const isInView = intersectRect(bbox, canvasBBox);
      this.set('isInView', isInView);
      // 不再视窗内 cacheCanvasBBox 设置成 null，会提升局部渲染的性能，
      // 因为在局部渲染影响的包围盒计算时不考虑这个图形的包围盒
      // 父元素 cacheCanvasBBox 计算的时候也不计算
      if (isInView) {
        this.set('cacheCanvasBBox', bbox);
      } else {
        this.set('cacheCanvasBBox', null);
      }
    }
  }

  _afterDraw() {
    this.cacheCanvasBBox();
    // 绘制后消除标记
    this.set('hasChanged', false);
    this.set('refresh', null);
  }

  skipDraw() {
    this.set('cacheCanvasBBox', null);
    this.set('isInView', null);
    this.set('hasChanged', false);
  }

  /**
   * 绘制图形的路径
   * @param {CanvasRenderingContext2D} context 上下文
   */
  drawPath(context: CanvasRenderingContext2D) {
    this.createPath(context);
    this.strokeAndFill(context);
    this.afterDrawPath(context);
  }

  /**
   * @protected
   * 填充图形
   * @param {CanvasRenderingContext2D} context context 上下文
   */
  fill(context: CanvasRenderingContext2D) {
    context.fill();
  }

  /**
   * @protected
   * 绘制图形边框
   * @param {CanvasRenderingContext2D} context context 上下文
   */
  stroke(context: CanvasRenderingContext2D) {
    context.stroke();
  }

  // 绘制或者填充
  strokeAndFill(context) {
    const { lineWidth, opacity, strokeOpacity, fillOpacity } = this.attrs;

    if (this.isFill()) {
      if (!isNil(fillOpacity) && fillOpacity !== 1) {
        context.globalAlpha = fillOpacity;
        this.fill(context);
        context.globalAlpha = opacity;
      } else {
        this.fill(context);
      }
    }

    if (this.isStroke()) {
      if (lineWidth > 0) {
        if (!isNil(strokeOpacity) && strokeOpacity !== 1) {
          context.globalAlpha = strokeOpacity;
        }
        this.stroke(context);
      }
    }
    this.afterDrawPath(context);
  }

  /**
   * @protected
   * 绘制图形的路径
   * @param {CanvasRenderingContext2D} context 上下文
   */
  createPath(context: CanvasRenderingContext2D) {}

  /**
   * 绘制完成 path 后的操作
   * @param {CanvasRenderingContext2D} context 上下文
   */
  afterDrawPath(context: CanvasRenderingContext2D) {}

  isInShape(refX: number, refY: number): boolean {
    // return HitUtil.isHitShape(this, refX, refY);
    const isStroke = this.isStroke();
    const isFill = this.isFill();
    const lineWidth = this.getHitLineWidth();
    return this.isInStrokeOrPath(refX, refY, isStroke, isFill, lineWidth);
  }

  // 之所以不拆成 isInStroke 和 isInPath 在于两者存在一些共同的计算
  isInStrokeOrPath(x, y, isStroke, isFill, lineWidth) {
    return false;
  }

  /**
   * 获取线拾取的宽度
   * @returns {number} 线的拾取宽度
   */
  getHitLineWidth() {
    if (!this.isStroke()) {
      return 0;
    }
    const attrs = this.attrs;
    return attrs['lineWidth'] + attrs['lineAppendWidth'];
  }
}

export default ShapeBase;
