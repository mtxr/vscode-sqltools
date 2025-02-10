import { IGroup } from '@antv/g-base';
import { isNil } from '@antv/util';
import GroupComponent from '../abstract/group-component';
import { CrosshairBaseCfg, Point } from '../types';
import { getMatrixByAngle } from '../util/matrix';
import Theme from '../util/theme';
import { formatPadding } from '../util/util';

abstract class CrosshairBase<T extends CrosshairBaseCfg = CrosshairBaseCfg> extends GroupComponent {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'crosshair',
      type: 'base',
      line: {},
      text: null,
      textBackground: {},
      capture: false, // 不能被拾取
      defaultCfg: {
        line: {
          style: {
            lineWidth: 1,
            stroke: Theme.lineColor,
          },
        },
        text: {
          position: 'start',
          offset: 10,
          autoRotate: false,
          content: null,
          style: {
            fill: Theme.textColor,
            textAlign: 'center',
            textBaseline: 'middle',
            fontFamily: Theme.fontFamily,
          },
        },
        textBackground: {
          padding: 5,
          style: {
            stroke: Theme.lineColor,
          },
        },
      },
    };
  }

  protected renderInner(group: IGroup) {
    if (this.get('line')) {
      this.renderLine(group);
    }
    if (this.get('text')) {
      this.renderText(group);
      this.renderBackground(group);
    }
  }

  /**
   * @protected
   * 获取文本点的位置
   * @return {Point} 文本的位置
   */
  protected abstract getTextPoint(): Point;

  protected abstract getRotateAngle(): number;

  protected renderText(group: IGroup) {
    const text = this.get('text');
    const { style, autoRotate, content } = text;
    if (!isNil(content)) {
      const textPoint = this.getTextPoint();
      let matrix = null;
      if (autoRotate) {
        const angle = this.getRotateAngle();
        matrix = getMatrixByAngle(textPoint, angle);
      }
      this.addShape(group, {
        type: 'text',
        name: 'crosshair-text',
        id: this.getElementId('text'),
        attrs: {
          ...textPoint,
          text: content,
          matrix,
          ...style,
        },
      });
    }
  }

  protected abstract getLinePath(): any[];

  protected renderLine(group: IGroup) {
    const path = this.getLinePath();
    const line = this.get('line');
    const style = line.style;
    this.addShape(group, {
      type: 'path',
      name: 'crosshair-line',
      id: this.getElementId('line'),
      attrs: {
        path,
        ...style,
      },
    });
  }

  // 绘制文本的背景
  private renderBackground(group: IGroup) {
    const textId = this.getElementId('text');
    const textShape = group.findById(textId); // 查找文本
    const textBackground = this.get('textBackground');

    if (textBackground && textShape) {
      const textBBox = textShape.getBBox();
      const padding = formatPadding(textBackground.padding); // 用户传入的 padding 格式不定
      const style = textBackground.style;
      const backgroundShape = this.addShape(group, {
        type: 'rect',
        name: 'crosshair-text-background',
        id: this.getElementId('text-background'),
        attrs: {
          x: textBBox.x - padding[3],
          y: textBBox.y - padding[0],
          width: textBBox.width + padding[1] + padding[3],
          height: textBBox.height + padding[0] + padding[2],
          matrix: textShape.attr('matrix'),
          ...style,
        },
      });
      backgroundShape.toBack();
    }
  }
}

export default CrosshairBase;
