import { BBox } from '../types';
export function createBBox(x: number, y: number, width: number, height: number): BBox {
  return {
    x,
    y,
    width,
    height,
    minX: x,
    minY: y,
    maxX: x + width,
    maxY: y + height,
  };
}

export function intersectBBox(box1: Partial<BBox>, box2: Partial<BBox>): BBox {
  const minX = Math.max(box1.minX, box2.minX);
  const minY = Math.max(box1.minY, box2.minY);
  const maxX = Math.min(box1.maxX, box2.maxX);
  const maxY = Math.min(box1.maxY, box2.maxY);
  return createBBox(minX, minY, maxX - minX, maxY - minY);
}
