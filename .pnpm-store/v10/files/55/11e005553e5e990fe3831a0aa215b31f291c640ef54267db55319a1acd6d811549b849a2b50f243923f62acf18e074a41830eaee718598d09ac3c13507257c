import { IGroup } from '@antv/g-base';

import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { PointLocationCfg, TextAnnotationCfg } from '../types';
import { renderTag } from '../util/graphic';
import { applyRotate, applyTranslate } from '../util/matrix';
import Theme from '../util/theme';

class TextAnnotation extends GroupComponent<TextAnnotationCfg> implements ILocation<PointLocationCfg> {
  /**
   * @protected
   * 默认的配置项
   * @returns {object} 默认的配置项
   */
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'annotation',
      type: 'text',
      locationType: 'point',
      x: 0,
      y: 0,
      content: '',
      rotate: null,
      style: {},
      background: null,
      maxLength: null,
      autoEllipsis: true,
      isVertical: false,
      ellipsisPosition: 'tail',
      defaultCfg: {
        style: {
          fill: Theme.textColor,
          fontSize: 12,
          textAlign: 'center',
          textBaseline: 'middle',
          fontFamily: Theme.fontFamily,
        },
      },
    };
  }

  // 复写 setLocation 方法，不需要重新创建 text
  public setLocation(location: PointLocationCfg) {
    this.set('x', location.x);
    this.set('y', location.y);
    this.resetLocation();
  }

  protected renderInner(group: IGroup) {
    const { x, y } = this.getLocation();
    const content = this.get('content');
    const style = this.get('style');
    const id = this.getElementId('text');
    const name = `${this.get('name')}-text`;
    const maxLength = this.get('maxLength');
    const autoEllipsis = this.get('autoEllipsis');
    const isVertical = this.get('isVertical');
    const ellipsisPosition = this.get('ellipsisPosition');
    const background = this.get('background');
    const rotate = this.get('rotate');

    const cfg = {
      id,
      name,
      x,
      y,
      content,
      style,
      maxLength,
      autoEllipsis,
      isVertical,
      ellipsisPosition,
      background,
      rotate,
    };

    renderTag(group, cfg);
  }

  private resetLocation() {
    const textGroup = this.getElementByLocalId('text-group');
    if (textGroup) {
      const {x, y} = this.getLocation();
      const rotate = this.get('rotate')
      applyTranslate(textGroup, x, y);
      applyRotate(textGroup, rotate, x, y);
    }
  }
}

export default TextAnnotation;
