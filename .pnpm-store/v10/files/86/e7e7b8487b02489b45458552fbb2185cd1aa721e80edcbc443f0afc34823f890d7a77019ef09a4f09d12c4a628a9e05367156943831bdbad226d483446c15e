import { View } from '../chart';
import { LooseObject } from '../interface';
export type InteractionConstructor = new (view: View, cfg: LooseObject) => Interaction;
/**
 * 交互的基类。
 */
export default class Interaction {
    /** view 或者 chart */
    protected view: View;
    /** 配置项 */
    protected cfg: LooseObject;
    constructor(view: View, cfg: LooseObject);
    /**
     * 初始化。
     */
    init(): void;
    /**
     * 绑定事件
     */
    protected initEvents(): void;
    /**
     * 销毁事件
     */
    protected clearEvents(): void;
    /**
     * 销毁。
     */
    destroy(): void;
}
