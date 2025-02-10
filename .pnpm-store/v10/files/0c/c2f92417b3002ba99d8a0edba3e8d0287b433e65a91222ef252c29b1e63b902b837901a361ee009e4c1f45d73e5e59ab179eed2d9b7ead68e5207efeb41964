import { __assign } from "tslib";
import { isArray, isNil } from '@antv/util';
import { registerShape } from '../base';
import { getStyle } from '../util/get-style';
function parseValue(value) {
    var array = !isArray(value) ? [value] : value;
    var min = array[0]; // 最小值
    var max = array[array.length - 1]; // 最大值
    var min1 = array.length > 1 ? array[1] : min;
    var max1 = array.length > 3 ? array[3] : max;
    var median = array.length > 2 ? array[2] : min1;
    return {
        min: min,
        max: max,
        min1: min1,
        max1: max1,
        median: median,
    };
}
function getBoxPoints(x, y, size) {
    var halfSize = size / 2;
    var pointsArray;
    if (isArray(y)) {
        // 2维
        var _a = parseValue(y), min = _a.min, max = _a.max, median = _a.median, min1 = _a.min1, max1 = _a.max1;
        var minX = x - halfSize;
        var maxX = x + halfSize;
        pointsArray = [
            [minX, max],
            [maxX, max],
            [x, max],
            [x, max1],
            [minX, min1],
            [minX, max1],
            [maxX, max1],
            [maxX, min1],
            [x, min1],
            [x, min],
            [minX, min],
            [maxX, min],
            [minX, median],
            [maxX, median],
        ];
    }
    else {
        // 只有一个维度
        y = isNil(y) ? 0.5 : y;
        var _b = parseValue(x), min = _b.min, max = _b.max, median = _b.median, min1 = _b.min1, max1 = _b.max1;
        var minY = y - halfSize;
        var maxY = y + halfSize;
        pointsArray = [
            [min, minY],
            [min, maxY],
            [min, y],
            [min1, y],
            [min1, minY],
            [min1, maxY],
            [max1, maxY],
            [max1, minY],
            [max1, y],
            [max, y],
            [max, minY],
            [max, maxY],
            [median, minY],
            [median, maxY],
        ];
    }
    return pointsArray.map(function (arr) {
        return {
            x: arr[0],
            y: arr[1],
        };
    });
}
function getBoxPath(points) {
    return [
        ['M', points[0].x, points[0].y],
        ['L', points[1].x, points[1].y],
        ['M', points[2].x, points[2].y],
        ['L', points[3].x, points[3].y],
        ['M', points[4].x, points[4].y],
        ['L', points[5].x, points[5].y],
        ['L', points[6].x, points[6].y],
        ['L', points[7].x, points[7].y],
        ['L', points[4].x, points[4].y],
        ['Z'],
        ['M', points[8].x, points[8].y],
        ['L', points[9].x, points[9].y],
        ['M', points[10].x, points[10].y],
        ['L', points[11].x, points[11].y],
        ['M', points[12].x, points[12].y],
        ['L', points[13].x, points[13].y],
    ];
}
// box shape
registerShape('schema', 'box', {
    getPoints: function (shapePoint) {
        var x = shapePoint.x, y = shapePoint.y, size = shapePoint.size;
        return getBoxPoints(x, y, size);
    },
    draw: function (cfg, container) {
        var style = getStyle(cfg, true, false);
        var path = this.parsePath(getBoxPath(cfg.points));
        var shape = container.addShape('path', {
            attrs: __assign(__assign({}, style), { path: path, name: 'schema' }),
        });
        return shape;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: function (x, y, r) {
                var yValues = [y - 6, y - 3, y, y + 3, y + 6];
                var points = getBoxPoints(x, yValues, r);
                return [
                    ['M', points[0].x + 1, points[0].y],
                    ['L', points[1].x - 1, points[1].y],
                    ['M', points[2].x, points[2].y],
                    ['L', points[3].x, points[3].y],
                    ['M', points[4].x, points[4].y],
                    ['L', points[5].x, points[5].y],
                    ['L', points[6].x, points[6].y],
                    ['L', points[7].x, points[7].y],
                    ['L', points[4].x, points[4].y],
                    ['Z'],
                    ['M', points[8].x, points[8].y],
                    ['L', points[9].x, points[9].y],
                    ['M', points[10].x + 1, points[10].y],
                    ['L', points[11].x - 1, points[11].y],
                    ['M', points[12].x, points[12].y],
                    ['L', points[13].x, points[13].y],
                ];
            },
            style: {
                r: 6,
                lineWidth: 1,
                stroke: color,
            },
        };
    },
});
//# sourceMappingURL=box.js.map