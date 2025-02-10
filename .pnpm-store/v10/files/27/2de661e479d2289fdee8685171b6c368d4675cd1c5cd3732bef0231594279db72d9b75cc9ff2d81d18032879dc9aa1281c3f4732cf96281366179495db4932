/**
 * @fileoverview 椭圆的一些计算，
 *  - 周长计算参考：https://www.mathsisfun.com/geometry/ellipse-perimeter.html
 *  - 距离计算参考：https://wet-robots.ghost.io/simple-method-for-distance-to-ellipse/
 * @author dxq613@gmail.com
 */

import { distance, piMod } from './util';
import { Point, BBox } from './types';

function copysign(v1: number, v2: number) {
  const absv = Math.abs(v1);
  return v2 > 0 ? absv : absv * -1;
}

export default {
  /**
   * 包围盒计算
   * @param {number} x  椭圆中心 x
   * @param {number} y  椭圆中心 y
   * @param {number} rx 椭圆 x 方向半径
   * @param {number} ry 椭圆 y 方向半径
   * @return {object} 包围盒
   */
  box(x: number, y: number, rx: number, ry: number): BBox {
    return {
      x: x - rx,
      y: y - ry,
      width: rx * 2,
      height: ry * 2,
    };
  },
  /**
   * 计算周长，使用近似法
   * @param {number} x  椭圆中心 x
   * @param {number} y  椭圆中心 y
   * @param {number} rx 椭圆 x 方向半径
   * @param {number} ry 椭圆 y 方向半径
   * @return {number} 椭圆周长
   */
  length(x: number, y: number, rx: number, ry: number) {
    return Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  },
  /**
   * 距离椭圆最近的点
   * @param {number} x  椭圆中心 x
   * @param {number} y  椭圆中心 y
   * @param {number} rx 椭圆 x 方向半径
   * @param {number} ry 椭圆 y 方向半径
   * @param {number} x0  指定的点 x
   * @param {number} y0  指定的点 y
   * @return {object} 椭圆上距离指定点最近的点
   */
  nearestPoint(x: number, y: number, rx: number, ry: number, x0: number, y0: number) {
    const a = rx;
    const b = ry;
    // 假如椭圆半径为0则返回圆心
    if (a === 0 || b === 0) {
      return {
        x,
        y,
      };
    }
    // 转换成 0， 0 为中心的椭圆计算
    const relativeX = x0 - x;
    const relativeY = y0 - y;
    const px = Math.abs(relativeX);
    const py = Math.abs(relativeY);
    const squareA = a * a;
    const squareB = b * b;
    // const angle0 = Math.atan2(relativeY, relativeX);
    let t = Math.PI / 4;
    let nearestX: number; // 椭圆上的任一点
    let nearestY: number;
    // 迭代 4 次
    for (let i = 0; i < 4; i++) {
      nearestX = a * Math.cos(t);
      nearestY = b * Math.sin(t);

      const ex = ((squareA - squareB) * Math.cos(t) ** 3) / a;
      const ey = ((squareB - squareA) * Math.sin(t) ** 3) / b;
      const rx1 = nearestX - ex;
      const ry1 = nearestY - ey;

      const qx = px - ex;
      const qy = py - ey;
      const r = Math.hypot(ry1, rx1);
      const q = Math.hypot(qy, qx);

      const delta_c = r * Math.asin((rx1 * qy - ry1 * qx) / (r * q));
      const delta_t = delta_c / Math.sqrt(squareA + squareB - nearestX * nearestX - nearestY * nearestY);

      t += delta_t;
      t = Math.min(Math.PI / 2, Math.max(0, t));
    }

    return {
      x: x + copysign(nearestX, relativeX),
      y: y + copysign(nearestY, relativeY),
    };
  },
  /**
   * 点到椭圆最近的距离
   * @param {number} x  椭圆中心 x
   * @param {number} y  椭圆中心 y
   * @param {number} rx 椭圆 x 方向半径
   * @param {number} ry 椭圆 y 方向半径
   * @param {number} x0  指定的点 x
   * @param {number} y0  指定的点 y
   * @return {number} 点到椭圆的距离
   */
  pointDistance(x: number, y: number, rx: number, ry: number, x0: number, y0: number) {
    const nearestPoint = this.nearestPoint(x, y, rx, ry, x0, y0);
    return distance(nearestPoint.x, nearestPoint.y, x0, y0);
  },
  /**
   * 根据比例获取点
   * @param {number} x 椭圆中心 x
   * @param {number} y 椭圆中心 y
   * @param {number} rx 椭圆 x 方向半径
   * @param {number} ry 椭圆 y 方向半径
   * @param {number} t 指定比例，x轴方向为 0
   * @return {object} 点
   */
  pointAt(x: number, y: number, rx: number, ry: number, t: number): Point {
    const angle = 2 * Math.PI * t; // 按照角度进行计算，而不按照周长计算
    return {
      x: x + rx * Math.cos(angle),
      y: y + ry * Math.sin(angle),
    };
  },
  /**
   * 根据比例计算切线角度
   * @param {number} x 椭圆中心 x
   * @param {number} y 椭圆中心 y
   * @param {number} rx 椭圆 x 方向半径
   * @param {number} ry 椭圆 y 方向半径
   * @param {number} t 指定比例 0 - 1 之间，x轴方向为 0。在 0-1 范围之外是循环还是返回 null，还需要调整
   * @return {number} 角度，在 0 - 2PI 之间
   */
  tangentAngle(x: number, y: number, rx: number, ry: number, t: number) {
    const angle = 2 * Math.PI * t; // 按照角度进行计算，而不按照周长计算
    // 直接使用 x,y 的导数计算， x' = -rx * sin(t); y' = ry * cos(t);
    const tangentAngle = Math.atan2(ry * Math.cos(angle), -rx * Math.sin(angle));
    // 也可以使用指定点的切线方程计算，成本有些高
    // const point = this.pointAt(0, 0, rx, ry, t); // 椭圆的切线同椭圆的中心不相关
    // let tangentAngle = -1 * Math.atan((ry * ry * point.x) / (rx * rx * point.y));
    // if (angle >= 0 && angle <= Math.PI) {
    //   tangentAngle += Math.PI;
    // }

    return piMod(tangentAngle);
  },
};
