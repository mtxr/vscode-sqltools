"use strict";
/**
 * @fileoverview 圆
 * @author dxq613@gmail.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("./base");
var util_1 = require("../util/util");
var Circle = /** @class */ (function (_super) {
    tslib_1.__extends(Circle, _super);
    function Circle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Circle.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, attrs), { x: 0, y: 0, r: 0 });
    };
    Circle.prototype.isInStrokeOrPath = function (x, y, isStroke, isFill, lineWidth) {
        var attrs = this.attr();
        var cx = attrs.x;
        var cy = attrs.y;
        var r = attrs.r;
        var halfLineWidth = lineWidth / 2;
        var absDistance = util_1.distance(cx, cy, x, y);
        // 直接用距离，如果同时存在边和填充时，可以减少两次计算
        if (isFill && isStroke) {
            return absDistance <= r + halfLineWidth;
        }
        if (isFill) {
            return absDistance <= r;
        }
        if (isStroke) {
            return absDistance >= r - halfLineWidth && absDistance <= r + halfLineWidth;
        }
        return false;
    };
    Circle.prototype.createPath = function (context) {
        var attrs = this.attr();
        var cx = attrs.x;
        var cy = attrs.y;
        var r = attrs.r;
        context.beginPath();
        context.arc(cx, cy, r, 0, Math.PI * 2, false);
        context.closePath();
    };
    return Circle;
}(base_1.default));
exports.default = Circle;
//# sourceMappingURL=circle.js.map