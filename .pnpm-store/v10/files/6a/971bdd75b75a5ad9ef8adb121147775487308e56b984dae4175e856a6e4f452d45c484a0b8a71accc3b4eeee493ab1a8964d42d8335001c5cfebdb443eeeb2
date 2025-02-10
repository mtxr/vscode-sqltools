"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxisTitleText = exports.getAxisDirection = exports.getAxisOption = exports.getCircleAxisCenterRadius = exports.getAxisTitleOptions = exports.getAxisThemeCfg = exports.getAxisFactorByRegion = exports.isVertical = exports.getAxisFactor = exports.getAxisRegion = exports.getCircleAxisRelativeRegion = exports.getLineAxisRelativeRegion = void 0;
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var scale_1 = require("./scale");
var matrix_util_1 = require("@antv/matrix-util");
/**
 * @ignore
 * get axis relative region ( 0 ~ 1) by direction when coordinate is rect
 * @param direction
 * @returns axis coordinate region
 */
function getLineAxisRelativeRegion(direction) {
    var start;
    var end;
    switch (direction) {
        case constant_1.DIRECTION.TOP:
            start = { x: 0, y: 1 };
            end = { x: 1, y: 1 };
            break;
        case constant_1.DIRECTION.RIGHT:
            start = { x: 1, y: 0 };
            end = { x: 1, y: 1 };
            break;
        case constant_1.DIRECTION.BOTTOM:
            start = { x: 0, y: 0 };
            end = { x: 1, y: 0 };
            break;
        case constant_1.DIRECTION.LEFT:
            start = { x: 0, y: 0 };
            end = { x: 0, y: 1 };
            break;
        default:
            start = end = { x: 0, y: 0 };
    }
    return { start: start, end: end };
}
exports.getLineAxisRelativeRegion = getLineAxisRelativeRegion;
/**
 * @ignore
 * get axis relative region ( 0 ~ 1) by direction when coordinate is polar
 * @param coordinate
 * @returns axis coordinate region
 */
function getCircleAxisRelativeRegion(coordinate) {
    var start;
    var end;
    if (coordinate.isTransposed) {
        start = {
            x: 0,
            y: 0,
        };
        end = {
            x: 1,
            y: 0,
        };
    }
    else {
        start = {
            x: 0,
            y: 0,
        };
        end = {
            x: 0,
            y: 1,
        };
    }
    return { start: start, end: end };
}
exports.getCircleAxisRelativeRegion = getCircleAxisRelativeRegion;
/**
 * @ignore
 * get the axis region from coordinate
 * @param coordinate
 * @param direction
 * @returns the axis region (start point, end point)
 */
function getAxisRegion(coordinate, direction) {
    var region = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
    if (coordinate.isRect) {
        region = getLineAxisRelativeRegion(direction);
    }
    else if (coordinate.isPolar) {
        region = getCircleAxisRelativeRegion(coordinate);
    }
    var start = region.start, end = region.end;
    return {
        start: coordinate.convert(start),
        end: coordinate.convert(end),
    };
}
exports.getAxisRegion = getAxisRegion;
/**
 * @ignore
 * get axis factor
 * @param coordinate
 * @param direction
 * @returns factor
 */
function getAxisFactor(coordinate, direction) {
    // rect coordinate, by direction
    if (coordinate.isRect) {
        return coordinate.isTransposed
            ? [constant_1.DIRECTION.RIGHT, constant_1.DIRECTION.BOTTOM].includes(direction)
                ? 1
                : -1
            : [constant_1.DIRECTION.BOTTOM, constant_1.DIRECTION.RIGHT].includes(direction)
                ? -1
                : 1;
    }
    // polar y axis, by angle
    if (coordinate.isPolar) {
        var startAngle = coordinate.x.start;
        return startAngle < 0 ? -1 : 1;
    }
    return 1;
}
exports.getAxisFactor = getAxisFactor;
/**
 * @ignore
 * whether the axis isVertical
 * @param region
 * @returns isVertical
 */
function isVertical(region) {
    var start = region.start, end = region.end;
    return start.x === end.x;
}
exports.isVertical = isVertical;
/**
 * @ignore
 * get factor by region (real position)
 * @param region
 * @param center
 * @returns factor
 */
function getAxisFactorByRegion(region, center) {
    var start = region.start, end = region.end;
    var isAxisVertical = isVertical(region);
    // 垂直
    if (isAxisVertical) {
        // 左方,从下到上、右方,从上到下
        if ((start.y - end.y) * (center.x - start.x) > 0) {
            return 1;
        }
        else {
            return -1;
        }
    }
    else {
        // 下方,从左到右、上方,从右到做
        if ((end.x - start.x) * (start.y - center.y) > 0) {
            return -1;
        }
        else {
            return 1;
        }
    }
}
exports.getAxisFactorByRegion = getAxisFactorByRegion;
/**
 * @ignore
 * get the axis cfg from theme, will mix the common cfg of legend theme
 *
 * @param theme view theme object
 * @param direction axis direction
 * @returns axis theme cfg
 */
function getAxisThemeCfg(theme, direction) {
    var axisTheme = (0, util_1.get)(theme, ['components', 'axis'], {});
    return (0, util_1.deepMix)({}, (0, util_1.get)(axisTheme, ['common'], {}), (0, util_1.deepMix)({}, (0, util_1.get)(axisTheme, [direction], {})));
}
exports.getAxisThemeCfg = getAxisThemeCfg;
/**
 * get the options of axis title，mix the cfg from theme, avoid common themeCfg not work
 * @param theme
 * @param direction
 * @param axisOptions
 * @returns axis title options
 */
function getAxisTitleOptions(theme, direction, axisOptions) {
    var axisTheme = (0, util_1.get)(theme, ['components', 'axis'], {});
    return (0, util_1.deepMix)({}, (0, util_1.get)(axisTheme, ['common', 'title'], {}), (0, util_1.deepMix)({}, (0, util_1.get)(axisTheme, [direction, 'title'], {})), axisOptions);
}
exports.getAxisTitleOptions = getAxisTitleOptions;
/**
 * @ignore
 * get circle axis center and radius
 * @param coordinate
 */
function getCircleAxisCenterRadius(coordinate) {
    // @ts-ignore
    var x = coordinate.x, y = coordinate.y, center = coordinate.circleCenter;
    var isReflectY = y.start > y.end;
    var start = coordinate.isTransposed
        ? coordinate.convert({
            x: isReflectY ? 0 : 1,
            y: 0,
        })
        : coordinate.convert({
            x: 0,
            y: isReflectY ? 0 : 1,
        });
    var startVector = [start.x - center.x, start.y - center.y];
    var normalVector = [1, 0];
    var startAngle = start.y > center.y ? matrix_util_1.vec2.angle(startVector, normalVector) : matrix_util_1.vec2.angle(startVector, normalVector) * -1;
    var endAngle = startAngle + (x.end - x.start);
    var radius = Math.sqrt(Math.pow((start.x - center.x), 2) + Math.pow((start.y - center.y), 2));
    return {
        center: center,
        radius: radius,
        startAngle: startAngle,
        endAngle: endAngle,
    };
}
exports.getCircleAxisCenterRadius = getCircleAxisCenterRadius;
/**
 * @ignore
 * 从配置中获取单个字段的 axis 配置
 * @param axes
 * @param field
 * @returns the axis option of field
 */
function getAxisOption(axes, field) {
    if ((0, util_1.isBoolean)(axes)) {
        return axes === false ? false : {};
    }
    return (0, util_1.get)(axes, [field]);
}
exports.getAxisOption = getAxisOption;
/**
 * @ignore
 * 如果配置了 position，则使用配置
 * @param axisOption
 * @param def
 */
function getAxisDirection(axisOption, def) {
    return (0, util_1.get)(axisOption, 'position', def);
}
exports.getAxisDirection = getAxisDirection;
/**
 * 获取 axis 的 title 文本
 * @param scale
 * @param axisOption
 */
function getAxisTitleText(scale, axisOption) {
    return (0, util_1.get)(axisOption, ['title', 'text'], (0, scale_1.getName)(scale));
}
exports.getAxisTitleText = getAxisTitleText;
//# sourceMappingURL=axis.js.map