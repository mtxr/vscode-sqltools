import { registerShape } from '../base';
import { getConstraint, getShapeAttrs } from './util';
/**
 * 填充的平滑曲面图
 */
registerShape('area', 'smooth', {
    draw: function (cfg, container) {
        var coordinate = this.coordinate;
        var attrs = getShapeAttrs(cfg, false, true, this, getConstraint(coordinate));
        var shape = container.addShape({
            type: 'path',
            attrs: attrs,
            name: 'area',
        });
        return shape;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: function (x, y, r) {
                if (r === void 0) { r = 5.5; }
                return [['M', x - r, y - 4], ['L', x + r, y - 4], ['L', x + r, y + 4], ['L', x - r, y + 4], ['Z']];
            },
            style: {
                r: 5,
                fill: color,
                fillOpacity: 1,
            },
        };
    },
});
//# sourceMappingURL=smooth.js.map