"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var line_1 = require("./line");
var arc_1 = require("./arc");
function rectWithRadius(minX, minY, width, height, radius, lineWidth, x, y) {
    var halfWidth = lineWidth / 2;
    return (line_1.default(minX + radius, minY, minX + width - radius, minY, lineWidth, x, y) ||
        line_1.default(minX + width, minY + radius, minX + width, minY + height - radius, lineWidth, x, y) ||
        line_1.default(minX + width - radius, minY + height, minX + radius, minY + height, lineWidth, x, y) ||
        line_1.default(minX, minY + height - radius, minX, minY + radius, lineWidth, x, y) ||
        arc_1.default(minX + width - radius, minY + radius, radius, 1.5 * Math.PI, 2 * Math.PI, lineWidth, x, y) ||
        arc_1.default(minX + width - radius, minY + height - radius, radius, 0, 0.5 * Math.PI, lineWidth, x, y) ||
        arc_1.default(minX + radius, minY + height - radius, radius, 0.5 * Math.PI, Math.PI, lineWidth, x, y) ||
        arc_1.default(minX + radius, minY + radius, radius, Math.PI, 1.5 * Math.PI, lineWidth, x, y));
}
exports.default = rectWithRadius;
//# sourceMappingURL=rect-radius.js.map