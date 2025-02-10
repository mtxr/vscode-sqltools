import { Point, BBox } from './types';
declare const _default: {
    /**
     * 矩形包围盒计算
     * @param {number} x      起始点 x
     * @param {number} y      起始点 y
     * @param {number} width  宽度
     * @param {number} height 高度
     * @return {object} 包围盒
     */
    box(x: number, y: number, width: number, height: number): BBox;
    /**
     * 长度，矩形不需要传入 x, y 即可计算周长，但是避免出错
     * @param {number} x      起始点 x
     * @param {number} y      起始点 y
     * @param {number} width  宽
     * @param {number} height 高
     */
    length(x: number, y: number, width: number, height: number): number;
    /**
     * 点到矩形的最小距离
     * @param {number} x      起始点 x
     * @param {number} y      起始点 y
     * @param {number} width  宽度
     * @param {number} height 高度
     * @param {number} x0     指定点的 x
     * @param {number} y0     指定点的 y
     * @return {number} 最短距离
     */
    pointDistance(x: number, y: number, width: number, height: number, x0: number, y0: number): number;
    /**
     * 按照比例计算对应的点
     * @param {number} x      起始点 x
     * @param {number} y      起始点 y
     * @param {number} width  宽度
     * @param {number} height 高度
     * @param {number} t 比例 0-1 之间的值
     * @return {object} 计算出来的点信息，包含 x,y
     */
    pointAt(x: number, y: number, width: number, height: number, t: number): Point;
    /**
     * 获取对应点的切线角度
     * @param {number} x      起始点 x
     * @param {number} y      起始点 y
     * @param {number} width  宽度
     * @param {number} height 高度
     * @param {number} t 比例 0-1 之间的值
     * @return {number} 切线的角度
     */
    tangentAngle(x: number, y: number, width: number, height: number, t: number): number;
};
export default _default;
