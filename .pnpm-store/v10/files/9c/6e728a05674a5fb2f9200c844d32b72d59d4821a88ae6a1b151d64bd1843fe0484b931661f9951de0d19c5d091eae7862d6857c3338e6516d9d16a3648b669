/**
 * @fileoverview 椭圆的一些计算，
 *  - 周长计算参考：https://www.mathsisfun.com/geometry/ellipse-perimeter.html
 *  - 距离计算参考：https://wet-robots.ghost.io/simple-method-for-distance-to-ellipse/
 * @author dxq613@gmail.com
 */
import { Point, BBox } from './types';
declare const _default: {
    /**
     * 包围盒计算
     * @param {number} x  椭圆中心 x
     * @param {number} y  椭圆中心 y
     * @param {number} rx 椭圆 x 方向半径
     * @param {number} ry 椭圆 y 方向半径
     * @return {object} 包围盒
     */
    box(x: number, y: number, rx: number, ry: number): BBox;
    /**
     * 计算周长，使用近似法
     * @param {number} x  椭圆中心 x
     * @param {number} y  椭圆中心 y
     * @param {number} rx 椭圆 x 方向半径
     * @param {number} ry 椭圆 y 方向半径
     * @return {number} 椭圆周长
     */
    length(x: number, y: number, rx: number, ry: number): number;
    /**
     * 距离椭圆最近的点
     * @param {number} x  椭圆中心 x
     * @param {number} y  椭圆中心 y
     * @param {number} rx 椭圆 x 方向半径
     * @param {number} ry 椭圆 y 方向半径
     * @param {number} x0  指定的点 x
     * @param {number} y0  指定的点 y
     * @return {object} 椭圆上距离指定点最近的点
     */
    nearestPoint(x: number, y: number, rx: number, ry: number, x0: number, y0: number): {
        x: number;
        y: number;
    };
    /**
     * 点到椭圆最近的距离
     * @param {number} x  椭圆中心 x
     * @param {number} y  椭圆中心 y
     * @param {number} rx 椭圆 x 方向半径
     * @param {number} ry 椭圆 y 方向半径
     * @param {number} x0  指定的点 x
     * @param {number} y0  指定的点 y
     * @return {number} 点到椭圆的距离
     */
    pointDistance(x: number, y: number, rx: number, ry: number, x0: number, y0: number): number;
    /**
     * 根据比例获取点
     * @param {number} x 椭圆中心 x
     * @param {number} y 椭圆中心 y
     * @param {number} rx 椭圆 x 方向半径
     * @param {number} ry 椭圆 y 方向半径
     * @param {number} t 指定比例，x轴方向为 0
     * @return {object} 点
     */
    pointAt(x: number, y: number, rx: number, ry: number, t: number): Point;
    /**
     * 根据比例计算切线角度
     * @param {number} x 椭圆中心 x
     * @param {number} y 椭圆中心 y
     * @param {number} rx 椭圆 x 方向半径
     * @param {number} ry 椭圆 y 方向半径
     * @param {number} t 指定比例 0 - 1 之间，x轴方向为 0。在 0-1 范围之外是循环还是返回 null，还需要调整
     * @return {number} 角度，在 0 - 2PI 之间
     */
    tangentAngle(x: number, y: number, rx: number, ry: number, t: number): number;
};
export default _default;
