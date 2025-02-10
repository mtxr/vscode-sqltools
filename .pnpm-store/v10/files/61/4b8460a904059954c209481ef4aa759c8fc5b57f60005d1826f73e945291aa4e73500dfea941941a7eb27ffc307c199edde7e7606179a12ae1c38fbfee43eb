import { Event as GraphEvent } from '@antv/g-base';
/**
 *
 * @param group 分组
 * @param eventName 事件名
 * @param eventObject 事件对象
 */
export function propagationDelegate(group, eventName, eventObject) {
    var event = new GraphEvent(eventName, eventObject);
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
//# sourceMappingURL=event.js.map