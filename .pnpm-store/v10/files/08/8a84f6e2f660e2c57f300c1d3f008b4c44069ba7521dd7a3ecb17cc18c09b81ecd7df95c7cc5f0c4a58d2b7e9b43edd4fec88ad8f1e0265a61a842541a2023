"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAction = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var register_1 = require("./action/register");
var context_1 = tslib_1.__importDefault(require("./context"));
var interaction_1 = tslib_1.__importDefault(require("./interaction"));
// 将字符串转换成 action
function parseAction(actionStr, context, arg) {
    var arr = actionStr.split(':');
    var actionName = arr[0];
    // 如果已经初始化过 action ，则直接引用之前的 action
    var action = context.getAction(actionName) || (0, register_1.createAction)(actionName, context);
    if (!action) {
        throw new Error("There is no action named ".concat(actionName));
    }
    var methodName = arr[1];
    return {
        action: action,
        methodName: methodName,
        arg: arg,
    };
}
exports.parseAction = parseAction;
// 执行 Action
function executeAction(actionObject) {
    var action = actionObject.action, methodName = actionObject.methodName, arg = actionObject.arg;
    if (action[methodName]) {
        action[methodName](arg);
    }
    else {
        throw new Error("Action(".concat(action.name, ") doesn't have a method called ").concat(methodName));
    }
}
var STEP_NAMES = {
    START: 'start',
    SHOW_ENABLE: 'showEnable',
    END: 'end',
    ROLLBACK: 'rollback',
    PROCESSING: 'processing',
};
/**
 * 支持语法的交互类
 */
var GrammarInteraction = /** @class */ (function (_super) {
    tslib_1.__extends(GrammarInteraction, _super);
    function GrammarInteraction(view, steps) {
        var _this = _super.call(this, view, steps) || this;
        _this.callbackCaches = {};
        // 某个触发和反馈在本环节是否执行或
        _this.emitCaches = {};
        _this.steps = steps;
        return _this;
    }
    /**
     * 初始化
     */
    GrammarInteraction.prototype.init = function () {
        this.initContext();
        _super.prototype.init.call(this);
    };
    /**
     * 清理资源
     */
    GrammarInteraction.prototype.destroy = function () {
        _super.prototype.destroy.call(this); // 先清理事件
        this.steps = null;
        if (this.context) {
            this.context.destroy();
            this.context = null;
        }
        this.callbackCaches = null;
        this.view = null;
    };
    /**
     * 绑定事件
     */
    GrammarInteraction.prototype.initEvents = function () {
        var _this = this;
        (0, util_1.each)(this.steps, function (stepArr, stepName) {
            (0, util_1.each)(stepArr, function (step) {
                var callback = _this.getActionCallback(stepName, step);
                if (callback) {
                    // 如果存在 callback，才绑定，有时候会出现无 callback 的情况
                    _this.bindEvent(step.trigger, callback);
                }
            });
        });
    };
    /**
     * 清理绑定的事件
     */
    GrammarInteraction.prototype.clearEvents = function () {
        var _this = this;
        (0, util_1.each)(this.steps, function (stepArr, stepName) {
            (0, util_1.each)(stepArr, function (step) {
                var callback = _this.getActionCallback(stepName, step);
                if (callback) {
                    _this.offEvent(step.trigger, callback);
                }
            });
        });
    };
    // 初始化上下文，并初始化 action
    GrammarInteraction.prototype.initContext = function () {
        var view = this.view;
        var context = new context_1.default(view);
        this.context = context;
        var steps = this.steps;
        // 生成具体的 Action
        (0, util_1.each)(steps, function (subSteps) {
            (0, util_1.each)(subSteps, function (step) {
                if ((0, util_1.isFunction)(step.action)) {
                    // 如果传入回调函数，则直接生成 CallbackAction
                    step.actionObject = {
                        action: (0, register_1.createCallbackAction)(step.action, context),
                        methodName: 'execute',
                    };
                }
                else if ((0, util_1.isString)(step.action)) {
                    // 如果是字符串
                    step.actionObject = parseAction(step.action, context, step.arg);
                }
                else if ((0, util_1.isArray)(step.action)) {
                    // 如果是数组
                    var actionArr = step.action;
                    var argArr_1 = (0, util_1.isArray)(step.arg) ? step.arg : [step.arg];
                    step.actionObject = [];
                    (0, util_1.each)(actionArr, function (actionStr, idx) {
                        step.actionObject.push(parseAction(actionStr, context, argArr_1[idx]));
                    });
                }
                // 如果 action 既不是字符串，也不是函数，则不会生成 actionObject
            });
        });
    };
    // 是否允许指定阶段名称执行
    GrammarInteraction.prototype.isAllowStep = function (stepName) {
        var currentStepName = this.currentStepName;
        var steps = this.steps;
        // 相同的阶段允许同时执行
        if (currentStepName === stepName) {
            return true;
        }
        if (stepName === STEP_NAMES.SHOW_ENABLE) {
            // 示能在整个过程中都可用
            return true;
        }
        if (stepName === STEP_NAMES.PROCESSING) {
            // 只有当前是 start 时，才允许 processing
            return currentStepName === STEP_NAMES.START;
        }
        if (stepName === STEP_NAMES.START) {
            // 如果当前是 processing，则无法 start，必须等待 end 后才能执行
            return currentStepName !== STEP_NAMES.PROCESSING;
        }
        if (stepName === STEP_NAMES.END) {
            return currentStepName === STEP_NAMES.PROCESSING || currentStepName === STEP_NAMES.START;
        }
        if (stepName === STEP_NAMES.ROLLBACK) {
            if (steps[STEP_NAMES.END]) {
                // 如果定义了 end, 只有 end 时才允许回滚
                return currentStepName === STEP_NAMES.END;
            }
            else if (currentStepName === STEP_NAMES.START) {
                // 如果未定义 end, 则判断是否是开始
                return true;
            }
        }
        return false;
    };
    // 具体的指定阶段是否允许执行
    GrammarInteraction.prototype.isAllowExecute = function (stepName, step) {
        if (this.isAllowStep(stepName)) {
            var key = this.getKey(stepName, step);
            // 如果是在本环节内仅允许触发一次，同时已经触发过，则不允许再触发
            if (step.once && this.emitCaches[key]) {
                return false;
            }
            // 如果是允许的阶段，则验证 isEnable 方法
            if (step.isEnable) {
                return step.isEnable(this.context);
            }
            return true; // 如果没有 isEnable 则允许执行
        }
        return false;
    };
    GrammarInteraction.prototype.enterStep = function (stepName) {
        this.currentStepName = stepName;
        this.emitCaches = {}; // 清除所有本环节触发的缓存
    };
    // 执行完某个触发和反馈（子环节）
    GrammarInteraction.prototype.afterExecute = function (stepName, step) {
        // show enable 不计入正常的流程，其他情况则设置当前的 step
        if (stepName !== STEP_NAMES.SHOW_ENABLE && this.currentStepName !== stepName) {
            this.enterStep(stepName);
        }
        var key = this.getKey(stepName, step);
        // 一旦执行，则缓存标记为，一直保持到跳出改环节
        this.emitCaches[key] = true;
    };
    // 获取某个环节的唯一的键值
    GrammarInteraction.prototype.getKey = function (stepName, step) {
        return stepName + step.trigger + step.action;
    };
    // 获取 step 的回调函数，如果已经生成，则直接返回，如果未生成，则创建
    GrammarInteraction.prototype.getActionCallback = function (stepName, step) {
        var _this = this;
        var context = this.context;
        var callbackCaches = this.callbackCaches;
        var actionObject = step.actionObject;
        if (step.action && actionObject) {
            var key = this.getKey(stepName, step);
            if (!callbackCaches[key]) {
                // 动态生成执行的方法，执行对应 action 的名称
                var actionCallback = function (event) {
                    context.event = event; // 保证检测时的 event
                    if (_this.isAllowExecute(stepName, step)) {
                        // 如果是数组时，则依次执行
                        if ((0, util_1.isArray)(actionObject)) {
                            (0, util_1.each)(actionObject, function (obj) {
                                context.event = event; // 可能触发新的事件，保证执行前的 context.event 是正确的
                                executeAction(obj);
                            });
                        }
                        else {
                            context.event = event; // 保证执行前的 context.event 是正确的
                            executeAction(actionObject);
                        }
                        _this.afterExecute(stepName, step);
                        if (step.callback) {
                            context.event = event; // 保证执行前的 context.event 是正确的
                            step.callback(context);
                        }
                    }
                    else {
                        // 如果未通过验证，则事件不要绑定在上面
                        context.event = null;
                    }
                };
                // 如果设置了 debounce
                if (step.debounce) {
                    callbackCaches[key] = (0, util_1.debounce)(actionCallback, step.debounce.wait, step.debounce.immediate);
                }
                else if (step.throttle) {
                    // 设置 throttle
                    callbackCaches[key] = (0, util_1.throttle)(actionCallback, step.throttle.wait, {
                        leading: step.throttle.leading,
                        trailing: step.throttle.trailing,
                    });
                }
                else {
                    // 直接设置
                    callbackCaches[key] = actionCallback;
                }
            }
            return callbackCaches[key];
        }
        return null;
    };
    GrammarInteraction.prototype.bindEvent = function (eventName, callback) {
        var nameArr = eventName.split(':');
        if (nameArr[0] === 'window') {
            window.addEventListener(nameArr[1], callback);
        }
        else if (nameArr[0] === 'document') {
            document.addEventListener(nameArr[1], callback);
        }
        else {
            this.view.on(eventName, callback);
        }
    };
    GrammarInteraction.prototype.offEvent = function (eventName, callback) {
        var nameArr = eventName.split(':');
        if (nameArr[0] === 'window') {
            window.removeEventListener(nameArr[1], callback);
        }
        else if (nameArr[0] === 'document') {
            document.removeEventListener(nameArr[1], callback);
        }
        else {
            this.view.off(eventName, callback);
        }
    };
    return GrammarInteraction;
}(interaction_1.default));
exports.default = GrammarInteraction;
//# sourceMappingURL=grammar-interaction.js.map