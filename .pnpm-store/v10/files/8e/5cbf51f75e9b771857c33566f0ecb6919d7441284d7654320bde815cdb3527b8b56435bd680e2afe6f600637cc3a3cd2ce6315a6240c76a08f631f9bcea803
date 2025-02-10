import { Region } from '../../../interface';
import MaskBase from './base';
export declare function getRegion(points: any): Region;
/**
 * 添加图形
 * @param points
 * @returns
 */
export declare function getMaskAttrs(start: any, end: any): {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * @ignore
 * 矩形的辅助框 Action
 */
declare class RectMask extends MaskBase {
    protected shapeType: string;
    protected getRegion(): Region;
    protected getMaskAttrs(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export default RectMask;
