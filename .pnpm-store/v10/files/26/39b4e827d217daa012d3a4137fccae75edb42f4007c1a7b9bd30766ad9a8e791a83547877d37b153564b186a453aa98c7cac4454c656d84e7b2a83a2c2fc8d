import { isNil, each, isString } from './util';
import { getOffScreenContext } from './offscreen';
import { ShapeAttrs } from '../types';

/**
 * 获取文本的高度
 * @param text 文本
 * @param fontSize 字体大小
 * @param lineHeight 行高，可以为空
 */
export function getTextHeight(text: string, fontSize: number, lineHeight?: number): number {
  let lineCount = 1;
  if (isString(text)) {
    lineCount = text.split('\n').length;
  }
  if (lineCount > 1) {
    const spaceingY = getLineSpaceing(fontSize, lineHeight);
    return fontSize * lineCount + spaceingY * (lineCount - 1);
  }
  return fontSize;
}

/**
 * 获取行间距如果文本多行，需要获取文本间距
 * @param fontSize 字体大小
 * @param lineHeight 行高
 */
export function getLineSpaceing(fontSize: number, lineHeight?: number): number {
  return lineHeight ? lineHeight - fontSize : fontSize * 0.14;
}

/**
 * 字体宽度
 * @param text 文本
 * @param font 字体
 */
export function getTextWidth(text: string, font: string) {
  const context = getOffScreenContext(); // 获取离屏的 ctx 进行计算
  let width = 0;
  // null 或者 undefined 时，宽度为 0
  if (isNil(text) || text === '') {
    return width;
  }
  context.save();
  context.font = font;
  if (isString(text) && text.includes('\n')) {
    const textArr = text.split('\n');
    each(textArr, (subText) => {
      const measureWidth = context.measureText(subText).width;
      if (width < measureWidth) {
        width = measureWidth;
      }
    });
  } else {
    width = context.measureText(text).width;
  }
  context.restore();
  return width;
}

export function assembleFont(attrs: ShapeAttrs) {
  const { fontSize, fontFamily, fontWeight, fontStyle, fontVariant } = attrs;
  return [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ').trim();
}
