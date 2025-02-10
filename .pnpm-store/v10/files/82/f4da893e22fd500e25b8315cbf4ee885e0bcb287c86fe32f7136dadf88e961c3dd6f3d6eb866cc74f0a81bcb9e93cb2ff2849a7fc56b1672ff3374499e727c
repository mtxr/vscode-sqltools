import { __assign, __spreadArray } from "tslib";
import { omit } from '@antv/util';
import { HIERARCHY_DATA_TRANSFORM_PARAMS } from '../../interactions/actions/drill-down';
import { pick } from '../../utils';
import { partition } from '../../utils/hierarchy/partition';
import { treemap } from '../../utils/hierarchy/treemap';
import { SUNBURST_ANCESTOR_FIELD, SUNBURST_PATH_FIELD } from './constant';
/**
 * sunburst 处理数据
 * @param options
 */
export function transformData(options) {
    var data = options.data, colorField = options.colorField, rawFields = options.rawFields, _a = options.hierarchyConfig, hierarchyConfig = _a === void 0 ? {} : _a;
    var activeDepth = hierarchyConfig.activeDepth;
    var transform = {
        partition: partition,
        treemap: treemap,
    };
    // @ts-ignore 兼容旧版本，支持 seriesField 来作为 hierarchyConfig.field
    var seriesField = options.seriesField;
    // @ts-ignore 兼容旧版本，支持矩阵树图形状的旭日图
    var type = options.type || 'partition';
    var nodes = transform[type](data, __assign(__assign({ field: seriesField || 'value' }, omit(hierarchyConfig, ['activeDepth'])), { 
        // @ts-ignore
        type: "hierarchy.".concat(type), as: ['x', 'y'] }));
    var result = [];
    nodes.forEach(function (node) {
        var _a;
        var _b, _c, _d, _e, _f;
        if (node.depth === 0) {
            return null;
        }
        if (activeDepth > 0 && node.depth > activeDepth) {
            return null;
        }
        var path = node.data.name;
        var ancestorNode = __assign({}, node);
        while (ancestorNode.depth > 1) {
            path = "".concat((_b = ancestorNode.parent.data) === null || _b === void 0 ? void 0 : _b.name, " / ").concat(path);
            ancestorNode = ancestorNode.parent;
        }
        var nodeInfo = __assign(__assign(__assign({}, pick(node.data, __spreadArray(__spreadArray([], (rawFields || []), true), [hierarchyConfig.field], false))), (_a = {}, _a[SUNBURST_PATH_FIELD] = path, _a[SUNBURST_ANCESTOR_FIELD] = ancestorNode.data.name, _a)), node);
        // note: 兼容旧版本
        if (seriesField) {
            nodeInfo[seriesField] = node.data[seriesField] || ((_d = (_c = node.parent) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d[seriesField]);
        }
        if (colorField) {
            nodeInfo[colorField] = node.data[colorField] || ((_f = (_e = node.parent) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f[colorField]);
        }
        nodeInfo.ext = hierarchyConfig;
        nodeInfo[HIERARCHY_DATA_TRANSFORM_PARAMS] = { hierarchyConfig: hierarchyConfig, colorField: colorField, rawFields: rawFields };
        result.push(nodeInfo);
    });
    return result;
}
//# sourceMappingURL=utils.js.map