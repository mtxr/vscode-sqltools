import { __assign, __values } from "tslib";
import { MarkerSymbols } from '../../../util/marker';
import { getStyle } from '../util/get-style';
export var SHAPES = ['circle', 'square', 'bowtie', 'diamond', 'hexagon', 'triangle', 'triangle-down'];
export var HOLLOW_SHAPES = ['cross', 'tick', 'plus', 'hyphen', 'line'];
/**
 * @ignore
 * Draws points
 * @param shape
 * @param cfg
 * @param container
 * @param shapeName
 * @param isStroke
 * @returns points
 */
export function drawPoints(shape, cfg, container, shapeName, isStroke) {
    var e_1, _a;
    var style = getStyle(cfg, isStroke, !isStroke, 'r');
    var points = shape.parsePoints(cfg.points);
    var pointPosition = points[0];
    if (cfg.isStack) {
        pointPosition = points[1];
    }
    else if (points.length > 1) {
        var group = container.addGroup();
        try {
            for (var points_1 = __values(points), points_1_1 = points_1.next(); !points_1_1.done; points_1_1 = points_1.next()) {
                var point = points_1_1.value;
                group.addShape({
                    type: 'marker',
                    attrs: __assign(__assign(__assign({}, style), { symbol: MarkerSymbols[shapeName] || shapeName }), point),
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
    return container.addShape({
        type: 'marker',
        attrs: __assign(__assign(__assign({}, style), { symbol: MarkerSymbols[shapeName] || shapeName }), pointPosition),
    });
}
//# sourceMappingURL=util.js.map