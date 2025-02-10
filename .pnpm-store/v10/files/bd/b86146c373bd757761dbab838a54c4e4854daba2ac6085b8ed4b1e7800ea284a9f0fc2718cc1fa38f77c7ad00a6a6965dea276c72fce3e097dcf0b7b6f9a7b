"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitInShape = void 0;
var util_1 = require("@antv/util");
/**
 * @ignore
 * 根据图形元素以及 label 的 bbox 进行调整，如果 label 超出了 shape 的 bbox 则不展示
 */
function limitInShape(items, labels, shapes, region) {
    (0, util_1.each)(labels, function (label, index) {
        var labelBBox = label.getCanvasBBox(); // 文本有可能发生旋转
        var shapeBBox = shapes[index].getBBox();
        if (labelBBox.minX < shapeBBox.minX ||
            labelBBox.minY < shapeBBox.minY ||
            labelBBox.maxX > shapeBBox.maxX ||
            labelBBox.maxY > shapeBBox.maxY) {
            label.remove(true); // 超出则不展示
        }
    });
}
exports.limitInShape = limitInShape;
//# sourceMappingURL=limit-in-shape.js.map