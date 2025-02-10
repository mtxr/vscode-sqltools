"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.point = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var tooltip_1 = require("../../utils/tooltip");
var base_1 = require("./base");
/**
 * point 辅助点的配置处理
 * @param params
 */
function point(params) {
    var options = params.options;
    var point = options.point, xField = options.xField, yField = options.yField, seriesField = options.seriesField, sizeField = options.sizeField, shapeField = options.shapeField, tooltip = options.tooltip, useDeferredLabel = options.useDeferredLabel;
    var _a = (0, tooltip_1.getTooltipMapping)(tooltip, [xField, yField, seriesField, sizeField, shapeField]), fields = _a.fields, formatter = _a.formatter;
    return point
        ? (0, base_1.geometry)((0, utils_1.deepAssign)({}, params, {
            options: {
                type: 'point',
                colorField: seriesField,
                shapeField: shapeField,
                tooltipFields: fields,
                mapping: tslib_1.__assign({ tooltip: formatter }, point),
                args: { useDeferredLabel: useDeferredLabel },
            },
        }))
        : params;
}
exports.point = point;
//# sourceMappingURL=point.js.map