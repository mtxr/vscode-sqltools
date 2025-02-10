import { Coordinate, IGroup, IShape } from '../../dependents';
import { GAnimateCfg, Point } from '../../interface';
/**
 * @ignore
 * 对图形元素进行矩阵变换，同时返回变换前的图形矩阵
 * @param shape 进行矩阵变换的图形
 * @param vector 矩阵变换的中心点
 * @param direct 矩阵变换的类型
 */
export declare function transformShape(shape: IShape | IGroup, vector: [number, number], direct: string): number[];
/**
 * 对图形元素进行剪切动画
 * @param element 进行动画的图形元素
 * @param animateCfg 动画配置
 * @param coordinate 当前坐标系
 * @param yMinPoint y 轴的最小值对应的图形坐标点
 * @param type 剪切动画的类型
 */
export declare function doScaleAnimate(element: IGroup | IShape, animateCfg: GAnimateCfg, coordinate: Coordinate, yMinPoint: Point, type: string): void;
