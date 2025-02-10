"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversionTagComponent = exports.transformData = exports.CONVERSION_TAG_NAME = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
exports.CONVERSION_TAG_NAME = 'CONVERSION_TAG_NAME';
/**
 * 漏斗图 transform
 * @param geometry
 */
function transformData(data, originData, options) {
    var formatData = [];
    var yField = options.yField, maxSize = options.maxSize, minSize = options.minSize;
    var maxYFieldValue = (0, util_1.get)((0, util_1.maxBy)(originData, yField), [yField]);
    var max = (0, util_1.isNumber)(maxSize) ? maxSize : 1;
    var min = (0, util_1.isNumber)(minSize) ? minSize : 0;
    // format 数据
    formatData = (0, util_1.map)(data, function (row, index) {
        var percent = (row[yField] || 0) / maxYFieldValue;
        row[constant_1.FUNNEL_PERCENT] = percent;
        row[constant_1.FUNNEL_MAPPING_VALUE] = (max - min) * percent + min;
        // 转化率数据存储前后数据
        row[constant_1.FUNNEL_CONVERSATION] = [(0, util_1.get)(data, [index - 1, yField]), row[yField]];
        return row;
    });
    return formatData;
}
exports.transformData = transformData;
/**
 * 漏斗图通用转化率组件
 * @param getLineCoordinate 用于获取特定的 line 的位置及配置
 */
function conversionTagComponent(getLineCoordinate) {
    return function (params) {
        var chart = params.chart, options = params.options;
        // @ts-ignore
        var conversionTag = options.conversionTag, filteredData = options.filteredData;
        var data = filteredData || chart.getOptions().data;
        if (conversionTag) {
            var formatter_1 = conversionTag.formatter;
            data.forEach(function (obj, index) {
                if (index <= 0 || Number.isNaN(obj[constant_1.FUNNEL_MAPPING_VALUE]))
                    return;
                var lineOption = getLineCoordinate(obj, index, data, {
                    top: true,
                    name: exports.CONVERSION_TAG_NAME,
                    text: {
                        content: (0, util_1.isFunction)(formatter_1) ? formatter_1(obj, data) : formatter_1,
                        offsetX: conversionTag.offsetX,
                        offsetY: conversionTag.offsetY,
                        position: 'end',
                        autoRotate: false,
                        style: tslib_1.__assign({ textAlign: 'start', textBaseline: 'middle' }, conversionTag.style),
                    },
                });
                chart.annotation().line(lineOption);
            });
        }
        return params;
    };
}
exports.conversionTagComponent = conversionTagComponent;
//# sourceMappingURL=common.js.map