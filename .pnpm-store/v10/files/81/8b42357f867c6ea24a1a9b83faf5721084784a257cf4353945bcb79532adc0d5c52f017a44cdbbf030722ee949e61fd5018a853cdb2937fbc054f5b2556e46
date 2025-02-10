import { Line as LineUtil } from '@antv/g-math';
export default function inLine(x1, y1, x2, y2, lineWidth, x, y) {
    var minX = Math.min(x1, x2);
    var maxX = Math.max(x1, x2);
    var minY = Math.min(y1, y2);
    var maxY = Math.max(y1, y2);
    var halfWidth = lineWidth / 2;
    // 因为目前的方案是计算点到直线的距离，而有可能会在延长线上，所以要先判断是否在包围盒内
    // 这种方案会在水平或者竖直的情况下载线的延长线上有半 lineWidth 的误差
    if (!(x >= minX - halfWidth && x <= maxX + halfWidth && y >= minY - halfWidth && y <= maxY + halfWidth)) {
        return false;
    }
    // 因为已经计算了包围盒，所以仅需要计算到直线的距离即可，可以显著提升性能
    return LineUtil.pointToLine(x1, y1, x2, y2, x, y) <= lineWidth / 2;
}
//# sourceMappingURL=line.js.map