/**
 * 获取设备像素比
 */
export function getPixelRatio() {
    return typeof window === 'object' ? window === null || window === void 0 ? void 0 : window.devicePixelRatio : 2;
}
/**
 * 初始化 cavnas，设置宽高等
 */
export function initCanvas(width, height) {
    if (height === void 0) { height = width; }
    var canvas = document.createElement('canvas');
    var pixelRatio = getPixelRatio();
    // 画布尺寸
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    // 显示尺寸
    canvas.style.width = "".concat(width, "px");
    canvas.style.height = "".concat(height, "px");
    var ctx = canvas.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    return canvas;
}
/**
 * 绘制背景
 *
 * @param context
 * @param cfg
 * @param width
 * @param height
 */
export function drawBackground(context, cfg, width, height) {
    if (height === void 0) { height = width; }
    var backgroundColor = cfg.backgroundColor, opacity = cfg.opacity;
    context.globalAlpha = opacity;
    context.fillStyle = backgroundColor;
    context.beginPath();
    context.fillRect(0, 0, width, height);
    context.closePath();
}
/**
 * 计算贴图单元大小
 *
 * @param size 元素大小
 * @param padding 圆点间隔
 * @param isStagger 是否交错
 * @reutrn 返回贴图单元大小
 */
export function getUnitPatternSize(size, padding, isStagger) {
    // 如果交错, unitSize 放大两倍
    var unitSize = size + padding;
    return isStagger ? unitSize * 2 : unitSize;
}
/**
 * 计算有交错情况的元素坐标
 *
 * @param unitSize 贴图单元大小
 * @param isStagger 是否交错
 * @reutrn 元素中心坐标 x,y 数组集合
 */
export function getSymbolsPosition(unitSize, isStagger) {
    // 如果交错, 交错绘制 dot
    var symbolsPos = isStagger
        ? [
            [unitSize * (1 / 4), unitSize * (1 / 4)],
            [unitSize * (3 / 4), unitSize * (3 / 4)],
        ]
        : [[unitSize * (1 / 2), unitSize * (1 / 2)]];
    return symbolsPos;
}
/**
 * 给整个 pattern贴图 做变换, 目前支持旋转
 *
 * @param pattern 整个贴图
 * @param dpr  设备像素比
 * @param rotation 旋转角度
 */
export function transformMatrix(dpr, rotation) {
    var radian = (rotation * Math.PI) / 180;
    var matrix = {
        a: Math.cos(radian) * (1 / dpr),
        b: Math.sin(radian) * (1 / dpr),
        c: -Math.sin(radian) * (1 / dpr),
        d: Math.cos(radian) * (1 / dpr),
        e: 0,
        f: 0,
    };
    return matrix;
}
//# sourceMappingURL=util.js.map