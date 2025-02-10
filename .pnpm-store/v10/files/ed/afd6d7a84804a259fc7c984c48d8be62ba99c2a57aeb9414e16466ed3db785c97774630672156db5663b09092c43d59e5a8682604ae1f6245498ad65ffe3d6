"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareFunnel = exports.compareConversionTag = void 0;
var util_1 = require("@antv/util");
var base_1 = require("../../../adaptor/geometries/base");
var utils_1 = require("../../../utils");
var tooltip_1 = require("../../../utils/tooltip");
var constant_1 = require("../constant");
var common_1 = require("./common");
/**
 * 处理字段数据
 * @param params
 */
function field(params) {
    var _a;
    var chart = params.chart, options = params.options;
    var _b = options.data, data = _b === void 0 ? [] : _b, yField = options.yField;
    // 绘制漏斗图
    chart.data(data);
    chart.scale((_a = {},
        _a[yField] = {
            sync: true,
        },
        _a));
    return params;
}
/**
 * geometry处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, xField = options.xField, yField = options.yField, color = options.color, compareField = options.compareField, isTransposed = options.isTransposed, tooltip = options.tooltip, maxSize = options.maxSize, minSize = options.minSize, label = options.label, funnelStyle = options.funnelStyle, state = options.state, showFacetTitle = options.showFacetTitle;
    chart.facet('mirror', {
        fields: [compareField],
        // 漏斗图的转置规则与分面相反，默认是垂直布局
        transpose: !isTransposed,
        padding: isTransposed ? 0 : [32, 0, 0, 0],
        showTitle: showFacetTitle,
        eachView: function (view, facet) {
            var index = isTransposed ? facet.rowIndex : facet.columnIndex;
            if (!isTransposed) {
                view.coordinate({
                    type: 'rect',
                    actions: [['transpose'], ['scale', index === 0 ? -1 : 1, -1]],
                });
            }
            var formatterData = (0, common_1.transformData)(facet.data, data, {
                yField: yField,
                maxSize: maxSize,
                minSize: minSize,
            });
            view.data(formatterData);
            // 绘制图形
            var _a = (0, tooltip_1.getTooltipMapping)(tooltip, [xField, yField, compareField]), fields = _a.fields, formatter = _a.formatter;
            var defaultFacetLabel = isTransposed
                ? {
                    offset: index === 0 ? 10 : -23,
                    position: (index === 0 ? 'bottom' : 'top'),
                }
                : {
                    offset: 10,
                    position: 'left',
                    style: {
                        textAlign: index === 0 ? 'end' : 'start',
                    },
                };
            (0, base_1.geometry)({
                chart: view,
                options: {
                    type: 'interval',
                    xField: xField,
                    yField: constant_1.FUNNEL_MAPPING_VALUE,
                    colorField: xField,
                    tooltipFields: (0, util_1.isArray)(fields) && fields.concat([constant_1.FUNNEL_PERCENT, constant_1.FUNNEL_CONVERSATION]),
                    mapping: {
                        // todo 暂时不提供 金字塔 shape，后续需要自定义下形状
                        shape: 'funnel',
                        tooltip: formatter,
                        color: color,
                        style: funnelStyle,
                    },
                    label: label === false ? false : (0, utils_1.deepAssign)({}, defaultFacetLabel, label),
                    state: state,
                },
            });
        },
    });
    return params;
}
function compareConversionTag(params) {
    // @ts-ignore
    var chart = params.chart, index = params.index, options = params.options;
    var conversionTag = options.conversionTag, isTransposed = options.isTransposed;
    ((0, util_1.isNumber)(index) ? [chart] : chart.views).forEach(function (view, viewIndex) {
        // 获取形状位置，再转化为需要的转化率位置
        var dataArray = (0, util_1.get)(view, ['geometries', '0', 'dataArray'], []);
        var size = (0, util_1.get)(view, ['options', 'data', 'length']);
        var x = (0, util_1.map)(dataArray, function (item) { return (0, util_1.get)(item, ['0', 'nextPoints', '0', 'x']) * size - 0.5; });
        var getLineCoordinate = function (datum, datumIndex, data, initLineOption) {
            var ratio = (index || viewIndex) === 0 ? -1 : 1;
            return (0, utils_1.deepAssign)({}, initLineOption, {
                start: [x[datumIndex - 1] || datumIndex - 0.5, datum[constant_1.FUNNEL_MAPPING_VALUE]],
                end: [x[datumIndex - 1] || datumIndex - 0.5, datum[constant_1.FUNNEL_MAPPING_VALUE] + 0.05],
                text: isTransposed
                    ? {
                        style: {
                            textAlign: 'start',
                        },
                    }
                    : {
                        offsetX: conversionTag !== false ? ratio * conversionTag.offsetX : 0,
                        style: {
                            textAlign: (index || viewIndex) === 0 ? 'end' : 'start',
                        },
                    },
            });
        };
        (0, common_1.conversionTagComponent)(getLineCoordinate)((0, utils_1.deepAssign)({}, {
            chart: view,
            options: options,
        }));
    });
}
exports.compareConversionTag = compareConversionTag;
/**
 * 转化率组件
 * @param params
 */
function conversionTag(params) {
    var chart = params.chart;
    // @ts-ignore
    chart.once('beforepaint', function () { return compareConversionTag(params); });
    return params;
}
/**
 * 对比漏斗
 * @param chart
 * @param options
 */
function compareFunnel(params) {
    return (0, utils_1.flow)(field, geometry, conversionTag)(params);
}
exports.compareFunnel = compareFunnel;
//# sourceMappingURL=compare.js.map