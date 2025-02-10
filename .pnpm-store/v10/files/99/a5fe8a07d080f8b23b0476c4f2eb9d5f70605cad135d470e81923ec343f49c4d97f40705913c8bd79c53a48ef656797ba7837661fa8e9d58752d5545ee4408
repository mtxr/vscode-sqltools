"use strict";
/**
 * @fileoverview 椭圆
 * @author dxq613@gmail.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("./base");
// 根据椭圆公式计算 x*x/rx*rx + y*y/ry*ry;
function ellipseDistance(squareX, squareY, rx, ry) {
    return squareX / (rx * rx) + squareY / (ry * ry);
}
var Ellipse = /** @class */ (function (_super) {
    tslib_1.__extends(Ellipse, _super);
    function Ellipse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ellipse.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, attrs), { x: 0, y: 0, rx: 0, ry: 0 });
    };
    Ellipse.prototype.isInStrokeOrPath = function (x, y, isStroke, isFill, lineWidth) {
        var attrs = this.attr();
        var halfLineWith = lineWidth / 2;
        var cx = attrs.x;
        var cy = attrs.y;
        var rx = attrs.rx, ry = attrs.ry;
        var squareX = (x - cx) * (x - cx);
        var squareY = (y - cy) * (y - cy);
        // 使用椭圆的公式： x*x/rx*rx + y*y/ry*ry = 1;
        if (isFill && isStroke) {
            return ellipseDistance(squareX, squareY, rx + halfLineWith, ry + halfLineWith) <= 1;
        }
        if (isFill) {
            return ellipseDistance(squareX, squareY, rx, ry) <= 1;
        }
        if (isStroke) {
            return (ellipseDistance(squareX, squareY, rx - halfLineWith, ry - halfLineWith) >= 1 &&
                ellipseDistance(squareX, squareY, rx + halfLineWith, ry + halfLineWith) <= 1);
        }
        return false;
    };
    Ellipse.prototype.createPath = function (context) {
        var attrs = this.attr();
        var cx = attrs.x;
        var cy = attrs.y;
        var rx = attrs.rx;
        var ry = attrs.ry;
        context.beginPath();
        // 兼容逻辑
        if (context.ellipse) {
            context.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2, false);
        }
        else {
            // 如果不支持，则使用圆来绘制，进行变形
            var r = rx > ry ? rx : ry;
            var scaleX = rx > ry ? 1 : rx / ry;
            var scaleY = rx > ry ? ry / rx : 1;
            context.save();
            context.translate(cx, cy);
            context.scale(scaleX, scaleY);
            context.arc(0, 0, r, 0, Math.PI * 2);
            context.restore();
            context.closePath();
        }
    };
    return Ellipse;
}(base_1.default));
exports.default = Ellipse;
//# sourceMappingURL=ellipse.js.map