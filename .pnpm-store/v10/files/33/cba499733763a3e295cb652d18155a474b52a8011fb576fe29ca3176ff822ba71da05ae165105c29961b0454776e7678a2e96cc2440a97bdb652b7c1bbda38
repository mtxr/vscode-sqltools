import { __spreadArrays } from "tslib";
import { catmullRom2Bezier } from '@antv/path-util';
import { Category, Linear } from '@antv/scale';
import { each, head, isEqual, map } from '@antv/util';
/**
 * 点数组转 path
 * @param points
 */
function pointsToPath(points) {
    return map(points, function (p, idx) {
        var command = idx === 0 ? 'M' : 'L';
        var x = p[0], y = p[1];
        return [command, x, y];
    });
}
/**
 * 将点连接成路径 path
 * @param points
 */
export function getLinePath(points) {
    return pointsToPath(points);
}
/**
 * 将点连成平滑的曲线
 * @param points
 */
export function getSmoothLinePath(points) {
    if (points.length <= 2) {
        // 两点以内直接绘制成路径
        return getLinePath(points);
    }
    var data = [];
    each(points, function (p) {
        // 当前点和上一个点一样的时候，忽略掉
        if (!isEqual(p, data.slice(data.length - 2))) {
            data.push(p[0], p[1]);
        }
    });
    // const constraint = [ // 范围
    //   [ 0, 0 ],
    //   [ 1, 1 ],
    // ];
    var path = catmullRom2Bezier(data, false);
    var _a = head(points), x = _a[0], y = _a[1];
    path.unshift(['M', x, y]);
    return path;
}
/**
 * 将数据转成 path，利用 scale 的归一化能力
 * @param data
 * @param width
 * @param height
 * @param smooth
 */
export function dataToPath(data, width, height, smooth) {
    if (smooth === void 0) { smooth = true; }
    // 利用 scale 来获取 y 上的映射
    var y = new Linear({
        values: data,
    });
    var x = new Category({
        values: map(data, function (v, idx) { return idx; }),
    });
    var points = map(data, function (v, idx) {
        return [x.scale(idx) * width, height - y.scale(v) * height];
    });
    return smooth ? getSmoothLinePath(points) : getLinePath(points);
}
/**
 * 获得 area 面积的横向连接线的 px 位置
 * @param data
 * @param width
 * @param height
 */
export function getAreaLineY(data, height) {
    var y = new Linear({
        values: data,
    });
    // 当曲线全部为负数时，取最大值，当曲线全部为正数时，取最小值，当曲线有正有负，则取零点
    var lineY = y.max < 0 ? y.max : Math.max(0, y.min);
    return height - y.scale(lineY) * height;
}
/**
 * 线 path 转 area path
 * @param path
 * @param width
 * @param height
 */
export function linePathToAreaPath(path, width, height, data) {
    var areaPath = __spreadArrays(path);
    var lineYPx = getAreaLineY(data, height);
    areaPath.push(['L', width, lineYPx]);
    areaPath.push(['L', 0, lineYPx]);
    areaPath.push(['Z']);
    return areaPath;
}
//# sourceMappingURL=path.js.map