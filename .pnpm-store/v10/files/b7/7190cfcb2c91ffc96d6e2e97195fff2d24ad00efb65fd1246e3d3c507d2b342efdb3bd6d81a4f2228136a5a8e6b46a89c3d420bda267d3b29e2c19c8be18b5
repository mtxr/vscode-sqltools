"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("./base");
var Shape = /** @class */ (function (_super) {
    tslib_1.__extends(Shape, _super);
    function Shape(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.type = 'shape';
        _this.names = ['shape'];
        return _this;
    }
    /**
     * @override
     */
    Shape.prototype.getLinearValue = function (percent) {
        var idx = Math.round((this.values.length - 1) * percent);
        return this.values[idx];
    };
    return Shape;
}(base_1.default));
exports.default = Shape;
//# sourceMappingURL=shape.js.map