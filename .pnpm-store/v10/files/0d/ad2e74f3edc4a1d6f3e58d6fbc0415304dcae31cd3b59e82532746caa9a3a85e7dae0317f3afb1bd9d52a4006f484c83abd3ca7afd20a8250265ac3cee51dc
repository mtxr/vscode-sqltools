"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = tslib_1.__importDefault(require("./base"));
var rect_1 = require("../rect");
/**
 * @ignore
 * 矩形的辅助框 Action
 */
var RectMultiMask = /** @class */ (function (_super) {
    tslib_1.__extends(RectMultiMask, _super);
    function RectMultiMask() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.shapeType = 'rect';
        return _this;
    }
    RectMultiMask.prototype.getRegion = function (points) {
        return (0, rect_1.getRegion)(points);
    };
    RectMultiMask.prototype.getMaskAttrs = function (points) {
        var _a = this.getRegion(points), start = _a.start, end = _a.end;
        return (0, rect_1.getMaskAttrs)(start, end);
    };
    return RectMultiMask;
}(base_1.default));
exports.default = RectMultiMask;
//# sourceMappingURL=rect.js.map