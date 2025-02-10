import ShapeBase from './base';
declare class Line extends ShapeBase {
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
    initAttrs(attrs: any): void;
    onAttrChange(name: string, value: any, originValue: any): void;
    setArrow(): void;
    isInStrokeOrPath(x: any, y: any, isStroke: any, isFill: any, lineWidth: any): boolean;
    createPath(context: any): void;
    afterDrawPath(context: any): void;
    /**
     * Get length of line
     * @return {number} length
     */
    getTotalLength(): number;
    /**
     * Get point according to ratio
     * @param {number} ratio
     * @return {Point} point
     */
    getPoint(ratio: number): import("@antv/g-math/lib/types").Point;
}
export default Line;
