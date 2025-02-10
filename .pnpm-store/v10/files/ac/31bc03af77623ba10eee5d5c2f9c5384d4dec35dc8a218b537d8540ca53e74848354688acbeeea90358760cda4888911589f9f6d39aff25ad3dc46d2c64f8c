import { IElement } from '@antv/g-base';
import { each, isNil, getEllipsisText, pick } from '@antv/util';

import { ellipsisString, strLen } from './text';

const ELLIPSIS_CODE = '\u2026';
const ELLIPSIS_CODE_LENGTH = 2; // 省略号的长度

/** 大数据量阈值 */
const OPTIMIZE_THRESHOLD = 400;
/**
 * 针对大数据量做优化的 getMaxLabelWidth，做法不是直接去比较每一个 label 的最大宽度
 * 而是先通过比较每个 label 每个的字符串的长度，这里区分了下中英文字符
 * 最终是去字符串最“长”的那个 label 的宽度。
 * @param labels
 */
function getMaxLabelWidthOptimized(labels: IElement[]) {
  const texts: string[] = labels.map((label) => {
    const text = label.attr('text');
    return isNil(text) ? '' : `${text}`;
  });
  let maxLen = 0;
  let maxIdx = 0;

  for (let i = 0; i < texts.length; i += 1) {
    let len = 0;
    for (let j = 0; j <= texts[i].length; j += 1) {
      const code = texts[i].charCodeAt(j);
      if (code >= 19968 && code <= 40869) {
        len += 2;
      } else {
        len += 1;
      }
    }
    if (len > maxLen) {
      maxLen = len;
      maxIdx = i;
    }
  }

  return labels[maxIdx].getBBox().width;
}

/** 获取最长的 label */
export function getMaxLabelWidth(labels: IElement[]) {
  if (labels.length > OPTIMIZE_THRESHOLD) {
    return getMaxLabelWidthOptimized(labels);
  }

  let max = 0;
  each(labels, (label) => {
    const bbox = label.getBBox();
    const width = bbox.width;
    if (max < width) {
      max = width;
    }
  });
  return max;
}

/** 获取label长度 */
export function getLabelLength(isVertical: boolean, label) {
  const bbox = label.getCanvasBBox();
  return isVertical ? bbox.width : bbox.height;
}

/* label长度是否超过约束值 */
export function testLabel(label: IElement, limitLength: number): boolean {
  return label.getBBox().width < limitLength;
}

/** 处理 text shape 的自动省略 */
export function ellipsisLabel(isVertical: boolean, label: IElement, limitLength: number, position: string = 'tail') {
  const text = label.attr('text') ?? ''; // 避免出现null、undefined

  if (position === 'tail') {
    // component 里的缩略处理做得很糟糕，文字长度测算完全不准确
    // 这里暂时只对 tail 做处理
    const font = pick(label.attr(), ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'fontVariant']);
    const ellipsisText = getEllipsisText(text, limitLength, font, '…') as string;
    if (text !== ellipsisText) {
      label.attr('text', ellipsisText);
      label.set('tip', text);
      return true;
    }
    label.set('tip', null);
    return false;
  }

  const labelLength = getLabelLength(isVertical, label);
  const codeLength = strLen(text);
  let ellipsisFlag = false;
  if (limitLength < labelLength) {
    const reserveLength = Math.floor((limitLength / labelLength) * codeLength) - ELLIPSIS_CODE_LENGTH; // 计算出来的应该保存的长度
    let newText;
    if (reserveLength >= 0) {
      newText = ellipsisString(text, reserveLength, position);
    } else {
      newText = ELLIPSIS_CODE;
    }
    if (newText) {
      label.attr('text', newText);
      ellipsisFlag = true;
    }
  }
  if (ellipsisFlag) {
    label.set('tip', text);
  } else {
    label.set('tip', null);
  }
  return ellipsisFlag;
}
