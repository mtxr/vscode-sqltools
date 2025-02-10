import { each, isArray } from '@antv/util';
import { registerShape, registerShapeFactory } from '../base';
import { getPathPoints } from '../util/get-path-points';
import { getStyle } from '../util/get-style';
import { getLinePath, getSplinePath } from '../util/path';
import { splitPoints } from '../util/split-points';
import { getLineMarker } from './util';
function getShapeAttrs(cfg, smooth, constraint) {
    var isStack = cfg.isStack, connectNulls = cfg.connectNulls, isInCircle = cfg.isInCircle, showSinglePoint = cfg.showSinglePoint;
    var shapeAttrs = getStyle(cfg, true, false, 'lineWidth');
    var points = getPathPoints(cfg.points, connectNulls, showSinglePoint); // 根据 connectNulls 值处理 points
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
        path = getLinePath(points, false);
        if (isInCircle) {
            path.push(['Z']);
        }
    }
    else {
        // 直角坐标系下绘制曲线时限制最大值、最小值
        if (isInCircle && points.length) {
            points.push({ x: points[0].x, y: points[0].y });
        }
        path = getSplinePath(points, false, constraint);
    }
    return path;
}
function getRangePath(points, isInCircle, isStack, smooth, constraint, style) {
    var topPoints = [];
    var bottomPoints = [];
    each(points, function (point) {
        var result = splitPoints(point);
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
export function getPath(points, isInCircle, isStack, smooth, constraint, style) {
    if (points.length) {
        var first = points[0];
        return isArray(first.y)
            ? getRangePath(points, isInCircle, isStack, smooth, constraint, style)
            : getSinglePath(points, isInCircle, smooth, constraint, style);
    }
    return [];
}
var LineShapeFactory = registerShapeFactory('line', {
    defaultShapeType: 'line',
});
// 这里因为代码公用，所以直接全部注册
// 'line' 默认折线；'dot' 点线 ···；'dash' 断线 - - -
each(['line', 'dot', 'dash', 'smooth'], function (shapeType) {
    registerShape('line', shapeType, {
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
            return getLineMarker(markerCfg, shapeType);
        },
    });
});
export default LineShapeFactory;
//# sourceMappingURL=index.js.map