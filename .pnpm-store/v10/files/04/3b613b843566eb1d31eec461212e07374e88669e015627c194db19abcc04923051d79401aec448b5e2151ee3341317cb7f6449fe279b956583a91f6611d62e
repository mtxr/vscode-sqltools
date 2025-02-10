import { __assign, __spreadArray } from "tslib";
import { Util } from '@antv/g2';
import { get } from '@antv/util';
import { deepAssign } from '../utils';
import { getCanvasPattern } from '../utils/pattern';
/**
 * Pattern 通道，处理图案填充
 * 🚀 目前支持图表类型：饼图、柱状图、条形图、玉珏图等（不支持在多 view 图表中，后续按需扩展）
 *
 * @param key key of style property
 * @returns
 */
export function pattern(key) {
    var _this = this;
    return function (params) {
        var _a;
        var options = params.options, chart = params.chart;
        var patternOption = options.pattern;
        // 没有 pattern 配置，则直接返回
        if (!patternOption) {
            return params;
        }
        /** ~~~~~~~ 进行贴图图案处理 ~~~~~~~ */
        var style = function (datum) {
            var _a, _b, _c;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var defaultColor = chart.getTheme().defaultColor;
            var color = defaultColor;
            var colorAttribute = (_b = (_a = chart.geometries) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.getAttribute('color');
            if (colorAttribute) {
                var colorField = colorAttribute.getFields()[0];
                var seriesValue = get(datum, colorField);
                color = Util.getMappingValue(colorAttribute, seriesValue, ((_c = colorAttribute.values) === null || _c === void 0 ? void 0 : _c[0]) || defaultColor);
            }
            var pattern = patternOption;
            // 1. 如果 patternOption 是一个回调，则获取回调结果。`(datum: Datum, color: string) => CanvasPattern`
            if (typeof patternOption === 'function') {
                pattern = patternOption.call(_this, datum, color);
            }
            // 2. 如果 pattern 不是 CanvasPattern，则进一步处理，否则直接赋予给 fill
            if (pattern instanceof CanvasPattern === false) {
                // 通过 createPattern(PatternStyle) 转换为 CanvasPattern
                pattern = getCanvasPattern(deepAssign({}, { cfg: { backgroundColor: color } }, pattern));
            }
            var styleOption = options[key];
            return __assign(__assign({}, (typeof styleOption === 'function' ? styleOption.call.apply(styleOption, __spreadArray([_this, datum], args, false)) : styleOption || {})), { fill: pattern || color });
        };
        return deepAssign({}, params, { options: (_a = {}, _a[key] = style, _a) });
    };
}
//# sourceMappingURL=pattern.js.map