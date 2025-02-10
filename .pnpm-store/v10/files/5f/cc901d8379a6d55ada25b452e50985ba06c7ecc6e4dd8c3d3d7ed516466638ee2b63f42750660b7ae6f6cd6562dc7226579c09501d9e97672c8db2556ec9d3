"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var segments_1 = require("./segments");
var polyline_1 = require("./polyline");
function getAllPoints(points) {
    var tmp = points.slice(0);
    if (points.length) {
        tmp.push(points[0]);
    }
    return tmp;
}
exports.default = {
    /**
     * 计算多边形的包围盒
     * @param {array} points 点的集合 [x,y] 的形式
     * @return {object} 包围盒
     */
    box: function (points) {
        return polyline_1.default.box(points);
    },
    /**
     * 计算多边形的长度
     * @param {array} points 点的集合 [x,y] 的形式
     * @return {object} 多边形边的长度
     */
    length: function (points) {
        return segments_1.lengthOfSegment(getAllPoints(points));
    },
    /**
     * 根据比例获取多边形的点
     * @param {array} points 点的集合 [x,y] 的形式
     * @param {number} t 在多边形的长度上的比例
     * @return {object} 根据比例值计算出来的点
     */
    pointAt: function (points, t) {
        return segments_1.pointAtSegments(getAllPoints(points), t);
    },
    /**
     * 指定点到多边形的距离
     * @param {array} points 点的集合 [x,y] 的形式
     * @param {number} x 指定点的 x
     * @param {number} y 指定点的 y
     * @return {number} 点到多边形的距离
     */
    pointDistance: function (points, x, y) {
        return segments_1.distanceAtSegment(getAllPoints(points), x, y);
    },
    /**
     * 根据比例获取多边形的切线角度
     * @param {array} points 点的集合 [x,y] 的形式
     * @param {number} t 在多边形的长度上的比例
     * @return {object} 根据比例值计算出来的角度
     */
    tangentAngle: function (points, t) {
        return segments_1.angleAtSegments(getAllPoints(points), t);
    },
};
//# sourceMappingURL=polygon.js.map