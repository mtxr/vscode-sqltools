import { SimpleBBox } from '../types';
import { IShape } from '../interfaces';

export default function (shape: IShape): SimpleBBox {
  const attrs = shape.attr();
  const { x, y, width, height } = attrs;
  return {
    x,
    y,
    width,
    height,
  };
}
