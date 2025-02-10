import { __assign } from "tslib";
import { getTheme } from '@antv/g2';
import { each, find, isObject, map } from '@antv/util';
import { deepAssign } from '../utils';
import { conversionTagFormatter } from '../utils/conversion';
function getConversionTagOptionsWithDefaults(options, horizontal) {
    return deepAssign({
        size: horizontal ? 32 : 80,
        spacing: horizontal ? 8 : 12,
        offset: horizontal ? 32 : 0,
        arrow: options.arrow !== false && {
            headSize: 12,
            style: {
                fill: 'rgba(0, 0, 0, 0.05)',
            },
        },
        text: options.text !== false && {
            style: {
                fontSize: 12,
                fill: 'rgba(0, 0, 0, 0.85)',
                textAlign: 'center',
                textBaseline: 'middle',
            },
            formatter: conversionTagFormatter,
        },
    }, options);
}
function parsePoints(coordinate, element) {
    // @ts-ignore
    return map(element.getModel().points, function (point) { return coordinate.convertPoint(point); });
}
function renderArrowTag(config, elemPrev, elemNext) {
    var view = config.view, geometry = config.geometry, group = config.group, options = config.options, horizontal = config.horizontal;
    var offset = options.offset, size = options.size, arrow = options.arrow;
    var coordinate = view.getCoordinate();
    var pointPrev = parsePoints(coordinate, elemPrev)[3];
    var pointNext = parsePoints(coordinate, elemNext)[0];
    var totalHeight = pointNext.y - pointPrev.y;
    var totalWidth = pointNext.x - pointPrev.x;
    if (typeof arrow === 'boolean') {
        return;
    }
    var headSize = arrow.headSize;
    var spacing = options.spacing;
    var points;
    if (horizontal) {
        if ((totalWidth - headSize) / 2 < spacing) {
            // 当柱间距不足容纳箭头尖与间隔时，画三角并挤占间隔
            spacing = Math.max(1, (totalWidth - headSize) / 2);
            points = [
                [pointPrev.x + spacing, pointPrev.y - offset],
                [pointPrev.x + spacing, pointPrev.y - offset - size],
                [pointNext.x - spacing, pointNext.y - offset - size / 2],
            ];
        }
        else {
            // 当柱间距足够时，画完整图形并留出间隔。
            points = [
                [pointPrev.x + spacing, pointPrev.y - offset],
                [pointPrev.x + spacing, pointPrev.y - offset - size],
                [pointNext.x - spacing - headSize, pointNext.y - offset - size],
                [pointNext.x - spacing, pointNext.y - offset - size / 2],
                [pointNext.x - spacing - headSize, pointNext.y - offset],
            ];
        }
    }
    else {
        if ((totalHeight - headSize) / 2 < spacing) {
            // 当柱间距不足容纳箭头尖与间隔时，画三角并挤占间隔
            spacing = Math.max(1, (totalHeight - headSize) / 2);
            points = [
                [pointPrev.x + offset, pointPrev.y + spacing],
                [pointPrev.x + offset + size, pointPrev.y + spacing],
                [pointNext.x + offset + size / 2, pointNext.y - spacing],
            ];
        }
        else {
            // 当柱间距足够时，画完整图形并留出间隔。
            points = [
                [pointPrev.x + offset, pointPrev.y + spacing],
                [pointPrev.x + offset + size, pointPrev.y + spacing],
                [pointNext.x + offset + size, pointNext.y - spacing - headSize],
                [pointNext.x + offset + size / 2, pointNext.y - spacing],
                [pointNext.x + offset, pointNext.y - spacing - headSize],
            ];
        }
    }
    group.addShape('polygon', {
        id: "".concat(view.id, "-conversion-tag-arrow-").concat(geometry.getElementId(elemPrev.getModel().mappingData)),
        name: 'conversion-tag-arrow',
        origin: {
            element: elemPrev,
            nextElement: elemNext,
        },
        attrs: __assign(__assign({}, (arrow.style || {})), { points: points }),
    });
}
function renderTextTag(config, elemPrev, elemNext) {
    var _a, _b, _c;
    var view = config.view, geometry = config.geometry, group = config.group, options = config.options, field = config.field, horizontal = config.horizontal;
    var offset = options.offset, size = options.size;
    if (typeof options.text === 'boolean') {
        return;
    }
    var coordinate = view.getCoordinate();
    var text = ((_a = options.text) === null || _a === void 0 ? void 0 : _a.formatter) && ((_b = options.text) === null || _b === void 0 ? void 0 : _b.formatter(elemPrev.getData()[field], elemNext.getData()[field]));
    var pointPrev = parsePoints(coordinate, elemPrev)[horizontal ? 3 : 0];
    var pointNext = parsePoints(coordinate, elemNext)[horizontal ? 0 : 3];
    var textShape = group.addShape('text', {
        id: "".concat(view.id, "-conversion-tag-text-").concat(geometry.getElementId(elemPrev.getModel().mappingData)),
        name: 'conversion-tag-text',
        origin: {
            element: elemPrev,
            nextElement: elemNext,
        },
        attrs: __assign(__assign({}, (((_c = options.text) === null || _c === void 0 ? void 0 : _c.style) || {})), { text: text, x: horizontal ? (pointPrev.x + pointNext.x) / 2 : pointPrev.x + offset + size / 2, y: horizontal ? pointPrev.y - offset - size / 2 : (pointPrev.y + pointNext.y) / 2 }),
    });
    if (horizontal) {
        var totalWidth = pointNext.x - pointPrev.x;
        var textWidth = textShape.getBBox().width;
        if (textWidth > totalWidth) {
            var cWidth = textWidth / text.length;
            var cEnd = Math.max(1, Math.ceil(totalWidth / cWidth) - 1);
            var textAdjusted = "".concat(text.slice(0, cEnd), "...");
            textShape.attr('text', textAdjusted);
        }
    }
}
function renderTag(options, elemPrev, elemNext) {
    renderArrowTag(options, elemPrev, elemNext);
    renderTextTag(options, elemPrev, elemNext);
}
/**
 * 返回支持转化率组件的 adaptor，适用于柱形图/条形图
 * @param field 用户转化率计算的字段
 * @param horizontal 是否水平方向的转化率
 * @param disabled 是否禁用
 */
export function conversionTag(field, horizontal, disabled) {
    if (horizontal === void 0) { horizontal = true; }
    if (disabled === void 0) { disabled = false; }
    return function (params) {
        var options = params.options, chart = params.chart;
        var conversionTag = options.conversionTag, theme = options.theme;
        if (conversionTag && !disabled) {
            // 有转化率组件时，柱子宽度占比自动为 1/3
            chart.theme(deepAssign({}, isObject(theme) ? theme : getTheme(theme), {
                columnWidthRatio: 1 / 3,
            }));
            // 使用  shape annotation 绘制转化率组件
            chart.annotation().shape({
                render: function (container, view) {
                    var group = container.addGroup({
                        id: "".concat(chart.id, "-conversion-tag-group"),
                        name: 'conversion-tag-group',
                    });
                    var interval = find(chart.geometries, function (geom) { return geom.type === 'interval'; });
                    var config = {
                        view: view,
                        geometry: interval,
                        group: group,
                        field: field,
                        horizontal: horizontal,
                        options: getConversionTagOptionsWithDefaults(conversionTag, horizontal),
                    };
                    var elements = interval.elements;
                    each(elements, function (elem, idx) {
                        if (idx > 0) {
                            renderTag(config, elements[idx - 1], elem);
                        }
                    });
                },
            });
        }
        return params;
    };
}
//# sourceMappingURL=conversion-tag.js.map