"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sankey = void 0;
var align_1 = require("./align");
var helper_1 = require("./helper");
function ascendingSourceBreadth(a, b) {
    return ascendingBreadth(a.source, b.source) || a.index - b.index;
}
function ascendingTargetBreadth(a, b) {
    return ascendingBreadth(a.target, b.target) || a.index - b.index;
}
function ascendingBreadth(a, b) {
    return a.y0 - b.y0;
}
function value(d) {
    return d.value;
}
function defaultId(d) {
    return d.index;
}
function defaultNodes(graph) {
    return graph.nodes;
}
function defaultLinks(graph) {
    return graph.links;
}
function find(nodeById, id) {
    var node = nodeById.get(id);
    if (!node)
        throw new Error('missing: ' + id);
    return node;
}
function computeLinkBreadths(_a) {
    var nodes = _a.nodes;
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        var y0 = node.y0;
        var y1 = y0;
        for (var _b = 0, _c = node.sourceLinks; _b < _c.length; _b++) {
            var link = _c[_b];
            link.y0 = y0 + link.width / 2;
            y0 += link.width;
        }
        for (var _d = 0, _e = node.targetLinks; _d < _e.length; _d++) {
            var link = _e[_d];
            link.y1 = y1 + link.width / 2;
            y1 += link.width;
        }
    }
}
function Sankey() {
    var x0 = 0, y0 = 0, x1 = 1, y1 = 1; // extent
    var dx = 24; // nodeWidth
    var dy = 8, py; // nodePadding
    var id = defaultId;
    var align = align_1.justify;
    var depth;
    var sort;
    var linkSort;
    var nodes = defaultNodes;
    var links = defaultLinks;
    var iterations = 6;
    function sankey(arg) {
        var graph = {
            nodes: nodes(arg),
            links: links(arg),
        };
        computeNodeLinks(graph);
        computeNodeValues(graph);
        computeNodeDepths(graph);
        computeNodeHeights(graph);
        computeNodeBreadths(graph);
        computeLinkBreadths(graph);
        return graph;
    }
    sankey.update = function (graph) {
        computeLinkBreadths(graph);
        return graph;
    };
    sankey.nodeId = function (_) {
        return arguments.length ? ((id = typeof _ === 'function' ? _ : (0, helper_1.constant)(_)), sankey) : id;
    };
    sankey.nodeAlign = function (_) {
        return arguments.length ? ((align = typeof _ === 'function' ? _ : (0, helper_1.constant)(_)), sankey) : align;
    };
    sankey.nodeDepth = function (_) {
        return arguments.length ? ((depth = typeof _ === 'function' ? _ : _), sankey) : depth;
    };
    sankey.nodeSort = function (_) {
        return arguments.length ? ((sort = _), sankey) : sort;
    };
    sankey.nodeWidth = function (_) {
        return arguments.length ? ((dx = +_), sankey) : dx;
    };
    sankey.nodePadding = function (_) {
        return arguments.length ? ((dy = py = +_), sankey) : dy;
    };
    sankey.nodes = function (_) {
        return arguments.length ? ((nodes = typeof _ === 'function' ? _ : (0, helper_1.constant)(_)), sankey) : nodes;
    };
    sankey.links = function (_) {
        return arguments.length ? ((links = typeof _ === 'function' ? _ : (0, helper_1.constant)(_)), sankey) : links;
    };
    sankey.linkSort = function (_) {
        return arguments.length ? ((linkSort = _), sankey) : linkSort;
    };
    sankey.size = function (_) {
        return arguments.length ? ((x0 = y0 = 0), (x1 = +_[0]), (y1 = +_[1]), sankey) : [x1 - x0, y1 - y0];
    };
    sankey.extent = function (_) {
        return arguments.length
            ? ((x0 = +_[0][0]), (x1 = +_[1][0]), (y0 = +_[0][1]), (y1 = +_[1][1]), sankey)
            : [
                [x0, y0],
                [x1, y1],
            ];
    };
    sankey.iterations = function (_) {
        return arguments.length ? ((iterations = +_), sankey) : iterations;
    };
    function computeNodeLinks(_a) {
        var nodes = _a.nodes, links = _a.links;
        nodes.forEach(function (node, idx) {
            node.index = idx;
            node.sourceLinks = [];
            node.targetLinks = [];
        });
        var nodeById = new Map(nodes.map(function (d) { return [id(d), d]; }));
        links.forEach(function (link, idx) {
            link.index = idx;
            var source = link.source, target = link.target;
            if (typeof source !== 'object')
                source = link.source = find(nodeById, source);
            if (typeof target !== 'object')
                target = link.target = find(nodeById, target);
            source.sourceLinks.push(link);
            target.targetLinks.push(link);
        });
        if (linkSort != null) {
            for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
                var _b = nodes_2[_i], sourceLinks = _b.sourceLinks, targetLinks = _b.targetLinks;
                sourceLinks.sort(linkSort);
                targetLinks.sort(linkSort);
            }
        }
    }
    function computeNodeValues(_a) {
        var nodes = _a.nodes;
        for (var _i = 0, nodes_3 = nodes; _i < nodes_3.length; _i++) {
            var node = nodes_3[_i];
            node.value =
                node.fixedValue === undefined
                    ? Math.max((0, helper_1.sumBy)(node.sourceLinks, value), (0, helper_1.sumBy)(node.targetLinks, value))
                    : node.fixedValue;
        }
    }
    function computeNodeDepths(_a) {
        var nodes = _a.nodes;
        var n = nodes.length;
        var current = new Set(nodes);
        var next = new Set();
        var x = 0;
        while (current.size) {
            current.forEach(function (node) {
                node.depth = x;
                for (var _i = 0, _a = node.sourceLinks; _i < _a.length; _i++) {
                    var target = _a[_i].target;
                    next.add(target);
                }
            });
            if (++x > n)
                throw new Error('circular link');
            current = next;
            next = new Set();
        }
        // 如果配置了 depth，则设置自定义 depth
        if (depth) {
            var maxDepth = Math.max((0, helper_1.maxValueBy)(nodes, function (d) { return d.depth; }) + 1, 0);
            var node = void 0;
            for (var i = 0; i < nodes.length; i++) {
                node = nodes[i];
                node.depth = depth.call(null, node, maxDepth);
            }
        }
    }
    function computeNodeHeights(_a) {
        var nodes = _a.nodes;
        var n = nodes.length;
        var current = new Set(nodes);
        var next = new Set();
        var x = 0;
        while (current.size) {
            current.forEach(function (node) {
                node.height = x;
                for (var _i = 0, _a = node.targetLinks; _i < _a.length; _i++) {
                    var source = _a[_i].source;
                    next.add(source);
                }
            });
            if (++x > n)
                throw new Error('circular link');
            current = next;
            next = new Set();
        }
    }
    function computeNodeLayers(_a) {
        var nodes = _a.nodes;
        var x = Math.max((0, helper_1.maxValueBy)(nodes, function (d) { return d.depth; }) + 1, 0);
        var kx = (x1 - x0 - dx) / (x - 1);
        var columns = new Array(x).fill(0).map(function () { return []; });
        for (var _i = 0, nodes_4 = nodes; _i < nodes_4.length; _i++) {
            var node = nodes_4[_i];
            var i = Math.max(0, Math.min(x - 1, Math.floor(align.call(null, node, x))));
            node.layer = i;
            node.x0 = x0 + i * kx;
            node.x1 = node.x0 + dx;
            if (columns[i])
                columns[i].push(node);
            else
                columns[i] = [node];
        }
        if (sort)
            for (var _b = 0, columns_1 = columns; _b < columns_1.length; _b++) {
                var column = columns_1[_b];
                column.sort(sort);
            }
        return columns;
    }
    function initializeNodeBreadths(columns) {
        var ky = (0, helper_1.minValueBy)(columns, function (c) { return (y1 - y0 - (c.length - 1) * py) / (0, helper_1.sumBy)(c, value); });
        for (var _i = 0, columns_2 = columns; _i < columns_2.length; _i++) {
            var nodes_6 = columns_2[_i];
            var y = y0;
            for (var _a = 0, nodes_5 = nodes_6; _a < nodes_5.length; _a++) {
                var node = nodes_5[_a];
                node.y0 = y;
                node.y1 = y + node.value * ky;
                y = node.y1 + py;
                for (var _b = 0, _c = node.sourceLinks; _b < _c.length; _b++) {
                    var link = _c[_b];
                    link.width = link.value * ky;
                }
            }
            y = (y1 - y + py) / (nodes_6.length + 1);
            for (var i = 0; i < nodes_6.length; ++i) {
                var node = nodes_6[i];
                node.y0 += y * (i + 1);
                node.y1 += y * (i + 1);
            }
            reorderLinks(nodes_6);
        }
    }
    function computeNodeBreadths(graph) {
        var columns = computeNodeLayers(graph);
        py = Math.min(dy, (y1 - y0) / ((0, helper_1.maxValueBy)(columns, function (c) { return c.length; }) - 1));
        initializeNodeBreadths(columns);
        for (var i = 0; i < iterations; ++i) {
            var alpha = Math.pow(0.99, i);
            var beta = Math.max(1 - alpha, (i + 1) / iterations);
            relaxRightToLeft(columns, alpha, beta);
            relaxLeftToRight(columns, alpha, beta);
        }
    }
    // Reposition each node based on its incoming (target) links.
    function relaxLeftToRight(columns, alpha, beta) {
        for (var i = 1, n = columns.length; i < n; ++i) {
            var column = columns[i];
            for (var _i = 0, column_1 = column; _i < column_1.length; _i++) {
                var target = column_1[_i];
                var y = 0;
                var w = 0;
                for (var _a = 0, _b = target.targetLinks; _a < _b.length; _a++) {
                    var _c = _b[_a], source = _c.source, value_1 = _c.value;
                    var v = value_1 * (target.layer - source.layer);
                    y += targetTop(source, target) * v;
                    w += v;
                }
                if (!(w > 0))
                    continue;
                var dy_1 = (y / w - target.y0) * alpha;
                target.y0 += dy_1;
                target.y1 += dy_1;
                reorderNodeLinks(target);
            }
            if (sort === undefined)
                column.sort(ascendingBreadth);
            if (column.length)
                resolveCollisions(column, beta);
        }
    }
    // Reposition each node based on its outgoing (source) links.
    function relaxRightToLeft(columns, alpha, beta) {
        for (var n = columns.length, i = n - 2; i >= 0; --i) {
            var column = columns[i];
            for (var _i = 0, column_2 = column; _i < column_2.length; _i++) {
                var source = column_2[_i];
                var y = 0;
                var w = 0;
                for (var _a = 0, _b = source.sourceLinks; _a < _b.length; _a++) {
                    var _c = _b[_a], target = _c.target, value_2 = _c.value;
                    var v = value_2 * (target.layer - source.layer);
                    y += sourceTop(source, target) * v;
                    w += v;
                }
                if (!(w > 0))
                    continue;
                var dy_2 = (y / w - source.y0) * alpha;
                source.y0 += dy_2;
                source.y1 += dy_2;
                reorderNodeLinks(source);
            }
            if (sort === undefined)
                column.sort(ascendingBreadth);
            if (column.length)
                resolveCollisions(column, beta);
        }
    }
    function resolveCollisions(nodes, alpha) {
        var i = nodes.length >> 1;
        var subject = nodes[i];
        resolveCollisionsBottomToTop(nodes, subject.y0 - py, i - 1, alpha);
        resolveCollisionsTopToBottom(nodes, subject.y1 + py, i + 1, alpha);
        resolveCollisionsBottomToTop(nodes, y1, nodes.length - 1, alpha);
        resolveCollisionsTopToBottom(nodes, y0, 0, alpha);
    }
    // Push any overlapping nodes down.
    function resolveCollisionsTopToBottom(nodes, y, i, alpha) {
        for (; i < nodes.length; ++i) {
            var node = nodes[i];
            var dy_3 = (y - node.y0) * alpha;
            if (dy_3 > 1e-6)
                (node.y0 += dy_3), (node.y1 += dy_3);
            y = node.y1 + py;
        }
    }
    // Push any overlapping nodes up.
    function resolveCollisionsBottomToTop(nodes, y, i, alpha) {
        for (; i >= 0; --i) {
            var node = nodes[i];
            var dy_4 = (node.y1 - y) * alpha;
            if (dy_4 > 1e-6)
                (node.y0 -= dy_4), (node.y1 -= dy_4);
            y = node.y0 - py;
        }
    }
    function reorderNodeLinks(_a) {
        var sourceLinks = _a.sourceLinks, targetLinks = _a.targetLinks;
        if (linkSort === undefined) {
            for (var _i = 0, targetLinks_1 = targetLinks; _i < targetLinks_1.length; _i++) {
                var sourceLinks_2 = targetLinks_1[_i].source.sourceLinks;
                sourceLinks_2.sort(ascendingTargetBreadth);
            }
            for (var _b = 0, sourceLinks_1 = sourceLinks; _b < sourceLinks_1.length; _b++) {
                var targetLinks_2 = sourceLinks_1[_b].target.targetLinks;
                targetLinks_2.sort(ascendingSourceBreadth);
            }
        }
    }
    function reorderLinks(nodes) {
        if (linkSort === undefined) {
            for (var _i = 0, nodes_7 = nodes; _i < nodes_7.length; _i++) {
                var _a = nodes_7[_i], sourceLinks = _a.sourceLinks, targetLinks = _a.targetLinks;
                sourceLinks.sort(ascendingTargetBreadth);
                targetLinks.sort(ascendingSourceBreadth);
            }
        }
    }
    // Returns the target.y0 that would produce an ideal link from source to target.
    function targetTop(source, target) {
        var y = source.y0 - ((source.sourceLinks.length - 1) * py) / 2;
        for (var _i = 0, _a = source.sourceLinks; _i < _a.length; _i++) {
            var _b = _a[_i], node = _b.target, width = _b.width;
            if (node === target)
                break;
            y += width + py;
        }
        for (var _c = 0, _d = target.targetLinks; _c < _d.length; _c++) {
            var _e = _d[_c], node = _e.source, width = _e.width;
            if (node === source)
                break;
            y -= width;
        }
        return y;
    }
    // Returns the source.y0 that would produce an ideal link from source to target.
    function sourceTop(source, target) {
        var y = target.y0 - ((target.targetLinks.length - 1) * py) / 2;
        for (var _i = 0, _a = target.targetLinks; _i < _a.length; _i++) {
            var _b = _a[_i], node = _b.source, width = _b.width;
            if (node === source)
                break;
            y += width + py;
        }
        for (var _c = 0, _d = source.sourceLinks; _c < _d.length; _c++) {
            var _e = _d[_c], node = _e.target, width = _e.width;
            if (node === target)
                break;
            y -= width;
        }
        return y;
    }
    return sankey;
}
exports.Sankey = Sankey;
//# sourceMappingURL=sankey.js.map