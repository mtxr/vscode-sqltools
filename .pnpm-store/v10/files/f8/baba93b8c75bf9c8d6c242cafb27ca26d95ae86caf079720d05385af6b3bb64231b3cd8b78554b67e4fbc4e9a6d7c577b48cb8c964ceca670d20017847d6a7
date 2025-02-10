/**
 * @fileoverview 图片
 * @author dxq613@gmail.com
 */
import ShapeBase from './base';
declare class ImageShape extends ShapeBase {
    getDefaultAttrs(): {
        x: number;
        y: number;
        width: number;
        height: number;
        lineWidth: number;
        lineAppendWidth: number;
        strokeOpacity: number;
        fillOpacity: number;
        matrix: any;
        opacity: number;
    };
    initAttrs(attrs: any): void;
    isStroke(): boolean;
    isOnlyHitBox(): boolean;
    _afterLoading(): void;
    _setImage(img: any): void;
    onAttrChange(name: string, value: any, originValue: any): void;
    createPath(context: CanvasRenderingContext2D): void;
}
export default ImageShape;
