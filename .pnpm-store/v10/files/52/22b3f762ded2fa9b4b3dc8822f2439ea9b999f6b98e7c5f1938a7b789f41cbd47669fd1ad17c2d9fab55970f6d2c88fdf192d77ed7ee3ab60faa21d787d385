import { IGroup } from '@antv/g-base';
import { get } from '@antv/util';

import { EnhancedTextCfg } from '../types';
import { ellipsisLabel } from './label';
import { applyRotate, applyTranslate } from './matrix';
import { formatPadding } from './util';

export interface TagCfg extends EnhancedTextCfg {
  /** 组件的 id 标识 */
  id?: string;
  /** 组件的名字 */
  name?: string;
  /**
   * 文本标注位置 x
   */
  x: number;
  /**
   * 文本标注位置 y
   */
  y: number;
}

export function renderTag(container: IGroup, tagCfg: TagCfg) {
  const { x, y, content, style, id, name, rotate, maxLength, autoEllipsis, isVertical, ellipsisPosition, background } = tagCfg;
  const tagGroup = container.addGroup({
    id: `${id}-group`,
    name: `${name}-group`,
    attrs: {
      x,
      y,
    }
  });

  // Text shape
  const text = tagGroup.addShape({
    type: 'text',
    id,
    name,
    attrs: {
      x: 0,
      y: 0,
      text: content,
      ...style,
    },
  });

  // maxLength 应包含 background 中的 padding 值
  const padding = formatPadding(get(background, 'padding', 0));
  if (maxLength && autoEllipsis) {
    const maxTextLength = maxLength - (padding[1] + padding[3]);
    // 超出自动省略
    ellipsisLabel(!isVertical, text, maxTextLength, ellipsisPosition);
  }

  if (background) {
    // 渲染文本背景
    const backgroundStyle = get(background, 'style', {});
    const { minX, minY, width, height } = text.getCanvasBBox();
    const tagBg = tagGroup.addShape('rect', {
      id: `${id}-bg`,
      name: `${id}-bg`,
      attrs: {
        x: minX - padding[3],
        y: minY - padding[0],
        width: width + padding[1] + padding[3],
        height: height + padding[0] + padding[2],
        ...backgroundStyle,
      },
    });
    tagBg.toBack();
  }

  applyTranslate(tagGroup, x, y);
  applyRotate(tagGroup, rotate, x, y);
}
