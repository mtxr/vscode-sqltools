"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distanceAtSegment = exports.angleAtSegments = exports.pointAtSegments = exports.lengthOfSegment = void 0;
var line_1 = require("./line");
var util_1 = require("./util");
function analyzePoints(points) {
    // 计算每段的长度和总的长度
    var totalLength = 0;
    var segments = [];
    for (var i = 0; i < points.length - 1; i++) {
        var from = points[i];
        var to = points[i + 1];
        var length_1 = util_1.distance(from[0], from[1], to[0], to[1]);
        var seg = {
            from: from,
            to: to,
            length: length_1,
        };
        segments.push(seg);
        totalLength += length_1;
    }
    return { segments: segments, totalLength: totalLength };
}
function lengthOfSegment(points) {
    if (points.length < 2) {
        return 0;
    }
    var totalLength = 0;
    for (var i = 0; i < points.length - 1; i++) {
        var from = points[i];
        var to = points[i + 1];
        totalLength += util_1.distance(from[0], from[1], to[0], to[1]);
    }
    return totalLength;
}
exports.lengthOfSegment = lengthOfSegment;
/**
 * 按照比例在数据片段中获取点
 * @param {array} points 点的集合
 * @param {number} t 百分比 0-1
 * @return {object} 点的坐标
 */
function pointAtSegments(points, t) {
    // 边界判断
    if (t > 1 || t < 0 || points.length < 2) {
        return null;
    }
    var _a = analyzePoints(points), segments = _a.segments, totalLength = _a.totalLength;
    // 多个点有可能重合
    if (totalLength === 0) {
        return {
            x: points[0][0],
            y: points[0][1],
        };
    }
    // 计算比例
    var startRatio = 0;
    var point = null;
    for (var i = 0; i < segments.length; i++) {
        var seg = segments[i];
        var from = seg.from, to = seg.to;
        var currentRatio = seg.length / totalLength;
        if (t >= startRatio && t <= startRatio + currentRatio) {
            var localRatio = (t - startRatio) / currentRatio;
            point = line_1.default.pointAt(from[0], from[1], to[0], to[1], localRatio);
            break;
        }
        startRatio += currentRatio;
    }
    return point;
}
exports.pointAtSegments = pointAtSegments;
/**
 * 按照比例在数据片段中获取切线的角度
 * @param {array} points 点的集合
 * @param {number} t 百分比 0-1
 */
function angleAtSegments(points, t) {
    // 边界判断
    if (t > 1 || t < 0 || points.length < 2) {
        return 0;
    }
    var _a = analyzePoints(points), segments = _a.segments, totalLength = _a.totalLength;
    // 计算比例
    var startRatio = 0;
    var angle = 0;
    for (var i = 0; i < segments.length; i++) {
        var seg = segments[i];
        var from = seg.from, to = seg.to;
        var currentRatio = seg.length / totalLength;
        if (t >= startRatio && t <= startRatio + currentRatio) {
            angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
            break;
        }
        startRatio += currentRatio;
    }
    return angle;
}
exports.angleAtSegments = angleAtSegments;
function distanceAtSegment(points, x, y) {
    var minDistance = Infinity;
    for (var i = 0; i < points.length - 1; i++) {
        var point = points[i];
        var nextPoint = points[i + 1];
        var distance_1 = line_1.default.pointDistance(point[0], point[1], nextPoint[0], nextPoint[1], x, y);
        if (distance_1 < minDistance) {
            minDistance = distance_1;
        }
    }
    return minDistance;
}
exports.distanceAtSegment = distanceAtSegment;
//# sourceMappingURL=segments.js.map