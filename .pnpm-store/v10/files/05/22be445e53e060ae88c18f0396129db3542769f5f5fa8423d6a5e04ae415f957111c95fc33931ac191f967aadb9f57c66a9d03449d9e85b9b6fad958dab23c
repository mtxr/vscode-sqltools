"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var g_base_1 = require("@antv/g-base");
var constant_1 = require("./constant");
var draw_1 = require("./util/draw");
var svg_1 = require("./util/svg");
var dom_1 = require("./util/dom");
var Shape = require("./shape");
var group_1 = require("./group");
var defs_1 = require("./defs");
var Canvas = /** @class */ (function (_super) {
    tslib_1.__extends(Canvas, _super);
    function Canvas(cfg) {
        return _super.call(this, tslib_1.__assign(tslib_1.__assign({}, cfg), { autoDraw: true, 
            // 设置渲染引擎为 canvas，只读属性
            renderer: 'svg' })) || this;
    }
    Canvas.prototype.getShapeBase = function () {
        return Shape;
    };
    Canvas.prototype.getGroupBase = function () {
        return group_1.default;
    };
    // 覆盖 Container 中通过遍历的方式获取 shape 对象的逻辑，直接走 SVG 的 dom 拾取即可
    Canvas.prototype.getShape = function (x, y, ev) {
        var target = ev.target || ev.srcElement;
        if (!constant_1.SHAPE_TO_TAGS[target.tagName]) {
            var parent_1 = target.parentNode;
            while (parent_1 && !constant_1.SHAPE_TO_TAGS[parent_1.tagName]) {
                parent_1 = parent_1.parentNode;
            }
            target = parent_1;
        }
        return this.find(function (child) { return child.get('el') === target; });
    };
    // 复写基类的方法生成标签
    Canvas.prototype.createDom = function () {
        var element = dom_1.createSVGElement('svg');
        var context = new defs_1.default(element);
        element.setAttribute('width', "" + this.get('width'));
        element.setAttribute('height', "" + this.get('height'));
        // 缓存 context 对象
        this.set('context', context);
        return element;
    };
    /**
     * 一些方法调用会引起画布变化
     * @param {ChangeType} changeType 改变的类型
     */
    Canvas.prototype.onCanvasChange = function (changeType) {
        var context = this.get('context');
        var el = this.get('el');
        if (changeType === 'sort') {
            var children_1 = this.get('children');
            if (children_1 && children_1.length) {
                dom_1.sortDom(this, function (a, b) {
                    return children_1.indexOf(a) - children_1.indexOf(b) ? 1 : 0;
                });
            }
        }
        else if (changeType === 'clear') {
            // el maybe null for canvas
            if (el) {
                // 清空 SVG 元素
                el.innerHTML = '';
                var defsEl = context.el;
                // 清空 defs 元素
                defsEl.innerHTML = '';
                // 将清空后的 defs 元素挂载到 el 下
                el.appendChild(defsEl);
            }
        }
        else if (changeType === 'matrix') {
            svg_1.setTransform(this);
        }
        else if (changeType === 'clip') {
            svg_1.setClip(this, context);
        }
        else if (changeType === 'changeSize') {
            el.setAttribute('width', "" + this.get('width'));
            el.setAttribute('height', "" + this.get('height'));
        }
    };
    // 复写基类的 draw 方法
    Canvas.prototype.draw = function () {
        var context = this.get('context');
        var children = this.getChildren();
        svg_1.setClip(this, context);
        if (children.length) {
            draw_1.drawChildren(context, children);
        }
    };
    return Canvas;
}(g_base_1.AbstractCanvas));
exports.default = Canvas;
//# sourceMappingURL=canvas.js.map