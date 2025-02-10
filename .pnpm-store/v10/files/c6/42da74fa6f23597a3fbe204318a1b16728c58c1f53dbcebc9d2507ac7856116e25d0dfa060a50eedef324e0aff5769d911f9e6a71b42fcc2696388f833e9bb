"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("./base");
/**
 * 线性度量
 * @class
 */
var Linear = /** @class */ (function (_super) {
    tslib_1.__extends(Linear, _super);
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
}(base_1.default));
exports.default = Linear;
//# sourceMappingURL=linear.js.map