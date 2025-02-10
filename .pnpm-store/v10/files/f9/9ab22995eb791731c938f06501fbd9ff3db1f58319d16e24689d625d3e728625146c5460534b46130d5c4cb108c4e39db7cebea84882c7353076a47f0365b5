/**
 * @fileoverview 线
 * @author dxq613@gmail.com
 */
import { Line as LineUtil } from '@antv/g-math';
import ShapeBase from './base';
import inLine from '../util/in-stroke/line';
import * as ArrowUtil from '../util/arrow';

class Line extends ShapeBase {
  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    return {
      ...attrs,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      startArrow: false,
      endArrow: false,
    };
  }

  initAttrs(attrs) {
    this.setArrow();
  }

  // 更新属性时，检测是否更改了箭头
  onAttrChange(name: string, value: any, originValue: any) {
    super.onAttrChange(name, value, originValue);
    // 由于箭头的绘制依赖于 line 的诸多 attrs，因此这里不再对每个 attr 进行判断，attr 每次变化都会影响箭头的更新
    this.setArrow();
  }

  setArrow() {
    const attrs = this.attr();
    const { x1, y1, x2, y2, startArrow, endArrow } = attrs;
    if (startArrow) {
      ArrowUtil.addStartArrow(this, attrs, x2, y2, x1, y1);
    }
    if (endArrow) {
      ArrowUtil.addEndArrow(this, attrs, x1, y1, x2, y2);
    }
  }

  isInStrokeOrPath(x, y, isStroke, isFill, lineWidth) {
    if (!isStroke || !lineWidth) {
      return false;
    }
    const { x1, y1, x2, y2 } = this.attr();
    return inLine(x1, y1, x2, y2, lineWidth, x, y);
  }

  createPath(context) {
    const attrs = this.attr();
    const { x1, y1, x2, y2, startArrow, endArrow } = attrs;
    let startArrowDistance = {
      dx: 0,
      dy: 0,
    };
    let endArrowDistance = {
      dx: 0,
      dy: 0,
    };

    if (startArrow && startArrow.d) {
      startArrowDistance = ArrowUtil.getShortenOffset(x1, y1, x2, y2, attrs.startArrow.d);
    }
    if (endArrow && endArrow.d) {
      endArrowDistance = ArrowUtil.getShortenOffset(x1, y1, x2, y2, attrs.endArrow.d);
    }

    context.beginPath();
    // 如果自定义箭头，线条相应缩进
    context.moveTo(x1 + startArrowDistance.dx, y1 + startArrowDistance.dy);
    context.lineTo(x2 - endArrowDistance.dx, y2 - endArrowDistance.dy);
  }

  afterDrawPath(context) {
    const startArrowShape = this.get('startArrowShape');
    const endArrowShape = this.get('endArrowShape');
    if (startArrowShape) {
      startArrowShape.draw(context);
    }
    if (endArrowShape) {
      endArrowShape.draw(context);
    }
  }

  /**
   * Get length of line
   * @return {number} length
   */
  getTotalLength() {
    const { x1, y1, x2, y2 } = this.attr();
    return LineUtil.length(x1, y1, x2, y2);
  }

  /**
   * Get point according to ratio
   * @param {number} ratio
   * @return {Point} point
   */
  getPoint(ratio: number) {
    const { x1, y1, x2, y2 } = this.attr();
    return LineUtil.pointAt(x1, y1, x2, y2, ratio);
  }
}

export default Line;
