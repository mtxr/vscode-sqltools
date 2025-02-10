import { __extends } from "tslib";
import { each } from '@antv/util';
import MaskBase from './base';
/**
 * 生成 mask 的路径
 * @param points
 * @returns
 */
export function getMaskPath(points) {
    var path = [];
    if (points.length) {
        each(points, function (point, index) {
            if (index === 0) {
                path.push(['M', point.x, point.y]);
            }
            else {
                path.push(['L', point.x, point.y]);
            }
        });
        path.push(['L', points[0].x, points[0].y]);
    }
    return path;
}
export function getMaskAttrs(points) {
    return {
        path: getMaskPath(points),
    };
}
/**
 * @ignore
 * 多个点构成的 Path 辅助框 Action
 */
var PathMask = /** @class */ (function (_super) {
    __extends(PathMask, _super);
    function PathMask() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PathMask.prototype.getMaskPath = function () {
        return getMaskPath(this.points);
    };
    PathMask.prototype.getMaskAttrs = function () {
        return getMaskAttrs(this.points);
    };
    /**
     * 添加一个点
     */
    PathMask.prototype.addPoint = function () {
        this.resize();
    };
    return PathMask;
}(MaskBase));
export default PathMask;
//# sourceMappingURL=path.js.map