import { DIRECTION } from '../constant';
import { Coordinate, Scale } from '../dependents';
import { AxisCfg, AxisOption, Point, Region } from '../interface';
/**
 * @ignore
 * get axis relative region ( 0 ~ 1) by direction when coordinate is rect
 * @param direction
 * @returns axis coordinate region
 */
export declare function getLineAxisRelativeRegion(direction: DIRECTION): Region;
/**
 * @ignore
 * get axis relative region ( 0 ~ 1) by direction when coordinate is polar
 * @param coordinate
 * @returns axis coordinate region
 */
export declare function getCircleAxisRelativeRegion(coordinate: Coordinate): {
    start: any;
    end: any;
};
/**
 * @ignore
 * get the axis region from coordinate
 * @param coordinate
 * @param direction
 * @returns the axis region (start point, end point)
 */
export declare function getAxisRegion(coordinate: Coordinate, direction: DIRECTION): Region;
/**
 * @ignore
 * get axis factor
 * @param coordinate
 * @param direction
 * @returns factor
 */
export declare function getAxisFactor(coordinate: Coordinate, direction: DIRECTION): number;
/**
 * @ignore
 * whether the axis isVertical
 * @param region
 * @returns isVertical
 */
export declare function isVertical(region: Region): boolean;
/**
 * @ignore
 * get factor by region (real position)
 * @param region
 * @param center
 * @returns factor
 */
export declare function getAxisFactorByRegion(region: Region, center: Point): number;
/**
 * @ignore
 * get the axis cfg from theme, will mix the common cfg of legend theme
 *
 * @param theme view theme object
 * @param direction axis direction
 * @returns axis theme cfg
 */
export declare function getAxisThemeCfg(theme: object, direction: string): object;
/**
 * get the options of axis title，mix the cfg from theme, avoid common themeCfg not work
 * @param theme
 * @param direction
 * @param axisOptions
 * @returns axis title options
 */
export declare function getAxisTitleOptions(theme: object, direction: string, axisOptions?: object): object;
/**
 * @ignore
 * get circle axis center and radius
 * @param coordinate
 */
export declare function getCircleAxisCenterRadius(coordinate: Coordinate): {
    center: any;
    radius: number;
    startAngle: number;
    endAngle: number;
};
/**
 * @ignore
 * 从配置中获取单个字段的 axis 配置
 * @param axes
 * @param field
 * @returns the axis option of field
 */
export declare function getAxisOption(axes: Record<string, AxisOption> | boolean, field: string): any;
/**
 * @ignore
 * 如果配置了 position，则使用配置
 * @param axisOption
 * @param def
 */
export declare function getAxisDirection(axisOption: AxisOption, def: DIRECTION): DIRECTION;
/**
 * 获取 axis 的 title 文本
 * @param scale
 * @param axisOption
 */
export declare function getAxisTitleText(scale: Scale, axisOption: AxisCfg): string;
