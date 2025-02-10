"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawPoints = exports.HOLLOW_SHAPES = exports.SHAPES = void 0;
var tslib_1 = require("tslib");
var marker_1 = require("../../../util/marker");
var get_style_1 = require("../util/get-style");
exports.SHAPES = ['circle', 'square', 'bowtie', 'diamond', 'hexagon', 'triangle', 'triangle-down'];
exports.HOLLOW_SHAPES = ['cross', 'tick', 'plus', 'hyphen', 'line'];
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
function drawPoints(shape, cfg, container, shapeName, isStroke) {
    var e_1, _a;
    var style = (0, get_style_1.getStyle)(cfg, isStroke, !isStroke, 'r');
    var points = shape.parsePoints(cfg.points);
    var pointPosition = points[0];
    if (cfg.isStack) {
        pointPosition = points[1];
    }
    else if (points.length > 1) {
        var group = container.addGroup();
        try {
            for (var points_1 = tslib_1.__values(points), points_1_1 = points_1.next(); !points_1_1.done; points_1_1 = points_1.next()) {
                var point = points_1_1.value;
                group.addShape({
                    type: 'marker',
                    attrs: tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, style), { symbol: marker_1.MarkerSymbols[shapeName] || shapeName }), point),
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
        attrs: tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, style), { symbol: marker_1.MarkerSymbols[shapeName] || shapeName }), pointPosition),
    });
}
exports.drawPoints = drawPoints;
//# sourceMappingURL=util.js.map