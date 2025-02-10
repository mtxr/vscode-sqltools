import { __assign } from "tslib";
import { each, isEmpty, isEqual, last } from '@antv/util';
import { registerShape, registerShapeFactory } from '../base';
import { getStyle } from '../util/get-style';
function getPath(points) {
    var flag = points[0];
    var i = 1;
    var path = [['M', flag.x, flag.y]];
    while (i < points.length) {
        var c = points[i];
        if (c.x !== points[i - 1].x || c.y !== points[i - 1].y) {
            path.push(['L', c.x, c.y]);
            if (c.x === flag.x && c.y === flag.y && i < points.length - 1) {
                flag = points[i + 1];
                path.push(['Z']);
                path.push(['M', flag.x, flag.y]);
                i++;
            }
        }
        i++;
    }
    if (!isEqual(last(path), flag)) {
        path.push(['L', flag.x, flag.y]);
    }
    path.push(['Z']);
    return path;
}
var PolygonShapeFactory = registerShapeFactory('polygon', {
    defaultShapeType: 'polygon',
    getDefaultPoints: function (pointInfo) {
        var points = [];
        each(pointInfo.x, function (subX, index) {
            var subY = pointInfo.y[index];
            points.push({
                x: subX,
                y: subY,
            });
        });
        return points;
    },
});
registerShape('polygon', 'polygon', {
    draw: function (cfg, container) {
        if (!isEmpty(cfg.points)) {
            var shapeAttrs = getStyle(cfg, true, true);
            var path = this.parsePath(getPath(cfg.points));
            return container.addShape('path', {
                attrs: __assign(__assign({}, shapeAttrs), { path: path }),
                name: 'polygon',
            });
        }
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: 'square',
            style: {
                r: 4,
                fill: color,
            },
        };
    },
});
export default PolygonShapeFactory;
//# sourceMappingURL=index.js.map