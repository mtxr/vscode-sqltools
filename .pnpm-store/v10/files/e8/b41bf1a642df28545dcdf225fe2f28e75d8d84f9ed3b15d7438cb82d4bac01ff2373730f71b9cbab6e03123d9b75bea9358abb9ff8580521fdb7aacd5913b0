/**
 * @fileoverview 文本
 * @author dxq613@gmail.com
 */
import ShapeBase from './base';
declare class Text extends ShapeBase {
    getDefaultAttrs(): {
        x: number;
        y: number;
        text: any;
        fontSize: number;
        fontFamily: string;
        fontStyle: string;
        fontWeight: string;
        fontVariant: string;
        textAlign: string;
        textBaseline: string;
        lineWidth: number;
        lineAppendWidth: number;
        strokeOpacity: number;
        fillOpacity: number;
        matrix: any;
        opacity: number;
    };
    isOnlyHitBox(): boolean;
    initAttrs(attrs: any): void;
    _assembleFont(): void;
    _setText(text: any): void;
    onAttrChange(name: string, value: any, originValue: any): void;
    _getSpaceingY(): number;
    _drawTextArr(context: any, textArr: any, isFill: any): void;
    _drawText(context: any, isFill: any): void;
    strokeAndFill(context: any): void;
    fill(context: any): void;
    stroke(context: any): void;
}
export default Text;
