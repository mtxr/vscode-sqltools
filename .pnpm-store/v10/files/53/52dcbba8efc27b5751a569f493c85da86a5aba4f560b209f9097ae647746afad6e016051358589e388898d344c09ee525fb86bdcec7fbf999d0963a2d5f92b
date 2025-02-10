"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../base");
var get_path_points_1 = require("../util/get-path-points");
var get_style_1 = require("../util/get-style");
function normalizeSize(arr) {
    if (!(0, util_1.isArray)(arr)) {
        return [];
    }
    var maxValue = (0, util_1.max)(arr);
    return (0, util_1.map)(arr, function (num) { return num / maxValue; });
}
var ViolinShapeFactory = (0, base_1.registerShapeFactory)('violin', {
    defaultShapeType: 'violin',
    getDefaultPoints: function (pointInfo) {
        var radius = pointInfo.size / 2;
        var points = [];
        var sizeArr = normalizeSize(pointInfo._size);
        (0, util_1.each)(pointInfo.y, function (y, index) {
            var offset = sizeArr[index] * radius;
            var isMin = index === 0;
            var isMax = index === pointInfo.y.length - 1;
            points.push({
                isMin: isMin,
                isMax: isMax,
                x: pointInfo.x - offset,
                y: y,
            });
            points.unshift({
                isMin: isMin,
                isMax: isMax,
                x: pointInfo.x + offset,
                y: y,
            });
        });
        return points;
    },
});
(0, base_1.registerShape)('violin', 'violin', {
    draw: function (cfg, container) {
        var shapeAttrs = (0, get_style_1.getStyle)(cfg, true, true);
        var path = this.parsePath((0, get_path_points_1.getViolinPath)(cfg.points));
        return container.addShape('path', {
            attrs: tslib_1.__assign(tslib_1.__assign({}, shapeAttrs), { path: path }),
            name: 'violin',
        });
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: 'circle',
            style: {
                r: 4,
                fill: color,
            },
        };
    },
});
exports.default = ViolinShapeFactory;
//# sourceMappingURL=index.js.map