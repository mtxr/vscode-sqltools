"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var segments_1 = require("./segments");
var util_1 = require("./util");
exports.default = {
    /**
     * 计算多折线的包围盒
     * @param {array} points 点的集合 [x,y] 的形式
     * @return {object} 包围盒
     */
    box: function (points) {
        var xArr = [];
        var yArr = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            xArr.push(point[0]);
            yArr.push(point[1]);
        }
        return util_1.getBBoxByArray(xArr, yArr);
    },
    /**
     * 计算多折线的长度
     * @param {array} points 点的集合 [x,y] 的形式
     * @return {object} 多条边的长度
     */
    length: function (points) {
        return segments_1.lengthOfSegment(points);
    },
    /**
     * 根据比例获取多折线的点
     * @param {array} points 点的集合 [x,y] 的形式
     * @param {number} t 在多折线的长度上的比例
     * @return {object} 根据比例值计算出来的点
     */
    pointAt: function (points, t) {
        return segments_1.pointAtSegments(points, t);
    },
    /**
     * 指定点到多折线的距离
     * @param {array} points 点的集合 [x,y] 的形式
     * @param {number} x 指定点的 x
     * @param {number} y 指定点的 y
     * @return {number} 点到多折线的距离
     */
    pointDistance: function (points, x, y) {
        return segments_1.distanceAtSegment(points, x, y);
    },
    /**
     * 根据比例获取多折线的切线角度
     * @param {array} points 点的集合 [x,y] 的形式
     * @param {number} t 在多折线的长度上的比例
     * @return {object} 根据比例值计算出来的角度
     */
    tangentAngle: function (points, t) {
        return segments_1.angleAtSegments(points, t);
    },
};
//# sourceMappingURL=polyline.js.map