import { AbstractCanvas, IShape } from '@antv/g-base';
import { ChangeType } from '@antv/g-base';
import { IElement } from './interfaces';
import { SHAPE_TO_TAGS } from './constant';
import { drawChildren } from './util/draw';
import { setTransform, setClip } from './util/svg';
import { sortDom, createSVGElement } from './util/dom';
import * as Shape from './shape';
import Group from './group';
import Defs from './defs';

class Canvas extends AbstractCanvas {
  constructor(cfg) {
    super({
      ...cfg,
      autoDraw: true,
      // 设置渲染引擎为 canvas，只读属性
      renderer: 'svg',
    });
  }

  getShapeBase() {
    return Shape;
  }

  getGroupBase() {
    return Group;
  }

  // 覆盖 Container 中通过遍历的方式获取 shape 对象的逻辑，直接走 SVG 的 dom 拾取即可
  getShape(x: number, y: number, ev: Event): IShape {
    let target = <Element>ev.target || <Element>ev.srcElement;
    if (!SHAPE_TO_TAGS[target.tagName]) {
      let parent = <Element>target.parentNode;
      while (parent && !SHAPE_TO_TAGS[parent.tagName]) {
        parent = <Element>parent.parentNode;
      }
      target = parent;
    }
    return this.find((child) => child.get('el') === target) as IShape;
  }

  // 复写基类的方法生成标签
  createDom() {
    const element = createSVGElement('svg') as SVGSVGElement;
    const context = new Defs(element);
    element.setAttribute('width', `${this.get('width')}`);
    element.setAttribute('height', `${this.get('height')}`);
    // 缓存 context 对象
    this.set('context', context);
    return element;
  }

  /**
   * 一些方法调用会引起画布变化
   * @param {ChangeType} changeType 改变的类型
   */
  onCanvasChange(changeType: ChangeType) {
    const context = this.get('context');
    const el = this.get('el');
    if (changeType === 'sort') {
      const children = this.get('children');
      if (children && children.length) {
        sortDom(this, (a: IElement, b: IElement) => {
          return children.indexOf(a) - children.indexOf(b) ? 1 : 0;
        });
      }
    } else if (changeType === 'clear') {
      // el maybe null for canvas
      if (el) {
        // 清空 SVG 元素
        el.innerHTML = '';
        const defsEl = context.el;
        // 清空 defs 元素
        defsEl.innerHTML = '';
        // 将清空后的 defs 元素挂载到 el 下
        el.appendChild(defsEl);
      }
    } else if (changeType === 'matrix') {
      setTransform(this);
    } else if (changeType === 'clip') {
      setClip(this, context);
    } else if (changeType === 'changeSize') {
      el.setAttribute('width', `${this.get('width')}`);
      el.setAttribute('height', `${this.get('height')}`);
    }
  }

  // 复写基类的 draw 方法
  draw() {
    const context = this.get('context');
    const children = this.getChildren() as IElement[];
    setClip(this, context);
    if (children.length) {
      drawChildren(context, children);
    }
  }
}

export default Canvas;
