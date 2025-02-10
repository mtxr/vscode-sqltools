/**
 * @fileoverview path 的一些工具
 * @author dxq613@gmail.com
 */
import { PathUtil } from '@antv/g-base';
import { Quad as QuadUtil } from '@antv/g-math';
import { Cubic as CubicUtil } from '@antv/g-math';
import { ext } from '@antv/matrix-util';
import * as vec3 from 'gl-matrix/vec3';
import { inBox } from './util';
import inLine from './in-stroke/line';
import inArc from './in-stroke/arc';

const { transform } = ext;

function hasArc(path) {
  let hasArc = false;
  const count = path.length;
  for (let i = 0; i < count; i++) {
    const params = path[i];
    const cmd = params[0];
    if (cmd === 'C' || cmd === 'A' || cmd === 'Q') {
      hasArc = true;
      break;
    }
  }
  return hasArc;
}

function isPointInStroke(segments, lineWidth, x, y, length) {
  let isHit = false;
  const halfWidth = lineWidth / 2;
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const { currentPoint, params, prePoint, box } = segment;
    // 如果在前面已经生成过包围盒，直接按照包围盒计算
    if (box && !inBox(box.x - halfWidth, box.y - halfWidth, box.width + lineWidth, box.height + lineWidth, x, y)) {
      continue;
    }
    switch (segment.command) {
      // L 和 Z 都是直线， M 不进行拾取
      case 'L':
      case 'Z':
        isHit = inLine(prePoint[0], prePoint[1], currentPoint[0], currentPoint[1], lineWidth, x, y);
        break;
      case 'Q':
        const qDistance = QuadUtil.pointDistance(
          prePoint[0],
          prePoint[1],
          params[1],
          params[2],
          params[3],
          params[4],
          x,
          y
        );
        isHit = qDistance <= lineWidth / 2;
        break;
      case 'C':
        const cDistance = CubicUtil.pointDistance(
          prePoint[0], // 上一段结束位置, 即 C 的起始点
          prePoint[1],
          params[1], // 'C' 的参数，1、2 为第一个控制点，3、4 为第二个控制点，5、6 为结束点
          params[2],
          params[3],
          params[4],
          params[5],
          params[6],
          x,
          y,
          length
        );
        isHit = cDistance <= lineWidth / 2;
        break;
      case 'A':
        // 计算点到椭圆圆弧的距离，暂时使用近似算法，后面可以改成切割法求最近距离
        const arcParams = segment.arcParams;
        const { cx, cy, rx, ry, startAngle, endAngle, xRotation } = arcParams;
        const p = [x, y, 1];
        const r = rx > ry ? rx : ry;
        const scaleX = rx > ry ? 1 : rx / ry;
        const scaleY = rx > ry ? ry / rx : 1;
        const m = transform(null, [
          ['t', -cx, -cy],
          ['r', -xRotation],
          ['s', 1 / scaleX, 1 / scaleY],
        ]);
        vec3.transformMat3(p, p, m);
        isHit = inArc(0, 0, r, startAngle, endAngle, lineWidth, p[0], p[1]);
        break;
      default:
        break;
    }
    if (isHit) {
      break;
    }
  }
  return isHit;
}

/**
 * 提取出内部的闭合多边形和非闭合的多边形，假设 path 不存在圆弧
 * @param {Array} path 路径
 * @returns {Array} 点的集合
 */
function extractPolygons(path) {
  const count = path.length;
  const polygons = [];
  const polylines = [];
  let points = []; // 防止第一个命令不是 'M'
  for (let i = 0; i < count; i++) {
    const params = path[i];
    const cmd = params[0];
    if (cmd === 'M') {
      // 遇到 'M' 判定是否是新数组，新数组中没有点
      if (points.length) {
        // 如果存在点，则说明没有遇到 'Z'，开始了一个新的多边形
        polylines.push(points);
        points = []; // 创建新的点
      }
      points.push([params[1], params[2]]);
    } else if (cmd === 'Z') {
      if (points.length) {
        // 存在点
        polygons.push(points);
        points = []; // 开始新的点集合
      }
      // 如果不存在点，同时 'Z'，则说明是错误，不处理
    } else {
      points.push([params[1], params[2]]);
    }
  }
  // 说明 points 未放入 polygons 或者 polyline
  // 仅当只有一个 M，没有 Z 时会发生这种情况
  if (points.length > 0) {
    polylines.push(points);
  }
  return {
    polygons,
    polylines,
  };
}

export default {
  hasArc,
  extractPolygons,
  isPointInStroke,
  ...PathUtil,
};
