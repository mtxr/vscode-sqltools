"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sankeyLayout = exports.getDefaultOptions = exports.getNodeAlignFunction = void 0;
var util_1 = require("@antv/util");
var sankey_1 = require("./sankey");
var ALIGN_METHOD = {
    left: sankey_1.left,
    right: sankey_1.right,
    center: sankey_1.center,
    justify: sankey_1.justify,
};
/**
 * 默认值
 */
var DEFAULT_OPTIONS = {
    nodeId: function (node) { return node.index; },
    nodeAlign: 'justify',
    nodeWidth: 0.008,
    nodePadding: 0.03,
    nodeSort: undefined,
};
/**
 * 获得 align function
 * @param nodeAlign
 * @param nodeDepth
 */
function getNodeAlignFunction(nodeAlign) {
    var func = (0, util_1.isString)(nodeAlign) ? ALIGN_METHOD[nodeAlign] : (0, util_1.isFunction)(nodeAlign) ? nodeAlign : null;
    return func || sankey_1.justify;
}
exports.getNodeAlignFunction = getNodeAlignFunction;
function getDefaultOptions(sankeyLayoutOptions) {
    return (0, util_1.assign)({}, DEFAULT_OPTIONS, sankeyLayoutOptions);
}
exports.getDefaultOptions = getDefaultOptions;
/**
 * 桑基图利用数据进行布局的函数，最终返回节点、边的位置（0 - 1 的信息）
 * 将会修改 data 数据
 * @param sankeyLayoutOptions
 * @param data
 */
function sankeyLayout(sankeyLayoutOptions, data) {
    var options = getDefaultOptions(sankeyLayoutOptions);
    var nodeId = options.nodeId, nodeSort = options.nodeSort, nodeAlign = options.nodeAlign, nodeWidth = options.nodeWidth, nodePadding = options.nodePadding, nodeDepth = options.nodeDepth;
    var sankeyProcessor = (0, sankey_1.sankey)()
        // .links((d: any) => d.links)
        // .nodes((d: any) => d.nodes)
        .nodeSort(nodeSort)
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .nodeDepth(nodeDepth)
        .nodeAlign(getNodeAlignFunction(nodeAlign))
        .extent([
        [0, 0],
        [1, 1],
    ])
        .nodeId(nodeId);
    // 进行桑基图布局处理
    var layoutData = sankeyProcessor(data);
    // post process (x, y), etc.
    var nodes = layoutData.nodes
        .map(function (node) {
        var x0 = node.x0, x1 = node.x1, y0 = node.y0, y1 = node.y1;
        /* points
         * 3---2
         * |   |
         * 0---1
         */
        node.x = [x0, x1, x1, x0];
        node.y = [y0, y0, y1, y1];
        return node;
    })
        .filter(function (node) {
        return node.name !== null;
    });
    var links = layoutData.links
        .map(function (edge) {
        var source = edge.source, target = edge.target;
        var sx = source.x1;
        var tx = target.x0;
        edge.x = [sx, sx, tx, tx];
        var offset = edge.width / 2;
        edge.y = [edge.y0 + offset, edge.y0 - offset, edge.y1 + offset, edge.y1 - offset];
        return edge;
    })
        .filter(function (edge) {
        var source = edge.source, target = edge.target;
        return source.name !== null && target.name !== null;
    });
    return { nodes: nodes, links: links };
}
exports.sankeyLayout = sankeyLayout;
//# sourceMappingURL=layout.js.map