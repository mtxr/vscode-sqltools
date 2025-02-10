import Base from '../../base';
import { BBox, IGroup, IShape } from '../../dependents';
import { AnimateOption, Datum, ShapeFactory, ShapeInfo } from '../../interface';
import Geometry from '../base';
/** Element 构造函数传入参数类型 */
interface ElementCfg {
    /** 用于创建各种 shape 的工厂对象 */
    shapeFactory: ShapeFactory;
    /** shape 容器 */
    container: IGroup;
    /** element 的索引 */
    elementIndex?: number;
    /** 虚拟 group，用户可以不传入 */
    offscreenGroup?: IGroup;
    /** 是否可见 */
    visible?: boolean;
}
/**
 * Element 图形元素。
 * 定义：在 G2 中，我们会将数据通过图形语法映射成不同的图形，比如点图，数据集中的每条数据会对应一个点，柱状图每条数据对应一个柱子，线图则是一组数据对应一条折线，Element 即一条/一组数据对应的图形元素，它代表一条数据或者一个数据集，在图形层面，它可以是单个 Shape 也可以是多个 Shape，我们称之为图形元素。
 */
export default class Element extends Base {
    /** 用于创建各种 shape 的工厂对象 */
    shapeFactory: ShapeFactory;
    /** shape 容器 */
    container: IGroup;
    /** element 索引 */
    elementIndex: number;
    /** 最后创建的图形对象 */
    shape: IShape | IGroup;
    /** shape 的动画配置 */
    animate: AnimateOption | boolean;
    /** element 对应的 Geometry 实例 */
    geometry: Geometry;
    /** 保存 shape 对应的 label */
    labelShape: IGroup[];
    /** 绘制的 shape 类型 */
    private shapeType;
    /** shape 绘制需要的数据 */
    private model;
    /** 原始数据 */
    private data;
    private states;
    private statesStyle;
    private offscreenGroup;
    constructor(cfg: ElementCfg);
    /**
     * 绘制图形。
     * @param model 绘制数据。
     * @param isUpdate 可选，是否是更新发生后的绘制。
     */
    draw(model: ShapeInfo, isUpdate?: boolean): void;
    /**
     * 更新图形。
     * @param model 更新的绘制数据。
     */
    update(model: ShapeInfo): void;
    /**
     * 销毁 element 实例。
     */
    destroy(): void;
    /**
     * 显示或者隐藏 element。
     * @param visible 是否可见。
     */
    changeVisible(visible: boolean): void;
    /**
     * 设置 Element 的状态。
     *
     * 目前 Element 开放三种状态：
     * 1. active
     * 2. selected
     * 3. inactive
     *
     * 这三种状态相互独立，可以进行叠加。
     *
     * 这三种状态的样式可在 [[Theme]] 主题中或者通过 `geometry.state()` 接口进行配置。
     *
     * ```ts
     * // 激活 active 状态
     * setState('active', true);
     * ```
     *
     * @param stateName 状态名
     * @param stateStatus 是否开启状态
     */
    setState(stateName: string, stateStatus: boolean): void;
    /**
     * 清空状量态，恢复至初始状态。
     */
    clearStates(): void;
    /**
     * 查询当前 Element 上是否已设置 `stateName` 对应的状态。
     * @param stateName 状态名称。
     * @returns true 表示存在，false 表示不存在。
     */
    hasState(stateName: string): boolean;
    /**
     * 获取当前 Element 上所有的状态。
     * @returns 当前 Element 上所有的状态数组。
     */
    getStates(): string[];
    /**
     * 获取 Element 对应的原始数据。
     * @returns 原始数据。
     */
    getData(): Datum;
    /**
     * 获取 Element 对应的图形绘制数据。
     * @returns 图形绘制数据。
     */
    getModel(): ShapeInfo;
    /**
     * 返回 Element 元素整体的 bbox，包含文本及文本连线（有的话）。
     * @returns 整体包围盒。
     */
    getBBox(): BBox;
    private getStatesStyle;
    private getStateStyle;
    private getAnimateCfg;
    private drawShape;
    private getOffscreenGroup;
    private setShapeInfo;
    private syncShapeStyle;
    private getShapeType;
}
export {};
