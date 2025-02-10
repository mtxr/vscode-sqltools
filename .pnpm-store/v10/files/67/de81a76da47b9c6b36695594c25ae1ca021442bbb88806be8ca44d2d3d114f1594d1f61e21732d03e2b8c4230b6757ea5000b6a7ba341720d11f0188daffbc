import { deepAssign } from '../../utils';
import { drawBackground, getPixelRatio, getSymbolsPosition, getUnitPatternSize, initCanvas, transformMatrix, } from './util';
/**
 * dotPattern的默认配置
 */
export var defaultDotPatternCfg = {
    size: 6,
    padding: 2,
    backgroundColor: 'transparent',
    opacity: 1,
    rotation: 0,
    fill: '#fff',
    fillOpacity: 0.5,
    stroke: 'transparent',
    lineWidth: 0,
    isStagger: true,
};
/**
 * 绘制圆点
 *
 * @param context
 * @param cfg
 * @param x 圆点中心坐标x
 * @param y 圆点中心坐标y
 */
export function drawDot(context, cfg, x, y) {
    var size = cfg.size, fill = cfg.fill, lineWidth = cfg.lineWidth, stroke = cfg.stroke, fillOpacity = cfg.fillOpacity;
    context.beginPath();
    context.globalAlpha = fillOpacity;
    context.fillStyle = fill;
    context.strokeStyle = stroke;
    context.lineWidth = lineWidth;
    context.arc(x, y, size / 2, 0, 2 * Math.PI, false);
    context.fill();
    if (lineWidth) {
        context.stroke();
    }
    context.closePath();
}
/**
 * 创建 dot pattern，返回 HTMLCanvasElement
 *
 * @param cfg
 * @returns HTMLCanvasElement
 */
export function createDotPattern(cfg) {
    var dotCfg = deepAssign({}, defaultDotPatternCfg, cfg);
    var size = dotCfg.size, padding = dotCfg.padding, isStagger = dotCfg.isStagger, rotation = dotCfg.rotation;
    // 计算 画布大小，dots的位置
    var unitSize = getUnitPatternSize(size, padding, isStagger);
    var dots = getSymbolsPosition(unitSize, isStagger);
    // 初始化 patternCanvas
    var canvas = initCanvas(unitSize, unitSize);
    var ctx = canvas.getContext('2d');
    // 绘制 background，dots
    drawBackground(ctx, dotCfg, unitSize);
    for (var _i = 0, dots_1 = dots; _i < dots_1.length; _i++) {
        var _a = dots_1[_i], x = _a[0], y = _a[1];
        drawDot(ctx, dotCfg, x, y);
    }
    var pattern = ctx.createPattern(canvas, 'repeat');
    if (pattern) {
        var dpr = getPixelRatio();
        var matrix = transformMatrix(dpr, rotation);
        pattern.setTransform(matrix);
    }
    return pattern;
}
//# sourceMappingURL=dot.js.map