"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../base");
var get_style_1 = require("../util/get-style");
var util_1 = require("./util");
function getSmoothPath(from, to) {
    var sub = (0, util_1.getCPath)(from, to);
    var path = [['M', from.x, from.y]];
    path.push(sub);
    return path;
}
(0, base_1.registerShape)('edge', 'smooth', {
    draw: function (cfg, container) {
        var style = (0, get_style_1.getStyle)(cfg, true, false, 'lineWidth');
        var points = cfg.points;
        var path = this.parsePath(getSmoothPath(points[0], points[1]));
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
//# sourceMappingURL=smooth.js.map