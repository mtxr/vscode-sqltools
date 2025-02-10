import { IGroup } from '@antv/g-base';
import { vec2 } from '@antv/matrix-util';
import { each, isFunction, isNil, isNumberEqual, isObject } from '@antv/util';
import { ILocation } from '../interfaces';
import { AxisLabelAutoHideCfg, BBox, LineAxisCfg, Point, RegionLocationCfg } from '../types';
import Theme from '../util/theme';
import AxisBase from './base';
import * as OverlapUtil from './overlap';

class Line extends AxisBase<LineAxisCfg> implements ILocation<RegionLocationCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      type: 'line',
      locationType: 'region',
      /**
       * 起始点, x, y
       * @type {object}
       */
      start: null,
      /**
       * 结束点, x, y
       * @type {object}
       */
      end: null,
    };
  }

  // 获取坐标轴线的 path
  public getLinePath(): any[] {
    const start = this.get('start');
    const end = this.get('end');
    const path = [];
    path.push(['M', start.x, start.y]);
    path.push(['L', end.x, end.y]);
    return path;
  }

  // 重新计算 layout bbox，考虑到 line 不显示
  protected getInnerLayoutBBox(): BBox {
    const start = this.get('start');
    const end = this.get('end');
    const bbox = super.getInnerLayoutBBox();
    const minX = Math.min(start.x, end.x, bbox.x);
    const minY = Math.min(start.y, end.y, bbox.y);
    const maxX = Math.max(start.x, end.x, bbox.maxX);
    const maxY = Math.max(start.y, end.y, bbox.maxY);
    return {
      x: minX,
      y: minY,
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  protected isVertical() {
    const start = this.get('start');
    const end = this.get('end');
    return isNumberEqual(start.x, end.x);
  }

  protected isHorizontal() {
    const start = this.get('start');
    const end = this.get('end');
    return isNumberEqual(start.y, end.y);
  }

  protected getTickPoint(tickValue: number): Point {
    const self = this;
    const start = self.get('start');
    const end = self.get('end');
    const regionX = end.x - start.x;
    const regionY = end.y - start.y;
    return {
      x: start.x + regionX * tickValue,
      y: start.y + regionY * tickValue,
    };
  }

  // 直线坐标轴下任一点的向量方向都相同
  protected getSideVector(offset: number) {
    const axisVector = this.getAxisVector();
    const normal = vec2.normalize([0, 0], axisVector);
    const factor = this.get('verticalFactor');
    const verticalVector: [number, number] = [normal[1], normal[0] * -1]; // 垂直方向，逆时针方向
    return vec2.scale([0, 0], verticalVector, offset * factor);
  }

  // 获取坐标轴的向量
  protected getAxisVector(): [number, number] {
    const start = this.get('start');
    const end = this.get('end');
    return [end.x - start.x, end.y - start.y];
  }

  protected processOverlap(labelGroup) {
    const isVertical = this.isVertical();
    const isHorizontal = this.isHorizontal();
    // 非垂直，或者非水平时不处理遮挡问题
    if (!isVertical && !isHorizontal) {
      return;
    }
    const labelCfg = this.get('label');
    const titleCfg = this.get('title');
    const verticalLimitLength = this.get('verticalLimitLength');
    const labelOffset = labelCfg.offset;
    let limitLength = verticalLimitLength;
    let titleHeight = 0;
    let titleSpacing = 0;
    if (titleCfg) {
      titleHeight = titleCfg.style.fontSize;
      titleSpacing = titleCfg.spacing;
    }
    if (limitLength) {
      limitLength = limitLength - labelOffset - titleSpacing - titleHeight;
    }
    const overlapOrder = this.get('overlapOrder');
    each(overlapOrder, (name) => {
      if (labelCfg[name] && this.canProcessOverlap(name)) {
        this.autoProcessOverlap(name, labelCfg[name], labelGroup, limitLength);
      }
    });
    if (titleCfg) {
      if (isNil(titleCfg.offset)) {
        // 调整 title 的 offset
        const bbox = labelGroup.getCanvasBBox();
        const length = isVertical ? bbox.width : bbox.height;
        // 如果用户没有设置 offset，则自动计算
        titleCfg.offset = labelOffset + length + titleSpacing + titleHeight / 2;
      }
    }
  }

  /**
   * 是否可以执行某一 overlap
   * @param name
   */
  private canProcessOverlap(name: string) {
    const labelCfg = this.get('label');

    // 对 autoRotate，如果配置了旋转角度，直接进行固定角度旋转
    if (name === 'autoRotate') {
      return isNil(labelCfg.rotate);
    }

    // 默认所有 overlap 都可执行
    return true;
  }

  private autoProcessOverlap(name: string, value: any, labelGroup: IGroup, limitLength: number) {
    const isVertical = this.isVertical();
    let hasAdjusted = false;
    const util = OverlapUtil[name];
    if (value === true) {
      const labelCfg = this.get('label');
      // true 形式的配置：使用 overlap 默认的的处理方法进行处理
      hasAdjusted = util.getDefault()(isVertical, labelGroup, limitLength);
    } else if (isFunction(value)) {
      // 回调函数形式的配置： 用户可以传入回调函数
      hasAdjusted = value(isVertical, labelGroup, limitLength);
    } else if (isObject(value)) {
      // object 形式的配置方式：包括 处理方法 type， 和可选参数配置 cfg
      const overlapCfg = value as { type: string; cfg?: AxisLabelAutoHideCfg };
      if (util[overlapCfg.type]) {
        hasAdjusted = util[overlapCfg.type](isVertical, labelGroup, limitLength, overlapCfg.cfg);
      }
    } else if (util[value]) {
      // 字符串类型的配置：按照名称执行 overlap 处理方法
      hasAdjusted = util[value](isVertical, labelGroup, limitLength);
    }
    if (name === 'autoRotate') {
      // 文本旋转后，文本的对齐方式可能就不合适了
      if (hasAdjusted) {
        const labels = labelGroup.getChildren();
        const verticalFactor = this.get('verticalFactor');
        each(labels, (label) => {
          const textAlign = label.attr('textAlign');
          if (textAlign === 'center') {
            // 居中的文本需要调整旋转度
            const newAlign = verticalFactor > 0 ? 'end' : 'start';
            label.attr('textAlign', newAlign);
          }
        });
      }
    } else if (name === 'autoHide') {
      const children = labelGroup.getChildren().slice(0); // 复制数组，删除时不会出错
      each(children, (label) => {
        if (!label.get('visible')) {
          if (this.get('isRegister')) {
            // 已经注册过了，则删除
            this.unregisterElement(label);
          }
          label.remove(); // 防止 label 数量太多，所以统一删除
        }
      });
    }
  }
}

export default Line;
