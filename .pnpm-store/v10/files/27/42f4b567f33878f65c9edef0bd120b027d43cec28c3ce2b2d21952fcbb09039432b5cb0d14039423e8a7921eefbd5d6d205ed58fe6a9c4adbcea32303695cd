"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
exports.default = {
    /**
     * 计算包围盒
     * @param {number} x 圆心 x
     * @param {number} y 圆心 y
     * @param {number} r 半径
     * @return {object} 包围盒
     */
    box: function (x, y, r) {
        return {
            x: x - r,
            y: y - r,
            width: 2 * r,
            height: 2 * r,
        };
    },
    /**
     * 计算周长
     * @param {number} x 圆心 x
     * @param {number} y 圆心 y
     * @param {number} r 半径
     * @return {number} 周长
     */
    length: function (x, y, r) {
        return Math.PI * 2 * r;
    },
    /**
     * 根据比例获取点
     * @param {number} x 圆心 x
     * @param {number} y 圆心 y
     * @param {number} r 半径
     * @param {number} t 指定比例，x轴方向为 0
     * @return {object} 点
     */
    pointAt: function (x, y, r, t) {
        var angle = Math.PI * 2 * t;
        return {
            x: x + r * Math.cos(angle),
            y: y + r * Math.sin(angle),
        };
    },
    /**
     * 点到圆的距离
     * @param {number} x 圆心 x
     * @param {number} y 圆心 y
     * @param {number} r 半径
     * @param {number} x0  指定的点 x
     * @param {number} y0  指定的点 y
     * @return {number} 距离
     */
    pointDistance: function (x, y, r, x0, y0) {
        return Math.abs(util_1.distance(x, y, x0, y0) - r);
    },
    /**
     * 根据比例计算切线角度
     * @param {number} x 圆心 x
     * @param {number} y 圆心 y
     * @param {number} r 半径
     * @param {number} t 指定比例 0 - 1 之间，x轴方向为 0。在 0-1 范围之外是循环还是返回 null，还需要调整
     * @return {number} 角度，在 0 - 2PI 之间
     */
    tangentAngle: function (x, y, r, t) {
        var angle = Math.PI * 2 * t;
        return util_1.piMod(angle + Math.PI / 2);
    },
};
//# sourceMappingURL=circle.js.map