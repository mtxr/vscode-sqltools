"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearList = void 0;
var util_1 = require("@antv/util");
var STATUS_UNACTIVE = 'inactive';
var STATUS_ACTIVE = 'active';
/**
 * 清理图例的 Highlight 效果
 * @param list 列表组件，图例或者坐标轴
 * @ignore
 */
function clearList(list) {
    var items = list.getItems();
    (0, util_1.each)(items, function (item) {
        if (list.hasState(item, STATUS_ACTIVE)) {
            list.setItemState(item, STATUS_ACTIVE, false);
        }
        if (list.hasState(item, STATUS_UNACTIVE)) {
            list.setItemState(item, STATUS_UNACTIVE, false);
        }
    });
}
exports.clearList = clearList;
//# sourceMappingURL=list-highlight-util.js.map