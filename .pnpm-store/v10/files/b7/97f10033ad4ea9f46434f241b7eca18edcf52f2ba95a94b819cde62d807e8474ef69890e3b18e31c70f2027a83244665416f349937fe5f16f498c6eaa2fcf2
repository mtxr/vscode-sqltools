import { __extends } from "tslib";
import { each } from '@antv/util';
import { clearList } from './list-highlight-util';
import ListState from './list-state';
var STATUS_UNACTIVE = 'inactive';
var STATUS_ACTIVE = 'active';
/**
 * highlight Action 的效果是 active 和 inactive 两个状态的组合
 * @class
 * @ignore
 */
var ListHighlight = /** @class */ (function (_super) {
    __extends(ListHighlight, _super);
    function ListHighlight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stateName = STATUS_ACTIVE;
        _this.ignoreItemStates = ['unchecked']; // 当存在 unchecked 状态时不触发
        return _this;
    }
    // 如果 item.name 匹配，则设置 highlight 以及取消
    ListHighlight.prototype.setItemsState = function (list, name, enable) {
        this.setHighlightBy(list, function (item) { return item.name === name; }, enable);
    };
    // 单个 item 设置状态
    ListHighlight.prototype.setItemState = function (list, item, enable) {
        var items = list.getItems();
        this.setHighlightBy(list, function (el) { return el === item; }, enable);
    };
    // 根据条件设置 highlight
    ListHighlight.prototype.setHighlightBy = function (list, callback, enable) {
        var items = list.getItems();
        if (enable) {
            // 设置 highlight 时，保留之前已经 Highlight 的项
            each(items, function (item) {
                if (callback(item)) {
                    if (list.hasState(item, STATUS_UNACTIVE)) {
                        list.setItemState(item, STATUS_UNACTIVE, false);
                    }
                    list.setItemState(item, STATUS_ACTIVE, true);
                }
                else if (!list.hasState(item, STATUS_ACTIVE)) {
                    list.setItemState(item, STATUS_UNACTIVE, true);
                }
            });
        }
        else {
            var activeItems = list.getItemsByState(STATUS_ACTIVE);
            var allCancel_1 = true;
            // 检测 activeItems 是否要全部取消
            each(activeItems, function (item) {
                if (!callback(item)) {
                    allCancel_1 = false;
                    return false;
                }
            });
            if (allCancel_1) {
                this.clear();
            }
            else {
                // 如果不是都要取消 highlight, 则设置匹配的 element 的状态为 unactive
                // 其他 element 状态不变
                each(items, function (item) {
                    if (callback(item)) {
                        if (list.hasState(item, STATUS_ACTIVE)) {
                            list.setItemState(item, STATUS_ACTIVE, false);
                        }
                        list.setItemState(item, STATUS_UNACTIVE, true);
                    }
                });
            }
        }
    };
    /**
     * highlight 图例项（坐标轴文本）
     */
    ListHighlight.prototype.highlight = function () {
        this.setState();
    };
    // 需要全部清理 active 和 unactive
    ListHighlight.prototype.clear = function () {
        var triggerInfo = this.getTriggerListInfo();
        if (triggerInfo) {
            clearList(triggerInfo.list);
        }
        else {
            // 如果不是 component 的事件触发，则所有满足触发条件的组件都清除该状态
            var components = this.getAllowComponents();
            each(components, function (component) {
                component.clearItemsState(STATUS_ACTIVE);
                component.clearItemsState(STATUS_UNACTIVE);
            });
        }
    };
    return ListHighlight;
}(ListState));
export default ListHighlight;
//# sourceMappingURL=list-highlight.js.map