import { __assign } from "tslib";
import { get, isArray } from '@antv/util';
import { HIERARCHY_DATA_TRANSFORM_PARAMS } from '../../interactions/actions/drill-down';
import { treemap } from '../../utils/hierarchy/treemap';
export function findInteraction(interactions, interactionType) {
    if (!isArray(interactions))
        return undefined;
    return interactions.find(function (i) { return i.type === interactionType; });
}
export function enableInteraction(interactions, interactionType) {
    var interaction = findInteraction(interactions, interactionType);
    return interaction && interaction.enable !== false;
}
/**
 * 是否允许下钻交互
 * @param interactions
 * @param interactionType
 * @returns
 */
export function enableDrillInteraction(options) {
    var interactions = options.interactions, drilldown = options.drilldown;
    // 兼容旧版本, treemap-drill-down
    return get(drilldown, 'enabled') || enableInteraction(interactions, 'treemap-drill-down');
}
export function resetDrillDown(chart) {
    var drillDownInteraction = chart.interactions['drill-down'];
    if (!drillDownInteraction)
        return;
    // @ts-ignore
    var drillDownAction = drillDownInteraction.context.actions.find(function (i) { return i.name === 'drill-down-action'; });
    drillDownAction.reset();
}
export function transformData(options) {
    var data = options.data, colorField = options.colorField, enableDrillDown = options.enableDrillDown, hierarchyConfig = options.hierarchyConfig;
    var nodes = treemap(data, __assign(__assign({}, hierarchyConfig), { 
        // @ts-ignore
        type: 'hierarchy.treemap', field: 'value', as: ['x', 'y'] }));
    var result = [];
    nodes.forEach(function (node) {
        if (node.depth === 0) {
            return null;
        }
        // 开启下钻，仅加载 depth === 1 的数据
        if (enableDrillDown && node.depth !== 1) {
            return null;
        }
        // 不开启下钻，加载所有叶子节点
        if (!enableDrillDown && node.children) {
            return null;
        }
        // path 信息仅挑选必要祖先元素属性，因为在有些属性是不必要(x, y), 或是不准确的(下钻时的 depth)，不对外透出
        var curPath = node.ancestors().map(function (n) { return ({
            data: n.data,
            height: n.height,
            value: n.value,
        }); });
        // 在下钻树图中，每次绘制的是当前层级信息，将父元素的层级信息（data.path) 做一层拼接。
        var path = enableDrillDown && isArray(data.path) ? curPath.concat(data.path.slice(1)) : curPath;
        var nodeInfo = Object.assign({}, node.data, __assign({ x: node.x, y: node.y, depth: node.depth, value: node.value, path: path }, node));
        if (!node.data[colorField] && node.parent) {
            var ancestorNode = node.ancestors().find(function (n) { return n.data[colorField]; });
            nodeInfo[colorField] = ancestorNode === null || ancestorNode === void 0 ? void 0 : ancestorNode.data[colorField];
        }
        else {
            nodeInfo[colorField] = node.data[colorField];
        }
        nodeInfo[HIERARCHY_DATA_TRANSFORM_PARAMS] = { hierarchyConfig: hierarchyConfig, colorField: colorField, enableDrillDown: enableDrillDown };
        result.push(nodeInfo);
    });
    return result;
}
//# sourceMappingURL=utils.js.map