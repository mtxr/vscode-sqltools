/**
 * @fileoverview 多边形
 * @author dxq613@gmail.com
 */

import ShapeBase from './base';
import inPolyline from '../util/in-stroke/polyline';
import isInPolygon from '../util/in-path/polygon';

class Polygon extends ShapeBase {
  isInStrokeOrPath(x, y, isStroke, isFill, lineWidth) {
    const { points } = this.attr();
    let isHit = false;
    if (isStroke) {
      isHit = inPolyline(points, lineWidth, x, y, true);
    }
    if (!isHit && isFill) {
      isHit = isInPolygon(points, x, y); // isPointInPath(shape, x, y);
    }
    return isHit;
  }

  createPath(context) {
    const attrs = this.attr();
    const points = attrs.points;
    if (points.length < 2) {
      return;
    }
    context.beginPath();
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (i === 0) {
        context.moveTo(point[0], point[1]);
      } else {
        context.lineTo(point[0], point[1]);
      }
    }
    context.closePath();
  }
}

export default Polygon;
