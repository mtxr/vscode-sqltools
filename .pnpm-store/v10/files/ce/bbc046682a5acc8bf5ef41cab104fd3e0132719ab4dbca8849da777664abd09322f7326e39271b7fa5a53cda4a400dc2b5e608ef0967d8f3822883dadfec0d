"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPath = void 0;
var util_1 = require("@antv/util");
var base_1 = require("../base");
var get_path_points_1 = require("../util/get-path-points");
var get_style_1 = require("../util/get-style");
var path_1 = require("../util/path");
var split_points_1 = require("../util/split-points");
var util_2 = require("./util");
function getShapeAttrs(cfg, smooth, constraint) {
    var isStack = cfg.isStack, connectNulls = cfg.connectNulls, isInCircle = cfg.isInCircle, showSinglePoint = cfg.showSinglePoint;
    var shapeAttrs = (0, get_style_1.getStyle)(cfg, true, false, 'lineWidth');
    var points = (0, get_path_points_1.getPathPoints)(cfg.points, connectNulls, showSinglePoint); // 根据 connectNulls 值处理 points
    var path = [];
    for (var i = 0, len = points.length; i < len; i++) {
        var eachLinePoints = points[i];
        path = path.concat(getPath(eachLinePoints, isInCircle, isStack, smooth, constraint, shapeAttrs));
    }
    shapeAttrs.path = path;
    return shapeAttrs;
}
// 单条 path
function getSinglePath(points, isInCircle, smooth, constraint, style) {
    if (points.length === 1) {
        // 只有一个点时
        return [
            ['M', points[0].x, points[0].y - style.lineWidth / 2],
            ['L', points[0].x, points[0].y],
            ['L', points[0].x, points[0].y + style.lineWidth / 2],
        ];
    }
    var path;
    if (!smooth) {
        path = (0, path_1.getLinePath)(points, false);
        if (isInCircle) {
            path.push(['Z']);
        }
    }
    else {
        // 直角坐标系下绘制曲线时限制最大值、最小值
        if (isInCircle && points.length) {
            points.push({ x: points[0].x, y: points[0].y });
        }
        path = (0, path_1.getSplinePath)(points, false, constraint);
    }
    return path;
}
function getRangePath(points, isInCircle, isStack, smooth, constraint, style) {
    var topPoints = [];
    var bottomPoints = [];
    (0, util_1.each)(points, function (point) {
        var result = (0, split_points_1.splitPoints)(point);
        topPoints.push(result[1]); // 上边
        bottomPoints.push(result[0]); // 底边
    });
    var topPath = getSinglePath(topPoints, isInCircle, smooth, constraint, style);
    var bottomPath = getSinglePath(bottomPoints, isInCircle, smooth, constraint, style);
    if (isStack) {
        return topPath;
    }
    return topPath.concat(bottomPath);
}
/**
 * 获取折线图 path
 */
function getPath(points, isInCircle, isStack, smooth, constraint, style) {
    if (points.length) {
        var first = points[0];
        return (0, util_1.isArray)(first.y)
            ? getRangePath(points, isInCircle, isStack, smooth, constraint, style)
            : getSinglePath(points, isInCircle, smooth, constraint, style);
    }
    return [];
}
exports.getPath = getPath;
var LineShapeFactory = (0, base_1.registerShapeFactory)('line', {
    defaultShapeType: 'line',
});
// 这里因为代码公用，所以直接全部注册
// 'line' 默认折线；'dot' 点线 ···；'dash' 断线 - - -
(0, util_1.each)(['line', 'dot', 'dash', 'smooth'], function (shapeType) {
    (0, base_1.registerShape)('line', shapeType, {
        draw: function (cfg, container) {
            var smooth = shapeType === 'smooth';
            var constraint;
            if (smooth) {
                var _a = this.coordinate, start = _a.start, end = _a.end;
                constraint = [
                    [start.x, end.y],
                    [end.x, start.y],
                ];
            }
            var attrs = getShapeAttrs(cfg, smooth, constraint);
            var shape = container.addShape({
                type: 'path',
                attrs: attrs,
                name: 'line',
                capture: !smooth,
            });
            return shape;
        },
        getMarker: function (markerCfg) {
            return (0, util_2.getLineMarker)(markerCfg, shapeType);
        },
    });
});
exports.default = LineShapeFactory;
//# sourceMappingURL=index.js.map