import { setTransform, setClip } from './svg';
import { sortDom, moveTo } from './dom';
export function drawChildren(context, children) {
    children.forEach(function (child) {
        child.draw(context);
    });
}
/**
 * 更新元素，包括 group 和 shape
 * @param {IElement} element       SVG 元素
 * @param {ChangeType} changeType  更新类型
 */
export function refreshElement(element, changeType) {
    // 对于还没有挂载到画布下的元素，canvas 可能为空
    var canvas = element.get('canvas');
    // 只有挂载到画布下，才对元素进行实际渲染
    if (canvas && canvas.get('autoDraw')) {
        var context = canvas.get('context');
        var parent_1 = element.getParent();
        var parentChildren = parent_1 ? parent_1.getChildren() : [canvas];
        var el = element.get('el');
        if (changeType === 'remove') {
            var isClipShape = element.get('isClipShape');
            // 对于 clip，不仅需要将 clipShape 对于的 SVG 元素删除，还需要将上层的 clipPath 元素也删除
            if (isClipShape) {
                var clipPathEl = el && el.parentNode;
                var defsEl = clipPathEl && clipPathEl.parentNode;
                if (clipPathEl && defsEl) {
                    defsEl.removeChild(clipPathEl);
                }
            }
            else if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
        else if (changeType === 'show') {
            el.setAttribute('visibility', 'visible');
        }
        else if (changeType === 'hide') {
            el.setAttribute('visibility', 'hidden');
        }
        else if (changeType === 'zIndex') {
            moveTo(el, parentChildren.indexOf(element));
        }
        else if (changeType === 'sort') {
            var children_1 = element.get('children');
            if (children_1 && children_1.length) {
                sortDom(element, function (a, b) {
                    return children_1.indexOf(a) - children_1.indexOf(b) ? 1 : 0;
                });
            }
        }
        else if (changeType === 'clear') {
            // el maybe null for group
            if (el) {
                el.innerHTML = '';
            }
        }
        else if (changeType === 'matrix') {
            setTransform(element);
        }
        else if (changeType === 'clip') {
            setClip(element, context);
        }
        else if (changeType === 'attr') {
            // 已在 afterAttrsChange 进行了处理，此处 do nothing
        }
        else if (changeType === 'add') {
            element.draw(context);
        }
    }
}
//# sourceMappingURL=draw.js.map