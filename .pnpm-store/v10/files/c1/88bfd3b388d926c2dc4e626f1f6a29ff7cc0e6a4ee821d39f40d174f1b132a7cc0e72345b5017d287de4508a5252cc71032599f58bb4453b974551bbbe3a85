"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var g_math_1 = require("@antv/g-math");
var util_1 = require("./util");
function default_1(shape) {
    var attrs = shape.attr();
    var points = attrs.points;
    var xArr = [];
    var yArr = [];
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        xArr.push(point[0]);
        yArr.push(point[1]);
    }
    var _a = g_math_1.Util.getBBoxByArray(xArr, yArr), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    var bbox = {
        minX: x,
        minY: y,
        maxX: x + width,
        maxY: y + height,
    };
    bbox = util_1.mergeArrowBBox(shape, bbox);
    return {
        x: bbox.minX,
        y: bbox.minY,
        width: bbox.maxX - bbox.minX,
        height: bbox.maxY - bbox.minY,
    };
}
exports.default = default_1;
//# sourceMappingURL=polyline.js.map