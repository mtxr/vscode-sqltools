"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linePathToAreaPath = exports.getAreaLineY = exports.dataToPath = exports.getSmoothLinePath = exports.getLinePath = void 0;
var tslib_1 = require("tslib");
var path_util_1 = require("@antv/path-util");
var scale_1 = require("@antv/scale");
var util_1 = require("@antv/util");
/**
 * 点数组转 path
 * @param points
 */
function pointsToPath(points) {
    return util_1.map(points, function (p, idx) {
        var command = idx === 0 ? 'M' : 'L';
        var x = p[0], y = p[1];
        return [command, x, y];
    });
}
/**
 * 将点连接成路径 path
 * @param points
 */
function getLinePath(points) {
    return pointsToPath(points);
}
exports.getLinePath = getLinePath;
/**
 * 将点连成平滑的曲线
 * @param points
 */
function getSmoothLinePath(points) {
    if (points.length <= 2) {
        // 两点以内直接绘制成路径
        return getLinePath(points);
    }
    var data = [];
    util_1.each(points, function (p) {
        // 当前点和上一个点一样的时候，忽略掉
        if (!util_1.isEqual(p, data.slice(data.length - 2))) {
            data.push(p[0], p[1]);
        }
    });
    // const constraint = [ // 范围
    //   [ 0, 0 ],
    //   [ 1, 1 ],
    // ];
    var path = path_util_1.catmullRom2Bezier(data, false);
    var _a = util_1.head(points), x = _a[0], y = _a[1];
    path.unshift(['M', x, y]);
    return path;
}
exports.getSmoothLinePath = getSmoothLinePath;
/**
 * 将数据转成 path，利用 scale 的归一化能力
 * @param data
 * @param width
 * @param height
 * @param smooth
 */
function dataToPath(data, width, height, smooth) {
    if (smooth === void 0) { smooth = true; }
    // 利用 scale 来获取 y 上的映射
    var y = new scale_1.Linear({
        values: data,
    });
    var x = new scale_1.Category({
        values: util_1.map(data, function (v, idx) { return idx; }),
    });
    var points = util_1.map(data, function (v, idx) {
        return [x.scale(idx) * width, height - y.scale(v) * height];
    });
    return smooth ? getSmoothLinePath(points) : getLinePath(points);
}
exports.dataToPath = dataToPath;
/**
 * 获得 area 面积的横向连接线的 px 位置
 * @param data
 * @param width
 * @param height
 */
function getAreaLineY(data, height) {
    var y = new scale_1.Linear({
        values: data,
    });
    // 当曲线全部为负数时，取最大值，当曲线全部为正数时，取最小值，当曲线有正有负，则取零点
    var lineY = y.max < 0 ? y.max : Math.max(0, y.min);
    return height - y.scale(lineY) * height;
}
exports.getAreaLineY = getAreaLineY;
/**
 * 线 path 转 area path
 * @param path
 * @param width
 * @param height
 */
function linePathToAreaPath(path, width, height, data) {
    var areaPath = tslib_1.__spreadArrays(path);
    var lineYPx = getAreaLineY(data, height);
    areaPath.push(['L', width, lineYPx]);
    areaPath.push(['L', 0, lineYPx]);
    areaPath.push(['Z']);
    return areaPath;
}
exports.linePathToAreaPath = linePathToAreaPath;
//# sourceMappingURL=path.js.map