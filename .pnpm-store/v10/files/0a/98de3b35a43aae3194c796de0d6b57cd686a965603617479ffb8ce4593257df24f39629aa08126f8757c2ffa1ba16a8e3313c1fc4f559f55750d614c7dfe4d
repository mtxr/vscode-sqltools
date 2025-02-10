import { createDom, getOuterHeight, getOuterWidth, modifyCSS } from '@antv/dom-util';
import { isElement, isFunction, isNumber, isString } from '@antv/util';
import HtmlComponent from '../abstract/html-component';
import { ILocation } from '../interfaces';
import { HtmlAnnotationCfg, PointLocationCfg } from '../types';
import { clearDom } from '../util/util';

export default class HtmlAnnotation extends HtmlComponent<HtmlAnnotationCfg> implements ILocation<PointLocationCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'annotation',
      type: 'html',
      locationType: 'point',
      x: 0,
      y: 0,
      containerTpl: `<div class="g2-html-annotation" style="position:absolute"></div>`,
      alignX: 'left',
      alignY: 'top',
      html: '',
      zIndex: 7,
    };
  }

  public render() {
    const container = this.getContainer();
    const html = this.get('html');

    clearDom(container);

    const rst: HTMLElement | string = isFunction(html) ? html(container) : html;

    if (isElement(rst)) {
      container.appendChild(rst as HTMLElement);
    } else if (isString(rst) || isNumber(rst)) {
      const dom = createDom(`${rst}` as string);
      if (dom) {
        container.appendChild(dom);
      }
    }

    this.resetPosition();
  }

  protected resetPosition() {
    const container = this.getContainer();
    const { x, y } = this.getLocation();
    const alignX = this.get('alignX');
    const alignY = this.get('alignY');
    const offsetX = this.get('offsetX');
    const offsetY = this.get('offsetY');
    const domWidth = getOuterWidth(container);
    const domHeight = getOuterHeight(container);

    const position = {
      x, // alignX left
      y, // alignY top
    };

    if (alignX === 'middle') {
      position.x -= Math.round(domWidth / 2);
    } else if (alignX === 'right') {
      position.x -= Math.round(domWidth);
    }
    if (alignY === 'middle') {
      position.y -= Math.round(domHeight / 2);
    } else if (alignY === 'bottom') {
      position.y -= Math.round(domHeight);
    }
    if (offsetX) {
      position.x += offsetX;
    }
    if (offsetY) {
      position.y += offsetY;
    }

    modifyCSS(container, {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      zIndex: this.get('zIndex'),
    });
  }
}
