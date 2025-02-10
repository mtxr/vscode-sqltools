/**
 * @fileoverview Marker
 * @author dxq613@gmail.com
 */

import { isNil } from '@antv/util';
import { path2Absolute } from '@antv/path-util';
import ShapeBase from './base';
import { isFunction } from '../util/util';
import { drawPath } from '../util/draw';

const Symbols = {
  // 圆
  circle(x, y, r) {
    return [
      ['M', x - r, y],
      ['A', r, r, 0, 1, 0, x + r, y],
      ['A', r, r, 0, 1, 0, x - r, y],
    ];
  },
  // 正方形
  square(x, y, r) {
    return [['M', x - r, y - r], ['L', x + r, y - r], ['L', x + r, y + r], ['L', x - r, y + r], ['Z']];
  },
  // 菱形
  diamond(x, y, r) {
    return [['M', x - r, y], ['L', x, y - r], ['L', x + r, y], ['L', x, y + r], ['Z']];
  },
  // 三角形
  triangle(x, y, r) {
    const diffY = r * Math.sin((1 / 3) * Math.PI);
    return [['M', x - r, y + diffY], ['L', x, y - diffY], ['L', x + r, y + diffY], ['Z']];
  },
  // 倒三角形
  'triangle-down'(x, y, r) {
    const diffY = r * Math.sin((1 / 3) * Math.PI);
    return [['M', x - r, y - diffY], ['L', x + r, y - diffY], ['L', x, y + diffY], ['Z']];
  },
};

class Marker extends ShapeBase {
  initAttrs(attrs) {
    this._resetParamsCache();
  }

  // 重置绘制 path 存储的缓存
  _resetParamsCache() {
    // 为了加速 path 的绘制、拾取和计算，这个地方可以缓存很多东西
    // 这些缓存都是第一次需要时计算和存储，虽然增加了复杂度，但是频繁调用的方法，性能有很大提升
    this.set('paramsCache', {}); // 清理缓存
  }

  // 更新属性时，检测是否更改了 path
  onAttrChange(name: string, value: any, originValue: any) {
    super.onAttrChange(name, value, originValue);
    if (['symbol', 'x', 'y', 'r', 'radius'].indexOf(name) !== -1) {
      // path 相关属性更改时，清理缓存
      this._resetParamsCache();
    }
  }

  // 仅仅使用包围盒检测来进行拾取
  // 所以不需要复写 isInStrokeOrPath 的方法
  isOnlyHitBox() {
    return true;
  }

  _getR(attrs) {
    // 兼容 r 和 radius 两种写法，推荐使用 r
    return isNil(attrs.r) ? attrs.radius : attrs.r;
  }

  _getPath() {
    const attrs = this.attr();
    const { x, y } = attrs;
    const symbol = attrs.symbol || 'circle';
    const r = this._getR(attrs);
    let method;
    let path;
    if (isFunction(symbol)) {
      method = symbol;
      path = method(x, y, r);
      // 将 path 转成绝对路径
      path = path2Absolute(path);
    } else {
      // 内置 symbol 的 path 都是绝对路径，直接绘制即可，不需要对 path 进行特殊处理
      method = Marker.Symbols[symbol];

      if (!method) {
        console.warn(`${symbol} marker is not supported.`);
        return null;
      }

      path = method(x, y, r);
    }

    return path;
  }

  createPath(context) {
    const path = this._getPath();
    const paramsCache = this.get('paramsCache');
    drawPath(this, context, { path }, paramsCache);
  }

  static Symbols = Symbols;
}

export default Marker;
