import { ChangeType } from '@antv/g-base';
import { IElement } from '../interfaces';
import { setTransform, setClip } from './svg';
import { sortDom, moveTo } from './dom';
import Defs from '../defs';

export function drawChildren(context: Defs, children: IElement[]) {
  children.forEach((child) => {
    child.draw(context);
  });
}

/**
 * 更新元素，包括 group 和 shape
 * @param {IElement} element       SVG 元素
 * @param {ChangeType} changeType  更新类型
 */
export function refreshElement(element: IElement, changeType: ChangeType) {
  // 对于还没有挂载到画布下的元素，canvas 可能为空
  const canvas = element.get('canvas');
  // 只有挂载到画布下，才对元素进行实际渲染
  if (canvas && canvas.get('autoDraw')) {
    const context = canvas.get('context');
    const parent = element.getParent();
    const parentChildren = parent ? parent.getChildren() : [canvas];
    const el = element.get('el');
    if (changeType === 'remove') {
      const isClipShape = element.get('isClipShape');
      // 对于 clip，不仅需要将 clipShape 对于的 SVG 元素删除，还需要将上层的 clipPath 元素也删除
      if (isClipShape) {
        const clipPathEl = el && el.parentNode;
        const defsEl = clipPathEl && clipPathEl.parentNode;
        if (clipPathEl && defsEl) {
          defsEl.removeChild(clipPathEl);
        }
      } else if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    } else if (changeType === 'show') {
      el.setAttribute('visibility', 'visible');
    } else if (changeType === 'hide') {
      el.setAttribute('visibility', 'hidden');
    } else if (changeType === 'zIndex') {
      moveTo(el, parentChildren.indexOf(element));
    } else if (changeType === 'sort') {
      const children = element.get('children');
      if (children && children.length) {
        sortDom(element, (a: IElement, b: IElement) => {
          return children.indexOf(a) - children.indexOf(b) ? 1 : 0;
        });
      }
    } else if (changeType === 'clear') {
      // el maybe null for group
      if (el) {
        el.innerHTML = '';
      }
    } else if (changeType === 'matrix') {
      setTransform(element);
    } else if (changeType === 'clip') {
      setClip(element, context);
    } else if (changeType === 'attr') {
      // 已在 afterAttrsChange 进行了处理，此处 do nothing
    } else if (changeType === 'add') {
      element.draw(context);
    }
  }
}
