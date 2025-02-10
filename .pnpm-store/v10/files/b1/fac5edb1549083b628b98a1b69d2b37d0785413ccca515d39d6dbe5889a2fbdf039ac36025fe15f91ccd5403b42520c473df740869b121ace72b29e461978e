import { __read, __spreadArray } from "tslib";
import { DIRECTION } from '../../constant';
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
        var _a = __read(padding, 4), top = _a[0], right = _a[1], bottom = _a[2], left = _a[3];
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
        var _a = __read(padding, 4), top = _a[0], right = _a[1], bottom = _a[2], left = _a[3];
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
            case DIRECTION.TOP:
            case DIRECTION.TOP_LEFT:
            case DIRECTION.TOP_RIGHT:
                this.top += height;
                break;
            case DIRECTION.RIGHT:
            case DIRECTION.RIGHT_TOP:
            case DIRECTION.RIGHT_BOTTOM:
                this.right += width;
                break;
            case DIRECTION.BOTTOM:
            case DIRECTION.BOTTOM_LEFT:
            case DIRECTION.BOTTOM_RIGHT:
                this.bottom += height;
                break;
            case DIRECTION.LEFT:
            case DIRECTION.LEFT_TOP:
            case DIRECTION.LEFT_BOTTOM:
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
        return new (PaddingCal.bind.apply(PaddingCal, __spreadArray([void 0], __read(this.getPadding()), false)))();
    };
    return PaddingCal;
}());
export { PaddingCal };
//# sourceMappingURL=padding-cal.js.map