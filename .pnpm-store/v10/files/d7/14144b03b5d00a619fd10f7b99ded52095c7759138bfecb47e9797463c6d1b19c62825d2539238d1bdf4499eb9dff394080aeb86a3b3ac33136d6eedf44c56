import { inBox } from '../util';

export default function inRect(minX, minY, width, height, lineWidth, x, y) {
  const halfWidth = lineWidth / 2;
  // 将四个边看做矩形来检测，比边的检测算法要快
  return (
    inBox(minX - halfWidth, minY - halfWidth, width, lineWidth, x, y) || // 上边
    inBox(minX + width - halfWidth, minY - halfWidth, lineWidth, height, x, y) || // 右边
    inBox(minX + halfWidth, minY + height - halfWidth, width, lineWidth, x, y) || // 下边
    inBox(minX - halfWidth, minY + halfWidth, lineWidth, height, x, y)
  ); // 左边
}
