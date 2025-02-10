/**
 * @fileoverview line
 * @author dengfuping_develop@163.com
 */
import { Line as LineUtil } from '@antv/g-math';
import { each, isObject } from '@antv/util';
import { SVG_ATTR_MAP } from '../constant';
import ShapeBase from './base';

class Line extends ShapeBase {
  type: string = 'line';
  canFill: boolean = false;
  canStroke: boolean = true;

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

  createPath(context, targetAttrs) {
    const attrs = this.attr();
    const el = this.get('el');
    each(targetAttrs || attrs, (value, attr) => {
      if (attr === 'startArrow' || attr === 'endArrow') {
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

  /**
   * Use math calculation to get length of line
   * @return {number} length
   */
  getTotalLength() {
    const { x1, y1, x2, y2 } = this.attr();
    return LineUtil.length(x1, y1, x2, y2);
  }

  /**
   * Use math calculation to get point according to ratio as same sa Canvas version
   * @param {number} ratio
   * @return {Point} point
   */
  getPoint(ratio: number) {
    const { x1, y1, x2, y2 } = this.attr();
    return LineUtil.pointAt(x1, y1, x2, y2, ratio);
  }
}

export default Line;
