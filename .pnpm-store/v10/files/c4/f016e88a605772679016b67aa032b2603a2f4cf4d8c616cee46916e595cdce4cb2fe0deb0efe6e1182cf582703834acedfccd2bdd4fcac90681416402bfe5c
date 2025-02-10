import EE from '@antv/event-emitter';
interface BaseCfg {
    visible?: boolean;
}
/**
 * G2 Chart、View、Geometry 以及 Element 等的基类，提供事件以及一些通用的方法。
 */
export default class Base extends EE {
    /** 是否可见 */
    visible: boolean;
    /** 标识对象是否已销毁 */
    destroyed: boolean;
    constructor(cfg: BaseCfg);
    /**
     * 显示。
     */
    show(): void;
    /**
     * 隐藏。
     */
    hide(): void;
    /**
     * 销毁。
     */
    destroy(): void;
    /**
     * 显示或者隐藏。
     * @param visible
     * @returns
     */
    changeVisible(visible: boolean): void;
}
export {};
