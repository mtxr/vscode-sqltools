"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.center = exports.justify = exports.right = exports.left = void 0;
var util_1 = require("@antv/util");
function targetDepth(d) {
    return d.target.depth;
}
function left(node) {
    return node.depth;
}
exports.left = left;
function right(node, n) {
    return n - 1 - node.height;
}
exports.right = right;
function justify(node, n) {
    return node.sourceLinks.length ? node.depth : n - 1;
}
exports.justify = justify;
function center(node) {
    return node.targetLinks.length ? node.depth : node.sourceLinks.length ? (0, util_1.minBy)(node.sourceLinks, targetDepth) - 1 : 0;
}
exports.center = center;
//# sourceMappingURL=align.js.map