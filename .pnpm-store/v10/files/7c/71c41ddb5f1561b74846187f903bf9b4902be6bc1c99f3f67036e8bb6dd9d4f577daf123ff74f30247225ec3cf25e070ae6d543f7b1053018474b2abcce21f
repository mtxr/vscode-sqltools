/**
 * @fileoverview image
 * @author dengfuping_develop@163.com
 */

import { each, isString } from '@antv/util';
import { SVG_ATTR_MAP } from '../constant';
import ShapeBase from './base';

class Image extends ShapeBase {
  type: string = 'image';
  canFill: boolean = false;
  canStroke: boolean = false;

  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    return {
      ...attrs,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  createPath(context, targetAttrs) {
    const attrs = this.attr();
    const el = this.get('el');
    each(targetAttrs || attrs, (value, attr) => {
      if (attr === 'img') {
        this._setImage(attrs.img);
      } else if (SVG_ATTR_MAP[attr]) {
        el.setAttribute(SVG_ATTR_MAP[attr], value);
      }
    });
  }

  setAttr(name: string, value: any) {
    this.attrs[name] = value;
    if (name === 'img') {
      this._setImage(value);
    }
  }

  _setImage(img) {
    const attrs = this.attr();
    const el = this.get('el');
    if (isString(img)) {
      el.setAttribute('href', img);
    } else if (img instanceof (window as any).Image) {
      if (!attrs.width) {
        el.setAttribute('width', img.width);
        this.attr('width', img.width);
      }
      if (!attrs.height) {
        el.setAttribute('height', img.height);
        this.attr('height', img.height);
      }
      el.setAttribute('href', img.src);
    } else if (img instanceof HTMLElement && isString(img.nodeName) && img.nodeName.toUpperCase() === 'CANVAS') {
      // @ts-ignore
      el.setAttribute('href', img.toDataURL());
    } else if (img instanceof ImageData) {
      const canvas = document.createElement('canvas');
      canvas.setAttribute('width', `${img.width}`);
      canvas.setAttribute('height', `${img.height}`);
      canvas.getContext('2d').putImageData(img, 0, 0);
      if (!attrs.width) {
        el.setAttribute('width', `${img.width}`);
        this.attr('width', img.width);
      }
      if (!attrs.height) {
        el.setAttribute('height', `${img.height}`);
        this.attr('height', img.height);
      }
      el.setAttribute('href', canvas.toDataURL());
    }
  }
}

export default Image;
