"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViewLegendItems = void 0;
var g2_1 = require("@antv/g2");
var util_1 = require("@antv/util");
var utils_1 = require("../../../utils");
var option_1 = require("./option");
/**
 * 获取 view 的 legendItem，供存在不含有 seriesField 的图形使用
 * @param params
 */
function getViewLegendItems(params) {
    var view = params.view, geometryOption = params.geometryOption, yField = params.yField, legend = params.legend;
    var userMarker = (0, util_1.get)(legend, 'marker');
    var geometry = (0, utils_1.findGeometry)(view, (0, option_1.isLine)(geometryOption) ? 'line' : 'interval');
    if (!geometryOption.seriesField) {
        var legendItemName = (0, util_1.get)(view, "options.scales.".concat(yField, ".alias")) || yField;
        // 返回 g2 设置的图例
        var colorAttribute = geometry.getAttribute('color');
        var color = view.getTheme().defaultColor;
        if (colorAttribute) {
            color = g2_1.Util.getMappingValue(colorAttribute, legendItemName, (0, util_1.get)(colorAttribute, ['values', 0], color));
        }
        var marker = ((0, util_1.isFunction)(userMarker)
            ? userMarker
            : !(0, util_1.isEmpty)(userMarker) &&
                (0, utils_1.deepAssign)({}, {
                    style: {
                        stroke: color,
                        fill: color,
                    },
                }, userMarker)) ||
            ((0, option_1.isLine)(geometryOption)
                ? {
                    symbol: function (x, y, r) {
                        return [
                            ['M', x - r, y],
                            ['L', x + r, y],
                        ];
                    },
                    style: {
                        lineWidth: 2,
                        r: 6,
                        stroke: color,
                    },
                }
                : {
                    symbol: 'square',
                    style: {
                        fill: color,
                    },
                });
        return [
            {
                value: yField,
                name: legendItemName,
                marker: marker,
                isGeometry: true,
                viewId: view.id,
            },
        ];
    }
    var attributes = geometry.getGroupAttributes();
    return (0, util_1.reduce)(attributes, function (items, attr) {
        var attrItems = g2_1.Util.getLegendItems(view, geometry, attr, view.getTheme(), userMarker);
        return items.concat(attrItems);
    }, []);
}
exports.getViewLegendItems = getViewLegendItems;
//# sourceMappingURL=legend.js.map