"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../base");
var get_style_1 = require("../util/get-style");
var CORNER_PERCENT = 1 / 3;
function getVHVPath(from, to) {
    var points = [];
    points.push({
        x: from.x,
        y: from.y * (1 - CORNER_PERCENT) + to.y * CORNER_PERCENT,
    });
    points.push({
        x: to.x,
        y: from.y * (1 - CORNER_PERCENT) + to.y * CORNER_PERCENT,
    });
    points.push(to);
    var path = [['M', from.x, from.y]];
    (0, util_1.each)(points, function (point) {
        path.push(['L', point.x, point.y]);
    });
    return path;
}
(0, base_1.registerShape)('edge', 'vhv', {
    draw: function (cfg, container) {
        var style = (0, get_style_1.getStyle)(cfg, true, false, 'lineWidth');
        var points = cfg.points;
        var path = this.parsePath(getVHVPath(points[0], points[1]));
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
//# sourceMappingURL=vhv.js.map