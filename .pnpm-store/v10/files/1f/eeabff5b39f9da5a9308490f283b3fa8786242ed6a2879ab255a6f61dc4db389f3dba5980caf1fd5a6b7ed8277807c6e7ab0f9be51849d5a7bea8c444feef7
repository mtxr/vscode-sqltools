/**
 * @ignore
 * 坐标移动动画
 * @param shape 图形
 * @param animateCfg
 * @param cfg
 */
export function positionUpdate(shape, animateCfg, cfg) {
    var toAttrs = cfg.toAttrs;
    // @ts-ignore
    var x = toAttrs.x;
    // @ts-ignore
    var y = toAttrs.y;
    // @ts-ignore
    delete toAttrs.x;
    // @ts-ignore
    delete toAttrs.y;
    shape.attr(toAttrs);
    shape.animate({
        x: x,
        y: y,
    }, animateCfg);
}
//# sourceMappingURL=position-update.js.map