import { View } from '../chart';
import { IShape, Point } from '../dependents';
import { IAction, IInteractionContext, LooseObject } from '../interface';
/**
 * 交互的上下文
 */
export default class Context implements IInteractionContext {
    /** 当前所有的 Action */
    actions: IAction[];
    /** 当前 View 实例 */
    view: View;
    /** 当前事件对象 */
    event: LooseObject;
    private cacheMap;
    constructor(view: View);
    /**
     * 缓存信息
     * @param params 缓存的字段
     *  - 如果一个字段则获取缓存
     *  - 两个字段则设置缓存
     */
    cache(...params: any[]): any;
    /**
     * 获取 Action
     * @param name Action 的名称
     */
    getAction(name: string): IAction;
    /**
     * 获取 Action
     * @param action Action 对象
     */
    addAction(action: IAction): void;
    /**
     * 移除 Action
     * @param action Action 对象
     */
    removeAction(action: IAction): void;
    /**
     * 获取当前的点
     */
    getCurrentPoint(): Point;
    /**
     * 获取当前 shape
     * @returns current shape
     */
    getCurrentShape(): IShape;
    /**
     * 当前的触发是否在 View 内
     */
    isInPlot(): boolean;
    /**
     * 是否在指定的图形内
     * @param name shape 的 name
     */
    isInShape(name: any): boolean;
    /**
     * 当前的触发是组件内部
     * @param name 组件名，可以为空
     */
    isInComponent(name?: string): boolean;
    /**
     * 销毁
     */
    destroy(): void;
}
