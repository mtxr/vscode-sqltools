"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoom = exports.getIdentityMatrix = exports.rotate = exports.getRotateMatrix = exports.translate = exports.transform = void 0;
var matrix_util_1 = require("@antv/matrix-util");
var transform = matrix_util_1.ext.transform;
exports.transform = transform;
/**
 * 对元素进行平移操作。
 * @param element 进行变换的元素
 * @param x x 方向位移
 * @param y y 方向位移
 */
function translate(element, x, y) {
    var matrix = transform(element.getMatrix(), [['t', x, y]]);
    element.setMatrix(matrix);
}
exports.translate = translate;
/**
 * 获取元素旋转矩阵 (以元素的左上角为旋转点)
 * @param element 进行变换的元素
 * @param rotateRadian 旋转弧度
 */
function getRotateMatrix(element, rotateRadian) {
    var _a = element.attr(), x = _a.x, y = _a.y;
    var matrix = transform(element.getMatrix(), [
        ['t', -x, -y],
        ['r', rotateRadian],
        ['t', x, y],
    ]);
    return matrix;
}
exports.getRotateMatrix = getRotateMatrix;
/**
 * 对元素进行旋转操作。
 * @param element 进行变换的元素
 * @param rotateRadian 旋转弧度
 */
function rotate(element, rotateRadian) {
    var matrix = getRotateMatrix(element, rotateRadian);
    element.setMatrix(matrix);
}
exports.rotate = rotate;
/**
 * 获取元矩阵。
 * @returns identity matrix
 */
function getIdentityMatrix() {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1];
}
exports.getIdentityMatrix = getIdentityMatrix;
/**
 * 围绕图形中心点进行缩放
 * @param element 进行缩放的图形元素
 * @param ratio 缩放比例
 */
function zoom(element, ratio) {
    var bbox = element.getBBox();
    var x = (bbox.minX + bbox.maxX) / 2;
    var y = (bbox.minY + bbox.maxY) / 2;
    element.applyToMatrix([x, y, 1]);
    var matrix = transform(element.getMatrix(), [
        ['t', -x, -y],
        ['s', ratio, ratio],
        ['t', x, y],
    ]);
    element.setMatrix(matrix);
}
exports.zoom = zoom;
//# sourceMappingURL=transform.js.map