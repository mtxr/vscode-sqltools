import { IElement } from '@antv/g-base';
import { ext, vec2, vec3 } from '@antv/matrix-util';
import { BBox, Point } from '../types';

const identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export function getMatrixByAngle(point: Point, angle: number, matrix = identityMatrix): number[] {
  if (!angle) {
    // 角度为 0 或者 null 时返回 null
    return null;
  }
  const m = ext.transform(matrix, [
    ['t', -point.x, -point.y],
    ['r', angle],
    ['t', point.x, point.y],
  ]);
  return m;
}

export function getMatrixByTranslate(point: Point, currentMatrix?: number[]): number[] {
  if (!point.x && !point.y) {
    // 0，0 或者 nan 的情况下返回 null
    return null;
  }
  return ext.transform(currentMatrix || identityMatrix, [['t', point.x, point.y]]);
}

// 从矩阵获取旋转的角度
export function getAngleByMatrix(matrix: [
  number, number, number,
  number, number, number,
  number, number, number
]): number {
  const xVector: [number, number, number] = [1, 0, 0];
  const out: [ number, number, number ] = [0, 0, 0];
  vec3.transformMat3(out, xVector, matrix);
  return Math.atan2(out[1], out[0]);
}
// 矩阵 * 向量
function multiplyVec2(matrix, v) {
  const out: [number, number] = [0, 0];
  vec2.transformMat3(out, v, matrix);
  return out;
}

export function applyMatrix2BBox(matrix: number[], bbox: BBox) {
  const topLeft = multiplyVec2(matrix, [bbox.minX, bbox.minY]);
  const topRight = multiplyVec2(matrix, [bbox.maxX, bbox.minY]);
  const bottomLeft = multiplyVec2(matrix, [bbox.minX, bbox.maxY]);
  const bottomRight = multiplyVec2(matrix, [bbox.maxX, bbox.maxY]);
  const minX = Math.min(topLeft[0], topRight[0], bottomLeft[0], bottomRight[0]);
  const maxX = Math.max(topLeft[0], topRight[0], bottomLeft[0], bottomRight[0]);
  const minY = Math.min(topLeft[1], topRight[1], bottomLeft[1], bottomRight[1]);
  const maxY = Math.max(topLeft[1], topRight[1], bottomLeft[1], bottomRight[1]);
  return {
    x: minX,
    y: minY,
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function applyRotate(shape: IElement, rotate: number, x: number, y: number) {
  if (rotate) {
    const matrix = getMatrixByAngle({ x, y }, rotate, shape.getMatrix());
    shape.setMatrix(matrix);
  }
}

export function applyTranslate(shape: IElement, x: number, y: number) {
  const translateMatrix = getMatrixByTranslate({ x, y });
  shape.attr('matrix', translateMatrix);
}
