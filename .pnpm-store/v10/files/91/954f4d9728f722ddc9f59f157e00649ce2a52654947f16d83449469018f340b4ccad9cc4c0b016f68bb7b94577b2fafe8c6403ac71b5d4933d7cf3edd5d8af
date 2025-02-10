import { __extends } from "tslib";
import colorUtil from '@antv/color-util';
import { isString } from '@antv/util';
import Attribute from './base';
var Color = /** @class */ (function (_super) {
    __extends(Color, _super);
    function Color(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.type = 'color';
        _this.names = ['color'];
        if (isString(_this.values)) {
            _this.linear = true;
        }
        _this.gradient = colorUtil.gradient(_this.values);
        return _this;
    }
    /**
     * @override
     */
    Color.prototype.getLinearValue = function (percent) {
        return this.gradient(percent);
    };
    return Color;
}(Attribute));
export default Color;
//# sourceMappingURL=color.js.map