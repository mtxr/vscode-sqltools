"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.polygon = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var tooltip_1 = require("../../utils/tooltip");
var base_1 = require("./base");
/**
 * polygon 的配置处理
 * @param params
 */
function polygon(params) {
    var options = params.options;
    var polygon = options.polygon, xField = options.xField, yField = options.yField, seriesField = options.seriesField, tooltip = options.tooltip, useDeferredLabel = options.useDeferredLabel;
    var _a = (0, tooltip_1.getTooltipMapping)(tooltip, [xField, yField, seriesField]), fields = _a.fields, formatter = _a.formatter;
    return polygon
        ? (0, base_1.geometry)((0, utils_1.deepAssign)({}, params, {
            options: {
                type: 'polygon',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: tslib_1.__assign({ tooltip: formatter }, polygon),
                args: { useDeferredLabel: useDeferredLabel },
            },
        }))
        : params;
}
exports.polygon = polygon;
//# sourceMappingURL=polygon.js.map