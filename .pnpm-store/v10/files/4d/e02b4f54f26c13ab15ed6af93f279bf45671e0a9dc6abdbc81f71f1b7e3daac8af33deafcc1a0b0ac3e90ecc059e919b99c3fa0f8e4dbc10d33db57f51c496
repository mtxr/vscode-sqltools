"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformToViewsData = exports.getNodePaddingRatio = exports.getNodeWidthRatio = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var data_1 = require("../../utils/data");
var circle_1 = require("./circle");
var layout_1 = require("./layout");
/**
 * 是否是 node-link 类型的数据结构
 * @param dataTyp
 * @returns
 */
function isNodeLink(dataType) {
    return dataType === 'node-link';
}
function getNodeWidthRatio(nodeWidth, nodeWidthRatio, width) {
    return (0, utils_1.isRealNumber)(nodeWidth) ? nodeWidth / width : nodeWidthRatio;
}
exports.getNodeWidthRatio = getNodeWidthRatio;
function getNodePaddingRatio(nodePadding, nodePaddingRatio, height) {
    return (0, utils_1.isRealNumber)(nodePadding) ? nodePadding / height : nodePaddingRatio;
}
exports.getNodePaddingRatio = getNodePaddingRatio;
/**
 * 将桑基图配置经过 layout，生成最终的 view 数据
 * @param options
 * @param width
 * @param height
 */
function transformToViewsData(options, width, height) {
    var dataType = options.dataType, data = options.data, sourceField = options.sourceField, targetField = options.targetField, weightField = options.weightField, nodeAlign = options.nodeAlign, nodeSort = options.nodeSort, nodePadding = options.nodePadding, nodePaddingRatio = options.nodePaddingRatio, nodeWidth = options.nodeWidth, nodeWidthRatio = options.nodeWidthRatio, nodeDepth = options.nodeDepth, _a = options.rawFields, rawFields = _a === void 0 ? [] : _a;
    var sankeyLayoutInputData;
    if (!isNodeLink(dataType)) {
        sankeyLayoutInputData = (0, data_1.transformDataToNodeLinkData)((0, circle_1.cutoffCircle)(data, sourceField, targetField), sourceField, targetField, weightField, rawFields);
    }
    else {
        sankeyLayoutInputData = data;
    }
    // 3. layout 之后的数据
    var _b = (0, layout_1.sankeyLayout)({
        nodeAlign: nodeAlign,
        nodePadding: getNodePaddingRatio(nodePadding, nodePaddingRatio, height),
        nodeWidth: getNodeWidthRatio(nodeWidth, nodeWidthRatio, width),
        nodeSort: nodeSort,
        nodeDepth: nodeDepth,
    }, sankeyLayoutInputData), nodes = _b.nodes, links = _b.links;
    // 4. 生成绘图数据
    return {
        nodes: nodes.map(function (node) {
            return tslib_1.__assign(tslib_1.__assign({}, (0, utils_1.pick)(node, tslib_1.__spreadArray(['x', 'y', 'name'], rawFields, true))), { isNode: true });
        }),
        edges: links.map(function (link) {
            return tslib_1.__assign(tslib_1.__assign({ source: link.source.name, target: link.target.name, name: link.source.name || link.target.name }, (0, utils_1.pick)(link, tslib_1.__spreadArray(['x', 'y', 'value'], rawFields, true))), { isNode: false });
        }),
    };
}
exports.transformToViewsData = transformToViewsData;
//# sourceMappingURL=helper.js.map