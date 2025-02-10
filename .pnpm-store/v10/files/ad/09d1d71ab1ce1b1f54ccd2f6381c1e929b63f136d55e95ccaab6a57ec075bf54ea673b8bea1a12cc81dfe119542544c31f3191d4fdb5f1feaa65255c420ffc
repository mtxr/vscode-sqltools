import { Adjust } from '@antv/adjust';
import { Attribute } from '@antv/attr';
import Base from '../base';
import { BBox, Coordinate, IGroup, IShape, Scale } from '../dependents';
import { AdjustOption, AnimateOption, AttributeOption, ColorAttrCallback, Data, Datum, GeometryLabelCfg, GeometryTooltipOption, LabelCallback, LabelOption, LooseObject, MappingDatum, ScaleOption, ShapeAttrCallback, ShapeFactory, ShapeInfo, ShapeMarkerCfg, ShapeMarkerAttrs, ShapePoint, SizeAttrCallback, StateOption, StyleCallback, StyleOption, TooltipCallback, CustomOption } from '../interface';
import Element from './element';
/** geometry.init() 传入参数 */
export interface InitCfg {
    /** 坐标系 */
    coordinate?: Coordinate;
    /** 数据 */
    data?: Data;
    /** 主题对象 */
    theme?: LooseObject;
    /** 列定义 */
    scaleDefs?: Record<string, ScaleOption>;
    /** 因为数据使用的引用，所以需要有一个标识位标识数据是否发生了更新 */
    isDataChanged?: boolean;
    isCoordinateChanged?: boolean;
}
/** Geometry 构造函数参数 */
export interface GeometryCfg {
    /** Geometry shape 的容器。 */
    container: IGroup;
    /** 绘制的坐标系对象。 */
    coordinate?: Coordinate;
    /** 绘制数据。 */
    data?: Data;
    /** 需要的 scales。 */
    scales?: Record<string, Scale>;
    /** 列定义 */
    scaleDefs?: Record<string, ScaleOption>;
    /** Geometry labels 的容器 */
    labelsContainer?: IGroup;
    /** 是否对数据进行排序 */
    sortable?: boolean;
    /** elements 的 zIndex 默认按顺序提升，通过 zIndexReversed 可以反序，从而数据越前，层级越高 */
    zIndexReversed?: boolean;
    /** 是否需要对 zIndex 进行 sort。因为耗时长，由具体场景自行决定 */
    sortZIndex?: boolean;
    /** 延迟渲染 Geometry 数据标签. 设置为 true 时，会在浏览器空闲时期被调用, 也可以指定具体 timeout 时间 */
    useDeferredLabel?: boolean | number;
    /** 是否可见 */
    visible?: boolean;
    /** 主题配置 */
    theme?: LooseObject;
    /** 组间距 */
    intervalPadding?: number;
    /** 组内间距 */
    dodgePadding?: number;
    /** 柱状图最大宽度 */
    maxColumnWidth?: number;
    /** 柱状图最小宽度 */
    minColumnWidth?: number;
    /** 默认宽度占比，interval类型和schema类型通用 */
    columnWidthRatio?: number;
    /** 玫瑰图占比 */
    roseWidthRatio?: number;
    /** 多层饼图/环图占比 */
    multiplePieWidthRatio?: number;
}
/**
 * Geometry 几何标记基类，主要负责数据到图形属性的映射以及绘制逻辑。
 */
export default class Geometry<S extends ShapePoint = ShapePoint> extends Base {
    /** Geometry 几何标记类型。 */
    readonly type: string;
    /** ShapeFactory 对应的类型。 */
    readonly shapeType: string;
    /** Coordinate 坐标系实例。 */
    coordinate: Coordinate;
    /** 用户绘制数据。 */
    data: Data;
    /** 图形绘制容器。 */
    readonly container: IGroup;
    /** label 绘制容器。 */
    readonly labelsContainer: IGroup;
    /** 是否对数据进行排序，默认为 false。  */
    sortable: boolean;
    /** 当前 Geometry 实例主题。  */
    theme: LooseObject;
    /** 存储 geometry 需要的 scales，需要外部传入。 */
    scales: Record<string, Scale>;
    /** scale 定义，需要外部传入。 */
    scaleDefs: Record<string, ScaleOption>;
    /** 画布区域，用于 label 布局。 */
    canvasRegion: BBox;
    /** Attribute map  */
    attributes: Record<string, Attribute>;
    /** Element map */
    elements: Element[];
    /**
     * 存储处理后的数据，
     * + init() 及 updateData() 逻辑后, 结构为 Data[]；
     * + paint() 逻辑后，结构为 MappingDatum[][]。
     */
    dataArray: MappingDatum[][];
    /** 存储 tooltip 配置信息。 */
    tooltipOption: GeometryTooltipOption | boolean;
    /** 存储 label 配置信息。 */
    labelOption: LabelOption | false;
    /** 状态量相关的配置项 */
    stateOption: StateOption;
    /** 使用 key-value 结构存储 Element，key 为每个 Element 实例对应的唯一 ID */
    elementsMap: Record<string, Element>;
    /** animate 配置项 */
    animateOption: AnimateOption | boolean;
    /** 图形属性映射配置 */
    protected attributeOption: Record<string, AttributeOption>;
    /** adjust 配置项 */
    protected adjustOption: AdjustOption[];
    /** style 配置项 */
    protected styleOption: StyleOption;
    /** custom 自定义的配置项 */
    protected customOption: CustomOption;
    /** 每个 Geometry 对应的 Shape 工厂实例，用于创建各个 Shape */
    protected shapeFactory: ShapeFactory;
    /** 存储上一次渲染时的 element 映射表，用于更新逻辑 */
    protected lastElementsMap: Record<string, Element>;
    /** 是否生成多个点来绘制图形。 */
    protected generatePoints: boolean;
    /** 存储发生图形属性映射前的数据 */
    protected beforeMappingData: Data[];
    /** 存储每个 shape 的默认 size，用于 Interval、Schema 几何标记 */
    protected defaultSize: number;
    private userTheme;
    private adjusts;
    private lastAttributeOption;
    private idFields;
    private geometryLabel;
    /** 组间距 */
    protected intervalPadding: number;
    /** 组内间距 */
    protected dodgePadding: number;
    /** 柱状图最大宽度 */
    protected maxColumnWidth: number;
    /** 柱状图最小宽度 */
    protected minColumnWidth: number;
    /** 一般柱状图宽度占比 */
    protected columnWidthRatio: number;
    /** 玫瑰图占比 */
    protected roseWidthRatio: number;
    /** 多层饼图/环图占比 */
    protected multiplePieWidthRatio: number;
    /** elements 的 zIndex 默认按顺序提升，通过 zIndexReversed 可以反序，从而数据越前，层级越高 */
    zIndexReversed?: boolean;
    /** 是否需要对 zIndex 进行 sort。因为耗时长，由具体场景自行决定 */
    sortZIndex?: boolean;
    protected useDeferredLabel?: null | number;
    /** 虚拟 Group，用于图形更新 */
    private offscreenGroup;
    private groupScales;
    private hasSorted;
    protected isCoordinateChanged: boolean;
    /**
     * 创建 Geometry 实例。
     * @param cfg
     */
    constructor(cfg: GeometryCfg);
    /**
     * 配置 position 通道映射规则。
     *
     * @example
     * ```typescript
     * // 数据结构: [{ x: 'A', y: 10, color: 'red' }]
     * geometry.position('x*y');
     * geometry.position([ 'x', 'y' ]);
     * geometry.position({
     *   fields: [ 'x', 'y' ],
     * });
     * ```
     *
     * @param cfg 映射规则
     * @returns
     */
    position(cfg: string | string[] | AttributeOption): Geometry;
    /**
     * 配置 color 通道映射规则。
     *
     * @example
     * ```typescript
     * // data: [{ x: 'A', y: 10, color: 'red' }, { x: 'B', y: 30, color: 'yellow' }]
     * geometry.color({
     *   fields: [ 'x' ],
     *   values: [ '#1890ff', '#5AD8A6' ],
     * });
     * ```
     *
     * @param field 映射规则
     * @returns
     */
    color(field: AttributeOption): Geometry;
    /**
     * @example
     * ```typescript
     * // data: [{ x: 'A', y: 10, color: 'red' }, { x: 'B', y: 30, color: 'yellow' }]
     *
     * // 使用 '#1890ff' 颜色渲染图形
     * geometry.color('#1890ff');
     *
     * // 根据 x 字段的数据值进行颜色的映射，这时候 G2 会在内部调用默认的回调函数，读取默认提供的颜色进行数据值到颜色值的映射。
     * geometry.color('x');
     *
     * // 将 'x' 字段的数据值映射至指定的颜色值 colors（可以是字符串也可以是数组），此时用于通常映射分类数据
     * geometry.color('x', [ '#1890ff', '#5AD8A6' ]);
     *
     * // 使用回调函数进行颜色值的自定义；可以使用多个字段使用、*号连接
     * geometry.color('x', (xVal) => {
     *   if (xVal === 'a') {
     *     return 'red';
     *   }
     *   return 'blue';
     * });
     *
     * // 指定颜色的渐变路径，用于映射连续的数据
     * geometry.color('x', '#BAE7FF-#1890FF-#0050B3');
     * ```
     *
     * @param field 参与颜色映射的数据字段，多个字段使用 '*' 连接符进行连接。
     * @param cfg Optional, color 映射规则。
     * @returns
     */
    color(field: string, cfg?: string | string[] | ColorAttrCallback): Geometry;
    /**
     * 配置 shape 通道映射规则。
     *
     * @example
     *
     * ```typescript
     * // data: [{ x: 'A', y: 10, color: 'red' }, { x: 'B', y: 30, color: 'yellow' }]
     * geometry.shape({
     *   fields: [ 'x' ],
     * });
     * ```
     *
     * @param field 映射规则配置。
     * @returns
     */
    shape(field: AttributeOption): Geometry;
    /**
     *
     * @example
     * ```typescript
     * // data: [{ x: 'A', y: 10, color: 'red' }, { x: 'B', y: 30, color: 'yellow' }]
     *
     * // 指定常量，将所有数据值映射到固定的 shape
     * geometry.shape('circle');
     *
     * // 将指定的字段映射到内置的 shapes 数组中
     * geometry.shape('x');
     *
     * // 将指定的字段映射到指定的 shapes 数组中
     * geometry.shape('x', [ 'circle', 'diamond', 'square' ]);
     *
     * // 使用回调函数获取 shape，用于个性化的 shape 定制，可以根据单个或者多个字段确定
     * geometry.shape('x', (xVal) => {
     *   if (xVal === 'a') {
     *     return 'circle';
     *   }
     *   return 'diamond';
     * });
     * ```
     *
     * @param field 参与 shape 映射的数据字段，多个字段使用 '*' 连接符进行连接。
     * @param cfg Optional, shape 映射规则。
     * @returns
     */
    shape(field: string, cfg?: string[] | ShapeAttrCallback): Geometry;
    /**
     * 配置 size 通道映射规则。
     *
     * @example
     * ```typescript
     * // data: [{ x: 'A', y: 10, color: 'red' }, { x: 'B', y: 30, color: 'yellow' }]
     * geometry.size({
     *   values: [ 10 ],
     * })
     * ```
     *
     * @param field 映射规则。
     * @returns
     */
    size(field: AttributeOption): Geometry;
    /**
     *
     * @example
     * ```typescript
     * // data: [{ x: 'A', y: 10, color: 'red' }, { x: 'B', y: 30, color: 'yellow' }]
     *
     * // 直接指定像素大小
     * geometry.size(10);
     *
     * // 指定映射到 size 的字段，使用内置的默认大小范围为 [1, 10]
     * geometry.size('x');
     *
     * // 指定映射到 size 字段外，还提供了 size 的最大值和最小值范围
     * geometry.size('x', [ 5, 30 ]);
     *
     * // 使用回调函数映射 size，用于个性化的 size 定制，可以使用多个字段进行映射
     * geometry.size('x', (xVal) => {
     *   if (xVal === 'a') {
     *     return 10;
     *   }
     *   return 5;
     * });
     * ```
     *
     * @param field 参与 size 映射的数据字段，多个字段使用 '*' 连接符进行连接。
     * @param cfg Optional, size 映射规则
     * @returns
     */
    size(field: number | string, cfg?: [number, number] | SizeAttrCallback): Geometry;
    /**
     * 设置数据调整方式。G2 目前内置了四种类型：
     * 1. dodge
     * 2. stack
     * 3. symmetric
     * 4. jitter
     *
     *
     * **Tip**
     * + 对于 'dodge' 类型，可以额外进行如下属性的配置:
     * ```typescript
     * geometry.adjust('dodge', {
     *   marginRatio: 0, // 取 0 到 1 范围的值（相对于每个柱子宽度），用于控制一个分组中柱子之间的间距
     *   dodgeBy: 'x', // 该属性只对 'dodge' 类型生效，声明以哪个数据字段为分组依据
     * });
     * ```
     *
     * + 对于 'stack' 类型，可以额外进行如下属性的配置:
     * ```typescript
     * geometry.adjust('stack', {
     *   reverseOrder: false, // 用于控制是否对数据进行反序操作
     * });
     * ```
     *
     * @example
     * ```typescript
     * geometry.adjust('stack');
     *
     * geometry.adjust({
     *   type: 'stack',
     *   reverseOrder: false,
     * });
     *
     * // 组合使用 adjust
     * geometry.adjust([ 'stack', 'dodge' ]);
     *
     * geometry.adjust([
     *   { type: 'stack' },
     *   { type: 'dodge', dodgeBy: 'x' },
     * ]);
     * ```
     *
     * @param adjustCfg 数据调整配置
     * @returns
     */
    adjust(adjustCfg: string | string[] | AdjustOption | AdjustOption[]): Geometry;
    /**
     * 图形样式配置。
     *
     * @example
     * ```typescript
     * // 配置图形样式
     * style({
     *   lineWidth: 2,
     *   stroke: '#1890ff',
     * });
     *
     * // 根据具体的数据进行详细配置
     * style({
     *   fields: [ 'x', 'y' ], // 数据字段
     *   callback: (xVal, yVal) => {
     *     const style = { lineWidth: 2, stroke: '#1890ff' };
     *     if (xVal === 'a') {
     *       style.lineDash = [ 2, 2 ];
     *     }
     *     return style;
     *   },
     * });
     * ```
     *
     * @param field 配置样式属性或者样式规则。
     * @returns
     */
    style(field: StyleOption | LooseObject): Geometry;
    /**
     * @example
     * ```typescript
     * style('x*y', (xVal, yVal) => {
     *   const style = { lineWidth: 2, stroke: '#1890ff' };
     *   if (xVal === 'a') {
     *     style.lineDash = [ 2, 2 ];
     *   }
     *   return style;
     * });
     * ```
     *
     * @param field 数据字段或者样式配置规则。
     * @param styleFunc Optional, 样式配置回调函数。
     * @returns
     */
    style(field: string, styleFunc: StyleCallback): Geometry;
    /**
     * 配置 Geometry 显示的 tooltip 内容。
     *
     * `tooltip(false)` 代表关闭 tooltip。
     * `tooltip(true)` 代表开启 tooltip。
     *
     * Geometry 默认允许 tooltip 展示，我们可以使用以下方法对 tooltip 的展示内容进行配置：
     *
     * @example
     * ```typescript
     * // data: [{x: 'a', y: 10}]
     * tooltip({
     *   fields: [ 'x' ],
     * });
     * ```
     * ![](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*268uQ50if60AAAAAAAAAAABkARQnAQ)
     *
     * ```typescript
     * tooltip({
     *   fields: [ 'x', 'y' ],
     * });
     * ```
     * ![](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*A_ujSa8QhtcAAAAAAAAAAABkARQnAQ)
     *
     * tooltip() 方法同样支持数据映射及回调用法：
     *
     * @example
     * ```typescript
     * chart.tooltip({
     *   itemTpl: '<li>{x}: {y}</li>',
     * });
     *
     * chart.line()
     *   .position('x*y')
     *   .tooltip({
     *     fields: [ 'x', 'y' ],
     *     callback: (x, y) => {
     *       return {
     *         x,
     *         y,
     *       };
     *     },
     *   });
     * ```
     *
     * 其返回的值必须为对象，该值中的属性同 chart.tooltip() 的 itemTpl 模板相对应，返回的变量可用于 itemTpl 的字符串模板。
     *
     * @param field tooltip 配置信息。
     * @returns
     */
    tooltip(field: GeometryTooltipOption | boolean): Geometry;
    /**
     * @example
     * ```typescript
     * // data: [{x: 'a', y: 10}]
     *
     * // 等同于 tooltip({ fields: [ 'x' ] })
     * tooltip('x');
     *
     * // 等同于 tooltip({ fields: [ 'x', 'y' ] })
     * tooltip('x*y');
     *
     * // 等同于 tooltip({ fields: [ 'x', 'y' ], callback: (x, y) => { x, y } })
     * tooltip('x*y', (x, y) => {
     *   return {
     *     x,
     *     y,
     *   };
     * });
     * ```
     *
     * @param field 参与映射的字段。
     * @param cfg Optional, 回调函数
     * @returns
     */
    tooltip(field: string, cfg?: TooltipCallback): Geometry;
    /**
     * Geometry 动画配置。
     *
     * + `animate(false)` 关闭动画
     * + `animate(true)` 开启动画，默认开启。
     *
     * 我们将动画分为四个场景：
     * 1. appear: 图表第一次加载时的入场动画；
     * 2. enter: 图表绘制完成，发生更新后，产生的新图形的进场动画；
     * 3. update: 图表绘制完成，数据发生变更后，有状态变更的图形的更新动画；
     * 4. leave: 图表绘制完成，数据发生变更后，被销毁图形的销毁动画。
     *
     * @example
     * ```typescript
     * animate({
     *   enter: {
     *     duration: 1000, // enter 动画执行时间
     *   },
     *   leave: false, // 关闭 leave 销毁动画
     * });
     * ```
     *
     * @param cfg 动画配置
     * @returns
     */
    animate(cfg: AnimateOption | boolean): Geometry;
    /**
     * Geometry label 配置。
     *
     * @example
     * ```ts
     * // data: [ {x: 1, y: 2, z: 'a'}, {x: 2, y: 2, z: 'b'} ]
     * // 在每个图形上显示 z 字段对应的数值
     * label({
     *   fields: [ 'z' ]
     * });
     *
     * label(false); // 不展示 label
     *
     * // 在每个图形上显示 x 字段对应的数值，同时配置文本颜色为红色
     * label('x', {
     *   style: {
     *     fill: 'red',
     *   },
     * })
     *
     * // 以 type 类型的 label 渲染每个图形上显示 x 字段对应的数值，同时格式化文本内容
     * label('x', (xValue) => {
     *   return {
     *     content: xValue + '%',
     *   };
     * }, {
     *   type: 'base' // 声明 label 类型
     * })
     * ```
     *
     * @param field
     * @returns label
     */
    label(field: LabelOption | false | string): Geometry;
    label(field: string, secondParam: GeometryLabelCfg | LabelCallback): Geometry;
    label(field: string, secondParam: LabelCallback, thirdParam: GeometryLabelCfg): Geometry;
    /**
     * 设置状态对应的样式。
     *
     * @example
     * ```ts
     * chart.interval().state({
     *   selected: {
     *     animate: { duration: 100, easing: 'easeLinear' },
     *     style: {
     *       lineWidth: 2,
     *       stroke: '#000',
     *     },
     *   },
     * });
     * ```
     *
     * 如果图形 shape 是由多个 shape 组成，即为一个 G.Group 对象，那么针对 group 中的每个 shape，我们需要使用下列方式进行状态样式设置：
     * 如果我们为 group 中的每个 shape 设置了 'name' 属性(shape.set('name', 'xx'))，则以 'name' 作为 key，否则默认以索引值（即 shape 的 添加顺序）为 key。
     *
     * ```ts
     * chart.interval().shape('groupShape').state({
     *   selected: {
     *     style: {
     *       0: { lineWidth: 2 },
     *       1: { fillOpacity: 1 },
     *     }
     *   }
     * });
     * ```
     *
     * @param cfg 状态样式
     */
    state(cfg: StateOption): this;
    /**
     * 用于向 shape 中传入自定义的数据。目前可能仅仅可能用于在自定义 shape 的时候，像自定义 shape 中传入自定义的数据，方便实现自定义 shape 的配置能力。
     *
     * @example
     * ```ts
     * chart.interval().customInfo({ yourData: 'hello, g2!' });
     * ```
     *
     * 然后在自定义 shape 的时候，可以拿到这个信息。
     *
     * ```ts
     * registerShape('interval', 'your-shape', {
     *   draw(shapeInfo, container) {
     *     const { customInfo } = shapeInfo;
     *     console.log(customInfo); // will log { yourData: 'hello, g2!' }.
     *   }
     * });
     * ```
     *
     * @param cfg
     */
    customInfo(cfg: any): this;
    /**
     * 初始化 Geomtry 实例：
     * 创建 [[Attribute]] and [[Scale]] 实例，进行数据处理，包括分组、数值化以及数据调整。
     */
    init(cfg?: InitCfg): void;
    /**
     * Geometry 更新。
     * @param [cfg] 更新的配置
     */
    update(cfg?: InitCfg): void;
    /**
     * 将原始数据映射至图形空间，同时创建图形对象。
     */
    paint(isUpdate?: boolean): void;
    /**
     * 清空当前 Geometry，配置项仍保留，但是内部创建的对象全部清空。
     * @override
     */
    clear(): void;
    /**
     * 销毁 Geometry 实例。
     */
    destroy(): void;
    /**
     * 获取决定分组的图形属性对应的 scale 实例。
     * @returns
     */
    getGroupScales(): Scale[];
    /**
     * 根据名字获取图形属性实例。
     */
    getAttribute(name: string): Attribute;
    /** 获取 x 轴对应的 scale 实例。 */
    getXScale(): Scale;
    /** 获取 y 轴对应的 scale 实例。 */
    getYScale(): Scale;
    /**
     * 获取决定分组的图形属性实例。
     */
    getGroupAttributes(): Attribute[];
    /** 获取图形属性默认的映射值。 */
    getDefaultValue(attrName: string): any;
    /**
     * 获取该数据发生图形映射后对应的 Attribute 图形空间数据。
     * @param attr Attribute 图形属性实例。
     * @param obj 需要进行映射的原始数据。
     * @returns
     */
    getAttributeValues(attr: Attribute, obj: Datum): any[];
    /**
     * 获取对应的 adjust 实例
     * @param adjustType
     * @returns
     */
    getAdjust(adjustType: string): Adjust;
    /**
     * 获得 coordinate 实例
     * @returns
     */
    getCoordinate(): Coordinate;
    getData(): Data;
    /**
     * 获取 shape 对应的 marker 样式。
     * @param shapeName shape 具体名字
     * @param cfg marker 信息
     * @returns
     */
    getShapeMarker(shapeName: string, cfg: ShapeMarkerCfg): ShapeMarkerAttrs;
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
     * 获取 Geometry 的所有 Elements。
     *
     * ```typescript
     * getElements();
     * ```
     */
    getElements(): Element[];
    /**
     * 获取数据对应的唯一 id。
     * @param data Element 对应的绘制数据
     * @returns
     */
    getElementId(data: MappingDatum | MappingDatum[]): any;
    /**
     * 获取所有需要创建 scale 的字段名称。
     */
    getScaleFields(): string[];
    /**
     * 显示或者隐藏 geometry。
     * @param visible
     */
    changeVisible(visible: boolean): void;
    /**
     * 获得所有的字段
     */
    getFields(): any[];
    /**
     * 获取当前配置中的所有分组 & 分类的字段。
     * @return fields string[]
     */
    getGroupFields(): string[];
    /**
     * 获得图形的 x y 字段。
     */
    getXYFields(): string[];
    /**
     * x 字段
     * @returns
     */
    getXField(): string;
    /**
     * y 字段
     * @returns
     */
    getYField(): string;
    /**
     * 获取该 Geometry 下所有生成的 shapes。
     * @returns shapes
     */
    getShapes(): (IShape | IGroup)[];
    /**
     * 获取虚拟 Group。
     * @returns
     */
    getOffscreenGroup(): IGroup;
    sort(mappingArray: Data[]): void;
    /**
     * 调整度量范围。主要针对发生层叠以及一些特殊需求的 Geometry，比如 Interval 下的柱状图 Y 轴默认从 0 开始。
     */
    protected adjustScale(): void;
    /**
     * 获取当前 Geometry 对应的 Shape 工厂实例。
     */
    protected getShapeFactory(): ShapeFactory;
    /**
     * 获取每个 Shape 对应的关键点数据。
     * @param obj 经过分组 -> 数字化 -> adjust 调整后的数据记录
     * @returns
     */
    protected createShapePointsCfg(obj: Datum): S;
    /**
     * 创建 Element 实例。
     * @param mappingDatum Element 对应的绘制数据
     * @param [isUpdate] 是否处于更新阶段
     * @returns element 返回创建的 Element 实例
     */
    protected createElement(mappingDatum: MappingDatum, index: number, isUpdate?: boolean): Element;
    /**
     * 获取每条数据对应的图形绘制数据。
     * @param mappingDatum 映射后的数据
     * @returns draw cfg
     */
    protected getDrawCfg(mappingDatum: MappingDatum): ShapeInfo;
    protected updateElements(mappingDataArray: MappingDatum[][], isUpdate?: boolean): void;
    /**
     * 获取渲染的 label 类型。
     */
    protected getLabelType(): string;
    /**
     * 获取 Y 轴上的最小值。
     */
    protected getYMinValue(): number;
    protected createAttrOption(attrName: string, field: AttributeOption | string | number, cfg?: any): void;
    protected initAttributes(): void;
    private processData;
    private adjustData;
    private groupData;
    private updateStackRange;
    private beforeMapping;
    private generateShapePoints;
    private normalizeValues;
    private mapping;
    private convertPoint;
    private getStyleCfg;
    private setCfg;
    private renderLabels;
    /**
     * 是否需要进行群组入场动画
     * 规则：
     * 1. 如果发生更新，则不进行
     * 2. 如果用户关闭 geometry 动画，则不进行
     * 3. 如果用户关闭了 appear 动画，则不进行
     * 4. 如果用户配置了 appear.animation，则不进行
     */
    private canDoGroupAnimation;
}
