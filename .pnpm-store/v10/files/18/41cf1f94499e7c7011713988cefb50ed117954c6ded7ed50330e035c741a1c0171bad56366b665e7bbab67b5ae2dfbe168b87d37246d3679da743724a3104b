"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @fileoverview path 的一些工具
 * @author dxq613@gmail.com
 */
var g_base_1 = require("@antv/g-base");
var g_math_1 = require("@antv/g-math");
var g_math_2 = require("@antv/g-math");
var matrix_util_1 = require("@antv/matrix-util");
var vec3 = require("gl-matrix/vec3");
var util_1 = require("./util");
var line_1 = require("./in-stroke/line");
var arc_1 = require("./in-stroke/arc");
var transform = matrix_util_1.ext.transform;
function hasArc(path) {
    var hasArc = false;
    var count = path.length;
    for (var i = 0; i < count; i++) {
        var params = path[i];
        var cmd = params[0];
        if (cmd === 'C' || cmd === 'A' || cmd === 'Q') {
            hasArc = true;
            break;
        }
    }
    return hasArc;
}
function isPointInStroke(segments, lineWidth, x, y, length) {
    var isHit = false;
    var halfWidth = lineWidth / 2;
    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        var currentPoint = segment.currentPoint, params = segment.params, prePoint = segment.prePoint, box = segment.box;
        // 如果在前面已经生成过包围盒，直接按照包围盒计算
        if (box && !util_1.inBox(box.x - halfWidth, box.y - halfWidth, box.width + lineWidth, box.height + lineWidth, x, y)) {
            continue;
        }
        switch (segment.command) {
            // L 和 Z 都是直线， M 不进行拾取
            case 'L':
            case 'Z':
                isHit = line_1.default(prePoint[0], prePoint[1], currentPoint[0], currentPoint[1], lineWidth, x, y);
                break;
            case 'Q':
                var qDistance = g_math_1.Quad.pointDistance(prePoint[0], prePoint[1], params[1], params[2], params[3], params[4], x, y);
                isHit = qDistance <= lineWidth / 2;
                break;
            case 'C':
                var cDistance = g_math_2.Cubic.pointDistance(prePoint[0], // 上一段结束位置, 即 C 的起始点
                prePoint[1], params[1], // 'C' 的参数，1、2 为第一个控制点，3、4 为第二个控制点，5、6 为结束点
                params[2], params[3], params[4], params[5], params[6], x, y, length);
                isHit = cDistance <= lineWidth / 2;
                break;
            case 'A':
                // 计算点到椭圆圆弧的距离，暂时使用近似算法，后面可以改成切割法求最近距离
                var arcParams = segment.arcParams;
                var cx = arcParams.cx, cy = arcParams.cy, rx = arcParams.rx, ry = arcParams.ry, startAngle = arcParams.startAngle, endAngle = arcParams.endAngle, xRotation = arcParams.xRotation;
                var p = [x, y, 1];
                var r = rx > ry ? rx : ry;
                var scaleX = rx > ry ? 1 : rx / ry;
                var scaleY = rx > ry ? ry / rx : 1;
                var m = transform(null, [
                    ['t', -cx, -cy],
                    ['r', -xRotation],
                    ['s', 1 / scaleX, 1 / scaleY],
                ]);
                vec3.transformMat3(p, p, m);
                isHit = arc_1.default(0, 0, r, startAngle, endAngle, lineWidth, p[0], p[1]);
                break;
            default:
                break;
        }
        if (isHit) {
            break;
        }
    }
    return isHit;
}
/**
 * 提取出内部的闭合多边形和非闭合的多边形，假设 path 不存在圆弧
 * @param {Array} path 路径
 * @returns {Array} 点的集合
 */
function extractPolygons(path) {
    var count = path.length;
    var polygons = [];
    var polylines = [];
    var points = []; // 防止第一个命令不是 'M'
    for (var i = 0; i < count; i++) {
        var params = path[i];
        var cmd = params[0];
        if (cmd === 'M') {
            // 遇到 'M' 判定是否是新数组，新数组中没有点
            if (points.length) {
                // 如果存在点，则说明没有遇到 'Z'，开始了一个新的多边形
                polylines.push(points);
                points = []; // 创建新的点
            }
            points.push([params[1], params[2]]);
        }
        else if (cmd === 'Z') {
            if (points.length) {
                // 存在点
                polygons.push(points);
                points = []; // 开始新的点集合
            }
            // 如果不存在点，同时 'Z'，则说明是错误，不处理
        }
        else {
            points.push([params[1], params[2]]);
        }
    }
    // 说明 points 未放入 polygons 或者 polyline
    // 仅当只有一个 M，没有 Z 时会发生这种情况
    if (points.length > 0) {
        polylines.push(points);
    }
    return {
        polygons: polygons,
        polylines: polylines,
    };
}
exports.default = tslib_1.__assign({ hasArc: hasArc,
    extractPolygons: extractPolygons,
    isPointInStroke: isPointInStroke }, g_base_1.PathUtil);
//# sourceMappingURL=path.js.map