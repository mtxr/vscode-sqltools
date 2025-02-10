"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var g_base_1 = require("@antv/g-base");
var util_1 = require("@antv/util");
var Shape = require("./shape");
var draw_1 = require("./util/draw");
var svg_1 = require("./util/svg");
var constant_1 = require("./constant");
var dom_1 = require("./util/dom");
var Group = /** @class */ (function (_super) {
    tslib_1.__extends(Group, _super);
    function Group() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // SVG 中分组对应实体标签 <g>
    Group.prototype.isEntityGroup = function () {
        return true;
    };
    Group.prototype.createDom = function () {
        var element = dom_1.createSVGElement('g');
        this.set('el', element);
        var parent = this.getParent();
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
    };
    // 覆盖基类的 afterAttrsChange 方法
    Group.prototype.afterAttrsChange = function (targetAttrs) {
        _super.prototype.afterAttrsChange.call(this, targetAttrs);
        var canvas = this.get('canvas');
        // 只有挂载到画布下，才对元素进行实际渲染
        if (canvas && canvas.get('autoDraw')) {
            var context = canvas.get('context');
            this.createPath(context, targetAttrs);
        }
    };
    /**
     * 一些方法调用会引起画布变化
     * @param {ChangeType} changeType 改变的类型
     */
    Group.prototype.onCanvasChange = function (changeType) {
        draw_1.refreshElement(this, changeType);
    };
    Group.prototype.getShapeBase = function () {
        return Shape;
    };
    Group.prototype.getGroupBase = function () {
        return Group;
    };
    Group.prototype.draw = function (context) {
        var children = this.getChildren();
        var el = this.get('el');
        if (this.get('destroyed')) {
            if (el) {
                el.parentNode.removeChild(el);
            }
        }
        else {
            if (!el) {
                this.createDom();
            }
            svg_1.setClip(this, context);
            this.createPath(context);
            if (children.length) {
                draw_1.drawChildren(context, children);
            }
        }
    };
    /**
     * 绘制分组的路径
     * @param {Defs} context 上下文
     * @param {ShapeAttrs} targetAttrs 渲染的目标属性
     */
    Group.prototype.createPath = function (context, targetAttrs) {
        var attrs = this.attr();
        var el = this.get('el');
        util_1.each(targetAttrs || attrs, function (value, attr) {
            if (constant_1.SVG_ATTR_MAP[attr]) {
                el.setAttribute(constant_1.SVG_ATTR_MAP[attr], value);
            }
        });
        svg_1.setTransform(this);
    };
    return Group;
}(g_base_1.AbstractGroup));
exports.default = Group;
//# sourceMappingURL=group.js.map