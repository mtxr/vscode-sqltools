"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var math_1 = require("../util/math");
var base_1 = require("./base");
/**
 * Pow 度量，处理非均匀分布
 */
var Pow = /** @class */ (function (_super) {
    tslib_1.__extends(Pow, _super);
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
        var max = math_1.calBase(exponent, this.max);
        var min = math_1.calBase(exponent, this.min);
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
        var percent = (math_1.calBase(exponent, value) - math_1.calBase(exponent, min)) / (math_1.calBase(exponent, max) - math_1.calBase(exponent, min));
        return percent;
    };
    return Pow;
}(base_1.default));
exports.default = Pow;
//# sourceMappingURL=pow.js.map