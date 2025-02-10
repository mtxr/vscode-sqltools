import { View } from '../chart';
import { LooseObject } from '../interface';
import { InteractionSteps } from './grammar-interaction';
import { InteractionConstructor } from './interaction';
/**
 * 根据交互行为名字获取对应的交互类
 * @param name 交互名字
 * @returns 交互类
 */
export declare function getInteraction(name: string): InteractionSteps | InteractionConstructor;
/**
 * 注册交互行为
 * @param name 交互行为名字
 * @param interaction 交互类
 */
export declare function registerInteraction(name: string, interaction: InteractionSteps | InteractionConstructor): void;
/**
 * 创建交互实例
 * @param name 交互名
 * @param view 交互应用的 View 实例
 * @param cfg 交互行为配置
 */
export declare function createInteraction(name: string, view: View, cfg?: LooseObject): import("./interaction").default;
export { default as Interaction } from './interaction';
export { Action, registerAction, getActionClass } from './action';
