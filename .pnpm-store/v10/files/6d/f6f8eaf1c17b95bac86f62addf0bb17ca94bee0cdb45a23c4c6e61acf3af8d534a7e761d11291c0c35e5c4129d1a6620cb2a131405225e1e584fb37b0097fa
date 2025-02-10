"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chordLayout = exports.getDefaultOptions = void 0;
/*
 * for Arc Diagram (edges without weight) / Chord Diagram (edges with source and target weight)
 * graph data required (nodes, edges)
 */
var util_1 = require("@antv/util");
var DEFAULT_OPTIONS = {
    y: 0,
    nodeWidthRatio: 0.05,
    weight: false,
    nodePaddingRatio: 0.1,
    id: function (node) { return node.id; },
    source: function (edge) { return edge.source; },
    target: function (edge) { return edge.target; },
    sourceWeight: function (edge) { return edge.value || 1; },
    targetWeight: function (edge) { return edge.value || 1; },
    sortBy: null, // optional, id | weight | frequency | {function}
};
/**
 * 处理节点的value、edges
 * @param nodeById
 * @param edges
 * @param options
 */
function processGraph(nodeById, edges, options) {
    (0, util_1.forIn)(nodeById, function (node, id) {
        // in edges, out edges
        node.inEdges = edges.filter(function (edge) { return "".concat(options.target(edge)) === "".concat(id); });
        node.outEdges = edges.filter(function (edge) { return "".concat(options.source(edge)) === "".concat(id); });
        // frequency
        node.edges = node.outEdges.concat(node.inEdges);
        node.frequency = node.edges.length;
        // weight
        node.value = 0;
        node.inEdges.forEach(function (edge) {
            node.value += options.targetWeight(edge);
        });
        node.outEdges.forEach(function (edge) {
            node.value += options.sourceWeight(edge);
        });
    });
}
/**
 * 节点排序
 * @param nodes
 * @param options
 */
function sortNodes(nodes, options) {
    var sortMethods = {
        weight: function (a, b) { return b.value - a.value; },
        frequency: function (a, b) { return b.frequency - a.frequency; },
        id: function (a, b) { return "".concat(options.id(a)).localeCompare("".concat(options.id(b))); },
    };
    var method = sortMethods[options.sortBy];
    if (!method && (0, util_1.isFunction)(options.sortBy)) {
        method = options.sortBy;
    }
    if (method) {
        nodes.sort(method);
    }
}
function layoutNodes(nodes, options) {
    var len = nodes.length;
    if (!len) {
        throw new TypeError("Invalid nodes: it's empty!");
    }
    if (options.weight) {
        var nodePaddingRatio_1 = options.nodePaddingRatio;
        if (nodePaddingRatio_1 < 0 || nodePaddingRatio_1 >= 1) {
            throw new TypeError('Invalid nodePaddingRatio: it must be in range [0, 1)!');
        }
        var margin_1 = nodePaddingRatio_1 / (2 * len);
        var nodeWidthRatio_1 = options.nodeWidthRatio;
        if (nodeWidthRatio_1 <= 0 || nodeWidthRatio_1 >= 1) {
            throw new TypeError('Invalid nodeWidthRatio: it must be in range (0, 1)!');
        }
        var totalValue_1 = 0;
        nodes.forEach(function (node) {
            totalValue_1 += node.value;
        });
        nodes.forEach(function (node) {
            node.weight = node.value / totalValue_1;
            node.width = node.weight * (1 - nodePaddingRatio_1);
            node.height = nodeWidthRatio_1;
        });
        nodes.forEach(function (node, index) {
            // x
            var deltaX = 0;
            for (var i = index - 1; i >= 0; i--) {
                deltaX += nodes[i].width + 2 * margin_1;
            }
            var minX = (node.minX = margin_1 + deltaX);
            var maxX = (node.maxX = node.minX + node.width);
            var minY = (node.minY = options.y - nodeWidthRatio_1 / 2);
            var maxY = (node.maxY = minY + nodeWidthRatio_1);
            node.x = [minX, maxX, maxX, minX];
            node.y = [minY, minY, maxY, maxY];
            /* points
             * 3---2
             * |   |
             * 0---1
             */
            // node.x = minX + 0.5 * node.width;
            // node.y = options.y;
        });
    }
    else {
        var deltaX_1 = 1 / len;
        nodes.forEach(function (node, index) {
            node.x = (index + 0.5) * deltaX_1;
            node.y = options.y;
        });
    }
    return nodes;
}
function locatingEdges(nodeById, edges, options) {
    if (options.weight) {
        var valueById_1 = {};
        (0, util_1.forIn)(nodeById, function (node, id) {
            valueById_1[id] = node.value;
        });
        edges.forEach(function (edge) {
            var sId = options.source(edge);
            var tId = options.target(edge);
            var sNode = nodeById[sId];
            var tNode = nodeById[tId];
            if (sNode && tNode) {
                var sValue = valueById_1[sId];
                var currentSValue = options.sourceWeight(edge);
                var sStart = sNode.minX + ((sNode.value - sValue) / sNode.value) * sNode.width;
                var sEnd = sStart + (currentSValue / sNode.value) * sNode.width;
                valueById_1[sId] -= currentSValue;
                var tValue = valueById_1[tId];
                var currentTValue = options.targetWeight(edge);
                var tStart = tNode.minX + ((tNode.value - tValue) / tNode.value) * tNode.width;
                var tEnd = tStart + (currentTValue / tNode.value) * tNode.width;
                valueById_1[tId] -= currentTValue;
                var y = options.y;
                edge.x = [sStart, sEnd, tStart, tEnd];
                edge.y = [y, y, y, y];
                // 将edge的source与target的id换为 sourceNode与targetNode
                edge.source = sNode;
                edge.target = tNode;
            }
        });
    }
    else {
        edges.forEach(function (edge) {
            var sNode = nodeById[options.source(edge)];
            var tNode = nodeById[options.target(edge)];
            if (sNode && tNode) {
                edge.x = [sNode.x, tNode.x];
                edge.y = [sNode.y, tNode.y];
                // 将edge的source与target的id换为 sourceNode与targetNode
                edge.source = sNode;
                edge.target = tNode;
            }
        });
    }
    return edges;
}
function getDefaultOptions(options) {
    return (0, util_1.assign)({}, DEFAULT_OPTIONS, options);
}
exports.getDefaultOptions = getDefaultOptions;
function chordLayout(chordLayoutOptions, chordLayoutInputData) {
    var options = getDefaultOptions(chordLayoutOptions);
    var nodeById = {};
    var nodes = chordLayoutInputData.nodes;
    var links = chordLayoutInputData.links;
    nodes.forEach(function (node) {
        var id = options.id(node);
        nodeById[id] = node;
    });
    processGraph(nodeById, links, options);
    sortNodes(nodes, options);
    var outputNodes = layoutNodes(nodes, options);
    var outputLinks = locatingEdges(nodeById, links, options);
    return {
        nodes: outputNodes,
        links: outputLinks,
    };
}
exports.chordLayout = chordLayout;
//# sourceMappingURL=chord.js.map