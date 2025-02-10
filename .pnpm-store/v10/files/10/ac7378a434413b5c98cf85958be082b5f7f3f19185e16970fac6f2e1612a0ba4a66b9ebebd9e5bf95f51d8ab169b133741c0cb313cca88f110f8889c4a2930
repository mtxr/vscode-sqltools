"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
function inRect(minX, minY, width, height, lineWidth, x, y) {
    var halfWidth = lineWidth / 2;
    // 将四个边看做矩形来检测，比边的检测算法要快
    return (util_1.inBox(minX - halfWidth, minY - halfWidth, width, lineWidth, x, y) || // 上边
        util_1.inBox(minX + width - halfWidth, minY - halfWidth, lineWidth, height, x, y) || // 右边
        util_1.inBox(minX + halfWidth, minY + height - halfWidth, width, lineWidth, x, y) || // 下边
        util_1.inBox(minX - halfWidth, minY + halfWidth, lineWidth, height, x, y)); // 左边
}
exports.default = inRect;
//# sourceMappingURL=rect.js.map