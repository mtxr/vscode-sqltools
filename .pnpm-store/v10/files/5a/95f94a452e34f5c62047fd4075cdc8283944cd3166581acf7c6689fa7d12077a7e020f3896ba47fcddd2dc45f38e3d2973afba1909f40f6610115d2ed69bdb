import { AxisCfg, CircleCfg, CircleData, Datum } from '../interface';
import View from '../chart/view';
import { Facet } from './facet';
/**
 * @ignore
 * 镜像分面
 */
export default class Circle extends Facet<CircleCfg, CircleData> {
    protected getDefaultCfg(): any;
    render(): void;
    /**
     * 根据总数和当前索引，计算分面的 region
     * @param count
     * @param index
     */
    protected getRegion(count: number, index: number): {
        start: import("@antv/g-base").Point;
        end: import("@antv/g-base").Point;
    };
    protected afterEachView(view: View, facet: CircleData): void;
    protected beforeEachView(view: View, facet: CircleData): void;
    protected generateFacets(data: Datum[]): CircleData[];
    protected getXAxisOption(x: string, axes: any, option: AxisCfg, facet: CircleData): object;
    /**
     * 设置 y 坐标轴的文本、title 是否显示
     * @param y
     * @param axes
     * @param option
     * @param facet
     */
    protected getYAxisOption(y: string, axes: any, option: AxisCfg, facet: CircleData): object;
    /**
     * facet title
     */
    private renderTitle;
}
