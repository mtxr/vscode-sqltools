import { distance, piMod } from './util';
import ellipse from './ellipse';
// 偏导数 x
function derivativeXAt(cx, cy, rx, ry, xRotation, startAngle, endAngle, angle) {
    return -1 * rx * Math.cos(xRotation) * Math.sin(angle) - ry * Math.sin(xRotation) * Math.cos(angle);
}
// 偏导数 y
function derivativeYAt(cx, cy, rx, ry, xRotation, startAngle, endAngle, angle) {
    return -1 * rx * Math.sin(xRotation) * Math.sin(angle) + ry * Math.cos(xRotation) * Math.cos(angle);
}
// x 的极值
function xExtrema(rx, ry, xRotation) {
    return Math.atan((-ry / rx) * Math.tan(xRotation));
}
// y 的极值
function yExtrema(rx, ry, xRotation) {
    return Math.atan(ry / (rx * Math.tan(xRotation)));
}
// 根据角度求 x 坐标
function xAt(cx, cy, rx, ry, xRotation, angle) {
    return rx * Math.cos(xRotation) * Math.cos(angle) - ry * Math.sin(xRotation) * Math.sin(angle) + cx;
}
// 根据角度求 y 坐标
function yAt(cx, cy, rx, ry, xRotation, angle) {
    return rx * Math.sin(xRotation) * Math.cos(angle) + ry * Math.cos(xRotation) * Math.sin(angle) + cy;
}
// 获取点在椭圆上的角度
function getAngle(rx, ry, x0, y0) {
    var angle = Math.atan2(y0 * rx, x0 * ry);
    // 转换到 0 - 2PI 内
    return (angle + Math.PI * 2) % (Math.PI * 2);
}
// 根据角度获取，x,y
function getPoint(rx, ry, angle) {
    return {
        x: rx * Math.cos(angle),
        y: ry * Math.sin(angle),
    };
}
// 旋转
function rotate(x, y, angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return [x * cos - y * sin, x * sin + y * cos];
}
export default {
    /**
     * 计算包围盒
     * @param {number} cx         圆心 x
     * @param {number} cy         圆心 y
     * @param {number} rx         x 轴方向的半径
     * @param {number} ry         y 轴方向的半径
     * @param {number} xRotation  旋转角度
     * @param {number} startAngle 起始角度
     * @param {number} endAngle   结束角度
     * @return {object} 包围盒对象
     */
    box: function (cx, cy, rx, ry, xRotation, startAngle, endAngle) {
        var xDim = xExtrema(rx, ry, xRotation);
        var minX = Infinity;
        var maxX = -Infinity;
        var xs = [startAngle, endAngle];
        for (var i = -Math.PI * 2; i <= Math.PI * 2; i += Math.PI) {
            var xAngle = xDim + i;
            if (startAngle < endAngle) {
                if (startAngle < xAngle && xAngle < endAngle) {
                    xs.push(xAngle);
                }
            }
            else {
                if (endAngle < xAngle && xAngle < startAngle) {
                    xs.push(xAngle);
                }
            }
        }
        for (var i = 0; i < xs.length; i++) {
            var x = xAt(cx, cy, rx, ry, xRotation, xs[i]);
            if (x < minX) {
                minX = x;
            }
            if (x > maxX) {
                maxX = x;
            }
        }
        var yDim = yExtrema(rx, ry, xRotation);
        var minY = Infinity;
        var maxY = -Infinity;
        var ys = [startAngle, endAngle];
        for (var i = -Math.PI * 2; i <= Math.PI * 2; i += Math.PI) {
            var yAngle = yDim + i;
            if (startAngle < endAngle) {
                if (startAngle < yAngle && yAngle < endAngle) {
                    ys.push(yAngle);
                }
            }
            else {
                if (endAngle < yAngle && yAngle < startAngle) {
                    ys.push(yAngle);
                }
            }
        }
        for (var i = 0; i < ys.length; i++) {
            var y = yAt(cx, cy, rx, ry, xRotation, ys[i]);
            if (y < minY) {
                minY = y;
            }
            if (y > maxY) {
                maxY = y;
            }
        }
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    },
    /**
     * 获取圆弧的长度，计算圆弧长度时不考虑旋转角度，
     * 仅跟 rx, ry, startAngle, endAngle 相关
     * @param {number} cx         圆心 x
     * @param {number} cy         圆心 y
     * @param {number} rx         x 轴方向的半径
     * @param {number} ry         y 轴方向的半径
     * @param {number} xRotation  旋转角度
     * @param {number} startAngle 起始角度
     * @param {number} endAngle   结束角度
     */
    length: function (cx, cy, rx, ry, xRotation, startAngle, endAngle) { },
    /**
     * 获取指定点到圆弧的最近距离的点
     * @param {number} cx         圆心 x
     * @param {number} cy         圆心 y
     * @param {number} rx         x 轴方向的半径
     * @param {number} ry         y 轴方向的半径
     * @param {number} xRotation  旋转角度
     * @param {number} startAngle 起始角度
     * @param {number} endAngle   结束角度
     * @param {number} x0         指定点的 x
     * @param {number} y0         指定点的 y
     * @return {object} 到指定点最近距离的点
     */
    nearestPoint: function (cx, cy, rx, ry, xRotation, startAngle, endAngle, x0, y0) {
        // 将最近距离问题转换成到椭圆中心 0,0 没有旋转的椭圆问题
        var relativeVector = rotate(x0 - cx, y0 - cy, -xRotation);
        var x1 = relativeVector[0], y1 = relativeVector[1];
        // 计算点到椭圆的最近的点
        var relativePoint = ellipse.nearestPoint(0, 0, rx, ry, x1, y1);
        // 获取点在椭圆上的角度
        var angle = getAngle(rx, ry, relativePoint.x, relativePoint.y);
        // 点没有在圆弧上
        if (angle < startAngle) {
            // 小于起始圆弧
            relativePoint = getPoint(rx, ry, startAngle);
        }
        else if (angle > endAngle) {
            // 大于结束圆弧
            relativePoint = getPoint(rx, ry, endAngle);
        }
        // 旋转到 xRotation 的角度
        var vector = rotate(relativePoint.x, relativePoint.y, xRotation);
        return {
            x: vector[0] + cx,
            y: vector[1] + cy,
        };
    },
    pointDistance: function (cx, cy, rx, ry, xRotation, startAngle, endAngle, x0, y0) {
        var nearestPoint = this.nearestPoint(cx, cy, rx, ry, x0, y0);
        return distance(nearestPoint.x, nearestPoint.y, x0, y0);
    },
    pointAt: function (cx, cy, rx, ry, xRotation, startAngle, endAngle, t) {
        var angle = (endAngle - startAngle) * t + startAngle;
        return {
            x: xAt(cx, cy, rx, ry, xRotation, angle),
            y: yAt(cx, cy, rx, ry, xRotation, angle),
        };
    },
    tangentAngle: function (cx, cy, rx, ry, xRotation, startAngle, endAngle, t) {
        var angle = (endAngle - startAngle) * t + startAngle;
        var dx = derivativeXAt(cx, cy, rx, ry, xRotation, startAngle, endAngle, angle);
        var dy = derivativeYAt(cx, cy, rx, ry, xRotation, startAngle, endAngle, angle);
        return piMod(Math.atan2(dy, dx));
    },
};
//# sourceMappingURL=arc.js.map