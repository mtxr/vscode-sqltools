import * as d3Ease from 'd3-ease';
var EASING_MAP = {};
/**
 * 根据名称获取对应的动画缓动函数
 * @param type 动画缓动函数名称
 */
export function getEasing(type) {
    // 默认从 d3-ease 中获取
    return EASING_MAP[type.toLowerCase()] || d3Ease[type];
}
/**
 * 注册动画缓动函数
 * @param type 动画缓动函数名称
 * @param easeFn 动画缓动函数
 */
export function registerEasing(type, easeFn) {
    EASING_MAP[type.toLowerCase()] = easeFn;
}
//# sourceMappingURL=register.js.map