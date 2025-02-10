import { __assign, __rest } from "tslib";
import { each, filter, isMatch } from '@antv/util';
import { brushInteraction } from '../../adaptor/brush';
import { animation, annotation, interaction, limitInPlot, scale, scrollbar, slider, state, theme, transformations, } from '../../adaptor/common';
import { connectedArea } from '../../adaptor/connected-area';
import { conversionTag } from '../../adaptor/conversion-tag';
import { interval } from '../../adaptor/geometries';
import { pattern } from '../../adaptor/pattern';
import { adjustYMetaByZero, deepAssign, findGeometry, flow, pick, transformLabel } from '../../utils';
import { getDataWhetherPercentage, getDeepPercent } from '../../utils/transform/percent';
/**
 * defaultOptions
 * @param params
 */
function defaultOptions(params) {
    var options = params.options;
    // 默认 legend 位置
    var legend = options.legend;
    var seriesField = options.seriesField, isStack = options.isStack;
    if (seriesField) {
        if (legend !== false) {
            legend = __assign({ position: isStack ? 'right-top' : 'top-left' }, legend);
        }
    }
    else {
        legend = false;
    }
    // @ts-ignore 直接改值
    params.options.legend = legend;
    return params;
}
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, columnStyle = options.columnStyle, color = options.color, columnWidthRatio = options.columnWidthRatio, isPercent = options.isPercent, isGroup = options.isGroup, isStack = options.isStack, xField = options.xField, yField = options.yField, seriesField = options.seriesField, groupField = options.groupField, tooltip = options.tooltip, shape = options.shape;
    var percentData = isPercent && isGroup && isStack
        ? getDeepPercent(data, yField, [xField, groupField], yField)
        : getDataWhetherPercentage(data, yField, xField, yField, isPercent);
    var chartData = [];
    // 存在堆叠,并且存在堆叠seriesField分类，并且不存在分组的时候 进行堆叠
    if (isStack && seriesField && !isGroup) {
        percentData.forEach(function (item) {
            var stackedItem = chartData.find(function (v) { return v[xField] === item[xField] && v[seriesField] === item[seriesField]; });
            if (stackedItem) {
                stackedItem[yField] += item[yField] || 0;
            }
            else {
                chartData.push(__assign({}, item));
            }
        });
    }
    else {
        chartData = percentData;
    }
    chart.data(chartData);
    // 百分比堆积图，默认会给一个 % 格式化逻辑, 用户可自定义
    var tooltipOptions = isPercent
        ? __assign({ formatter: function (datum) {
                var _a;
                return ({
                    name: isGroup && isStack ? "".concat(datum[seriesField], " - ").concat(datum[groupField]) : (_a = datum[seriesField]) !== null && _a !== void 0 ? _a : datum[xField],
                    value: (Number(datum[yField]) * 100).toFixed(2) + '%',
                });
            } }, tooltip) : tooltip;
    var p = deepAssign({}, params, {
        options: {
            data: chartData,
            widthRatio: columnWidthRatio,
            tooltip: tooltipOptions,
            interval: {
                shape: shape,
                style: columnStyle,
                color: color,
            },
        },
    });
    interval(p);
    return p;
}
/**
 * meta 配置
 * @param params
 */
export function meta(params) {
    var _a, _b;
    var options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField, data = options.data, isPercent = options.isPercent;
    var percentYMeta = isPercent ? { max: 1, min: 0, minLimit: 0, maxLimit: 1 } : {};
    return flow(scale((_a = {},
        _a[xField] = xAxis,
        _a[yField] = yAxis,
        _a), (_b = {},
        _b[xField] = {
            type: 'cat',
        },
        _b[yField] = __assign(__assign({}, adjustYMetaByZero(data, yField)), percentYMeta),
        _b)))(params);
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    // 为 false 则是不显示轴
    if (xAxis === false) {
        chart.axis(xField, false);
    }
    else {
        chart.axis(xField, xAxis);
    }
    if (yAxis === false) {
        chart.axis(yField, false);
    }
    else {
        chart.axis(yField, yAxis);
    }
    return params;
}
/**
 * legend 配置
 * @param params
 */
export function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, seriesField = options.seriesField;
    if (legend && seriesField) {
        chart.legend(seriesField, legend);
    }
    else if (legend === false) {
        chart.legend(false);
    }
    return params;
}
/**
 * 数据标签
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, yField = options.yField, isRange = options.isRange;
    var geometry = findGeometry(chart, 'interval');
    if (!label) {
        geometry.label(false);
    }
    else {
        var callback = label.callback, cfg = __rest(label, ["callback"]);
        geometry.label({
            fields: [yField],
            callback: callback,
            cfg: __assign({ 
                // 配置默认的 label layout： 如果用户没有指定 layout 和 position， 则自动配置 layout
                layout: (cfg === null || cfg === void 0 ? void 0 : cfg.position)
                    ? undefined
                    : [
                        { type: 'interval-adjust-position' },
                        { type: 'interval-hide-overlap' },
                        { type: 'adjust-color' },
                        { type: 'limit-in-plot', cfg: { action: 'hide' } },
                    ] }, transformLabel(isRange
                ? __assign({ content: function (item) {
                        var _a;
                        return (_a = item[yField]) === null || _a === void 0 ? void 0 : _a.join('-');
                    } }, cfg) : cfg)),
        });
    }
    return params;
}
/**
 * 柱形图 tooltip 配置 (对堆叠、分组做特殊处理)
 * @param params
 */
function columnTooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip, isGroup = options.isGroup, isStack = options.isStack, groupField = options.groupField, data = options.data, xField = options.xField, yField = options.yField, seriesField = options.seriesField;
    if (tooltip === false) {
        chart.tooltip(false);
    }
    else {
        var tooltipOptions = tooltip;
        // fix: https://github.com/antvis/G2Plot/issues/2572
        if (isGroup && isStack) {
            var customItems_1 = tooltipOptions.customItems;
            var tooltipFormatter_1 = (tooltipOptions === null || tooltipOptions === void 0 ? void 0 : tooltipOptions.formatter) ||
                (function (datum) { return ({ name: "".concat(datum[seriesField], " - ").concat(datum[groupField]), value: datum[yField] }); });
            tooltipOptions = __assign(__assign({}, tooltipOptions), { customItems: function (originalItems) {
                    var items = [];
                    each(originalItems, function (item) {
                        // Find datas in same cluster
                        var datas = filter(data, function (d) { return isMatch(d, pick(item.data, [xField, seriesField])); });
                        datas.forEach(function (datum) {
                            items.push(__assign(__assign(__assign({}, item), { value: datum[yField], data: datum, mappingData: { _origin: datum } }), tooltipFormatter_1(datum)));
                        });
                    });
                    // fix https://github.com/antvis/G2Plot/issues/3367
                    return customItems_1 ? customItems_1(items) : items;
                } });
        }
        chart.tooltip(tooltipOptions);
    }
    return params;
}
/**
 * 柱形图适配器
 * @param params
 */
export function adaptor(params, isBar) {
    if (isBar === void 0) { isBar = false; }
    var options = params.options;
    var seriesField = options.seriesField;
    return flow(defaultOptions, // 处理默认配置
    theme, // theme 需要在 geometry 之前
    pattern('columnStyle'), state, transformations('rect'), geometry, meta, axis, legend, columnTooltip, slider, scrollbar, label, brushInteraction, interaction, animation, annotation(), conversionTag(options.yField, !isBar, !!seriesField), // 有拆分的时候禁用转化率
    connectedArea(!options.isStack), limitInPlot)(params);
}
//# sourceMappingURL=adaptor.js.map