import { __assign, __extends } from "tslib";
import { AbstractShape } from '@antv/g-base';
import { isNil, intersectRect } from '../util/util';
import { applyAttrsToContext, refreshElement } from '../util/draw';
import { getBBoxMethod } from '@antv/g-base';
import * as Shape from './index';
import Group from '../group';
var ShapeBase = /** @class */ (function (_super) {
    __extends(ShapeBase, _super);
    function ShapeBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShapeBase.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        // 设置默认值
        return __assign(__assign({}, attrs), { lineWidth: 1, lineAppendWidth: 0, strokeOpacity: 1, fillOpacity: 1 });
    };
    ShapeBase.prototype.getShapeBase = function () {
        return Shape;
    };
    ShapeBase.prototype.getGroupBase = function () {
        return Group;
    };
    /**
     * 一些方法调用会引起画布变化
     * @param {ChangeType} changeType 改变的类型
     */
    ShapeBase.prototype.onCanvasChange = function (changeType) {
        refreshElement(this, changeType);
    };
    ShapeBase.prototype.calculateBBox = function () {
        var type = this.get('type');
        var lineWidth = this.getHitLineWidth();
        // const attrs = this.attr();
        var bboxMethod = getBBoxMethod(type);
        var box = bboxMethod(this);
        var halfLineWidth = lineWidth / 2;
        var minX = box.x - halfLineWidth;
        var minY = box.y - halfLineWidth;
        var maxX = box.x + box.width + halfLineWidth;
        var maxY = box.y + box.height + halfLineWidth;
        return {
            x: minX,
            minX: minX,
            y: minY,
            minY: minY,
            width: box.width + lineWidth,
            height: box.height + lineWidth,
            maxX: maxX,
            maxY: maxY,
        };
    };
    ShapeBase.prototype.isFill = function () {
        return !!this.attrs['fill'] || this.isClipShape();
    };
    ShapeBase.prototype.isStroke = function () {
        return !!this.attrs['stroke'];
    };
    // 同 shape 中的方法重复了
    ShapeBase.prototype._applyClip = function (context, clip) {
        if (clip) {
            context.save();
            // 将 clip 的属性挂载到 context 上
            applyAttrsToContext(context, clip);
            // 绘制 clip 路径
            clip.createPath(context);
            context.restore();
            // 裁剪
            context.clip();
            clip._afterDraw();
        }
    };
    // 绘制图形时需要考虑 region 限制
    ShapeBase.prototype.draw = function (context, region) {
        var clip = this.cfg.clipShape;
        // 如果指定了 region，同时不允许刷新时，直接返回
        if (region) {
            if (this.cfg.refresh === false) {
                // this._afterDraw();
                this.set('hasChanged', false);
                return;
            }
            // 是否相交需要考虑 clip 的包围盒
            var bbox = this.getCanvasBBox();
            if (!intersectRect(region, bbox)) {
                // 图形的包围盒与重绘区域不相交时，也需要清除标记
                this.set('hasChanged', false);
                // 存在多种情形需要更新 cacheCanvasBBox 和 isInview 的判定
                // 1. 之前图形在视窗内，但是现在不再视窗内
                // 2. 如果当前的图形以及父元素都没有发生过变化，refresh = false 不会走到这里，所以这里的图形都是父元素发生变化，但是没有在视图内的元素
                if (this.cfg.isInView) {
                    this._afterDraw();
                }
                return;
            }
        }
        context.save();
        // 先将 attrs 应用到上下文中，再设置 clip。因为 clip 应该被当前元素的 matrix 所影响
        applyAttrsToContext(context, this);
        this._applyClip(context, clip);
        this.drawPath(context);
        context.restore();
        this._afterDraw();
    };
    ShapeBase.prototype.getCanvasViewBox = function () {
        var canvas = this.cfg.canvas;
        if (canvas) {
            // @ts-ignore
            return canvas.getViewRange();
        }
        return null;
    };
    ShapeBase.prototype.cacheCanvasBBox = function () {
        var canvasBBox = this.getCanvasViewBox();
        // 绘制的时候缓存包围盒
        if (canvasBBox) {
            var bbox = this.getCanvasBBox();
            var isInView = intersectRect(bbox, canvasBBox);
            this.set('isInView', isInView);
            // 不再视窗内 cacheCanvasBBox 设置成 null，会提升局部渲染的性能，
            // 因为在局部渲染影响的包围盒计算时不考虑这个图形的包围盒
            // 父元素 cacheCanvasBBox 计算的时候也不计算
            if (isInView) {
                this.set('cacheCanvasBBox', bbox);
            }
            else {
                this.set('cacheCanvasBBox', null);
            }
        }
    };
    ShapeBase.prototype._afterDraw = function () {
        this.cacheCanvasBBox();
        // 绘制后消除标记
        this.set('hasChanged', false);
        this.set('refresh', null);
    };
    ShapeBase.prototype.skipDraw = function () {
        this.set('cacheCanvasBBox', null);
        this.set('isInView', null);
        this.set('hasChanged', false);
    };
    /**
     * 绘制图形的路径
     * @param {CanvasRenderingContext2D} context 上下文
     */
    ShapeBase.prototype.drawPath = function (context) {
        this.createPath(context);
        this.strokeAndFill(context);
        this.afterDrawPath(context);
    };
    /**
     * @protected
     * 填充图形
     * @param {CanvasRenderingContext2D} context context 上下文
     */
    ShapeBase.prototype.fill = function (context) {
        context.fill();
    };
    /**
     * @protected
     * 绘制图形边框
     * @param {CanvasRenderingContext2D} context context 上下文
     */
    ShapeBase.prototype.stroke = function (context) {
        context.stroke();
    };
    // 绘制或者填充
    ShapeBase.prototype.strokeAndFill = function (context) {
        var _a = this.attrs, lineWidth = _a.lineWidth, opacity = _a.opacity, strokeOpacity = _a.strokeOpacity, fillOpacity = _a.fillOpacity;
        if (this.isFill()) {
            if (!isNil(fillOpacity) && fillOpacity !== 1) {
                context.globalAlpha = fillOpacity;
                this.fill(context);
                context.globalAlpha = opacity;
            }
            else {
                this.fill(context);
            }
        }
        if (this.isStroke()) {
            if (lineWidth > 0) {
                if (!isNil(strokeOpacity) && strokeOpacity !== 1) {
                    context.globalAlpha = strokeOpacity;
                }
                this.stroke(context);
            }
        }
        this.afterDrawPath(context);
    };
    /**
     * @protected
     * 绘制图形的路径
     * @param {CanvasRenderingContext2D} context 上下文
     */
    ShapeBase.prototype.createPath = function (context) { };
    /**
     * 绘制完成 path 后的操作
     * @param {CanvasRenderingContext2D} context 上下文
     */
    ShapeBase.prototype.afterDrawPath = function (context) { };
    ShapeBase.prototype.isInShape = function (refX, refY) {
        // return HitUtil.isHitShape(this, refX, refY);
        var isStroke = this.isStroke();
        var isFill = this.isFill();
        var lineWidth = this.getHitLineWidth();
        return this.isInStrokeOrPath(refX, refY, isStroke, isFill, lineWidth);
    };
    // 之所以不拆成 isInStroke 和 isInPath 在于两者存在一些共同的计算
    ShapeBase.prototype.isInStrokeOrPath = function (x, y, isStroke, isFill, lineWidth) {
        return false;
    };
    /**
     * 获取线拾取的宽度
     * @returns {number} 线的拾取宽度
     */
    ShapeBase.prototype.getHitLineWidth = function () {
        if (!this.isStroke()) {
            return 0;
        }
        var attrs = this.attrs;
        return attrs['lineWidth'] + attrs['lineAppendWidth'];
    };
    return ShapeBase;
}(AbstractShape));
export default ShapeBase;
//# sourceMappingURL=base.js.map