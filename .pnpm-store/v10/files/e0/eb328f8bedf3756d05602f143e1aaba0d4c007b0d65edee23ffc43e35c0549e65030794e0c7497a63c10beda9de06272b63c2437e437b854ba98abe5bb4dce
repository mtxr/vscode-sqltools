import { __extends } from "tslib";
import Coordinate from './base';
/**
 * 笛卡尔坐标系
 * https://www.zhihu.com/question/20665303
 */
var Cartesian = /** @class */ (function (_super) {
    __extends(Cartesian, _super);
    function Cartesian(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.isRect = true;
        _this.type = 'cartesian';
        _this.initial();
        return _this;
    }
    Cartesian.prototype.initial = function () {
        _super.prototype.initial.call(this);
        var start = this.start;
        var end = this.end;
        this.x = {
            start: start.x,
            end: end.x,
        };
        this.y = {
            start: start.y,
            end: end.y,
        };
    };
    Cartesian.prototype.convertPoint = function (point) {
        var _a;
        var x = point.x, y = point.y;
        // 交换
        if (this.isTransposed) {
            _a = [y, x], x = _a[0], y = _a[1];
        }
        return {
            x: this.convertDim(x, 'x'),
            y: this.convertDim(y, 'y'),
        };
    };
    Cartesian.prototype.invertPoint = function (point) {
        var _a;
        var x = this.invertDim(point.x, 'x');
        var y = this.invertDim(point.y, 'y');
        if (this.isTransposed) {
            _a = [y, x], x = _a[0], y = _a[1];
        }
        return { x: x, y: y };
    };
    return Cartesian;
}(Coordinate));
export default Cartesian;
//# sourceMappingURL=cartesian.js.map