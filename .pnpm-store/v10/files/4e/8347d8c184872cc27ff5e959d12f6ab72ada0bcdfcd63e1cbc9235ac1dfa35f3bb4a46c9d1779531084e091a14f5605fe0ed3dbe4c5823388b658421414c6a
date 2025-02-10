import { ListItem } from '../../../dependents';
import Element from '../../../geometry/element/';
import StateAction from './state';
import { ELEMENT_STATE } from '../../../constant';
export declare const STATUS_UNACTIVE = ELEMENT_STATE.INACTIVE;
export declare const STATUS_ACTIVE = ELEMENT_STATE.ACTIVE;
export type Callback = (el: any) => boolean;
/**
 * @ignore
 * highlight，指定图形高亮，其他图形变暗
 */
declare class ElementHighlight extends StateAction {
    protected stateName: string;
    protected setElementsStateByItem(elements: Element[], field: string, item: ListItem, enable: boolean): void;
    protected setElementHighlight(el: Element, callback: Callback): void;
    protected setHighlightBy(elements: Element[], callback: Callback, enable: boolean): void;
    protected setElementState(element: Element, enable: boolean): void;
    highlight(): void;
    clear(): void;
}
export default ElementHighlight;
