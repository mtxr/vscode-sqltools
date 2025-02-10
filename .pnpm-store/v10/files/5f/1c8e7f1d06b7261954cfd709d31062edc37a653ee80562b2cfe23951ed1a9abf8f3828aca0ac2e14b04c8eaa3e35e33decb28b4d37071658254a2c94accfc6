"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGeometriesRecursively = exports.getAllElementsRecursively = exports.getAllElements = exports.findGeometry = void 0;
var util_1 = require("@antv/util");
/**
 * 在 View 中查找第一个指定 type 类型的 geometry
 * @param view
 * @param type
 */
function findGeometry(view, type) {
    return view.geometries.find(function (g) { return g.type === type; });
}
exports.findGeometry = findGeometry;
/**
 * 获取 View 的 所有 elements
 */
function getAllElements(view) {
    return (0, util_1.reduce)(view.geometries, function (r, geometry) {
        return r.concat(geometry.elements);
    }, []);
}
exports.getAllElements = getAllElements;
/**
 * 递归获取 View 的 所有 elements, 包括 View 的子 View
 */
function getAllElementsRecursively(view) {
    if ((0, util_1.get)(view, ['views', 'length'], 0) <= 0) {
        return getAllElements(view);
    }
    return (0, util_1.reduce)(view.views, function (ele, subView) {
        return ele.concat(getAllElementsRecursively(subView));
    }, getAllElements(view));
}
exports.getAllElementsRecursively = getAllElementsRecursively;
/**
 * 递归获取 View 的 所有 geometries, 包括 View 的子 View
 */
function getAllGeometriesRecursively(view) {
    if ((0, util_1.get)(view, ['views', 'length'], 0) <= 0) {
        return view.geometries;
    }
    return (0, util_1.reduce)(view.views, function (ele, subView) {
        return ele.concat(subView.geometries);
    }, view.geometries);
}
exports.getAllGeometriesRecursively = getAllGeometriesRecursively;
//# sourceMappingURL=geometry.js.map