"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../base");
var get_style_1 = require("../util/get-style");
function getPath(points) {
    var flag = points[0];
    var i = 1;
    var path = [['M', flag.x, flag.y]];
    while (i < points.length) {
        var c = points[i];
        if (c.x !== points[i - 1].x || c.y !== points[i - 1].y) {
            path.push(['L', c.x, c.y]);
            if (c.x === flag.x && c.y === flag.y && i < points.length - 1) {
                flag = points[i + 1];
                path.push(['Z']);
                path.push(['M', flag.x, flag.y]);
                i++;
            }
        }
        i++;
    }
    if (!(0, util_1.isEqual)((0, util_1.last)(path), flag)) {
        path.push(['L', flag.x, flag.y]);
    }
    path.push(['Z']);
    return path;
}
var PolygonShapeFactory = (0, base_1.registerShapeFactory)('polygon', {
    defaultShapeType: 'polygon',
    getDefaultPoints: function (pointInfo) {
        var points = [];
        (0, util_1.each)(pointInfo.x, function (subX, index) {
            var subY = pointInfo.y[index];
            points.push({
                x: subX,
                y: subY,
            });
        });
        return points;
    },
});
(0, base_1.registerShape)('polygon', 'polygon', {
    draw: function (cfg, container) {
        if (!(0, util_1.isEmpty)(cfg.points)) {
            var shapeAttrs = (0, get_style_1.getStyle)(cfg, true, true);
            var path = this.parsePath(getPath(cfg.points));
            return container.addShape('path', {
                attrs: tslib_1.__assign(tslib_1.__assign({}, shapeAttrs), { path: path }),
                name: 'polygon',
            });
        }
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
exports.default = PolygonShapeFactory;
//# sourceMappingURL=index.js.map