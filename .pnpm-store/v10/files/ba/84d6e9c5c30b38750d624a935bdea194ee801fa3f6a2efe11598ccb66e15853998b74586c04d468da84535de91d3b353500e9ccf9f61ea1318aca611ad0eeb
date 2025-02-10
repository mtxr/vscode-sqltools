import { IGroup, IShape } from '../../dependents';
import { GAnimateCfg } from '../../interface';
import { AnimateExtraCfg } from '../interface';
type Animation = (element: IGroup | IShape, animateCfg: GAnimateCfg, cfg: AnimateExtraCfg) => void;
/**
 * 根据名称获取对应的动画执行函数
 * @param type 动画函数名称
 */
export declare function getAnimation(type: string): Animation;
/**
 * 注册动画执行函数
 * @param type 动画执行函数名称
 * @param animation 动画执行函数
 */
export declare function registerAnimation(type: string, animation: Animation): void;
export {};
