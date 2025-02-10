"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var line_1 = require("./line");
function inPolyline(points, lineWidth, x, y, isClose) {
    var count = points.length;
    if (count < 2) {
        return false;
    }
    for (var i = 0; i < count - 1; i++) {
        var x1 = points[i][0];
        var y1 = points[i][1];
        var x2 = points[i + 1][0];
        var y2 = points[i + 1][1];
        if (line_1.default(x1, y1, x2, y2, lineWidth, x, y)) {
            return true;
        }
    }
    // 如果封闭，则计算起始点和结束点的边
    if (isClose) {
        var first = points[0];
        var last = points[count - 1];
        if (line_1.default(first[0], first[1], last[0], last[1], lineWidth, x, y)) {
            return true;
        }
    }
    return false;
}
exports.default = inPolyline;
//# sourceMappingURL=polyline.js.map