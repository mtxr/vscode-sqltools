"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicHeightFunnel = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../../../adaptor/geometries/base");
var utils_1 = require("../../../utils");
var tooltip_1 = require("../../../utils/tooltip");
var constant_1 = require("../constant");
var common_1 = require("./common");
/**
 * 动态高度漏斗图
 * @param params
 * 需求: 每个漏斗项的高度根据 yfield 等比生成。漏斗上下宽度比为2，即斜率为 2。
 * 实现方式: 使用 g2 多边形，data -> 点坐标 -> 绘制
 * 以漏斗底部中心点为坐标轴原点，漏斗在 -0.5 <= x <= 0.5, 0 <= y <= 1 的正方形中绘制
 * 先计算第一象限的点, 第二象限的点即为镜像 x 轴取反。
 * 第一象限共需计算 data.length + 1 个点，在 y = 4x - 1 上。首尾分别是[0.5, 1], [0.25, 0]。根据 data 计算出 y 值，从而得到 y 值
 */
/**
 * 处理数据
 * @param params
 */
function field(params) {
    var chart = params.chart, options = params.options;
    var _a = options.data, data = _a === void 0 ? [] : _a, yField = options.yField;
    // 计算各数据项所占高度
    var sum = (0, util_1.reduce)(data, function (total, item) {
        return total + (item[yField] || 0);
    }, 0);
    var max = (0, util_1.maxBy)(data, yField)[yField];
    var formatData = (0, util_1.map)(data, function (row, index) {
        // 储存四个点 x，y 坐标，方向为顺时针，即 [左上, 右上，右下，左下]
        var x = [];
        var y = [];
        row[constant_1.FUNNEL_TOTAL_PERCENT] = (row[yField] || 0) / sum;
        // 获取左上角，右上角坐标
        if (index) {
            var preItemX = data[index - 1][constant_1.PLOYGON_X];
            var preItemY = data[index - 1][constant_1.PLOYGON_Y];
            x[0] = preItemX[3];
            y[0] = preItemY[3];
            x[1] = preItemX[2];
            y[1] = preItemY[2];
        }
        else {
            x[0] = -0.5;
            y[0] = 1;
            x[1] = 0.5;
            y[1] = 1;
        }
        // 获取右下角坐标
        y[2] = y[1] - row[constant_1.FUNNEL_TOTAL_PERCENT];
        x[2] = (y[2] + 1) / 4;
        y[3] = y[2];
        x[3] = -x[2];
        // 赋值
        row[constant_1.PLOYGON_X] = x;
        row[constant_1.PLOYGON_Y] = y;
        row[constant_1.FUNNEL_PERCENT] = (row[yField] || 0) / max;
        row[constant_1.FUNNEL_CONVERSATION] = [(0, util_1.get)(data, [index - 1, yField]), row[yField]];
        return row;
    });
    chart.data(formatData);
    return params;
}
/**
 * geometry处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var xField = options.xField, yField = options.yField, color = options.color, tooltip = options.tooltip, label = options.label, funnelStyle = options.funnelStyle, state = options.state;
    var _a = (0, tooltip_1.getTooltipMapping)(tooltip, [xField, yField]), fields = _a.fields, formatter = _a.formatter;
    // 绘制漏斗图
    (0, base_1.geometry)({
        chart: chart,
        options: {
            type: 'polygon',
            xField: constant_1.PLOYGON_X,
            yField: constant_1.PLOYGON_Y,
            colorField: xField,
            tooltipFields: (0, util_1.isArray)(fields) && fields.concat([constant_1.FUNNEL_PERCENT, constant_1.FUNNEL_CONVERSATION]),
            label: label,
            state: state,
            mapping: {
                tooltip: formatter,
                color: color,
                style: funnelStyle,
            },
        },
    });
    return params;
}
/**
 * 转置处理
 * @param params
 */
function transpose(params) {
    var chart = params.chart, options = params.options;
    var isTransposed = options.isTransposed;
    chart.coordinate({
        type: 'rect',
        actions: isTransposed ? [['transpose'], ['reflect', 'x']] : [],
    });
    return params;
}
/**
 * 转化率组件
 * @param params
 */
function conversionTag(params) {
    var getLineCoordinate = function (datum, datumIndex, data, initLineOption) {
        return tslib_1.__assign(tslib_1.__assign({}, initLineOption), { start: [datum[constant_1.PLOYGON_X][1], datum[constant_1.PLOYGON_Y][1]], end: [datum[constant_1.PLOYGON_X][1] + 0.05, datum[constant_1.PLOYGON_Y][1]] });
    };
    (0, common_1.conversionTagComponent)(getLineCoordinate)(params);
    return params;
}
/**
 * 动态高度漏斗
 * @param chart
 * @param options
 */
function dynamicHeightFunnel(params) {
    return (0, utils_1.flow)(field, geometry, transpose, conversionTag)(params);
}
exports.dynamicHeightFunnel = dynamicHeightFunnel;
//# sourceMappingURL=dynamic-height.js.map