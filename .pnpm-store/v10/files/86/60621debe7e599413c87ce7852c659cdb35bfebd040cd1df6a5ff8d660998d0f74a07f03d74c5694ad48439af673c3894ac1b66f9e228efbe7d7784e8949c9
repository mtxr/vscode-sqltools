import { createDom, modifyCSS } from '@antv/dom-util';
import { substitute, hasKey } from '@antv/util';
import { toPx, getTextPoint } from '../util/util';
import HtmlComponent from '../abstract/html-component';
import * as CssConst from './css-const';
import HtmlTheme from './html-theme';
import {HtmlCrossHairCfg} from '../types';
class HtmlCrosshair<T extends HtmlCrossHairCfg = HtmlCrossHairCfg> extends HtmlComponent {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'crosshair',
      type: 'html',
      locationType: 'region',
      start: {x: 0, y: 0}, // 防止初始化报错
      end: {x: 0, y: 0}, // 防止初始化报错
      capture: false,
      text: null,
      containerTpl: `<div class="${CssConst.CONTAINER_CLASS}"></div>`,
      crosshairTpl: `<div class="${CssConst.CROSSHAIR_LINE}"></div>`,
      textTpl: `<span class="${CssConst.CROSSHAIR_TEXT}">{content}</span>`,
      domStyles: null,
      containerClassName: CssConst.CONTAINER_CLASS,
      defaultStyles: HtmlTheme,
      defaultCfg: {
        text: {
          position: 'start',
          content: null,
          align: 'center',
          offset: 10
        }
      },
    };
  }

  render() {
    this.resetText();
    this.resetPosition();
  }

  // 绘制 crosshair
  private initCrossHair() {
    const container = this.getContainer();
    const crosshairTpl = this.get('crosshairTpl');
    const crosshairEl = createDom(crosshairTpl);
    container.appendChild(crosshairEl);
    this.applyStyle(CssConst.CROSSHAIR_LINE, crosshairEl);
    this.set('crosshairEl', crosshairEl);
  }

  // 获取文本的位置
  private getTextPoint() {
    const { start, end } = this.getLocation();
    const { position, offset } = this.get('text');
    return getTextPoint(start, end, position, offset);
  }

  // 设置 text
  private resetText() {
    const text = this.get('text');
    let textEl = this.get('textEl') as HTMLElement;
    if (text) {
      const {content} = text;
      if (!textEl) {
        const container = this.getContainer();
        const textTpl = substitute(this.get('textTpl'), text);
        textEl = createDom(textTpl);
        container.appendChild(textEl);
        this.applyStyle(CssConst.CROSSHAIR_TEXT, textEl);
        this.set('textEl', textEl);
      }
      textEl.innerHTML = content;
    } else if (textEl) {
      textEl.remove();
    }
  }
  // 是否垂直
  private isVertical(start, end) {
    return start.x === end.x;
  }
  // 重新调整位置
  protected resetPosition() {
    let crosshairEl = this.get('crosshairEl');
    if (!crosshairEl) {
      this.initCrossHair();
      crosshairEl = this.get('crosshairEl');
    }
    const start = this.get('start');
    const end = this.get('end');
    const minX = Math.min(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    if (this.isVertical(start, end)) {
      modifyCSS(crosshairEl, {
        width: '1px',
        height: toPx(Math.abs(end.y - start.y))
      });
    } else {
      modifyCSS(crosshairEl, {
        height: '1px',
        width: toPx(Math.abs(end.x - start.x))
      });
    }
    modifyCSS(crosshairEl, {
      top: toPx(minY),
      left: toPx(minX)
    });
    this.alignText();
  }

  private alignText() {
    // 重新设置 text 位置
    const textEl = this.get('textEl');
    if (textEl) {
      const { align } = this.get('text');
      const clientWidth = textEl.clientWidth;
      const point = this.getTextPoint();
      switch(align) {
        case 'center': 
          point.x = point.x - clientWidth / 2;
          break;
        case 'right':
          point.x = point.x - clientWidth;
        case 'left':
          break;
      }
      modifyCSS(textEl, {
        top: toPx(point.y),
        left: toPx(point.x)
      });
    }
  }

  protected updateInner(cfg: Partial<T>) {
    if (hasKey(cfg, 'text')) {
      this.resetText();
    }
    super.updateInner(cfg);
  }
}

export default HtmlCrosshair;