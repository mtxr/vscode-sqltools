import { ActionCallback, IInteractionContext, LooseObject } from '../../interface';
import Action from './base';
import CallbackAction from './callback';
/** Action 构造函数 */
type ActionConstructor = new (context: IInteractionContext, cfg?: LooseObject) => Action;
/**
 * 根据名称获取 Action 实例
 * @param actionName - action 的名称
 * @param context 上下文
 * @returns Action 实例
 */
export declare function createAction(actionName: string, context: IInteractionContext): Action;
/**
 * 根据 action 的 name 获取定义的类
 * @param actionName action 的 name
 */
export declare function getActionClass(actionName: string): ActionConstructor;
/**
 * 注册 Action
 * @param actionName - action 的名称
 * @param ActionClass - 继承自 action 的类
 */
export declare function registerAction(actionName: string, ActionClass: ActionConstructor, cfg?: LooseObject): void;
/**
 * 取消注册 Action
 * @param actionName action 名称
 */
export declare function unregisterAction(actionName: string): void;
/**
 * 根据回调函数获取 Action 实例
 * @param callback - action 的回调函数
 * @param context 上下文
 * @returns Action 实例
 */
export declare function createCallbackAction(callback: ActionCallback, context: IInteractionContext): CallbackAction;
export {};
