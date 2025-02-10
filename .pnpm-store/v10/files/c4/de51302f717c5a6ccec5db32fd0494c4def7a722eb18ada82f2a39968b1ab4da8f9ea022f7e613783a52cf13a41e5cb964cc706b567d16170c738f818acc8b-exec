import { CoordinateCfg, Point } from '../interface';
import Coordinate from './base';

/**
 * 笛卡尔坐标系
 * https://www.zhihu.com/question/20665303
 */
export default class Cartesian extends Coordinate {
  public readonly isRect: boolean = true;
  public readonly type: string = 'cartesian';

  constructor(cfg: CoordinateCfg) {
    super(cfg);

    this.initial();
  }

  public initial() {
    super.initial();

    const start = this.start;
    const end = this.end;

    this.x = {
      start: start.x,
      end: end.x,
    };
    this.y = {
      start: start.y,
      end: end.y,
    };
  }

  public convertPoint(point: Point) {
    let { x, y } = point;

    // 交换
    if (this.isTransposed) {
      [x, y] = [y, x];
    }
    return {
      x: this.convertDim(x, 'x'),
      y: this.convertDim(y, 'y'),
    };
  }

  public invertPoint(point: Point) {
    let x = this.invertDim(point.x, 'x');
    let y = this.invertDim(point.y, 'y');

    if (this.isTransposed) {
      [x, y] = [y, x];
    }

    return { x, y };
  }
}
