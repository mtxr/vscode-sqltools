/**
 * @fileoverview circle
 * @author dengfuping_develop@163.com
 */

import { each } from '@antv/util';
import { SVG_ATTR_MAP } from '../constant';
import ShapeBase from './base';

class Circle extends ShapeBase {
  type: string = 'circle';
  canFill: boolean = true;
  canStroke: boolean = true;

  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    return {
      ...attrs,
      x: 0,
      y: 0,
      r: 0,
    };
  }

  createPath(context, targetAttrs) {
    const attrs = this.attr();
    const el = this.get('el');
    each(targetAttrs || attrs, (value, attr) => {
      // 圆和椭圆的点坐标属性不是 x, y，而是 cx, cy
      if (attr === 'x' || attr === 'y') {
        el.setAttribute(`c${attr}`, value);
      } else if (SVG_ATTR_MAP[attr]) {
        el.setAttribute(SVG_ATTR_MAP[attr], value);
      }
    });
  }
}

export default Circle;
