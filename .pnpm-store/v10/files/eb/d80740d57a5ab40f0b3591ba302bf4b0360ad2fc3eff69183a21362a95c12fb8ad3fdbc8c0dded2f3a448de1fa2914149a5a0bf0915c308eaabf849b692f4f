import { deepMix } from '@antv/util';
import { deepAssign } from '../../utils';
import { getTooltipMapping } from '../../utils/tooltip';
import { geometry } from './base';
/**
 * area geometry 的配置处理
 * @param params
 */
export function area(params) {
    var options = params.options;
    var area = options.area, xField = options.xField, yField = options.yField, seriesField = options.seriesField, smooth = options.smooth, tooltip = options.tooltip, useDeferredLabel = options.useDeferredLabel;
    var _a = getTooltipMapping(tooltip, [xField, yField, seriesField]), fields = _a.fields, formatter = _a.formatter;
    // 如果存在才处理
    return area
        ? geometry(deepAssign({}, params, {
            options: {
                type: 'area',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: deepMix({
                    shape: smooth ? 'smooth' : 'area',
                    tooltip: formatter,
                }, area),
                args: { useDeferredLabel: useDeferredLabel },
            },
        }))
        : params;
}
//# sourceMappingURL=area.js.map