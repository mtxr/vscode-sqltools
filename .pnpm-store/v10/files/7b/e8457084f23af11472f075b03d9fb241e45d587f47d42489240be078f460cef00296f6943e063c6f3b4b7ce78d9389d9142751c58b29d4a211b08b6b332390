"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var g_math_1 = require("@antv/g-math");
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
    return g_math_1.Util.getBBoxByArray(xArr, yArr);
}
exports.default = default_1;
//# sourceMappingURL=polygon.js.map