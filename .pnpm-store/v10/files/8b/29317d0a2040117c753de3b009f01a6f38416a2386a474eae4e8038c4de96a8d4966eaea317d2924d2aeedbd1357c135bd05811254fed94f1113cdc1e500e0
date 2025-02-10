import { pointAtSegments, angleAtSegments, distanceAtSegment } from './segments';
function getPoints(x, y, width, height) {
    return [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height],
        [x, y],
    ];
}
export default {
    /**
     * 矩形包围盒计算
     * @param {number} x      起始点 x
     * @param {number} y      起始点 y
     * @param {number} width  宽度
     * @param {number} height 高度
     * @return {object} 包围盒
     */
    box: function (x, y, width, height) {
        return {
            x: x,
            y: y,
            width: width,
            height: height,
        };
    },
    /**
     * 长度，矩形不需要传入 x, y 即可计算周长，但是避免出错
     * @param {number} x      起始点 x
     * @param {number} y      起始点 y
     * @param {number} width  宽
     * @param {number} height 高
     */
    length: function (x, y, width, height) {
        return (width + height) * 2;
    },
    /**
     * 点到矩形的最小距离
     * @param {number} x      起始点 x
     * @param {number} y      起始点 y
     * @param {number} width  宽度
     * @param {number} height 高度
     * @param {number} x0     指定点的 x
     * @param {number} y0     指定点的 y
     * @return {number} 最短距离
     */
    pointDistance: function (x, y, width, height, x0, y0) {
        var points = getPoints(x, y, width, height);
        return distanceAtSegment(points, x0, y0);
    },
    /**
     * 按照比例计算对应的点
     * @param {number} x      起始点 x
     * @param {number} y      起始点 y
     * @param {number} width  宽度
     * @param {number} height 高度
     * @param {number} t 比例 0-1 之间的值
     * @return {object} 计算出来的点信息，包含 x,y
     */
    pointAt: function (x, y, width, height, t) {
        // 边界判断，避免获取顶点
        if (t > 1 || t < 0) {
            return null;
        }
        var points = getPoints(x, y, width, height);
        return pointAtSegments(points, t);
    },
    /**
     * 获取对应点的切线角度
     * @param {number} x      起始点 x
     * @param {number} y      起始点 y
     * @param {number} width  宽度
     * @param {number} height 高度
     * @param {number} t 比例 0-1 之间的值
     * @return {number} 切线的角度
     */
    tangentAngle: function (x, y, width, height, t) {
        // 边界判断，避免获取顶点
        if (t > 1 || t < 0) {
            return 0;
        }
        var points = getPoints(x, y, width, height);
        return angleAtSegments(points, t);
    },
};
//# sourceMappingURL=rect.js.map