"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doScaleAnimate = exports.transformShape = void 0;
var tslib_1 = require("tslib");
var matrix_util_1 = require("@antv/matrix-util");
/**
 * @ignore
 * 对图形元素进行矩阵变换，同时返回变换前的图形矩阵
 * @param shape 进行矩阵变换的图形
 * @param vector 矩阵变换的中心点
 * @param direct 矩阵变换的类型
 */
function transformShape(shape, vector, direct) {
    var scaledMatrix;
    var _a = tslib_1.__read(vector, 2), x = _a[0], y = _a[1];
    shape.applyToMatrix([x, y, 1]);
    if (direct === 'x') {
        shape.setMatrix(matrix_util_1.ext.transform(shape.getMatrix(), [
            ['t', -x, -y],
            ['s', 0.01, 1],
            ['t', x, y],
        ]));
        scaledMatrix = matrix_util_1.ext.transform(shape.getMatrix(), [
            ['t', -x, -y],
            ['s', 100, 1],
            ['t', x, y],
        ]);
    }
    else if (direct === 'y') {
        shape.setMatrix(matrix_util_1.ext.transform(shape.getMatrix(), [
            ['t', -x, -y],
            ['s', 1, 0.01],
            ['t', x, y],
        ]));
        scaledMatrix = matrix_util_1.ext.transform(shape.getMatrix(), [
            ['t', -x, -y],
            ['s', 1, 100],
            ['t', x, y],
        ]);
    }
    else if (direct === 'xy') {
        shape.setMatrix(matrix_util_1.ext.transform(shape.getMatrix(), [
            ['t', -x, -y],
            ['s', 0.01, 0.01],
            ['t', x, y],
        ]));
        scaledMatrix = matrix_util_1.ext.transform(shape.getMatrix(), [
            ['t', -x, -y],
            ['s', 100, 100],
            ['t', x, y],
        ]);
    }
    return scaledMatrix;
}
exports.transformShape = transformShape;
/**
 * 对图形元素进行剪切动画
 * @param element 进行动画的图形元素
 * @param animateCfg 动画配置
 * @param coordinate 当前坐标系
 * @param yMinPoint y 轴的最小值对应的图形坐标点
 * @param type 剪切动画的类型
 */
function doScaleAnimate(element, animateCfg, coordinate, yMinPoint, type) {
    var start = coordinate.start, end = coordinate.end;
    var width = coordinate.getWidth();
    var height = coordinate.getHeight();
    var x;
    var y;
    if (type === 'y') {
        x = start.x + width / 2;
        y = yMinPoint.y < start.y ? yMinPoint.y : start.y;
    }
    else if (type === 'x') {
        x = yMinPoint.x > start.x ? yMinPoint.x : start.x;
        y = start.y + height / 2;
    }
    else if (type === 'xy') {
        if (coordinate.isPolar) {
            x = coordinate.getCenter().x;
            y = coordinate.getCenter().y;
        }
        else {
            x = (start.x + end.x) / 2;
            y = (start.y + end.y) / 2;
        }
    }
    var endMatrix = transformShape(element, [x, y], type);
    element.animate({
        matrix: endMatrix,
    }, animateCfg);
}
exports.doScaleAnimate = doScaleAnimate;
//# sourceMappingURL=util.js.map