"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cutoffCircle = exports.getMatrix = exports.getNodes = void 0;
var util_1 = require("@antv/util");
/**
 * 根据 edges 获取对应的 node 结构
 */
function getNodes(edges, sourceField, targetField) {
    var nodes = [];
    edges.forEach(function (e) {
        var source = e[sourceField];
        var target = e[targetField];
        if (!nodes.includes(source)) {
            nodes.push(source);
        }
        if (!nodes.includes(target)) {
            nodes.push(target);
        }
    });
    return nodes;
}
exports.getNodes = getNodes;
/**
 * 根据 edges 获取对应的 dfs 邻接矩阵
 */
function getMatrix(edges, nodes, sourceField, targetField) {
    var graphMatrix = {};
    nodes.forEach(function (pre) {
        graphMatrix[pre] = {};
        nodes.forEach(function (next) {
            graphMatrix[pre][next] = 0;
        });
    });
    edges.forEach(function (edge) {
        graphMatrix[edge[sourceField]][edge[targetField]] = 1;
    });
    return graphMatrix;
}
exports.getMatrix = getMatrix;
/**
 * 使用 DFS 思路切断桑基图数据中的环（会丢失数据），保证顺序
 * @param data
 * @param sourceField
 * @param targetField
 */
function cutoffCircle(edges, sourceField, targetField) {
    if (!(0, util_1.isArray)(edges))
        return [];
    // 待删除的环状结构
    var removedData = [];
    // 获取所有的节点
    var nodes = getNodes(edges, sourceField, targetField);
    // 获取节点与边的邻接矩阵
    var graphMatrix = getMatrix(edges, nodes, sourceField, targetField);
    // visited：标记节点访问状态, 0：未访问,1：访问中, -1：已访问
    var visited = {};
    // 初始化visited
    nodes.forEach(function (node) {
        visited[node] = 0;
    });
    // 图的深度遍历函数
    function DFS(dfsNode) {
        // 节点状态置为正在访问
        visited[dfsNode] = 1;
        nodes.forEach(function (node) {
            if (graphMatrix[dfsNode][node] != 0) {
                // 当前节点在访问中，再次被访问，证明有环，移动到 removeData
                if (visited[node] == 1) {
                    // 拼接为字符串，方便最后过滤
                    removedData.push("".concat(dfsNode, "_").concat(node));
                }
                else if (visited[node] == -1) {
                    // 当前结点及后边的结点都被访问过，直接跳至下一个结点
                    return;
                }
                else {
                    DFS(node); // 否则递归访问
                }
            }
        });
        //遍历过所有相连的结点后，把本节点标记为-1
        visited[dfsNode] = -1;
    }
    // 对每个节点执行 dfs 操作
    nodes.forEach(function (node) {
        //该结点后边的结点都被访问过了，跳过它
        if (visited[node] == -1) {
            return;
        }
        DFS(node);
    });
    if (removedData.length !== 0) {
        console.warn("sankey data contains circle, ".concat(removedData.length, " records removed."), removedData);
    }
    // 过滤 remove 路径
    return edges.filter(function (edge) { return removedData.findIndex(function (i) { return i === "".concat(edge[sourceField], "_").concat(edge[targetField]); }) < 0; });
}
exports.cutoffCircle = cutoffCircle;
//# sourceMappingURL=circle.js.map