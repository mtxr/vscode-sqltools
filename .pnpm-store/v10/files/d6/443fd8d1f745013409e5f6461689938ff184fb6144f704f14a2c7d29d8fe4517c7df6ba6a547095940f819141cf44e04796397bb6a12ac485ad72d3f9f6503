import { distance, piMod } from './util';
import ellipse from './ellipse';
import { Point, BBox } from './types';

// 偏导数 x
function derivativeXAt(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  xRotation: number,
  startAngle: number,
  endAngle: number,
  angle: number
) {
  return -1 * rx * Math.cos(xRotation) * Math.sin(angle) - ry * Math.sin(xRotation) * Math.cos(angle);
}

// 偏导数 y
function derivativeYAt(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  xRotation: number,
  startAngle: number,
  endAngle: number,
  angle: number
) {
  return -1 * rx * Math.sin(xRotation) * Math.sin(angle) + ry * Math.cos(xRotation) * Math.cos(angle);
}

// x 的极值
function xExtrema(rx: number, ry: number, xRotation: number) {
  return Math.atan((-ry / rx) * Math.tan(xRotation));
}

// y 的极值
function yExtrema(rx: number, ry: number, xRotation: number) {
  return Math.atan(ry / (rx * Math.tan(xRotation)));
}

// 根据角度求 x 坐标
function xAt(cx: number, cy: number, rx: number, ry: number, xRotation: number, angle: number) {
  return rx * Math.cos(xRotation) * Math.cos(angle) - ry * Math.sin(xRotation) * Math.sin(angle) + cx;
}

// 根据角度求 y 坐标
function yAt(cx: number, cy: number, rx: number, ry: number, xRotation: number, angle: number) {
  return rx * Math.sin(xRotation) * Math.cos(angle) + ry * Math.cos(xRotation) * Math.sin(angle) + cy;
}

// 获取点在椭圆上的角度
function getAngle(rx: number, ry: number, x0: number, y0: number) {
  const angle = Math.atan2(y0 * rx, x0 * ry);
  // 转换到 0 - 2PI 内
  return (angle + Math.PI * 2) % (Math.PI * 2);
}

// 根据角度获取，x,y
function getPoint(rx: number, ry: number, angle: number): Point {
  return {
    x: rx * Math.cos(angle),
    y: ry * Math.sin(angle),
  };
}

// 旋转
function rotate(x: number, y: number, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos - y * sin, x * sin + y * cos];
}

export default {
  /**
   * 计算包围盒
   * @param {number} cx         圆心 x
   * @param {number} cy         圆心 y
   * @param {number} rx         x 轴方向的半径
   * @param {number} ry         y 轴方向的半径
   * @param {number} xRotation  旋转角度
   * @param {number} startAngle 起始角度
   * @param {number} endAngle   结束角度
   * @return {object} 包围盒对象
   */
  box(cx: number, cy: number, rx: number, ry: number, xRotation: number, startAngle: number, endAngle: number): BBox {
    const xDim = xExtrema(rx, ry, xRotation);
    let minX = Infinity;
    let maxX = -Infinity;
    const xs = [startAngle, endAngle];
    for (let i = -Math.PI * 2; i <= Math.PI * 2; i += Math.PI) {
      const xAngle = xDim + i;
      if (startAngle < endAngle) {
        if (startAngle < xAngle && xAngle < endAngle) {
          xs.push(xAngle);
        }
      } else {
        if (endAngle < xAngle && xAngle < startAngle) {
          xs.push(xAngle);
        }
      }
    }

    for (let i = 0; i < xs.length; i++) {
      const x = xAt(cx, cy, rx, ry, xRotation, xs[i]);
      if (x < minX) {
        minX = x;
      }
      if (x > maxX) {
        maxX = x;
      }
    }

    const yDim = yExtrema(rx, ry, xRotation);
    let minY = Infinity;
    let maxY = -Infinity;
    const ys = [startAngle, endAngle];
    for (let i = -Math.PI * 2; i <= Math.PI * 2; i += Math.PI) {
      const yAngle = yDim + i;
      if (startAngle < endAngle) {
        if (startAngle < yAngle && yAngle < endAngle) {
          ys.push(yAngle);
        }
      } else {
        if (endAngle < yAngle && yAngle < startAngle) {
          ys.push(yAngle);
        }
      }
    }

    for (let i = 0; i < ys.length; i++) {
      const y = yAt(cx, cy, rx, ry, xRotation, ys[i]);
      if (y < minY) {
        minY = y;
      }
      if (y > maxY) {
        maxY = y;
      }
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  },
  /**
   * 获取圆弧的长度，计算圆弧长度时不考虑旋转角度，
   * 仅跟 rx, ry, startAngle, endAngle 相关
   * @param {number} cx         圆心 x
   * @param {number} cy         圆心 y
   * @param {number} rx         x 轴方向的半径
   * @param {number} ry         y 轴方向的半径
   * @param {number} xRotation  旋转角度
   * @param {number} startAngle 起始角度
   * @param {number} endAngle   结束角度
   */
  length(cx: number, cy: number, rx: number, ry: number, xRotation: number, startAngle: number, endAngle: number) {},
  /**
   * 获取指定点到圆弧的最近距离的点
   * @param {number} cx         圆心 x
   * @param {number} cy         圆心 y
   * @param {number} rx         x 轴方向的半径
   * @param {number} ry         y 轴方向的半径
   * @param {number} xRotation  旋转角度
   * @param {number} startAngle 起始角度
   * @param {number} endAngle   结束角度
   * @param {number} x0         指定点的 x
   * @param {number} y0         指定点的 y
   * @return {object} 到指定点最近距离的点
   */
  nearestPoint(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    xRotation: number,
    startAngle: number,
    endAngle: number,
    x0: number,
    y0: number
  ) {
    // 将最近距离问题转换成到椭圆中心 0,0 没有旋转的椭圆问题
    const relativeVector = rotate(x0 - cx, y0 - cy, -xRotation);
    const [x1, y1] = relativeVector;
    // 计算点到椭圆的最近的点
    let relativePoint = ellipse.nearestPoint(0, 0, rx, ry, x1, y1);
    // 获取点在椭圆上的角度
    const angle = getAngle(rx, ry, relativePoint.x, relativePoint.y);
    // 点没有在圆弧上
    if (angle < startAngle) {
      // 小于起始圆弧
      relativePoint = getPoint(rx, ry, startAngle);
    } else if (angle > endAngle) {
      // 大于结束圆弧
      relativePoint = getPoint(rx, ry, endAngle);
    }
    // 旋转到 xRotation 的角度
    const vector = rotate(relativePoint.x, relativePoint.y, xRotation);
    return {
      x: vector[0] + cx,
      y: vector[1] + cy,
    };
  },
  pointDistance(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    xRotation: number,
    startAngle: number,
    endAngle: number,
    x0: number,
    y0: number
  ) {
    const nearestPoint = this.nearestPoint(cx, cy, rx, ry, x0, y0);
    return distance(nearestPoint.x, nearestPoint.y, x0, y0);
  },
  pointAt(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    xRotation: number,
    startAngle: number,
    endAngle: number,
    t: number
  ): Point {
    const angle = (endAngle - startAngle) * t + startAngle;
    return {
      x: xAt(cx, cy, rx, ry, xRotation, angle),
      y: yAt(cx, cy, rx, ry, xRotation, angle),
    };
  },
  tangentAngle(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    xRotation: number,
    startAngle: number,
    endAngle: number,
    t: number
  ) {
    const angle = (endAngle - startAngle) * t + startAngle;
    const dx = derivativeXAt(cx, cy, rx, ry, xRotation, startAngle, endAngle, angle);
    const dy = derivativeYAt(cx, cy, rx, ry, xRotation, startAngle, endAngle, angle);
    return piMod(Math.atan2(dy, dx));
  },
};
