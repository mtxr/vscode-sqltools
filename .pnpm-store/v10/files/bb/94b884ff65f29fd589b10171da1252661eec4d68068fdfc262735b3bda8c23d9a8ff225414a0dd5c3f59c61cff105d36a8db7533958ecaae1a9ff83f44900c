import { vec2 } from 'gl-matrix';
import type { PathCommand } from './types';

type Pos = [number, number];

function smoothBezier(points: Pos[], smooth: number, isLoop: boolean, constraint: Pos[]) {
  const cps: vec2[] = [];
  const hasConstraint = !!constraint;

  let prevPoint: Pos;
  let nextPoint: Pos;
  let min: vec2;
  let max: vec2;
  let nextCp0: vec2;
  let cp1: vec2;
  let cp0: vec2;

  if (hasConstraint) {
    [min, max] = constraint;
    for (let i = 0, l = points.length; i < l; i += 1) {
      const point = points[i];
      min = vec2.min([0, 0], min, point);
      max = vec2.max([0, 0], max, point);
    }
  }

  for (let i = 0, len = points.length; i < len; i += 1) {
    const point = points[i];
    if (i === 0 && !isLoop) {
      cp0 = point;
    } else if (i === len - 1 && !isLoop) {
      cp1 = point;
      cps.push(cp0);
      cps.push(cp1);
    } else {
      const prevIdx = [i ? i - 1 : len - 1, i - 1][isLoop ? 0 : 1];
      prevPoint = points[prevIdx];
      nextPoint = points[isLoop ? (i + 1) % len : i + 1];

      let v: vec2 = [0, 0];
      v = vec2.sub(v, nextPoint, prevPoint);
      v = vec2.scale(v, v, smooth);

      let d0 = vec2.distance(point, prevPoint);
      let d1 = vec2.distance(point, nextPoint);

      const sum = d0 + d1;
      if (sum !== 0) {
        d0 /= sum;
        d1 /= sum;
      }

      let v1 = vec2.scale([0, 0], v, -d0);
      let v2 = vec2.scale([0, 0], v, d1);

      cp1 = vec2.add([0, 0], point, v1);
      nextCp0 = vec2.add([0, 0], point, v2);

      // 下一个控制点必须在这个点和下一个点之间
      nextCp0 = vec2.min([0, 0], nextCp0, vec2.max([0, 0], nextPoint, point));
      nextCp0 = vec2.max([0, 0], nextCp0, vec2.min([0, 0], nextPoint, point));

      // 重新计算 cp1 的值
      v1 = vec2.sub([0, 0], nextCp0, point);
      v1 = vec2.scale([0, 0], v1, -d0 / d1);
      cp1 = vec2.add([0, 0], point, v1);

      // 上一个控制点必须要在上一个点和这一个点之间
      cp1 = vec2.min([0, 0], cp1, vec2.max([0, 0], prevPoint, point));
      cp1 = vec2.max([0, 0], cp1, vec2.min([0, 0], prevPoint, point));

      // 重新计算 nextCp0 的值
      v2 = vec2.sub([0, 0], point, cp1);
      v2 = vec2.scale([0, 0], v2, d1 / d0);
      nextCp0 = vec2.add([0, 0], point, v2);

      if (hasConstraint) {
        cp1 = vec2.max([0, 0], cp1, min);
        cp1 = vec2.min([0, 0], cp1, max);
        nextCp0 = vec2.max([0, 0], nextCp0, min);
        nextCp0 = vec2.min([0, 0], nextCp0, max);
      }

      cps.push(cp0);
      cps.push(cp1);
      cp0 = nextCp0;
    }
  }

  if (isLoop) {
    cps.push(cps.shift());
  }

  return cps;
}

/**
 * create bezier spline from catmull rom spline
 * @param {Array} crp Catmull Rom Points
 * @param {boolean} z Spline is loop
 * @param {Array} constraint Constraint
 */
function catmullRom2Bezier(
  crp: number[],
  z: boolean = false,
  constraint: Pos[] = [
    [0, 0],
    [1, 1],
  ]
): PathCommand[] {
  const isLoop = !!z;
  const pointList: Pos[] = [];
  for (let i = 0, l = crp.length; i < l; i += 2) {
    pointList.push([crp[i], crp[i + 1]]);
  }

  const controlPointList = smoothBezier(pointList, 0.4, isLoop, constraint);
  const len = pointList.length;
  const d1: PathCommand[] = [];

  let cp1: vec2;
  let cp2: vec2;
  let p: Pos;

  for (let i = 0; i < len - 1; i += 1) {
    cp1 = controlPointList[i * 2];
    cp2 = controlPointList[i * 2 + 1];
    p = pointList[i + 1];

    d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]]);
  }

  if (isLoop) {
    cp1 = controlPointList[len];
    cp2 = controlPointList[len + 1];
    [p] = pointList;

    d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]]);
  }
  return d1;
}

export default catmullRom2Bezier;
