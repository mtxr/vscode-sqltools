/**
 * @file utils of label
 */
import { IElement, IGroup, BBox } from '../../../dependents';
/**
 * 查找 Label Group 中的文本 shape 对象
 * @param label
 */
export declare function findLabelTextShape(label: IGroup): IElement;
/**
 * 获取标签背景信息: box (无旋转) + rotation (旋转角度)
 */
export declare function getLabelBackgroundInfo(labelGroup: IGroup, labelItem: {
    rotate?: number;
    [key: string]: any;
}, padding?: number | number[]): {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
};
/**
 * 计算两个矩形之间的堆叠区域面积
 */
export declare function getOverlapArea(a: BBox, b: BBox, margin?: number): number;
/** 检测是否和已布局的堆叠 */
export declare function checkShapeOverlap(cur: IElement, dones: IElement[]): boolean;
