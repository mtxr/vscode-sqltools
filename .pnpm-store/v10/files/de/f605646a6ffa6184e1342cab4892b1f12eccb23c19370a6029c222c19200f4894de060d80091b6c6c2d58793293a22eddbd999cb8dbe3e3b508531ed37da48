import { IAction, IInteractionContext, LooseObject } from '../../interface';
/**
 * Action 的基类
 */
declare abstract class Action<T = LooseObject> implements IAction {
    /** Action 名字 */
    name: any;
    /** 上下文对象 */
    context: IInteractionContext;
    /** Action 配置 */
    protected cfg: T;
    /** 配置项的字段，自动负值到 this 上 */
    protected cfgFields: string[];
    constructor(context: IInteractionContext, cfg?: T);
    /**
     * 设置配置项传入的值
     * @param cfg
     */
    protected applyCfg(cfg: any): void;
    /**
     * Inits action，提供给子类用于继承
     */
    init(): void;
    /**
     * Destroys action
     */
    destroy(): void;
}
export default Action;
