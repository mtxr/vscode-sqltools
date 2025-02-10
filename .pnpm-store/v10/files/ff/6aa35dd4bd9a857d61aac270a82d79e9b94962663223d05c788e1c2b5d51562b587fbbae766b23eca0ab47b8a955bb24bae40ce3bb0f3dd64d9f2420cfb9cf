import { Controller } from './base';
import { ScrollbarOption, ComponentOption } from '../../interface';
import View from '../view';
export default class Scrollbar extends Controller<ScrollbarOption> {
    private scrollbar;
    private container;
    private trackLen;
    private thumbLen;
    private cnt;
    private step;
    private ratio;
    private data;
    private xScaleCfg;
    private yScalesCfg;
    private onChangeFn;
    constructor(view: View);
    get name(): string;
    destroy(): void;
    init(): void;
    /**
     * 渲染
     */
    render(): void;
    /**
     * 布局
     */
    layout(): void;
    /**
     * 更新
     */
    update(): void;
    getComponents(): ComponentOption[];
    clear(): void;
    /** 设置滚动条位置  */
    setValue(ratio: number): void;
    /** 获得滚动条位置  */
    getValue(): number;
    /**
     * 获取 scrollbar 的主题配置
     */
    private getThemeOptions;
    /**
     * 获取 scrollbar 组件的主题样式
     */
    private getScrollbarTheme;
    private resetMeasure;
    private onValueChange;
    private measureScrollbar;
    private getScrollRange;
    private changeViewData;
    private createScrollbar;
    private updateScrollbar;
    private getStep;
    private getCnt;
    private getScrollbarComponentCfg;
    /**
     * 填充一些默认的配置项目
     */
    private getValidScrollbarCfg;
    /**
     * 获取数据
     */
    private getScrollbarData;
}
