import { Point, PolarCfg } from '../interface';
import Coordinate from './base';
/**
 * 螺旋坐标系
 */
export default class Helix extends Coordinate {
    readonly isHelix: boolean;
    readonly type: string;
    private a;
    private d;
    constructor(cfg: PolarCfg);
    initial(): void;
    /**
     * 将百分比数据变成屏幕坐标
     * @param point 归一化的点坐标
     * @return      返回对应的屏幕坐标
     */
    convertPoint(point: Point): Point;
    /**
     * 将屏幕坐标点还原成百分比数据
     * @param point 屏幕坐标
     * @return      返回对应的归一化后的数据
     */
    invertPoint(point: Point): Point;
}
