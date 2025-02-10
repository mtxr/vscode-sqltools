"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var vec2 = require("gl-matrix/vec2");
exports.default = {
    /**
     * 计算线段的包围盒
     * @param {number} x1 起始点 x
     * @param {number} y1 起始点 y
     * @param {number} x2 结束点 x
     * @param {number} y2 结束点 y
     * @return {object} 包围盒对象
     */
    box: function (x1, y1, x2, y2) {
        return util_1.getBBoxByArray([x1, x2], [y1, y2]);
    },
    /**
     * 线段的长度
     * @param {number} x1 起始点 x
     * @param {number} y1 起始点 y
     * @param {number} x2 结束点 x
     * @param {number} y2 结束点 y
     * @return {number} 距离
     */
    length: function (x1, y1, x2, y2) {
        return util_1.distance(x1, y1, x2, y2);
    },
    /**
     * 根据比例获取点
     * @param {number} x1 起始点 x
     * @param {number} y1 起始点 y
     * @param {number} x2 结束点 x
     * @param {number} y2 结束点 y
     * @param {number} t 指定比例
     * @return {object} 包含 x, y 的点
     */
    pointAt: function (x1, y1, x2, y2, t) {
        return {
            x: (1 - t) * x1 + t * x2,
            y: (1 - t) * y1 + t * y2,
        };
    },
    /**
     * 点到线段的距离
     * @param {number} x1 起始点 x
     * @param {number} y1 起始点 y
     * @param {number} x2 结束点 x
     * @param {number} y2 结束点 y
     * @param {number} x  测试点 x
     * @param {number} y  测试点 y
     * @return {number} 距离
     */
    pointDistance: function (x1, y1, x2, y2, x, y) {
        // 投影距离 x1, y1 的向量，假设 p, p1, p2 三个点，投影点为 a
        // p1a = p1p.p1p2/|p1p2| * (p1p 的单位向量)
        var cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1);
        if (cross < 0) {
            return util_1.distance(x1, y1, x, y);
        }
        var lengthSquare = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        if (cross > lengthSquare) {
            return util_1.distance(x2, y2, x, y);
        }
        return this.pointToLine(x1, y1, x2, y2, x, y);
    },
    /**
     * 点到直线的距离，而不是点到线段的距离
     * @param {number} x1 起始点 x
     * @param {number} y1 起始点 y
     * @param {number} x2 结束点 x
     * @param {number} y2 结束点 y
     * @param {number} x  测试点 x
     * @param {number} y  测试点 y
     * @return {number} 距离
     */
    pointToLine: function (x1, y1, x2, y2, x, y) {
        var d = [x2 - x1, y2 - y1];
        // 如果端点相等，则判定点到点的距离
        if (vec2.exactEquals(d, [0, 0])) {
            return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
        }
        var u = [-d[1], d[0]];
        vec2.normalize(u, u);
        var a = [x - x1, y - y1];
        return Math.abs(vec2.dot(a, u));
    },
    /**
     * 线段的角度
     * @param {number} x1 起始点 x
     * @param {number} y1 起始点 y
     * @param {number} x2 结束点 x
     * @param {number} y2 结束点 y
     * @return {number} 导数
     */
    tangentAngle: function (x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
};
//# sourceMappingURL=line.js.map