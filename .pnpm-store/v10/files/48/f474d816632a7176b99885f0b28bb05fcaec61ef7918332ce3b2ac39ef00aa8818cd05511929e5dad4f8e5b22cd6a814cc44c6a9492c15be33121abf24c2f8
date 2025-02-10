import { __assign } from "tslib";
import { each, get, isFunction, isNumber, isString } from '@antv/util';
import { kebabCase } from './kebab-case';
import { pick } from './pick';
/**
 * @desc 生成 html-statistic 的 style 字符串 (兼容 canvas 的 shapeStyle 到 css样式上)
 *
 * @param width
 * @param style
 */
export function adapteStyle(style) {
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
    if (get(style, 'fill')) {
        styleObject['color'] = style['fill'];
    }
    var _a = pick(style, shapeStyleKeys), shadowColor = _a.shadowColor, _b = _a.shadowBlur, shadowBlur = _b === void 0 ? 0 : _b, _c = _a.shadowOffsetX, shadowOffsetX = _c === void 0 ? 0 : _c, _d = _a.shadowOffsetY, shadowOffsetY = _d === void 0 ? 0 : _d;
    styleObject['text-shadow'] = "".concat([shadowColor, "".concat(shadowOffsetX, "px"), "".concat(shadowOffsetY, "px"), "".concat(shadowBlur, "px")].join(' '));
    var _e = pick(style, shapeStyleKeys), stroke = _e.stroke, _f = _e.lineWidth, lineWidth = _f === void 0 ? 0 : _f;
    styleObject['-webkit-text-stroke'] = "".concat(["".concat(lineWidth, "px"), stroke].join(' '));
    // 兼容 shapeStyle 设置 · end
    each(style, function (v, k) {
        //  兼容 shapeStyle 的 fontSize 没有单位
        if (['fontSize'].includes(k) && isNumber(v)) {
            styleObject[kebabCase(k)] = "".concat(v, "px");
        }
        else if (k && !shapeStyleKeys.includes(k)) {
            styleObject[kebabCase(k)] = "".concat(v);
        }
    });
    return styleObject;
}
/**
 * @desc 设置 html-statistic 容器的默认样式
 *
 * - 默认事件穿透
 */
export function setStatisticContainerStyle(container, style) {
    container.style['pointer-events'] = 'none';
    each(style, function (v, k) {
        if (k && v) {
            container.style[k] = v;
        }
    });
}
/**
 * 渲染环图 html-annotation（默认 position 居中 [50%, 50%]）
 * @param chart
 * @param options
 * @param meta 字段元信息
 * @param {optional} datum 当前的元数据
 */
export var renderStatistic = function (chart, options, datum) {
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
        var style = isFunction(option.style) ? option.style(datum) : option.style;
        chart.annotation().html(__assign({ position: ['50%', '50%'], html: function (container, view) {
                var coordinate = view.getCoordinate();
                var containerW = 0;
                if (plotType === 'pie' || plotType === 'ring-progress') {
                    containerW = coordinate.getRadius() * coordinate.innerRadius * 2;
                }
                else if (plotType === 'liquid') {
                    var liquidShape = get(view.geometries, [0, 'elements', 0, 'shape']);
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
                setStatisticContainerStyle(container, __assign({ width: "".concat(containerW, "px"), transform: transform }, adapteStyle(style)));
                var filteredData = view.getData();
                if (option.customHtml) {
                    return option.customHtml(container, view, datum, filteredData);
                }
                var text = option.content;
                if (option.formatter) {
                    text = option.formatter(datum, filteredData);
                }
                // todo G2 层修复可以返回空字符串 & G2 层修复允许返回非字符串的内容，比如数值 number
                return text ? (isString(text) ? text : "".concat(text)) : '<div></div>';
            }, 
            // @ts-ignore
            key: "".concat(idx === 0 ? 'top' : 'bottom', "-statistic") }, pick(option, ['offsetX', 'offsetY', 'rotate', 'style', 'formatter']) /** 透传配置 */));
    });
};
/**
 * 渲染 html-annotation for gauge (等不规则 plot), 默认 position 居中居底 [50%, 100%]）
 * @param chart
 * @param options
 * @param meta 字段元信息
 * @param {optional} datum 当前的元数据
 */
export var renderGaugeStatistic = function (chart, options, datum) {
    var statistic = options.statistic;
    var titleOpt = statistic.title, contentOpt = statistic.content;
    [titleOpt, contentOpt].forEach(function (option) {
        if (!option) {
            return;
        }
        var style = isFunction(option.style) ? option.style(datum) : option.style;
        chart.annotation().html(__assign({ position: ['50%', '100%'], html: function (container, view) {
                var coordinate = view.getCoordinate();
                // 弧形的坐标
                var polarCoord = view.views[0].getCoordinate();
                var polarCenter = polarCoord.getCenter();
                var polarRadius = polarCoord.getRadius();
                var polarMaxY = Math.max(Math.sin(polarCoord.startAngle), Math.sin(polarCoord.endAngle)) * polarRadius;
                var offsetY = polarCenter.y + polarMaxY - coordinate.y.start - parseFloat(get(style, 'fontSize', 0));
                var containerWidth = coordinate.getRadius() * coordinate.innerRadius * 2;
                setStatisticContainerStyle(container, __assign({ width: "".concat(containerWidth, "px"), transform: "translate(-50%, ".concat(offsetY, "px)") }, adapteStyle(style)));
                var filteredData = view.getData();
                if (option.customHtml) {
                    return option.customHtml(container, view, datum, filteredData);
                }
                var text = option.content;
                if (option.formatter) {
                    text = option.formatter(datum, filteredData);
                }
                // todo G2 层修复可以返回空字符串 & G2 层修复允许返回非字符串的内容，比如数值 number
                return text ? (isString(text) ? text : "".concat(text)) : '<div></div>';
            } }, pick(option, ['offsetX', 'offsetY', 'rotate', 'style', 'formatter']) /** 透传配置 */));
    });
};
//# sourceMappingURL=statistic.js.map