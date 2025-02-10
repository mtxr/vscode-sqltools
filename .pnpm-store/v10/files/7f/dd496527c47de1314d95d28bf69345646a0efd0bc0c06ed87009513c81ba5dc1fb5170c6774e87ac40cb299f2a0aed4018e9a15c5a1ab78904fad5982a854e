import { __assign } from "tslib";
import { isEmpty, clamp } from '@antv/util';
import { registerShape } from '../base';
import { getStyle } from '../util/get-style';
function getRectAttrs(points, size) {
    var width = Math.abs(points[0].x - points[2].x);
    var height = Math.abs(points[0].y - points[2].y);
    var len = Math.min(width, height);
    if (size) {
        len = clamp(size, 0, Math.min(width, height));
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
registerShape('polygon', 'square', {
    draw: function (cfg, container) {
        if (!isEmpty(cfg.points)) {
            var shapeAttrs = getStyle(cfg, true, true);
            var points = this.parsePoints(cfg.points); // 转换为画布坐标
            return container.addShape('rect', {
                attrs: __assign(__assign({}, shapeAttrs), getRectAttrs(points, cfg.size)),
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