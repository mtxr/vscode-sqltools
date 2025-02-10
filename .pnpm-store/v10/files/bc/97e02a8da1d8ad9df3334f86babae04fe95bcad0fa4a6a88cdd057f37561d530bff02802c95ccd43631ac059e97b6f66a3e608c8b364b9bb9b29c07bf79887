"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propagationDelegate = void 0;
var g_base_1 = require("@antv/g-base");
/**
 *
 * @param group 分组
 * @param eventName 事件名
 * @param eventObject 事件对象
 */
function propagationDelegate(group, eventName, eventObject) {
    var event = new g_base_1.Event(eventName, eventObject);
    event.target = group;
    event.propagationPath.push(group); // 从当前 group 开始触发 delegation
    group.emitDelegation(eventName, event);
    var parent = group.getParent();
    // 执行冒泡
    while (parent) {
        // 委托事件要先触发
        parent.emitDelegation(eventName, event);
        event.propagationPath.push(parent);
        parent = parent.getParent();
    }
}
exports.propagationDelegate = propagationDelegate;
//# sourceMappingURL=event.js.map