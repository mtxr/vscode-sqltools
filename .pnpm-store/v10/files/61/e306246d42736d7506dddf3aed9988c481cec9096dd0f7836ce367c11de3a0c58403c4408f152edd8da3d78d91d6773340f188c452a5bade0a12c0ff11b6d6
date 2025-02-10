import { arcToCubic } from './arc-2-cubic';
import { quadToCubic } from './quad-2-cubic';
import { lineToCubic } from './line-2-cubic';
import type { PathCommand, ProcessParams } from '../types';

export function segmentToCubic(segment: PathCommand, params: ProcessParams): PathCommand {
  if ('TQ'.indexOf(segment[0]) < 0) {
    params.qx = null;
    params.qy = null;
  }

  const [s1, s2] = segment.slice(1);

  switch (segment[0]) {
    case 'M':
      params.x = s1 as number;
      params.y = s2 as number;
      return segment;
    case 'A':
      return ['C'].concat(arcToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1) as number[]))) as PathCommand;
    case 'Q':
      params.qx = s1 as number;
      params.qy = s2 as number;
      return ['C'].concat(quadToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1) as number[]))) as PathCommand;
    case 'L':
      // @ts-ignore
      return ['C'].concat(lineToCubic(params.x1, params.y1, segment[1], segment[2])) as PathCommand;
    case 'H':
      // @ts-ignore
      return ['C'].concat(lineToCubic(params.x1, params.y1, segment[1], params.y1)) as PathCommand;
    case 'V':
      // @ts-ignore
      return ['C'].concat(lineToCubic(params.x1, params.y1, params.x1, segment[1])) as PathCommand;
    case 'Z':
      // @ts-ignore
      return ['C'].concat(lineToCubic(params.x1, params.y1, params.x, params.y)) as PathCommand;
    default:
  }
  return segment;
}