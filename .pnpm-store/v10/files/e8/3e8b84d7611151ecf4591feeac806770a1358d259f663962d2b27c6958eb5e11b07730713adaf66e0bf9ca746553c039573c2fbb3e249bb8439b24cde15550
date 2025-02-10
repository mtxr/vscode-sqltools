import { __extends } from "tslib";
import Continuous from './base';
/**
 * 线性度量
 * @class
 */
var Linear = /** @class */ (function (_super) {
    __extends(Linear, _super);
    function Linear() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'linear';
        _this.isLinear = true;
        return _this;
    }
    Linear.prototype.invert = function (value) {
        var percent = this.getInvertPercent(value);
        return this.min + percent * (this.max - this.min);
    };
    Linear.prototype.initCfg = function () {
        this.tickMethod = 'wilkinson-extended';
        this.nice = false;
    };
    return Linear;
}(Continuous));
export default Linear;
//# sourceMappingURL=linear.js.map