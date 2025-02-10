import { each } from '@antv/util';
import { CircleGridCfg, Point } from '../types';
import GridBase from './base';

function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

class Circle extends GridBase<CircleGridCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      type: 'circle',
      /**
       * 中心点
       * @type {object}
       */
      center: null,
      /**
       * 栅格线是否封闭
       * @type {true}
       */
      closed: true,
    };
  }

  protected getGridPath(points: Point[], reversed: boolean) {
    const lineType = this.getLineType();
    const closed = this.get('closed');
    const path = [];
    if (points.length) {
      // 防止出错
      if (lineType === 'circle') {
        const center = this.get('center');
        const firstPoint = points[0];
        const radius = distance(center.x, center.y, firstPoint.x, firstPoint.y);
        const sweepFlag = reversed ? 0 : 1; // 顺时针还是逆时针
        if (closed) {
          // 封闭时，绘制整个圆
          path.push(['M', center.x, center.y - radius]);
          path.push(['A', radius, radius, 0, 0, sweepFlag, center.x, center.y + radius]);
          path.push(['A', radius, radius, 0, 0, sweepFlag, center.x, center.y - radius]);
          path.push(['Z']);
        } else {
          each(points, (point, index) => {
            if (index === 0) {
              path.push(['M', point.x, point.y]);
            } else {
              path.push(['A', radius, radius, 0, 0, sweepFlag, point.x, point.y]);
            }
          });
        }
      } else {
        each(points, (point, index) => {
          if (index === 0) {
            path.push(['M', point.x, point.y]);
          } else {
            path.push(['L', point.x, point.y]);
          }
        });
        if (closed) {
          path.push(['Z']);
        }
      }
    }
    return path;
  }
}

export default Circle;
