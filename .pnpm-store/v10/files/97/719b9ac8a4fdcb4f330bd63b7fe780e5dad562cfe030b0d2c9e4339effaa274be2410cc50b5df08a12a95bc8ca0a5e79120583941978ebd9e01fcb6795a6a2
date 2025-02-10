import { Datum } from '../interface';
import Geometry from './base';
/** 引入 Path 对应的 ShapeFactory */
import './shape/polygon';
/**
 * Polygon 几何标记。
 * 常用于绘制色块图、日历图等。
 */
export default class Polygon extends Geometry {
    readonly type: string;
    readonly shapeType: string;
    protected generatePoints: boolean;
    /**
     * 获取 Shape 的关键点数据。
     * @param obj
     * @returns
     */
    protected createShapePointsCfg(obj: Datum): any;
}
