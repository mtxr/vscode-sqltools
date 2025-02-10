import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { GroupComponentCfg } from '../types';
import { AREA_STYLE, BACKGROUND_STYLE, LINE_STYLE } from './constant';
import { dataToPath, linePathToAreaPath } from './path';

export interface TrendCfg extends GroupComponentCfg {
  // 位置大小
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  // 数据
  readonly data?: number[];
  // 样式
  readonly smooth?: boolean;
  readonly isArea?: boolean;
  readonly backgroundStyle?: object;
  readonly lineStyle?: object;
  readonly areaStyle?: object;
}

export class Trend extends GroupComponent<TrendCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'trend',
      x: 0,
      y: 0,
      width: 200,
      height: 16,
      smooth: true,
      isArea: false,
      data: [],
      backgroundStyle: BACKGROUND_STYLE,
      lineStyle: LINE_STYLE,
      areaStyle: AREA_STYLE,
    };
  }

  protected renderInner(group: IGroup) {
    const { width, height, data, smooth, isArea, backgroundStyle, lineStyle, areaStyle } = this.cfg as TrendCfg;

    // 背景
    this.addShape(group, {
      id: this.getElementId('background'),
      type: 'rect',
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        ...backgroundStyle,
      },
    });

    const path = dataToPath(data, width, height, smooth);
    // 线
    this.addShape(group, {
      id: this.getElementId('line'),
      type: 'path',
      attrs: {
        path,
        ...lineStyle,
      },
    });

    // area
    // 在 path 的基础上，增加两个坐标点
    if (isArea) {
      const areaPath = linePathToAreaPath(path, width, height, data);
      this.addShape(group, {
        id: this.getElementId('area'),
        type: 'path',
        attrs: {
          path: areaPath,
          ...areaStyle,
        },
      });
    }
  }

  protected applyOffset() {
    const { x, y } = this.cfg as TrendCfg;

    // 统一移动到对应的位置
    this.moveElementTo(this.get('group'), {
      x,
      y,
    });
  }
}

export default Trend;
