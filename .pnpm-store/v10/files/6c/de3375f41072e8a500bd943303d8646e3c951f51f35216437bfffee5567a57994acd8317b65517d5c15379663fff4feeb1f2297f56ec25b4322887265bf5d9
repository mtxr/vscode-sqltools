export function getPixelRatio() {
  return window ? window.devicePixelRatio : 1;
}

/**
 * 两点之间的距离
 * @param {number} x1 起始点 x
 * @param {number} y1 起始点 y
 * @param {number} x2 结束点 x
 * @param {number} y2 结束点 y
 */
export function distance(x1: number, y1: number, x2: number, y2: number) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 是否在包围盒内
 * @param {number} minX   包围盒开始的点 x
 * @param {number} minY   包围盒开始的点 y
 * @param {number} width  宽度
 * @param {number} height 高度
 * @param {[type]} x      检测点的 x
 * @param {[type]} y      监测点的 y
 */
export function inBox(minX: number, minY: number, width: number, height: number, x, y) {
  return x >= minX && x <= minX + width && y >= minY && y <= minY + height;
}

export function intersectRect(box1, box2) {
  return !(box2.minX > box1.maxX || box2.maxX < box1.minX || box2.minY > box1.maxY || box2.maxY < box1.minY);
}

// 合并两个区域
export function mergeRegion(region1, region2) {
  if (!region1 || !region2) {
    return region1 || region2;
  }
  return {
    minX: Math.min(region1.minX, region2.minX),
    minY: Math.min(region1.minY, region2.minY),
    maxX: Math.max(region1.maxX, region2.maxX),
    maxY: Math.max(region1.maxY, region2.maxY),
  };
}

/**
 * 判断两个点是否重合，点坐标的格式为 [x, y]
 * @param {Array} point1 第一个点
 * @param {Array} point2 第二个点
 */
export function isSamePoint(point1, point2) {
  return point1[0] === point2[0] && point1[1] === point2[1];
}

export {
  isNil,
  isString,
  isFunction,
  isArray,
  each,
  toRadian,
  mod,
  isNumberEqual,
  requestAnimationFrame,
  clearAnimationFrame,
} from '@antv/util';
