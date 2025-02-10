"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaskAttrs = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var util_2 = require("../util");
var base_1 = tslib_1.__importDefault(require("./base"));
function getMaskAttrs(points) {
    var currentPoint = (0, util_1.last)(points);
    var r = 0;
    var x = 0;
    var y = 0;
    if (points.length) {
        var first = points[0];
        r = (0, util_2.distance)(first, currentPoint) / 2;
        x = (currentPoint.x + first.x) / 2;
        y = (currentPoint.y + first.y) / 2;
    }
    return {
        x: x,
        y: y,
        r: r,
    };
}
exports.getMaskAttrs = getMaskAttrs;
/**
 * @ignore
 * 圆形辅助框 Action
 */
var CircleMask = /** @class */ (function (_super) {
    tslib_1.__extends(CircleMask, _super);
    function CircleMask() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.shapeType = 'circle';
        return _this;
    }
    CircleMask.prototype.getMaskAttrs = function () {
        return getMaskAttrs(this.points);
    };
    return CircleMask;
}(base_1.default));
exports.default = CircleMask;
//# sourceMappingURL=circle.js.map