import { __assign } from "tslib";
import { registerShape } from '@antv/g2';
registerShape('polygon', 'circle', {
    draw: function (cfg, group) {
        var _a, _b;
        var cx = cfg.x;
        var cy = cfg.y;
        var points = this.parsePoints(cfg.points);
        var width = Math.abs(points[2].x - points[1].x);
        var height = Math.abs(points[1].y - points[0].y);
        var maxRadius = Math.min(width, height) / 2;
        var value = Number(cfg.shape[1]);
        var sizeRatio = Number(cfg.shape[2]);
        var radiusRatio = Math.sqrt(sizeRatio);
        var radius = maxRadius * radiusRatio * Math.sqrt(value);
        var fill = ((_a = cfg.style) === null || _a === void 0 ? void 0 : _a.fill) || cfg.color || ((_b = cfg.defaultStyle) === null || _b === void 0 ? void 0 : _b.fill);
        var polygon = group.addShape('circle', {
            attrs: __assign(__assign(__assign({ x: cx, y: cy, r: radius }, cfg.defaultStyle), cfg.style), { fill: fill }),
        });
        return polygon;
    },
});
//# sourceMappingURL=circle.js.map