import { __extends } from "tslib";
import { isNumber } from '@antv/util';
import Base from '../base';
/**
 * identity scale原则上是定义域和值域一致，scale/invert方法也是一致的
 * 参考R的实现：https://github.com/r-lib/scales/blob/master/R/pal-identity.r
 * 参考d3的实现（做了下转型）：https://github.com/d3/d3-scale/blob/master/src/identity.js
 */
var Identity = /** @class */ (function (_super) {
    __extends(Identity, _super);
    function Identity() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'identity';
        _this.isIdentity = true;
        return _this;
    }
    Identity.prototype.calculateTicks = function () {
        return this.values;
    };
    Identity.prototype.scale = function (value) {
        // 如果传入的值不等于 identity 的值，则直接返回，用于一维图时的 dodge
        if (this.values[0] !== value && isNumber(value)) {
            return value;
        }
        return this.range[0];
    };
    Identity.prototype.invert = function (value) {
        var range = this.range;
        if (value < range[0] || value > range[1]) {
            return NaN;
        }
        return this.values[0];
    };
    return Identity;
}(Base));
export default Identity;
//# sourceMappingURL=index.js.map