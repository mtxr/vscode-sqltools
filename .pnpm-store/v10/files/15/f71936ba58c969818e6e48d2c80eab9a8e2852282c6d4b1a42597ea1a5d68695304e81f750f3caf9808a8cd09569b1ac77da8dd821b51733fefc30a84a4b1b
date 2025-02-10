import { IList, ListItem } from '../../../dependents';
import { LooseObject } from '../../../interface';
import Action from '../base';
/** @ignore */
interface ListStateCfg {
    componentNames: string[];
}
/**
 * 列表项状态 Action 的基础类
 * @class
 * @ignore
 */
declare class ListState extends Action<ListStateCfg> {
    protected stateName: string;
    protected ignoreItemStates: any[];
    /** 获取触发的列表组件 */
    protected getTriggerListInfo(): LooseObject;
    protected getAllowComponents(): any[];
    /** 是否存在指定的状态 */
    protected hasState(list: IList, item: ListItem): boolean;
    /** 清理组件的状态 */
    protected clearAllComponentsState(): void;
    protected allowSetStateByElement(component: any): boolean;
    private allowSetStateByItem;
    private setStateByElement;
    protected setStateEnable(enable: boolean): void;
    protected setItemsState(list: IList, name: string, enable: boolean): void;
    protected setItemState(list: IList, item: ListItem, enable: boolean): void;
    /**
     * 设置状态
     */
    setState(): void;
    /**
     * 取消状态
     */
    reset(): void;
    /**
     * 切换状态
     */
    toggle(): void;
    /**
     * 取消状态
     */
    clear(): void;
}
export default ListState;
