/**
 * @fileoverview polygon
 * @author dengfuping_develop@163.com
 */
import { each, isArray } from '@antv/util';
import { SVG_ATTR_MAP } from '../constant';
import ShapeBase from './base';

class Polygon extends ShapeBase {
  type: string = 'polygon';
  canFill: boolean = true;
  canStroke: boolean = true;

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
}

export default Polygon;
