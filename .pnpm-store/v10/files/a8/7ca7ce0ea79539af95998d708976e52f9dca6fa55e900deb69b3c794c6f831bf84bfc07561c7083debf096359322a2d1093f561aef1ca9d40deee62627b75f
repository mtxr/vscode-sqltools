"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
(0, g2_1.registerShape)('point', 'word-cloud', {
    draw: function (cfg, group) {
        var cx = cfg.x;
        var cy = cfg.y;
        var shape = group.addShape('text', {
            attrs: tslib_1.__assign(tslib_1.__assign({}, getTextAttrs(cfg)), { x: cx, y: cy }),
        });
        var rotate = cfg.data.rotate;
        if (typeof rotate === 'number') {
            g2_1.Util.rotate(shape, (rotate * Math.PI) / 180);
        }
        return shape;
    },
});
function getTextAttrs(cfg) {
    return {
        fontSize: cfg.data.size,
        text: cfg.data.text,
        textAlign: 'center',
        fontFamily: cfg.data.font,
        fontWeight: cfg.data.weight,
        fill: cfg.color || cfg.defaultStyle.stroke,
        textBaseline: 'alphabetic',
    };
}
//# sourceMappingURL=word-cloud.js.map