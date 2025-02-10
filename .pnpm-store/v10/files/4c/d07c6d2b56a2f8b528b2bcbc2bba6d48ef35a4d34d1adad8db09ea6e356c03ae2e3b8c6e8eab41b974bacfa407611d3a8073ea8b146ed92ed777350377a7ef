"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQPath = exports.getCPath = void 0;
var util_1 = require("@antv/util");
/**
 * @ignore
 * Gets cpath
 * @param from
 * @param to
 * @returns
 */
function getCPath(from, to) {
    return ['C', (from.x * 1) / 2 + (to.x * 1) / 2, from.y, (from.x * 1) / 2 + (to.x * 1) / 2, to.y, to.x, to.y];
}
exports.getCPath = getCPath;
/**
 * @ignore
 * Gets qpath
 * @param to
 * @param center
 * @returns
 */
function getQPath(to, center) {
    var points = [];
    points.push({
        x: center.x,
        y: center.y,
    });
    points.push(to);
    var sub = ['Q'];
    (0, util_1.each)(points, function (point) {
        sub.push(point.x, point.y);
    });
    return sub;
}
exports.getQPath = getQPath;
//# sourceMappingURL=util.js.map