import { __assign } from "tslib";
import { registerShape, Util } from '@antv/g2';
registerShape('point', 'word-cloud', {
    draw: function (cfg, group) {
        var cx = cfg.x;
        var cy = cfg.y;
        var shape = group.addShape('text', {
            attrs: __assign(__assign({}, getTextAttrs(cfg)), { x: cx, y: cy }),
        });
        var rotate = cfg.data.rotate;
        if (typeof rotate === 'number') {
            Util.rotate(shape, (rotate * Math.PI) / 180);
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