import { Coordinate, Point } from '../../dependents';
import { CoordinateOption } from '../../interface';
/**
 * coordinate controller，职责：
 * 1. 创建实例
 * 2. 暂存配置
 */
export default class CoordinateController {
    private option;
    private coordinate;
    constructor(option?: CoordinateOption);
    /**
     * 更新配置
     * @param option
     */
    update(option: CoordinateOption): this;
    /**
     * 是否存在某一个 action
     * @param actionName
     */
    hasAction(actionName: string): boolean;
    /**
     * 创建坐标系对象
     * @param start 起始位置
     * @param end   结束位置
     * @return 坐标系实例
     */
    create(start: Point, end: Point): Coordinate;
    /**
     * 更新坐标系对象
     * @param start 起始位置
     * @param end   结束位置
     * @return 坐标系实例
     */
    adjust(start: Point, end: Point): Coordinate;
    /**
     * 旋转弧度
     * @param angle
     */
    rotate(angle: number): this;
    /**
     * 镜像
     * @param dim
     */
    reflect(dim: 'x' | 'y'): this;
    /**
     * scale
     * @param sx
     * @param sy
     */
    scale(sx: number, sy: number): this;
    /**
     * 对角变换
     */
    transpose(): this;
    /**
     * 获取配置
     */
    getOption(): CoordinateOption;
    /**
     * 获得 coordinate 实例
     */
    getCoordinate(): Coordinate;
    /**
     * 包装配置的默认值
     * @param option
     */
    private wrapperOption;
    /**
     * coordinate 实例执行 actions
     * @params includeActions 如果没有指定，则执行全部，否则，执行指定的 action
     */
    private execActions;
}
