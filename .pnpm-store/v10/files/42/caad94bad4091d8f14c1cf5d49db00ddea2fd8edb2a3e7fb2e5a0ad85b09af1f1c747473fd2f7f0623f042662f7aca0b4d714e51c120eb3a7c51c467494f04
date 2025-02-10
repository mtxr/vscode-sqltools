import { __extends } from "tslib";
import { each, head, last } from '@antv/util';
import Continuous from './base';
/**
 * 分段度量
 */
var Quantize = /** @class */ (function (_super) {
    __extends(Quantize, _super);
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
            return last(ticks);
        }
        // 超出左边界， 则取第一个
        if (minIndex < 0) {
            return head(ticks);
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
            if (last(ticks) !== this.max) {
                ticks.push(this.max);
            }
            if (head(ticks) !== this.min) {
                ticks.unshift(this.min);
            }
        }
        return ticks;
    };
    // 计算当前值在刻度中的占比
    Quantize.prototype.getScalePercent = function (value) {
        var ticks = this.ticks;
        // 超出左边界
        if (value < head(ticks)) {
            return 0;
        }
        // 超出右边界
        if (value > last(ticks)) {
            return 1;
        }
        var minIndex = 0;
        each(ticks, function (tick, index) {
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
}(Continuous));
export default Quantize;
//# sourceMappingURL=quantize.js.map