"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathIn = void 0;
/**
 * @ignore
 * 入场动画
 * path 的入场动画
 * @param element 执行动画的元素
 * @param animateCfg 动画配置
 * @param cfg 额外信息
 */
function pathIn(element, animateCfg, cfg) {
    // @ts-ignore
    var length = element.getTotalLength();
    // 设置虚线样式
    element.attr('lineDash', [length]);
    element.animate(function (ratio) {
        return {
            // 对虚线偏移量做动画
            lineDashOffset: (1 - ratio) * length,
        };
    }, animateCfg);
}
exports.pathIn = pathIn;
//# sourceMappingURL=path-in.js.map