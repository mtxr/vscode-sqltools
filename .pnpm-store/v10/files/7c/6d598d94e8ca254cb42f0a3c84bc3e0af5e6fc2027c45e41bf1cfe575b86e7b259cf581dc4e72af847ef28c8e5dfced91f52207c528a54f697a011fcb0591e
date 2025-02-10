import { Coordinate } from '@antv/coord';
import { PathCommand } from '../../../dependents';
import { Point, ShapeInfo, ShapePoint } from '../../../interface';
/**
 * @ignore
 * 根据数据点生成矩形的四个关键点
 * @param pointInfo 数据点信息
 * @param [isPyramid] 是否为尖底漏斗图
 * @returns rect points 返回矩形四个顶点信息
 */
export declare function getRectPoints(pointInfo: ShapePoint): Point[];
/**
 * @ignore
 * 根据矩形关键点绘制 path
 * @param points 关键点数组
 * @param isClosed path 是否需要闭合
 * @returns 返回矩形的 path
 */
export declare function getRectPath(points: Point[], isClosed?: boolean): PathCommand[];
/**
 * 处理 rect path 的 radius
 * @returns 返回矩形 path 的四个角的 arc 半径
 */
export declare function parseRadius(radius: number | number[], minLength: number): number[];
/**
 * 获取 interval 矩形背景的 path
 * @param cfg 关键点的信息
 * @param points 已转化为画布坐标的 4 个关键点
 * @param coordinate 坐标系
 * @returns 返回矩形背景的 path
 */
export declare function getBackgroundRectPath(cfg: ShapeInfo, points: Point[], coordinate: Coordinate): PathCommand[];
/**
 * @ignore
 * 根据矩形关键点绘制 path
 * @param points 关键点数组
 * @param lineCap 'round'圆角样式
 * @param coor 坐标
 * @returns 返回矩形的 path
 */
export declare function getIntervalRectPath(points: Point[], lineCap: CanvasLineCap, coor: Coordinate): PathCommand[];
/**
 * @ignore
 * 根据 funnel 关键点绘制漏斗图的 path
 * @param points 图形关键点信息
 * @param nextPoints 下一个数据的图形关键点信息
 * @param isPyramid 是否为尖底漏斗图
 * @returns 返回漏斗图的图形 path
 */
export declare function getFunnelPath(points: Point[], nextPoints: Point[], isPyramid: boolean): any[];
/**
 * 获取 倒角 矩形
 * - 目前只适用于笛卡尔坐标系下
 */
export declare function getRectWithCornerRadius(points: Point[], coordinate: Coordinate, radius?: number | number[]): any[];
