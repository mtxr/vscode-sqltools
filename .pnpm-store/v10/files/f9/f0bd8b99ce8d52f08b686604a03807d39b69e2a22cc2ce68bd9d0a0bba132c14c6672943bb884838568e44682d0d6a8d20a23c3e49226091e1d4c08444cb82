import { ComponentOption } from '../../interface';
import View from '../view';
import { Controller } from './base';
import { SliderOption } from '../../interface';
/**
 * @ignore
 * slider Controller
 */
export default class Slider extends Controller<SliderOption> {
    private slider;
    private container;
    private width;
    private start;
    private end;
    private onChangeFn;
    constructor(view: View);
    get name(): string;
    destroy(): void;
    /**
     * 初始化
     */
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
    /**
     * 创建 slider 组件
     */
    private createSlider;
    /**
     * 更新配置
     */
    private updateSlider;
    /**
     * 进行测量操作
     */
    private measureSlider;
    /**
     * 清除测量
     */
    private resetMeasure;
    /**
     * 生成 slider 配置
     */
    private getSliderCfg;
    /**
     * 从 view 中获取数据，缩略轴使用全量的数据
     */
    private getData;
    /**
     * 获取 slider 的主题配置
     */
    private getThemeOptions;
    /**
     * 滑块滑动的时候出发
     * @param v
     */
    private onValueChange;
    /**
     * 根据 start/end 和当前数据计算出当前的 minText/maxText
     * @param min
     * @param max
     */
    private getMinMaxText;
    /**
     * 更新 view 过滤数据
     * @param min
     * @param max
     */
    private changeViewData;
    /**
     * 覆写父类方法
     */
    getComponents(): ComponentOption[];
    /**
     * 覆盖父类
     */
    clear(): void;
}
