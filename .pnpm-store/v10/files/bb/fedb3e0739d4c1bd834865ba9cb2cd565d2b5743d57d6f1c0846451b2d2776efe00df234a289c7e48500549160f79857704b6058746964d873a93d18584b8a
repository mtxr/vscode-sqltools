import { __assign } from "tslib";
import { isArray } from '@antv/util';
import { padEnd } from '../../../util/helper';
import { registerShape } from '../base';
import { getStyle } from '../util/get-style';
function getCandleYValues(value) {
    var array = !isArray(value) ? [value] : value;
    // 从大到小排序
    var sorted = array.sort(function (a, b) { return b - a; });
    return padEnd(sorted, 4, sorted[sorted.length - 1]);
}
// get candle shape's key points
function getCandlePoints(x, y, size) {
    var yValues = getCandleYValues(y);
    return [
        { x: x, y: yValues[0] },
        { x: x, y: yValues[1] },
        { x: x - size / 2, y: yValues[2] },
        { x: x - size / 2, y: yValues[1] },
        { x: x + size / 2, y: yValues[1] },
        { x: x + size / 2, y: yValues[2] },
        { x: x, y: yValues[2] },
        { x: x, y: yValues[3] },
    ];
}
function getCandlePath(points) {
    return [
        ['M', points[0].x, points[0].y],
        ['L', points[1].x, points[1].y],
        ['M', points[2].x, points[2].y],
        ['L', points[3].x, points[3].y],
        ['L', points[4].x, points[4].y],
        ['L', points[5].x, points[5].y],
        ['Z'],
        ['M', points[6].x, points[6].y],
        ['L', points[7].x, points[7].y],
    ];
}
// k line shape
registerShape('schema', 'candle', {
    getPoints: function (shapePoint) {
        var x = shapePoint.x, y = shapePoint.y, size = shapePoint.size;
        return getCandlePoints(x, y, size);
    },
    draw: function (cfg, container) {
        var style = getStyle(cfg, true, true);
        var path = this.parsePath(getCandlePath(cfg.points));
        var shape = container.addShape('path', {
            attrs: __assign(__assign({}, style), { path: path, name: 'schema' }),
        });
        return shape;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: function (x, y, r) {
                var yValues = [y + 7.5, y + 3, y - 3, y - 7.5];
                var points = getCandlePoints(x, yValues, r);
                return [
                    ['M', points[0].x, points[0].y],
                    ['L', points[1].x, points[1].y],
                    ['M', points[2].x, points[2].y],
                    ['L', points[3].x, points[3].y],
                    ['L', points[4].x, points[4].y],
                    ['L', points[5].x, points[5].y],
                    ['Z'],
                    ['M', points[6].x, points[6].y],
                    ['L', points[7].x, points[7].y],
                ];
            },
            style: {
                lineWidth: 1,
                stroke: color,
                fill: color,
                r: 6,
            },
        };
    },
});
//# sourceMappingURL=candle.js.map