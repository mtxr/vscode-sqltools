import { IElement, IGroup, IShape } from '../dependents';
declare const transform: (m: number[], actions: any[][]) => number[];
export { transform };
/**
 * 对元素进行平移操作。
 * @param element 进行变换的元素
 * @param x x 方向位移
 * @param y y 方向位移
 */
export declare function translate(element: IGroup | IShape, x: number, y: number): void;
/**
 * 获取元素旋转矩阵 (以元素的左上角为旋转点)
 * @param element 进行变换的元素
 * @param rotateRadian 旋转弧度
 */
export declare function getRotateMatrix(element: IElement, rotateRadian: number): number[];
/**
 * 对元素进行旋转操作。
 * @param element 进行变换的元素
 * @param rotateRadian 旋转弧度
 */
export declare function rotate(element: IGroup | IShape, rotateRadian: number): void;
/**
 * 获取元矩阵。
 * @returns identity matrix
 */
export declare function getIdentityMatrix(): number[];
/**
 * 围绕图形中心点进行缩放
 * @param element 进行缩放的图形元素
 * @param ratio 缩放比例
 */
export declare function zoom(element: IGroup | IShape, ratio: number): void;
