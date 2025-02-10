/**
 * @fileoverview 多边形
 * @author dxq613@gmail.com
 */
import { Point } from '@antv/g-base';
import ShapeBase from './base';
declare class PolyLine extends ShapeBase {
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
    initAttrs(attrs: any): void;
    onAttrChange(name: string, value: any, originValue: any): void;
    _resetCache(): void;
    setArrow(): void;
    isFill(): boolean;
    isInStrokeOrPath(x: any, y: any, isStroke: any, isFill: any, lineWidth: any): boolean;
    isStroke(): boolean;
    createPath(context: any): void;
    afterDrawPath(context: CanvasRenderingContext2D): void;
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
export default PolyLine;
