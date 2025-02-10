import { IList } from '../interfaces';
import { CategoryLegendCfg, ListItem } from '../types';
import LegendBase from './base';
declare class Category extends LegendBase<CategoryLegendCfg> implements IList {
    private currentPageIndex;
    private totalPagesCnt;
    private pageWidth;
    private pageHeight;
    private startX;
    private startY;
    getDefaultCfg(): {
        name: string;
        type: string;
        itemSpacing: number;
        itemMarginBottom: number;
        maxItemWidth: any;
        itemWidth: any;
        itemHeight: any;
        itemName: {};
        itemValue: any;
        maxWidth: any;
        maxHeight: any;
        marker: {};
        radio: any;
        items: any[];
        itemStates: {};
        itemBackground: {};
        pageNavigator: {};
        defaultCfg: {
            title: {
                spacing: number;
                style: {
                    fill: string;
                    fontSize: number;
                    textAlign: string;
                    textBaseline: string;
                };
            };
            background: {
                padding: number;
                style: {
                    stroke: string;
                };
            };
            itemBackground: {
                style: {
                    opacity: number;
                    fill: string;
                };
            };
            pageNavigator: {
                marker: {
                    style: {
                        inactiveFill: string;
                        inactiveOpacity: number;
                        fill: string;
                        opacity: number;
                        size: number;
                    };
                };
                text: {
                    style: {
                        fill: string;
                        fontSize: number;
                    };
                };
            };
            itemName: {
                spacing: number;
                style: {
                    fill: string;
                    fontSize: number;
                    textAlign: string;
                    textBaseline: string;
                    fontFamily: string;
                    fontWeight: string;
                    lineHeight: number;
                };
            };
            marker: {
                spacing: number;
                style: {
                    r: number;
                    symbol: string;
                };
            };
            itemValue: {
                alignRight: boolean;
                formatter: any;
                style: {
                    fill: string;
                    fontSize: number;
                    textAlign: string;
                    textBaseline: string;
                    fontFamily: string;
                    fontWeight: string;
                    lineHeight: number;
                };
                spacing: number;
            };
            itemStates: {
                active: {
                    nameStyle: {
                        opacity: number;
                    };
                };
                unchecked: {
                    nameStyle: {
                        fill: string;
                    };
                    markerStyle: {
                        fill: string;
                        stroke: string;
                    };
                };
                inactive: {
                    nameStyle: {
                        fill: string;
                    };
                    markerStyle: {
                        opacity: number;
                    };
                };
            };
        };
        layout: string;
        locationType: string;
        x: number;
        y: number;
        offsetX: number;
        offsetY: number;
        title: any;
        background: any;
        container: any;
        shapesMap: {};
        group: any;
        capture: boolean;
        isRegister: boolean;
        isUpdating: boolean;
        isInit: boolean;
        id: string;
        animate: boolean;
        updateAutoRender: boolean;
        animateOption: {
            appear: any;
            update: {
                duration: number;
                easing: string;
            };
            enter: {
                duration: number;
                easing: string;
            };
            leave: {
                duration: number;
                easing: string;
            };
        };
        events: any;
        visible: boolean;
    };
    isList(): boolean;
    /**
     * 获取图例项
     * @return {ListItem[]} 列表项集合
     */
    getItems(): ListItem[];
    /**
     * 设置列表项
     * @param {ListItem[]} items 列表项集合
     */
    setItems(items: ListItem[]): void;
    /**
     * 更新列表项
     * @param {ListItem} item 列表项
     * @param {object}   cfg  列表项
     */
    updateItem(item: ListItem, cfg: object): void;
    /**
     * 清空列表
     */
    clearItems(): void;
    /**
     * 设置列表项的状态
     * @param {ListItem} item  列表项
     * @param {string}   state 状态名
     * @param {boolean}  value 状态值, true, false
     */
    setItemState(item: ListItem, state: string, value: boolean): void;
    /**
     * 是否存在指定的状态
     * @param {ListItem} item  列表项
     * @param {boolean} state 状态名
     */
    hasState(item: ListItem, state: string): boolean;
    getItemStates(item: ListItem): string[];
    /**
     * 清楚所有列表项的状态
     * @param {string} state 状态值
     */
    clearItemsState(state: string): void;
    /**
     * 根据状态获取图例项
     * @param  {string}     state [description]
     * @return {ListItem[]}       [description]
     */
    getItemsByState(state: string): ListItem[];
    protected drawLegendContent(group: any): void;
    private processItems;
    private drawItems;
    private getItemHeight;
    private drawMarker;
    private drawItemText;
    private drawRadio;
    private drawItem;
    private adjustNavigation;
    /**
     * 绘制分页器
     */
    private drawNavigation;
    private updateNavigation;
    private drawArrow;
    /**
     * 更新分页器 arrow 组件
     */
    private updateArrowPath;
    private getCurrentNavigationMatrix;
    private onNavigationBack;
    private onNavigationAfter;
    private applyItemStates;
    private getLimitItemWidth;
}
export default Category;
