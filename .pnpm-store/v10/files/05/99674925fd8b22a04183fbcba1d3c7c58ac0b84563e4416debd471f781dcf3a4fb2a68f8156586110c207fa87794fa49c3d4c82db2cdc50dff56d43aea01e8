import { __assign, __extends } from "tslib";
import { AbstractCanvas } from '@antv/g-base';
import { SHAPE_TO_TAGS } from './constant';
import { drawChildren } from './util/draw';
import { setTransform, setClip } from './util/svg';
import { sortDom, createSVGElement } from './util/dom';
import * as Shape from './shape';
import Group from './group';
import Defs from './defs';
var Canvas = /** @class */ (function (_super) {
    __extends(Canvas, _super);
    function Canvas(cfg) {
        return _super.call(this, __assign(__assign({}, cfg), { autoDraw: true, 
            // 设置渲染引擎为 canvas，只读属性
            renderer: 'svg' })) || this;
    }
    Canvas.prototype.getShapeBase = function () {
        return Shape;
    };
    Canvas.prototype.getGroupBase = function () {
        return Group;
    };
    // 覆盖 Container 中通过遍历的方式获取 shape 对象的逻辑，直接走 SVG 的 dom 拾取即可
    Canvas.prototype.getShape = function (x, y, ev) {
        var target = ev.target || ev.srcElement;
        if (!SHAPE_TO_TAGS[target.tagName]) {
            var parent_1 = target.parentNode;
            while (parent_1 && !SHAPE_TO_TAGS[parent_1.tagName]) {
                parent_1 = parent_1.parentNode;
            }
            target = parent_1;
        }
        return this.find(function (child) { return child.get('el') === target; });
    };
    // 复写基类的方法生成标签
    Canvas.prototype.createDom = function () {
        var element = createSVGElement('svg');
        var context = new Defs(element);
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
                sortDom(this, function (a, b) {
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
            setTransform(this);
        }
        else if (changeType === 'clip') {
            setClip(this, context);
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
        setClip(this, context);
        if (children.length) {
            drawChildren(context, children);
        }
    };
    return Canvas;
}(AbstractCanvas));
export default Canvas;
//# sourceMappingURL=canvas.js.map