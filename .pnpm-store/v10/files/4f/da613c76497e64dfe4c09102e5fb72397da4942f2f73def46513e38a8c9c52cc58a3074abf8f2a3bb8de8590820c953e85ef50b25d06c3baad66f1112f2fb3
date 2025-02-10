"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../base");
var get_path_points_1 = require("../util/get-path-points");
var get_style_1 = require("../util/get-style");
var util_2 = require("./util");
var interpolateCallback = function (point, nextPoint, shapeType) {
    var x = point.x;
    var y = point.y;
    var nextX = nextPoint.x;
    var nextY = nextPoint.y;
    var result;
    switch (shapeType) {
        case 'hv':
            result = [{ x: nextX, y: y }];
            break;
        case 'vh':
            result = [{ x: x, y: nextY }];
            break;
        case 'hvh':
            var middleX = (nextX + x) / 2;
            result = [
                { x: middleX, y: y },
                { x: middleX, y: nextY },
            ];
            break;
        case 'vhv':
            var middleY = (y + nextY) / 2;
            result = [
                { x: x, y: middleY },
                { x: nextX, y: middleY },
            ];
            break;
        default:
            break;
    }
    return result;
};
function getInterpolatePoints(points, shapeType) {
    var result = [];
    (0, util_1.each)(points, function (point, index) {
        var nextPoint = points[index + 1];
        result.push(point);
        if (nextPoint) {
            var interpolatePoint = interpolateCallback(point, nextPoint, shapeType);
            result = result.concat(interpolatePoint);
        }
    });
    return result;
}
// 插值的图形path，不考虑null
function getInterpolatePath(points) {
    return points.map(function (point, index) {
        return index === 0 ? ['M', point.x, point.y] : ['L', point.x, point.y];
    });
}
// 插值的图形
function getInterpolateShapeAttrs(cfg, shapeType) {
    var points = (0, get_path_points_1.getPathPoints)(cfg.points, cfg.connectNulls, cfg.showSinglePoint); // 根据 connectNulls 值处理 points
    var path = [];
    (0, util_1.each)(points, function (eachLinePoints) {
        var interpolatePoints = getInterpolatePoints(eachLinePoints, shapeType);
        path = path.concat(getInterpolatePath(interpolatePoints));
    });
    return tslib_1.__assign(tslib_1.__assign({}, (0, get_style_1.getStyle)(cfg, true, false, 'lineWidth')), { path: path });
}
// step line
(0, util_1.each)(['hv', 'vh', 'hvh', 'vhv'], function (shapeType) {
    (0, base_1.registerShape)('line', shapeType, {
        draw: function (cfg, container) {
            var attrs = getInterpolateShapeAttrs(cfg, shapeType);
            var shape = container.addShape({
                type: 'path',
                attrs: attrs,
                name: 'line',
            });
            return shape;
        },
        getMarker: function (markerCfg) {
            return (0, util_2.getLineMarker)(markerCfg, shapeType);
        },
    });
});
//# sourceMappingURL=step.js.map