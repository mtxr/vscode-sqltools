import { Attribute, Coordinate, ICanvas, IGroup, Scale } from '../dependents';
import { AxisOption, ComponentOption, CoordinateCfg, CoordinateOption, Data, Datum, FacetCfgMap, FilterCondition, LegendOption, LooseObject, Options, Point, Region, ScaleOption, TooltipOption, ViewCfg, ViewPadding, ViewAppendPadding, EventPayload, Padding } from '../interface';
import { LAYER } from '../constant';
import Base from '../base';
import { Facet } from '../facet';
import Geometry from '../geometry/base';
import Element from '../geometry/element';
import { Interaction } from '../interaction';
import { BBox } from '../util/bbox';
import Annotation from './controller/annotation';
import { Controller } from './controller/base';
import CoordinateController from './controller/coordinate';
import Tooltip from './controller/tooltip';
import Slider from './controller/slider';
import Scrollbar from './controller/scrollbar';
import Axis from './controller/axis';
import Gesture from './controller/gesture';
import Legend from './controller/legend';
import { Layout } from './layout';
import { PaddingCal } from './layout/padding-cal';
/**
 * G2 视图 View 类
 */
export declare class View extends Base {
    /** view id，全局唯一。 */
    id: string;
    /** 父级 view，如果没有父级，则为空。 */
    parent: View;
    /** 所有的子 view。 */
    views: View[];
    /** 所有的 geometry 实例。 */
    geometries: Geometry[];
    /** 所有的组件 controllers。 */
    controllers: Controller[];
    /** 所有的 Interaction 实例。 */
    interactions: Record<string, Interaction>;
    /** view 区域空间。 */
    viewBBox: BBox;
    /** 坐标系的位置大小，ViewBBox - padding = coordinateBBox。 */
    coordinateBBox: BBox;
    /** view 的 padding 大小，传入的配置（不是解析之后的值）。 */
    padding: ViewPadding;
    /** padding的基础上增加的调整值 */
    appendPadding: ViewAppendPadding;
    /** G.Canvas 实例。 */
    canvas: ICanvas;
    /** 存储最终计算的 padding 结果 */
    autoPadding: PaddingCal;
    /** 三层 Group 图形中的背景层。 */
    backgroundGroup: IGroup;
    /** 三层 Group 图形中的中间层。 */
    middleGroup: IGroup;
    /** 三层 Group 图形中的前景层。 */
    foregroundGroup: IGroup;
    /** 是否对超出坐标系范围的 Geometry 进行剪切 */
    limitInPlot: boolean;
    /**
     * 标记 view 的大小位置范围，均是 0 ~ 1 范围，便于开发者使用，起始点为左上角。
     */
    protected region: Region;
    /** 主题配置，存储当前主题配置。 */
    protected themeObject: LooseObject;
    protected options: Options;
    /** 过滤之后的数据 */
    protected filteredData: Data;
    /** 配置开启的组件插件，默认为全局配置的组件。 */
    private usedControllers;
    /** 所有的 scales */
    private scalePool;
    /** 布局函数 */
    protected layoutFunc: Layout;
    /** 生成的坐标系实例，{@link https://github.com/antvis/coord/blob/master/src/coord/base.ts|Coordinate} */
    protected coordinateInstance: Coordinate;
    /** Coordinate 相关的控制器类，负责坐标系实例的创建、更新、变换等 */
    protected coordinateController: CoordinateController;
    /** 分面类实例 */
    protected facetInstance: Facet;
    /** 当前鼠标是否在 plot 内（CoordinateBBox） */
    private isPreMouseInPlot;
    /** 默认标识位，用于判定数据是否更新 */
    private isDataChanged;
    /** 用于判断坐标系范围是否发生变化的标志位 */
    private isCoordinateChanged;
    /** 从当前这个 view 创建的 scale key */
    private createdScaleKeys;
    /** 背景色样式的 shape */
    private backgroundStyleRectShape;
    /** 是否同步子 view 的 padding */
    private syncViewPadding;
    constructor(props: ViewCfg);
    /**
     * 设置 layout 布局函数
     * @param layout 布局函数
     * @returns void
     */
    setLayout(layout: Layout): void;
    /**
     * 生命周期：初始化
     * @returns voids
     */
    init(): void;
    /**
     * 生命周期：渲染流程，渲染过程需要处理数据更新的情况。
     * render 函数仅仅会处理 view 和子 view。
     * @param isUpdate 是否触发更新流程。
     * @param params render 事件参数
     */
    render(isUpdate?: boolean, payload?: EventPayload): void;
    /**
     * 生命周期：清空图表上所有的绘制内容，但是不销毁图表，chart 仍可使用。
     * @returns void
     */
    clear(): void;
    /**
     * 生命周期：销毁，完全无法使用。
     * @returns void
     */
    destroy(): void;
    /**
     * 显示或者隐藏整个 view。
     * @param visible 是否可见
     * @returns View
     */
    changeVisible(visible: boolean): View;
    /**
     * 装载数据源。
     *
     * ```ts
     * view.data([{ city: '杭州', sale: 100 }, { city: '上海', sale: 110 } ]);
     * ```
     *
     * @param data 数据源，json 数组。
     * @returns View
     */
    data(data: Data): View;
    /**
     * @deprecated
     * This method will be removed at G2 V4.1. Replaced by {@link #data(data)}
     */
    source(data: Data): View;
    /**
     * 设置数据筛选规则。
     *
     * ```ts
     * view.filter('city', (value: any, datum: Datum) => value !== '杭州');
     *
     * // 删除 'city' 字段对应的筛选规则。
     * view.filter('city', null);
     * ```
     *
     * @param field 数据字段
     * @param condition 筛选规则
     * @returns View
     */
    filter(field: string, condition: FilterCondition | null): View;
    /**
     * 开启或者关闭坐标轴。
     *
     * ```ts
     *  view.axis(false); // 不展示坐标轴
     * ```
     * @param field 坐标轴开关
     */
    axis(field: boolean): View;
    /**
     * 对特定的某条坐标轴进行配置。
     *
     * @example
     * ```ts
     * view.axis('city', false); // 不展示 'city' 字段对应的坐标轴
     *
     * // 将 'city' 字段对应的坐标轴的标题隐藏
     * view.axis('city', {
     *   title: null,
     * });
     * ```
     *
     * @param field 要配置的坐标轴对应的字段名称
     * @param axisOption 坐标轴具体配置，更详细的配置项可以参考：https://github.com/antvis/component#axis
     */
    axis(field: string, axisOption: AxisOption): View;
    /**
     * 对图例进行整体配置。
     *
     * ```ts
     * view.legend(false); // 关闭图例
     *
     * view.legend({
     *   position: 'right',
     * }); // 图例进行整体配置
     * ```
     * @param field
     * @returns View
     */
    legend(field: LegendOption): View;
    /**
     * 对特定的图例进行配置。
     *
     * @example
     * ```ts
     * view.legend('city', false); // 关闭某个图例，通过数据字段名进行关联
     *
     * // 对特定的图例进行配置
     * view.legend('city', {
     *   position: 'right',
     * });
     * ```
     *
     * @param field 图例对应的数据字段名称
     * @param legendOption 图例配置，更详细的配置项可以参考：https://github.com/antvis/component#axis
     * @returns View
     */
    legend(field: string, legendOption: LegendOption): View;
    /**
     * 批量设置 scale 配置。
     *
     * ```ts
     * view.scale({
     *   sale: {
     *     min: 0,
     *     max: 100,
     *   }
     * });
     * ```
     * Scale 的详细配置项可以参考：https://github.com/antvis/scale#api
     * @returns View
     */
    scale(field: Record<string, ScaleOption>): View;
    /**
     * 为特性的数据字段进行 scale 配置。
     *
     * ```ts
     * view.scale('sale', {
     *   min: 0,
     *   max: 100,
     * });
     * ```
     *
     * @returns View
     */
    scale(field: string, scaleOption: ScaleOption): View;
    /**
     * tooltip 提示信息配置。
     *
     * ```ts
     * view.tooltip(false); // 关闭 tooltip
     *
     * view.tooltip({
     *   shared: true
     * });
     * ```
     *
     * @param cfg Tooltip 配置，更详细的配置项参考：https://github.com/antvis/component#tooltip
     * @returns View
     */
    tooltip(cfg: boolean | TooltipOption): View;
    /**
     * 辅助标记配置。
     *
     * ```ts
     * view.annotation().line({
     *   start: ['min', 85],
     *   end: ['max', 85],
     *   style: {
     *     stroke: '#595959',
     *     lineWidth: 1,
     *     lineDash: [3, 3],
     *   },
     * });
     * ```
     * 更详细的配置项：https://github.com/antvis/component#annotation
     * @returns [[Annotation]]
     */
    annotation(): Annotation;
    /**
     * @deprecated
     * This method will be removed at G2 V4.1. Replaced by {@link #guide()}
     */
    guide(): Annotation;
    /**
     * 坐标系配置。
     *
     * @example
     * ```ts
     * view.coordinate({
     *   type: 'polar',
     *   cfg: {
     *     radius: 0.85,
     *   },
     *   actions: [
     *     [ 'transpose' ],
     *   ],
     * });
     * ```
     *
     * @param option
     * @returns
     */
    coordinate(option?: CoordinateOption): CoordinateController;
    /**
     * 声明坐标系类型，并进行配置。
     *
     * ```ts
     * // 直角坐标系，并进行转置变换
     * view.coordinate('rect').transpose();
     *
     * // 默认创建直角坐标系
     * view.coordinate();
     * ```
     *
     * @param type 坐标系类型
     * @param [coordinateCfg] 坐标系配置
     * @returns
     */
    coordinate(type: string, coordinateCfg?: CoordinateCfg): CoordinateController;
    /**
     * @deprecated
     * This method will be removed at G2 V4.1. Replaced by {@link #coordinate()}
     */
    coord(type: string | CoordinateOption, coordinateCfg?: CoordinateCfg): CoordinateController;
    /**
     * view 分面绘制。
     *
     * ```ts
     * view.facet('rect', {
     *   rowField: 'province',
     *   columnField: 'category',
     *   eachView: (innerView: View, facet?: FacetData) => {
     *     innerView.line().position('city*sale');
     *   },
     * });
     * ```
     *
     * @param type 分面类型
     * @param cfg 分面配置， [[FacetCfgMap]]
     * @returns View
     */
    facet<T extends keyof FacetCfgMap>(type: T, cfg: FacetCfgMap[T]): View;
    animate(status: boolean): View;
    /**
     * 更新配置项，用于配置项式声明。
     * @param options 配置项
     */
    updateOptions(options: Options): this;
    /**
     * 往 `view.options` 属性中存储配置项。
     * @param name 属性名称
     * @param opt 属性值
     * @returns view
     */
    option(name: string, opt: any): View;
    /**
     * 设置主题。
     *
     * ```ts
     * view.theme('dark'); // 'dark' 需要事先通过 `registerTheme()` 接口注册完成
     *
     * view.theme({ defaultColor: 'red' });
     * ```
     *
     * @param theme 主题名或者主题配置
     * @returns View
     */
    theme(theme: string | LooseObject): View;
    /**
     * Call the interaction based on the interaction name
     *
     * ```ts
     * view.interaction('my-interaction', { extra: 'hello world' });
     * ```
     * 详细文档可以参考：https://g2.antv.vision/zh/docs/api/general/interaction
     * @param name interaction name
     * @param cfg interaction config
     * @returns
     */
    interaction(name: string, cfg?: LooseObject): View;
    /**
     * 移除当前 View 的 interaction
     * ```ts
     * view.removeInteraction('my-interaction');
     * ```
     * @param name interaction name
     */
    removeInteraction(name: string): void;
    /**
     * 修改数据，数据更新逻辑，数据更新仅仅影响当前这一层的 view
     *
     * ```ts
     * view.changeData([{ city: '北京', sale: '200' }]);
     * ```
     *
     * @param data
     * @returns void
     */
    changeData(data: Data): void;
    /**
     * 创建子 view
     *
     * ```ts
     * const innerView = view.createView({
     *   start: { x: 0, y: 0 },
     *   end: { x: 0.5, y: 0.5 },
     *   padding: 8,
     * });
     * ```
     *
     * @param cfg
     * @returns View
     */
    createView(cfg?: Partial<ViewCfg>): View;
    /**
     * @deprecated
     * This method will be removed at G2 V4.1. Replaced by {@link #createView()}
     */
    view(cfg?: Partial<ViewCfg>): View;
    /**
     * 删除一个子 view
     * @param view
     * @return removedView
     */
    removeView(view: View): View;
    /**
     * 获取当前坐标系实例。
     * @returns [[Coordinate]]
     */
    getCoordinate(): Coordinate;
    /**
     * 获取当前 view 的主题配置。
     * @returns themeObject
     */
    getTheme(): LooseObject;
    /**
     * 获得 x 轴字段的 scale 实例。
     * @returns view 中 Geometry 对于的 x scale
     */
    getXScale(): Scale;
    /**
     * 获取 y 轴字段的 scales 实例。
     * @returns view 中 Geometry 对于的 y scale 数组
     */
    getYScales(): Scale[];
    /**
     * 获取 x 轴或者 y 轴对应的所有 scale 实例。
     * @param dimType x | y
     * @returns x 轴或者 y 轴对应的所有 scale 实例。
     */
    getScalesByDim(dimType: 'x' | 'y'): Record<string, Scale>;
    /**
     * 根据字段名去获取 scale 实例。
     * @param field 数据字段名称
     * @param key id
     */
    getScale(field: string, key?: string): Scale;
    /**
     * @deprecated
     * This method will be removed at G2 V4.1. Please use `getScale`.
     */
    getScaleByField(field: string, key?: string): Scale;
    /**
     * 返回所有配置信息。
     * @returns 所有的 view API 配置。
     */
    getOptions(): Options;
    /**
     * 获取 view 的数据（过滤后的数据）。
     * @returns 处理过滤器之后的数据。
     */
    getData(): Data;
    /**
     * 获取原始数据
     * @returns 传入 G2 的原始数据
     */
    getOriginalData(): Data;
    /**
     * 获取布局后的边距 padding
     * @returns
     */
    getPadding(): Padding;
    /**
     * 获取当前 view 有的 geometries
     * @returns
     */
    getGeometries(): Geometry<import("../interface").ShapePoint>[];
    /**
     * 获取 view 中的所有 geome
     */
    getElements(): Element[];
    /**
     * 根据一定的规则查找 Geometry 的 Elements。
     *
     * ```typescript
     * getElementsBy((element) => {
     *   const data = element.getData();
     *
     *   return data.a === 'a';
     * });
     * ```
     *
     * @param condition 定义查找规则的回调函数。
     * @returns
     */
    getElementsBy(condition: (element: Element) => boolean): Element[];
    /**
     * 获得绘制的层级 group。
     * @param layer 层级名称。
     * @returns 对应层级的 Group。
     */
    getLayer(layer: LAYER): IGroup;
    /**
     * 对外暴露方法，判断一个点是否在绘图区域（即坐标系范围）内部。
     * @param point 坐标点
     */
    isPointInPlot(point: Point): boolean;
    /**
     * 获得所有的 legend 对应的 attribute 实例。
     * @returns 维度字段的 Attribute 数组
     */
    getLegendAttributes(): Attribute[];
    /**
     * 获取所有的分组字段的 scale 实例。
     * @returns 获得分组字段的 scale 实例数组。
     */
    getGroupScales(): Scale[];
    /**
     * 获取 G.Canvas 实例。
     * @returns G.Canvas 画布实例。
     */
    getCanvas(): ICanvas;
    /**
     * 获得根节点 view。
     */
    getRootView(): View;
    /**
     * 获取该数据在可视化后，对应的画布坐标点。
     * @param data 原始数据记录
     * @returns 对应的画布坐标点
     */
    getXY(data: Datum): Point;
    getController(name: 'tooltip'): Tooltip;
    getController(name: 'axis'): Axis;
    getController(name: 'legend'): Legend;
    getController(name: 'scrollbar'): Scrollbar;
    getController(name: 'slider'): Slider;
    getController(name: 'annotation'): Annotation;
    getController(name: 'gestucre'): Gesture;
    getController(name: string): Controller;
    /**
     * 显示 point 坐标点对应的 tooltip。
     * @param point 画布坐标点
     * @returns View
     */
    showTooltip(point: Point): View;
    /**
     * 隐藏 tooltip。
     * @returns View
     */
    hideTooltip(): View;
    /**
     * 将 tooltip 锁定到当前位置不能移动。
     * @returns View
     */
    lockTooltip(): View;
    /**
     * 将 tooltip 锁定解除。
     * @returns View
     */
    unlockTooltip(): View;
    /**
     * 是否锁定 tooltip。
     * @returns 是否锁定
     */
    isTooltipLocked(): boolean;
    /**
     * 获取当前 point 对应的 tooltip 数据项。
     * @param point 坐标点
     * @returns tooltip 数据项
     */
    getTooltipItems(point: Point): any[];
    /**
     * 获取逼近的点的数据集合
     * @param point 当前坐标点
     * @returns  数据
     */
    getSnapRecords(point: Point): any[];
    /**
     * 获取所有的 pure component 组件，用于布局。
     */
    getComponents(): ComponentOption[];
    /**
     * 将 data 数据进行过滤。
     * @param data
     * @returns 过滤之后的数据
     */
    filterData(data: Data): Data;
    /**
     * 对某一个字段进行过滤
     * @param field
     * @param data
     */
    filterFieldData(field: string, data: Data): Data;
    /**
     * 调整 coordinate 的坐标范围。
     */
    adjustCoordinate(): void;
    protected paint(isUpdate: boolean): void;
    /**
     * 渲染背景样式的 shape。
     * 放到 view 中创建的原因是让使用 view 绘制图形的时候，也能够处理背景色
     */
    private renderBackgroundStyleShape;
    /**
     * 递归计算每个 view 的 padding 值，coordinateBBox 和 coordinateInstance
     * @param isUpdate
     */
    protected renderPaddingRecursive(isUpdate: boolean): void;
    /**
     * 递归处理 view 的布局，最终是计算各个 view 的 coordinateBBox 和 coordinateInstance
     * @param isUpdate
     */
    protected renderLayoutRecursive(isUpdate: boolean): void;
    /**
     * 最终递归绘制组件和图形
     * @param isUpdate
     */
    protected renderPaintRecursive(isUpdate: boolean): void;
    /**
     * 创建 scale，递归到顶层 view 去创建和缓存 scale
     * @param field
     * @param data
     * @param scaleDef
     * @param key
     */
    protected createScale(field: string, data: Data, scaleDef: ScaleOption, key: string): Scale;
    /**
     * 递归渲染中的数据处理
     * @param isUpdate
     */
    private renderDataRecursive;
    /**
     * 计算 region，计算实际的像素范围坐标
     * @private
     */
    private calculateViewBBox;
    /**
     * 初始化事件机制：G 4.0 底层内置支持 name:event 的机制，那么只要所有组件都有自己的 name 即可。
     *
     * G2 的事件只是获取事件委托，然后在 view 嵌套结构中，形成事件冒泡机制。
     * 当前 view 只委托自己 view 中的 Component 和 Geometry 事件，并向上冒泡
     * @private
     */
    private initEvents;
    private onCanvasEvent;
    /**
     * 初始化插件
     */
    private initComponentController;
    private createViewEvent;
    /**
     * 触发事件之后
     * @param evt
     */
    private onDelegateEvents;
    /**
     * 处理 PLOT_EVENTS
     * plot event 需要处理所有的基础事件，并判断是否在画布中，然后再决定是否要 emit。
     * 对于 mouseenter、mouseleave 比较特殊，需要做一下数学比较。
     * @param e
     */
    private doPlotEvent;
    /**
     * 处理筛选器，筛选数据
     * @private
     */
    private doFilterData;
    /**
     * 初始化 Geometries
     * @private
     */
    private initGeometries;
    /**
     * 根据 Geometry 的所有字段创建 scales
     * 如果存在，则更新，不存在则创建
     */
    private createOrUpdateScales;
    /**
     * 处理 scale 同步逻辑
     */
    private syncScale;
    /**
     * 获得 Geometry 中的 scale 对象
     */
    private getGeometryScales;
    private getScaleFields;
    private getGroupedFields;
    /**
     * 调整 scale 配置
     * @private
     */
    private adjustScales;
    /**
     * 调整分类 scale 的 range，防止超出坐标系外面
     * @private
     */
    private adjustCategoryScaleRange;
    /**
     * 根据 options 配置、Geometry 字段配置，自动生成 components
     * @param isUpdate 是否是更新
     * @private
     */
    private initComponents;
    private doLayout;
    /**
     * 创建坐标系
     * @private
     */
    private createCoordinate;
    /**
     * 根据 options 配置自动渲染 geometry
     * @private
     */
    private paintGeometries;
    /**
     * 最后的绘制组件
     * @param isUpdate
     */
    private renderComponents;
    /**
     * 渲染分面，会在其中进行数据分面，然后进行子 view 创建
     * @param isUpdate
     */
    private renderFacet;
    private initOptions;
    private createGeometry;
    /**
     * scale key 的创建方式
     * @param field
     */
    private getScaleKey;
}
/**
 * 注册 geometry 组件
 * @param name
 * @param Ctor
 * @returns Geometry
 */
export declare function registerGeometry(name: string, Ctor: any): void;
export default View;
