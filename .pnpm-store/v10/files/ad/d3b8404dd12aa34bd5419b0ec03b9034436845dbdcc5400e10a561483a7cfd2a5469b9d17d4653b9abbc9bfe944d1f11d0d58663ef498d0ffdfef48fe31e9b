import { __extends, __values } from "tslib";
import ListState from './list-state';
var STATUS_UNCHECKED = 'unchecked';
var ListFocus = /** @class */ (function (_super) {
    __extends(ListFocus, _super);
    function ListFocus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListFocus.prototype.toggle = function () {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
        var triggerInfo = this.getTriggerListInfo();
        if (triggerInfo === null || triggerInfo === void 0 ? void 0 : triggerInfo.item) {
            var list_1 = triggerInfo.list, clickedItem = triggerInfo.item;
            var items = list_1.getItems();
            var checkedItems = items.filter(function (t) { return !list_1.hasState(t, STATUS_UNCHECKED); });
            var uncheckedItems = items.filter(function (t) { return list_1.hasState(t, STATUS_UNCHECKED); });
            var checkedItem = checkedItems[0];
            /**
             * 1. 初始化，全部 checked。此时，点击 radio, clickItem 进入聚焦
             * 2. 当前只选中一个
             *    2.1 且选中 item 等于 clickItem，退出聚焦，全部重新选中
             *    2.2 替换聚焦的 item
             * 3. 其它，同 2.2
             */
            if (items.length === checkedItems.length) {
                try {
                    for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                        var item = items_1_1.value;
                        list_1.setItemState(item, STATUS_UNCHECKED, item.id !== clickedItem.id);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else if (items.length - uncheckedItems.length === 1) {
                if (checkedItem.id === clickedItem.id) {
                    try {
                        for (var items_2 = __values(items), items_2_1 = items_2.next(); !items_2_1.done; items_2_1 = items_2.next()) {
                            var item = items_2_1.value;
                            list_1.setItemState(item, STATUS_UNCHECKED, false);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (items_2_1 && !items_2_1.done && (_b = items_2.return)) _b.call(items_2);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                else {
                    try {
                        for (var items_3 = __values(items), items_3_1 = items_3.next(); !items_3_1.done; items_3_1 = items_3.next()) {
                            var item = items_3_1.value;
                            list_1.setItemState(item, STATUS_UNCHECKED, item.id !== clickedItem.id);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (items_3_1 && !items_3_1.done && (_c = items_3.return)) _c.call(items_3);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
            else {
                try {
                    for (var items_4 = __values(items), items_4_1 = items_4.next(); !items_4_1.done; items_4_1 = items_4.next()) {
                        var item = items_4_1.value;
                        list_1.setItemState(item, STATUS_UNCHECKED, item.id !== clickedItem.id);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (items_4_1 && !items_4_1.done && (_d = items_4.return)) _d.call(items_4);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
    };
    return ListFocus;
}(ListState));
export default ListFocus;
//# sourceMappingURL=list-focus.js.map