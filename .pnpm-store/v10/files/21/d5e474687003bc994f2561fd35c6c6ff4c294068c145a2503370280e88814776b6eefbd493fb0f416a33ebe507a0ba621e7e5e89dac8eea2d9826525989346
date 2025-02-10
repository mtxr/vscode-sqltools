import { Point, BBox } from './types';
declare const _default: {
    /**
     * 计算包围盒
     * @param {number} cx         圆心 x
     * @param {number} cy         圆心 y
     * @param {number} rx         x 轴方向的半径
     * @param {number} ry         y 轴方向的半径
     * @param {number} xRotation  旋转角度
     * @param {number} startAngle 起始角度
     * @param {number} endAngle   结束角度
     * @return {object} 包围盒对象
     */
    box(cx: number, cy: number, rx: number, ry: number, xRotation: number, startAngle: number, endAngle: number): BBox;
    /**
     * 获取圆弧的长度，计算圆弧长度时不考虑旋转角度，
     * 仅跟 rx, ry, startAngle, endAngle 相关
     * @param {number} cx         圆心 x
     * @param {number} cy         圆心 y
     * @param {number} rx         x 轴方向的半径
     * @param {number} ry         y 轴方向的半径
     * @param {number} xRotation  旋转角度
     * @param {number} startAngle 起始角度
     * @param {number} endAngle   结束角度
     */
    length(cx: number, cy: number, rx: number, ry: number, xRotation: number, startAngle: number, endAngle: number): void;
    /**
     * 获取指定点到圆弧的最近距离的点
     * @param {number} cx         圆心 x
     * @param {number} cy         圆心 y
     * @param {number} rx         x 轴方向的半径
     * @param {number} ry         y 轴方向的半径
     * @param {number} xRotation  旋转角度
     * @param {number} startAngle 起始角度
     * @param {number} endAngle   结束角度
     * @param {number} x0         指定点的 x
     * @param {number} y0         指定点的 y
     * @return {object} 到指定点最近距离的点
     */
    nearestPoint(cx: number, cy: number, rx: number, ry: number, xRotation: number, startAngle: number, endAngle: number, x0: number, y0: number): {
        x: number;
        y: number;
    };
    pointDistance(cx: number, cy: number, rx: number, ry: number, xRotation: number, startAngle: number, endAngle: number, x0: number, y0: number): number;
    pointAt(cx: number, cy: number, rx: number, ry: number, xRotation: number, startAngle: number, endAngle: number, t: number): Point;
    tangentAngle(cx: number, cy: number, rx: number, ry: number, xRotation: number, startAngle: number, endAngle: number, t: number): number;
};
export default _default;
