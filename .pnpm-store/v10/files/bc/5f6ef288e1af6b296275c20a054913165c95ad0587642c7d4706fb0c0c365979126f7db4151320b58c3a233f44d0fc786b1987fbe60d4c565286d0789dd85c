/**
 * @fileoverview 椭圆
 * @author dxq613@gmail.com
 */

import ShapeBase from './base';

// 根据椭圆公式计算 x*x/rx*rx + y*y/ry*ry;
function ellipseDistance(squareX, squareY, rx, ry) {
  return squareX / (rx * rx) + squareY / (ry * ry);
}

class Ellipse extends ShapeBase {
  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    return {
      ...attrs,
      x: 0,
      y: 0,
      rx: 0,
      ry: 0,
    };
  }

  isInStrokeOrPath(x, y, isStroke, isFill, lineWidth) {
    const attrs = this.attr();
    const halfLineWith = lineWidth / 2;
    const cx = attrs.x;
    const cy = attrs.y;
    const { rx, ry } = attrs;
    const squareX = (x - cx) * (x - cx);
    const squareY = (y - cy) * (y - cy);
    // 使用椭圆的公式： x*x/rx*rx + y*y/ry*ry = 1;
    if (isFill && isStroke) {
      return ellipseDistance(squareX, squareY, rx + halfLineWith, ry + halfLineWith) <= 1;
    }
    if (isFill) {
      return ellipseDistance(squareX, squareY, rx, ry) <= 1;
    }
    if (isStroke) {
      return (
        ellipseDistance(squareX, squareY, rx - halfLineWith, ry - halfLineWith) >= 1 &&
        ellipseDistance(squareX, squareY, rx + halfLineWith, ry + halfLineWith) <= 1
      );
    }
    return false;
  }

  createPath(context) {
    const attrs = this.attr();
    const cx = attrs.x;
    const cy = attrs.y;
    const rx = attrs.rx;
    const ry = attrs.ry;
    context.beginPath();
    // 兼容逻辑
    if (context.ellipse) {
      context.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2, false);
    } else {
      // 如果不支持，则使用圆来绘制，进行变形
      const r = rx > ry ? rx : ry;
      const scaleX = rx > ry ? 1 : rx / ry;
      const scaleY = rx > ry ? ry / rx : 1;
      context.save();
      context.translate(cx, cy);
      context.scale(scaleX, scaleY);
      context.arc(0, 0, r, 0, Math.PI * 2);
      context.restore();
      context.closePath();
    }
  }
}

export default Ellipse;
