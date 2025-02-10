import { IGroup } from '@antv/g-base';
import { each, isNil, isFunction, isObject } from '@antv/util';
import { vec2 } from '@antv/matrix-util';
import AxisBase from './base';
import * as OverlapUtil from './overlap';
import type { AxisLabelAutoHideCfg } from '../types';
import type { CircleAxisCfg, Point, } from '../types';

class Circle extends AxisBase<CircleAxisCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      type: 'circle',
      locationType: 'circle',
      center: null,
      radius: null,
      startAngle: -Math.PI / 2,
      endAngle: (Math.PI * 3) / 2,
    };
  }

  protected getLinePath(): any[] {
    const center = this.get('center');
    const x = center.x;
    const y = center.y;
    const rx = this.get('radius');
    const ry = rx;
    const startAngle = this.get('startAngle');
    const endAngle = this.get('endAngle');

    let path = [];
    if (Math.abs(endAngle - startAngle) === Math.PI * 2) {
      path = [['M', x, y - ry], ['A', rx, ry, 0, 1, 1, x, y + ry], ['A', rx, ry, 0, 1, 1, x, y - ry], ['Z']];
    } else {
      const startPoint = this.getCirclePoint(startAngle);
      const endPoint = this.getCirclePoint(endAngle);
      const large = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
      const sweep = startAngle > endAngle ? 0 : 1;
      path = [
        ['M', x, y],
        ['L', startPoint.x, startPoint.y],
        ['A', rx, ry, 0, large, sweep, endPoint.x, endPoint.y],
        ['L', x, y],
      ];
    }
    return path;
  }

  protected getTickPoint(tickValue): Point {
    const startAngle = this.get('startAngle');
    const endAngle = this.get('endAngle');
    const angle = startAngle + (endAngle - startAngle) * tickValue;
    return this.getCirclePoint(angle);
  }

  // 获取垂直于坐标轴的向量
  protected getSideVector(offset: number, point: Point) {
    const center = this.get('center');
    const vector: [number, number] = [point.x - center.x, point.y - center.y];
    const factor = this.get('verticalFactor');
    const vecLen = vec2.length(vector);
    vec2.scale(vector, vector, (factor * offset) / vecLen);
    return vector;
  }

  // 获取沿坐标轴方向的向量
  protected getAxisVector(point: Point): [number, number] {
    const center = this.get('center');
    const vector = [point.x - center.x, point.y - center.y];
    return [vector[1], -1 * vector[0]]; // 获取顺时针方向的向量
  }

  // 根据圆心和半径获取点
  private getCirclePoint(angle: number, radius?: number) {
    const center = this.get('center');
    radius = radius || this.get('radius');
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
    };
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

  protected processOverlap(labelGroup) {
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
        const { height: length } = labelGroup.getCanvasBBox();
        // 如果用户没有设置 offset，则自动计算
        titleCfg.offset = labelOffset + length + titleSpacing + titleHeight / 2;
      }
    }
  }

  private autoProcessOverlap(name: string, value: any, labelGroup: IGroup, limitLength: number) {
    let hasAdjusted = false;
    const util = OverlapUtil[name];
    if (limitLength > 0) {
      if (value === true) {
        // true 形式的配置：使用 overlap 默认的的处理方法进行处理
        hasAdjusted = util.getDefault()(false, labelGroup, limitLength);
      } else if (isFunction(value)) {
        // 回调函数形式的配置： 用户可以传入回调函数
        hasAdjusted = value(false, labelGroup, limitLength);
      } else if (isObject(value)) {
        // object 形式的配置方式：包括 处理方法 type， 和可选参数配置 cfg
        const overlapCfg = value as { type: string; cfg?: AxisLabelAutoHideCfg };
        if (util[overlapCfg.type]) {
          hasAdjusted = util[overlapCfg.type](false, labelGroup, limitLength, overlapCfg.cfg);
        }
      } else if (util[value]) {
        // 字符串类型的配置：按照名称执行 overlap 处理方法
        hasAdjusted = util[value](false, labelGroup, limitLength);
      }
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

export default Circle;
