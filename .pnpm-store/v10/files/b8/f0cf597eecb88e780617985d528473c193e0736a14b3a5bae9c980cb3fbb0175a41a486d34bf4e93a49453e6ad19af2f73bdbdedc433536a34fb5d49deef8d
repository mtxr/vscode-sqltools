import { distance } from './util';
var EPSILON = 0.0001;
/**
 * 使用牛顿切割法求最近的点
 * @param {number[]} xArr      点的 x 数组
 * @param {number[]} yArr      点的 y 数组
 * @param {number}   x         指定的点 x
 * @param {number}   y         指定的点 y
 * @param {Function} tCallback 差值函数
 */
export function nearestPoint(xArr, yArr, x, y, tCallback, length) {
    var t;
    var d = Infinity;
    var v0 = [x, y];
    var segNum = 20;
    if (length && length > 200) {
        segNum = length / 10;
    }
    var increaseRate = 1 / segNum;
    var interval = increaseRate / 10;
    for (var i = 0; i <= segNum; i++) {
        var _t = i * increaseRate;
        var v1 = [tCallback.apply(null, xArr.concat([_t])), tCallback.apply(null, yArr.concat([_t]))];
        var d1 = distance(v0[0], v0[1], v1[0], v1[1]);
        if (d1 < d) {
            t = _t;
            d = d1;
        }
    }
    // 提前终止
    if (t === 0) {
        return {
            x: xArr[0],
            y: yArr[0],
        };
    }
    if (t === 1) {
        var count = xArr.length;
        return {
            x: xArr[count - 1],
            y: yArr[count - 1],
        };
    }
    d = Infinity;
    for (var i = 0; i < 32; i++) {
        if (interval < EPSILON) {
            break;
        }
        var prev = t - interval;
        var next = t + interval;
        var v1 = [tCallback.apply(null, xArr.concat([prev])), tCallback.apply(null, yArr.concat([prev]))];
        var d1 = distance(v0[0], v0[1], v1[0], v1[1]);
        if (prev >= 0 && d1 < d) {
            t = prev;
            d = d1;
        }
        else {
            var v2 = [tCallback.apply(null, xArr.concat([next])), tCallback.apply(null, yArr.concat([next]))];
            var d2 = distance(v0[0], v0[1], v2[0], v2[1]);
            if (next <= 1 && d2 < d) {
                t = next;
                d = d2;
            }
            else {
                interval *= 0.5;
            }
        }
    }
    return {
        x: tCallback.apply(null, xArr.concat([t])),
        y: tCallback.apply(null, yArr.concat([t])),
    };
}
// 近似求解 https://community.khronos.org/t/3d-cubic-bezier-segment-length/62363/2
export function snapLength(xArr, yArr) {
    var totalLength = 0;
    var count = xArr.length;
    for (var i = 0; i < count; i++) {
        var x = xArr[i];
        var y = yArr[i];
        var nextX = xArr[(i + 1) % count];
        var nextY = yArr[(i + 1) % count];
        totalLength += distance(x, y, nextX, nextY);
    }
    return totalLength / 2;
}
//# sourceMappingURL=bezier.js.map