import { __extends } from "tslib";
import MultipleMaskBase from './base';
import { getRegion, getMaskAttrs } from '../rect';
/**
 * @ignore
 * 矩形的辅助框 Action
 */
var RectMultiMask = /** @class */ (function (_super) {
    __extends(RectMultiMask, _super);
    function RectMultiMask() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.shapeType = 'rect';
        return _this;
    }
    RectMultiMask.prototype.getRegion = function (points) {
        return getRegion(points);
    };
    RectMultiMask.prototype.getMaskAttrs = function (points) {
        var _a = this.getRegion(points), start = _a.start, end = _a.end;
        return getMaskAttrs(start, end);
    };
    return RectMultiMask;
}(MultipleMaskBase));
export default RectMultiMask;
//# sourceMappingURL=rect.js.map