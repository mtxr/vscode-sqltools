import { LooseObject } from '../interface';
import Geometry from './base';
/** 引入对应的 ShapeFactory */
import './shape/schema';
/**
 * Schema 几何标记，用于一些自定义图形的绘制，比如箱型图、股票图等。
 */
export default class Schema extends Geometry {
    readonly type: string;
    readonly shapeType: string;
    protected generatePoints: boolean;
    /**
     * 获取 Shape 的关键点数据。
     * @param record
     * @returns
     */
    protected createShapePointsCfg(record: LooseObject): import("../interface").ShapePoint;
}
