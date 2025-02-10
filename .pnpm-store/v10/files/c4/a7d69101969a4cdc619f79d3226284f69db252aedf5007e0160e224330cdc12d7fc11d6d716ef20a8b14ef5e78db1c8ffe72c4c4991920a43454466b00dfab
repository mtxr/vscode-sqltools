"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var base_1 = require("../../adaptor/geometries/base");
var utils_1 = require("../../utils");
var tooltip_1 = require("../../utils/tooltip");
function geometry(params) {
    var chart = params.chart, options = params.options;
    var data = options.data, type = options.type, xField = options.xField, yField = options.yField, colorField = options.colorField, sizeField = options.sizeField, sizeRatio = options.sizeRatio, shape = options.shape, color = options.color, tooltip = options.tooltip, heatmapStyle = options.heatmapStyle, meta = options.meta;
    chart.data(data);
    var geometryType = 'polygon';
    if (type === 'density') {
        geometryType = 'heatmap';
    }
    var _a = (0, tooltip_1.getTooltipMapping)(tooltip, [xField, yField, colorField]), fields = _a.fields, formatter = _a.formatter;
    /**
     * The ratio between the actual size and the max available size, must be in range `[0,1]`.
     *
     * If the `sizeRatio` attribute is undefined or it exceeds the range,
     * `checkedSizeRatio` would be set to 1 as default.
     */
    var checkedSizeRatio = 1;
    if (sizeRatio || sizeRatio === 0) {
        if (!shape && !sizeField) {
            console.warn('sizeRatio is not in effect: Must define shape or sizeField first');
        }
        else if (sizeRatio < 0 || sizeRatio > 1) {
            console.warn('sizeRatio is not in effect: It must be a number in [0,1]');
        }
        else {
            checkedSizeRatio = sizeRatio;
        }
    }
    (0, base_1.geometry)((0, utils_1.deepAssign)({}, params, {
        options: {
            type: geometryType,
            colorField: colorField,
            tooltipFields: fields,
            shapeField: sizeField || '',
            label: undefined,
            mapping: {
                tooltip: formatter,
                shape: shape &&
                    (sizeField
                        ? function (dautm) {
                            var field = data.map(function (row) { return row[sizeField]; });
                            var _a = (meta === null || meta === void 0 ? void 0 : meta[sizeField]) || {}, min = _a.min, max = _a.max;
                            min = (0, util_1.isNumber)(min) ? min : Math.min.apply(Math, field);
                            max = (0, util_1.isNumber)(max) ? max : Math.max.apply(Math, field);
                            return [shape, ((0, util_1.get)(dautm, sizeField) - min) / (max - min), checkedSizeRatio];
                        }
                        : function () { return [shape, 1, checkedSizeRatio]; }),
                color: color || (colorField && chart.getTheme().sequenceColors.join('-')),
                style: heatmapStyle,
            },
        },
    }));
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    var _a;
    var options = params.options;
    var xAxis = options.xAxis, yAxis = options.yAxis, xField = options.xField, yField = options.yField;
    return (0, utils_1.flow)((0, common_1.scale)((_a = {},
        _a[xField] = xAxis,
        _a[yField] = yAxis,
        _a)))(params);
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
function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, colorField = options.colorField, sizeField = options.sizeField, sizeLegend = options.sizeLegend;
    /** legend 不为 false, 则展示图例, 优先展示 color 分类图例 */
    var showLegend = legend !== false;
    if (colorField) {
        chart.legend(colorField, showLegend ? legend : false);
    }
    // 旧版本: 有 sizeField 就有 sizeLegend. 这里默认继承下 legend 配置
    if (sizeField) {
        chart.legend(sizeField, sizeLegend === undefined ? legend : sizeLegend);
    }
    /** 默认没有 sizeField，则隐藏连续图例 */
    if (!showLegend && !sizeLegend) {
        chart.legend(false);
    }
    return params;
}
/**
 * fixme 后续确认下，数据标签的逻辑为啥和通用的不一致
 * 数据标签
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label, colorField = options.colorField, type = options.type;
    var geometry = (0, utils_1.findGeometry)(chart, type === 'density' ? 'heatmap' : 'polygon');
    if (!label) {
        geometry.label(false);
    }
    else if (colorField) {
        var callback = label.callback, cfg = tslib_1.__rest(label, ["callback"]);
        geometry.label({
            fields: [colorField],
            callback: callback,
            cfg: (0, utils_1.transformLabel)(cfg),
        });
    }
    return params;
}
/**
 * 极坐标
 * @param params
 */
function coordinate(params) {
    var _a, _b;
    var chart = params.chart, options = params.options;
    var coordinate = options.coordinate, reflect = options.reflect;
    var coordinateOption = (0, utils_1.deepAssign)({ actions: [] }, coordinate !== null && coordinate !== void 0 ? coordinate : { type: 'rect' });
    if (reflect) {
        (_b = (_a = coordinateOption.actions) === null || _a === void 0 ? void 0 : _a.push) === null || _b === void 0 ? void 0 : _b.call(_a, ['reflect', reflect]);
    }
    chart.coordinate(coordinateOption);
    return params;
}
/**
 * 热力图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(common_1.theme, (0, common_1.pattern)('heatmapStyle'), meta, coordinate, geometry, axis, legend, common_1.tooltip, label, (0, common_1.annotation)(), common_1.interaction, common_1.animation, common_1.state)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map