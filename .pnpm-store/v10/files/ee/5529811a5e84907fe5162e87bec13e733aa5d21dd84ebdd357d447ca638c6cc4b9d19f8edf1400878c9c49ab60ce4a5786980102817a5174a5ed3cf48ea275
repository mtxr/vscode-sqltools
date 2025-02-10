/**
 * @fileoverview path
 * @author dengfuping_develop@163.com
 */
import { Point } from '@antv/g-base';
import ShapeBase from './base';
declare class Path extends ShapeBase {
    type: string;
    canFill: boolean;
    canStroke: boolean;
    getDefaultAttrs(): {
        startArrow: boolean;
        endArrow: boolean;
        lineWidth: number;
        lineAppendWidth: number;
        strokeOpacity: number;
        fillOpacity: number;
        matrix: any;
        opacity: number;
    };
    createPath(context: any, targetAttrs: any): void;
    _formatPath(value: any): any;
    /**
     * Get total length of path
     * 尽管通过浏览器的 SVGPathElement.getTotalLength() 接口获取的 path 长度，
     * 与 Canvas 版本通过数学计算的方式得到的长度有一些细微差异，但最大误差在个位数像素，精度上可以能接受
     * @return {number} length
     */
    getTotalLength(): any;
    /**
     * Get point according to ratio
     * @param {number} ratio
     * @return {Point} point
     */
    getPoint(ratio: number): Point;
}
export default Path;
