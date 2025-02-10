import { AxisCfg, Datum, RectCfg, RectData } from '../interface';
import View from '../chart/view';
import { Facet } from './facet';
/**
 * @ignore
 * 矩阵分面
 */
export default class Rect extends Facet<RectCfg, RectData> {
    protected afterEachView(view: View, facet: RectData): void;
    protected beforeEachView(view: View, facet: RectData): void;
    protected getDefaultCfg(): any;
    render(): void;
    /**
     * 生成矩阵分面的分面数据
     * @param data
     */
    protected generateFacets(data: Datum[]): RectData[];
    private renderTitle;
    /**
     * 设置 x 坐标轴的文本、title 是否显示
     * @param x
     * @param axes
     * @param option
     * @param facet
     */
    protected getXAxisOption(x: string, axes: any, option: AxisCfg, facet: RectData): object;
    /**
     * 设置 y 坐标轴的文本、title 是否显示
     * @param y
     * @param axes
     * @param option
     * @param facet
     */
    protected getYAxisOption(y: string, axes: any, option: AxisCfg, facet: RectData): object;
}
