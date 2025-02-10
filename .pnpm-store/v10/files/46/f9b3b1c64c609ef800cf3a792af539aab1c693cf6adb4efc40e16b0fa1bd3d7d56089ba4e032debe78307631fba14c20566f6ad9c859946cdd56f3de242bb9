"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var matrix_util_1 = require("@antv/matrix-util");
var util_1 = require("@antv/util");
var base_1 = require("./base");
var Polar = /** @class */ (function (_super) {
    tslib_1.__extends(Polar, _super);
    function Polar(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.isPolar = true;
        _this.type = 'polar';
        var _a = cfg.startAngle, startAngle = _a === void 0 ? -Math.PI / 2 : _a, _b = cfg.endAngle, endAngle = _b === void 0 ? (Math.PI * 3) / 2 : _b, _c = cfg.innerRadius, innerRadius = _c === void 0 ? 0 : _c, radius = cfg.radius;
        _this.startAngle = startAngle;
        _this.endAngle = endAngle;
        _this.innerRadius = innerRadius;
        _this.radius = radius;
        _this.initial();
        return _this;
    }
    Polar.prototype.initial = function () {
        _super.prototype.initial.call(this);
        while (this.endAngle < this.startAngle) {
            this.endAngle += Math.PI * 2;
        }
        var oneBox = this.getOneBox();
        var oneWidth = oneBox.maxX - oneBox.minX;
        var oneHeight = oneBox.maxY - oneBox.minY;
        var left = Math.abs(oneBox.minX) / oneWidth;
        var top = Math.abs(oneBox.minY) / oneHeight;
        var maxRadius;
        if (this.height / oneHeight > this.width / oneWidth) {
            // width 为主
            maxRadius = this.width / oneWidth;
            this.circleCenter = {
                x: this.center.x - (0.5 - left) * this.width,
                y: this.center.y - (0.5 - top) * maxRadius * oneHeight,
            };
        }
        else {
            // height 为主
            maxRadius = this.height / oneHeight;
            this.circleCenter = {
                x: this.center.x - (0.5 - left) * maxRadius * oneWidth,
                y: this.center.y - (0.5 - top) * this.height,
            };
        }
        this.polarRadius = this.radius;
        if (!this.radius) {
            this.polarRadius = maxRadius;
        }
        else if (this.radius > 0 && this.radius <= 1) {
            this.polarRadius = maxRadius * this.radius;
        }
        else if (this.radius <= 0 || this.radius > maxRadius) {
            this.polarRadius = maxRadius;
        }
        this.x = {
            start: this.startAngle,
            end: this.endAngle,
        };
        this.y = {
            start: this.innerRadius * this.polarRadius,
            end: this.polarRadius,
        };
    };
    Polar.prototype.getRadius = function () {
        return this.polarRadius;
    };
    Polar.prototype.convertPoint = function (point) {
        var _a;
        var center = this.getCenter();
        var x = point.x, y = point.y;
        if (this.isTransposed) {
            _a = [y, x], x = _a[0], y = _a[1];
        }
        x = this.convertDim(x, 'x');
        y = this.convertDim(y, 'y');
        return {
            x: center.x + Math.cos(x) * y,
            y: center.y + Math.sin(x) * y,
        };
    };
    Polar.prototype.invertPoint = function (point) {
        var _a;
        var center = this.getCenter();
        var vPoint = [point.x - center.x, point.y - center.y];
        var _b = this, startAngle = _b.startAngle, endAngle = _b.endAngle;
        if (this.isReflect('x')) {
            _a = [endAngle, startAngle], startAngle = _a[0], endAngle = _a[1];
        }
        var m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        matrix_util_1.ext.leftRotate(m, m, startAngle);
        var vStart3 = [1, 0, 0];
        matrix_util_1.vec3.transformMat3(vStart3, vStart3, m);
        var vStart2 = [vStart3[0], vStart3[1]];
        var angle = matrix_util_1.ext.angleTo(vStart2, vPoint, endAngle < startAngle);
        if (util_1.isNumberEqual(angle, Math.PI * 2)) {
            angle = 0;
        }
        var radius = matrix_util_1.vec2.length(vPoint);
        var xPercent = angle / (endAngle - startAngle);
        xPercent = endAngle - startAngle > 0 ? xPercent : -xPercent;
        var yPercent = this.invertDim(radius, 'y');
        var rst = { x: 0, y: 0 };
        rst.x = this.isTransposed ? yPercent : xPercent;
        rst.y = this.isTransposed ? xPercent : yPercent;
        return rst;
    };
    Polar.prototype.getCenter = function () {
        return this.circleCenter;
    };
    Polar.prototype.getOneBox = function () {
        var startAngle = this.startAngle;
        var endAngle = this.endAngle;
        if (Math.abs(endAngle - startAngle) >= Math.PI * 2) {
            return {
                minX: -1,
                maxX: 1,
                minY: -1,
                maxY: 1,
            };
        }
        var xs = [0, Math.cos(startAngle), Math.cos(endAngle)];
        var ys = [0, Math.sin(startAngle), Math.sin(endAngle)];
        for (var i = Math.min(startAngle, endAngle); i < Math.max(startAngle, endAngle); i += Math.PI / 18) {
            xs.push(Math.cos(i));
            ys.push(Math.sin(i));
        }
        return {
            minX: Math.min.apply(Math, xs),
            maxX: Math.max.apply(Math, xs),
            minY: Math.min.apply(Math, ys),
            maxY: Math.max.apply(Math, ys),
        };
    };
    return Polar;
}(base_1.default));
exports.default = Polar;
//# sourceMappingURL=polar.js.map