"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isParentNode = void 0;
var g2_1 = require("@antv/g2");
var util_1 = require("@antv/util");
var drill_down_1 = require("./actions/drill-down");
/**
 * 判断是否为父节点
 */
function isParentNode(context) {
    var data = (0, util_1.get)(context, ['event', 'data', 'data'], {});
    return (0, util_1.isArray)(data.children) && data.children.length > 0;
}
exports.isParentNode = isParentNode;
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
(0, g2_1.registerAction)('drill-down-action', drill_down_1.DrillDownAction);
(0, g2_1.registerInteraction)('drill-down', {
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