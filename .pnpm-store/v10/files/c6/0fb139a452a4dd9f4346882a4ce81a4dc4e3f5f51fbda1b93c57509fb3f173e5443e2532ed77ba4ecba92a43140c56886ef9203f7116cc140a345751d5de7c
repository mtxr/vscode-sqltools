"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaskAttrs = exports.getMaskPath = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = tslib_1.__importDefault(require("./base"));
/**
 * 生成 mask 的路径
 * @param points
 * @returns
 */
function getMaskPath(points) {
    var path = [];
    if (points.length) {
        (0, util_1.each)(points, function (point, index) {
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
exports.getMaskPath = getMaskPath;
function getMaskAttrs(points) {
    return {
        path: getMaskPath(points),
    };
}
exports.getMaskAttrs = getMaskAttrs;
/**
 * @ignore
 * 多个点构成的 Path 辅助框 Action
 */
var PathMask = /** @class */ (function (_super) {
    tslib_1.__extends(PathMask, _super);
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
}(base_1.default));
exports.default = PathMask;
//# sourceMappingURL=path.js.map