"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var marker_1 = require("../../../util/marker");
var base_1 = require("../base");
var split_points_1 = require("../util/split-points");
var util_2 = require("./util");
var PointShapeFactory = (0, base_1.registerShapeFactory)('point', {
    defaultShapeType: 'hollow-circle',
    getDefaultPoints: function (pointInfo) {
        return (0, split_points_1.splitPoints)(pointInfo);
    },
});
(0, util_1.each)(util_2.SHAPES, function (shapeName) {
    // 添加该 shape 对应的 hollow-shape
    (0, base_1.registerShape)('point', "hollow-".concat(shapeName), {
        draw: function (cfg, container) {
            return (0, util_2.drawPoints)(this, cfg, container, shapeName, true);
        },
        getMarker: function (markerCfg) {
            var color = markerCfg.color;
            return {
                symbol: marker_1.MarkerSymbols[shapeName] || shapeName,
                style: {
                    r: 4.5,
                    stroke: color,
                    fill: null,
                },
            };
        },
    });
});
exports.default = PointShapeFactory;
//# sourceMappingURL=index.js.map