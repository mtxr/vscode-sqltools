"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../base");
var get_style_1 = require("../util/get-style");
var util_1 = require("./util");
/** 漏斗图 */
(0, base_1.registerShape)('interval', 'funnel', {
    getPoints: function (shapePoint) {
        shapePoint.size = shapePoint.size * 2; // 漏斗图的 size 是柱状图的两倍
        return (0, util_1.getRectPoints)(shapePoint);
    },
    draw: function (cfg, container) {
        var style = (0, get_style_1.getStyle)(cfg, false, true);
        var path = this.parsePath((0, util_1.getFunnelPath)(cfg.points, cfg.nextPoints, false));
        var shape = container.addShape('path', {
            attrs: tslib_1.__assign(tslib_1.__assign({}, style), { path: path }),
            name: 'interval',
        });
        return shape;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: 'square',
            style: {
                r: 4,
                fill: color,
            },
        };
    },
});
//# sourceMappingURL=funnel.js.map