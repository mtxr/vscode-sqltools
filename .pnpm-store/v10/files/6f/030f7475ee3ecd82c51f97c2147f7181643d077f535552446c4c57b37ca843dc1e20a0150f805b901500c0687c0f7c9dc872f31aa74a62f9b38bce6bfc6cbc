"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var tooltip_1 = require("../../utils/tooltip");
var base_1 = require("./base");
/**
 * schema 的配置处理
 * @param params
 */
function schema(params) {
    var options = params.options;
    var schema = options.schema, xField = options.xField, yField = options.yField, seriesField = options.seriesField, tooltip = options.tooltip, useDeferredLabel = options.useDeferredLabel;
    var _a = (0, tooltip_1.getTooltipMapping)(tooltip, [xField, yField, seriesField]), fields = _a.fields, formatter = _a.formatter;
    return schema
        ? (0, base_1.geometry)((0, utils_1.deepAssign)({}, params, {
            options: {
                type: 'schema',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: tslib_1.__assign({ tooltip: formatter }, schema),
                args: { useDeferredLabel: useDeferredLabel },
            },
        }))
        : params;
}
exports.schema = schema;
//# sourceMappingURL=schema.js.map