import { clone, isPlainObject, lowerCase, mix } from '@antv/util';
import GrammarInteraction from './grammar-interaction';
var Interactions = {};
/**
 * 根据交互行为名字获取对应的交互类
 * @param name 交互名字
 * @returns 交互类
 */
export function getInteraction(name) {
    return Interactions[lowerCase(name)];
}
/**
 * 注册交互行为
 * @param name 交互行为名字
 * @param interaction 交互类
 */
export function registerInteraction(name, interaction) {
    Interactions[lowerCase(name)] = interaction;
}
/**
 * 创建交互实例
 * @param name 交互名
 * @param view 交互应用的 View 实例
 * @param cfg 交互行为配置
 */
export function createInteraction(name, view, cfg) {
    var interaciton = getInteraction(name);
    if (!interaciton) {
        return null;
    }
    if (isPlainObject(interaciton)) {
        // 如果不 clone 则会多个 interaction 实例共享 step 的定义
        var steps = mix(clone(interaciton), cfg);
        return new GrammarInteraction(view, steps);
    }
    else {
        var cls = interaciton;
        return new cls(view, cfg);
    }
}
export { default as Interaction } from './interaction';
export { Action, registerAction, getActionClass } from './action';
//# sourceMappingURL=index.js.map