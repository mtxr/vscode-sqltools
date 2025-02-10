"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEasing = exports.getEasing = void 0;
var d3Ease = require("d3-ease");
var EASING_MAP = {};
/**
 * 根据名称获取对应的动画缓动函数
 * @param type 动画缓动函数名称
 */
function getEasing(type) {
    // 默认从 d3-ease 中获取
    return EASING_MAP[type.toLowerCase()] || d3Ease[type];
}
exports.getEasing = getEasing;
/**
 * 注册动画缓动函数
 * @param type 动画缓动函数名称
 * @param easeFn 动画缓动函数
 */
function registerEasing(type, easeFn) {
    EASING_MAP[type.toLowerCase()] = easeFn;
}
exports.registerEasing = registerEasing;
//# sourceMappingURL=register.js.map