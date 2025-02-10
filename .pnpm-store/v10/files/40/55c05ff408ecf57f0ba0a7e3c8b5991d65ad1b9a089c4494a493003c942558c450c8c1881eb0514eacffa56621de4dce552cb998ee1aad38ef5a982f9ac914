"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionUpdate = void 0;
/**
 * @ignore
 * 坐标移动动画
 * @param shape 图形
 * @param animateCfg
 * @param cfg
 */
function positionUpdate(shape, animateCfg, cfg) {
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
exports.positionUpdate = positionUpdate;
//# sourceMappingURL=position-update.js.map