import { __extends } from "tslib";
import { getSpline } from '../util';
import PathMask from './path';
/**
 * 生成 mask 的路径
 * @param points
 * @returns
 */
export function getMaskPath(points) {
    return getSpline(points, true);
}
export function getMaskAttrs(points) {
    return {
        path: getMaskPath(points),
    };
}
/**
 * Smooth path mask
 * @ignore
 */
var SmoothPathMask = /** @class */ (function (_super) {
    __extends(SmoothPathMask, _super);
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
}(PathMask));
export default SmoothPathMask;
//# sourceMappingURL=smooth-path.js.map