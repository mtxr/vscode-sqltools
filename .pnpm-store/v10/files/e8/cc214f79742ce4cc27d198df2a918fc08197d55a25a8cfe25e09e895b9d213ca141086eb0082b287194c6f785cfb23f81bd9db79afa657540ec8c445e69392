import { Util } from '@antv/g-math';
import { SimpleBBox } from '../types';
import { IShape } from '../interfaces';

export default function (shape: IShape): SimpleBBox {
  const attrs = shape.attr();
  const { points } = attrs;
  const xArr = [];
  const yArr = [];
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    xArr.push(point[0]);
    yArr.push(point[1]);
  }
  return Util.getBBoxByArray(xArr, yArr);
}
