"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLinePattern = exports.drawLine = exports.defaultLinePatternCfg = void 0;
var utils_1 = require("../../utils");
var util_1 = require("./util");
/**
 * linePattern 的 默认配置
 */
exports.defaultLinePatternCfg = {
    rotation: 45,
    spacing: 5,
    opacity: 1,
    backgroundColor: 'transparent',
    strokeOpacity: 0.5,
    stroke: '#fff',
    lineWidth: 2,
};
/**
 * 绘制line
 *
 * @param context canvasContext
 * @param cfg linePattern 的配置
 * @param d 绘制 path 所需的 d
 */
function drawLine(context, cfg, d) {
    var stroke = cfg.stroke, lineWidth = cfg.lineWidth, strokeOpacity = cfg.strokeOpacity;
    var path = new Path2D(d);
    context.globalAlpha = strokeOpacity;
    context.lineCap = 'square';
    context.strokeStyle = lineWidth ? stroke : 'transparent';
    context.lineWidth = lineWidth;
    context.stroke(path);
}
exports.drawLine = drawLine;
/**
 * 创建 linePattern
 */
function createLinePattern(cfg) {
    var lineCfg = (0, utils_1.deepAssign)({}, exports.defaultLinePatternCfg, cfg);
    var spacing = lineCfg.spacing, rotation = lineCfg.rotation, lineWidth = lineCfg.lineWidth;
    // 计算 pattern 画布的大小， path 所需的 d
    var width = spacing + lineWidth || 1;
    var height = spacing + lineWidth || 1;
    var d = "\n            M 0 0 L ".concat(width, " 0\n            M 0 ").concat(height, " L ").concat(width, " ").concat(height, "\n            ");
    // 初始化 patternCanvas
    var canvas = (0, util_1.initCanvas)(width, height);
    var ctx = canvas.getContext('2d');
    // 绘制 background，line
    (0, util_1.drawBackground)(ctx, lineCfg, width, height);
    drawLine(ctx, lineCfg, d);
    var pattern = ctx.createPattern(canvas, 'repeat');
    if (pattern) {
        var dpr = (0, util_1.getPixelRatio)();
        var matrix = (0, util_1.transformMatrix)(dpr, rotation);
        pattern.setTransform(matrix);
    }
    // 返回 Pattern 对象
    return pattern;
}
exports.createLinePattern = createLinePattern;
//# sourceMappingURL=line.js.map