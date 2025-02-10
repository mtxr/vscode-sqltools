/**
 * @fileoverview path
 * @author dengfuping_develop@163.com
 */
import { Point } from '@antv/g-base';
import { each, isArray, isObject } from '@antv/util';
import { SVG_ATTR_MAP } from '../constant';
import ShapeBase from './base';

class Path extends ShapeBase {
  type: string = 'path';
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

  createPath(context, targetAttrs) {
    const attrs = this.attr();
    const el = this.get('el');
    each(targetAttrs || attrs, (value, attr) => {
      if (attr === 'path' && isArray(value)) {
        el.setAttribute('d', this._formatPath(value));
      } else if (attr === 'startArrow' || attr === 'endArrow') {
        if (value) {
          const id = isObject(value)
            ? context.addArrow(attrs, SVG_ATTR_MAP[attr])
            : context.getDefaultArrow(attrs, SVG_ATTR_MAP[attr]);
          el.setAttribute(SVG_ATTR_MAP[attr], `url(#${id})`);
        } else {
          el.removeAttribute(SVG_ATTR_MAP[attr]);
        }
      } else if (SVG_ATTR_MAP[attr]) {
        el.setAttribute(SVG_ATTR_MAP[attr], value);
      }
    });
  }

  _formatPath(value) {
    const newValue = value
      .map((path) => {
        return path.join(' ');
      })
      .join('');
    if (~newValue.indexOf('NaN')) {
      return '';
    }
    return newValue;
  }

  /**
   * Get total length of path
   * 尽管通过浏览器的 SVGPathElement.getTotalLength() 接口获取的 path 长度，
   * 与 Canvas 版本通过数学计算的方式得到的长度有一些细微差异，但最大误差在个位数像素，精度上可以能接受
   * @return {number} length
   */
  getTotalLength() {
    const el = this.get('el');
    return el ? el.getTotalLength() : null;
  }

  /**
   * Get point according to ratio
   * @param {number} ratio
   * @return {Point} point
   */
  getPoint(ratio: number): Point {
    const el = this.get('el');
    const totalLength = this.getTotalLength();
    // @see https://github.com/antvis/g/issues/634
    if (totalLength === 0) {
      return null;
    }
    const point = el ? el.getPointAtLength(ratio * totalLength) : null;
    return point
      ? {
          x: point.x,
          y: point.y,
        }
      : null;
  }
}

export default Path;
