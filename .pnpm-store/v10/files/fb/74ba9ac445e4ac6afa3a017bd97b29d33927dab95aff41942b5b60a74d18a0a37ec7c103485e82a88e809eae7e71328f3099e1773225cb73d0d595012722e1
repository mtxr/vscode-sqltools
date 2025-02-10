/**
 * @fileoverview 矩形
 * @author dxq613@gmail.com
 */

import ShapeBase from './base';
import { parseRadius } from '../util/parse';
import { inBox } from '../util/util';
import inRect from '../util/in-stroke/rect';
import inRectWithRadius from '../util/in-stroke/rect-radius';
import isPointInPath from '../util/in-path/point-in-path';

class Rect extends ShapeBase {
  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    return {
      ...attrs,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      radius: 0,
    };
  }

  isInStrokeOrPath(x, y, isStroke, isFill, lineWidth) {
    const attrs = this.attr();
    const minX = attrs.x;
    const minY = attrs.y;
    const width = attrs.width;
    const height = attrs.height;
    const radius = attrs.radius;
    // 无圆角时的策略
    if (!radius) {
      const halfWidth = lineWidth / 2;
      // 同时填充和带有边框
      if (isFill && isStroke) {
        return inBox(minX - halfWidth, minY - halfWidth, width + halfWidth, height + halfWidth, x, y);
      }
      // 仅填充
      if (isFill) {
        return inBox(minX, minY, width, height, x, y);
      }
      if (isStroke) {
        return inRect(minX, minY, width, height, lineWidth, x, y);
      }
    } else {
      let isHit = false;
      if (isStroke) {
        isHit = inRectWithRadius(minX, minY, width, height, radius, lineWidth, x, y);
      }
      // 仅填充时带有圆角的矩形直接通过图形拾取
      // 以后可以改成纯数学的近似拾取，将圆弧切割成多边形
      if (!isHit && isFill) {
        isHit = isPointInPath(this, x, y);
      }
      return isHit;
    }
  }

  createPath(context) {
    const attrs = this.attr();
    const x = attrs.x;
    const y = attrs.y;
    const width = attrs.width;
    const height = attrs.height;
    const radius = attrs.radius;

    context.beginPath();
    if (radius === 0) {
      // 改成原生的rect方法
      context.rect(x, y, width, height);
    } else {
      const [r1, r2, r3, r4] = parseRadius(radius);
      context.moveTo(x + r1, y);
      context.lineTo(x + width - r2, y);
      r2 !== 0 && context.arc(x + width - r2, y + r2, r2, -Math.PI / 2, 0);
      context.lineTo(x + width, y + height - r3);
      r3 !== 0 && context.arc(x + width - r3, y + height - r3, r3, 0, Math.PI / 2);
      context.lineTo(x + r4, y + height);
      r4 !== 0 && context.arc(x + r4, y + height - r4, r4, Math.PI / 2, Math.PI);
      context.lineTo(x, y + r1);
      r1 !== 0 && context.arc(x + r1, y + r1, r1, Math.PI, Math.PI * 1.5);
      context.closePath();
    }
  }
}

export default Rect;
