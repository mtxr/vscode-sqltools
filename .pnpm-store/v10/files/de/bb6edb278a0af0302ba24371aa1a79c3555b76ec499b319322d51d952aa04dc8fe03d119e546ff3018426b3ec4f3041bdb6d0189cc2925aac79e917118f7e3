import { AxisCfg, Datum, MirrorCfg, MirrorData } from '../interface';
import View from '../chart/view';
import { Facet } from './facet';
/**
 * @ignore
 * 镜像分面
 */
export default class Mirror extends Facet<MirrorCfg, MirrorData> {
    protected getDefaultCfg(): any;
    render(): void;
    protected beforeEachView(view: View, facet: MirrorData): void;
    protected afterEachView(view: View, facet: MirrorData): void;
    protected generateFacets(data: Datum[]): MirrorData[];
    /**
     * 设置 x 坐标轴的文本、title 是否显示
     * @param x
     * @param axes
     * @param option
     * @param facet
     */
    protected getXAxisOption(x: string, axes: any, option: AxisCfg, facet: MirrorData): object;
    /**
     * 设置 y 坐标轴的文本、title 是否显示
     * @param y
     * @param axes
     * @param option
     * @param facet
     */
    protected getYAxisOption(y: string, axes: any, option: AxisCfg, facet: MirrorData): object;
    private renderTitle;
}
