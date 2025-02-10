/**
 * @fileoverview polyline
 * @author dengfuping_develop@163.com
 */
import { Point } from '@antv/g-base';
import ShapeBase from './base';
declare class Polyline extends ShapeBase {
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
    onAttrChange(name: string, value: any, originValue: any): void;
    _resetCache(): void;
    createPath(context: any, targetAttrs: any): void;
    /**
     * Get length of polyline
     * @return {number} length
     */
    getTotalLength(): any;
    /**
     * Get point according to ratio
     * @param {number} ratio
     * @return {Point} point
     */
    getPoint(ratio: number): Point;
    _setTcache(): void;
    /**
     * Get start tangent vector
     * @return {Array}
     */
    getStartTangent(): number[][];
    /**
     * Get end tangent vector
     * @return {Array}
     */
    getEndTangent(): number[][];
}
export default Polyline;
