import { __extends } from "tslib";
import Attribute from './base';
var Shape = /** @class */ (function (_super) {
    __extends(Shape, _super);
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
}(Attribute));
export default Shape;
//# sourceMappingURL=shape.js.map