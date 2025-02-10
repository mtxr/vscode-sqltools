import { Datum, MappingDatum, ShapeInfo } from '../interface';
import { ShapeAttrs } from '../dependents';
import Geometry, { GeometryCfg } from './base';
/** 引入对应的 ShapeFactory */
import './shape/interval';
/** Path 构造函数参数类型 */
export interface IntervalCfg extends GeometryCfg {
    /** shape 背景，只对 Interval Geometry 生效，目前只对 interval-rect shape 生效。 */
    background?: {
        style?: ShapeAttrs;
    };
}
/**
 * Interval 几何标记。
 * 用于绘制柱状图、饼图、条形图、玫瑰图等。
 */
export default class Interval extends Geometry {
    readonly type: string;
    readonly shapeType: string;
    /** shape 背景。目前只对 interval-rect shape 生效。 */
    protected background?: {
        style?: ShapeAttrs;
    };
    protected generatePoints: boolean;
    constructor(cfg: IntervalCfg);
    /**
     * 获取每条数据的 Shape 绘制信息
     * @param obj 经过分组 -> 数字化 -> adjust 调整后的数据记录
     * @returns
     */
    protected createShapePointsCfg(obj: Datum): import("../interface").ShapePoint;
    /**
     * 调整 y 轴的 scale 范围。
     * 对于 Y 轴为数值轴柱状图，默认从 0 开始 生长。
     */
    protected adjustScale(): void;
    /**
     * @override
     */
    protected getDrawCfg(mappingData: MappingDatum): ShapeInfo;
}
