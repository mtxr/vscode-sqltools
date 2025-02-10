import { get, reduce } from '@antv/util';
/**
 * 在 View 中查找第一个指定 type 类型的 geometry
 * @param view
 * @param type
 */
export function findGeometry(view, type) {
    return view.geometries.find(function (g) { return g.type === type; });
}
/**
 * 获取 View 的 所有 elements
 */
export function getAllElements(view) {
    return reduce(view.geometries, function (r, geometry) {
        return r.concat(geometry.elements);
    }, []);
}
/**
 * 递归获取 View 的 所有 elements, 包括 View 的子 View
 */
export function getAllElementsRecursively(view) {
    if (get(view, ['views', 'length'], 0) <= 0) {
        return getAllElements(view);
    }
    return reduce(view.views, function (ele, subView) {
        return ele.concat(getAllElementsRecursively(subView));
    }, getAllElements(view));
}
/**
 * 递归获取 View 的 所有 geometries, 包括 View 的子 View
 */
export function getAllGeometriesRecursively(view) {
    if (get(view, ['views', 'length'], 0) <= 0) {
        return view.geometries;
    }
    return reduce(view.views, function (ele, subView) {
        return ele.concat(subView.geometries);
    }, view.geometries);
}
//# sourceMappingURL=geometry.js.map