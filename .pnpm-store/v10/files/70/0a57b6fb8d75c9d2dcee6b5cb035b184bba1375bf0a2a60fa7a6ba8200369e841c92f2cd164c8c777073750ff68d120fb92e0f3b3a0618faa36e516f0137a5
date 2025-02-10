"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
function arc(cx, cy, r, startAngle, endAngle, lineWidth, x, y) {
    var angle = (Math.atan2(y - cy, x - cx) + Math.PI * 2) % (Math.PI * 2); // 转换到 0 - 2 * Math.PI 之间
    if (angle < startAngle || angle > endAngle) {
        return false;
    }
    var point = {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
    };
    return util_1.distance(point.x, point.y, x, y) <= lineWidth / 2;
}
exports.default = arc;
//# sourceMappingURL=arc.js.map