"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("../base");
var util_1 = require("./util");
/** 描边的平滑曲面图 */
(0, base_1.registerShape)('area', 'smooth-line', {
    draw: function (cfg, container) {
        var coordinate = this.coordinate;
        var attrs = (0, util_1.getShapeAttrs)(cfg, true, true, this, (0, util_1.getConstraint)(coordinate));
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
//# sourceMappingURL=smooth-line.js.map