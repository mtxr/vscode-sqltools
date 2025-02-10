"use strict";
/**
 * @fileoverview 多边形
 * @author dxq613@gmail.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("./base");
var polyline_1 = require("../util/in-stroke/polyline");
var polygon_1 = require("../util/in-path/polygon");
var Polygon = /** @class */ (function (_super) {
    tslib_1.__extends(Polygon, _super);
    function Polygon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Polygon.prototype.isInStrokeOrPath = function (x, y, isStroke, isFill, lineWidth) {
        var points = this.attr().points;
        var isHit = false;
        if (isStroke) {
            isHit = polyline_1.default(points, lineWidth, x, y, true);
        }
        if (!isHit && isFill) {
            isHit = polygon_1.default(points, x, y); // isPointInPath(shape, x, y);
        }
        return isHit;
    };
    Polygon.prototype.createPath = function (context) {
        var attrs = this.attr();
        var points = attrs.points;
        if (points.length < 2) {
            return;
        }
        context.beginPath();
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (i === 0) {
                context.moveTo(point[0], point[1]);
            }
            else {
                context.lineTo(point[0], point[1]);
            }
        }
        context.closePath();
    };
    return Polygon;
}(base_1.default));
exports.default = Polygon;
//# sourceMappingURL=polygon.js.map