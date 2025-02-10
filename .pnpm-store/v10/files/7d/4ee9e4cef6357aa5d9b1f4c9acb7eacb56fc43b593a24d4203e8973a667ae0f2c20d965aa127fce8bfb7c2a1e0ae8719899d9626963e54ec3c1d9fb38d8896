import { deepMix } from '@antv/util';
import { deepAssign } from '../../utils';
import { getTooltipMapping } from '../../utils/tooltip';
import { geometry } from './base';
/**
 * line 辅助点的配置处理
 * @param params
 */
export function line(params) {
    var options = params.options;
    var line = options.line, stepType = options.stepType, xField = options.xField, yField = options.yField, seriesField = options.seriesField, smooth = options.smooth, connectNulls = options.connectNulls, tooltip = options.tooltip, useDeferredLabel = options.useDeferredLabel;
    var _a = getTooltipMapping(tooltip, [xField, yField, seriesField]), fields = _a.fields, formatter = _a.formatter;
    // 如果存在才处理
    return line
        ? geometry(deepAssign({}, params, {
            options: {
                type: 'line',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: deepMix({
                    shape: stepType || (smooth ? 'smooth' : 'line'),
                    tooltip: formatter,
                }, line),
                args: { connectNulls: connectNulls, useDeferredLabel: useDeferredLabel },
            },
        }))
        : params;
}
//# sourceMappingURL=line.js.map