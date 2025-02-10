import { __read } from "tslib";
import { each } from '@antv/util';
import { DIRECTION } from '../constant';
/**
 * 用于包围盒计算。
 */
var BBox = /** @class */ (function () {
    function BBox(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
    BBox.fromRange = function (minX, minY, maxX, maxY) {
        return new BBox(minX, minY, maxX - minX, maxY - minY);
    };
    BBox.fromObject = function (bbox) {
        return new BBox(bbox.minX, bbox.minY, bbox.width, bbox.height);
    };
    Object.defineProperty(BBox.prototype, "minX", {
        get: function () {
            return this.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BBox.prototype, "maxX", {
        get: function () {
            return this.x + this.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BBox.prototype, "minY", {
        get: function () {
            return this.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BBox.prototype, "maxY", {
        get: function () {
            return this.y + this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BBox.prototype, "tl", {
        get: function () {
            return { x: this.x, y: this.y };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BBox.prototype, "tr", {
        get: function () {
            return { x: this.maxX, y: this.y };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BBox.prototype, "bl", {
        get: function () {
            return { x: this.x, y: this.maxY };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BBox.prototype, "br", {
        get: function () {
            return { x: this.maxX, y: this.maxY };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BBox.prototype, "top", {
        get: function () {
            return {
                x: this.x + this.width / 2,
                y: this.minY,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BBox.prototype, "right", {
        get: function () {
            return {
                x: this.maxX,
                y: this.y + this.height / 2,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BBox.prototype, "bottom", {
        get: function () {
            return {
                x: this.x + this.width / 2,
                y: this.maxY,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BBox.prototype, "left", {
        get: function () {
            return {
                x: this.minX,
                y: this.y + this.height / 2,
            };
        },
        enumerable: false,
        configurable: true
    });
    // end 计算属性
    /**
     * 包围盒是否相等
     * @param {BBox} bbox 包围盒
     * @returns      包围盒是否相等
     */
    BBox.prototype.isEqual = function (bbox) {
        return this.x === bbox.x && this.y === bbox.y && this.width === bbox.width && this.height === bbox.height;
    };
    /**
     * 是否包含了另一个包围盒
     * @param child
     */
    BBox.prototype.contains = function (child) {
        return child.minX >= this.minX && child.maxX <= this.maxX && child.minY >= this.minY && child.maxY <= this.maxY;
    };
    /**
     * 克隆包围盒
     * @returns 包围盒
     */
    BBox.prototype.clone = function () {
        return new BBox(this.x, this.y, this.width, this.height);
    };
    /**
     * 取并集
     * @param subBBox
     */
    BBox.prototype.add = function () {
        var subBBox = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            subBBox[_i] = arguments[_i];
        }
        var bbox = this.clone();
        each(subBBox, function (b) {
            bbox.x = Math.min(b.x, bbox.x);
            bbox.y = Math.min(b.y, bbox.y);
            bbox.width = Math.max(b.maxX, bbox.maxX) - bbox.x;
            bbox.height = Math.max(b.maxY, bbox.maxY) - bbox.y;
        });
        return bbox;
    };
    /**
     * 取交集
     * @param subBBox
     */
    BBox.prototype.merge = function () {
        var subBBox = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            subBBox[_i] = arguments[_i];
        }
        var bbox = this.clone();
        each(subBBox, function (b) {
            bbox.x = Math.max(b.x, bbox.x);
            bbox.y = Math.max(b.y, bbox.y);
            bbox.width = Math.min(b.maxX, bbox.maxX) - bbox.x;
            bbox.height = Math.min(b.maxY, bbox.maxY) - bbox.y;
        });
        return bbox;
    };
    /**
     * bbox 剪裁
     * @param subBBox
     * @param direction
     */
    BBox.prototype.cut = function (subBBox, direction) {
        var width = subBBox.width;
        var height = subBBox.height;
        switch (direction) {
            case DIRECTION.TOP:
            case DIRECTION.TOP_LEFT:
            case DIRECTION.TOP_RIGHT:
                return BBox.fromRange(this.minX, this.minY + height, this.maxX, this.maxY);
            case DIRECTION.RIGHT:
            case DIRECTION.RIGHT_TOP:
            case DIRECTION.RIGHT_BOTTOM:
                return BBox.fromRange(this.minX, this.minY, this.maxX - width, this.maxY);
            case DIRECTION.BOTTOM:
            case DIRECTION.BOTTOM_LEFT:
            case DIRECTION.BOTTOM_RIGHT:
                return BBox.fromRange(this.minX, this.minY, this.maxX, this.maxY - height);
            case DIRECTION.LEFT:
            case DIRECTION.LEFT_TOP:
            case DIRECTION.LEFT_BOTTOM:
                return BBox.fromRange(this.minX + width, this.minY, this.maxX, this.maxY);
            default:
                // 其他情况不裁剪，原样返回
                return this;
        }
    };
    /**
     * 收缩形成新的
     * @param gap
     */
    BBox.prototype.shrink = function (gap) {
        var _a = __read(gap, 4), top = _a[0], right = _a[1], bottom = _a[2], left = _a[3];
        return new BBox(this.x + left, this.y + top, this.width - left - right, this.height - top - bottom);
    };
    /**
     * 扩张形成新的
     * @param gap
     */
    BBox.prototype.expand = function (gap) {
        var _a = __read(gap, 4), top = _a[0], right = _a[1], bottom = _a[2], left = _a[3];
        return new BBox(this.x - left, this.y - top, this.width + left + right, this.height + top + bottom);
    };
    /**
     * get the gap of two bbox, if not exceed, then 0
     * @param bbox
     * @returns [top, right, bottom, left]
     */
    BBox.prototype.exceed = function (bbox) {
        return [
            Math.max(-this.minY + bbox.minY, 0),
            Math.max(this.maxX - bbox.maxX, 0),
            Math.max(this.maxY - bbox.maxY, 0),
            Math.max(-this.minX + bbox.minX, 0),
        ];
    };
    /**
     * 是否碰撞
     * @param bbox
     */
    BBox.prototype.collide = function (bbox) {
        return this.minX < bbox.maxX && this.maxX > bbox.minX && this.minY < bbox.maxY && this.maxY > bbox.minY;
    };
    /**
     * 获取包围盒大小
     * @returns 包围盒大小
     */
    BBox.prototype.size = function () {
        return this.width * this.height;
    };
    /**
     * 点是否在 bbox 中
     * @param p
     */
    BBox.prototype.isPointIn = function (p) {
        return p.x >= this.minX && p.x <= this.maxX && p.y >= this.minY && p.y <= this.maxY;
    };
    return BBox;
}());
export { BBox };
/**
 * 从一个 bbox 的 region 获取 bbox
 * @param bbox
 * @param region
 */
export var getRegionBBox = function (bbox, region) {
    var start = region.start, end = region.end;
    return new BBox(bbox.x + bbox.width * start.x, bbox.y + bbox.height * start.y, bbox.width * Math.abs(end.x - start.x), bbox.height * Math.abs(end.y - start.y));
};
/**
 * 将 bbox 转换成 points
 * @param bbox
 */
export function toPoints(bbox) {
    return [
        [bbox.minX, bbox.minY],
        [bbox.maxX, bbox.minY],
        [bbox.maxX, bbox.maxY],
        [bbox.minX, bbox.maxY],
    ];
}
//# sourceMappingURL=bbox.js.map