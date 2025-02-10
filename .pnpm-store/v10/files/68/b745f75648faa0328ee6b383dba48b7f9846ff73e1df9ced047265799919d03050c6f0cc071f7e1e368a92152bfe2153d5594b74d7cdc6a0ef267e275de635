import { __assign } from "tslib";
import { each } from '@antv/util';
import { registerShape } from '../base';
import { getPathPoints } from '../util/get-path-points';
import { getStyle } from '../util/get-style';
import { getLineMarker } from './util';
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
    each(points, function (point, index) {
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
    var points = getPathPoints(cfg.points, cfg.connectNulls, cfg.showSinglePoint); // 根据 connectNulls 值处理 points
    var path = [];
    each(points, function (eachLinePoints) {
        var interpolatePoints = getInterpolatePoints(eachLinePoints, shapeType);
        path = path.concat(getInterpolatePath(interpolatePoints));
    });
    return __assign(__assign({}, getStyle(cfg, true, false, 'lineWidth')), { path: path });
}
// step line
each(['hv', 'vh', 'hvh', 'vhv'], function (shapeType) {
    registerShape('line', shapeType, {
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
            return getLineMarker(markerCfg, shapeType);
        },
    });
});
//# sourceMappingURL=step.js.map