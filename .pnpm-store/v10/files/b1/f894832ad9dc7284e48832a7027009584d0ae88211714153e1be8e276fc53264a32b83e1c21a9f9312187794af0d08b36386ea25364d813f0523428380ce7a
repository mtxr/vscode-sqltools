import { __assign, __rest } from "tslib";
import { Path } from '../shape';
var sin = Math.sin, cos = Math.cos, atan2 = Math.atan2, PI = Math.PI;
function _addDefaultArrow(shape, attrs, x1, y1, x2, y2, isStart) {
    var stroke = attrs.stroke, lineWidth = attrs.lineWidth;
    var x = x1 - x2;
    var y = y1 - y2;
    var rad = atan2(y, x);
    var arrowShape = new Path({
        type: 'path',
        canvas: shape.get('canvas'),
        isArrowShape: true,
        attrs: {
            // 默认箭头的边长为 10，夹角为 60 度
            path: "M" + 10 * cos(PI / 6) + "," + 10 * sin(PI / 6) + " L0,0 L" + 10 * cos(PI / 6) + ",-" + 10 * sin(PI / 6),
            // 使用 shape stroke 值
            stroke: stroke,
            lineWidth: lineWidth,
        },
    });
    arrowShape.translate(x2, y2);
    arrowShape.rotateAtPoint(x2, y2, rad);
    shape.set(isStart ? 'startArrowShape' : 'endArrowShape', arrowShape);
}
/**
 * 箭头 path 的设置要求
 * 1. 箭头顶点坐标需要为 (0, 0)
 * 2. 箭头夹角的中心分割线需要与 X 轴正方向对齐
 */
function _addCustomizedArrow(shape, attrs, x1, y1, x2, y2, isStart) {
    var startArrow = attrs.startArrow, endArrow = attrs.endArrow, stroke = attrs.stroke, lineWidth = attrs.lineWidth;
    var arrowAttrs = isStart ? startArrow : endArrow;
    var d = arrowAttrs.d, arrowFill = arrowAttrs.fill, arrowStroke = arrowAttrs.stroke, arrowLineWidth = arrowAttrs.lineWidth, restAttrs = __rest(arrowAttrs, ["d", "fill", "stroke", "lineWidth"]);
    var x = x1 - x2;
    var y = y1 - y2;
    var rad = atan2(y, x);
    if (d) {
        x2 = x2 - cos(rad) * d;
        y2 = y2 - sin(rad) * d;
    }
    var arrowShape = new Path({
        type: 'path',
        canvas: shape.get('canvas'),
        isArrowShape: true,
        attrs: __assign(__assign({}, restAttrs), { 
            // 支持单独设置箭头的 stroke 和 lineWidth，若为空则使用 shape 的值
            stroke: arrowStroke || stroke, lineWidth: arrowLineWidth || lineWidth, 
            // 箭头是否填充需要手动设置，不会继承自 shape 的值
            fill: arrowFill }),
    });
    arrowShape.translate(x2, y2);
    arrowShape.rotateAtPoint(x2, y2, rad);
    shape.set(isStart ? 'startArrowShape' : 'endArrowShape', arrowShape);
}
/**
 * 如果自定义箭头并且有 d 需要做偏移，如果直接画，线条会超出箭头尖端，因此需要根据箭头偏移 d, 返回线需要缩短的距离
 * |----------------
 * |<|--------------
 * |
 * @param {number} x1 起始点 x
 * @param {number} y1 起始点 y
 * @param {number} x2 箭头作用点 x
 * @param {number} y2 箭头作用点 y
 * @param {number} d  箭头沿线条方向的偏移距离
 * @return {{dx: number, dy: number}} 返回线条偏移距离
 */
export function getShortenOffset(x1, y1, x2, y2, d) {
    var rad = atan2(y2 - y1, x2 - x1);
    return {
        dx: cos(rad) * d,
        dy: sin(rad) * d,
    };
}
/**
 * 绘制起始箭头
 * @param {IShape} shape 图形
 * @param {ShapeAttrs} attrs shape 的绘图属性
 * @param {number} x1 起始点 x
 * @param {number} y1 起始点 y
 * @param {number} x2 箭头作用点 x
 * @param {number} y2 箭头作用点 y
 */
export function addStartArrow(shape, attrs, x1, y1, x2, y2) {
    if (typeof attrs.startArrow === 'object') {
        _addCustomizedArrow(shape, attrs, x1, y1, x2, y2, true);
    }
    else if (attrs.startArrow) {
        _addDefaultArrow(shape, attrs, x1, y1, x2, y2, true);
    }
    else {
        shape.set('startArrowShape', null);
    }
}
/**
 * 绘制结束箭头
 * @param {IShape} shape 图形
 * @param {ShapeAttrs} attrs shape 的绘图属性
 * @param {number} x1 起始点 x
 * @param {number} y1 起始点 y
 * @param {number} x2 箭头作用点 x
 * @param {number} y2 箭头作用点 y
 */
export function addEndArrow(shape, attrs, x1, y1, x2, y2) {
    if (typeof attrs.endArrow === 'object') {
        _addCustomizedArrow(shape, attrs, x1, y1, x2, y2, false);
    }
    else if (attrs.endArrow) {
        _addDefaultArrow(shape, attrs, x1, y1, x2, y2, false);
    }
    else {
        shape.set('startArrowShape', null);
    }
}
//# sourceMappingURL=arrow.js.map