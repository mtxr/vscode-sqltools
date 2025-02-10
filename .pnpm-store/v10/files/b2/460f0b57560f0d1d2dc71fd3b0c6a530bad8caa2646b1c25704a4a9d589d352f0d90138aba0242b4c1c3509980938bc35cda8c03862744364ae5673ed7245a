"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var util_2 = require("../util");
var state_base_1 = tslib_1.__importDefault(require("./state-base"));
function getItem(shape) {
    return (0, util_1.get)(shape.get('delegateObject'), 'item');
}
/**
 * 状态量 Action 的基类，允许多个 Element 同时拥有某个状态
 * @class
 * @ignore
 */
var ElementState = /** @class */ (function (_super) {
    tslib_1.__extends(ElementState, _super);
    function ElementState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ignoreListItemStates = ['unchecked'];
        return _this;
    }
    // 是否忽略触发的列表项
    ElementState.prototype.isItemIgnore = function (item, list) {
        var states = this.ignoreListItemStates;
        var filtered = states.filter(function (state) {
            return list.hasState(item, state);
        });
        return !!filtered.length;
    };
    // 设置由组件选项导致的状态变化
    ElementState.prototype.setStateByComponent = function (component, item, enable) {
        var view = this.context.view;
        var field = component.get('field');
        var elements = (0, util_2.getElements)(view);
        this.setElementsStateByItem(elements, field, item, enable);
    };
    // 处理触发源由 element 导致的状态变化
    ElementState.prototype.setStateByElement = function (element, enable) {
        this.setElementState(element, enable);
    };
    /** 组件的选项是否同 element 匹配 */
    ElementState.prototype.isMathItem = function (element, field, item) {
        var view = this.context.view;
        var scale = (0, util_2.getScaleByField)(view, field);
        var value = (0, util_2.getElementValue)(element, field);
        return !(0, util_1.isNil)(value) && item.name === scale.getText(value);
    };
    ElementState.prototype.setElementsStateByItem = function (elements, field, item, enable) {
        var _this = this;
        (0, util_1.each)(elements, function (el) {
            if (_this.isMathItem(el, field, item)) {
                el.setState(_this.stateName, enable);
            }
        });
    };
    /** 设置状态是否激活 */
    ElementState.prototype.setStateEnable = function (enable) {
        var element = (0, util_2.getCurrentElement)(this.context);
        if (element) {
            // 触发源由于 element 导致
            if ((0, util_2.isElementChange)(this.context)) {
                this.setStateByElement(element, enable);
            }
        }
        else {
            // 触发源由组件导致
            var delegateObject = (0, util_2.getDelegationObject)(this.context);
            // 如果触发源时列表，图例、坐标轴
            if ((0, util_2.isList)(delegateObject)) {
                var item = delegateObject.item, component = delegateObject.component;
                if (item && component && !this.isItemIgnore(item, component)) {
                    var event_1 = this.context.event.gEvent;
                    // 防止闪烁
                    if (event_1 && event_1.fromShape && event_1.toShape && getItem(event_1.fromShape) === getItem(event_1.toShape)) {
                        return;
                    }
                    this.setStateByComponent(component, item, enable);
                }
            }
        }
    };
    /**
     * 切换状态
     */
    ElementState.prototype.toggle = function () {
        var element = (0, util_2.getCurrentElement)(this.context);
        if (element) {
            var hasState = element.hasState(this.stateName);
            this.setElementState(element, !hasState);
        }
    };
    /**
     * 取消当前时间影响的状态
     */
    ElementState.prototype.reset = function () {
        this.setStateEnable(false);
    };
    return ElementState;
}(state_base_1.default));
exports.default = ElementState;
//# sourceMappingURL=state.js.map