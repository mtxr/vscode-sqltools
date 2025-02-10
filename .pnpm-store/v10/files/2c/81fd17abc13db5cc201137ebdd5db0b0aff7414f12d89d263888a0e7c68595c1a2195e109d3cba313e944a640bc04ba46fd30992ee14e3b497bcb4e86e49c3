import { Util } from '@antv/g2';
import { get, isEmpty, isFunction, reduce } from '@antv/util';
import { deepAssign, findGeometry } from '../../../utils';
import { isLine } from './option';
/**
 * 获取 view 的 legendItem，供存在不含有 seriesField 的图形使用
 * @param params
 */
export function getViewLegendItems(params) {
    var view = params.view, geometryOption = params.geometryOption, yField = params.yField, legend = params.legend;
    var userMarker = get(legend, 'marker');
    var geometry = findGeometry(view, isLine(geometryOption) ? 'line' : 'interval');
    if (!geometryOption.seriesField) {
        var legendItemName = get(view, "options.scales.".concat(yField, ".alias")) || yField;
        // 返回 g2 设置的图例
        var colorAttribute = geometry.getAttribute('color');
        var color = view.getTheme().defaultColor;
        if (colorAttribute) {
            color = Util.getMappingValue(colorAttribute, legendItemName, get(colorAttribute, ['values', 0], color));
        }
        var marker = (isFunction(userMarker)
            ? userMarker
            : !isEmpty(userMarker) &&
                deepAssign({}, {
                    style: {
                        stroke: color,
                        fill: color,
                    },
                }, userMarker)) ||
            (isLine(geometryOption)
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
    return reduce(attributes, function (items, attr) {
        var attrItems = Util.getLegendItems(view, geometry, attr, view.getTheme(), userMarker);
        return items.concat(attrItems);
    }, []);
}
//# sourceMappingURL=legend.js.map