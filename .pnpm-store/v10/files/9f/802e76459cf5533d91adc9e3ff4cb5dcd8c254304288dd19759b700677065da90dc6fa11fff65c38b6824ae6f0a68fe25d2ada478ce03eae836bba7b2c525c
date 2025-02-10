import { PathCommand } from '../../../dependents';
import { ShapeVertices } from '../../../interface';
/**
 * @ignore
 * 分割数据，用于处理在一组点数据中，y 对应的数值存在 null/undefined/NaN 的情况
 * 应用于折线图、区域图以及路径图
 *
 * ```typescript
 * // return [[{x: 1, y: 2}, {x: 3, y: 3}]]
 * getPathPoints([{x: 1, y: 2}, {x: 2, y: null}, {x: 3, y: 3}], true);
 * // return [[{x: 1, y: 2}], [{x: 3, y: 3}]]
 * getPathPoints([{x: 1, y: 2}, {x: 2, y: null}, {x: 3, y: 3}], false);
 * // return [[[{ x: 1, y: 10 }, { x: 2, y: 2 }], [{ x: 9, y: 34 }, { x: 1, y: 1 }]]]
 * getPathPoints([
 *   [{ x: 1, y: 10 }, { x: 2, y: 2 }],
 *   [{ x: 4, y: 2 }, { x: 8, y: NaN }],
 *   [{ x: 9, y: 34 }, { x: 1, y: 1 }],
 * ], true);
 * ```
 *
 * @param points 要进行处理点集合
 * @param connectNulls 是否连接空值数据
 * @param showSinglePoint 是否展示孤立点
 * @returns 返回处理后的点集合
 */
export declare function getPathPoints(points: ShapeVertices, connectNulls?: boolean, showSinglePoint?: boolean): any[];
/**
 * 获取小提琴图的边界 path
 * @param points
 * @returns
 */
export declare function getViolinPath(points: ShapeVertices): PathCommand[];
/**
 * 获取小提琴图 平滑的边界 path
 * @param points
 * @returns
 */
export declare function getSmoothViolinPath(points: ShapeVertices): PathCommand[];
