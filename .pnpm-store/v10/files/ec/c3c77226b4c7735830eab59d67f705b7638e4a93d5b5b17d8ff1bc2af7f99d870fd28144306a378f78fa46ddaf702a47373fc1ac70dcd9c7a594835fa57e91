import { IShape } from '../interfaces';

// 合并包围盒
export function mergeBBox(bbox1, bbox2) {
  if (!bbox1 || !bbox2) {
    return bbox1 || bbox2;
  }
  return {
    minX: Math.min(bbox1.minX, bbox2.minX),
    minY: Math.min(bbox1.minY, bbox2.minY),
    maxX: Math.max(bbox1.maxX, bbox2.maxX),
    maxY: Math.max(bbox1.maxY, bbox2.maxY),
  };
}

// 合并箭头的包围盒
export function mergeArrowBBox(shape: IShape, bbox) {
  const startArrowShape = shape.get('startArrowShape');
  const endArrowShape = shape.get('endArrowShape');
  let startArrowBBox = null;
  let endArrowBBox = null;
  if (startArrowShape) {
    startArrowBBox = startArrowShape.getCanvasBBox();
    bbox = mergeBBox(bbox, startArrowBBox);
  }
  if (endArrowShape) {
    endArrowBBox = endArrowShape.getCanvasBBox();
    bbox = mergeBBox(bbox, endArrowBBox);
  }
  return bbox;
}
