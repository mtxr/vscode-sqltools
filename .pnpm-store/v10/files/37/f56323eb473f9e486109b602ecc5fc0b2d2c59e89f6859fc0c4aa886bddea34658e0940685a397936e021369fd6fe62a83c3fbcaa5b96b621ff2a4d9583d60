import { __extends } from "tslib";
import { AbstractGroup } from '@antv/g-base';
import { each } from '@antv/util';
import * as Shape from './shape';
import { drawChildren, refreshElement } from './util/draw';
import { setClip, setTransform } from './util/svg';
import { SVG_ATTR_MAP } from './constant';
import { createSVGElement } from './util/dom';
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // SVG 中分组对应实体标签 <g>
    Group.prototype.isEntityGroup = function () {
        return true;
    };
    Group.prototype.createDom = function () {
        var element = createSVGElement('g');
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
        refreshElement(this, changeType);
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
            setClip(this, context);
            this.createPath(context);
            if (children.length) {
                drawChildren(context, children);
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
        each(targetAttrs || attrs, function (value, attr) {
            if (SVG_ATTR_MAP[attr]) {
                el.setAttribute(SVG_ATTR_MAP[attr], value);
            }
        });
        setTransform(this);
    };
    return Group;
}(AbstractGroup));
export default Group;
//# sourceMappingURL=group.js.map