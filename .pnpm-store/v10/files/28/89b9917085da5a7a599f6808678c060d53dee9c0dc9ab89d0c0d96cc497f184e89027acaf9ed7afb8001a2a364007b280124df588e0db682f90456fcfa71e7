"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.treemap = exports.getTileMethod = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var d3Hierarchy = tslib_1.__importStar(require("d3-hierarchy"));
var util_2 = require("./util");
var DEFAULT_OPTIONS = {
    field: 'value',
    tile: 'treemapSquarify',
    size: [1, 1],
    round: false,
    ignoreParentValue: true,
    padding: 0,
    paddingInner: 0,
    paddingOuter: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    as: ['x', 'y'],
    // 默认降序
    sort: function (a, b) { return b.value - a.value; },
    // 纵横比, treemapSquarify 布局时可用，默认黄金分割比例
    ratio: 0.5 * (1 + Math.sqrt(5)),
};
function getTileMethod(tile, ratio) {
    return tile === 'treemapSquarify' ? d3Hierarchy[tile].ratio(ratio) : d3Hierarchy[tile];
}
exports.getTileMethod = getTileMethod;
function treemap(data, options) {
    options = (0, util_1.assign)({}, DEFAULT_OPTIONS, options);
    var as = options.as;
    if (!(0, util_1.isArray)(as) || as.length !== 2) {
        throw new TypeError('Invalid as: it must be an array with 2 strings (e.g. [ "x", "y" ])!');
    }
    var field;
    try {
        field = (0, util_2.getField)(options);
    }
    catch (e) {
        console.warn(e);
    }
    var tileMethod = getTileMethod(options.tile, options.ratio);
    var partition = function (data) {
        return d3Hierarchy
            .treemap()
            .tile(tileMethod)
            .size(options.size)
            .round(options.round)
            .padding(options.padding)
            .paddingInner(options.paddingInner)
            .paddingOuter(options.paddingOuter)
            .paddingTop(options.paddingTop)
            .paddingRight(options.paddingRight)
            .paddingBottom(options.paddingBottom)
            .paddingLeft(options.paddingLeft)(
        /**
         * d3Hierarchy 布局中需指定 sum 函数计算 node 值，规则是：从当前 node 开始以 post-order traversal 的次序为当前节点以及每个后代节点调用指定的 value 函数，并返回当前 node。
         * for example:
         * { node: 'parent', value: 10, children: [{node: 'child1', value: 5}, {node: 'child2', value: 5}, ]}
         * parent 所得的计算值是 sum(node(parent)) + sum(node(child1)) + sum(node(child2))
         * ignoreParentValue 为 true(默认) 时，父元素的值由子元素累加而来，该值为 0 + 5 + 5 = 10
         * ignoreParentValue 为 false 时，父元素的值由当前节点 及子元素累加而来，该值为 10 + 5 + 5 = 20
         * sum 函数中，d 为用户传入的 data, children 为保留字段
         */
        d3Hierarchy
            .hierarchy(data)
            .sum(function (d) { return (options.ignoreParentValue && d.children ? 0 : d[field]); })
            .sort(options.sort));
    };
    var root = partition(data);
    /*
     * points:
     *   3  2
     *   0  1
     */
    var x = as[0];
    var y = as[1];
    root.each(function (node) {
        node[x] = [node.x0, node.x1, node.x1, node.x0];
        node[y] = [node.y1, node.y1, node.y0, node.y0];
        ['x0', 'x1', 'y0', 'y1'].forEach(function (prop) {
            if (as.indexOf(prop) === -1) {
                delete node[prop];
            }
        });
    });
    return (0, util_2.getAllNodes)(root);
}
exports.treemap = treemap;
//# sourceMappingURL=treemap.js.map