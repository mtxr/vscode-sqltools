import { __extends } from "tslib";
import { isArray, isNil } from '@antv/util';
import Attribute from './base';
var Position = /** @class */ (function (_super) {
    __extends(Position, _super);
    function Position(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.names = ['x', 'y'];
        _this.type = 'position';
        return _this;
    }
    Position.prototype.mapping = function (x, y) {
        var _a = this.scales, scaleX = _a[0], scaleY = _a[1];
        if (isNil(x) || isNil(y)) {
            return [];
        }
        return [
            isArray(x) ? x.map(function (xi) { return scaleX.scale(xi); }) : scaleX.scale(x),
            isArray(y) ? y.map(function (yi) { return scaleY.scale(yi); }) : scaleY.scale(y),
        ];
    };
    return Position;
}(Attribute));
export default Position;
//# sourceMappingURL=position.js.map