import { __assign } from "tslib";
import { deepAssign } from '../../utils';
import { getTooltipMapping } from '../../utils/tooltip';
import { geometry } from './base';
/**
 * point 辅助点的配置处理
 * @param params
 */
export function point(params) {
    var options = params.options;
    var point = options.point, xField = options.xField, yField = options.yField, seriesField = options.seriesField, sizeField = options.sizeField, shapeField = options.shapeField, tooltip = options.tooltip, useDeferredLabel = options.useDeferredLabel;
    var _a = getTooltipMapping(tooltip, [xField, yField, seriesField, sizeField, shapeField]), fields = _a.fields, formatter = _a.formatter;
    return point
        ? geometry(deepAssign({}, params, {
            options: {
                type: 'point',
                colorField: seriesField,
                shapeField: shapeField,
                tooltipFields: fields,
                mapping: __assign({ tooltip: formatter }, point),
                args: { useDeferredLabel: useDeferredLabel },
            },
        }))
        : params;
}
//# sourceMappingURL=point.js.map