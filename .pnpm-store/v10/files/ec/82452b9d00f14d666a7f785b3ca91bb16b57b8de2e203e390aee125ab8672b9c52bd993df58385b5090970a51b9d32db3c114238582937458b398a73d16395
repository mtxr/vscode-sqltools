import { IContainer, IElement, IGroup, IShape, isAllowCapture, multiplyVec2, invert } from '@antv/g-base';

function invertFromMatrix(v: number[], matrix: number[]): number[] {
  if (matrix) {
    const invertMatrix = invert(matrix);
    return multiplyVec2(invertMatrix, v);
  }
  return v;
}

function getRefXY(element: IElement, x: number, y: number) {
  // @ts-ignore
  const totalMatrix = element.getTotalMatrix();
  if (totalMatrix) {
    const [refX, refY] = invertFromMatrix([x, y, 1], totalMatrix);
    return [refX, refY];
  }
  return [x, y];
}

// 拾取前的检测，只有通过检测才能继续拾取
function preTest(element: IElement, x: number, y: number) {
  // @ts-ignore
  if (element.isCanvas && element.isCanvas()) {
    return true;
  }
  // 不允许被拾取，则返回 null
  // @ts-ignore
  if (!isAllowCapture(element) || element.cfg.isInView === false) {
    return false;
  }

  if (element.cfg.clipShape) {
    // 如果存在 clip
    const [refX, refY] = getRefXY(element, x, y);
    if (element.isClipped(refX, refY)) {
      return false;
    }
  }
  // @ts-ignore ，这个地方调用过于频繁
  const bbox = element.cfg.cacheCanvasBBox || element.getCanvasBBox();
  // 如果没有缓存 bbox，则说明不可见
  // 注释掉的这段可能会加速拾取，上面的语句改写成 const bbox = element.cfg.cacheCanvasBBox;
  // 这时候的拾取假设图形/分组在上一次绘制都在视窗内，但是上面已经判定了 isInView 所以意义不大
  // 现在还调用 element.getCanvasBBox(); 一个很大的原因是便于单元测试
  // if (!bbox) {
  //   return false;
  // }
  if (!(x >= bbox.minX && x <= bbox.maxX && y >= bbox.minY && y <= bbox.maxY)) {
    return false;
  }
  return true;
}

// 这个方法复写了 g-base 的 getShape
export function getShape(container: IContainer, x: number, y: number) {
  // 没有通过检测，则返回 null
  if (!preTest(container, x, y)) {
    return null;
  }
  let shape = null;
  const children = container.getChildren();
  const count = children.length;
  for (let i = count - 1; i >= 0; i--) {
    const child = children[i];
    if (child.isGroup()) {
      shape = getShape(child as IGroup, x, y);
    } else if (preTest(child, x, y)) {
      const curShape = child as IShape;
      const [refX, refY] = getRefXY(child, x, y);
      // @ts-ignore
      if (curShape.isInShape(refX, refY)) {
        shape = child;
      }
    }
    if (shape) {
      break;
    }
  }
  return shape;
}
