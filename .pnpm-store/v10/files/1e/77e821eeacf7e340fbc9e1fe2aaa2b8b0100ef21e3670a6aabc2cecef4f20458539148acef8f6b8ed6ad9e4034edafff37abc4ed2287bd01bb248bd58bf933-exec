import { ext, mat3, vec3 } from '@antv/matrix-util';
import { assign } from '@antv/util';
import { CoordinateCfg, ICoordinate, Point, Range } from '../interface';

export type CoordinateCtor = new (cfg: any) => Coordinate;
export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
export type Matrix3 = [number, number, number, number, number, number, number, number, number];

/**
 * Coordinate Base Class
 */
export default abstract class Coordinate implements ICoordinate {
  // 自身属性
  public readonly type: string = 'coordinate';
  public readonly isRect: boolean = false;
  public readonly isHelix: boolean = false;
  public readonly isPolar: boolean = false;

  // 外部属性
  public start: Point;
  public end: Point;
  public matrix: Matrix3;
  public isTransposed: boolean;

  // 极坐标下的属性
  public startAngle: number;
  public endAngle: number;
  public innerRadius: number;
  public radius: number;

  public x: Range;
  public y: Range;

  // 计算属性，通过相应的 get 方法获取，所以使用 protected 访问修饰符
  protected center: Point;
  protected width: number;
  protected height: number;
  private isReflectX = false;
  private isReflectY = false;
  // 初始构造时候的 matrix，存储起来用于 reset
  private originalMatrix: Matrix3;

  constructor(cfg: CoordinateCfg) {
    const { start, end, matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1], isTransposed = false } = cfg;
    this.start = start;
    this.end = end;
    this.matrix = matrix as Matrix3;
    this.originalMatrix = [...matrix] as Matrix3; // 去除引用
    this.isTransposed = isTransposed;
  }

  /**
   * 初始化流程
   */
  public initial() {
    // center、width、height
    this.center = {
      x: (this.start.x + this.end.x) / 2,
      y: (this.start.y + this.end.y) / 2,
    };

    this.width = Math.abs(this.end.x - this.start.x);
    this.height = Math.abs(this.end.y - this.start.y);
  }

  /**
   * 更新配置
   * @param cfg
   */
  public update(cfg: CoordinateCfg) {
    assign(this, cfg);
    this.initial();
  }

  public convertDim(percent: number, dim: string): number {
    let { start, end } = this[dim];

    // 交换
    if (this.isReflect(dim)) {
      [start, end] = [end, start];
    }

    return start + percent * (end - start);
  }

  public invertDim(value: number, dim: string): number {
    let { start, end } = this[dim];
    // 交换
    if (this.isReflect(dim)) {
      [start, end] = [end, start];
    }

    return (value - start) / (end - start);
  }

  /**
   * 将坐标点进行矩阵变换
   * @param x   对应 x 轴画布坐标
   * @param y   对应 y 轴画布坐标
   * @param tag 默认为 0，可取值 0, 1
   * @return    返回变换后的三阶向量 [x, y, z]
   */
  public applyMatrix(x: number, y: number, tag: number = 0): number[] {
    const matrix = this.matrix;
    const vector: Vector3 = [x, y, tag];
    vec3.transformMat3(vector, vector, matrix);
    return vector;
  }

  /**
   * 将坐标点进行矩阵逆变换
   * @param x   对应 x 轴画布坐标
   * @param y   对应 y 轴画布坐标
   * @param tag 默认为 0，可取值 0, 1
   * @return    返回矩阵逆变换后的三阶向量 [x, y, z]
   */
  public invertMatrix(x: number, y: number, tag: number = 0): number[] {
    const matrix = this.matrix;
    const inverted = mat3.invert([0, 0, 0, 0, 0, 0, 0, 0, 0], matrix);
    const vector: Vector3 = [x, y, tag];
    if (inverted) {
      // 如果为空则不进行矩阵变化，防止报错
      vec3.transformMat3(vector, vector, inverted);
    }
    return vector;
  }

  /**
   * 将归一化的坐标点数据转换为画布坐标，并根据坐标系当前矩阵进行变换
   * @param point 归一化的坐标点
   * @return      返回进行矩阵变换后的画布坐标
   */
  public convert(point: Point): Point {
    const { x, y } = this.convertPoint(point);
    const vector = this.applyMatrix(x, y, 1);
    return {
      x: vector[0],
      y: vector[1],
    };
  }

  /**
   * 将进行过矩阵变换画布坐标转换为归一化坐标
   * @param point 画布坐标
   * @return      返回归一化的坐标点
   */
  public invert(point: Point): Point {
    const vector = this.invertMatrix(point.x, point.y, 1);
    return this.invertPoint({
      x: vector[0],
      y: vector[1],
    });
  }

  /**
   * 坐标系旋转变换
   * @param  radian 旋转弧度
   * @return        返回坐标系对象
   */
  public rotate(radian: number) {
    const matrix = this.matrix;
    const center = this.center;
    ext.leftTranslate(matrix, matrix, [-center.x, -center.y]);
    ext.leftRotate(matrix, matrix, radian);
    ext.leftTranslate(matrix, matrix, [center.x, center.y]);
    return this;
  }

  /**
   * 坐标系反射变换
   * @param dim 反射维度
   * @return    返回坐标系对象
   */
  public reflect(dim: string) {
    if (dim === 'x') {
      this.isReflectX = !this.isReflectX;
    } else {
      this.isReflectY = !this.isReflectY;
    }
    return this;
  }

  /**
   * 坐标系比例变换
   * @param s1 x 方向缩放比例
   * @param s2 y 方向缩放比例
   * @return     返回坐标系对象
   */
  public scale(s1: number, s2: number) {
    const matrix = this.matrix;
    const center = this.center;
    ext.leftTranslate(matrix, matrix, [-center.x, -center.y]);
    ext.leftScale(matrix, matrix, [s1, s2]);
    ext.leftTranslate(matrix, matrix, [center.x, center.y]);
    return this;
  }

  /**
   * 坐标系平移变换
   * @param x x 方向平移像素
   * @param y y 方向平移像素
   * @return    返回坐标系对象
   */
  public translate(x: number, y: number) {
    const matrix = this.matrix;
    ext.leftTranslate(matrix, matrix, [x, y]);
    return this;
  }

  /**
   * 将坐标系 x y 两个轴进行转置
   * @return 返回坐标系对象
   */
  public transpose() {
    this.isTransposed = !this.isTransposed;
    return this;
  }

  public getCenter(): Point {
    return this.center;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getRadius(): number {
    return this.radius;
  }

  /**
   * whether has reflect
   * @param dim
   */
  public isReflect(dim: string): boolean {
    return dim === 'x' ? this.isReflectX : this.isReflectY;
  }

  /**
   * 重置 matrix
   * @param matrix 如果传入，则使用，否则使用构造函数中传入的默认 matrix
   */
  public resetMatrix(matrix?: Matrix3) {
    // 去除引用关系
    this.matrix = matrix ? matrix : ([...this.originalMatrix] as Matrix3);
  }

  /**
   * 将归一化的坐标点数据转换为画布坐标
   * @param point
   */
  public abstract convertPoint(point: Point): Point;

  /**
   * 画布坐标转换为归一化的坐标点数据
   * @param point
   */
  public abstract invertPoint(point: Point): Point;
}
