"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaskAttrs = exports.getRegion = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = tslib_1.__importDefault(require("./base"));
function getRegion(points) {
    return {
        start: (0, util_1.head)(points),
        end: (0, util_1.last)(points),
    };
}
exports.getRegion = getRegion;
/**
 * 添加图形
 * @param points
 * @returns
 */
function getMaskAttrs(start, end) {
    var x = Math.min(start.x, end.x);
    var y = Math.min(start.y, end.y);
    var width = Math.abs(end.x - start.x);
    var height = Math.abs(end.y - start.y);
    return {
        x: x,
        y: y,
        width: width,
        height: height,
    };
}
exports.getMaskAttrs = getMaskAttrs;
/**
 * @ignore
 * 矩形的辅助框 Action
 */
var RectMask = /** @class */ (function (_super) {
    tslib_1.__extends(RectMask, _super);
    function RectMask() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.shapeType = 'rect';
        return _this;
    }
    RectMask.prototype.getRegion = function () {
        return getRegion(this.points);
    };
    RectMask.prototype.getMaskAttrs = function () {
        var _a = this.getRegion(), start = _a.start, end = _a.end;
        return getMaskAttrs(start, end);
    };
    return RectMask;
}(base_1.default));
exports.default = RectMask;
//# sourceMappingURL=rect.js.map