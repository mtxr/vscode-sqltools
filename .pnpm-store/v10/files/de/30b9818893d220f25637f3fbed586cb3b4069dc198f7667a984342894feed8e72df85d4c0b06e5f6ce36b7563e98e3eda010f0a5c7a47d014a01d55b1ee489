import { distance } from './util';
import { Point, PointTuple } from './types';

const EPSILON = 0.0001;
/**
 * 使用牛顿切割法求最近的点
 * @param {number[]} xArr      点的 x 数组
 * @param {number[]} yArr      点的 y 数组
 * @param {number}   x         指定的点 x
 * @param {number}   y         指定的点 y
 * @param {Function} tCallback 差值函数
 */
export function nearestPoint(
  xArr: number[],
  yArr: number[],
  x: number,
  y: number,
  tCallback: (...arr: number[]) => number,
  length?: number
): Point {
  let t: number;
  let d = Infinity;
  const v0: PointTuple = [x, y];

  let segNum = 20;
  if (length && length > 200) {
    segNum = length / 10;
  }
  const increaseRate = 1 / segNum;

  let interval = increaseRate / 10;

  for (let i = 0; i <= segNum; i++) {
    const _t = i * increaseRate;
    const v1: PointTuple = [tCallback.apply(null, xArr.concat([_t])), tCallback.apply(null, yArr.concat([_t]))];

    const d1 = distance(v0[0], v0[1], v1[0], v1[1]);
    if (d1 < d) {
      t = _t;
      d = d1;
    }
  }
  // 提前终止
  if (t === 0) {
    return {
      x: xArr[0],
      y: yArr[0],
    };
  }
  if (t === 1) {
    const count = xArr.length;
    return {
      x: xArr[count - 1],
      y: yArr[count - 1],
    };
  }
  d = Infinity;

  for (let i = 0; i < 32; i++) {
    if (interval < EPSILON) {
      break;
    }

    const prev = t - interval;
    const next = t + interval;

    const v1 = [tCallback.apply(null, xArr.concat([prev])), tCallback.apply(null, yArr.concat([prev]))];

    const d1 = distance(v0[0], v0[1], v1[0], v1[1]);
    if (prev >= 0 && d1 < d) {
      t = prev;
      d = d1;
    } else {
      const v2 = [tCallback.apply(null, xArr.concat([next])), tCallback.apply(null, yArr.concat([next]))];
      const d2 = distance(v0[0], v0[1], v2[0], v2[1]);
      if (next <= 1 && d2 < d) {
        t = next;
        d = d2;
      } else {
        interval *= 0.5;
      }
    }
  }

  return {
    x: tCallback.apply(null, xArr.concat([t])),
    y: tCallback.apply(null, yArr.concat([t])),
  };
}

// 近似求解 https://community.khronos.org/t/3d-cubic-bezier-segment-length/62363/2
export function snapLength(xArr: number[], yArr: number[]) {
  let totalLength = 0;
  const count = xArr.length;
  for (let i = 0; i < count; i++) {
    const x = xArr[i];
    const y = yArr[i];
    const nextX = xArr[(i + 1) % count];
    const nextY = yArr[(i + 1) % count];
    totalLength += distance(x, y, nextX, nextY);
  }
  return totalLength / 2;
}
