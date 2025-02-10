import inLine from './line';

export default function inPolyline(points: any[], lineWidth: number, x: number, y: number, isClose: boolean) {
  const count = points.length;
  if (count < 2) {
    return false;
  }
  for (let i = 0; i < count - 1; i++) {
    const x1 = points[i][0];
    const y1 = points[i][1];
    const x2 = points[i + 1][0];
    const y2 = points[i + 1][1];

    if (inLine(x1, y1, x2, y2, lineWidth, x, y)) {
      return true;
    }
  }

  // 如果封闭，则计算起始点和结束点的边
  if (isClose) {
    const first = points[0];
    const last = points[count - 1];
    if (inLine(first[0], first[1], last[0], last[1], lineWidth, x, y)) {
      return true;
    }
  }

  return false;
}
