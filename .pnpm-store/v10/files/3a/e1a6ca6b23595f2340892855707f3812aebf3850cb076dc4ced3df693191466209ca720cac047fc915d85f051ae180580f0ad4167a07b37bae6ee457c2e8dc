"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partition = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var d3Hierarchy = tslib_1.__importStar(require("d3-hierarchy"));
var util_2 = require("./util");
var DEFAULT_OPTIONS = {
    field: 'value',
    size: [1, 1],
    round: false,
    padding: 0,
    // 默认降序
    sort: function (a, b) { return b.value - a.value; },
    as: ['x', 'y'],
    // 是否忽略 parentValue, 当设置为 true 时，父节点的权重由子元素决定
    ignoreParentValue: true,
};
function partition(data, options) {
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
    var partition = function (data) {
        return d3Hierarchy.partition().size(options.size).round(options.round).padding(options.padding)(
        /**
         * d3Hierarchy 布局中需指定 sum 函数计算 node 值，规则是：从当前 node 开始以 post-order traversal 的次序为当前节点以及每个后代节点调用指定的 value 函数，并返回当前 node。
         * for example:
         * { node: 'parent', value: 10, children: [{node: 'child1', value: 5}, {node: 'child2', value: 5}, ]}
         * parent 所得的计算值是 sum(node(parent)) + sum(node(child1)) + sum(node(child2))
         * sum 函数中，d 为用户传入的 data, children 为保留字段
         */
        d3Hierarchy
            .hierarchy(data)
            .sum(function (d) {
            return (0, util_1.size)(d.children)
                ? options.ignoreParentValue
                    ? 0
                    : d[field] - (0, util_1.reduce)(d.children, function (a, b) { return a + b[field]; }, 0)
                : d[field];
        })
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
        var _a, _b;
        node[x] = [node.x0, node.x1, node.x1, node.x0];
        node[y] = [node.y1, node.y1, node.y0, node.y0];
        // 旭日图兼容下 旧版本
        node.name = node.name || ((_a = node.data) === null || _a === void 0 ? void 0 : _a.name) || ((_b = node.data) === null || _b === void 0 ? void 0 : _b.label);
        node.data.name = node.name;
        ['x0', 'x1', 'y0', 'y1'].forEach(function (prop) {
            if (as.indexOf(prop) === -1) {
                delete node[prop];
            }
        });
    });
    return (0, util_2.getAllNodes)(root);
}
exports.partition = partition;
//# sourceMappingURL=partition.js.map