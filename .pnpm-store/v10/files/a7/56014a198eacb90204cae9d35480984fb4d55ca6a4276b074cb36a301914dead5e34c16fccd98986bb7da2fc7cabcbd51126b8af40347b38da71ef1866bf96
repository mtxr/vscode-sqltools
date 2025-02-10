import { __assign } from "tslib";
import { isArray } from '@antv/util';
import { animation, annotation, interaction, theme, tooltip } from '../../adaptor/common';
import { point, schema } from '../../adaptor/geometries';
import { AXIS_META_CONFIG_KEYS } from '../../constant';
import { deepAssign, flow, pick } from '../../utils';
import { BOX_RANGE, BOX_SYNC_NAME, OUTLIERS_VIEW_ID } from './constant';
import { transformData } from './utils';
/**
 * 字段
 * @param params
 */
function field(params) {
    var chart = params.chart, options = params.options;
    var xField = options.xField, yField = options.yField, groupField = options.groupField, color = options.color, tooltip = options.tooltip, boxStyle = options.boxStyle;
    chart.data(transformData(options.data, yField));
    var yFieldName = isArray(yField) ? BOX_RANGE : yField;
    var rawFields = yField ? (isArray(yField) ? yField : [yField]) : [];
    var tooltipOptions = tooltip;
    if (tooltipOptions !== false) {
        tooltipOptions = deepAssign({}, { fields: isArray(yField) ? yField : [] }, tooltipOptions);
    }
    var ext = schema(deepAssign({}, params, {
        options: {
            xField: xField,
            yField: yFieldName,
            seriesField: groupField,
            tooltip: tooltipOptions,
            rawFields: rawFields,
            // 只有异常点视图展示 label
            label: false,
            schema: {
                shape: 'box',
                color: color,
                style: boxStyle,
            },
        },
    })).ext;
    if (groupField) {
        ext.geometry.adjust('dodge');
    }
    return params;
}
/**
 * 创建异常点 view
 */
function outliersPoint(params) {
    var chart = params.chart, options = params.options;
    var xField = options.xField, data = options.data, outliersField = options.outliersField, outliersStyle = options.outliersStyle, padding = options.padding, label = options.label;
    if (!outliersField)
        return params;
    var outliersView = chart.createView({ padding: padding, id: OUTLIERS_VIEW_ID });
    var outliersViewData = data.reduce(function (ret, datum) {
        var outliersData = datum[outliersField];
        outliersData.forEach(function (d) {
            var _a;
            return ret.push(__assign(__assign({}, datum), (_a = {}, _a[outliersField] = d, _a)));
        });
        return ret;
    }, []);
    outliersView.data(outliersViewData);
    point({
        chart: outliersView,
        options: {
            xField: xField,
            yField: outliersField,
            point: { shape: 'circle', style: outliersStyle },
            label: label,
        },
    });
    outliersView.axis(false);
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a, _b;
    var chart = params.chart, options = params.options;
    var meta = options.meta, xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField, outliersField = options.outliersField;
    var yFieldName = Array.isArray(yField) ? BOX_RANGE : yField;
    var baseMeta = {};
    // make yField and outliersField share y mate
    if (outliersField) {
        var syncName = BOX_SYNC_NAME;
        baseMeta = (_a = {},
            _a[outliersField] = { sync: syncName, nice: true },
            _a[yFieldName] = { sync: syncName, nice: true },
            _a);
    }
    var scales = deepAssign(baseMeta, meta, (_b = {},
        _b[xField] = pick(xAxis, AXIS_META_CONFIG_KEYS),
        _b[yFieldName] = pick(yAxis, AXIS_META_CONFIG_KEYS),
        _b));
    chart.scale(scales);
    return params;
}
/**
 * axis 配置
 * @param params
 */
function axis(params) {
    var chart = params.chart, options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    var yFieldName = Array.isArray(yField) ? BOX_RANGE : yField;
    // 为 false 则是不显示轴
    if (xAxis === false) {
        chart.axis(xField, false);
    }
    else {
        chart.axis(xField, xAxis);
    }
    if (yAxis === false) {
        chart.axis(BOX_RANGE, false);
    }
    else {
        chart.axis(yFieldName, yAxis);
    }
    return params;
}
/**
 * legend 配置
 * @param params
 */
export function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, groupField = options.groupField;
    if (groupField) {
        if (legend) {
            chart.legend(groupField, legend);
        }
        else {
            // Grouped Box Chart default has legend, and it's position is `bottom`
            chart.legend(groupField, { position: 'bottom' });
        }
    }
    else {
        chart.legend(false);
    }
    return params;
}
/**
 * 箱型图适配器
 * @param params
 */
export function adaptor(params) {
    return flow(field, outliersPoint, meta, axis, legend, tooltip, annotation(), interaction, animation, theme)(params);
}
//# sourceMappingURL=adaptor.js.map