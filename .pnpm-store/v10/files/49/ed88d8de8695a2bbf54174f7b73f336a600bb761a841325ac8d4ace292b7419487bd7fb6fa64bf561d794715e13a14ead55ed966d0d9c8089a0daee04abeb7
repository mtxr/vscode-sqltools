import { __assign } from "tslib";
import { HIERARCHY_DATA_TRANSFORM_PARAMS } from '../../interactions/actions/drill-down';
import { deepAssign, pick } from '../../utils';
import { pack } from '../../utils/hierarchy/pack';
import { resolveAllPadding } from '../../utils/padding';
/**
 * circle-packing 数据转换
 * @param options
 */
export function transformData(options) {
    var data = options.data, hierarchyConfig = options.hierarchyConfig, _a = options.rawFields, rawFields = _a === void 0 ? [] : _a, enableDrillDown = options.enableDrillDown;
    var nodes = pack(data, __assign(__assign({}, hierarchyConfig), { field: 'value', as: ['x', 'y', 'r'] }));
    var result = [];
    nodes.forEach(function (node) {
        var _a;
        var path = node.data.name;
        var ancestorNode = __assign({}, node);
        while (ancestorNode.depth > 1) {
            path = "".concat((_a = ancestorNode.parent.data) === null || _a === void 0 ? void 0 : _a.name, " / ").concat(path);
            ancestorNode = ancestorNode.parent;
        }
        // 开启下钻，仅加载 depth <= 2 的数据 (加载两层)
        if (enableDrillDown && node.depth > 2) {
            return null;
        }
        var nodeInfo = deepAssign({}, node.data, __assign(__assign(__assign({}, pick(node.data, rawFields)), { path: path }), node));
        nodeInfo.ext = hierarchyConfig;
        nodeInfo[HIERARCHY_DATA_TRANSFORM_PARAMS] = { hierarchyConfig: hierarchyConfig, rawFields: rawFields, enableDrillDown: enableDrillDown };
        result.push(nodeInfo);
    });
    return result;
}
/**
 * 根据传入的 padding 和 现有的 画布大小， 输出针对圆形视图布局需要的 finalPadding 以及 finalSize
 * @param params
 */
export function resolvePaddingForCircle(padding, appendPadding, containerSize) {
    var tempPadding = resolveAllPadding([padding, appendPadding]);
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
//# sourceMappingURL=utils.js.map