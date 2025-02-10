import { CoordinateCfg, ICoordinate, Point, Range } from '../interface';
export declare type CoordinateCtor = new (cfg: any) => Coordinate;
export declare type Vector2 = [number, number];
export declare type Vector3 = [number, number, number];
export declare type Matrix3 = [number, number, number, number, number, number, number, number, number];
/**
 * Coordinate Base Class
 */
export default abstract class Coordinate implements ICoordinate {
    readonly type: string;
    readonly isRect: boolean;
    readonly isHelix: boolean;
    readonly isPolar: boolean;
    start: Point;
    end: Point;
    matrix: Matrix3;
    isTransposed: boolean;
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    radius: number;
    x: Range;
    y: Range;
    protected center: Point;
    protected width: number;
    protected height: number;
    private isReflectX;
    private isReflectY;
    private originalMatrix;
    constructor(cfg: CoordinateCfg);
    /**
     * 初始化流程
     */
    initial(): void;
    /**
     * 更新配置
     * @param cfg
     */
    update(cfg: CoordinateCfg): void;
    convertDim(percent: number, dim: string): number;
    invertDim(value: number, dim: string): number;
    /**
     * 将坐标点进行矩阵变换
     * @param x   对应 x 轴画布坐标
     * @param y   对应 y 轴画布坐标
     * @param tag 默认为 0，可取值 0, 1
     * @return    返回变换后的三阶向量 [x, y, z]
     */
    applyMatrix(x: number, y: number, tag?: number): number[];
    /**
     * 将坐标点进行矩阵逆变换
     * @param x   对应 x 轴画布坐标
     * @param y   对应 y 轴画布坐标
     * @param tag 默认为 0，可取值 0, 1
     * @return    返回矩阵逆变换后的三阶向量 [x, y, z]
     */
    invertMatrix(x: number, y: number, tag?: number): number[];
    /**
     * 将归一化的坐标点数据转换为画布坐标，并根据坐标系当前矩阵进行变换
     * @param point 归一化的坐标点
     * @return      返回进行矩阵变换后的画布坐标
     */
    convert(point: Point): Point;
    /**
     * 将进行过矩阵变换画布坐标转换为归一化坐标
     * @param point 画布坐标
     * @return      返回归一化的坐标点
     */
    invert(point: Point): Point;
    /**
     * 坐标系旋转变换
     * @param  radian 旋转弧度
     * @return        返回坐标系对象
     */
    rotate(radian: number): this;
    /**
     * 坐标系反射变换
     * @param dim 反射维度
     * @return    返回坐标系对象
     */
    reflect(dim: string): this;
    /**
     * 坐标系比例变换
     * @param s1 x 方向缩放比例
     * @param s2 y 方向缩放比例
     * @return     返回坐标系对象
     */
    scale(s1: number, s2: number): this;
    /**
     * 坐标系平移变换
     * @param x x 方向平移像素
     * @param y y 方向平移像素
     * @return    返回坐标系对象
     */
    translate(x: number, y: number): this;
    /**
     * 将坐标系 x y 两个轴进行转置
     * @return 返回坐标系对象
     */
    transpose(): this;
    getCenter(): Point;
    getWidth(): number;
    getHeight(): number;
    getRadius(): number;
    /**
     * whether has reflect
     * @param dim
     */
    isReflect(dim: string): boolean;
    /**
     * 重置 matrix
     * @param matrix 如果传入，则使用，否则使用构造函数中传入的默认 matrix
     */
    resetMatrix(matrix?: Matrix3): void;
    /**
     * 将归一化的坐标点数据转换为画布坐标
     * @param point
     */
    abstract convertPoint(point: Point): Point;
    /**
     * 画布坐标转换为归一化的坐标点数据
     * @param point
     */
    abstract invertPoint(point: Point): Point;
}
