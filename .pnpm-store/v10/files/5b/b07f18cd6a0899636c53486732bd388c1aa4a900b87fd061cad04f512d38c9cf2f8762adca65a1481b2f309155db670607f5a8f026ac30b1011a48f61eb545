"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intervalAdjustPosition = void 0;
var bbox_1 = require("../../../../util/bbox");
var util_1 = require("../../util");
function shouldInShapeSingle(geometry, label, shape) {
    var coordinate = geometry.coordinate;
    var textShape = (0, util_1.findLabelTextShape)(label);
    var textBBox = bbox_1.BBox.fromObject(textShape.getCanvasBBox());
    var shapeBBox = bbox_1.BBox.fromObject(shape.getBBox());
    return coordinate.isTransposed ? shapeBBox.height >= textBBox.height : shapeBBox.width >= textBBox.width;
}
function shouldInShape(geometry, labels, shapes) {
    var isStack = !!geometry.getAdjust('stack');
    return (isStack ||
        labels.every(function (label, index) {
            var shape = shapes[index];
            return shouldInShapeSingle(geometry, label, shape);
        }));
}
function moveInShape(geometry, label, shape) {
    var coordinate = geometry.coordinate;
    var shapeBBox = bbox_1.BBox.fromObject(shape.getBBox());
    var textShape = (0, util_1.findLabelTextShape)(label);
    if (coordinate.isTransposed) {
        // 水平方向：条形图系列
        textShape.attr({
            x: shapeBBox.minX + shapeBBox.width / 2,
            textAlign: 'center',
        });
    }
    else {
        // 垂直方向：柱形图系列
        textShape.attr({
            y: shapeBBox.minY + shapeBBox.height / 2,
            textBaseline: 'middle',
        });
    }
}
/**
 * 适用于 interval geometry 的数据标签位置自动调整布局方法
 * @param items
 * @param labels
 * @param shapes
 */
function intervalAdjustPosition(items, labels, shapes) {
    var _a;
    if (shapes.length === 0) {
        return;
    }
    var element = (_a = shapes[0]) === null || _a === void 0 ? void 0 : _a.get('element');
    var geometry = element === null || element === void 0 ? void 0 : element.geometry;
    if (!geometry || geometry.type !== 'interval') {
        return;
    }
    var inShape = shouldInShape(geometry, labels, shapes);
    if (inShape) {
        shapes.forEach(function (shape, index) {
            var label = labels[index];
            moveInShape(geometry, label, shape);
        });
    }
}
exports.intervalAdjustPosition = intervalAdjustPosition;
//# sourceMappingURL=adjust-position.js.map