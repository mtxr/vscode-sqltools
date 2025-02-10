"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fadeOut = exports.fadeIn = void 0;
var util_1 = require("@antv/util");
/**
 * @ignore
 * 单个 shape 动画
 * 渐现动画
 * @param shape 执行动画的图形元素
 * @param animateCfg 动画配置
 * @param cfg 额外信息
 */
function fadeIn(shape, animateCfg, cfg) {
    var endState = {
        fillOpacity: (0, util_1.isNil)(shape.attr('fillOpacity')) ? 1 : shape.attr('fillOpacity'),
        strokeOpacity: (0, util_1.isNil)(shape.attr('strokeOpacity')) ? 1 : shape.attr('strokeOpacity'),
        opacity: (0, util_1.isNil)(shape.attr('opacity')) ? 1 : shape.attr('opacity'),
    };
    shape.attr({
        fillOpacity: 0,
        strokeOpacity: 0,
        opacity: 0,
    });
    shape.animate(endState, animateCfg);
}
exports.fadeIn = fadeIn;
/**
 * @ignore
 * 单个 shape 动画
 * 渐隐动画
 * @param shape 执行动画的图形元素
 * @param animateCfg 动画配置
 * @param cfg 额外信息
 */
function fadeOut(shape, animateCfg, cfg) {
    var endState = {
        fillOpacity: 0,
        strokeOpacity: 0,
        opacity: 0,
    };
    var easing = animateCfg.easing, duration = animateCfg.duration, delay = animateCfg.delay;
    shape.animate(endState, duration, easing, function () {
        shape.remove(true);
    }, delay);
}
exports.fadeOut = fadeOut;
//# sourceMappingURL=fade.js.map