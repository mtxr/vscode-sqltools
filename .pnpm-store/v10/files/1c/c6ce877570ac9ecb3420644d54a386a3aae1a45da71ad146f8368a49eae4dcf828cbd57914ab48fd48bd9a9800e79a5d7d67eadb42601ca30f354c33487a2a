import { each } from '@antv/util';
import { getPathPoints } from '../util/get-path-points';
import { getStyle } from '../util/get-style';
import { getLinePath, getSplinePath } from '../util/path';
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
        each([topLinePoints_1, bottomLinePoints_1], function (pointsData, index) {
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
                    subPath = getSplinePath(parsedPoints, false, constraint);
                }
                else {
                    subPath = getLinePath(parsedPoints, false);
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
export function getShapeAttrs(cfg, isStroke, smooth, registeredShape, constraint) {
    var attrs = getStyle(cfg, isStroke, !isStroke, 'lineWidth');
    var connectNulls = cfg.connectNulls, isInCircle = cfg.isInCircle, points = cfg.points, showSinglePoint = cfg.showSinglePoint;
    var pathPoints = getPathPoints(points, connectNulls, showSinglePoint); // 根据 connectNulls 配置获取图形关键点
    var path = [];
    for (var i = 0, len = pathPoints.length; i < len; i++) {
        var eachPoints = pathPoints[i];
        path = path.concat(getPath(eachPoints, isInCircle, smooth, registeredShape, constraint));
    }
    attrs.path = path;
    return attrs;
}
/**
 * @ignore
 * Gets constraint
 * @param coordinate
 * @returns constraint
 */
export function getConstraint(coordinate) {
    var start = coordinate.start, end = coordinate.end;
    return [
        [start.x, end.y],
        [end.x, start.y],
    ];
}
//# sourceMappingURL=util.js.map