type Item = {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    visible?: boolean;
};
/**
 * 快速判断两个无旋转矩形是否遮挡
 */
export declare function isIntersectRect(box1: Item, box2: Item, margin?: number): boolean;
/**
 * detect whether two shape is intersected, useful when shape is been rotated
 * 判断两个矩形是否重叠（相交和包含, 是否旋转）
 *
 * - 原理: 分离轴定律
 */
export declare function intersect(box1: Item, box2: Item, margin?: number): boolean;
export {};
