import { Datum, ViolinShapePoint } from '../interface';
import Geometry from './base';
/** 引入 Path 对应的 ShapeFactory */
import './shape/violin';
/**
 * Violin 几何标记。
 * 用于绘制小提琴图。
 */
export default class Violin extends Geometry<ViolinShapePoint> {
    readonly type: string;
    readonly shapeType: string;
    protected generatePoints: boolean;
    /** size 私有映射字段 */
    private _sizeField;
    /**
     * 获取 Shape 的关键点数据。
     * @param record
     * @returns
     */
    protected createShapePointsCfg(record: Datum): ViolinShapePoint;
    /**
     * @override
     */
    protected initAttributes(): void;
}
