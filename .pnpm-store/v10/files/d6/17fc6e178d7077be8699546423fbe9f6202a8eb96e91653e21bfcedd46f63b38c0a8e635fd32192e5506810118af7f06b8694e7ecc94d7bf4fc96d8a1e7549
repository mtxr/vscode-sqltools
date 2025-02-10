"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../base");
var get_path_points_1 = require("../util/get-path-points");
var get_style_1 = require("../util/get-style");
/**
 * 空心小提琴图
 */
(0, base_1.registerShape)('violin', 'hollow', {
    draw: function (cfg, container) {
        var attrs = (0, get_style_1.getStyle)(cfg, true, false);
        var path = this.parsePath((0, get_path_points_1.getViolinPath)(cfg.points));
        return container.addShape('path', {
            attrs: tslib_1.__assign(tslib_1.__assign({}, attrs), { path: path }),
        });
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: 'circle',
            style: {
                r: 4,
                fill: null,
                stroke: color,
            },
        };
    },
});
/**
 * 平滑边界的空心小提琴图
 */
(0, base_1.registerShape)('violin', 'hollow-smooth', {
    draw: function (cfg, container) {
        var attrs = (0, get_style_1.getStyle)(cfg, true, false);
        var path = this.parsePath((0, get_path_points_1.getSmoothViolinPath)(cfg.points));
        return container.addShape('path', {
            attrs: tslib_1.__assign(tslib_1.__assign({}, attrs), { path: path }),
        });
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: 'circle',
            style: {
                r: 4,
                fill: null,
                stroke: color,
            },
        };
    },
});
//# sourceMappingURL=hollow.js.map