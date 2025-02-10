"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.legend = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var constant_1 = require("../../constant");
var utils_1 = require("../../utils");
var constant_2 = require("./constant");
var utils_2 = require("./utils");
/**
 * 字段
 * @param params
 */
function field(params) {
    var chart = params.chart, options = params.options;
    var xField = options.xField, yField = options.yField, groupField = options.groupField, color = options.color, tooltip = options.tooltip, boxStyle = options.boxStyle;
    chart.data((0, utils_2.transformData)(options.data, yField));
    var yFieldName = (0, util_1.isArray)(yField) ? constant_2.BOX_RANGE : yField;
    var rawFields = yField ? ((0, util_1.isArray)(yField) ? yField : [yField]) : [];
    var tooltipOptions = tooltip;
    if (tooltipOptions !== false) {
        tooltipOptions = (0, utils_1.deepAssign)({}, { fields: (0, util_1.isArray)(yField) ? yField : [] }, tooltipOptions);
    }
    var ext = (0, geometries_1.schema)((0, utils_1.deepAssign)({}, params, {
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
    var outliersView = chart.createView({ padding: padding, id: constant_2.OUTLIERS_VIEW_ID });
    var outliersViewData = data.reduce(function (ret, datum) {
        var outliersData = datum[outliersField];
        outliersData.forEach(function (d) {
            var _a;
            return ret.push(tslib_1.__assign(tslib_1.__assign({}, datum), (_a = {}, _a[outliersField] = d, _a)));
        });
        return ret;
    }, []);
    outliersView.data(outliersViewData);
    (0, geometries_1.point)({
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
    var yFieldName = Array.isArray(yField) ? constant_2.BOX_RANGE : yField;
    var baseMeta = {};
    // make yField and outliersField share y mate
    if (outliersField) {
        var syncName = constant_2.BOX_SYNC_NAME;
        baseMeta = (_a = {},
            _a[outliersField] = { sync: syncName, nice: true },
            _a[yFieldName] = { sync: syncName, nice: true },
            _a);
    }
    var scales = (0, utils_1.deepAssign)(baseMeta, meta, (_b = {},
        _b[xField] = (0, utils_1.pick)(xAxis, constant_1.AXIS_META_CONFIG_KEYS),
        _b[yFieldName] = (0, utils_1.pick)(yAxis, constant_1.AXIS_META_CONFIG_KEYS),
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
    var yFieldName = Array.isArray(yField) ? constant_2.BOX_RANGE : yField;
    // 为 false 则是不显示轴
    if (xAxis === false) {
        chart.axis(xField, false);
    }
    else {
        chart.axis(xField, xAxis);
    }
    if (yAxis === false) {
        chart.axis(constant_2.BOX_RANGE, false);
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
function legend(params) {
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
exports.legend = legend;
/**
 * 箱型图适配器
 * @param params
 */
function adaptor(params) {
    return (0, utils_1.flow)(field, outliersPoint, meta, axis, legend, common_1.tooltip, (0, common_1.annotation)(), common_1.interaction, common_1.animation, common_1.theme)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map