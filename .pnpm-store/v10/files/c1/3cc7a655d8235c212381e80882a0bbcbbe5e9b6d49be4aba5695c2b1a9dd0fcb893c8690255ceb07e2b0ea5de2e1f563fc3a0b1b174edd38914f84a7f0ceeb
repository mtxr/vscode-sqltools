import { distance, isNumberEqual, getBBoxByArray, piMod } from './util';
import line from './line';
import { snapLength, nearestPoint } from './bezier';
function cubicAt(p0, p1, p2, p3, t) {
    var onet = 1 - t; // t * t * t 的性能大概是 Math.pow(t, 3) 的三倍
    return onet * onet * onet * p0 + 3 * p1 * t * onet * onet + 3 * p2 * t * t * onet + p3 * t * t * t;
}
function derivativeAt(p0, p1, p2, p3, t) {
    var onet = 1 - t;
    return 3 * (onet * onet * (p1 - p0) + 2 * onet * t * (p2 - p1) + t * t * (p3 - p2));
}
function extrema(p0, p1, p2, p3) {
    var a = -3 * p0 + 9 * p1 - 9 * p2 + 3 * p3;
    var b = 6 * p0 - 12 * p1 + 6 * p2;
    var c = 3 * p1 - 3 * p0;
    var extremas = [];
    var t1;
    var t2;
    var discSqrt;
    if (isNumberEqual(a, 0)) {
        if (!isNumberEqual(b, 0)) {
            t1 = -c / b;
            if (t1 >= 0 && t1 <= 1) {
                extremas.push(t1);
            }
        }
    }
    else {
        var disc = b * b - 4 * a * c;
        if (isNumberEqual(disc, 0)) {
            extremas.push(-b / (2 * a));
        }
        else if (disc > 0) {
            discSqrt = Math.sqrt(disc);
            t1 = (-b + discSqrt) / (2 * a);
            t2 = (-b - discSqrt) / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                extremas.push(t1);
            }
            if (t2 >= 0 && t2 <= 1) {
                extremas.push(t2);
            }
        }
    }
    return extremas;
}
// 分割贝塞尔曲线
function divideCubic(x1, y1, x2, y2, x3, y3, x4, y4, t) {
    // 划分点
    var xt = cubicAt(x1, x2, x3, x4, t);
    var yt = cubicAt(y1, y2, y3, y4, t);
    // 计算两点之间的差值点
    var c1 = line.pointAt(x1, y1, x2, y2, t);
    var c2 = line.pointAt(x2, y2, x3, y3, t);
    var c3 = line.pointAt(x3, y3, x4, y4, t);
    var c12 = line.pointAt(c1.x, c1.y, c2.x, c2.y, t);
    var c23 = line.pointAt(c2.x, c2.y, c3.x, c3.y, t);
    return [
        [x1, y1, c1.x, c1.y, c12.x, c12.y, xt, yt],
        [xt, yt, c23.x, c23.y, c3.x, c3.y, x4, y4],
    ];
}
// 使用迭代法取贝塞尔曲线的长度，二阶和三阶分开写，更清晰和便于调试
function cubicLength(x1, y1, x2, y2, x3, y3, x4, y4, iterationCount) {
    if (iterationCount === 0) {
        return snapLength([x1, x2, x3, x4], [y1, y2, y3, y4]);
    }
    var cubics = divideCubic(x1, y1, x2, y2, x3, y3, x4, y4, 0.5);
    var left = cubics[0];
    var right = cubics[1];
    left.push(iterationCount - 1);
    right.push(iterationCount - 1);
    return cubicLength.apply(null, left) + cubicLength.apply(null, right);
}
export default {
    extrema: extrema,
    box: function (x1, y1, x2, y2, x3, y3, x4, y4) {
        var xArr = [x1, x4];
        var yArr = [y1, y4];
        var xExtrema = extrema(x1, x2, x3, x4);
        var yExtrema = extrema(y1, y2, y3, y4);
        for (var i = 0; i < xExtrema.length; i++) {
            xArr.push(cubicAt(x1, x2, x3, x4, xExtrema[i]));
        }
        for (var i = 0; i < yExtrema.length; i++) {
            yArr.push(cubicAt(y1, y2, y3, y4, yExtrema[i]));
        }
        return getBBoxByArray(xArr, yArr);
    },
    length: function (x1, y1, x2, y2, x3, y3, x4, y4) {
        // 迭代三次，划分成 8 段求长度
        return cubicLength(x1, y1, x2, y2, x3, y3, x4, y4, 3);
    },
    nearestPoint: function (x1, y1, x2, y2, x3, y3, x4, y4, x0, y0, length) {
        return nearestPoint([x1, x2, x3, x4], [y1, y2, y3, y4], x0, y0, cubicAt, length);
    },
    pointDistance: function (x1, y1, x2, y2, x3, y3, x4, y4, x0, y0, length) {
        var point = this.nearestPoint(x1, y1, x2, y2, x3, y3, x4, y4, x0, y0, length);
        return distance(point.x, point.y, x0, y0);
    },
    interpolationAt: cubicAt,
    pointAt: function (x1, y1, x2, y2, x3, y3, x4, y4, t) {
        return {
            x: cubicAt(x1, x2, x3, x4, t),
            y: cubicAt(y1, y2, y3, y4, t),
        };
    },
    divide: function (x1, y1, x2, y2, x3, y3, x4, y4, t) {
        return divideCubic(x1, y1, x2, y2, x3, y3, x4, y4, t);
    },
    tangentAngle: function (x1, y1, x2, y2, x3, y3, x4, y4, t) {
        var dx = derivativeAt(x1, x2, x3, x4, t);
        var dy = derivativeAt(y1, y2, y3, y4, t);
        return piMod(Math.atan2(dy, dx));
    },
};
//# sourceMappingURL=cubic.js.map