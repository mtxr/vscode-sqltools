"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeArrowBBox = exports.mergeBBox = void 0;
// 合并包围盒
function mergeBBox(bbox1, bbox2) {
    if (!bbox1 || !bbox2) {
        return bbox1 || bbox2;
    }
    return {
        minX: Math.min(bbox1.minX, bbox2.minX),
        minY: Math.min(bbox1.minY, bbox2.minY),
        maxX: Math.max(bbox1.maxX, bbox2.maxX),
        maxY: Math.max(bbox1.maxY, bbox2.maxY),
    };
}
exports.mergeBBox = mergeBBox;
// 合并箭头的包围盒
function mergeArrowBBox(shape, bbox) {
    var startArrowShape = shape.get('startArrowShape');
    var endArrowShape = shape.get('endArrowShape');
    var startArrowBBox = null;
    var endArrowBBox = null;
    if (startArrowShape) {
        startArrowBBox = startArrowShape.getCanvasBBox();
        bbox = mergeBBox(bbox, startArrowBBox);
    }
    if (endArrowShape) {
        endArrowBBox = endArrowShape.getCanvasBBox();
        bbox = mergeBBox(bbox, endArrowBBox);
    }
    return bbox;
}
exports.mergeArrowBBox = mergeArrowBBox;
//# sourceMappingURL=util.js.map