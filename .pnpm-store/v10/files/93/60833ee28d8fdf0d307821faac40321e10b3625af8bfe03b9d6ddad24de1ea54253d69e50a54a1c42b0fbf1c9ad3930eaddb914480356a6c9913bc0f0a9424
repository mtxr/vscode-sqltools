import CallbackAction from './callback';
import { get } from '@antv/util';
// Action 类的缓存
var ActionCache = {};
/**
 * 根据名称获取 Action 实例
 * @param actionName - action 的名称
 * @param context 上下文
 * @returns Action 实例
 */
export function createAction(actionName, context) {
    var actionOption = ActionCache[actionName];
    var action = null;
    if (actionOption) {
        var ActionClass = actionOption.ActionClass, cfg = actionOption.cfg;
        action = new ActionClass(context, cfg);
        action.name = actionName;
        action.init();
    }
    return action;
}
/**
 * 根据 action 的 name 获取定义的类
 * @param actionName action 的 name
 */
export function getActionClass(actionName) {
    var actionOption = ActionCache[actionName];
    return get(actionOption, 'ActionClass');
}
/**
 * 注册 Action
 * @param actionName - action 的名称
 * @param ActionClass - 继承自 action 的类
 */
export function registerAction(actionName, ActionClass, cfg) {
    ActionCache[actionName] = {
        ActionClass: ActionClass,
        cfg: cfg,
    };
}
/**
 * 取消注册 Action
 * @param actionName action 名称
 */
export function unregisterAction(actionName) {
    delete ActionCache[actionName];
}
/**
 * 根据回调函数获取 Action 实例
 * @param callback - action 的回调函数
 * @param context 上下文
 * @returns Action 实例
 */
export function createCallbackAction(callback, context) {
    var action = new CallbackAction(context);
    action.callback = callback;
    action.name = 'callback';
    return action;
}
//# sourceMappingURL=register.js.map