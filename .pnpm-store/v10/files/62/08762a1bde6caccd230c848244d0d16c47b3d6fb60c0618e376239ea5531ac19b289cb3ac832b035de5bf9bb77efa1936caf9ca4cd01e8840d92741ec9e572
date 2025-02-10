import { __assign } from "tslib";
import { deepAssign } from '../../utils';
import { getTooltipMapping } from '../../utils/tooltip';
import { geometry } from './base';
/**
 * edge 的配置处理
 * @param params
 */
export function edge(params) {
    var options = params.options;
    var edge = options.edge, xField = options.xField, yField = options.yField, seriesField = options.seriesField, tooltip = options.tooltip, useDeferredLabel = options.useDeferredLabel;
    var _a = getTooltipMapping(tooltip, [xField, yField, seriesField]), fields = _a.fields, formatter = _a.formatter;
    return edge
        ? geometry(deepAssign({}, params, {
            options: {
                type: 'edge',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: __assign({ tooltip: formatter }, edge),
                args: { useDeferredLabel: useDeferredLabel },
            },
        }))
        : params;
}
//# sourceMappingURL=edge.js.map