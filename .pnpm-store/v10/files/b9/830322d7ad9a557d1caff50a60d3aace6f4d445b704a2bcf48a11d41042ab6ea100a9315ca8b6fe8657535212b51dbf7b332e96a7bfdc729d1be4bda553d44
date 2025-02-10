/**
 * @fileoverview rect
 * @author dengfuping_develop@163.com
 */

import { each, isArray } from '@antv/util';
import ShapeBase from './base';
import { SVG_ATTR_MAP } from '../constant';
import { parseRadius } from '../util/format';

class Rect extends ShapeBase {
  type: string = 'rect';
  canFill: boolean = true;
  canStroke: boolean = true;

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

  createPath(context, targetAttrs) {
    const attrs = this.attr();
    const el = this.get('el');
    // 加上状态量，用来标记 path 是否已组装
    let completed = false;
    // 和组装 path 相关的绘图属性
    const pathRelatedAttrs = ['x', 'y', 'width', 'height', 'radius'];
    each(targetAttrs || attrs, (value, attr) => {
      if (pathRelatedAttrs.indexOf(attr) !== -1 && !completed) {
        el.setAttribute('d', this._assembleRect(attrs));
        completed = true;
      } else if (pathRelatedAttrs.indexOf(attr) === -1 && SVG_ATTR_MAP[attr]) {
        el.setAttribute(SVG_ATTR_MAP[attr], value);
      }
    });
  }

  _assembleRect(attrs) {
    const x = attrs.x;
    const y = attrs.y;
    const w = attrs.width;
    const h = attrs.height;
    const radius = attrs.radius;

    if (!radius) {
      return `M ${x},${y} l ${w},0 l 0,${h} l${-w} 0 z`;
    }
    const r = parseRadius(radius);
    if (isArray(radius)) {
      if (radius.length === 1) {
        r.r1 = r.r2 = r.r3 = r.r4 = radius[0];
      } else if (radius.length === 2) {
        r.r1 = r.r3 = radius[0];
        r.r2 = r.r4 = radius[1];
      } else if (radius.length === 3) {
        r.r1 = radius[0];
        r.r2 = r.r4 = radius[1];
        r.r3 = radius[2];
      } else {
        r.r1 = radius[0];
        r.r2 = radius[1];
        r.r3 = radius[2];
        r.r4 = radius[3];
      }
    } else {
      r.r1 = r.r2 = r.r3 = r.r4 = radius;
    }
    const d = [
      [`M ${x + r.r1},${y}`],
      [`l ${w - r.r1 - r.r2},0`],
      [`a ${r.r2},${r.r2},0,0,1,${r.r2},${r.r2}`],
      [`l 0,${h - r.r2 - r.r3}`],
      [`a ${r.r3},${r.r3},0,0,1,${-r.r3},${r.r3}`],
      [`l ${r.r3 + r.r4 - w},0`],
      [`a ${r.r4},${r.r4},0,0,1,${-r.r4},${-r.r4}`],
      [`l 0,${r.r4 + r.r1 - h}`],
      [`a ${r.r1},${r.r1},0,0,1,${r.r1},${-r.r1}`],
      ['z'],
    ];
    return d.join(' ');
  }
}

export default Rect;
