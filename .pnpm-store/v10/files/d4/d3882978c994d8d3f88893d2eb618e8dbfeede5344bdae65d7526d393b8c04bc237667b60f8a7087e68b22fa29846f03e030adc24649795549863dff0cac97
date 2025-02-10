import { __assign } from "tslib";
import { registerShape, registerShapeFactory } from '../base';
import { BACKGROUND_SHAPE } from '../constant';
import { getBackgroundRectStyle, getStyle } from '../util/get-style';
import { getBackgroundRectPath, getIntervalRectPath, getRectPoints, getRectWithCornerRadius } from './util';
/** Interval 的 shape 工厂 */
var IntervalShapeFactory = registerShapeFactory('interval', {
    defaultShapeType: 'rect',
    getDefaultPoints: function (pointInfo) {
        return getRectPoints(pointInfo);
    },
});
/** Inerval 默认 shape，填充的矩形 */
registerShape('interval', 'rect', {
    draw: function (cfg, container) {
        var style = getStyle(cfg, false, true);
        var group = container;
        var backgroundCfg = cfg === null || cfg === void 0 ? void 0 : cfg.background;
        if (backgroundCfg) {
            group = container.addGroup({
                name: 'interval-group',
            });
            var backgroundStyle = getBackgroundRectStyle(cfg);
            var backgroundPath = getBackgroundRectPath(cfg, this.parsePoints(cfg.points), this.coordinate);
            group.addShape('path', {
                attrs: __assign(__assign({}, backgroundStyle), { path: backgroundPath }),
                capture: false,
                zIndex: -1,
                name: BACKGROUND_SHAPE,
            });
        }
        var path;
        if (style.radius && this.coordinate.isRect) {
            path = getRectWithCornerRadius(this.parsePoints(cfg.points), this.coordinate, style.radius);
        }
        else {
            path = this.parsePath(getIntervalRectPath(cfg.points, style.lineCap, this.coordinate));
        }
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
                    fill: color,
                },
            };
        }
        return {
            symbol: 'square',
            style: {
                r: 4,
                fill: color,
            },
        };
    },
});
export default IntervalShapeFactory;
//# sourceMappingURL=index.js.map