import { BBox, Point } from './types';
declare const _default: {
    /**
     * 计算包围盒
     * @param {number} x 圆心 x
     * @param {number} y 圆心 y
     * @param {number} r 半径
     * @return {object} 包围盒
     */
    box(x: number, y: number, r: number): BBox;
    /**
     * 计算周长
     * @param {number} x 圆心 x
     * @param {number} y 圆心 y
     * @param {number} r 半径
     * @return {number} 周长
     */
    length(x: number, y: number, r: number): number;
    /**
     * 根据比例获取点
     * @param {number} x 圆心 x
     * @param {number} y 圆心 y
     * @param {number} r 半径
     * @param {number} t 指定比例，x轴方向为 0
     * @return {object} 点
     */
    pointAt(x: number, y: number, r: number, t: number): Point;
    /**
     * 点到圆的距离
     * @param {number} x 圆心 x
     * @param {number} y 圆心 y
     * @param {number} r 半径
     * @param {number} x0  指定的点 x
     * @param {number} y0  指定的点 y
     * @return {number} 距离
     */
    pointDistance(x: number, y: number, r: number, x0: number, y0: number): number;
    /**
     * 根据比例计算切线角度
     * @param {number} x 圆心 x
     * @param {number} y 圆心 y
     * @param {number} r 半径
     * @param {number} t 指定比例 0 - 1 之间，x轴方向为 0。在 0-1 范围之外是循环还是返回 null，还需要调整
     * @return {number} 角度，在 0 - 2PI 之间
     */
    tangentAngle(x: number, y: number, r: number, t: any): number;
};
export default _default;
