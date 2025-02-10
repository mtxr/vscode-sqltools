"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../base");
var get_style_1 = require("../util/get-style");
var path_1 = require("../util/path");
var split_points_1 = require("../util/split-points");
var EdgeShapeFactory = (0, base_1.registerShapeFactory)('edge', {
    defaultShapeType: 'line',
    getDefaultPoints: function (pointInfo) {
        return (0, split_points_1.splitPoints)(pointInfo);
    },
});
(0, base_1.registerShape)('edge', 'line', {
    draw: function (cfg, container) {
        var style = (0, get_style_1.getStyle)(cfg, true, false, 'lineWidth');
        var path = (0, path_1.getLinePath)(this.parsePoints(cfg.points), this.coordinate.isPolar);
        return container.addShape('path', {
            attrs: tslib_1.__assign(tslib_1.__assign({}, style), { path: path }),
        });
    },
    getMarker: function (markerCfg) {
        return {
            symbol: 'circle',
            style: {
                r: 4.5,
                fill: markerCfg.color,
            },
        };
    },
});
exports.default = EdgeShapeFactory;
//# sourceMappingURL=index.js.map