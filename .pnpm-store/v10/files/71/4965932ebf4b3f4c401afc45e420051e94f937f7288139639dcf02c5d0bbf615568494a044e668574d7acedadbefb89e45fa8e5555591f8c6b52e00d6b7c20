import { IList, ListItem } from '../../../dependents';
import ListState from './list-state';
/**
 * highlight Action 的效果是 active 和 inactive 两个状态的组合
 * @class
 * @ignore
 */
declare class ListHighlight extends ListState {
    protected stateName: string;
    protected ignoreItemStates: string[];
    protected setItemsState(list: IList, name: string, enable: boolean): void;
    protected setItemState(list: IList, item: ListItem, enable: boolean): void;
    private setHighlightBy;
    /**
     * highlight 图例项（坐标轴文本）
     */
    highlight(): void;
    clear(): void;
}
export default ListHighlight;
