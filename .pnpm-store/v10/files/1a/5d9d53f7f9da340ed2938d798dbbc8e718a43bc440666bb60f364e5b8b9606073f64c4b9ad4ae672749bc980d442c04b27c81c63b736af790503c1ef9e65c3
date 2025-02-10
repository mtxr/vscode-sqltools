import { BBox } from '../../../util/bbox';
import { isContrastColorWhite } from '../../../util/color';
export function adjustColor(items, labels, shapes) {
    if (shapes.length === 0) {
        return;
    }
    var element = shapes[0].get('element');
    var theme = element.geometry.theme;
    var _a = theme.labels || {}, fillColorLight = _a.fillColorLight, fillColorDark = _a.fillColorDark;
    shapes.forEach(function (shape, index) {
        var label = labels[index];
        var textShape = label.find(function (el) { return el.get('type') === 'text'; });
        var shapeBBox = BBox.fromObject(shape.getBBox());
        var textBBox = BBox.fromObject(textShape.getCanvasBBox());
        var overflow = !shapeBBox.contains(textBBox);
        var bgColor = shape.attr('fill');
        var fillWhite = isContrastColorWhite(bgColor);
        if (!overflow) {
            if (fillWhite) {
                if (fillColorLight) {
                    textShape.attr('fill', fillColorLight);
                }
            }
            else {
                if (fillColorDark) {
                    textShape.attr('fill', fillColorDark);
                }
            }
        }
        else {
            // 出现溢出直接应用 overflowLabel 样式
            textShape.attr(theme.overflowLabels.style);
        }
    });
}
//# sourceMappingURL=adjust-color.js.map