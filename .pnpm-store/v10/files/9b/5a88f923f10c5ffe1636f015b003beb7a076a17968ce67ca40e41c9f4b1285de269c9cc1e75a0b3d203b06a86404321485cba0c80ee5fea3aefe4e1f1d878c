import { __assign } from "tslib";
import { registerShape } from '../base';
import { getSmoothViolinPath } from '../util/get-path-points';
import { getStyle } from '../util/get-style';
/**
 * 平滑边界的小提琴图
 */
registerShape('violin', 'smooth', {
    draw: function (cfg, container) {
        var attrs = getStyle(cfg, true, true);
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
                stroke: null,
                r: 4,
                fill: color,
            },
        };
    },
});
//# sourceMappingURL=smooth.js.map