import { __assign } from "tslib";
import { getTheme } from '@antv/g2';
import { isNil, isObject } from '@antv/util';
import { deepAssign } from '../../utils';
import { getTooltipMapping } from '../../utils/tooltip';
import { geometry } from './base';
/**
 * 柱形图其他的 adaptor
 * @param params
 */
function otherAdaptor(params) {
    var chart = params.chart, options = params.options, ext = params.ext;
    var seriesField = options.seriesField, isGroup = options.isGroup, isStack = options.isStack, marginRatio = options.marginRatio, widthRatio = options.widthRatio, groupField = options.groupField, theme = options.theme;
    /**
     * adjust
     */
    var adjust = [];
    if (seriesField) {
        // group
        if (isGroup) {
            adjust.push({
                type: 'dodge',
                dodgeBy: groupField || seriesField,
                marginRatio: marginRatio,
            });
        }
        // stack
        if (isStack) {
            adjust.push({
                type: 'stack',
                marginRatio: marginRatio,
            });
        }
    }
    if (adjust.length && (ext === null || ext === void 0 ? void 0 : ext.geometry)) {
        var g = ext === null || ext === void 0 ? void 0 : ext.geometry;
        g.adjust(adjust);
    }
    // widthRatio
    if (!isNil(widthRatio)) {
        chart.theme(deepAssign({}, isObject(theme) ? theme : getTheme(theme), {
            // columWidthRatio 配置覆盖 theme 中的配置
            columnWidthRatio: widthRatio,
        }));
    }
    return params;
}
export function interval(params) {
    var options = params.options;
    var xField = options.xField, yField = options.yField, interval = options.interval, seriesField = options.seriesField, tooltip = options.tooltip, minColumnWidth = options.minColumnWidth, maxColumnWidth = options.maxColumnWidth, columnBackground = options.columnBackground, dodgePadding = options.dodgePadding, intervalPadding = options.intervalPadding, useDeferredLabel = options.useDeferredLabel;
    var _a = getTooltipMapping(tooltip, [xField, yField, seriesField]), fields = _a.fields, formatter = _a.formatter;
    // 保障一定要存在 interval 映射
    var ext = (interval
        ? geometry(deepAssign({}, params, {
            options: {
                type: 'interval',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: __assign({ tooltip: formatter }, interval),
                args: {
                    dodgePadding: dodgePadding,
                    intervalPadding: intervalPadding,
                    minColumnWidth: minColumnWidth,
                    maxColumnWidth: maxColumnWidth,
                    background: columnBackground,
                    useDeferredLabel: useDeferredLabel,
                },
            },
        }))
        : params).ext;
    return otherAdaptor(__assign(__assign({}, params), { ext: ext }));
}
//# sourceMappingURL=interval.js.map