import { CoordinateCfg, Point } from '../interface';
import Coordinate from './base';
/**
 * 笛卡尔坐标系
 * https://www.zhihu.com/question/20665303
 */
export default class Cartesian extends Coordinate {
    readonly isRect: boolean;
    readonly type: string;
    constructor(cfg: CoordinateCfg);
    initial(): void;
    convertPoint(point: Point): {
        x: number;
        y: number;
    };
    invertPoint(point: Point): {
        x: number;
        y: number;
    };
}
