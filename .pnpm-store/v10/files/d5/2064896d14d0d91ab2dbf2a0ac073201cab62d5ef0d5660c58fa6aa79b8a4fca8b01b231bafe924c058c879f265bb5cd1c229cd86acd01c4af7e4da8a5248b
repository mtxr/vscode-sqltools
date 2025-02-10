import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { ArcAnnotationCfg, CircleLocationCfg } from '../types';
import { getCirclePoint } from '../util/util';

class ArcAnnotation extends GroupComponent<ArcAnnotationCfg> implements ILocation<CircleLocationCfg> {
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
      type: 'arc',
      locationType: 'circle',
      center: null,
      radius: 100,
      startAngle: -Math.PI / 2,
      endAngle: (Math.PI * 3) / 2,
      style: {
        stroke: '#999',
        lineWidth: 1,
      },
    };
  }

  protected renderInner(group: IGroup) {
    this.renderArc(group);
  }

  private getArcPath() {
    const { center, radius, startAngle, endAngle } = this.getLocation();
    const startPoint = getCirclePoint(center, radius, startAngle);
    const endPoint = getCirclePoint(center, radius, endAngle);
    const largeFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    const path = [['M', startPoint.x, startPoint.y]];
    if (endAngle - startAngle === Math.PI * 2) {
      // 整个圆是分割成两个圆
      const middlePoint = getCirclePoint(center, radius, startAngle + Math.PI);
      path.push(['A', radius, radius, 0, largeFlag, 1, middlePoint.x, middlePoint.y]);
      path.push(['A', radius, radius, 0, largeFlag, 1, endPoint.x, endPoint.y]);
    } else {
      path.push(['A', radius, radius, 0, largeFlag, 1, endPoint.x, endPoint.y]);
    }
    return path;
  }

  // 绘制 arc
  private renderArc(group: IGroup) {
    // 也可以 通过 get('center') 类似的方式逐个获取
    const path = this.getArcPath();
    const style = this.get('style');
    this.addShape(group, {
      type: 'path',
      id: this.getElementId('arc'),
      name: 'annotation-arc',
      attrs: {
        path,
        ...style,
      },
    });
  }
}

export default ArcAnnotation;
