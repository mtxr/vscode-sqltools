import line from './line';
import { distance, isNumberEqual, getBBoxByArray, piMod } from './util';
import { nearestPoint } from './bezier';
// 差值公式
function quadraticAt(p0, p1, p2, t) {
    var onet = 1 - t;
    return onet * onet * p0 + 2 * t * onet * p1 + t * t * p2;
}
// 求极值
function extrema(p0, p1, p2) {
    var a = p0 + p2 - 2 * p1;
    if (isNumberEqual(a, 0)) {
        return [0.5];
    }
    var rst = (p0 - p1) / a;
    if (rst <= 1 && rst >= 0) {
        return [rst];
    }
    return [];
}
function derivativeAt(p0, p1, p2, t) {
    return 2 * (1 - t) * (p1 - p0) + 2 * t * (p2 - p1);
}
// 分割贝塞尔曲线
function divideQuadratic(x1, y1, x2, y2, x3, y3, t) {
    // 划分点
    var xt = quadraticAt(x1, x2, x3, t);
    var yt = quadraticAt(y1, y2, y3, t);
    // 分割的第一条曲线的控制点
    var controlPoint1 = line.pointAt(x1, y1, x2, y2, t);
    // 分割的第二条曲线的控制点
    var controlPoint2 = line.pointAt(x2, y2, x3, y3, t);
    return [
        [x1, y1, controlPoint1.x, controlPoint1.y, xt, yt],
        [xt, yt, controlPoint2.x, controlPoint2.y, x3, y3],
    ];
}
// 使用迭代法取贝塞尔曲线的长度
function quadraticLength(x1, y1, x2, y2, x3, y3, iterationCount) {
    if (iterationCount === 0) {
        return (distance(x1, y1, x2, y2) + distance(x2, y2, x3, y3) + distance(x1, y1, x3, y3)) / 2;
    }
    var quadratics = divideQuadratic(x1, y1, x2, y2, x3, y3, 0.5);
    var left = quadratics[0];
    var right = quadratics[1];
    left.push(iterationCount - 1);
    right.push(iterationCount - 1);
    return quadraticLength.apply(null, left) + quadraticLength.apply(null, right);
}
export default {
    box: function (x1, y1, x2, y2, x3, y3) {
        var xExtrema = extrema(x1, x2, x3)[0];
        var yExtrema = extrema(y1, y2, y3)[0];
        // 控制点不加入 box 的计算
        var xArr = [x1, x3];
        var yArr = [y1, y3];
        if (xExtrema !== undefined) {
            xArr.push(quadraticAt(x1, x2, x3, xExtrema));
        }
        if (yExtrema !== undefined) {
            yArr.push(quadraticAt(y1, y2, y3, yExtrema));
        }
        return getBBoxByArray(xArr, yArr);
    },
    length: function (x1, y1, x2, y2, x3, y3) {
        return quadraticLength(x1, y1, x2, y2, x3, y3, 3);
    },
    nearestPoint: function (x1, y1, x2, y2, x3, y3, x0, y0) {
        return nearestPoint([x1, x2, x3], [y1, y2, y3], x0, y0, quadraticAt);
    },
    pointDistance: function (x1, y1, x2, y2, x3, y3, x0, y0) {
        var point = this.nearestPoint(x1, y1, x2, y2, x3, y3, x0, y0);
        return distance(point.x, point.y, x0, y0);
    },
    interpolationAt: quadraticAt,
    pointAt: function (x1, y1, x2, y2, x3, y3, t) {
        return {
            x: quadraticAt(x1, x2, x3, t),
            y: quadraticAt(y1, y2, y3, t),
        };
    },
    divide: function (x1, y1, x2, y2, x3, y3, t) {
        return divideQuadratic(x1, y1, x2, y2, x3, y3, t);
    },
    tangentAngle: function (x1, y1, x2, y2, x3, y3, t) {
        var dx = derivativeAt(x1, x2, x3, t);
        var dy = derivativeAt(y1, y2, y3, t);
        var angle = Math.atan2(dy, dx);
        return piMod(angle);
    },
};
//# sourceMappingURL=quadratic.js.map