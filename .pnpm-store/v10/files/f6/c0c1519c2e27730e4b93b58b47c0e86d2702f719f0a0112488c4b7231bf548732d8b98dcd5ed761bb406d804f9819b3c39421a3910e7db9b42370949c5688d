import { MappingDatum, Point } from '../../interface';
import { LabelCfg, LabelItem, LabelPointCfg, TextAlign } from './interface';
import Labels from '../../component/labels';
import Geometry from '../base';
export type GeometryLabelConstructor = new (cfg: any) => GeometryLabel;
/**
 * Geometry Label 基类，用于生成 Geometry 下所有 label 的配置项信息
 */
export default class GeometryLabel {
    /** geometry 实例 */
    readonly geometry: Geometry;
    labelsRenderer: Labels;
    /** 默认的布局 */
    defaultLayout: string;
    constructor(geometry: Geometry);
    getLabelItems(mapppingArray: MappingDatum[]): LabelItem[];
    render(mappingArray: MappingDatum[], isUpdate?: boolean): Promise<void>;
    clear(): void;
    destroy(): void;
    getCoordinate(): import("@antv/coord/lib/coord/base").default;
    /**
     * 获取 label 的默认配置
     */
    protected getDefaultLabelCfg(offset?: number, position?: string): any;
    /**
     * 获取当前 label 的最终配置
     * @param labelCfg
     */
    protected getThemedLabelCfg(labelCfg: LabelCfg): any;
    /**
     * 设置 label 位置
     * @param labelPointCfg
     * @param mappingData
     * @param index
     * @param position
     */
    protected setLabelPosition(labelPointCfg: LabelPointCfg, mappingData: MappingDatum, index: number, position: string): void;
    /**
     * @desc 获取 label offset
     */
    protected getLabelOffset(offset: number | string): number;
    /**
     * 获取每个 label 的偏移量 (矢量)
     * @param labelCfg
     * @param index
     * @param total
     * @return {Point} offsetPoint
     */
    protected getLabelOffsetPoint(labelCfg: LabelCfg, index: number, total: number): Point;
    /**
     * 获取每个 label 的位置
     * @param labelCfg
     * @param mappingData
     * @param index
     * @returns label point
     */
    protected getLabelPoint(labelCfg: LabelCfg, mappingData: MappingDatum, index: number): LabelPointCfg;
    /**
     * 获取文本的对齐方式
     * @param item
     * @param index
     * @param total
     * @returns
     */
    protected getLabelAlign(item: LabelItem, index: number, total: number): TextAlign;
    /**
     * 获取每一个 label 的唯一 id
     * @param mappingData label 对应的图形的绘制数据
     */
    protected getLabelId(mappingData: MappingDatum): any;
    private getLabelsRenderer;
    private getLabelCfgs;
    private getLabelText;
    private getOffsetVector;
    private getGeometryShapes;
}
