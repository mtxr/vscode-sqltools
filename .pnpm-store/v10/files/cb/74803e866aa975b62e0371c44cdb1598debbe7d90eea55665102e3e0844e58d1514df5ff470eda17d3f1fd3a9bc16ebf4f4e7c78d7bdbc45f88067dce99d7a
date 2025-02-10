import colorUtil from '@antv/color-util';
import { createDom, modifyCSS } from '@antv/dom-util';
import { each, hasKey, isElement, substitute } from '@antv/util';
import HtmlComponent from '../abstract/html-component';
import { Point, PointLocationCfg } from '../types';
import { TooltipCfg } from '../types';
import { clearDom, regionToBBox, toPx } from '../util/util';
import * as CssConst from './css-const';
import TooltipTheme from './html-theme';

import { ILocation } from '../interfaces';
import { getAlignPoint } from '../util/align';

function hasOneKey(obj, keys) {
  let result = false;
  each(keys, (key) => {
    if (hasKey(obj, key)) {
      result = true;
      return false;
    }
  });
  return result;
}

class Tooltip<T extends TooltipCfg = TooltipCfg> extends HtmlComponent implements ILocation<PointLocationCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'tooltip',
      type: 'html',
      x: 0,
      y: 0,
      items: [],
      customContent: null,
      containerTpl: `<div class="${CssConst.CONTAINER_CLASS}"><div class="${CssConst.TITLE_CLASS}"></div><ul class="${CssConst.LIST_CLASS}"></ul></div>`,
      itemTpl: `<li class="${CssConst.LIST_ITEM_CLASS}" data-index={index}>
          <span class="${CssConst.MARKER_CLASS}" style="background:{color}"></span>
          <span class="${CssConst.NAME_CLASS}">{name}</span>:
          <span class="${CssConst.VALUE_CLASS}">{value}</span>
        </li>`,
      xCrosshairTpl: `<div class="${CssConst.CROSSHAIR_X}"></div>`,
      yCrosshairTpl: `<div class="${CssConst.CROSSHAIR_Y}"></div>`,
      title: null,
      showTitle: true,
      /**
       * tooltip 限制的区域
       * @type {Region}
       */
      region: null,
      // crosshair 的限制区域
      crosshairsRegion: null,
      containerClassName: CssConst.CONTAINER_CLASS,
      // x, y, xy
      crosshairs: null,
      offset: 10,
      position: 'right',
      domStyles: null,
      defaultStyles: TooltipTheme,
    };
  }

  // tooltip 渲染时，渲染 title，items 和 corosshairs
  public render() {
    if (this.get('customContent')) {
      this.renderCustomContent();
    } else {
      this.resetTitle();
      this.renderItems();
    }
    // 绘制完成后，再定位
    this.resetPosition();
  }

  // 复写清空函数，因为有模板的存在，所以默认的写法不合适
  public clear() {
    // 由于 crosshair 没有在 container 内，所以需要单独清理
    this.clearCrosshairs();
    this.setTitle(''); // 清空标题
    this.clearItemDoms();
  }

  public show() {
    const container = this.getContainer();
    if (!container || this.destroyed) {
      // 防止容器不存在或者被销毁时报错
      return;
    }
    this.set('visible', true);
    modifyCSS(container, {
      visibility: 'visible',
    });
    this.setCrossHairsVisible(true);
  }

  public hide() {
    const container = this.getContainer();
    // relative: https://github.com/antvis/g2/issues/1221
    if (!container || this.destroyed) {
      return;
    }
    this.set('visible', false);
    modifyCSS(container, {
      visibility: 'hidden',
    });
    this.setCrossHairsVisible(false);
  }

  // 实现 IPointLocation 的接口
  public getLocation() {
    return { x: this.get('x'), y: this.get('y') };
  }
  // 实现 IPointLocation 的接口
  public setLocation(point: Point) {
    this.set('x', point.x);
    this.set('y', point.y);
    this.resetPosition();
  }

  public setCrossHairsVisible(visible) {
    const display = visible ? '' : 'none';
    const xCrosshairDom = this.get('xCrosshairDom');
    const yCrosshairDom = this.get('yCrosshairDom');
    xCrosshairDom &&
      modifyCSS(xCrosshairDom, {
        display,
      });
    yCrosshairDom &&
      modifyCSS(yCrosshairDom, {
        display,
      });
  }

  // 如有 customContent 则根据 customContent 设置 container
  protected initContainer() {
    super.initContainer();
    if (this.get('customContent')) {
      if (this.get('container')) {
        this.get('container').remove();
      }
      const container = this.getHtmlContentNode();
      this.get('parent').appendChild(container);
      this.set('container', container);
      this.resetStyles();
      this.applyStyles();
    }
  }

  // 更新属性的同时，可能会引起 DOM 的变化，这里对可能引起 DOM 变化的场景做了处理
  protected updateInner(cfg: Partial<T>) {
    if (this.get('customContent')) {
      this.renderCustomContent();
    } else {
      // 更新标题
      if (hasOneKey(cfg, ['title', 'showTitle'])) {
        this.resetTitle();
      }
      // 更新内容
      if (hasKey(cfg, 'items')) {
        this.renderItems();
      }
    }
    super.updateInner(cfg);
  }

  protected initDom() {
    this.cacheDoms();
  }
  // 清理 DOM
  protected removeDom() {
    super.removeDom();
    this.clearCrosshairs();
  }
  // 调整位置
  protected resetPosition() {
    const x = this.get('x');
    const y = this.get('y');
    const offset = this.get('offset');
    const { offsetX, offsetY } = this.getOffset();
    const position = this.get('position');
    const region = this.get('region');
    const container = this.getContainer();
    const bbox = this.getBBox();
    const { width, height } = bbox;
    let limitBox;
    if (region) {
      // 不限制位置
      limitBox = regionToBBox(region);
    }
    const point = getAlignPoint(x, y, offset, width, height, position, limitBox);
    modifyCSS(container, {
      left: toPx(point.x + offsetX),
      top: toPx(point.y + offsetY),
    });
    this.resetCrosshairs();
  }

  // 根据 customContent 渲染
  private renderCustomContent() {
    const node = this.getHtmlContentNode();
    const parent: HTMLElement = this.get('parent');
    const curContainer: HTMLElement = this.get('container');
    if (curContainer && curContainer.parentNode === parent) {
      parent.replaceChild(node, curContainer);
    } else {
      parent.appendChild(node);
    }
    this.set('container', node);
    this.resetStyles();
    this.applyStyles();
  }

  private getHtmlContentNode() {
    let node: HTMLElement | undefined;
    const customContent = this.get('customContent');
    if (customContent) {
      const elem = customContent(this.get('title'), this.get('items'));
      if (isElement(elem)) {
        node = elem as HTMLElement;
      } else {
        node = createDom(elem);
      }
    }
    return node;
  }

  // 缓存模板设置的各种 DOM
  private cacheDoms() {
    const container = this.getContainer();
    const titleDom = container.getElementsByClassName(CssConst.TITLE_CLASS)[0];
    const listDom = container.getElementsByClassName(CssConst.LIST_CLASS)[0];
    this.set('titleDom', titleDom);
    this.set('listDom', listDom);
  }

  // 重置 title
  private resetTitle() {
    const title = this.get('title');
    const showTitle = this.get('showTitle');
    if (showTitle && title) {
      this.setTitle(title);
    } else {
      this.setTitle('');
    }
  }
  // 设置 title 文本
  private setTitle(text) {
    const titleDom = this.get('titleDom');
    if (titleDom) {
      titleDom.innerText = text;
    }
  }
  // 终止 crosshair
  private resetCrosshairs() {
    const crosshairsRegion = this.get('crosshairsRegion');
    const crosshairs = this.get('crosshairs');
    if (!crosshairsRegion || !crosshairs) {
      // 不显示 crosshair，都移除，没有设定 region 也都移除掉
      this.clearCrosshairs();
    } else {
      const crosshairBox = regionToBBox(crosshairsRegion);
      const xCrosshairDom = this.get('xCrosshairDom');
      const yCrosshairDom = this.get('yCrosshairDom');
      if (crosshairs === 'x') {
        this.resetCrosshair('x', crosshairBox);
        // 仅显示 x 的 crosshair，y 移除
        if (yCrosshairDom) {
          yCrosshairDom.remove();
          this.set('yCrosshairDom', null);
        }
      } else if (crosshairs === 'y') {
        this.resetCrosshair('y', crosshairBox);
        // 仅显示 y 的 crosshair，x 移除
        if (xCrosshairDom) {
          xCrosshairDom.remove();
          this.set('xCrosshairDom', null);
        }
      } else {
        this.resetCrosshair('x', crosshairBox);
        this.resetCrosshair('y', crosshairBox);
      }
      this.setCrossHairsVisible(this.get('visible'));
    }
  }
  // 设定 crosshair 的位置，需要区分 x,y
  private resetCrosshair(name: string, bbox) {
    const croshairDom = this.checkCrosshair(name);
    const value = this.get(name);
    if (name === 'x') {
      modifyCSS(croshairDom, {
        left: toPx(value),
        top: toPx(bbox.y),
        height: toPx(bbox.height),
      });
    } else {
      modifyCSS(croshairDom, {
        top: toPx(value),
        left: toPx(bbox.x),
        width: toPx(bbox.width),
      });
    }
  }

  // 如果 crosshair 对应的 dom 不存在，则创建
  private checkCrosshair(name: string) {
    const domName = `${name}CrosshairDom`;
    const tplName = `${name}CrosshairTpl`;
    const constName = `CROSSHAIR_${name.toUpperCase()}`;
    const styleName = CssConst[constName];
    let croshairDom = this.get(domName);
    const parent = this.get('parent') as HTMLElement;
    if (!croshairDom) {
      croshairDom = createDom(this.get(tplName)); // 创建
      this.applyStyle(styleName, croshairDom); // 设置初始样式
      parent.appendChild(croshairDom); // 添加到跟 tooltip 同级的目录下
      this.set(domName, croshairDom);
    }
    return croshairDom;
  }

  private renderItems() {
    this.clearItemDoms();
    const items = this.get('items');
    const itemTpl = this.get('itemTpl');
    const listDom = this.get('listDom');
    if (listDom) {
      each(items, (item) => {
        const color = colorUtil.toCSSGradient(item.color);
        const substituteObj = {
          ...item,
          color,
        };

        const domStr = substitute(itemTpl, substituteObj);
        const itemDom = createDom(domStr);
        listDom.appendChild(itemDom);
      });
      this.applyChildrenStyles(listDom, this.get('domStyles'));
    }
  }

  private clearItemDoms() {
    if (this.get('listDom')) {
      clearDom(this.get('listDom'));
    }
  }

  private clearCrosshairs() {
    const xCrosshairDom = this.get('xCrosshairDom');
    const yCrosshairDom = this.get('yCrosshairDom');
    xCrosshairDom && xCrosshairDom.remove();
    yCrosshairDom && yCrosshairDom.remove();
    this.set('xCrosshairDom', null);
    this.set('yCrosshairDom', null);
  }
}

export default Tooltip;
