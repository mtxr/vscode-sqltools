/**
 * @fileoverview 多边形
 * @author dxq613@gmail.com
 */
import { Point } from '@antv/g-base';
import { Line as LineUtil } from '@antv/g-math';
import { Polyline as PolylineUtil } from '@antv/g-math';
import { each, isNil } from '@antv/util';
import ShapeBase from './base';
import inPolyline from '../util/in-stroke/polyline';
import * as ArrowUtil from '../util/arrow';

class PolyLine extends ShapeBase {
  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    return {
      ...attrs,
      startArrow: false,
      endArrow: false,
    };
  }

  initAttrs(attrs) {
    this.setArrow();
  }

  // 更新属性时，检测是否更改了 points
  onAttrChange(name: string, value: any, originValue: any) {
    super.onAttrChange(name, value, originValue);
    this.setArrow();
    if (['points'].indexOf(name) !== -1) {
      this._resetCache();
    }
  }

  _resetCache() {
    this.set('totalLength', null);
    this.set('tCache', null);
  }

  setArrow() {
    const attrs = this.attr();
    const { points, startArrow, endArrow } = this.attrs;
    const length = points.length;
    const x1 = points[0][0];
    const y1 = points[0][1];
    const x2 = points[length - 1][0];
    const y2 = points[length - 1][1];

    if (startArrow) {
      ArrowUtil.addStartArrow(this, attrs, points[1][0], points[1][1], x1, y1);
    }
    if (endArrow) {
      ArrowUtil.addEndArrow(this, attrs, points[length - 2][0], points[length - 2][1], x2, y2);
    }
  }

  // 不允许 fill
  isFill() {
    return false;
  }

  isInStrokeOrPath(x, y, isStroke, isFill, lineWidth) {
    // 没有设置 stroke 不能被拾取, 没有线宽不能被拾取
    if (!isStroke || !lineWidth) {
      return false;
    }
    const { points } = this.attr();
    return inPolyline(points, lineWidth, x, y, false);
  }

  // 始终填充
  isStroke() {
    return true;
  }

  createPath(context) {
    const { points, startArrow, endArrow } = this.attr();
    const length = points.length;
    if (points.length < 2) {
      return;
    }
    let x1 = points[0][0];
    let y1 = points[0][1];
    let x2 = points[length - 1][0];
    let y2 = points[length - 1][1];
    // 如果定义了箭头，并且是自定义箭头，线条相应缩进
    if (startArrow && startArrow.d) {
      const distance = ArrowUtil.getShortenOffset(x1, y1, points[1][0], points[1][1], startArrow.d);
      x1 += distance.dx;
      y1 += distance.dy;
    }
    if (endArrow && endArrow.d) {
      const distance = ArrowUtil.getShortenOffset(points[length - 2][0], points[length - 2][1], x2, y2, endArrow.d);
      x2 -= distance.dx;
      y2 -= distance.dy;
    }

    context.beginPath();
    context.moveTo(x1, y1);
    for (let i = 0; i < length - 1; i++) {
      const point = points[i];
      context.lineTo(point[0], point[1]);
    }
    context.lineTo(x2, y2);
  }

  afterDrawPath(context: CanvasRenderingContext2D) {
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
   * Get length of polyline
   * @return {number} length
   */
  getTotalLength() {
    const { points } = this.attr();
    // get totalLength from cache
    const totalLength = this.get('totalLength');
    if (!isNil(totalLength)) {
      return totalLength;
    }
    this.set('totalLength', PolylineUtil.length(points));
    return this.get('totalLength');
  }

  /**
   * Get point according to ratio
   * @param {number} ratio
   * @return {Point} point
   */
  getPoint(ratio: number): Point {
    const { points } = this.attr();
    // get tCache from cache
    let tCache = this.get('tCache');
    if (!tCache) {
      this._setTcache();
      tCache = this.get('tCache');
    }

    let subt;
    let index;
    each(tCache, (v, i) => {
      if (ratio >= v[0] && ratio <= v[1]) {
        subt = (ratio - v[0]) / (v[1] - v[0]);
        index = i;
      }
    });
    return LineUtil.pointAt(points[index][0], points[index][1], points[index + 1][0], points[index + 1][1], subt);
  }

  _setTcache() {
    const { points } = this.attr();
    if (!points || points.length === 0) {
      return;
    }

    const totalLength = this.getTotalLength();
    if (totalLength <= 0) {
      return;
    }

    let tempLength = 0;
    const tCache = [];
    let segmentT;
    let segmentL;

    each(points, (p, i) => {
      if (points[i + 1]) {
        segmentT = [];
        segmentT[0] = tempLength / totalLength;
        segmentL = LineUtil.length(p[0], p[1], points[i + 1][0], points[i + 1][1]);
        tempLength += segmentL;
        segmentT[1] = tempLength / totalLength;
        tCache.push(segmentT);
      }
    });
    this.set('tCache', tCache);
  }

  /**
   * Get start tangent vector
   * @return {Array}
   */
  getStartTangent(): number[][] {
    const { points } = this.attr();
    const result = [];
    result.push([points[1][0], points[1][1]]);
    result.push([points[0][0], points[0][1]]);
    return result;
  }

  /**
   * Get end tangent vector
   * @return {Array}
   */
  getEndTangent(): number[][] {
    const { points } = this.attr();
    const l = points.length - 1;
    const result = [];
    result.push([points[l - 1][0], points[l - 1][1]]);
    result.push([points[l][0], points[l][1]]);
    return result;
  }
}

export default PolyLine;
