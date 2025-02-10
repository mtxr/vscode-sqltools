/**
 * @fileoverview marker
 * @author dengfuping_develop@163.com
 */
import ShapeBase from '../base';
declare class Marker extends ShapeBase {
    type: string;
    canFill: boolean;
    canStroke: boolean;
    static symbolsFactory: {
        get(type: string): import("./symbols").SymbolFunc;
        register(type: string, func: import("./symbols").SymbolFunc): void;
        remove(type: string): void;
        getAll(): {
            circle(x: number, y: number, r: number): any[];
            square(x: number, y: number, r: number): any[];
            diamond(x: number, y: number, r: number): any[];
            triangle(x: number, y: number, r: number): any[];
            triangleDown(x: number, y: number, r: number): any[];
        };
    };
    createPath(context: any): void;
    _assembleMarker(): string;
    _getPath(): any[];
}
export default Marker;
