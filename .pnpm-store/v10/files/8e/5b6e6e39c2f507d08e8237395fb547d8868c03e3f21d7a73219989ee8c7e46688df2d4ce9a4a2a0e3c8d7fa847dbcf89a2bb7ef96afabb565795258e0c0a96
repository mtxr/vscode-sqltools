import Element from '../../../geometry/element';
import ElementRangeState from './range-state';
declare enum EVENTS {
    BEFORE_HIGHLIGHT = "element-range-highlight:beforehighlight",
    AFTER_HIGHLIGHT = "element-range-highlight:afterhighlight",
    BEFORE_CLEAR = "element-range-highlight:beforeclear",
    AFTER_CLEAR = "element-range-highlight:afterclear"
}
export { EVENTS as ELEMENT_RANGE_HIGHLIGHT_EVENTS };
/**
 * @ignore
 * 区域 highlight 的 Action
 */
declare class ElementRangeHighlight extends ElementRangeState {
    protected stateName: string;
    protected clearViewState(view: any): void;
    /**
     * 设置 highlight
     */
    highlight(): void;
    /**
     * @overrider 添加事件
     */
    clear(): void;
    protected setElementsState(elements: Element[], enable: boolean, allElements: Element[]): void;
}
export default ElementRangeHighlight;
