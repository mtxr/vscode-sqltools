import { __extends } from "tslib";
import { ext, vec2 } from '@antv/matrix-util';
import { isNumberEqual } from '@antv/util';
import Coordinate from './base';
/**
 * 螺旋坐标系
 */
var Helix = /** @class */ (function (_super) {
    __extends(Helix, _super);
    function Helix(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.isHelix = true;
        _this.type = 'helix';
        var _a = cfg.startAngle, startAngle = _a === void 0 ? 1.25 * Math.PI : _a, _b = cfg.endAngle, endAngle = _b === void 0 ? 7.25 * Math.PI : _b, _c = cfg.innerRadius, innerRadius = _c === void 0 ? 0 : _c, radius = cfg.radius;
        _this.startAngle = startAngle;
        _this.endAngle = endAngle;
        _this.innerRadius = innerRadius;
        _this.radius = radius;
        _this.initial();
        return _this;
    }
    Helix.prototype.initial = function () {
        _super.prototype.initial.call(this);
        var index = (this.endAngle - this.startAngle) / (2 * Math.PI) + 1; // 螺线圈数
        var maxRadius = Math.min(this.width, this.height) / 2;
        if (this.radius && this.radius >= 0 && this.radius <= 1) {
            maxRadius = maxRadius * this.radius;
        }
        this.d = Math.floor((maxRadius * (1 - this.innerRadius)) / index);
        this.a = this.d / (Math.PI * 2); // 螺线系数
        this.x = {
            start: this.startAngle,
            end: this.endAngle,
        };
        this.y = {
            start: this.innerRadius * maxRadius,
            end: this.innerRadius * maxRadius + this.d * 0.99,
        };
    };
    /**
     * 将百分比数据变成屏幕坐标
     * @param point 归一化的点坐标
     * @return      返回对应的屏幕坐标
     */
    Helix.prototype.convertPoint = function (point) {
        var _a;
        var x = point.x, y = point.y;
        if (this.isTransposed) {
            _a = [y, x], x = _a[0], y = _a[1];
        }
        var thi = this.convertDim(x, 'x');
        var r = this.a * thi;
        var newY = this.convertDim(y, 'y');
        return {
            x: this.center.x + Math.cos(thi) * (r + newY),
            y: this.center.y + Math.sin(thi) * (r + newY),
        };
    };
    /**
     * 将屏幕坐标点还原成百分比数据
     * @param point 屏幕坐标
     * @return      返回对应的归一化后的数据
     */
    Helix.prototype.invertPoint = function (point) {
        var _a;
        var d = this.d + this.y.start;
        var v = vec2.subtract([0, 0], [point.x, point.y], [this.center.x, this.center.y]);
        var thi = ext.angleTo(v, [1, 0], true);
        var rMin = thi * this.a; // 坐标与原点的连线在第一圈上的交点，最小r值
        if (vec2.length(v) < rMin) {
            // 坐标与原点的连线不可能小于最小r值，但不排除因小数计算产生的略小于rMin的情况
            rMin = vec2.length(v);
        }
        var index = Math.floor((vec2.length(v) - rMin) / d); // 当前点位于第index圈
        thi = 2 * index * Math.PI + thi;
        var r = this.a * thi;
        var newY = vec2.length(v) - r;
        newY = isNumberEqual(newY, 0) ? 0 : newY;
        var x = this.invertDim(thi, 'x');
        var y = this.invertDim(newY, 'y');
        x = isNumberEqual(x, 0) ? 0 : x;
        y = isNumberEqual(y, 0) ? 0 : y;
        if (this.isTransposed) {
            _a = [y, x], x = _a[0], y = _a[1];
        }
        return { x: x, y: y };
    };
    return Helix;
}(Coordinate));
export default Helix;
//# sourceMappingURL=helix.js.map