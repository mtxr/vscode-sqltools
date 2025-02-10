"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderGaugeStatistic = exports.renderStatistic = exports.setStatisticContainerStyle = exports.adapteStyle = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var kebab_case_1 = require("./kebab-case");
var pick_1 = require("./pick");
/**
 * @desc 生成 html-statistic 的 style 字符串 (兼容 canvas 的 shapeStyle 到 css样式上)
 *
 * @param width
 * @param style
 */
function adapteStyle(style) {
    var styleObject = {
        overflow: 'hidden',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };
    var shapeStyleKeys = [
        'stroke',
        'lineWidth',
        'shadowColor',
        'strokeOpacity',
        'shadowBlur',
        'shadowOffsetX',
        'shadowOffsetY',
        'fill',
    ];
    // 兼容 shapeStyle 设置 · start
    if ((0, util_1.get)(style, 'fill')) {
        styleObject['color'] = style['fill'];
    }
    var _a = (0, pick_1.pick)(style, shapeStyleKeys), shadowColor = _a.shadowColor, _b = _a.shadowBlur, shadowBlur = _b === void 0 ? 0 : _b, _c = _a.shadowOffsetX, shadowOffsetX = _c === void 0 ? 0 : _c, _d = _a.shadowOffsetY, shadowOffsetY = _d === void 0 ? 0 : _d;
    styleObject['text-shadow'] = "".concat([shadowColor, "".concat(shadowOffsetX, "px"), "".concat(shadowOffsetY, "px"), "".concat(shadowBlur, "px")].join(' '));
    var _e = (0, pick_1.pick)(style, shapeStyleKeys), stroke = _e.stroke, _f = _e.lineWidth, lineWidth = _f === void 0 ? 0 : _f;
    styleObject['-webkit-text-stroke'] = "".concat(["".concat(lineWidth, "px"), stroke].join(' '));
    // 兼容 shapeStyle 设置 · end
    (0, util_1.each)(style, function (v, k) {
        //  兼容 shapeStyle 的 fontSize 没有单位
        if (['fontSize'].includes(k) && (0, util_1.isNumber)(v)) {
            styleObject[(0, kebab_case_1.kebabCase)(k)] = "".concat(v, "px");
        }
        else if (k && !shapeStyleKeys.includes(k)) {
            styleObject[(0, kebab_case_1.kebabCase)(k)] = "".concat(v);
        }
    });
    return styleObject;
}
exports.adapteStyle = adapteStyle;
/**
 * @desc 设置 html-statistic 容器的默认样式
 *
 * - 默认事件穿透
 */
function setStatisticContainerStyle(container, style) {
    container.style['pointer-events'] = 'none';
    (0, util_1.each)(style, function (v, k) {
        if (k && v) {
            container.style[k] = v;
        }
    });
}
exports.setStatisticContainerStyle = setStatisticContainerStyle;
/**
 * 渲染环图 html-annotation（默认 position 居中 [50%, 50%]）
 * @param chart
 * @param options
 * @param meta 字段元信息
 * @param {optional} datum 当前的元数据
 */
var renderStatistic = function (chart, options, datum) {
    var statistic = options.statistic, plotType = options.plotType;
    var titleOpt = statistic.title, contentOpt = statistic.content;
    [titleOpt, contentOpt].forEach(function (option, idx) {
        if (!option) {
            return;
        }
        var transform = '';
        if (idx === 0) {
            transform = contentOpt ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)';
        }
        else {
            transform = titleOpt ? 'translate(-50%, 0)' : 'translate(-50%, -50%)';
        }
        var style = (0, util_1.isFunction)(option.style) ? option.style(datum) : option.style;
        chart.annotation().html(tslib_1.__assign({ position: ['50%', '50%'], html: function (container, view) {
                var coordinate = view.getCoordinate();
                var containerW = 0;
                if (plotType === 'pie' || plotType === 'ring-progress') {
                    containerW = coordinate.getRadius() * coordinate.innerRadius * 2;
                }
                else if (plotType === 'liquid') {
                    var liquidShape = (0, util_1.get)(view.geometries, [0, 'elements', 0, 'shape']);
                    if (liquidShape) {
                        // 获取到水波图边框大小
                        var path = liquidShape.find(function (t) { return t.get('name') === 'wrap'; });
                        var width = path.getCanvasBBox().width;
                        containerW = width;
                    }
                }
                else if (!containerW) {
                    // 保底方案
                    containerW = coordinate.getWidth();
                }
                setStatisticContainerStyle(container, tslib_1.__assign({ width: "".concat(containerW, "px"), transform: transform }, adapteStyle(style)));
                var filteredData = view.getData();
                if (option.customHtml) {
                    return option.customHtml(container, view, datum, filteredData);
                }
                var text = option.content;
                if (option.formatter) {
                    text = option.formatter(datum, filteredData);
                }
                // todo G2 层修复可以返回空字符串 & G2 层修复允许返回非字符串的内容，比如数值 number
                return text ? ((0, util_1.isString)(text) ? text : "".concat(text)) : '<div></div>';
            }, 
            // @ts-ignore
            key: "".concat(idx === 0 ? 'top' : 'bottom', "-statistic") }, (0, pick_1.pick)(option, ['offsetX', 'offsetY', 'rotate', 'style', 'formatter']) /** 透传配置 */));
    });
};
exports.renderStatistic = renderStatistic;
/**
 * 渲染 html-annotation for gauge (等不规则 plot), 默认 position 居中居底 [50%, 100%]）
 * @param chart
 * @param options
 * @param meta 字段元信息
 * @param {optional} datum 当前的元数据
 */
var renderGaugeStatistic = function (chart, options, datum) {
    var statistic = options.statistic;
    var titleOpt = statistic.title, contentOpt = statistic.content;
    [titleOpt, contentOpt].forEach(function (option) {
        if (!option) {
            return;
        }
        var style = (0, util_1.isFunction)(option.style) ? option.style(datum) : option.style;
        chart.annotation().html(tslib_1.__assign({ position: ['50%', '100%'], html: function (container, view) {
                var coordinate = view.getCoordinate();
                // 弧形的坐标
                var polarCoord = view.views[0].getCoordinate();
                var polarCenter = polarCoord.getCenter();
                var polarRadius = polarCoord.getRadius();
                var polarMaxY = Math.max(Math.sin(polarCoord.startAngle), Math.sin(polarCoord.endAngle)) * polarRadius;
                var offsetY = polarCenter.y + polarMaxY - coordinate.y.start - parseFloat((0, util_1.get)(style, 'fontSize', 0));
                var containerWidth = coordinate.getRadius() * coordinate.innerRadius * 2;
                setStatisticContainerStyle(container, tslib_1.__assign({ width: "".concat(containerWidth, "px"), transform: "translate(-50%, ".concat(offsetY, "px)") }, adapteStyle(style)));
                var filteredData = view.getData();
                if (option.customHtml) {
                    return option.customHtml(container, view, datum, filteredData);
                }
                var text = option.content;
                if (option.formatter) {
                    text = option.formatter(datum, filteredData);
                }
                // todo G2 层修复可以返回空字符串 & G2 层修复允许返回非字符串的内容，比如数值 number
                return text ? ((0, util_1.isString)(text) ? text : "".concat(text)) : '<div></div>';
            } }, (0, pick_1.pick)(option, ['offsetX', 'offsetY', 'rotate', 'style', 'formatter']) /** 透传配置 */));
    });
};
exports.renderGaugeStatistic = renderGaugeStatistic;
//# sourceMappingURL=statistic.js.map