/**
 * @fileoverview 文本
 * @author dxq613@gmail.com
 */

import ShapeBase from './base';
import { isNil, isString, each } from '../util/util';
import { getTextHeight, assembleFont } from '@antv/g-base';
class Text extends ShapeBase {
  // 默认文本属性
  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    return {
      ...attrs,
      x: 0,
      y: 0,
      text: null,
      fontSize: 12,
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontVariant: 'normal',
      textAlign: 'start',
      textBaseline: 'bottom',
    };
  }

  // 仅仅使用包围盒检测来进行拾取
  isOnlyHitBox() {
    return true;
  }

  // 初始化时组合 font，同时判断 text 是否换行
  initAttrs(attrs) {
    this._assembleFont();
    if (attrs.text) {
      this._setText(attrs.text);
    }
  }
  // 组装字体
  _assembleFont() {
    const attrs = this.attrs;
    attrs.font = assembleFont(attrs);
  }

  // 如果文本换行，则缓存数组
  _setText(text) {
    let textArr = null;
    if (isString(text) && text.indexOf('\n') !== -1) {
      textArr = text.split('\n');
    }
    this.set('textArr', textArr);
  }

  // 更新属性时，检测是否更改了 font、text
  onAttrChange(name: string, value: any, originValue: any) {
    super.onAttrChange(name, value, originValue);
    if (name.startsWith('font')) {
      this._assembleFont();
    }
    if (name === 'text') {
      this._setText(value);
    }
  }

  // 这个方法在 text 时没有可以做的事情，如果要支持文字背景时可以考虑
  // createPath(context) {

  // }

  // 如果文本多行，需要获取文本间距
  _getSpaceingY() {
    const attrs = this.attrs;
    const lineHeight = attrs.lineHeight;
    const fontSize = attrs.fontSize * 1;
    return lineHeight ? lineHeight - fontSize : fontSize * 0.14;
  }

  // 绘制文本，考虑多行的场景
  _drawTextArr(context, textArr, isFill) {
    const attrs = this.attrs;
    const textBaseline = attrs.textBaseline;
    const x = attrs.x;
    const y = attrs.y;
    const fontSize = attrs.fontSize * 1;
    const spaceingY = this._getSpaceingY();
    const height = getTextHeight(attrs.text, attrs.fontSize, attrs.lineHeight);
    let subY;
    each(textArr, (subText, index: number) => {
      subY = y + index * (spaceingY + fontSize) - height + fontSize; // bottom;
      if (textBaseline === 'middle') subY += height - fontSize - (height - fontSize) / 2;
      if (textBaseline === 'top') subY += height - fontSize;
      if (!isNil(subText)) {
        if (isFill) {
          context.fillText(subText, x, subY);
        } else {
          context.strokeText(subText, x, subY);
        }
      }
    });
  }

  // 绘制文本，同时考虑填充和绘制边框
  _drawText(context, isFill) {
    const attrs = this.attr();
    const x = attrs.x;
    const y = attrs.y;
    const textArr = this.get('textArr');
    if (textArr) {
      this._drawTextArr(context, textArr, isFill);
    } else {
      const text = attrs.text;
      if (!isNil(text)) {
        if (isFill) {
          context.fillText(text, x, y);
        } else {
          context.strokeText(text, x, y);
        }
      }
    }
  }

  // 复写绘制和填充的逻辑：对于文本，应该先绘制边框，再进行填充
  strokeAndFill(context) {
    const { lineWidth, opacity, strokeOpacity, fillOpacity } = this.attrs;

    if (this.isStroke()) {
      if (lineWidth > 0) {
        if (!isNil(strokeOpacity) && strokeOpacity !== 1) {
          context.globalAlpha = opacity;
        }
        this.stroke(context);
      }
    }

    if (this.isFill()) {
      if (!isNil(fillOpacity) && fillOpacity !== 1) {
        context.globalAlpha = fillOpacity;
        this.fill(context);
        context.globalAlpha = opacity;
      } else {
        this.fill(context);
      }
    }

    this.afterDrawPath(context);
  }

  // 复写填充逻辑
  fill(context) {
    this._drawText(context, true);
  }

  // 复写绘制边框的逻辑
  stroke(context) {
    this._drawText(context, false);
  }
}

export default Text;
