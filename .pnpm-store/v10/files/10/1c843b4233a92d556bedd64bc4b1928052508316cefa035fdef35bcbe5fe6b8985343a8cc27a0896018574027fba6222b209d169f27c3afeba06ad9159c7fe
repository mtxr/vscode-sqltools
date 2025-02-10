"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformData = exports.resetDrillDown = exports.enableDrillInteraction = exports.enableInteraction = exports.findInteraction = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var drill_down_1 = require("../../interactions/actions/drill-down");
var treemap_1 = require("../../utils/hierarchy/treemap");
function findInteraction(interactions, interactionType) {
    if (!(0, util_1.isArray)(interactions))
        return undefined;
    return interactions.find(function (i) { return i.type === interactionType; });
}
exports.findInteraction = findInteraction;
function enableInteraction(interactions, interactionType) {
    var interaction = findInteraction(interactions, interactionType);
    return interaction && interaction.enable !== false;
}
exports.enableInteraction = enableInteraction;
/**
 * 是否允许下钻交互
 * @param interactions
 * @param interactionType
 * @returns
 */
function enableDrillInteraction(options) {
    var interactions = options.interactions, drilldown = options.drilldown;
    // 兼容旧版本, treemap-drill-down
    return (0, util_1.get)(drilldown, 'enabled') || enableInteraction(interactions, 'treemap-drill-down');
}
exports.enableDrillInteraction = enableDrillInteraction;
function resetDrillDown(chart) {
    var drillDownInteraction = chart.interactions['drill-down'];
    if (!drillDownInteraction)
        return;
    // @ts-ignore
    var drillDownAction = drillDownInteraction.context.actions.find(function (i) { return i.name === 'drill-down-action'; });
    drillDownAction.reset();
}
exports.resetDrillDown = resetDrillDown;
function transformData(options) {
    var data = options.data, colorField = options.colorField, enableDrillDown = options.enableDrillDown, hierarchyConfig = options.hierarchyConfig;
    var nodes = (0, treemap_1.treemap)(data, tslib_1.__assign(tslib_1.__assign({}, hierarchyConfig), { 
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
        var path = enableDrillDown && (0, util_1.isArray)(data.path) ? curPath.concat(data.path.slice(1)) : curPath;
        var nodeInfo = Object.assign({}, node.data, tslib_1.__assign({ x: node.x, y: node.y, depth: node.depth, value: node.value, path: path }, node));
        if (!node.data[colorField] && node.parent) {
            var ancestorNode = node.ancestors().find(function (n) { return n.data[colorField]; });
            nodeInfo[colorField] = ancestorNode === null || ancestorNode === void 0 ? void 0 : ancestorNode.data[colorField];
        }
        else {
            nodeInfo[colorField] = node.data[colorField];
        }
        nodeInfo[drill_down_1.HIERARCHY_DATA_TRANSFORM_PARAMS] = { hierarchyConfig: hierarchyConfig, colorField: colorField, enableDrillDown: enableDrillDown };
        result.push(nodeInfo);
    });
    return result;
}
exports.transformData = transformData;
//# sourceMappingURL=utils.js.map