import ShapeBase from './base';
declare class Line extends ShapeBase {
    type: string;
    canFill: boolean;
    canStroke: boolean;
    getDefaultAttrs(): {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
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
    /**
     * Use math calculation to get length of line
     * @return {number} length
     */
    getTotalLength(): number;
    /**
     * Use math calculation to get point according to ratio as same sa Canvas version
     * @param {number} ratio
     * @return {Point} point
     */
    getPoint(ratio: number): import("@antv/g-math/lib/types").Point;
}
export default Line;
