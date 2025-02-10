"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePaddingForCircle = exports.transformData = void 0;
var tslib_1 = require("tslib");
var drill_down_1 = require("../../interactions/actions/drill-down");
var utils_1 = require("../../utils");
var pack_1 = require("../../utils/hierarchy/pack");
var padding_1 = require("../../utils/padding");
/**
 * circle-packing 数据转换
 * @param options
 */
function transformData(options) {
    var data = options.data, hierarchyConfig = options.hierarchyConfig, _a = options.rawFields, rawFields = _a === void 0 ? [] : _a, enableDrillDown = options.enableDrillDown;
    var nodes = (0, pack_1.pack)(data, tslib_1.__assign(tslib_1.__assign({}, hierarchyConfig), { field: 'value', as: ['x', 'y', 'r'] }));
    var result = [];
    nodes.forEach(function (node) {
        var _a;
        var path = node.data.name;
        var ancestorNode = tslib_1.__assign({}, node);
        while (ancestorNode.depth > 1) {
            path = "".concat((_a = ancestorNode.parent.data) === null || _a === void 0 ? void 0 : _a.name, " / ").concat(path);
            ancestorNode = ancestorNode.parent;
        }
        // 开启下钻，仅加载 depth <= 2 的数据 (加载两层)
        if (enableDrillDown && node.depth > 2) {
            return null;
        }
        var nodeInfo = (0, utils_1.deepAssign)({}, node.data, tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, (0, utils_1.pick)(node.data, rawFields)), { path: path }), node));
        nodeInfo.ext = hierarchyConfig;
        nodeInfo[drill_down_1.HIERARCHY_DATA_TRANSFORM_PARAMS] = { hierarchyConfig: hierarchyConfig, rawFields: rawFields, enableDrillDown: enableDrillDown };
        result.push(nodeInfo);
    });
    return result;
}
exports.transformData = transformData;
/**
 * 根据传入的 padding 和 现有的 画布大小， 输出针对圆形视图布局需要的 finalPadding 以及 finalSize
 * @param params
 */
function resolvePaddingForCircle(padding, appendPadding, containerSize) {
    var tempPadding = (0, padding_1.resolveAllPadding)([padding, appendPadding]);
    var top = tempPadding[0], right = tempPadding[1], bottom = tempPadding[2], left = tempPadding[3]; // 没设定，默认是 [0, 0, 0, 0]
    var width = containerSize.width, height = containerSize.height;
    // 有了 tempPadding 介入以后，计算出coordinate范围宽高的最小值 minSize = circle-packing的直径
    var wSize = width - (left + right);
    var hSize = height - (top + bottom);
    var minSize = Math.min(wSize, hSize); // circle-packing的直径
    // 得到居中后各方向剩余的 padding
    var restWidthPadding = (wSize - minSize) / 2;
    var restHeightPadding = (hSize - minSize) / 2;
    var finalTop = top + restHeightPadding;
    var finalRight = right + restWidthPadding;
    var finalBottom = bottom + restHeightPadding;
    var finalLeft = left + restWidthPadding;
    var finalPadding = [finalTop, finalRight, finalBottom, finalLeft];
    var finalSize = minSize < 0 ? 0 : minSize; // 防止为负数
    return { finalPadding: finalPadding, finalSize: finalSize };
}
exports.resolvePaddingForCircle = resolvePaddingForCircle;
//# sourceMappingURL=utils.js.map