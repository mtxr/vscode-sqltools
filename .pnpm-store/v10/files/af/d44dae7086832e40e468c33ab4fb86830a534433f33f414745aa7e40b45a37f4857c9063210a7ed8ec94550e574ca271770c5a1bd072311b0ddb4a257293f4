"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmoothViolinPath = exports.getViolinPath = exports.getPathPoints = void 0;
var util_1 = require("@antv/util");
var path_1 = require("./path");
function isValueEmpty(value) {
    if (value) {
        return false;
    }
    return value === null || value === undefined || isNaN(value);
}
function isYNil(point) {
    if ((0, util_1.isArray)(point)) {
        // 特殊处理 area 的关键点数据，其关键点结构为 [{x: 0, y: 1}, {x: 0, y: 2}]
        return isValueEmpty(point[1].y);
    }
    var value = point.y;
    return (0, util_1.isArray)(value) ? isValueEmpty(value[0]) : isValueEmpty(value);
}
/**
 * @ignore
 * 分割数据，用于处理在一组点数据中，y 对应的数值存在 null/undefined/NaN 的情况
 * 应用于折线图、区域图以及路径图
 *
 * ```typescript
 * // return [[{x: 1, y: 2}, {x: 3, y: 3}]]
 * getPathPoints([{x: 1, y: 2}, {x: 2, y: null}, {x: 3, y: 3}], true);
 * // return [[{x: 1, y: 2}], [{x: 3, y: 3}]]
 * getPathPoints([{x: 1, y: 2}, {x: 2, y: null}, {x: 3, y: 3}], false);
 * // return [[[{ x: 1, y: 10 }, { x: 2, y: 2 }], [{ x: 9, y: 34 }, { x: 1, y: 1 }]]]
 * getPathPoints([
 *   [{ x: 1, y: 10 }, { x: 2, y: 2 }],
 *   [{ x: 4, y: 2 }, { x: 8, y: NaN }],
 *   [{ x: 9, y: 34 }, { x: 1, y: 1 }],
 * ], true);
 * ```
 *
 * @param points 要进行处理点集合
 * @param connectNulls 是否连接空值数据
 * @param showSinglePoint 是否展示孤立点
 * @returns 返回处理后的点集合
 */
function getPathPoints(points, connectNulls, showSinglePoint) {
    if (connectNulls === void 0) { connectNulls = false; }
    if (showSinglePoint === void 0) { showSinglePoint = true; }
    if (!points.length || (points.length === 1 && !showSinglePoint)) {
        // 空或者只有一个点并配置不展示时
        return [];
    }
    if (connectNulls) {
        // 即 y 值为空的场景
        var filtered = [];
        for (var i = 0, len = points.length; i < len; i++) {
            var point = points[i];
            if (!isYNil(point)) {
                filtered.push(point);
            }
        }
        return [filtered];
    }
    var result = [];
    var tmp = [];
    for (var i = 0, len = points.length; i < len; i++) {
        var point = points[i];
        if (isYNil(point)) {
            if (tmp.length) {
                if (!(tmp.length === 1 && !showSinglePoint)) {
                    // 如果前段数据只有一个字段并且不需要展示时则不加入
                    result.push(tmp);
                }
                tmp = [];
            }
        }
        else {
            tmp.push(point);
        }
    }
    if (tmp.length) {
        result.push(tmp);
    }
    return result;
}
exports.getPathPoints = getPathPoints;
/**
 * 获取小提琴图的边界 path
 * @param points
 * @returns
 */
function getViolinPath(points) {
    var path = [];
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (point) {
            var action = i === 0 ? 'M' : 'L';
            path.push([action, point.x, point.y]);
        }
    }
    var first = points[0];
    if (first) {
        path.push(['L', first.x, first.y]);
        path.push(['z']);
    }
    return path;
}
exports.getViolinPath = getViolinPath;
/**
 * 获取小提琴图 平滑的边界 path
 * @param points
 * @returns
 */
function getSmoothViolinPath(points) {
    var half = points.length / 2;
    var leftPoints = [];
    var rightPoints = [];
    for (var i = 0; i < points.length; i++) {
        if (i < half) {
            leftPoints.push(points[i]);
        }
        else {
            rightPoints.push(points[i]);
        }
    }
    var leftPath = (0, path_1.getSplinePath)(leftPoints, false);
    var rightPath = (0, path_1.getSplinePath)(rightPoints, false);
    if (rightPoints.length) {
        leftPath.push(['L', rightPoints[0].x, rightPoints[0].y]);
    }
    rightPath.shift();
    var path = leftPath.concat(rightPath);
    if (leftPoints.length) {
        path.push(['L', leftPoints[0].x, leftPoints[0].y]);
    }
    path.push(['z']);
    return path;
}
exports.getSmoothViolinPath = getSmoothViolinPath;
//# sourceMappingURL=get-path-points.js.map