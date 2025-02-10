import { Coordinate, IGroup, IShape } from '../dependents';
import { AnimateCfg, Point } from '../interface';
import { AnimateExtraCfg } from './interface';
export declare const DEFAULT_ANIMATE_CFG: {
    appear: {
        duration: number;
        easing: string;
    };
    update: {
        duration: number;
        easing: string;
    };
    enter: {
        duration: number;
        easing: string;
    };
    leave: {
        duration: number;
        easing: string;
    };
};
/**
 * @ignore
 * 获取 elementName 对应的动画配置，当声明了 `animateType`，则返回 `animateType` 对应的动画配置
 * @param elementName 元素名称
 * @param coordinate 做表弟类型
 * @param animateType 可选，动画类型
 */
export declare function getDefaultAnimateCfg(elementName: string, coordinate: Coordinate, animateType?: string): any;
/**
 * @ignore
 * 工具函数
 * 根据用户传入的配置为 shape 执行动画
 * @param shape 执行动画的图形元素
 * @param animateCfg 动画配置
 * @param cfg 额外的信息
 */
export declare function doAnimate(shape: IGroup | IShape, animateCfg: AnimateCfg, cfg: AnimateExtraCfg): void;
/**
 * @ignore
 * 执行 Geometry 群组入场动画
 * @param container 执行群组动画的图形元素
 * @param animateCfg 动画配置
 * @param geometryType geometry 类型
 * @param coordinate 坐标系对象
 * @param minYPoint y 轴最小值对应的画布坐标点
 */
export declare function doGroupAppearAnimate(container: IGroup, animateCfg: AnimateCfg, geometryType: string, coordinate: Coordinate, minYPoint: Point): void;
