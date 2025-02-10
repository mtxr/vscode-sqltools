"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLegendThemeCfg = exports.getCustomLegendItems = exports.getLegendItems = exports.getLegendLayout = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var attr_1 = require("./attr");
var helper_1 = require("./helper");
var marker_1 = require("./marker");
/** 线条形 marker symbol */
var STROKES_SYMBOLS = ['line', 'cross', 'tick', 'plus', 'hyphen'];
/**
 * 处理用户配置的 marker style
 * @param markerStyle
 * @param userMarker.style
 * @returns {ShapeAttrs} newStyle
 */
function handleUserMarkerStyle(markerStyle, style) {
    if ((0, util_1.isFunction)(style)) {
        return style(markerStyle);
    }
    return (0, util_1.deepMix)({}, markerStyle, style);
}
/**
 * 根据 marker 是否为线条形 symbol, 来调整下样式
 * @param symbol
 * @param style
 * @param color
 */
function adpatorMarkerStyle(marker, color) {
    var symbol = marker.symbol;
    if ((0, util_1.isString)(symbol) && STROKES_SYMBOLS.indexOf(symbol) !== -1) {
        var markerStyle = (0, util_1.get)(marker, 'style', {});
        var lineWidth = (0, util_1.get)(markerStyle, 'lineWidth', 1);
        var stroke = markerStyle.stroke || markerStyle.fill || color;
        marker.style = (0, util_1.deepMix)({}, marker.style, { lineWidth: lineWidth, stroke: stroke, fill: null });
    }
}
/**
 * 设置 marker 的 symbol，将 字符串的 symbol 转换为真正的绘制命令
 * @param marker
 */
function setMarkerSymbol(marker) {
    var symbol = marker.symbol;
    if ((0, util_1.isString)(symbol) && marker_1.MarkerSymbols[symbol]) {
        marker.symbol = marker_1.MarkerSymbols[symbol];
    }
}
/**
 * @ignore
 * get the legend layout from direction
 * @param direction
 * @returns layout 'horizontal' | 'vertical'
 */
function getLegendLayout(direction) {
    return direction.startsWith(constant_1.DIRECTION.LEFT) || direction.startsWith(constant_1.DIRECTION.RIGHT) ? 'vertical' : 'horizontal';
}
exports.getLegendLayout = getLegendLayout;
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
function getLegendItems(view, geometry, attr, themeMarker, userMarker) {
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
            (0, util_1.each)(view.views, function (subView) {
                var _a;
                if (!subView.filterFieldData(field_1, [(_a = {}, _a[field_1] = value, _a)]).length) {
                    unchecked = true;
                }
            });
            // @ts-ignore
            var color = (0, attr_1.getMappingValue)(colorAttr_1, value, defaultColor_1);
            var shape = (0, attr_1.getMappingValue)(shapeAttr_1, value, 'point');
            var marker = geometry.getShapeMarker(shape, {
                color: color,
                isInPolar: isInPolar_1,
            });
            var markerCfg = userMarker;
            if ((0, util_1.isFunction)(markerCfg)) {
                markerCfg = markerCfg(name, index, tslib_1.__assign({ name: name, value: value }, (0, util_1.deepMix)({}, themeMarker, marker)));
            }
            // the marker configure order should be ensure
            marker = (0, util_1.deepMix)({}, themeMarker, marker, (0, helper_1.omit)(tslib_1.__assign({}, markerCfg), ['style']));
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
exports.getLegendItems = getLegendItems;
/**
 *
 * @ignore
 * custom legend 的 items 获取
 * @param themeMarker
 * @param userMarker
 * @param customItems
 */
function getCustomLegendItems(themeMarker, userMarker, customItems) {
    // 如果有自定义的 item，那么就直接使用，并合并主题的 marker 配置
    return customItems.map(function (item, index) {
        var markerCfg = userMarker;
        if ((0, util_1.isFunction)(markerCfg)) {
            markerCfg = markerCfg(item.name, index, (0, util_1.deepMix)({}, themeMarker, item));
        }
        var itemMarker = (0, util_1.isFunction)(item.marker)
            ? item.marker(item.name, index, (0, util_1.deepMix)({}, themeMarker, item))
            : item.marker;
        var marker = (0, util_1.deepMix)({}, themeMarker, markerCfg, itemMarker);
        setMarkerSymbol(marker);
        item.marker = marker;
        return item;
    });
}
exports.getCustomLegendItems = getCustomLegendItems;
/**
 * get the legend cfg from theme, will mix the common cfg of legend theme
 *
 * @param theme view theme object
 * @param direction legend direction
 * @returns legend theme cfg
 */
function getLegendThemeCfg(theme, direction) {
    var legendTheme = (0, util_1.get)(theme, ['components', 'legend'], {});
    return (0, util_1.deepMix)({}, (0, util_1.get)(legendTheme, ['common'], {}), (0, util_1.deepMix)({}, (0, util_1.get)(legendTheme, [direction], {})));
}
exports.getLegendThemeCfg = getLegendThemeCfg;
//# sourceMappingURL=legend.js.map