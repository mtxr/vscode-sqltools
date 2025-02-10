import { Coordinate, IShape } from '../dependents';
import { ShapeInfo } from '../interface';
/**
 * @ignore
 * 根据弧度计算极坐标系下的坐标点
 * @param centerX
 * @param centerY
 * @param radius
 * @param angleInRadian
 * @returns
 */
export declare function polarToCartesian(centerX: number, centerY: number, radius: number, angleInRadian: number): {
    x: number;
    y: number;
};
/**
 * @ignore
 * 根据起始角度计算绘制扇形的 path
 * @param centerX
 * @param centerY
 * @param radius
 * @param startAngleInRadian
 * @param endAngleInRadian
 * @returns
 */
export declare function getSectorPath(centerX: number, centerY: number, radius: number, startAngleInRadian: number, endAngleInRadian: number, innerRadius?: number): (string | number)[][];
/**
 * @ignore
 * Gets arc path
 * @param centerX
 * @param centerY
 * @param radius
 * @param startAngleInRadian
 * @param endAngleInRadian
 * @returns
 */
export declare function getArcPath(centerX: number, centerY: number, radius: number, startAngleInRadian: number, endAngleInRadian: number): (string | number)[][];
/**
 * @ignore
 * 从数据模型中的 points 换算角度
 * @param shapeModel
 * @param coordinate
 * @returns
 */
export declare function getAngle(shapeModel: ShapeInfo, coordinate: Coordinate): {
    startAngle: any;
    endAngle: any;
};
/**
 * @ignore
 * 计算多边形重心: https://en.wikipedia.org/wiki/Centroid#Of_a_polygon
 */
export declare function getPolygonCentroid(xs: number | number[], ys: number | number[]): number[];
/**
 * @ignore
 * 获取需要替换的属性，如果原先图形元素存在，而新图形不存在，则设置 undefined
 */
export declare function getReplaceAttrs(sourceShape: IShape, targetShape: IShape): any;
