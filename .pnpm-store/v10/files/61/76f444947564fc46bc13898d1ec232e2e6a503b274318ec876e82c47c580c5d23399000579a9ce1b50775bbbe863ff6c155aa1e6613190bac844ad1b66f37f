"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var g_base_1 = require("@antv/g-base");
var Shape = require("./shape");
var draw_1 = require("./util/draw");
var util_1 = require("@antv/util");
var util_2 = require("./util/util");
var Group = /** @class */ (function (_super) {
    tslib_1.__extends(Group, _super);
    function Group() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    // 同 shape 中的方法重复了
    Group.prototype._applyClip = function (context, clip) {
        if (clip) {
            context.save();
            // 将 clip 的属性挂载到 context 上
            draw_1.applyAttrsToContext(context, clip);
            // 绘制 clip 路径
            clip.createPath(context);
            context.restore();
            // 裁剪
            context.clip();
            clip._afterDraw();
        }
    };
    // 这个方法以前直接使用的 getCanvasBBox，由于 group 上没有缓存，所以每次重新计算，导致性能开销比较大
    // 大概能够节省全局渲染 15-20% 的性能，如果不在这里加缓存优化后 10W 个节点无法达到 5-6 ms，大概能够 30-40ms
    Group.prototype.cacheCanvasBBox = function () {
        var children = this.cfg.children;
        var xArr = [];
        var yArr = [];
        util_1.each(children, function (child) {
            var bbox = child.cfg.cacheCanvasBBox;
            // isInview 的判定是一旦图形或者分组渲染就要计算是否在视图内，
            // 这个判定 10W 个图形下差不多能够节省 5-6 ms 的开销
            if (bbox && child.cfg.isInView) {
                xArr.push(bbox.minX, bbox.maxX);
                yArr.push(bbox.minY, bbox.maxY);
            }
        });
        var bbox = null;
        if (xArr.length) {
            var minX = util_1.min(xArr);
            var maxX = util_1.max(xArr);
            var minY = util_1.min(yArr);
            var maxY = util_1.max(yArr);
            bbox = {
                minX: minX,
                minY: minY,
                x: minX,
                y: minY,
                maxX: maxX,
                maxY: maxY,
                width: maxX - minX,
                height: maxY - minY,
            };
            var canvas = this.cfg.canvas;
            if (canvas) {
                var viewRange = canvas.getViewRange();
                // 如果这个地方判定 isInView == false 设置 bbox 为 false 的话，拾取的性能会更高
                // 但是目前 10W 图形的拾取在 2-5ms 内，这个优化意义不大，可以后期观察再看
                this.set('isInView', util_2.intersectRect(bbox, viewRange));
            }
        }
        else {
            this.set('isInView', false);
        }
        this.set('cacheCanvasBBox', bbox);
    };
    Group.prototype.draw = function (context, region) {
        var children = this.cfg.children;
        var allowDraw = region ? this.cfg.refresh : true; // 局部刷新需要判定
        // 这个地方需要判定，在 G6 的场景每个 group 都有 transform 的场景下性能会开销非常大
        // 通过 refresh 的判定，可以不刷新没有发生过变化的分组，不在视窗内的分组等等
        // 如果想进一步提升局部渲染性能，可以进一步优化 refresh 的判定，依然有潜力
        if (children.length && allowDraw) {
            context.save();
            // group 上的矩阵和属性也会应用到上下文上
            // 先将 attrs 应用到上下文中，再设置 clip。因为 clip 应该被当前元素的 matrix 所影响
            draw_1.applyAttrsToContext(context, this);
            this._applyClip(context, this.getClip());
            draw_1.drawChildren(context, children, region);
            context.restore();
            this.cacheCanvasBBox();
        }
        // 这里的成本比较大，如果不绘制则不再
        // this.set('cacheCanvasBBox', this.getCanvasBBox());
        this.cfg.refresh = null;
        // 绘制后，消除更新标记
        this.set('hasChanged', false);
    };
    // 绘制时被跳过，一般发生在分组隐藏时
    Group.prototype.skipDraw = function () {
        this.set('cacheCanvasBBox', null);
        this.set('hasChanged', false);
    };
    return Group;
}(g_base_1.AbstractGroup));
exports.default = Group;
//# sourceMappingURL=group.js.map