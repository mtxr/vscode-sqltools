"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("../base");
var util_1 = require("./util");
/**
 * 描边但不填充的区域图
 */
(0, base_1.registerShape)('area', 'line', {
    draw: function (cfg, container) {
        var attrs = (0, util_1.getShapeAttrs)(cfg, true, false, this);
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