"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCallbackAction = exports.unregisterAction = exports.registerAction = exports.getActionClass = exports.createAction = void 0;
var tslib_1 = require("tslib");
var callback_1 = tslib_1.__importDefault(require("./callback"));
var util_1 = require("@antv/util");
// Action 类的缓存
var ActionCache = {};
/**
 * 根据名称获取 Action 实例
 * @param actionName - action 的名称
 * @param context 上下文
 * @returns Action 实例
 */
function createAction(actionName, context) {
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
exports.createAction = createAction;
/**
 * 根据 action 的 name 获取定义的类
 * @param actionName action 的 name
 */
function getActionClass(actionName) {
    var actionOption = ActionCache[actionName];
    return (0, util_1.get)(actionOption, 'ActionClass');
}
exports.getActionClass = getActionClass;
/**
 * 注册 Action
 * @param actionName - action 的名称
 * @param ActionClass - 继承自 action 的类
 */
function registerAction(actionName, ActionClass, cfg) {
    ActionCache[actionName] = {
        ActionClass: ActionClass,
        cfg: cfg,
    };
}
exports.registerAction = registerAction;
/**
 * 取消注册 Action
 * @param actionName action 名称
 */
function unregisterAction(actionName) {
    delete ActionCache[actionName];
}
exports.unregisterAction = unregisterAction;
/**
 * 根据回调函数获取 Action 实例
 * @param callback - action 的回调函数
 * @param context 上下文
 * @returns Action 实例
 */
function createCallbackAction(callback, context) {
    var action = new callback_1.default(context);
    action.callback = callback;
    action.name = 'callback';
    return action;
}
exports.createCallbackAction = createCallbackAction;
//# sourceMappingURL=register.js.map