import { __assign, __spreadArray } from "tslib";
import { isRealNumber, pick } from '../../utils';
import { transformDataToNodeLinkData } from '../../utils/data';
import { cutoffCircle } from './circle';
import { sankeyLayout } from './layout';
/**
 * 是否是 node-link 类型的数据结构
 * @param dataTyp
 * @returns
 */
function isNodeLink(dataType) {
    return dataType === 'node-link';
}
export function getNodeWidthRatio(nodeWidth, nodeWidthRatio, width) {
    return isRealNumber(nodeWidth) ? nodeWidth / width : nodeWidthRatio;
}
export function getNodePaddingRatio(nodePadding, nodePaddingRatio, height) {
    return isRealNumber(nodePadding) ? nodePadding / height : nodePaddingRatio;
}
/**
 * 将桑基图配置经过 layout，生成最终的 view 数据
 * @param options
 * @param width
 * @param height
 */
export function transformToViewsData(options, width, height) {
    var dataType = options.dataType, data = options.data, sourceField = options.sourceField, targetField = options.targetField, weightField = options.weightField, nodeAlign = options.nodeAlign, nodeSort = options.nodeSort, nodePadding = options.nodePadding, nodePaddingRatio = options.nodePaddingRatio, nodeWidth = options.nodeWidth, nodeWidthRatio = options.nodeWidthRatio, nodeDepth = options.nodeDepth, _a = options.rawFields, rawFields = _a === void 0 ? [] : _a;
    var sankeyLayoutInputData;
    if (!isNodeLink(dataType)) {
        sankeyLayoutInputData = transformDataToNodeLinkData(cutoffCircle(data, sourceField, targetField), sourceField, targetField, weightField, rawFields);
    }
    else {
        sankeyLayoutInputData = data;
    }
    // 3. layout 之后的数据
    var _b = sankeyLayout({
        nodeAlign: nodeAlign,
        nodePadding: getNodePaddingRatio(nodePadding, nodePaddingRatio, height),
        nodeWidth: getNodeWidthRatio(nodeWidth, nodeWidthRatio, width),
        nodeSort: nodeSort,
        nodeDepth: nodeDepth,
    }, sankeyLayoutInputData), nodes = _b.nodes, links = _b.links;
    // 4. 生成绘图数据
    return {
        nodes: nodes.map(function (node) {
            return __assign(__assign({}, pick(node, __spreadArray(['x', 'y', 'name'], rawFields, true))), { isNode: true });
        }),
        edges: links.map(function (link) {
            return __assign(__assign({ source: link.source.name, target: link.target.name, name: link.source.name || link.target.name }, pick(link, __spreadArray(['x', 'y', 'value'], rawFields, true))), { isNode: false });
        }),
    };
}
//# sourceMappingURL=helper.js.map