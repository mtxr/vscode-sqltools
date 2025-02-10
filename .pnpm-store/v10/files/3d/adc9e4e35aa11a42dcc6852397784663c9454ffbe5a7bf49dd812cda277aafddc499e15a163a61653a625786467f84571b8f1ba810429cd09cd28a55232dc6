import line from './line';
import { distance, isNumberEqual, getBBoxByArray, piMod } from './util';
import { nearestPoint } from './bezier';
import { Point } from './types';

// 差值公式
function quadraticAt(p0: number, p1: number, p2: number, t: number) {
  const onet = 1 - t;
  return onet * onet * p0 + 2 * t * onet * p1 + t * t * p2;
}

// 求极值
function extrema(p0: number, p1: number, p2: number) {
  const a = p0 + p2 - 2 * p1;
  if (isNumberEqual(a, 0)) {
    return [0.5];
  }
  const rst = (p0 - p1) / a;
  if (rst <= 1 && rst >= 0) {
    return [rst];
  }
  return [];
}

function derivativeAt(p0: number, p1: number, p2: number, t: number) {
  return 2 * (1 - t) * (p1 - p0) + 2 * t * (p2 - p1);
}

// 分割贝塞尔曲线
function divideQuadratic(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, t: number) {
  // 划分点
  const xt = quadraticAt(x1, x2, x3, t);
  const yt = quadraticAt(y1, y2, y3, t);

  // 分割的第一条曲线的控制点
  const controlPoint1 = line.pointAt(x1, y1, x2, y2, t);
  // 分割的第二条曲线的控制点
  const controlPoint2 = line.pointAt(x2, y2, x3, y3, t);
  return [
    [x1, y1, controlPoint1.x, controlPoint1.y, xt, yt],
    [xt, yt, controlPoint2.x, controlPoint2.y, x3, y3],
  ];
}

// 使用迭代法取贝塞尔曲线的长度
function quadraticLength(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  iterationCount: number
) {
  if (iterationCount === 0) {
    return (distance(x1, y1, x2, y2) + distance(x2, y2, x3, y3) + distance(x1, y1, x3, y3)) / 2;
  }
  const quadratics = divideQuadratic(x1, y1, x2, y2, x3, y3, 0.5);
  const left = quadratics[0];
  const right = quadratics[1];
  left.push(iterationCount - 1);
  right.push(iterationCount - 1);
  return quadraticLength.apply(null, left) + quadraticLength.apply(null, right);
}

export default {
  box(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    const xExtrema = extrema(x1, x2, x3)[0];
    const yExtrema = extrema(y1, y2, y3)[0];
    // 控制点不加入 box 的计算
    const xArr = [x1, x3];
    const yArr = [y1, y3];
    if (xExtrema !== undefined) {
      xArr.push(quadraticAt(x1, x2, x3, xExtrema));
    }
    if (yExtrema !== undefined) {
      yArr.push(quadraticAt(y1, y2, y3, yExtrema));
    }
    return getBBoxByArray(xArr, yArr);
  },
  length(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    return quadraticLength(x1, y1, x2, y2, x3, y3, 3);
  },
  nearestPoint(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x0: number, y0: number) {
    return nearestPoint([x1, x2, x3], [y1, y2, y3], x0, y0, quadraticAt);
  },
  pointDistance(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x0: number, y0: number) {
    const point = this.nearestPoint(x1, y1, x2, y2, x3, y3, x0, y0);
    return distance(point.x, point.y, x0, y0);
  },
  interpolationAt: quadraticAt,
  pointAt(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, t: number): Point {
    return {
      x: quadraticAt(x1, x2, x3, t),
      y: quadraticAt(y1, y2, y3, t),
    };
  },
  divide(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, t: number) {
    return divideQuadratic(x1, y1, x2, y2, x3, y3, t);
  },
  tangentAngle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, t: number) {
    const dx = derivativeAt(x1, x2, x3, t);
    const dy = derivativeAt(y1, y2, y3, t);
    const angle = Math.atan2(dy, dx);
    return piMod(angle);
  },
};
