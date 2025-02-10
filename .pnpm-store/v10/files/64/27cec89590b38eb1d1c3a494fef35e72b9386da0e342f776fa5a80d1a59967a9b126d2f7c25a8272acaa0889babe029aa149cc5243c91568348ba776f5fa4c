import { __assign } from "tslib";
import { ext } from '@antv/matrix-util';
import { each, isFunction } from '@antv/util';
function doShapeZoom(shape, animateCfg, type) {
    if (shape.isGroup()) {
        each(shape.getChildren(), function (child) {
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
            var matrix = ext.transform(shape.getMatrix(), [
                ['t', -x, -y],
                ['s', 0.01, 0.01],
                ['t', x, y],
            ]);
            shape.setMatrix(matrix);
            shape.animate({
                matrix: ext.transform(shape.getMatrix(), [
                    ['t', -x, -y],
                    ['s', 100, 100],
                    ['t', x, y],
                ]),
            }, animateCfg);
        }
        else {
            shape.animate({
                matrix: ext.transform(shape.getMatrix(), [
                    ['t', -x, -y],
                    ['s', 0.01, 0.01],
                    ['t', x, y],
                ]),
            }, __assign(__assign({}, animateCfg), { callback: function () {
                    shape.remove(true);
                    isFunction(animateCfg.callback) && animateCfg.callback();
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
export function zoomIn(shape, animateCfg, cfg) {
    doShapeZoom(shape, animateCfg, 'zoomIn');
}
/**
 * @ignore
 * 单个 shape 动画
 * 消失动画，shape 以自身为中心点的逐渐缩小
 * @param shape 参与动画的图形元素
 * @param animateCfg 动画配置
 * @param cfg 额外信息
 */
export function zoomOut(shape, animateCfg, cfg) {
    doShapeZoom(shape, animateCfg, 'zoomOut');
}
//# sourceMappingURL=zoom.js.map