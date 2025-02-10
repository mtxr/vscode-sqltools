/**
 * @fileoverview Marker
 * @author dxq613@gmail.com
 */
import ShapeBase from './base';
declare class Marker extends ShapeBase {
    initAttrs(attrs: any): void;
    _resetParamsCache(): void;
    onAttrChange(name: string, value: any, originValue: any): void;
    isOnlyHitBox(): boolean;
    _getR(attrs: any): any;
    _getPath(): any;
    createPath(context: any): void;
    static Symbols: {
        circle(x: any, y: any, r: any): any[][];
        square(x: any, y: any, r: any): any[][];
        diamond(x: any, y: any, r: any): any[][];
        triangle(x: any, y: any, r: any): any[][];
        'triangle-down'(x: any, y: any, r: any): any[][];
    };
}
export default Marker;
