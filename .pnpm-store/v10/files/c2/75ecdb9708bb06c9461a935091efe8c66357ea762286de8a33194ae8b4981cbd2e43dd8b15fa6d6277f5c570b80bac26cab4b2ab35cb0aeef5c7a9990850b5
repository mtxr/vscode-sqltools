import { __extends } from "tslib";
import { each, some } from '@antv/util';
import ListState from './list-state';
var STATUS_UNCHECKED = 'unchecked';
var STATUS_CHECKED = 'checked';
/**
 * checked Action
 * 提供三个对外方法
 * 1. toggle 切换状态
 * 2. checked 选中
 * 3. reset 清除重置
 */
var ListChecked = /** @class */ (function (_super) {
    __extends(ListChecked, _super);
    function ListChecked() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stateName = STATUS_CHECKED;
        return _this;
    }
    // 单个 item 设置状态
    ListChecked.prototype.setItemState = function (list, item, enable) {
        this.setCheckedBy(list, function (el) { return el === item; }, enable);
    };
    // 根据条件设置 checked
    ListChecked.prototype.setCheckedBy = function (list, callback, enable) {
        var items = list.getItems();
        if (enable) {
            // 设置 checked 时，保留之前已经 checked 的项
            each(items, function (item) {
                if (callback(item)) {
                    if (list.hasState(item, STATUS_UNCHECKED)) {
                        list.setItemState(item, STATUS_UNCHECKED, false);
                    }
                    list.setItemState(item, STATUS_CHECKED, true);
                }
                else if (!list.hasState(item, STATUS_CHECKED)) {
                    list.setItemState(item, STATUS_UNCHECKED, true);
                }
            });
        }
    };
    /**
     * 切换状态.
     * 1. 当全部选中的时候 或者 当前 item 未选中时，进行激活操作
     * 2. 否则，重置
     * @override
     */
    ListChecked.prototype.toggle = function () {
        var triggerInfo = this.getTriggerListInfo();
        if (triggerInfo && triggerInfo.item) {
            var list_1 = triggerInfo.list, item = triggerInfo.item;
            // 不知道 🤷‍♀️ 只认 unchecked status
            var allChecked = !some(list_1.getItems(), function (t) { return list_1.hasState(t, STATUS_UNCHECKED); });
            //
            if (allChecked || list_1.hasState(item, STATUS_UNCHECKED)) {
                this.setItemState(list_1, item, true);
            }
            else {
                this.reset();
            }
        }
    };
    /**
     * checked 图例项
     */
    ListChecked.prototype.checked = function () {
        this.setState();
    };
    /**
     * 重置，需要全部清理 checked 和 unchecked
     */
    ListChecked.prototype.reset = function () {
        var components = this.getAllowComponents();
        each(components, function (component) {
            component.clearItemsState(STATUS_CHECKED);
            component.clearItemsState(STATUS_UNCHECKED);
        });
    };
    return ListChecked;
}(ListState));
export default ListChecked;
//# sourceMappingURL=list-checked.js.map