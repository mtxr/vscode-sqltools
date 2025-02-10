"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.piMod = exports.getBBoxRange = exports.getBBoxByArray = exports.isNumberEqual = exports.distance = void 0;
var util_1 = require("@antv/util");
/**
 * 两点之间的距离
 * @param {number} x1 起始点 x
 * @param {number} y1 起始点 y
 * @param {number} x2 结束点 x
 * @param {number} y2 结束点 y
 * @return {number} 距离
 */
function distance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}
exports.distance = distance;
function isNumberEqual(v1, v2) {
    return Math.abs(v1 - v2) < 0.001;
}
exports.isNumberEqual = isNumberEqual;
function getBBoxByArray(xArr, yArr) {
    var minX = util_1.min(xArr);
    var minY = util_1.min(yArr);
    var maxX = util_1.max(xArr);
    var maxY = util_1.max(yArr);
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}
exports.getBBoxByArray = getBBoxByArray;
function getBBoxRange(x1, y1, x2, y2) {
    return {
        minX: util_1.min([x1, x2]),
        maxX: util_1.max([x1, x2]),
        minY: util_1.min([y1, y2]),
        maxY: util_1.max([y1, y2]),
    };
}
exports.getBBoxRange = getBBoxRange;
function piMod(angle) {
    return (angle + Math.PI * 2) % (Math.PI * 2);
}
exports.piMod = piMod;
//# sourceMappingURL=util.js.map