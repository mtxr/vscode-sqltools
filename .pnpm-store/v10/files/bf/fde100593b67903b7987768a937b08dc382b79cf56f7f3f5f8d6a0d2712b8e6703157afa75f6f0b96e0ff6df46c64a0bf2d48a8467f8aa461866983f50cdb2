import { __assign } from "tslib";
import { deepAssign } from '../../utils';
import { getTooltipMapping } from '../../utils/tooltip';
import { geometry } from './base';
/**
 * violin 辅助点的配置处理
 * @param params
 */
export function violin(params) {
    var options = params.options;
    var violin = options.violin, xField = options.xField, yField = options.yField, seriesField = options.seriesField, sizeField = options.sizeField, tooltip = options.tooltip;
    var _a = getTooltipMapping(tooltip, [xField, yField, seriesField, sizeField]), fields = _a.fields, formatter = _a.formatter;
    return violin
        ? geometry(deepAssign({}, params, {
            options: {
                type: 'violin',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: __assign({ tooltip: formatter }, violin),
            },
        }))
        : params;
}
//# sourceMappingURL=violin.js.map