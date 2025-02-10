"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTranslateDirection = exports.directionToPosition = void 0;
var constant_1 = require("../constant");
/**
 * @ignore
 * 方位常量转实际的 bbox 位置大小
 * @param parentBBox
 * @param bbox
 * @param direction
 */
function directionToPosition(parentBBox, bbox, direction) {
    if (direction === constant_1.DIRECTION.TOP) {
        return [parentBBox.minX + parentBBox.width / 2 - bbox.width / 2, parentBBox.minY];
    }
    if (direction === constant_1.DIRECTION.BOTTOM) {
        return [parentBBox.minX + parentBBox.width / 2 - bbox.width / 2, parentBBox.maxY - bbox.height];
    }
    if (direction === constant_1.DIRECTION.LEFT) {
        return [parentBBox.minX, parentBBox.minY + parentBBox.height / 2 - bbox.height / 2];
    }
    if (direction === constant_1.DIRECTION.RIGHT) {
        return [parentBBox.maxX - bbox.width, parentBBox.minY + parentBBox.height / 2 - bbox.height / 2];
    }
    if (direction === constant_1.DIRECTION.TOP_LEFT || direction === constant_1.DIRECTION.LEFT_TOP) {
        return [parentBBox.tl.x, parentBBox.tl.y];
    }
    if (direction === constant_1.DIRECTION.TOP_RIGHT || direction === constant_1.DIRECTION.RIGHT_TOP) {
        return [parentBBox.tr.x - bbox.width, parentBBox.tr.y];
    }
    if (direction === constant_1.DIRECTION.BOTTOM_LEFT || direction === constant_1.DIRECTION.LEFT_BOTTOM) {
        return [parentBBox.bl.x, parentBBox.bl.y - bbox.height];
    }
    if (direction === constant_1.DIRECTION.BOTTOM_RIGHT || direction === constant_1.DIRECTION.RIGHT_BOTTOM) {
        return [parentBBox.br.x - bbox.width, parentBBox.br.y - bbox.height];
    }
    return [0, 0];
}
exports.directionToPosition = directionToPosition;
/**
 * get direction after coordinate transpose
 * @param direction
 * @param coordinate
 * @returns direction after transpose or not
 */
function getTransposedDirection(direction, coordinate) {
    if (coordinate.isTransposed) {
        switch (direction) {
            case constant_1.DIRECTION.BOTTOM:
                return constant_1.DIRECTION.LEFT;
            case constant_1.DIRECTION.LEFT:
                return constant_1.DIRECTION.BOTTOM;
            case constant_1.DIRECTION.RIGHT:
                return constant_1.DIRECTION.TOP;
            case constant_1.DIRECTION.TOP:
                return constant_1.DIRECTION.RIGHT;
        }
    }
    return direction;
}
function reflectX(direct) {
    if (direct === constant_1.DIRECTION.LEFT) {
        return constant_1.DIRECTION.RIGHT;
    }
    if (direct === constant_1.DIRECTION.RIGHT) {
        return constant_1.DIRECTION.LEFT;
    }
    return direct;
}
function reflectY(direct) {
    if (direct === constant_1.DIRECTION.TOP) {
        return constant_1.DIRECTION.BOTTOM;
    }
    if (direct === constant_1.DIRECTION.BOTTOM) {
        return constant_1.DIRECTION.TOP;
    }
    return direct;
}
/**
 * get direction after coordinate.scale
 * @param direction
 * @param coordinate
 */
function getScaleDirection(direction, coordinate) {
    var x = coordinate.matrix[0];
    var y = coordinate.matrix[4];
    var d = direction;
    if (x < 0) {
        d = reflectX(d);
    }
    if (y < 0) {
        d = reflectY(d);
    }
    return d;
}
/**
 *
 * @param direction
 * @param coordinate
 */
function getReflectDirection(direction, coordinate) {
    var d = direction;
    if (coordinate.isReflect('x')) {
        d = reflectX(d);
    }
    if (coordinate.isReflect('y')) {
        d = reflectY(d);
    }
    return d;
}
/**
 * @ignore
 * get direction after coordinate translate
 * @param direction
 * @param coordinate
 */
function getTranslateDirection(direction, coordinate) {
    var d = direction;
    d = getTransposedDirection(d, coordinate);
    d = getScaleDirection(d, coordinate);
    d = getReflectDirection(d, coordinate);
    return d;
}
exports.getTranslateDirection = getTranslateDirection;
//# sourceMappingURL=direction.js.map