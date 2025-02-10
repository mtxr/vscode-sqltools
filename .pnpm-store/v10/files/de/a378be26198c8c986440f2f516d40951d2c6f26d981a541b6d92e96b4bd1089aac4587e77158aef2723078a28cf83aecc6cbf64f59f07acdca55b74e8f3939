import { SimpleBBox } from '../types';
import { IShape } from '../interfaces';
import { getTextWidth, getTextHeight, assembleFont } from '../util/text';

export default function (shape: IShape): SimpleBBox {
  const attrs = shape.attr();
  const { x, y, text, fontSize, lineHeight } = attrs;
  let font = attrs.font;
  if (!font) {
    // 如果未组装 font
    font = assembleFont(attrs);
  }
  const width = getTextWidth(text, font);
  let bbox;
  if (!width) {
    // 如果width不存在，四点共其实点
    bbox = {
      x,
      y,
      width: 0,
      height: 0,
    };
  } else {
    const { textAlign, textBaseline } = attrs;
    const height = getTextHeight(text, fontSize, lineHeight); // attrs.height
    // 默认左右对齐：left, 默认上下对齐 bottom
    const point = {
      x,
      y: y - height,
    };
    if (textAlign) {
      if (textAlign === 'end' || textAlign === 'right') {
        point.x -= width;
      } else if (textAlign === 'center') {
        point.x -= width / 2;
      }
    }
    if (textBaseline) {
      if (textBaseline === 'top') {
        point.y += height;
      } else if (textBaseline === 'middle') {
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
