"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var element_1 = require("./element");
var matrix_1 = require("../util/matrix");
var AbstractShape = /** @class */ (function (_super) {
    tslib_1.__extends(AbstractShape, _super);
    function AbstractShape(cfg) {
        return _super.call(this, cfg) || this;
    }
    // 是否在包围盒内
    AbstractShape.prototype._isInBBox = function (refX, refY) {
        var bbox = this.getBBox();
        return bbox.minX <= refX && bbox.maxX >= refX && bbox.minY <= refY && bbox.maxY >= refY;
    };
    /**
     * 属性更改后需要做的事情
     * @protected
     * @param {ShapeAttrs} targetAttrs 渲染的图像属性
     */
    AbstractShape.prototype.afterAttrsChange = function (targetAttrs) {
        _super.prototype.afterAttrsChange.call(this, targetAttrs);
        this.clearCacheBBox();
    };
    // 计算包围盒时，需要缓存，这是一个高频的操作
    AbstractShape.prototype.getBBox = function () {
        var bbox = this.cfg.bbox;
        if (!bbox) {
            bbox = this.calculateBBox();
            this.set('bbox', bbox);
        }
        return bbox;
    };
    // 计算相对于画布的包围盒
    AbstractShape.prototype.getCanvasBBox = function () {
        var canvasBBox = this.cfg.canvasBBox;
        if (!canvasBBox) {
            canvasBBox = this.calculateCanvasBBox();
            this.set('canvasBBox', canvasBBox);
        }
        return canvasBBox;
    };
    AbstractShape.prototype.applyMatrix = function (matrix) {
        _super.prototype.applyMatrix.call(this, matrix);
        // 清理掉缓存的包围盒
        this.set('canvasBBox', null);
    };
    /**
     * 计算相对于画布的包围盒，默认等同于 bbox
     * @return {BBox} 包围盒
     */
    AbstractShape.prototype.calculateCanvasBBox = function () {
        var bbox = this.getBBox();
        var totalMatrix = this.getTotalMatrix();
        var minX = bbox.minX, minY = bbox.minY, maxX = bbox.maxX, maxY = bbox.maxY;
        if (totalMatrix) {
            var topLeft = matrix_1.multiplyVec2(totalMatrix, [bbox.minX, bbox.minY]);
            var topRight = matrix_1.multiplyVec2(totalMatrix, [bbox.maxX, bbox.minY]);
            var bottomLeft = matrix_1.multiplyVec2(totalMatrix, [bbox.minX, bbox.maxY]);
            var bottomRight = matrix_1.multiplyVec2(totalMatrix, [bbox.maxX, bbox.maxY]);
            minX = Math.min(topLeft[0], topRight[0], bottomLeft[0], bottomRight[0]);
            maxX = Math.max(topLeft[0], topRight[0], bottomLeft[0], bottomRight[0]);
            minY = Math.min(topLeft[1], topRight[1], bottomLeft[1], bottomRight[1]);
            maxY = Math.max(topLeft[1], topRight[1], bottomLeft[1], bottomRight[1]);
        }
        var attrs = this.attrs;
        // 如果存在 shadow 则计算 shadow
        if (attrs.shadowColor) {
            var _a = attrs.shadowBlur, shadowBlur = _a === void 0 ? 0 : _a, _b = attrs.shadowOffsetX, shadowOffsetX = _b === void 0 ? 0 : _b, _c = attrs.shadowOffsetY, shadowOffsetY = _c === void 0 ? 0 : _c;
            var shadowLeft = minX - shadowBlur + shadowOffsetX;
            var shadowRight = maxX + shadowBlur + shadowOffsetX;
            var shadowTop = minY - shadowBlur + shadowOffsetY;
            var shadowBottom = maxY + shadowBlur + shadowOffsetY;
            minX = Math.min(minX, shadowLeft);
            maxX = Math.max(maxX, shadowRight);
            minY = Math.min(minY, shadowTop);
            maxY = Math.max(maxY, shadowBottom);
        }
        return {
            x: minX,
            y: minY,
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY,
            width: maxX - minX,
            height: maxY - minY,
        };
    };
    /**
     * @protected
     * 清理缓存的 bbox
     */
    AbstractShape.prototype.clearCacheBBox = function () {
        this.set('bbox', null);
        this.set('canvasBBox', null);
    };
    // 实现接口
    AbstractShape.prototype.isClipShape = function () {
        return this.get('isClipShape');
    };
    /**
     * @protected
     * 不同的图形自己实现是否在图形内部的逻辑，要判断边和填充区域
     * @param  {number}  refX 相对于图形的坐标 x
     * @param  {number}  refY 相对于图形的坐标 Y
     * @return {boolean} 点是否在图形内部
     */
    AbstractShape.prototype.isInShape = function (refX, refY) {
        return false;
    };
    /**
     * 是否仅仅使用 BBox 检测就可以判定拾取到图形
     * 默认是 false，但是有些图形例如 image、marker 等都可直接使用 BBox 的检测而不需要使用图形拾取
     * @return {Boolean} 仅仅使用 BBox 进行拾取
     */
    AbstractShape.prototype.isOnlyHitBox = function () {
        return false;
    };
    // 不同的 Shape 各自实现
    AbstractShape.prototype.isHit = function (x, y) {
        var startArrowShape = this.get('startArrowShape');
        var endArrowShape = this.get('endArrowShape');
        var vec = [x, y, 1];
        vec = this.invertFromMatrix(vec);
        var refX = vec[0], refY = vec[1];
        var inBBox = this._isInBBox(refX, refY);
        // 跳过图形的拾取，在某些图形中可以省略一倍的检测成本
        if (this.isOnlyHitBox()) {
            return inBBox;
        }
        // 被裁减掉的和不在包围盒内的不进行计算
        if (inBBox && !this.isClipped(refX, refY)) {
            // 对图形进行拾取判断
            if (this.isInShape(refX, refY)) {
                return true;
            }
            // 对起始箭头进行拾取判断
            if (startArrowShape && startArrowShape.isHit(refX, refY)) {
                return true;
            }
            // 对结束箭头进行拾取判断
            if (endArrowShape && endArrowShape.isHit(refX, refY)) {
                return true;
            }
        }
        return false;
    };
    return AbstractShape;
}(element_1.default));
exports.default = AbstractShape;
//# sourceMappingURL=shape.js.map