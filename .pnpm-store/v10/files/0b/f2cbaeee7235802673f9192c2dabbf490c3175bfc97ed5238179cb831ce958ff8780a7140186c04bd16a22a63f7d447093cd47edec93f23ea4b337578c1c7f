import { getTextWidth, getTextHeight, assembleFont } from '../util/text';
export default function (shape) {
    var attrs = shape.attr();
    var x = attrs.x, y = attrs.y, text = attrs.text, fontSize = attrs.fontSize, lineHeight = attrs.lineHeight;
    var font = attrs.font;
    if (!font) {
        // 如果未组装 font
        font = assembleFont(attrs);
    }
    var width = getTextWidth(text, font);
    var bbox;
    if (!width) {
        // 如果width不存在，四点共其实点
        bbox = {
            x: x,
            y: y,
            width: 0,
            height: 0,
        };
    }
    else {
        var textAlign = attrs.textAlign, textBaseline = attrs.textBaseline;
        var height = getTextHeight(text, fontSize, lineHeight); // attrs.height
        // 默认左右对齐：left, 默认上下对齐 bottom
        var point = {
            x: x,
            y: y - height,
        };
        if (textAlign) {
            if (textAlign === 'end' || textAlign === 'right') {
                point.x -= width;
            }
            else if (textAlign === 'center') {
                point.x -= width / 2;
            }
        }
        if (textBaseline) {
            if (textBaseline === 'top') {
                point.y += height;
            }
            else if (textBaseline === 'middle') {
                point.y += height / 2;
            }
        }
        bbox = {
            x: point.x,
            y: point.y,
            width: width,
            height: height,
        };
    }
    return bbox;
}
//# sourceMappingURL=text.js.map