import { registerAction, registerInteraction } from '@antv/g2';
import { get, isArray } from '@antv/util';
import { DrillDownAction } from './actions/drill-down';
/**
 * 判断是否为父节点
 */
export function isParentNode(context) {
    var data = get(context, ['event', 'data', 'data'], {});
    return isArray(data.children) && data.children.length > 0;
}
/**
 * 判断是否在中心
 */
function inCenter(context) {
    var coordinate = context.view.getCoordinate();
    var innerRadius = coordinate.innerRadius;
    if (innerRadius) {
        var _a = context.event, x = _a.x, y = _a.y;
        var _b = coordinate.center, centerX = _b.x, centerY = _b.y;
        var r = coordinate.getRadius() * innerRadius;
        var distance = Math.sqrt(Math.pow((centerX - x), 2) + Math.pow((centerY - y), 2));
        return distance < r;
    }
    return false;
}
registerAction('drill-down-action', DrillDownAction);
registerInteraction('drill-down', {
    showEnable: [
        { trigger: 'element:mouseenter', action: 'cursor:pointer', isEnable: isParentNode },
        { trigger: 'element:mouseleave', action: 'cursor:default' },
        // 中心处，肯定会触发 element:mouseleave 操作
        { trigger: 'element:mouseleave', action: 'cursor:pointer', isEnable: inCenter },
    ],
    start: [
        {
            trigger: 'element:click',
            isEnable: isParentNode,
            action: ['drill-down-action:click'],
        },
        {
            trigger: 'afterchangesize',
            action: ['drill-down-action:resetPosition'],
        },
        {
            // 点击中心，返回上一层
            trigger: 'click',
            isEnable: inCenter,
            action: ['drill-down-action:back'],
        },
    ],
});
//# sourceMappingURL=drill-down.js.map