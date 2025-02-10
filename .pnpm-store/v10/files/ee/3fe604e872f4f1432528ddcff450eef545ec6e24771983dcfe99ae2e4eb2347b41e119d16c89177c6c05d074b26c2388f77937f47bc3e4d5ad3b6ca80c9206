import line from './line';
import { distance } from './util';
import { Point, PointTuple, Segment } from './types';

function analyzePoints(points: PointTuple[]) {
  // 计算每段的长度和总的长度
  let totalLength = 0;
  const segments: Segment[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const length = distance(from[0], from[1], to[0], to[1]);
    const seg = {
      from,
      to,
      length,
    };
    segments.push(seg);
    totalLength += length;
  }
  return { segments, totalLength };
}

export function lengthOfSegment(points: PointTuple[]) {
  if (points.length < 2) {
    return 0;
  }
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    totalLength += distance(from[0], from[1], to[0], to[1]);
  }
  return totalLength;
}

/**
 * 按照比例在数据片段中获取点
 * @param {array} points 点的集合
 * @param {number} t 百分比 0-1
 * @return {object} 点的坐标
 */
export function pointAtSegments(points: PointTuple[], t: number): Point {
  // 边界判断
  if (t > 1 || t < 0 || points.length < 2) {
    return null;
  }
  const { segments, totalLength } = analyzePoints(points);
  // 多个点有可能重合
  if (totalLength === 0) {
    return {
      x: points[0][0],
      y: points[0][1],
    };
  }
  // 计算比例
  let startRatio = 0;
  let point = null;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const { from, to } = seg;
    const currentRatio = seg.length / totalLength;
    if (t >= startRatio && t <= startRatio + currentRatio) {
      const localRatio = (t - startRatio) / currentRatio;
      point = line.pointAt(from[0], from[1], to[0], to[1], localRatio);
      break;
    }
    startRatio += currentRatio;
  }
  return point;
}

/**
 * 按照比例在数据片段中获取切线的角度
 * @param {array} points 点的集合
 * @param {number} t 百分比 0-1
 */
export function angleAtSegments(points: PointTuple[], t: number) {
  // 边界判断
  if (t > 1 || t < 0 || points.length < 2) {
    return 0;
  }
  const { segments, totalLength } = analyzePoints(points);
  // 计算比例
  let startRatio = 0;
  let angle = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const { from, to } = seg;
    const currentRatio = seg.length / totalLength;
    if (t >= startRatio && t <= startRatio + currentRatio) {
      angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
      break;
    }
    startRatio += currentRatio;
  }
  return angle;
}

export function distanceAtSegment(points: PointTuple[], x: number, y: number) {
  let minDistance = Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    const point = points[i];
    const nextPoint = points[i + 1];
    const distance = line.pointDistance(point[0], point[1], nextPoint[0], nextPoint[1], x, y);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }
  return minDistance;
}
