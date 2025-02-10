"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var color_util_1 = require("@antv/color-util");
var util_1 = require("@antv/util");
var base_1 = require("./base");
var Color = /** @class */ (function (_super) {
    tslib_1.__extends(Color, _super);
    function Color(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.type = 'color';
        _this.names = ['color'];
        if ((0, util_1.isString)(_this.values)) {
            _this.linear = true;
        }
        _this.gradient = color_util_1.default.gradient(_this.values);
        return _this;
    }
    /**
     * @override
     */
    Color.prototype.getLinearValue = function (percent) {
        return this.gradient(percent);
    };
    return Color;
}(base_1.default));
exports.default = Color;
//# sourceMappingURL=color.js.map