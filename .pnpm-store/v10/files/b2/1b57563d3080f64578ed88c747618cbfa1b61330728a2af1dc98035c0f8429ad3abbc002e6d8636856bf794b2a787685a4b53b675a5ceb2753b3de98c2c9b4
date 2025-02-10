import { Util } from '@antv/g-math';
import { mergeArrowBBox } from './util';
export default function (shape) {
    var attrs = shape.attr();
    var points = attrs.points;
    var xArr = [];
    var yArr = [];
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        xArr.push(point[0]);
        yArr.push(point[1]);
    }
    var _a = Util.getBBoxByArray(xArr, yArr), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    var bbox = {
        minX: x,
        minY: y,
        maxX: x + width,
        maxY: y + height,
    };
    bbox = mergeArrowBBox(shape, bbox);
    return {
        x: bbox.minX,
        y: bbox.minY,
        width: bbox.maxX - bbox.minX,
        height: bbox.maxY - bbox.minY,
    };
}
//# sourceMappingURL=polyline.js.map