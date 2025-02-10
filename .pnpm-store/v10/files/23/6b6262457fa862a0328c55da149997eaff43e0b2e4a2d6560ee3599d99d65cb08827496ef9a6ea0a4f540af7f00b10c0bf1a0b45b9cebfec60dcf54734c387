"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPolarPath = exports.convertNormalPath = exports.getSplinePath = exports.getLinePath = exports.catmullRom2bezier = exports.smoothBezier = void 0;
var tslib_1 = require("tslib");
var matrix_util_1 = require("@antv/matrix-util");
var util_1 = require("@antv/util");
var coordinate_1 = require("../../../util/coordinate");
function _points2path(points, isInCircle) {
    var path = [];
    if (points.length) {
        path.push(['M', points[0].x, points[0].y]);
        for (var i = 1, length_1 = points.length; i < length_1; i += 1) {
            var item = points[i];
            path.push(['L', item.x, item.y]);
        }
        if (isInCircle) {
            path.push(['Z']);
        }
    }
    return path;
}
function _convertArr(arr, coord) {
    var tmp = [arr[0]];
    for (var i = 1, len = arr.length; i < len; i = i + 2) {
        var point = coord.convert({
            x: arr[i],
            y: arr[i + 1],
        });
        tmp.push(point.x, point.y);
    }
    return tmp;
}
function _convertArcPath(path, coord) {
    var isTransposed = coord.isTransposed;
    var r = path[1];
    var x = path[6];
    var y = path[7];
    var point = coord.convert({ x: x, y: y });
    var direction = isTransposed ? 0 : 1;
    return ['A', r, r, 0, 0, direction, point.x, point.y];
}
function _convertPolarPath(pre, cur, coord) {
    var isTransposed = coord.isTransposed, startAngle = coord.startAngle, endAngle = coord.endAngle;
    var prePoint = pre[0].toLowerCase() === 'a'
        ? {
            x: pre[6],
            y: pre[7],
        }
        : {
            x: pre[1],
            y: pre[2],
        };
    var curPoint = {
        x: cur[1],
        y: cur[2],
    };
    var rst = [];
    var xDim = isTransposed ? 'y' : 'x';
    var angleRange = Math.abs(curPoint[xDim] - prePoint[xDim]) * (endAngle - startAngle);
    var direction = curPoint[xDim] >= prePoint[xDim] ? 1 : 0; // 圆弧的方向
    var flag = angleRange > Math.PI ? 1 : 0; // 大弧还是小弧标志位
    var convertPoint = coord.convert(curPoint);
    var r = (0, coordinate_1.getDistanceToCenter)(coord, convertPoint);
    if (r >= 0.5) {
        // 小于1像素的圆在图像上无法识别
        if (angleRange === Math.PI * 2) {
            var middlePoint = {
                x: (curPoint.x + prePoint.x) / 2,
                y: (curPoint.y + prePoint.y) / 2,
            };
            var middleConvertPoint = coord.convert(middlePoint);
            rst.push(['A', r, r, 0, flag, direction, middleConvertPoint.x, middleConvertPoint.y]);
            rst.push(['A', r, r, 0, flag, direction, convertPoint.x, convertPoint.y]);
        }
        else {
            rst.push(['A', r, r, 0, flag, direction, convertPoint.x, convertPoint.y]);
        }
    }
    return rst;
}
// 当存在整体的圆时，去除圆前面和后面的线，防止出现直线穿过整个圆的情形
function _filterFullCirleLine(path) {
    (0, util_1.each)(path, function (subPath, index) {
        var cur = subPath;
        if (cur[0].toLowerCase() === 'a') {
            var pre = path[index - 1];
            var next = path[index + 1];
            if (next && next[0].toLowerCase() === 'a') {
                if (pre && pre[0].toLowerCase() === 'l') {
                    pre[0] = 'M';
                }
            }
            else if (pre && pre[0].toLowerCase() === 'a') {
                if (next && next[0].toLowerCase() === 'l') {
                    next[0] = 'M';
                }
            }
        }
    });
}
/**
 * @ignore
 * 计算光滑的贝塞尔曲线
 */
var smoothBezier = function (points, smooth, isLoop, constraint) {
    var _a;
    var cps = [];
    var hasConstraint = !!constraint;
    var prevPoint;
    var nextPoint;
    var min;
    var max;
    var nextCp0;
    var cp1;
    var cp0;
    if (hasConstraint) {
        _a = tslib_1.__read(constraint, 2), min = _a[0], max = _a[1];
        for (var i = 0, l = points.length; i < l; i++) {
            var point = points[i];
            min = matrix_util_1.vec2.min([0, 0], min, point);
            max = matrix_util_1.vec2.max([0, 0], max, point);
        }
    }
    for (var i = 0, len = points.length; i < len; i++) {
        var point = points[i];
        if (i === 0 && !isLoop) {
            cp0 = point;
        }
        else if (i === len - 1 && !isLoop) {
            cp1 = point;
            cps.push(cp0);
            cps.push(cp1);
        }
        else {
            prevPoint = points[isLoop ? (i ? i - 1 : len - 1) : i - 1];
            nextPoint = points[isLoop ? (i + 1) % len : i + 1];
            var v = [0, 0];
            v = matrix_util_1.vec2.sub(v, nextPoint, prevPoint);
            v = matrix_util_1.vec2.scale(v, v, smooth);
            var d0 = matrix_util_1.vec2.distance(point, prevPoint);
            var d1 = matrix_util_1.vec2.distance(point, nextPoint);
            var sum = d0 + d1;
            if (sum !== 0) {
                d0 /= sum;
                d1 /= sum;
            }
            var v1 = matrix_util_1.vec2.scale([0, 0], v, -d0);
            var v2 = matrix_util_1.vec2.scale([0, 0], v, d1);
            cp1 = matrix_util_1.vec2.add([0, 0], point, v1);
            nextCp0 = matrix_util_1.vec2.add([0, 0], point, v2);
            // 下一个控制点必须在这个点和下一个点之间
            nextCp0 = matrix_util_1.vec2.min([0, 0], nextCp0, matrix_util_1.vec2.max([0, 0], nextPoint, point));
            nextCp0 = matrix_util_1.vec2.max([0, 0], nextCp0, matrix_util_1.vec2.min([0, 0], nextPoint, point));
            // 重新计算 cp1 的值
            v1 = matrix_util_1.vec2.sub([0, 0], nextCp0, point);
            v1 = matrix_util_1.vec2.scale([0, 0], v1, -d0 / d1);
            cp1 = matrix_util_1.vec2.add([0, 0], point, v1);
            // 上一个控制点必须要在上一个点和这一个点之间
            cp1 = matrix_util_1.vec2.min([0, 0], cp1, matrix_util_1.vec2.max([0, 0], prevPoint, point));
            cp1 = matrix_util_1.vec2.max([0, 0], cp1, matrix_util_1.vec2.min([0, 0], prevPoint, point));
            // 重新计算 nextCp0 的值
            v2 = matrix_util_1.vec2.sub([0, 0], point, cp1);
            v2 = matrix_util_1.vec2.scale([0, 0], v2, d1 / d0);
            nextCp0 = matrix_util_1.vec2.add([0, 0], point, v2);
            if (hasConstraint) {
                cp1 = matrix_util_1.vec2.max([0, 0], cp1, min);
                cp1 = matrix_util_1.vec2.min([0, 0], cp1, max);
                nextCp0 = matrix_util_1.vec2.max([0, 0], nextCp0, min);
                nextCp0 = matrix_util_1.vec2.min([0, 0], nextCp0, max);
            }
            cps.push(cp0);
            cps.push(cp1);
            cp0 = nextCp0;
        }
    }
    if (isLoop) {
        cps.push(cps.shift());
    }
    return cps;
};
exports.smoothBezier = smoothBezier;
/**
 * @ignore
 * 贝塞尔曲线
 */
function catmullRom2bezier(crp, z, constraint) {
    var isLoop = !!z;
    var pointList = [];
    for (var i = 0, l = crp.length; i < l; i += 2) {
        pointList.push([crp[i], crp[i + 1]]);
    }
    var controlPointList = (0, exports.smoothBezier)(pointList, 0.4, isLoop, constraint);
    var len = pointList.length;
    var d1 = [];
    var cp1;
    var cp2;
    var p;
    for (var i = 0; i < len - 1; i++) {
        cp1 = controlPointList[i * 2];
        cp2 = controlPointList[i * 2 + 1];
        p = pointList[i + 1];
        d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]]);
    }
    if (isLoop) {
        cp1 = controlPointList[len];
        cp2 = controlPointList[len + 1];
        p = pointList[0];
        d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]]);
    }
    return d1;
}
exports.catmullRom2bezier = catmullRom2bezier;
/**
 * @ignore
 * 将点连接成路径 path
 */
function getLinePath(points, isInCircle) {
    return _points2path(points, isInCircle);
}
exports.getLinePath = getLinePath;
/**
 * @ignore
 * 根据关键点获取限定了范围的平滑线
 */
function getSplinePath(points, isInCircle, constaint) {
    var data = [];
    var first = points[0];
    var prePoint = null;
    if (points.length <= 2) {
        // 两点以内直接绘制成路径
        return getLinePath(points, isInCircle);
    }
    for (var i = 0, len = points.length; i < len; i++) {
        var point = points[i];
        if (!prePoint || !(prePoint.x === point.x && prePoint.y === point.y)) {
            data.push(point.x);
            data.push(point.y);
            prePoint = point;
        }
    }
    var constraint = constaint || [
        // 范围
        [0, 0],
        [1, 1],
    ];
    var splinePath = catmullRom2bezier(data, isInCircle, constraint);
    splinePath.unshift(['M', first.x, first.y]);
    return splinePath;
}
exports.getSplinePath = getSplinePath;
/**
 * @ignore
 * 将归一化后的路径数据转换成坐标
 */
function convertNormalPath(coord, path) {
    var tmp = [];
    (0, util_1.each)(path, function (subPath) {
        var action = subPath[0];
        switch (action.toLowerCase()) {
            case 'm':
            case 'l':
            case 'c':
                tmp.push(_convertArr(subPath, coord));
                break;
            case 'a':
                tmp.push(_convertArcPath(subPath, coord));
                break;
            case 'z':
            default:
                tmp.push(subPath);
                break;
        }
    });
    return tmp;
}
exports.convertNormalPath = convertNormalPath;
/**
 * @ignore
 * 将路径转换为极坐标下的真实路径
 */
function convertPolarPath(coord, path) {
    var tmp = [];
    var pre;
    var cur;
    var transposed;
    var equals;
    (0, util_1.each)(path, function (subPath, index) {
        var action = subPath[0];
        switch (action.toLowerCase()) {
            case 'm':
            case 'c':
            case 'q':
                tmp.push(_convertArr(subPath, coord));
                break;
            case 'l':
                pre = path[index - 1];
                cur = subPath;
                transposed = coord.isTransposed;
                // 是否半径相同，转换成圆弧
                equals = transposed ? pre[pre.length - 2] === cur[1] : pre[pre.length - 1] === cur[2];
                if (equals) {
                    tmp = tmp.concat(_convertPolarPath(pre, cur, coord));
                }
                else {
                    // y 不相等，所以直接转换
                    tmp.push(_convertArr(subPath, coord));
                }
                break;
            case 'a':
                tmp.push(_convertArcPath(subPath, coord));
                break;
            case 'z':
            default:
                tmp.push(subPath);
                break;
        }
    });
    _filterFullCirleLine(tmp); // 过滤多余的直线
    return tmp;
}
exports.convertPolarPath = convertPolarPath;
//# sourceMappingURL=path.js.map