import { mergeArrowBBox } from './util';
export default function (shape) {
    var attrs = shape.attr();
    var x1 = attrs.x1, y1 = attrs.y1, x2 = attrs.x2, y2 = attrs.y2;
    var minX = Math.min(x1, x2);
    var maxX = Math.max(x1, x2);
    var minY = Math.min(y1, y2);
    var maxY = Math.max(y1, y2);
    var bbox = {
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
    };
    bbox = mergeArrowBBox(shape, bbox);
    return {
        x: bbox.minX,
        y: bbox.minY,
        width: bbox.maxX - bbox.minX,
        height: bbox.maxY - bbox.minY,
    };
}
//# sourceMappingURL=line.js.map