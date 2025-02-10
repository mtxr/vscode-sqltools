"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("./base");
var Position = /** @class */ (function (_super) {
    tslib_1.__extends(Position, _super);
    function Position(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.names = ['x', 'y'];
        _this.type = 'position';
        return _this;
    }
    Position.prototype.mapping = function (x, y) {
        var _a = this.scales, scaleX = _a[0], scaleY = _a[1];
        if ((0, util_1.isNil)(x) || (0, util_1.isNil)(y)) {
            return [];
        }
        return [
            (0, util_1.isArray)(x) ? x.map(function (xi) { return scaleX.scale(xi); }) : scaleX.scale(x),
            (0, util_1.isArray)(y) ? y.map(function (yi) { return scaleY.scale(yi); }) : scaleY.scale(y),
        ];
    };
    return Position;
}(base_1.default));
exports.default = Position;
//# sourceMappingURL=position.js.map