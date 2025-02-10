import { get, isArray, isNumber, map } from '@antv/util';
import { geometry as baseGeometry } from '../../../adaptor/geometries/base';
import { deepAssign, flow } from '../../../utils';
import { getTooltipMapping } from '../../../utils/tooltip';
import { FUNNEL_CONVERSATION, FUNNEL_MAPPING_VALUE, FUNNEL_PERCENT } from '../constant';
import { conversionTagComponent, transformData } from './common';
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
            var formatterData = transformData(facet.data, data, {
                yField: yField,
                maxSize: maxSize,
                minSize: minSize,
            });
            view.data(formatterData);
            // 绘制图形
            var _a = getTooltipMapping(tooltip, [xField, yField, compareField]), fields = _a.fields, formatter = _a.formatter;
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
            baseGeometry({
                chart: view,
                options: {
                    type: 'interval',
                    xField: xField,
                    yField: FUNNEL_MAPPING_VALUE,
                    colorField: xField,
                    tooltipFields: isArray(fields) && fields.concat([FUNNEL_PERCENT, FUNNEL_CONVERSATION]),
                    mapping: {
                        // todo 暂时不提供 金字塔 shape，后续需要自定义下形状
                        shape: 'funnel',
                        tooltip: formatter,
                        color: color,
                        style: funnelStyle,
                    },
                    label: label === false ? false : deepAssign({}, defaultFacetLabel, label),
                    state: state,
                },
            });
        },
    });
    return params;
}
export function compareConversionTag(params) {
    // @ts-ignore
    var chart = params.chart, index = params.index, options = params.options;
    var conversionTag = options.conversionTag, isTransposed = options.isTransposed;
    (isNumber(index) ? [chart] : chart.views).forEach(function (view, viewIndex) {
        // 获取形状位置，再转化为需要的转化率位置
        var dataArray = get(view, ['geometries', '0', 'dataArray'], []);
        var size = get(view, ['options', 'data', 'length']);
        var x = map(dataArray, function (item) { return get(item, ['0', 'nextPoints', '0', 'x']) * size - 0.5; });
        var getLineCoordinate = function (datum, datumIndex, data, initLineOption) {
            var ratio = (index || viewIndex) === 0 ? -1 : 1;
            return deepAssign({}, initLineOption, {
                start: [x[datumIndex - 1] || datumIndex - 0.5, datum[FUNNEL_MAPPING_VALUE]],
                end: [x[datumIndex - 1] || datumIndex - 0.5, datum[FUNNEL_MAPPING_VALUE] + 0.05],
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
        conversionTagComponent(getLineCoordinate)(deepAssign({}, {
            chart: view,
            options: options,
        }));
    });
}
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
export function compareFunnel(params) {
    return flow(field, geometry, conversionTag)(params);
}
//# sourceMappingURL=compare.js.map