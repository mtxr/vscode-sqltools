"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interval = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var util_1 = require("@antv/util");
var utils_1 = require("../../utils");
var tooltip_1 = require("../../utils/tooltip");
var base_1 = require("./base");
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
    if (!(0, util_1.isNil)(widthRatio)) {
        chart.theme((0, utils_1.deepAssign)({}, (0, util_1.isObject)(theme) ? theme : (0, g2_1.getTheme)(theme), {
            // columWidthRatio 配置覆盖 theme 中的配置
            columnWidthRatio: widthRatio,
        }));
    }
    return params;
}
function interval(params) {
    var options = params.options;
    var xField = options.xField, yField = options.yField, interval = options.interval, seriesField = options.seriesField, tooltip = options.tooltip, minColumnWidth = options.minColumnWidth, maxColumnWidth = options.maxColumnWidth, columnBackground = options.columnBackground, dodgePadding = options.dodgePadding, intervalPadding = options.intervalPadding, useDeferredLabel = options.useDeferredLabel;
    var _a = (0, tooltip_1.getTooltipMapping)(tooltip, [xField, yField, seriesField]), fields = _a.fields, formatter = _a.formatter;
    // 保障一定要存在 interval 映射
    var ext = (interval
        ? (0, base_1.geometry)((0, utils_1.deepAssign)({}, params, {
            options: {
                type: 'interval',
                colorField: seriesField,
                tooltipFields: fields,
                mapping: tslib_1.__assign({ tooltip: formatter }, interval),
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
    return otherAdaptor(tslib_1.__assign(tslib_1.__assign({}, params), { ext: ext }));
}
exports.interval = interval;
//# sourceMappingURL=interval.js.map