import { AbstractGroup } from '@antv/g-base';
import { ChangeType } from '@antv/g-base';
import { each } from '@antv/util';
import { IElement, IGroup } from './interfaces';
import * as Shape from './shape';
import Defs from './defs';
import { drawChildren, refreshElement } from './util/draw';
import { setClip, setTransform } from './util/svg';
import { SVG_ATTR_MAP } from './constant';
import { createSVGElement } from './util/dom';

class Group extends AbstractGroup {
  // SVG 中分组对应实体标签 <g>
  isEntityGroup() {
    return true;
  }

  createDom() {
    const element = createSVGElement('g');
    this.set('el', element);
    const parent = this.getParent();
    if (parent) {
      let parentNode = parent.get('el');
      if (parentNode) {
        parentNode.appendChild(element);
      } else {
        // parentNode maybe null for group
        parentNode = (parent as IGroup).createDom();
        parent.set('el', parentNode);
        parentNode.appendChild(element);
      }
    }
    return element;
  }

  // 覆盖基类的 afterAttrsChange 方法
  afterAttrsChange(targetAttrs) {
    super.afterAttrsChange(targetAttrs);
    const canvas = this.get('canvas');
    // 只有挂载到画布下，才对元素进行实际渲染
    if (canvas && canvas.get('autoDraw')) {
      const context = canvas.get('context');
      this.createPath(context, targetAttrs);
    }
  }

  /**
   * 一些方法调用会引起画布变化
   * @param {ChangeType} changeType 改变的类型
   */
  onCanvasChange(changeType: ChangeType) {
    refreshElement(this, changeType);
  }

  getShapeBase() {
    return Shape;
  }

  getGroupBase() {
    return Group;
  }

  draw(context: Defs) {
    const children = this.getChildren() as IElement[];
    const el = this.get('el');
    if (this.get('destroyed')) {
      if (el) {
        el.parentNode.removeChild(el);
      }
    } else {
      if (!el) {
        this.createDom();
      }
      setClip(this, context);
      this.createPath(context);
      if (children.length) {
        drawChildren(context, children);
      }
    }
  }

  /**
   * 绘制分组的路径
   * @param {Defs} context 上下文
   * @param {ShapeAttrs} targetAttrs 渲染的目标属性
   */
  createPath(context: Defs, targetAttrs?) {
    const attrs = this.attr();
    const el = this.get('el');
    each(targetAttrs || attrs, (value, attr) => {
      if (SVG_ATTR_MAP[attr]) {
        el.setAttribute(SVG_ATTR_MAP[attr], value);
      }
    });
    setTransform(this);
  }
}

export default Group;
