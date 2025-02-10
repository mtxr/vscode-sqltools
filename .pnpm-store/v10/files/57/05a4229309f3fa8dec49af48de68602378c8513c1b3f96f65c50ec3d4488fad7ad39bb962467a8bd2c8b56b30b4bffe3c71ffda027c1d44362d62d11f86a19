"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../base");
var get_style_1 = require("../util/get-style");
(0, base_1.registerShape)('point', 'image', {
    draw: function (cfg, container) {
        var e_1, _a;
        var size = (0, get_style_1.getStyle)(cfg, false, false, 'r').r;
        var points = this.parsePoints(cfg.points);
        var pointPosition = points[0];
        if (cfg.isStack) {
            pointPosition = points[1];
        }
        else if (points.length > 1) {
            var group = container.addGroup();
            try {
                for (var points_1 = tslib_1.__values(points), points_1_1 = points_1.next(); !points_1_1.done; points_1_1 = points_1.next()) {
                    var point = points_1_1.value;
                    group.addShape('image', {
                        attrs: {
                            x: point.x - size / 2,
                            y: point.y - size,
                            width: size,
                            height: size,
                            img: cfg.shape[1],
                        },
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (points_1_1 && !points_1_1.done && (_a = points_1.return)) _a.call(points_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return group;
        }
        return container.addShape('image', {
            attrs: {
                x: pointPosition.x - size / 2,
                y: pointPosition.y - size,
                width: size,
                height: size,
                img: cfg.shape[1],
            },
        });
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: 'circle',
            style: {
                r: 4.5,
                fill: color,
            },
        };
    },
});
//# sourceMappingURL=image.js.map