import { filter, isArray, isString } from '@antv/util';
/** export 一些字段常量 */
/** 在同层级，同一父节点下的节点索引顺序 */
export var NODE_INDEX_FIELD = 'nodeIndex';
/** child 节点数量 */
export var CHILD_NODE_COUNT = 'childNodeCount';
/** 节点的祖先节点 */
export var NODE_ANCESTORS_FIELD = 'nodeAncestor';
var INVALID_FIELD_ERR_MSG = 'Invalid field: it must be a string!';
export function getField(options, defaultField) {
    var field = options.field, fields = options.fields;
    if (isString(field)) {
        return field;
    }
    if (isArray(field)) {
        console.warn(INVALID_FIELD_ERR_MSG);
        return field[0];
    }
    console.warn("".concat(INVALID_FIELD_ERR_MSG, " will try to get fields instead."));
    if (isString(fields)) {
        return fields;
    }
    if (isArray(fields) && fields.length) {
        return fields[0];
    }
    if (defaultField) {
        return defaultField;
    }
    throw new TypeError(INVALID_FIELD_ERR_MSG);
}
export function getAllNodes(root) {
    var nodes = [];
    if (root && root.each) {
        var parent_1;
        var index_1;
        // d3-hierarchy: Invokes the specified function for node and each descendant in **breadth-first order**
        root.each(function (node) {
            var _a, _b;
            if (node.parent !== parent_1) {
                parent_1 = node.parent;
                index_1 = 0;
            }
            else {
                index_1 += 1;
            }
            var ancestors = filter((((_a = node.ancestors) === null || _a === void 0 ? void 0 : _a.call(node)) || []).map(function (d) { return nodes.find(function (n) { return n.name === d.name; }) || d; }), function (_a) {
                var depth = _a.depth;
                return depth > 0 && depth < node.depth;
            });
            node[NODE_ANCESTORS_FIELD] = ancestors;
            node[CHILD_NODE_COUNT] = ((_b = node.children) === null || _b === void 0 ? void 0 : _b.length) || 0;
            node[NODE_INDEX_FIELD] = index_1;
            nodes.push(node);
        });
    }
    else if (root && root.eachNode) {
        // @antv/hierarchy
        root.eachNode(function (node) {
            nodes.push(node);
        });
    }
    return nodes;
}
//# sourceMappingURL=util.js.map