import { Coordinate } from '../dependents';
import { Point } from '../interface';
import { BBox } from './bbox';
/**
 * @ignore
 * Gets x dimension length
 * @param coordinate
 * @returns x dimension length
 */
export declare function getXDimensionLength(coordinate: any): number;
/**
 * @ignore
 * Determines whether full circle is
 * @param coordinate
 * @returns true if full circle
 */
export declare function isFullCircle(coordinate: Coordinate): boolean;
/**
 * @ignore
 * 获取当前点到坐标系圆心的距离
 * @param coordinate 坐标系
 * @param point 当前点
 * @returns distance to center
 */
export declare function getDistanceToCenter(coordinate: Coordinate, point: Point): number;
/**
 * @ignore
 * 坐标点是否在坐标系中
 * @param coordinate
 * @param point
 */
export declare function isPointInCoordinate(coordinate: Coordinate, point: Point): boolean;
/**
 * @ignore
 * 获取点到圆心的连线与水平方向的夹角
 */
export declare function getAngleByPoint(coordinate: Coordinate, point: Point): number;
/**
 * @ignore
 * 获取同坐标系范围相同的剪切区域
 * @param coordinate
 * @returns
 */
export declare function getCoordinateClipCfg(coordinate: Coordinate, margin?: number): {
    type: string;
    startState: {
        path: (string | number)[][];
        x?: undefined;
        y?: undefined;
        width?: undefined;
        height?: undefined;
    };
    endState: (ratio: any) => {
        path: (string | number)[][];
    };
    attrs: {
        path: (string | number)[][];
        x?: undefined;
        y?: undefined;
        width?: undefined;
        height?: undefined;
    };
} | {
    type: string;
    startState: {
        x: number;
        y: number;
        width: number;
        height: number;
        path?: undefined;
    };
    endState: any;
    attrs: {
        x: number;
        y: number;
        width: number;
        height: number;
        path?: undefined;
    };
};
/**
 * 获取坐标系范围的 BBox
 * @param coordinate
 * @param margin
 */
export declare function getCoordinateBBox(coordinate: Coordinate, margin?: number): BBox;
