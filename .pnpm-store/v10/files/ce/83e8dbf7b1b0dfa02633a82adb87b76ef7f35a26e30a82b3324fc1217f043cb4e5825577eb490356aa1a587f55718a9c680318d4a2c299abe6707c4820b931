import { __assign } from "tslib";
import { registerShape } from '../base';
import { getStyle } from '../util/get-style';
import { getCPath } from './util';
function getSmoothPath(from, to) {
    var sub = getCPath(from, to);
    var path = [['M', from.x, from.y]];
    path.push(sub);
    return path;
}
registerShape('edge', 'smooth', {
    draw: function (cfg, container) {
        var style = getStyle(cfg, true, false, 'lineWidth');
        var points = cfg.points;
        var path = this.parsePath(getSmoothPath(points[0], points[1]));
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
//# sourceMappingURL=smooth.js.map