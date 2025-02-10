import { __extends } from "tslib";
import { filter, getRange, head, isNil, last } from '@antv/util';
import Base from '../base';
/**
 * 连续度量的基类
 * @class
 */
var Continuous = /** @class */ (function (_super) {
    __extends(Continuous, _super);
    function Continuous() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isContinuous = true;
        return _this;
    }
    Continuous.prototype.scale = function (value) {
        if (isNil(value)) {
            return NaN;
        }
        var rangeMin = this.rangeMin();
        var rangeMax = this.rangeMax();
        var max = this.max;
        var min = this.min;
        if (max === min) {
            return rangeMin;
        }
        var percent = this.getScalePercent(value);
        return rangeMin + percent * (rangeMax - rangeMin);
    };
    Continuous.prototype.init = function () {
        _super.prototype.init.call(this);
        // init 完成后保证 min, max 包含 ticks 的范围
        var ticks = this.ticks;
        var firstTick = head(ticks);
        var lastTick = last(ticks);
        if (firstTick < this.min) {
            this.min = firstTick;
        }
        if (lastTick > this.max) {
            this.max = lastTick;
        }
        // strict-limit 方式
        if (!isNil(this.minLimit)) {
            this.min = firstTick;
        }
        if (!isNil(this.maxLimit)) {
            this.max = lastTick;
        }
    };
    Continuous.prototype.setDomain = function () {
        var _a = getRange(this.values), min = _a.min, max = _a.max;
        if (isNil(this.min)) {
            this.min = min;
        }
        if (isNil(this.max)) {
            this.max = max;
        }
        if (this.min > this.max) {
            this.min = min;
            this.max = max;
        }
    };
    Continuous.prototype.calculateTicks = function () {
        var _this = this;
        var ticks = _super.prototype.calculateTicks.call(this);
        if (!this.nice) {
            ticks = filter(ticks, function (tick) {
                return tick >= _this.min && tick <= _this.max;
            });
        }
        return ticks;
    };
    // 计算原始值值占的百分比
    Continuous.prototype.getScalePercent = function (value) {
        var max = this.max;
        var min = this.min;
        return (value - min) / (max - min);
    };
    Continuous.prototype.getInvertPercent = function (value) {
        return (value - this.rangeMin()) / (this.rangeMax() - this.rangeMin());
    };
    return Continuous;
}(Base));
export default Continuous;
//# sourceMappingURL=base.js.map