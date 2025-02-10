"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTickMethod = exports.getTickMethod = void 0;
var methodCache = {};
/**
 * 获取计算 ticks 的方法
 * @param key 键值
 * @returns 计算 ticks 的方法
 */
function getTickMethod(key) {
    return methodCache[key];
}
exports.getTickMethod = getTickMethod;
/**
 * 注册计算 ticks 的方法
 * @param key 键值
 * @param method 方法
 */
function registerTickMethod(key, method) {
    methodCache[key] = method;
}
exports.registerTickMethod = registerTickMethod;
//# sourceMappingURL=register.js.map