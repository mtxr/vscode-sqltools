"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var marker_1 = require("../../../util/marker");
var base_1 = require("../base");
var util_2 = require("./util");
// 所有的 SHAPES 都注册一下
(0, util_1.each)(util_2.SHAPES, function (shapeName) {
    (0, base_1.registerShape)('point', shapeName, {
        draw: function (cfg, container) {
            return (0, util_2.drawPoints)(this, cfg, container, shapeName, false);
        },
        getMarker: function (markerCfg) {
            var color = markerCfg.color;
            return {
                symbol: marker_1.MarkerSymbols[shapeName] || shapeName,
                style: {
                    r: 4.5,
                    fill: color,
                },
            };
        },
    });
});
//# sourceMappingURL=solid.js.map