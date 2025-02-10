import { MappingDatum, Point } from '../../interface';
import GeometryLabel from './base';
import { LabelCfg, LabelItem, PolarLabelItem, LabelPointCfg } from './interface';
/**
 * 极坐标下的图形 label
 */
export default class PolarLabel extends GeometryLabel {
    /**
     * @override
     * @desc 获取 label offset
     * polar & theta coordinate support「string」type, should transform to 「number」
     */
    protected getLabelOffset(offset: number | string): number;
    /**
     * @override
     * 获取 labelItems, 增加切片 percent
     * @param mapppingArray
     */
    getLabelItems(mapppingArray: MappingDatum[]): PolarLabelItem[];
    /**
     * @override
     * 获取文本的对齐方式
     * @param point
     */
    protected getLabelAlign(point: LabelItem): any;
    /**
     * @override
     * 获取 label 的位置
     * @param labelCfg
     * @param mappingData
     * @param index
     */
    protected getLabelPoint(labelCfg: LabelCfg, mappingData: MappingDatum, index: number): LabelPointCfg;
    /**
     * 获取圆弧的位置
     */
    protected getArcPoint(mappingData: MappingDatum, index?: number): Point;
    /**
     * 计算坐标线点在极坐标系下角度
     * @param point
     */
    protected getPointAngle(point: Point): number;
    /**
     * 获取坐标点与圆心形成的圆的位置信息
     * @param angle
     * @param offset
     * @param point
     * @param isLabelEmit
     */
    protected getCirclePoint(angle: number, offset: number, point: Point, isLabelEmit: boolean): {
        r: number;
        x: number;
        y: number;
    };
    /**
     * 获取 label 的旋转角度
     * @param angle
     * @param offset
     * @param isLabelEmit
     */
    protected getLabelRotate(angle: number, offset: number, isLabelEmit: boolean): number;
    private getMiddlePoint;
    private isToMiddle;
}
