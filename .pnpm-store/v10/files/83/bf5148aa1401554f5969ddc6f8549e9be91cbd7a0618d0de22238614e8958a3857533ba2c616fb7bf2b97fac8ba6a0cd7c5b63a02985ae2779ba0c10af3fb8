"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = tslib_1.__importDefault(require("../../base"));
/**
 * @ignore
 * 辅助框 Action 的基类
 */
var MultipleMaskBase = /** @class */ (function (_super) {
    tslib_1.__extends(MultipleMaskBase, _super);
    function MultipleMaskBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // mask 图形
        _this.maskShapes = [];
        // 开始 mask 的标记
        _this.starting = false;
        // 开始移动的标记
        _this.moving = false;
        // 记录 mask 节点
        _this.recordPoints = null;
        _this.preMovePoint = null;
        _this.shapeType = 'path';
        _this.maskType = 'multi-mask';
        return _this;
    }
    /**
     * 获取当前的位置
     */
    MultipleMaskBase.prototype.getCurrentPoint = function () {
        var event = this.context.event;
        return {
            x: event.x,
            y: event.y,
        };
    };
    /**
     * 触发 mask 的事件
     * @param type
     */
    MultipleMaskBase.prototype.emitEvent = function (type) {
        var eventName = "".concat(this.maskType, ":").concat(type);
        var view = this.context.view;
        var event = this.context.event;
        var target = {
            type: this.shapeType,
            name: this.maskType,
            get: function (key) { return (target.hasOwnProperty(key) ? target[key] : undefined); },
        };
        view.emit(eventName, {
            target: target,
            maskShapes: this.maskShapes,
            multiPoints: this.recordPoints,
            x: event.x,
            y: event.y,
        });
    };
    /**
     * 创建 mask
     * @param index
     */
    MultipleMaskBase.prototype.createMask = function (index) {
        var view = this.context.view;
        var points = this.recordPoints[index];
        var maskAttrs = this.getMaskAttrs(points);
        var maskShape = view.foregroundGroup.addShape({
            type: this.shapeType,
            name: 'mask',
            draggable: true,
            attrs: tslib_1.__assign({ fill: '#C5D4EB', opacity: 0.3 }, maskAttrs),
        });
        this.maskShapes.push(maskShape);
    };
    /**
     * 生成 mask 的路径
     */
    MultipleMaskBase.prototype.getMaskPath = function (points) {
        return [];
    };
    /**
     * 显示
     */
    MultipleMaskBase.prototype.show = function () {
        if (this.maskShapes.length > 0) {
            this.maskShapes.forEach(function (maskShape) { return maskShape.show(); });
            this.emitEvent('show');
        }
    };
    /**
     * 开始
     */
    MultipleMaskBase.prototype.start = function (arg) {
        this.recordPointStart();
        this.starting = true;
        // 开始时，保证移动结束
        this.moving = false;
        // 开始第 index 个 mask
        var index = this.recordPoints.length - 1;
        this.createMask(index);
        // 开始时设置 capture: false，可以避免创建、resize 时触发事件
        this.updateShapesCapture(false);
        this.updateMask(arg === null || arg === void 0 ? void 0 : arg.maskStyle);
        this.emitEvent('start');
    };
    /**
     * 开始移动
     */
    MultipleMaskBase.prototype.moveStart = function () {
        this.moving = true;
        this.preMovePoint = this.getCurrentPoint();
        this.updateShapesCapture(false);
    };
    /**
     * 移动 mask
     */
    MultipleMaskBase.prototype.move = function () {
        if (!this.moving || this.maskShapes.length === 0) {
            return;
        }
        var currentPoint = this.getCurrentPoint();
        var preMovePoint = this.preMovePoint;
        var dx = currentPoint.x - preMovePoint.x;
        var dy = currentPoint.y - preMovePoint.y;
        // 只移动当前 event (x, y) 所在的某个 mask
        var index = this.getCurMaskShapeIndex();
        if (index > -1) {
            this.recordPoints[index].forEach(function (point) {
                point.x += dx;
                point.y += dy;
            });
            this.updateMask();
            this.emitEvent('change');
            this.preMovePoint = currentPoint;
        }
    };
    /**
     * 更新
     * @param maskStyle
     */
    MultipleMaskBase.prototype.updateMask = function (maskStyle) {
        var _this = this;
        this.recordPoints.forEach(function (points, index) {
            var attrs = (0, util_1.deepMix)({}, _this.getMaskAttrs(points), maskStyle);
            _this.maskShapes[index].attr(attrs);
        });
    };
    /**
     * 大小变化
     */
    MultipleMaskBase.prototype.resize = function () {
        if (this.starting && this.maskShapes.length > 0) {
            this.recordPointContinue();
            this.updateMask();
            this.emitEvent('change');
        }
    };
    /**
     * 结束移动
     */
    MultipleMaskBase.prototype.moveEnd = function () {
        this.moving = false;
        this.preMovePoint = null;
        this.updateShapesCapture(true);
    };
    /**
     * 结束
     */
    MultipleMaskBase.prototype.end = function () {
        this.starting = false;
        this.emitEvent('end');
        this.updateShapesCapture(true);
    };
    /**
     * 隐藏
     */
    MultipleMaskBase.prototype.hide = function () {
        if (this.maskShapes.length > 0) {
            this.maskShapes.forEach(function (maskShape) { return maskShape.hide(); });
            this.emitEvent('hide');
        }
    };
    /**
     * 清除某个 mask
     */
    MultipleMaskBase.prototype.remove = function () {
        var index = this.getCurMaskShapeIndex();
        if (index > -1) {
            // event (x, y) 在的某个 mask 区域内时，清除该 mask
            this.recordPoints.splice(index, 1);
            this.maskShapes[index].remove();
            this.maskShapes.splice(index, 1);
            this.preMovePoint = null;
            this.updateShapesCapture(true);
            this.emitEvent('change');
        }
    };
    /**
     * 清除全部 mask
     */
    MultipleMaskBase.prototype.clearAll = function () {
        this.recordPointClear();
        this.maskShapes.forEach(function (maskShape) { return maskShape.remove(); });
        this.maskShapes = [];
        this.preMovePoint = null;
    };
    /**
     * 清除
     */
    MultipleMaskBase.prototype.clear = function () {
        var index = this.getCurMaskShapeIndex();
        if (index === -1) {
            this.recordPointClear();
            this.maskShapes.forEach(function (maskShape) { return maskShape.remove(); });
            this.maskShapes = [];
            this.emitEvent('clearAll');
        }
        else {
            this.recordPoints.splice(index, 1);
            this.maskShapes[index].remove();
            this.maskShapes.splice(index, 1);
            this.preMovePoint = null;
            this.emitEvent('clearSingle');
        }
        this.preMovePoint = null;
    };
    /**
     * 销毁
     */
    MultipleMaskBase.prototype.destroy = function () {
        this.clear();
        _super.prototype.destroy.call(this);
    };
    /**
     * 获取 mask 节点记录
     */
    MultipleMaskBase.prototype.getRecordPoints = function () {
        var _a;
        return tslib_1.__spreadArray([], tslib_1.__read(((_a = this.recordPoints) !== null && _a !== void 0 ? _a : [])), false);
    };
    /**
     * 创建 mask 节点记录
     */
    MultipleMaskBase.prototype.recordPointStart = function () {
        var recordPoints = this.getRecordPoints();
        var currentPoint = this.getCurrentPoint();
        this.recordPoints = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(recordPoints), false), [[currentPoint]], false);
    };
    /**
     * 持续记录 mask 节点
     */
    MultipleMaskBase.prototype.recordPointContinue = function () {
        var recordPoints = this.getRecordPoints();
        var currentPoint = this.getCurrentPoint();
        var lastPoints = recordPoints.splice(-1, 1)[0] || [];
        lastPoints.push(currentPoint);
        this.recordPoints = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(recordPoints), false), [lastPoints], false);
    };
    /**
     * 清除 mask 节点 记录
     */
    MultipleMaskBase.prototype.recordPointClear = function () {
        this.recordPoints = [];
    };
    /**
     * 设置 capture
     * false: 避免创建、resize 时触发事件
     * true: 正常触发其它事件
     * @param isCapture
     */
    MultipleMaskBase.prototype.updateShapesCapture = function (isCapture) {
        this.maskShapes.forEach(function (maskShape) { return maskShape.set('capture', isCapture); });
    };
    /**
     *
     * @returns 获取当前 event (x, y) 所在 maskShape 的 index
     */
    MultipleMaskBase.prototype.getCurMaskShapeIndex = function () {
        var currentPoint = this.getCurrentPoint();
        return this.maskShapes.findIndex(function (maskShape) {
            var _a = maskShape.attrs, width = _a.width, height = _a.height, r = _a.r;
            var isEmpty = width === 0 || height === 0 || r === 0;
            return !isEmpty && maskShape.isHit(currentPoint.x, currentPoint.y);
        });
    };
    return MultipleMaskBase;
}(base_1.default));
exports.default = MultipleMaskBase;
//# sourceMappingURL=base.js.map