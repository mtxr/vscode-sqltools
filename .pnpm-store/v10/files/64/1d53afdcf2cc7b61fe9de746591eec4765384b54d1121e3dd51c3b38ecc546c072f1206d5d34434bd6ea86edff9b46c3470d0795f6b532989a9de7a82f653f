import { Action } from '@antv/g2';
import { Data } from '../../types';
import { DrillDownCfg } from '../../types/drill-down';
export declare const PADDING_TOP = 5;
/** Group name of breadCrumb: 面包屑 */
export declare const BREAD_CRUMB_NAME = "drilldown-bread-crumb";
export declare const DEFAULT_BREAD_CRUMB_CONFIG: DrillDownCfg['breadCrumb'];
/**
 * hierarchy 数据转换的参数
 */
export declare const HIERARCHY_DATA_TRANSFORM_PARAMS = "hierarchy-data-transform-params";
/**
 * Hierarchy plot 节点的数据
 */
export type HierarchyNode<N = any /** 节点 */> = {
    /** 节点的原始数据，树型结构（todo 是否更正 key 为 origin） */
    data: {
        name: string;
        value?: any;
        children: {
            name: string;
            value?: any;
        }[];
    };
    /** 在构建节点数据时候，增加的扩展配置, 用于存储 transformData 的入参配置 */
    [HIERARCHY_DATA_TRANSFORM_PARAMS]: object;
    /** 当前的层级结构，每一次下钻都会更新. 不是 unique */
    depth: number;
    /** 当前所处高度，depth + height = 总的层级 */
    height: number;
    parent: N;
    children: N[];
};
type HistoryCache = {
    name: string;
    id: string;
    children: Data;
}[];
/**
 * @description 下钻交互的 action
 * @author liuzhenying
 *
 * 适用于：hierarchy plot
 */
export declare class DrillDownAction extends Action {
    /** Action name */
    name: string;
    protected historyCache: HistoryCache;
    private breadCrumbGroup;
    private breadCrumbCfg;
    /**
     * 点击事件, 下钻数据，并绘制面包屑
     */
    click(): boolean;
    /**
     * 重置位置，初始化及触发 chart  afterchangesize 回调时使用
     */
    resetPosition(): void;
    /**
     * 返回上一层
     */
    back(): void;
    /**
     * 重置
     */
    reset(): void;
    /**
     * 下钻数据并更新 view 显示层
     * @param nodeInfo 下钻数据
     */
    protected drill(nodeInfo: HierarchyNode): void;
    /**
     * 回退事件，点击面包屑时触发
     * @param historyCache 当前要回退到的历史
     */
    protected backTo(historyCache: HistoryCache): void;
    /**
     * 获取 mix 默认的配置和用户配置
     */
    private getButtonCfg;
    /**
     * 显示面包屑
     */
    private drawBreadCrumb;
    /**
     * 绘制 Button 和 文本
     */
    private drawBreadCrumbGroup;
    /**
     * 隐藏面包屑
     */
    private hideCrumbGroup;
    /**
     * @override
     * destroy: 销毁资源
     */
    destroy(): void;
}
export {};
