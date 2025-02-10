import { ext } from '@antv/matrix-util';
/**
 * @ignore
 * 沿着 x 方向放大的动画
 * @param shape
 * @param animateCfg
 * @param shapeModel
 */
export function scaleInX(shape, animateCfg, cfg) {
    var box = shape.getBBox();
    var mappingData = shape.get('origin').mappingData;
    var points = mappingData.points;
    // x 数值如果为负值，那么应该从右往左生长
    var x = points[0].y - points[1].y > 0 ? box.maxX : box.minX;
    var y = (box.minY + box.maxY) / 2;
    shape.applyToMatrix([x, y, 1]);
    var matrix = ext.transform(shape.getMatrix(), [
        ['t', -x, -y],
        ['s', 0.01, 1],
        ['t', x, y],
    ]);
    shape.setMatrix(matrix);
    shape.animate({
        matrix: ext.transform(shape.getMatrix(), [
            ['t', -x, -y],
            ['s', 100, 1],
            ['t', x, y],
        ]),
    }, animateCfg);
}
/**
 * @ignore
 * 沿着 y 方向放大的动画
 * @param shape
 * @param animateCfg
 * @param shapeModel
 */
export function scaleInY(shape, animateCfg, cfg) {
    var box = shape.getBBox();
    var mappingData = shape.get('origin').mappingData;
    var x = (box.minX + box.maxX) / 2;
    var points = mappingData.points;
    // 数值如果为负值，那么应该从上往下生长，通过 shape 的关键点进行判断
    var y = points[0].y - points[1].y <= 0 ? box.maxY : box.minY;
    shape.applyToMatrix([x, y, 1]);
    var matrix = ext.transform(shape.getMatrix(), [
        ['t', -x, -y],
        ['s', 1, 0.01],
        ['t', x, y],
    ]);
    shape.setMatrix(matrix);
    shape.animate({
        matrix: ext.transform(shape.getMatrix(), [
            ['t', -x, -y],
            ['s', 1, 100],
            ['t', x, y],
        ]),
    }, animateCfg);
}
//# sourceMappingURL=scale-in.js.map