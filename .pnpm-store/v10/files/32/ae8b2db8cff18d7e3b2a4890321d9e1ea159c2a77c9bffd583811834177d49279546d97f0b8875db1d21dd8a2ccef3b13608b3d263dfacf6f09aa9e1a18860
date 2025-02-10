import { SimpleBBox } from '../types';
import { IShape } from '../interfaces';
import { mergeArrowBBox } from './util';

export default function (shape: IShape): SimpleBBox {
  const attrs = shape.attr();
  const { x1, y1, x2, y2 } = attrs;
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  let bbox = {
    minX,
    maxX,
    minY,
    maxY,
  };
  bbox = mergeArrowBBox(shape, bbox);
  return {
    x: bbox.minX,
    y: bbox.minY,
    width: bbox.maxX - bbox.minX,
    height: bbox.maxY - bbox.minY,
  };
}
