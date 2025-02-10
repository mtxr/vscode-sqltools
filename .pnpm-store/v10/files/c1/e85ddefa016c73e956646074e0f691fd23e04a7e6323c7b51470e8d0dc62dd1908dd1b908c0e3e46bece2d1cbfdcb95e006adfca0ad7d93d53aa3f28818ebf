"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.line = void 0;
var util_1 = require("@antv/util");
var utils_1 = require("../../utils");
var tooltip_1 = require("../../utils/tooltip");
var base_1 = require("./base");
/**
 * line 辅助点的配置处理
 * @param params
 */
function line(params) {
    var options = params.options;
    var line = options.line, stepType = options.stepType, xField = options.xField, yField = options.yField, seriesField = options.seriesField, smooth = options.smooth, connectNulls = options.connectNulls, tooltip = options.tooltip, useDeferredLabel = options.useDeferredLabel;
    var _a = (0, tooltip_1.getTooltipMapping)(tooltip, [xField, yField, seriesField]), fields = _a.fields, formatter = _a.formatter;
    // 如果存在才处理
    return line
        ? (0, base_1.geometry)((0, utils_1.deepAssign)({}, params, {
            options: {
                type: 'line',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: (0, util_1.deepMix)({
                    shape: stepType || (smooth ? 'smooth' : 'line'),
                    tooltip: formatter,
                }, line),
                args: { connectNulls: connectNulls, useDeferredLabel: useDeferredLabel },
            },
        }))
        : params;
}
exports.line = line;
//# sourceMappingURL=line.js.map