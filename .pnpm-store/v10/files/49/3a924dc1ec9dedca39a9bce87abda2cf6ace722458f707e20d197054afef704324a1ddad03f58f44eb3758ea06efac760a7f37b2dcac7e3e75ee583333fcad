import { pointAtSegments, angleAtSegments, distanceAtSegment, lengthOfSegment } from './segments';
import { getBBoxByArray } from './util';
import { PointTuple, BBox } from './types';

export default {
  /**
   * 计算多折线的包围盒
   * @param {array} points 点的集合 [x,y] 的形式
   * @return {object} 包围盒
   */
  box(points: PointTuple[]): BBox {
    const xArr = [];
    const yArr = [];
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      xArr.push(point[0]);
      yArr.push(point[1]);
    }
    return getBBoxByArray(xArr, yArr);
  },
  /**
   * 计算多折线的长度
   * @param {array} points 点的集合 [x,y] 的形式
   * @return {object} 多条边的长度
   */
  length(points: PointTuple[]) {
    return lengthOfSegment(points);
  },
  /**
   * 根据比例获取多折线的点
   * @param {array} points 点的集合 [x,y] 的形式
   * @param {number} t 在多折线的长度上的比例
   * @return {object} 根据比例值计算出来的点
   */
  pointAt(points: PointTuple[], t: number) {
    return pointAtSegments(points, t);
  },
  /**
   * 指定点到多折线的距离
   * @param {array} points 点的集合 [x,y] 的形式
   * @param {number} x 指定点的 x
   * @param {number} y 指定点的 y
   * @return {number} 点到多折线的距离
   */
  pointDistance(points: PointTuple[], x: number, y: number) {
    return distanceAtSegment(points, x, y);
  },
  /**
   * 根据比例获取多折线的切线角度
   * @param {array} points 点的集合 [x,y] 的形式
   * @param {number} t 在多折线的长度上的比例
   * @return {object} 根据比例值计算出来的角度
   */
  tangentAngle(points: PointTuple[], t: number) {
    return angleAtSegments(points, t);
  },
};
