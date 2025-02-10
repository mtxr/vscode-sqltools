"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var marker_1 = require("../../../util/marker");
var base_1 = require("../base");
var util_2 = require("./util");
// 添加 hollowShape
(0, util_1.each)(util_2.HOLLOW_SHAPES, function (shapeName) {
    (0, base_1.registerShape)('point', shapeName, {
        draw: function (cfg, container) {
            return (0, util_2.drawPoints)(this, cfg, container, shapeName, true);
        },
        getMarker: function (markerCfg) {
            var color = markerCfg.color;
            return {
                symbol: marker_1.MarkerSymbols[shapeName],
                style: {
                    r: 4.5,
                    stroke: color,
                    fill: null,
                },
            };
        },
    });
});
//# sourceMappingURL=hollow.js.map