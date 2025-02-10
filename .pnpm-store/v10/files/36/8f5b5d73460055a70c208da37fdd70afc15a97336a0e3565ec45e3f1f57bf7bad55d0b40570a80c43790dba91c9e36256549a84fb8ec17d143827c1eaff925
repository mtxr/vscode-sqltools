import { __assign } from "tslib";
import { registerShape } from '../base';
import { getSmoothViolinPath, getViolinPath } from '../util/get-path-points';
import { getStyle } from '../util/get-style';
/**
 * 空心小提琴图
 */
registerShape('violin', 'hollow', {
    draw: function (cfg, container) {
        var attrs = getStyle(cfg, true, false);
        var path = this.parsePath(getViolinPath(cfg.points));
        return container.addShape('path', {
            attrs: __assign(__assign({}, attrs), { path: path }),
        });
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: 'circle',
            style: {
                r: 4,
                fill: null,
                stroke: color,
            },
        };
    },
});
/**
 * 平滑边界的空心小提琴图
 */
registerShape('violin', 'hollow-smooth', {
    draw: function (cfg, container) {
        var attrs = getStyle(cfg, true, false);
        var path = this.parsePath(getSmoothViolinPath(cfg.points));
        return container.addShape('path', {
            attrs: __assign(__assign({}, attrs), { path: path }),
        });
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: 'circle',
            style: {
                r: 4,
                fill: null,
                stroke: color,
            },
        };
    },
});
//# sourceMappingURL=hollow.js.map