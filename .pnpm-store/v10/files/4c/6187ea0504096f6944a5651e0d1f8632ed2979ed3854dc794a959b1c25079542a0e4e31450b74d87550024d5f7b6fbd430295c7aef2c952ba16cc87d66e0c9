"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAnimation = exports.getAnimation = void 0;
var ANIMATIONS_MAP = {};
/**
 * 根据名称获取对应的动画执行函数
 * @param type 动画函数名称
 */
function getAnimation(type) {
    return ANIMATIONS_MAP[type.toLowerCase()];
}
exports.getAnimation = getAnimation;
/**
 * 注册动画执行函数
 * @param type 动画执行函数名称
 * @param animation 动画执行函数
 */
function registerAnimation(type, animation) {
    ANIMATIONS_MAP[type.toLowerCase()] = animation;
}
exports.registerAnimation = registerAnimation;
//# sourceMappingURL=index.js.map