import { IGroup } from '@antv/g-base';
import { each, isString, mix, isFunction } from '@antv/util';
import GroupComponent from '../abstract/group-component';
import { GridBaseCfg, GroupComponentCfg, Point } from '../types';
import Theme from '../util/theme';

abstract class GridBase<T extends GroupComponentCfg = GridBaseCfg> extends GroupComponent<T> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'grid',
      line: {},
      alternateColor: null,
      capture: false,
      items: [],
      closed: false,
      defaultCfg: {
        line: {
          type: 'line', // 对于 line 类型的 grid 有 line, smooth 两种，cirle 类型的 grid 有 line 和 circle
          style: {
            lineWidth: 1,
            stroke: Theme.lineColor,
          },
        },
      },
    };
  }

  /**
   * 获取栅格线的类型
   * @return {string} 栅格线类型
   */
  protected getLineType(): string {
    const line = this.get('line') || this.get('defaultCfg').line;
    return line.type;
  }

  protected renderInner(group: IGroup) {
    this.drawGrid(group);
  }

  /**
   * 获取栅格线的路径
   * @param  {Point[]} points   栅格线的点集合
   * @param  {boolean} reversed 顺序是否相反
   * @return {any[]}            路径
   */
  protected abstract getGridPath(points: Point[], reversed?: boolean): any[];

  protected getAlternatePath(prePoints: Point[], points: Point[]) {
    let regionPath = this.getGridPath(prePoints);
    const reversePoints = points.slice(0).reverse();
    const nextPath = this.getGridPath(reversePoints, true);
    const closed = this.get('closed');
    if (closed) {
      regionPath = regionPath.concat(nextPath);
    } else {
      nextPath[0][0] = 'L'; // 更新第一个节点
      regionPath = regionPath.concat(nextPath);
      regionPath.push(['Z']);
    }
    return regionPath;
  }
  // 获取路径的配置项
  private getPathStyle() {
    return this.get('line').style;
  }

  // 绘制栅格
  private drawGrid(group: IGroup) {
    const line = this.get('line');
    const items = this.get('items');
    const alternateColor = this.get('alternateColor');
    let preItem = null;
    each(items, (item, index) => {
      const id = item.id || index;
      // 绘制栅格线
      if (line) {
        let style = this.getPathStyle();
        style = isFunction(style) ? style(item, index, items) : style;

        const lineId = this.getElementId(`line-${id}`);
        const gridPath = this.getGridPath(item.points);
        this.addShape(group, {
          type: 'path',
          name: 'grid-line',
          id: lineId,
          attrs: mix(
            {
              path: gridPath,
            },
            style
          ),
        });
      }
      // 如果存在 alternateColor 则绘制矩形
      // 从第二个栅格线开始绘制
      if (alternateColor && index > 0) {
        const regionId = this.getElementId(`region-${id}`);
        const isEven = index % 2 === 0;
        if (isString(alternateColor)) {
          // 如果颜色是单值，则是仅绘制偶数时的区域
          if (isEven) {
            this.drawAlternateRegion(regionId, group, preItem.points, item.points, alternateColor);
          }
        } else {
          const color = isEven ? alternateColor[1] : alternateColor[0];
          this.drawAlternateRegion(regionId, group, preItem.points, item.points, color);
        }
      }
      preItem = item;
    });
  }

  // 绘制栅格线间的间隔
  private drawAlternateRegion(id: string, group: IGroup, prePoints: Point[], points: Point[], color: string) {
    const regionPath = this.getAlternatePath(prePoints, points);
    this.addShape(group, {
      type: 'path',
      id,
      name: 'grid-region',
      attrs: {
        path: regionPath,
        fill: color,
      },
    });
  }
}

export default GridBase;
