"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowCapture = exports.isParent = exports.isBrowser = exports.removeFromArray = void 0;
function removeFromArray(arr, obj) {
    var index = arr.indexOf(obj);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}
exports.removeFromArray = removeFromArray;
exports.isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
var util_1 = require("@antv/util");
Object.defineProperty(exports, "isNil", { enumerable: true, get: function () { return util_1.isNil; } });
Object.defineProperty(exports, "isFunction", { enumerable: true, get: function () { return util_1.isFunction; } });
Object.defineProperty(exports, "isString", { enumerable: true, get: function () { return util_1.isString; } });
Object.defineProperty(exports, "isObject", { enumerable: true, get: function () { return util_1.isObject; } });
Object.defineProperty(exports, "isArray", { enumerable: true, get: function () { return util_1.isArray; } });
Object.defineProperty(exports, "mix", { enumerable: true, get: function () { return util_1.mix; } });
Object.defineProperty(exports, "each", { enumerable: true, get: function () { return util_1.each; } });
Object.defineProperty(exports, "upperFirst", { enumerable: true, get: function () { return util_1.upperFirst; } });
// 是否元素的父容器
function isParent(container, shape) {
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
exports.isParent = isParent;
function isAllowCapture(element) {
    // @ts-ignore
    return element.cfg.visible && element.cfg.capture;
}
exports.isAllowCapture = isAllowCapture;
//# sourceMappingURL=util.js.map