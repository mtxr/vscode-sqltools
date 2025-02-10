/**
 * @fileoverview polyline
 * @author dengfuping_develop@163.com
 */
import { Point } from '@antv/g-base';
import { Polyline as PolylineUtil } from '@antv/g-math';
import { Line as LineUtil } from '@antv/g-math';
import { each, isArray, isNil } from '@antv/util';
import { SVG_ATTR_MAP } from '../constant';
import ShapeBase from './base';

class Polyline extends ShapeBase {
  type: string = 'polyline';
  canFill: boolean = true;
  canStroke: boolean = true;

  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    return {
      ...attrs,
      startArrow: false,
      endArrow: false,
    };
  }

  // 更新属性时，检测是否更改了 points
  onAttrChange(name: string, value: any, originValue: any) {
    super.onAttrChange(name, value, originValue);
    if (['points'].indexOf(name) !== -1) {
      this._resetCache();
    }
  }

  _resetCache() {
    this.set('totalLength', null);
    this.set('tCache', null);
  }

  createPath(context, targetAttrs) {
    const attrs = this.attr();
    const el = this.get('el');
    each(targetAttrs || attrs, (value, attr) => {
      if (attr === 'points' && isArray(value) && value.length >= 2) {
        el.setAttribute('points', value.map((point) => `${point[0]},${point[1]}`).join(' '));
      } else if (SVG_ATTR_MAP[attr]) {
        el.setAttribute(SVG_ATTR_MAP[attr], value);
      }
    });
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

export default Polyline;
