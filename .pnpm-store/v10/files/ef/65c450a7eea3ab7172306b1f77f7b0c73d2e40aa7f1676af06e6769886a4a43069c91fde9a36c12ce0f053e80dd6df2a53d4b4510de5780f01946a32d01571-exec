import { ext, vec2 } from '@antv/matrix-util';
import { isNumberEqual } from '@antv/util';
import { Point, PolarCfg } from '../interface';
import Coordinate, { Vector2 } from './base';

/**
 * 螺旋坐标系
 */
export default class Helix extends Coordinate {
  public readonly isHelix: boolean = true;
  public readonly type: string = 'helix';

  // 螺线系数
  private a: number;
  private d: number;

  constructor(cfg: PolarCfg) {
    super(cfg);

    const { startAngle = 1.25 * Math.PI, endAngle = 7.25 * Math.PI, innerRadius = 0, radius } = cfg;

    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.innerRadius = innerRadius;
    this.radius = radius;

    this.initial();
  }

  public initial() {
    super.initial();

    const index: number = (this.endAngle - this.startAngle) / (2 * Math.PI) + 1; // 螺线圈数
    let maxRadius: number = Math.min(this.width, this.height) / 2;

    if (this.radius && this.radius >= 0 && this.radius <= 1) {
      maxRadius = maxRadius * this.radius;
    }

    this.d = Math.floor((maxRadius * (1 - this.innerRadius)) / index);
    this.a = this.d / (Math.PI * 2); // 螺线系数

    this.x = {
      start: this.startAngle,
      end: this.endAngle,
    };
    this.y = {
      start: this.innerRadius * maxRadius,
      end: this.innerRadius * maxRadius + this.d * 0.99,
    };
  }

  /**
   * 将百分比数据变成屏幕坐标
   * @param point 归一化的点坐标
   * @return      返回对应的屏幕坐标
   */
  public convertPoint(point: Point): Point {
    let { x, y } = point;
    if (this.isTransposed) {
      [x, y] = [y, x];
    }

    const thi = this.convertDim(x, 'x');
    const r = this.a * thi;
    const newY = this.convertDim(y, 'y');

    return {
      x: this.center.x + Math.cos(thi) * (r + newY),
      y: this.center.y + Math.sin(thi) * (r + newY),
    };
  }

  /**
   * 将屏幕坐标点还原成百分比数据
   * @param point 屏幕坐标
   * @return      返回对应的归一化后的数据
   */
  public invertPoint(point: Point): Point {
    const d = this.d + this.y.start;

    const v = vec2.subtract([0, 0], [point.x, point.y], [this.center.x, this.center.y]) as Vector2;

    let thi = ext.angleTo(v, [1, 0], true);
    let rMin = thi * this.a; // 坐标与原点的连线在第一圈上的交点，最小r值

    if (vec2.length(v) < rMin) {
      // 坐标与原点的连线不可能小于最小r值，但不排除因小数计算产生的略小于rMin的情况
      rMin = vec2.length(v);
    }

    const index = Math.floor((vec2.length(v) - rMin) / d); // 当前点位于第index圈
    thi = 2 * index * Math.PI + thi;
    const r = this.a * thi;
    let newY = vec2.length(v) - r;
    newY = isNumberEqual(newY, 0) ? 0 : newY;

    let x = this.invertDim(thi, 'x');
    let y = this.invertDim(newY, 'y');
    x = isNumberEqual(x, 0) ? 0 : x;
    y = isNumberEqual(y, 0) ? 0 : y;

    if (this.isTransposed) {
      [x, y] = [y, x];
    }

    return { x, y };
  }
}
