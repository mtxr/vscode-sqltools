"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../base");
var constant_1 = require("../constant");
var get_style_1 = require("../util/get-style");
var util_1 = require("./util");
/** 描边柱状图 */
(0, base_1.registerShape)('interval', 'hollow-rect', {
    draw: function (cfg, container) {
        var style = (0, get_style_1.getStyle)(cfg, true, false);
        var group = container;
        var backgroundCfg = cfg === null || cfg === void 0 ? void 0 : cfg.background;
        if (backgroundCfg) {
            group = container.addGroup();
            var backgroundStyle = (0, get_style_1.getBackgroundRectStyle)(cfg);
            var backgroundPath = (0, util_1.getBackgroundRectPath)(cfg, this.parsePoints(cfg.points), this.coordinate);
            group.addShape('path', {
                attrs: tslib_1.__assign(tslib_1.__assign({}, backgroundStyle), { path: backgroundPath }),
                capture: false,
                zIndex: -1,
                name: constant_1.BACKGROUND_SHAPE,
            });
        }
        var path = this.parsePath((0, util_1.getRectPath)(cfg.points));
        var shape = group.addShape('path', {
            attrs: tslib_1.__assign(tslib_1.__assign({}, style), { path: path }),
            name: 'interval',
        });
        return backgroundCfg ? group : shape;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color, isInPolar = markerCfg.isInPolar;
        if (isInPolar) {
            return {
                symbol: 'circle',
                style: {
                    r: 4.5,
                    stroke: color,
                    fill: null,
                },
            };
        }
        return {
            symbol: 'square',
            style: {
                r: 4,
                stroke: color,
                fill: null,
            },
        };
    },
});
//# sourceMappingURL=hollow-rect.js.map