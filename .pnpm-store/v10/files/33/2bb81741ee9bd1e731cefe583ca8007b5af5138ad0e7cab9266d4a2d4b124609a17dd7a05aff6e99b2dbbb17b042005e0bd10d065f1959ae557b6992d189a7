import { IElement, IGroup } from '@antv/g-base';
import { each, isArray, isNil, isNumber } from '@antv/util';
import { BBox, Point, Region } from '../types';

export function formatPadding(padding: number | number[]): number[] {
  let top = 0;
  let left = 0;
  let right = 0;
  let bottom = 0;

  if (isNumber(padding)) {
    top = left = right = bottom = padding;
  } else if (isArray(padding)) {
    top = padding[0];
    right = !isNil(padding[1]) ? padding[1] : padding[0];
    bottom = !isNil(padding[2]) ? padding[2] : padding[0];
    left = !isNil(padding[3]) ? padding[3] : right;
  }

  return [top, right, bottom, left];
}

export function clearDom(container: HTMLElement) {
  const children = container.childNodes;
  const length = children.length;
  for (let i = length - 1; i >= 0; i--) {
    container.removeChild(children[i]);
  }
}

export function hasClass(elements, cName): boolean {
  return !!elements.className.match(new RegExp(`(\\s|^)${cName}(\\s|$)`));
}

export function regionToBBox(region: Region): BBox {
  const { start, end } = region;
  const minX = Math.min(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxX = Math.max(start.x, end.x);
  const maxY = Math.max(start.y, end.y);
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

export function pointsToBBox(points: Point[]): BBox {
  const xs: number[] = points.map((point) => point.x);
  const ys: number[] = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
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

export function createBBox(x: number, y: number, width: number, height: number): BBox {
  const maxX = x + width;
  const maxY = y + height;

  return {
    x,
    y,
    width,
    height,
    minX: x,
    minY: y,
    // 非常奇葩的 js 特性
    // Infinity + Infinity = Infinity
    // Infinity - Infinity = NaN
    // fixed https://github.com/antvis/G2Plot/issues/1243
    maxX: isNaN(maxX) ? 0 : maxX,
    maxY: isNaN(maxY) ? 0 : maxY,
  };
}

export function getValueByPercent(min: number, max: number, percent: number) {
  return (1 - percent) * min + max * percent;
}

export function getCirclePoint(center: Point, radius: number, angle: number) {
  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius,
  };
}

export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export const wait = (interval: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, interval);
  });
};

/**
 * 判断两个数值 是否接近
 * - 解决精度问题（由于无法确定精度上限，根据具体场景可传入 精度 参数）
 */
export const near = (x: number, y: number, e = Number.EPSILON ** 0.5): boolean =>
  [x, y].includes(Infinity) ? Math.abs(x) === Math.abs(y) : Math.abs(x - y) < e;

export function intersectBBox(box1: BBox, box2: BBox): BBox {
  const minX = Math.max(box1.minX, box2.minX);
  const minY = Math.max(box1.minY, box2.minY);
  const maxX = Math.min(box1.maxX, box2.maxX);
  const maxY = Math.min(box1.maxY, box2.maxY);
  return createBBox(minX, minY, maxX - minX, maxY - minY);
}

export function mergeBBox(box1: BBox, box2: BBox): BBox {
  const minX = Math.min(box1.minX, box2.minX);
  const minY = Math.min(box1.minY, box2.minY);
  const maxX = Math.max(box1.maxX, box2.maxX);
  const maxY = Math.max(box1.maxY, box2.maxY);
  return createBBox(minX, minY, maxX - minX, maxY - minY);
}

export function getBBoxWithClip(element: IElement): BBox {
  const clipShape = element.getClip();
  const clipBBox = clipShape && clipShape.getBBox();
  let bbox;
  if (!element.isGroup()) {
    // 如果是普通的图形
    bbox = element.getBBox();
  } else {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    const children = (element as IGroup).getChildren();
    if (children.length > 0) {
      each(children, (child: IElement) => {
        if (child.get('visible')) {
          // 如果分组没有子元素，则直接跳过
          if (child.isGroup() && child.get('children').length === 0) {
            return true;
          }
          const box = getBBoxWithClip(child);
          // 计算 4 个顶点
          const leftTop = child.applyToMatrix([box.minX, box.minY, 1]);
          const leftBottom = child.applyToMatrix([box.minX, box.maxY, 1]);
          const rightTop = child.applyToMatrix([box.maxX, box.minY, 1]);
          const rightBottom = child.applyToMatrix([box.maxX, box.maxY, 1]);
          // 从中取最小的范围
          const boxMinX = Math.min(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0]);
          const boxMaxX = Math.max(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0]);
          const boxMinY = Math.min(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1]);
          const boxMaxY = Math.max(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1]);

          if (boxMinX < minX) {
            minX = boxMinX;
          }

          if (boxMaxX > maxX) {
            maxX = boxMaxX;
          }

          if (boxMinY < minY) {
            minY = boxMinY;
          }

          if (boxMaxY > maxY) {
            maxY = boxMaxY;
          }
        }
      });
    } else {
      minX = 0;
      maxX = 0;
      minY = 0;
      maxY = 0;
    }
    bbox = createBBox(minX, minY, maxX - minX, maxY - minY);
  }
  if (clipBBox) {
    return intersectBBox(bbox, clipBBox);
  } else {
    return bbox;
  }
}

export function updateClip(element: IElement, newElement: IElement) {
  if (!element.getClip() && !newElement.getClip()) {
    // 两者都没有 clip
    return;
  }
  const newClipShape = newElement.getClip();
  if (!newClipShape) {
    // 新的 element 没有 clip
    element.setClip(null); // 移除 clip
    return;
  }
  const clipCfg = {
    type: newClipShape.get('type'),
    attrs: newClipShape.attr(),
  };
  element.setClip(clipCfg);
}

export function toPx(number) {
  return `${number}px`;
}

export function getTextPoint(start: Point, end: Point, position: string, offset: number): Point {
  const lineLength = distance(start, end);
  const offsetPercent = offset / lineLength; // 计算间距同线的比例，用于计算最终的位置
  let percent = 0;
  if (position === 'start') {
    percent = 0 - offsetPercent;
  } else if (position === 'end') {
    percent = 1 + offsetPercent;
  }
  return {
    x: getValueByPercent(start.x, end.x, percent),
    y: getValueByPercent(start.y, end.y, percent),
  };
}
