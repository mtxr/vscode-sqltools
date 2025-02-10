import { each, isEmpty, isNumber, isNumberEqual, max, min } from '@antv/util';
// 获取图形的包围盒
function getPointsBox(points) {
    if (isEmpty(points)) {
        return null;
    }
    var minX = points[0].x;
    var maxX = points[0].x;
    var minY = points[0].y;
    var maxY = points[0].y;
    each(points, function (point) {
        minX = minX > point.x ? point.x : minX;
        maxX = maxX < point.x ? point.x : maxX;
        minY = minY > point.y ? point.y : minY;
        maxY = maxY < point.y ? point.y : maxY;
    });
    return {
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2,
    };
}
function uniqueValues(array) {
    return Array.from(new Set(array)).length === 1;
}
function mid(array) {
    return (min(array) + max(array)) / 2;
}
/**
 * @ignore
 * 根据弧度计算极坐标系下的坐标点
 * @param centerX
 * @param centerY
 * @param radius
 * @param angleInRadian
 * @returns
 */
export function polarToCartesian(centerX, centerY, radius, angleInRadian) {
    return {
        x: centerX + radius * Math.cos(angleInRadian),
        y: centerY + radius * Math.sin(angleInRadian),
    };
}
/**
 * @ignore
 * 根据起始角度计算绘制扇形的 path
 * @param centerX
 * @param centerY
 * @param radius
 * @param startAngleInRadian
 * @param endAngleInRadian
 * @returns
 */
export function getSectorPath(centerX, centerY, radius, startAngleInRadian, endAngleInRadian, innerRadius) {
    if (innerRadius === void 0) { innerRadius = 0; }
    var start = polarToCartesian(centerX, centerY, radius, startAngleInRadian);
    var end = polarToCartesian(centerX, centerY, radius, endAngleInRadian);
    var innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngleInRadian);
    var innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngleInRadian);
    if (endAngleInRadian - startAngleInRadian === Math.PI * 2) {
        // 整个圆是分割成两个圆
        var middlePoint = polarToCartesian(centerX, centerY, radius, startAngleInRadian + Math.PI);
        var innerMiddlePoint = polarToCartesian(centerX, centerY, innerRadius, startAngleInRadian + Math.PI);
        var circlePathCommands = [
            ['M', start.x, start.y],
            ['A', radius, radius, 0, 1, 1, middlePoint.x, middlePoint.y],
            ['A', radius, radius, 0, 1, 1, end.x, end.y],
            ['M', innerStart.x, innerStart.y],
        ];
        if (innerRadius) {
            circlePathCommands.push(['A', innerRadius, innerRadius, 0, 1, 0, innerMiddlePoint.x, innerMiddlePoint.y]);
            circlePathCommands.push(['A', innerRadius, innerRadius, 0, 1, 0, innerEnd.x, innerEnd.y]);
        }
        circlePathCommands.push(['M', start.x, start.y]);
        circlePathCommands.push(['Z']);
        return circlePathCommands;
    }
    var arcSweep = endAngleInRadian - startAngleInRadian <= Math.PI ? 0 : 1;
    var sectorPathCommands = [
        ['M', start.x, start.y],
        ['A', radius, radius, 0, arcSweep, 1, end.x, end.y],
        ['L', innerEnd.x, innerEnd.y],
    ];
    if (innerRadius) {
        sectorPathCommands.push(['A', innerRadius, innerRadius, 0, arcSweep, 0, innerStart.x, innerStart.y]);
    }
    sectorPathCommands.push(['L', start.x, start.y]);
    sectorPathCommands.push(['Z']);
    return sectorPathCommands;
}
/**
 * @ignore
 * Gets arc path
 * @param centerX
 * @param centerY
 * @param radius
 * @param startAngleInRadian
 * @param endAngleInRadian
 * @returns
 */
export function getArcPath(centerX, centerY, radius, startAngleInRadian, endAngleInRadian) {
    var start = polarToCartesian(centerX, centerY, radius, startAngleInRadian);
    var end = polarToCartesian(centerX, centerY, radius, endAngleInRadian);
    if (isNumberEqual(endAngleInRadian - startAngleInRadian, Math.PI * 2)) {
        var middlePoint = polarToCartesian(centerX, centerY, radius, startAngleInRadian + Math.PI);
        return [
            ['M', start.x, start.y],
            ['A', radius, radius, 0, 1, 1, middlePoint.x, middlePoint.y],
            ['A', radius, radius, 0, 1, 1, start.x, start.y],
            ['A', radius, radius, 0, 1, 0, middlePoint.x, middlePoint.y],
            ['A', radius, radius, 0, 1, 0, start.x, start.y],
            ['Z'],
        ];
    }
    var arcSweep = endAngleInRadian - startAngleInRadian <= Math.PI ? 0 : 1;
    return [
        ['M', start.x, start.y],
        ['A', radius, radius, 0, arcSweep, 1, end.x, end.y],
    ];
}
/**
 * @ignore
 * 从数据模型中的 points 换算角度
 * @param shapeModel
 * @param coordinate
 * @returns
 */
export function getAngle(shapeModel, coordinate) {
    var points = shapeModel.points;
    var box = getPointsBox(points);
    var endAngle;
    var startAngle;
    var coordStartAngle = coordinate.startAngle, coordEndAngle = coordinate.endAngle;
    var diffAngle = coordEndAngle - coordStartAngle;
    if (coordinate.isTransposed) {
        endAngle = box.maxY * diffAngle;
        startAngle = box.minY * diffAngle;
    }
    else {
        endAngle = box.maxX * diffAngle;
        startAngle = box.minX * diffAngle;
    }
    endAngle += coordStartAngle;
    startAngle += coordStartAngle;
    return {
        startAngle: startAngle,
        endAngle: endAngle,
    };
}
/**
 * @ignore
 * 计算多边形重心: https://en.wikipedia.org/wiki/Centroid#Of_a_polygon
 */
export function getPolygonCentroid(xs, ys) {
    if (isNumber(xs) && isNumber(ys)) {
        // 普通色块图，xs 和 ys 是数值
        return [xs, ys];
    }
    xs = xs;
    ys = ys;
    // 当这个 polygon 的点在一条线上的时候
    // 也就是说 xs 里面的值都相同，比如：[1, 1, 1, 1]
    // 或者说 ys 里面的值都相同，比如：[0, 0, 0, 0]
    // 下面计算得到的 k = 0
    // 导致返回的值是 [NaN, NaN]
    // 所以这里做相应的处理
    if (uniqueValues(xs) || uniqueValues(ys))
        return [mid(xs), mid(ys)];
    var i = -1;
    var x = 0;
    var y = 0;
    var former;
    var current = xs.length - 1;
    var diff;
    var k = 0;
    while (++i < xs.length) {
        former = current;
        current = i;
        k += diff = xs[former] * ys[current] - xs[current] * ys[former];
        x += (xs[former] + xs[current]) * diff;
        y += (ys[former] + ys[current]) * diff;
    }
    k *= 3;
    return [x / k, y / k];
}
/**
 * @ignore
 * 获取需要替换的属性，如果原先图形元素存在，而新图形不存在，则设置 undefined
 */
export function getReplaceAttrs(sourceShape, targetShape) {
    var originAttrs = sourceShape.attr();
    var newAttrs = targetShape.attr();
    each(originAttrs, function (v, k) {
        if (newAttrs[k] === undefined) {
            newAttrs[k] = undefined;
        }
    });
    return newAttrs;
}
//# sourceMappingURL=graphics.js.map