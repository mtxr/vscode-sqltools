"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
/**
 * Action 的基类
 */
var Action = /** @class */ (function () {
    function Action(context, cfg) {
        this.context = context;
        this.cfg = cfg;
        context.addAction(this);
    }
    /**
     * 设置配置项传入的值
     * @param cfg
     */
    Action.prototype.applyCfg = function (cfg) {
        (0, util_1.assign)(this, cfg);
    };
    /**
     * Inits action，提供给子类用于继承
     */
    Action.prototype.init = function () {
        this.applyCfg(this.cfg);
    };
    /**
     * Destroys action
     */
    Action.prototype.destroy = function () {
        // 移除 action
        this.context.removeAction(this);
        // 清空
        this.context = null;
    };
    return Action;
}());
exports.default = Action;
//# sourceMappingURL=base.js.map