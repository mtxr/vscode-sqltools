"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoordinateBBox = exports.getCoordinateClipCfg = exports.getAngleByPoint = exports.isPointInCoordinate = exports.getDistanceToCenter = exports.isFullCircle = exports.getXDimensionLength = void 0;
var graphics_1 = require("./graphics");
var helper_1 = require("./helper");
var bbox_1 = require("./bbox");
/**
 * @ignore
 * Gets x dimension length
 * @param coordinate
 * @returns x dimension length
 */
function getXDimensionLength(coordinate) {
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
exports.getXDimensionLength = getXDimensionLength;
/**
 * @ignore
 * Determines whether full circle is
 * @param coordinate
 * @returns true if full circle
 */
function isFullCircle(coordinate) {
    if (coordinate.isPolar) {
        var startAngle = coordinate.startAngle, endAngle = coordinate.endAngle;
        return endAngle - startAngle === Math.PI * 2;
    }
    return false;
}
exports.isFullCircle = isFullCircle;
/**
 * @ignore
 * 获取当前点到坐标系圆心的距离
 * @param coordinate 坐标系
 * @param point 当前点
 * @returns distance to center
 */
function getDistanceToCenter(coordinate, point) {
    var center = coordinate.getCenter();
    return Math.sqrt(Math.pow((point.x - center.x), 2) + Math.pow((point.y - center.y), 2));
}
exports.getDistanceToCenter = getDistanceToCenter;
/**
 * @ignore
 * 坐标点是否在坐标系中
 * @param coordinate
 * @param point
 */
function isPointInCoordinate(coordinate, point) {
    var result = false;
    if (coordinate) {
        if (coordinate.type === 'theta') {
            var start = coordinate.start, end = coordinate.end;
            result = (0, helper_1.isBetween)(point.x, start.x, end.x) && (0, helper_1.isBetween)(point.y, start.y, end.y);
        }
        else {
            var invertPoint = coordinate.invert(point);
            result = (0, helper_1.isBetween)(invertPoint.x, 0, 1) && (0, helper_1.isBetween)(invertPoint.y, 0, 1);
        }
    }
    return result;
}
exports.isPointInCoordinate = isPointInCoordinate;
/**
 * @ignore
 * 获取点到圆心的连线与水平方向的夹角
 */
function getAngleByPoint(coordinate, point) {
    var center = coordinate.getCenter();
    return Math.atan2(point.y - center.y, point.x - center.x);
}
exports.getAngleByPoint = getAngleByPoint;
/**
 * @ignore
 * 获取同坐标系范围相同的剪切区域
 * @param coordinate
 * @returns
 */
function getCoordinateClipCfg(coordinate, margin) {
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
                path: (0, graphics_1.getSectorPath)(center_1.x, center_1.y, radius_1 + margin, startAngle_1, startAngle_1),
            },
            endState: function (ratio) {
                var diff = (endAngle_1 - startAngle_1) * ratio + startAngle_1;
                var path = (0, graphics_1.getSectorPath)(center_1.x, center_1.y, radius_1 + margin, startAngle_1, diff);
                return {
                    path: path,
                };
            },
            attrs: {
                path: (0, graphics_1.getSectorPath)(center_1.x, center_1.y, radius_1 + margin, startAngle_1, endAngle_1),
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
exports.getCoordinateClipCfg = getCoordinateClipCfg;
/**
 * 获取坐标系范围的 BBox
 * @param coordinate
 * @param margin
 */
function getCoordinateBBox(coordinate, margin) {
    if (margin === void 0) { margin = 0; }
    var start = coordinate.start, end = coordinate.end;
    var width = coordinate.getWidth();
    var height = coordinate.getHeight();
    var minX = Math.min(start.x, end.x);
    var minY = Math.min(start.y, end.y);
    return bbox_1.BBox.fromRange(minX - margin, minY - margin, minX + width + margin, minY + height + margin);
}
exports.getCoordinateBBox = getCoordinateBBox;
//# sourceMappingURL=coordinate.js.map