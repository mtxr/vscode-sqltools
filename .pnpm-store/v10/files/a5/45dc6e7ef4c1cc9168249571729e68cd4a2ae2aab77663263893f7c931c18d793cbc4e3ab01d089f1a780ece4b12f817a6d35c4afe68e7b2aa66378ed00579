"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rect_1 = tslib_1.__importDefault(require("./rect"));
var dim_rect_1 = require("../dim-rect");
/**
 * @ignore
 */
var DimRectMultiMask = /** @class */ (function (_super) {
    tslib_1.__extends(DimRectMultiMask, _super);
    function DimRectMultiMask() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dim = 'x';
        _this.inPlot = true;
        return _this;
    }
    DimRectMultiMask.prototype.getRegion = function (points) {
        var coord = this.context.view.getCoordinate();
        return (0, dim_rect_1.getRegion)(points, this.dim, this.inPlot, coord);
    };
    return DimRectMultiMask;
}(rect_1.default));
exports.default = DimRectMultiMask;
//# sourceMappingURL=dim-rect.js.map