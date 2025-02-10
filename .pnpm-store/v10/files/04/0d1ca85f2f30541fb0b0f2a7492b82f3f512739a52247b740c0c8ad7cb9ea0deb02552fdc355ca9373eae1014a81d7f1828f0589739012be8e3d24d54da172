import View from '../chart/view';
import { AxisCfg, Datum, TreeCfg, TreeData } from '../interface';
import { Facet } from './facet';
/**
 * @ignore
 * Tree Facet
 */
export default class Tree extends Facet<TreeCfg, TreeData> {
    protected afterEachView(view: View, facet: TreeData): void;
    protected beforeEachView(view: View, facet: TreeData): void;
    init(): void;
    protected getDefaultCfg(): any;
    protected generateFacets(data: Datum[]): TreeData[];
    private setRegion;
    protected getRegion(rows: number, cols: number, xIndex: number, yIndex: number): {
        start: {
            x: number;
            y: number;
        };
        end: {
            x: number;
            y: number;
        };
    };
    private forceColIndex;
    private getFacetsByLevel;
    private getRegionIndex;
    private isLeaf;
    private getRows;
    private getChildFacets;
    render(): void;
    private afterChartRender;
    private renderTitle;
    private drawLines;
    private addFacetLines;
    private getPath;
    private drawLine;
    protected getXAxisOption(x: string, axes: any, option: AxisCfg, facet: TreeData): object;
    protected getYAxisOption(y: string, axes: any, option: AxisCfg, facet: TreeData): object;
}
