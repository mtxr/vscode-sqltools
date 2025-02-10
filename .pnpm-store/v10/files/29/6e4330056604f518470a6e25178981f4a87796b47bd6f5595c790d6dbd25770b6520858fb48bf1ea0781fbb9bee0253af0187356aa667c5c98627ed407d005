"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveTo = exports.sortDom = exports.createDom = exports.createSVGElement = void 0;
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
/**
 * 创建并返回图形的 svg 元素
 * @param type svg类型
 */
function createSVGElement(type) {
    return document.createElementNS('http://www.w3.org/2000/svg', type);
}
exports.createSVGElement = createSVGElement;
/**
 * 创建并返回图形的 dom 元素
 * @param  {IShape} shape 图形
 * @return {SVGElement}
 */
function createDom(shape) {
    var type = constant_1.SHAPE_TO_TAGS[shape.type];
    var parent = shape.getParent();
    if (!type) {
        throw new Error("the type " + shape.type + " is not supported by svg");
    }
    var element = createSVGElement(type);
    if (shape.get('id')) {
        element.id = shape.get('id');
    }
    shape.set('el', element);
    shape.set('attrs', {});
    // 对于 defs 下的 dom 节点，parent 为空，通过 context 统一挂载到 defs 节点下
    if (parent) {
        var parentNode = parent.get('el');
        if (parentNode) {
            parentNode.appendChild(element);
        }
        else {
            // parentNode maybe null for group
            parentNode = parent.createDom();
            parent.set('el', parentNode);
            parentNode.appendChild(element);
        }
    }
    return element;
}
exports.createDom = createDom;
/**
 * 对 dom 元素进行排序
 * @param {IElement} element  元素
 * @param {sorter}   function 排序函数
 */
function sortDom(element, sorter) {
    var el = element.get('el');
    var childList = util_1.toArray(el.children).sort(sorter);
    // create empty fragment
    var fragment = document.createDocumentFragment();
    childList.forEach(function (child) {
        fragment.appendChild(child);
    });
    el.appendChild(fragment);
}
exports.sortDom = sortDom;
/**
 * 将 dom 元素移动到父元素下的指定位置
 * @param {SVGElement} element     dom 元素
 * @param {number}     targetIndex 目标位置(从 0 开始)
 */
function moveTo(element, targetIndex) {
    var parentNode = element.parentNode;
    var siblings = Array.from(parentNode.childNodes).filter(
    // 要求为元素节点，且不能为 defs 节点
    function (node) { return node.nodeType === 1 && node.nodeName.toLowerCase() !== 'defs'; });
    // 获取目标节点
    var target = siblings[targetIndex];
    var currentIndex = siblings.indexOf(element);
    // 如果目标节点存在
    if (target) {
        // 当前索引 > 目标索引，直接插入到目标节点之前即可
        if (currentIndex > targetIndex) {
            parentNode.insertBefore(element, target);
        }
        else if (currentIndex < targetIndex) {
            // 当前索引 < 目标索引
            // 获取目标节点的下一个节点
            var targetNext = siblings[targetIndex + 1];
            // 如果目标节点的下一个节点存在，插入到该节点之前
            if (targetNext) {
                parentNode.insertBefore(element, targetNext);
            }
            else {
                // 如果该节点不存在，则追加到末尾
                parentNode.appendChild(element);
            }
        }
    }
    else {
        parentNode.appendChild(element);
    }
}
exports.moveTo = moveTo;
//# sourceMappingURL=dom.js.map