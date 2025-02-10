"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../base");
/**
 * 连续度量的基类
 * @class
 */
var Continuous = /** @class */ (function (_super) {
    tslib_1.__extends(Continuous, _super);
    function Continuous() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isContinuous = true;
        return _this;
    }
    Continuous.prototype.scale = function (value) {
        if (util_1.isNil(value)) {
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
        var firstTick = util_1.head(ticks);
        var lastTick = util_1.last(ticks);
        if (firstTick < this.min) {
            this.min = firstTick;
        }
        if (lastTick > this.max) {
            this.max = lastTick;
        }
        // strict-limit 方式
        if (!util_1.isNil(this.minLimit)) {
            this.min = firstTick;
        }
        if (!util_1.isNil(this.maxLimit)) {
            this.max = lastTick;
        }
    };
    Continuous.prototype.setDomain = function () {
        var _a = util_1.getRange(this.values), min = _a.min, max = _a.max;
        if (util_1.isNil(this.min)) {
            this.min = min;
        }
        if (util_1.isNil(this.max)) {
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
            ticks = util_1.filter(ticks, function (tick) {
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
}(base_1.default));
exports.default = Continuous;
//# sourceMappingURL=base.js.map