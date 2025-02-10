export interface Point {
    readonly x: number;
    readonly y: number;
}
export interface Range {
    readonly start: number;
    readonly end: number;
}
export interface CoordinateCfg {
    readonly start: Point;
    readonly end: Point;
    readonly matrix?: number[];
    readonly isTransposed?: boolean;
}
export interface PolarCfg extends CoordinateCfg {
    readonly startAngle?: number;
    readonly endAngle?: number;
    readonly innerRadius?: number;
    readonly radius?: number;
}
export interface ICoordinate {
    /** 坐标系类型 */
    readonly type: string;
    /** 是否为直角坐标系 */
    readonly isRect?: boolean;
    /** 是否为螺旋坐标系 */
    readonly isHelix?: boolean;
    /** 是否为极坐标系 */
    readonly isPolar?: boolean;
    /** 坐标系起始位置，左下角 */
    readonly start: Point;
    /** 坐标系结束位置，右上角 */
    readonly end: Point;
    /** 坐标系矩阵 */
    readonly matrix: number[];
    /** 坐标系是否发生转置 */
    readonly isTransposed: boolean;
    /** Helix, Polar 坐标系的起始角度 */
    readonly startAngle?: number;
    /** Helix, Polar 坐标系的结束角度 */
    readonly endAngle?: number;
    /** Helix, Polar 坐标系的内圆半径 */
    readonly innerRadius?: number;
    /** Helix, Polar 坐标系的半径 */
    readonly radius?: number;
    /** 坐标系 x 方向的范围 */
    readonly x: Range;
    /** 坐标系 y 方向的范围 */
    readonly y: Range;
    /** 初始化流程 */
    initial(): void;
    /** 更新配置 */
    update(cfg: CoordinateCfg): void;
    /** 转换指定维度的画布坐标 */
    convertDim(percent: number, dim: string): number;
    /** 将指定维度的画布坐标转换为 0 - 1 的值 */
    invertDim(value: number, dim: string): number;
    /** 将坐标点进行矩阵变换 */
    applyMatrix(x: number, y: number, tag: number): number[];
    /** 将坐标点进行矩阵逆变换 */
    invertMatrix(x: number, y: number, tag: number): number[];
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
    rotate(radian: number): any;
    /**
     * 坐标系反射变换
     * @param dim 反射维度
     * @return    返回坐标系对象
     */
    reflect(dim: string): any;
    /**
     * 坐标系比例变换
     * @param s1 x 方向缩放比例
     * @param s2 y 方向缩放比例
     * @return     返回坐标系对象
     */
    scale(s1: number, s2: number): any;
    /**
     * 坐标系平移变换
     * @param x x 方向平移像素
     * @param y y 方向平移像素
     * @return    返回坐标系对象
     */
    translate(x: number, y: number): any;
    /**
     * 将坐标系 x y 两个轴进行转置
     * @return 返回坐标系对象
     */
    transpose(): any;
    /** 获取坐标系中心点位置 */
    getCenter(): Point;
    /** 获取坐标系宽度 */
    getWidth(): number;
    /** 获取坐标系高度 */
    getHeight(): number;
    /** 获取坐标系半径 */
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
    resetMatrix(matrix?: number[]): any;
}
