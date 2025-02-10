"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.interaction = exports.pieAnnotation = exports.transformStatisticOptions = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var base_1 = require("../../adaptor/geometries/base");
var pattern_1 = require("../../adaptor/pattern");
var locale_1 = require("../../core/locale");
var utils_1 = require("../../utils");
var contants_1 = require("./contants");
var interactions_1 = require("./interactions");
var utils_2 = require("./utils");
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, angleField = options.angleField, colorField = options.colorField, color = options.color, pieStyle = options.pieStyle, shape = options.shape;
    // 处理不合法的数据
    var processData = (0, utils_1.processIllegalData)(data, angleField);
    if ((0, utils_2.isAllZero)(processData, angleField)) {
        // 数据全 0 处理，调整 position 映射
        var percentageField_1 = '$$percentage$$';
        processData = processData.map(function (d) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, d), (_a = {}, _a[percentageField_1] = 1 / processData.length, _a)));
        });
        chart.data(processData);
        var p = (0, utils_1.deepAssign)({}, params, {
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
        (0, geometries_1.interval)(p);
    }
    else {
        chart.data(processData);
        var p = (0, utils_1.deepAssign)({}, params, {
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
        (0, geometries_1.interval)(p);
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
    var scales = (0, utils_1.deepAssign)({}, meta);
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
        var callback = label.callback, cfg = tslib_1.__rest(label, ["callback"]);
        var labelCfg = (0, utils_1.transformLabel)(cfg);
        // ① 提供模板字符串的 label content 配置
        if (labelCfg.content) {
            var content_1 = labelCfg.content;
            labelCfg.content = function (data, dataum, index) {
                var name = data[colorField];
                var value = data[angleField];
                // dymatic get scale, scale is ready this time
                var angleScale = chart.getScaleByField(angleField);
                var percent = angleScale === null || angleScale === void 0 ? void 0 : angleScale.scale(value);
                return (0, util_1.isFunction)(content_1)
                    ? // append percent (number) to data, users can get origin data from `dataum._origin`
                        content_1(tslib_1.__assign(tslib_1.__assign({}, data), { percent: percent }), dataum, index)
                    : (0, util_1.isString)(content_1)
                        ? (0, utils_1.template)(content_1, {
                            value: value,
                            name: name,
                            // percentage (string), default keep 2
                            percentage: (0, util_1.isNumber)(percent) && !(0, util_1.isNil)(value) ? "".concat((percent * 100).toFixed(2), "%") : null,
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
        var labelLayoutCfg = labelCfg.layout ? (!(0, util_1.isArray)(labelCfg.layout) ? [labelCfg.layout] : labelCfg.layout) : [];
        labelCfg.layout = (labelLayoutType ? [{ type: labelLayoutType }] : []).concat(labelLayoutCfg);
        geometry.label({
            // fix: could not create scale, when field is undefined（attributes 中的 fields 定义都会被用来创建 scale）
            fields: colorField ? [angleField, colorField] : [angleField],
            callback: callback,
            cfg: tslib_1.__assign(tslib_1.__assign({}, labelCfg), { offset: (0, utils_2.adaptOffset)(labelCfg.type, labelCfg.offset), type: 'pie' }),
        });
    }
    return params;
}
/**
 * statistic options 处理
 * 1. 默认继承 default options 的样式
 * 2. 默认使用 meta 的 formatter
 */
function transformStatisticOptions(options) {
    var innerRadius = options.innerRadius, statistic = options.statistic, angleField = options.angleField, colorField = options.colorField, meta = options.meta, locale = options.locale;
    var i18n = (0, locale_1.getLocale)(locale);
    if (innerRadius && statistic) {
        var _a = (0, utils_1.deepAssign)({}, contants_1.DEFAULT_OPTIONS.statistic, statistic), titleOpt_1 = _a.title, contentOpt_1 = _a.content;
        if (titleOpt_1 !== false) {
            titleOpt_1 = (0, utils_1.deepAssign)({}, {
                formatter: function (datum) {
                    // 交互中, datum existed.
                    var text = datum
                        ? datum[colorField]
                        : !(0, util_1.isNil)(titleOpt_1.content)
                            ? titleOpt_1.content
                            : i18n.get(['statistic', 'total']);
                    var metaFormatter = (0, util_1.get)(meta, [colorField, 'formatter']) || (function (v) { return v; });
                    return metaFormatter(text);
                },
            }, titleOpt_1);
        }
        if (contentOpt_1 !== false) {
            contentOpt_1 = (0, utils_1.deepAssign)({}, {
                formatter: function (datum, data) {
                    var dataValue = datum ? datum[angleField] : (0, utils_2.getTotalValue)(data, angleField);
                    var metaFormatter = (0, util_1.get)(meta, [angleField, 'formatter']) || (function (v) { return v; });
                    // 交互中
                    if (datum) {
                        return metaFormatter(dataValue);
                    }
                    return !(0, util_1.isNil)(contentOpt_1.content) ? contentOpt_1.content : metaFormatter(dataValue);
                },
            }, contentOpt_1);
        }
        return (0, utils_1.deepAssign)({}, { statistic: { title: titleOpt_1, content: contentOpt_1 } }, options);
    }
    return options;
}
exports.transformStatisticOptions = transformStatisticOptions;
/**
 * statistic 中心文本配置
 * @param params
 */
function pieAnnotation(params) {
    var chart = params.chart, options = params.options;
    var _a = transformStatisticOptions(options), innerRadius = _a.innerRadius, statistic = _a.statistic;
    // 先清空标注，再重新渲染
    chart.getController('annotation').clear(true);
    // 先进行其他 annotations，再去渲染统计文本
    (0, utils_1.flow)((0, common_1.annotation)())(params);
    /** 中心文本 指标卡 */
    if (innerRadius && statistic) {
        (0, utils_1.renderStatistic)(chart, { statistic: statistic, plotType: 'pie' });
    }
    return params;
}
exports.pieAnnotation = pieAnnotation;
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
        chart.tooltip((0, utils_1.deepAssign)({}, tooltip, { shared: false }));
        // 主要解决 all zero， 对于非 all zero 不再适用
        if ((0, utils_2.isAllZero)(data, angleField)) {
            var fields = (0, util_1.get)(tooltip, 'fields');
            var formatter = (0, util_1.get)(tooltip, 'formatter');
            if ((0, util_1.isEmpty)((0, util_1.get)(tooltip, 'fields'))) {
                fields = [colorField, angleField];
                formatter = formatter || (function (datum) { return ({ name: datum[colorField], value: (0, util_1.toString)(datum[angleField]) }); });
            }
            chart.geometries[0].tooltip(fields.join('*'), (0, base_1.getMappingFunction)(fields, formatter));
        }
    }
    return params;
}
/**
 * Interaction 配置 (饼图特殊的 interaction, 中心文本变更的时候，需要将一些配置参数传进去）
 * @param params
 */
function interaction(params) {
    var chart = params.chart, options = params.options;
    var _a = transformStatisticOptions(options), interactions = _a.interactions, statistic = _a.statistic, annotations = _a.annotations;
    (0, util_1.each)(interactions, function (i) {
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
                        action: "".concat(interactions_1.PIE_STATISTIC, ":change"),
                        arg: { statistic: statistic, annotations: annotations },
                    },
                ];
            }
            (0, util_1.each)((_b = i.cfg) === null || _b === void 0 ? void 0 : _b.start, function (stage) {
                startStages_1.push(tslib_1.__assign(tslib_1.__assign({}, stage), { arg: { statistic: statistic, annotations: annotations } }));
            });
            chart.interaction(i.type, (0, utils_1.deepAssign)({}, i.cfg, { start: startStages_1 }));
        }
        else {
            chart.interaction(i.type, i.cfg || {});
        }
    });
    return params;
}
exports.interaction = interaction;
/**
 * 饼图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)((0, pattern_1.pattern)('pieStyle'), geometry, meta, common_1.theme, coordinate, common_1.legend, tooltip, label, common_1.state, 
    /** 指标卡中心文本 放在下层 */
    pieAnnotation, interaction, common_1.animation)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map