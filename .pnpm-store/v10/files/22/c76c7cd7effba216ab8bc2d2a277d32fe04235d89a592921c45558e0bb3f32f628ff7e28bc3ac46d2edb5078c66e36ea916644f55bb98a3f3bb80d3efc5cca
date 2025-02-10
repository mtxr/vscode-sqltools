"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaddingCal = void 0;
var tslib_1 = require("tslib");
var constant_1 = require("../../constant");
/** @ignore */
var PaddingCal = /** @class */ (function () {
    /**
     * 初始的 padding 数据
     * @param top
     * @param right
     * @param bottom
     * @param left
     */
    function PaddingCal(top, right, bottom, left) {
        if (top === void 0) { top = 0; }
        if (right === void 0) { right = 0; }
        if (bottom === void 0) { bottom = 0; }
        if (left === void 0) { left = 0; }
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
    /**
     * 使用静态方法创建一个
     * @param top
     * @param right
     * @param bottom
     * @param left
     */
    PaddingCal.instance = function (top, right, bottom, left) {
        if (top === void 0) { top = 0; }
        if (right === void 0) { right = 0; }
        if (bottom === void 0) { bottom = 0; }
        if (left === void 0) { left = 0; }
        return new PaddingCal(top, right, bottom, left);
    };
    /**
     * 取最大区间
     * @param padding
     */
    PaddingCal.prototype.max = function (padding) {
        var _a = tslib_1.__read(padding, 4), top = _a[0], right = _a[1], bottom = _a[2], left = _a[3];
        this.top = Math.max(this.top, top);
        this.right = Math.max(this.right, right);
        this.bottom = Math.max(this.bottom, bottom);
        this.left = Math.max(this.left, left);
        return this;
    };
    /**
     * 四周增加 padding
     * @param padding
     */
    PaddingCal.prototype.shrink = function (padding) {
        var _a = tslib_1.__read(padding, 4), top = _a[0], right = _a[1], bottom = _a[2], left = _a[3];
        this.top += top;
        this.right += right;
        this.bottom += bottom;
        this.left += left;
        return this;
    };
    /**
     * 在某一个方向增加 padding
     * @param bbox
     * @param direction
     */
    PaddingCal.prototype.inc = function (bbox, direction) {
        var width = bbox.width, height = bbox.height;
        switch (direction) {
            case constant_1.DIRECTION.TOP:
            case constant_1.DIRECTION.TOP_LEFT:
            case constant_1.DIRECTION.TOP_RIGHT:
                this.top += height;
                break;
            case constant_1.DIRECTION.RIGHT:
            case constant_1.DIRECTION.RIGHT_TOP:
            case constant_1.DIRECTION.RIGHT_BOTTOM:
                this.right += width;
                break;
            case constant_1.DIRECTION.BOTTOM:
            case constant_1.DIRECTION.BOTTOM_LEFT:
            case constant_1.DIRECTION.BOTTOM_RIGHT:
                this.bottom += height;
                break;
            case constant_1.DIRECTION.LEFT:
            case constant_1.DIRECTION.LEFT_TOP:
            case constant_1.DIRECTION.LEFT_BOTTOM:
                this.left += width;
                break;
            default:
                break;
        }
        return this;
    };
    /**
     * 获得最终的 padding
     */
    PaddingCal.prototype.getPadding = function () {
        return [this.top, this.right, this.bottom, this.left];
    };
    /**
     * clone 一个 padding cal
     */
    PaddingCal.prototype.clone = function () {
        return new (PaddingCal.bind.apply(PaddingCal, tslib_1.__spreadArray([void 0], tslib_1.__read(this.getPadding()), false)))();
    };
    return PaddingCal;
}());
exports.PaddingCal = PaddingCal;
//# sourceMappingURL=padding-cal.js.map