export function removeFromArray(arr, obj) {
    var index = arr.indexOf(obj);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}
export var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
export { isNil, isFunction, isString, isObject, isArray, mix, each, upperFirst } from '@antv/util';
// 是否元素的父容器
export function isParent(container, shape) {
    // 所有 shape 都是 canvas 的子元素
    if (container.isCanvas()) {
        return true;
    }
    var parent = shape.getParent();
    var isParent = false;
    while (parent) {
        if (parent === container) {
            isParent = true;
            break;
        }
        parent = parent.getParent();
    }
    return isParent;
}
export function isAllowCapture(element) {
    // @ts-ignore
    return element.cfg.visible && element.cfg.capture;
}
//# sourceMappingURL=util.js.map