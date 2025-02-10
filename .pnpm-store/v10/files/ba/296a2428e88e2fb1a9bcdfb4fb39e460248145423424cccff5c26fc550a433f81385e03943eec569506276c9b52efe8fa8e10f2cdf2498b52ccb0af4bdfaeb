import { distance, isNumberEqual, getBBoxByArray, piMod } from './util';
import line from './line';
import { snapLength, nearestPoint } from './bezier';
import { Point } from './types';

function cubicAt(p0: number, p1: number, p2: number, p3: number, t: number) {
  const onet = 1 - t; // t * t * t 的性能大概是 Math.pow(t, 3) 的三倍
  return onet * onet * onet * p0 + 3 * p1 * t * onet * onet + 3 * p2 * t * t * onet + p3 * t * t * t;
}

function derivativeAt(p0: number, p1: number, p2: number, p3: number, t: number) {
  const onet = 1 - t;
  return 3 * (onet * onet * (p1 - p0) + 2 * onet * t * (p2 - p1) + t * t * (p3 - p2));
}

function extrema(p0: number, p1: number, p2: number, p3: number) {
  const a = -3 * p0 + 9 * p1 - 9 * p2 + 3 * p3;
  const b = 6 * p0 - 12 * p1 + 6 * p2;
  const c = 3 * p1 - 3 * p0;
  const extremas = [];
  let t1: number;
  let t2: number;
  let discSqrt: number;

  if (isNumberEqual(a, 0)) {
    if (!isNumberEqual(b, 0)) {
      t1 = -c / b;
      if (t1 >= 0 && t1 <= 1) {
        extremas.push(t1);
      }
    }
  } else {
    const disc = b * b - 4 * a * c;
    if (isNumberEqual(disc, 0)) {
      extremas.push(-b / (2 * a));
    } else if (disc > 0) {
      discSqrt = Math.sqrt(disc);
      t1 = (-b + discSqrt) / (2 * a);
      t2 = (-b - discSqrt) / (2 * a);
      if (t1 >= 0 && t1 <= 1) {
        extremas.push(t1);
      }
      if (t2 >= 0 && t2 <= 1) {
        extremas.push(t2);
      }
    }
  }
  return extremas;
}

// 分割贝塞尔曲线
function divideCubic(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
  t: number
) {
  // 划分点
  const xt = cubicAt(x1, x2, x3, x4, t);
  const yt = cubicAt(y1, y2, y3, y4, t);
  // 计算两点之间的差值点
  const c1 = line.pointAt(x1, y1, x2, y2, t);
  const c2 = line.pointAt(x2, y2, x3, y3, t);
  const c3 = line.pointAt(x3, y3, x4, y4, t);
  const c12 = line.pointAt(c1.x, c1.y, c2.x, c2.y, t);
  const c23 = line.pointAt(c2.x, c2.y, c3.x, c3.y, t);
  return [
    [x1, y1, c1.x, c1.y, c12.x, c12.y, xt, yt],
    [xt, yt, c23.x, c23.y, c3.x, c3.y, x4, y4],
  ];
}

// 使用迭代法取贝塞尔曲线的长度，二阶和三阶分开写，更清晰和便于调试
function cubicLength(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
  iterationCount: number
) {
  if (iterationCount === 0) {
    return snapLength([x1, x2, x3, x4], [y1, y2, y3, y4]);
  }
  const cubics = divideCubic(x1, y1, x2, y2, x3, y3, x4, y4, 0.5);
  const left = cubics[0];
  const right = cubics[1];
  left.push(iterationCount - 1);
  right.push(iterationCount - 1);
  return cubicLength.apply(null, left) + cubicLength.apply(null, right);
}

export default {
  extrema,
  box(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
    const xArr = [x1, x4];
    const yArr = [y1, y4];
    const xExtrema = extrema(x1, x2, x3, x4);
    const yExtrema = extrema(y1, y2, y3, y4);
    for (let i = 0; i < xExtrema.length; i++) {
      xArr.push(cubicAt(x1, x2, x3, x4, xExtrema[i]));
    }
    for (let i = 0; i < yExtrema.length; i++) {
      yArr.push(cubicAt(y1, y2, y3, y4, yExtrema[i]));
    }
    return getBBoxByArray(xArr, yArr);
  },
  length(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
    // 迭代三次，划分成 8 段求长度
    return cubicLength(x1, y1, x2, y2, x3, y3, x4, y4, 3);
  },
  nearestPoint(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
    x0: number,
    y0: number,
    length?: number
  ) {
    return nearestPoint([x1, x2, x3, x4], [y1, y2, y3, y4], x0, y0, cubicAt, length);
  },
  pointDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
    x0: number,
    y0: number,
    length?: number
  ) {
    const point = this.nearestPoint(x1, y1, x2, y2, x3, y3, x4, y4, x0, y0, length);
    return distance(point.x, point.y, x0, y0);
  },
  interpolationAt: cubicAt,
  pointAt(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
    t: number
  ): Point {
    return {
      x: cubicAt(x1, x2, x3, x4, t),
      y: cubicAt(y1, y2, y3, y4, t),
    };
  },
  divide(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, t: number) {
    return divideCubic(x1, y1, x2, y2, x3, y3, x4, y4, t);
  },
  tangentAngle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
    t: number
  ) {
    const dx = derivativeAt(x1, x2, x3, x4, t);
    const dy = derivativeAt(y1, y2, y3, y4, t);
    return piMod(Math.atan2(dy, dx));
  },
};
