import { IGroup } from '../dependents';
import { AxisCfg, Condition, Datum, FacetCfg, FacetData, FacetDataFilter, Region } from '../interface';
import View from '../chart/view';
/**
 * facet 基类
 *  - 定义生命周期，方便自定义 facet
 *  - 提供基础的生命流程方法
 *
 * 生命周期：
 *
 * 初始化 init
 * 1. 初始化容器
 * 2. 数据分面，生成分面布局信息
 *
 * 渲染阶段 render
 * 1. view 创建
 * 2. title
 * 3. axis
 *
 * 清除阶段 clear
 * 1. 清除 view
 *
 * 销毁阶段 destroy
 * 1. clear
 * 2. 清除事件
 * 3. 清除 group
 */
export declare abstract class Facet<C extends FacetCfg<FacetData> = FacetCfg<FacetData>, F extends FacetData = FacetData> {
    /** 分面所在的 view */
    view: View;
    /** 分面容器 */
    container: IGroup;
    /** 是否销毁 */
    destroyed: boolean;
    /** 分面的配置项 */
    protected cfg: C;
    /** 分面之后的所有分面数据结构 */
    protected facets: F[];
    constructor(view: View, cfg: C);
    /**
     * 初始化过程
     */
    init(): void;
    /**
     * 渲染分面，由上层 view 调用。包括：
     *  - 分面 view
     *  - 轴
     *  - title
     *
     *  子类可以复写，添加一些其他组件，比如滚动条等
     */
    render(): void;
    /**
     * 更新 facet
     */
    update(): void;
    /**
     * 清空，clear 之后如果还需要使用，需要重新调用 init 初始化过程
     * 一般在数据有变更的时候调用，重新进行数据的分面逻辑
     */
    clear(): void;
    /**
     * 销毁
     */
    destroy(): void;
    /**
     * 根据 facet 生成 view，可以给上层自定义使用
     * @param facet
     */
    protected facetToView(facet: F): View;
    private createContainer;
    /**
     * 初始化 view
     */
    private renderViews;
    /**
     * 创建 分面 view
     */
    private createFacetViews;
    /**
     * 从 view 中清除 facetView
     */
    private clearFacetViews;
    /**
     * 解析 spacing
     */
    private parseSpacing;
    /**
     * 获取这个字段对应的所有值，数组
     * @protected
     * @param data 数据
     * @param field 字段名
     * @return 字段对应的值
     */
    protected getFieldValues(data: Datum[], field: string): string[];
    /**
     * 获得每个分面的 region，平分区域
     * @param rows row 总数
     * @param cols col 总数
     * @param xIndex x 方向 index
     * @param yIndex y 方向 index
     */
    protected getRegion(rows: number, cols: number, xIndex: number, yIndex: number): Region;
    protected getDefaultCfg(): {
        eachView: any;
        showTitle: boolean;
        spacing: number[];
        padding: number;
        fields: any[];
    };
    /**
     * 默认的 title 样式，因为有的分面是 title，有的分面配置是 columnTitle、rowTitle
     */
    protected getDefaultTitleCfg(): {
        style: {
            fontSize: number;
            fill: string;
            fontFamily: any;
        };
    };
    /**
     * 处理 axis 的默认配置
     * @param view
     * @param facet
     */
    protected processAxis(view: View, facet: F): void;
    /**
     * 获取分面数据
     * @param conditions
     */
    protected getFacetDataFilter(conditions: Condition[]): FacetDataFilter;
    /**
     * @override 开始处理 eachView
     * @param view
     * @param facet
     */
    protected abstract beforeEachView(view: View, facet: F): any;
    /**
     * @override 处理 eachView 之后
     * @param view
     * @param facet
     */
    protected abstract afterEachView(view: View, facet: F): any;
    /**
     * @override 生成分面数据，包含布局
     * @param data
     */
    protected abstract generateFacets(data: Datum[]): F[];
    /**
     * 获取 x 轴的配置
     * @param x
     * @param axes
     * @param option
     * @param facet
     */
    protected abstract getXAxisOption(x: string, axes: any, option: AxisCfg, facet: F): object;
    /**
     * 获取 y 轴的配置
     * @param y
     * @param axes
     * @param option
     * @param facet
     */
    protected abstract getYAxisOption(y: string, axes: any, option: AxisCfg, facet: F): object;
}
