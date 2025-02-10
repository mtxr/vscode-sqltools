"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
var util_1 = require("@antv/util");
/**
 * Component Controller 规范需要定义的基类
 * 1. 规范的 option 输入
 * 2. 统一的信息获取 API
 * 3. 明确定义的组件事件（名称、数据）
 */
var Controller = /** @class */ (function () {
    function Controller(view) {
        /** 是否可见 */
        this.visible = true;
        /** 所有的 component */
        this.components = [];
        this.view = view;
    }
    /**
     * clear
     * @param includeOption 是否清空 option 配置项（used in annotation）
     */
    Controller.prototype.clear = function (includeOption) {
        // destroy all components
        (0, util_1.each)(this.components, function (co) {
            co.component.destroy();
        });
        // clear all component instance
        this.components = [];
    };
    /**
     * destroy the component
     */
    Controller.prototype.destroy = function () {
        this.clear();
    };
    /**
     * get all components
     * @returns components array
     */
    Controller.prototype.getComponents = function () {
        return this.components;
    };
    /**
     * change visibility of component
     * @param visible
     */
    Controller.prototype.changeVisible = function (visible) {
        if (this.visible === visible) {
            return;
        }
        this.components.forEach(function (co) {
            if (visible) {
                co.component.show();
            }
            else {
                co.component.hide();
            }
        });
        this.visible = visible;
    };
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=base.js.map