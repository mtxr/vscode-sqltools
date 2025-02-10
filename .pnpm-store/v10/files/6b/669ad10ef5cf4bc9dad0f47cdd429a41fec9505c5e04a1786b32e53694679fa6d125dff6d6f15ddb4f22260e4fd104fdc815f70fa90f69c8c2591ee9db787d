import { AllLegendsOptions } from '../../interface';
import View from '../view';
import { Controller } from './base';
/**
 * @ignore
 * legend Controller
 */
export default class Legend extends Controller<AllLegendsOptions> {
    /** the draw group of axis */
    private container;
    /** 用于多个 legend 布局的 bbox */
    private layoutBBox;
    constructor(view: View);
    get name(): string;
    init(): void;
    /**
     * render the legend component by legend options
     */
    render(): void;
    /**
     * layout legend
     * 计算出 legend 的 direction 位置 x, y
     */
    layout(): void;
    /**
     * legend 的更新逻辑
     */
    update(): void;
    clear(): void;
    destroy(): void;
    /**
     * 递归获取所有的 Geometry
     */
    private getGeometries;
    /**
     * 遍历 Geometry，处理 legend 逻辑
     * @param doEach 每个 loop 中的处理方法
     */
    private loopLegends;
    /**
     * 创建一个 legend
     * @param geometry
     * @param attr
     * @param scale
     */
    private createFieldLegend;
    /**
     * 自定义图例使用 category 图例去渲染
     * @param geometry
     * @param attr
     * @param scale
     * @param legendOption
     */
    private createCustomLegend;
    /**
     * 创建连续图例
     * @param geometry
     * @param attr
     * @param scale
     * @param legendOption
     */
    private createContinuousLegend;
    /**
     * 创建分类图例
     * @param geometry
     * @param attr
     * @param scale
     * @param legendOption
     */
    private createCategoryLegend;
    /**
     * 获得连续图例的配置
     * @param geometry
     * @param attr
     * @param scale
     * @param legendOption
     */
    private getContinuousCfg;
    /**
     * 获取分类图例的配置项
     * @param geometry
     * @param attr
     * @param scale
     * @param custom
     * @param legendOption
     */
    private getCategoryCfg;
    /**
     * get legend config, use option > suggestion > theme
     * @param baseCfg
     * @param legendOption
     * @param direction
     */
    private mergeLegendCfg;
    /**
     * 生成 id
     * @param key
     */
    private getId;
    /**
     * 根据 id 来获取组件
     * @param id
     */
    private getComponentById;
    private getCategoryLegendSizeCfg;
}
