import { __assign } from "tslib";
import { deepAssign } from '../../utils';
import { getTooltipMapping } from '../../utils/tooltip';
import { geometry } from './base';
/**
 * schema 的配置处理
 * @param params
 */
export function schema(params) {
    var options = params.options;
    var schema = options.schema, xField = options.xField, yField = options.yField, seriesField = options.seriesField, tooltip = options.tooltip, useDeferredLabel = options.useDeferredLabel;
    var _a = getTooltipMapping(tooltip, [xField, yField, seriesField]), fields = _a.fields, formatter = _a.formatter;
    return schema
        ? geometry(deepAssign({}, params, {
            options: {
                type: 'schema',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: __assign({ tooltip: formatter }, schema),
                args: { useDeferredLabel: useDeferredLabel },
            },
        }))
        : params;
}
//# sourceMappingURL=schema.js.map