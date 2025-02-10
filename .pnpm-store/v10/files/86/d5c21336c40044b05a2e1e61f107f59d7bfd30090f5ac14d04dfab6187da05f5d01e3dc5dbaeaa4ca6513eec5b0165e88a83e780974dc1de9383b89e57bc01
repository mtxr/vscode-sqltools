"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRectWithCornerRadius = exports.getFunnelPath = exports.getIntervalRectPath = exports.getBackgroundRectPath = exports.parseRadius = exports.getRectPath = exports.getRectPoints = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var graphics_1 = require("../../../util/graphics");
/**
 * @ignore
 * 根据数据点生成矩形的四个关键点
 * @param pointInfo 数据点信息
 * @param [isPyramid] 是否为尖底漏斗图
 * @returns rect points 返回矩形四个顶点信息
 */
function getRectPoints(pointInfo) {
    var _a, _b;
    var x = pointInfo.x, y = pointInfo.y, y0 = pointInfo.y0, size = pointInfo.size;
    // 有 4 种情况，
    // 1. x, y 都不是数组
    // 2. y是数组，x不是
    // 3. x是数组，y不是
    // 4. x, y 都是数组
    var yMin;
    var yMax;
    if ((0, util_1.isArray)(y)) {
        _a = tslib_1.__read(y, 2), yMin = _a[0], yMax = _a[1];
    }
    else {
        yMin = y0;
        yMax = y;
    }
    var xMin;
    var xMax;
    if ((0, util_1.isArray)(x)) {
        _b = tslib_1.__read(x, 2), xMin = _b[0], xMax = _b[1];
    }
    else {
        xMin = x - size / 2;
        xMax = x + size / 2;
    }
    var points = [
        { x: xMin, y: yMin },
        { x: xMin, y: yMax },
    ];
    // 矩形的四个关键点，结构如下（左下角顺时针连接）
    // 1 ---- 2
    // |      |
    // 0 ---- 3
    points.push({ x: xMax, y: yMax }, { x: xMax, y: yMin });
    return points;
}
exports.getRectPoints = getRectPoints;
/**
 * @ignore
 * 根据矩形关键点绘制 path
 * @param points 关键点数组
 * @param isClosed path 是否需要闭合
 * @returns 返回矩形的 path
 */
function getRectPath(points, isClosed) {
    if (isClosed === void 0) { isClosed = true; }
    var path = [];
    var firstPoint = points[0];
    path.push(['M', firstPoint.x, firstPoint.y]);
    for (var i = 1, len = points.length; i < len; i++) {
        path.push(['L', points[i].x, points[i].y]);
    }
    // 对于 shape="line" path 不应该闭合，否则会造成 lineCap 绘图属性失效
    if (isClosed) {
        path.push(['L', firstPoint.x, firstPoint.y]); // 需要闭合
        path.push(['z']);
    }
    return path;
}
exports.getRectPath = getRectPath;
/**
 * 处理 rect path 的 radius
 * @returns 返回矩形 path 的四个角的 arc 半径
 */
function parseRadius(radius, minLength) {
    var r1 = 0;
    var r2 = 0;
    var r3 = 0;
    var r4 = 0;
    if ((0, util_1.isArray)(radius)) {
        if (radius.length === 1) {
            r1 = r2 = r3 = r4 = radius[0];
        }
        else if (radius.length === 2) {
            r1 = r3 = radius[0];
            r2 = r4 = radius[1];
        }
        else if (radius.length === 3) {
            r1 = radius[0];
            r2 = r4 = radius[1];
            r3 = radius[2];
        }
        else {
            r1 = radius[0];
            r2 = radius[1];
            r3 = radius[2];
            r4 = radius[3];
        }
    }
    else {
        r1 = r2 = r3 = r4 = radius;
    }
    // 处理 边界值
    if (r1 + r2 > minLength) {
        r1 = r1 ? minLength / (1 + r2 / r1) : 0;
        r2 = minLength - r1;
    }
    if (r3 + r4 > minLength) {
        r3 = r3 ? minLength / (1 + r4 / r3) : 0;
        r4 = minLength - r3;
    }
    return [r1 || 0, r2 || 0, r3 || 0, r4 || 0];
}
exports.parseRadius = parseRadius;
/**
 * 获取 interval 矩形背景的 path
 * @param cfg 关键点的信息
 * @param points 已转化为画布坐标的 4 个关键点
 * @param coordinate 坐标系
 * @returns 返回矩形背景的 path
 */
function getBackgroundRectPath(cfg, points, coordinate) {
    var path = [];
    if (coordinate.isRect) {
        var p0 = coordinate.isTransposed
            ? { x: coordinate.start.x, y: points[0].y }
            : { x: points[0].x, y: coordinate.start.y };
        var p1 = coordinate.isTransposed
            ? { x: coordinate.end.x, y: points[2].y }
            : { x: points[3].x, y: coordinate.end.y };
        // corner radius of background shape works only in 笛卡尔坐标系
        var radius = (0, util_1.get)(cfg, ['background', 'style', 'radius']);
        if (radius) {
            var width = coordinate.isTransposed ? Math.abs(points[0].y - points[2].y) : points[2].x - points[1].x;
            var height = coordinate.isTransposed ? coordinate.getWidth() : coordinate.getHeight();
            var _a = tslib_1.__read(parseRadius(radius, Math.min(width, height)), 4), r1 = _a[0], r2 = _a[1], r3 = _a[2], r4 = _a[3];
            // 同时存在 坐标系是否发生转置 和 y 镜像的时候
            var isReflectYTransposed_1 = (coordinate.isTransposed && coordinate.isReflect('y'));
            var bump = isReflectYTransposed_1 ? 0 : 1;
            var opposite = function (r) { return isReflectYTransposed_1 ? -r : r; };
            path.push(['M', p0.x, p1.y + opposite(r1)]);
            r1 !== 0 && path.push(['A', r1, r1, 0, 0, bump, p0.x + r1, p1.y]);
            path.push(['L', p1.x - r2, p1.y]);
            r2 !== 0 && path.push(['A', r2, r2, 0, 0, bump, p1.x, p1.y + opposite(r2)]);
            path.push(['L', p1.x, p0.y - opposite(r3)]);
            r3 !== 0 && path.push(['A', r3, r3, 0, 0, bump, p1.x - r3, p0.y]);
            path.push(['L', p0.x + r4, p0.y]);
            r4 !== 0 && path.push(['A', r4, r4, 0, 0, bump, p0.x, p0.y - opposite(r4)]);
        }
        else {
            path.push(['M', p0.x, p0.y]);
            path.push(['L', p1.x, p0.y]);
            path.push(['L', p1.x, p1.y]);
            path.push(['L', p0.x, p1.y]);
            path.push(['L', p0.x, p0.y]);
        }
        path.push(['z']);
    }
    if (coordinate.isPolar) {
        var center = coordinate.getCenter();
        var _b = (0, graphics_1.getAngle)(cfg, coordinate), startAngle = _b.startAngle, endAngle = _b.endAngle;
        if (coordinate.type !== 'theta' && !coordinate.isTransposed) {
            // 获取扇形 path
            path = (0, graphics_1.getSectorPath)(center.x, center.y, coordinate.getRadius(), startAngle, endAngle);
        }
        else {
            var pow = function (v) { return Math.pow(v, 2); };
            var r1 = Math.sqrt(pow(center.x - points[0].x) + pow(center.y - points[0].y));
            var r2 = Math.sqrt(pow(center.x - points[2].x) + pow(center.y - points[2].y));
            // 获取扇形 path（其实是一个圆环，从 coordinate 的起始角度到结束角度）
            path = (0, graphics_1.getSectorPath)(center.x, center.y, r1, coordinate.startAngle, coordinate.endAngle, r2);
        }
    }
    return path;
}
exports.getBackgroundRectPath = getBackgroundRectPath;
/**
 * @ignore
 * 根据矩形关键点绘制 path
 * @param points 关键点数组
 * @param lineCap 'round'圆角样式
 * @param coor 坐标
 * @returns 返回矩形的 path
 */
function getIntervalRectPath(points, lineCap, coor) {
    var width = coor.getWidth();
    var height = coor.getHeight();
    var isRect = coor.type === 'rect';
    var path = [];
    var r = (points[2].x - points[1].x) / 2;
    var ry = coor.isTransposed ? (r * height) / width : (r * width) / height;
    if (lineCap === 'round') {
        if (isRect) {
            path.push(['M', points[0].x, points[0].y + ry]);
            path.push(['L', points[1].x, points[1].y - ry]);
            path.push(['A', r, r, 0, 0, 1, points[2].x, points[2].y - ry]);
            path.push(['L', points[3].x, points[3].y + ry]);
            path.push(['A', r, r, 0, 0, 1, points[0].x, points[0].y + ry]);
        }
        else {
            path.push(['M', points[0].x, points[0].y]);
            path.push(['L', points[1].x, points[1].y]);
            path.push(['A', r, r, 0, 0, 1, points[2].x, points[2].y]);
            path.push(['L', points[3].x, points[3].y]);
            path.push(['A', r, r, 0, 0, 1, points[0].x, points[0].y]);
        }
        path.push(['z']);
    }
    else {
        path = getRectPath(points);
    }
    return path;
}
exports.getIntervalRectPath = getIntervalRectPath;
/**
 * @ignore
 * 根据 funnel 关键点绘制漏斗图的 path
 * @param points 图形关键点信息
 * @param nextPoints 下一个数据的图形关键点信息
 * @param isPyramid 是否为尖底漏斗图
 * @returns 返回漏斗图的图形 path
 */
function getFunnelPath(points, nextPoints, isPyramid) {
    var path = [];
    if (!(0, util_1.isNil)(nextPoints)) {
        path.push(['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y], ['L', nextPoints[1].x, nextPoints[1].y], ['L', nextPoints[0].x, nextPoints[0].y], ['Z']);
    }
    else if (isPyramid) {
        // 金字塔最底部
        path.push(['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y], ['L', (points[2].x + points[3].x) / 2, (points[2].y + points[3].y) / 2], ['Z']);
    }
    else {
        // 漏斗图最底部
        path.push(['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y], ['L', points[2].x, points[2].y], ['L', points[3].x, points[3].y], ['Z']);
    }
    return path;
}
exports.getFunnelPath = getFunnelPath;
/**
 * 交换两个对象
 */
function swap(p0, p1) {
    return [p1, p0];
}
/**
 * 获取 倒角 矩形
 * - 目前只适用于笛卡尔坐标系下
 */
function getRectWithCornerRadius(points, coordinate, radius) {
    var _a, _b, _c, _d, _e, _f, _g;
    // 获取 四个关键点
    var _h = tslib_1.__read(tslib_1.__spreadArray([], tslib_1.__read(points), false), 4), p0 = _h[0], p1 = _h[1], p2 = _h[2], p3 = _h[3];
    var _j = tslib_1.__read(typeof radius === 'number' ? Array(4).fill(radius) : radius, 4), r1 = _j[0], r2 = _j[1], r3 = _j[2], r4 = _j[3];
    if (coordinate.isTransposed) {
        _a = tslib_1.__read(swap(p1, p3), 2), p1 = _a[0], p3 = _a[1];
    }
    /**
     * 存在镜像
     */
    if (coordinate.isReflect('y')) {
        _b = tslib_1.__read(swap(p0, p1), 2), p0 = _b[0], p1 = _b[1];
        _c = tslib_1.__read(swap(p2, p3), 2), p2 = _c[0], p3 = _c[1];
    }
    if (coordinate.isReflect('x')) {
        _d = tslib_1.__read(swap(p0, p3), 2), p0 = _d[0], p3 = _d[1];
        _e = tslib_1.__read(swap(p1, p2), 2), p1 = _e[0], p2 = _e[1];
    }
    var path = [];
    /**
     *  p1 → p2
     *  ↑    ↓
     *  p0 ← p3
     *
     *  负数的情况，关键点会变成下面的形式
     *
     *  p0 ← p3               p2 ← p1
     *  ↓    ↑                ↓     ↑
     *  p1 → p2  --> (转置下)  p3 → p0
     */
    var abs = function (v) { return Math.abs(v); };
    _f = tslib_1.__read(parseRadius([r1, r2, r3, r4], Math.min(abs(p3.x - p0.x), abs(p1.y - p0.y))).map(function (d) { return abs(d); }), 4), r1 = _f[0], r2 = _f[1], r3 = _f[2], r4 = _f[3];
    if (coordinate.isTransposed) {
        _g = tslib_1.__read([r4, r1, r2, r3], 4), r1 = _g[0], r2 = _g[1], r3 = _g[2], r4 = _g[3];
    }
    if (p0.y < p1.y /** 负数情况 */) {
        path.push(['M', p3.x, p3.y + r3]);
        r3 !== 0 && path.push(['A', r3, r3, 0, 0, 0, p3.x - r3, p3.y]);
        path.push(['L', p0.x + r4, p0.y]);
        r4 !== 0 && path.push(['A', r4, r4, 0, 0, 0, p0.x, p0.y + r4]);
        path.push(['L', p1.x, p1.y - r1]);
        r1 !== 0 && path.push(['A', r1, r1, 0, 0, 0 /** 逆时针 */, p1.x + r1, p1.y]);
        path.push(['L', p2.x - r2, p2.y]);
        r2 !== 0 && path.push(['A', r2, r2, 0, 0, 0, p2.x, p2.y - r2]);
        path.push(['L', p3.x, p3.y + r3]);
        path.push(['z']);
    }
    else if (p3.x < p0.x) {
        path.push(['M', p2.x + r2, p2.y]);
        r2 !== 0 && path.push(['A', r2, r2, 0, 0, 0, p2.x, p2.y + r2]);
        path.push(['L', p3.x, p3.y - r3]);
        r3 !== 0 && path.push(['A', r3, r3, 0, 0, 0, p3.x + r3, p3.y]);
        path.push(['L', p0.x - r4, p0.y]);
        r4 !== 0 && path.push(['A', r4, r4, 0, 0, 0, p0.x, p0.y - r4]);
        path.push(['L', p1.x, p1.y + r1]);
        r1 !== 0 && path.push(['A', r1, r1, 0, 0, 0, p1.x - r1, p1.y]);
        path.push(['L', p2.x + r2, p2.y]);
        path.push(['z']);
    }
    else {
        path.push(['M', p1.x, p1.y + r1]);
        r1 !== 0 && path.push(['A', r1, r1, 0, 0, 1, p1.x + r1, p1.y]);
        path.push(['L', p2.x - r2, p2.y]);
        r2 !== 0 && path.push(['A', r2, r2, 0, 0, 1, p2.x, p2.y + r2]);
        path.push(['L', p3.x, p3.y - r3]);
        r3 !== 0 && path.push(['A', r3, r3, 0, 0, 1, p3.x - r3, p3.y]);
        path.push(['L', p0.x + r4, p0.y]);
        r4 !== 0 && path.push(['A', r4, r4, 0, 0, 1, p0.x, p0.y - r4]);
        path.push(['L', p1.x, p1.y + r1]);
        path.push(['z']);
    }
    return path;
}
exports.getRectWithCornerRadius = getRectWithCornerRadius;
//# sourceMappingURL=util.js.map