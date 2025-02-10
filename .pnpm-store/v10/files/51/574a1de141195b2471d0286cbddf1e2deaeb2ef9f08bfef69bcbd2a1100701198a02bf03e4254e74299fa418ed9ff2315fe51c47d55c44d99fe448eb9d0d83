"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vertical = exports.angleTo = exports.direction = exports.transform = exports.leftScale = exports.leftRotate = exports.leftTranslate = void 0;
/**
 * @description 扩展方法，提供 gl-matrix 为提供的方法
 * */
var gl_matrix_1 = require("gl-matrix");
function leftTranslate(out, a, v) {
    var transMat = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    gl_matrix_1.mat3.fromTranslation(transMat, v);
    return gl_matrix_1.mat3.multiply(out, transMat, a);
}
exports.leftTranslate = leftTranslate;
function leftRotate(out, a, rad) {
    var rotateMat = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    gl_matrix_1.mat3.fromRotation(rotateMat, rad);
    return gl_matrix_1.mat3.multiply(out, rotateMat, a);
}
exports.leftRotate = leftRotate;
function leftScale(out, a, v) {
    var scaleMat = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    gl_matrix_1.mat3.fromScaling(scaleMat, v);
    return gl_matrix_1.mat3.multiply(out, scaleMat, a);
}
exports.leftScale = leftScale;
function leftMultiply(out, a, a1) {
    return gl_matrix_1.mat3.multiply(out, a1, a);
}
/**
 * 根据 actions 来做 transform
 * @param m
 * @param actions
 */
function transform(m, actions) {
    var matrix = m ? [].concat(m) : [1, 0, 0, 0, 1, 0, 0, 0, 1];
    for (var i = 0, len = actions.length; i < len; i++) {
        var action = actions[i];
        switch (action[0]) {
            case 't':
                leftTranslate(matrix, matrix, [action[1], action[2]]);
                break;
            case 's':
                leftScale(matrix, matrix, [action[1], action[2]]);
                break;
            case 'r':
                leftRotate(matrix, matrix, action[1]);
                break;
            case 'm':
                leftMultiply(matrix, matrix, action[1]);
                break;
            default:
                break;
        }
    }
    return matrix;
}
exports.transform = transform;
/**
 * 向量 v1 到 向量 v2 夹角的方向
 * @param  {Array} v1 向量
 * @param  {Array} v2 向量
 * @return {Boolean} >= 0 顺时针 < 0 逆时针
 */
function direction(v1, v2) {
    return v1[0] * v2[1] - v2[0] * v1[1];
}
exports.direction = direction;
/**
 * 二维向量 v1 到 v2 的夹角
 * @param v1
 * @param v2
 * @param direct
 */
function angleTo(v1, v2, direct) {
    var ang = gl_matrix_1.vec2.angle(v1, v2);
    var angleLargeThanPI = direction(v1, v2) >= 0;
    if (direct) {
        if (angleLargeThanPI) {
            return Math.PI * 2 - ang;
        }
        return ang;
    }
    if (angleLargeThanPI) {
        return ang;
    }
    return Math.PI * 2 - ang;
}
exports.angleTo = angleTo;
/**
 * 计算二维向量的垂直向量
 * @param out
 * @param v
 * @param flag
 */
function vertical(out, v, flag) {
    if (flag) {
        out[0] = v[1];
        out[1] = -1 * v[0];
    }
    else {
        out[0] = -1 * v[1];
        out[1] = v[0];
    }
    return out;
}
exports.vertical = vertical;
//# sourceMappingURL=ext.js.map