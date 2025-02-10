import { registerShape } from '../base';
import { getShapeAttrs } from './util';
/**
 * 描边但不填充的区域图
 */
registerShape('area', 'line', {
    draw: function (cfg, container) {
        var attrs = getShapeAttrs(cfg, true, false, this);
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
                stroke: color,
                fill: null,
            },
        };
    },
});
//# sourceMappingURL=line.js.map