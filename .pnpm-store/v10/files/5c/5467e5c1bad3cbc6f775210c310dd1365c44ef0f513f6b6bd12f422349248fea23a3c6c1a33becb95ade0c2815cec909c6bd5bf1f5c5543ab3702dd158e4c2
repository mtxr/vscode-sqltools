"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("./base");
/**
 * 分段度量
 */
var Quantize = /** @class */ (function (_super) {
    tslib_1.__extends(Quantize, _super);
    function Quantize() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'quantize';
        return _this;
    }
    Quantize.prototype.invert = function (value) {
        var ticks = this.ticks;
        var length = ticks.length;
        var percent = this.getInvertPercent(value);
        var minIndex = Math.floor(percent * (length - 1));
        // 最后一个
        if (minIndex >= length - 1) {
            return util_1.last(ticks);
        }
        // 超出左边界， 则取第一个
        if (minIndex < 0) {
            return util_1.head(ticks);
        }
        var minTick = ticks[minIndex];
        var nextTick = ticks[minIndex + 1];
        // 比当前值小的 tick 在度量上的占比
        var minIndexPercent = minIndex / (length - 1);
        var maxIndexPercent = (minIndex + 1) / (length - 1);
        return minTick + (percent - minIndexPercent) / (maxIndexPercent - minIndexPercent) * (nextTick - minTick);
    };
    Quantize.prototype.initCfg = function () {
        this.tickMethod = 'r-pretty';
        this.tickCount = 5;
        this.nice = true;
    };
    Quantize.prototype.calculateTicks = function () {
        var ticks = _super.prototype.calculateTicks.call(this);
        if (!this.nice) { // 如果 nice = false ,补充 min, max
            if (util_1.last(ticks) !== this.max) {
                ticks.push(this.max);
            }
            if (util_1.head(ticks) !== this.min) {
                ticks.unshift(this.min);
            }
        }
        return ticks;
    };
    // 计算当前值在刻度中的占比
    Quantize.prototype.getScalePercent = function (value) {
        var ticks = this.ticks;
        // 超出左边界
        if (value < util_1.head(ticks)) {
            return 0;
        }
        // 超出右边界
        if (value > util_1.last(ticks)) {
            return 1;
        }
        var minIndex = 0;
        util_1.each(ticks, function (tick, index) {
            if (value >= tick) {
                minIndex = index;
            }
            else {
                return false;
            }
        });
        return minIndex / (ticks.length - 1);
    };
    return Quantize;
}(base_1.default));
exports.default = Quantize;
//# sourceMappingURL=quantize.js.map