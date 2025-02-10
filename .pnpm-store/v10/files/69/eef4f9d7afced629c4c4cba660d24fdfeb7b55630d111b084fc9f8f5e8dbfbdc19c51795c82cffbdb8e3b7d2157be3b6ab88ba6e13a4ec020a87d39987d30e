/**
 * @fileoverview path
 * @author dxq613@gmail.com
 */
import { Point } from '@antv/g-base';
import ShapeBase from './base';
declare class Path extends ShapeBase {
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
    _setPathArr(path: any): void;
    getSegments(): any;
    setArrow(): void;
    isInStrokeOrPath(x: any, y: any, isStroke: any, isFill: any, lineWidth: any): boolean;
    createPath(context: any): void;
    afterDrawPath(context: CanvasRenderingContext2D): void;
    /**
     * Get total length of path
     * @return {number} length
     */
    getTotalLength(): any;
    /**
     * Get point according to ratio
     * @param {number} ratio
     * @return {Point} point
     */
    getPoint(ratio: number): Point;
    _calculateCurve(): void;
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
export default Path;
