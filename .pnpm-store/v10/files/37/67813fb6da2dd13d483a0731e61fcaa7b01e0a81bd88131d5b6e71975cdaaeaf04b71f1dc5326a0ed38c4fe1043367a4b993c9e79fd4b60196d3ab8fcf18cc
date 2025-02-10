import Element from '../../../geometry/element/';
import Action from '../base';
/**
 * 状态量 Action 的基类
 * @abstract
 * @class
 * @ignore
 */
declare abstract class StateBase extends Action {
    /**
     * 状态名称
     */
    protected stateName: string;
    /**
     * 设置状态是否激活
     * @param enable 状态值
     */
    protected abstract setStateEnable(enable: boolean): any;
    /**
     * 是否具有某个状态
     * @param element 图表 Element 元素
     */
    protected hasState(element: Element): boolean;
    /**
     * 设置状态激活
     * @param enable 状态值
     */
    protected setElementState(element: Element, enable: boolean): void;
    /**
     * 设置状态
     */
    setState(): void;
    /**
     * 清除所有 Element 的状态
     */
    clear(): void;
    protected clearViewState(view: any): void;
}
export default StateBase;
