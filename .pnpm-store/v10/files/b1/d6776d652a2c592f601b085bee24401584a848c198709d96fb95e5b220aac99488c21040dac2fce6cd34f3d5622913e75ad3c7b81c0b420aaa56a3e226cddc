import { __assign } from "tslib";
import { registerShape } from '../base';
import { getStyle } from '../util/get-style';
import { getFunnelPath, getRectPoints } from './util';
/** 漏斗图 */
registerShape('interval', 'funnel', {
    getPoints: function (shapePoint) {
        shapePoint.size = shapePoint.size * 2; // 漏斗图的 size 是柱状图的两倍
        return getRectPoints(shapePoint);
    },
    draw: function (cfg, container) {
        var style = getStyle(cfg, false, true);
        var path = this.parsePath(getFunnelPath(cfg.points, cfg.nextPoints, false));
        var shape = container.addShape('path', {
            attrs: __assign(__assign({}, style), { path: path }),
            name: 'interval',
        });
        return shape;
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
//# sourceMappingURL=funnel.js.map