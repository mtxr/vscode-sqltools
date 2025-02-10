import { __assign } from "tslib";
import { deepAssign } from '../../utils';
import { getTooltipMapping } from '../../utils/tooltip';
import { geometry } from './base';
/**
 * polygon 的配置处理
 * @param params
 */
export function polygon(params) {
    var options = params.options;
    var polygon = options.polygon, xField = options.xField, yField = options.yField, seriesField = options.seriesField, tooltip = options.tooltip, useDeferredLabel = options.useDeferredLabel;
    var _a = getTooltipMapping(tooltip, [xField, yField, seriesField]), fields = _a.fields, formatter = _a.formatter;
    return polygon
        ? geometry(deepAssign({}, params, {
            options: {
                type: 'polygon',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: __assign({ tooltip: formatter }, polygon),
                args: { useDeferredLabel: useDeferredLabel },
            },
        }))
        : params;
}
//# sourceMappingURL=polygon.js.map