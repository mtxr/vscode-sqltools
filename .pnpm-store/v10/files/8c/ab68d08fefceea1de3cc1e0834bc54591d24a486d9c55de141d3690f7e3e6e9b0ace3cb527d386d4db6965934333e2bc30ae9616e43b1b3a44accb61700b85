/**
 * @fileoverview 圆
 * @author dxq613@gmail.com
 */

import ShapeBase from './base';
import { distance } from '../util/util';

class Circle extends ShapeBase {
  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    return {
      ...attrs,
      x: 0,
      y: 0,
      r: 0,
    };
  }

  isInStrokeOrPath(x, y, isStroke, isFill, lineWidth) {
    const attrs = this.attr();
    const cx = attrs.x;
    const cy = attrs.y;
    const r = attrs.r;
    const halfLineWidth = lineWidth / 2;
    const absDistance = distance(cx, cy, x, y);
    // 直接用距离，如果同时存在边和填充时，可以减少两次计算
    if (isFill && isStroke) {
      return absDistance <= r + halfLineWidth;
    }
    if (isFill) {
      return absDistance <= r;
    }
    if (isStroke) {
      return absDistance >= r - halfLineWidth && absDistance <= r + halfLineWidth;
    }
    return false;
  }

  createPath(context) {
    const attrs = this.attr();
    const cx = attrs.x;
    const cy = attrs.y;
    const r = attrs.r;
    context.beginPath();
    context.arc(cx, cy, r, 0, Math.PI * 2, false);
    context.closePath();
  }
}

export default Circle;
