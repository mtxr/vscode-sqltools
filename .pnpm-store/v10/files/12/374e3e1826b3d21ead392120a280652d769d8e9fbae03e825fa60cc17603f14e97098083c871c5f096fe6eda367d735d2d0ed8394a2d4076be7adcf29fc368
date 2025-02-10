import Element from '../../../geometry/element/';
import StateBase from './state-base';
/**
 * @ignore
 * 区域设置状态的基础 Action
 */
declare class ElementRangeState extends StateBase {
    private startPoint;
    private endPoint;
    private isStarted;
    /**
     * 是否作用于当前 view 的 siblings，默认是 false 仅作用于自己
     */
    protected effectSiblings: boolean;
    /**
     * 是否受 element 的数据影响，还是受包围盒的影响
     */
    protected effectByRecord: boolean;
    private getCurrentPoint;
    /**
     * 开始，记录开始选中的位置
     */
    start(): void;
    protected getIntersectElements(): any;
    /**
     * 选中
     */
    setStateEnable(enable: boolean): void;
    private setSiblingsStateByRecord;
    private setSiblingsState;
    protected setElementsState(elements: Element[], enable: any, allElements: Element[]): void;
    /**
     * 结束
     */
    end(): void;
    clear(): void;
}
export default ElementRangeState;
