import { deepAssign } from '../../utils';
import { drawBackground, getPixelRatio, getSymbolsPosition, getUnitPatternSize, initCanvas, transformMatrix, } from './util';
/**
 * squarePattern 的 默认配置
 */
export var defaultSquarePatternCfg = {
    size: 6,
    padding: 1,
    isStagger: true,
    backgroundColor: 'transparent',
    opacity: 1,
    rotation: 0,
    fill: '#fff',
    fillOpacity: 0.5,
    stroke: 'transparent',
    lineWidth: 0,
};
/**
 * 绘制square
 *
 * @param context canvasContext
 * @param cfg squarePattern 的配置
 * @param x和y square的中心位置
 */
export function drawSquare(context, cfg, x, y) {
    var stroke = cfg.stroke, size = cfg.size, fill = cfg.fill, lineWidth = cfg.lineWidth, fillOpacity = cfg.fillOpacity;
    context.globalAlpha = fillOpacity;
    context.strokeStyle = stroke;
    context.lineWidth = lineWidth;
    context.fillStyle = fill;
    // 因为正方形绘制从左上角开始，所以x，y做个偏移
    context.strokeRect(x - size / 2, y - size / 2, size, size);
    context.fillRect(x - size / 2, y - size / 2, size, size);
}
/**
 * 创建 squarePattern
 */
export function createSquarePattern(cfg) {
    var squareCfg = deepAssign({}, defaultSquarePatternCfg, cfg);
    var size = squareCfg.size, padding = squareCfg.padding, isStagger = squareCfg.isStagger, rotation = squareCfg.rotation;
    // 计算 画布大小，squares的位置
    var unitSize = getUnitPatternSize(size, padding, isStagger);
    var squares = getSymbolsPosition(unitSize, isStagger); // 计算方法与 dots 一样
    // 初始化 patternCanvas
    var canvas = initCanvas(unitSize, unitSize);
    var ctx = canvas.getContext('2d');
    // 绘制 background，squares
    drawBackground(ctx, squareCfg, unitSize);
    for (var _i = 0, squares_1 = squares; _i < squares_1.length; _i++) {
        var _a = squares_1[_i], x = _a[0], y = _a[1];
        drawSquare(ctx, squareCfg, x, y);
    }
    var pattern = ctx.createPattern(canvas, 'repeat');
    if (pattern) {
        var dpr = getPixelRatio();
        var matrix = transformMatrix(dpr, rotation);
        pattern.setTransform(matrix);
    }
    return pattern;
}
//# sourceMappingURL=square.js.map