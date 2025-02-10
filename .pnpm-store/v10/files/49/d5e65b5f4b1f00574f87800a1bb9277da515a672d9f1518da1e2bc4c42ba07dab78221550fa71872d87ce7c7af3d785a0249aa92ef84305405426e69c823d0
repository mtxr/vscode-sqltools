import { max, min } from '@antv/util';
/**
 * 两点之间的距离
 * @param {number} x1 起始点 x
 * @param {number} y1 起始点 y
 * @param {number} x2 结束点 x
 * @param {number} y2 结束点 y
 * @return {number} 距离
 */
export function distance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}
export function isNumberEqual(v1, v2) {
    return Math.abs(v1 - v2) < 0.001;
}
export function getBBoxByArray(xArr, yArr) {
    var minX = min(xArr);
    var minY = min(yArr);
    var maxX = max(xArr);
    var maxY = max(yArr);
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}
export function getBBoxRange(x1, y1, x2, y2) {
    return {
        minX: min([x1, x2]),
        maxX: max([x1, x2]),
        minY: min([y1, y2]),
        maxY: max([y1, y2]),
    };
}
export function piMod(angle) {
    return (angle + Math.PI * 2) % (Math.PI * 2);
}
//# sourceMappingURL=util.js.map