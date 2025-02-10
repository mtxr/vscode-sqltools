"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pack = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var d3Hierarchy = tslib_1.__importStar(require("d3-hierarchy"));
var util_2 = require("./util");
var DEFAULT_OPTIONS = {
    field: 'value',
    as: ['x', 'y', 'r'],
    // 默认降序
    sort: function (a, b) { return b.value - a.value; },
};
function pack(data, options) {
    options = (0, util_1.assign)({}, DEFAULT_OPTIONS, options);
    var as = options.as;
    if (!(0, util_1.isArray)(as) || as.length !== 3) {
        throw new TypeError('Invalid as: it must be an array with 3 strings (e.g. [ "x", "y", "r" ])!');
    }
    var field;
    try {
        field = (0, util_2.getField)(options);
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
    return (0, util_2.getAllNodes)(root);
}
exports.pack = pack;
//# sourceMappingURL=pack.js.map