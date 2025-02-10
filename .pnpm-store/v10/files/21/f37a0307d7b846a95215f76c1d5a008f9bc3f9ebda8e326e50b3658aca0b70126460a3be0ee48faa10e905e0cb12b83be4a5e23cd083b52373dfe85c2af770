"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponentController = exports.getComponentControllerNames = exports.unregisterComponentController = exports.registerComponentController = void 0;
var LOAD_COMPONENT_CONTROLLERS = {};
/**
 * 全局注册组件。
 * @param name 组件名称
 * @param plugin 注册的组件类
 * @returns void
 */
function registerComponentController(name, plugin) {
    LOAD_COMPONENT_CONTROLLERS[name] = plugin;
}
exports.registerComponentController = registerComponentController;
/**
 * 删除全局组件。
 * @param name 组件名
 * @returns void
 */
function unregisterComponentController(name) {
    delete LOAD_COMPONENT_CONTROLLERS[name];
}
exports.unregisterComponentController = unregisterComponentController;
/**
 * 获取以注册的组件名。
 * @returns string[] 返回已注册的组件名称
 */
function getComponentControllerNames() {
    return Object.keys(LOAD_COMPONENT_CONTROLLERS);
}
exports.getComponentControllerNames = getComponentControllerNames;
/**
 * 根据组件名获取组件类。
 * @param name 组件名
 * @returns 返回组件类
 */
function getComponentController(name) {
    return LOAD_COMPONENT_CONTROLLERS[name];
}
exports.getComponentController = getComponentController;
//# sourceMappingURL=index.js.map