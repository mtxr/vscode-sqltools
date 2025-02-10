"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActionClass = exports.registerAction = exports.Action = exports.Interaction = exports.createInteraction = exports.registerInteraction = exports.getInteraction = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var grammar_interaction_1 = tslib_1.__importDefault(require("./grammar-interaction"));
var Interactions = {};
/**
 * 根据交互行为名字获取对应的交互类
 * @param name 交互名字
 * @returns 交互类
 */
function getInteraction(name) {
    return Interactions[(0, util_1.lowerCase)(name)];
}
exports.getInteraction = getInteraction;
/**
 * 注册交互行为
 * @param name 交互行为名字
 * @param interaction 交互类
 */
function registerInteraction(name, interaction) {
    Interactions[(0, util_1.lowerCase)(name)] = interaction;
}
exports.registerInteraction = registerInteraction;
/**
 * 创建交互实例
 * @param name 交互名
 * @param view 交互应用的 View 实例
 * @param cfg 交互行为配置
 */
function createInteraction(name, view, cfg) {
    var interaciton = getInteraction(name);
    if (!interaciton) {
        return null;
    }
    if ((0, util_1.isPlainObject)(interaciton)) {
        // 如果不 clone 则会多个 interaction 实例共享 step 的定义
        var steps = (0, util_1.mix)((0, util_1.clone)(interaciton), cfg);
        return new grammar_interaction_1.default(view, steps);
    }
    else {
        var cls = interaciton;
        return new cls(view, cfg);
    }
}
exports.createInteraction = createInteraction;
var interaction_1 = require("./interaction");
Object.defineProperty(exports, "Interaction", { enumerable: true, get: function () { return tslib_1.__importDefault(interaction_1).default; } });
var action_1 = require("./action");
Object.defineProperty(exports, "Action", { enumerable: true, get: function () { return action_1.Action; } });
Object.defineProperty(exports, "registerAction", { enumerable: true, get: function () { return action_1.registerAction; } });
Object.defineProperty(exports, "getActionClass", { enumerable: true, get: function () { return action_1.getActionClass; } });
//# sourceMappingURL=index.js.map