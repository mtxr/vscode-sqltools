import EE from '@antv/event-emitter';
import { Chart, View } from '@antv/g2';
import { Annotation, Options, StateCondition, StateName, StateObject } from '../types';
import { Adaptor } from './adaptor';
/** 单独 pick 出来的用于基类的类型定义 */
export type PickOptions = Pick<Options, 'width' | 'height' | 'padding' | 'appendPadding' | 'renderer' | 'pixelRatio' | 'autoFit' | 'syncViewPadding' | 'supportCSSTransform' | 'limitInPlot' | 'locale' | 'defaultInteractions'>;
/** plot 图表容器的配置 */
export declare const PLOT_CONTAINER_OPTIONS: string[];
/**
 * 所有 plot 的基类
 */
export declare abstract class Plot<O extends PickOptions> extends EE {
    /**
     * 获取默认的 options 配置项
     * 每个组件都可以复写
     */
    static getDefaultOptions(): any;
    /** plot 类型名称 */
    abstract readonly type: string;
    /** plot 的 schema 配置 */
    options: O;
    /** plot 绘制的 dom */
    readonly container: HTMLElement;
    /** G2 chart 实例 */
    chart: Chart;
    /** resizer unbind  */
    private unbind;
    constructor(container: string | HTMLElement, options: O);
    /**
     * 创建 G2 实例
     */
    private createG2;
    /**
     * 计算默认的 chart 大小。逻辑简化：如果存在 width 或 height，则直接使用，否则使用容器大小
     * @param width
     * @param height
     */
    private getChartSize;
    /**
     * 绑定代理所有 G2 的事件
     */
    private bindEvents;
    /**
     * 获取默认的 options 配置项
     * 每个组件都可以复写
     */
    protected getDefaultOptions(): any;
    /**
     * 每个组件有自己的 schema adaptor
     */
    protected abstract getSchemaAdaptor(): Adaptor<O>;
    /**
     * 绘制
     */
    render(): void;
    /**
     * 更新: 更新配置且重新渲染
     * @param options
     */
    update(options: Partial<O>): void;
    /**
     * 更新配置
     * @param options
     */
    protected updateOption(options: Partial<O>): void;
    /**
     * 设置状态
     * @param type 状态类型，支持 'active' | 'inactive' | 'selected' 三种
     * @param conditions 条件，支持数组
     * @param status 是否激活，默认 true
     */
    setState(type: StateName, condition: StateCondition, status?: boolean): void;
    /**
     * 获取状态
     */
    getStates(): StateObject[];
    /**
     * 更新数据
     * @override
     * @param options
     */
    changeData(data: any): void;
    /**
     * 修改画布大小
     * @param width
     * @param height
     */
    changeSize(width: number, height: number): void;
    /**
     * 增加图表标注。通过 id 标识，如果匹配到，就做更新
     */
    addAnnotations(annotations: Annotation[], view?: View): void;
    /**
     * 删除图表标注。通过 id 标识，如果匹配到，就做删除
     */
    removeAnnotations(annotations: Array<{
        id: string;
    } & Partial<Annotation>>): void;
    /**
     * 销毁
     */
    destroy(): void;
    /**
     * 执行 adaptor 操作
     */
    protected execAdaptor(): void;
    /**
     * 当图表容器大小变化的时候，执行的函数
     */
    protected triggerResize(): void;
    /**
     * 绑定 dom 容器大小变化的事件
     */
    private bindSizeSensor;
    /**
     * 取消绑定
     */
    private unbindSizeSensor;
}
