import path2Absolute from './path-2-absolute';
import { segmentToCubic } from './process/segment-2-cubic';
import type { PathCommand, ProcessParams } from './types';

export default function pathToCurve(path: PathCommand[] | string, needZCommandIndexes = false) {
  const pathArray = path2Absolute(path as string) as PathCommand[];

  const params: ProcessParams = {
    x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null,
  };
  const allPathCommands = [];
  let pathCommand = '';
  let ii = pathArray.length;
  let segment: PathCommand;
  let seglen: number;
  let zCommandIndexes: number[] = [];

  for (let i = 0; i < ii; i += 1) {
    if (pathArray[i]) [pathCommand] = pathArray[i];

    allPathCommands[i] = pathCommand;
    pathArray[i] = segmentToCubic(pathArray[i], params);

    fixArc(pathArray, allPathCommands, i);
    ii = pathArray.length; // solves curveArrays ending in Z

    // keep Z command account for lineJoin
    // @see https://github.com/antvis/util/issues/68
    if (pathCommand === 'Z') {
      zCommandIndexes.push(i);
    }

    segment = pathArray[i];
    seglen = segment.length;

    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +(segment[seglen - 4]) || params.x1;
    params.y2 = +(segment[seglen - 3]) || params.y1;
  }
  if (needZCommandIndexes) {
    return [pathArray, zCommandIndexes];
  } else {
    return pathArray;
  }
}

function fixArc(pathArray: PathCommand[], allPathCommands: string[], i: number) {
  if (pathArray[i].length > 7) {
    pathArray[i].shift();
    const pi = pathArray[i];
    // const ni = i + 1;
    let ni = i;
    while (pi.length) {
      // if created multiple C:s, their original seg is saved
      allPathCommands[i] = 'A';
      // @ts-ignore
      pathArray.splice(ni += 1, 0, ['C'].concat(pi.splice(0, 6)));
    }
    pathArray.splice(i, 1);
  }
}