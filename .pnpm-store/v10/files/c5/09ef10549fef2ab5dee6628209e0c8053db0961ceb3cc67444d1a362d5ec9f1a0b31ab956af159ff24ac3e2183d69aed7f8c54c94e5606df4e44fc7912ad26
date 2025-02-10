import { ext, vec2, vec3 } from '@antv/matrix-util';
var identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export function getMatrixByAngle(point, angle, matrix) {
    if (matrix === void 0) { matrix = identityMatrix; }
    if (!angle) {
        // 角度为 0 或者 null 时返回 null
        return null;
    }
    var m = ext.transform(matrix, [
        ['t', -point.x, -point.y],
        ['r', angle],
        ['t', point.x, point.y],
    ]);
    return m;
}
export function getMatrixByTranslate(point, currentMatrix) {
    if (!point.x && !point.y) {
        // 0，0 或者 nan 的情况下返回 null
        return null;
    }
    return ext.transform(currentMatrix || identityMatrix, [['t', point.x, point.y]]);
}
// 从矩阵获取旋转的角度
export function getAngleByMatrix(matrix) {
    var xVector = [1, 0, 0];
    var out = [0, 0, 0];
    vec3.transformMat3(out, xVector, matrix);
    return Math.atan2(out[1], out[0]);
}
// 矩阵 * 向量
function multiplyVec2(matrix, v) {
    var out = [0, 0];
    vec2.transformMat3(out, v, matrix);
    return out;
}
export function applyMatrix2BBox(matrix, bbox) {
    var topLeft = multiplyVec2(matrix, [bbox.minX, bbox.minY]);
    var topRight = multiplyVec2(matrix, [bbox.maxX, bbox.minY]);
    var bottomLeft = multiplyVec2(matrix, [bbox.minX, bbox.maxY]);
    var bottomRight = multiplyVec2(matrix, [bbox.maxX, bbox.maxY]);
    var minX = Math.min(topLeft[0], topRight[0], bottomLeft[0], bottomRight[0]);
    var maxX = Math.max(topLeft[0], topRight[0], bottomLeft[0], bottomRight[0]);
    var minY = Math.min(topLeft[1], topRight[1], bottomLeft[1], bottomRight[1]);
    var maxY = Math.max(topLeft[1], topRight[1], bottomLeft[1], bottomRight[1]);
    return {
        x: minX,
        y: minY,
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY,
        width: maxX - minX,
        height: maxY - minY,
    };
}
export function applyRotate(shape, rotate, x, y) {
    if (rotate) {
        var matrix = getMatrixByAngle({ x: x, y: y }, rotate, shape.getMatrix());
        shape.setMatrix(matrix);
    }
}
export function applyTranslate(shape, x, y) {
    var translateMatrix = getMatrixByTranslate({ x: x, y: y });
    shape.attr('matrix', translateMatrix);
}
//# sourceMappingURL=matrix.js.map