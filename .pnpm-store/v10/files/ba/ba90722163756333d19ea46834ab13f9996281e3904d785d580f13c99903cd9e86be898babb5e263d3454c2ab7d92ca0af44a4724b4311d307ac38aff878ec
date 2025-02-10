/**
 * @fileoverview text
 * @author dengfuping_develop@163.com
 */

import { each } from '@antv/util';
import { detect } from 'detect-browser';
import { setTransform } from '../util/svg';
import { SVG_ATTR_MAP } from '../constant';
import ShapeBase from './base';

const LETTER_SPACING = 0.3;

const BASELINE_MAP = {
  top: 'before-edge',
  middle: 'central',
  bottom: 'after-edge',
  alphabetic: 'baseline',
  hanging: 'hanging',
};

// for FireFox
const BASELINE_MAP_FOR_FIREFOX = {
  top: 'text-before-edge',
  middle: 'central',
  bottom: 'text-after-edge',
  alphabetic: 'alphabetic',
  hanging: 'hanging',
};

const ANCHOR_MAP = {
  left: 'left',
  start: 'left',
  center: 'middle',
  right: 'end',
  end: 'end',
};

class Text extends ShapeBase {
  type: string = 'text';
  canFill: boolean = true;
  canStroke: boolean = true;

  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    return {
      ...attrs,
      x: 0,
      y: 0,
      text: null,
      fontSize: 12,
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontVariant: 'normal',
      textAlign: 'start',
      textBaseline: 'bottom',
    };
  }

  createPath(context, targetAttrs) {
    const attrs = this.attr();
    const el = this.get('el');
    this._setFont();
    each(targetAttrs || attrs, (value, attr) => {
      if (attr === 'text') {
        this._setText(`${value}`);
      } else if (attr === 'matrix' && value) {
        setTransform(this);
      } else if (SVG_ATTR_MAP[attr]) {
        el.setAttribute(SVG_ATTR_MAP[attr], value);
      }
    });
    el.setAttribute('paint-order', 'stroke');
    el.setAttribute('style', 'stroke-linecap:butt; stroke-linejoin:miter;');
  }

  _setFont() {
    const el = this.get('el');
    const { textBaseline, textAlign } = this.attr();

    const browser = detect();
    if (browser && browser.name === 'firefox') {
      // compatible with FireFox browser, ref: https://github.com/antvis/g/issues/119
      el.setAttribute('dominant-baseline', BASELINE_MAP_FOR_FIREFOX[textBaseline] || 'alphabetic');
    } else {
      el.setAttribute('alignment-baseline', BASELINE_MAP[textBaseline] || 'baseline');
    }

    el.setAttribute('text-anchor', ANCHOR_MAP[textAlign] || 'left');
  }

  _setText(text) {
    const el = this.get('el');
    const { x, textBaseline: baseline = 'bottom' } = this.attr();
    if (!text) {
      el.innerHTML = '';
    } else if (~text.indexOf('\n')) {
      const textArr = text.split('\n');
      const textLen = textArr.length - 1;
      let arr = '';
      each(textArr, (segment, i: number) => {
        if (i === 0) {
          if (baseline === 'alphabetic') {
            arr += `<tspan x="${x}" dy="${-textLen}em">${segment}</tspan>`;
          } else if (baseline === 'top') {
            arr += `<tspan x="${x}" dy="0.9em">${segment}</tspan>`;
          } else if (baseline === 'middle') {
            arr += `<tspan x="${x}" dy="${-(textLen - 1) / 2}em">${segment}</tspan>`;
          } else if (baseline === 'bottom') {
            arr += `<tspan x="${x}" dy="-${textLen + LETTER_SPACING}em">${segment}</tspan>`;
          } else if (baseline === 'hanging') {
            arr += `<tspan x="${x}" dy="${-(textLen - 1) - LETTER_SPACING}em">${segment}</tspan>`;
          }
        } else {
          arr += `<tspan x="${x}" dy="1em">${segment}</tspan>`;
        }
      });
      el.innerHTML = arr;
    } else {
      el.innerHTML = text;
    }
  }
}

export default Text;
