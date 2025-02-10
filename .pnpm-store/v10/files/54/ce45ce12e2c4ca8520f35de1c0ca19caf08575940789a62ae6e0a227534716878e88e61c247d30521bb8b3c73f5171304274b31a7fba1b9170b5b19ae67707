import { View } from '../chart';
import { ActionCallback, IAction, IInteractionContext } from '../interface';
import Interaction from './interaction';
export declare function parseAction(actionStr: string, context: IInteractionContext, arg?: any): ActionObject;
/** 交互环节的定义 */
export interface InteractionStep {
    /**
     * 触发事件，支持 view，chart 的各种事件，也支持 document、window 的事件
     */
    trigger: string;
    /**
     * 是否可以触发 action
     * @param context - 交互的上下文
     */
    isEnable?: (context: IInteractionContext) => boolean;
    /**
     * 反馈，支持三种方式：
     * - action:method : action 的名字和方法的组合
     * - [’action1:method1‘, ’action2:method‘]
     * - ActionCallback: 回调函数
     */
    action: string | string[] | ActionCallback;
    /**
     * 反馈，具体 action method 的参数：
     * - 当传递多个 action 时，args 必须是一个数组
     */
    arg?: any | any[];
    /**
     * 回调函数，action 执行后执行
     */
    callback?: (context: IInteractionContext) => void;
    /**
     * @private
     * 不需要用户传入，通过上面的属性计算出来的属性
     */
    actionObject?: ActionObject | ActionObject[];
    /**
     * 在一个环节内是否只允许执行一次
     */
    once?: boolean;
    /**
     * 是否增加节流
     */
    throttle?: ThrottleOption;
    /**
     * 是否延迟
     */
    debounce?: DebounceOption;
}
/**
 * debounce 的配置
 */
export interface DebounceOption {
    /**
     * 等待时间
     */
    wait: number;
    /**
     * 是否马上执行
     */
    immediate?: boolean;
}
/**
 * throttle 的配置
 */
export interface ThrottleOption {
    /**
     * 等待时间
     */
    wait: number;
    /**
     * 马上就执行
     */
    leading?: boolean;
    /**
     * 执行完毕后再执行一次
     */
    trailing?: boolean;
}
/** 缓存 action 对象，仅用于当前文件 */
interface ActionObject {
    /**
     * 缓存的 action
     */
    action: IAction;
    /**
     * action 的方法
     */
    methodName: string;
    /**
     * 用户传递的 action 方法的参数
     */
    arg?: any;
}
/** 交互的所有环节 */
export interface InteractionSteps {
    /**
     * 显示交互可以进行
     */
    showEnable?: InteractionStep[];
    /**
     * 交互开始
     */
    start?: InteractionStep[];
    /**
     * 交互持续
     */
    processing?: InteractionStep[];
    /**
     * 交互结束
     */
    end?: InteractionStep[];
    /**
     * 交互回滚
     */
    rollback?: InteractionStep[];
}
/**
 * 支持语法的交互类
 */
export default class GrammarInteraction extends Interaction {
    private steps;
    /** 当前执行到的阶段 */
    currentStepName: string;
    /**
     * 当前交互的上下文
     */
    context: IInteractionContext;
    private callbackCaches;
    private emitCaches;
    constructor(view: View, steps: InteractionSteps);
    /**
     * 初始化
     */
    init(): void;
    /**
     * 清理资源
     */
    destroy(): void;
    /**
     * 绑定事件
     */
    protected initEvents(): void;
    /**
     * 清理绑定的事件
     */
    protected clearEvents(): void;
    private initContext;
    private isAllowStep;
    private isAllowExecute;
    private enterStep;
    private afterExecute;
    private getKey;
    private getActionCallback;
    private bindEvent;
    private offEvent;
}
export {};
