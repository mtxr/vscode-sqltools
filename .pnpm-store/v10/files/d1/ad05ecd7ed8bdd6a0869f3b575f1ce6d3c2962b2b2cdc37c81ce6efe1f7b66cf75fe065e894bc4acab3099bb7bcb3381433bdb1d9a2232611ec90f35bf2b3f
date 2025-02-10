import { PathCommand } from '../../../dependents';
import { Point, Position } from '../../../interface';
/**
 * @ignore
 * 计算光滑的贝塞尔曲线
 */
export declare const smoothBezier: (points: Position[], smooth: number, isLoop: boolean, constraint: Position[]) => Position[];
/**
 * @ignore
 * 贝塞尔曲线
 */
export declare function catmullRom2bezier(crp: number[], z: boolean, constraint: Position[]): PathCommand[];
/**
 * @ignore
 * 将点连接成路径 path
 */
export declare function getLinePath(points: Point[], isInCircle?: boolean): PathCommand[];
/**
 * @ignore
 * 根据关键点获取限定了范围的平滑线
 */
export declare function getSplinePath(points: Point[], isInCircle?: boolean, constaint?: Position[]): PathCommand[];
/**
 * @ignore
 * 将归一化后的路径数据转换成坐标
 */
export declare function convertNormalPath(coord: any, path: PathCommand[]): PathCommand[];
/**
 * @ignore
 * 将路径转换为极坐标下的真实路径
 */
export declare function convertPolarPath(coord: any, path: PathCommand[]): PathCommand[];
