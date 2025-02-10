"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConstraint = exports.getShapeAttrs = void 0;
var util_1 = require("@antv/util");
var get_path_points_1 = require("../util/get-path-points");
var get_style_1 = require("../util/get-style");
var path_1 = require("../util/path");
function getPath(points, isInCircle, smooth, registeredShape, constraint) {
    var path = [];
    if (points.length) {
        var topLinePoints_1 = []; // area 区域上部分
        var bottomLinePoints_1 = []; // area 区域下部分
        for (var i = 0, len = points.length; i < len; i++) {
            var point = points[i];
            topLinePoints_1.push(point[1]);
            bottomLinePoints_1.push(point[0]);
        }
        bottomLinePoints_1 = bottomLinePoints_1.reverse();
        (0, util_1.each)([topLinePoints_1, bottomLinePoints_1], function (pointsData, index) {
            var subPath = [];
            var parsedPoints = registeredShape.parsePoints(pointsData);
            var p1 = parsedPoints[0];
            if (topLinePoints_1.length === 1 && bottomLinePoints_1.length === 1) {
                // 都只有一个点，绘制一条竖线
                subPath =
                    index === 0
                        ? [
                            ['M', p1.x - 0.5, p1.y],
                            ['L', p1.x + 0.5, p1.y],
                        ]
                        : [
                            ['L', p1.x + 0.5, p1.y],
                            ['L', p1.x - 0.5, p1.y],
                        ];
            }
            else {
                if (isInCircle) {
                    parsedPoints.push({ x: p1.x, y: p1.y });
                }
                if (smooth) {
                    subPath = (0, path_1.getSplinePath)(parsedPoints, false, constraint);
                }
                else {
                    subPath = (0, path_1.getLinePath)(parsedPoints, false);
                }
                if (index > 0) {
                    subPath[0][0] = 'L';
                }
            }
            path = path.concat(subPath);
        });
        path.push(['Z']);
    }
    return path;
}
/**
 * @ignore
 * Gets shape attrs
 * @param cfg
 * @param isStroke
 * @param smooth
 * @param registeredShape
 * @param [constraint]
 * @returns
 */
function getShapeAttrs(cfg, isStroke, smooth, registeredShape, constraint) {
    var attrs = (0, get_style_1.getStyle)(cfg, isStroke, !isStroke, 'lineWidth');
    var connectNulls = cfg.connectNulls, isInCircle = cfg.isInCircle, points = cfg.points, showSinglePoint = cfg.showSinglePoint;
    var pathPoints = (0, get_path_points_1.getPathPoints)(points, connectNulls, showSinglePoint); // 根据 connectNulls 配置获取图形关键点
    var path = [];
    for (var i = 0, len = pathPoints.length; i < len; i++) {
        var eachPoints = pathPoints[i];
        path = path.concat(getPath(eachPoints, isInCircle, smooth, registeredShape, constraint));
    }
    attrs.path = path;
    return attrs;
}
exports.getShapeAttrs = getShapeAttrs;
/**
 * @ignore
 * Gets constraint
 * @param coordinate
 * @returns constraint
 */
function getConstraint(coordinate) {
    var start = coordinate.start, end = coordinate.end;
    return [
        [start.x, end.y],
        [end.x, start.y],
    ];
}
exports.getConstraint = getConstraint;
//# sourceMappingURL=util.js.map