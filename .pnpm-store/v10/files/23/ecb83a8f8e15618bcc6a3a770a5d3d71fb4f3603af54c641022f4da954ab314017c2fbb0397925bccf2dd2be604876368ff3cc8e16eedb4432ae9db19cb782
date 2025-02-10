"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.violin = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var tooltip_1 = require("../../utils/tooltip");
var base_1 = require("./base");
/**
 * violin 辅助点的配置处理
 * @param params
 */
function violin(params) {
    var options = params.options;
    var violin = options.violin, xField = options.xField, yField = options.yField, seriesField = options.seriesField, sizeField = options.sizeField, tooltip = options.tooltip;
    var _a = (0, tooltip_1.getTooltipMapping)(tooltip, [xField, yField, seriesField, sizeField]), fields = _a.fields, formatter = _a.formatter;
    return violin
        ? (0, base_1.geometry)((0, utils_1.deepAssign)({}, params, {
            options: {
                type: 'violin',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: tslib_1.__assign({ tooltip: formatter }, violin),
            },
        }))
        : params;
}
exports.violin = violin;
//# sourceMappingURL=violin.js.map