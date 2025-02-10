"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.meta = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var utils_2 = require("./utils");
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var bulletStyle = options.bulletStyle, targetField = options.targetField, rangeField = options.rangeField, measureField = options.measureField, xField = options.xField, color = options.color, layout = options.layout, size = options.size, label = options.label;
    // 处理数据
    var _a = (0, utils_2.transformData)(options), min = _a.min, max = _a.max, ds = _a.ds;
    chart.data(ds);
    // rangeGeometry
    var r = (0, utils_1.deepAssign)({}, params, {
        options: {
            xField: xField,
            yField: rangeField,
            seriesField: 'rKey',
            isStack: true,
            label: (0, util_1.get)(label, 'range'),
            interval: {
                color: (0, util_1.get)(color, 'range'),
                style: (0, util_1.get)(bulletStyle, 'range'),
                size: (0, util_1.get)(size, 'range'),
            },
        },
    });
    (0, geometries_1.interval)(r);
    // 范围值的 tooltip 隐藏掉
    chart.geometries[0].tooltip(false);
    // measureGeometry
    var m = (0, utils_1.deepAssign)({}, params, {
        options: {
            xField: xField,
            yField: measureField,
            seriesField: 'mKey',
            isStack: true,
            label: (0, util_1.get)(label, 'measure'),
            interval: {
                color: (0, util_1.get)(color, 'measure'),
                style: (0, util_1.get)(bulletStyle, 'measure'),
                size: (0, util_1.get)(size, 'measure'),
            },
        },
    });
    (0, geometries_1.interval)(m);
    // targetGeometry
    var t = (0, utils_1.deepAssign)({}, params, {
        options: {
            xField: xField,
            yField: targetField,
            seriesField: 'tKey',
            label: (0, util_1.get)(label, 'target'),
            point: {
                color: (0, util_1.get)(color, 'target'),
                style: (0, util_1.get)(bulletStyle, 'target'),
                size: (0, util_1.isFunction)((0, util_1.get)(size, 'target'))
                    ? function (data) { return (0, util_1.get)(size, 'target')(data) / 2; }
                    : (0, util_1.get)(size, 'target') / 2,
                shape: layout === 'horizontal' ? 'line' : 'hyphen',
            },
        },
    });
    (0, geometries_1.point)(t);
    // 水平的时候，要转换坐标轴
    if (layout === 'horizontal') {
        chart.coordinate().transpose();
    }
    return tslib_1.__assign(tslib_1.__assign({}, params), { ext: { data: { min: min, max: max } } });
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a, _b;
    var options = params.options, ext = params.ext;
    var xAxis = options.xAxis, yAxis = options.yAxis, targetField = options.targetField, rangeField = options.rangeField, measureField = options.measureField, xField = options.xField;
    var extData = ext.data;
    return (0, utils_1.flow)((0, common_1.scale)((_a = {},
        _a[xField] = xAxis,
        _a[measureField] = yAxis,
        _a), (_b = {},
        _b[measureField] = { min: extData === null || extData === void 0 ? void 0 : extData.min, max: extData === null || extData === void 0 ? void 0 : extData.max, sync: true },
        _b[targetField] = {
            sync: "".concat(measureField),
        },
        _b[rangeField] = {
            sync: "".concat(measureField),
        },
        _b)))(params);
}
exports.meta = meta;
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, measureField = options.measureField, rangeField = options.rangeField, targetField = options.targetField;
    chart.axis("".concat(rangeField), false);
    chart.axis("".concat(targetField), false);
    // 为 false 则是不显示轴
    if (xAxis === false) {
        chart.axis("".concat(xField), false);
    }
    else {
        chart.axis("".concat(xField), xAxis);
    }
    if (yAxis === false) {
        chart.axis("".concat(measureField), false);
    }
    else {
        chart.axis("".concat(measureField), yAxis);
    }
    return params;
}
/**
 * legend 配置
 * @param params
 */
function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend;
    chart.removeInteraction('legend-filter');
    // @TODO 后续看是否内部自定义一个 legend
    chart.legend(legend);
    // 默认关闭掉所在 color 字段的 legend, 从而不影响自定义的legend
    chart.legend('rKey', false);
    chart.legend('mKey', false);
    chart.legend('tKey', false);
    return params;
}
/**
 * label 配置
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, measureField = options.measureField, targetField = options.targetField, rangeField = options.rangeField;
    var _a = chart.geometries, rangeGeometry = _a[0], measureGeometry = _a[1], targetGeometry = _a[2];
    if ((0, util_1.get)(label, 'range')) {
        rangeGeometry.label("".concat(rangeField), tslib_1.__assign({ layout: [{ type: 'limit-in-plot' }] }, (0, utils_1.transformLabel)(label.range)));
    }
    else {
        rangeGeometry.label(false);
    }
    if ((0, util_1.get)(label, 'measure')) {
        measureGeometry.label("".concat(measureField), tslib_1.__assign({ layout: [{ type: 'limit-in-plot' }] }, (0, utils_1.transformLabel)(label.measure)));
    }
    else {
        measureGeometry.label(false);
    }
    if ((0, util_1.get)(label, 'target')) {
        targetGeometry.label("".concat(targetField), tslib_1.__assign({ layout: [{ type: 'limit-in-plot' }] }, (0, utils_1.transformLabel)(label.target)));
    }
    else {
        targetGeometry.label(false);
    }
    return params;
}
/**
 * 子弹图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    (0, utils_1.flow)(geometry, meta, axis, legend, common_1.theme, label, common_1.tooltip, common_1.interaction, common_1.animation)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map