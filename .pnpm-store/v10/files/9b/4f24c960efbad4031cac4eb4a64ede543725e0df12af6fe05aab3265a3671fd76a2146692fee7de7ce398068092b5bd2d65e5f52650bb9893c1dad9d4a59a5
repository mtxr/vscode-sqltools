import { __extends } from "tslib";
import { each } from '@antv/util';
import Action from '../base';
import { getComponents } from '../util';
import { getCurrentElement, getDelegationObject, getElementValue, isList, getScaleByField } from '../util';
/**
 * 列表项状态 Action 的基础类
 * @class
 * @ignore
 */
var ListState = /** @class */ (function (_super) {
    __extends(ListState, _super);
    function ListState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stateName = '';
        _this.ignoreItemStates = [];
        return _this;
    }
    /** 获取触发的列表组件 */
    ListState.prototype.getTriggerListInfo = function () {
        var delegateObject = getDelegationObject(this.context);
        var info = null;
        if (isList(delegateObject)) {
            info = {
                item: delegateObject.item,
                list: delegateObject.component,
            };
        }
        return info;
    };
    // 获取所有允许执行 Action 的组件
    ListState.prototype.getAllowComponents = function () {
        var _this = this;
        var view = this.context.view;
        var components = getComponents(view);
        var rst = [];
        each(components, function (component) {
            if (component.isList() && _this.allowSetStateByElement(component)) {
                rst.push(component);
            }
        });
        return rst;
    };
    /** 是否存在指定的状态 */
    ListState.prototype.hasState = function (list, item) {
        return list.hasState(item, this.stateName);
    };
    /** 清理组件的状态 */
    ListState.prototype.clearAllComponentsState = function () {
        var _this = this;
        var components = this.getAllowComponents();
        each(components, function (component) {
            component.clearItemsState(_this.stateName);
        });
    };
    // 不是所有的 component 都能进行 active，目前仅支持分类 scale 对应的组件
    ListState.prototype.allowSetStateByElement = function (component) {
        var field = component.get('field');
        if (!field) {
            return false;
        }
        if (this.cfg && this.cfg.componentNames) {
            var name_1 = component.get('name');
            // 如果配置了限制的 component name，则要进行检测
            if (this.cfg.componentNames.indexOf(name_1) === -1) {
                return false;
            }
        }
        var view = this.context.view;
        var scale = getScaleByField(view, field);
        return scale && scale.isCategory;
    };
    // 检测是否允许触发对应的状态改变事件
    ListState.prototype.allowSetStateByItem = function (item, list) {
        var ignoreStates = this.ignoreItemStates;
        if (ignoreStates.length) {
            var filterStates = ignoreStates.filter(function (state) {
                return list.hasState(item, state);
            });
            return filterStates.length === 0;
        }
        return true; // 没有定义忽略的状态时，允许
    };
    // 设置组件的 item active
    ListState.prototype.setStateByElement = function (component, element, enable) {
        var field = component.get('field');
        var view = this.context.view;
        var scale = getScaleByField(view, field);
        var value = getElementValue(element, field);
        var text = scale.getText(value);
        this.setItemsState(component, text, enable);
    };
    // 设置状态
    ListState.prototype.setStateEnable = function (enable) {
        var _this = this;
        var element = getCurrentElement(this.context);
        if (element) {
            // trigger by element
            var components = this.getAllowComponents();
            each(components, function (component) {
                _this.setStateByElement(component, element, enable);
            });
        }
        else {
            // 被组件触发
            var delegateObject = getDelegationObject(this.context);
            if (isList(delegateObject)) {
                var item = delegateObject.item, component = delegateObject.component;
                if (this.allowSetStateByElement(component) && this.allowSetStateByItem(item, component)) {
                    this.setItemState(component, item, enable);
                }
            }
        }
    };
    // 多个 item 设置状态
    ListState.prototype.setItemsState = function (list, name, enable) {
        var _this = this;
        var items = list.getItems();
        each(items, function (item) {
            if (item.name === name) {
                _this.setItemState(list, item, enable);
            }
        });
    };
    // 单个 item 设置状态
    ListState.prototype.setItemState = function (list, item, enable) {
        list.setItemState(item, this.stateName, enable);
    };
    /**
     * 设置状态
     */
    ListState.prototype.setState = function () {
        this.setStateEnable(true);
    };
    /**
     * 取消状态
     */
    ListState.prototype.reset = function () {
        this.setStateEnable(false);
    };
    /**
     * 切换状态
     */
    ListState.prototype.toggle = function () {
        var triggerInfo = this.getTriggerListInfo();
        if (triggerInfo && triggerInfo.item) {
            var list = triggerInfo.list, item = triggerInfo.item;
            var enable = this.hasState(list, item);
            this.setItemState(list, item, !enable);
        }
    };
    /**
     * 取消状态
     */
    ListState.prototype.clear = function () {
        var triggerInfo = this.getTriggerListInfo();
        if (triggerInfo) {
            triggerInfo.list.clearItemsState(this.stateName);
        }
        else {
            this.clearAllComponentsState();
        }
    };
    return ListState;
}(Action));
export default ListState;
//# sourceMappingURL=list-state.js.map