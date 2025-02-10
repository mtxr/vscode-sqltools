import { getSectorPath } from './graphics';
import { isBetween } from './helper';
import { BBox } from './bbox';
/**
 * @ignore
 * Gets x dimension length
 * @param coordinate
 * @returns x dimension length
 */
export function getXDimensionLength(coordinate) {
    if (coordinate.isPolar && !coordinate.isTransposed) {
        // 极坐标系下 width 为弧长
        return (coordinate.endAngle - coordinate.startAngle) * coordinate.getRadius();
    }
    // 直角坐标系
    var start = coordinate.convert({ x: 0, y: 0 });
    var end = coordinate.convert({ x: 1, y: 0 });
    // 坐标系有可能发生 transpose 等变换，所有通过两点之间的距离进行计算
    return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
}
/**
 * @ignore
 * Determines whether full circle is
 * @param coordinate
 * @returns true if full circle
 */
export function isFullCircle(coordinate) {
    if (coordinate.isPolar) {
        var startAngle = coordinate.startAngle, endAngle = coordinate.endAngle;
        return endAngle - startAngle === Math.PI * 2;
    }
    return false;
}
/**
 * @ignore
 * 获取当前点到坐标系圆心的距离
 * @param coordinate 坐标系
 * @param point 当前点
 * @returns distance to center
 */
export function getDistanceToCenter(coordinate, point) {
    var center = coordinate.getCenter();
    return Math.sqrt(Math.pow((point.x - center.x), 2) + Math.pow((point.y - center.y), 2));
}
/**
 * @ignore
 * 坐标点是否在坐标系中
 * @param coordinate
 * @param point
 */
export function isPointInCoordinate(coordinate, point) {
    var result = false;
    if (coordinate) {
        if (coordinate.type === 'theta') {
            var start = coordinate.start, end = coordinate.end;
            result = isBetween(point.x, start.x, end.x) && isBetween(point.y, start.y, end.y);
        }
        else {
            var invertPoint = coordinate.invert(point);
            result = isBetween(invertPoint.x, 0, 1) && isBetween(invertPoint.y, 0, 1);
        }
    }
    return result;
}
/**
 * @ignore
 * 获取点到圆心的连线与水平方向的夹角
 */
export function getAngleByPoint(coordinate, point) {
    var center = coordinate.getCenter();
    return Math.atan2(point.y - center.y, point.x - center.x);
}
/**
 * @ignore
 * 获取同坐标系范围相同的剪切区域
 * @param coordinate
 * @returns
 */
export function getCoordinateClipCfg(coordinate, margin) {
    if (margin === void 0) { margin = 0; }
    var start = coordinate.start, end = coordinate.end;
    var width = coordinate.getWidth();
    var height = coordinate.getHeight();
    if (coordinate.isPolar) {
        var startAngle_1 = coordinate.startAngle, endAngle_1 = coordinate.endAngle;
        var center_1 = coordinate.getCenter();
        var radius_1 = coordinate.getRadius();
        return {
            type: 'path',
            startState: {
                path: getSectorPath(center_1.x, center_1.y, radius_1 + margin, startAngle_1, startAngle_1),
            },
            endState: function (ratio) {
                var diff = (endAngle_1 - startAngle_1) * ratio + startAngle_1;
                var path = getSectorPath(center_1.x, center_1.y, radius_1 + margin, startAngle_1, diff);
                return {
                    path: path,
                };
            },
            attrs: {
                path: getSectorPath(center_1.x, center_1.y, radius_1 + margin, startAngle_1, endAngle_1),
            },
        };
    }
    var endState;
    if (coordinate.isTransposed) {
        endState = {
            height: height + margin * 2,
        };
    }
    else {
        endState = {
            width: width + margin * 2,
        };
    }
    return {
        type: 'rect',
        startState: {
            x: start.x - margin,
            y: end.y - margin,
            width: coordinate.isTransposed ? width + margin * 2 : 0,
            height: coordinate.isTransposed ? 0 : height + margin * 2,
        },
        endState: endState,
        attrs: {
            x: start.x - margin,
            y: end.y - margin,
            width: width + margin * 2,
            height: height + margin * 2,
        },
    };
}
/**
 * 获取坐标系范围的 BBox
 * @param coordinate
 * @param margin
 */
export function getCoordinateBBox(coordinate, margin) {
    if (margin === void 0) { margin = 0; }
    var start = coordinate.start, end = coordinate.end;
    var width = coordinate.getWidth();
    var height = coordinate.getHeight();
    var minX = Math.min(start.x, end.x);
    var minY = Math.min(start.y, end.y);
    return BBox.fromRange(minX - margin, minY - margin, minX + width + margin, minY + height + margin);
}
//# sourceMappingURL=coordinate.js.map