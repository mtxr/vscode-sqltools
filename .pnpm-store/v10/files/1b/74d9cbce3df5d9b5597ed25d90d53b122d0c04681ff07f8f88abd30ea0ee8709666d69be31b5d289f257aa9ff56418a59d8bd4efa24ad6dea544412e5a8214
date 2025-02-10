import { IGroup, Point } from '@antv/g-base';
import { isNumber, isString } from '@antv/util';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { LineAnnotationCfg, RegionLocationCfg } from '../types';
import { renderTag, TagCfg } from '../util/graphic';
import Theme from '../util/theme';
import { getValueByPercent } from '../util/util';

class LineAnnotation extends GroupComponent<LineAnnotationCfg> implements ILocation<RegionLocationCfg> {
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
      type: 'line',
      locationType: 'region',
      start: null,
      end: null,
      style: {},
      text: null,
      defaultCfg: {
        style: {
          fill: Theme.textColor,
          fontSize: 12,
          textAlign: 'center',
          textBaseline: 'bottom',
          fontFamily: Theme.fontFamily,
        },
        text: {
          position: 'center',
          autoRotate: true,
          content: null,
          offsetX: 0,
          offsetY: 0,
          style: {
            stroke: Theme.lineColor,
            lineWidth: 1,
          },
        },
      },
    };
  }

  protected renderInner(group: IGroup) {
    this.renderLine(group);
    if (this.get('text')) {
      this.renderLabel(group);
    }
  }

  // 绘制线
  private renderLine(group: IGroup) {
    const start = this.get('start');
    const end = this.get('end');
    const style = this.get('style');
    this.addShape(group, {
      type: 'line',
      id: this.getElementId('line'),
      name: 'annotation-line',
      attrs: {
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        ...style,
      },
    });
  }

  // 获取 label 的位置
  private getLabelPoint(start: Point, end: Point, position: string) {
    let percent;
    if (position === 'start') {
      percent = 0;
    } else if (position === 'center') {
      percent = 0.5;
    } else if (isString(position) && position.indexOf('%') !== -1) {
      percent = parseInt(position, 10) / 100;
    } else if (isNumber(position)) {
      percent = position;
    } else {
      percent = 1;
    }

    if (percent > 1 || percent < 0) {
      percent = 1;
    }

    return {
      x: getValueByPercent(start.x, end.x, percent),
      y: getValueByPercent(start.y, end.y, percent),
    };
  }

  // 绘制 label
  private renderLabel(group: IGroup) {
    const text = this.get('text');
    const start = this.get('start');
    const end = this.get('end');
    const { position, content, style, offsetX, offsetY, autoRotate,
      maxLength, autoEllipsis, ellipsisPosition, background, isVertical = false } = text;
    const point = this.getLabelPoint(start, end, position);
    const x = point.x + offsetX;
    const y = point.y + offsetY;

    const cfg: TagCfg = {
      id: this.getElementId('line-text'),
      name: 'annotation-line-text',
      x,
      y,
      content,
      style,
      maxLength,
      autoEllipsis,
      ellipsisPosition,
      background,
      isVertical,
    };

    // 如果自动旋转
    if (autoRotate) {
      const vector = [end.x - start.x, end.y - start.y];
      cfg.rotate = Math.atan2(vector[1], vector[0]);
    }

    renderTag(group, cfg);
  }
}

export default LineAnnotation;
