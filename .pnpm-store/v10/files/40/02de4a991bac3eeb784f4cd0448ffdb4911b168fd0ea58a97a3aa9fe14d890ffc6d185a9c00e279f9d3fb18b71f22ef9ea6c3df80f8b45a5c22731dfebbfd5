import { __assign } from "tslib";
import { each } from '@antv/util';
import { registerShape } from '../base';
import { getStyle } from '../util/get-style';
var CORNER_PERCENT = 1 / 3;
function getVHVPath(from, to) {
    var points = [];
    points.push({
        x: from.x,
        y: from.y * (1 - CORNER_PERCENT) + to.y * CORNER_PERCENT,
    });
    points.push({
        x: to.x,
        y: from.y * (1 - CORNER_PERCENT) + to.y * CORNER_PERCENT,
    });
    points.push(to);
    var path = [['M', from.x, from.y]];
    each(points, function (point) {
        path.push(['L', point.x, point.y]);
    });
    return path;
}
registerShape('edge', 'vhv', {
    draw: function (cfg, container) {
        var style = getStyle(cfg, true, false, 'lineWidth');
        var points = cfg.points;
        var path = this.parsePath(getVHVPath(points[0], points[1]));
        return container.addShape('path', {
            attrs: __assign(__assign({}, style), { path: path }),
        });
    },
    getMarker: function (markerCfg) {
        return {
            symbol: 'circle',
            style: {
                r: 4.5,
                fill: markerCfg.color,
            },
        };
    },
});
//# sourceMappingURL=vhv.js.map