/**
 * @fileoverview dom
 * @author dengfuping_develop@163.com
 */

import { each } from '@antv/util';
import { SVG_ATTR_MAP } from '../constant';
import ShapeBase from './base';

class Dom extends ShapeBase {
  type: string = 'dom';
  canFill: boolean = false;
  canStroke: boolean = false;

  createPath(context, targetAttrs) {
    const attrs = this.attr();
    const el = this.get('el');
    each(targetAttrs || attrs, (value, attr) => {
      if (SVG_ATTR_MAP[attr]) {
        el.setAttribute(SVG_ATTR_MAP[attr], value);
      }
    });
    if (typeof attrs['html'] === 'function') {
      const element = attrs['html'].call(this, attrs);
      if (element instanceof Element || element instanceof HTMLDocument) {
        const children = el.childNodes;
        for (let i = children.length - 1; i >= 0; i--) {
          el.removeChild(children[i]);
        }
        el.appendChild(element); // append to el if it's an element
      } else {
        el.innerHTML = element; // set innerHTML
      }
    } else {
      el.innerHTML = attrs['html']; // set innerHTML
    }
  }
}

export default Dom;
