import { Point, PolarCfg } from '../interface';
import Coordinate from './base';
export default class Polar extends Coordinate {
    readonly isPolar: boolean;
    readonly type: string;
    circleCenter: Point;
    private polarRadius;
    constructor(cfg: PolarCfg);
    initial(): void;
    getRadius(): number;
    convertPoint(point: Point): Point;
    invertPoint(point: Point): Point;
    getCenter(): Point;
    private getOneBox;
}
