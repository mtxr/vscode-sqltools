import { ListItem } from '../../../dependents';
import Element from '../../../geometry/element/';
import StateBase from './state-base';
/**
 * 状态量 Action 的基类，允许多个 Element 同时拥有某个状态
 * @class
 * @ignore
 */
declare class ElementState extends StateBase {
    protected ignoreListItemStates: string[];
    private isItemIgnore;
    private setStateByComponent;
    protected setStateByElement(element: Element, enable: boolean): void;
    /** 组件的选项是否同 element 匹配 */
    protected isMathItem(element: Element, field: string, item: ListItem): boolean;
    protected setElementsStateByItem(elements: Element[], field: string, item: ListItem, enable: boolean): void;
    /** 设置状态是否激活 */
    protected setStateEnable(enable: boolean): void;
    /**
     * 切换状态
     */
    toggle(): void;
    /**
     * 取消当前时间影响的状态
     */
    reset(): void;
}
export default ElementState;
