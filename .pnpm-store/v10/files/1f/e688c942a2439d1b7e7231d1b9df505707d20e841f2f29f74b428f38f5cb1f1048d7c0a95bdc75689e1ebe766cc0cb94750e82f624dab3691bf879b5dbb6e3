import { SimpleBBox } from '../types';
import { IShape } from '../interfaces';

export default function (shape: IShape): SimpleBBox {
  const { x, y, r } = shape.attr();
  return {
    x: x - r,
    y: y - r,
    width: r * 2,
    height: r * 2,
  };
}
