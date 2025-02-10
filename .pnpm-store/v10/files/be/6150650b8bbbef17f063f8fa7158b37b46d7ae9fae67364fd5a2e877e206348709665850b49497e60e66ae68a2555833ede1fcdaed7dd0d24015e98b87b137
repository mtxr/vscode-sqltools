import { __assign, __extends } from "tslib";
import { deepMix, each } from '@antv/util';
import Action from '../base';
/**
 * @ignore
 * 辅助框 Action 的基类
 */
var MaskBase = /** @class */ (function (_super) {
    __extends(MaskBase, _super);
    function MaskBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // mask 图形
        _this.maskShape = null;
        // 组成 mask 的各个点
        _this.points = [];
        // 开始 mask 的标记
        _this.starting = false;
        // 开始移动的标记
        _this.moving = false;
        _this.preMovePoint = null;
        _this.shapeType = 'path';
        return _this;
    }
    // 获取当前的位置
    MaskBase.prototype.getCurrentPoint = function () {
        var event = this.context.event;
        return {
            x: event.x,
            y: event.y,
        };
    };
    // 触发 mask 的事件
    MaskBase.prototype.emitEvent = function (type) {
        var eventName = "mask:".concat(type);
        var view = this.context.view;
        var event = this.context.event;
        view.emit(eventName, {
            target: this.maskShape,
            shape: this.maskShape,
            points: this.points,
            x: event.x,
            y: event.y,
        });
    };
    // 创建 mask
    MaskBase.prototype.createMask = function () {
        var view = this.context.view;
        var maskAttrs = this.getMaskAttrs();
        var maskShape = view.foregroundGroup.addShape({
            type: this.shapeType,
            name: 'mask',
            draggable: true,
            attrs: __assign({ fill: '#C5D4EB', opacity: 0.3 }, maskAttrs),
        });
        return maskShape;
    };
    // 生成 mask 的路径
    MaskBase.prototype.getMaskPath = function () {
        return [];
    };
    /**
     * 显示
     */
    MaskBase.prototype.show = function () {
        if (this.maskShape) {
            this.maskShape.show();
            this.emitEvent('show');
        }
    };
    /**
     * 开始
     */
    MaskBase.prototype.start = function (arg) {
        this.starting = true;
        // 开始时，保证移动结束
        this.moving = false;
        this.points = [this.getCurrentPoint()];
        if (!this.maskShape) {
            this.maskShape = this.createMask();
            // 开始时设置 capture: false，可以避免创建、resize 时触发事件
            this.maskShape.set('capture', false);
        }
        this.updateMask(arg === null || arg === void 0 ? void 0 : arg.maskStyle);
        this.emitEvent('start');
    };
    /**
     * 开始移动
     */
    MaskBase.prototype.moveStart = function () {
        this.moving = true;
        this.preMovePoint = this.getCurrentPoint();
    };
    /**
     * 移动 mask
     */
    MaskBase.prototype.move = function () {
        if (!this.moving || !this.maskShape) {
            return;
        }
        var currentPoint = this.getCurrentPoint();
        var preMovePoint = this.preMovePoint;
        var dx = currentPoint.x - preMovePoint.x;
        var dy = currentPoint.y - preMovePoint.y;
        var points = this.points;
        each(points, function (point) {
            point.x += dx;
            point.y += dy;
        });
        this.updateMask();
        this.emitEvent('change');
        this.preMovePoint = currentPoint;
    };
    MaskBase.prototype.updateMask = function (maskStyle) {
        var attrs = deepMix({}, this.getMaskAttrs(), maskStyle);
        this.maskShape.attr(attrs);
    };
    /**
     * 结束移动
     */
    MaskBase.prototype.moveEnd = function () {
        this.moving = false;
        this.preMovePoint = null;
    };
    /**
     * 结束
     */
    MaskBase.prototype.end = function () {
        this.starting = false;
        this.emitEvent('end');
        if (this.maskShape) {
            this.maskShape.set('capture', true);
        }
    };
    /**
     * 隐藏
     */
    MaskBase.prototype.hide = function () {
        if (this.maskShape) {
            this.maskShape.hide();
            this.emitEvent('hide');
        }
    };
    /**
     * 大小变化
     */
    MaskBase.prototype.resize = function () {
        // 只有进行中，才会允许大小变化
        if (this.starting && this.maskShape) {
            this.points.push(this.getCurrentPoint());
            this.updateMask();
            this.emitEvent('change');
        }
    };
    /**
     * 销毁
     */
    MaskBase.prototype.destroy = function () {
        this.points = [];
        if (this.maskShape) {
            this.maskShape.remove();
        }
        this.maskShape = null;
        this.preMovePoint = null;
        _super.prototype.destroy.call(this);
    };
    return MaskBase;
}(Action));
export default MaskBase;
//# sourceMappingURL=base.js.map