import { ChartCfg } from '../interface';
import View from './view';
import { AriaOption } from '../interface';
/**
 * Chart 类，是使用 G2 进行绘图的入口。
 */
export default class Chart extends View {
    /** Chart 的 DOM 容器 */
    ele: HTMLElement;
    /** 图表宽度 */
    width: number;
    /** 图表高度 */
    height: number;
    /** 是否开启局部刷新 */
    localRefresh: boolean;
    /** 是否自适应 DOM 容器宽高，默认为 false，需要用户手动指定宽高 */
    autoFit: boolean;
    /** 图表渲染引擎 */
    renderer: 'canvas' | 'svg';
    private wrapperElement;
    constructor(props: ChartCfg);
    private initDefaultInteractions;
    /**
     * 设置 WAI-ARIA 无障碍标签。如何根据图形语法自动生成 arial 内容？
     * @param ariaOption
     */
    aria(ariaOption: AriaOption): void;
    /**
     * 改变图表大小，同时重新渲染。
     * @param width 图表宽度
     * @param height 图表高度
     * @returns
     */
    changeSize(width: number, height: number): this;
    /**
     * 清空图表，同时清除掉 aria 配置
     */
    clear(): void;
    /**
     * 销毁图表，同时解绑事件，销毁创建的 G.Canvas 实例。
     * @returns void
     */
    destroy(): void;
    /**
     * 显示或隐藏图表
     * @param visible 是否可见，true 表示显示，false 表示隐藏
     * @returns
     */
    changeVisible(visible: boolean): this;
    /**
     * 自动根据容器大小 resize 画布
     */
    forceFit(): void;
    private updateCanvasStyle;
    private bindAutoFit;
    private unbindAutoFit;
    /**
     * when container size changed, change chart size props, and re-render.
     */
    private onResize;
}
