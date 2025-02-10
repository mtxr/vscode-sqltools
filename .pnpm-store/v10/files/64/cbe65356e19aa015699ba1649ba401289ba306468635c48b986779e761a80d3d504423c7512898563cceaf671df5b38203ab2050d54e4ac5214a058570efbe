import { SimpleBBox } from '../types';
import { IShape } from '../interfaces';

export default function (shape: IShape): SimpleBBox {
  const attrs = shape.attr();
  const { x, y, rx, ry } = attrs;
  return {
    x: x - rx,
    y: y - ry,
    width: rx * 2,
    height: ry * 2,
  };
}
