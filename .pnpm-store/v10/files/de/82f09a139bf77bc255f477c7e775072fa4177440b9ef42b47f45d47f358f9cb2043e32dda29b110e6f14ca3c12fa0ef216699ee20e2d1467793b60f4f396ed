import { AnnotationBaseOption as BaseOption, ArcOption, ComponentOption, ShapeAnnotationOption, DataMarkerOption, DataRegionOption, HtmlAnnotationOption, ImageOption, LineOption, RegionFilterOption, RegionOption, TextOption } from '../../interface';
import View from '../view';
import { Controller } from './base';
/**
 * Annotation controller, 主要作用:
 * 1. 创建 Annotation: line、text、arc ...
 * 2. 生命周期: init、layout、render、clear、destroy
 */
export default class Annotation extends Controller<BaseOption[]> {
    private foregroundContainer;
    private backgroundContainer;
    private cache;
    constructor(view: View);
    get name(): string;
    init(): void;
    /**
     * 因为 annotation 需要依赖坐标系信息，所以 render 阶段为空方法，实际的创建逻辑都在 layout 中
     */
    layout(): void;
    render(): void;
    /**
     * 更新
     */
    update(): void;
    /**
     * 清空
     * @param includeOption 是否清空 option 配置项
     */
    clear(includeOption?: boolean): void;
    destroy(): void;
    /**
     * 复写基类的方法
     */
    getComponents(): ComponentOption[];
    /**
     * 清除当前的组件
     */
    private clearComponents;
    /**
     * region filter 比较特殊的渲染时机
     * @param doWhat
     */
    private onAfterRender;
    private createAnnotation;
    annotation(option: any): void;
    /**
     * 创建 Arc
     * @param option
     * @returns AnnotationController
     */
    arc(option: ArcOption): this;
    /**
     * 创建 image
     * @param option
     * @returns AnnotationController
     */
    image(option: ImageOption): this;
    /**
     * 创建 Line
     * @param option
     * @returns AnnotationController
     */
    line(option: LineOption): this;
    /**
     * 创建 Region
     * @param option
     * @returns AnnotationController
     */
    region(option: RegionOption): this;
    /**
     * 创建 Text
     * @param option
     * @returns AnnotationController
     */
    text(option: TextOption): this;
    /**
     * 创建 DataMarker
     * @param option
     * @returns AnnotationController
     */
    dataMarker(option: DataMarkerOption): this;
    /**
     * 创建 DataRegion
     * @param option
     * @returns AnnotationController
     */
    dataRegion(option: DataRegionOption): void;
    /**
     * 创建 RegionFilter
     * @param option
     * @returns AnnotationController
     */
    regionFilter(option: RegionFilterOption): void;
    /**
     * 创建 ShapeAnnotation
     * @param option
     */
    shape(option: ShapeAnnotationOption): void;
    /**
     * 创建 HtmlAnnotation
     * @param option
     */
    html(option: HtmlAnnotationOption): void;
    /**
     * parse the point position to [x, y]
     * @param p Position
     * @returns { x, y }
     */
    private parsePosition;
    /**
     * parse all the points between start and end
     * @param start
     * @param end
     * @return Point[]
     */
    private getRegionPoints;
    /**
     * parse percent position
     * @param position
     */
    private parsePercentPosition;
    /**
     * get coordinate bbox
     */
    private getCoordinateBBox;
    /**
     * get annotation component config by different type
     * @param type
     * @param option 用户的配置
     * @param theme
     */
    private getAnnotationCfg;
    /**
     * is annotation render on top
     * @param option
     * @return whethe on top
     */
    private isTop;
    /**
     * get the container by option.top
     * default is on top
     * @param option
     * @returns the container
     */
    private getComponentContainer;
    private getAnnotationTheme;
    /**
     * 创建或者更新 annotation
     * @param option
     */
    private updateOrCreate;
    /**
     * 更新缓存，以及销毁组件
     * @param updated 更新或者创建的组件
     */
    private syncCache;
    /**
     * 获得缓存组件的 key
     * @param option
     */
    private getCacheKey;
}
