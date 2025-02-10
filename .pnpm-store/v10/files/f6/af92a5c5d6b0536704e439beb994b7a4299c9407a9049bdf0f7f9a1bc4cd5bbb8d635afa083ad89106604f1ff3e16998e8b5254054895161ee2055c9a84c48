import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { IList } from '../interfaces';
import { AxisBaseCfg, ListItem, Point } from '../types';
declare abstract class AxisBase<T extends AxisBaseCfg = AxisBaseCfg> extends GroupComponent<T> implements IList {
    getDefaultCfg(): {
        name: string;
        ticks: any[];
        line: {};
        tickLine: {};
        subTickLine: any;
        title: any;
        /**
         * 文本标签的配置项
         */
        label: {};
        /**
         * 垂直于坐标轴方向的因子，决定文本、title、tickLine 在坐标轴的哪一侧
         */
        verticalFactor: number;
        verticalLimitLength: any;
        overlapOrder: string[];
        tickStates: {};
        optimize: {};
        defaultCfg: {
            line: {
                style: {
                    lineWidth: number;
                    stroke: string;
                };
            };
            tickLine: {
                style: {
                    lineWidth: number;
                    stroke: string;
                };
                alignTick: boolean;
                length: number;
                displayWithLabel: boolean;
            };
            subTickLine: {
                style: {
                    lineWidth: number;
                    stroke: string;
                };
                count: number;
                length: number;
            };
            label: {
                autoRotate: boolean;
                autoHide: boolean;
                autoEllipsis: boolean;
                style: {
                    fontSize: number;
                    fill: string;
                    fontFamily: string;
                    fontWeight: string;
                };
                offset: number;
                offsetX: number;
                offsetY: number;
            };
            title: {
                autoRotate: boolean;
                spacing: number;
                position: string;
                style: {
                    fontSize: number;
                    fill: string;
                    textBaseline: string;
                    fontFamily: string;
                    textAlign: string;
                };
                iconStyle: {
                    fill: string;
                    stroke: string;
                };
                description: string;
            };
            tickStates: {
                active: {
                    labelStyle: {
                        fontWeight: number;
                    };
                    tickLineStyle: {
                        lineWidth: number;
                    };
                };
                inactive: {
                    labelStyle: {
                        fill: string;
                    };
                };
            };
            optimize: {
                enable: boolean;
                threshold: number;
            };
        };
        theme: {};
        container: any;
        shapesMap: {};
        group: any;
        capture: boolean;
        isRegister: boolean;
        isUpdating: boolean;
        isInit: boolean;
        id: string;
        type: string;
        locationType: string;
        offsetX: number;
        offsetY: number;
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
    /**
     * 绘制组件
     */
    renderInner(group: IGroup): void;
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
    /**
     * @protected
     * 获取坐标轴线的路径，不同的坐标轴不一样
     */
    protected abstract getLinePath(): any[];
    /**
     * 获取坐标轴垂直方向的向量
     * @param {number} offset 距离点距离
     * @param {Point} point  坐标轴上的一点
     */
    protected abstract getSideVector(offset: number, point: Point): any;
    /**
     * 获取坐标轴的向量
     * @param {Point} point 坐标轴上的点
     */
    protected abstract getAxisVector(point: Point): [number, number];
    protected getSidePoint(point: Point, offset: number): Point;
    /**
     * 根据 tick.value 获取坐标轴上对应的点
     * @param {number} tickValue
     * @returns {Point}
     */
    protected abstract getTickPoint(tickValue: number): Point;
    protected getTextAnchor(vector: number[]): string;
    protected getTextBaseline(vector: number[]): string;
    protected processOverlap(labelGroup: any): void;
    private drawLine;
    private getTickLineItems;
    private getSubTickLineItems;
    private getTickLineAttrs;
    private drawTick;
    private drawTickLines;
    private processTicks;
    private drawTicks;
    /**
     * 根据 optimize 配置对 ticks 进行抽样，对抽样过后的 ticks 才进行真实的渲染
     */
    private optimizeTicks;
    private getLabelAttrs;
    private drawLabels;
    private getTitleAttrs;
    private drawTitle;
    private drawDescriptionIcon;
    private applyTickStates;
    private updateTickStates;
}
export default AxisBase;
