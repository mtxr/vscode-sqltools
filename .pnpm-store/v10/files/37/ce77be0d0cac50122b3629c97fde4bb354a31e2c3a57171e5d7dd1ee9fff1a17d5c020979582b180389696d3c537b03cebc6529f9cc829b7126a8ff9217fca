import { assign, isArray } from '@antv/util';
import * as d3Hierarchy from 'd3-hierarchy';
import { getAllNodes, getField } from './util';
var DEFAULT_OPTIONS = {
    field: 'value',
    as: ['x', 'y', 'r'],
    // 默认降序
    sort: function (a, b) { return b.value - a.value; },
};
export function pack(data, options) {
    options = assign({}, DEFAULT_OPTIONS, options);
    var as = options.as;
    if (!isArray(as) || as.length !== 3) {
        throw new TypeError('Invalid as: it must be an array with 3 strings (e.g. [ "x", "y", "r" ])!');
    }
    var field;
    try {
        field = getField(options);
    }
    catch (e) {
        console.warn(e);
    }
    var packLayout = function (data) {
        return d3Hierarchy.pack().size(options.size).padding(options.padding)(d3Hierarchy
            .hierarchy(data)
            .sum(function (d) { return d[field]; })
            .sort(options.sort));
    };
    var root = packLayout(data);
    var x = as[0];
    var y = as[1];
    var r = as[2];
    root.each(function (node) {
        node[x] = node.x;
        node[y] = node.y;
        node[r] = node.r;
    });
    return getAllNodes(root);
}
//# sourceMappingURL=pack.js.map