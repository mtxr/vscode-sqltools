import { __extends } from "tslib";
import MultipleRectMask from './rect';
import { getRegion } from '../dim-rect';
/**
 * @ignore
 */
var DimRectMultiMask = /** @class */ (function (_super) {
    __extends(DimRectMultiMask, _super);
    function DimRectMultiMask() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dim = 'x';
        _this.inPlot = true;
        return _this;
    }
    DimRectMultiMask.prototype.getRegion = function (points) {
        var coord = this.context.view.getCoordinate();
        return getRegion(points, this.dim, this.inPlot, coord);
    };
    return DimRectMultiMask;
}(MultipleRectMask));
export default DimRectMultiMask;
//# sourceMappingURL=dim-rect.js.map