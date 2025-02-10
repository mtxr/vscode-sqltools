import { __extends } from "tslib";
import { calBase } from '../util/math';
import Continuous from './base';
/**
 * Pow 度量，处理非均匀分布
 */
var Pow = /** @class */ (function (_super) {
    __extends(Pow, _super);
    function Pow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'pow';
        return _this;
    }
    /**
     * @override
     */
    Pow.prototype.invert = function (value) {
        var percent = this.getInvertPercent(value);
        var exponent = this.exponent;
        var max = calBase(exponent, this.max);
        var min = calBase(exponent, this.min);
        var tmp = percent * (max - min) + min;
        var factor = tmp >= 0 ? 1 : -1;
        return Math.pow(tmp, exponent) * factor;
    };
    Pow.prototype.initCfg = function () {
        this.tickMethod = 'pow';
        this.exponent = 2;
        this.tickCount = 5;
        this.nice = true;
    };
    // 获取度量计算时，value占的定义域百分比
    Pow.prototype.getScalePercent = function (value) {
        var max = this.max;
        var min = this.min;
        if (max === min) {
            return 0;
        }
        var exponent = this.exponent;
        var percent = (calBase(exponent, value) - calBase(exponent, min)) / (calBase(exponent, max) - calBase(exponent, min));
        return percent;
    };
    return Pow;
}(Continuous));
export default Pow;
//# sourceMappingURL=pow.js.map