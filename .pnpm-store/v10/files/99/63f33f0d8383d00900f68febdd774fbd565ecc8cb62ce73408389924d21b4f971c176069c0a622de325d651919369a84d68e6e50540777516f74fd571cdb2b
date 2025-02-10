import { createDom, modifyCSS } from '@antv/dom-util';
import { isNil, isString, deepMix, each, hasKey } from '@antv/util';
import { BBox, ComponentCfg, HtmlComponentCfg } from '../types';
import { clearDom, createBBox, hasClass } from '../util/util';
import Component from './component';

abstract class HtmlComponent<T extends ComponentCfg = HtmlComponentCfg> extends Component<T> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      container: null,
      containerTpl: '<div></div>',
      updateAutoRender: true,
      containerClassName: '',
      parent: null,
    };
  }

  public getContainer(): HTMLElement {
    return this.get('container') as HTMLElement;
  }

  /**
   * 显示组件
   */
  public show() {
    const container = this.get('container');
    container.style.display = '';
    this.set('visible', true);
  }
  /**
   * 隐藏组件
   */
  public hide() {
    const container = this.get('container');
    container.style.display = 'none';
    this.set('visible', false);
  }
  /**
   * 是否允许捕捉事件
   * @param capture 事件捕捉
   */
  public setCapture(capture) {
    const container = this.getContainer();
    const value = capture ? 'auto' : 'none';
    container.style.pointerEvents = value;
    this.set('capture', capture);
  }
  public getBBox(): BBox {
    const container = this.getContainer();
    const x = parseFloat(container.style.left) || 0;
    const y = parseFloat(container.style.top) || 0;
    return createBBox(x, y, container.clientWidth, container.clientHeight);
  }

  public clear() {
    const container = this.get('container');
    clearDom(container);
  }

  public destroy() {
    this.removeEvent();
    this.removeDom();
    super.destroy();
  }

  /**
   * 复写 init，主要是初始化 DOM 和事件
   */
  public init() {
    super.init();
    this.initContainer();
    this.initDom();
    this.resetStyles(); // 初始化样式
    this.applyStyles(); // 应用样式
    this.initEvent();
    this.initCapture();
    this.initVisible();
  }

  protected initCapture() {
    this.setCapture(this.get('capture'));
  }
  protected initVisible() {
    if (!this.get('visible')) {
      // 设置初始显示状态
      this.hide();
    } else {
      this.show();
    }
  }

  protected initDom() {

  }

  protected initContainer() {
    let container = this.get('container');
    if (isNil(container)) {
      // 未指定 container 则创建
      container = this.createDom();
      let parent = this.get('parent');
      if (isString(parent)) {
        parent = document.getElementById(parent);
        this.set('parent', parent);
      }
      parent.appendChild(container);
      if (this.get('containerId')) {
        container.setAttribute('id', this.get('containerId'));
      }
      this.set('container', container);
    } else if (isString(container)) {
      // 用户传入的 id, 作为 container
      container = document.getElementById(container);
      this.set('container', container);
    } // else container 是 DOM
    if (!this.get('parent')) {
      this.set('parent', container.parentNode);
    }
  }

  // 样式需要进行合并，不能单纯的替换，否则使用非常不方便
  protected resetStyles() {
    let style = this.get('domStyles');
    const defaultStyles = this.get('defaultStyles');
    if (!style) {
      style = defaultStyles;
    } else {
      style = deepMix({}, defaultStyles, style);
    }
    this.set('domStyles', style);
  }
  // 应用所有的样式
  protected applyStyles() {
    const domStyles = this.get('domStyles');
    if (!domStyles) {
      return;
    }
    const container = this.getContainer();
    this.applyChildrenStyles(container, domStyles);
    const containerClassName = this.get('containerClassName');
    if (containerClassName && hasClass(container, containerClassName)) {
      const containerCss = domStyles[containerClassName];
      modifyCSS(container, containerCss);
    }
  }

  protected applyChildrenStyles(element, styles) {
    each(styles, (style, name) => {
      const elements = element.getElementsByClassName(name);
      each(elements, (el) => {
        modifyCSS(el, style);
      });
    });
  }
  // 应用到单个 DOM
  protected applyStyle(cssName, dom) {
    const domStyles = this.get('domStyles');
    modifyCSS(dom, domStyles[cssName]);
  }

  /**
   * @protected
   */
  protected createDom() {
    const containerTpl = this.get('containerTpl');
    return createDom(containerTpl);
  }

  /**
   * @protected
   * 初始化事件
   */
  protected initEvent() { }

  /**
   * @protected
   * 清理 DOM
   */
  protected removeDom() {
    const container = this.get('container');
    // 节点不一定有parentNode
    container && container.parentNode && container.parentNode.removeChild(container);
  }

  /**
   * @protected
   * 清理事件
   */
  protected removeEvent() { }

  protected updateInner(cfg) {
    // 更新样式
    if (hasKey(cfg, 'domStyles')) {
      this.resetStyles();
      this.applyStyles();
    }
    // 只要属性发生变化，都调整一些位置
    this.resetPosition();
  }
  protected resetPosition() { };
}

export default HtmlComponent;
