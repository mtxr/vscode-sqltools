import { __assign } from "tslib";
import { each, max, map, isArray } from '@antv/util';
import { registerShape, registerShapeFactory } from '../base';
import { getViolinPath } from '../util/get-path-points';
import { getStyle } from '../util/get-style';
function normalizeSize(arr) {
    if (!isArray(arr)) {
        return [];
    }
    var maxValue = max(arr);
    return map(arr, function (num) { return num / maxValue; });
}
var ViolinShapeFactory = registerShapeFactory('violin', {
    defaultShapeType: 'violin',
    getDefaultPoints: function (pointInfo) {
        var radius = pointInfo.size / 2;
        var points = [];
        var sizeArr = normalizeSize(pointInfo._size);
        each(pointInfo.y, function (y, index) {
            var offset = sizeArr[index] * radius;
            var isMin = index === 0;
            var isMax = index === pointInfo.y.length - 1;
            points.push({
                isMin: isMin,
                isMax: isMax,
                x: pointInfo.x - offset,
                y: y,
            });
            points.unshift({
                isMin: isMin,
                isMax: isMax,
                x: pointInfo.x + offset,
                y: y,
            });
        });
        return points;
    },
});
registerShape('violin', 'violin', {
    draw: function (cfg, container) {
        var shapeAttrs = getStyle(cfg, true, true);
        var path = this.parsePath(getViolinPath(cfg.points));
        return container.addShape('path', {
            attrs: __assign(__assign({}, shapeAttrs), { path: path }),
            name: 'violin',
        });
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: 'circle',
            style: {
                r: 4,
                fill: color,
            },
        };
    },
});
export default ViolinShapeFactory;
//# sourceMappingURL=index.js.map