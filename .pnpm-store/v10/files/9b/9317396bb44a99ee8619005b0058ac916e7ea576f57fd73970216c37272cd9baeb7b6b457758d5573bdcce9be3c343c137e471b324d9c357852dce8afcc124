"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.area = void 0;
var util_1 = require("@antv/util");
var utils_1 = require("../../utils");
var tooltip_1 = require("../../utils/tooltip");
var base_1 = require("./base");
/**
 * area geometry 的配置处理
 * @param params
 */
function area(params) {
    var options = params.options;
    var area = options.area, xField = options.xField, yField = options.yField, seriesField = options.seriesField, smooth = options.smooth, tooltip = options.tooltip, useDeferredLabel = options.useDeferredLabel;
    var _a = (0, tooltip_1.getTooltipMapping)(tooltip, [xField, yField, seriesField]), fields = _a.fields, formatter = _a.formatter;
    // 如果存在才处理
    return area
        ? (0, base_1.geometry)((0, utils_1.deepAssign)({}, params, {
            options: {
                type: 'area',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: (0, util_1.deepMix)({
                    shape: smooth ? 'smooth' : 'area',
                    tooltip: formatter,
                }, area),
                args: { useDeferredLabel: useDeferredLabel },
            },
        }))
        : params;
}
exports.area = area;
//# sourceMappingURL=area.js.map