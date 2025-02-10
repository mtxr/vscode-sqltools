import { __extends } from "tslib";
import { each, isNil, get } from '@antv/util';
import { getCurrentElement, getDelegationObject, getElements, getElementValue, getScaleByField, isElementChange, isList, } from '../util';
import StateBase from './state-base';
function getItem(shape) {
    return get(shape.get('delegateObject'), 'item');
}
/**
 * 状态量 Action 的基类，允许多个 Element 同时拥有某个状态
 * @class
 * @ignore
 */
var ElementState = /** @class */ (function (_super) {
    __extends(ElementState, _super);
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
        var elements = getElements(view);
        this.setElementsStateByItem(elements, field, item, enable);
    };
    // 处理触发源由 element 导致的状态变化
    ElementState.prototype.setStateByElement = function (element, enable) {
        this.setElementState(element, enable);
    };
    /** 组件的选项是否同 element 匹配 */
    ElementState.prototype.isMathItem = function (element, field, item) {
        var view = this.context.view;
        var scale = getScaleByField(view, field);
        var value = getElementValue(element, field);
        return !isNil(value) && item.name === scale.getText(value);
    };
    ElementState.prototype.setElementsStateByItem = function (elements, field, item, enable) {
        var _this = this;
        each(elements, function (el) {
            if (_this.isMathItem(el, field, item)) {
                el.setState(_this.stateName, enable);
            }
        });
    };
    /** 设置状态是否激活 */
    ElementState.prototype.setStateEnable = function (enable) {
        var element = getCurrentElement(this.context);
        if (element) {
            // 触发源由于 element 导致
            if (isElementChange(this.context)) {
                this.setStateByElement(element, enable);
            }
        }
        else {
            // 触发源由组件导致
            var delegateObject = getDelegationObject(this.context);
            // 如果触发源时列表，图例、坐标轴
            if (isList(delegateObject)) {
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
        var element = getCurrentElement(this.context);
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
}(StateBase));
export default ElementState;
//# sourceMappingURL=state.js.map