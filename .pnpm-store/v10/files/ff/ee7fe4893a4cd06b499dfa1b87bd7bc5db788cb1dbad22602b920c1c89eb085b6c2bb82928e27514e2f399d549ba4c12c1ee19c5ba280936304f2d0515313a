import { AxisCfg, Datum, MatrixCfg, MatrixData } from '../interface';
import View from '../chart/view';
import { Facet } from './facet';
/**
 * @ignore
 * 镜像分面
 */
export default class Matrix extends Facet<MatrixCfg, MatrixData> {
    protected getDefaultCfg(): any;
    render(): void;
    protected afterEachView(view: View, facet: MatrixData): void;
    protected beforeEachView(view: View, facet: MatrixData): void;
    protected generateFacets(data: Datum[]): MatrixData[];
    /**
     * 设置 x 坐标轴的文本、title 是否显示
     * @param x
     * @param axes
     * @param option
     * @param facet
     */
    protected getXAxisOption(x: string, axes: any, option: AxisCfg, facet: MatrixData): object;
    /**
     * 设置 y 坐标轴的文本、title 是否显示
     * @param y
     * @param axes
     * @param option
     * @param facet
     */
    protected getYAxisOption(y: string, axes: any, option: AxisCfg, facet: MatrixData): object;
    /**
     * facet title
     */
    private renderTitle;
}
