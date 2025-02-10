"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../base");
var get_style_1 = require("../util/get-style");
function getRectAttrs(points, size) {
    var width = Math.abs(points[0].x - points[2].x);
    var height = Math.abs(points[0].y - points[2].y);
    var len = Math.min(width, height);
    if (size) {
        len = (0, util_1.clamp)(size, 0, Math.min(width, height));
    }
    len = len / 2;
    var centerX = (points[0].x + points[2].x) / 2;
    var centerY = (points[0].y + points[2].y) / 2;
    return {
        x: centerX - len,
        y: centerY - len,
        width: len * 2,
        height: len * 2,
    };
}
(0, base_1.registerShape)('polygon', 'square', {
    draw: function (cfg, container) {
        if (!(0, util_1.isEmpty)(cfg.points)) {
            var shapeAttrs = (0, get_style_1.getStyle)(cfg, true, true);
            var points = this.parsePoints(cfg.points); // 转换为画布坐标
            return container.addShape('rect', {
                attrs: tslib_1.__assign(tslib_1.__assign({}, shapeAttrs), getRectAttrs(points, cfg.size)),
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
//# sourceMappingURL=square.js.map