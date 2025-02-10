import { IList, ListItem } from '../../../dependents';
import ListState from './list-state';
/**
 * checked Action
 * 提供三个对外方法
 * 1. toggle 切换状态
 * 2. checked 选中
 * 3. reset 清除重置
 */
declare class ListChecked extends ListState {
    protected stateName: string;
    protected setItemState(list: IList, item: ListItem, enable: boolean): void;
    private setCheckedBy;
    /**
     * 切换状态.
     * 1. 当全部选中的时候 或者 当前 item 未选中时，进行激活操作
     * 2. 否则，重置
     * @override
     */
    toggle(): void;
    /**
     * checked 图例项
     */
    checked(): void;
    /**
     * 重置，需要全部清理 checked 和 unchecked
     */
    reset(): void;
}
export default ListChecked;
