"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMethod = exports.register = void 0;
var cache = new Map();
/**
 * 注册计算包围盒的算法
 * @param type 方法名
 * @param method 方法
 */
function register(type, method) {
    cache.set(type, method);
}
exports.register = register;
/**
 * 获取计算包围盒的算法
 * @param type 方法名
 */
function getMethod(type) {
    return cache.get(type);
}
exports.getMethod = getMethod;
//# sourceMappingURL=register.js.map