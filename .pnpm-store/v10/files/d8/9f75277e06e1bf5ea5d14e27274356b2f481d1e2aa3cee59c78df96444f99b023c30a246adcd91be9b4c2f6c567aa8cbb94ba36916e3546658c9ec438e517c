"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.edge = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var tooltip_1 = require("../../utils/tooltip");
var base_1 = require("./base");
/**
 * edge 的配置处理
 * @param params
 */
function edge(params) {
    var options = params.options;
    var edge = options.edge, xField = options.xField, yField = options.yField, seriesField = options.seriesField, tooltip = options.tooltip, useDeferredLabel = options.useDeferredLabel;
    var _a = (0, tooltip_1.getTooltipMapping)(tooltip, [xField, yField, seriesField]), fields = _a.fields, formatter = _a.formatter;
    return edge
        ? (0, base_1.geometry)((0, utils_1.deepAssign)({}, params, {
            options: {
                type: 'edge',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: tslib_1.__assign({ tooltip: formatter }, edge),
                args: { useDeferredLabel: useDeferredLabel },
            },
        }))
        : params;
}
exports.edge = edge;
//# sourceMappingURL=edge.js.map