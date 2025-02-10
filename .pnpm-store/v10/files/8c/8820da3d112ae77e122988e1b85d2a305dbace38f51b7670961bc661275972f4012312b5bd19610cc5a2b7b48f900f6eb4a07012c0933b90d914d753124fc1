"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegion = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var rect_1 = tslib_1.__importDefault(require("./rect"));
function clampPoint(point) {
    point.x = (0, util_1.clamp)(point.x, 0, 1);
    point.y = (0, util_1.clamp)(point.y, 0, 1);
}
function getRegion(points, dim, inPlot, coord) {
    var start = null;
    var end = null;
    var normalStart = coord.invert((0, util_1.head)(points));
    var normalEnd = coord.invert((0, util_1.last)(points));
    if (inPlot) {
        // 约束到 0 - 1 范围内
        clampPoint(normalStart);
        clampPoint(normalEnd);
    }
    if (dim === 'x') {
        // x 轴方向扩展, y 轴方向占满全部
        start = coord.convert({
            x: normalStart.x,
            y: 0,
        });
        end = coord.convert({
            x: normalEnd.x,
            y: 1,
        });
    }
    else {
        // y 轴方向扩展, x 轴方向占满全部
        start = coord.convert({
            x: 0,
            y: normalStart.y,
        });
        end = coord.convert({
            x: 1,
            y: normalEnd.y,
        });
    }
    return {
        start: start,
        end: end,
    };
}
exports.getRegion = getRegion;
/**
 * @ignore
 */
var DimRect = /** @class */ (function (_super) {
    tslib_1.__extends(DimRect, _super);
    function DimRect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dim = 'x';
        _this.inPlot = true;
        return _this;
    }
    DimRect.prototype.getRegion = function () {
        var coord = this.context.view.getCoordinate();
        return getRegion(this.points, this.dim, this.inPlot, coord);
    };
    return DimRect;
}(rect_1.default));
exports.default = DimRect;
//# sourceMappingURL=dim-rect.js.map