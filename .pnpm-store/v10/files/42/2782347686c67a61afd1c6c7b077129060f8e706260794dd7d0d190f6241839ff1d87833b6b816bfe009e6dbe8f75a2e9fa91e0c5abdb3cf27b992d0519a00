"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBackgroundRectStyle = exports.getStyle = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
/**
 * @ignore
 * 获取 Shape 的图形属性
 * @param cfg
 * @param isStroke 是否需要描边
 * @param isFill 是否需要填充
 * @param [sizeName] 可选，表示图形大小的属性，lineWidth 或者 r
 * @returns
 */
function getStyle(cfg, isStroke, isFill, sizeName) {
    if (sizeName === void 0) { sizeName = ''; }
    var _a = cfg.style, style = _a === void 0 ? {} : _a, defaultStyle = cfg.defaultStyle, color = cfg.color, size = cfg.size;
    var attrs = tslib_1.__assign(tslib_1.__assign({}, defaultStyle), style);
    if (color) {
        if (isStroke) {
            if (!style.stroke) {
                // 如果用户在 style() 中配置了 stroke，则以用户配置的为准
                attrs.stroke = color;
            }
        }
        if (isFill) {
            if (!style.fill) {
                // 如果用户在 style() 中配置了 fill
                attrs.fill = color;
            }
        }
    }
    if (sizeName && (0, util_1.isNil)(style[sizeName]) && !(0, util_1.isNil)(size)) {
        // 如果用户在 style() 中配置了 lineWidth 或者 r 属性
        attrs[sizeName] = size;
    }
    return attrs;
}
exports.getStyle = getStyle;
/**
 * 获取 矩形背景 的样式
 * @param cfg
 */
function getBackgroundRectStyle(cfg) {
    return (0, util_1.deepMix)({}, {
        // 默认背景色，copy from active-region
        fill: '#CCD6EC',
        fillOpacity: 0.3,
    }, (0, util_1.get)(cfg, ['background', 'style']));
}
exports.getBackgroundRectStyle = getBackgroundRectStyle;
//# sourceMappingURL=get-style.js.map