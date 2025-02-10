"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoomOut = exports.zoomIn = void 0;
var tslib_1 = require("tslib");
var matrix_util_1 = require("@antv/matrix-util");
var util_1 = require("@antv/util");
function doShapeZoom(shape, animateCfg, type) {
    if (shape.isGroup()) {
        (0, util_1.each)(shape.getChildren(), function (child) {
            doShapeZoom(child, animateCfg, type);
        });
    }
    else {
        var bbox = shape.getBBox();
        var x = (bbox.minX + bbox.maxX) / 2;
        var y = (bbox.minY + bbox.maxY) / 2;
        shape.applyToMatrix([x, y, 1]);
        if (type === 'zoomIn') {
            // 放大
            var matrix = matrix_util_1.ext.transform(shape.getMatrix(), [
                ['t', -x, -y],
                ['s', 0.01, 0.01],
                ['t', x, y],
            ]);
            shape.setMatrix(matrix);
            shape.animate({
                matrix: matrix_util_1.ext.transform(shape.getMatrix(), [
                    ['t', -x, -y],
                    ['s', 100, 100],
                    ['t', x, y],
                ]),
            }, animateCfg);
        }
        else {
            shape.animate({
                matrix: matrix_util_1.ext.transform(shape.getMatrix(), [
                    ['t', -x, -y],
                    ['s', 0.01, 0.01],
                    ['t', x, y],
                ]),
            }, tslib_1.__assign(tslib_1.__assign({}, animateCfg), { callback: function () {
                    shape.remove(true);
                    (0, util_1.isFunction)(animateCfg.callback) && animateCfg.callback();
                } }));
        }
    }
}
/**
 * @ignore
 * 单个 shape 动画
 * shape 以自身中心点逐渐放大的进入动画
 * @param shape 参与动画的图形元素
 * @param animateCfg 动画配置
 * @param cfg 额外信息
 */
function zoomIn(shape, animateCfg, cfg) {
    doShapeZoom(shape, animateCfg, 'zoomIn');
}
exports.zoomIn = zoomIn;
/**
 * @ignore
 * 单个 shape 动画
 * 消失动画，shape 以自身为中心点的逐渐缩小
 * @param shape 参与动画的图形元素
 * @param animateCfg 动画配置
 * @param cfg 额外信息
 */
function zoomOut(shape, animateCfg, cfg) {
    doShapeZoom(shape, animateCfg, 'zoomOut');
}
exports.zoomOut = zoomOut;
//# sourceMappingURL=zoom.js.map