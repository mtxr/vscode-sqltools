import { __assign } from "tslib";
import { registerShape } from '../base';
import { BACKGROUND_SHAPE } from '../constant';
import { getBackgroundRectStyle, getStyle } from '../util/get-style';
import { getBackgroundRectPath, getRectPath } from './util';
/** 描边柱状图 */
registerShape('interval', 'hollow-rect', {
    draw: function (cfg, container) {
        var style = getStyle(cfg, true, false);
        var group = container;
        var backgroundCfg = cfg === null || cfg === void 0 ? void 0 : cfg.background;
        if (backgroundCfg) {
            group = container.addGroup();
            var backgroundStyle = getBackgroundRectStyle(cfg);
            var backgroundPath = getBackgroundRectPath(cfg, this.parsePoints(cfg.points), this.coordinate);
            group.addShape('path', {
                attrs: __assign(__assign({}, backgroundStyle), { path: backgroundPath }),
                capture: false,
                zIndex: -1,
                name: BACKGROUND_SHAPE,
            });
        }
        var path = this.parsePath(getRectPath(cfg.points));
        var shape = group.addShape('path', {
            attrs: __assign(__assign({}, style), { path: path }),
            name: 'interval',
        });
        return backgroundCfg ? group : shape;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color, isInPolar = markerCfg.isInPolar;
        if (isInPolar) {
            return {
                symbol: 'circle',
                style: {
                    r: 4.5,
                    stroke: color,
                    fill: null,
                },
            };
        }
        return {
            symbol: 'square',
            style: {
                r: 4,
                stroke: color,
                fill: null,
            },
        };
    },
});
//# sourceMappingURL=hollow-rect.js.map