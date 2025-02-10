"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var util_2 = require("./action/util");
/**
 * 交互的上下文
 */
var Context = /** @class */ (function () {
    function Context(view) {
        /** 当前所有的 Action */
        this.actions = [];
        /** 当前事件对象 */
        this.event = null;
        this.cacheMap = {};
        this.view = view;
    }
    /**
     * 缓存信息
     * @param params 缓存的字段
     *  - 如果一个字段则获取缓存
     *  - 两个字段则设置缓存
     */
    Context.prototype.cache = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        if (params.length === 1) {
            return this.cacheMap[params[0]];
        }
        else if (params.length === 2) {
            this.cacheMap[params[0]] = params[1];
        }
    };
    /**
     * 获取 Action
     * @param name Action 的名称
     */
    Context.prototype.getAction = function (name) {
        return this.actions.find(function (action) { return action.name === name; });
    };
    /**
     * 获取 Action
     * @param action Action 对象
     */
    Context.prototype.addAction = function (action) {
        this.actions.push(action);
    };
    /**
     * 移除 Action
     * @param action Action 对象
     */
    Context.prototype.removeAction = function (action) {
        var actions = this.actions;
        var index = this.actions.indexOf(action);
        if (index >= 0) {
            actions.splice(index, 1);
        }
    };
    /**
     * 获取当前的点
     */
    Context.prototype.getCurrentPoint = function () {
        var event = this.event;
        if (event) {
            if (event.target instanceof HTMLElement) {
                var canvas = this.view.getCanvas();
                var point = canvas.getPointByClient(event.clientX, event.clientY);
                return point;
            }
            else {
                return {
                    x: event.x,
                    y: event.y,
                };
            }
        }
        return null;
    };
    /**
     * 获取当前 shape
     * @returns current shape
     */
    Context.prototype.getCurrentShape = function () {
        return (0, util_1.get)(this.event, ['gEvent', 'shape']);
    };
    /**
     * 当前的触发是否在 View 内
     */
    Context.prototype.isInPlot = function () {
        var point = this.getCurrentPoint();
        if (point) {
            return this.view.isPointInPlot(point);
        }
        return false;
    };
    /**
     * 是否在指定的图形内
     * @param name shape 的 name
     */
    Context.prototype.isInShape = function (name) {
        var shape = this.getCurrentShape(); // 不再考虑在 shape 的 parent 内的情况
        if (shape) {
            return shape.get('name') === name;
        }
        return false;
    };
    /**
     * 当前的触发是组件内部
     * @param name 组件名，可以为空
     */
    Context.prototype.isInComponent = function (name) {
        var components = (0, util_2.getComponents)(this.view);
        var point = this.getCurrentPoint();
        if (point) {
            return !!components.find(function (component) {
                var bbox = component.getBBox();
                if (name) {
                    return component.get('name') === name && (0, util_2.isInBox)(bbox, point);
                }
                else {
                    return (0, util_2.isInBox)(bbox, point);
                }
            });
        }
        return false;
    };
    /**
     * 销毁
     */
    Context.prototype.destroy = function () {
        // 先销毁 action 再清空，一边遍历，一边删除，所以数组需要更新引用
        (0, util_1.each)(this.actions.slice(), function (action) {
            action.destroy();
        });
        this.view = null;
        this.event = null;
        this.actions = null;
        this.cacheMap = null;
    };
    return Context;
}());
exports.default = Context;
//# sourceMappingURL=context.js.map