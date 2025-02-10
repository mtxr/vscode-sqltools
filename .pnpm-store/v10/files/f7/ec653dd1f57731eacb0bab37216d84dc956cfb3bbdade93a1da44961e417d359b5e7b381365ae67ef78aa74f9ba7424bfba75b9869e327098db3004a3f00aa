"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSplinePath = exports.catmullRom2bezier = exports.smoothBezier = exports.points2Path = void 0;
var matrix_util_1 = require("@antv/matrix-util");
function points2Path(points, isInCircle) {
    var path = [];
    if (points.length) {
        path.push(['M', points[0].x, points[0].y]);
        for (var i = 1, length_1 = points.length; i < length_1; i += 1) {
            var item = points[i];
            path.push(['L', item.x, item.y]);
        }
        if (isInCircle) {
            path.push(['Z']);
        }
    }
    return path;
}
exports.points2Path = points2Path;
/**
 * @ignore
 * 计算光滑的贝塞尔曲线
 */
var smoothBezier = function (points, smooth, isLoop, constraint) {
    var cps = [];
    var prevPoint;
    var nextPoint;
    var hasConstraint = !!constraint;
    var min;
    var max;
    if (hasConstraint) {
        min = [Infinity, Infinity];
        max = [-Infinity, -Infinity];
        for (var i = 0, l = points.length; i < l; i++) {
            var point = points[i];
            min = matrix_util_1.vec2.min([0, 0], min, point);
            max = matrix_util_1.vec2.max([0, 0], max, point);
        }
        min = matrix_util_1.vec2.min([0, 0], min, constraint[0]);
        max = matrix_util_1.vec2.max([0, 0], max, constraint[1]);
    }
    for (var i = 0, len = points.length; i < len; i++) {
        var point = points[i];
        if (isLoop) {
            prevPoint = points[i ? i - 1 : len - 1];
            nextPoint = points[(i + 1) % len];
        }
        else {
            if (i === 0 || i === len - 1) {
                cps.push(point);
                continue;
            }
            else {
                prevPoint = points[i - 1];
                nextPoint = points[i + 1];
            }
        }
        var v = [0, 0];
        v = matrix_util_1.vec2.sub(v, nextPoint, prevPoint);
        v = matrix_util_1.vec2.scale(v, v, smooth);
        var d0 = matrix_util_1.vec2.distance(point, prevPoint);
        var d1 = matrix_util_1.vec2.distance(point, nextPoint);
        var sum = d0 + d1;
        if (sum !== 0) {
            d0 /= sum;
            d1 /= sum;
        }
        var v1 = matrix_util_1.vec2.scale([0, 0], v, -d0);
        var v2 = matrix_util_1.vec2.scale([0, 0], v, d1);
        var cp0 = matrix_util_1.vec2.add([0, 0], point, v1);
        var cp1 = matrix_util_1.vec2.add([0, 0], point, v2);
        if (hasConstraint) {
            cp0 = matrix_util_1.vec2.max([0, 0], cp0, min);
            cp0 = matrix_util_1.vec2.min([0, 0], cp0, max);
            cp1 = matrix_util_1.vec2.max([0, 0], cp1, min);
            cp1 = matrix_util_1.vec2.min([0, 0], cp1, max);
        }
        cps.push(cp0);
        cps.push(cp1);
    }
    if (isLoop) {
        cps.push(cps.shift());
    }
    return cps;
};
exports.smoothBezier = smoothBezier;
/**
 * @ignore
 * 贝塞尔曲线
 */
function catmullRom2bezier(crp, z, constraint) {
    var isLoop = !!z;
    var pointList = [];
    for (var i = 0, l = crp.length; i < l; i += 2) {
        pointList.push([crp[i], crp[i + 1]]);
    }
    var controlPointList = (0, exports.smoothBezier)(pointList, 0.4, isLoop, constraint);
    var len = pointList.length;
    var d1 = [];
    var cp1;
    var cp2;
    var p;
    for (var i = 0; i < len - 1; i++) {
        cp1 = controlPointList[i * 2];
        cp2 = controlPointList[i * 2 + 1];
        p = pointList[i + 1];
        d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]]);
    }
    if (isLoop) {
        cp1 = controlPointList[len];
        cp2 = controlPointList[len + 1];
        p = pointList[0];
        d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]]);
    }
    return d1;
}
exports.catmullRom2bezier = catmullRom2bezier;
/**
 * @ignore
 * 根据关键点获取限定了范围的平滑线
 */
function getSplinePath(points, isInCircle, constaint) {
    var data = [];
    var first = points[0];
    var prePoint = null;
    if (points.length <= 2) {
        // 两点以内直接绘制成路径
        return points2Path(points, isInCircle);
    }
    for (var i = 0, len = points.length; i < len; i++) {
        var point = points[i];
        if (!prePoint || !(prePoint.x === point.x && prePoint.y === point.y)) {
            data.push(point.x);
            data.push(point.y);
            prePoint = point;
        }
    }
    var constraint = constaint || [
        // 范围
        [0, 0],
        [1, 1],
    ];
    var splinePath = catmullRom2bezier(data, isInCircle, constraint);
    splinePath.unshift(['M', first.x, first.y]);
    return splinePath;
}
exports.getSplinePath = getSplinePath;
//# sourceMappingURL=path.js.map