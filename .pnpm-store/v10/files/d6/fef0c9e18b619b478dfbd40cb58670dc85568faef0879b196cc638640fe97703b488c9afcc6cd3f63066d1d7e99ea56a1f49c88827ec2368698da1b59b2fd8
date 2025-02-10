import { __assign, __rest } from "tslib";
import { each, get, isArray, isEmpty, isFunction, isNil, isNumber, isString, toString } from '@antv/util';
import { animation, annotation, legend, state, theme } from '../../adaptor/common';
import { interval } from '../../adaptor/geometries';
import { getMappingFunction } from '../../adaptor/geometries/base';
import { pattern } from '../../adaptor/pattern';
import { getLocale } from '../../core/locale';
import { deepAssign, flow, processIllegalData, renderStatistic, template, transformLabel } from '../../utils';
import { DEFAULT_OPTIONS } from './contants';
import { PIE_STATISTIC } from './interactions';
import { adaptOffset, getTotalValue, isAllZero } from './utils';
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, angleField = options.angleField, colorField = options.colorField, color = options.color, pieStyle = options.pieStyle, shape = options.shape;
    // 处理不合法的数据
    var processData = processIllegalData(data, angleField);
    if (isAllZero(processData, angleField)) {
        // 数据全 0 处理，调整 position 映射
        var percentageField_1 = '$$percentage$$';
        processData = processData.map(function (d) {
            var _a;
            return (__assign(__assign({}, d), (_a = {}, _a[percentageField_1] = 1 / processData.length, _a)));
        });
        chart.data(processData);
        var p = deepAssign({}, params, {
            options: {
                xField: '1',
                yField: percentageField_1,
                seriesField: colorField,
                isStack: true,
                interval: {
                    color: color,
                    shape: shape,
                    style: pieStyle,
                },
                args: {
                    zIndexReversed: true,
                    sortZIndex: true,
                },
            },
        });
        interval(p);
    }
    else {
        chart.data(processData);
        var p = deepAssign({}, params, {
            options: {
                xField: '1',
                yField: angleField,
                seriesField: colorField,
                isStack: true,
                interval: {
                    color: color,
                    shape: shape,
                    style: pieStyle,
                },
                args: {
                    zIndexReversed: true,
                    sortZIndex: true,
                },
            },
        });
        interval(p);
    }
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a;
    var chart = params.chart, options = params.options;
    var meta = options.meta, colorField = options.colorField;
    // meta 直接是 scale 的信息
    var scales = deepAssign({}, meta);
    chart.scale(scales, (_a = {},
        _a[colorField] = { type: 'cat' },
        _a));
    return params;
}
/**
 * coord 配置
 * @param params
 */
function coordinate(params) {
    var chart = params.chart, options = params.options;
    var radius = options.radius, innerRadius = options.innerRadius, startAngle = options.startAngle, endAngle = options.endAngle;
    chart.coordinate({
        type: 'theta',
        cfg: {
            radius: radius,
            innerRadius: innerRadius,
            startAngle: startAngle,
            endAngle: endAngle,
        },
    });
    return params;
}
/**
 * label 配置
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, colorField = options.colorField, angleField = options.angleField;
    var geometry = chart.geometries[0];
    // label 为 false, 空 则不显示 label
    if (!label) {
        geometry.label(false);
    }
    else {
        var callback = label.callback, cfg = __rest(label, ["callback"]);
        var labelCfg = transformLabel(cfg);
        // ① 提供模板字符串的 label content 配置
        if (labelCfg.content) {
            var content_1 = labelCfg.content;
            labelCfg.content = function (data, dataum, index) {
                var name = data[colorField];
                var value = data[angleField];
                // dymatic get scale, scale is ready this time
                var angleScale = chart.getScaleByField(angleField);
                var percent = angleScale === null || angleScale === void 0 ? void 0 : angleScale.scale(value);
                return isFunction(content_1)
                    ? // append percent (number) to data, users can get origin data from `dataum._origin`
                        content_1(__assign(__assign({}, data), { percent: percent }), dataum, index)
                    : isString(content_1)
                        ? template(content_1, {
                            value: value,
                            name: name,
                            // percentage (string), default keep 2
                            percentage: isNumber(percent) && !isNil(value) ? "".concat((percent * 100).toFixed(2), "%") : null,
                        })
                        : content_1;
            };
        }
        var LABEL_LAYOUT_TYPE_MAP = {
            inner: '',
            outer: 'pie-outer',
            spider: 'pie-spider',
        };
        var labelLayoutType = labelCfg.type ? LABEL_LAYOUT_TYPE_MAP[labelCfg.type] : 'pie-outer';
        var labelLayoutCfg = labelCfg.layout ? (!isArray(labelCfg.layout) ? [labelCfg.layout] : labelCfg.layout) : [];
        labelCfg.layout = (labelLayoutType ? [{ type: labelLayoutType }] : []).concat(labelLayoutCfg);
        geometry.label({
            // fix: could not create scale, when field is undefined（attributes 中的 fields 定义都会被用来创建 scale）
            fields: colorField ? [angleField, colorField] : [angleField],
            callback: callback,
            cfg: __assign(__assign({}, labelCfg), { offset: adaptOffset(labelCfg.type, labelCfg.offset), type: 'pie' }),
        });
    }
    return params;
}
/**
 * statistic options 处理
 * 1. 默认继承 default options 的样式
 * 2. 默认使用 meta 的 formatter
 */
export function transformStatisticOptions(options) {
    var innerRadius = options.innerRadius, statistic = options.statistic, angleField = options.angleField, colorField = options.colorField, meta = options.meta, locale = options.locale;
    var i18n = getLocale(locale);
    if (innerRadius && statistic) {
        var _a = deepAssign({}, DEFAULT_OPTIONS.statistic, statistic), titleOpt_1 = _a.title, contentOpt_1 = _a.content;
        if (titleOpt_1 !== false) {
            titleOpt_1 = deepAssign({}, {
                formatter: function (datum) {
                    // 交互中, datum existed.
                    var text = datum
                        ? datum[colorField]
                        : !isNil(titleOpt_1.content)
                            ? titleOpt_1.content
                            : i18n.get(['statistic', 'total']);
                    var metaFormatter = get(meta, [colorField, 'formatter']) || (function (v) { return v; });
                    return metaFormatter(text);
                },
            }, titleOpt_1);
        }
        if (contentOpt_1 !== false) {
            contentOpt_1 = deepAssign({}, {
                formatter: function (datum, data) {
                    var dataValue = datum ? datum[angleField] : getTotalValue(data, angleField);
                    var metaFormatter = get(meta, [angleField, 'formatter']) || (function (v) { return v; });
                    // 交互中
                    if (datum) {
                        return metaFormatter(dataValue);
                    }
                    return !isNil(contentOpt_1.content) ? contentOpt_1.content : metaFormatter(dataValue);
                },
            }, contentOpt_1);
        }
        return deepAssign({}, { statistic: { title: titleOpt_1, content: contentOpt_1 } }, options);
    }
    return options;
}
/**
 * statistic 中心文本配置
 * @param params
 */
export function pieAnnotation(params) {
    var chart = params.chart, options = params.options;
    var _a = transformStatisticOptions(options), innerRadius = _a.innerRadius, statistic = _a.statistic;
    // 先清空标注，再重新渲染
    chart.getController('annotation').clear(true);
    // 先进行其他 annotations，再去渲染统计文本
    flow(annotation())(params);
    /** 中心文本 指标卡 */
    if (innerRadius && statistic) {
        renderStatistic(chart, { statistic: statistic, plotType: 'pie' });
    }
    return params;
}
/**
 * 饼图 tooltip 配置
 * 1. 强制 tooltip.shared 为 false
 * @param params
 */
function tooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip, colorField = options.colorField, angleField = options.angleField, data = options.data;
    if (tooltip === false) {
        chart.tooltip(tooltip);
    }
    else {
        chart.tooltip(deepAssign({}, tooltip, { shared: false }));
        // 主要解决 all zero， 对于非 all zero 不再适用
        if (isAllZero(data, angleField)) {
            var fields = get(tooltip, 'fields');
            var formatter = get(tooltip, 'formatter');
            if (isEmpty(get(tooltip, 'fields'))) {
                fields = [colorField, angleField];
                formatter = formatter || (function (datum) { return ({ name: datum[colorField], value: toString(datum[angleField]) }); });
            }
            chart.geometries[0].tooltip(fields.join('*'), getMappingFunction(fields, formatter));
        }
    }
    return params;
}
/**
 * Interaction 配置 (饼图特殊的 interaction, 中心文本变更的时候，需要将一些配置参数传进去）
 * @param params
 */
export function interaction(params) {
    var chart = params.chart, options = params.options;
    var _a = transformStatisticOptions(options), interactions = _a.interactions, statistic = _a.statistic, annotations = _a.annotations;
    each(interactions, function (i) {
        var _a, _b;
        if (i.enable === false) {
            chart.removeInteraction(i.type);
        }
        else if (i.type === 'pie-statistic-active') {
            // 只针对 start 阶段的配置，进行添加参数信息
            var startStages_1 = [];
            if (!((_a = i.cfg) === null || _a === void 0 ? void 0 : _a.start)) {
                startStages_1 = [
                    {
                        trigger: 'element:mouseenter',
                        action: "".concat(PIE_STATISTIC, ":change"),
                        arg: { statistic: statistic, annotations: annotations },
                    },
                ];
            }
            each((_b = i.cfg) === null || _b === void 0 ? void 0 : _b.start, function (stage) {
                startStages_1.push(__assign(__assign({}, stage), { arg: { statistic: statistic, annotations: annotations } }));
            });
            chart.interaction(i.type, deepAssign({}, i.cfg, { start: startStages_1 }));
        }
        else {
            chart.interaction(i.type, i.cfg || {});
        }
    });
    return params;
}
/**
 * 饼图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return flow(pattern('pieStyle'), geometry, meta, theme, coordinate, legend, tooltip, label, state, 
    /** 指标卡中心文本 放在下层 */
    pieAnnotation, interaction, animation)(params);
}
//# sourceMappingURL=adaptor.js.map