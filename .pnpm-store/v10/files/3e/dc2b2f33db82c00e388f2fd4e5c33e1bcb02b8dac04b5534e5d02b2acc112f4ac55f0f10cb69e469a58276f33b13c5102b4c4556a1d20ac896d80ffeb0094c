import { each } from '@antv/util';
/**
 * @ignore
 * Gets cpath
 * @param from
 * @param to
 * @returns
 */
export function getCPath(from, to) {
    return ['C', (from.x * 1) / 2 + (to.x * 1) / 2, from.y, (from.x * 1) / 2 + (to.x * 1) / 2, to.y, to.x, to.y];
}
/**
 * @ignore
 * Gets qpath
 * @param to
 * @param center
 * @returns
 */
export function getQPath(to, center) {
    var points = [];
    points.push({
        x: center.x,
        y: center.y,
    });
    points.push(to);
    var sub = ['Q'];
    each(points, function (point) {
        sub.push(point.x, point.y);
    });
    return sub;
}
//# sourceMappingURL=util.js.map