import { AxisCfg, Datum, ListCfg, ListData } from '../interface';
import View from '../chart/view';
import { Facet } from './facet';
/**
 * @ignore
 * 镜像分面
 */
export default class List extends Facet<ListCfg, ListData> {
    protected getDefaultCfg(): any;
    render(): void;
    protected afterEachView(view: View, facet: ListData): void;
    protected beforeEachView(view: View, facet: ListData): void;
    protected generateFacets(data: Datum[]): ListData[];
    /**
     * 设置 x 坐标轴的文本、title 是否显示
     * @param x
     * @param axes
     * @param option
     * @param facet
     */
    protected getXAxisOption(x: string, axes: any, option: AxisCfg, facet: ListData): object;
    /**
     * 设置 y 坐标轴的文本、title 是否显示
     * @param y
     * @param axes
     * @param option
     * @param facet
     */
    protected getYAxisOption(y: string, axes: any, option: AxisCfg, facet: ListData): object;
    /**
     * facet title
     */
    private renderTitle;
    /**
     * 计算分页数
     * @param total
     * @param pageSize
     */
    private getPageCount;
    /**
     * 索引值在哪一页
     * @param index
     * @param pageSize
     */
    private getRowCol;
}
