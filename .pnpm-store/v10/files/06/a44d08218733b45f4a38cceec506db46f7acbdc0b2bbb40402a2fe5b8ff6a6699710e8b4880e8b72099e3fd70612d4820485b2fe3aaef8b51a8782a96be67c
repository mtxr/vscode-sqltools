var LOAD_COMPONENT_CONTROLLERS = {};
/**
 * 全局注册组件。
 * @param name 组件名称
 * @param plugin 注册的组件类
 * @returns void
 */
export function registerComponentController(name, plugin) {
    LOAD_COMPONENT_CONTROLLERS[name] = plugin;
}
/**
 * 删除全局组件。
 * @param name 组件名
 * @returns void
 */
export function unregisterComponentController(name) {
    delete LOAD_COMPONENT_CONTROLLERS[name];
}
/**
 * 获取以注册的组件名。
 * @returns string[] 返回已注册的组件名称
 */
export function getComponentControllerNames() {
    return Object.keys(LOAD_COMPONENT_CONTROLLERS);
}
/**
 * 根据组件名获取组件类。
 * @param name 组件名
 * @returns 返回组件类
 */
export function getComponentController(name) {
    return LOAD_COMPONENT_CONTROLLERS[name];
}
//# sourceMappingURL=index.js.map