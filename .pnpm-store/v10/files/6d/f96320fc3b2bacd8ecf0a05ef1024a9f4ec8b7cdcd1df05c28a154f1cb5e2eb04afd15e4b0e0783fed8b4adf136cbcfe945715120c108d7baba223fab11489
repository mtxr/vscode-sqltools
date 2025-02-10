/**
 * @description 扩展方法，提供 gl-matrix 为提供的方法
 * */
import { mat3, vec2 } from 'gl-matrix';

type mat3Type = [number, number, number, number, number, number, number, number, number];

export function leftTranslate(out, a, v) {
  const transMat: mat3Type = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  mat3.fromTranslation(transMat, v);
  return mat3.multiply(out, transMat, a);
}

export function leftRotate(out, a, rad) {
  const rotateMat: mat3Type = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  mat3.fromRotation(rotateMat, rad);
  return mat3.multiply(out, rotateMat, a);
}

export function leftScale(out, a, v) {
  const scaleMat: mat3Type = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  mat3.fromScaling(scaleMat, v);
  return mat3.multiply(out, scaleMat, a);
}

function leftMultiply(out, a, a1) {
  return mat3.multiply(out, a1, a);
}
/**
 * 根据 actions 来做 transform
 * @param m
 * @param actions
 */
export function transform(m: number[], actions: any[][]) {
  const matrix = m ? [].concat(m) : [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];

  for (let i = 0, len = actions.length; i < len; i++) {
    const action = actions[i];
    switch (action[0]) {
      case 't':
        leftTranslate(matrix, matrix, [ action[1], action[2] ]);
        break;
      case 's':
        leftScale(matrix, matrix, [ action[1], action[2] ]);
        break;
      case 'r':
        leftRotate(matrix, matrix, action[1]);
        break;
      case 'm':
        leftMultiply(matrix, matrix, action[1]);
        break;
      default:
        break;
    }
  }

  return matrix;
}

/**
 * 向量 v1 到 向量 v2 夹角的方向
 * @param  {Array} v1 向量
 * @param  {Array} v2 向量
 * @return {Boolean} >= 0 顺时针 < 0 逆时针
 */
export function direction(v1: number[], v2: number[]): number {
  return v1[0] * v2[1] - v2[0] * v1[1];
}

/**
 * 二维向量 v1 到 v2 的夹角
 * @param v1
 * @param v2
 * @param direct
 */
export function angleTo(v1: [number, number], v2: [number, number], direct: boolean): number {
  const ang = vec2.angle(v1, v2);
  const angleLargeThanPI = direction(v1, v2) >= 0;
  if (direct) {
    if (angleLargeThanPI) {
      return Math.PI * 2 - ang;
    }
    return ang;
  }

  if (angleLargeThanPI) {
    return ang;
  }
  return Math.PI * 2 - ang;
}

/**
 * 计算二维向量的垂直向量
 * @param out
 * @param v
 * @param flag
 */
export function vertical(out: number[], v: number[], flag: boolean): number[] {
  if (flag) {
    out[0] = v[1];
    out[1] = -1 * v[0];
  } else {
    out[0] = -1 * v[1];
    out[1] = v[0];
  }

  return out;
}
