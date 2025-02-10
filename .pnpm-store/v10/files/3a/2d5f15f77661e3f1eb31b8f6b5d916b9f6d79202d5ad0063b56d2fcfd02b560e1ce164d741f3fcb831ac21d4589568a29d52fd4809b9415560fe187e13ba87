import { __assign } from "tslib";
import { deepMix, isString, each, get, isFunction } from '@antv/util';
import { DIRECTION } from '../constant';
import { getMappingValue } from './attr';
import { omit } from './helper';
import { MarkerSymbols } from './marker';
/** 线条形 marker symbol */
var STROKES_SYMBOLS = ['line', 'cross', 'tick', 'plus', 'hyphen'];
/**
 * 处理用户配置的 marker style
 * @param markerStyle
 * @param userMarker.style
 * @returns {ShapeAttrs} newStyle
 */
function handleUserMarkerStyle(markerStyle, style) {
    if (isFunction(style)) {
        return style(markerStyle);
    }
    return deepMix({}, markerStyle, style);
}
/**
 * 根据 marker 是否为线条形 symbol, 来调整下样式
 * @param symbol
 * @param style
 * @param color
 */
function adpatorMarkerStyle(marker, color) {
    var symbol = marker.symbol;
    if (isString(symbol) && STROKES_SYMBOLS.indexOf(symbol) !== -1) {
        var markerStyle = get(marker, 'style', {});
        var lineWidth = get(markerStyle, 'lineWidth', 1);
        var stroke = markerStyle.stroke || markerStyle.fill || color;
        marker.style = deepMix({}, marker.style, { lineWidth: lineWidth, stroke: stroke, fill: null });
    }
}
/**
 * 设置 marker 的 symbol，将 字符串的 symbol 转换为真正的绘制命令
 * @param marker
 */
function setMarkerSymbol(marker) {
    var symbol = marker.symbol;
    if (isString(symbol) && MarkerSymbols[symbol]) {
        marker.symbol = MarkerSymbols[symbol];
    }
}
/**
 * @ignore
 * get the legend layout from direction
 * @param direction
 * @returns layout 'horizontal' | 'vertical'
 */
export function getLegendLayout(direction) {
    return direction.startsWith(DIRECTION.LEFT) || direction.startsWith(DIRECTION.RIGHT) ? 'vertical' : 'horizontal';
}
/**
 * @ignore
 * get the legend items
 * @param view
 * @param geometry
 * @param attr
 * @param themeMarker
 * @param markerCfg
 * @returns legend items
 */
export function getLegendItems(view, geometry, attr, themeMarker, userMarker) {
    var scale = attr.getScale(attr.type);
    if (scale.isCategory) {
        var field_1 = scale.field;
        var colorAttr_1 = geometry.getAttribute('color');
        var shapeAttr_1 = geometry.getAttribute('shape');
        var defaultColor_1 = view.getTheme().defaultColor;
        var isInPolar_1 = geometry.coordinate.isPolar;
        return scale.getTicks().map(function (tick, index) {
            var _a;
            var text = tick.text, scaleValue = tick.value;
            var name = text;
            var value = scale.invert(scaleValue);
            // 通过过滤图例项的数据，来看是否 unchecked
            var unchecked = view.filterFieldData(field_1, [(_a = {}, _a[field_1] = value, _a)]).length === 0;
            each(view.views, function (subView) {
                var _a;
                if (!subView.filterFieldData(field_1, [(_a = {}, _a[field_1] = value, _a)]).length) {
                    unchecked = true;
                }
            });
            // @ts-ignore
            var color = getMappingValue(colorAttr_1, value, defaultColor_1);
            var shape = getMappingValue(shapeAttr_1, value, 'point');
            var marker = geometry.getShapeMarker(shape, {
                color: color,
                isInPolar: isInPolar_1,
            });
            var markerCfg = userMarker;
            if (isFunction(markerCfg)) {
                markerCfg = markerCfg(name, index, __assign({ name: name, value: value }, deepMix({}, themeMarker, marker)));
            }
            // the marker configure order should be ensure
            marker = deepMix({}, themeMarker, marker, omit(__assign({}, markerCfg), ['style']));
            adpatorMarkerStyle(marker, color);
            if (markerCfg && markerCfg.style) {
                // handle user's style settings
                marker.style = handleUserMarkerStyle(marker.style, markerCfg.style);
            }
            setMarkerSymbol(marker);
            return { id: value, name: name, value: value, marker: marker, unchecked: unchecked };
        });
    }
    return [];
}
/**
 *
 * @ignore
 * custom legend 的 items 获取
 * @param themeMarker
 * @param userMarker
 * @param customItems
 */
export function getCustomLegendItems(themeMarker, userMarker, customItems) {
    // 如果有自定义的 item，那么就直接使用，并合并主题的 marker 配置
    return customItems.map(function (item, index) {
        var markerCfg = userMarker;
        if (isFunction(markerCfg)) {
            markerCfg = markerCfg(item.name, index, deepMix({}, themeMarker, item));
        }
        var itemMarker = isFunction(item.marker)
            ? item.marker(item.name, index, deepMix({}, themeMarker, item))
            : item.marker;
        var marker = deepMix({}, themeMarker, markerCfg, itemMarker);
        setMarkerSymbol(marker);
        item.marker = marker;
        return item;
    });
}
/**
 * get the legend cfg from theme, will mix the common cfg of legend theme
 *
 * @param theme view theme object
 * @param direction legend direction
 * @returns legend theme cfg
 */
export function getLegendThemeCfg(theme, direction) {
    var legendTheme = get(theme, ['components', 'legend'], {});
    return deepMix({}, get(legendTheme, ['common'], {}), deepMix({}, get(legendTheme, [direction], {})));
}
//# sourceMappingURL=legend.js.map