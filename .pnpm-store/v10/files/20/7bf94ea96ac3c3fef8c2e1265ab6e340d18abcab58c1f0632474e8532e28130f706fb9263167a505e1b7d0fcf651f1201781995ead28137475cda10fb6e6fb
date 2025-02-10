"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformData = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var drill_down_1 = require("../../interactions/actions/drill-down");
var utils_1 = require("../../utils");
var partition_1 = require("../../utils/hierarchy/partition");
var treemap_1 = require("../../utils/hierarchy/treemap");
var constant_1 = require("./constant");
/**
 * sunburst 处理数据
 * @param options
 */
function transformData(options) {
    var data = options.data, colorField = options.colorField, rawFields = options.rawFields, _a = options.hierarchyConfig, hierarchyConfig = _a === void 0 ? {} : _a;
    var activeDepth = hierarchyConfig.activeDepth;
    var transform = {
        partition: partition_1.partition,
        treemap: treemap_1.treemap,
    };
    // @ts-ignore 兼容旧版本，支持 seriesField 来作为 hierarchyConfig.field
    var seriesField = options.seriesField;
    // @ts-ignore 兼容旧版本，支持矩阵树图形状的旭日图
    var type = options.type || 'partition';
    var nodes = transform[type](data, tslib_1.__assign(tslib_1.__assign({ field: seriesField || 'value' }, (0, util_1.omit)(hierarchyConfig, ['activeDepth'])), { 
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
        var ancestorNode = tslib_1.__assign({}, node);
        while (ancestorNode.depth > 1) {
            path = "".concat((_b = ancestorNode.parent.data) === null || _b === void 0 ? void 0 : _b.name, " / ").concat(path);
            ancestorNode = ancestorNode.parent;
        }
        var nodeInfo = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, (0, utils_1.pick)(node.data, tslib_1.__spreadArray(tslib_1.__spreadArray([], (rawFields || []), true), [hierarchyConfig.field], false))), (_a = {}, _a[constant_1.SUNBURST_PATH_FIELD] = path, _a[constant_1.SUNBURST_ANCESTOR_FIELD] = ancestorNode.data.name, _a)), node);
        // note: 兼容旧版本
        if (seriesField) {
            nodeInfo[seriesField] = node.data[seriesField] || ((_d = (_c = node.parent) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d[seriesField]);
        }
        if (colorField) {
            nodeInfo[colorField] = node.data[colorField] || ((_f = (_e = node.parent) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f[colorField]);
        }
        nodeInfo.ext = hierarchyConfig;
        nodeInfo[drill_down_1.HIERARCHY_DATA_TRANSFORM_PARAMS] = { hierarchyConfig: hierarchyConfig, colorField: colorField, rawFields: rawFields };
        result.push(nodeInfo);
    });
    return result;
}
exports.transformData = transformData;
//# sourceMappingURL=utils.js.map