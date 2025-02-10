"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaskAttrs = exports.getMaskPath = void 0;
var tslib_1 = require("tslib");
var util_1 = require("../util");
var path_1 = tslib_1.__importDefault(require("./path"));
/**
 * 生成 mask 的路径
 * @param points
 * @returns
 */
function getMaskPath(points) {
    return (0, util_1.getSpline)(points, true);
}
exports.getMaskPath = getMaskPath;
function getMaskAttrs(points) {
    return {
        path: getMaskPath(points),
    };
}
exports.getMaskAttrs = getMaskAttrs;
/**
 * Smooth path mask
 * @ignore
 */
var SmoothPathMask = /** @class */ (function (_super) {
    tslib_1.__extends(SmoothPathMask, _super);
    function SmoothPathMask() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SmoothPathMask.prototype.getMaskPath = function () {
        return getMaskPath(this.points);
    };
    SmoothPathMask.prototype.getMaskAttrs = function () {
        return getMaskAttrs(this.points);
    };
    return SmoothPathMask;
}(path_1.default));
exports.default = SmoothPathMask;
//# sourceMappingURL=smooth-path.js.map